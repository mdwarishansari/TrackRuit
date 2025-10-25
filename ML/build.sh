#!/bin/bash
echo "🚀 Starting TrackRuit ML Service Build Process..."

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Download required NLTK data
echo "📚 Downloading NLTK data..."
python -c "
import nltk
import os

# Create nltk_data directory in a writable location
nltk_data_dir = '/tmp/nltk_data'
os.makedirs(nltk_data_dir, exist_ok=True)
nltk.data.path.append(nltk_data_dir)

# Download required datasets
try:
    nltk.download('punkt', download_dir=nltk_data_dir)
    nltk.download('stopwords', download_dir=nltk_data_dir)
    print('✅ NLTK data downloaded successfully')
except Exception as e:
    print(f'⚠️ NLTK download issue (non-critical): {e}')
    print('🔄 Continuing build...')
"

# Create models directory if it doesn't exist
echo "📁 Setting up model directories..."
mkdir -p models
mkdir -p logs

# Run model setup
echo "🤖 Setting up ML models..."
python scripts/download_models.py

# Run basic tests
echo "🧪 Running basic health checks..."
if python -c "import sys; sys.path.append('.'); from main import app; print('✅ Import successful')"; then
    echo "✅ All imports working correctly"
else
    echo "❌ Import test failed"
    exit 1
fi

echo "🎉 Build completed successfully!"
echo "📊 Next steps:"
echo "   - Service will start automatically"
echo "   - Check logs for any runtime issues"
echo "   - Test endpoints at https://your-service.onrender.com/ml/status"