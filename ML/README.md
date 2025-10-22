# 🧠 TrackRuit ML Service

# Live link – [https://trackruit-ml.onrender.com](https://trackruit-ml.onrender.com)

<div align="center">

![TrackRuit](https://img.shields.io/badge/TrackRuit-ML%20Service-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green)
![Python](https://img.shields.io/badge/Python-3.11%2B-yellow)
![Machine Learning](https://img.shields.io/badge/ML-NLP%20%7C%20Recommendation%20%7C%20Prediction-orange)

**Intelligent Resume Analysis & Job Matching Microservice**

[![API Documentation](https://img.shields.io/badge/API-Docs-brightgreen)](https://trackruit-ml.onrender.com/ml/docs)
[![Health Check](https://img.shields.io/badge/Health-Check-lightgrey)](https://trackruit-ml.onrender.com/ml/status)
[![License](https://img.shields.io/badge/License-MIT-purple)](LICENSE)

_Transform resumes into career opportunities with AI-powered intelligence._

</div>

---

## 📋 Table of Contents

- [🌟 Overview](#-overview)
- [🚀 Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [🏗 Architecture](#-architecture)
- [📁 Project Structure](#-project-structure)
- [⚙️ Installation & Setup](#-installation--setup)
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

**TrackRuit ML Service** is a production-grade machine learning microservice for intelligent resume analysis, job matching, and career guidance.
Built with **FastAPI** and modern **ML/NLP** libraries, it provides semantic resume parsing, skill extraction, personalized job recommendations, and interview success prediction.

### 🎯 Problems Solved

- **Resume-Job Mismatch:** 75% of resumes rejected by ATS due to poor optimization.
- **Inefficient Screening:** Recruiters spend <6 seconds per resume.
- **Skill Gap Analysis:** Candidates struggle to identify missing skills.
- **Interview Insights:** Lack of data-driven feedback on success probability.

### 💡 Our Solution

- **Smart Matching:** AI-powered resume-to-job similarity scoring.
- **ATS Optimization:** Automated compatibility scoring.
- **Personalized Recommendations:** Content-based job suggestions.
- **Predictive Analytics:** Interview success probability forecasting.
- **Actionable Feedback:** Targeted resume improvement suggestions.

---

## 🚀 Features

### 🔍 Core ML Capabilities

| Feature                          | Description                                          | Input                        | Output                                    |
| -------------------------------- | ---------------------------------------------------- | ---------------------------- | ----------------------------------------- |
| **Resume-Job Match**             | Semantic similarity between resume & job description | Resume text, Job description | Match score, Skills analysis              |
| **Smart Job Recommendations**    | Content-based job suggestions                        | Resume text, Job pool        | Ranked job recommendations                |
| **Interview Success Prediction** | Probability-based interview outcome                  | User metrics, Experience     | Success probability, Factors              |
| **Resume Feedback & Analysis**   | Resume quality & improvement suggestions             | Resume text                  | Scores, Feedback, Section insights        |
| **ATS Compatibility Check**      | Checks for ATS optimization                          | Resume text                  | ATS score, Format issues, Fix suggestions |

### ⚡ Advanced Capabilities

- 🧠 **Semantic Understanding:** Sentence-BERT embeddings
- ⚡ **Real-time Processing:** <500 ms average inference
- 🔒 **Enterprise Security:** API-key auth & input validation
- 💾 **Smart Caching:** Redis-based
- 📊 **Explainable AI:** Transparent model reasoning
- 🔄 **Model Versioning:** Seamless upgrades & A/B testing
- 📈 **Monitoring:** Built-in health & performance endpoints

---

## 🛠 Tech Stack

### ⚙️ Backend

- **FastAPI**, **Uvicorn**, **Pydantic**, **Python 3.11+**

### 🤖 Machine Learning & NLP

- **scikit-learn**, **sentence-transformers**, **spaCy**, **NLTK**, **RAKE**

### 🗄️ Data & Caching

- **Redis**, **MongoDB** (optional), **Joblib**

### 🔧 DevOps & Tooling

- **pytest**, **Docker**, **python-dotenv**

---

## 🏗 Architecture

```
Client → FastAPI ML Service → Preprocessing → Embeddings → Model Inference → Response
```

- Embeddings cached for 24 hrs
- Results cached for frequent queries
- Models preloaded in memory
- Smart invalidation on version change

---

## 📁 Project Structure

_(Only core files shown for brevity)_

```
TrackRuit/
├── ML/                                # Main ML microservice folder
│   ├── data/                          # Sample data and datasets
│   │   ├── sample_jobs.json           # Sample jobs dataset
│   │   ├── sample_resumes.json        # Sample resumes dataset
│   │   └── test_data.py               # Test data generator / helper
│   ├── models/                        # ML model code (without .joblib/JSON)
│   │   ├── __init__.py
│   │   ├── ats_model.py               # ATS scoring model
│   │   ├── base_model.py              # Base model classes
│   │   ├── feedback_model.py          # Resume feedback model
│   │   ├── interview_model.py         # Interview success model
│   │   ├── match_model.py             # Resume-job matching model
│   │   └── recommend_model.py         # Job recommendation model
│   ├── pipelines/                     # Data processing pipelines
│   │   ├── __init__.py
│   │   ├── embeddings.py              # Embedding generation
│   │   ├── preprocess.py              # Text preprocessing
│   │   └── skills_dict.json           # Skills reference dictionary
│   ├── routes/                        # API endpoints
│   │   ├── __init__.py
│   │   ├── ats.py
│   │   ├── feedback.py
│   │   ├── health.py
│   │   ├── interview.py
│   │   ├── match.py
│   │   └── recommend.py
│   ├── scripts/                       # Utility scripts
│   │   ├── download_models.py         # Download pre-trained models
│   │   ├── setup_environment.py       # Dev environment setup
│   │   ├── setup_production.py        # Production environment setup
│   │   └── train_models.py            # Train models from scratch
│   ├── tests/                         # Unit & integration tests
│   │   ├── test_data/                  # Test datasets
│   │   ├── __init__.py
│   │   ├── test_api.py                # API endpoint tests
│   │   └── test_models.py             # Model tests
│   ├── utils/                          # Helper modules
│   │   ├── __init__.py
│   │   ├── cache.py                    # Caching utilities
│   │   ├── logger.py                   # Logging utilities
│   │   ├── security.py                 # API auth & security helpers
│   │   └── validators.py               # Input validation utilities
│   ├── .dockerignore                   # Docker ignore file
│   ├── .gitignore                      # Git ignore file
│   ├── Dockerfile                      # Dockerfile for containerization
│   ├── config.py                       # Config & constants
│   ├── main.py                         # FastAPI entry point
│   ├── docker-compose.yml              # Docker Compose setup
│   ├── render.yaml                      # Render deployment config
│   ├── build.sh                        # Build automation script
│   └── requirements.txt                # Python dependencies
├── README.md                            # Project documentation
└── requirements.txt                     # Root-level Python dependencies

```

---

## ⚙️ Installation & Setup

```bash
git clone https://github.com/mdwarishansari/trackruit-ml.git
cd trackruit-ml/ML

python -m venv .venv
.venv\Scripts\activate    # Windows
# or
source .venv/bin/activate # Linux/Mac

pip install -r requirements.txt

cp .env.example .env      # Configure API keys, Redis, MongoDB
python scripts/download_models.py
python scripts/train_models.py

python main.py             # Run service
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

- Base URL: `https://trackruit-ml.onrender.com/ml`

| Endpoint           | Method | Description                  |
| ------------------ | ------ | ---------------------------- |
| `/status`          | GET    | Service health               |
| `/version`         | GET    | Version info                 |
| `/models`          | GET    | Loaded model list            |
| `/match`           | POST   | Resume-job similarity        |
| `/recommend`       | POST   | Job recommendations          |
| `/interview`       | POST   | Interview success prediction |
| `/resume/feedback` | POST   | Resume scoring & advice      |
| `/ats`             | POST   | ATS compatibility check      |

---

## 🧪 Testing

```bash
pytest tests/ -v
pytest tests/ --cov=. --cov-report=html
```

- API coverage >95%
- Unit + integration tests included
- Error handling validated

---

## 📊 Model Details

| Model         | Purpose                  | Algorithm               |
| ------------- | ------------------------ | ----------------------- |
| **Match**     | Resume-job similarity    | TF-IDF + Sentence-BERT  |
| **Recommend** | Job ranking              | Hybrid scoring          |
| **Interview** | Success prediction       | Rule-based → ML         |
| **Feedback**  | Resume scoring & advice  | Multi-factor            |
| **ATS**       | Compatibility validation | Rule-based + heuristics |

---

## 🔮 Future Roadmap

- **Phase 2 (Q2 2026):** Resume parsing, multi-language support, analytics dashboard
- **Phase 3 (Q4 2026):** Transformer-based models, career path & salary prediction, skill-gap analysis

---

## 🤝 Contributing

```bash
git clone https://github.com/mdwarishansari/trackruit-ml.git
git checkout -b feature/new-update
# Make changes, test, commit, push
```

Follow **PEP 8**, write tests, update docs, submit PR.

---

## 📄 License

MIT License – see [LICENSE](LICENSE)

---

## 📞 Support

GitHub: [@mdwarishansari](https://github.com/mdwarishansari)

---

<div align="center">
Built with ❤️ by Mohammad Warish Ansari  
_Transforming careers through AI_

[🏠 Home](http://trackruit.com) • [📚 Docs](http://docs.trackruit.com) • [🐙 GitHub](https://github.com/mdwarishansari)

</div>
