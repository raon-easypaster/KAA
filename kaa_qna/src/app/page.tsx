'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ArchiveItem {
    id: string;
    title: string;
    description: string;
    href: string;
    target?: string;
    category: string;
    badgeClass: 'edu' | 'info' | 'web';
    audience: 'pastor' | 'welfare' | 'general';
    difficulty: '입문' | '중급' | '고급';
    diffClass: 'easy' | 'medium' | 'hard';
    time: string;
    fileType: string;
    actionText: string;
    isImportant?: boolean;
}

const ARCHIVE_ITEMS: ArchiveItem[] = [
    {
        id: 'ai-first-step',
        title: 'AI, 두려움을 넘어 일상으로 (어서와 AI는 처음이지)',
        description: '42개 핵심 슬라이드와 마스터 가이드북 (슬라이드 발표 모드 & 문서 뷰어 지원)',
        href: '/data/ai_first_step.html',
        target: '_blank',
        category: 'AI 첫걸음',
        badgeClass: 'edu',
        audience: 'pastor',
        difficulty: '입문',
        diffClass: 'easy',
        time: '약 15분',
        fileType: '💻 반응형 슬라이드',
        actionText: '열람하기 ↗️',
        isImportant: true,
    },
    {
        id: 'ai-education-guide',
        title: '목회자와 사역자를 위한 AI 교육 가이드',
        description: 'AI를 대하는 마인드셋과 소통 기술, 실무 적용 핵심 포인트를 안내합니다.',
        href: '/data/ai_education_guide.html',
        target: '_blank',
        category: '가이드',
        badgeClass: 'edu',
        audience: 'pastor',
        difficulty: '입문',
        diffClass: 'easy',
        time: '약 30분',
        fileType: '📄 인포그래픽',
        actionText: '열람하기 ↗️',
        isImportant: true,
    },
    {
        id: 'kaa-ai-guide',
        title: '한국인을 위한 3일 집중 AI 교육 사전 안내',
        description: '이광복·김태주 공동대표의 3일 집중 실전 AI 마스터 과정 사전 안내 & 준비물 체크리스트',
        href: '/data/kaa-ai-guide.html',
        target: '_blank',
        category: '집중 교육',
        badgeClass: 'edu',
        audience: 'pastor',
        difficulty: '입문',
        diffClass: 'easy',
        time: '약 15분',
        fileType: '📋 사전 안내서',
        actionText: '열람하기 ↗️',
        isImportant: true,
    },
    {
        id: 'vibe-coding-workshop',
        title: '목회자 바이브코딩 워크숍 (코드를 몰라도 도구를 만든다)',
        description: '사역용 앱 3개와 교회 홈페이지를 하루에 직접 만드는 마스터 진행안입니다.',
        href: '/data/vibe_coding_workshop.html',
        target: '_blank',
        category: '워크숍 마스터',
        badgeClass: 'edu',
        audience: 'pastor',
        difficulty: '중급',
        diffClass: 'medium',
        time: '약 40분',
        fileType: '🛠️ 마스터 강의안',
        actionText: '열람하기 ↗️',
        isImportant: true,
    },
    {
        id: 'gen-ai-basics',
        title: '생성형 AI 기초 과정 (Generative AI Basics)',
        description: 'ChatGPT 활용법 및 기초 프롬프트 엔지니어링 강의안입니다.',
        href: '/data/gen_ai_basics.html',
        target: '_blank',
        category: '교육자료',
        badgeClass: 'edu',
        audience: 'general',
        difficulty: '입문',
        diffClass: 'easy',
        time: '약 20분',
        fileType: '📄 실무 가이드',
        actionText: '열람하기 ↗️',
        isImportant: true,
    },
    {
        id: 'ai-workshop',
        title: '2026 AI 실무 워크북 (AI Workshop)',
        description: '업무 효율화의 완성을 위한 가이드북입니다.',
        href: '/data/ai_workshop.html',
        target: '_blank',
        category: '워크숍',
        badgeClass: 'edu',
        audience: 'general',
        difficulty: '중급',
        diffClass: 'medium',
        time: '약 35분',
        fileType: '🔗 열람 가능',
        actionText: '확인하기 ↗️',
        isImportant: false,
    },
    {
        id: 'landing-page-guide',
        title: '랜딩페이지란 무엇인가? (Landing Page Guide)',
        description: '목회자를 위한 랜딩페이지 제작 가이드 (읽기 15분 · 실습 90분 워크북)',
        href: '/data/landing_page_guide.html',
        target: '_blank',
        category: '목회자용',
        badgeClass: 'info',
        audience: 'pastor',
        difficulty: '입문',
        diffClass: 'easy',
        time: '읽기 15분 · 실습 90분',
        fileType: '🔗 열람 가능',
        actionText: '확인하기 ↗️',
        isImportant: false,
    },
    {
        id: 'welfare-landing-guide',
        title: '장애인 사회복지사를 위한 랜딩페이지 워크북',
        description: '디지털 복지 소통을 위한 랜딩페이지 제작 워크북 (Canva · GitHub · Gemini)',
        href: '/data/welfare_landing_guide.html',
        target: '_blank',
        category: '사회복지사용',
        badgeClass: 'info',
        audience: 'welfare',
        difficulty: '입문',
        diffClass: 'easy',
        time: '읽기 15분 · 실습 90분',
        fileType: '📋 워크북',
        actionText: '열람하기 ↗️',
        isImportant: true,
    },
    {
        id: 'github-guide',
        title: '안티그래비티 & 깃허브 웹 배포 가이드 (13단계)',
        description: '안티그래비티 및 제미나이 생성 코드를 깃허브로 무료 배포하는 13단계 안내입니다.',
        href: '/data/github.html',
        target: '_blank',
        category: '배포 실무',
        badgeClass: 'info',
        audience: 'general',
        difficulty: '중급',
        diffClass: 'medium',
        time: '약 25분',
        fileType: '📄 인포그래픽',
        actionText: '열람하기 ↗️',
        isImportant: true,
    },
    {
        id: 'rd-aistudio',
        title: '라온동행교회 AI 활용법',
        description: '라온동행교회 교인들을 위한 AI 사용 방법 안내입니다.',
        href: '/data/rd_aistudio.html',
        target: '_blank',
        category: '교회 적용',
        badgeClass: 'info',
        audience: 'pastor',
        difficulty: '입문',
        diffClass: 'easy',
        time: '약 15분',
        fileType: '🔗 열람 가능',
        actionText: '확인하기 ↗️',
        isImportant: false,
    },
    {
        id: 'aistudio',
        title: 'AI스튜디오 활용법 (AI Studio)',
        description: 'Google AI Studio 사용 방법 안내입니다.',
        href: '/data/aistudio.html',
        target: '_blank',
        category: '도구 활용',
        badgeClass: 'info',
        audience: 'general',
        difficulty: '중급',
        diffClass: 'medium',
        time: '약 25분',
        fileType: '🔗 열람 가능',
        actionText: '확인하기 ↗️',
        isImportant: false,
    },
    {
        id: 'easypastor',
        title: '미래 목회를 위한 AI 신학 비서 (Easy Pastor)',
        description: 'NotebookLM 신학 비서 3단계 구축법 및 실전 프롬프트 레시피 4선 가이드입니다.',
        href: '/data/easypastor.html',
        target: '_blank',
        category: '신학 비서',
        badgeClass: 'info',
        audience: 'pastor',
        difficulty: '중급',
        diffClass: 'medium',
        time: '약 25분',
        fileType: '🔗 열람 가능',
        actionText: '확인하기 ↗️',
        isImportant: true,
    },
    {
        id: 'obsidian-second-brain',
        title: '지식관리의 진화 & 세컨드 브레인 (Obsidian & LLM Wiki)',
        description: '듀이십진분류부터 루만 제텔카스텐, PARA/CODE, 카르파티 LLM Wiki까지 150년 지식관리의 진화 (정리: 김태주)',
        href: '/data/obsidian_second_brain.html',
        target: '_blank',
        category: '세컨드 브레인',
        badgeClass: 'edu',
        audience: 'general',
        difficulty: '중급',
        diffClass: 'medium',
        time: '약 20분',
        fileType: '📄 인터랙티브 타임라인',
        actionText: '열람하기 ↗️',
        isImportant: true,
    },
    {
        id: 'pastoral-wiki-lecture',
        title: '손에 익히기: 목회 위키 구축 실전 (Obsidian & Claude Code)',
        description: '노트 4개로 시작하는 나만의 목회 위키 구축과 백링크 연결 실전 강의 (강사: 김태주 공동대표)',
        href: 'https://smdjoo-stack.github.io/pastoral-wiki-lecture/',
        target: '_blank',
        category: 'LLM Wiki',
        badgeClass: 'edu',
        audience: 'pastor',
        difficulty: '고급',
        diffClass: 'hard',
        time: '약 30분',
        fileType: '💻 슬라이드 덱',
        actionText: '열람하기 ↗️',
        isImportant: true,
    },
    {
        id: 'laos-feedback',
        title: '라오스 선교사 AI 교육 피드백 결과 (설문 분석 보고서)',
        description: '3일간의 선교사 AI 집중 교육 만족도(4.3/5), 자신감 향상(4.4/5) 및 참가자 10인의 생생한 원문 피드백 수록',
        href: '/data/laos_feedback.html',
        target: '_blank',
        category: '교육 보고서',
        badgeClass: 'edu',
        audience: 'pastor',
        difficulty: '입문',
        diffClass: 'easy',
        time: '약 10분',
        fileType: '📊 설문 분석 보고서',
        actionText: '열람하기 ↗️',
        isImportant: true,
    },
];

