import Link from 'next/link';
import { getPosts } from '@/app/lib/actions';
import { Post } from '@/app/lib/definitions';

export const dynamic = 'force-dynamic';

export default async function QAPage() {
    const posts = await getPosts();

    return (
        <div className="container" style={{ padding: '120px 24px 60px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h1 className="section-title" style={{ marginBottom: 0 }}>Q/A 게시판</h1>
                <Link href="/qa/write" className="btn btn-primary">
                    글쓰기
                </Link>
            </div>

            <div className="qa-list">
                {posts.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '40px' }}>
                        등록된 게시글이 없습니다.
                    </p>
                ) : (
                    <table className="qa-table">
                        <thead>
                            <tr>
                                <th style={{ width: '60px' }}>No</th>
                                <th>제목</th>
                                <th style={{ width: '120px' }}>작성자</th>
                                <th style={{ width: '120px' }}>작성일</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post: any, index: number) => {
                                const date = new Date(post.created_at).toLocaleDateString('ko-KR');
                                return (
                                    <tr key={post.id}>
                                        <td>{posts.length - index}</td>
                                        <td style={{ textAlign: 'left' }}>
                                            <Link href={`/qa/${post.id}`} style={{ textDecoration: 'none', color: 'inherit', fontWeight: '500' }}>
                                                {post.title}
                                            </Link>
                                        </td>
                                        <td>{post.author}</td>
                                        <td>{date}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            <div style={{ marginTop: '40px', textAlign: 'center' }}>
                <a href="https://kaa-hub.vercel.app/" className="btn btn-secondary">
                    홈으로 돌아가기
                </a>
            </div>
        </div>
    );
}
