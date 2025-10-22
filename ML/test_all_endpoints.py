#!/usr/bin/env python3
"""
Fixed testing script for TrackRuit ML Service
"""

import requests
import json
import time
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class TrackRuitTester:
    def __init__(self, base_url=None, api_key=None):
        self.base_url = base_url or os.getenv("BASE_URL", "http://localhost:8000")
        self.api_key = api_key or os.getenv("API_KEY")
        self.headers = {
            "X-API-Key": self.api_key,
            "Content-Type": "application/json"
        }
        print(f"🔧 Testing with URL: {self.base_url}")
        print(f"🔑 Using API Key: {self.api_key[:10]}...")  # Show first 10 chars for security
    
    def test_health(self):
        """Test health endpoint"""
        print("🧪 Testing Health Endpoint...")
        try:
            response = requests.get(f"{self.base_url}/ml/status")
            print(f"✅ Status: {response.status_code}")
            print(f"📊 Response: {response.json()}")
            return response.status_code == 200
        except Exception as e:
            print(f"❌ Health check failed: {e}")
            return False
    
    def test_match(self):
        """Test resume-job matching"""
        print("\n🧪 Testing Resume-Job Matching...")
        
        test_data = {
            "resume_text": "Experienced Python developer with 3 years in Django and Flask. Strong skills in REST APIs, database design, and cloud deployment. Built multiple web applications and microservices.",
            "job_description": "We are looking for a Python Developer with expertise in web frameworks like Django or Flask. Experience with REST APIs, database systems, and cloud platforms is required. The ideal candidate should have 2+ years of professional experience.",
            "use_cache": True
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/ml/match",
                json=test_data,
                headers=self.headers
            )
            print(f"✅ Status: {response.status_code}")
            if response.status_code == 200:
                result = response.json()
                print(f"📊 Match Score: {result.get('match_score', 'N/A')}")
                print(f"🔍 Skills Matched: {result.get('top_skills_matched', [])[:3]}")
                return True
            else:
                print(f"❌ Error: {response.text}")
                return False
        except Exception as e:
            print(f"❌ Match test failed: {e}")
            return False
    
    def test_recommend(self):
        """Test job recommendations"""
        print("\n🧪 Testing Job Recommendations...")
        
        test_data = {
            "resume_text": "Data scientist with Python, machine learning, and deep learning experience. Worked on NLP projects and predictive modeling.",
            "job_pool": [
                {
                    "id": "1",
                    "title": "Senior Data Scientist",
                    "company": "AI Tech Corp",
                    "description": "Looking for experienced data scientist with ML and Python skills. NLP experience is a plus."
                },
                {
                    "id": "2", 
                    "title": "Machine Learning Engineer",
                    "company": "ML Innovations",
                    "description": "Seeking ML engineer with Python, TensorFlow, and deployment experience."
                },
                {
                    "id": "3",
                    "title": "Data Analyst",
                    "company": "Analytics Co",
                    "description": "Data analyst role focusing on SQL, Python, and business intelligence."
                }
            ],
            "max_recommendations": 3
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/ml/recommend",
                json=test_data,
                headers=self.headers
            )
            print(f"✅ Status: {response.status_code}")
            if response.status_code == 200:
                result = response.json()
                jobs = result.get('recommended_jobs', [])
                print(f"📊 Jobs Recommended: {len(jobs)}")
                for job in jobs[:2]:  # Show first 2 jobs
                    print(f"  - {job.get('title')} (Score: {job.get('match_score', 'N/A')})")
                return True
            else:
                print(f"❌ Error: {response.text}")
                return False
        except Exception as e:
            print(f"❌ Recommendation test failed: {e}")
            return False
    
    def test_interview(self):
        """Test interview prediction"""
        print("\n🧪 Testing Interview Prediction...")
        
        test_data = {
            "applied_jobs": 15,
            "interviews_given": 3,
            "skills_strength": 0.8,
            "prep_hours": 20,
            "match_score_avg": 0.75,
            "resume_score": 0.85,
            "years_experience": 3
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/ml/interview",
                json=test_data,
                headers=self.headers
            )
            print(f"✅ Status: {response.status_code}")
            if response.status_code == 200:
                result = response.json()
                print(f"📊 Probability: {result.get('probability', 'N/A')}")
                print(f"📈 Confidence: {result.get('confidence', 'N/A')}")
                return True
            else:
                print(f"❌ Error: {response.text}")
                return False
        except Exception as e:
            print(f"❌ Interview test failed: {e}")
            return False
    
    def test_feedback(self):
        """Test resume feedback"""
        print("\n🧪 Testing Resume Feedback...")
        
        test_data = {
            "resume_text": "Python Developer with Django experience. Built web apps. Education: B.Tech in Computer Science. Skills: Python, Django, REST APIs.",
            "target_role": "Senior Python Developer"
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/ml/resume/feedback",
                json=test_data,
                headers=self.headers
            )
            print(f"✅ Status: {response.status_code}")
            if response.status_code == 200:
                result = response.json()
                print(f"📊 Overall Score: {result.get('overall_score', 'N/A')}")
                print(f"💡 Feedback: {len(result.get('feedback', []))} suggestions")
                return True
            else:
                print(f"❌ Error: {response.text}")
                return False
        except Exception as e:
            print(f"❌ Feedback test failed: {e}")
            return False
    
    def test_ats(self):
        """Test ATS compatibility"""
        print("\n🧪 Testing ATS Compatibility...")
        
        test_data = {
            "resume_text": "Python Developer with Django experience. Built web apps. Skills: Python, Django, REST APIs, SQL."
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/ml/ats",
                json=test_data,
                headers=self.headers
            )
            print(f"✅ Status: {response.status_code}")
            if response.status_code == 200:
                result = response.json()
                print(f"📊 ATS Score: {result.get('ats_score', 'N/A')}")
                print(f"⚠️ Issues: {len(result.get('issues', []))} found")
                return True
            else:
                print(f"❌ Error: {response.text}")
                return False
        except Exception as e:
            print(f"❌ ATS test failed: {e}")
            return False
    
    def test_all_endpoints(self):
        """Test all endpoints"""
        print("🚀 Starting Comprehensive TrackRuit ML Service Tests")
        print("=" * 60)
        
        tests = [
            self.test_health,
            self.test_match, 
            self.test_recommend,
            self.test_interview,
            self.test_feedback,
            self.test_ats
        ]
        
        results = []
        for test in tests:
            success = test()
            results.append(success)
            time.sleep(0.5)  # Small delay between tests
        
        print("\n" + "=" * 60)
        print("📋 Test Summary:")
        print(f"✅ Passed: {sum(results)}/{len(results)}")
        print(f"❌ Failed: {len(results) - sum(results)}/{len(results)}")
        
        if all(results):
            print("🎉 All tests passed! Service is working correctly.")
        else:
            print("💥 Some tests failed. Check the service configuration.")
        
        return all(results)

if __name__ == "__main__":
    # Use environment variables or defaults
    tester = TrackRuitTester()
    success = tester.test_all_endpoints()
    exit(0 if success else 1)