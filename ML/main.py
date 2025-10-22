from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

from config import Settings, get_settings
from routes import (
    match, 
    recommend, 
    interview, 
    feedback, 
    ats, 
    health
)

# Load environment variables
load_dotenv()

def create_app() -> FastAPI:
    """Create and configure FastAPI application"""
    settings = get_settings()
    
    app = FastAPI(
        title="TrackRuit ML Service",
        description="Machine Learning microservice for TrackRuit",
        version="1.0.0",
        docs_url="/ml/docs",
        redoc_url="/ml/redoc"
    )

    # Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(health.router, prefix="/ml", tags=["Health"])
    app.include_router(match.router, prefix="/ml", tags=["Matching"])
    app.include_router(recommend.router, prefix="/ml", tags=["Recommendation"])
    app.include_router(interview.router, prefix="/ml", tags=["Interview"])
    app.include_router(feedback.router, prefix="/ml", tags=["Feedback"])
    app.include_router(ats.router, prefix="/ml", tags=["ATS"])

    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn
    settings = get_settings()
    uvicorn.run(
        app,
        host=settings.host,
        port=settings.port,
        reload=False,  # Disable reload to avoid multiprocessing issues
        workers=1      # Use only 1 worker
    )