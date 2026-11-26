import { LECTURE_CATEGORY_LABEL, getLectureStats, getLecturesNewestFirst } from '@/data/lectures';

export const metadata = {
    title: '강의 경력 | 한국AI연구소',
    description: '교회·선교지·사회복지 현장·청소년 교육까지, 한국AI연구소가 다녀온 AI 강의 기록입니다.',
};

const fmtDate = (d: string) => `${d.slice(0, 4)}. ${d.slice(5, 7)}. ${d.slice(8, 10)}`;

export default function HistoryPage() {
    const stats = getLectureStats();
    const lectures = getLecturesNewestFirst();
    const years = [...new Set(lectures.map((l) => l.date.slice(0, 4)))];

    return (
        <section className="section course-page">
            <div className="container course-container">
                <span className="start-eyebrow">LECTURE HISTORY</span>
                <h1 className="section-title course-h1">강의 경력</h1>
                <p className="course-lead">
                    교회와 선교지, 사회복지·돌봄 현장, 청소년 교육까지 한국AI연구소가 함께한 AI 강의 기록입니다.
                </p>

                <div className="history-stats">
                    <div><strong>{stats.total}회</strong><span>누적 강의</span></div>
                    <div><strong>{stats.orgCount}곳</strong><span>함께한 교회·기관</span></div>
                    <div><strong>{stats.countries.length}개국</strong><span>해외 강의 ({stats.countries.join(' · ')})</span></div>
                    <div><strong>{stats.since}~</strong><span>강의 시작</span></div>
                </div>

                {years.map((year) => (
                    <div key={year} className="history-year">
                        <h2>{year}년 <small>{lectures.filter((l) => l.date.startsWith(year)).length}회</small></h2>
                        <ul className="history-list">
                            {lectures
                                .filter((l) => l.date.startsWith(year))
                                .map((l) => (
                                    <li key={`${l.date}-${l.title}`} className="history-item">
                                        <span className="history-date">{fmtDate(l.date)}</span>
                                        <span className="history-body">
                                            <strong>{l.title}</strong>
                                            <span className="history-meta">
                                                <span className={`history-cat cat-${l.category}`}>{LECTURE_CATEGORY_LABEL[l.category]}</span>
                                                {l.place && <span>{l.place}</span>}
                                                {l.country && !l.place?.includes(l.country) && <span>🌏 {l.country}</span>}
                                                {l.online && <span>💻 온라인</span>}
                                            </span>
                                        </span>
                                    </li>
                                ))}
                        </ul>
                    </div>
                ))}

                <div className="history-cta">
                    <p>우리 교회·기관에도 맞춤형 AI 강의가 필요하신가요?</p>
                    <a href="/#contact" className="btn btn-primary">강의 문의하기 →</a>
                </div>
            </div>
        </section>
    );
}
