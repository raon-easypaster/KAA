'use client';

import { useState } from 'react';
import { OFFICIAL_EMAIL } from '@/data/site';

type Status = 'idle' | 'sending' | 'sent' | 'fallback';

export default function FeedbackForm({ lectures, initialLecture }: { lectures: string[]; initialLecture?: string }) {
    const [lecture, setLecture] = useState(initialLecture && lectures.includes(initialLecture) ? initialLecture : '');
    const [comment, setComment] = useState('');
    const [allowPublish, setAllowPublish] = useState(true);
    const [website, setWebsite] = useState('');
    const [status, setStatus] = useState<Status>('idle');

    const mailto = `mailto:${OFFICIAL_EMAIL}?subject=${encodeURIComponent(`[수업 소감] ${lecture || '강의'}`)}&body=${encodeURIComponent(
        `들은 강의: ${lecture || '(선택 안 함)'}\n소감: ${comment}\n사이트 게시: ${allowPublish ? '이름 없이 게시해도 좋음' : '게시하지 않음'}`
    )}`;

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;
        setStatus('sending');
        try {
            const r = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lecture, comment, allowPublish, website }),
            });
            setStatus(r.ok ? 'sent' : 'fallback');
        } catch {
            setStatus('fallback');
        }
    };

    if (status === 'sent') {
        return <div className="feedback-done">🙏 소감 감사합니다! 다음 강의를 준비하는 데 소중히 쓰겠습니다.</div>;
    }

    return (
        <form className="feedback-form" onSubmit={onSubmit}>
            <label htmlFor="fb-lecture">들은 강의</label>
            <select id="fb-lecture" value={lecture} onChange={(e) => setLecture(e.target.value)}>
                <option value="">선택 안 함</option>
                {lectures.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>

            <label htmlFor="fb-comment">한 줄 소감 <span className="req">*</span></label>
            <textarea
                id="fb-comment"
                rows={3}
                maxLength={1000}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="예: AI가 막연히 어려웠는데, 오늘 직접 해 보니 나도 할 수 있겠다는 생각이 들었어요."
            />

            <label className="feedback-check">
                <input type="checkbox" checked={allowPublish} onChange={(e) => setAllowPublish(e.target.checked)} />
                이름 없이 사이트의 &ldquo;참가자 한마디&rdquo;에 실려도 좋습니다.
            </label>

            <input
                type="text"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="hp-field"
            />

            <p className="feedback-privacy">이름이나 연락처는 받지 않습니다.</p>
            <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
                {status === 'sending' ? '보내는 중…' : '소감 보내기'}
            </button>

            {status === 'fallback' && (
                <div className="feedback-fallback">
                    <p>지금은 바로 보내기가 되지 않습니다. 아래 버튼을 누르면 메일 앱으로 보낼 수 있습니다.</p>
                    <a href={mailto} className="btn btn-secondary">✉️ 메일 앱으로 보내기 ({OFFICIAL_EMAIL})</a>
                </div>
            )}
        </form>
    );
}
