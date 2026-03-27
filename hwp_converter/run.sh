#!/bin/bash

# Navigate to script directory
cd "$(dirname "$0")"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies (quietly)
echo "Checking dependencies..."
pip install -q -r requirements.txt

# Run Application
echo "Starting HWP Converter..."
python main.py
