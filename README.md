# SkillMesh – Real-Time Microlearning Network (MVP)

Monorepo (pnpm) with **web** (React + Vite + TS + Tailwind) and **api** (Express + TS + Mongo + Prisma + Stripe + Socket.io).

## Prerequisites
- Node.js 20+, pnpm 9+, Git
- Accounts: MongoDB Atlas, Neon Postgres, Stripe, Upstash Redis, AWS S3, Resend (or SMTP)

## One-shot setup (Mac/Linux)
```bash
git clone REPO_URL skillmesh && cd skillmesh
pnpm i
pnpm bootstrap:env
# start local infra if needed (optional)
docker compose -f infra/docker-compose.yml up -d
# Prisma (Postgres)
pnpm --filter @skillmesh/api prisma:generate
pnpm --filter @skillmesh/api prisma:migrate
# Seed demo data
pnpm seed
# Run dev
pnpm dev
```

## Windows (PowerShell)
```powershell
git clone REPO_URL skillmesh
cd skillmesh
pnpm i
pnpm bootstrap:env
docker compose -f infra/docker-compose.yml up -d
pnpm --filter @skillmesh/api prisma:generate
pnpm --filter @skillmesh/api prisma:migrate
pnpm seed
pnpm dev
```

## Env files
- Copy `.env.example` → `.env` in `apps/api` and `apps/web` (done by `pnpm bootstrap:env`).

### apps/api/.env.example
```
(see apps/api/.env.example in repo)
```

### apps/web/.env.example
```
(see apps/web/.env.example in repo)
```

## Development
- API: http://localhost:8080
- Web: http://localhost:5173

## Tests
```bash
pnpm test
```

## Swagger
Open http://localhost:8080/api/docs


## Extras implemented
- Google OAuth via Passport (`/api/auth/google`).
- Redis sliding window rate limiting (100 req/min/IP).
- Admin RBAC route: `/api/admin/stats`.
- Excalidraw whiteboard with autosave (every 30s) to Mongo.
- Stripe webhook signature verification + idempotency.
- Analytics endpoint `/api/analytics/me`.
- Email templates + cron job for session reminders.
- SkillMatch `/api/match/instant` heuristic.
