# Production deployment guide

This document outlines a simple production deployment using Docker Compose. It provides sample Dockerfiles for the Next.js frontend and Laravel backend and a minimal nginx reverse-proxy configuration.

High level:

- Build frontend with Next.js (production build)
- Build backend image using php-fpm and composer
- Use nginx as a reverse-proxy for the frontend and backend (or use separate domains)
- Use a persistent DB (Postgres or MariaDB preferred). This repo defaults to SQLite for local development; switch to a proper RDBMS for production.

Files in this folder:

- `docker-compose.prod.yml` - sample compose stack
- `frontend/Dockerfile` - builds Next.js static assets and starts with `next start`
- `backend/Dockerfile` - builds Laravel with php-fpm, copies code, runs composer

Security & Ops notes:

- DO NOT use SQLite in production. Switch `.env` to a production DB (Postgres/MySQL).
- Store secrets in a secret store or environment variables; don't commit `.env`.
- Configure HTTPS (Let's Encrypt or cloud-managed certs) in front of nginx.
- Configure CORS to restrict origins to your frontend domain.
- Add a process manager or orchestrator (Kubernetes, ECS) for high availability.

See `docker-compose.prod.yml` for a minimal example.
