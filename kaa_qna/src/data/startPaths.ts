// "처음 오신 분은 여기부터" 대상별 3단계 맞춤길
// 단계는 자료 id 로 가리킨다 (materials.json 에 있어야 한다).

export interface StartPath {
    key: string;
    icon: string;
    title: string;
    desc: string;
    steps: { materialId: string; label: string }[];
}

export const START_PATHS: StartPath[] = [
    {
        key: 'pastor',
        icon: '⛪',
        title: '목회자·사역자',
        desc: '두려움을 내려놓고, 설교 연구를 돕는 비서를 만나고, 직접 도구를 만들어 봅니다.',
        steps: [
            { materialId: 'ai-first-step', label: 'AI 첫걸음' },
            { materialId: 'easypastor', label: 'AI 신학 비서' },
            { materialId: 'vibe-coding-workshop', label: '바이브코딩으로 도구 만들기' },
        ],
    },
    {
        key: 'welfare',
        icon: '🤝',
        title: '사회복지사·돌봄 교사',
        desc: '돌봄 현장의 문서 업무부터 기관 홍보, 평가 준비까지 차례로 익힙니다.',
        steps: [
            { materialId: 'childcare-center-ai', label: '돌봄 현장 AI 첫걸음' },
            { materialId: 'welfare-landing-guide', label: '기관 홍보 페이지 만들기' },
            { materialId: 'childcare-evaluation-ai', label: '평가 대비 AI 실무' },
        ],
    },
    {
        key: 'general',
        icon: '🌱',
        title: 'AI가 처음인 분',
        desc: 'AI가 무엇인지 알고, 기본 개념을 익히고, 무료 도구로 직접 써 봅니다.',
        steps: [
            { materialId: 'ai-first-step', label: 'AI 첫걸음' },
            { materialId: 'gen-ai-basics', label: '생성형 AI 기초' },
            { materialId: 'aistudio', label: 'AI 스튜디오 써 보기' },
        ],
    },
];
