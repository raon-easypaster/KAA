// 수업 한 줄 소감 접수 → 공식 이메일로 전송 (키가 없으면 503, 화면은 메일 앱 보내기로 안내)
import { NextResponse } from 'next/server';
import { sendMail } from '@/lib/sendMail';

const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(req: Request) {
    let body: Record<string, unknown>;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ ok: false, reason: 'bad_request' }, { status: 400 });
    }
    if (clean(body.website, 200)) return NextResponse.json({ ok: true }); // 스팸 방지 숨은 칸

    const lecture = clean(body.lecture, 100);
    const comment = clean(body.comment, 1000);
    const allowPublish = body.allowPublish === true;
    if (!comment) return NextResponse.json({ ok: false, reason: 'missing_fields' }, { status: 400 });

    const text = [
        '[한국AI연구소 수업 한 줄 소감]',
        `- 들은 강의: ${lecture || '(선택 안 함)'}`,
        `- 소감: ${comment}`,
        `- 사이트 게시: ${allowPublish ? '이름 없이 게시해도 좋음' : '게시하지 않음'}`,
        '',
        '※ kaa-hub.vercel.app 소감 양식에서 보낸 메일입니다. 이름은 받지 않습니다.',
    ].join('\n');

    const result = await sendMail({ fromName: '한국AI연구소 소감', subject: `[수업 소감] ${lecture || '강의'}`, text });
    if (result === 'not_configured') return NextResponse.json({ ok: false, reason: 'not_configured' }, { status: 503 });
    if (result === 'failed') return NextResponse.json({ ok: false, reason: 'send_failed' }, { status: 502 });
    return NextResponse.json({ ok: true });
}
