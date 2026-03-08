import type { Metadata } from "next";
import "./globals.css";

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
              <a href="/" className="logo">
                🤖 한국AI연구소
              </a>
              <a href="/qa" className="qa-shortcut-btn">
                Q&A 바로가기 ↗️
              </a>
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
            <p className="footer-copy">© 2026 Korea AI Research Institute. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
