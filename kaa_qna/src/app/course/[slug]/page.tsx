import Link from 'next/link';
import { notFound } from 'next/navigation';
import { COURSES, getCourse, getCourseLessons } from '@/data/courses';

export const dynamicParams = false;

export function generateStaticParams() {
    return COURSES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const course = getCourse(slug);
    if (!course) return {};
    return {
        title: `${course.title} | 한국AI연구소`,
        description: `${course.subtitle} — ${course.audience}`,
    };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const course = getCourse(slug);
    if (!course) notFound();
    const lessons = getCourseLessons(course);

    return (
        <section className="section course-page">
            <div className="container course-container">
                <Link href="/course" className="course-back">← 강의별 과정 전체</Link>
                <div className="course-hero">
                    <span className="course-hero-icon" aria-hidden>{course.icon}</span>
                    <div>
                        <h1 className="course-h1">{course.title}</h1>
                        <p className="course-lead">{course.subtitle}</p>
                        <p className="course-meta">
                            대상: {course.audience} · 강사: {course.instructors} · 차시 {lessons.length}개
                        </p>
                    </div>
                </div>

                <Link href={`/course/${course.slug}/1`} className="btn btn-primary course-start-btn">
                    1차시부터 시작하기 →
                </Link>

                <ol className="course-toc">
                    {course.sections.map((section) => (
                        <li key={section.title} className="course-toc-section">
                            <h2>{section.title}</h2>
                            <p>{section.summary}</p>
                            <ul>
                                {lessons
                                    .filter((l) => l.sectionTitle === section.title)
                                    .map((l) => (
                                        <li key={l.number}>
                                            <Link href={`/course/${course.slug}/${l.number}`} className="course-toc-lesson">
                                                <span className="course-toc-num">{l.number}</span>
                                                <span className="course-toc-text">
                                                    <strong>{l.material.title}</strong>
                                                    <span className="course-meta">
                                                        {l.material.level} · {l.material.duration} · {l.material.fileType}
                                                    </span>
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                            </ul>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
