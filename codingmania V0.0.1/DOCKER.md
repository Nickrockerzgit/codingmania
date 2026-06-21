# Running CodingMania with Docker

The whole stack — **MySQL**, **Backend (Express/Prisma)**, **Frontend (Vite → nginx)** —
runs with a single command via `docker compose`.

## Prerequisites
- Docker Desktop (or Docker Engine + Compose v2)

## 1. Configure secrets
The backend reads its secrets from `Backend/.env` (JWT, email, ImageKit, Razorpay,
Google, Gemini, etc.). Make sure that file is filled in — it is **not** baked into the
image, it is mounted at runtime.

> `DATABASE_URL` in `Backend/.env` is ignored when running via Compose — it is
> overridden to point at the `db` container automatically.

Optionally, copy `.env.example` to `.env` (next to `docker-compose.yml`) to change the
DB password, ports, or the frontend build URLs. Defaults work out of the box.

## 2. Build & run
```bash
docker compose up --build
```

This will:
1. Start MySQL and wait until it is healthy.
2. Build the backend, **sync the Prisma schema** (creates all tables incl.
   `notifications` and the `blocked` column), and start the API.
3. Build the frontend bundle and serve it through nginx.

## 3. Open the app
| Service   | URL                          |
|-----------|------------------------------|
| Frontend  | http://localhost:8080        |
| Backend   | http://localhost:5000        |
| MySQL     | localhost:3307 (→ db:3306)   |

> MySQL is exposed on host port **3307** so it doesn't clash with a MySQL you may
> already run locally on 3306. Inside Docker, the backend reaches it as `db:3306`.

## Common commands
```bash
docker compose up --build -d      # run in background
docker compose logs -f backend    # tail backend logs
docker compose down               # stop (keeps data)
docker compose down -v            # stop and wipe the database volume
docker compose build frontend     # rebuild only the frontend
```

## Notes
- **Persistent data:** the MySQL data lives in the `db_data` volume and uploaded
  files in `backend_uploads`, so they survive restarts.
- **Frontend env is build-time.** Changing `VITE_*` values requires a rebuild:
  `docker compose build frontend`.
- **Production:** set real public URLs via `.env`
  (`VITE_API_BASE_URL`, `VITE_SOCKET_URL`, `FRONTEND_URL`) and a strong
  `DB_ROOT_PASSWORD`, then `docker compose up --build -d`.
