from .health import router as health_router
from .match import router as match_router
from .recommend import router as recommend_router
from .interview import router as interview_router
from .feedback import router as feedback_router
from .ats import router as ats_router

__all__ = [
    "health_router",
    "match_router",
    "recommend_router", 
    "interview_router",
    "feedback_router",
    "ats_router"
]