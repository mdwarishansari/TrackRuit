from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel, Field
from typing import List, Optional

from models.match_model import MatchModel
from utils.security import verify_api_key, rate_limiter
from utils.validators import validator
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
    api_key: str = Depends(verify_api_key),
    fastapi_request: Request = None
):
    """
    Calculate resume-job matching score with rate limiting
    """
    try:
        # Rate limiting
        rate_limiter.check_rate_limit(
            fastapi_request, 
            limit=settings.rate_limit_per_minute, 
            window=60
        )
        
        # Validate input
        input_data = validator.validate_api_input(request.dict(), "match")
        
        # Get match score
        prediction = match_model.predict(input_data)
        
        # Ensure model_version is set
        if prediction.get('model_version') is None:
            prediction['model_version'] = match_model.get_version()
        
        # Generate explanations
        explanations = match_model.explain(prediction)
        prediction['explanations'] = explanations
        
        return MatchResponse(**prediction)
        
    except HTTPException:
        # Re-raise HTTP exceptions (like rate limiting)
        raise
    except Exception as e:
        # Log the error but don't expose internal details
        import logging
        logger = logging.getLogger("match_route")
        logger.error(f"Match prediction error: {str(e)}")
        
        raise HTTPException(
            status_code=500, 
            detail="Resume matching service temporarily unavailable. Please try again later."
        )

@router.get("/match/models")
async def get_match_models(
    api_key: str = Depends(verify_api_key),
    fastapi_request: Request = None
):
    """Get information about available match models with rate limiting"""
    # Rate limiting for model info endpoint too
    rate_limiter.check_rate_limit(fastapi_request, limit=30, window=60)
    
    return {
        "current_model": match_model.get_version(),
        "model_type": match_model.get_type(),
        "features": {
            "matching_strategy": ["semantic", "skill_based"],
            "cache_enabled": False
        }
    }