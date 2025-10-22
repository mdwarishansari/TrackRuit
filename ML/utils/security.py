from fastapi import HTTPException, Depends
from fastapi.security import APIKeyHeader
from typing import Optional

from config import get_settings

settings = get_settings()

# API Key header
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

def verify_api_key(api_key: Optional[str] = Depends(api_key_header)) -> str:
    """
    Verify API key from request header
    """
    if not api_key:
        raise HTTPException(
            status_code=401, 
            detail="API key required"
        )
    
    if api_key != settings.api_key:
        raise HTTPException(
            status_code=401, 
            detail="Invalid API key"
        )
    
    return api_key

def create_api_key() -> str:
    """
    Generate a new API key (for admin use)
    """
    import secrets
    return secrets.token_urlsafe(32)

def hash_text(text: str) -> str:
    """
    Hash text for caching (not for passwords)
    """
    import hashlib
    return hashlib.md5(text.encode()).hexdigest()

def sanitize_input(text: str) -> str:
    """
    Basic input sanitization
    """
    import html
    # Escape HTML characters
    text = html.escape(text)
    # Remove excessive whitespace
    text = ' '.join(text.split())
    return text

def validate_resume_text(text: str) -> bool:
    """
    Validate resume text input
    """
    if not text or len(text.strip()) < 10:
        return False
    
    if len(text) > settings.max_text_length:
        return False
    
    # Check for excessive special characters (potential injection)
    special_char_ratio = len([c for c in text if not c.isalnum() and not c.isspace()]) / len(text)
    if special_char_ratio > 0.3:  # More than 30% special characters
        return False
    
    return True