export default function HomePage() {
    const [audienceFilter, setAudienceFilter] = useState<'all' | 'pastor' | 'welfare' | 'general'>('all');
    const [visits, setVisits] = useState<{ total: number; today: number }>({ total: 1380, today: 24 });

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const fadeElements = document.querySelectorAll('.fade-up');
        fadeElements.forEach(el => observer.observe(el));

        // Visitor counter fetch & recording
        try {
            const hasHit = sessionStorage.getItem('kaa_session_hit');
            const method = hasHit ? 'GET' : 'POST';
            fetch('/api/counter', { method })
                .then(res => res.json())
                .then(data => {
                    if (data && data.total) {
                        setVisits({ total: data.total, today: data.today });
                        if (!hasHit) {
                            sessionStorage.setItem('kaa_session_hit', 'true');
                        }
                    }
                })
                .catch(err => console.warn('Visitor counter fetch error:', err));
        } catch (e) {
            console.warn(e);
        }

        return () => observer.disconnect();
    }, []);

    const filteredItems = audienceFilter === 'all'
        ? ARCHIVE_ITEMS
        : ARCHIVE_ITEMS.filter(item => item.audience === audienceFilter);

    return (
        <>
            {/* ================= Hero ================= */}
            <section className="hero hero-main">
                <div className="container">
                    <div className="hero-content fade-up">
                        <span className="hero-eyebrow">Korea AI Research Institute Archive</span>
                        <h1 className="hero-title">
                            미래를 여는 기술,<br />
                            배움과 성장의 기록을 나눕니다
                        </h1>
                        <p className="hero-subtitle">
                            한국AI연구소 아카이브는 AI 교육, 연구, 그리고 커뮤니티 성장을 돕는 자료를 지속적으로 공유하고 아카이빙하는 프로젝트입니다.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <a href="#start-guide" className="btn btn-primary">시작점 찾기 🚀</a>
                            <a href="#programs" className="btn btn-secondary">전체 자료실 ⬇️</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= 1. 시작점 선택 섹션 ================= */}
            <section className="start-section" id="start-guide">
                <div className="container fade-up">
                    <div className="start-header">
                        <span className="start-eyebrow">Custom Path</span>
                        <h2 className="start-title">나에게 맞는 시작점 찾기</h2>
                        <p className="start-subtitle">
                            현재 고민이나 사역 상황에 맞춰 가장 알맞은 가이드와 워크숍을 추천해 드립니다.
                        </p>
                    </div>

                    <div className="start-grid">
                        {/* Option 1 */}
                        <a href="/data/ai_first_step.html" target="_blank" className="start-card">
                            <div>
                                <span className="start-card-icon">🚀</span>
                                <h3 className="start-card-title">AI 처음이에요</h3>
                                <p className="start-card-desc">기초 개념부터 두려움을 깨는 42개 슬라이드 완벽 가이드</p>
                            </div>
                            <div className="start-card-footer">
                                <span className="start-time-badge">⏱️ 약 15분</span>
                                <span className="start-card-arrow">시작하기 →</span>
                            </div>
                        </a>

                        {/* Option 2: 3일 집중 교육 */}
                        <a href="/data/kaa-ai-guide.html" target="_blank" className="start-card" style={{ borderColor: '#225d52', background: 'linear-gradient(135deg, rgba(230, 240, 235, 0.4) 0%, #ffffff 100%)' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <span className="start-card-icon" style={{ margin: 0 }}>📋</span>
                                    <span style={{ background: '#123b35', color: '#f8e3aa', fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '12px' }}>NEW 신규</span>
                                </div>
                                <h3 className="start-card-title">3일 집중 AI 교육 사전 안내</h3>
                                <p className="start-card-desc">3일 집중 실전 AI 마스터 과정 사전 준비 & 체크리스트</p>
                            </div>
                            <div className="start-card-footer">
                                <span className="start-time-badge">⏱️ 약 15분</span>
                                <span className="start-card-arrow" style={{ color: '#123b35' }}>안내서 보기 →</span>
                            </div>
                        </a>

                        {/* Option 3 */}
                        <a href="/data/gen_ai_basics.html" target="_blank" className="start-card">
                            <div>
                                <span className="start-card-icon">💼</span>
                                <h3 className="start-card-title">업무에 AI를 활용하고 싶어요</h3>
                                <p className="start-card-desc">ChatGPT 기본 사용법과 실무 프롬프트 엔지니어링</p>
                            </div>
                            <div className="start-card-footer">
                                <span className="start-time-badge">⏱️ 약 20분</span>
                                <span className="start-card-arrow">시작하기 →</span>
                            </div>
                        </a>

                        {/* Option 4 */}
                        <a href="/data/easypastor.html" target="_blank" className="start-card">
                            <div>
                                <span className="start-card-icon">🧠</span>
                                <h3 className="start-card-title">나만의 AI를 만들고 싶어요</h3>
                                <p className="start-card-desc">목회 데이터로 구축하는 AI 신학 비서 (NotebookLM & Gemini)</p>
                            </div>
                            <div className="start-card-footer">
                                <span className="start-time-badge">⏱️ 약 25분</span>
                                <span className="start-card-arrow">시작하기 →</span>
                            </div>
                        </a>

                        {/* Option 5 */}
                        <a href="/data/vibe_coding_workshop.html" target="_blank" className="start-card">
                            <div>
                                <span className="start-card-icon">🛠️</span>
                                <h3 className="start-card-title">바이브코딩으로 앱을 만들고 싶어요</h3>
                                <p className="start-card-desc">코드 없이 말로 사역용 웹앱 3개와 교회 홈페이지 제작</p>
                            </div>
                            <div className="start-card-footer">
                                <span className="start-time-badge">⏱️ 약 40분</span>
                                <span className="start-card-arrow">시작하기 →</span>
                            </div>
                        </a>

                        {/* Option 6 */}
                        <a href="/data/ai_education_guide.html" target="_blank" className="start-card">
                            <div>
                                <span className="start-card-icon">📖</span>
                                <h3 className="start-card-title">강의를 진행하고 싶어요</h3>
                                <p className="start-card-desc">목회자·사역자 AI 교육자를 위한 마인드셋 & 프롬프트 커리큘럼</p>
                            </div>
                            <div className="start-card-footer">
                                <span className="start-time-badge">⏱️ 약 30분</span>
                                <span className="start-card-arrow">시작하기 →</span>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            {/* ================= About ================= */}
            <section className="section about-section" id="about">
                <div className="container fade-up">
                    <h2 className="section-title">연구소 소개</h2>
                    <div className="about-declaration">
                        <p>
                            한국AI연구소는 급변하는 인공지능 시대에 맞춰 우리 삶과 산업 현장에 가장 실용적이고 윤리적인 AI 활용 방안을 연구합니다.
                        </p>
                        <p>
                            복잡한 기술의 진입 장벽을 낮추고, 누구나 쉽게 생성형 AI를 업무와 일상에 접목할 수 있도록 교육 및 아카이빙 프로젝트를 전개하고 있습니다.
                        </p>
                    </div>
                    <div className="quote-highlight">
                        "AI는 기술을 넘어, 사람과 세상을 더 이롭게 연결하는 다리입니다."
                    </div>
                </div>
            </section>

            {/* ================= 2. 학습 로드맵 섹션 ================= */}
            <section className="roadmap-section" id="roadmap">
                <div className="container fade-up">
                    <div className="roadmap-header">
                        <span className="start-eyebrow">Curriculum Roadmap</span>
                        <h2 className="section-title">AI 단계별 학습 로드맵</h2>
                        <p className="start-subtitle">
                            기초 이해부터 실무 도구 제작, 세컨드 브레인 구축까지 단계별 추천 학습 흐름입니다.
                        </p>
                    </div>

                    <div className="roadmap-grid">
                        {/* Step 1 */}
                        <a href="/data/ai_first_step.html" target="_blank" className="roadmap-step-card">
                            <div>
                                <span className="roadmap-step-num">1</span>
                                <h3 className="roadmap-step-title">AI 이해</h3>
                                <p className="roadmap-step-desc">생성형 AI 기본 개념과 두려움 극복, 직관적 이해</p>
                            </div>
                            <div className="roadmap-badges">
                                <span className="badge-diff easy">입문</span>
                                <span className="badge-time">15분</span>
                            </div>
                        </a>

                        {/* Step 2 */}
                        <a href="/data/ai_education_guide.html" target="_blank" className="roadmap-step-card">
                            <div>
                                <span className="roadmap-step-num">2</span>
                                <h3 className="roadmap-step-title">AI와 대화하기</h3>
                                <p className="roadmap-step-desc">ACTF 4원칙과 대화형 프롬프트 소통법</p>
                            </div>
                            <div className="roadmap-badges">
                                <span className="badge-diff easy">입문</span>
                                <span className="badge-time">20분</span>
                            </div>
                        </a>

                        {/* Step 3 */}
                        <a href="/data/gen_ai_basics.html" target="_blank" className="roadmap-step-card">
                            <div>
                                <span className="roadmap-step-num">3</span>
                                <h3 className="roadmap-step-title">문서/이미지 만들기</h3>
                                <p className="roadmap-step-desc">실무 행정 문서, 기획안, 이미지 생성 활용</p>
                            </div>
                            <div className="roadmap-badges">
                                <span className="badge-diff easy">입문</span>
                                <span className="badge-time">20분</span>
                            </div>
                        </a>

                        {/* Step 4 */}
                        <a href="/data/easypastor.html" target="_blank" className="roadmap-step-card">
                            <div>
                                <span className="roadmap-step-num">4</span>
                                <h3 className="roadmap-step-title">나만의 AI 만들기</h3>
                                <p className="roadmap-step-desc">NotebookLM 기반 목회 신학 비서 구축</p>
                            </div>
                            <div className="roadmap-badges">
                                <span className="badge-diff medium">중급</span>
                                <span className="badge-time">25분</span>
                            </div>
                        </a>

                        {/* Step 5 */}
                        <a href="/data/vibe_coding_workshop.html" target="_blank" className="roadmap-step-card">
                            <div>
                                <span className="roadmap-step-num">5</span>
                                <h3 className="roadmap-step-title">바이브코딩</h3>
                                <p className="roadmap-step-desc">자연어 코딩으로 사역용 웹앱 3개 직접 제작</p>
                            </div>
                            <div className="roadmap-badges">
                                <span className="badge-diff medium">중급</span>
                                <span className="badge-time">40분</span>
                            </div>
                        </a>

                        {/* Step 6 */}
                        <a href="/data/vibe_coding_workshop.html#s6" target="_blank" className="roadmap-step-card">
                            <div>
                                <span className="roadmap-step-num">6</span>
                                <h3 className="roadmap-step-title">데이터 연결</h3>
                                <p className="roadmap-step-desc">구글 시트 연동 실시간 교인관리 대시보드</p>
                            </div>
                            <div className="roadmap-badges">
                                <span className="badge-diff medium">중급</span>
                                <span className="badge-time">25분</span>
                            </div>
                        </a>

                        {/* Step 7 */}
                        <a href="/data/github.html" target="_blank" className="roadmap-step-card">
                            <div>
                                <span className="roadmap-step-num">7</span>
                                <h3 className="roadmap-step-title">홈페이지·앱 제작 & 배포</h3>
                                <p className="roadmap-step-desc">안티그래비티 앱 제작 & 깃허브 무료 배포 (13단계)</p>
                            </div>
                            <div className="roadmap-badges">
                                <span className="badge-diff hard">고급</span>
                                <span className="badge-time">25분</span>
                            </div>
                        </a>

                        {/* Step 8 */}
                        <a href="/data/obsidian_second_brain.html" target="_blank" className="roadmap-step-card">
                            <div>
                                <span className="roadmap-step-num">8</span>
                                <h3 className="roadmap-step-title">세컨드 브레인</h3>
                                <p className="roadmap-step-desc">지식관리의 진화 & 옵시디언 (정리: 김태주)</p>
                            </div>
                            <div className="roadmap-badges">
                                <span className="badge-diff hard">고급</span>
                                <span className="badge-time">20분</span>
                            </div>
                        </a>

                        {/* Step 9 */}
                        <a href="https://smdjoo-stack.github.io/pastoral-wiki-lecture/" target="_blank" className="roadmap-step-card">
                            <div>
                                <span className="roadmap-step-num">9</span>
                                <h3 className="roadmap-step-title">목회 위키 (LLM Wiki)</h3>
                                <p className="roadmap-step-desc">옵시디언 & 클로드로 짓는 나만의 목회 위키 실전 (강의: 김태주)</p>
                            </div>
                            <div className="roadmap-badges">
                                <span className="badge-diff hard">고급</span>
                                <span className="badge-time">30분</span>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            {/* ================= 🌟 신규 추천 가이드 섹션 ================= */}
            <section className="featured-section" id="featured">
                <div className="container fade-up">
                    <div className="section-header-compact">
                        <span className="start-eyebrow">NEW RELEASE & HIGHLIGHT</span>
                        <h2 className="section-title">신규 추천 가이드</h2>
                        <p className="start-subtitle">
                            한국AI연구소에서 새롭게 공개한 3일 집중 실전 가이드 및 핵심 워크숍 안내서입니다.
                        </p>
                    </div>

                    <div className="featured-grid">
                        {/* Featured Card 1: 3일 집중 교육 사전 안내 */}
                        <div className="featured-card primary-featured">
                            <div>
                                <div className="featured-badge-row">
                                    <span className="badge-featured">🔥 NEW RELEASE</span>
                                    <span className="badge-diff easy">입문</span>
                                    <span className="badge-time">⏱️ 약 15분</span>
                                </div>
                                <h3 className="featured-title">한국인을 위한 3일 집중 AI 교육 사전 안내</h3>
                                <p className="featured-desc">
                                    이광복·김태주 공동대표가 직접 전하는 3일 집중 AI 실전 마스터 사전 안내서입니다. AI 4대 기본 원칙, 3일간의 여정, 그리고 수업 첫날 필수 준비물 체크리스트를 확인하세요.
                                </p>
                                <div className="featured-highlights">
                                    <div className="feat-item"><span>✅</span> 4대 기본 원칙 (소통/작업/커스터마이징/연결)</div>
                                    <div className="feat-item"><span>✅</span> 3일 집중 커리큘럼 (기초 → 바이브코딩 → 세컨드 브레인)</div>
                                    <div className="feat-item"><span>✅</span> 사전 준비물 &amp; Google/AI 계정 점검 체크리스트</div>
                                </div>
                            </div>
                            <div className="featured-footer">
                                <span className="file-type">📋 사전 안내서 · 체크리스트</span>
                                <a href="/data/kaa-ai-guide.html" target="_blank" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.95rem' }}>
                                    가이드 열람하기 ↗️
                                </a>
                            </div>
                        </div>

                        {/* Featured Card 2: 바이브코딩 마스터 워크숍 */}
                        <div className="featured-card">
                            <div>
                                <div className="featured-badge-row">
                                    <span className="badge-featured secondary">🛠️ MASTER WORKSHOP</span>
                                    <span className="badge-diff medium">중급</span>
                                    <span className="badge-time">⏱️ 약 40분</span>
                                </div>
                                <h3 className="featured-title">목회자 바이브코딩 워크숍 강의안</h3>
                                <p className="featured-desc">
                                    코드를 몰라도 자연어로 사역용 웹앱 3개(소그룹 나눔 질문기, 성경동화 생성기, 교인관리 대시보드)와 교회 홈페이지를 하루에 직접 만드는 마스터 진행안입니다.
                                </p>
                                <div className="featured-highlights">
                                    <div className="feat-item"><span>💡</span> 브라우저만으로 완성하는 사역 앱 3종 실습</div>
                                    <div className="feat-item"><span>⚡</span> 구글 시트 연동 실시간 교인관리 대시보드</div>
                                    <div className="feat-item"><span>🚀</span> 안티그래비티 기반 교회 홈페이지 무료 배포</div>
                                </div>
                            </div>
                            <div className="featured-footer">
                                <span className="file-type">🛠️ 마스터 강의안 (260826)</span>
                                <a href="/data/vibe_coding_workshop.html" target="_blank" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.95rem' }}>
                                    워크숍 보기 ↗️
                                </a>
                            </div>
                        </div>

                        {/* Featured Card 3: 라오스 AI 교육 피드백 보고서 */}
                        <div className="featured-card">
                            <div>
                                <div className="featured-badge-row">
                                    <span className="badge-featured" style={{ background: '#2d7a52', color: '#fff' }}>📊 SPECIAL REPORT</span>
                                    <span className="badge-diff easy">보고서</span>
                                    <span className="badge-time">⏱️ 약 10분</span>
                                </div>
                                <h3 className="featured-title">라오스 선교사 AI 교육 피드백 결과</h3>
                                <p className="featured-desc">
                                    3일간의 선교사 AI 활용 집중 교육 참가자 설문 분석 보고서입니다. 전반적 만족도(4.3/5), 자신감 향상(4.4/5), 사역 활용 가능성(4.5/5) 및 참가자 10인의 생생한 원문 피드백을 확인하세요.
                                </p>
                                <div className="featured-highlights">
                                    <div className="feat-item"><span>📈</span> 종합 만족도 4.3점 &amp; 지속 활용 의향 100% (4.5점)</div>
                                    <div className="feat-item"><span>💡</span> '막연한 두려움 ➔ 자신감'으로의 실질적 인식 전환 입증</div>
                                    <div className="feat-item"><span>📝</span> 참가자 10인 자유 의견 원문 &amp; 향후 심화 수요 분석</div>
                                </div>
                            </div>
                            <div className="featured-footer">
                                <span className="file-type">📊 설문 분석 보고서 (260903)</span>
                                <a href="/data/laos_feedback.html" target="_blank" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.95rem', background: '#2d7a52', borderColor: '#2d7a52' }}>
                                    보고서 열람하기 ↗️
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= 🛠️ 추천 도구 & AI 에이전트 가이드 ================= */}
            <section className="tools-section" id="ai-tools">
                <div className="container fade-up">
                    <div className="start-header">
                        <span className="start-eyebrow">CURATED AI TOOLS & AGENTS</span>
                        <h2 className="start-title">추천 AI 도구 &amp; 에이전트 가이드</h2>
                        <p className="start-subtitle">
                            한국AI연구소 강의와 실습에서 실제로 검증하고 추천하는 핵심 도구와 차세대 AI 에이전트 모음입니다.
                        </p>
                    </div>

                    {/* 1. 3대 핵심 코딩 에이전트 */}
                    <div className="tools-category-block">
                        <div className="tools-category-header">
                            <span style={{ fontSize: '1.4rem' }}>🤖</span>
                            <h3 className="tools-category-title">3대 핵심 코딩 에이전트 (AI Agents)</h3>
                            <span className="tools-category-desc">사람의 말(자연어)을 이해하여 기획부터 코딩, 디버깅, 배포까지 자율 수행</span>
                        </div>
                        <div className="tools-grid">
                            {/* Agent 1: Antigravity */}
                            <div className="tool-card tool-card-highlight">
                                <div className="tool-card-top">
                                    <div className="tool-badge-row">
                                        <span className="tool-icon">🚀</span>
                                        <span className="tool-tag agent">Google DeepMind</span>
                                    </div>
                                    <h4 className="tool-name">구글 안티그래비티<br /><small style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-500)' }}>(Google Antigravity)</small></h4>
                                    <div className="tool-summary">올인원 자율 코딩 &amp; 웹 배포 에이전트</div>
                                    <p className="tool-desc">
                                        단순 코드 생성을 넘어 계획 수립(Planning)부터 터미널 실행, 브라우저 진단, 깃허브 푸시, Vercel/Netlify 배포까지 대신 완수하는 차세대 에이전틱 AI 환경입니다.
                                    </p>
                                    <ul className="tool-features">
                                        <li><span>✓</span> 코딩 몰라도 자연어로 교회 웹앱/홈페이지 제작</li>
                                        <li><span>✓</span> 터미널 명령·네트워크 진단·멀티 파일 자율 수정</li>
                                        <li><span>✓</span> 한 번의 대화로 전 세계 무료 호스팅 배포 완결</li>
                                    </ul>
                                </div>
                                <div className="tool-card-footer">
                                    <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 600 }}>실습 핵심 도구</span>
                                    <a href="/data/vibe_coding_workshop.html" target="_blank" className="tool-link-btn">워크숍 보기 →</a>
                                </div>
                            </div>

                            {/* Agent 2: OpenAI Codex */}
                            <div className="tool-card">
                                <div className="tool-card-top">
                                    <div className="tool-badge-row">
                                        <span className="tool-icon">🧠</span>
                                        <span className="tool-tag agent">OpenAI</span>
                                    </div>
                                    <h4 className="tool-name">오픈AI 코덱스<br /><small style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-500)' }}>(OpenAI Codex)</small></h4>
                                    <div className="tool-summary">자연어 ➔ 코드 변환의 원천 엔진</div>
                                    <p className="tool-desc">
                                        수십억 줄의 오픈소스 코드를 학습하여 자연어를 컴퓨터 코드로 바꿔주는 현대 AI 코딩의 시초이자 GitHub Copilot의 원천 두뇌입니다.
                                    </p>
                                    <ul className="tool-features">
                                        <li><span>✓</span> 자연어 주석만으로 프로그래밍 코드 자동 생성</li>
                                        <li><span>✓</span> 구글 시트 교인관리 자동화 스크립트 작성</li>
                                        <li><span>✓</span> 복잡한 매크로 및 코드 한글 번역·해설</li>
                                    </ul>
                                </div>
                                <div className="tool-card-footer">
                                    <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 600 }}>원천 엔진 기술</span>
                                    <a href="https://openai.com/index/openai-codex/" target="_blank" rel="noopener noreferrer" className="tool-link-btn">공식 사이트 ↗️</a>
                                </div>
                            </div>

                            {/* Agent 3: Claude Code */}
                            <div className="tool-card tool-card-highlight">
                                <div className="tool-card-top">
                                    <div className="tool-badge-row">
                                        <span className="tool-icon">🛠️</span>
                                        <span className="tool-tag agent">Anthropic</span>
                                    </div>
                                    <h4 className="tool-name">앤트로픽 클로드 코드<br /><small style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-500)' }}>(Claude Code)</small></h4>
                                    <div className="tool-summary">터미널 기반 대규모 파일 &amp; 위키 구축</div>
                                    <p className="tool-desc">
                                        터미널(CLI)에서 내 컴퓨터의 전체 폴더와 파일을 직접 다루며, 수많은 설교 원고와 노트를 연결하여 나만의 목회 위키(LLM Wiki)를 자율 구축합니다.
                                    </p>
                                    <ul className="tool-features">
                                        <li><span>✓</span> 설교 마크다운 파일 수백 개 자동 백링크 연결</li>
                                        <li><span>✓</span> [김태주 대표] 옵시디언 목회 위키 실전 도구</li>
                                        <li><span>✓</span> 프로젝트 대규모 문서 일괄 정밀 수정</li>
                                    </ul>
                                </div>
                                <div className="tool-card-footer">
                                    <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 600 }}>위키 구축 도구</span>
                                    <a href="https://claude.ai/code" target="_blank" rel="noopener noreferrer" className="tool-link-btn">공식 사이트 ↗️</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. 코드 저장 & 무료 웹 배포 */}
                    <div className="tools-category-block">
                        <div className="tools-category-header">
                            <span style={{ fontSize: '1.4rem' }}>🚀</span>
                            <h3 className="tools-category-title">코드 저장 &amp; 무료 웹 배포 (Hosting &amp; Deployment)</h3>
                            <span className="tools-category-desc">내가 만든 웹페이지와 사역 도구를 전 세계에 무료로 발행</span>
                        </div>
                        <div className="tools-grid">
                            {/* GitHub */}
                            <div className="tool-card">
                                <div className="tool-card-top">
                                    <div className="tool-badge-row">
                                        <span className="tool-icon">🐙</span>
                                        <span className="tool-tag">저장소 &amp; 배포</span>
                                    </div>
                                    <h4 className="tool-name">GitHub (깃허브)</h4>
                                    <div className="tool-summary">소스코드 저장 &amp; 평생 무료 웹 호스팅</div>
                                    <p className="tool-desc">
                                        자료와 코드를 안전하게 보관하고, <strong>GitHub Pages</strong>를 통해 동남아/라오스/한국 어디서든 끊김 없는 초고속 무료 웹사이트를 배포합니다.
                                    </p>
                                </div>
                                <div className="tool-card-footer">
                                    <a href="/data/github.html" target="_blank" className="tool-link-btn">13단계 가이드 →</a>
                                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="tool-link-btn">github.com ↗️</a>
                                </div>
                            </div>

                            {/* Netlify */}
                            <div className="tool-card">
                                <div className="tool-card-top">
                                    <div className="tool-badge-row">
                                        <span className="tool-icon">🌐</span>
                                        <span className="tool-tag">드래그 배포</span>
                                    </div>
                                    <h4 className="tool-name">Netlify (넷리파이)</h4>
                                    <div className="tool-summary">폴더 드래그 3초 만에 글로벌 웹 배포</div>
                                    <p className="tool-desc">
                                        깃허브 연동뿐만 아니라 내 컴퓨터의 HTML 폴더를 마우스로 끌어다 놓기만 해도(Drop to deploy) 즉시 무료 웹사이트로 띄워줍니다.
                                    </p>
                                </div>
                                <div className="tool-card-footer">
                                    <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>AWS 싱가포르 CDN</span>
                                    <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer" className="tool-link-btn">netlify.com ↗️</a>
                                </div>
                            </div>

                            {/* Vercel */}
                            <div className="tool-card">
                                <div className="tool-card-top">
                                    <div className="tool-badge-row">
                                        <span className="tool-icon">⚡</span>
                                        <span className="tool-tag">풀스택 호스팅</span>
                                    </div>
                                    <h4 className="tool-name">Vercel (버셀)</h4>
                                    <div className="tool-summary">Next.js &amp; 웹앱 글로벌 엣지 자동 배포</div>
                                    <p className="tool-desc">
                                        Next.js 제작사에서 제공하는 클라우드 플랫폼으로, 깃허브 푸시와 동시에 전 세계 엣지 서버에 고성능으로 자동 빌드 및 배포됩니다.
                                    </p>
                                </div>
                                <div className="tool-card-footer">
                                    <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>글로벌 엣지 배포</span>
                                    <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="tool-link-btn">vercel.com ↗️</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. 생성형 AI & 신학 비서 / 지식관리 */}
                    <div className="tools-category-block" style={{ marginBottom: 0 }}>
                        <div className="tools-category-header">
                            <span style={{ fontSize: '1.4rem' }}>📚</span>
                            <h3 className="tools-category-title">생성형 AI 모델 &amp; 신학 비서 / 지식관리</h3>
                            <span className="tools-category-desc">생각을 확장하고 나만의 지식을 축적하는 필수 도구</span>
                        </div>
                        <div className="tools-grid">
                            {/* NotebookLM */}
                            <div className="tool-card">
                                <div className="tool-card-top">
                                    <div className="tool-badge-row">
                                        <span className="tool-icon">📖</span>
                                        <span className="tool-tag">신학 비서</span>
                                    </div>
                                    <h4 className="tool-name">Google NotebookLM</h4>
                                    <div className="tool-summary">내 문서 기반 환각 없는 AI 신학 비서</div>
                                    <p className="tool-desc">
                                        내 설교 원고, 성경 주석, 신학 서적(PDF)을 업로드하여 오직 내 자료만을 근거로 정확하게 답변하고 2인 팟캐스트 오디오를 생성합니다.
                                    </p>
                                </div>
                                <div className="tool-card-footer">
                                    <a href="/data/easypastor.html" target="_blank" className="tool-link-btn">구축 가이드 →</a>
                                    <a href="https://notebooklm.google.com" target="_blank" rel="noopener noreferrer" className="tool-link-btn">접속하기 ↗️</a>
                                </div>
                            </div>

                            {/* Obsidian */}
                            <div className="tool-card">
                                <div className="tool-card-top">
                                    <div className="tool-badge-row">
                                        <span className="tool-icon">📓</span>
                                        <span className="tool-tag">세컨드 브레인</span>
                                    </div>
                                    <h4 className="tool-name">Obsidian (옵시디언)</h4>
                                    <div className="tool-summary">로컬 마크다운 제텔카스텐 지식 위키</div>
                                    <p className="tool-desc">
                                        서버 없이 내 컴퓨터에 영구 보관되는 마크다운 노트 앱으로, 설교와 성경 구절 간의 쌍방향 백링크(`[[본문]]`) 연결을 지원합니다.
                                    </p>
                                </div>
                                <div className="tool-card-footer">
                                    <a href="/data/obsidian_second_brain.html" target="_blank" className="tool-link-btn">진화사 타임라인 →</a>
                                    <a href="https://obsidian.md" target="_blank" rel="noopener noreferrer" className="tool-link-btn">obsidian.md ↗️</a>
                                </div>
                            </div>

                            {/* 5 Models Quick Card */}
                            <div className="tool-card">
                                <div className="tool-card-top">
                                    <div className="tool-badge-row">
                                        <span className="tool-icon">💬</span>
                                        <span className="tool-tag">5대 대화형 AI</span>
                                    </div>
                                    <h4 className="tool-name">ChatGPT · Claude · Gemini</h4>
                                    <div className="tool-summary">사역 목적별 맞춤형 AI 모델 선택</div>
                                    <p className="tool-desc">
                                        행정 문서/기획(ChatGPT), 장문 분석/바이브코딩(Claude), 구글 생태계 연동/AI Studio(Gemini), 실시간 리서치(Grok/Perplexity)를 상황에 맞게 활용합니다.
                                    </p>
                                </div>
                                <div className="tool-card-footer">
                                    <a href="/data/ai_first_step.html#s19" target="_blank" className="tool-link-btn">5대 모델 비교표 →</a>
                                    <a href="/data/aistudio.html" target="_blank" className="tool-link-btn">AI Studio 가이드 →</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= Archive & Filters ================= */}
            <section className="section" id="programs">
                <div className="container fade-up">
                    <h2 className="section-title">자료실 & 아카이브</h2>
                    <p className="section-intro">
                        한국AI연구소에서 제공하는 최신 AI 교육 자료, 실습 워크북 및 웹사이트 링크를 확인하세요.
                    </p>

                    {/* 3. 대상별 필터 버튼 */}
                    <div className="filter-container">
                        <button
                            type="button"
                            className={`filter-btn ${audienceFilter === 'all' ? 'active' : ''}`}
                            onClick={() => setAudienceFilter('all')}
                        >
                            전체보기 ({ARCHIVE_ITEMS.length})
                        </button>
                        <button
                            type="button"
                            className={`filter-btn ${audienceFilter === 'pastor' ? 'active' : ''}`}
                            onClick={() => setAudienceFilter('pastor')}
                        >
                            목회자용 ({ARCHIVE_ITEMS.filter(i => i.audience === 'pastor').length})
                        </button>
                        <button
                            type="button"
                            className={`filter-btn ${audienceFilter === 'welfare' ? 'active' : ''}`}
                            onClick={() => setAudienceFilter('welfare')}
                        >
                            사회복지사용 ({ARCHIVE_ITEMS.filter(i => i.audience === 'welfare').length})
                        </button>
                        <button
                            type="button"
                            className={`filter-btn ${audienceFilter === 'general' ? 'active' : ''}`}
                            onClick={() => setAudienceFilter('general')}
                        >
                            일반 ({ARCHIVE_ITEMS.filter(i => i.audience === 'general').length})
                        </button>
                    </div>

                    <div className="archive-grid">
                        {filteredItems.map(item => (
                            <a
                                key={item.id}
                                href={item.href}
                                target={item.target || '_blank'}
                                className={`archive-card ${item.isImportant ? 'important' : ''}`}
                                data-audience={item.audience}
                            >
                                <div>
                                    <div className="card-meta-row">
                                        <span className={`badge ${item.badgeClass}`}>{item.category}</span>
                                        <span className={`badge-diff ${item.diffClass}`}>{item.difficulty}</span>
                                        <span className="badge-time">⏱️ {item.time}</span>
                                    </div>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </div>
                                <div className="card-footer">
                                    <span className="file-type">{item.fileType}</span>
                                    <span className="download-link">{item.actionText}</span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= Founders ================= */}
            <section className="section founder-section">
                <div className="container fade-up">
                    <span className="founder-title">Co-Representative</span>
                    <h2 className="founder-name">김태주 공동대표</h2>
                    <div className="founder-bio">
                        <p>
                            "혁신적인 디지털 기술이 시대를 이끌어가는 가운데, 누구도 소외받지 않고 새로운 미래를 준비할 수 있도록<br />
                            따뜻한 기술과 통찰력을 제공하는 한국AI연구소가 되겠습니다."
                        </p>
                    </div>
                    <div className="founder-history">
                        <h4>주요 학력 및 경력</h4>
                        <ul>
                            <li>성결대학교 신학과</li>
                            <li>서울신학대학교 대학원</li>
                            <li>현) 한국AI연구소 공동대표</li>
                            <li>현) 온교회 담임목사</li>
                            <li>다수의 IT 솔루션 기획 및 AI 비즈니스 컨설팅 수행</li>
                            <li>세컨드 브레인을 위한 옵시디언 강의 전문</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="section founder-section">
                <div className="container fade-up">
                    <span className="founder-title">Co-Representative</span>
                    <h2 className="founder-name">이광복 공동대표</h2>
                    <div className="founder-bio">
                        <p>
                            "기술은 결국 사람을 향해야 하며, 그 변화의 시작은 끊임없는 배움과 열정에서 시작된다고 믿습니다.<br />
                            한국AI연구소는 여러분의 잠재력이 기술이라는 날개를 달아 높이 비상할 수 있도록 가장 가까운 곳에서 조력하겠습니다.<br />
                            지속 가능한 성장을 꿈꾸는 모든 파트너와 함께, 혁신 그 이상의 가치를 실현하는 길을 걷겠습니다."
                        </p>
                    </div>
                    <div className="founder-history">
                        <h4>주요 학력 및 경력</h4>
                        <ul>
                            <li>서울신학대학교 신학과</li>
                            <li>서울신학대학교 신학대학원</li>
                            <li>현) 한국AI연구소 공동대표</li>
                            <li>현) 로스터리 카페 라온트리 대표</li>
                            <li>현) 라온동행교회 담임목사</li>
                            <li>직업별 AI 맞춤 컨설팅 및 강의 전문</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* ================= Contact ================= */}
            <section className="section" id="contact">
                <div className="container fade-up">
                    <h2 className="section-title">오시는 길 & 연락처</h2>
                    <div className="contact-content">
                        <div className="contact-info">
                            <div className="info-item">
                                <span className="label">주소</span>
                                <span className="value">경기 부천시 소사구 소사본동 소삼로36번길 6 지에브리 3층</span>
                            </div>
                            <div className="info-item">
                                <span className="label">전화</span>
                                <span className="value">010-5606-0845</span>
                            </div>
                            <div className="map-btns">
                                <a href="https://map.naver.com/p/search/%EA%B2%BD%EA%B8%B0%20%EB%B6%80%EC%B2%9C%EC%8B%9C%20%EC%86%8C%EC%82%AC%EA%B5%AC%20%EC%86%8C%EC%82%AC%EB%B3%B8%EB%8F%99%20%EC%86%8C%EC%82%AC%EB%B3%B8%EB%8F%99%20%EC%86%8C%EC%82%AC%EB%A1%9C36%EB%B2%88%EA%B8%B8%206"
                                    target="_blank" className="btn" style={{ backgroundColor: '#03C75A', color: '#fff', border: 'none' }}>네이버 지도</a>
                                <a href="https://map.kakao.com/link/search/경기부천시소사구소사본동소삼로36번길6"
                                    target="_blank" className="btn" style={{ backgroundColor: '#FEE500', color: '#000', border: 'none' }}>카카오 맵</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
