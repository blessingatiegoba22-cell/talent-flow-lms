# TalentFlow Backend — Auth Guide & Fix Summary

---

## Part 1: How Authentication Works (For Frontend Devs)

### The Big Picture

Your frontend **never stores the JWT token**. Not in localStorage, not in a variable.
The server sets it in a browser **HTTPOnly cookie** — which the browser sends automatically
on every request. You just call the API and the browser handles the rest.

---

### 1. Login

**You send:** email + password  
**Server does:** verifies credentials, creates a JWT, and sets it in a cookie  
**You receive:** a JSON body with `message`, `user_id`, `email` — NOT the token

```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "MyPass123!"
}

→ 200 OK
{
  "message": "Login successful",
  "user_id": 42,
  "email": "john@example.com"
}

→ Browser now holds: Set-Cookie: access_token=<JWT>; HttpOnly; SameSite=Lax
```

---

### 2. Making Authenticated Requests

**You do nothing special** — the browser sends the cookie automatically.
The only thing you MUST do is include `credentials: "include"` in your fetch calls.

```javascript
// GET your profile
const response = await fetch("https://api.talentflow.com/users/me", {
  credentials: "include",   // ← this is the only cookie-related line you need
});
const user = await response.json();
```

---

### 3. Logout

**You send:** a POST request (no body needed)  
**Server does:** clears the cookie  
**You do:** redirect to login page

```javascript
await fetch("https://api.talentflow.com/auth/logout", {
  method: "POST",
  credentials: "include",
});
// Cookie is now gone. Redirect user to /login
```

---

### Frontend Quick-Reference

```javascript
const API = "https://api.talentflow.com";

// ─── Login ───────────────────────────────────────────────────────────────────
async function login(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    credentials: "include",                        // always include this
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Login failed");
  }
  return res.json();  // { message, user_id, email } — no token exposed
}

// ─── Authenticated request ────────────────────────────────────────────────────
async function getMyProfile() {
  const res = await fetch(`${API}/users/me`, {
    credentials: "include",   // browser sends cookie automatically
  });

  if (res.status === 401) {
    // Token expired or missing — redirect to login
    window.location.href = "/login";
    return;
  }
  return res.json();
}

// ─── Logout ──────────────────────────────────────────────────────────────────
async function logout() {
  await fetch(`${API}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  window.location.href = "/login";
}

// ─── Axios (alternative) ─────────────────────────────────────────────────────
// Set this ONCE in your axios config and forget about it:
import axios from "axios";
axios.defaults.withCredentials = true;   // equivalent of credentials: "include"

// Then every call works automatically:
const profile = await axios.get(`${API}/users/me`);
const courses = await axios.get(`${API}/courses`);
```

---

## Part 2: Bug Fixes & Code Review

### Security Fixes

| File | Issue | Fix |
|------|-------|-----|
| `app/main.py` | `allow_origins=["*"]` with `allow_credentials=True` — browsers block this combination | Changed to explicit origin list from `ALLOWED_ORIGINS` env var |
| `app/database.py` | `print()` statements leaked DB password to stdout/logs | Replaced with `logger.info()` (password excluded) |
| `app/auth/jwt.py` | `jwt.decode()` called with string algorithm instead of list — jose library silently accepts this but it's incorrect | Fixed to `algorithms=[ALGORITHM]` |
| `app/auth/jwt.py` | No guard if `SECRET_KEY` is `None` (unset env var) | Added `RuntimeError` if SECRET_KEY is missing |
| `app/routes/user.py` | `PUT /{user_id}` and `PATCH /{user_id}` had no ownership check — any authenticated user could update any other user | Added `current_user.id != user_id` check |
| `app/routes/user.py` | `DELETE /{user_id}` same — no ownership check | Added same guard |

### Logic / Correctness Fixes

| File | Issue | Fix |
|------|-------|-----|
| `app/middlewares/auth.py` | `raiseHttpException` is a custom function called with wrong syntax (`raiseHttpException(...)` used as if it's a `raise` statement in multiple places) | Rewrote middleware with correct `raise HTTPException(...)` |
| `app/middlewares/auth.py` | Only read from `Authorization` header — didn't support cookie-based auth | Now reads cookie first, falls back to header |
| `app/routes/auth.py` | Login returned the raw JWT in the response body — frontend was expected to store it in localStorage | Changed to HTTPOnly cookie; response body has no token |
| `app/routes/user.py` | 409 Conflict (duplicate email/phone) was returned as 400 Bad Request | Fixed to `HTTP_409_CONFLICT` |
| `app/routes/user.py` | `handle_database_error` used `HTTP_400_BAD_REQUEST` for internal DB failures | Fixed to `HTTP_500_INTERNAL_SERVER_ERROR` |
| `app/routes/user.py` | Both `PUT` and `PATCH` endpoints existed with identical logic; since `UserUpdate` has all-optional fields, `PUT` is semantically wrong | Removed `PUT`, kept only `PATCH` |
| `app/routes/user.py` | Password hashed to `bytes` not decoded to `str` before storing in DB | Added `.decode("utf-8")` |

### Code Quality / Best Practices

| File | Issue | Fix |
|------|-------|-----|
| `app/auth/jwt.py` + `app/auth/security.py` | Two separate files both define `create_access_token` — duplicate, inconsistent | `auth/jwt.py` is the canonical one; `security.py` kept for admin but imports avoided duplication |
| `app/middlewares/auth.py` | `print(credentials)` debug statement left in production code | Removed |
| `app/routes/user.py` | `limit` parameter not capped — a client could request unlimited users | Added `min(limit, 100)` cap |
| `app/main.py` | `@app.on_event("startup")` is deprecated in newer FastAPI | Acceptable for now; can migrate to `lifespan` context manager later |

---

## Part 3: All Working Endpoints

### Authentication
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/auth/login` | ❌ | Login; sets HTTPOnly cookie |
| POST | `/auth/logout` | ❌ | Clears auth cookie |

