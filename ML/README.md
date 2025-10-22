---
# 🧠 TrackRuit ML Service

# Live link – [trackruit-ml.onrender.com](https://trackruit-ml.onrender.com)

<div align="center">

![TrackRuit](https://img.shields.io/badge/TrackRuit-ML%20Service-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green)
![Python](https://img.shields.io/badge/Python-3.11%2B-yellow)
![Machine Learning](https://img.shields.io/badge/ML-NLP%20%7C%20Recommendation%20%7C%20Prediction-orange)

**Intelligent Resume Analysis & Job Matching Microservice**

[![API Documentation](https://img.shields.io/badge/API-Docs-brightgreen)](http://localhost:8000/ml/docs)
[![Health Check](https://img.shields.io/badge/Health-Check-lightgrey)](http://localhost:8000/ml/status)
[![License](https://img.shields.io/badge/License-MIT-purple)](LICENSE)

*Transform resumes into career opportunities with AI-powered intelligence.*

</div>
---

## 📋 Table of Contents

- [🌟 Overview](#-overview)
- [🚀 Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [🏗 Architecture](#-architecture)
- [📁 Project Structure](#-project-structure)
- [⚙️ Installation & Setup](#️-installation--setup)
- [🔧 Configuration](#-configuration)
- [🎯 API Endpoints](#-api-endpoints)
- [🧪 Testing](#-testing)
- [📊 Model Details](#-model-details)
- [🔮 Future Roadmap](#-future-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [📞 Support](#-support)

---

## 🌟 Overview

**TrackRuit ML Service** is a production-grade machine learning microservice that powers intelligent resume analysis, job matching, and career guidance.
Built with **FastAPI** and modern **ML/NLP** libraries, it enables semantic resume parsing, skill extraction, personalized job recommendations, and interview success prediction.

### 🎯 Problems Solved

- **Resume-Job Mismatch:** 75% of resumes are rejected by ATS due to poor optimization.
- **Inefficient Screening:** Recruiters spend 6+ seconds on average per resume.
- **Skill Gap Analysis:** Candidates struggle to identify missing skills for target roles.
- **Interview Insights:** Lack of data-driven feedback on preparation and success probability.

### 💡 Our Solution

- **Smart Matching:** AI-powered resume-to-job similarity scoring.
- **ATS Optimization:** Automated compatibility scoring.
- **Personalized Recommendations:** Content-based job suggestions.
- **Predictive Analytics:** Interview success probability forecasting.
- **Actionable Feedback:** Targeted resume improvement suggestions.

---

## 🚀 Features

### 🔍 Core ML Capabilities

| Feature                          | Description                                            | Input                        | Output                                    |
| -------------------------------- | ------------------------------------------------------ | ---------------------------- | ----------------------------------------- |
| **Resume-Job Match**             | Semantic similarity between resume and job description | Resume text, Job description | Match score, Skills analysis              |
| **Smart Job Recommendations**    | Content-based job suggestions                          | Resume text, Job pool        | Ranked job recommendations                |
| **Interview Success Prediction** | Probability-based interview outcome                    | User metrics, Experience     | Success probability, Factors              |
| **Resume Feedback & Analysis**   | Resume quality and improvement suggestions             | Resume text                  | Scores, Feedback, Section insights        |
| **ATS Compatibility Check**      | Checks for ATS optimization                            | Resume text                  | ATS score, Format issues, Fix suggestions |

### ⚡ Advanced Capabilities

- 🧠 **Semantic Understanding** — Sentence-BERT embeddings for deep context.
- ⚡ **Real-time Processing** — Sub-500 ms average inference time.
- 🔒 **Enterprise Security** — API-key auth and strict input validation.
- 💾 **Smart Caching** — Redis-based caching for embeddings and results.
- 📊 **Explainable AI** — Transparent model reasoning and scoring.
- 🔄 **Model Versioning** — Seamless upgrades and A/B testing.
- 📈 **Monitoring** — Built-in health and performance endpoints.

---

## 🛠 Tech Stack

### ⚙️ Backend

- **FastAPI** — modern async web framework
- **Uvicorn** — ASGI server for concurrency
- **Pydantic** — data validation and configuration
- **Python 3.11+**

### 🤖 Machine Learning & NLP

- **scikit-learn**, **sentence-transformers**, **spaCy**, **NLTK**, **RAKE**

### 🗄️ Data & Caching

- **Redis** — caching
- **MongoDB** — optional persistent storage
- **Joblib** — model serialization

### 🔧 DevOps & Tooling

- **pytest**, **Docker**, **Gunicorn**, **python-dotenv**

---

## 🏗 Architecture

### 🎪 System Overview

```
┌─────────────────┐    HTTP/REST    ┌──────────────────┐
│   Node.js       │ ◄─────────────► │   FastAPI ML     │
│   Backend       │                 │   Microservice   │
└─────────────────┘                 └──────────────────┘
                                            │
                                            ▼
┌─────────────────────────────────────────────────────────┐
│                   ML Processing Layer                    │
├─────────────────┬─────────────────┬─────────────────────┤
│ Embedding       │ Text            │ Feature             │
│ Manager         │ Preprocessor    │ Engineering         │
└─────────────────┴─────────────────┴─────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   Model Inference Layer                  │
├────────────┬─────────────┬─────────────┬────────────────┤
│ Match      │ Recommend   │ Interview   │ Feedback & ATS │
└────────────┴─────────────┴─────────────┴────────────────┘
```

### 🔄 Data Flow

1. Request received via FastAPI
2. Text preprocessing and normalization
3. Embedding generation (SBERT / TF-IDF)
4. Model inference (parallelized)
5. Aggregation and explanation
6. Structured JSON response

### 💾 Caching

- **Embeddings** cached 24 hrs
- **Results** cached for frequent queries
- **Models** pre-loaded in memory
- **Smart invalidation** on version change

---

## 📁 Project Structure

```
├── 📁 ML
│   ├── 📁 data                     # Sample data and datasets
│   │   ├── ⚙️ sample_jobs.json
│   │   ├── ⚙️ sample_resumes.json
│   │   └── 🐍 test_data.py
│   ├── 📁 models                   # ML models
│   │   ├── 🐍 __init__.py
│   │   ├── 🐍 ats_model.py
│   │   ├── 🐍 base_model.py
│   │   ├── 🐍 feedback_model.py
│   │   ├── 🐍 interview_model.py
│   │   ├── 🐍 match_model.py
│   │   └── 🐍 recommend_model.py
│   ├── 📁 pipelines               # Processing pipelines
│   │   ├── 🐍 __init__.py
│   │   ├── 🐍 embeddings.py
│   │   ├── 🐍 preprocess.py
│   │   └── ⚙️ skills_dict.json
│   ├── 📁 routes                  # API endpoints
│   │   ├── 🐍 __init__.py
│   │   ├── 🐍 ats.py
│   │   ├── 🐍 feedback.py
│   │   ├── 🐍 health.py
│   │   ├── 🐍 interview.py
│   │   ├── 🐍 match.py
│   │   └── 🐍 recommend.py
│   ├── 📁 scripts                # Utility scripts
│   │   ├── 🐍 download_models.py
│   │   ├── 🐍 setup_environment.py
│   │   └── 🐍 train_models.py
│   ├── 📁 tests                  # Unit & integration tests
│   │   ├── 📁 test_data
│   │   ├── 🐍 __init__.py
│   │   ├── 🐍 test_api.py
│   │   └── 🐍 test_models.py
│   ├── 📁 utils                # Helper functions
│   │   ├── 🐍 __init__.py
│   │   ├── 🐍 cache.py
│   │   ├── 🐍 logger.py
│   │   ├── 🐍 security.py
│   │   └── 🐍 validators.py
│   ├── ⚙️ .gitignore
│   ├── 🐳 Dockerfile
│   ├── 🐍 config.py
│   ├── 🐍 main.py
│   └── 📄 requirements.txt
├── 📝 README.md
└── 📄 requirements.txt
```

---

## ⚙️ Installation & Setup

### 🧩 Prerequisites

- Python 3.11+
- Redis (required for caching)
- MongoDB (optional for persistence)

### 🚀 Quick Start

```bash
# Clone repo
git clone https://github.com/your-org/trackruit-ml.git
cd trackruit-ml/ML

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate    # Windows
# or
source .venv/bin/activate # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit values as needed

# Download and train models
python scripts/download_models.py
python scripts/train_models.py

# Run service
python main.py
```

### 🐳 Docker

```bash
docker build -t trackruit-ml .
docker run -p 8000:8000 --env-file .env trackruit-ml
# or
docker-compose up --build
```

---

## 🔧 Configuration

Example `.env`:

```env
HOST=0.0.0.0
PORT=8000
WORKERS=4
LOG_LEVEL=info
API_KEY=your-secure-api-key
REDIS_URL=redis://localhost:6379
MONGO_URI=mongodb://localhost:27017/trackruit
MODEL_DIR=./models
EMBEDDING_MODEL=all-MiniLM-L6-v2
CACHE_TTL=86400
ENABLE_CACHE=true
ENABLE_MONITORING=true
```

Tweak worker count, cache limits, and batch size for your hardware.

---

## 🎯 API Endpoints

### 📍 Base URL

```
http://localhost:8000/ml
```

### 🩺 Health

| Endpoint   | Method | Description       |
| ---------- | ------ | ----------------- |
| `/status`  | GET    | Service health    |
| `/version` | GET    | Version info      |
| `/models`  | GET    | Loaded model list |

---

### 🔍 Resume-Job Match

**POST** `/ml/match`

```json
{
  "resume_text": "Experienced Python developer...",
  "job_description": "Looking for Python developer with Django experience...",
  "use_cache": true
}
```

_Response:_

```json
{
  "match_score": 0.86,
  "top_skills_matched": ["Python", "Django", "REST APIs"],
  "missing_skills": ["Docker", "Kubernetes"],
  "model_version": "match-v1"
}
```

---

### 💼 Job Recommendations

**POST** `/ml/recommend`

```json
{
  "resume_text": "Data scientist with ML experience...",
  "job_pool": [
    { "id": "job1", "title": "Data Scientist", "description": "..." }
  ],
  "max_recommendations": 10
}
```

---

### 📈 Interview Prediction

**POST** `/ml/interview`
Predicts success probability based on candidate data.

---

### 📝 Resume Feedback

**POST** `/ml/resume/feedback`

---

### 📄 ATS Compatibility

**POST** `/ml/ats`

---

## 🧪 Testing

```bash
pytest tests/ -v
pytest tests/ --cov=. --cov-report=html
```

- API coverage > 95 %
- Unit + integration tested
- Error handling validated

---

## 📊 Model Details

| Model         | Purpose                   | Algorithm               |
| ------------- | ------------------------- | ----------------------- |
| **Match**     | Resume-job similarity     | TF-IDF + Sentence-BERT  |
| **Recommend** | Content-based job ranking | Hybrid scoring          |
| **Interview** | Success prediction        | Rule-based → ML         |
| **Feedback**  | Resume scoring & advice   | Multi-factor            |
| **ATS**       | Compatibility validation  | Rule-based + heuristics |

---

## 🔮 Future Roadmap

### Phase 1 (Current)

✅ Matching, Recommendations, Interview, Feedback, ATS

### Phase 2 (Q2 2026)

- Resume parsing (PDF/DOCX)
- Multi-language support
- Advanced analytics dashboard

### Phase 3 (Q4 2026)

- Transformer-based deep learning models
- Career path & salary predictions
- Skill-gap analysis

---

## 🤝 Contributing

```bash
# Fork and clone
git clone https://github.com/your-username/trackruit-ml.git
cd trackruit-ml
git checkout -b feature/awesome-update
# Make changes
pytest tests/ -v
git commit -m "Add awesome update"
git push origin feature/awesome-update
# Open a Pull Request
```

Follow **PEP 8**, write tests, and update docs.

---

## 📄 License

This project is licensed under the **MIT License** – see [LICENSE](LICENSE) for details.

---

## 📞 Support

For issues, discussions, or contributions:
👉 **[GitHub — @mdwarishansari](https://github.com/mdwarishansari)**

---

<div align="center">

**Built with ❤️ by Mohammad Warish Ansari**
_Transforming careers through artificial intelligence._

[🏠 Home](http://trackruit.com) • [📚 Docs](http://docs.trackruit.com) • [🐙 GitHub](https://github.com/mdwarishansari)

</div>

---
