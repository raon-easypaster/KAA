import re

with open('/Users/galeb76/anti/kaa_qna/src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# I am going to reset the broken section and correctly format it 
broken_pattern = re.compile(r'                <div className="archive-group">.*?            </>', re.DOTALL)

fixed_content = """                <div className="archive-group">
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
        <section className="section founder-section">
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
                        <li>다수의 IT 솔루션 기획 및 AI 비즈니스 컨설팅 수행</li>
                    </ul>
                </div>
            </div>
        </section>

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
"""

if broken_pattern.search(content):
    content = broken_pattern.sub(fixed_content.strip(), content)
    with open('/Users/galeb76/anti/kaa_qna/src/app/page.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
else:
    print("Pattern not found!!")
