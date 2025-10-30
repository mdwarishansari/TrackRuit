from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

from models.recommend_model import RecommendModel
from utils.security import verify_api_key
from config import get_settings

router = APIRouter()
settings = get_settings()

# Initialize model
recommend_model = RecommendModel()

class JobItem(BaseModel):
    id: str
    title: str
    company: str
    description: str

class RecommendRequest(BaseModel):
    resume_text: str = Field(..., min_length=10, max_length=10000)
    job_pool: List[JobItem] = Field(..., min_items=1)
    max_recommendations: int = Field(5, ge=1, le=20)

class RecommendResponse(BaseModel):
    recommended_jobs: List[Dict[str, Any]]
    total_jobs_considered: int
    resume_skills_found: List[str]
    model_version: str
    explanations: Optional[List[str]] = None
    error: Optional[str] = None

@router.post("/recommend", response_model=RecommendResponse)
async def get_job_recommendations(
    request: RecommendRequest,
    api_key: str = Depends(verify_api_key)
):
    """
    Get personalized job recommendations based on resume
    """
    try:
        # Prepare data for model
        data = {
            'resume_text': request.resume_text,
            'job_pool': [job.dict() for job in request.job_pool],
            'max_recommendations': request.max_recommendations
        }
        
        # Get recommendations
        prediction = recommend_model.predict(data)
        
        # Ensure model_version is set
        if prediction.get('model_version') is None:
            prediction['model_version'] = recommend_model.get_version()
        
        # Generate explanations
        explanations = recommend_model.explain(prediction)
        prediction['explanations'] = explanations
        
        return RecommendResponse(**prediction)
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error generating recommendations: {str(e)}"
        )

@router.get("/recommend/models")
async def get_recommend_models(api_key: str = Depends(verify_api_key)):
    """Get information about available recommendation models"""
    return {
        "current_model": recommend_model.get_version(),
        "model_type": recommend_model.get_type(),
        "features": {
            "matching_strategy": ["skill_based", "content_based"],
            "cache_enabled": False
        }
    }