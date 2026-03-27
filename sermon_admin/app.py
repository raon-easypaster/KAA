import streamlit as st
import os
from pathlib import Path
from datetime import datetime
import main as backend
import shutil

# Helper Function
def parse_time_str(time_str: str) -> int:
    """
    'MM:SS' or 'HH:MM:SS' or 'SS' 문자열을 초(seconds) 단위 정수로 변환합니다.
    Example: infinity -> 0, "10" -> 10, "01:00" -> 60, "01:01:01" -> 3661
    """
    if not time_str:
        return 0
    try:
        parts = list(map(int, time_str.strip().split(':')))
        if len(parts) == 1:
            return parts[0]
        elif len(parts) == 2:
            return parts[0] * 60 + parts[1]
        elif len(parts) == 3:
            return parts[0] * 3600 + parts[1] * 60 + parts[2]
        else:
            return 0
    except ValueError:
        return 0

# 페이지 설정
st.set_page_config(page_title="설교 영상 행정 자동화", layout="wide")

st.title("🎬 설교 영상 행정 제출 표준 워크플로우")
st.markdown("---")

# 세션 상태 초기화
if "project_name" not in st.session_state:
    st.session_state.project_name = f"{datetime.now().strftime('%Y-%m-%d')}_주일예배"
if "video_path" not in st.session_state:
    st.session_state.video_path = None
if "clips_count" not in st.session_state:
    st.session_state.clips_count = 1

# 사이드바: 설정
with st.sidebar:
    st.header("⚙️ 기본 설정")
    project_date = st.date_input("설교 날짜", datetime.now())
    st.session_state.project_name = f"{project_date.strftime('%Y-%m-%d')}_주일예배"
    st.info(f"작업 폴더: {st.session_state.project_name}")

# 메인 탭 구성
tab1, tab2, tab3 = st.tabs(["1️⃣ 영상 확보", "2️⃣ 구간 편집", "3️⃣ 결과 확인"])

# 1. 영상 확보 탭
with tab1:
    st.subheader("원본 설교 영상 가져오기")
    
    input_method = st.radio("방법 선택", ["YouTube 다운로드", "테스트 영상 생성", "로컬 파일 있음"], horizontal=True)
    
    paths = backend.create_directory_structure(st.session_state.project_name)
    target_filename = f"원본_주일예배_{project_date.strftime('%Y-%m-%d')}.mp4"
    target_path = paths["원본"] / target_filename

    if input_method == "YouTube 다운로드":
        url = st.text_input("YouTube URL 입력", placeholder="https://youtu.be/...")
        if st.button("다운로드 시작"):
            if url:
                with st.spinner("YouTube 영상 다운로드 중... (시간이 걸릴 수 있습니다)"):
                    try:
                        downloaded_path = backend.download_youtube_video(url, paths["원본"], target_filename)
                        if downloaded_path:
                            # 기존 캐시 초기화 (새 영상을 로드하기 위해)
                            if "video_file" in st.session_state:
                                del st.session_state.video_file
                                
                            st.session_state.video_path = str(downloaded_path)
                            st.success(f"다운로드 완료! {downloaded_path}")
                            st.rerun() # 화면 갱신
                    except Exception as e:
                        st.error(f"다운로드 실패: {e}")
                        st.info("💡 팁: 잠시 후 다시 시도하거나, 다른 설교 링크를 확인해주세요.")
            else:
                st.warning("URL을 입력해주세요.")

    elif input_method == "테스트 영상 생성":
        if st.button("테스트 영상 생성 (20초)"):
            backend.create_dummy_video(str(target_path), duration=20)
            st.session_state.video_path = str(target_path)
            st.success("테스트 영상 생성 완료!")

    elif input_method == "로컬 파일 있음":
        if target_path.exists():
            st.session_state.video_path = str(target_path)
            st.success(f"기존 파일 확인됨: {target_path}")
        else:
            st.warning(f"파일이 없습니다. 아래 경로에 파일을 넣어주세요.\n{target_path}")

# 2. 구간 편집 탭
with tab2:
    st.subheader("✂️ 핵심 구간 설정")
    
    if st.session_state.video_path and os.path.exists(st.session_state.video_path):
        st.video(st.session_state.video_path)
        
        # 구간 설정 UI
        st.info("💡 '분:초' (예: 05:30) 또는 '시:분:초' (예: 01:10:05) 형식으로 입력하세요.")
        
        # 동적 구간 추가
        clips_ranges = []
        for i in range(st.session_state.clips_count):
            c1, c2 = st.columns(2)
            with c1:
                start_str = st.text_input(f"구간 {i+1} 시작 (MM:SS)", value="00:00", key=f"s_{i}")
            with c2:
                end_str = st.text_input(f"구간 {i+1} 종료 (MM:SS)", value="00:10", key=f"e_{i}")
            
            start_sec = parse_time_str(start_str)
            end_sec = parse_time_str(end_str)
            clips_ranges.append((start_sec, end_sec))

        col_add, col_del = st.columns([1, 4])
        with col_add:
            if st.button("➕ 구간 추가"):
                st.session_state.clips_count += 1
                st.rerun()
        with col_del:
             if st.button("➖ 삭제") and st.session_state.clips_count > 1:
                st.session_state.clips_count -= 1
                st.rerun()

        st.markdown("---")
        if st.button("🚀 설교 요약 영상 생성하기", type="primary"):
            with st.spinner("영상 편집 및 자막 생성 중..."):
                try:
                    # 3단계: 요약 영상 생성
                    summary_filename = f"설교요약_주일예배_{project_date.strftime('%Y-%m-%d')}.mp4"
                    summary_path = paths["설교요약"] / summary_filename
                    
                    # 백엔드 함수 호출
                    backend.process_video(st.session_state.video_path, str(summary_path), clips_ranges)
                    
                    # 4단계: 자막 (Mock)
                    srt_filename = f"설교자막_{project_date.strftime('%Y-%m-%d')}.srt"
                    srt_path = paths["자막"] / srt_filename
                    backend.create_dummy_srt(srt_path)
                    
                    # 5단계: 패키징
                    admin_video_path = paths["행정제출"] / summary_filename
                    admin_srt_path = paths["행정제출"] / srt_filename
                    
                    # 파일 복사
                    shutil.copy(summary_path, admin_video_path)
                    shutil.copy(srt_path, admin_srt_path)
                    
                    # 개요서
                    outline_path = paths["설교개요"] / "설교개요서.txt"
                    with open(outline_path, "w", encoding="utf-8") as f:
                        f.write(f"설교 일시: {project_date}\n구간: {clips_ranges}\n(자동 생성됨)")
                    
                    st.success("✅ 모든 작업이 완료되었습니다!")
                    st.balloons()
                except Exception as e:
                    st.error(f"작업 중 오류가 발생했습니다: {e}")
                
    else:
        st.error("먼저 '1️⃣ 영상 확보' 탭에서 영상을 준비해주세요.")

# 3. 결과 확인 탭
with tab3:
    st.subheader("📂 결과물 확인")
    
    export_path = Path(st.session_state.project_name) / "행정제출"
    if export_path.exists():
        files = list(export_path.glob("*"))
        if files:
            st.write(f"제출용 파일 위치: `{export_path.absolute()}`")
            for f in files:
                st.text(f"📄 {f.name} ({f.stat().st_size / 1024 / 1024:.1f} MB)")
                
            # 요약 영상 미리보기
            video_files = list(export_path.glob("*.mp4"))
            if video_files:
                st.video(str(video_files[0]))
        else:
            st.info("아직 생성된 결과물이 없습니다.")
    else:
        st.info("작업을 시작해주세요.")
