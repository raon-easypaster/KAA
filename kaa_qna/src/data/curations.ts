import materialsData from '@/data/materials.json';
import type {
    FeaturedHighlightRef,
    MaterialItem,
    RoadmapStep,
    StartGuideRef,
} from '@/types/material';

export const MATERIALS: MaterialItem[] = materialsData as MaterialItem[];

export const MATERIALS_BY_ID: Record<string, MaterialItem> = Object.fromEntries(
    MATERIALS.map((item) => [item.id, item])
);

export function getMaterialLink(item: MaterialItem, preferSlide = false): string {
    if (preferSlide && item.links.slide) return item.links.slide;
    return item.links.slide || item.links.doc || item.links.download || '#programs';
}

export function formatUpdatedBadge(updated?: string): string {
    if (!updated) return '';
    return `${updated.replace('-', '.')} 업데이트`;
}

export const ROADMAP_STEPS: RoadmapStep[] = [
    {
        step: 1,
        materialId: 'ai-first-step',
        title: 'AI 이해',
        description: '생성형 AI 기본 개념과 두려움 극복, 직관적 이해',
        level: '입문',
        duration: '15분',
    },
    {
        step: 2,
        materialId: 'ai-education-guide',
        title: 'AI와 대화하기',
        description: 'ACTF 4원칙과 대화형 프롬프트 소통법',
        level: '입문',
        duration: '20분',
    },
    {
        step: 3,
        materialId: 'gen-ai-basics',
        title: '문서/이미지 만들기',
        description: '실무 행정 문서, 기획안, 이미지 생성 활용',
        level: '입문',
        duration: '20분',
    },
    {
        step: 4,
        materialId: 'easypastor',
        title: '나만의 AI 만들기',
        description: 'NotebookLM 기반 목회 신학 비서 구축',
        level: '중급',
        duration: '25분',
    },
    {
        step: 5,
        materialId: 'vibe-coding-workshop',
        title: '바이브코딩',
        description: '자연어 코딩으로 사역용 웹앱 3개 직접 제작',
        level: '중급',
        duration: '40분',
    },
    {
        step: 6,
        materialId: 'vibe-coding-workshop',
        anchor: '#s6',
        title: '데이터 연결',
        description: '구글 시트 연동 실시간 교인관리 대시보드',
        level: '중급',
        duration: '25분',
    },
    {
        step: 7,
        materialId: 'github-guide',
        title: '홈페이지·앱 제작 & 배포',
        description: '안티그래비티 앱 제작 & 깃허브 무료 배포 (13단계)',
        level: '고급',
        duration: '25분',
    },
    {
        step: 8,
        materialId: 'obsidian-second-brain',
        title: '세컨드 브레인',
        description: '지식관리의 진화 & 옵시디언 (정리: 김태주)',
        level: '고급',
        duration: '20분',
    },
    {
        step: 9,
        materialId: 'pastoral-wiki-lecture',
        title: '목회 위키 (LLM Wiki)',
        description: '옵시디언 & 클로드로 짓는 나만의 목회 위키 실전 (강의: 김태주)',
        level: '고급',
        duration: '30분',
    },
];

