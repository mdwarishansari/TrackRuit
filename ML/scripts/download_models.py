#!/usr/bin/env python3
"""
Script to download pre-trained models and dependencies
"""

import os
import sys
import json  # ADD THIS LINE
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import get_settings

settings = get_settings()

def create_sample_models():
    """Create sample model files for testing"""
    print("Creating sample models...")
    
    # Create sample TF-IDF vectorizer
    vectorizer = TfidfVectorizer(
        max_features=1000,
        stop_words='english',
        ngram_range=(1, 2)
    )
    
    # Fit on sample data
    sample_texts = [
        "python developer django flask",
        "java spring hibernate sql",
        "react javascript frontend",
        "machine learning python data science"
    ]
    vectorizer.fit(sample_texts)
    
    # Save sample models
    models_dir = settings.model_dir
    os.makedirs(models_dir, exist_ok=True)
    
    # Save match model
    match_model_path = os.path.join(models_dir, f"match-{settings.match_model_version}.joblib")
    joblib.dump(vectorizer, match_model_path)
    print(f"✓ Sample match model created: {match_model_path}")
    
    # Create metadata files
    metadata = {
        "model_type": "TF-IDF Vectorizer",
        "version": settings.match_model_version,
        "created_at": "2024-01-01T00:00:00",
        "description": "Sample model for testing"
    }
    
    for model_name in ["match", "recommend", "interview", "feedback", "ats"]:
        metadata_path = os.path.join(models_dir, f"{model_name}-{getattr(settings, f'{model_name}_model_version')}.json")
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        
        # Create placeholder model files
        model_path = os.path.join(models_dir, f"{model_name}-{getattr(settings, f'{model_name}_model_version')}.joblib")
        if not os.path.exists(model_path):
            joblib.dump({"placeholder": True}, model_path)
        print(f"✓ {model_name} model created: {model_path}")
    
    print("✓ All sample models created")

def main():
    """Main download function"""
    print("🚀 Setting up TrackRuit ML Models")
    print("=" * 50)
    
    # Create sample models for testing
    create_sample_models()
    
    print("\n" + "=" * 50)
    print("✅ All models setup successfully!")
    print("\nNext steps:")
    print("1. Run 'python main.py' to start the ML service")
    print("2. Test endpoints with Postman or curl")

if __name__ == "__main__":
    main()