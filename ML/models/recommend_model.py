import numpy as np
from typing import Dict, List, Any

from .base_model import BaseModel
from config import get_settings
from pipelines.preprocess import preprocessor

settings = get_settings()

class RecommendModel(BaseModel):
    """Job Recommendation Model"""
    
    def __init__(self, version: str = None):
        super().__init__("recommend", version or settings.recommend_model_version)
        self.ensure_loaded()
    
    def _create_default_model(self):
        self.is_loaded = True
    
    def preprocess(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Preprocess input data for recommendation"""
        resume_text = data.get('resume_text', '')
        job_pool = data.get('job_pool', [])
        
        return {
            'resume_text': preprocessor.clean_text(resume_text),
            'job_pool': job_pool,
            'original_data': data
        }
    
    def predict(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate job recommendations"""
        try:
            processed_data = self.preprocess(data)
            resume_text = processed_data['resume_text']
            job_pool = processed_data['job_pool']
            
            if not resume_text or not job_pool:
                return self._get_empty_response()
            
            # Extract resume skills
            resume_skills = preprocessor.extract_skills(resume_text)
            
            # Score each job
            scored_jobs = []
            for job in job_pool:
                job_description = job.get('description', '')
                job_skills = preprocessor.extract_skills(job_description)
                
                # Calculate skill match
                common_skills = set(resume_skills) & set(job_skills)
                skill_match = len(common_skills) / len(job_skills) if job_skills else 0
                
                # Simple text similarity
                similarity = self._calculate_similarity(resume_text, job_description)
                
                # Combined score
                match_score = (similarity * 0.6) + (skill_match * 0.4)
                
                scored_jobs.append({
                    **job,
                    'match_score': round(match_score, 4),
                    'skill_match': round(skill_match, 4),
                    'common_skills': list(common_skills)[:5]
                })
            
            # Sort by match score
            scored_jobs.sort(key=lambda x: x['match_score'], reverse=True)
            
            # Get max recommendations
            max_recs = data.get('max_recommendations', 5)
            recommended_jobs = scored_jobs[:max_recs]
            
            return {
                "recommended_jobs": recommended_jobs,
                "total_jobs_considered": len(job_pool),
                "resume_skills_found": resume_skills[:10],
                "model_version": self.get_version()
            }
            
        except Exception as e:
            print(f"Error in recommendation: {e}")
            return self._get_error_response(str(e))
    
    def _calculate_similarity(self, text1: str, text2: str) -> float:
        """Calculate basic text similarity"""
        try:
            # Simple word overlap similarity
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
        """Generate explanation for recommendations"""
        explanations = []
        jobs = prediction.get('recommended_jobs', [])
        total_jobs = prediction.get('total_jobs_considered', 0)
        
        if jobs:
            top_job = jobs[0]
            explanations.append(f"Recommended {len(jobs)} jobs from {total_jobs} total.")
            explanations.append(f"Top match: {top_job.get('title', 'Unknown')} with score {top_job.get('match_score', 0):.2f}")
        else:
            explanations.append("No suitable job recommendations found.")
        
        return explanations
    
    def _get_empty_response(self) -> Dict[str, Any]:
        return {
            "recommended_jobs": [],
            "total_jobs_considered": 0,
            "resume_skills_found": [],
            "model_version": self.get_version()
        }
    
    def _get_error_response(self, error_msg: str) -> Dict[str, Any]:
        return {
            "recommended_jobs": [],
            "total_jobs_considered": 0,
            "resume_skills_found": [],
            "model_version": self.get_version(),
            "error": error_msg
        }

# Global model instance
recommend_model = RecommendModel()