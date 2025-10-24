import re
import spacy
import nltk
from nltk.corpus import stopwords
from typing import List, Dict, Any
import json
import os

class TextPreprocessor:
    """Text preprocessing pipeline with robust error handling"""
    
    def __init__(self):
        self._ensure_nltk_data()
        self.stop_words = set(stopwords.words('english')) if hasattr(stopwords, 'words') else set()
        self.skills_dict = self._load_skills_dict()
        
        # Common section headers
        self.section_headers = [
            'experience', 'education', 'skills', 'projects', 
            'certifications', 'awards', 'summary', 'objective'
        ]
        
        # Try to load spaCy, but continue without it if not available
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except:
            self.nlp = None
            print("⚠️ spaCy model not available, using basic preprocessing")
    
    def _ensure_nltk_data(self):
        """Ensure basic NLTK data is available"""
        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            print("⚠️ NLTK punkt not found. Please run quick_fix.py")
    
    def _load_skills_dict(self) -> Dict[str, List[str]]:
        """Load skills dictionary"""
        default_skills = {
            "programming": ["python", "javascript", "java", "c++", "c#", "go", "rust", "swift", "kotlin"],
            "web": ["html", "css", "react", "vue", "angular", "django", "flask", "node.js", "express"],
            "databases": ["mysql", "postgresql", "mongodb", "redis", "sqlite", "oracle"],
            "devops": ["docker", "kubernetes", "aws", "azure", "gcp", "jenkins", "git", "ci/cd"],
            "data_science": ["pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "r", "matplotlib"],
            "mobile": ["android", "ios", "react native", "flutter", "swift", "kotlin"],
            "soft_skills": ["communication", "leadership", "teamwork", "problem solving", "agile", "scrum"]
        }
        
        skills_path = os.path.join(os.path.dirname(__file__), 'skills_dict.json')
        try:
            with open(skills_path, 'r') as f:
                return json.load(f)
        except:
            return default_skills
    
    def clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        if not text:
            return ""
        
        # Convert to lowercase
        text = text.lower()
        
        # Remove URLs, emails, phone numbers
        text = re.sub(r'http\S+|www\S+|https\S+', '', text)
        text = re.sub(r'\S+@\S+', '', text)
        text = re.sub(r'[\+\(]?[1-9][0-9 .\-\(\)]{8,}[0-9]', '', text)
        
        # Remove special characters but keep basic punctuation
        text = re.sub(r'[^\w\s.,!?;:]', ' ', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def tokenize_text(self, text: str) -> List[str]:
        """Robust tokenization with fallback"""
        try:
            # Try NLTK tokenization first
            return nltk.word_tokenize(text.lower())
        except:
            # Fallback to simple split
            return text.lower().split()
    
    def extract_skills(self, text: str) -> List[str]:
        """Extract skills from text with basic matching"""
        text_lower = text.lower()
        found_skills = []
        
        # Check against skills dictionary
        for category, skills in self.skills_dict.items():
            for skill in skills:
                if skill.lower() in text_lower:
                    found_skills.append(skill)
        
        return list(set(found_skills))
    
    def extract_sections(self, text: str) -> Dict[str, str]:
        """Basic section extraction"""
        sections = {}
        lines = text.split('\n')
        current_section = "other"
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            line_lower = line.lower()
            is_header = any(header in line_lower for header in self.section_headers)
            
            if is_header:
                current_section = line_lower
                sections[current_section] = ""
            else:
                if current_section in sections:
                    sections[current_section] += line + " "
                else:
                    sections[current_section] = line + " "
        
        # Clean sections
        for section in sections:
            sections[section] = sections[section].strip()
        
        return sections

# Global preprocessor instance
preprocessor = TextPreprocessor()