import pytest
import asyncio
from fastapi.testclient import TestClient
import json
import sys
import os

# Add parent directory to path to import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
from config import get_settings

client = TestClient(app)

# Test API Key (same as in .env for testing)
TEST_API_KEY = "test-api-key-123"

def test_health_check():
    """Test health check endpoint"""
    response = client.get("/ml/status")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "timestamp" in data
    assert "version" in data

def test_version_info():
    """Test version endpoint"""
    response = client.get("/ml/version")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "TrackRuit ML Service"

def test_models_list():
    """Test models listing endpoint"""
    response = client.get("/ml/models", headers={"X-API-Key": TEST_API_KEY})
    assert response.status_code == 200
    data = response.json()
    assert "match" in data
    assert "recommend" in data
    assert "interview" in data
    assert "feedback" in data
    assert "ats" in data

def test_match_endpoint():
    """Test resume-job matching endpoint"""
    sample_data = {
        "resume_text": "Experienced Python developer with 5 years in web development. Skilled in Django, Flask, and FastAPI. Strong background in REST APIs and database design.",
        "job_description": "We are looking for a Python developer with experience in web frameworks and API development. Knowledge of Django and FastAPI is required.",
        "use_cache": True
    }
    
    response = client.post(
        "/ml/match", 
        json=sample_data,
        headers={"X-API-Key": TEST_API_KEY}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "match_score" in data
    assert "top_skills_matched" in data
    assert "missing_skills" in data
    assert "model_version" in data
    assert isinstance(data["match_score"], float)
    assert 0 <= data["match_score"] <= 1

def test_batch_match_endpoint():
    """Test batch matching endpoint"""
    sample_data = {
        "resume_text": "Data scientist with experience in machine learning and Python. Skilled in pandas, scikit-learn, and TensorFlow.",
        "job_descriptions": [
            "Looking for a data scientist with ML experience and Python skills.",
            "Java developer position requiring Spring framework experience.",
            "Python developer role focusing on web development with Django."
        ]
    }
    
    response = client.post(
        "/ml/match/batch", 
        json=sample_data,
        headers={"X-API-Key": TEST_API_KEY}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert "ranked_indices" in data
    assert len(data["results"]) == 3
    assert len(data["ranked_indices"]) == 3

def test_recommend_endpoint():
    """Test job recommendation endpoint"""
    sample_data = {
        "resume_text": "Frontend developer with React and TypeScript experience. Skilled in modern JavaScript frameworks and CSS.",
        "job_pool": [
            {
                "id": "job1",
                "title": "React Developer",
                "company": "Tech Co",
                "description": "Seeking React developer with TypeScript experience for frontend role."
            },
            {
                "id": "job2", 
                "title": "Backend Developer",
                "company": "Tech Co",
                "description": "Java backend developer position with Spring framework."
            }
        ],
        "max_recommendations": 5
    }
    
    response = client.post(
        "/ml/recommend", 
        json=sample_data,
        headers={"X-API-Key": TEST_API_KEY}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "recommended_jobs" in data
    assert "total_jobs_considered" in data
    assert data["total_jobs_considered"] == 2

def test_interview_endpoint():
    """Test interview prediction endpoint"""
    sample_data = {
        "applied_jobs": 15,
        "interviews_given": 5,
        "skills_strength": 0.8,
        "prep_hours": 20,
        "match_score_avg": 0.75,
        "resume_score": 0.85,
        "years_experience": 3
    }
    
    response = client.post(
        "/ml/interview", 
        json=sample_data,
        headers={"X-API-Key": TEST_API_KEY}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "probability" in data
    assert "top_negative_factors" in data
    assert "top_positive_factors" in data
    assert "model_version" in data
    assert isinstance(data["probability"], float)
    assert 0 <= data["probability"] <= 1

def test_feedback_endpoint():
    """Test resume feedback endpoint"""
    sample_data = {
        "resume_text": "Software Engineer\n\nExperience: 5 years Python development\nSkills: Python, Django, React, SQL\nEducation: BS Computer Science",
        "target_role": "software engineer"
    }
    
    response = client.post(
        "/ml/resume/feedback", 
        json=sample_data,
        headers={"X-API-Key": TEST_API_KEY}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "overall_score" in data
    assert "keyword_score" in data
    assert "structure_score" in data
    assert "readability_score" in data
    assert "feedback" in data
    assert "section_analysis" in data

def test_ats_endpoint():
    """Test ATS analysis endpoint"""
    sample_data = {
        "resume_text": "John Doe\nSoftware Engineer\n\nExperience: Developed web applications using Python and Django. Managed databases and deployed on AWS."
    }
    
    response = client.post(
        "/ml/ats", 
        json=sample_data,
        headers={"X-API-Key": TEST_API_KEY}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "ats_score" in data
    assert "format_issues" in data
    assert "keyword_status" in data
    assert "structural_issues" in data
    assert "recommendations" in data
    assert isinstance(data["ats_score"], int)
    assert 0 <= data["ats_score"] <= 100

def test_authentication():
    """Test API key authentication"""
    sample_data = {
        "resume_text": "Test resume",
        "job_description": "Test job"
    }
    
    # Test without API key
    response = client.post("/ml/match", json=sample_data)
    assert response.status_code == 401
    
    # Test with wrong API key
    response = client.post(
        "/ml/match", 
        json=sample_data,
        headers={"X-API-Key": "wrong-key"}
    )
    assert response.status_code == 401

def test_invalid_input():
    """Test handling of invalid input"""
    # Test with empty resume text
    sample_data = {
        "resume_text": "",
        "job_description": "Test job description"
    }
    
    response = client.post(
        "/ml/match", 
        json=sample_data,
        headers={"X-API-Key": TEST_API_KEY}
    )
    assert response.status_code == 200  # Should handle gracefully
    data = response.json()
    assert "error" in data or data["match_score"] == 0.0

def test_large_input():
    """Test handling of large input text"""
    large_text = "Python " * 1000  # Create large text
    
    sample_data = {
        "resume_text": large_text,
        "job_description": "Test job description"
    }
    
    response = client.post(
        "/ml/match", 
        json=sample_data,
        headers={"X-API-Key": TEST_API_KEY}
    )
    assert response.status_code == 200  # Should handle large input

if __name__ == "__main__":
    pytest.main([__file__, "-v"])