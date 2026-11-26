import Link from 'next/link';
import { COURSES, getCourseLessons } from '@/data/courses';

export const metadata = {
    title: '강의별 과정 | 한국AI연구소',
    description: '한국AI연구소 강의를 과정별로 묶어 순서대로 따라갈 수 있는 페이지입니다.',
};

export default function CourseListPage() {
    return (
        <section className="section course-page">
            <div className="container course-container">
                <span className="start-eyebrow">COURSES</span>
                <h1 className="section-title course-h1">강의별 과정</h1>
                <p className="course-lead">
                    수업에서 들은 강의를 고르세요. 차시 순서대로 자료를 열고 &ldquo;다음 →&rdquo;만 누르며 따라오시면 됩니다.
                </p>
                <div className="course-list">
                    {COURSES.map((course) => {
                        const count = getCourseLessons(course).length;
                        return (
                            <Link key={course.slug} href={`/course/${course.slug}`} className="course-list-card">
                                <span className="course-list-icon" aria-hidden>{course.icon}</span>
                                <span className="course-list-body">
                                    <strong>{course.title}</strong>
                                    <span className="course-list-sub">{course.subtitle}</span>
                                    <span className="course-meta">
                                        {course.audience} · 차시 {count}개 · {course.instructors}
                                    </span>
                                </span>
                                <span className="course-list-arrow" aria-hidden>→</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
