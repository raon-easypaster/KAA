'use client';

import { deletePost } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';

export default function DeleteButton({ id }: { id: string }) {
    const router = useRouter();

    const handleDelete = async () => {
        const password = prompt('게시글 삭제를 위해 비밀번호를 입력해주세요:');
        if (!password) return;

        const result = await deletePost(id, password);

        if (result.success) {
            alert('게시글이 삭제되었습니다.');
            router.push('/qa');
            router.refresh();
        } else {
            alert(result.message || '삭제에 실패했습니다.');
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="btn btn-secondary"
            style={{
                backgroundColor: '#dc3545',
                color: 'white',
                borderColor: '#dc3545',
                cursor: 'pointer'
            }}
        >
            삭제하기
        </button>
    );
}
