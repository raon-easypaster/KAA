import Link from 'next/link';
import { OFFICIAL_EMAIL } from '@/data/site';

export const metadata = {
    title: '개인정보 처리방침 | 한국AI연구소',
    description: '한국AI연구소 강의 문의 및 사이트 이용에 관한 개인정보 처리방침입니다.',
};

export default function PrivacyPage() {
    return (
        <section className="section" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
            <div className="container" style={{ maxWidth: '820px' }}>
                <span className="start-eyebrow">PRIVACY POLICY</span>
                <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '20px' }}>
                    개인정보 처리방침
                </h1>
                <p style={{ color: 'var(--gray-700)', marginBottom: '32px', lineHeight: 1.7 }}>
                    한국AI연구소는 이용자의 개인정보를 소중히 다루며, 관련 법령에 따라 아래와 같이 개인정보를 처리합니다.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', background: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid var(--gray-300)' }}>
                    <div>
                        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--black)', marginBottom: '8px' }}>
                            1. 수집하는 개인정보 항목 및 목적
                        </h2>
                        <p style={{ color: 'var(--gray-700)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                            강의·워크숍·AI 컨설팅 문의 접수 및 상담 회신을 위해 아래 항목을 수집할 수 있습니다.<br />
                            - 수집 항목: 성함(또는 기관/교회명), 연락처(전화번호 또는 이메일), 희망 교육 주제 및 문의 내용<br />
                            - 이용 목적: 강의 일정 협의, 맞춤 커리큘럼 안내 및 문의 응대
                        </p>
                    </div>

                    <div>
                        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--black)', marginBottom: '8px' }}>
                            2. 개인정보 보유 및 이용 기간
                        </h2>
                        <p style={{ color: 'var(--gray-700)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                            수집된 문의 정보는 상담 및 교육 진행 목적 달성 후 지체 없이 파기하며, 별도 요청 시 즉시 삭제합니다.
                        </p>
                    </div>

                    <div>
                        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--black)', marginBottom: '8px' }}>
                            3. 문의처 및 개인정보 보호 담당
                        </h2>
                        <p style={{ color: 'var(--gray-700)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                            - 기관명: 한국AI연구소<br />
                            - 주소: 경기 부천시 소사구 소사본동 소삼로36번길 6 지에브리 3층<br />
                            - 전화: 010-5606-0845<br />
                            - 이메일: {OFFICIAL_EMAIL}
                        </p>
                    </div>
                </div>

                <div style={{ marginTop: '28px' }}>
                    <Link href="/" className="btn btn-primary" style={{ padding: '10px 22px' }}>
                        ← 메인으로 돌아가기
                    </Link>
                </div>
            </div>
        </section>
    );
}
