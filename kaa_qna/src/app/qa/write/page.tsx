'use client';

import { createPost } from '@/app/lib/actions';
import Link from 'next/link';

export default function WritePage() {
    return (
        <div className="container" style={{ padding: '120px 24px 60px', maxWidth: '720px' }}>
            <h1 className="section-title">질문하기</h1>

            <form action={createPost} className="qa-form">
                <div className="form-group">
                    <label htmlFor="title">제목</label>
                    <input type="text" id="title" name="title" required placeholder="제목을 입력하세요" />
                </div>

                <div className="form-group">
                    <label htmlFor="author">작성자</label>
                    <input type="text" id="author" name="author" required placeholder="이름" />
                </div>

                <div className="form-group">
                    <label htmlFor="password">비밀번호</label>
                    <input type="password" id="password" name="password" required placeholder="수정/삭제용 비밀번호 (숫자4자리)" maxLength={4} />
                </div>

                <div className="form-group">
                    <label htmlFor="content">내용</label>
                    <textarea id="content" name="content" required rows={10} placeholder="내용을 입력하세요"></textarea>
                </div>

                <div className="form-actions">
                    <Link href="/qa" className="btn btn-secondary">취소</Link>
                    <button type="submit" className="btn btn-primary">등록하기</button>
                </div>
            </form>
        </div>
    );
}
