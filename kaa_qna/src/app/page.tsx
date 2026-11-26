'use client';
import { useState, useEffect, useMemo } from 'react';
import {
    formatUpdatedBadge,
    getMaterialLink,
    MATERIALS,
    MATERIALS_BY_ID,
    ROADMAP_STEPS,
} from '@/data/curations';
import { COURSES, getCourseLessons } from '@/data/courses';
import { OFFICIAL_EMAIL, OFFICIAL_SNS } from '@/data/site';
import type {
    MaterialAudience,
    MaterialFormat,
    MaterialItem,
    MaterialLevel,
} from '@/types/material';

type AudienceFilter = 'all' | MaterialAudience;
type LevelFilter = 'all' | MaterialLevel;
type FormatFilter = 'all' | MaterialFormat;
type SortOption = 'latest' | 'shortest';

const AUDIENCE_LABELS: Record<MaterialAudience, string> = {
    pastor: '목회자용',
    welfare: '사회복지사용',
    general: '일반·공통',
};

const FORMAT_ICONS: Record<MaterialFormat, string> = {
    slide: '🖥️',
    workbook: '🛠️',
    report: '📊',
    guide: '📘',
};

const FORMAT_LABELS: Record<MaterialFormat, string> = {
    slide: '슬라이드',
    workbook: '워크북',
    report: '보고서',
    guide: '가이드',
};

function getDiffClass(level: MaterialLevel): 'easy' | 'medium' | 'hard' {
    if (level === '입문') return 'easy';
    if (level === '중급') return 'medium';
    return 'hard';
}

function matchesSearch(item: MaterialItem, rawQuery: string): boolean {
    const q = rawQuery.trim().toLowerCase();
    if (!q) return true;
    const haystack = [item.title, item.description, ...item.tags].join(' ').toLowerCase();
    return haystack.includes(q);
}

