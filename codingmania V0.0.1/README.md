<div align="center">

# 🚀 CodingMania

### A full-stack community & learning platform for students and alumni

Webinars, hackathons, mentorship, jobs, roadmaps, real-time notifications and a suite of
AI-powered career tools — all in one place.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-MySQL-2D3748?logo=prisma&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-realtime-010101?logo=socketdotio&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)

</div>

---

## 📖 Overview

**CodingMania** is a role-based platform with three portals — **Student**, **Alumni**, and
**Admin** — backed by a single Node.js/Express API. It combines community features
(events, mentorship, jobs, messaging) with productivity tools (tasks, roadmaps,
certificates) and a set of AI assistants (resume builder, cover-letter generator,
interview prep). Real-time updates are delivered over Socket.io.

---

## ✨ Features

### 👨‍🎓 Student Portal
- **Events & Webinars** — register for seat-limited webinars/meetups and team-based
  hackathons; live seat tracking
- **Tasks** — receive admin-assigned tasks; update status & delete
- **Roadmaps** — enroll in learning paths and track step-by-step progress
- **Mentors, Jobs, Messaging, Certificates**
- **Real-time notification bell** — instant alerts for new events, jobs, vlogs, tasks & messages

### 🎓 Alumni Portal
- Post **job opportunities** and create **events**
- Mentor students, share roadmaps, chat, and manage a profile
- Own real-time notification feed

### 🛠️ Admin Panel
- **User Management** — paginated list of students & alumni, block/unblock, **assign tasks**
- **Webinar Management** — create webinars/meetups, view registrations, **export to Excel/CSV**
- **Event Management** — hackathons/competitions with team registrations & Razorpay payments
- Manage Team, Carousel, Sponsors, Vlogs, Join-Us requests and more

### 🤖 AI Tools
- AI **Resume Builder** with multiple templates & PDF export
- AI **Cover-Letter Generator**
- AI **Interview Prep** with topic/level-based quizzes

### 🔔 Platform
- OTP-based authentication (email) + **Google Sign-In**
- **Real-time** messaging & notifications (Socket.io)
- **Rate limiting** (in-memory + optional Upstash Redis)

---

## 🧱 Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS, React Router, Socket.io-client, Framer Motion, Three.js / Vanta, Lucide, Axios |
| **Backend** | Node.js, Express 5, Prisma ORM, Socket.io, JWT, bcrypt, Multer |
| **Database** | MySQL 8 |
| **Integrations** | Nodemailer (email/OTP), ImageKit (media), Razorpay (payments), Google Gemini & OpenAI (AI), Google OAuth, Upstash Redis (rate limiting) |
| **DevOps** | Docker, Docker Compose, Nginx |

---

## 🏗️ Architecture

```mermaid
flowchart LR
    U[Browser<br/>React SPA] -->|REST /api| API[Express API]
    U -->|WebSocket| API
    API --> DB[(MySQL<br/>via Prisma)]
    API --> R[(Upstash Redis<br/>rate limiting)]
    API --> EXT[ImageKit · Razorpay<br/>Gemini · OpenAI · SMTP]
    subgraph Docker Compose
        API
        DB
        WEB[Nginx<br/>static frontend]
    end
    WEB --> U
```

---

## 📁 Project Structure

```
codingmania/
├── Backend/                    # Express + Prisma API
│   ├── prisma/schema.prisma    # Database models
│   ├── src/
│   │   ├── controllers/        # Route handlers
│   │   ├── routes/             # API routes
│   │   ├── middleware/         # auth, rate limiting
│   │   ├── services/           # business logic
│   │   ├── utils/              # notify, helpers
│   │   └── server.js           # app + Socket.io entry
│   └── Dockerfile
├── Frontend/                   # React + Vite SPA
│   ├── src/
│   │   ├── components/         # Admin / Student / Alumni / AI tools
│   │   ├── socket/             # Socket.io client
│   │   └── App.tsx
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml          # db + backend + frontend
└── DOCKER.md                   # Docker guide
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 20+
- **MySQL** 8 (local) — or just use Docker (below)

### Option A — Run with Docker (recommended)
Everything (MySQL + API + frontend) in one command. See **[DOCKER.md](DOCKER.md)** for details.

```bash
docker compose up --build
```
- Frontend → http://localhost:8080
- Backend → http://localhost:5000

### Option B — Run locally

**1. Backend**
```bash
cd Backend
npm install
cp .env.example .env          # then fill in the values (see below)
npx prisma generate
npx prisma db push            # sync schema to your MySQL database
npm start                     # http://localhost:5000
```

**2. Frontend**
```bash
cd Frontend
npm install
# create .env with the VITE_* variables (see below)
npm run dev                   # http://localhost:5173
```

---

## 🔑 Environment Variables

### Backend (`Backend/.env`)
| Variable | Description |
|----------|-------------|
| `PORT` | API port (default `5000`) |
| `DATABASE_URL` | MySQL connection string (`mysql://user:pass@host:3306/db`) |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | JWT signing config |
| `EMAIL_SERVICE`, `EMAIL_USER`, `EMAIL_PASSWORD` | SMTP for OTP & notifications |
| `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT` | Media uploads |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | Event payments |
| `GEMINI_API_KEY`, `OPENAI_API_KEY` | AI features |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` | Google Sign-In |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | _Optional_ — Redis rate limiting |
| `FRONTEND_URL` | Allowed Socket.io origin |

### Frontend (`Frontend/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | API base, e.g. `http://localhost:5000/api` |
| `VITE_SOCKET_URL` | Socket server, e.g. `http://localhost:5000` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `VITE_IMAGEKIT_URL` | ImageKit URL endpoint |

---

## 🔌 API Surface

Base path: `/api`

| Resource | Routes |
|----------|--------|
| Auth | `/auth` — OTP login/signup, Google sign-in |
| Users | `/users` — management, block, assign-task |
| Notifications | `/notifications` — list, mark-read |
| Webinars | `/webinars` — create, register, attendances |
| Events | `/events` — hackathons, team registration, payments |
| Jobs · Roadmaps · Tasks · Quiz | `/jobs` `/roadmaps` `/tasks` `/quiz` |
| Student · Alumni · Profile | `/student` `/alumni` `/profile` |
| Content | `/vlogs` `/sponsors` `/team` `/carousel` `/certificates` |
| Messaging | `/messages` + Socket.io |

---

## 🔒 Security

- **JWT** authentication with role-based access (student / alumni / admin)
- **OTP** email verification for login & signup
- **Rate limiting** — global in-memory limiter on all `/api` routes, with stricter
  per-IP limits on auth/OTP endpoints (optionally backed by **Upstash Redis** for
  multi-instance deployments)
- `trust proxy` aware for correct client IPs behind Nginx/Render

---

## 📜 Scripts

**Backend**
```bash
npm start                 # start API (nodemon)
npx prisma studio         # browse the database
npx prisma db push        # sync schema
```

**Frontend**
```bash
npm run dev               # dev server
npm run build             # production build
npm run preview           # preview build
npm run lint              # lint
```

---

## 🤝 Contributing

1. Fork the repo & create a branch (`git checkout -b feature/my-feature`)
2. Commit your changes
3. Open a Pull Request

---

## 📝 License

This project is proprietary to the **CodingMania** team. All rights reserved.

<div align="center">

Made with ❤️ by the CodingMania team

</div>
