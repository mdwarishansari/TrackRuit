from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional

from models.interview_model import InterviewModel
from utils.security import verify_api_key
from config import get_settings

router = APIRouter()
settings = get_settings()

# Initialize model
interview_model = InterviewModel()

class InterviewRequest(BaseModel):
    applied_jobs: int = Field(..., ge=0, le=1000)
    interviews_given: int = Field(..., ge=0, le=100)
    skills_strength: float = Field(..., ge=0.0, le=1.0)
    prep_hours: int = Field(..., ge=0, le=500)
    match_score_avg: float = Field(..., ge=0.0, le=1.0)
    resume_score: float = Field(..., ge=0.0, le=1.0)
    years_experience: int = Field(..., ge=0, le=50)

class InterviewResponse(BaseModel):
    probability: float
    top_negative_factors: List[str]
    top_positive_factors: List[str]
    model_version: str
    features_used: List[str]
    explanations: Optional[List[str]] = None
    error: Optional[str] = None

@router.post("/interview", response_model=InterviewResponse)
async def predict_interview_success(
    request: InterviewRequest,
    api_key: str = Depends(verify_api_key)
):
    """
    Predict interview success probability
    """
    try:
        # Prepare data for model
        data = request.dict()
        
        # Get prediction
        prediction = interview_model.predict(data)
        
        # Generate explanations
        explanations = interview_model.explain(prediction)
        prediction['explanations'] = explanations
        
        return InterviewResponse(**prediction)
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error predicting interview success: {str(e)}"
        )

@router.get("/interview/models")
async def get_interview_models(api_key: str = Depends(verify_api_key)):
    """Get information about available interview models"""
    metadata = interview_model.get_metadata()
    
    return {
        "current_model": interview_model.get_version(),
        "metadata": metadata,
        "features": {
            "model_type": "Rule-based (Phase 1)",
            "cache_enabled": False
        }
    }