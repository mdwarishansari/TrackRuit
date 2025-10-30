#!/usr/bin/env python3
"""
Environment setup script for TrackRuit ML Service
Sets up the development environment and installs dependencies
"""

import os
import sys
import subprocess
import venv
from pathlib import Path

def run_command(command, description):
    """Run a shell command with error handling"""
    print(f"⏳ {description}...")
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ {description} completed successfully")
            return True
        else:
            print(f"❌ {description} failed:")
            print(f"Error: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ {description} failed with exception: {e}")
        return False

def create_virtual_environment():
    """Create Python virtual environment"""
    venv_path = Path("venv")
    if venv_path.exists():
        print("✅ Virtual environment already exists")
        return True
    
    print("Creating virtual environment...")
    try:
        venv.create(venv_path, with_pip=True)
        print("✅ Virtual environment created successfully")
        return True
    except Exception as e:
        print(f"❌ Failed to create virtual environment: {e}")
        return False

def install_dependencies():
    """Install Python dependencies"""
    # Determine pip path based on platform
    if sys.platform == "win32":
        pip_path = "venv/Scripts/pip"
    else:
        pip_path = "venv/bin/pip"
    
    commands = [
        (f"{pip_path} install -r requirements.txt", "Installing Python dependencies"),
        (f"{pip_path} install -e .", "Installing package in development mode"),
    ]
    
    success = True
    for command, description in commands:
        if not run_command(command, description):
            success = False
    
    return success

def setup_environment_file():
    """Create .env file from template if it doesn't exist"""
    env_file = Path(".env")
    env_example = Path(".env.example")
    
    if env_file.exists():
        print("✅ .env file already exists")
        return True
    
    if env_example.exists():
        import shutil
        shutil.copy(env_example, env_file)
        print("✅ .env file created from template")
        print("⚠️  Please edit .env with your actual configuration values")
        return True
    else:
        print("❌ .env.example file not found")
        return False

def download_ml_dependencies():
    """Download ML models and data"""
    return run_command("python scripts/download_models.py", "Downloading ML models and data")

def run_tests():
    """Run test suite to verify setup"""
    return run_command("python -m pytest tests/ -v", "Running test suite")

def main():
    """Main setup function"""
    print("🚀 Setting up TrackRuit ML Service Environment")
    print("=" * 60)
    
    steps = [
        ("Creating virtual environment", create_virtual_environment),
        ("Installing dependencies", install_dependencies),
        ("Setting up environment file", setup_environment_file),
        ("Downloading ML dependencies", download_ml_dependencies),
        ("Running tests", run_tests)
    ]
    
    success = True
    for step_name, step_function in steps:
        print(f"\n{'='*20} {step_name} {'='*20}")
        if not step_function():
            success = False
            print(f"❌ {step_name} failed")
            break
        else:
            print(f"✅ {step_name} completed successfully")
    
    print("\n" + "=" * 60)
    if success:
        print("🎉 Environment setup completed successfully!")
        print("\nNext steps:")
        print("1. Edit .env file with your configuration")
        print("2. Run 'python main.py' to start the service")
        print("3. Access the API at http://localhost:8000")
        print("4. View documentation at http://localhost:8000/ml/docs")
    else:
        print("❌ Environment setup failed. Please check the errors above.")
        sys.exit(1)

if __name__ == "__main__":
    main()