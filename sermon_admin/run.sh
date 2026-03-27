#!/bin/bash
cd "$(dirname "$0")"

# 가상환경 생성
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# 가상환경 활성화
source venv/bin/activate

# 패키지 설치
echo "Installing dependencies..."
pip install -r requirements.txt > /dev/null 2>&1

# 스크립트 실행
echo "Running Sermon Automation..."
python main.py "$@"
