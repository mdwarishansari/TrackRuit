import re
import spacy
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from rake_nltk import Rake
from typing import List, Dict, Any
import json
import os

# Download required NLTK data
try:
    nltk.download('punkt', quiet=True)
    nltk.download('stopwords', quiet=True)
    nltk.download('averaged_perceptron_tagger', quiet=True)
except:
    pass

class TextPreprocessor:
    """Text preprocessing pipeline for resumes and job descriptions"""
    
    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")
        self.stop_words = set(stopwords.words('english'))
        self.rake = Rake()
        self.skills_dict = self._load_skills_dict()
        
        # Common section headers in resumes
        self.section_headers = [
            'experience', 'education', 'skills', 'projects', 
            'certifications', 'awards', 'summary', 'objective'
        ]
    
    def _load_skills_dict(self) -> Dict[str, List[str]]:
        """Load skills dictionary from JSON file"""
        skills_path = os.path.join(os.path.dirname(__file__), 'skills_dict.json')
        try:
            with open(skills_path, 'r') as f:
                return json.load(f)
        except:
            # Return default skills dictionary
            return {
                "programming": ["python", "javascript", "java", "c++", "c#", "go", "rust", "swift", "kotlin"],
                "web": ["html", "css", "react", "vue", "angular", "django", "flask", "node.js", "express"],
                "databases": ["mysql", "postgresql", "mongodb", "redis", "sqlite", "oracle"],
                "devops": ["docker", "kubernetes", "aws", "azure", "gcp", "jenkins", "git", "ci/cd"],
                "data_science": ["pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "r", "matplotlib"],
                "mobile": ["android", "ios", "react native", "flutter", "swift", "kotlin"],
                "soft_skills": ["communication", "leadership", "teamwork", "problem solving", "agile", "scrum"]
            }
    
    def clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        if not text:
            return ""
        
        # Convert to lowercase
        text = text.lower()
        
        # Remove URLs
        text = re.sub(r'http\S+', '', text)
        
        # Remove email addresses
        text = re.sub(r'\S+@\S+', '', text)
        
        # Remove phone numbers
        text = re.sub(r'[\+\(]?[1-9][0-9 .\-\(\)]{8,}[0-9]', '', text)
        
        # Remove special characters but keep basic punctuation
        text = re.sub(r'[^\w\s\.\,\!\\?]', ' ', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def extract_skills(self, text: str) -> List[str]:
        """Extract skills from text"""
        text = self.clean_text(text)
        found_skills = []
        
        # Check against skills dictionary
        for category, skills in self.skills_dict.items():
            for skill in skills:
                # Use word boundaries to avoid partial matches
                if re.search(r'\b' + re.escape(skill) + r'\b', text):
                    found_skills.append(skill)
        
        # Use RAKE for additional keyword extraction
        self.rake.extract_keywords_from_text(text)
        keywords = self.rake.get_ranked_phrases()[:10]
        
        # Filter keywords that look like skills
        for keyword in keywords:
            if len(keyword.split()) <= 3 and any(char.isalpha() for char in keyword):
                found_skills.append(keyword)
        
        return list(set(found_skills))  # Remove duplicates
    
    def extract_sections(self, text: str) -> Dict[str, str]:
        """Extract resume sections"""
        sections = {}
        current_section = "other"
        lines = text.split('\n')
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # Check if line is a section header
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
        
        # Clean up sections
        for section in sections:
            sections[section] = sections[section].strip()
        
        return sections
    
    def calculate_keyword_density(self, text: str, keywords: List[str]) -> float:
        """Calculate keyword density in text"""
        if not text or not keywords:
            return 0.0
        
        text_words = text.lower().split()
        total_words = len(text_words)
        
        if total_words == 0:
            return 0.0
        
        keyword_count = 0
        for keyword in keywords:
            # Count occurrences of keyword (handling multi-word)
            keyword_pattern = re.compile(r'\b' + re.escape(keyword.lower()) + r'\b')
            keyword_count += len(keyword_pattern.findall(text.lower()))
        
        return keyword_count / total_words
    
    def tokenize_text(self, text: str) -> List[str]:
        """Tokenize text and remove stopwords"""
        tokens = word_tokenize(text.lower())
        filtered_tokens = [token for token in tokens if token not in self.stop_words and token.isalpha()]
        return filtered_tokens
    
    def get_readability_score(self, text: str) -> float:
        """Calculate simple readability score"""
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if s.strip()]
        
        if not sentences:
            return 0.0
        
        total_sentences = len(sentences)
        total_words = sum(len(sentence.split()) for sentence in sentences)
        total_chars = sum(len(sentence) for sentence in sentences)
        
        if total_sentences == 0 or total_words == 0:
            return 0.0
        
        avg_sentence_length = total_words / total_sentences
        avg_word_length = total_chars / total_words
        
        # Simple readability formula (inverse relationship with complexity)
        readability = 100 - (avg_sentence_length * 0.5 + avg_word_length * 10)
        return max(0.0, min(100.0, readability))