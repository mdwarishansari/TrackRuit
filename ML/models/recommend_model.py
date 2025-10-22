import numpy as np
from typing import Dict, List, Any, Optional
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.preprocessing import Normalizer

from .base_model import BaseModel
from config import get_settings
from pipelines.embeddings import EmbeddingManager
from utils.cache import cache_result

settings = get_settings()

class RecommendModel(BaseModel):
    """Job Recommendation Model using scikit-learn only"""
    
    def __init__(self, version: str = None):
        super().__init__("recommend", version or settings.recommend_model_version)
        self.embedding_manager = EmbeddingManager()
        self.tfidf_vectorizer = None
        self.svd_model = None
        self.ensure_loaded()
    
    def _create_default_model(self):
        """Create default recommendation model using scikit-learn"""
        self.tfidf_vectorizer = TfidfVectorizer(
            max_features=5000,
            stop_words='english',
            ngram_range=(1, 2)
        )
        self.svd_model = TruncatedSVD(n_components=100)
        self.normalizer = Normalizer(copy=False)
        self.is_loaded = True
    
    def preprocess(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Preprocess input data for recommendation"""
        resume_text = data.get('resume_text', '')
        user_history = data.get('user_history', [])
        job_pool = data.get('job_pool', [])
        
        # Clean and preprocess resume text
        from pipelines.preprocess import TextPreprocessor
        preprocessor = TextPreprocessor()
        clean_resume = preprocessor.clean_text(resume_text)
        
        # Preprocess job descriptions
        job_descriptions = []
        for job in job_pool:
            description = job.get('description', '')
            clean_description = preprocessor.clean_text(description)
            job_descriptions.append(clean_description)
        
        return {
            'resume_text': clean_resume,
            'user_history': user_history,
            'job_pool': job_pool,
            'job_descriptions': job_descriptions
        }
    
    def _content_based_recommendation(self, resume_text: str, job_pool: List[Dict], job_descriptions: List[str]) -> List[Dict]:
        """Content-based recommendation using TF-IDF and cosine similarity"""
        try:
            # Combine resume and job descriptions for TF-IDF
            all_texts = [resume_text] + job_descriptions
            
            # Fit TF-IDF vectorizer
            tfidf_matrix = self.tfidf_vectorizer.fit_transform(all_texts)
            
            # Apply dimensionality reduction
            reduced_matrix = self.svd_model.fit_transform(tfidf_matrix)
            normalized_matrix = self.normalizer.fit_transform(reduced_matrix)
            
            # Calculate similarities
            resume_vector = normalized_matrix[0:1]  # First item is the resume
            job_vectors = normalized_matrix[1:]     # Rest are jobs
            
            similarities = cosine_similarity(resume_vector, job_vectors)[0]
            
            # Rank jobs by similarity
            ranked_indices = np.argsort(similarities)[::-1]
            ranked_jobs = []
            
            for idx in ranked_indices:
                job = job_pool[idx].copy()
                job['similarity_score'] = float(similarities[idx])
                job['match_reason'] = "Content-based similarity"
                ranked_jobs.append(job)
            
            return ranked_jobs
            
        except Exception as e:
            print(f"TF-IDF recommendation error: {e}")
            # Fallback to embedding-based approach
            return self._embedding_based_recommendation(resume_text, job_pool, job_descriptions)
    
    def _embedding_based_recommendation(self, resume_text: str, job_pool: List[Dict], job_descriptions: List[str]) -> List[Dict]:
        """Embedding-based recommendation using Sentence-BERT"""
        try:
            # Get resume embedding
            resume_embedding = self.embedding_manager.get_embedding(resume_text)
            
            # Get embeddings for job descriptions
            job_embeddings = self.embedding_manager.get_embeddings_batch(job_descriptions)
            
            # Calculate similarities
            similarities = cosine_similarity([resume_embedding], job_embeddings)[0]
            
            # Rank jobs by similarity
            ranked_indices = np.argsort(similarities)[::-1]
            ranked_jobs = []
            
            for idx in ranked_indices:
                job = job_pool[idx].copy()
                job['similarity_score'] = float(similarities[idx])
                job['match_reason'] = "Semantic similarity"
                ranked_jobs.append(job)
            
            return ranked_jobs
            
        except Exception as e:
            print(f"Embedding recommendation error: {e}")
            return []
    
    def _hybrid_recommendation(self, resume_text: str, job_pool: List[Dict], job_descriptions: List[str], user_history: List[Dict]) -> List[Dict]:
        """Hybrid recommendation combining multiple approaches"""
        # Get content-based recommendations
        content_based = self._content_based_recommendation(resume_text, job_pool, job_descriptions)
        
        # Get embedding-based recommendations
        embedding_based = self._embedding_based_recommendation(resume_text, job_pool, job_descriptions)
        
        # Combine results (simple weighted average)
        job_scores = {}
        
        # Score content-based results
        for job in content_based:
            job_id = job.get('id', job.get('title', ''))
            job_scores[job_id] = {
                'job': job,
                'content_score': job.get('similarity_score', 0),
                'embedding_score': 0,
                'final_score': 0
            }
        
        # Score embedding-based results
        for job in embedding_based:
            job_id = job.get('id', job.get('title', ''))
            if job_id in job_scores:
                job_scores[job_id]['embedding_score'] = job.get('similarity_score', 0)
            else:
                job_scores[job_id] = {
                    'job': job,
                    'content_score': 0,
                    'embedding_score': job.get('similarity_score', 0),
                    'final_score': 0
                }
        
        # Calculate final scores (weighted average)
        for job_id, scores in job_scores.items():
            # Weight content-based more heavily (0.6) and embedding-based (0.4)
            final_score = (scores['content_score'] * 0.6) + (scores['embedding_score'] * 0.4)
            scores['final_score'] = final_score
            scores['job']['similarity_score'] = final_score
            scores['job']['match_reason'] = "Hybrid approach"
        
        # Sort by final score
        ranked_jobs = sorted(
            [scores['job'] for scores in job_scores.values()],
            key=lambda x: x.get('similarity_score', 0),
            reverse=True
        )
        
        return ranked_jobs
    
    @cache_result(prefix="recommend", ttl=settings.cache_ttl)
    def predict(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate job recommendations using hybrid approach"""
        try:
            processed_data = self.preprocess(data)
            resume_text = processed_data['resume_text']
            job_pool = processed_data['job_pool']
            job_descriptions = processed_data['job_descriptions']
            user_history = processed_data['user_history']
            
            if not resume_text or not job_pool:
                return self._empty_response()
            
            # Use hybrid recommendation
            ranked_jobs = self._hybrid_recommendation(resume_text, job_pool, job_descriptions, user_history)
            
            # Take top recommendations
            top_jobs = ranked_jobs[:10]
            
            return {
                "recommended_jobs": top_jobs,
                "model_version": self.get_version(),
                "total_jobs_considered": len(job_pool),
                "recommendation_approach": "hybrid"
            }
            
        except Exception as e:
            print(f"Error in recommendation: {e}")
            return self._error_response(str(e))
    
    def explain(self, prediction: Dict[str, Any]) -> List[str]:
        """Generate explanation for recommendations"""
        explanations = []
        top_jobs = prediction.get('recommended_jobs', [])
        
        if top_jobs:
            top_score = top_jobs[0].get('similarity_score', 0)
            approach = prediction.get('recommendation_approach', 'content-based')
            explanations.append(f"Top recommendation has a similarity score of {top_score:.2f}.")
            explanations.append(f"Recommendations generated using {approach} approach.")
            explanations.append("Based on semantic similarity between your resume and job descriptions.")
        
        return explanations
    
    def _empty_response(self) -> Dict[str, Any]:
        return {
            "recommended_jobs": [],
            "model_version": self.get_version(),
            "total_jobs_considered": 0,
            "recommendation_approach": "none",
            "error": "Invalid input data"
        }
    
    def _error_response(self, error_msg: str) -> Dict[str, Any]:
        return {
            "recommended_jobs": [],
            "model_version": self.get_version(),
            "total_jobs_considered": 0,
            "recommendation_approach": "none",
            "error": error_msg
        }