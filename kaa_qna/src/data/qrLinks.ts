// 강의 때 화면에 띄울 QR 코드 목록 (/qr)
import { COURSES } from './courses';

export interface QrLink {
    title: string;
    desc: string;
    path: string;
}

export const QR_LINKS: QrLink[] = [
    { title: '한국AI연구소 홈', desc: '자료실 · 강의별 과정 · 강의 문의', path: '/' },
    ...COURSES.map((c) => ({ title: c.title, desc: `오늘 수업 자료 (${c.audience})`, path: `/course/${c.slug}` })),
    { title: '목회자·사역자 자료만 보기', desc: '자료실을 목회자용으로 걸러서 엽니다', path: '/?audience=pastor#programs' },
    { title: '사회복지사 자료만 보기', desc: '자료실을 사회복지용으로 걸러서 엽니다', path: '/?audience=welfare#programs' },
    { title: '수업 한 줄 소감', desc: '강의를 마칠 때 띄워 소감을 받습니다', path: '/feedback' },
    { title: '교회 사역 프로그램', desc: '예배송출 · 라온 플래너 · 라온 뮤직시트', path: '/programs' },
    { title: '연구소 소개 (섭외용)', desc: '공동대표 · 강의 경력 · 문의를 한 장에', path: '/intro' },
];
