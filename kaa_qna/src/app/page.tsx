'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const fadeElements = document.querySelectorAll('.fade-up');
        fadeElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <>


            {/* ================= Hero ================= */}
            <section className="hero hero-main">
                <div className="container">
                    <div className="hero-content fade-up">
                        <span className="hero-eyebrow">Korea AI Research Institute Archive</span>
                        <h1 className="hero-title">
                            미래를 여는 기술,<br />
                            배움과 성장의 기록을 나눕니다
                        </h1>
                        <p className="hero-subtitle">
                            한국AI연구소 아카이브는 AI 교육, 연구, 그리고 커뮤니티 성장을 돕는 자료를 지속적으로 공유하고 아카이빙하는 프로젝트입니다.
                        </p>
                        <a href="#programs" className="btn btn-primary">자료실 바로가기 ⬇️</a>
                    </div>
                </div>
            </section>

            {/* ================= About ================= */}
            <section className="section about-section">
                <div className="container fade-up">
                    <h2 className="section-title">연구소 소개</h2>
                    <div className="about-declaration">
                        <p>
                            한국AI연구소는 급변하는 인공지능 시대에 맞춰 우리 삶과 산업 현장에 가장 실용적이고 윤리적인 AI 활용 방안을 연구합니다.
                        </p>
                        <p>
                            복잡한 기술의 진입 장벽을 낮추고, 누구나 쉽게 생성형 AI를 업무와 일상에 접목할 수 있도록 교육 및 아카이빙 프로젝트를 전개하고 있습니다.
                        </p>
                    </div>
                    <div className="quote-highlight">
                        "AI는 기술을 넘어, 사람과 세상을 더 이롭게 연결하는 다리입니다."
                    </div>
                </div>
            </section>

            {/* ================= Archive ================= */}
            <section className="section" id="programs">
                <div className="container fade-up">
                    <h2 className="section-title">자료실 & 아카이브</h2>
                    <p className="section-intro">
                        한국AI연구소에서 제공하는 최신 AI 교육 자료, 실습 워크북 및 웹사이트 링크를 확인하세요.
                    </p>

                    <div className="archive-group">
                        <h3 className="archive-group-title">💻 AI 교육 (Education)</h3>
                        <div className="archive-grid">
                            <a href="https://drive.google.com/file/d/1rtH-_QNoTFRbGr3qRuNCj9GMjmYSVnb7/view?usp=drive_link" target="_blank" className="archive-card important">
                                <div>
                                    <span className="badge edu">AI 첫걸음</span>
                                    <h3>어서와 AI는 처음이지</h3>
                                    <p>처음 AI를 접하시는 분들을 위한 가이드 영상입니다.</p>
                                </div>
                                <div className="card-footer">
                                    <span className="file-type">📺 Video</span>
                                    <span className="download-link">시청하기 ▶️</span>
                                </div>
                            </a>

                            <a href="https://padlet.com/galeb76/ai-ojb7gl4pw8rczcm1/wish/j40PQDyJzqnDZvXB" target="_blank" className="archive-card">
                                <div>
                                    <span className="badge edu">교육자료</span>
                                    <h3>AI 첫걸음</h3>
                                    <p>AI는 배우는 것이 아니라 익히는 것입니다.</p>
                                </div>
                                <div className="card-footer">
                                    <span className="file-type">🔗 외부 링크</span>
                                    <span className="download-link">열람하기 ➡️</span>
                                </div>
                            </a>

                            <a href="data/ai_workshop.html" className="archive-card">
                                <div>
                                    <span className="badge edu">워크숍</span>
                                    <h3>2026 AI 실무 워크북<br />(AI Workshop)</h3>
                                    <p>업무 효율화의 완성을 위한 가이드북입니다.</p>
                                </div>
                                <div className="card-footer">
                                    <span className="file-type">🔗 열람 가능</span>
                                    <span className="download-link">확인하기 ↗️</span>
                                </div>
                            </a>
                        </div>
                    </div>

                    <div className="archive-group">
                        <h3 className="archive-group-title">📒 AI 실무 자료 (Data) & 안내</h3>
                        <div className="archive-grid">
                            <a href="data/landing_page_guide.html" className="archive-card">
                                <div>
                                    <span className="badge info">Information</span>
                                    <h3>랜딩페이지란 무엇인가?<br />(Landing Page Guide)</h3>
                                    <p>목회자를 위한 랜딩페이지 제작 가이드입니다.</p>
                                </div>
                                <div className="card-footer">
                                    <span className="file-type">🔗 열람 가능</span>
                                    <span className="download-link">확인하기 ↗️</span>
                                </div>
                            </a>
                            <a href="https://raon-easypaster.github.io/KAA/data/github.html" target="_blank" className="archive-card important">
                                <div>
                                    <span className="badge info">Information</span>
                                    <h3>깃허브 랜딩페이지 구축<br />(GitHub Pages)</h3>
                                    <p>깃허브에 랜딩페이지 올리는 방법 안내입니다.</p>
                                </div>
                                <div className="card-footer">
                                    <span className="file-type">📄 인포그래픽</span>
                                    <span className="download-link">열람하기 ↗️</span>
                                </div>
                            </a>

                            <a href="https://raon-easypaster.github.io/KAA/data/rd_aistudio.html" target="_blank" className="archive-card">
                                <div>
                                    <span className="badge info">Information</span>
                                    <h3>라온동행교회 AI 활용법</h3>
                                    <p>라온동행교회 교인들을 위한 AI 사용 방법 안내입니다.</p>
                                </div>
                                <div className="card-footer">
                                    <span className="file-type">🔗 열람 가능</span>
                                    <span className="download-link">확인하기 ↗️</span>
                                </div>
                            </a>

                            <a href="data/aistudio.html" className="archive-card">
                                <div>
                                    <span className="badge info">Information</span>
                                    <h3>AI스튜디오 활용법<br />(AI Studio)</h3>
                                    <p>Google AI Studio 사용 방법 안내입니다.</p>
                                </div>
                                <div className="card-footer">
                                    <span className="file-type">🔗 열람 가능</span>
                                    <span className="download-link">확인하기 ↗️</span>
                                </div>
                            </a>

                            <a href="data/easypastor.html" className="archive-card">
                                <div>
                                    <span className="badge info">Information</span>
                                    <h3>미래 목회를 위한 AI 신학 비서<br />(Easy Pastor)</h3>
                                    <p>NotebookLM 및 Gemini 통합 가이드입니다.</p>
                                </div>
                                <div className="card-footer">
                                    <span className="file-type">🔗 열람 가능</span>
                                    <span className="download-link">확인하기 ↗️</span>
                                </div>
                            </a>

                        </div>
                    </div>

                    <div className="archive-group">
                        <h3 className="archive-group-title">🌐 공식 채널 (Links)</h3>
                        <div className="archive-grid" style={{ display: 'flex', justifyContent: 'center' }}>
                            <div className="archive-card" style={{ maxWidth: '400px', width: '100%', cursor: 'default' }}>
                                <div>
                                    <span className="badge" style={{ backgroundColor: '#64748b', color: 'white' }}>준비중</span>
                                    <h3 style={{ color: '#64748b' }}>공식 유튜브 채널<br />(YouTube)</h3>
                                    <p>유익한 영상 콘텐츠로 곧 찾아뵙겠습니다.</p>
                                </div>
                                <div className="card-footer">
                                    <span className="file-type" style={{ color: '#94a3b8' }}>📺 Video</span>
                                    <span className="download-link" style={{ color: '#94a3b8' }}>채널 준비중 ⏳</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="archive-group">
                        <h3 className="archive-group-title">💬 소통 및 피드백 (Community & Q&A)</h3>
                        <div className="archive-grid" style={{ display: 'flex', justifyContent: 'center' }}>
                            <a href="/qa" className="archive-card important" style={{ maxWidth: '400px', width: '100%' }}>
                                <div>
                                    <span className="badge info">Board</span>
                                    <h3>자주 묻는 질문 (Q&A)<br />게시판 바로가기</h3>
                                    <p>궁금한 점을 남겨주시면 연구소에서 답변해 드립니다.</p>
                                </div>
                                <div className="card-footer">
                                    <span className="file-type">💬 자유 게시판</span>
                                    <span className="download-link">질문 남기기 ↗️</span>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= Founders ================= */}
            < section className="section founder-section" >
                <div className="container fade-up">
                    <span className="founder-title">Co-Representative</span>
                    <h2 className="founder-name">김태주 공동대표</h2>
                    <div className="founder-bio">
                        <p>
                            "혁신적인 디지털 기술이 시대를 이끌어가는 가운데, 누구도 소외받지 않고 새로운 미래를 준비할 수 있도록<br />
                            따뜻한 기술과 통찰력을 제공하는 한국AI연구소가 되겠습니다."
                        </p>
                    </div>
                    <div className="founder-history">
                        <h4>주요 경력</h4>
                        <ul>
                            <li>현) 한국AI연구소 공동대표</li>
                            <li>현) 열방위에서는교회 담임목사</li>
                            <li>다수의 IT 솔루션 기획 및 AI 비즈니스 컨설팅 수행</li>
                            <li>세컨드 브레인을 위한 옵시디언 강의 전문</li>
                        </ul>
                    </div>
                </div>
            </section >

            <section className="section founder-section">
                <div className="container fade-up">
                    <span className="founder-title">Co-Representative</span>
                    <h2 className="founder-name">이광복 공동대표</h2>
                    <div className="founder-bio">
                        <p>
                            "기술은 결국 사람을 향해야 하며, 그 변화의 시작은 끊임없는 배움과 열정에서 시작된다고 믿습니다.<br />
                            한국AI연구소는 여러분의 잠재력이 기술이라는 날개를 달아 높이 비상할 수 있도록 가장 가까운 곳에서 조력하겠습니다.<br />
                            지속 가능한 성장을 꿈꾸는 모든 파트너와 함께, 혁신 그 이상의 가치를 실현하는 길을 걷겠습니다."
                        </p>
                    </div>
                    <div className="founder-history">
                        <h4>주요 경력</h4>
                        <ul>
                            <li>전) 서울신학대학교 신학과</li>
                            <li>전) 서울신학대학교 신학대학원</li>
                            <li>현) 한국AI연구소 공동대표</li>
                            <li>현) 로스터리 카페 라온트리 대표</li>
                            <li>현) 라온동행교회 담임목사</li>
                            <li>직업별 AI 맞춤 컨설팅 및 강의 전문</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* ================= Contact ================= */}
            <section className="section" id="contact">
                <div className="container fade-up">
                    <h2 className="section-title">오시는 길 & 연락처</h2>
                    <div className="contact-content">
                        <div className="contact-info">
                            <div className="info-item">
                                <span className="label">주소</span>
                                <span className="value">경기 부천시 소사구 소사본동 소삼로36번길 6 지에브리 2층 (카페 라온트리 내)</span>
                            </div>
                            <div className="info-item">
                                <span className="label">전화</span>
                                <span className="value">010-5606-0845</span>
                            </div>
                            <div className="map-btns">
                                <a href="https://map.naver.com/v5/search/%EA%B2%BD%EA%B8%B0%20%EB%B6%80%EC%B2%9C%EC%8B%9C%20%EC%86%8C%EC%82%AC%EB%B3%B8%EB%8F%99%20%EC%86%8C%EC%82%BC%EB%A1%9C36%EB%B2%88%EA%B8%B8%206"
                                    target="_blank" className="btn" style={{ backgroundColor: '#03C75A', color: '#fff', border: 'none' }}>네이버 지도</a>
                                <a href="https://m.map.kakao.com/actions/searchView?q=경기+부천시+소사구+소사본동+소삼로36번길+6"
                                    target="_blank" className="btn" style={{ backgroundColor: '#FEE500', color: '#000', border: 'none' }}>카카오 맵</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    );
}
