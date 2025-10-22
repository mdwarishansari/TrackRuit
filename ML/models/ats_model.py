import re
from typing import Dict, List, Any

from .base_model import BaseModel
from config import get_settings
from pipelines.preprocess import TextPreprocessor

settings = get_settings()

class ATSModel(BaseModel):
    """ATS Compatibility Model"""
    
    def __init__(self, version: str = None):
        super().__init__("ats", version or settings.ats_model_version)
        self.preprocessor = TextPreprocessor()
        self.ensure_loaded()
    
    def _create_default_model(self):
        """Create default ATS model"""
        self.is_loaded = True
    
    def preprocess(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Preprocess resume for ATS analysis"""
        resume_text = data.get('resume_text', '')
        
        return {
            'resume_text': resume_text,
            'clean_text': self.preprocessor.clean_text(resume_text)
        }
    
    def predict(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze ATS compatibility"""
        try:
            processed_data = self.preprocess(data)
            
            if not processed_data['resume_text']:
                return self._empty_response()
            
            # Check for various ATS issues
            format_issues = self._check_format_issues(processed_data['resume_text'])
            structural_issues = self._check_structural_issues(processed_data['resume_text'])
            keyword_status = self._analyze_keywords(processed_data)
            
            # Calculate overall ATS score
            ats_score = self._calculate_ats_score(format_issues, structural_issues, keyword_status)
            
            # Generate recommendations
            recommendations = self._generate_recommendations(format_issues, structural_issues, keyword_status)
            
            return {
                "ats_score": ats_score,
                "format_issues": format_issues,
                "structural_issues": structural_issues,
                "keyword_status": keyword_status,
                "model_version": self.get_version(),
                "recommendations": recommendations
            }
            
        except Exception as e:
            print(f"Error in ATS analysis: {e}")
            return self._error_response(str(e))
    
    def _check_format_issues(self, resume_text: str) -> List[str]:
        """Check for format-related ATS issues"""
        issues = []
        
        # Check for tables
        if re.search(r'\|\s*.+\s*\|', resume_text):
            issues.append("Tables detected - ATS may have trouble parsing")
        
        # Check for images/Graphics
        if re.search(r'\[img\]|\[image\]|graphic', resume_text, re.IGNORECASE):
            issues.append("Images or graphics mentioned - ATS cannot read images")
        
        # Check for headers/footers
        if re.search(r'header|footer', resume_text, re.IGNORECASE):
            issues.append("Headers/footers may cause parsing issues")
        
        # Check for columns
        if re.search(r'column|multicolumn', resume_text, re.IGNORECASE):
            issues.append("Multiple columns may not parse correctly")
        
        # Check file format indicators
        if re.search(r'\.docx?|\.pdf|\.pages', resume_text, re.IGNORECASE):
            issues.append("File format references should be removed")
        
        # Check for special characters that might cause issues
        special_chars = re.findall(r'[※§¶†‡•]', resume_text)
        if special_chars:
            issues.append(f"Uncommon special characters detected: {set(special_chars)}")
        
        return issues
    
    def _check_structural_issues(self, resume_text: str) -> List[str]:
        """Check for structural ATS issues"""
        issues = []
        
        lines = resume_text.split('\n')
        
        # Check section headers
        section_headers = ['experience', 'education', 'skills', 'projects']
        found_sections = []
        
        for line in lines:
            line_lower = line.strip().lower()
            for section in section_headers:
                if section in line_lower and len(line.split()) <= 3:
                    found_sections.append(section)
                    break
        
        # Missing essential sections
        if 'experience' not in found_sections:
            issues.append("Missing Experience section")
        if 'education' not in found_sections:
            issues.append("Missing Education section")
        if 'skills' not in found_sections:
            issues.append("Missing Skills section")
        
        # Check contact information
        contact_patterns = [
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',  # email
            r'\(\d{3}\)\s*\d{3}-\d{4}|\d{3}-\d{3}-\d{4}',  # phone
            r'linkedin\.com/in/|github\.com/'  # social links
        ]
        
        contact_info_found = any(re.search(pattern, resume_text) for pattern in contact_patterns)
        if not contact_info_found:
            issues.append("Contact information may be missing or hard to parse")
        
        # Check for very short resume
        word_count = len(resume_text.split())
        if word_count < 200:
            issues.append("Resume may be too short - consider adding more detail")
        elif word_count > 1500:
            issues.append("Resume may be too long - ATS prefers concise resumes")
        
        return issues
    
    def _analyze_keywords(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze keyword usage for ATS"""
        resume_text = data['clean_text']
        skills = self.preprocessor.extract_skills(resume_text)
        
        # Check for action verbs
        action_verbs = [
            'managed', 'developed', 'created', 'implemented', 'led', 
            'improved', 'increased', 'reduced', 'optimized', 'built'
        ]
        found_verbs = [verb for verb in action_verbs if verb in resume_text.lower()]
        
        # Check for quantifiable achievements
        quant_patterns = [
            r'\d+%', r'\$\d+', r'\d+\+', r'increased by', r'reduced by', 
            r'saved \$\d+', r'improved by \d+'
        ]
        quantifiable_achievements = any(re.search(pattern, resume_text.lower()) for pattern in quant_patterns)
        
        return {
            "found_skills": skills[:10],  # Top 10 skills
            "found_action_verbs": found_verbs,
            "has_quantifiable_achievements": quantifiable_achievements,
            "total_skills_found": len(skills),
            "skill_diversity": "good" if len(skills) >= 8 else "needs improvement"
        }
    
    def _calculate_ats_score(self, format_issues: List[str], structural_issues: List[str], keyword_status: Dict[str, Any]) -> int:
        """Calculate overall ATS score (0-100)"""
        score = 100
        
        # Deduct for format issues
        score -= len(format_issues) * 8
        
        # Deduct for structural issues
        score -= len(structural_issues) * 10
        
        # Adjust based on keywords
        if keyword_status['total_skills_found'] < 5:
            score -= 15
        elif keyword_status['total_skills_found'] < 8:
            score -= 5
        
        if not keyword_status['has_quantifiable_achievements']:
            score -= 10
        
        if len(keyword_status['found_action_verbs']) < 3:
            score -= 10
        
        return max(0, min(100, score))
    
    def _generate_recommendations(self, format_issues: List[str], structural_issues: List[str], keyword_status: Dict[str, Any]) -> List[str]:
        """Generate ATS improvement recommendations"""
        recommendations = []
        
        if format_issues:
            recommendations.append("Remove tables, images, and complex formatting for better ATS parsing.")
        
        if structural_issues:
            if "Missing Experience section" in structural_issues:
                recommendations.append("Add a clear Experience section with detailed work history.")
            if "Missing Education section" in structural_issues:
                recommendations.append("Include an Education section with degrees and institutions.")
            if "Missing Skills section" in structural_issues:
                recommendations.append("Create a dedicated Skills section for technical abilities.")
        
        if keyword_status['total_skills_found'] < 8:
            recommendations.append("Add more specific technical skills relevant to your target roles.")
        
        if not keyword_status['has_quantifiable_achievements']:
            recommendations.append("Include quantifiable achievements (numbers, percentages, $ amounts) to demonstrate impact.")
        
        if len(keyword_status['found_action_verbs']) < 3:
            recommendations.append("Use more action verbs (managed, developed, implemented) to start bullet points.")
        
        # Always include these general recommendations
        recommendations.append("Use standard section headings (Experience, Education, Skills) for better ATS parsing.")
        recommendations.append("Save your resume as a .docx or .pdf file for optimal ATS compatibility.")
        
        return recommendations[:5]  # Top 5 recommendations
    
    def explain(self, prediction: Dict[str, Any]) -> List[str]:
        """Generate explanation for ATS analysis"""
        explanations = []
        ats_score = prediction.get('ats_score', 0)
        
        if ats_score >= 80:
            explanations.append("Your resume has good ATS compatibility with minimal issues.")
        elif ats_score >= 60:
            explanations.append("Your resume has acceptable ATS compatibility but could be improved.")
        else:
            explanations.append("Your resume has significant ATS compatibility issues that need attention.")
        
        # Add specific issue explanations
        format_issues = prediction.get('format_issues', [])
        if format_issues:
            explanations.append(f"Format issues: {', '.join(format_issues[:2])}")
        
        structural_issues = prediction.get('structural_issues', [])
        if structural_issues:
            explanations.append(f"Structural issues: {', '.join(structural_issues[:2])}")
        
        return explanations
    
    def _empty_response(self) -> Dict[str, Any]:
        return {
            "ats_score": 0,
            "format_issues": [],
            "structural_issues": [],
            "keyword_status": {},
            "model_version": self.get_version(),
            "recommendations": [],
            "error": "Invalid input data"
        }
    
    def _error_response(self, error_msg: str) -> Dict[str, Any]:
        return {
            "ats_score": 0,
            "format_issues": [],
            "structural_issues": [],
            "keyword_status": {},
            "model_version": self.get_version(),
            "recommendations": [],
            "error": error_msg
        }