#!/bin/bash
# build.sh - Render build script

echo "🚀 Starting TrackRuit ML Service build process..."

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Download NLP models
echo "🔧 Downloading NLP models..."
python -m spacy download en_core_web_sm
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nktl.download('averaged_perceptron_tagger')"

# Setup ML models
echo "🤖 Setting up ML models..."
python scripts/download_models.py
python scripts/train_models.py

echo "✅ Build completed successfully!"