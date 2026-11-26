// 강의·컨설팅 문의 접수 → 공식 이메일로 전송
// 메일 발송은 Resend(https://resend.com) HTTP API 를 쓴다. Vercel 환경변수:
//   RESEND_API_KEY  (필수) Resend 에서 발급한 키
//   INQUIRY_TO      (선택) 받는 주소, 기본 galeb1022@gmail.com
//   INQUIRY_FROM    (선택) 보내는 주소, 기본 'onboarding@resend.dev' (도메인 인증 전 기본 주소)
// 키가 없으면 503 을 돌려주고, 화면은 메일 앱으로 보내기(mailto)로 대신 안내한다.
import { NextResponse } from 'next/server';
import { OFFICIAL_EMAIL } from '@/data/site';

const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(req: Request) {
    let body: Record<string, unknown>;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ ok: false, reason: 'bad_request' }, { status: 400 });
    }

    // 스팸 방지용 숨은 칸: 사람은 비워 두고, 자동 프로그램은 채운다
    if (clean(body.website, 200)) return NextResponse.json({ ok: true });

    const name = clean(body.name, 100);
    const contact = clean(body.contact, 100);
    const topic = clean(body.topic, 100);
    const message = clean(body.message, 3000);
    if (!name || !contact || body.consent !== true) {
        return NextResponse.json({ ok: false, reason: 'missing_fields' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ ok: false, reason: 'not_configured' }, { status: 503 });
    }

    const text = [
        '[한국AI연구소 강의/컨설팅 문의]',
        `- 성함/기관: ${name}`,
        `- 연락처: ${contact}`,
        `- 희망 주제: ${topic || '(선택 안 함)'}`,
        `- 문의 내용: ${message || '(별도 내용 없음)'}`,
        '',
        '※ kaa-hub.vercel.app 문의 양식에서 보낸 메일입니다.',
    ].join('\n');

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
    try {
        const r = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                from: `한국AI연구소 문의 <${process.env.INQUIRY_FROM || 'onboarding@resend.dev'}>`,
                to: [process.env.INQUIRY_TO || OFFICIAL_EMAIL],
                subject: `[강의 문의] ${name} · ${topic || '문의'}`,
                text,
                ...(isEmail ? { reply_to: contact } : {}),
            }),
        });
        if (!r.ok) {
            console.error('문의 메일 전송 실패', r.status, await r.text());
            return NextResponse.json({ ok: false, reason: 'send_failed' }, { status: 502 });
        }
    } catch (e) {
        console.error('문의 메일 전송 오류', e);
        return NextResponse.json({ ok: false, reason: 'send_failed' }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
}