export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [audienceFilter, setAudienceFilter] = useState<AudienceFilter>('all');
    const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');
    const [formatFilter, setFormatFilter] = useState<FormatFilter>('all');
    const [featuredOnly, setFeaturedOnly] = useState<boolean>(false);
    const [sortBy, setSortBy] = useState<SortOption>('latest');
    const [queryInitialized, setQueryInitialized] = useState<boolean>(false);

    // Phase 5: 강의 문의 양식 상태
    const [inquiryName, setInquiryName] = useState('');
    const [inquiryContact, setInquiryContact] = useState('');
    const [inquiryTopic, setInquiryTopic] = useState('목회자·사역자 AI 세미나');
    const [inquiryMessage, setInquiryMessage] = useState('');
    const [inquiryConsent, setInquiryConsent] = useState(false);
    const [inquirySummary, setInquirySummary] = useState<string | null>(null);
    const [copiedInquiry, setCopiedInquiry] = useState(false);
    // 문의 전송 상태: idle → sending → sent(메일 전송 완료) / fallback(메일 앱으로 보내기 안내)
    const [inquiryStatus, setInquiryStatus] = useState<'idle' | 'sending' | 'sent' | 'fallback'>('idle');
    const [inquiryHoneypot, setInquiryHoneypot] = useState('');

    const handleInquirySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inquiryName.trim() || !inquiryContact.trim() || !inquiryConsent) return;
        const summary = [
            `[한국AI연구소 강의/컨설팅 문의]`,
            `- 성함/기관: ${inquiryName.trim()}`,
            `- 연락처: ${inquiryContact.trim()}`,
            `- 희망 주제: ${inquiryTopic}`,
            `- 문의 내용: ${inquiryMessage.trim() || '(별도 내용 없음)'}`,
        ].join('\n');
        setInquirySummary(summary);
        setCopiedInquiry(false);
        setInquiryStatus('sending');
        try {
            const r = await fetch('/api/inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: inquiryName,
                    contact: inquiryContact,
                    topic: inquiryTopic,
                    message: inquiryMessage,
                    consent: inquiryConsent,
                    website: inquiryHoneypot,
                }),
            });
            setInquiryStatus(r.ok ? 'sent' : 'fallback');
        } catch {
            setInquiryStatus('fallback');
        }
    };

    const inquiryMailto = inquirySummary
        ? `mailto:${OFFICIAL_EMAIL}?subject=${encodeURIComponent(`[강의 문의] ${inquiryName.trim()} · ${inquiryTopic}`)}&body=${encodeURIComponent(inquirySummary)}`
        : `mailto:${OFFICIAL_EMAIL}`;

    const handleCopyInquiry = async () => {
        if (!inquirySummary) return;
        try {
            await navigator.clipboard.writeText(inquirySummary);
            setCopiedInquiry(true);
        } catch {
            setCopiedInquiry(false);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const q = params.get('q') || '';
        const aud = params.get('audience');
        const lvl = params.get('level');
        const fmt = params.get('format');
        const feat = params.get('featured');
        const sort = params.get('sort');

        if (q) setSearchQuery(q);
        if (aud === 'pastor' || aud === 'welfare' || aud === 'general') setAudienceFilter(aud);
        if (lvl === '입문' || lvl === '중급' || lvl === '고급') setLevelFilter(lvl);
        if (fmt === 'slide' || fmt === 'workbook' || fmt === 'report' || fmt === 'guide') setFormatFilter(fmt);
        if (feat === '1' || feat === 'true') setFeaturedOnly(true);
        if (sort === 'shortest' || sort === 'latest') setSortBy(sort);
        setQueryInitialized(true);
    }, []);

    useEffect(() => {
        if (!queryInitialized) return;
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set('q', searchQuery.trim());
        if (audienceFilter !== 'all') params.set('audience', audienceFilter);
        if (levelFilter !== 'all') params.set('level', levelFilter);
        if (formatFilter !== 'all') params.set('format', formatFilter);
        if (featuredOnly) params.set('featured', '1');
        if (sortBy !== 'latest') params.set('sort', sortBy);

        const qs = params.toString();
        const nextUrl = qs ? `${window.location.pathname}?${qs}${window.location.hash}` : `${window.location.pathname}${window.location.hash}`;
        window.history.replaceState(null, '', nextUrl);
    }, [searchQuery, audienceFilter, levelFilter, formatFilter, featuredOnly, sortBy, queryInitialized]);

    useEffect(() => {
        const fadeElements = document.querySelectorAll('.fade-up');
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let observer: IntersectionObserver | null = null;
        let revealVisibleElements: (() => void) | null = null;

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            fadeElements.forEach(el => el.classList.add('visible'));
        } else {
            revealVisibleElements = () => {
                const triggerBottom = window.innerHeight + 250;
                fadeElements.forEach(el => {
                    if (!el.classList.contains('visible')) {
                        const rect = el.getBoundingClientRect();
                        if (rect.top <= triggerBottom) {
                            el.classList.add('visible');
                        }
                    }
                });
            };

            const observerOptions = {
                threshold: 0,
                rootMargin: '300px 0px 300px 0px',
            };

            observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer?.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            fadeElements.forEach(el => observer?.observe(el));
            revealVisibleElements();
            window.addEventListener('scroll', revealVisibleElements, { passive: true });
        }

        // Visitor counter fetch & recording
        try {
            const hasHit = sessionStorage.getItem('kaa_session_hit');
            const method = hasHit ? 'GET' : 'POST';
            fetch('/api/counter', { method })
                .then(res => res.json())
                .then(data => {
                    if (data && data.total && !hasHit) {
                        sessionStorage.setItem('kaa_session_hit', 'true');
                    }
                })
                .catch(err => console.warn('Visitor counter fetch error:', err));
        } catch (e) {
            console.warn(e);
        }

        return () => {
            observer?.disconnect();
            if (revealVisibleElements) {
                window.removeEventListener('scroll', revealVisibleElements);
            }
        };
    }, []);

    const filteredItems = useMemo(() => {
        const list = MATERIALS.filter(item => {
            if (!matchesSearch(item, searchQuery)) return false;
            if (audienceFilter !== 'all' && item.audience !== audienceFilter) return false;
            if (levelFilter !== 'all' && item.level !== levelFilter) return false;
            if (formatFilter !== 'all' && item.format !== formatFilter) return false;
            if (featuredOnly && !item.featured) return false;
            return true;
        });

        return [...list].sort((a, b) => {
            if (sortBy === 'shortest') {
                return a.durationMinutes - b.durationMinutes;
            }
            const dateDiff = b.updated.localeCompare(a.updated);
            if (dateDiff !== 0) return dateDiff;
            return Number(b.isNew) - Number(a.isNew);
        });
    }, [searchQuery, audienceFilter, levelFilter, formatFilter, featuredOnly, sortBy]);

    // 각 필터별 건수 (나머지 활성 필터 기준)
    const counts = useMemo(() => {
        const matchBase = (item: MaterialItem, ignore: 'audience' | 'level' | 'format' | 'featured') => {
            if (!matchesSearch(item, searchQuery)) return false;
            if (ignore !== 'audience' && audienceFilter !== 'all' && item.audience !== audienceFilter) return false;
            if (ignore !== 'level' && levelFilter !== 'all' && item.level !== levelFilter) return false;
            if (ignore !== 'format' && formatFilter !== 'all' && item.format !== formatFilter) return false;
            if (ignore !== 'featured' && featuredOnly && !item.featured) return false;
            return true;
        };

        const audBase = MATERIALS.filter(i => matchBase(i, 'audience'));
        const lvlBase = MATERIALS.filter(i => matchBase(i, 'level'));
        const fmtBase = MATERIALS.filter(i => matchBase(i, 'format'));
        const featBase = MATERIALS.filter(i => matchBase(i, 'featured'));

        return {
            audience: {
                all: audBase.length,
                pastor: audBase.filter(i => i.audience === 'pastor').length,
                welfare: audBase.filter(i => i.audience === 'welfare').length,
                general: audBase.filter(i => i.audience === 'general').length,
            },
            level: {
                all: lvlBase.length,
                입문: lvlBase.filter(i => i.level === '입문').length,
                중급: lvlBase.filter(i => i.level === '중급').length,
                고급: lvlBase.filter(i => i.level === '고급').length,
            },
            format: {
                all: fmtBase.length,
                slide: fmtBase.filter(i => i.format === 'slide').length,
                workbook: fmtBase.filter(i => i.format === 'workbook').length,
                report: fmtBase.filter(i => i.format === 'report').length,
                guide: fmtBase.filter(i => i.format === 'guide').length,
            },
            featured: featBase.filter(i => i.featured).length,
        };
    }, [searchQuery, audienceFilter, levelFilter, formatFilter, featuredOnly]);

    const hasActiveFilter =
        searchQuery.trim() !== '' ||
        audienceFilter !== 'all' ||
        levelFilter !== 'all' ||
        formatFilter !== 'all' ||
        featuredOnly;

    const resetAllFilters = () => {
        setSearchQuery('');
        setAudienceFilter('all');
        setLevelFilter('all');
        setFormatFilter('all');
        setFeaturedOnly(false);
        setSortBy('latest');
    };

    const handleQuickPath = (aud: AudienceFilter, lvl: LevelFilter) => {
        setAudienceFilter(aud);
        setLevelFilter(lvl);
        setFormatFilter('all');
        setFeaturedOnly(false);
        document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleHeroSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            {/* ================= 1. Hero (검색창 포함) ================= */}
            <section className="hero hero-main hero-compact">
                <div className="container">
                    <div className="hero-content">
                        <span className="hero-eyebrow">Korea AI Research Institute Archive</span>
                        <h1 className="hero-title">
                            미래를 여는 기술,<br />
                            배움과 성장의 기록을 나눕니다
                        </h1>
                        <p className="hero-subtitle">
                            목회자·사역자·사회복지사·일반 입문자를 위한 AI 강의 자료와 실습 워크북을 한곳에서 바로 찾으세요.
                        </p>

                        <form className="hero-search-form" onSubmit={handleHeroSearchSubmit} role="search">
                            <input
                                type="search"
                                className="hero-search-input"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="강의 제목, 내용, 태그 검색 (예: 설교, 바이브코딩, 옵시디언)"
                                aria-label="AI 강의 자료 검색"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    className="hero-search-clear"
                                    onClick={() => setSearchQuery('')}
                                    aria-label="검색어 지우기"
                                >
                                    ✕
                                </button>
                            )}
                            <button type="submit" className="hero-search-btn">
                                자료 찾기
                            </button>
                        </form>

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <a href="#programs" className="btn btn-primary" style={{ padding: '10px 22px' }}>전체 자료실 ({MATERIALS.length}건) ⬇️</a>
                            <a href="/data/laos_feedback.html" target="_blank" className="btn btn-secondary" style={{ padding: '10px 22px', background: 'rgba(45, 122, 82, 0.45)', borderColor: '#5db87a', color: '#ffffff' }}>📊 라오스 결과 보고서 ↗️</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= 2. 대상별 빠른 길 ================= */}
            <section className="quick-path-section" aria-label="대상별 빠른 길">
                <div className="container">
                    <div className="quick-path-grid">
                        <button
                            type="button"
                            className={`quick-path-card ${audienceFilter === 'pastor' && levelFilter === 'all' ? 'active' : ''}`}
                            onClick={() => handleQuickPath('pastor', 'all')}
                        >
                            <span className="quick-path-icon">⛪</span>
                            <div>
                                <div className="quick-path-title">목회자·사역자용</div>
                                <div className="quick-path-desc">설교 연구·바이브코딩·목회 위키 자료 바로 보기</div>
                            </div>
                        </button>

                        <button
                            type="button"
                            className={`quick-path-card ${audienceFilter === 'welfare' && levelFilter === 'all' ? 'active' : ''}`}
                            onClick={() => handleQuickPath('welfare', 'all')}
                        >
                            <span className="quick-path-icon">🤝</span>
                            <div>
                                <div className="quick-path-title">사회복지사용</div>
                                <div className="quick-path-desc">복지 현장 실무·홍보·랜딩페이지 제작 자료</div>
                            </div>
                        </button>

                        <button
                            type="button"
                            className={`quick-path-card ${audienceFilter === 'all' && levelFilter === '입문' ? 'active' : ''}`}
                            onClick={() => handleQuickPath('all', '입문')}
                        >
                            <span className="quick-path-icon">🌱</span>
                            <div>
                                <div className="quick-path-title">처음 시작 (입문)</div>
                                <div className="quick-path-desc">AI 첫걸음·기초 개념·프롬프트 입문 자료</div>
                            </div>
                        </button>
                    </div>

                    {/* 수업 중인 학생을 위한 강의별 과정 바로가기 */}
                    <div className="course-strip" id="courses">
                        <div className="course-strip-head">
                            <strong>📚 수업 중이신가요? 강의별 과정</strong>
                            <a href="/course" className="course-strip-all">전체 과정 보기 →</a>
                        </div>
                        <div className="course-strip-grid">
                            {COURSES.map((course) => (
                                <a key={course.slug} href={`/course/${course.slug}`} className="course-strip-card">
                                    <span aria-hidden>{course.icon}</span>
                                    <span>
                                        <strong>{course.title}</strong>
                                        <small>{course.audience} · 차시 {getCourseLessons(course).length}개</small>
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* 교회 사역 프로그램 바로가기 */}
                    <a href="/programs" className="programs-strip">
                        <span>
                            <strong>🛠️ 교회 사역 프로그램 내려받기</strong>
                            <small>예배송출 · 라온 플래너 · 라온 뮤직시트 · AI 콘솔메이트 · 라온 교회 올인원</small>
                        </span>
                        <span>프로그램 보기 →</span>
                    </a>
                </div>
            </section>

            {/* ================= 3. 자료실 & 아카이브 ================= */}
            <section className="section" id="programs" style={{ paddingTop: '48px' }}>
                <div className="container fade-up">
                    <h2 className="section-title">자료실 &amp; 아카이브</h2>
                    <p className="section-intro">
                        한국AI연구소에서 제공하는 최신 AI 교육 자료, 실습 워크북 및 결과 보고서를 조건별로 바로 찾아보세요.
                    </p>

                    <div className="archive-controls">
                        <div className="archive-search-row">
                            <div className="archive-search-box">
                                <span aria-hidden="true">🔍</span>
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="제목, 설명, 태그로 실시간 검색 (예: 노트북LM, 깃허브, 세미나)"
                                    aria-label="자료실 내 실시간 검색"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        className="hero-search-clear"
                                        onClick={() => setSearchQuery('')}
                                        aria-label="검색어 초기화"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            <div className="archive-sort-group">
                                <label htmlFor="archive-sort" className="archive-sort-label">정렬</label>
                                <select
                                    id="archive-sort"
                                    className="archive-sort-select"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                                >
                                    <option value="latest">최신순</option>
                                    <option value="shortest">짧은 강의순</option>
                                </select>
                            </div>
                        </div>

                        {/* 대상 필터 */}
                        <div className="filter-group-row">
                            <span className="filter-group-label">대상</span>
                            <button
                                type="button"
                                className={`filter-chip ${audienceFilter === 'all' ? 'active' : ''}`}
                                onClick={() => setAudienceFilter('all')}
                            >
                                전체 ({counts.audience.all})
                            </button>
                            <button
                                type="button"
                                className={`filter-chip ${audienceFilter === 'pastor' ? 'active' : ''}`}
                                onClick={() => setAudienceFilter('pastor')}
                            >
                                목회자용 ({counts.audience.pastor})
                            </button>
                            <button
                                type="button"
                                className={`filter-chip ${audienceFilter === 'welfare' ? 'active' : ''}`}
                                onClick={() => setAudienceFilter('welfare')}
                            >
                                사회복지사용 ({counts.audience.welfare})
                            </button>
                            <button
                                type="button"
                                className={`filter-chip ${audienceFilter === 'general' ? 'active' : ''}`}
                                onClick={() => setAudienceFilter('general')}
                            >
                                일반 ({counts.audience.general})
                            </button>
                        </div>

                        {/* 난이도 필터 */}
                        <div className="filter-group-row">
                            <span className="filter-group-label">난이도</span>
                            {(['all', '입문', '중급', '고급'] as LevelFilter[]).map((lvl) => (
                                <button
                                    key={lvl}
                                    type="button"
                                    className={`filter-chip ${levelFilter === lvl ? 'active' : ''}`}
                                    onClick={() => setLevelFilter(lvl)}
                                >
                                    {lvl === 'all' ? '전체' : lvl} ({counts.level[lvl]})
                                </button>
                            ))}
                        </div>

                        {/* 형식 & 추천 필터 */}
                        <div className="filter-group-row">
                            <span className="filter-group-label">형식</span>
                            <button
                                type="button"
                                className={`filter-chip ${formatFilter === 'all' ? 'active' : ''}`}
                                onClick={() => setFormatFilter('all')}
                            >
                                전체 ({counts.format.all})
                            </button>
                            {(['slide', 'workbook', 'guide', 'report'] as MaterialFormat[]).map((fmt) => (
                                <button
                                    key={fmt}
                                    type="button"
                                    className={`filter-chip ${formatFilter === fmt ? 'active' : ''}`}
                                    onClick={() => setFormatFilter(fmt)}
                                >
                                    {FORMAT_LABELS[fmt]} ({counts.format[fmt]})
                                </button>
                            ))}
                            <button
                                type="button"
                                className={`filter-chip featured-chip ${featuredOnly ? 'active' : ''}`}
                                onClick={() => setFeaturedOnly(prev => !prev)}
                            >
                                ★ 추천 ({counts.featured})
                            </button>
                        </div>

                        <div className="archive-result-bar">
                            <span>
                                검색 결과 <strong>{filteredItems.length}건</strong> / 전체 {MATERIALS.length}건
                            </span>
                            {hasActiveFilter && (
                                <button type="button" className="filter-reset-btn" onClick={resetAllFilters}>
                                    필터 전체 초기화 ↺
                                </button>
                            )}
                        </div>
                    </div>

                    {filteredItems.length === 0 ? (
                        <div className="archive-empty-state">
                            <h3>조건에 맞는 강의 자료가 없습니다</h3>
                            <p>검색어를 바꾸거나 선택된 대상·난이도·형식 필터를 초기화해 보세요.</p>
                            <button type="button" className="filter-reset-btn" onClick={resetAllFilters}>
                                모든 필터 초기화하고 전체 보기
                            </button>
                        </div>
                    ) : (
                        <div className="archive-grid">
                            {filteredItems.map(item => {
                                const href = getMaterialLink(item);
                                const slideUrl = item.links.slide && item.links.slide !== href ? item.links.slide : null;
                                return (
                                    <article
                                        key={item.id}
                                        className={`archive-card ${item.featured ? 'important' : ''}`}
                                        data-audience={item.audience}
                                    >
                                        <a
                                            href={href}
                                            target="_blank"
                                            className="archive-thumb"
                                            data-audience={item.audience}
                                            aria-label={`${item.title} 썸네일`}
                                        >
                                            {item.thumbnail ? (
                                                <img src={item.thumbnail} alt={item.title} />
                                            ) : (
                                                <>
                                                    <div className="archive-thumb-top">
                                                        <span className="archive-thumb-audience">{AUDIENCE_LABELS[item.audience]}</span>
                                                        <span className="archive-thumb-format">{FORMAT_LABELS[item.format]}</span>
                                                    </div>
                                                    <div className="archive-thumb-center">
                                                        <span className="archive-thumb-icon" aria-hidden="true">{FORMAT_ICONS[item.format]}</span>
                                                        <span className="archive-thumb-label">{item.title}</span>
                                                    </div>
                                                </>
                                            )}
                                        </a>

                                        <div className="archive-card-body">
                                            <div>
                                                <div className="card-meta-row">
                                                    <span className={`badge ${item.badgeClass}`}>{item.category}</span>
                                                    <span className={`badge-diff ${getDiffClass(item.level)}`}>{item.level}</span>
                                                    <span className="badge-time">⏱️ {item.duration}</span>
                                                    {item.isNew && <span className="badge-new">NEW</span>}
                                                    {item.featured && <span className="badge-featured-tag">추천</span>}
                                                    {item.updated && <span className="badge-updated">{formatUpdatedBadge(item.updated)}</span>}
                                                </div>
                                                <h3>
                                                    <a href={href} target="_blank">{item.title}</a>
                                                </h3>
                                                <p>{item.description}</p>
                                            </div>
                                            <div className="card-footer">
                                                <span className="file-type">{item.fileType}</span>
                                                <div className="card-actions">
                                                    {slideUrl && (
                                                        <a href={slideUrl} target="_blank" className="slide-quick-link">
                                                            🖥️ 발표 모드
                                                        </a>
                                                    )}
                                                    <a href={href} target="_blank" className="download-link">
                                                        자료 보기 →
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* ================= 4. 9단계 학습 로드맵 ================= */}
            <section className="roadmap-section" id="roadmap">
                <div className="container fade-up">
                    <div className="roadmap-header roadmap-header-split">
                        <div>
                            <span className="start-eyebrow">Curriculum Roadmap</span>
                            <h2 className="section-title">AI 단계별 학습 로드맵</h2>
                            <p className="start-subtitle">
                                기초 이해부터 실무 도구 제작, 세컨드 브레인 구축까지 단계별 추천 학습 흐름입니다.
                            </p>
                        </div>
                        <img src="/images/scenes/growth-steps.webp" alt="함께 손잡고 한 계단씩 올라가는 사람들 그림" className="scene-img" loading="lazy" />
                    </div>

                    <div className="roadmap-grid">
                        {ROADMAP_STEPS.map((step) => {
                            const mat = MATERIALS_BY_ID[step.materialId];
                            const baseHref = mat ? getMaterialLink(mat) : '#programs';
                            const href = step.anchor ? `${baseHref}${step.anchor}` : baseHref;
                            return (
                                <a key={step.step} href={href} target="_blank" className="roadmap-step-card" data-level={step.level}>
                                    <div>
                                        <div className="roadmap-step-head">
                                            <span className="roadmap-step-num">STEP {step.step}</span>
                                            <span className="roadmap-step-arrow" aria-hidden="true">→</span>
                                        </div>
                                        <h3 className="roadmap-step-title">{step.title}</h3>
                                        <p className="roadmap-step-desc">{step.description}</p>
                                    </div>
                                    <div className="roadmap-badges">
                                        <span className={`badge-diff ${getDiffClass(step.level)}`}>{step.level}</span>
                                        <span className="badge-time">⏱️ {step.duration}</span>
                                    </div>
                                </a>
                            );
                        })}
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

            {/* ================= 6. 연구소 소개 & 공동대표 ================= */}
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
                    <div className="about-bridge">
                        <img src="/images/scenes/bridge.webp" alt="사회복지사와 목회자, 휠체어를 탄 이웃이 함께 다리를 건너는 그림" className="scene-img" loading="lazy" />
                        <div className="quote-highlight">
                            "AI는 기술을 넘어, 사람과 세상을 더 이롭게 연결하는 다리입니다."
                        </div>
                    </div>

                    <div className="founders-grid">
                        {/* 김태주 공동대표 */}
                        <div className="founder-card">
                            <div className="founder-card-header">
                                <div className="founder-photo-frame">
                                    <img src="/images/founder_kim.jpg" alt="김태주 공동대표" className="founder-photo-img img-kim" />
                                </div>
                                <div>
                                    <span className="founder-title">Co-Representative</span>
                                    <h3 className="founder-name">김태주 공동대표</h3>
                                </div>
                            </div>
                            <div className="founder-bio">
                                <p>
                                    "혁신적인 디지털 기술이 시대를 이끌어가는 가운데, 누구도 소외받지 않고 새로운 미래를 준비할 수 있도록 따뜻한 기술과 통찰력을 제공하는 한국AI연구소가 되겠습니다."
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

                        {/* 이광복 공동대표 */}
                        <div className="founder-card">
                            <div className="founder-card-header">
                                <div className="founder-photo-frame">
                                    <img src="/images/founder_lee.png" alt="이광복 공동대표" className="founder-photo-img img-lee" />
                                </div>
                                <div>
                                    <span className="founder-title">Co-Representative</span>
                                    <h3 className="founder-name">이광복 공동대표</h3>
                                </div>
                            </div>
                            <div className="founder-bio">
                                <p>
                                    "기술은 결국 사람을 향해야 하며, 그 변화의 시작은 끊임없는 배움과 열정에서 시작된다고 믿습니다. 지속 가능한 성장을 꿈꾸는 모든 파트너와 함께 가치를 실현하겠습니다."
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
                    </div>
                </div>
            </section>

            {/* ================= 교육 성과 & 신뢰 지표 ================= */}
            <section className="trust-section" aria-label="교육 성과 및 신뢰 지표">
                <div className="container fade-up">
                    <div className="section-header-compact" style={{ textAlign: 'center', marginBottom: '12px' }}>
                        <span className="start-eyebrow">VERIFIED FEEDBACK</span>
                        <h2 className="section-title">현장에서 검증된 교육 성과</h2>
                        <p className="start-subtitle">
                            라오스 선교사 AI 집중 교육 참가자 11인 설문 분석 보고서 실측 결과입니다.{' '}
                            <a href="/data/laos_feedback.html" target="_blank" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline' }}>
                                결과 보고서 원문 보기 ↗
                            </a>
                        </p>
                    </div>

                    <div className="trust-grid">
                        <div className="trust-card">
                            <div className="trust-metric">4.4 / 5.0</div>
                            <div className="trust-label">교육 전반적 만족도</div>
                            <div className="trust-sub">라오스 선교사 3일 집중 과정 설문 평균</div>
                        </div>
                        <div className="trust-card">
                            <div className="trust-metric">4.4 / 5.0</div>
                            <div className="trust-label">AI 활용 자신감 향상</div>
                            <div className="trust-sub">막연한 두려움에서 실전 활용 가능으로 전환</div>
                        </div>
                        <div className="trust-card">
                            <div className="trust-metric">4.5 / 5.0</div>
                            <div className="trust-label">사역·업무 활용 가능성</div>
                            <div className="trust-sub">교육 이후 지속 활용 의향 100% 응답</div>
                        </div>
                        {/* 나중에 추가: 누적 출강 횟수·수강생 수 카드 (실제 수치가 확인되면 넣고, .trust-grid 열 수를 4로) */}
                    </div>
                </div>
            </section>

            {/* ================= 7. 오시는 길 & 강의 문의 ================= */}
            <section className="section" id="contact">
                <div className="container fade-up">
                    <h2 className="section-title">오시는 길 &amp; 강의 문의</h2>
                    <p className="section-intro">
                        교회·선교단체·사회복지기관 맞춤형 AI 특강 및 실무 워크숍을 진행합니다.
                    </p>
                    <img src="/images/scenes/workshop.webp" alt="노트북을 펴고 함께 AI 실습을 하는 워크숍 모습" className="scene-img contact-banner" loading="lazy" />

                    <div className="contact-layout">
                        <div className="contact-panel">
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '18px', color: 'var(--black)' }}>
                                연구소 안내 &amp; 연락처
                            </h3>
                            <div className="contact-info" style={{ gap: '16px' }}>
                                <div className="info-item">
                                    <span className="label">주소</span>
                                    <span className="value">경기 부천시 소사구 소사본동 소삼로36번길 6 지에브리 3층</span>
                                </div>
                                <div className="info-item">
                                    <span className="label">전화</span>
                                    <span className="value">
                                        <a href="tel:010-5606-0845" style={{ color: 'var(--primary)', fontWeight: 800, textDecoration: 'none' }}>
                                            010-5606-0845
                                        </a>
                                    </span>
                                </div>
                                <div className="info-item">
                                    <span className="label">이메일</span>
                                    <span className="value">
                                        <a href={`mailto:${OFFICIAL_EMAIL}`} style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
                                            {OFFICIAL_EMAIL}
                                        </a>
                                    </span>
                                </div>
                                <div className="info-item">
                                    <span className="label">SNS</span>
                                    <span className="value">
                                        <a href={OFFICIAL_SNS.url} target="_blank" rel="noopener" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>
                                            {OFFICIAL_SNS.label} ↗
                                        </a>
                                    </span>
                                </div>
                                <div className="map-btns" style={{ marginTop: '8px' }}>
                                    <a href="https://map.naver.com/p/search/%EA%B2%BD%EA%B8%B0%20%EB%B6%80%EC%B2%9C%EC%8B%9C%20%EC%86%8C%EC%82%AC%EA%B5%AC%20%EC%86%8C%EC%82%AC%EB%B3%B8%EB%8F%99%20%EC%86%8C%EC%82%AC%EB%B3%B8%EB%8F%99%20%EC%86%8C%EC%82%AC%EB%A1%9C36%EB%B2%88%EA%B8%B8%206"
                                        target="_blank" className="btn" style={{ backgroundColor: '#03C75A', color: '#fff', border: 'none', padding: '10px 18px' }}>네이버 지도</a>
                                    <a href="https://map.kakao.com/link/search/경기부천시소사구소사본동소삼로36번길6"
                                        target="_blank" className="btn" style={{ backgroundColor: '#FEE500', color: '#000', border: 'none', padding: '10px 18px' }}>카카오 맵</a>
                                </div>
                            </div>
                        </div>

                        <div className="contact-panel">
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px', color: 'var(--black)' }}>
                                강의·컨설팅 문의 양식
                            </h3>
                            <p style={{ fontSize: '0.88rem', color: 'var(--gray-700)', marginBottom: '16px' }}>
                                아래 항목을 작성해 보내 주시면 연구소 이메일({OFFICIAL_EMAIL})로 바로 전달됩니다.
                            </p>

                            <form className="inquiry-form" onSubmit={handleInquirySubmit}>
                                <div className="inquiry-field">
                                    <label htmlFor="inq-name">성함 / 교회·기관명 *</label>
                                    <input
                                        id="inq-name"
                                        type="text"
                                        required
                                        value={inquiryName}
                                        onChange={(e) => setInquiryName(e.target.value)}
                                        placeholder="예: 홍길동 / OO교회"
                                    />
                                </div>
                                <div className="inquiry-field">
                                    <label htmlFor="inq-contact">연락처 (전화번호 또는 이메일) *</label>
                                    <input
                                        id="inq-contact"
                                        type="text"
                                        required
                                        value={inquiryContact}
                                        onChange={(e) => setInquiryContact(e.target.value)}
                                        placeholder="예: 010-1234-5678"
                                    />
                                </div>
                                <div className="inquiry-field">
                                    <label htmlFor="inq-topic">희망 교육 주제</label>
                                    <select
                                        id="inq-topic"
                                        value={inquiryTopic}
                                        onChange={(e) => setInquiryTopic(e.target.value)}
                                    >
                                        <option value="목회자·사역자 AI 세미나">목회자·사역자 AI 세미나</option>
                                        <option value="3일 집중 AI 실전 마스터 과정">3일 집중 AI 실전 마스터 과정</option>
                                        <option value="바이브코딩 & 웹앱·홈페이지 제작 워크숍">바이브코딩 &amp; 웹앱·홈페이지 제작 워크숍</option>
                                        <option value="사회복지사 AI 실무 활용 교육">사회복지사 AI 실무 활용 교육</option>
                                        <option value="옵시디언 세컨드 브레인 · 목회 위키">옵시디언 세컨드 브레인 · 목회 위키</option>
                                        <option value="기타 맞춤 컨설팅">기타 맞춤 컨설팅</option>
                                    </select>
                                </div>
                                <div className="inquiry-field">
                                    <label htmlFor="inq-msg">문의 내용 (희망 일정, 예상 인원 등)</label>
                                    <textarea
                                        id="inq-msg"
                                        rows={3}
                                        value={inquiryMessage}
                                        onChange={(e) => setInquiryMessage(e.target.value)}
                                        placeholder="예상 인원, 희망 날짜 및 장소, 궁금한 점을 적어주세요."
                                    />
                                </div>
                                <label className="inquiry-consent">
                                    <input
                                        type="checkbox"
                                        required
                                        checked={inquiryConsent}
                                        onChange={(e) => setInquiryConsent(e.target.checked)}
                                    />
                                    <span>
                                        강의 상담 회신을 위한 개인정보 수집·이용에 동의합니다. (
                                        <a href="/privacy" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline' }}>
                                            개인정보 처리방침 보기
                                        </a>
                                        )
                                    </span>
                                </label>
                                {/* 스팸 방지용 숨은 칸 (사람에게는 보이지 않음) */}
                                <input
                                    type="text"
                                    name="website"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    aria-hidden="true"
                                    value={inquiryHoneypot}
                                    onChange={(e) => setInquiryHoneypot(e.target.value)}
                                    style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
                                />
                                <button type="submit" className="inquiry-submit-btn" disabled={inquiryStatus === 'sending'}>
                                    {inquiryStatus === 'sending' ? '보내는 중…' : '문의 보내기'}
                                </button>
                            </form>

                            {inquiryStatus === 'sent' && (
                                <div className="inquiry-success-box" role="status">
                                    <strong>✓ 문의가 접수되었습니다.</strong> 연구소 이메일로 전달되었으며, 남겨 주신 연락처로 회신드리겠습니다.
                                </div>
                            )}

                            {inquiryStatus === 'fallback' && inquirySummary && (
                                <div className="inquiry-success-box" role="status">
                                    <strong>자동 전송이 되지 않았습니다.</strong> 아래 버튼으로 메일을 보내 주시거나, 내용을 복사해{' '}
                                    <a href="tel:010-5606-0845" style={{ fontWeight: 800, color: '#065f46', textDecoration: 'underline' }}>
                                        010-5606-0845
                                    </a>
                                    로 문자 주세요.
                                    <div style={{ marginTop: '10px' }}>
                                        <a href={inquiryMailto} className="inquiry-submit-btn" style={{ display: 'inline-block', width: 'auto', padding: '10px 18px', textDecoration: 'none' }}>
                                            ✉️ 메일 앱으로 보내기 ({OFFICIAL_EMAIL})
                                        </a>
                                    </div>
                                    <pre className="inquiry-summary-pre">{inquirySummary}</pre>
                                    <button
                                        type="button"
                                        onClick={handleCopyInquiry}
                                        className="filter-reset-btn"
                                        style={{ marginTop: '10px' }}
                                    >
                                        {copiedInquiry ? '✓ 복사 완료!' : '문의 내용 복사하기'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
