#!/usr/bin/env python3
"""
Lightweight setup check script for Render.com
"""

import os
import sys

# Add current directory to Python path
sys.path.insert(0, os.getcwd())

def check_setup():
    """Check basic setup without triggering heavy imports"""
    print("🧪 Running lightweight setup check...")
    
    try:
        # Check if essential directories exist
        required_dirs = ['models', 'logs', 'nltk_data']
        for dir_name in required_dirs:
            if os.path.exists(dir_name):
                print(f"✅ Directory exists: {dir_name}")
            else:
                print(f"⚠️ Directory missing: {dir_name}")
        
        # Check if model files exist
        model_files = [
            'models/match-v1.joblib',
            'models/recommend-v1.joblib', 
            'models/interview-v1.joblib',
            'models/feedback-v1.joblib',
            'models/ats-v1.joblib'
        ]
        
        for model_file in model_files:
            if os.path.exists(model_file):
                print(f"✅ Model file exists: {model_file}")
            else:
                print(f"⚠️ Model file missing: {model_file}")
        
        # Test basic Python imports (avoid config for now)
        print("🔧 Testing core imports...")
        try:
            # Test basic imports that don't trigger NLTK
            import fastapi
            import uvicorn
            print("✅ FastAPI and Uvicorn imports successful")
        except Exception as e:
            print(f"❌ Core import failed: {e}")
            return False
            
        print("✅ All basic checks passed!")
        return True
        
    except Exception as e:
        print(f"❌ Setup check failed: {e}")
        return False

if __name__ == "__main__":
    success = check_setup()
    sys.exit(0 if success else 1)