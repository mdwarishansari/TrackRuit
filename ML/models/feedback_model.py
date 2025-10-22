import re
from typing import Dict, List, Any
from collections import Counter

from .base_model import BaseModel
from config import get_settings
from pipelines.preprocess import TextPreprocessor

settings = get_settings()

class FeedbackModel(BaseModel):
    """Resume Feedback Model"""
    
    def __init__(self, version: str = None):
        super().__init__("feedback", version or settings.feedback_model_version)
        self.preprocessor = TextPreprocessor()
        self.ensure_loaded()
    
    def _create_default_model(self):
        """Create default feedback model"""
        self.is_loaded = True
    
    def preprocess(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Preprocess resume for feedback analysis"""
        resume_text = data.get('resume_text', '')
        target_role = data.get('target_role', 'software engineer')
        
        # Clean and extract sections
        clean_text = self.preprocessor.clean_text(resume_text)
        sections = self.preprocessor.extract_sections(resume_text)
        skills = self.preprocessor.extract_skills(resume_text)
        
        return {
            'resume_text': clean_text,
            'target_role': target_role.lower(),
            'sections': sections,
            'skills': skills,
            'original_text': resume_text
        }
    
    def predict(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate resume feedback"""
        try:
            processed_data = self.preprocess(data)
            
            if not processed_data['resume_text']:
                return self._empty_response()
            
            # Calculate various scores
            keyword_score = self._calculate_keyword_score(processed_data)
            structure_score = self._calculate_structure_score(processed_data)
            readability_score = self._calculate_readability_score(processed_data)
            
            # Overall score (weighted average)
            overall_score = (
                keyword_score * 0.4 +
                structure_score * 0.3 +
                readability_score * 0.3
            )
            
            # Generate feedback
            feedback = self._generate_feedback(processed_data, {
                'keyword_score': keyword_score,
                'structure_score': structure_score,
                'readability_score': readability_score
            })
            
            # Section analysis
            section_analysis = self._analyze_sections(processed_data['sections'])
            
            return {
                "overall_score": round(overall_score, 4),
                "keyword_score": round(keyword_score, 4),
                "structure_score": round(structure_score, 4),
                "readability_score": round(readability_score, 4),
                "feedback": feedback,
                "model_version": self.get_version(),
                "section_analysis": section_analysis
            }
            
        except Exception as e:
            print(f"Error in feedback generation: {e}")
            return self._error_response(str(e))
    
    def _calculate_keyword_score(self, data: Dict[str, Any]) -> float:
        """Calculate keyword coverage score"""
        skills = data['skills']
        target_role = data['target_role']
        resume_text = data['resume_text']
        
        # Get expected keywords for target role
        expected_keywords = self._get_expected_keywords(target_role)
        
        if not expected_keywords:
            return 0.7  # Default score if no specific keywords
        
        # Calculate coverage
        found_keywords = [kw for kw in expected_keywords if kw in resume_text.lower()]
        coverage = len(found_keywords) / len(expected_keywords) if expected_keywords else 0
        
        # Also consider skill density
        word_count = len(resume_text.split())
        skill_density = len(skills) / max(word_count / 100, 1)  # skills per 100 words
        
        # Combined score
        score = (coverage * 0.7) + (min(skill_density * 0.1, 0.3))
        return max(0.0, min(1.0, score))
    
    def _calculate_structure_score(self, data: Dict[str, Any]) -> float:
        """Calculate resume structure score"""
        sections = data['sections']
        resume_text = data['original_text']
        
        score = 0.0
        
        # Check for essential sections
        essential_sections = ['experience', 'education', 'skills']
        found_essential = sum(1 for section in essential_sections if section in sections)
        score += (found_essential / len(essential_sections)) * 0.4
        
        # Check section length balance
        section_lengths = [len(content.split()) for content in sections.values() if content]
        if section_lengths:
            avg_length = sum(section_lengths) / len(section_lengths)
            balanced = all(0.3 * avg_length <= length <= 3 * avg_length for length in section_lengths)
            score += 0.3 if balanced else 0.1
        
        # Check overall length
        word_count = len(resume_text.split())
        if 300 <= word_count <= 800:  # Ideal resume length
            score += 0.3
        elif 200 <= word_count <= 1200:  # Acceptable range
            score += 0.2
        else:
            score += 0.1
        
        return max(0.0, min(1.0, score))
    
    def _calculate_readability_score(self, data: Dict[str, Any]) -> float:
        """Calculate readability score"""
        resume_text = data['original_text']
        
        # Use the preprocessor's readability method
        readability = self.preprocessor.get_readability_score(resume_text)
        
        # Convert to 0-1 scale
        return readability / 100.0
    
    def _get_expected_keywords(self, target_role: str) -> List[str]:
        """Get expected keywords for target role"""
        role_keywords = {
            'software engineer': ['python', 'javascript', 'java', 'react', 'node.js', 'sql', 'git', 'docker', 'aws'],
            'data scientist': ['python', 'r', 'sql', 'machine learning', 'statistics', 'pandas', 'numpy', 'visualization'],
            'devops engineer': ['docker', 'kubernetes', 'aws', 'azure', 'ci/cd', 'jenkins', 'terraform', 'linux'],
            'frontend developer': ['javascript', 'react', 'vue', 'angular', 'html', 'css', 'typescript', 'responsive'],
            'backend developer': ['python', 'java', 'node.js', 'spring', 'django', 'flask', 'api', 'microservices'],
            'full stack developer': ['react', 'node.js', 'python', 'javascript', 'mongodb', 'express', 'aws', 'docker']
        }
        
        # Find best matching role
        for role, keywords in role_keywords.items():
            if role in target_role:
                return keywords
        
        # Default to software engineer keywords
        return role_keywords['software engineer']
    
    def _generate_feedback(self, data: Dict[str, Any], scores: Dict[str, float]) -> List[str]:
        """Generate specific feedback points"""
        feedback = []
        sections = data['sections']
        skills = data['skills']
        
        # Keyword feedback
        if scores['keyword_score'] < 0.6:
            feedback.append("Consider adding more role-specific keywords to improve ATS compatibility.")
        elif scores['keyword_score'] < 0.8:
            feedback.append("Good keyword coverage, but could be strengthened with more technical terms.")
        else:
            feedback.append("Excellent keyword coverage for the target role.")
        
        # Structure feedback
        if 'experience' not in sections:
            feedback.append("Add an Experience section to highlight your work history.")
        if 'education' not in sections:
            feedback.append("Include an Education section with your academic background.")
        if 'skills' not in sections:
            feedback.append("Create a dedicated Skills section to showcase your technical abilities.")
        
        # Skills feedback
        if len(skills) < 5:
            feedback.append("Consider adding more specific technical skills to your resume.")
        elif len(skills) > 15:
            feedback.append("Your skills list is comprehensive. Consider focusing on the most relevant ones.")
        
        # Readability feedback
        if scores['readability_score'] < 0.6:
            feedback.append("Improve readability by using shorter sentences and bullet points.")
        
        # Action verbs check
        action_verbs = ['developed', 'created', 'implemented', 'managed', 'led', 'improved', 'optimized']
        has_action_verbs = any(verb in data['resume_text'].lower() for verb in action_verbs)
        if not has_action_verbs:
            feedback.append("Use more action verbs (developed, created, implemented) to describe your achievements.")
        
        return feedback[:5]  # Limit to top 5 feedback points
    
    def _analyze_sections(self, sections: Dict[str, str]) -> Dict[str, Any]:
        """Analyze resume sections"""
        analysis = {}
        
        for section_name, content in sections.items():
            word_count = len(content.split())
            analysis[section_name] = {
                'word_count': word_count,
                'has_content': word_count > 0,
                'content_preview': content[:100] + '...' if len(content) > 100 else content
            }
        
        return analysis
    
    def explain(self, prediction: Dict[str, Any]) -> List[str]:
        """Generate explanation for feedback"""
        explanations = []
        overall_score = prediction.get('overall_score', 0)
        
        if overall_score >= 0.8:
            explanations.append("Your resume is well-structured with strong keyword coverage.")
        elif overall_score >= 0.6:
            explanations.append("Your resume is good but has some areas for improvement.")
        else:
            explanations.append("Your resume needs significant improvements in multiple areas.")
        
        # Add specific score explanations
        keyword_score = prediction.get('keyword_score', 0)
        if keyword_score < 0.6:
            explanations.append("Focus on adding more relevant keywords for better ATS performance.")
        
        structure_score = prediction.get('structure_score', 0)
        if structure_score < 0.6:
            explanations.append("Improve the structure by ensuring all essential sections are present.")
        
        return explanations
    
    def _empty_response(self) -> Dict[str, Any]:
        return {
            "overall_score": 0.0,
            "keyword_score": 0.0,
            "structure_score": 0.0,
            "readability_score": 0.0,
            "feedback": [],
            "model_version": self.get_version(),
            "section_analysis": {},
            "error": "Invalid input data"
        }
    
    def _error_response(self, error_msg: str) -> Dict[str, Any]:
        return {
            "overall_score": 0.0,
            "keyword_score": 0.0,
            "structure_score": 0.0,
            "readability_score": 0.0,
            "feedback": [],
            "model_version": self.get_version(),
            "section_analysis": {},
            "error": error_msg
        }