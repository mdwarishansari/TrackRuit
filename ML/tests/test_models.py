import pytest
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.match_model import MatchModel
from models.recommend_model import RecommendModel
from models.interview_model import InterviewModel
from models.feedback_model import FeedbackModel
from models.ats_model import ATSModel

class TestMatchModel:
    def setup_method(self):
        self.model = MatchModel()
        self.sample_data = {
            'resume_text': 'Python developer with Django experience and REST API skills.',
            'job_description': 'We need a Python developer with Django framework knowledge and API development experience.'
        }

    def test_preprocess(self):
        processed = self.model.preprocess(self.sample_data)
        assert isinstance(processed, tuple)
        assert len(processed) == 2
        assert isinstance(processed[0], str)
        assert isinstance(processed[1], str)

    def test_predict(self):
        result = self.model.predict(self.sample_data)
        assert isinstance(result, dict)
        assert 'match_score' in result
        assert 'top_skills_matched' in result
        assert 'missing_skills' in result
        assert 'model_version' in result
        assert 0 <= result['match_score'] <= 1

    def test_explain(self):
        prediction = self.model.predict(self.sample_data)
        explanations = self.model.explain(prediction)
        assert isinstance(explanations, list)
        assert all(isinstance(exp, str) for exp in explanations)

    def test_empty_input(self):
        empty_data = {'resume_text': '', 'job_description': ''}
        result = self.model.predict(empty_data)
        assert result['match_score'] == 0.0
        assert 'error' in result

class TestRecommendModel:
    def setup_method(self):
        self.model = RecommendModel()
        self.sample_data = {
            'resume_text': 'Data scientist with machine learning experience.',
            'job_pool': [
                {
                    'id': '1',
                    'title': 'Data Scientist',
                    'description': 'Looking for data scientist with ML experience.'
                },
                {
                    'id': '2', 
                    'title': 'Web Developer',
                    'description': 'Frontend developer role with React.'
                }
            ]
        }

    def test_preprocess(self):
        processed = self.model.preprocess(self.sample_data)
        assert isinstance(processed, dict)
        assert 'resume_text' in processed
        assert 'job_pool' in processed

    def test_predict(self):
        result = self.model.predict(self.sample_data)
        assert isinstance(result, dict)
        assert 'recommended_jobs' in result
        assert 'model_version' in result
        assert 'total_jobs_considered' in result
        assert result['total_jobs_considered'] == 2

    def test_explain(self):
        prediction = self.model.predict(self.sample_data)
        explanations = self.model.explain(prediction)
        assert isinstance(explanations, list)

class TestInterviewModel:
    def setup_method(self):
        self.model = InterviewModel()
        self.sample_data = {
            'applied_jobs': 10,
            'interviews_given': 3,
            'skills_strength': 0.8,
            'prep_hours': 15,
            'match_score_avg': 0.7,
            'resume_score': 0.8,
            'years_experience': 2
        }

    def test_preprocess(self):
        processed = self.model.preprocess(self.sample_data)
        assert isinstance(processed, dict)
        assert all(key in processed for key in self.sample_data.keys())

    def test_predict(self):
        result = self.model.predict(self.sample_data)
        assert isinstance(result, dict)
        assert 'probability' in result
        assert 'top_negative_factors' in result
        assert 'top_positive_factors' in result
        assert 0 <= result['probability'] <= 1

    def test_rule_based_prediction(self):
        features = self.model.preprocess(self.sample_data)
        probability = self.model._rule_based_prediction(features)
        assert 0 <= probability <= 1

    def test_generate_factors(self):
        features = self.model.preprocess(self.sample_data)
        probability = self.model._rule_based_prediction(features)
        factors = self.model._generate_factors(features, probability)
        assert 'negative' in factors
        assert 'positive' in factors
        assert isinstance(factors['negative'], list)
        assert isinstance(factors['positive'], list)

class TestFeedbackModel:
    def setup_method(self):
        self.model = FeedbackModel()
        self.sample_data = {
            'resume_text': 'Software Engineer\n\nExperience: 5 years Python\nSkills: Python, Django\nEducation: BS CS',
            'target_role': 'software engineer'
        }

    def test_preprocess(self):
        processed = self.model.preprocess(self.sample_data)
        assert isinstance(processed, dict)
        assert 'resume_text' in processed
        assert 'sections' in processed
        assert 'skills' in processed

    def test_predict(self):
        result = self.model.predict(self.sample_data)
        assert isinstance(result, dict)
        assert 'overall_score' in result
        assert 'keyword_score' in result
        assert 'structure_score' in result
        assert 'readability_score' in result
        assert 'feedback' in result
        assert all(0 <= result[key] <= 1 for key in ['overall_score', 'keyword_score', 'structure_score', 'readability_score'])

    def test_calculate_keyword_score(self):
        processed = self.model.preprocess(self.sample_data)
        score = self.model._calculate_keyword_score(processed)
        assert 0 <= score <= 1

    def test_get_expected_keywords(self):
        keywords = self.model._get_expected_keywords('software engineer')
        assert isinstance(keywords, list)
        assert len(keywords) > 0

class TestATSModel:
    def setup_method(self):
        self.model = ATSModel()
        self.sample_data = {
            'resume_text': 'John Doe\nSoftware Engineer\n\nExperience: Python development\nSkills: Python, SQL'
        }

    def test_preprocess(self):
        processed = self.model.preprocess(self.sample_data)
        assert isinstance(processed, dict)
        assert 'resume_text' in processed
        assert 'clean_text' in processed

    def test_predict(self):
        result = self.model.predict(self.sample_data)
        assert isinstance(result, dict)
        assert 'ats_score' in result
        assert 'format_issues' in result
        assert 'structural_issues' in result
        assert 'keyword_status' in result
        assert 'recommendations' in result
        assert 0 <= result['ats_score'] <= 100

    def test_check_format_issues(self):
        issues = self.model._check_format_issues(self.sample_data['resume_text'])
        assert isinstance(issues, list)

    def test_calculate_ats_score(self):
        format_issues = []
        structural_issues = []
        keyword_status = {'total_skills_found': 5, 'has_quantifiable_achievements': True, 'found_action_verbs': ['developed']}
        score = self.model._calculate_ats_score(format_issues, structural_issues, keyword_status)
        assert 0 <= score <= 100

def test_all_models_loaded():
    """Test that all models can be initialized and loaded"""
    models = [
        MatchModel(),
        RecommendModel(), 
        InterviewModel(),
        FeedbackModel(),
        ATSModel()
    ]
    
    for model in models:
        assert model.is_loaded, f"{model.model_name} failed to load"
        assert hasattr(model, 'predict')
        assert hasattr(model, 'explain')

if __name__ == "__main__":
    pytest.main([__file__, "-v"])