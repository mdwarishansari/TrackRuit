import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
from typing import Dict, List, Any, Tuple
import re
from collections import Counter

from .base_model import BaseModel
from config import get_settings
from pipelines.preprocess import TextPreprocessor
from pipelines.embeddings import EmbeddingManager
from utils.cache import cache_result

settings = get_settings()

class MatchModel(BaseModel):
    """Resume-Job Matching Model"""
    
    def __init__(self, version: str = None):
        super().__init__("match", version or settings.match_model_version)
        self.vectorizer = None
        self.embedding_model = None
        self.preprocessor = TextPreprocessor()
        self.embedding_manager = EmbeddingManager()
        self.ensure_loaded()
    
    def _create_default_model(self):
        """Create default TF-IDF model"""
        self.vectorizer = TfidfVectorizer(
            max_features=5000,
            stop_words='english',
            ngram_range=(1, 2)
        )
        self.is_loaded = True
        
        # Initialize Sentence Transformer if enabled
        if settings.enable_sbert:
            try:
                self.embedding_model = SentenceTransformer(settings.embedding_model)
            except Exception as e:
                print(f"Warning: Could not load SentenceTransformer: {e}")
                self.embedding_model = None
    
    def preprocess(self, data: Dict[str, Any]) -> Tuple[str, str]:
        """Preprocess resume and job description"""
        resume_text = data.get('resume_text', '')
        job_text = data.get('job_description', '')
        
        # Clean and preprocess texts
        clean_resume = self.preprocessor.clean_text(resume_text)
        clean_job = self.preprocessor.clean_text(job_text)
        
        return clean_resume, clean_job
    
    @cache_result(prefix="match", ttl=settings.cache_ttl)
    def predict(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Predict match score between resume and job"""
        try:
            resume_text, job_text = self.preprocess(data)
            
            if not resume_text or not job_text:
                return self._empty_response()
            
            # Calculate similarity using multiple methods
            tfidf_score = self._calculate_tfidf_similarity(resume_text, job_text)
            sbert_score = self._calculate_sbert_similarity(resume_text, job_text)
            
            # Combine scores (weighted average)
            if sbert_score is not None:
                final_score = 0.7 * sbert_score + 0.3 * tfidf_score
            else:
                final_score = tfidf_score
            
            # Extract skills and analyze match
            resume_skills = self.preprocessor.extract_skills(resume_text)
            job_skills = self.preprocessor.extract_skills(job_text)
            
            matched_skills = list(set(resume_skills) & set(job_skills))
            missing_skills = list(set(job_skills) - set(resume_skills))
            
            # Take top skills by importance
            top_matched = matched_skills[:5]
            top_missing = missing_skills[:5]
            
            return {
                "match_score": round(float(final_score), 4),
                "top_skills_matched": top_matched,
                "missing_skills": top_missing,
                "model_version": self.get_version(),
                "similarity_breakdown": {
                    "tfidf_score": round(tfidf_score, 4),
                    "sbert_score": round(sbert_score, 4) if sbert_score else None
                }
            }
            
        except Exception as e:
            print(f"Error in match prediction: {e}")
            return self._error_response(str(e))
    
    def _calculate_tfidf_similarity(self, text1: str, text2: str) -> float:
        """Calculate TF-IDF cosine similarity"""
        try:
            if not hasattr(self.vectorizer, 'vocabulary_'):
                # Fit vectorizer on the provided texts
                self.vectorizer.fit([text1, text2])
            
            vectors = self.vectorizer.transform([text1, text2])
            similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
            return max(0.0, min(1.0, similarity))
        except Exception as e:
            print(f"TF-IDF similarity error: {e}")
            return 0.0
    
    def _calculate_sbert_similarity(self, text1: str, text2: str) -> float:
        """Calculate Sentence-BERT similarity"""
        if not self.embedding_model:
            return None
            
        try:
            embedding1 = self.embedding_manager.get_embedding(text1)
            embedding2 = self.embedding_manager.get_embedding(text2)
            
            similarity = cosine_similarity(
                embedding1.reshape(1, -1), 
                embedding2.reshape(1, -1)
            )[0][0]
            return max(0.0, min(1.0, similarity))
        except Exception as e:
            print(f"SBERT similarity error: {e}")
            return None
    
    def explain(self, prediction: Dict[str, Any]) -> List[str]:
        """Generate explanation for the match score"""
        explanations = []
        score = prediction.get('match_score', 0)
        
        if score >= 0.8:
            explanations.append("Excellent match! Strong alignment on key skills and requirements.")
        elif score >= 0.6:
            explanations.append("Good match. Solid foundation with some areas for improvement.")
        else:
            explanations.append("Consider developing missing skills to improve match.")
        
        # Add skill-based explanations
        matched_skills = prediction.get('top_skills_matched', [])
        missing_skills = prediction.get('missing_skills', [])
        
        if matched_skills:
            explanations.append(f"Strong in: {', '.join(matched_skills[:3])}")
        if missing_skills:
            explanations.append(f"Develop: {', '.join(missing_skills[:3])}")
        
        return explanations
    
    def _empty_response(self) -> Dict[str, Any]:
        return {
            "match_score": 0.0,
            "top_skills_matched": [],
            "missing_skills": [],
            "model_version": self.get_version(),
            "error": "Invalid input data"
        }
    
    def _error_response(self, error_msg: str) -> Dict[str, Any]:
        return {
            "match_score": 0.0,
            "top_skills_matched": [],
            "missing_skills": [],
            "model_version": self.get_version(),
            "error": error_msg
        }