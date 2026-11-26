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
const server = spawn('npx', ['next', 'start', '-p', String(PORT)], { cwd: ROOT, stdio: 'ignore', detached: true });
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
        // 버그 재발 방지: 작업용 [TODO] 문구가 방문자에게 보였던 문제 (2026-11)
        check('홈: 화면에 [TODO] 작업 문구가 보이지 않는다', !home.text.includes('[TODO'), '홈 HTML 안에 "[TODO" 가 있습니다');

        const privacy = await get('/privacy');
        check('개인정보: 처리방침 페이지가 열린다 (200)', privacy.status === 200, `상태 ${privacy.status}`);
        check('개인정보: 화면에 [TODO] 작업 문구가 보이지 않는다', !privacy.text.includes('[TODO'));
        check('개인정보: 문의 연락처(전화)가 있다', privacy.text.includes('010-5606-0845'));

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
