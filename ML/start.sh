#!/bin/bash
echo "🚀 Starting TrackRuit ML Service..."
python scripts/train_models.py
# Set environment variables
export HOST="0.0.0.0"
export PORT=${PORT:-8000}
export NLTK_DATA="./nltk_data"

# Create necessary directories
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
print('✅ NLTK data ready')
"
fi

echo "🔧 Environment:"
echo "   - HOST: $HOST"
echo "   - PORT: $PORT"
echo "   - PYTHONPATH: $(pwd)"

# Start the application with explicit port binding
echo "🌟 Starting FastAPI server on port $PORT..."
exec uvicorn main:app --host $HOST --port $PORT --workers 1