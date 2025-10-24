from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

from models.feedback_model import FeedbackModel
from utils.security import verify_api_key
from config import get_settings

router = APIRouter()
settings = get_settings()

# Initialize model
feedback_model = FeedbackModel()

class FeedbackRequest(BaseModel):
    resume_text: str = Field(..., min_length=10, max_length=10000)
    target_role: str = Field("software engineer", min_length=2, max_length=100)

class FeedbackResponse(BaseModel):
    overall_score: float
    structure_score: float
    keyword_score: float
    skill_score: float
    metrics: Dict[str, Any]
    skills_found: List[str]
    sections_found: List[str]
    feedback: List[str]
    model_version: str
    explanations: Optional[List[str]] = None
    error: Optional[str] = None

@router.post("/resume/feedback", response_model=FeedbackResponse)
async def get_resume_feedback(
    request: FeedbackRequest,
    api_key: str = Depends(verify_api_key)
):
    """
    Get detailed feedback on resume quality and improvements
    """
    try:
        # Prepare data for model
        data = {
            'resume_text': request.resume_text,
            'target_role': request.target_role
        }
        
        # Get feedback
        prediction = feedback_model.predict(data)
        
        # Ensure model_version is set
        if prediction.get('model_version') is None:
            prediction['model_version'] = feedback_model.get_version()
        
        # Generate explanations
        explanations = feedback_model.explain(prediction)
        prediction['explanations'] = explanations
        
        return FeedbackResponse(**prediction)
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error generating resume feedback: {str(e)}"
        )

@router.get("/feedback/models")
async def get_feedback_models(api_key: str = Depends(verify_api_key)):
    """Get information about available feedback models"""
    return {
        "current_model": feedback_model.get_version(),
        "model_type": feedback_model.get_type(),
        "features": {
            "analysis_types": ["keywords", "structure", "skills", "sections"],
            "cache_enabled": False
        }
    }