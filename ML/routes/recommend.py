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

class RecommendRequest(BaseModel):
    resume_text: str = Field(..., min_length=10, max_length=10000)
    job_pool: List[Dict[str, Any]] = Field(..., min_items=1, max_items=1000)
    user_history: Optional[List[Dict[str, Any]]] = None
    max_recommendations: int = Field(10, ge=1, le=50)

class RecommendResponse(BaseModel):
    recommended_jobs: List[Dict[str, Any]]
    model_version: str
    total_jobs_considered: int
    explanations: Optional[List[str]] = None
    error: Optional[str] = None

@router.post("/recommend", response_model=RecommendResponse)
async def get_recommendations(
    request: RecommendRequest,
    api_key: str = Depends(verify_api_key)
):
    """
    Get job recommendations based on resume and job pool
    """
    try:
        # Prepare data for model
        data = {
            'resume_text': request.resume_text,
            'job_pool': request.job_pool,
            'user_history': request.user_history or []
        }
        
        # Get recommendations
        prediction = recommend_model.predict(data)
        
        # Limit to max_recommendations
        prediction['recommended_jobs'] = prediction['recommended_jobs'][:request.max_recommendations]
        
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
    metadata = recommend_model.get_metadata()
    
    return {
        "current_model": recommend_model.get_version(),
        "metadata": metadata,
        "features": {
            "embedding_model": settings.embedding_model,
            "cache_enabled": settings.enable_cache
        }
    }