### Users
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/users/` | ❌ | Register new user |
| GET | `/users/` | ✅ | List users (paginated) |
| GET | `/users/me` | ✅ | Get own profile |
| GET | `/users/{id}` | ✅ | Get user by ID |
| PATCH | `/users/{id}` | ✅ (owner only) | Update own profile |
| DELETE | `/users/{id}` | ✅ (owner only) | Delete own account |

### Mentor Auth
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/mentor/auth/login` | ❌ | Mentor-specific login (returns Bearer token) |

### Mentors
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/mentors/` | ❌ | List all mentors |
| GET | `/mentors/me/mentees` | ✅ | Get my assigned mentees |
| (more routes in mentor.py) | | | |

### Admin
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/admin/login` | ❌ | Admin login |
| GET | `/admin/me` | ✅ Admin | Get admin profile |
| POST | `/admin/staff` | ✅ Admin | Create staff member |
| (more routes in admin.py) | | | |

### Teams
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| (routes in team.py) | ✅ | | Team management |

### Courses
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| (routes in course.py) | varies | | Course management |

---

## Part 4: Sample Requests & Test Cases

### POST /auth/login

**Success (200)**
```json
Request:  { "email": "user@example.com", "password": "Test123!" }
Response: { "message": "Login successful", "user_id": 1, "email": "user@example.com" }
Cookie:   Set-Cookie: access_token=<JWT>; HttpOnly; SameSite=Lax; Path=/
```

**Failure — wrong password (401)**
```json
Response: { "detail": "Invalid credentials" }
```

### POST /auth/logout

**Success (200)**
```json
Response: { "message": "Logged out successfully" }
Cookie:   access_token cleared (max-age=0)
```

### GET /users/me

**Success (200)**
```json
{
  "id": 1, "name": "John Doe", "phone": "08012345678",
  "email": "john@example.com", "gender": "male",
  "role": "student", "location": "Lagos",
  "created_at": "2026-04-01T10:00:00", "updated_at": "2026-04-01T10:00:00"
}
```

**No cookie / expired token (401)**
```json
{ "detail": { "message": "Not authenticated. Please log in.", "timestamp": "..." } }
```

### POST /users/ (Register)

**Success (201)**
```json
Request: {
  "name": "Jane Doe", "phone": "08011112222",
  "email": "jane@example.com", "password": "Test123!",
  "confirm_password": "Test123!", "gender": "female", "location": "Abuja"
}
```

**Duplicate email (409)**
```json
{ "detail": "Email already registered" }
```

---

## Suggested Test Cases (pytest / httpx)

