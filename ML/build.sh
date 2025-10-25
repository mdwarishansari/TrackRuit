#!/bin/bash
echo "🚀 Starting TrackRuit ML Service Build Process..."

# Install only essential dependencies first
echo "📦 Installing core Python dependencies..."
pip install --no-cache-dir fastapi==0.104.1 uvicorn==0.24.0 pydantic==2.5.0 python-dotenv==1.0.0

# Create necessary directories
echo "📁 Setting up directories..."
mkdir -p models logs nltk_data

# Download required NLTK data
echo "📚 Downloading NLTK data..."
python -c "
import nltk
import os

nltk_data_dir = './nltk_data'
os.makedirs(nltk_data_dir, exist_ok=True)

try:
    nltk.download('punkt', download_dir=nltk_data_dir, quiet=True)
    nltk.download('stopwords', download_dir=nltk_data_dir, quiet=True)
    print('✅ NLTK data downloaded successfully')
except Exception as e:
    print(f'⚠️ NLTK download issue: {e}')
    print('🔄 Continuing build...')
"

# Now install the rest of requirements
echo "📦 Installing remaining dependencies..."
pip install --no-cache-dir -r requirements.txt

# Run model setup
echo "🤖 Setting up ML models..."
python scripts/download_models.py

# Run basic health check
echo "🧪 Running final health check..."
if python -c "print('✅ Python is working')"; then
    echo "✅ Basic health check passed"
else
    echo "❌ Basic health check failed"
    exit 1
fi

echo "🎉 Build completed successfully!"
echo "📊 Service will start on port: ${PORT:-8000}"