from fastapi import HTTPException, Depends, Request
from fastapi.security import APIKeyHeader
from typing import Optional
import time
from collections import defaultdict

from config import get_settings

settings = get_settings()

# API Key header
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

class RateLimiter:
    """Rate limiting for API endpoints"""
    def __init__(self):
        self.requests = defaultdict(list)
    
    def check_rate_limit(self, request: Request, limit: int = 60, window: int = 60):
        """Check and enforce rate limits"""
        client_ip = request.client.host
        current_time = time.time()
        
        # Clean old requests
        self.requests[client_ip] = [
            req_time for req_time in self.requests[client_ip] 
            if current_time - req_time < window
        ]
        
        # Check rate limit
        if len(self.requests[client_ip]) >= limit:
            raise HTTPException(
                status_code=429, 
                detail=f"Rate limit exceeded. Maximum {limit} requests per {window} seconds."
            )
        
        self.requests[client_ip].append(current_time)
        return True

# Global rate limiter instance
rate_limiter = RateLimiter()

def verify_api_key(api_key: Optional[str] = Depends(api_key_header)) -> str:
    """
    Verify API key from request header with improved security
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
    Validate resume text input with improved checks
    """
    if not text or len(text.strip()) < 10:
        return False
    
    if len(text) > settings.max_text_length:
        return False
    
    # Check for excessive special characters (potential injection)
    special_char_ratio = len([c for c in text if not c.isalnum() and not c.isspace() and c not in '.,!?;:-()@']) / len(text)
    if special_char_ratio > 0.3:  # More than 30% special characters
        return False
    
    return True