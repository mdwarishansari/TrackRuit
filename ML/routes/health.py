from fastapi import APIRouter
import time
from datetime import datetime
import os
from typing import Dict, Any

from config import get_settings

router = APIRouter()
settings = get_settings()

@router.get("/status")
async def health_check():
    """Health check endpoint for ML service"""
    try:
        health_info = {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "version": "1.0.0",
            "models": {
                "match": "loaded",
                "recommend": "loaded", 
                "interview": "loaded",
                "feedback": "loaded",
                "ats": "loaded"
            },
            "settings": {
                "debug": settings.debug,
                "cache_enabled": settings.enable_cache,
                "sbert_enabled": settings.enable_sbert
            }
        }
        
        return health_info
        
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

@router.get("/version")
async def version_info():
    """Get version information"""
    return {
        "service": "TrackRuit ML Service",
        "version": "1.0.0",
        "ml_api_version": "v1",
        "supported_models": [
            "resume-job-match",
            "job-recommendation", 
            "interview-prediction",
            "resume-feedback",
            "ats-compatibility"
        ]
    }

@router.get("/models")
async def list_models():
    """List all available models and their status"""
    from models.match_model import MatchModel
    from models.recommend_model import RecommendModel
    from models.interview_model import InterviewModel
    from models.feedback_model import FeedbackModel
    from models.ats_model import ATSModel
    
    models = {
        "match": MatchModel(),
        "recommend": RecommendModel(),
        "interview": InterviewModel(), 
        "feedback": FeedbackModel(),
        "ats": ATSModel()
    }
    
    model_info = {}
    for name, model in models.items():
        model_info[name] = {
            "version": model.get_version(),
            "loaded": model.is_loaded,
            "metadata": model.get_metadata()
        }
    
    return model_info