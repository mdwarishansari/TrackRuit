from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

from models.ats_model import ATSModel
from utils.security import verify_api_key
from config import get_settings

router = APIRouter()
settings = get_settings()

# Initialize model
ats_model = ATSModel()

class ATSRequest(BaseModel):
    resume_text: str = Field(..., min_length=10, max_length=10000)

class ATSResponse(BaseModel):
    ats_score: float
    issues: List[str]
    recommendations: List[str]
    model_version: str
    explanations: Optional[List[str]] = None
    error: Optional[str] = None

@router.post("/ats", response_model=ATSResponse)
async def analyze_ats_compatibility(
    request: ATSRequest,
    api_key: str = Depends(verify_api_key)
):
    """
    Analyze resume for ATS (Applicant Tracking System) compatibility
    """
    try:
        # Prepare data for model
        data = {
            'resume_text': request.resume_text
        }
        
        # Get ATS analysis
        prediction = ats_model.predict(data)
        
        # Ensure model_version is set
        if prediction.get('model_version') is None:
            prediction['model_version'] = ats_model.get_version()
        
        # Generate explanations
        explanations = ats_model.explain(prediction)
        prediction['explanations'] = explanations
        
        return ATSResponse(**prediction)
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error analyzing ATS compatibility: {str(e)}"
        )

@router.get("/ats/models")
async def get_ats_models(api_key: str = Depends(verify_api_key)):
    """Get information about available ATS models"""
    return {
        "current_model": ats_model.get_version(),
        "model_type": ats_model.get_type(),
        "features": {
            "checks_performed": ["sections", "length", "contact_info", "achievements"],
            "cache_enabled": False
        }
    }