# Deployment Guide (MVP)

## Backend (Render/Railway/Fly.io)
1. Create service from `apps/api`.
2. Set environment variables from `apps/api/.env.example`.
3. Healthcheck: `/api/health`.
4. Provision Neon Postgres and set `POSTGRES_URL`.
5. Provision MongoDB Atlas and set `MONGO_URI`.
6. Provision Upstash Redis and set `REDIS_URL`.
7. Stripe: set `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` and configure webhook to `/api/wallet/webhook/stripe`.
8. Run `prisma migrate deploy` on boot (use **Start Command** or deploy hook).
9. Enable persistent logs.

## Frontend (Vercel)
1. Import `apps/web` as a project.
2. Build command: `pnpm --filter @skillmesh/web build`.
3. Set env `VITE_API_URL`, `VITE_WS_URL`, `VITE_STRIPE_PUBLISHABLE_KEY`.
4. Output: `apps/web/dist`.

## AWS S3
- Create bucket, enable CORS for PUTs from your web origin.
- Create IAM user with `s3:PutObject` to the bucket.
- Set `AWS_*` envs in API.

## MongoDB Atlas / Neon / Upstash
- Create clusters/DBs, copy connection URLs into envs.

Screenshots/links to official docs can be added as you provision.
