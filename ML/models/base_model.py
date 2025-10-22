from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
import json
import joblib
import os
from datetime import datetime

from config import get_settings

settings = get_settings()

class BaseModel(ABC):
    """Base class for all ML models"""
    
    def __init__(self, model_name: str, version: str = "v1"):
        self.model_name = model_name
        self.version = version
        self.model = None
        self.is_loaded = False
        self.model_path = os.path.join(settings.model_dir, f"{model_name}-{version}.joblib")
        self.metadata_path = os.path.join(settings.model_dir, f"{model_name}-{version}.json")
        
    @abstractmethod
    def preprocess(self, data: Any) -> Any:
        """Preprocess input data"""
        pass
    
    @abstractmethod
    def predict(self, data: Any) -> Dict[str, Any]:
        """Make prediction"""
        pass
    
    @abstractmethod
    def explain(self, prediction: Dict[str, Any]) -> List[str]:
        """Explain the prediction"""
        pass
    
    def load_model(self) -> bool:
        """Load model from disk"""
        try:
            if os.path.exists(self.model_path):
                self.model = joblib.load(self.model_path)
                self.is_loaded = True
                return True
            else:
                print(f"Model file not found: {self.model_path}")
                return False
        except Exception as e:
            print(f"Error loading model {self.model_name}: {str(e)}")
            return False
    
    def save_model(self) -> bool:
        """Save model to disk"""
        try:
            os.makedirs(settings.model_dir, exist_ok=True)
            if self.model:
                joblib.dump(self.model, self.model_path)
                self._save_metadata()
                return True
            return False
        except Exception as e:
            print(f"Error saving model {self.model_name}: {str(e)}")
            return False
    
    def _save_metadata(self):
        """Save model metadata"""
        metadata = {
            "model_name": self.model_name,
            "version": self.version,
            "created_at": datetime.now().isoformat(),
            "model_path": self.model_path
        }
        with open(self.metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
    
    def get_metadata(self) -> Optional[Dict[str, Any]]:
        """Get model metadata"""
        try:
            with open(self.metadata_path, 'r') as f:
                return json.load(f)
        except:
            return None
    
    def ensure_loaded(self):
        """Ensure model is loaded, fallback to default if not"""
        if not self.is_loaded:
            if not self.load_model():
                self._create_default_model()
    
    def _create_default_model(self):
        """Create a default model implementation"""
        # This should be implemented by subclasses
        # For now, just mark as loaded with None model
        self.is_loaded = True
    
    def get_version(self) -> str:
        """Get model version"""
        return f"{self.model_name}-{self.version}"