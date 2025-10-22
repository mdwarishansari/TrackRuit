from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

from models.match_model import MatchModel
from utils.security import verify_api_key
from config import get_settings

router = APIRouter()
settings = get_settings()

# Initialize model
match_model = MatchModel()

class MatchRequest(BaseModel):
    resume_text: str = Field(..., min_length=10, max_length=10000)
    job_description: str = Field(..., min_length=10, max_length=10000)
    use_cache: bool = True

class BatchMatchRequest(BaseModel):
    resume_text: str = Field(..., min_length=10, max_length=10000)
    job_descriptions: List[str] = Field(..., min_items=1, max_items=50)

class MatchResponse(BaseModel):
    match_score: float
    top_skills_matched: List[str]
    missing_skills: List[str]
    model_version: str
    similarity_breakdown: Optional[Dict[str, Any]] = None
    explanations: Optional[List[str]] = None
    error: Optional[str] = None

class BatchMatchResponse(BaseModel):
    results: List[MatchResponse]
    ranked_indices: List[int]

@router.post("/match", response_model=MatchResponse)
async def match_resume_job(
    request: MatchRequest,
    api_key: str = Depends(verify_api_key)
):
    """
    Match a resume against a job description
    """
    try:
        # Prepare data for model
        data = {
            'resume_text': request.resume_text,
            'job_description': request.job_description
        }
        
        # Get prediction
        prediction = match_model.predict(data)
        
        # Generate explanations
        explanations = match_model.explain(prediction)
        prediction['explanations'] = explanations
        
        return MatchResponse(**prediction)
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing match request: {str(e)}"
        )

@router.post("/match/batch", response_model=BatchMatchResponse)
async def batch_match_resume_jobs(
    request: BatchMatchRequest,
    api_key: str = Depends(verify_api_key)
):
    """
    Match a resume against multiple job descriptions and rank them
    """
    try:
        results = []
        
        for i, job_desc in enumerate(request.job_descriptions):
            data = {
                'resume_text': request.resume_text,
                'job_description': job_desc
            }
            
            prediction = match_model.predict(data)
            explanations = match_model.explain(prediction)
            prediction['explanations'] = explanations
            
            results.append(MatchResponse(**prediction))
        
        # Rank jobs by match score
        indexed_scores = [(i, result.match_score) for i, result in enumerate(results)]
        indexed_scores.sort(key=lambda x: x[1], reverse=True)
        ranked_indices = [i for i, _ in indexed_scores]
        
        return BatchMatchResponse(
            results=results,
            ranked_indices=ranked_indices
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing batch match request: {str(e)}"
        )

@router.get("/match/models")
async def get_match_models(api_key: str = Depends(verify_api_key)):
    """Get information about available match models"""
    metadata = match_model.get_metadata()
    
    return {
        "current_model": match_model.get_version(),
        "metadata": metadata,
        "features": {
            "embedding_model": settings.embedding_model,
            "similarity_threshold": settings.similarity_threshold,
            "cache_enabled": settings.enable_cache
        }
    }