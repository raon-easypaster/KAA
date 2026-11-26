// 기존 기능 자동 점검: `npm run verify`
// - 자료 데이터와 파일 점검 → next build → 다른 포트(3917)로 시험 서버를 띄워 실제 페이지 확인
// - 실제 배포 사이트와 실제 데이터는 건드리지 않는다.
// - 급할 때 빌드를 건너뛰려면 SKIP_BUILD=1 (기본은 항상 빌드)
import { readFileSync, existsSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 3917;
const results = [];
const check = (name, ok, detail = '') => {
    results.push({ name, ok });
    console.log(`${ok ? '✅' : '❌'} ${name}${ok || !detail ? '' : `\n     → ${detail}`}`);
};

// ---------- 1. 자료 데이터 점검 ----------
const srcJson = readFileSync(join(ROOT, 'src/data/materials.json'), 'utf8');
const pubJson = readFileSync(join(ROOT, 'public/data/materials.json'), 'utf8');
const materials = JSON.parse(srcJson);
check('자료: src/data 와 public/data 의 materials.json 내용이 같다',
    JSON.stringify(materials) === JSON.stringify(JSON.parse(pubJson)),
    '두 파일 중 한쪽만 고쳐졌습니다');

const ids = materials.map(m => m.id);
check('자료: id 가 서로 겹치지 않는다', new Set(ids).size === ids.length,
    `겹치는 id: ${ids.filter((id, i) => ids.indexOf(id) !== i).join(', ')}`);

const REQUIRED = ['id', 'title', 'description', 'audience', 'level', 'format', 'duration', 'updated', 'links', 'tags', 'category', 'fileType'];
const missing = materials.flatMap(m => REQUIRED.filter(k => m[k] === undefined).map(k => `${m.id}.${k}`));
check('자료: 모든 자료에 필수 항목이 있다', missing.length === 0, missing.join(', '));

const badEnum = materials.filter(m => !['pastor', 'welfare', 'general'].includes(m.audience)
    || !['입문', '중급', '고급'].includes(m.level)
    || !['slide', 'workbook', 'report', 'guide'].includes(m.format)).map(m => m.id);
check('자료: 대상·난이도·형식 값이 정해진 값 중 하나다', badEnum.length === 0, badEnum.join(', '));

const localLinks = [...new Set(materials.flatMap(m => Object.values(m.links)))]
    .filter(l => l.startsWith('/'))
    .map(l => decodeURIComponent(l.split('?')[0].split('#')[0]));
const missingFiles = localLinks.filter(l => !existsSync(join(ROOT, 'public', l)));
check('자료: 자료 카드가 가리키는 파일이 public 폴더에 모두 있다', missingFiles.length === 0, missingFiles.join(', '));

// 버그 재발 방지: 돌봄센터 자료 3건이 빠졌던 문제 (2026-11)
const CHILDCARE = ['childcare-center-ai', 'childcare-evaluation-ai', 'childcare-agent-system'];
const lostChildcare = CHILDCARE.filter(id => !ids.includes(id));
check('자료: 돌봄센터 강의 자료 3건이 자료실에 있다', lostChildcare.length === 0, `빠진 자료: ${lostChildcare.join(', ')}`);

// ---------- 1-2. 강의별 페이지 데이터 점검 ----------
const courses = JSON.parse(readFileSync(join(ROOT, 'src/data/courses.json'), 'utf8'));
const slugs = courses.map(c => c.slug);
check('강의: 강의 주소(slug)가 서로 겹치지 않는다', new Set(slugs).size === slugs.length);
const badRefs = courses.flatMap(c => c.sections.flatMap(s => s.lessons
    .filter(l => !ids.includes(l.materialId)).map(l => `${c.slug}:${l.materialId}`)));
check('강의: 강의의 모든 차시가 자료실에 있는 자료를 가리킨다', badRefs.length === 0, badRefs.join(', '));
const emptyCourse = courses.filter(c => c.sections.flatMap(s => s.lessons).length === 0).map(c => c.slug);
check('강의: 모든 강의에 차시가 1개 이상 있다', emptyCourse.length === 0, emptyCourse.join(', '));
const lessonsOf = (c) => c.sections.flatMap(s => s.lessons.map(l => materials.find(m => m.id === l.materialId)));

// ---------- 2. 빌드 ----------
if (process.env.SKIP_BUILD !== '1') {
    console.log('\n… next build 실행 중');
    const b = spawnSync('npx', ['next', 'build'], { cwd: ROOT, encoding: 'utf8' });
    check('빌드: next build 가 성공한다', b.status === 0, (b.stdout + b.stderr).split('\n').slice(-15).join('\n'));
    if (b.status !== 0) finish();
} else {
    console.log('\n⚠️  SKIP_BUILD=1: 빌드를 건너뜁니다 (이전 빌드 결과로 화면 점검)');
}

// ---------- 3. 시험 서버로 실제 화면 점검 ----------
// 시험 서버에서는 메일 발송 키를 비워 실제 메일이 나가지 않게 한다
const testEnv = { ...process.env };
delete testEnv.RESEND_API_KEY;
const server = spawn('npx', ['next', 'start', '-p', String(PORT)], { cwd: ROOT, stdio: 'ignore', detached: true, env: testEnv });
const base = `http://localhost:${PORT}`;
const get = async (path) => {
    const r = await fetch(base + path);
    return { status: r.status, text: await r.text() };
};
try {
    let up = false;
    for (let i = 0; i < 60 && !up; i++) {
        try { await fetch(base + '/'); up = true; } catch { await new Promise(r => setTimeout(r, 500)); }
    }
    check('서버: 시험 서버가 켜진다', up);
    if (up) {
        const home = await get('/');
        check('홈: 첫 화면이 열린다 (200)', home.status === 200, `상태 ${home.status}`);
        const missingTitles = materials.filter(m => !home.text.includes(escapeHtml(m.title))).map(m => m.title);
        check('홈: 자료실에 모든 자료 제목이 보인다', missingTitles.length === 0, missingTitles.join(' / '));
        check('홈: 자료 검색창이 있다', home.text.includes('type="search"'));
        check('홈: 강의 문의 양식이 있다', home.text.includes('id="inq-name"') && home.text.includes('id="inq-topic"'));
        check('홈: 두 공동대표 사진이 있다', home.text.includes('founder_kim') && home.text.includes('founder_lee'));
        check('홈: 오시는 길 전화번호가 있다', home.text.includes('010-5606-0845'));
        check('홈: 공식 이메일(galeb1022@gmail.com) 링크가 있다', home.text.includes('mailto:galeb1022@gmail.com'));
        check('홈: 페이스북 링크가 있다', home.text.includes('https://www.facebook.com/galeb76'));
        check('홈: 문의 양식 버튼이 "문의 보내기"다', home.text.includes('문의 보내기'));
        // 버그 재발 방지: 작업용 [TODO] 문구가 방문자에게 보였던 문제 (2026-11)
        check('홈: 화면에 [TODO] 작업 문구가 보이지 않는다', !home.text.includes('[TODO'), '홈 HTML 안에 "[TODO" 가 있습니다');

        const privacy = await get('/privacy');
        check('개인정보: 처리방침 페이지가 열린다 (200)', privacy.status === 200, `상태 ${privacy.status}`);
        check('개인정보: 화면에 [TODO] 작업 문구가 보이지 않는다', !privacy.text.includes('[TODO'));
        check('개인정보: 문의 연락처(전화)가 있다', privacy.text.includes('010-5606-0845'));
        check('개인정보: 공식 이메일이 있다', privacy.text.includes('galeb1022@gmail.com'));

        // ----- 문의 메일 접수 API (실제 메일은 보내지 않음) -----
        const post = (body) => fetch(`${base}/api/inquiry`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        });
        const good = { name: '시험', contact: '010-0000-0000', topic: '기타 맞춤 컨설팅', message: '점검', consent: true, website: '' };
        const r1 = await post({ ...good, name: '' });
        check('문의: 이름이 비면 접수하지 않는다 (400)', r1.status === 400, `상태 ${r1.status}`);
        const r2 = await post({ ...good, consent: false });
        check('문의: 개인정보 동의가 없으면 접수하지 않는다 (400)', r2.status === 400, `상태 ${r2.status}`);
        const r3 = await post({ ...good, website: 'spam' });
        check('문의: 스팸 숨은 칸이 채워지면 조용히 무시한다 (200)', r3.status === 200, `상태 ${r3.status}`);
        const r4 = await post(good);
        const j4 = await r4.json().catch(() => ({}));
        check('문의: 발송 키가 없으면 503(not_configured)으로 알려 화면이 메일 앱 안내로 바뀐다',
            r4.status === 503 && j4.reason === 'not_configured', `상태 ${r4.status} ${JSON.stringify(j4)}`);

        const json = await get('/data/materials.json');
        check('자료: /data/materials.json 이 열린다', json.status === 200, `상태 ${json.status}`);

        const broken = [];
        for (const l of localLinks) {
            const r = await fetch(base + encodeURI(l));
            if (r.status !== 200) broken.push(`${l} (${r.status})`);
        }
        check('자료: 자료 카드 링크가 모두 열린다 (200)', broken.length === 0, broken.join(', '));

        const zips = ['AI_두려움을_넘어_지역아동센터_다함께돌봄센터.zip', 'AI_아동센터_평가대비_AI실무교육.zip', 'AI_돌봄현장_통합에이전트_업무시스템.zip'];
        const badZip = [];
        for (const z of zips) {
            const r = await fetch(`${base}/data/${encodeURIComponent(z)}`);
            if (r.status !== 200) badZip.push(`${z} (${r.status})`);
        }
        check('자료: 돌봄센터 자료 ZIP 내려받기가 된다', badZip.length === 0, badZip.join(', '));

        // ----- 강의별 페이지 -----
        check('홈: 강의별 페이지 바로가기가 있다', courses.every(c => home.text.includes(`href="/course/${c.slug}"`)),
            '홈에 /course/<slug> 링크가 빠졌습니다');
        const list = await get('/course');
        check('강의: 강의 목록 페이지가 열리고 모든 강의가 보인다',
            list.status === 200 && courses.every(c => list.text.includes(escapeHtml(c.title))), `상태 ${list.status}`);

        const courseErr = [];
        const navErr = [];
        for (const c of courses) {
            const lessons = lessonsOf(c);
            const page = await get(`/course/${c.slug}`);
            if (page.status !== 200) { courseErr.push(`${c.slug} (${page.status})`); continue; }
            const miss = lessons.filter(m => !page.text.includes(escapeHtml(m.title)));
            if (miss.length) courseErr.push(`${c.slug}: 차시 제목 빠짐 ${miss.map(m => m.id).join(', ')}`);
            if (!page.text.includes(`href="/course/${c.slug}/1"`)) courseErr.push(`${c.slug}: 1차시 시작 링크 없음`);

            for (let n = 1; n <= lessons.length; n++) {
                const lp = await get(`/course/${c.slug}/${n}`);
                const m = lessons[n - 1];
                const where = `${c.slug}/${n}`;
                if (lp.status !== 200) { navErr.push(`${where} (${lp.status})`); continue; }
                if (!lp.text.includes(escapeHtml(m.title))) navErr.push(`${where}: 자료 제목 없음`);
                const src = m.links.doc || m.links.slide;
                if (!lp.text.includes(escapeHtml(src))) navErr.push(`${where}: 자료 화면(${src}) 없음`);
                const hasPrev = lp.text.includes(`href="/course/${c.slug}/${n - 1}"`);
                const hasNext = lp.text.includes(`href="/course/${c.slug}/${n + 1}"`);
                if (n > 1 && !hasPrev) navErr.push(`${where}: 이전 링크 없음`);
                if (n < lessons.length && !hasNext) navErr.push(`${where}: 다음 링크 없음`);
                if (n === lessons.length && !lp.text.includes(`href="/course/${c.slug}"`)) navErr.push(`${where}: 마지막 차시에 과정으로 돌아가기 없음`);
            }
            const over = await get(`/course/${c.slug}/${lessons.length + 1}`);
            if (over.status !== 404) navErr.push(`${c.slug}/${lessons.length + 1}: 없는 차시인데 ${over.status}`);
        }
        check('강의: 각 강의 페이지가 열리고 모든 차시 제목이 보인다', courseErr.length === 0, courseErr.join(' / '));
        check('강의: 각 차시 페이지에 자료 화면과 이전·다음 이동이 맞게 있다', navErr.length === 0, navErr.join(' / '));
        const nf = await get('/course/no-such-course');
        check('강의: 없는 강의 주소는 404를 낸다', nf.status === 404, `상태 ${nf.status}`);

        // ----- 로고 -----
        const logo = await fetch(base + '/images/logo-mark.svg');
        check('로고: 메뉴에 로고 이미지가 있고 열린다',
            home.text.includes('src="/images/logo-mark.svg"') && logo.status === 200 && (logo.headers.get('content-type') || '').includes('svg'),
            `상태 ${logo.status}`);
        check('로고: 브라우저 탭 아이콘(icon.svg)이 연결되어 있다', /<link rel="icon" href="\/icon\.svg/.test(home.text));

        // ----- 그림 배치 -----
        const SCENES = ['growth-steps', 'bridge', 'workshop'];
        const missScene = SCENES.filter(n => !home.text.includes(`src="/images/scenes/${n}.webp"`));
        check('그림: 홈의 로드맵·연구소 소개·강의 문의에 그림이 있다', missScene.length === 0, `빠진 그림: ${missScene.join(', ')}`);
        const cssLinks = [...home.text.matchAll(/href="(\/_next\/static\/[^"]+\.css)"/g)].map(m => m[1]);
        let css = '';
        for (const c of cssLinks) css += await (await fetch(base + c)).text();
        check('그림: 첫 화면 배경이 새 그림(hero-ai-together)이다', css.includes('/images/scenes/hero-ai-together.webp'));
        const allScenes = ['hero-ai-together', 'growth-steps', 'bridge', 'workshop', 'welfare-team'];
        const badScene = [];
        for (const n of allScenes) { const r = await fetch(`${base}/images/scenes/${n}.webp`); if (r.status !== 200) badScene.push(`${n} (${r.status})`); }
        check('그림: 그림 파일 5개가 모두 열린다', badScene.length === 0, badScene.join(', '));
        const imgErr = [];
        for (const c of courses.filter(c => c.image)) {
            const cp = await get(`/course/${c.slug}`);
            if (!cp.text.includes(`src="${c.image}"`)) imgErr.push(c.slug);
        }
        check('그림: 강의 페이지에 강의 대표 그림이 보인다', imgErr.length === 0, imgErr.join(', '));

        // ----- 교회 사역 프로그램 -----
        check('홈: 교회 사역 프로그램 바로가기가 있다', home.text.includes('href="/programs"'));
        const pg = await get('/programs');
        check('프로그램: 소개 페이지가 열린다 (200)', pg.status === 200, `상태 ${pg.status}`);
        const PROGRAM_LINKS = [
            ['예배송출 다운로드', 'https://raon-easypaster.github.io/worship-caster/'],
            ['라온 플래너 다운로드', 'https://raon-easypaster.github.io/raon-planner/'],
            ['라온 뮤직시트 앱', 'https://raon-music-sheet.vercel.app'],
            ['라온 뮤직시트 사용설명서', 'https://raon-easypaster.github.io/raon-music-sheet-guide/'],
        ];
        const missLinks = PROGRAM_LINKS.filter(([, u]) => !pg.text.includes(`href="${u}"`)).map(([n]) => n);
        check('프로그램: 예배송출·라온 플래너·라온 뮤직시트 링크가 모두 있다', missLinks.length === 0, `빠진 링크: ${missLinks.join(', ')}`);
        check('프로그램: AI 콘솔메이트는 유료 세팅·교육 안내와 문의 연결이 있다',
            pg.text.includes('AI 콘솔메이트') && pg.text.includes('유료') && pg.text.includes('href="/#contact"'));
        check('프로그램: 라온 교회 올인원은 작업 중으로 안내한다',
            pg.text.includes('라온 교회 올인원') && pg.text.includes('작업 중'));
        const posters = [...pg.text.matchAll(/src="(\/images\/programs\/[^"]+)"/g)].map(m => m[1]);
        const badPosters = [];
        for (const src of posters) { const r = await fetch(base + src); if (r.status !== 200) badPosters.push(`${src} (${r.status})`); }
        check('프로그램: 소개 이미지가 모두 열린다', posters.length >= 4 && badPosters.length === 0,
            `이미지 ${posters.length}개, 실패: ${badPosters.join(', ')}`);
    }
} finally {
    try { process.kill(-server.pid); } catch { }
}
finish();

function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function finish() {
    const pass = results.filter(r => r.ok).length;
    console.log(`\n점검 ${pass}/${results.length} 통과`);
    process.exit(pass === results.length ? 0 : 1);
}
