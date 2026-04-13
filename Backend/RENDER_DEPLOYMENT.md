# TalentFlow LMS — Render Deployment Guide

A complete, beginner-friendly guide to deploying this FastAPI backend to
[Render](https://render.com) with a managed PostgreSQL database.

---

## Table of Contents

1. [What Was Fixed for Production](#1-what-was-fixed-for-production)
2. [How the Production Setup Works](#2-how-the-production-setup-works)
3. [Pre-Deployment Checklist](#3-pre-deployment-checklist)
4. [Step-by-Step Deployment](#4-step-by-step-deployment)
5. [Required Environment Variables](#5-required-environment-variables)
6. [After Deployment](#6-after-deployment)
7. [Debugging Common Errors](#7-debugging-common-errors)
8. [Local Docker Testing](#8-local-docker-testing)
9. [Useful Commands](#9-useful-commands)

---

## 1. What Was Fixed for Production

The following issues were identified and fixed before this guide was written.
You do not need to do anything — these are already in the codebase.

| File | Issue | Fix Applied |
|------|-------|-------------|
| `app/database.py` | Used individual `DB_*` variables only — Render provides a single `DATABASE_URL` | Now reads `DATABASE_URL` first, falls back to individual vars for local dev |
| `app/database.py` | Render provides `postgres://` URLs — SQLAlchemy requires `postgresql://` | Automatic string replacement on startup |
| `app/database.py` | No connection pooling or reconnect logic | Added `pool_pre_ping=True`, `pool_size=5`, `max_overflow=10` |
| `app/database.py` | `print()` statements leaked database password to logs | Removed; replaced with safe `logger.info()` |
| `app/main.py` | `allow_origins=["*"]` with `allow_credentials=True` rejected by browsers | Reads from `ALLOWED_ORIGINS` env var |
| `app/main.py` | Swagger `/docs` exposed in production | Disabled when `ENVIRONMENT=production` |
| `alembic/env.py` | Did not support `DATABASE_URL` env var from Render | Updated to read `DATABASE_URL` with `postgres://` fix |
| `docker-compose.yml` | API container started before DB was healthy | Added `condition: service_healthy` on `depends_on` |
| `Dockerfile` | Single-stage build, used `uvicorn` directly | Multi-stage build; uses `gunicorn` + `uvicorn` workers |
| `app/__init__.py` et al. | Missing `__init__.py` in several packages | Created in `app/`, `app/auth/`, `app/core/`, `app/middlewares/` |

---

## 2. How the Production Setup Works

```
                         Render Platform
┌──────────────────────────────────────────────────────────┐
│                                                          │
│   GitHub Repo          Web Service          PostgreSQL   │
│   ┌──────────┐  push   ┌──────────────┐    ┌─────────┐  │
│   │  main    │────────►│  FastAPI +   │    │Render   │  │
│   │  branch  │         │  Gunicorn    │───►│Postgres │  │
│   └──────────┘         │              │    │         │  │
│                        │ PORT=$PORT   │    └─────────┘  │
│                        │ (auto-set)   │         ▲        │
│                        └──────────────┘         │        │
│                               │           DATABASE_URL   │
│                               └─────────────────┘        │
└──────────────────────────────────────────────────────────┘
              │
              ▼ HTTPS
         Your Frontend
```

**Key facts about Render:**
- Render sets the `PORT` environment variable automatically. Your app **must** bind to `$PORT` — not a hardcoded port.
- Render PostgreSQL provides a `DATABASE_URL` environment variable automatically when you link the database.
- Every push to `main` triggers an automatic redeploy.
- Free tier web services **spin down after 15 minutes of inactivity**. The first request after sleep takes ~30 seconds. Upgrade to Starter ($7/mo) to avoid this.

---

## 3. Pre-Deployment Checklist

Before pushing, confirm each item:

- [ ] `.env` is in `.gitignore` — never commit real credentials
- [ ] `requirements.txt` is up to date (`pip freeze > requirements.txt` if you added packages)
- [ ] `alembic/versions/` has your latest migration files committed
- [ ] `render.yaml` has your real frontend URL in `ALLOWED_ORIGINS`
- [ ] All code is committed and pushed to `main`

---

## 4. Step-by-Step Deployment

### Step 1 — Push Your Code to GitHub

```bash
# If this is a new repo
git init
git add .
git commit -m "initial commit — ready for Render deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/talentflow-backend.git
git push -u origin main

# If the repo already exists
git add .
git commit -m "fix: production-ready deployment config"
git push
```

---

### Step 2 — Create a Render Account

1. Go to [render.com](https://render.com) and sign up (free)
2. Connect your GitHub account when prompted

---

### Step 3 — Create the PostgreSQL Database First

> **Important:** Create the database before the web service so Render can link them automatically.

1. In the Render dashboard, click **"New +"** → **"PostgreSQL"**
2. Fill in:
   - **Name:** `talentflow-db`
   - **Database:** `talent_flow_db`
   - **User:** `talentflow`
   - **Region:** `Oregon (US West)` ← pick one and use the same for the web service
   - **Plan:** `Free` (or `Starter` for production)
3. Click **"Create Database"**
4. Wait for status to show **"Available"** (takes ~1 minute)
5. Copy the **"Internal Database URL"** — you'll need it if not using `render.yaml`

---

### Step 4 — Create the Web Service

**Option A — Using `render.yaml` (Recommended, Automatic)**

If your repo contains `render.yaml`, Render detects it automatically:

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repo
3. Render reads `render.yaml` and pre-fills all settings
4. Review the settings, then click **"Apply"**

**Option B — Manual Setup**

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repo
3. Fill in the settings exactly as shown:

| Field | Value |
|-------|-------|
| **Name** | `talentflow-api` |
| **Region** | Same as your database (e.g. Oregon) |
| **Branch** | `main` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt && alembic upgrade head` |
| **Start Command** | `gunicorn app.main:app -w 2 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT --timeout 120 --log-level info` |
| **Plan** | `Free` |

---

### Step 5 — Add Environment Variables

In your web service → **"Environment"** tab, add each variable:

> See [Section 5](#5-required-environment-variables) for the full list with descriptions.

**Critical variables that must be set manually:**

| Key | How to set |
|-----|------------|
| `DATABASE_URL` | Click **"Add from Database"** → select `talentflow-db` → picks up automatically |
| `SECRET_KEY` | Click **"Generate"** — Render creates a secure random value |
| `FIRST_ADMIN_PASSWORD` | Type a strong password — this creates your first admin account |
| `ALLOWED_ORIGINS` | Your frontend URL, e.g. `https://talentflow-frontend.onrender.com` |
| `ENVIRONMENT` | `production` |

---

### Step 6 — Deploy

1. Click **"Create Web Service"** (or **"Deploy"** if updating)
2. Watch the build logs in real time
3. A successful build looks like:

```
==> Installing dependencies
  Successfully installed fastapi-0.129.0 ...

==> Running build command
  📦 Step 1/3 — Installing Python dependencies...
  🗄️  Step 2/3 — Running database migrations...
  INFO  [alembic.runtime.migration] Running upgrade -> abc123, initial schema
  👤 Step 3/3 — Seeding first admin account...
  ✅ Admin created successfully!
  ✅ Build complete.

==> Starting service
  [INFO] Starting gunicorn 22.0.0
  [INFO] Listening at: http://0.0.0.0:10000
  [INFO] Worker booted (pid: 123)
```

4. Your API is live at: `https://talentflow-api.onrender.com`
5. Test it: `https://talentflow-api.onrender.com/health` → `{"status": "healthy"}`

---

## 5. Required Environment Variables

Set these in Render → your service → **"Environment"** tab.

### Required — Must Set

| Variable | Example Value | Description |
|----------|---------------|-------------|
| `DATABASE_URL` | *(from Render PostgreSQL)* | Set via "Add from Database" — auto-injected |
| `SECRET_KEY` | *(generated by Render)* | JWT signing key — use Render's "Generate" button |
| `FIRST_ADMIN_EMAIL` | `admin@yourdomain.com` | Email for the first admin account |
| `FIRST_ADMIN_PASSWORD` | `YourStr0ng!Pass` | Password for the first admin account |
| `ALLOWED_ORIGINS` | `https://your-frontend.onrender.com` | Frontend URL for CORS — no trailing slash |
| `ENVIRONMENT` | `production` | Enables Secure cookies, disables /docs |

### Optional — Have Sensible Defaults

| Variable | Default | Description |
|----------|---------|-------------|
| `ALGORITHM` | `HS256` | JWT signing algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `60` | How long login sessions last |

### Never Set on Render

| Variable | Reason |
|----------|--------|
| `PORT` | Render injects this automatically. Setting it manually causes binding errors. |
| `DB_HOST` / `DB_USER` / etc. | Only needed for local dev. Use `DATABASE_URL` on Render instead. |

---

## 6. After Deployment

### Verify Everything Works

```bash
# 1. Health check
curl https://talentflow-api.onrender.com/health
# Expected: {"status":"healthy"}

# 2. Root endpoint
curl https://talentflow-api.onrender.com/
# Expected: {"message":"TalentFlow API is running 🚀","environment":"production"}

# 3. Login as admin
curl -X POST https://talentflow-api.onrender.com/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yourdomain.com","password":"YourStr0ng!Pass"}'
# Expected: {"access_token":"...","token_type":"bearer","admin":{...}}

# 4. Test a protected route
curl https://talentflow-api.onrender.com/admin/reports \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
# Expected: report JSON
```

### Set Up Custom Domain (Optional)

1. Render dashboard → your service → **"Settings"** → **"Custom Domains"**
2. Add your domain (e.g. `api.talentflow.com`)
3. Add the CNAME record to your DNS provider
4. Render issues a free TLS certificate automatically

### Update `ALLOWED_ORIGINS` After Frontend Deploy

Once your frontend is deployed, update the env var:

1. Render dashboard → web service → **"Environment"**
2. Update `ALLOWED_ORIGINS` to your real frontend URL
3. Click **"Save Changes"** — Render redeploys automatically

---

## 7. Debugging Common Errors

### ❌ `bind: address already in use` or `Failed to bind`

**Cause:** App is hardcoded to a specific port instead of using `$PORT`.

**Fix:** Your start command must use `$PORT`:
```
gunicorn app.main:app -w 2 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
```
Never hardcode `--bind 0.0.0.0:8000`.

---

### ❌ `ModuleNotFoundError: No module named 'app'`

**Cause:** Python cannot find the `app` package. Usually means the working directory is wrong or `__init__.py` files are missing.

**Fix 1:** Verify the start command runs from the project root (Render's default).

**Fix 2:** Confirm these files exist and are committed:
```
app/__init__.py
app/auth/__init__.py
app/core/__init__.py
app/middlewares/__init__.py
```

**Fix 3:** Check that `requirements.txt` is in the repo root, not inside `app/`.

---

### ❌ `sqlalchemy.exc.OperationalError: could not connect to server`

**Cause:** Database connection is failing.

**Step 1:** Check `DATABASE_URL` is set in Environment Variables.

**Step 2:** Make sure your database and web service are in the **same region**.

**Step 3:** Use the **Internal** connection string (not the External one) — it's faster and free:
- Internal URL starts with: `postgresql://talentflow:...@dpg-...internal:5432/...`
- External URL starts with: `postgresql://talentflow:...@oregon-postgres.render.com:5432/...`

**Step 4:** In Render → PostgreSQL → **"Connect"** tab — copy the Internal URL.

---

### ❌ `FATAL: password authentication failed for user`

**Cause:** `DATABASE_URL` is incorrect or the database credentials changed.

**Fix:** In Render → PostgreSQL service → **"Connect"** tab → copy the fresh Internal Database URL → paste it into your web service's `DATABASE_URL` environment variable.

---

### ❌ `alembic.util.exc.CommandError: Can't locate revision identified by ...`

**Cause:** Migration files are missing from the repo, or migrations were run out of order.

**Fix — Option A (Preferred):** Make sure `alembic/versions/*.py` files are committed to git:
```bash
git add alembic/versions/
git commit -m "add migration files"
git push
```

**Fix — Option B (Fresh DB only):** Reset the migration history in Render's shell:
```bash
# Render dashboard → Shell tab
alembic stamp head   # marks current DB state as up-to-date without running migrations
```

---

### ❌ Frontend gets `CORS error` / `Access-Control-Allow-Origin` missing

**Cause:** `ALLOWED_ORIGINS` doesn't match the exact frontend URL.

**Common mistakes:**
```
# Wrong — trailing slash
ALLOWED_ORIGINS=https://myapp.onrender.com/

# Wrong — http instead of https
ALLOWED_ORIGINS=http://myapp.onrender.com

# Wrong — missing the actual subdomain
ALLOWED_ORIGINS=https://onrender.com
```

**Correct:**
```
ALLOWED_ORIGINS=https://myapp.onrender.com
```

If you have multiple frontends (e.g. dev + staging + production):
```
ALLOWED_ORIGINS=https://app.talentflow.com,https://staging.talentflow.com
```

---

### ❌ Cookies not being set / auth not working

**Cause 1:** Frontend is not sending `credentials: "include"`.
```javascript
// Every fetch call needs this
fetch("/api/users/me", { credentials: "include" })

// Or for axios, set globally
axios.defaults.withCredentials = true
```

**Cause 2:** `ENVIRONMENT` is not set to `production`. Without it, `Secure=True` is not set on cookies, which browsers require on HTTPS.

**Cause 3:** Frontend and backend are on different top-level domains (e.g. `myapp.com` vs `api.otherone.com`). Cross-site cookies require `SameSite=None; Secure`. Contact the team to discuss architecture.

---

### ❌ Service deploys but returns 502 Bad Gateway

**Cause:** App crashed on startup before it could accept connections.

**Fix:** Check Render logs immediately after deploy:
1. Dashboard → your service → **"Logs"** tab
2. Look for Python tracebacks
3. Most common causes: missing env var, database migration failure, import error

---

### ❌ Free tier "spinning down" — first request is slow

**Cause:** Free tier web services sleep after 15 minutes of no traffic. The cold start takes ~30 seconds.

**Fix:** Upgrade to the **Starter plan** ($7/month) — services stay running 24/7. For a production app with real users, this is essential.

---

## 8. Local Docker Testing

Test your production Docker setup locally before pushing to Render:

```bash
# 1. Copy and configure env file
cp .env.example .env
# Edit .env — set DB_PASSWORD, SECRET_KEY, etc.

# 2. Build and start everything
docker compose up --build

# 3. API is available at http://localhost:8000
# 4. Docs at http://localhost:8000/docs (development mode)

# 5. Run migrations manually if needed
docker compose exec talent_flow.api alembic upgrade head

# 6. Create admin account
docker compose exec talent_flow.api python scripts/create_admin.py

# 7. View logs
docker compose logs -f talent_flow.api

# 8. Stop everything
docker compose down

# 9. Stop and delete database volume (full reset)
docker compose down -v
```

---

## 9. Useful Commands

### Render Shell (Dashboard → Shell tab)

```bash
# Check which environment variables are set
env | grep -E "DATABASE|SECRET|ENVIRONMENT|ALLOWED"

# Run migrations manually
alembic upgrade head

# Roll back last migration
alembic downgrade -1

# Check migration history
alembic history

# Create admin account
python scripts/create_admin.py

# Open Python shell with app context
python -c "from app.database import SessionLocal; db = SessionLocal(); print('DB connected')"
```

### Generating a Secure SECRET_KEY

```bash
# Run this locally and copy the output into Render
openssl rand -hex 32

# Example output:
# a3f8d2c1e4b5a6f7d8e9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e6d7c8b9a0
```

### Checking Live Logs

```bash
# Render CLI (install: npm i -g @render/cli)
render logs --service talentflow-api --tail

# Or just use the Logs tab in the Render dashboard
```
