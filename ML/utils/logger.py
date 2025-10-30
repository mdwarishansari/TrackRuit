import logging
import sys
from datetime import datetime
import json
from typing import Dict, Any

from config import get_settings

settings = get_settings()

class JSONFormatter(logging.Formatter):
    """JSON formatter for structured logging"""
    
    def format(self, record: logging.LogRecord) -> str:
        log_entry = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno
        }
        
        # Add exception info if present
        if record.exc_info:
            log_entry["exception"] = self.formatException(record.exc_info)
        
        return json.dumps(log_entry)

def setup_logger() -> logging.Logger:
    """Setup application logger"""
    logger = logging.getLogger("trackruit_ml")
    logger.setLevel(getattr(logging, settings.log_level.upper()))
    
    # Clear existing handlers
    logger.handlers.clear()
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    
    if settings.debug:
        # Simple format for development
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
    else:
        # JSON format for production
        formatter = JSONFormatter()
    
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    # File handler for production
    if not settings.debug:
        try:
            file_handler = logging.FileHandler('ml_service.log')
            file_handler.setFormatter(formatter)
            logger.addHandler(file_handler)
        except Exception as e:
            logger.warning(f"Could not setup file logging: {e}")
    
    logger.propagate = False
    return logger

def log_request(request_id: str, endpoint: str, method: str, duration: float, status_code: int = 200):
    """Log HTTP request details"""
    logger = logging.getLogger("trackruit_ml.requests")
    logger.info(
        "Request processed",
        extra={
            "request_id": request_id,
            "endpoint": endpoint,
            "method": method,
            "duration_ms": round(duration * 1000, 2),
            "status_code": status_code
        }
    )

def log_prediction(model_name: str, request_id: str, input_data: Dict[str, Any], output_data: Dict[str, Any], duration: float):
    """Log model prediction details"""
    logger = logging.getLogger("trackruit_ml.predictions")
    
    # Sanitize input data for logging
    sanitized_input = {}
    for key, value in input_data.items():
        if isinstance(value, str) and len(value) > 100:
            sanitized_input[key] = value[:100] + "..."
        else:
            sanitized_input[key] = value
    
    logger.info(
        "Model prediction",
        extra={
            "model": model_name,
            "request_id": request_id,
            "input": sanitized_input,
            "output": output_data,
            "duration_ms": round(duration * 1000, 2)
        }
    )

def log_error(error_type: str, message: str, context: Dict[str, Any] = None):
    """Log error details"""
    logger = logging.getLogger("trackruit_ml.errors")
    logger.error(
        message,
        extra={
            "error_type": error_type,
            "context": context or {}
        }
    )