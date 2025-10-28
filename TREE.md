├── ML
│ ├── data
│ │ ├── sample_jobs.json
│ │ ├── sample_resumes.json
│ │ └── test_data.py
│ ├── models
│ │ ├── **init**.py
│ │ ├── ats_model.py
│ │ ├── base_model.py
│ │ ├── feedback_model.py
│ │ ├── interview_model.py
│ │ ├── match_model.py
│ │ └── recommend_model.py
│ ├── pipelines
│ │ ├── **init**.py
│ │ ├── embeddings.py
│ │ ├── preprocess.py
│ │ └── skills_dict.json
│ ├── routes
│ │ ├── **init**.py
│ │ ├── ats.py
│ │ ├── feedback.py
│ │ ├── health.py
│ │ ├── interview.py
│ │ ├── match.py
│ │ └── recommend.py
│ ├── scripts
│ │ ├── check_setup.py
│ │ ├── download_models.py
│ │ ├── setup_environment.py
│ │ ├── setup_production.py
│ │ └── train_models.py
│ ├── tests
│ │ ├── test_data
│ │ ├── **init**.py
│ │ ├── test_api.py
│ │ └── test_models.py
│ ├── utils
│ │ ├── **init**.py
│ │ ├── cache.py
│ │ ├── logger.py
│ │ ├── security.py
│ │ └── validators.py
│ ├── .dockerignore
│ ├── .gitignore
│ ├── Dockerfile
│ ├── README.md
│ ├── build.sh
│ ├── config.py
│ ├── docker-compose.yml
│ ├── main.py
│ ├── render.yaml
│ ├── requirements.txt
│ ├── start.sh
│ └── test_all_endpoints.py
├── backend
│ ├── config
│ │ ├── cloudinary.js
│ │ ├── database.js
│ │ ├── mailer.js
│ │ ├── passport.js
│ │ └── redis.js
│ ├── controllers
│ │ ├── analyticsController.js
│ │ ├── authController.js
│ │ ├── extensionController.js
│ │ ├── jobController.js
│ │ ├── resumeController.js
│ │ └── userController.js
│ ├── logs
│ ├── middleware
│ │ ├── auth.js
│ │ ├── errorHandler.js
│ │ ├── extensionAuth.js
│ │ ├── rateLimiter.js
│ │ └── validation.js
│ ├── models
│ │ ├── Analytics.js
│ │ ├── Job.js
│ │ ├── OAuthToken.js
│ │ ├── OTP.js
│ │ ├── Resume.js
│ │ └── User.js
│ ├── routes
│ │ ├── analytics.js
│ │ ├── auth.js
│ │ ├── extension.js
│ │ ├── jobs.js
│ │ ├── resumes.js
│ │ └── users.js
│ ├── services
│ │ ├── cacheService.js
│ │ ├── emailService.js
│ │ ├── mlService.js
│ │ ├── resumeParserService.js
│ │ └── storageService.js
│ ├── uploads
│ │ └── resumes
│ ├── utils
│ │ ├── adminSetup.js
│ │ ├── constants.js
│ │ ├── helpers.js
│ │ ├── logger.js
│ │ └── validators.js
│ ├── .gitignore
│ ├── README.md
│ ├── package-lock.json
│ ├── package.json
│ ├── render.yaml
│ ├── server.js
│ ├── start.sh
│ └── test-server.js
├── extension
│ ├── icons
│ │ ├── icon-active.png
│ │ ├── icon128.png
│ │ ├── icon16.png
│ │ └── icon48.png
│ ├── utils
│ │ ├── api.js
│ │ ├── constants-nomodule.js
│ │ ├── constants.js
│ │ └── storage.js
│ ├── README.md
│ ├── background.js
│ ├── content.js
│ ├── manifest.json
│ ├── options.css
│ ├── options.html
│ ├── options.js
│ ├── popup.css
│ ├── popup.html
│ └── popup.js
└── frontend
├── public
│ ├── apple-touch-icon.png
│ ├── favicon.ico
│ ├── index.html
│ ├── logo16.png
│ ├── logo192.png
│ ├── logo32.png
│ ├── logo512.png
│ ├── manifest.json
│ └── robots.txt
├── src
│ ├── assets
│ │ ├── TrackRuitLogo.jpg
│ │ └── TrackRuitLogo.png
│ ├── components
│ │ ├── analytics
│ │ │ ├── AnalyticsDashboard.js
│ │ │ ├── ProgressChart.js
│ │ │ └── SkillGapAnalysis.js
│ │ ├── auth
│ │ │ ├── Login.js
│ │ │ └── Register.js
│ │ ├── common
│ │ │ ├── AnimatedBackground.js
│ │ │ ├── DarkModeToggle.js
│ │ │ ├── Footer.js
│ │ │ ├── Header.js
│ │ │ ├── LoadingSpinner.js
│ │ │ └── ParticleBackground.js
│ │ ├── dashboard
│ │ │ ├── AnalyticsChart.js
│ │ │ ├── JobCard.js
│ │ │ ├── QuickActions.js
│ │ │ └── StatsCard.js
│ │ ├── jobs
│ │ │ ├── JobDetails.js
│ │ │ ├── JobFilters.js
│ │ │ ├── JobForm.js
│ │ │ └── JobList.js
│ │ └── resume
│ │ ├── ResumeAnalysis.js
│ │ ├── ResumeCard.js
│ │ └── ResumeUpload.js
│ ├── contexts
│ │ ├── AuthContext.js
│ │ ├── NotificationContext.js
│ │ └── ThemeContext.js
│ ├── hooks
│ │ ├── useApi.js
│ │ ├── useAuth.js
│ │ └── useLocalStorage.js
│ ├── pages
│ │ ├── Analytics.js
│ │ ├── Dashboard.js
│ │ ├── Home.js
│ │ ├── Jobs.js
│ │ ├── NotFound.js
│ │ ├── Resume.js
│ │ └── Settings.js
│ ├── services
│ │ ├── analytics.js
│ │ ├── api.js
│ │ ├── auth.js
│ │ ├── jobs.js
│ │ └── resumes.js
│ ├── utils
│ │ ├── animations.js
│ │ ├── constants.js
│ │ ├── helpers.js
│ │ └── validators.js
│ ├── App.css
│ ├── App.js
│ ├── index.css
│ └── index.js
├── .gitignore
├── README.md
├── package-lock.json
├── package.json
└── tailwind.config.js

```

```
