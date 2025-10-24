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
    prep_hours: int = Field(..., ge=0, le=1000)
    match_score_avg: float = Field(..., ge=0.0, le=1.0)
    resume_score: float = Field(..., ge=0.0, le=1.0)
    years_experience: int = Field(..., ge=0, le=50)

class InterviewResponse(BaseModel):
    probability: float
    confidence: str
    positive_factors: List[str]
    negative_factors: List[str]
    model_version: str
    explanations: Optional[List[str]] = None
    error: Optional[str] = None

@router.post("/interview", response_model=InterviewResponse)
async def predict_interview_success(
    request: InterviewRequest,
    api_key: str = Depends(verify_api_key)
):
    """
    Predict interview success probability based on candidate metrics
    """
    try:
        # Prepare data for model
        data = {
            'applied_jobs': request.applied_jobs,
            'interviews_given': request.interviews_given,
            'skills_strength': request.skills_strength,
            'prep_hours': request.prep_hours,
            'match_score_avg': request.match_score_avg,
            'resume_score': request.resume_score,
            'years_experience': request.years_experience
        }
        
        # Get prediction
        prediction = interview_model.predict(data)
        
        # Ensure model_version is set
        if prediction.get('model_version') is None:
            prediction['model_version'] = interview_model.get_version()
        
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
    return {
        "current_model": interview_model.get_version(),
        "model_type": interview_model.get_type(),
        "features": {
            "factors_considered": ["experience", "preparation", "skills", "resume_quality"],
            "cache_enabled": False
        }
    }