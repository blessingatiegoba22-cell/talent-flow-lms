<div align="center">

# TalentFlow LMS — Backend API

**A Learning Management System API built with FastAPI**

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=flat&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT%20%2B%20HTTPOnly%20Cookies-orange?style=flat)

</div>

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Authentication Guide](#authentication-guide)
- [API Endpoints](#api-endpoints)
- [Example Requests](#example-requests)
- [Error Handling](#error-handling)
- [Notes for Developers](#notes-for-developers)

---

## Project Overview

TalentFlow LMS is a backend REST API that powers a Learning Management System. It handles everything from user registration and course enrollment to mentor assignments, task grading, and admin reporting.

### Key Features

- **User Management** — Register, update, and manage learner accounts
- **Role-Based Access** — Separate flows for Students, Mentors, and Admins
- **Course Catalog** — Browse, enroll in, and track progress through courses
- **Mentor System** — Admins assign mentors to learners per course; mentors create and grade tasks
- **Team Grouping** — Admins organize learners into teams
- **Secure Auth** — JWT tokens stored in HTTPOnly cookies (not localStorage)
- **Admin Dashboard** — Full platform reporting and staff management

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [FastAPI](https://fastapi.tiangolo.com/) |
| Language | Python 3.10+ |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Migrations | Alembic |
| Auth | JWT (`python-jose`) + HTTPOnly Cookies |
| Password Hashing | bcrypt |
| Validation | Pydantic v2 |
| Server | Uvicorn |
| Containerization | Docker + Docker Compose |

---

## Project Structure

```
app/
├── auth/
│   ├── jwt.py           # Token creation and verification
│   └── security.py      # Admin auth helpers
├── core/
│   └── enums.py         # Shared enums (AdminRole, etc.)
├── middlewares/
│   └── auth.py          # JWT auth middleware (reads cookie or Bearer header)
├── models/              # SQLAlchemy database models
│   ├── user.py
│   ├── admin.py
│   ├── mentor.py
│   ├── course.py
│   ├── task.py
│   └── team.py
├── routes/              # API route handlers
│   ├── auth.py          # /auth/login, /auth/logout
│   ├── user.py          # /users/*
│   ├── admin.py         # /admin/*
│   ├── mentor.py        # /mentors/*
│   ├── mentor_auth.py   # /mentor/auth/*
│   ├── course.py        # /courses/*
│   └── team.py          # /teams/*
├── schemas/             # Pydantic request/response schemas
├── database.py          # DB engine and session setup
└── main.py              # App entry point, middleware, router registration
```

---

## Setup Instructions

### Prerequisites

- Python 3.10+
- PostgreSQL (running locally or via Docker)
- Git

---

### Option A — Run with Docker (Recommended)

This is the fastest way to get started. Docker handles the database and app together.

```bash
# 1. Clone the repository
git clone https://github.com/your-org/talentflow-backend.git
cd talentflow-backend

# 2. Copy the environment file
cp .env.example .env
# Edit .env and set your SECRET_KEY and other values

# 3. Start everything
docker compose up --build
```

The API will be available at `http://localhost:8000`.

---

### Option B — Run Locally (Manual)

```bash
# 1. Clone the repository
git clone https://github.com/your-org/talentflow-backend.git
cd talentflow-backend

# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # macOS/Linux
venv\Scripts\activate           # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Copy and configure environment variables
cp .env.example .env
# Open .env and fill in your database credentials and SECRET_KEY

# 5. Run database migrations
alembic upgrade head

# 6. (Optional) Create your first admin account
python scripts/create_admin.py

# 7. Start the development server
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.  
Interactive API docs: `http://localhost:8000/docs`

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values below.

```env
# ── Database ──────────────────────────────
DB_USER=postgres
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=talent_flow_db

# ── JWT ───────────────────────────────────
SECRET_KEY=your-long-random-secret-key-here   # Change this! Use: openssl rand -hex 32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# ── CORS ──────────────────────────────────
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# ── Environment ───────────────────────────
ENVIRONMENT=development    # Set to "production" in prod (enables Secure cookies)

# ── Admin Seed ────────────────────────────
FIRST_ADMIN_EMAIL=admin@talentflow.com
FIRST_ADMIN_PASSWORD=YourAdminPassword123!
```

> ⚠️ **Never commit your `.env` file.** It is already in `.gitignore`.

To generate a strong `SECRET_KEY`, run:
```bash
openssl rand -hex 32
```

---

## Authentication Guide

TalentFlow uses **JWT tokens stored in HTTPOnly cookies**. This is more secure than storing tokens in `localStorage` because JavaScript cannot read HTTPOnly cookies, which prevents XSS attacks from stealing tokens.

### How It Works

```
┌─────────────┐         POST /auth/login          ┌─────────────┐
│   Frontend  │  ──── { email, password } ──────► │   Backend   │
│             │                                    │             │
│             │  ◄── Set-Cookie: access_token ─── │  Verifies   │
│  (no token  │       HttpOnly; SameSite=Lax       │  password,  │
│  stored in  │                                    │  signs JWT, │
│    JS!)     │  ── GET /users/me (auto cookie) ►  │  sets cookie│
│             │  ◄──────── user profile ─────────  │             │
│             │                                    │             │
│             │  ──── POST /auth/logout ─────────► │  Clears     │
│             │  ◄── Cookie cleared ────────────── │  cookie     │
└─────────────┘                                    └─────────────┘
```

### Login

Send your credentials. The server sets the JWT inside a cookie. You do **not** receive the token in the response body.

```
POST /auth/login
Body: { "email": "user@example.com", "password": "YourPassword1!" }

Response 200:
{
  "message": "Login successful",
  "user_id": 42,
  "email": "user@example.com"
}

Browser cookie set automatically:
  Set-Cookie: access_token=<JWT>; HttpOnly; SameSite=Lax; Path=/
```

### Making Authenticated Requests

The browser sends the cookie automatically on every request. The **only** thing your frontend needs to do is include `credentials: "include"` in every API call.

```javascript
// The browser sends the cookie — you don't touch the token
fetch("https://api.talentflow.com/users/me", {
  credentials: "include"   // ← this one line is all you need
})
```

### Logout

Call the logout endpoint. The server clears the cookie.

```
POST /auth/logout

Response 200:
{ "message": "Logged out successfully" }
```

### Frontend Rules

| ✅ Do | ❌ Don't |
|---|---|
| Always include `credentials: "include"` | Store the token in `localStorage` |
| Redirect to `/login` on `401` responses | Read or modify the cookie from JavaScript |
| Use `axios.defaults.withCredentials = true` globally | Build an `Authorization` header manually |

---

## API Endpoints

> **Auth types:**
> - 🔓 Public — no authentication required
> - 🍪 Cookie — requires login via `/auth/login` (student, mentor)
> - 🔑 Admin — requires login via `/admin/login` (Bearer token in header)

---

### Auth

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/login` | 🔓 | Log in as a student or mentor. Sets HTTPOnly cookie. |
| `POST` | `/auth/logout` | 🔓 | Log out. Clears the auth cookie. |

---

### Users

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/users/` | 🔓 | Register a new user account |
| `GET` | `/users/` | 🍪 | List all users (paginated) |
| `GET` | `/users/me` | 🍪 | Get your own profile |
| `GET` | `/users/{user_id}` | 🍪 | Get a user by ID |
| `PATCH` | `/users/{user_id}` | 🍪 Owner only | Update your own profile |
| `DELETE` | `/users/{user_id}` | 🍪 Owner only | Delete your own account |

---

### Courses

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/courses/` | 🔓 | Browse all published courses |
| `GET` | `/courses/{course_id}` | 🔓 | Get a specific course |
| `POST` | `/courses/` | 🍪 Admin/Mentor | Create a new course |
| `GET` | `/courses/me/enrollments` | 🍪 | Get your enrolled courses |
| `POST` | `/courses/{course_id}/enroll` | 🍪 | Enroll in a course |
| `DELETE` | `/courses/{course_id}/enroll` | 🍪 | Unenroll from a course |
| `GET` | `/courses/{course_id}/students` | 🍪 | Get all students in a course |
| `PUT` | `/courses/{course_id}/progress` | 🍪 | Update your course progress |

---

### Mentor Auth

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/mentor/auth/login` | 🔓 | Mentor login. Sets HTTPOnly cookie. |

---

### Mentors

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/mentors/` | 🔓 | List all active mentors |
| `GET` | `/mentors/{mentor_id}` | 🔓 | Get a specific mentor |
| `GET` | `/mentors/me/mentees` | 🍪 Mentor | Get your assigned mentees |
| `GET` | `/mentors/me/mentor` | 🍪 | Get your assigned mentor for a course |
| `POST` | `/mentors/tasks` | 🍪 Mentor | Create a task |
| `GET` | `/mentors/tasks` | 🍪 Mentor | List your tasks |
| `GET` | `/mentors/tasks/{task_id}` | 🍪 | Get a specific task |
| `GET` | `/mentors/tasks/{task_id}/submissions` | 🍪 Mentor | Get all submissions for a task |
| `POST` | `/mentors/tasks/submissions/{id}/grade` | 🍪 Mentor | Grade a submission |

---

### Teams

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/teams/my-team` | 🍪 | Get the teams you belong to |
| `POST` | `/teams/admin` | 🔑 | Create a new team |
| `GET` | `/teams/admin` | 🔑 | List all teams |
| `GET` | `/teams/admin/{team_id}` | 🔑 | Get a team with full member list |
| `PATCH` | `/teams/admin/{team_id}` | 🔑 | Update team details |
| `DELETE` | `/teams/admin/{team_id}` | 🔑 | Soft-delete a team |
| `POST` | `/teams/admin/{team_id}/members` | 🔑 | Add members to a team |
| `DELETE` | `/teams/admin/{team_id}/members/{user_id}` | 🔑 | Remove a member from a team |

---

### Admin

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/admin/login` | 🔓 | Admin login. Returns Bearer token. |
| `GET` | `/admin/me` | 🔑 | Get your admin profile |
| `POST` | `/admin/staff` | 🔑 | Create a new staff (admin/instructor) account |
| `GET` | `/admin/users` | 🔑 | List all staff accounts |
| `GET` | `/admin/users/{user_id}` | 🔑 | Get a staff account by ID |
| `PATCH` | `/admin/users/{user_id}` | 🔑 | Update a staff account |
| `DELETE` | `/admin/users/{user_id}` | 🔑 | Deactivate a staff account |
| `GET` | `/admin/regular-users` | 🔑 | List all student accounts |
| `DELETE` | `/admin/regular-users/{user_id}` | 🔑 | Delete a student account |
| `POST` | `/admin/programs` | 🔑 | Create a learning program |
| `GET` | `/admin/programs` | 🔑 | List all programs |
| `GET` | `/admin/programs/{program_id}` | 🔑 | Get a program by ID |
| `PATCH` | `/admin/programs/{program_id}` | 🔑 | Update a program |
| `DELETE` | `/admin/programs/{program_id}` | 🔑 | Soft-delete a program |
| `POST` | `/admin/courses` | 🔑 | Create a course |
| `GET` | `/admin/courses` | 🔑 | List all courses (including drafts) |
| `GET` | `/admin/courses/{course_id}` | 🔑 | Get a course by ID |
| `PATCH` | `/admin/courses/{course_id}` | 🔑 | Update a course |
| `DELETE` | `/admin/courses/{course_id}` | 🔑 | Soft-delete a course |
| `POST` | `/admin/mentors` | 🔑 | Promote a user to mentor (by email) |
| `GET` | `/admin/mentors` | 🔑 | List all mentors |
| `GET` | `/admin/mentors/assignments` | 🔑 | List all mentor assignments |
| `GET` | `/admin/mentors/{mentor_id}` | 🔑 | Get a mentor by ID |
| `POST` | `/admin/mentors/promote/{user_id}` | 🔑 | Promote a user to mentor (by ID) |
| `PATCH` | `/admin/mentors/{mentor_id}/activate` | 🔑 | Activate a mentor |
| `PATCH` | `/admin/mentors/{mentor_id}/deactivate` | 🔑 | Deactivate a mentor |
| `POST` | `/admin/mentors/assign` | 🔑 | Assign a mentor to a learner for a course |
| `DELETE` | `/admin/mentors/assignments/{id}` | 🔑 | Remove a mentor assignment |
| `GET` | `/admin/reports` | 🔑 | Get full platform statistics |

---

### Health

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/` | 🔓 | Check API is running |
| `GET` | `/health` | 🔓 | Health check endpoint |

---

## Example Requests

All examples use `fetch`. Replace `http://localhost:8000` with your production URL.

---

### Register a New User

```javascript
const response = await fetch("http://localhost:8000/users/", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "08012345678",
    password: "Secure123!",
    confirm_password: "Secure123!",
    gender: "female",
    location: "Lagos"
  })
});

const user = await response.json();
// { "id": 1, "name": "Jane Doe", "email": "jane@example.com", ... }
```

---

### Login

```javascript
const response = await fetch("http://localhost:8000/auth/login", {
  method: "POST",
  credentials: "include",                          // required for cookies
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "jane@example.com",
    password: "Secure123!"
  })
});

const data = await response.json();
// { "message": "Login successful", "user_id": 1, "email": "jane@example.com" }
// The JWT is now in an HttpOnly cookie — you never see it directly.
```

---

### Call a Protected Endpoint

```javascript
// credentials: "include" tells the browser to send the cookie
const response = await fetch("http://localhost:8000/users/me", {
  credentials: "include"
});

if (response.status === 401) {
  // Token expired or missing — redirect to login
  window.location.href = "/login";
  return;
}

const profile = await response.json();
// { "id": 1, "name": "Jane Doe", "email": "jane@example.com", ... }
```

---

### Logout

```javascript
await fetch("http://localhost:8000/auth/logout", {
  method: "POST",
  credentials: "include"
});

// Cookie is now cleared. Redirect the user.
window.location.href = "/login";
```

---

### Using Axios

If you prefer Axios, set `withCredentials` globally once and all requests will include the cookie automatically.

```javascript
import axios from "axios";

// Set this once in your app setup file (e.g. api.js or main.js)
axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;   // equivalent of credentials: "include"

// Now every request sends the cookie automatically
const profile  = await axios.get("/users/me");
const courses  = await axios.get("/courses/");
await axios.post("/auth/logout");
```

---

### Admin Login (Bearer Token)

Admin routes use a Bearer token in the `Authorization` header instead of a cookie.

```javascript
// 1. Log in to get the token
const res = await fetch("http://localhost:8000/admin/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "admin@talentflow.com", password: "AdminPass1!" })
});

const { access_token } = await res.json();

// 2. Use it in the Authorization header for all admin requests
const report = await fetch("http://localhost:8000/admin/reports", {
  headers: { "Authorization": `Bearer ${access_token}` }
});
```

---

## Error Handling

All errors follow a consistent JSON format:

```json
{
  "detail": "A human-readable error message"
}
```

Auth errors include a timestamp:

```json
{
  "detail": {
    "message": "Invalid or expired token. Please log in again.",
    "timestamp": "2026-04-13T10:30:00.000000"
  }
}
```

### Common Status Codes

| Status Code | Meaning | Common Cause |
|---|---|---|
| `200 OK` | Request succeeded | — |
| `201 Created` | Resource created successfully | Register, create course, etc. |
| `204 No Content` | Deleted successfully | — |
| `400 Bad Request` | Invalid request data | Failed Pydantic validation |
| `401 Unauthorized` | Not logged in or token expired | Missing or invalid cookie/token |
| `403 Forbidden` | Logged in but not allowed | Wrong role, or updating another user's data |
| `404 Not Found` | Resource does not exist | Wrong ID, deleted record |
| `409 Conflict` | Duplicate entry | Email already registered, already a mentor |
| `422 Unprocessable Entity` | Validation error | Missing required field, wrong data type |
| `500 Internal Server Error` | Unexpected server error | Database issue, misconfiguration |

### Common Scenarios

**`401` on every request after login**
> Your frontend is missing `credentials: "include"`. The cookie is not being sent.

**`401` after some time**
> The token has expired. Redirect the user to log in again. Token lifetime is set by `ACCESS_TOKEN_EXPIRE_MINUTES` in `.env`.

**`403` when updating a user**
> You can only update your own account. Admins have a separate endpoint (`/admin/users/{id}`).

**`409` on register**
> That email or phone number is already in use.

---

## Notes for Developers

### Security Decisions

**Why HTTPOnly cookies instead of localStorage?**

Tokens in `localStorage` are accessible by any JavaScript on the page. If your app has an XSS vulnerability, an attacker can steal the token and impersonate the user permanently. HTTPOnly cookies cannot be read by JavaScript at all — the browser sends them silently on every request, but no script can access them.

**Why `SameSite=Lax` on cookies?**

`SameSite=Lax` prevents the cookie from being sent on cross-site form submissions (CSRF protection), while still allowing it to be sent on normal navigation and API calls from your frontend domain. It's a solid default that requires no extra CSRF token setup.

**Why is `Secure=True` only in production?**

`Secure` cookies are only sent over HTTPS. In local development there is no HTTPS, so the flag is disabled when `ENVIRONMENT=development`. Set `ENVIRONMENT=production` in your production environment to enable it.

**Why is `ALLOWED_ORIGINS` required in production?**

Setting `allow_origins=["*"]` with `allow_credentials=True` is rejected by all modern browsers. You must list your exact frontend URLs in `ALLOWED_ORIGINS`. Example:

```env
ALLOWED_ORIGINS=https://app.talentflow.com,https://admin.talentflow.com
```

---

### Two Auth Flows

The API has two parallel authentication flows:

| | Students & Mentors | Admins |
|---|---|---|
| Login endpoint | `POST /auth/login` or `POST /mentor/auth/login` | `POST /admin/login` |
| Token delivery | HTTPOnly cookie | JSON response body |
| How to send token | Browser sends cookie automatically | `Authorization: Bearer <token>` header |
| Why different? | Browser-based web app | Typically used from admin dashboards / tools that manage headers |

---

### Password Requirements

Passwords on the registration endpoint must meet all of the following:

- Minimum 6 characters, maximum 24 characters
- At least one **uppercase** letter
- At least one **lowercase** letter
- At least one **digit**
- At least one **special character** (e.g. `!@#$%`)

---

### Soft Deletes vs Hard Deletes

Most admin-facing deletions are **soft deletes** — the record is kept in the database but marked with a `deleted_at` timestamp. This preserves audit history and allows recovery.

Hard deletes (permanent removal) are used for:
- Student accounts (`DELETE /admin/regular-users/{id}`)
- Student self-deletion (`DELETE /users/{id}`)

---

### Interactive API Docs

FastAPI generates interactive documentation automatically. Once the server is running, visit:

- **Swagger UI** → `http://localhost:8000/docs`
- **ReDoc** → `http://localhost:8000/redoc`

These let you explore and test every endpoint directly in the browser without any external tool like Postman.

---

<div align="center">
Built with ❤️ by the TalentFlow Engineering Team
</div>
