import { COURSES } from '@/data/courses';
import FeedbackForm from './FeedbackForm';

export const metadata = {
    title: '수업 한 줄 소감 | 한국AI연구소',
    description: '오늘 들은 AI 강의의 한 줄 소감을 남겨 주세요.',
};

const OTHER_LECTURES = ['목회자 AI 활용세미나', '사회복지사 AI 활용세미나', '청소년·청년 AI 세미나', '옵시디언·세컨드 브레인 세미나', '기타 특강'];

export default async function FeedbackPage({ searchParams }: { searchParams: Promise<{ course?: string }> }) {
    const { course } = await searchParams;
    const lectures = [...COURSES.map((c) => c.title), ...OTHER_LECTURES];
    const initial = COURSES.find((c) => c.slug === course)?.title;
    return (
        <section className="section course-page">
            <div className="container course-container feedback-container">
                <span className="start-eyebrow">FEEDBACK</span>
                <h1 className="section-title course-h1">수업 한 줄 소감</h1>
                <p className="course-lead">
                    오늘 수업은 어떠셨나요? 한 줄이면 충분합니다. 보내 주신 소감은 다음 강의를 더 좋게 만드는 데 쓰입니다.
                </p>
                <FeedbackForm lectures={lectures} initialLecture={initial} />
            </div>
        </section>
    );
}
