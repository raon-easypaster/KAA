// 한국AI연구소 강의 경력 (/history, 홈 "교육 성과" 숫자)
// 새 강의를 하면 맨 아래에 한 줄 더하면 된다. 숫자(누적 강의·기관·해외 나라)는 자동으로 계산된다.

export type LectureCategory = 'church' | 'welfare' | 'youth' | 'general';

export interface Lecture {
    date: string; // YYYY-MM-DD
    title: string;
    place?: string;
    category: LectureCategory;
    online?: boolean;
    /** 해외 나라 이름 (해외 현지 또는 해외 대상 온라인 강의) */
    country?: string;
}

export const LECTURE_CATEGORY_LABEL: Record<LectureCategory, string> = {
    church: '목회·교회',
    welfare: '사회복지·돌봄',
    youth: '청소년·어린이',
    general: '일반·기관',
};

export const LECTURES: Lecture[] = [
    { date: '2025-09-05', title: '목회자 AI 활용세미나 (온라인)', category: 'church', online: true, country: '라오스' },
    { date: '2025-09-09', title: '목회자를 위한 AI 활용세미나', category: 'church' },
    { date: '2025-09-11', title: '목회자 AI 활용세미나', place: '서울신학대학교', category: 'church' },
    { date: '2025-09-22', title: '목회자 AI 활용세미나 (온라인)', category: 'church', online: true, country: '잠비아' },
    { date: '2025-11-05', title: '목회자 AI 활용세미나 (온라인)', category: 'church', online: true, country: '방글라데시' },
    { date: '2025-11-30', title: '사회복지사를 위한 AI 사업계획서 작성법', place: '기린지역아동센터', category: 'welfare' },
    { date: '2025-12-01', title: '목회자를 위한 AI 활용세미나', place: '한국목회AI연구소', category: 'church' },
    { date: '2025-12-02', title: '사회복지사를 위한 AI 활용세미나', place: '부천시다함께돌봄센터 힐스테이트소사역', category: 'welfare' },
    { date: '2025-12-02', title: 'AI 활용세미나', place: '라온트리', category: 'general' },
    { date: '2026-01-02', title: '사회복지사를 위한 AI 활용세미나', place: '사회적 협동조합 공존', category: 'welfare' },
    { date: '2026-01-02', title: '사회복지업무개발', place: '사회적 협동조합 공존', category: 'welfare' },
    { date: '2026-01-08', title: '다함께돌봄센터 초등교육 (8회)', place: '부천시다함께돌봄센터 힐스테이트소사역', category: 'youth' },
    { date: '2026-01-12', title: '목회자를 위한 AI 활용세미나', place: '한국목회AI연구소', category: 'church' },
    { date: '2026-01-19', title: '세컨드브레인 옵시디언 세미나', place: '한국목회AI연구소', category: 'general' },
    { date: '2026-01-26', title: '목회자를 위한 AI 활용세미나', place: '한국목회AI연구소', category: 'church' },
    { date: '2026-02-02', title: '청소년 AI 교육 (6회)', place: '기린지역아동센터', category: 'youth' },
    { date: '2026-02-08', title: '교사들을 위한 AI 활용세미나', place: '시흥제일교회', category: 'church' },
    { date: '2026-02-24', title: '부천지방회 홈페이지 만들기', place: '한국목회AI연구소', category: 'church' },
    { date: '2026-02-24', title: '입시컨설팅 AI 앱 제작 및 컨설팅', place: '입시컨설팅 더씨어', category: 'general' },
    { date: '2026-02-26', title: '인터넷 마케팅 AI 디자인/앱 제작 및 컨설팅', place: '드림넘버원 영어학원', category: 'general' },
    { date: '2026-03-09', title: 'AI 활용 세미나 (6주)', place: '한국목회AI연구소', category: 'church' },
    { date: '2026-03-14', title: '해외거주자를 위한 AI 활용 세미나 (온라인)', category: 'general', online: true },
    { date: '2026-03-19', title: '사회복지사를 위한 AI 활용세미나', place: '아름다운집', category: 'welfare' },
    { date: '2026-03-28', title: '방글라데시 한인을 위한 AI 활용 세미나', place: '방글라데시 다카', category: 'general', country: '방글라데시' },
    { date: '2026-04-06', title: '청소년 AI 세미나 (6주 과정)', place: '기린청소년지역아동센터', category: 'youth' },
    { date: '2026-04-14', title: '여주지역 AI 활용 세미나', place: '한국AI연구소', category: 'general' },
    { date: '2026-05-07', title: 'AI란 무엇인가 (특강)', place: '52미션브런치', category: 'general' },
    { date: '2026-06-04', title: 'AI 집중세미나 (3주 완성)', place: '한국AI연구소', category: 'general' },
    { date: '2026-06-05', title: 'AI를 활용한 홈페이지 제작', place: '사단법인 예온', category: 'general' },
    { date: '2026-07-13', title: 'AI를 활용한 SNS/홈페이지 제작 세미나', place: '한국AI연구소', category: 'general' },
    { date: '2026-07-14', title: 'AI 집중세미나 (3주 완성)', place: '한국AI연구소', category: 'general' },
    { date: '2026-08-18', title: 'AI 집중세미나 (2주 완성)', place: '한국AI연구소', category: 'general' },
    { date: '2026-08-24', title: 'AI 에이전트를 통한 옵시디언 활용세미나', place: '한국AI연구소', category: 'general' },
    { date: '2026-08-31', title: '라오스 한인을 위한 AI 활용 세미나 (3일 완성)', place: '라오스', category: 'church', country: '라오스' },
    { date: '2026-09-14', title: 'AI 에이전트를 통한 옵시디언 활용세미나', place: '한국AI연구소', category: 'general' },
    { date: '2026-09-15', title: '서산지역 AI 활용 세미나', place: '한국AI연구소', category: 'general' },
    { date: '2026-10-10', title: '원종동 청년 AI 세미나', place: '원종제일교회', category: 'youth' },
    { date: '2026-11-05', title: '원종지역아동센터 교사 AI 세미나', place: '원종지역아동센터', category: 'welfare' },
    { date: '2026-11-17', title: '인천 타브가 모임 AI 세미나', place: '타브가', category: 'general' },
    { date: '2026-11-19', title: '다함께돌봄센터 힐스테이트소사역 교사 AI 교육 (1차)', place: '부천시다함께돌봄센터 힐스테이트소사역', category: 'welfare' },
    { date: '2026-11-23', title: '다함께돌봄센터 힐스테이트소사역 교사 AI 교육 (2차)', place: '부천시다함께돌봄센터 힐스테이트소사역', category: 'welfare' },
];

const OWN_PLACES = ['한국AI연구소', '한국목회AI연구소'];

/** 최근 강의가 위로 오게 정렬한 목록 */
export function getLecturesNewestFirst(): Lecture[] {
    return [...LECTURES].sort((a, b) => b.date.localeCompare(a.date));
}

export function getLectureStats() {
    const sorted = [...LECTURES].sort((a, b) => a.date.localeCompare(b.date));
    const first = sorted[0]?.date ?? '';
    const countries = [...new Set(LECTURES.map((l) => l.country).filter(Boolean))] as string[];
    const orgs = new Set(
        LECTURES.map((l) => l.place)
            .filter((p): p is string => !!p && !OWN_PLACES.includes(p) && !countries.some((c) => p.includes(c)))
    );
    return {
        total: LECTURES.length,
        since: first ? `${first.slice(0, 4)}.${Number(first.slice(5, 7))}` : '',
        countries,
        orgCount: orgs.size,
    };
}