export const START_GUIDE_REFS: StartGuideRef[] = [
    {
        materialId: 'pastor-ai-seminar',
        icon: '💡',
        title: 'AI는 부지런한 손, 목회자는 뜨거운 심장',
        description: '설교 연구(미드라시·와키홀) & 2차 콘텐츠 & 라온동행교회(raondonghaeng.org) 실전 사례 25선',
        badgeText: 'NEW 특강',
        variant: 'seminar',
        showSlideButton: true,
    },
    {
        materialId: 'ai-first-step',
        icon: '🚀',
        title: 'AI 처음이에요',
        description: '기초 개념부터 두려움을 깨는 46개 슬라이드 완벽 가이드',
        variant: 'default',
        showSlideButton: true,
    },
    {
        materialId: 'kaa-ai-guide',
        icon: '📋',
        title: '3일 집중 AI 교육 사전 안내',
        description: '3일 집중 실전 AI 마스터 과정 사전 준비 & 체크리스트',
        badgeText: 'NEW 신규',
        arrowText: '안내서 보기 →',
        variant: 'guide',
    },
    {
        materialId: 'gen-ai-basics',
        icon: '💼',
        title: '업무에 AI를 활용하고 싶어요',
        description: 'ChatGPT 기본 사용법과 실무 프롬프트 엔지니어링',
        arrowText: '시작하기 →',
    },
    {
        materialId: 'easypastor',
        icon: '🧠',
        title: '나만의 AI를 만들고 싶어요',
        description: '목회 데이터로 구축하는 AI 신학 비서 (NotebookLM & Gemini)',
        arrowText: '시작하기 →',
    },
    {
        materialId: 'vibe-coding-workshop',
        icon: '🛠️',
        title: '바이브코딩으로 앱을 만들고 싶어요',
        description: '코드 없이 말로 사역용 웹앱 3개와 교회 홈페이지 제작',
        arrowText: '시작하기 →',
    },
    {
        materialId: 'ai-education-guide',
        icon: '📖',
        title: '강의를 진행하고 싶어요',
        description: '목회자·사역자 AI 교육자를 위한 마인드셋 & 프롬프트 커리큘럼',
        arrowText: '시작하기 →',
    },
];

export const FEATURED_HIGHLIGHT_REFS: FeaturedHighlightRef[] = [
    {
        materialId: 'kaa-ai-guide',
        badgeLabel: '🔥 NEW RELEASE',
        badgeStyle: 'primary',
        title: '한국인을 위한 3일 집중 AI 교육 사전 안내',
        description: '이광복·김태주 공동대표가 직접 전하는 3일 집중 AI 실전 마스터 사전 안내서입니다. AI 4대 기본 원칙, 3일간의 여정, 그리고 수업 첫날 필수 준비물 체크리스트를 확인하세요.',
        highlights: [
            { icon: '✅', text: '4대 기본 원칙 (소통/작업/커스터마이징/연결)' },
            { icon: '✅', text: '3일 집중 커리큘럼 (기초 → 바이브코딩 → 세컨드 브레인)' },
            { icon: '✅', text: '사전 준비물 & Google/AI 계정 점검 체크리스트' },
        ],
        fileTypeLabel: '📋 사전 안내서 · 체크리스트',
        buttonLabel: '가이드 열람하기 ↗️',
    },
    {
        materialId: 'vibe-coding-workshop',
        badgeLabel: '🛠️ MASTER WORKSHOP',
        badgeStyle: 'secondary',
        title: '목회자 바이브코딩 워크숍 강의안',
        description: '코드를 몰라도 자연어로 사역용 웹앱 3개(소그룹 나눔 질문기, 성경동화 생성기, 교인관리 대시보드)와 교회 홈페이지를 하루에 직접 만드는 마스터 진행안입니다.',
        highlights: [
            { icon: '💡', text: '브라우저만으로 완성하는 사역 앱 3종 실습' },
            { icon: '⚡', text: '구글 시트 연동 실시간 교인관리 대시보드' },
            { icon: '🚀', text: '안티그래비티 기반 교회 홈페이지 무료 배포' },
        ],
        fileTypeLabel: '🛠️ 마스터 강의안',
        buttonLabel: '워크숍 보기 ↗️',
    },
    {
        materialId: 'laos-feedback',
        badgeLabel: '📊 SPECIAL REPORT',
        badgeStyle: 'report',
        title: '라오스 선교사 AI 교육 피드백 결과',
        description: '3일간의 선교사 AI 활용 집중 교육 참가자 설문 분석 보고서입니다. 전반적 만족도(4.4/5), 자신감 향상(4.4/5), 사역 활용 가능성(4.5/5) 및 참가자 11인의 생생한 원문 피드백을 확인하세요.',
        highlights: [
            { icon: '📈', text: '종합 만족도 4.4점 & 지속 활용 의향 100% (4.5점)' },
            { icon: '💡', text: "'막연한 두려움 ➔ 자신감'으로의 실질적 인식 전환 입증" },
            { icon: '📝', text: '참가자 11인 자유 의견 원문 & 향후 심화 수요 분석' },
        ],
        fileTypeLabel: '📊 설문 분석 보고서',
        buttonLabel: '보고서 열람하기 ↗️',
    },
];
