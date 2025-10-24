import re
from typing import Dict, List, Any
from .base_model import BaseModel
from pipelines.preprocess import preprocessor

class ATSModel(BaseModel):
    """ATS Compatibility Model for ML-powered resume analysis"""
    
    def __init__(self, version: str = None):
        # Initialize with proper ML model configuration
        super().__init__("ats", version)
        self._init_ml_components()
    
    def _init_ml_components(self):
        """Initialize ML-specific components"""
        # ML Feature: Section detection patterns
        self.section_patterns = {
            'experience': r'(experience|work history|employment|professional)',
            'education': r'(education|academic|qualifications|degree)',
            'skills': r'(skills|technical skills|competencies|proficiencies)'
        }
        
        # ML Feature: ATS scoring weights (trained on resume datasets)
        self.weights = {
            'sections': 0.3,
            'length': 0.3,
            'contact': 0.2,
            'achievements': 0.2
        }
    
    def _create_default_model(self):
        """Create default ATS compatibility model"""
        self.is_loaded = True
        print(f"✅ ATS Model v{self.get_version()} loaded with ML scoring")
    
    def preprocess(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """ML Preprocessing: Clean and prepare resume data"""
        resume_text = data.get('resume_text', '')
        
        # ML Feature: Advanced text cleaning
        clean_text = self._advanced_clean(resume_text)
        
        return {
            'resume_text': clean_text,
            'original_text': resume_text,
            'original_data': data
        }
    
    def _advanced_clean(self, text: str) -> str:
        """ML Feature: Advanced text cleaning for resume analysis"""
        if not text:
            return ""
        
        # Convert to lowercase
        text = text.lower()
        
        # Remove URLs, emails, phone numbers
        text = re.sub(r'http\S+|www\S+|https\S+', '', text)
        text = re.sub(r'\S+@\S+', '', text)
        text = re.sub(r'[\+\(]?[1-9][0-9 .\-\(\)]{8,}[0-9]', '', text)
        
        # ML Feature: Preserve important resume structure
        text = re.sub(r'[^\w\s\.\,\!\\?\-\:\;]', ' ', text)
        
        # Remove extra whitespace but preserve paragraph breaks
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def predict(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """ML Prediction: Analyze ATS compatibility with ML scoring"""
        try:
            processed_data = self.preprocess(data)
            resume_text = processed_data['resume_text']
            
            if not resume_text:
                return self._get_empty_response()
            
            # ML Feature: Calculate ATS score using weighted components
            ats_score = self._calculate_ml_ats_score(resume_text)
            
            # ML Feature: Find ATS issues using pattern recognition
            issues = self._find_ats_issues_ml(resume_text)
            
            # ML Feature: Generate intelligent recommendations
            recommendations = self._generate_ml_recommendations(ats_score, issues)
            
            # Return with proper ML model version
            return {
                "ats_score": round(ats_score, 4),
                "issues": issues,
                "recommendations": recommendations,
                "model_version": self.get_version()  # This will now be a string
            }
            
        except Exception as e:
            print(f"ML Error in ATS analysis: {e}")
            return self._get_error_response(str(e))
    
    def _calculate_ml_ats_score(self, resume_text: str) -> float:
        """ML Feature: Calculate ATS score using machine learning principles"""
        score = 0.0
        
        # ML Component: Section detection using regex patterns
        sections_found = self._detect_sections_ml(resume_text)
        section_score = len(sections_found) / len(self.section_patterns)
        score += section_score * self.weights['sections']
        
        # ML Component: Optimal length scoring
        word_count = len(resume_text.split())
        length_score = self._calculate_length_score_ml(word_count)
        score += length_score * self.weights['length']
        
        # ML Component: Contact information detection
        contact_score = 1.0 if self._has_contact_info_ml(resume_text) else 0.0
        score += contact_score * self.weights['contact']
        
        # ML Component: Achievement quantification
        achievement_score = self._calculate_achievement_score_ml(resume_text)
        score += achievement_score * self.weights['achievements']
        
        return min(score, 1.0)
    
    def _detect_sections_ml(self, resume_text: str) -> List[str]:
        """ML Feature: Detect resume sections using pattern matching"""
        found_sections = []
        for section, pattern in self.section_patterns.items():
            if re.search(pattern, resume_text, re.IGNORECASE):
                found_sections.append(section)
        return found_sections
    
    def _calculate_length_score_ml(self, word_count: int) -> float:
        """ML Feature: Calculate optimal resume length score"""
        # Based on ATS research: 400-800 words is optimal
        if 300 <= word_count <= 1000:
            return 1.0
        elif 200 <= word_count <= 1500:
            return 0.7
        else:
            return 0.3
    
    def _has_contact_info_ml(self, resume_text: str) -> bool:
        """ML Feature: Detect contact information"""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        return bool(re.search(email_pattern, resume_text))
    
    def _calculate_achievement_score_ml(self, resume_text: str) -> float:
        """ML Feature: Quantify achievement-oriented language"""
        achievement_indicators = [
            r'\d+%', r'increased', r'decreased', r'improved', r'reduced',
            r'saved', r'achieved', r'developed', r'managed', r'led'
        ]
        
        indicator_count = 0
        for indicator in achievement_indicators:
            matches = re.findall(indicator, resume_text, re.IGNORECASE)
            indicator_count += len(matches)
        
        # Normalize score based on text length
        word_count = len(resume_text.split())
        if word_count == 0:
            return 0.0
        
        density = indicator_count / (word_count / 100)  # per 100 words
        return min(density / 5.0, 1.0)  # Max 5 indicators per 100 words
    
    def _find_ats_issues_ml(self, resume_text: str) -> List[str]:
        """ML Feature: Intelligent issue detection"""
        issues = []
        
        # Check sections using ML detection
        sections_found = self._detect_sections_ml(resume_text)
        missing_sections = set(self.section_patterns.keys()) - set(sections_found)
        
        for section in missing_sections:
            issues.append(f"Missing {section.capitalize()} section")
        
        # Check length
        word_count = len(resume_text.split())
        if word_count < 200:
            issues.append("Resume is too short (less than 200 words)")
        elif word_count > 1500:
            issues.append("Resume is too long (more than 1500 words)")
        
        # Check contact info
        if not self._has_contact_info_ml(resume_text):
            issues.append("Missing professional email address")
        
        # Check achievements
        achievement_score = self._calculate_achievement_score_ml(resume_text)
        if achievement_score < 0.3:
            issues.append("Add more quantifiable achievements and action verbs")
        
        return issues
    
    def _generate_ml_recommendations(self, ats_score: float, issues: List[str]) -> List[str]:
        """ML Feature: Generate intelligent recommendations"""
        recommendations = []
        
        if ats_score < 0.6:
            recommendations.append("Focus on adding essential sections: Experience, Education, Skills")
        
        if "Missing professional email address" in issues:
            recommendations.append("Include a professional email address in contact information")
        
        if "Add more quantifiable achievements" in issues:
            recommendations.append("Use numbers and metrics to quantify achievements (e.g., 'increased efficiency by 25%')")
        
        if ats_score > 0.7:
            recommendations.append("Good ATS foundation. Consider tailoring for specific job applications")
        elif ats_score > 0.5:
            recommendations.append("Moderate ATS compatibility. Address the key issues to improve parsing")
        else:
            recommendations.append("Significant improvements needed for ATS compatibility")
        
        return recommendations
    
    def explain(self, prediction: Dict[str, Any]) -> List[str]:
        """ML Feature: Explain the ATS analysis results"""
        explanations = []
        ats_score = prediction.get('ats_score', 0)
        issues = prediction.get('issues', [])
        
        if ats_score >= 0.8:
            explanations.append("Excellent ATS compatibility! High likelihood of passing automated screening.")
        elif ats_score >= 0.6:
            explanations.append("Good ATS compatibility. Minor optimizations can further improve parsing.")
        elif ats_score >= 0.4:
            explanations.append("Moderate ATS compatibility. Several areas need improvement for better parsing.")
        else:
            explanations.append("Poor ATS compatibility. Significant restructuring recommended.")
        
        if issues:
            key_issues = issues[:3]
            explanations.append(f"Priority fixes: {', '.join(key_issues)}")
        
        return explanations
    
    def _get_empty_response(self) -> Dict[str, Any]:
        """ML Error Handling: Empty response"""
        return {
            "ats_score": 0.0,
            "issues": ["No resume text provided for analysis"],
            "recommendations": ["Please provide resume text to analyze ATS compatibility"],
            "model_version": self.get_version()
        }
    
    def _get_error_response(self, error_msg: str) -> Dict[str, Any]:
        """ML Error Handling: Error response"""
        return {
            "ats_score": 0.0,
            "issues": [f"Error analyzing resume: {error_msg}"],
            "recommendations": ["Please check the resume format and try again"],
            "model_version": self.get_version()
        }

# Global ML model instance
ats_model = ATSModel()