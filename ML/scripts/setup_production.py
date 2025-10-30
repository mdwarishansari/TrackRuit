#!/usr/bin/env python3
"""
Production setup script for Render.com deployment
"""

import os
import sys
import logging
import nltk

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def setup_production():
    """Setup production environment"""
    print("🚀 Setting up TrackRuit ML Service for Production")
    print("=" * 50)
    
    # Create necessary directories
    os.makedirs('models', exist_ok=True)
    os.makedirs('logs', exist_ok=True)
    
    # Setup NLTK data
    print("📚 Setting up NLTK data...")
    try:
        # Use writable directory for NLTK data
        nltk_data_dir = '/tmp/nltk_data'
        os.makedirs(nltk_data_dir, exist_ok=True)
        nltk.data.path.append(nltk_data_dir)
        
        # Download required NLTK datasets
        nltk.download('punkt', download_dir=nltk_data_dir, quiet=True)
        nltk.download('stopwords', download_dir=nltk_data_dir, quiet=True)
        print("✅ NLTK data setup complete")
    except Exception as e:
        print(f"⚠️ NLTK setup warning: {e}")
        print("🔄 Continuing setup...")
    
    # Check environment variables
    print("🔧 Checking environment variables...")
    required_vars = ['API_KEY', 'JWT_SECRET']
    for var in required_vars:
        if os.getenv(var):
            print(f"✅ {var}: Set")
        else:
            print(f"⚠️ {var}: Not set (will use generated values)")
    
    # Test basic imports
    print("🧪 Testing imports...")
    try:
        from models.match_model import MatchModel
        from models.recommend_model import RecommendModel
        from models.interview_model import InterviewModel
        from models.feedback_model import FeedbackModel
        from models.ats_model import ATSModel
        print("✅ All model imports successful")
    except Exception as e:
        print(f"❌ Import test failed: {e}")
        return False
    
    # Create sample models if they don't exist
    print("🤖 Ensuring models are ready...")
    try:
        models = [
            MatchModel(),
            RecommendModel(),
            InterviewModel(), 
            FeedbackModel(),
            ATSModel()
        ]
        print("✅ All models initialized successfully")
    except Exception as e:
        print(f"⚠️ Model initialization warning: {e}")
    
    print("\n" + "=" * 50)
    print("✅ Production setup completed successfully!")
    print("\n📊 Service Information:")
    print(f"   - Python: {sys.version}")
    print(f"   - Port: {os.getenv('PORT', '8000')}")
    print(f"   - Debug: {os.getenv('DEBUG', 'False')}")
    print(f"   - Log Level: {os.getenv('LOG_LEVEL', 'info')}")
    
    return True

if __name__ == "__main__":
    success = setup_production()
    sys.exit(0 if success else 1)