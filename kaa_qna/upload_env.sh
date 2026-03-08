#!/bin/bash
vercel env add POSTGRES_URL production < <(echo "postgresql://neondb_owner:npg_nDJ6ig2oqTzd@ep-still-unit-a1n90g49-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require")
vercel env add POSTGRES_PRISMA_URL production < <(echo "postgresql://neondb_owner:npg_nDJ6ig2oqTzd@ep-still-unit-a1n90g49-pooler.ap-southeast-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require")
vercel env add POSTGRES_URL_NO_SSL production < <(echo "postgresql://neondb_owner:npg_nDJ6ig2oqTzd@ep-still-unit-a1n90g49-pooler.ap-southeast-1.aws.neon.tech/neondb")
vercel env add POSTGRES_URL_NON_POOLING production < <(echo "postgresql://neondb_owner:npg_nDJ6ig2oqTzd@ep-still-unit-a1n90g49.ap-southeast-1.aws.neon.tech/neondb?sslmode=require")
vercel env add POSTGRES_USER production < <(echo "neondb_owner")
vercel env add POSTGRES_HOST production < <(echo "ep-still-unit-a1n90g49-pooler.ap-southeast-1.aws.neon.tech")
vercel env add POSTGRES_PASSWORD production < <(echo "npg_nDJ6ig2oqTzd")
vercel env add POSTGRES_DATABASE production < <(echo "neondb")
