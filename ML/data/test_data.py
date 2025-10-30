"""
Test data generator for TrackRuit ML Service
Provides sample data for testing and development
"""

import json
import random
from typing import List, Dict, Any

def generate_sample_resumes() -> List[Dict[str, Any]]:
    """Generate sample resumes for testing"""
    resumes = [
        {
            "id": "resume_python_dev",
            "text": """
John Smith
Python Developer

Contact: john.smith@email.com | (555) 123-4567 | GitHub: github.com/johnsmith

SUMMARY
Experienced Python developer with 5+ years in web development and API design. 
Strong background in building scalable applications with Django and FastAPI.

EXPERIENCE
Senior Python Developer - Tech Solutions Inc. (2020-Present)
- Developed RESTful APIs using FastAPI serving 10,000+ daily requests
- Led migration from monolithic architecture to microservices
- Improved application performance by 45% through code optimization
- Implemented CI/CD pipelines using Docker and GitHub Actions

Python Developer - Web Services Co. (2018-2020)
- Built web applications using Django and PostgreSQL
- Created data processing scripts for ETL pipelines
- Collaborated with frontend team on API integration

EDUCATION
Bachelor of Science in Computer Science
State University (2014-2018)

SKILLS
Programming: Python, JavaScript, SQL, Bash
Frameworks: Django, FastAPI, Flask, React
Tools: Docker, Kubernetes, AWS, Git, PostgreSQL
Concepts: REST APIs, Microservices, CI/CD, Agile
""",
            "role": "python developer",
            "experience_years": 5
        },
        {
            "id": "resume_data_scientist",
            "text": """
Jane Doe
Data Scientist

Email: jane.doe@email.com | LinkedIn: linkedin.com/in/janedoe

PROFESSIONAL SUMMARY
Data scientist with 4 years of experience in machine learning and statistical analysis. 
Proven track record of delivering data-driven solutions for business problems.

EXPERIENCE
Data Scientist - Analytics Corp (2019-Present)
- Developed predictive models for customer churn with 85% accuracy
- Built NLP pipelines for sentiment analysis on customer reviews
- Created interactive dashboards using Tableau and Plotly
- Reduced data processing time by 60% through Spark optimization

Data Analyst - Insights Ltd. (2017-2019)
- Analyzed large datasets to identify business trends
- Created SQL queries for data extraction and reporting
- Built automated reporting systems

EDUCATION
Master of Science in Data Science
Tech University (2015-2017)

Bachelor of Science in Mathematics
College University (2011-2015)

TECHNICAL SKILLS
Programming: Python, R, SQL, Scala
ML Libraries: Scikit-learn, TensorFlow, PyTorch, XGBoost
Data Tools: Pandas, NumPy, Spark, Tableau, Jupyter
Statistics: Hypothesis testing, Regression, Clustering
""",
            "role": "data scientist", 
            "experience_years": 4
        }
    ]
    return resumes

