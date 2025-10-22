"""
Input validation utilities for TrackRuit ML Service
"""

import re
from typing import Any, Dict, List, Optional
from fastapi import HTTPException

from config import get_settings

settings = get_settings()

class InputValidator:
    """Input validation class for ML service"""
    
    @staticmethod
    def validate_resume_text(text: str) -> bool:
        """Validate resume text input"""
        if not text or not text.strip():
            return False
        
        if len(text.strip()) < 10:
            return False
            
        if len(text) > settings.max_text_length:
            return False
        
        # Check for excessive special characters (potential garbage/noise)
        alnum_ratio = sum(1 for c in text if c.isalnum() or c.isspace()) / len(text)
        if alnum_ratio < 0.5:  # Less than 50% alphanumeric
            return False
            
        return True
    
    @staticmethod
    def validate_job_description(text: str) -> bool:
        """Validate job description text"""
        return InputValidator.validate_resume_text(text)
    
    @staticmethod
    def validate_interview_features(features: Dict[str, Any]) -> List[str]:
        """Validate interview prediction features"""
        errors = []
        
        required_fields = [
            'applied_jobs', 'interviews_given', 'skills_strength', 
            'prep_hours', 'match_score_avg', 'resume_score', 'years_experience'
        ]
        
        for field in required_fields:
            if field not in features:
                errors.append(f"Missing required field: {field}")
                continue
                
            value = features[field]
            
            if field in ['applied_jobs', 'interviews_given', 'prep_hours', 'years_experience']:
                if not isinstance(value, int) or value < 0:
                    errors.append(f"{field} must be a non-negative integer")
                    
            elif field in ['skills_strength', 'match_score_avg', 'resume_score']:
                if not isinstance(value, (int, float)) or not (0 <= value <= 1):
                    errors.append(f"{field} must be a float between 0 and 1")
        
        return errors
    
    @staticmethod
    def validate_job_pool(job_pool: List[Dict[str, Any]]) -> List[str]:
        """Validate job pool for recommendations"""
        errors = []
        
        if not job_pool:
            errors.append("Job pool cannot be empty")
            return errors
            
        if len(job_pool) > 1000:
            errors.append("Job pool too large (max 1000 jobs)")
            
        for i, job in enumerate(job_pool):
            if not isinstance(job, dict):
                errors.append(f"Job {i} must be a dictionary")
                continue
                
            if 'description' not in job:
                errors.append(f"Job {i} missing description")
            elif not InputValidator.validate_job_description(job['description']):
                errors.append(f"Job {i} has invalid description")
        
        return errors
    
    @staticmethod
    def sanitize_text(text: str) -> str:
        """Sanitize text input"""
        if not text:
            return ""
            
        # Remove excessive whitespace
        text = ' '.join(text.split())
        
        # Truncate if too long
        if len(text) > settings.max_text_length:
            text = text[:settings.max_text_length]
            
        return text
    
    @staticmethod
    def validate_api_input(input_data: Dict[str, Any], endpoint: str) -> Dict[str, Any]:
        """Validate API input based on endpoint"""
        sanitized_data = {}
        errors = []
        
        if endpoint == "match":
            if 'resume_text' not in input_data:
                errors.append("Missing resume_text")
            else:
                if not InputValidator.validate_resume_text(input_data['resume_text']):
                    errors.append("Invalid resume_text")
                else:
                    sanitized_data['resume_text'] = InputValidator.sanitize_text(input_data['resume_text'])
                    
            if 'job_description' not in input_data:
                errors.append("Missing job_description")
            else:
                if not InputValidator.validate_job_description(input_data['job_description']):
                    errors.append("Invalid job_description")
                else:
                    sanitized_data['job_description'] = InputValidator.sanitize_text(input_data['job_description'])
                    
            if 'use_cache' in input_data:
                sanitized_data['use_cache'] = bool(input_data['use_cache'])
                
        elif endpoint == "recommend":
            if 'resume_text' not in input_data:
                errors.append("Missing resume_text")
            else:
                if not InputValidator.validate_resume_text(input_data['resume_text']):
                    errors.append("Invalid resume_text")
                else:
                    sanitized_data['resume_text'] = InputValidator.sanitize_text(input_data['resume_text'])
                    
            if 'job_pool' not in input_data:
                errors.append("Missing job_pool")
            else:
                job_errors = InputValidator.validate_job_pool(input_data['job_pool'])
                errors.extend(job_errors)
                if not job_errors:
                    sanitized_data['job_pool'] = input_data['job_pool']
                    
            if 'max_recommendations' in input_data:
                max_rec = input_data['max_recommendations']
                if not isinstance(max_rec, int) or not (1 <= max_rec <= 50):
                    errors.append("max_recommendations must be integer between 1 and 50")
                else:
                    sanitized_data['max_recommendations'] = max_rec
                    
            if 'user_history' in input_data:
                sanitized_data['user_history'] = input_data['user_history']
                
        elif endpoint == "interview":
            feature_errors = InputValidator.validate_interview_features(input_data)
            errors.extend(feature_errors)
            if not feature_errors:
                sanitized_data = input_data
                
        elif endpoint == "feedback":
            if 'resume_text' not in input_data:
                errors.append("Missing resume_text")
            else:
                if not InputValidator.validate_resume_text(input_data['resume_text']):
                    errors.append("Invalid resume_text")
                else:
                    sanitized_data['resume_text'] = InputValidator.sanitize_text(input_data['resume_text'])
                    
            if 'target_role' in input_data:
                role = input_data['target_role']
                if not isinstance(role, str) or len(role.strip()) < 2:
                    errors.append("target_role must be at least 2 characters")
                else:
                    sanitized_data['target_role'] = role.strip()
                    
        elif endpoint == "ats":
            if 'resume_text' not in input_data:
                errors.append("Missing resume_text")
            else:
                if not InputValidator.validate_resume_text(input_data['resume_text']):
                    errors.append("Invalid resume_text")
                else:
                    sanitized_data['resume_text'] = InputValidator.sanitize_text(input_data['resume_text'])
        
        if errors:
            raise HTTPException(
                status_code=400,
                detail={"errors": errors}
            )
            
        return sanitized_data

# Global validator instance
validator = InputValidator()