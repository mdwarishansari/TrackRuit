from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional

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
    use_cache: bool = Field(True)

class MatchResponse(BaseModel):
    match_score: float
    similarity_score: float
    skill_match: float
    top_skills_matched: List[str]
    missing_skills: List[str]
    model_version: str
    explanations: Optional[List[str]] = None
    error: Optional[str] = None

@router.post("/match", response_model=MatchResponse)
async def calculate_match_score(
    request: MatchRequest,
    api_key: str = Depends(verify_api_key)
):
    """
    Calculate resume-job matching score
    """
    try:
        # Prepare data for model
        data = {
            'resume_text': request.resume_text,
            'job_description': request.job_description,
            'use_cache': request.use_cache
        }
        
        # Get match score
        prediction = match_model.predict(data)
        
        # Ensure model_version is set
        if prediction.get('model_version') is None:
            prediction['model_version'] = match_model.get_version()
        
        # Generate explanations
        explanations = match_model.explain(prediction)
        prediction['explanations'] = explanations
        
        return MatchResponse(**prediction)
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing match request: {str(e)}"
        )

@router.get("/match/models")
async def get_match_models(api_key: str = Depends(verify_api_key)):
    """Get information about available match models"""
    return {
        "current_model": match_model.get_version(),
        "model_type": match_model.get_type(),
        "features": {
            "matching_strategy": ["semantic", "skill_based"],
            "cache_enabled": False
        }
    }