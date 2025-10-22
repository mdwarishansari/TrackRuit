import numpy as np
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Any
import hashlib
import json

from config import get_settings
from utils.cache import get_cache, set_cache

settings = get_settings()

class EmbeddingManager:
    """Manager for text embeddings with caching"""
    
    def __init__(self):
        self.model = None
        self.cache_enabled = settings.enable_cache
        
        if settings.enable_sbert:
            try:
                self.model = SentenceTransformer(settings.embedding_model)
            except Exception as e:
                print(f"Warning: Could not load SentenceTransformer: {e}")
                self.model = None
    
    def _get_cache_key(self, text: str) -> str:
        """Generate cache key for text"""
        text_hash = hashlib.md5(text.encode()).hexdigest()
        return f"embedding:{text_hash}"
    
    def get_embedding(self, text: str) -> np.ndarray:
        """Get embedding for text with caching"""
        if not text or not self.model:
            return np.zeros(384)  # Default dimension for all-MiniLM-L6-v2
        
        # Try to get from cache
        if self.cache_enabled:
            cache_key = self._get_cache_key(text)
            cached = get_cache(cache_key)
            if cached:
                return np.array(json.loads(cached))
        
        # Generate embedding
        embedding = self.model.encode(text)
        
        # Store in cache
        if self.cache_enabled:
            cache_key = self._get_cache_key(text)
            set_cache(cache_key, json.dumps(embedding.tolist()), ttl=settings.cache_ttl)
        
        return embedding
    
    def get_embeddings_batch(self, texts: List[str]) -> np.ndarray:
        """Get embeddings for multiple texts"""
        if not texts or not self.model:
            return np.zeros((len(texts), 384))
        
        # Separate cached and non-cached texts
        cached_embeddings = []
        non_cached_texts = []
        non_cached_indices = []
        
        for i, text in enumerate(texts):
            if self.cache_enabled:
                cache_key = self._get_cache_key(text)
                cached = get_cache(cache_key)
                if cached:
                    cached_embeddings.append(np.array(json.loads(cached)))
                else:
                    non_cached_texts.append(text)
                    non_cached_indices.append(i)
            else:
                non_cached_texts.append(text)
                non_cached_indices.append(i)
        
        # Generate embeddings for non-cached texts
        if non_cached_texts:
            new_embeddings = self.model.encode(non_cached_texts)
            
            # Cache new embeddings
            if self.cache_enabled:
                for text, embedding in zip(non_cached_texts, new_embeddings):
                    cache_key = self._get_cache_key(text)
                    set_cache(cache_key, json.dumps(embedding.tolist()), ttl=settings.cache_ttl)
        else:
            new_embeddings = np.array([])
        
        # Combine all embeddings
        all_embeddings = [None] * len(texts)
        
        # Place cached embeddings
        cached_idx = 0
        for i, text in enumerate(texts):
            if self.cache_enabled:
                cache_key = self._get_cache_key(text)
                cached = get_cache(cache_key)
                if cached:
                    all_embeddings[i] = np.array(json.loads(cached))
                    cached_idx += 1
                else:
                    # Find in new_embeddings
                    if non_cached_indices:
                        pos = non_cached_indices.index(i)
                        all_embeddings[i] = new_embeddings[pos]
            else:
                # All are in new_embeddings
                pos = non_cached_texts.index(text)
                all_embeddings[i] = new_embeddings[pos]
        
        return np.array(all_embeddings)
    
    def cosine_similarity(self, emb1: np.ndarray, emb2: np.ndarray) -> float:
        """Calculate cosine similarity between two embeddings"""
        if emb1 is None or emb2 is None:
            return 0.0
        
        dot_product = np.dot(emb1, emb2)
        norm1 = np.linalg.norm(emb1)
        norm2 = np.linalg.norm(emb2)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        return dot_product / (norm1 * norm2)