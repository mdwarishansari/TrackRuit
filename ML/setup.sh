#!/bin/bash
echo "🚀 Starting TrackRuit ML Service Setup..."

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Download NLTK data
echo "📚 Downloading NLTK data..."
python -c "import nltk; nltk.download('punkt', quiet=True); nltk.download('stopwords', quiet=True); nltk.download('averaged_perceptron_tagger', quiet=True)"

# Setup models
echo "🤖 Setting up ML models..."
python scripts/download_models.py
python scripts/train_models.py

echo "✅ Setup completed successfully!"