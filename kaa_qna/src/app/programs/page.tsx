import { PROGRAMS } from '@/data/programs';

export const metadata = {
    title: '교회 사역 프로그램 | 한국AI연구소',
    description: '예배송출, 라온 플래너, 라온 뮤직시트 등 교회 사역을 돕는 프로그램을 소개하고 내려받는 곳입니다.',
};

export default function ProgramsPage() {
    return (
        <section className="section course-page">
            <div className="container course-container programs-container">
                <span className="start-eyebrow">PROGRAMS</span>
                <h1 className="section-title course-h1">교회 사역 프로그램</h1>
                <p className="course-lead">
                    예배 준비와 교회 사역을 돕기 위해 만든 프로그램입니다. 무료 프로그램은 아래 버튼으로 바로 내려받거나 열 수 있습니다.
                </p>

                <nav className="program-jump" aria-label="프로그램 바로가기">
                    {PROGRAMS.map((p) => (
                        <a key={p.id} href={`#${p.id}`}>{p.name}</a>
                    ))}
                </nav>

                <div className="program-list">
                    {PROGRAMS.map((p) => (
                        <article key={p.id} id={p.id} className={`program-card program-${p.status}`}>
                            {p.poster && (
                                <a href={p.poster} target="_blank" rel="noopener" className="program-poster">
                                    <img src={p.poster} alt={`${p.name} 소개 이미지`} loading="lazy" />
                                </a>
                            )}
                            <div className="program-body">
                                <span className={`program-badge badge-${p.status}`}>{p.statusLabel}</span>
                                <h2>{p.name}</h2>
                                <p className="program-tagline">{p.tagline}</p>
                                <p className="course-meta">{p.platforms} · 만든 이: {p.maker}</p>
                                <ul className="program-features">
                                    {p.features.map((f) => <li key={f}>{f}</li>)}
                                </ul>
                                {p.note && <p className="program-note">{p.note}</p>}
                                {p.links.length > 0 && (
                                    <div className="program-actions">
                                        {p.links.map((l) => {
                                            const external = l.url.startsWith('http');
                                            return (
                                                <a
                                                    key={l.url}
                                                    href={l.url}
                                                    className={`btn ${l.primary ? 'btn-primary' : 'btn-secondary'}`}
                                                    {...(external ? { target: '_blank', rel: 'noopener' } : {})}
                                                >
                                                    {l.label}
                                                </a>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