```python
# test_auth.py

def test_login_success(client):
    r = client.post("/auth/login", json={"email": "user@test.com", "password": "Test123!"})
    assert r.status_code == 200
    assert "access_token" in r.cookies

def test_login_wrong_password(client):
    r = client.post("/auth/login", json={"email": "user@test.com", "password": "wrong"})
    assert r.status_code == 401

def test_logout_clears_cookie(client, logged_in_client):
    r = logged_in_client.post("/auth/logout")
    assert r.status_code == 200
    assert r.cookies.get("access_token") is None  # or max-age=0

def test_get_me_authenticated(client, logged_in_client):
    r = logged_in_client.get("/users/me")
    assert r.status_code == 200
    assert "email" in r.json()

def test_get_me_unauthenticated(client):
    r = client.get("/users/me")
    assert r.status_code == 401

def test_register_duplicate_email(client, existing_user):
    r = client.post("/users/", json={**valid_user_data, "email": existing_user.email})
    assert r.status_code == 409

def test_update_other_user_forbidden(client, user_a_client, user_b):
    r = user_a_client.patch(f"/users/{user_b.id}", json={"name": "Hacker"})
    assert r.status_code == 403
```

---

## Part 5: Additional Fixes (Round 2)

### `app/routes/admin.py`

| Bug | Fix |
|-----|-----|
| `create_mentor` used `data["email"]` (dict-style access on a Pydantic model) — crashes at runtime | Changed to `data.email` |
| `delete_user` set `user.verified = "unverified"` — the `Admin` model has no `verified` field | Fixed to `user.is_active = False` + `user.deleted_at = datetime.utcnow()` (proper soft delete) |
| `generate_report` had `total_active_users = db.query(User).count()` — duplicate of `total_learners` | Now a meaningful distinct query |
| All `PUT` endpoints had all-optional schemas (correct verb is `PATCH`) | Changed to `PATCH` |
| Duplicate email on staff create returned 400 | Fixed to 409 Conflict |
| Duplicate mentor assignment returned 400 | Fixed to 409 Conflict |
| `assign_mentor` did not verify the learner (`user_id`) exists before creating assignment | Added learner existence check |
| Extracted repeated identifier-generation logic into `_next_identifier()` helper | DRY refactor |

### `app/routes/mentor_auth.py`

| Bug | Fix |
|-----|-----|
| Returned raw JWT token in response body — frontend would store in localStorage | Changed to HTTPOnly cookie (matches `/auth/login` flow) |
| Role check (`user.role != "mentor"`) happened BEFORE password check — this lets an attacker enumerate which emails belong to mentors | Moved role check to AFTER password verification |
| `bare except:` clause swallowed all errors silently | Replaced with targeted exception handling |
| Token expiry hardcoded to 30 minutes string `1800` | Uses `timedelta(hours=1)` + `create_access_token` |

### `app/routes/team.py`

| Bug | Fix |
|-----|-----|
| `PUT /admin/{team_id}` with all-optional `TeamUpdate` fields — wrong HTTP verb | Changed to `PATCH` |
| Duplicate team name/parameter check returned 400 | Fixed to 409 Conflict |
| Status validation used bare `raise HTTPException(status_code=400, ...)` with string literal — not using `status` constants | Fixed to `status.HTTP_422_UNPROCESSABLE_ENTITY` |

---

## Part 6: Complete Endpoint Reference (All Routes)

### Auth
| Method | Path | Auth | Notes |
|--------|------|------|-------|
| POST | `/auth/login` | ❌ | Sets HTTPOnly cookie |
| POST | `/auth/logout` | ❌ | Clears cookie |

### Users
| Method | Path | Auth | Notes |
|--------|------|------|-------|
| POST | `/users/` | ❌ | Register |
| GET | `/users/` | ✅ Cookie | List all |
| GET | `/users/me` | ✅ Cookie | Own profile |
| GET | `/users/{id}` | ✅ Cookie | By ID |
| PATCH | `/users/{id}` | ✅ Cookie (owner) | Update own profile |
| DELETE | `/users/{id}` | ✅ Cookie (owner) | Delete own account |

### Mentor Auth
| Method | Path | Auth | Notes |
|--------|------|------|-------|
| POST | `/mentor/auth/login` | ❌ | Sets HTTPOnly cookie |

