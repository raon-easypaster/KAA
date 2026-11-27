// 교회 사역 프로그램 소개 (/programs)
// 링크·설명을 바꿀 때는 이 파일만 고친다.

export type ProgramStatus = 'free' | 'paid' | 'wip';

export interface ProgramLink {
    label: string;
    url: string;
    primary?: boolean;
}

export interface Program {
    id: string;
    name: string;
    tagline: string;
    status: ProgramStatus;
    statusLabel: string;
    maker: string;
    platforms: string;
    features: string[];
    poster?: string;
    links: ProgramLink[];
    note?: string;
}

export const PROGRAMS: Program[] = [
    {
        id: 'worship-caster',
        name: '예배송출',
        tagline: '예배 준비는 더 간편하게, 송출은 더 자유롭게',
        status: 'free',
        statusLabel: '무료 · v0.15.0',
        maker: '쉬운목사 이광복',
        platforms: '맥 · 윈도우',
        features: [
            'OBS 화면을 예배당 TV와 방송으로',
            '내 영상 · 유튜브 영상 바로 재생',
            'PPT 원본 디자인 그대로 가져오기',
            '슬라이드 빠른 수정 · 내 글꼴과 테마',
            '휴대폰 리모컨 · 프롬프터',
            '자동 업데이트 · 자료 자동 백업',
        ],
        poster: '/images/programs/worship-caster.webp',
        links: [
            { label: '📥 무료 다운로드 (맥·윈도우)', url: 'https://raon-easypaster.github.io/worship-caster/', primary: true },
        ],
    },
    {
        id: 'easydeck',
        name: '라온 스트림덱 (EasyDeck)',
        tagline: '장비 없이, 화면 위 버튼판 하나로 방송 끝 — 무료 소프트웨어 스트림덱',
        status: 'free',
        statusLabel: '무료 · v1.3.0',
        maker: '쉬운목사 이광복',
        platforms: '맥(macOS 13 이상) · 윈도우 10·11',
        features: [
            '송출·자막 프로그램 단축키를 버튼 하나로',
            '교회 이름·설교 제목 같은 글자를 한글 그대로 입력',
            '방송 프로그램·찬양 폴더·유튜브 스튜디오를 버튼으로 열기',
            '노브·슬라이더로 음량 조절, 설교·광고 타이머',
            '끌어다 놓기만 하면 버튼 완성 — 설정 파일 만질 필요 없음',
            '예배용·편집용 페이지 나누기, 만든 덱 내보내기·가져오기',
        ],
        links: [
            { label: '📥 무료 다운로드 (맥·윈도우)', url: 'https://raondh.github.io/easydeck/', primary: true },
        ],
        note: '스트림덱 장비를 따로 사지 않아도 됩니다. 처음 한 번은 경고 창과 권한 질문(맥: 손쉬운 사용)이 나오는데, 다운로드 페이지의 설치 방법을 따라 하시면 됩니다.',
    },
    {
        id: 'raon-planner',
        name: '라온 플래너',
        tagline: '흩어진 하루를, 한 권에. 종이 수첩의 느낌 그대로.',
        status: 'free',
        statusLabel: '무료 · 회원가입 없음',
        maker: '쉬운목사 이광복',
        platforms: '맥 · 윈도우 · 안드로이드',
        features: [
            '구글 드라이브 동기화 — 컴퓨터 기록을 휴대폰에서도',
            '오늘 할 일 · 일정 · 일일 기록',
            '주간·월간 계획 · 만다라트 · 습관 기록',
            '심방·돌봄 기록 · 프로젝트 관리',
            '목회자용 · 평신도용 · 사회복지사용 · 일반용',
        ],
        poster: '/images/programs/raon-planner.webp',
        links: [
            { label: '📥 무료 다운로드', url: 'https://raondh.github.io/raon-planner/', primary: true },
        ],
    },
    {
        id: 'raon-music-sheet',
        name: '라온 뮤직시트',
        tagline: '찬양 준비부터 예배의 순간까지, 찬양팀을 위한 악보 · 콘티 관리',
        status: 'free',
        statusLabel: '무료 · 웹앱',
        maker: '라온동행교회',
        platforms: '휴대폰 · 태블릿 · PC (설치 없이 웹에서)',
        features: [
            '곡과 악보를 한곳에 — 주제별 검색 · Key별 악보',
            '이번 주 콘티 — 곡 순서 · 송품 · 예배 시간 정리',
            '같은 악보를 함께 — 공유 링크 · 실시간 넘기기 · 필기 공유',
        ],
        poster: '/images/programs/raon-music-sheet.webp',
        links: [
            { label: '👉 앱 바로가기', url: 'https://raon-music-sheet.vercel.app', primary: true },
            { label: '📖 사용설명서', url: 'https://raon-easypaster.github.io/raon-music-sheet-guide/' },
        ],
        note: '공용 목록은 곡 정보만 제공하며, 악보는 사용 권한이 있는 자료를 직접 등록합니다.',
    },
    {
        id: 'livewiki-me',
        name: '나만의 라이브위키',
        tagline: '유튜브 영상과 뉴스·블로그 글을 Claude로 요약해 크롬 옆 패널에 보여 주는 개인용 도구',
        status: 'free',
        statusLabel: '무료 · v0.3.0 테스트판',
        maker: '한국AI연구소',
        platforms: '맥 · 윈도우 (크롬·엣지 확장)',
        features: [
            '유튜브 영상 아래 ✨ 요약 버튼 — 핵심 요약 3가지 · 기사형 요약 · 타임라인 · 전체 스크립트',
            '시간을 누르면 그 장면으로 바로 이동',
            '💬 AI 채팅으로 영상 내용에 대해 질문',
            '뉴스·블로그(네이버 블로그 포함) 글 요약',
            '💾 요약을 마크다운(.md) 파일로 저장 — 옵시디언 정리에 바로 활용',
        ],
        links: [
            { label: '📥 최신판 내려받기 (맥·윈도우)', url: 'https://github.com/smdjoo-stack/livewiki-me/releases', primary: true },
            { label: '📖 설치·사용 안내', url: 'https://github.com/smdjoo-stack/livewiki-me#readme' },
        ],
        note: 'Claude Pro/Max 구독(Claude Code 로그인) 또는 Claude API 키가 필요합니다. 요약할 때 자막·글 내용이 사용자의 Claude 계정으로 전송되며, 연구소에는 아무 데이터도 오지 않습니다. 테스트판이라 설치는 내려받은 폴더의 안내서(INSTALL-GUIDE.html)를 따라 하시면 됩니다.',
    },
    {
        id: 'ai-consolemate',
        name: 'AI 콘솔메이트',
        tagline: '교회 음향 봉사자를 위한 AI 콘솔 도우미 — 복잡한 음향 콘솔, 조금 더 쉽게',
        status: 'paid',
        statusLabel: '유료 세팅 · 교육',
        maker: '온교회 김태주 목사',
        platforms: '교회 음향 콘솔 + 노트북',
        features: [
            '대화로 콘솔 조작 ("드럼 모니터에 베이스 조금 더 넣어 줘")',
            '소리 흐름을 한눈에',
            '예배 순서를 버튼 하나로',
        ],
        poster: '/images/programs/ai-consolemate.webp',
        links: [
            { label: '✉️ 세팅·교육 문의하기', url: '/#contact', primary: true },
        ],
        note: '교회마다 음향 장비가 달라 개교회별 세팅과 교육이 필요한 프로그램입니다. 무료 배포 대신 유료로 방문 세팅과 교육을 진행합니다. AI 대화 기능은 Claude API 키와 사용 요금이 별도로 필요합니다.',
    },
    {
        id: 'raon-church-allinone',
        name: '라온 교회 올인원',
        tagline: '예배 준비부터 교회 살림까지, 한곳에서 조금 더 편하게',
        status: 'wip',
        statusLabel: '작업 중 · 곧 오픈',
        maker: '쉬운목사 이광복',
        platforms: '맥 · 윈도우',
        features: ['예배 · 찬양 · 설교 후 자료', '성도 · 재정 · 행정'],
        links: [],
        note: '지금 열심히 만들고 있습니다. 공개되면 이 자리에서 바로 내려받으실 수 있게 안내하겠습니다.',
    },
];