def generate_sample_jobs() -> List[Dict[str, Any]]:
    """Generate sample job descriptions for testing"""
    jobs = [
        {
            "id": "job_python_backend",
            "title": "Senior Python Backend Developer",
            "company": "Cloud Technologies Inc.",
            "description": """
We are seeking a Senior Python Backend Developer to join our growing engineering team. 
The ideal candidate will have extensive experience in Python web development and cloud technologies.

Responsibilities:
- Design and develop scalable backend services using Python and FastAPI
- Build and maintain RESTful APIs for our web and mobile applications
- Implement database schemas and optimize queries for performance
- Deploy and manage applications on AWS cloud infrastructure
- Collaborate with frontend developers and product managers
- Write clean, tested, and documented code

Requirements:
- 5+ years of Python development experience
- Strong knowledge of FastAPI, Django, or Flask frameworks
- Experience with PostgreSQL, MongoDB, or similar databases
- Proficiency with AWS services (EC2, S3, RDS, Lambda)
- Knowledge of Docker and containerization
- Experience with Git and CI/CD pipelines

Nice to Have:
- Experience with microservices architecture
- Knowledge of message brokers (Redis, RabbitMQ)
- Understanding of system design principles
- Experience with testing frameworks (pytest)
""",
            "required_skills": ["python", "fastapi", "postgresql", "aws", "docker", "rest api"],
            "preferred_skills": ["microservices", "redis", "system design", "pytest"],
            "experience_level": "senior"
        },
        {
            "id": "job_ml_engineer",
            "title": "Machine Learning Engineer", 
            "company": "AI Innovations Ltd.",
            "description": """
Join our machine learning team to build cutting-edge AI solutions. 
We're looking for an ML Engineer with strong programming skills and ML expertise.

Responsibilities:
- Develop and deploy machine learning models into production
- Build data pipelines for training and inference
- Implement MLOps practices for model lifecycle management
- Collaborate with data scientists to productionize models
- Optimize model performance and scalability
- Monitor model performance and implement improvements

Requirements:
- 3+ years of experience in machine learning engineering
- Strong proficiency in Python and ML libraries (Scikit-learn, TensorFlow, PyTorch)
- Experience with data processing frameworks (Pandas, NumPy, Spark)
- Knowledge of ML deployment tools (Docker, Kubernetes, MLflow)
- Experience with cloud platforms (AWS, GCP, or Azure)
- Understanding of software engineering best practices

Nice to Have:
- Experience with deep learning and neural networks
- Knowledge of natural language processing (NLP)
- Experience with big data technologies
- Understanding of distributed computing
""",
            "required_skills": ["python", "machine learning", "tensorflow", "pytorch", "aws", "docker"],
            "preferred_skills": ["deep learning", "nlp", "spark", "mlops"],
            "experience_level": "mid-level"
        }
    ]
    return jobs

def generate_interview_test_cases() -> List[Dict[str, Any]]:
    """Generate test cases for interview prediction"""
    test_cases = []
    
    # High probability case
    test_cases.append({
        "applied_jobs": 20,
        "interviews_given": 8,
        "skills_strength": 0.9,
        "prep_hours": 30,
        "match_score_avg": 0.85,
        "resume_score": 0.9,
        "years_experience": 5,
        "expected_category": "high"
    })
    
    # Medium probability case  
    test_cases.append({
        "applied_jobs": 12,
        "interviews_given": 3,
        "skills_strength": 0.7,
        "prep_hours": 15,
        "match_score_avg": 0.7,
        "resume_score": 0.75,
        "years_experience": 2,
        "expected_category": "medium"
    })
    
    # Low probability case
    test_cases.append({
        "applied_jobs": 5,
        "interviews_given": 1,
        "skills_strength": 0.4,
        "prep_hours": 5,
        "match_score_avg": 0.5,
        "resume_score": 0.6,
        "years_experience": 1,
        "expected_category": "low"
    })
    
    return test_cases

def get_test_resume_text() -> str:
    """Get a sample resume text for testing"""
    return """
Software Engineer

Contact: test@example.com | (123) 456-7890

EXPERIENCE
Senior Developer - Test Company (2019-Present)
- Developed web applications using Python and Django
- Built REST APIs for mobile applications
- Managed database design and optimization

Developer - Previous Company (2017-2019)
- Created responsive web interfaces
- Implemented backend services

EDUCATION
BS Computer Science - Test University

SKILLS
Python, Django, JavaScript, SQL, Git, AWS
"""

def get_test_job_description() -> str:
    """Get a sample job description for testing"""
    return """
We are looking for a Software Engineer with Python experience.

Requirements:
- 3+ years of Python development
- Experience with web frameworks (Django, Flask)
- Knowledge of REST API development
- Database design skills
- Version control with Git

Nice to have:
- Cloud platform experience (AWS)
- Frontend development skills
"""

def save_test_data():
    """Save test data to JSON files"""
    # Save sample resumes
    with open('data/sample_resumes.json', 'w') as f:
        json.dump({"resumes": generate_sample_resumes()}, f, indent=2)
    
    # Save sample jobs  
    with open('data/sample_jobs.json', 'w') as f:
        json.dump({"jobs": generate_sample_jobs()}, f, indent=2)
    
    print("Test data saved to data/ directory")

if __name__ == "__main__":
    save_test_data()