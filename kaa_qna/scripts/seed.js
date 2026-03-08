const { db } = require('@vercel/postgres');

async function main() {
    const client = await db.connect();

    await client.sql`
    CREATE TABLE IF NOT EXISTS posts (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      author VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

    // Create extension for UUID if it doesn't exist
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    console.log(`Created "posts" table`);

    // Seed with one post
    /*
    await client.sql`
      INSERT INTO posts (title, content, author, password)
      VALUES ('환영합니다', '질문과 답변 게시판입니다.', '관리자', '1234')
    `;
    */

    await client.end();
}

main().catch((err) => {
    console.error(
        'An error occurred while attempting to seed the database:',
        err,
    );
});
