import redis
import json
import hashlib
from typing import Any, Optional
from functools import wraps

from config import get_settings

settings = get_settings()

# Redis connection pool
_redis_pool = None

def get_redis():
    """Get Redis connection"""
    global _redis_pool
    if _redis_pool is None:
        _redis_pool = redis.from_url(settings.redis_url, decode_responses=True)
    return _redis_pool

def cache_result(prefix: str, ttl: int = None):
    """Decorator to cache function results"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if not settings.enable_cache:
                return func(*args, **kwargs)
            
            # Create cache key from function name and arguments
            key_parts = [prefix, func.__name__]
            key_parts.extend([str(arg) for arg in args])
            key_parts.extend([f"{k}:{v}" for k, v in sorted(kwargs.items())])
            
            cache_key = hashlib.md5(":".join(key_parts).encode()).hexdigest()
            full_key = f"cache:{prefix}:{cache_key}"
            
            # Try to get from cache
            redis_client = get_redis()
            cached = redis_client.get(full_key)
            
            if cached is not None:
                return json.loads(cached)
            
            # Execute function and cache result
            result = func(*args, **kwargs)
            redis_client.setex(full_key, ttl or settings.cache_ttl, json.dumps(result))
            
            return result
        return wrapper
    return decorator

def get_cache(key: str) -> Optional[Any]:
    """Get value from cache"""
    if not settings.enable_cache:
        return None
    
    try:
        redis_client = get_redis()
        value = redis_client.get(key)
        return json.loads(value) if value else None
    except:
        return None

def set_cache(key: str, value: Any, ttl: int = None) -> bool:
    """Set value in cache"""
    if not settings.enable_cache:
        return False
    
    try:
        redis_client = get_redis()
        redis_client.setex(key, ttl or settings.cache_ttl, json.dumps(value))
        return True
    except:
        return False

def delete_cache(key: str) -> bool:
    """Delete key from cache"""
    try:
        redis_client = get_redis()
        redis_client.delete(key)
        return True
    except:
        return False

def clear_pattern(pattern: str) -> bool:
    """Clear keys matching pattern"""
    try:
        redis_client = get_redis()
        keys = redis_client.keys(pattern)
        if keys:
            redis_client.delete(*keys)
        return True
    except:
        return False