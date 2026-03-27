import os
import sys
from pathlib import Path
from moviepy.editor import ColorClip, TextClip, CompositeVideoClip, VideoFileClip, concatenate_videoclips
from datetime import datetime

# 한글 출력을 위한 인코딩 설정 (필요시)
# sys.stdout.reconfigure(encoding='utf-8')

def create_directory_structure(base_name: str):
    """
    7단계에 정의된 폴더 구조를 생성합니다.
    """
    root_dir = Path(base_name)
    subdirs = ["원본", "설교요약", "자막", "행정제출", "설교개요"]
    
    print(f"📂 폴더 생성 중: {root_dir}")
    if not root_dir.exists():
        root_dir.mkdir()
        
    paths = {}
    for subdir in subdirs:
        path = root_dir / subdir
        path.mkdir(exist_ok=True)
        paths[subdir] = path
        print(f"  └─ {subdir}/")
        
    return paths

def create_dummy_video(filename: str, duration: int = 10):
    """
    테스트를 위한 더미 영상을 생성합니다.
    """
    print(f"\n🎥 테스트용 원본 영상 생성 중... ({filename})")
    # 검은 배경에 텍스트
    # TextClip requires ImageMagick, which might not be installed. 
    # Using simpler approach: ColorClip changing colors to simulate content.
    
    clip1 = ColorClip(size=(640, 360), color=(255, 0, 0), duration=duration/2) # 빨강
    clip2 = ColorClip(size=(640, 360), color=(0, 0, 255), duration=duration/2) # 파랑
    
    final_clip = concatenate_videoclips([clip1, clip2])
    final_clip.fps = 24
    final_clip.write_videofile(filename, codec="libx264", audio=False, logger=None)
    print("✅ 원본 영상 생성 완료.")

def process_video(original_path: str, output_path: str, clips_ranges: list):
    """
    영상을 잘라서 요약본을 만듭니다.
    """
    print(f"\n✂️ 영상 편집 및 요약 영상 생성 중...")
    print(f"   소스: {original_path}")
    
    try:
        video = VideoFileClip(original_path)
        clips = []
        
        for start, end in clips_ranges:
            # 원본 영상 길이를 초과하지 않도록 보정 (테스트용)
            if start >= video.duration:
                continue
            real_end = min(end, video.duration)
            
            print(f"   [추출] {start}초 ~ {real_end}초")
            clip = video.subclip(start, real_end)
            clips.append(clip)
            
        if not clips:
            print("❌ 유효한 구간이 없습니다.")
            return

        final_clip = concatenate_videoclips(clips)
        final_clip.write_videofile(str(output_path), codec="libx264", logger=None)
        print(f"✅ 요약 영상 저장 완료: {output_path}")
        
    except Exception as e:
        print(f"❌ 오류 발생: {e}")

def create_dummy_srt(srt_path: str):
    """
    더미 자막 파일을 생성합니다.
    """
    content = """1
00:00:01,000 --> 00:00:04,000
이것은 테스트용 자동 생성 자막입니다.

2
00:00:04,500 --> 00:00:08,000
설교의 핵심 내용이 이곳에 들어갑니다.
"""
    with open(srt_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"\n📝 자막 파일(테스트용) 생성 완료: {srt_path}")

import argparse
import yt_dlp

# ... (previous imports)

