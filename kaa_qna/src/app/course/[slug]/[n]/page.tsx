import Link from 'next/link';
import { notFound } from 'next/navigation';
import { COURSES, getCourse, getCourseLessons, getLessonViewUrl } from '@/data/courses';
import { USAGE_NOTICE } from '@/data/site';

export const dynamicParams = false;

export function generateStaticParams() {
    return COURSES.flatMap((c) =>
        getCourseLessons(c).map((l) => ({ slug: c.slug, n: String(l.number) }))
    );
}

type Params = Promise<{ slug: string; n: string }>;

function findLesson(slug: string, n: string) {
    const course = getCourse(slug);
    if (!course) return null;
    const lessons = getCourseLessons(course);
    const lesson = lessons.find((l) => String(l.number) === n);
    if (!lesson) return null;
    return { course, lessons, lesson };
}

export async function generateMetadata({ params }: { params: Params }) {
    const { slug, n } = await params;
    const found = findLesson(slug, n);
    if (!found) return {};
    return {
        title: `${found.lesson.number}. ${found.lesson.material.title} | ${found.course.title}`,
        description: found.lesson.material.description,
    };
}

export default async function LessonPage({ params }: { params: Params }) {
    const { slug, n } = await params;
    const found = findLesson(slug, n);
    if (!found) notFound();
    const { course, lessons, lesson } = found;
    const total = lessons.length;
    const prev = lesson.number > 1 ? lessons[lesson.number - 2] : null;
    const next = lesson.number < total ? lessons[lesson.number] : null;
    const m = lesson.material;
    const viewUrl = getLessonViewUrl(m);
    const slideUrl = m.links.slide && m.links.slide !== viewUrl ? m.links.slide : null;

    return (
        <section className="lesson-page">
            <div className="container lesson-container">
                <div className="lesson-topbar">
                    <Link href={`/course/${course.slug}`} className="course-back">← {course.title} 목차</Link>
                    <span className="lesson-progress">{lesson.number} / {total}</span>
                </div>
                <div className="lesson-progress-bar" aria-hidden>
                    <span style={{ width: `${(lesson.number / total) * 100}%` }} />
                </div>

                <p className="lesson-section">{lesson.sectionTitle}</p>
                <h1 className="lesson-title">{lesson.number}. {m.title}</h1>
                <p className="lesson-desc">{m.description}</p>

                <div className="lesson-actions">
                    <a href={viewUrl} target="_blank" rel="noopener" className="btn btn-primary">새 창으로 크게 보기 ↗</a>
                    {slideUrl && (
                        <a href={slideUrl} target="_blank" rel="noopener" className="btn btn-secondary">🖥️ 발표 모드</a>
                    )}
                    {m.links.download && (
                        <a href={m.links.download} className="btn btn-secondary" download>⬇️ 자료 내려받기</a>
                    )}
                </div>

                <p className="usage-notice">📌 {USAGE_NOTICE}</p>

                <div className="lesson-frame-wrap">
                    <iframe src={viewUrl} title={m.title} className="lesson-frame" loading="lazy" />
                </div>

                <nav className="lesson-nav" aria-label="차시 이동">
                    {prev ? (
                        <Link href={`/course/${course.slug}/${prev.number}`} className="lesson-nav-btn">
                            <span className="lesson-nav-label">← 이전</span>
                            <span className="lesson-nav-title">{prev.number}. {prev.material.title}</span>
                        </Link>
                    ) : (
                        <span />
                    )}
                    {next ? (
                        <Link href={`/course/${course.slug}/${next.number}`} className="lesson-nav-btn lesson-nav-next">
                            <span className="lesson-nav-label">다음 →</span>
                            <span className="lesson-nav-title">{next.number}. {next.material.title}</span>
                        </Link>
                    ) : (
                        <Link href={`/course/${course.slug}`} className="lesson-nav-btn lesson-nav-next">
                            <span className="lesson-nav-label">🎉 마지막 차시입니다</span>
                            <span className="lesson-nav-title">과정 목차로 돌아가기</span>
                        </Link>
                    )}
                </nav>
                {!next && (
                    <div className="lesson-feedback">
                        <span>수업은 어떠셨나요? 한 줄 소감을 남겨 주세요.</span>
                        <Link href={`/feedback?course=${course.slug}`} className="btn btn-secondary">✍️ 한 줄 소감 남기기</Link>
                    </div>
                )}
            </div>
        </section>
    );
}
