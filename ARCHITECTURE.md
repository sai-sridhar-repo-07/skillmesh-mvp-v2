# Architecture (MVP)

```
apps/
  api/  -> Express + TypeScript
    - MongoDB (Users, Sessions, Chat, Ratings, Notifications)
    - Prisma + Postgres (Wallet, Transactions)
    - Socket.io + Redis adapter (presence/session/notify)
    - Stripe adapter
  web/  -> React + Vite + TS + Tailwind
    - React Query + Zustand
    - Router: landing, auth, dashboard, discover, session
packages/
  tsconfig/
infra/
  docker-compose.yml (redis, mongo, pg)

Data flow:
Web -> API (REST) -> Mongo/Prisma
Web <-> API (Socket.io) for chat/presence/signaling
Stripe -> Webhook -> Prisma (credits) -> Notify
```

## Security
- JWT (access/refresh), bcrypt hashing, CORS locked to `CLIENT_ORIGIN`, Helmet, Zod validation.
- Rate limiting to be added with Redis in production.
