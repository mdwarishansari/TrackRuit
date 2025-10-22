#!/usr/bin/env python3
"""
Production environment setup script for Render
"""

import os
import secrets
import sys

def generate_secret_key():
    """Generate secure secret keys for production"""
    return secrets.token_hex(32)

def setup_environment():
    """Setup production environment variables"""
    
    # Generate secure keys if not set
    api_key = os.getenv('API_KEY') or f"prod_{generate_secret_key()}"
    jwt_secret = os.getenv('JWT_SECRET') or f"prod_{generate_secret_key()}"
    
    # Set default production values
    env_vars = {
        'HOST': '0.0.0.0',
        'PORT': '8000',
        'DEBUG': 'false',
        'LOG_LEVEL': 'info',
        'API_KEY': api_key,
        'JWT_SECRET': jwt_secret,
        'ENABLE_CACHE': 'true',
        'ENABLE_SBERT': 'true',
        'MODEL_DIR': './models'
    }
    
    # Update environment
    for key, value in env_vars.items():
        if not os.getenv(key):
            os.environ[key] = value
            print(f"✅ Set {key} = {value}")
    
    print("🎯 Production environment setup completed!")

if __name__ == "__main__":
    setup_environment()