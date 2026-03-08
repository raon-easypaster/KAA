'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Helper to send Telegram notification
async function sendTelegramMessage(title: string, author: string, content: string) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        console.warn('Telegram credentials not found. Skipping notification.');
        return;
    }

    const message = `
[새로운 문의]
제목: ${title}
작성자: ${author}
내용: ${content.length > 50 ? content.slice(0, 50) + '...' : content}

바로가기: https://kaa-hub.vercel.app/qa
`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
            }),
        });

        if (!response.ok) {
            console.error('Failed to send Telegram notification:', await response.text());
        }
    } catch (error) {
        console.error('Error sending Telegram notification:', error);
    }
}

export async function createPost(formData: FormData) {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const author = formData.get('author') as string;
    const password = formData.get('password') as string; // Simple password for edit/delete protection

    if (!title || !content || !author || !password) {
        throw new Error('All fields are required');
    }

    try {
        await sql`
      INSERT INTO kaa_posts (title, content, author, password, created_at)
      VALUES (${title}, ${content}, ${author}, ${password}, NOW())
    `;

        // Send notification (fire and forget pattern, but await to ensure execution in serverless)
        try {
            await sendTelegramMessage(title, author, content);
        } catch (msgError) {
            console.error('Failed to send notification:', msgError);
            // Don't fail the request if notification fails
        }

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to create post.');
    }

    revalidatePath('/');
    redirect('/');
}

export async function getPosts() {
    try {
        // Create table if it doesn't exist
        await sql`
            CREATE TABLE IF NOT EXISTS kaa_posts (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                author VARCHAR(100) NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        const data = await sql`
      SELECT id, title, content, author, created_at
      FROM kaa_posts
      ORDER BY created_at DESC
      LIMIT 50
    `;
        return data.rows;
    } catch (error) {
        console.error('Database Error:', error);
        // Return empty array if table doesn't exist yet
        return [];
    }
}

export async function getPostById(id: string) {
    try {
        const data = await sql`
      SELECT id, title, content, author, created_at
      FROM kaa_posts
      WHERE id = ${id}
    `;
        return data.rows[0];
    } catch (error) {
        console.error('Database Error:', error);
        return null;
    }
}

export async function deletePost(id: string, password: string) {
    try {
        // Verify password first
        const result = await sql`
        SELECT id FROM kaa_posts WHERE id = ${id} AND password = ${password}
        `;

        if (result.rowCount === 0) {
            return { success: false, message: '비밀번호가 일치하지 않습니다.' };
        }

        // Delete post
        await sql`DELETE FROM kaa_posts WHERE id = ${id}`;

        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Database Error:', error);
        return { success: false, message: '삭제 중 오류가 발생했습니다.' };
    }
}
