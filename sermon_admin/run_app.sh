#!/bin/bash
cd "$(dirname "$0")"

# 가상환경 활성화
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# 필요한 패키지 설치 확인
pip install -r requirements.txt > /dev/null 2>&1

# Streamlit 실행
echo "🚀 설교 영상 행정 자동화 GUI를 시작합니다..."
streamlit run app.py
