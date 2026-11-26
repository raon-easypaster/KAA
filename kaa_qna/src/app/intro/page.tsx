import FoundersGrid from '@/app/components/FoundersGrid';
import Testimonials from '@/app/components/Testimonials';
import { getLectureStats, getLecturesNewestFirst, LECTURE_CATEGORY_LABEL } from '@/data/lectures';
import { COURSES } from '@/data/courses';
import { OFFICIAL_EMAIL, OFFICIAL_PHONE, SLOGAN } from '@/data/site';

export const metadata = {
    title: '연구소 소개 | 한국AI연구소',
    description: '이광복·김태주 목사가 함께하는 한국AI연구소의 강의 소개입니다. 교회·선교단체·사회복지기관 맞춤형 AI 강의를 진행합니다.',
};

export default function IntroPage() {
    const stats = getLectureStats();
    const recent = getLecturesNewestFirst().slice(0, 6);
    return (
        <section className="section course-page intro-page">
            <div className="container course-container">
                <span className="start-eyebrow">ABOUT US</span>
                <h1 className="section-title course-h1">이광복·김태주 목사와 함께 배우는 AI</h1>
                <p className="intro-slogan">&ldquo;{SLOGAN}&rdquo;</p>
                <p className="course-lead">
                    한국AI연구소는 교회·선교단체·사회복지기관을 찾아가 현장에 맞춘 AI 강의를 합니다.
                    어려운 기술 용어 대신, 내일 바로 쓸 수 있는 방법을 함께 손으로 익힙니다.
                </p>

                <div className="history-stats">
                    <div><strong>{stats.total}회</strong><span>누적 강의</span></div>
                    <div><strong>{stats.orgCount}곳</strong><span>함께한 교회·기관</span></div>
                    <div><strong>{stats.countries.length}개국</strong><span>해외 강의</span></div>
                    <div><strong>4.4 / 5.0</strong><span>라오스 교육 만족도</span></div>
                </div>

                <h2 className="intro-h2">공동대표</h2>
                <FoundersGrid />

                <h2 className="intro-h2">이런 강의를 합니다</h2>
                <ul className="intro-courses">
                    {COURSES.map((c) => (
                        <li key={c.slug}>
                            <a href={`/course/${c.slug}`}>
                                <span aria-hidden>{c.icon}</span>
                                <span><strong>{c.title}</strong><small>{c.audience}</small></span>
                            </a>
                        </li>
                    ))}
                    <li><a href="/history"><span aria-hidden>🎤</span><span><strong>맞춤 특강·세미나</strong><small>목회자 · 사회복지사 · 교사 · 청소년 · 해외 한인</small></span></a></li>
                </ul>

                <h2 className="intro-h2">최근 강의</h2>
                <ul className="history-list">
                    {recent.map((l) => (
                        <li key={`${l.date}-${l.title}`} className="history-item">
                            <span className="history-date">{l.date.replace(/-/g, '. ')}</span>
                            <span className="history-body">
                                <strong>{l.title}</strong>
                                <span className="history-meta">
                                    <span className={`history-cat cat-${l.category}`}>{LECTURE_CATEGORY_LABEL[l.category]}</span>
                                    {l.place && <span>{l.place}</span>}
                                </span>
                            </span>
                        </li>
                    ))}
                </ul>
                <a href="/history" className="course-strip-all">강의 경력 전체 보기 ({stats.total}회) →</a>

                <Testimonials />

                <div className="history-cta">
                    <p>강의 문의: {OFFICIAL_PHONE} · {OFFICIAL_EMAIL}</p>
                    <a href="/#contact" className="btn btn-primary">강의 문의하기 →</a>
                </div>
            </div>
        </section>
    );
}
