import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import Dict, List, Any

from .base_model import BaseModel
from config import get_settings
from pipelines.preprocess import preprocessor

settings = get_settings()

class MatchModel(BaseModel):
    """Resume-Job Matching Model"""
    
    def __init__(self, version: str = None):
        super().__init__("match", version or settings.match_model_version)
        self.vectorizer = None
        self.ensure_loaded()
    
    def _create_default_model(self):
        """Create TF-IDF vectorizer"""
        self.vectorizer = TfidfVectorizer(
            max_features=1000,
            stop_words='english',
            ngram_range=(1, 2)
        )
        self.is_loaded = True
    
    def preprocess(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Preprocess input data for matching"""
        resume_text = data.get('resume_text', '')
        job_description = data.get('job_description', '')
        
        return {
            'resume_text': preprocessor.clean_text(resume_text),
            'job_description': preprocessor.clean_text(job_description),
            'original_data': data
        }
    
    def predict(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate resume-job match score"""
        try:
            processed_data = self.preprocess(data)
            resume_text = processed_data['resume_text']
            job_description = processed_data['job_description']
            
            if not resume_text or not job_description:
                return self._get_empty_response()
            
            # Calculate similarity using basic word overlap
            similarity_score = self._calculate_similarity(resume_text, job_description)
            
            # Extract skills
            resume_skills = preprocessor.extract_skills(resume_text)
            job_skills = preprocessor.extract_skills(job_description)
            
            # Calculate skill match
            common_skills = set(resume_skills) & set(job_skills)
            skill_match = len(common_skills) / len(job_skills) if job_skills else 0
            
            # Combined score
            match_score = (similarity_score * 0.6) + (skill_match * 0.4)
            
            result = {
                "match_score": round(match_score, 4),
                "similarity_score": round(similarity_score, 4),
                "skill_match": round(skill_match, 4),
                "top_skills_matched": list(common_skills)[:10],
                "missing_skills": list(set(job_skills) - set(resume_skills))[:10],
                "model_version": self.get_version()
            }
            
            return result
            
        except Exception as e:
            print(f"Error in match prediction: {e}")
            return self._get_error_response(str(e))
    
    def _calculate_similarity(self, text1: str, text2: str) -> float:
        """Calculate text similarity using basic word overlap"""
        try:
            # Simple word overlap similarity (Jaccard similarity)
            words1 = set(text1.lower().split())
            words2 = set(text2.lower().split())
            
            if not words1 or not words2:
                return 0.0
            
            intersection = words1.intersection(words2)
            union = words1.union(words2)
            
            similarity = len(intersection) / len(union) if union else 0.0
            return similarity
            
        except Exception as e:
            print(f"Similarity calculation error: {e}")
            return 0.0
    
    def explain(self, prediction: Dict[str, Any]) -> List[str]:
        """Generate explanation for the match prediction"""
        explanations = []
        match_score = prediction.get('match_score', 0)
        skills_matched = prediction.get('top_skills_matched', [])
        missing_skills = prediction.get('missing_skills', [])
        
        if match_score >= 0.8:
            explanations.append("Excellent match! Strong alignment between resume and job requirements.")
        elif match_score >= 0.6:
            explanations.append("Good match. Consider emphasizing key skills to improve further.")
        elif match_score >= 0.4:
            explanations.append("Moderate match. Focus on developing missing skills.")
        else:
            explanations.append("Weak match. Significant skill gaps identified.")
        
        if skills_matched:
            explanations.append(f"Matched skills: {', '.join(skills_matched[:5])}")
        
        if missing_skills:
            explanations.append(f"Consider developing: {', '.join(missing_skills[:5])}")
        
        return explanations
    
    def _get_empty_response(self) -> Dict[str, Any]:
        return {
            "match_score": 0.0,
            "similarity_score": 0.0,
            "skill_match": 0.0,
            "top_skills_matched": [],
            "missing_skills": [],
            "model_version": self.get_version(),
            "error": "Missing resume text or job description"
        }
    
    def _get_error_response(self, error_msg: str) -> Dict[str, Any]:
        return {
            "match_score": 0.0,
            "similarity_score": 0.0,
            "skill_match": 0.0,
            "top_skills_matched": [],
            "missing_skills": [],
            "model_version": self.get_version(),
            "error": error_msg
        }

# Global model instance
match_model = MatchModel()