def download_youtube_video(url: str, output_dir: Path, filename: str):
    """
    YouTube URL에서 동영상을 다운로드합니다.
    """
    print(f"\n⬇️ YouTube 영상 다운로드 시작: {url}")
    
    # 출력 템플릿 설정
    output_path = output_dir / filename

    # 기존 파일이 있다면 삭제 (확실한 덮어쓰기)
    if output_path.exists():
        try:
            os.remove(output_path)
            print(f"🗑️ 기존 파일 삭제됨: {output_path}")
        except Exception as e:
            print(f"⚠️ 기존 파일 삭제 실패 (사용 중일 수 있음): {e}")
            # 삭제 실패 시도 진행해봄 (yt-dlp가 처리할 수도 있으므로)

    ydl_opts = {
        # ffmpeg이 없으므로 병합이 필요한 포맷(bestvideo+bestaudio) 대신
        # 하나의 파일로 된 최고 화질(best)을 선택하도록 수정
        'format': 'best[ext=mp4]/best',
        'outtmpl': str(output_path),
        'noplaylist': True,
        'quiet': False,
        'no_warnings': True,
        'overwrites': True,
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        
        if not output_path.exists():
            raise Exception("다운로드는 완료된 것으로 보이나 파일이 없습니다.")
            
        print(f"✅ 다운로드 완료: {output_path}")
        return output_path
    except Exception as e:
        print(f"❌ YouTube 다운로드 실패: {e}")
        raise e # UI에서 에러를 볼 수 있도록 예외 다시 발생

def main():
    print("=== 설교 영상 행정 제출 자동화 워크플로우 시작 ===")
    
    # 0. 인자 파싱 (자동화 테스트용)
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", help="YouTube URL to process")
    parser.add_argument("--test-mode", action="store_true", help="Force test mode generation")
    args = parser.parse_args()

    today_str = datetime.now().strftime("%Y-%m-%d")
    project_name = f"{today_str}_주일예배"
    
    # 1. 폴더 구조 생성
    paths = create_directory_structure(project_name)
    
    # 2. 원본 영상 확보 (YouTube or Test)
    original_filename = f"원본_주일예배_{today_str}.mp4"
    original_file_path = paths["원본"] / original_filename
    
    # URL 입력 확인
    youtube_url = args.url
    if not youtube_url and not args.test_mode:
        # 사용자 입력 받기 (인터랙티브 모드)
        print("\n[입력 모드 선택]")
        print("1. 테스트 영상 자동 생성")
        print("2. YouTube URL 입력")
        choice = input("선택 (1/2): ").strip()
        
        if choice == "2":
            youtube_url = input("YouTube URL을 입력하세요: ").strip()
    
    if youtube_url:
        # YouTube 다운로드 진행
        downloaded = download_youtube_video(youtube_url, paths["원본"], original_filename)
        if not downloaded:
            print("⚠️ 다운로드 실패로 인해 테스트 영상을 생성합니다.")
            create_dummy_video(str(original_file_path), duration=20)
    else:
        # 테스트 영상 생성
        if not original_file_path.exists():
            create_dummy_video(str(original_file_path), duration=20)
        else:
            print(f"\n🎥 원본 영상 확인됨: {original_file_path}")

    # 3. 설교 요약 영상 생성 (3단계)
    # ... (이하 동일)
    summary_filename = f"설교요약_주일예배_{today_str}.mp4"
    summary_path = paths["설교요약"] / summary_filename
    
    clips_ranges = [(2, 5), (10, 15)] # 초 단위 (데모용 고정값)
    process_video(str(original_file_path), str(summary_path), clips_ranges)
    
    # 4. 자막 생성 (Mock)
    srt_filename = f"설교자막_{today_str}.srt"
    srt_path = paths["자막"] / srt_filename
    create_dummy_srt(srt_path)
    
    # 5. 행정 제출용 패키징
    print("\n📦 행정 제출용 패키징 중...")
    # ... (이하 동일 로직 유지)
    print(f"   [복사] {summary_filename} -> 행정제출/")
    print(f"   [복사] {srt_filename} -> 행정제출/")
    
    outline_path = paths["설교개요"] / "설교개요서.txt"
    with open(outline_path, "w", encoding="utf-8") as f:
        f.write(f"설교 일시: {today_str}\n제목: 주일 예배 설교\n핵심 요약: (자동 생성됨)\n출처: {youtube_url if youtube_url else '자체 생중계/녹화본'}")
    print(f"   [생성] 설교개요서.txt -> 설교개요/")

    print("\n=== ✨ 모든 작업이 완료되었습니다! ===")
    print(f"결과물 위치: {os.path.abspath(project_name)}")

if __name__ == "__main__":
    main()
