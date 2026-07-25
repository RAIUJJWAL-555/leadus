# LeadDesk Mini — Architecture Plan

## 1. Data Models

### Lead
```js
{
  _id: ObjectId (auto),
  name: String (required, trim, 2-100 chars),
  email: String (required, lowercase, valid email),
  budgetRange: String (required, enum: ["Under $1k", "$1k–$5k", "$5k–$10k", "$10k+"]),
  message: String (required, 10–1000 chars),
  status: String (default: "New", enum: ["New", "Contacted", "Closed"]),
  createdAt: Date (default: now),
  updatedAt: Date (auto)
}
```

### Admin
```js
{
  _id: ObjectId (auto),
  name: String (required, trim),
  email: String (required, unique, lowercase),
  password: String (hashed with bcrypt),
  createdAt: Date
}
```

**Validation approach:** Single Zod schema shared between client and server.
- `shared/leadSchema.js` — exports `leadSchema` and `leadValidationSchema`
- Express uses `.parse()` for strict server-side validation
- React form uses the same schema via `zodResolver` in React Hook Form

---

## 2. API Routes

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| POST | `/api/auth/register` | No (first-run only) | Register admin account |
| POST | `/api/auth/login` | No | Login, returns JWT cookie |
| POST | `/api/auth/logout` | Yes | Clear JWT cookie |
| GET | `/api/auth/me` | Yes | Return current admin |
| POST | `/api/leads` | No | Submit new lead (public form) |
| GET | `/api/leads` | Yes | List all leads (with `?search=&status=`) |
| PATCH | `/api/leads/:id/status` | Yes | Toggle lead status |

**Register lock:** First admin seeds the DB. Subsequent `/api/auth/register` calls rejected unless `ALLOW_REGISTRATION=true` env var is set (for dev). On deploy, you register once, then disable.

---

## 3. Auth Approach

1. **Registration:** Admin creates account → password hashed with `bcrypt` (12 rounds) → saved to MongoDB
2. **Login:** Credentials verified against DB → JWT created with `{ id, email }` → token set as **httpOnly, secure, sameSite=Lax** cookie
3. **Middleware:** `authMiddleware` reads cookie → `jwt.verify()` → attaches `req.admin` → next()
4. **Logout:** Clear the cookie by setting `maxAge: 0`
5. **Storage:** httpOnly cookie only — nothing in localStorage. Works from fresh browser.

---

## 4. File Structure

```
LeadDesk/
├── shared/
│   └── validation.js          # Zod schemas (Lead)
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js          # Mongoose connection
│   │   ├── models/
│   │   │   ├── Lead.js
│   │   │   └── Admin.js
│   │   ├── middleware/
│   │   │   └── auth.js        # JWT verification
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── leads.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── leadController.js
│   │   └── server.js          # Express app entry
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LeadForm.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── LeadTable.jsx
│   │   ├── lib/
│   │   │   └── api.js         # Axios/fetch wrapper
│   │   ├── App.jsx            # React Router setup
│   │   ├── index.css          # Tailwind entry
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── .gitignore
├── README.md
└── plan.md                    # This file
```

---

## 5. Key Dependencies

### Backend
- `express` — server
- `mongoose` — MongoDB ODM
- `bcrypt` — password hashing
- `jsonwebtoken` — JWT creation/verification
- `cookie-parser` — read cookies
- `cors` — cross-origin (for dev)
- `dotenv` — env vars
- `zod` — validation
- `express-validator` (or zod directly on server)

### Frontend
- `react` + `react-dom`
- `react-router-dom` — routing
- `react-hook-form` + `@hookform/resolvers` — form handling with Zod
- `zod` — validation (shared schema)
- `axios` — API calls
- `tailwindcss` + `@tailwindcss/forms` — styling

---

## 6. Assumptions

1. **MongoDB:** MongoDB Atlas free tier (M0) for hosted DB. Local dev uses `mongodb://localhost:27017/leaddesk`
2. **Deployment target:** Render.com free tier (supports both Node backend + static React frontend)
3. **Single server:** Express serves the React build in production (`express.static`). In dev, Vite runs on :5173 and proxies to Express on :5000
4. **Admin registration:** Only one admin initially. Register endpoint is available but not exposed in the UI after first admin is created (env flag). Admin can be seeded via a script
5. **Search:** Case-insensitive regex search across `name`, `email`, `message` fields
6. **Budget range:** Fixed enum options, not free text
7. **No file uploads:** Text-only lead form
8. **Status toggle:** Cycling button (New → Contacted → Closed → New)
9. **Tailwind CSS v4** (latest) with Vite plugin
10. **JWT expiry:** 7 days
11. **No rate limiting** on public form (scope constraint), but can add later
12. **Same Zod schema** used client-side (React Hook Form) and server-side (Express route) — single source of truth in `/shared`

---

## 7. User Flow

```
Public user → Landing page → Fills form → POST /api/leads → Success message
                                                          ↓
Admin → /admin → Login form → POST /api/auth/login → Dashboard
                                                      ↓
                                          GET /api/leads?search=&status=
                                                      ↓
                                          PATCH /api/leads/:id/status
```
