import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables first
load_dotenv()

from config import Settings, get_settings
from routes import (
    match, 
    recommend, 
    interview, 
    feedback, 
    ats, 
    health
)

def create_app() -> FastAPI:
    """Create and configure FastAPI application"""
    settings = get_settings()
    
    app = FastAPI(
        title="TrackRuit ML Service",
        description="Machine Learning microservice for TrackRuit",
        version="1.0.0",
        docs_url="/ml/docs",
        redoc_url="/ml/redoc",
        openapi_url="/ml/openapi.json"
    )

    # CORS Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
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

    @app.get("/")
    async def root():
        return {
            "message": "TrackRuit ML Service", 
            "status": "running",
            "version": "1.0.0",
            "docs": "/ml/docs"
        }

    @app.get("/health")
    async def health_check():
        return {"status": "healthy", "service": "trackruit-ml"}

    return app

app = create_app()

# This part is only for local development
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    print(f"🚀 Starting server on port {port}")
    uvicorn.run(
        app,  # Use the app instance directly
        host="0.0.0.0",
        port=port,
        reload=False
    )