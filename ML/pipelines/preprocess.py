import re
import os
import nltk
from typing import List, Dict, Any
import json

class TextPreprocessor:
    """Text preprocessing pipeline with robust error handling"""
    
    def __init__(self):
        self._ensure_nltk_data()
        self.stop_words = self._get_stopwords()
        self.skills_dict = self._load_skills_dict()
        
        # Common section headers
        self.section_headers = [
            'experience', 'education', 'skills', 'projects', 
            'certifications', 'awards', 'summary', 'objective'
        ]
    
    def _ensure_nltk_data(self):
        """Ensure NLTK data is available with fallbacks"""
        try:
            # Set NLTK data path to project directory
            nltk_data_path = './nltk_data'
            if os.path.exists(nltk_data_path):
                nltk.data.path.append(nltk_data_path)
            
            # Try to find punkt tokenizer
            try:
                nltk.data.find('tokenizers/punkt')
            except LookupError:
                print("⚠️ NLTK punkt not found. Using basic tokenization.")
                
        except Exception as e:
            print(f"⚠️ NLTK setup issue: {e}. Using fallback methods.")
    
    def _get_stopwords(self):
        """Get stopwords with fallback to basic list"""
        try:
            from nltk.corpus import stopwords
            return set(stopwords.words('english'))
        except:
            # Fallback basic stopwords
            basic_stopwords = {
                'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 
                'you', "you're", "you've", "you'll", "you'd", 'your', 'yours', 
                'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 
                "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 
                'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 
                'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 
                'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 
                'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 
                'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 
                'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 
                'through', 'during', 'before', 'after', 'above', 'below', 'to', 
                'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 
                'again', 'further', 'then', 'once', 'here', 'there', 'when', 
                'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 
                'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 
                'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 
                'can', 'will', 'just', 'don', "don't", 'should', "should've", 
                'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', 
                "aren't", 'couldn', "couldn't", 'didn', "didn't", 'doesn', 
                "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 
                'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn', "mustn't", 
                'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 
                'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"
            }
            return basic_stopwords
    
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