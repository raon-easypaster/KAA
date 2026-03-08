import Link from 'next/link';
import { getPostById } from '@/app/lib/actions';
import { notFound } from 'next/navigation';
import DeleteButton from './DeleteButton';

export const dynamic = 'force-dynamic';

export default async function PostDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const post = await getPostById(id);

    if (!post) {
        notFound();
    }

    const date = new Date(post.created_at).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="container" style={{ padding: '120px 24px 60px' }}>
            <div className="post-detail" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '16px' }}>{post.title}</h1>

                <div style={{
                    display: 'flex',
                    gap: '16px',
                    color: 'var(--gray-500)',
                    marginBottom: '32px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid var(--gray-300)'
                }}>
                    <span>작성자: {post.author}</span>
                    <span>|</span>
                    <span>{date}</span>
                </div>

                <div style={{
                    minHeight: '300px',
                    padding: '32px',
                    backgroundColor: 'var(--bg-warm)',
                    borderRadius: '12px',
                    marginBottom: '32px',
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.8',
                    fontSize: '1.1rem'
                }}>
                    {post.content}
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <Link href="/qa" className="btn btn-secondary">
                        목록으로
                    </Link>
                    <DeleteButton id={post.id} />
                </div>
            </div>
        </div>
    );
}
