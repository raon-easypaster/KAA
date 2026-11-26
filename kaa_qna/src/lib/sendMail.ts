// Resend HTTP API 로 공식 이메일에 메일 보내기 (문의·소감 양식에서 쓴다)
import { OFFICIAL_EMAIL } from '@/data/site';

export type SendResult = 'sent' | 'not_configured' | 'failed';

export async function sendMail(opts: { subject: string; text: string; replyTo?: string; fromName: string }): Promise<SendResult> {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return 'not_configured';
    try {
        const r = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                from: `${opts.fromName} <${process.env.INQUIRY_FROM || 'onboarding@resend.dev'}>`,
                to: [process.env.INQUIRY_TO || OFFICIAL_EMAIL],
                subject: opts.subject,
                text: opts.text,
                ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
            }),
        });
        if (!r.ok) {
            console.error('메일 전송 실패', r.status, await r.text());
            return 'failed';
        }
        return 'sent';
    } catch (e) {
        console.error('메일 전송 오류', e);
        return 'failed';
    }
}
