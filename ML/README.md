# 🧠 TrackRuit ML Service

**AI-Powered Resume Analysis & Job Matching Microservice**

[![Live Demo](https://img.shields.io/badge/LIVE-DEMO-brightgreen)](https://trackruit-ml.onrender.com)  
[![API Docs](https://img.shields.io/badge/API-Docs-blue)](https://trackruit-ml.onrender.com/ml/docs)  
[![License](https://img.shields.io/badge/License-MIT-purple)](LICENSE)

---

## 🌟 Overview

**TrackRuit ML Service** is a modern **ML/NLP microservice** for intelligent resume parsing, job matching, interview success prediction, and actionable career guidance.  
It empowers candidates to optimize resumes for ATS, discover personalized job opportunities, and evaluate interview readiness efficiently.

### 🎯 Problems Solved

- **Resume-Job Mismatch:** Most resumes fail due to poor formatting or skill gaps.
- **Inefficient Screening:** Recruiters spend <6 seconds per resume.
- **Skill Gap Analysis:** Identify missing or underrepresented skills.
- **Interview Insights:** Predict success probability and provide actionable feedback.

### 💡 Key Solutions

- **Smart Matching:** Semantic similarity scoring between resumes and job descriptions.
- **ATS Optimization:** Automatic resume compatibility evaluation.
- **Personalized Recommendations:** Job suggestions tailored to candidate skills.
- **Predictive Analytics:** Interview outcome probabilities.
- **Actionable Feedback:** Resume improvement recommendations.

---

## 🚀 Features

### 🔍 Core ML Capabilities

| Feature                      | Input                        | Output                                    |
| ---------------------------- | ---------------------------- | ----------------------------------------- |
| Resume-Job Match             | Resume text, Job description | Match score, Skills analysis              |
| Smart Job Recommendations    | Resume text, Job pool        | Ranked job recommendations                |
| Interview Success Prediction | Candidate metrics            | Probability, Positive/Negative factors    |
| Resume Feedback & Analysis   | Resume text                  | Scores, Section-wise feedback             |
| ATS Compatibility Check      | Resume text                  | ATS score, Format issues, Fix suggestions |

### ⚡ Advanced Capabilities

- 🧠 Semantic understanding with **Sentence-BERT**
- ⚡ Real-time inference (<500 ms average)
- 🔒 API key authentication & input validation
- 💾 Redis-based caching for faster responses
- 📊 Explainable AI & transparent reasoning
- 🔄 Model versioning & A/B testing
- 📈 Health & performance monitoring

---

## 🛠 Tech Stack

**Backend:** FastAPI, Uvicorn, Python 3.11+, Pydantic  
**ML/NLP:** scikit-learn, sentence-transformers, spaCy, NLTK, RAKE  
**Data & Caching:** Redis, MongoDB (optional), Joblib  
**DevOps & Tooling:** Docker, pytest, python-dotenv

---

## 🏗 Architecture

```

Client → FastAPI ML Service → Preprocessing → Embeddings → Model Inference → Response

```

- Embeddings cached for 24 hrs
- Frequent queries cached for faster response
- Models preloaded in memory
- Smart invalidation on version updates

---

## 📁 Project Structure

```

├── ML
│   ├── data 📂        # Sample datasets & test data
│   │   ├── sample_jobs.json 📝
│   │   ├── sample_resumes.json 📝
│   │   └── test_data.py 🧪
│   ├── models 🤖      # ML & NLP model implementations
│   │   ├── **init**.py
│   │   ├── ats_model.py ⚡
│   │   ├── base_model.py 🏗️
│   │   ├── feedback_model.py ✍️
│   │   ├── interview_model.py 🎯
│   │   ├── match_model.py 🔍
│   │   └── recommend_model.py 💡
│   ├── pipelines 🔄
│   │   ├── **init**.py
│   │   ├── embeddings.py 🧠
│   │   ├── preprocess.py 🧹
│   │   └── skills_dict.json 📚
│   ├── routes 🌐
│   │   ├── **init**.py
│   │   ├── ats.py 📝
│   │   ├── feedback.py ✍️
│   │   ├── health.py ❤️
│   │   ├── interview.py 🎯
│   │   ├── match.py 🔍
│   │   └── recommend.py 💡
│   ├── scripts 🛠️
│   │   ├── download_models.py ⬇️
│   │   ├── setup_environment.py ⚙️
│   │   ├── setup_production.py 🚀
│   │   └── train_models.py 🏋️‍♂️
│   ├── tests ✅
│   │   ├── test_data 🧪
│   │   ├── **init**.py
│   │   ├── test_api.py 🌐
│   │   └── test_models.py 🤖
│   ├── utils 🧩
│   │   ├── **init**.py
│   │   ├── cache.py 💾
│   │   ├── logger.py 📝
│   │   ├── security.py 🔒
│   │   └── validators.py ✅
│   ├── .dockerignore 🐳
│   ├── .gitignore ❌
│   ├── Dockerfile 🐳
│   ├── README.md 📄
│   ├── build.sh 🏗️
│   ├── config.py ⚙️
│   ├── docker-compose.yml 🐳
│   ├── main.py 🚀
│   ├── render.yaml 🌐
│   ├── requirements.txt 📦
│   └── test_all_endpoints.py 🧪

```

---

## ⚙️ Installation & Setup

```bash
git clone https://github.com/mdwarishansari/trackruit-ml.git
cd trackruit-ml/ML

python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/Mac
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env

python scripts/download_models.py
python scripts/train_models.py

python main.py
```

### 🐳 Docker

```bash
docker build -t trackruit-ml .
docker run -p 8000:8000 --env-file .env trackruit-ml
# or using Docker Compose
docker-compose up --build
```

---

## 🔧 Configuration

`.env` Example:

```env
HOST=0.0.0.0
PORT=8000
WORKERS=4
API_KEY=your-secure-api-key
REDIS_URL=redis://localhost:6379
MONGO_URI=mongodb://localhost:27017/trackruit
MODEL_DIR=./models
EMBEDDING_MODEL=all-MiniLM-L6-v2
CACHE_TTL=86400
ENABLE_CACHE=true
ENABLE_MONITORING=true
```

---

## 🎯 API Endpoints

| Endpoint              | Method | Description                  |
| --------------------- | ------ | ---------------------------- |
| `/ml/status`          | GET    | Health check                 |
| `/ml/version`         | GET    | Service version info         |
| `/ml/models`          | GET    | Loaded model list            |
| `/ml/match`           | POST   | Resume-job similarity        |
| `/ml/recommend`       | POST   | Job recommendations          |
| `/ml/interview`       | POST   | Interview success prediction |
| `/ml/resume/feedback` | POST   | Resume scoring & feedback    |
| `/ml/ats`             | POST   | ATS compatibility check      |

### 🔹 Example Usage

```python
import requests

resp = requests.post(
    "http://localhost:8000/ml/match",
    json={
        "resume_text": "Python developer with Django...",
        "job_description": "We need Python developer with web framework experience..."
    },
    headers={"X-API-Key": "your-api-key"}
)

print(resp.json())
# {"match_score": 0.75, "top_skills_matched": ["python", "django"]}
```

---

## 🧪 Testing

- Health check: `GET /ml/status` → `{"status": "healthy"}`
- Version info: `GET /ml/version`
- Swagger docs: `GET /ml/docs`
- Batch ML endpoint tests: `tests/test_all_endpoints.py`

---

## 📊 Model Details

| Model     | Purpose                  | Algorithm               |
| --------- | ------------------------ | ----------------------- |
| Match     | Resume-job similarity    | TF-IDF + Sentence-BERT  |
| Recommend | Job ranking              | Hybrid scoring          |
| Interview | Success prediction       | Rule-based → ML         |
| Feedback  | Resume scoring & advice  | Multi-factor            |
| ATS       | Compatibility validation | Rule-based + heuristics |

---

## 🔮 Future Roadmap

- **Q2 2026:** Multi-language resume parsing, analytics dashboard
- **Q4 2026:** Transformer-based models, career path & salary prediction, skill-gap analysis

---

## ⚠️ Critical Issues & Corrections

1. **Model Scoring:** Ensure realistic score ranges (0.6–0.9 for good resumes)
2. **Security:** Enforce API key usage, add rate limiting
3. **Error Handling:** Wrap predictions in try/except with fallback
4. **Input Validation:** Resume length & content checks in `validators.py`
5. **Performance:** Enable GZipMiddleware for faster responses

---

## 🤝 Contributing

```bash
git clone https://github.com/mdwarishansari/trackruit-ml.git
git checkout -b feature/new-update
# Implement changes, run tests, commit, push, open PR
```

Follow **PEP 8**, write tests, update docs, and submit PRs.

---

## 📄 License

MIT License – see [LICENSE](LICENSE)

---

## 📞 Support

GitHub: [@mdwarishansari](https://github.com/mdwarishansari)
Website: [http://trackruit.com](http://trackruit.com)

---

<div align="center">
Built with ❤️ by Mohammad Warish Ansari  
_Transforming careers through AI_
</div>
```
