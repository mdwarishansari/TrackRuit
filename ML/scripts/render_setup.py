#!/usr/bin/env python3
"""
Render setup script - runs model setup on startup
"""

import os
import sys
import time

def setup_models():
    """Setup models for Render deployment"""
    print("🚀 Setting up models for Render...")
    
    try:
        # Download models
        from scripts.download_models import create_sample_models
        create_sample_models()
        print("✅ Models downloaded successfully")
        
        # Train models
        from scripts.train_models import main as train_models
        train_models()
        print("✅ Models trained successfully")
        
        return True
    except Exception as e:
        print(f"❌ Model setup failed: {e}")
        return False

if __name__ == "__main__":
    success = setup_models()
    if success:
        print("🎉 Render setup completed!")
        sys.exit(0)
    else:
        print("💥 Render setup failed!")
        sys.exit(1)