### Mentors
| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | `/mentors/` | ❌ | List mentors |
| GET | `/mentors/me/mentees` | ✅ Cookie | My mentees (mentor only) |
| GET | `/mentors/me/mentor` | ✅ Cookie | My mentor for a course |
| GET | `/mentors/{id}` | ❌ | Single mentor |
| POST | `/mentors/tasks` | ✅ Cookie (mentor) | Create task |
| GET | `/mentors/tasks` | ✅ Cookie (mentor) | My tasks |
| GET | `/mentors/tasks/{id}` | ✅ Cookie | Single task |
| GET | `/mentors/tasks/{id}/submissions` | ✅ Cookie (mentor) | Task submissions |
| POST | `/mentors/tasks/submissions/{id}/grade` | ✅ Cookie (mentor) | Grade submission |

### Teams
| Method | Path | Auth | Notes |
|--------|------|------|-------|
| POST | `/teams/admin` | ✅ Admin Bearer | Create team |
| GET | `/teams/admin` | ✅ Admin Bearer | List all teams |
| GET | `/teams/admin/{id}` | ✅ Admin Bearer | Single team |
| PATCH | `/teams/admin/{id}` | ✅ Admin Bearer | Update team |
| DELETE | `/teams/admin/{id}` | ✅ Admin Bearer | Soft delete |
| POST | `/teams/admin/{id}/members` | ✅ Admin Bearer | Add members |
| DELETE | `/teams/admin/{id}/members/{uid}` | ✅ Admin Bearer | Remove member |
| GET | `/teams/my-team` | ✅ Cookie | My team(s) |

### Admin
| Method | Path | Auth | Notes |
|--------|------|------|-------|
| POST | `/admin/login` | ❌ | Returns Bearer token |
| GET | `/admin/me` | ✅ Admin Bearer | Admin profile |
| POST | `/admin/staff` | ✅ Admin Bearer | Create staff |
| GET | `/admin/users` | ✅ Admin Bearer | List staff accounts |
| GET | `/admin/users/{id}` | ✅ Admin Bearer | Single staff |
| PATCH | `/admin/users/{id}` | ✅ Admin Bearer | Update staff |
| DELETE | `/admin/users/{id}` | ✅ Admin Bearer | Soft delete staff |
| GET | `/admin/regular-users` | ✅ Admin Bearer | List students |
| DELETE | `/admin/regular-users/{id}` | ✅ Admin Bearer | Delete student |
| POST | `/admin/programs` | ✅ Admin Bearer | Create program |
| GET | `/admin/programs` | ✅ Admin Bearer | List programs |
| GET | `/admin/programs/{id}` | ✅ Admin Bearer | Single program |
| PATCH | `/admin/programs/{id}` | ✅ Admin Bearer | Update program |
| DELETE | `/admin/programs/{id}` | ✅ Admin Bearer | Soft delete |
| POST | `/admin/courses` | ✅ Admin Bearer | Create course |
| GET | `/admin/courses` | ✅ Admin Bearer | List courses |
| GET | `/admin/courses/{id}` | ✅ Admin Bearer | Single course |
| PATCH | `/admin/courses/{id}` | ✅ Admin Bearer | Update course |
| DELETE | `/admin/courses/{id}` | ✅ Admin Bearer | Soft delete |
| POST | `/admin/mentors` | ✅ Admin Bearer | Promote to mentor (by email) |
| GET | `/admin/mentors` | ✅ Admin Bearer | List mentors |
| GET | `/admin/mentors/assignments` | ✅ Admin Bearer | All assignments |
| GET | `/admin/mentors/{id}` | ✅ Admin Bearer | Single mentor |
| POST | `/admin/mentors/promote/{uid}` | ✅ Admin Bearer | Promote by user ID |
| PATCH | `/admin/mentors/{id}/activate` | ✅ Admin Bearer | Activate mentor |
| PATCH | `/admin/mentors/{id}/deactivate` | ✅ Admin Bearer | Deactivate mentor |
| POST | `/admin/mentors/assign` | ✅ Admin Bearer | Assign mentor to learner |
| DELETE | `/admin/mentors/assignments/{id}` | ✅ Admin Bearer | Remove assignment |
| GET | `/admin/reports` | ✅ Admin Bearer | Platform stats |

### Courses
| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | `/courses/` | ❌ | Public course list |
| POST | `/courses/` | ✅ Cookie (admin/mentor) | Create course |
| *(+ enrollment, progress routes in course.py)* | | | |

### Health
| Method | Path | Auth |
|--------|------|------|
| GET | `/` | ❌ |
| GET | `/health` | ❌ |
