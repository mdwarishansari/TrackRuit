#!/bin/bash
echo "🚀 Starting TrackRuit ML Service..."

# Set NLTK data path to project directory
export NLTK_DATA="./nltk_data"

# Create necessary directories if they don't exist
mkdir -p logs
mkdir -p nltk_data

# Check if NLTK data exists, download if missing
if [ ! -f "./nltk_data/tokenizers/punkt/PY3/english.pickle" ]; then
    echo "📥 Downloading missing NLTK data..."
    python -c "
import nltk
import os
nltk.download('punkt', download_dir='./nltk_data', quiet=True)
nltk.download('stopwords', download_dir='./nltk_data', quiet=True)
print('NLTK data ready')
"
fi

# Start the application with proper error handling
echo "🌟 Starting FastAPI server..."
exec python main.py