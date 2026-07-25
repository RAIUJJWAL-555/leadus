# LeadDesk Mini

A lightweight CRM for small teams. Capture leads from your website, track their status, and never let a hot prospect slip through the cracks.

Built for the Digital Heroes Full Stack Development qualification task (Task A + B).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS v4 |
| Backend | Express 5, Node.js |
| Database | MongoDB (Mongoose 9) |
| Auth | JWT (jsonwebtoken) + bcrypt |
| Validation | Zod (shared client/server schema) |

## Setup

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

Edit `.env` and set your values:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/leaddesk` |
| `JWT_SECRET` | Random string for signing tokens | `your-secret-key-here-change-in-production` |
| `PORT` | Server port | `5000` |
| `CLIENT_ORIGIN` | Frontend URL (for CORS) | `http://localhost:5173` |
| `ADMIN_EMAIL` | Email for the seed admin account | `admin@leaddesk.com` |
| `ADMIN_PASSWORD` | Password for the seed admin account | `changeme123` |

### 3. Seed the admin account

```bash
cd backend
npm run seed
```

This creates the first admin account. Re-running is safe (skips if already exists).

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

## API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/api/leads` | No | Submit a new lead (Zod-validated) |
| `POST` | `/api/auth/login` | No | Admin login, returns JWT (rate-limited: 5 attempts/15 min) |
| `GET` | `/api/auth/me` | Yes | Get current admin profile |
| `GET` | `/api/leads` | Yes | List leads (supports `?search=`, `?status=`, `?page=`) |
| `PATCH` | `/api/leads/:id/status` | Yes | Update a lead's status |
| `GET` | `/api/health` | No | Health check |

## Demo Credentials

> **Email:** `admin@leaddesk.com`
> **Password:** `changeme123`

Replace with your own values by updating the `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars and re-running `npm run seed`.

## Project Structure

```
LeadDesk/
├── shared/validation.js          # Zod schema (used by both client and server)
├── backend/
│   ├── src/
│   │   ├── config/db.js          # Mongoose connection
│   │   ├── models/Lead.js        # Lead Mongoose model
│   │   ├── models/Admin.js       # Admin Mongoose model
│   │   ├── middleware/auth.js     # JWT verification
│   │   ├── middleware/rateLimiter.js
│   │   ├── controllers/          # Route handlers
│   │   ├── routes/               # Express routes
│   │   └── server.js             # Express entry point
│   ├── scripts/seed.js           # First-run admin seeder
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── lib/api.js            # Axios client
│   │   ├── lib/AuthContext.jsx    # JWT state provider
│   │   ├── App.jsx               # Router + layout
│   │   └── index.css             # Tailwind + theme
│   └── vite.config.js
└── .gitignore
```

## Deployment

### Render (backend)

1. Create a new **Web Service** on Render
2. Set the build command: `npm install && cd ../frontend && npm install && npm run build`
3. Set the start command: `cd backend && npm start`
4. Add environment variables from `.env.example`
5. Set `CLIENT_ORIGIN` to your Render frontend URL (or leave as-is if serving frontend from Express)

### Vercel (frontend, optional)

If deploying the frontend separately on Vercel:

1. Set the root directory to `frontend`
2. Set the build command: `npm run build`
3. Set the output directory: `dist`
4. Rewrite all routes to `index.html` (SPA fallback)
5. Set `CLIENT_ORIGIN` on the backend to your Vercel deployment URL

> **Note:** The backend serves the frontend build via `express.static` in production, so a separate Vercel deploy is optional. A single Render Web Service handles both.

## License

ISC
