from abc import ABC, abstractmethod
from typing import Any, Dict, List
import logging
from config import get_settings

settings = get_settings()

class BaseModel(ABC):
    """Base class for all ML models with proper versioning and initialization"""
    
    def __init__(self, model_type: str, version: str = None):
        self.model_type = model_type
        # Use provided version or get from settings
        self._version = version or getattr(settings, f"{model_type}_model_version", "v1")
        self.is_loaded = False
        self.logger = logging.getLogger(f"{model_type}_model")
        self._ensure_proper_init()
    
    def save_model(self):
        """Save model to disk - basic implementation"""
        try:
            import joblib
            model_path = f"./models/{self.model_type}-{self.get_version()}.joblib"
            joblib.dump({"model_type": self.model_type, "version": self.get_version()}, model_path)
            print(f"✅ Model saved: {model_path}")
            return True
        except Exception as e:
            print(f"❌ Failed to save model: {e}")
            return False
    
    def _ensure_proper_init(self):
        """Ensure proper initialization order for ML models"""
        if not self.is_loaded:
            self._create_default_model()
    
    def ensure_loaded(self):
        """Public method to ensure model is loaded - can be called externally"""
        if not self.is_loaded:
            self._create_default_model()
    
    @abstractmethod
    def predict(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Make prediction - must be implemented by subclasses"""
        pass
    
    def preprocess(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Preprocess input data - can be overridden by subclasses"""
        return data
    
    def explain(self, prediction: Dict[str, Any]) -> List[str]:
        """Generate explanation for prediction - can be overridden"""
        return [f"Prediction made using {self.model_type} model v{self._version}"]
    
    def _create_default_model(self):
        """Create default model implementation - override in subclasses"""
        self.is_loaded = True
        self.logger.info(f"Created default {self.model_type} model v{self._version}")
    
    def get_version(self) -> str:
        """Get model version - safe to call anytime"""
        return self._version
    
    def get_type(self) -> str:
        """Get model type"""
        return self.model_type
    
    def get_metadata(self) -> Dict[str, Any]:
        """Get model metadata"""
        return {
            "model_type": self.model_type,
            "version": self._version,
            "is_loaded": self.is_loaded
        }