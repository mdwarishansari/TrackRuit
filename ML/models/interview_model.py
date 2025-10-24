import numpy as np
from typing import Dict, List, Any
import joblib

from .base_model import BaseModel
from config import get_settings

settings = get_settings()

class InterviewModel(BaseModel):
    """Interview Success Prediction Model"""
    
    def __init__(self, version: str = None):
        super().__init__("interview", version or settings.interview_model_version)
        self.ensure_loaded()
    
    def _create_default_model(self):
        """Create default interview model (heuristic)"""
        self.is_loaded = True
    
    def preprocess(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Preprocess interview prediction features"""
        # Extract features
        features = {
            'applied_jobs': data.get('applied_jobs', 0),
            'interviews_given': data.get('interviews_given', 0),
            'skills_strength': data.get('skills_strength', 0.0),
            'prep_hours': data.get('prep_hours', 0),
            'match_score_avg': data.get('match_score_avg', 0.0),
            'resume_score': data.get('resume_score', 0.0),
            'years_experience': data.get('years_experience', 0)
        }
        
        # Normalize features
        features['applied_jobs'] = min(features['applied_jobs'], 100)
        features['interviews_given'] = min(features['interviews_given'], 50)
        features['prep_hours'] = min(features['prep_hours'], 100)
        features['years_experience'] = min(features['years_experience'], 30)
        
        return features
    
    def predict(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Predict interview success probability"""
        try:
            features = self.preprocess(data)
            
            # Rule-based scoring (phase 1)
            probability = self._rule_based_prediction(features)
            
            # Generate factors
            factors = self._generate_factors(features, probability)
            
            # Determine confidence
            confidence = self._get_confidence_level(probability)
            
            return {
                "probability": round(probability, 4),
                "confidence": confidence,
                "positive_factors": factors['positive'],
                "negative_factors": factors['negative'],
                "model_version": self.get_version()
            }
            
        except Exception as e:
            print(f"Error in interview prediction: {e}")
            return self._error_response(str(e))
    
    def _rule_based_prediction(self, features: Dict[str, Any]) -> float:
        """Rule-based prediction for interview success"""
        score = 0.0
        
        # Applied jobs (more applications -> more practice)
        applied_score = min(features['applied_jobs'] / 10.0, 1.0) * 0.1
        
        # Interviews given (more experience -> better performance)
        interview_score = min(features['interviews_given'] / 5.0, 1.0) * 0.2
        
        # Skills strength (technical competency)
        skills_score = features['skills_strength'] * 0.3
        
        # Preparation hours
        prep_score = min(features['prep_hours'] / 20.0, 1.0) * 0.2
        
        # Match score average (how well roles fit)
        match_score = features['match_score_avg'] * 0.1
        
        # Resume score (ATS and quality)
        resume_score = features['resume_score'] * 0.1
        
        # Years of experience
        exp_score = min(features['years_experience'] / 10.0, 1.0) * 0.1
        
        total_score = (applied_score + interview_score + skills_score + 
                      prep_score + match_score + resume_score + exp_score)
        
        return max(0.0, min(1.0, total_score))
    
    def _generate_factors(self, features: Dict[str, Any], probability: float) -> Dict[str, List[str]]:
        """Generate positive and negative factors"""
        negative_factors = []
        positive_factors = []
        
        if features['applied_jobs'] < 5:
            negative_factors.append("Low number of job applications")
        else:
            positive_factors.append("Good number of job applications")
            
        if features['interviews_given'] < 2:
            negative_factors.append("Limited interview experience")
        else:
            positive_factors.append("Reasonable interview experience")
            
        if features['skills_strength'] < 0.6:
            negative_factors.append("Skills could be stronger for target roles")
        else:
            positive_factors.append("Strong skills alignment")
            
        if features['prep_hours'] < 10:
            negative_factors.append("Low interview preparation time")
        else:
            positive_factors.append("Adequate interview preparation")
            
        if features['match_score_avg'] < 0.7:
            negative_factors.append("Low resume-job match scores")
        else:
            positive_factors.append("Good resume-job match")
            
        if features['resume_score'] < 0.7:
            negative_factors.append("Resume could be improved")
        else:
            positive_factors.append("Strong resume quality")
            
        if features['years_experience'] < 2:
            negative_factors.append("Limited professional experience")
        else:
            positive_factors.append("Relevant professional experience")
        
        return {
            'negative': negative_factors[:3],
            'positive': positive_factors[:3]
        }
    
    def _get_confidence_level(self, probability: float) -> str:
        """Get confidence level based on probability"""
        if probability >= 0.8:
            return "high"
        elif probability >= 0.6:
            return "medium"
        elif probability >= 0.4:
            return "low"
        else:
            return "very low"
    
    def explain(self, prediction: Dict[str, Any]) -> List[str]:
        """Generate explanation for interview prediction"""
        explanations = []
        probability = prediction.get('probability', 0)
        
        if probability >= 0.7:
            explanations.append("High likelihood of interview success based on your profile.")
        elif probability >= 0.4:
            explanations.append("Moderate likelihood of interview success. Consider addressing some factors.")
        else:
            explanations.append("Lower likelihood of interview success. Focus on improving key areas.")
        
        # Add factor-based explanations
        negative_factors = prediction.get('negative_factors', [])
        if negative_factors:
            explanations.append(f"Key areas to improve: {', '.join(negative_factors)}")
        
        return explanations
    
    def _error_response(self, error_msg: str) -> Dict[str, Any]:
        return {
            "probability": 0.0,
            "confidence": "unknown",
            "positive_factors": [],
            "negative_factors": [],
            "model_version": self.get_version(),
            "error": error_msg
        }

# Global model instance
interview_model = InterviewModel()