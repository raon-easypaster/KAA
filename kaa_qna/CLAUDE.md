# kaa-hub (한국AI연구소 홈페이지, Next.js)

- 설명은 항상 한글로 한다.
- 자료 목록은 `src/data/materials.json` 과 `public/data/materials.json` 두 곳에 있다. 둘을 항상 똑같이 고친다.
- 강의별 과정(`/course`)은 `src/data/courses.json` 에서 차시 순서를 정한다. 차시는 자료 id 로 가리킨다.
- 공식 연락처(이메일·전화·SNS)는 `src/data/site.ts` 한 곳에서 고친다.
- 교회 사역 프로그램 소개(`/programs`)의 설명·다운로드 링크는 `src/data/programs.ts` 에서 고친다. 소개 이미지는 `public/images/programs/`.
- 문의 양식은 `/api/inquiry` 가 Resend 로 메일을 보낸다. Vercel 환경변수 `RESEND_API_KEY` 가 없으면 화면이 "메일 앱으로 보내기"로 대신 안내한다.

## 기존 기능은 항상 유지
- 고치거나 기능을 넣은 뒤, 배포 전에 반드시 `npm run verify` 를 돌려 모두 통과해야 한다. (자료 데이터 점검 → next build → 3917번 포트 시험 서버로 화면 점검)
- 버그를 고치면 그 버그를 다시 잡는 점검을 `scripts/verify.mjs` 에 하나 더한다.
- 기존 기능을 빼거나 동작을 바꿀 때는 먼저 여쭙는다.
- 점검은 실제 자료와 실제 앱을 건드리지 않는다. 시험 서버는 다른 포트로 띄운다.
