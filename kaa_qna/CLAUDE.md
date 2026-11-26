# kaa-hub (한국AI연구소 홈페이지, Next.js)

- 설명은 항상 한글로 한다.
- 자료 목록은 `src/data/materials.json` 과 `public/data/materials.json` 두 곳에 있다. 둘을 항상 똑같이 고친다.
- 강의별 과정(`/course`)은 `src/data/courses.json` 에서 차시 순서를 정한다. 차시는 자료 id 로 가리킨다.
- 공식 연락처(이메일·전화·SNS)는 `src/data/site.ts` 한 곳에서 고친다.
- 교회 사역 프로그램 소개(`/programs`)의 설명·다운로드 링크는 `src/data/programs.ts` 에서 고친다. 소개 이미지는 `public/images/programs/`.
- 강의 경력(`/history`)과 홈 "누적 강의" 숫자는 `src/data/lectures.ts` 한 곳에서 나온다. 새 강의는 맨 아래 한 줄을 더하면 된다.
- 첫 화면 한마디·자료 이용 안내·사이트 주소는 `src/data/site.ts`, 처음 오신 분 3단계 맞춤길은 `src/data/startPaths.ts`, 참가자 한마디(이름 없이)는 `src/data/testimonials.ts`, 공동대표 소개는 `src/data/founders.ts`(홈·/intro 같이 씀), 강의용 QR 목록은 `src/data/qrLinks.ts` 에서 고친다.
- 수업 한 줄 소감(`/feedback`)은 `/api/feedback` 이 문의 양식과 같은 방식(Resend, 키 없으면 메일 앱 안내)으로 보낸다.
- 문의 양식은 `/api/inquiry` 가 Resend 로 메일을 보낸다. Vercel 환경변수 `RESEND_API_KEY` 가 없으면 화면이 "메일 앱으로 보내기"로 대신 안내한다.

## 기존 기능은 항상 유지
- 고치거나 기능을 넣은 뒤, 배포 전에 반드시 `npm run verify` 를 돌려 모두 통과해야 한다. (자료 데이터 점검 → next build → 3917번 포트 시험 서버로 화면 점검)
- 버그를 고치면 그 버그를 다시 잡는 점검을 `scripts/verify.mjs` 에 하나 더한다.
- 기존 기능을 빼거나 동작을 바꿀 때는 먼저 여쭙는다.
- 점검은 실제 자료와 실제 앱을 건드리지 않는다. 시험 서버는 다른 포트로 띄운다.
