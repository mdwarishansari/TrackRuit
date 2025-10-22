import os
from typing import List, Optional
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    """Application settings"""
    
    # Server
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", 8000))
    workers: int = int(os.getenv("WORKERS", 4))
    debug: bool = os.getenv("DEBUG", "false").lower() == "true"
    log_level: str = os.getenv("LOG_LEVEL", "info")
    
    # Security
    api_key: str = os.getenv("API_KEY", "dev-key-change-in-production")
    jwt_secret: str = os.getenv("JWT_SECRET", "dev-jwt-secret")
    cors_origins: List[str] = eval(os.getenv("CORS_ORIGINS", '["http://localhost:3000"]'))
    allowed_hosts: List[str] = ["*"]
    
    # Database & Cache
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    mongo_uri: str = os.getenv("MONGO_URI", "mongodb://localhost:27017/trackruit")
    db_name: str = os.getenv("DB_NAME", "trackruit")
    
    # ML Configuration
    model_dir: str = os.getenv("MODEL_DIR", "./models")
    embedding_model: str = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
    cache_ttl: int = int(os.getenv("CACHE_TTL", 86400))
    similarity_threshold: float = float(os.getenv("SIMILARITY_THRESHOLD", "0.7"))
    
    # Feature Flags
    enable_sbert: bool = os.getenv("ENABLE_SBERT", "true").lower() == "true"
    enable_cache: bool = os.getenv("ENABLE_CACHE", "true").lower() == "true"
    enable_monitoring: bool = os.getenv("ENABLE_MONITORING", "true").lower() == "true"
    
    # Model Versions
    match_model_version: str = os.getenv("MATCH_MODEL_VERSION", "match-v1")
    recommend_model_version: str = os.getenv("RECOMMEND_MODEL_VERSION", "recommend-v1")
    interview_model_version: str = os.getenv("INTERVIEW_MODEL_VERSION", "interview-v1")
    feedback_model_version: str = os.getenv("FEEDBACK_MODEL_VERSION", "feedback-v1")
    ats_model_version: str = os.getenv("ATS_MODEL_VERSION", "ats-v1")
    
    # Performance
    max_embedding_cache: int = int(os.getenv("MAX_EMBEDDING_CACHE", "1000"))
    batch_size: int = int(os.getenv("BATCH_SIZE", "32"))
    max_text_length: int = int(os.getenv("MAX_TEXT_LENGTH", "10000"))
    
    class Config:
        env_file = ".env"

# Global settings instance
_settings = None

def get_settings() -> Settings:
    """Get settings singleton"""
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings