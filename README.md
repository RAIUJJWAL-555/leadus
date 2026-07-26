# LeadDesk Mini

A lightweight lead capture tool for agencies — collect prospects from your website, track their status from first touch to closed deal.

## Live Demo

- **Frontend:** [https://leadus-chs8.vercel.app](https://leadus-chs8.vercel.app)
- **Backend Health Check:** [https://leadus-chs8.vercel.app/api/health](https://leadus-chs8.vercel.app/api/health)

## Features

- Public lead capture form with Zod validation (name, email, budget range, message)
- Admin dashboard with search, status filter, and pagination
- Click any lead row to view full details in a modal card
- JWT-based admin authentication with bcrypt-hashed passwords
- Rate-limited login endpoint (5 attempts per 15 minutes)
- Status tracking pipeline: New → Contacted → Closed
- Smooth scroll landing page with animated halftone hero section

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS v4 |
| Backend | Express 5, Node.js |
| Database | MongoDB (Mongoose 9) |
| Auth | JWT (jsonwebtoken) + bcrypt |
| Validation | Zod (shared client/server schema) |

## Architecture

The frontend and backend are deployed as **two separate Vercel projects** on different domains:

- **Frontend** — Static React SPA served from Vercel's CDN. Uses `VITE_API_URL` to point at the backend domain.
- **Backend** — Express API deployed as a Vercel serverless function. Connects to MongoDB Atlas, handles auth and lead management.

This separation keeps CORS clean (each project has its own origin), lets environment variables scale independently, and avoids mixing static hosting with serverless functions in one project.

## Data Model

### Lead

| Field | Type | Details |
|-------|------|---------|
| `name` | String | Required, 2–100 chars |
| `email` | String | Required, valid email, lowercased |
| `budget` | String | Enum: `under_1k`, `1k_5k`, `5k_20k`, `20k_plus` |
| `message` | String | Required, 10–2000 chars |
| `status` | String | Enum: `New`, `Contacted`, `Closed` (default: `New`) |
| `createdAt` | Date | Auto-generated |
| `updatedAt` | Date | Auto-generated |

### Admin

| Field | Type | Details |
|-------|------|---------|
| `email` | String | Required, unique, lowercased |
| `passwordHash` | String | bcrypt hash (12 rounds) |
| `createdAt` | Date | Auto-generated |
| `updatedAt` | Date | Auto-generated |

## Authentication

Admins log in with email and password. The password is compared against a bcrypt hash stored in MongoDB. On success, the server returns a JWT signed with `JWT_SECRET` that expires in 8 hours. Protected routes verify the `Authorization: Bearer <token>` header using the `auth` middleware, which decodes the token and attaches the admin's ID and email to the request. Tokens are stored in React state on the client and cleared on 401 responses or manual logout.

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB running locally, **or** a MongoDB Atlas connection string

### 1. Clone and install

```bash
git clone <repo-url> && cd LeadDesk

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Configure environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` and set your values (see [Environment Variables](#environment-variables) below).

### 3. Seed the admin account

```bash
cd backend
npm run seed
```

This creates the first admin using your `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars. Re-running is safe (skips if already exists).

### 4. Run in development

```bash
# Terminal 1 — backend
cd backend
npm run dev

# Terminal 2 — frontend
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Frontend env

```bash
cd frontend
cp .env.example .env
```

Set `VITE_API_URL` to your backend URL (see [Environment Variables](#environment-variables)).

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/leaddesk` |
| `JWT_SECRET` | Random string for signing tokens | `your-long-random-string-here` |
| `PORT` | Server port | `5000` |
| `CLIENT_ORIGIN` | Frontend URL for CORS | `http://localhost:5173` |
| `ADMIN_EMAIL` | Email for the seed admin account | `admin@example.com` |
| `ADMIN_PASSWORD` | Password for the seed admin account | `changeme123` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000` |

## API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/api/leads` | No | Submit a new lead (Zod-validated) |
| `POST` | `/api/auth/login` | No | Admin login, returns JWT (rate-limited: 5/15 min) |
| `GET` | `/api/auth/me` | Yes | Get current admin profile |
| `GET` | `/api/leads` | Yes | List leads (supports `?search=`, `?status=`, `?page=`) |
| `PATCH` | `/api/leads/:id/status` | Yes | Update a lead's status |
| `GET` | `/api/health` | No | Health check |

## Demo Login

> **Email:** `admin@example.com`
> **Password:** _(ask for demo credentials)_

Create your own admin by setting `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env` and running `npm run seed`.

## Project Structure

```
LeadDesk/
├── backend/
│   ├── src/
│   │   ├── config/db.js          # Mongoose connection
│   │   ├── models/Lead.js        # Lead schema
│   │   ├── models/Admin.js       # Admin schema
│   │   ├── middleware/auth.js     # JWT verification
│   │   ├── middleware/rateLimiter.js
│   │   ├── controllers/          # Route handlers
│   │   ├── routes/               # Express routes
│   │   └── server.js             # Express entry point
│   ├── api/index.js              # Vercel serverless entry
│   ├── scripts/seed.js           # First-run admin seeder
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── lib/api.js            # Axios client (baseURL from env)
│   │   ├── lib/AuthContext.jsx    # JWT state provider
│   │   ├── App.jsx               # Router + landing page
│   │   └── index.css             # Tailwind + theme tokens
│   ├── vercel.json               # SPA rewrite rules
│   └── vite.config.js
└── .gitignore
```

## License

MIT

---

Built for [Digital Heroes](https://digitalheroesco.com) Training Task
