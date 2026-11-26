import type { Metadata } from "next";
import "./globals.css";

import VisitorCounter from "@/app/components/VisitorCounter";
import { OFFICIAL_EMAIL, OFFICIAL_SNS } from "@/data/site";

export const metadata: Metadata = {
  title: "한국AI연구소",
  description: "한국AI연구소 아카이브 및 커뮤니티입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
      </head>
      <body>
        <header>
          <nav className="navbar">
            <div className="container">
              <a href="/" className="logo" aria-label="한국AI연구소 홈">
                <img src="/images/logo-mark.svg" alt="" className="logo-mark" width={40} height={40} />
                <span className="logo-text">
                  <span className="logo-name">한국<span className="logo-ai">AI</span>연구소</span>
                  <span className="logo-sub">Korea AI Research Institute</span>
                </span>
              </a>
              <input type="checkbox" id="menu-toggle" className="menu-toggle-checkbox" />
              <label htmlFor="menu-toggle" className="menu-toggle-label">
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
              </label>
              <div className="nav-menu">
                <a href="/#programs" className="nav-link">
                  자료실
                </a>
                <a href="/course" className="nav-link">
                  강의별 과정
                </a>
                <a href="/programs" className="nav-link">
                  사역 프로그램
                </a>
                <a href="/#roadmap" className="nav-link">
                  학습 로드맵
                </a>
                <a href="/#ai-tools" className="nav-link">
                  AI 도구
                </a>
                <a href="/#about" className="nav-link">
                  연구소 소개
                </a>
                <a href="/#contact" className="nav-link">
                  오시는 길
                </a>
                <a href="/#contact" className="nav-cta-btn">
                  강의 문의
                </a>
              </div>
            </div>
          </nav>
        </header>

        <main style={{ minHeight: "80vh" }}>
          {children}
        </main>

        <footer>
          <div className="container">
            <p className="footer-declaration">
              한국AI연구소<br />
              미래를 향한 실용적 통찰을 나눕니다.
            </p>
            <div className="footer-links-row">
              <a href="/#programs">자료실</a>
              <a href="/programs">사역 프로그램</a>
              <a href="/#roadmap">학습 로드맵</a>
              <a href="/#contact">강의 문의</a>
              <a href="/privacy">개인정보 처리방침</a>
              <a href={`mailto:${OFFICIAL_EMAIL}`}>이메일</a>
              <a href={OFFICIAL_SNS.url} target="_blank" rel="noopener">{OFFICIAL_SNS.label}</a>
            </div>
            <VisitorCounter />
            <p className="footer-copy">© 2026 Korea AI Research Institute. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

