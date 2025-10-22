#!/usr/bin/env python3
"""
Model training script for TrackRuit ML Service
Run this script to train and save all ML models
"""

import os
import sys
import json
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
from typing import Dict, Any

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import get_settings
from models.match_model import MatchModel
from models.recommend_model import RecommendModel
from models.interview_model import InterviewModel
from models.feedback_model import FeedbackModel
from models.ats_model import ATSModel

settings = get_settings()

def ensure_model_dir():
    """Ensure models directory exists"""
    os.makedirs(settings.model_dir, exist_ok=True)
    print(f"Models directory: {settings.model_dir}")

def train_match_model() -> bool:
    """Train and save the match model"""
    try:
        print("Training Match Model...")
        model = MatchModel()
        
        # For now, we'll just save the default model
        # In production, you would train on actual resume-JD pairs
        success = model.save_model()
        
        if success:
            print("✓ Match model saved successfully")
        else:
            print("✗ Failed to save match model")
            
        return success
        
    except Exception as e:
        print(f"Error training match model: {e}")
        return False

def train_recommend_model() -> bool:
    """Train and save the recommendation model"""
    try:
        print("Training Recommendation Model...")
        model = RecommendModel()
        
        # Save default model
        success = model.save_model()
        
        if success:
            print("✓ Recommendation model saved successfully")
        else:
            print("✗ Failed to save recommendation model")
            
        return success
        
    except Exception as e:
        print(f"Error training recommendation model: {e}")
        return False

def train_interview_model() -> bool:
    """Train and save the interview prediction model"""
    try:
        print("Training Interview Prediction Model...")
        model = InterviewModel()
        
        # Create sample training data (in real scenario, use actual interview outcomes)
        sample_data = {
            'applied_jobs': [10, 5, 20, 15, 8],
            'interviews_given': [3, 1, 5, 4, 2],
            'skills_strength': [0.8, 0.6, 0.9, 0.7, 0.5],
            'prep_hours': [20, 10, 30, 25, 15],
            'match_score_avg': [0.8, 0.6, 0.9, 0.7, 0.5],
            'resume_score': [0.85, 0.6, 0.9, 0.8, 0.5],
            'years_experience': [3, 1, 5, 4, 2]
        }
        
        # In phase 2, this would train a real ML model
        # For now, we use the rule-based approach
        
        success = model.save_model()
        
        if success:
            print("✓ Interview prediction model saved successfully")
        else:
            print("✗ Failed to save interview prediction model")
            
        return success
        
    except Exception as e:
        print(f"Error training interview model: {e}")
        return False

def train_feedback_model() -> bool:
    """Train and save the feedback model"""
    try:
        print("Training Feedback Model...")
        model = FeedbackModel()
        
        # Save default model
        success = model.save_model()
        
        if success:
            print("✓ Feedback model saved successfully")
        else:
            print("✗ Failed to save feedback model")
            
        return success
        
    except Exception as e:
        print(f"Error training feedback model: {e}")
        return False

def train_ats_model() -> bool:
    """Train and save the ATS model"""
    try:
        print("Training ATS Model...")
        model = ATSModel()
        
        # Save default model
        success = model.save_model()
        
        if success:
            print("✓ ATS model saved successfully")
        else:
            print("✗ Failed to save ATS model")
            
        return success
        
    except Exception as e:
        print(f"Error training ATS model: {e}")
        return False

def save_training_metadata():
    """Save training metadata"""
    metadata = {
        "training_date": datetime.now().isoformat(),
        "model_versions": {
            "match": settings.match_model_version,
            "recommend": settings.recommend_model_version,
            "interview": settings.interview_model_version,
            "feedback": settings.feedback_model_version,
            "ats": settings.ats_model_version
        },
        "environment": {
            "embedding_model": settings.embedding_model,
            "similarity_threshold": settings.similarity_threshold
        }
    }
    
    metadata_path = os.path.join(settings.model_dir, "training_metadata.json")
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"Training metadata saved to: {metadata_path}")

def main():
    """Main training function"""
    print("🚀 Starting TrackRuit ML Model Training")
    print("=" * 50)
    
    # Ensure model directory exists
    ensure_model_dir()
    
    # Train all models
    models_trained = {
        "match": train_match_model(),
        "recommend": train_recommend_model(),
        "interview": train_interview_model(),
        "feedback": train_feedback_model(),
        "ats": train_ats_model()
    }
    
    # Save training metadata
    save_training_metadata()
    
    # Report results
    print("\n" + "=" * 50)
    print("Training Summary:")
    print("=" * 50)
    
    successful_models = sum(models_trained.values())
    total_models = len(models_trained)
    
    for model_name, success in models_trained.items():
        status = "✓ SUCCESS" if success else "✗ FAILED"
        print(f"{model_name:15} {status}")
    
    print(f"\nSuccessful: {successful_models}/{total_models}")
    
    if successful_models == total_models:
        print("🎉 All models trained successfully!")
        return 0
    else:
        print("⚠️  Some models failed to train")
        return 1

if __name__ == "__main__":
    sys.exit(main())