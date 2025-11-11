# API (MVP)

Base URL: `/api`

## Auth
- POST `/auth/register` { name, email, password }
- POST `/auth/login` { email, password }
- POST `/auth/refresh` { refreshToken }
- POST `/auth/logout`

## Users
- GET `/users/me` (auth)
- PATCH `/users/me` (auth) { bio, skills, tags, availability, avatarUrl }
- GET `/users/:id`

## Sessions
- POST `/sessions` (auth) { topic, tags, mode, priceCredits, maxParticipants, description }
- GET `/sessions/discover?q=&tags=&mode=&status=`
- POST `/sessions/:id/join` (auth)
- POST `/sessions/:id/start` (auth, host only)
- POST `/sessions/:id/end` (auth, host only)
- POST `/sessions/:id/cancel` (auth, host only)
- GET `/sessions/:id`

## Ratings
- POST `/ratings` (auth) { sessionId, rateeId, stars, comment }
- GET `/ratings/user/:userId`

## Wallet
- GET `/wallet` (auth)
- POST `/wallet/purchase` (auth) { credits }
- POST `/wallet/webhook/stripe` (webhook)

## Notifications
- GET `/notifications` (auth)
- POST `/notifications/:id/read` (auth)

## Files
- POST `/files/presign` (auth)
