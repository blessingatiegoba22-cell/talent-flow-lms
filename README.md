# Talent Flow LMS

Talent Flow LMS is a full-stack learning management platform for organizations that need to turn training, mentorship, and course delivery into a clear digital workflow. The product brings learners, instructors, mentors, and administrators into one system so teams can publish courses, enroll learners, track progress, coordinate assignments, and manage platform activity from role-specific dashboards.

This repository is a monorepo containing the production-facing web application and the FastAPI backend that powers authentication, course data, enrollment, mentor workflows, teams, and admin operations.

## Product Story

Talent Flow LMS is designed for skill-building programs, internship academies, internal training teams, and education operators that need more than a static course catalog. The platform focuses on the operating layer around learning:

- learners can discover courses, enroll, start lessons, continue progress, submit assignments, join discussions, view teams, and access certificates
- instructors and mentors can create course drafts, prepare content, publish courses, and guide learning activity
- administrators can monitor the platform, manage users, organize teams, assign mentors, and oversee operational health
- the system keeps authentication secure with backend-owned HTTPOnly cookies instead of browser-exposed tokens

The current application already includes a polished public site, role-based authentication flows, learner dashboards, course catalog and lesson views, instructor course creation and publishing flows, admin screens, profile management, notifications, teams, assignments, discussions, and certificate presentation UI.

## Repository Structure

```text
talent-flow-lms/
├── Backend/       # FastAPI API, SQLAlchemy models, routes, migrations, deployment files
├── Frontend/      # Next.js App Router frontend, dashboards, auth, course UX, UI system
├── README.md      # Monorepo overview
└── requirements.txt
```

## Workspaces

### Frontend

The frontend is a Next.js 16 application that delivers the customer-facing experience and dashboard workflows. It uses the App Router, React 19, TypeScript, Tailwind CSS v4, server actions, route groups, and reusable dashboard/landing components.

The frontend currently builds:

- public marketing landing page for Talent Flow LMS
- student sign-up, sign-in, password reset, and role-selection screens
- authenticated dashboard shell with role-specific navigation
- learner dashboard with personalized copy, progress metrics, quick actions, enrolled courses, and course start/continue states
- course catalog with search, filters, sorting, pagination, recommended courses, and popular courses
- course detail pages with modules, lessons, materials, enrollment actions, and progress display
- lesson player pages with responsive module navigation and progress advancement
- My Learning, assignments, discussions, teams, notifications, certificates, and profile pages
- instructor dashboard and course workspace for draft creation, course publishing, and course library management
- admin dashboard, teams, profile, and notifications screens

Read the frontend documentation in [Frontend/README.md](Frontend/README.md).

### Backend

The backend is a FastAPI service with SQLAlchemy models and PostgreSQL persistence. It owns user identity, secure authentication, course records, enrollment, mentor assignment, task workflows, teams, and admin reporting endpoints.

The backend currently provides:

- user registration for students and mentors
- login and logout with JWTs stored in HTTPOnly cookies
- current-user profile endpoint
- course listing, course detail, course creation, publishing, and enrollment endpoints
- admin endpoints for platform users, metrics, course oversight, mentors, and teams
- mentor endpoints for mentees, tasks, submissions, and grading workflows
- team management endpoints
- Alembic migrations, Docker configuration, Render deployment documentation, and sample scripts

Read the backend documentation in [Backend/README.md](Backend/README.md).

## Architecture

Talent Flow LMS follows a clean web/API split:

- The Next.js frontend renders public and authenticated experiences.
- Server actions call the backend API from trusted server-side code.
- The FastAPI backend validates requests, reads and writes PostgreSQL through SQLAlchemy, and returns typed API payloads.
- Authentication cookies are set by the backend and mirrored by the frontend server layer so protected pages can be rendered safely.
- Course enrollment and progress presentation are already wired in the frontend. Until the backend exposes full read endpoints for a learner's enrolled courses and progress history, the frontend uses server-readable HTTPOnly cookies to reflect recent enrollment and progress state immediately in dashboard views.

## Technology

| Area | Stack |
|---|---|
| Frontend framework | Next.js 16.2.2, React 19.2.4, TypeScript |
| Frontend UI | Tailwind CSS v4, shadcn-style primitives, Lucide icons |
| Forms and validation | React Hook Form, Zod |
| Backend framework | FastAPI, Uvicorn, Gunicorn |
| Backend data layer | PostgreSQL, SQLAlchemy, Alembic |
| Authentication | JWT, HTTPOnly cookies, bcrypt |
| Deployment support | Docker, Docker Compose, Render configuration |

## Local Development

### 1. Backend

```bash
cd Backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

The API runs at `http://localhost:8000`.

### 2. Frontend

```bash
cd Frontend
npm install
printf "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000\n" > .env.local
npm run dev
```

The frontend runs at `http://localhost:3000`.

### 3. Useful Commands

```bash
# Frontend
cd Frontend
npm run lint
npm run build

# Backend
cd Backend
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

## Environment Variables

Frontend:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Backend:

```env
DB_USER=postgres
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=talent_flow_db
SECRET_KEY=your-long-random-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
ENVIRONMENT=development
```

See [Backend/.env.example](Backend/.env.example) for the backend template.

## What Makes This App Strong

Talent Flow LMS is not just a collection of pages. It is already shaped around the real operating model of a learning program:

- role-based product areas instead of a one-size dashboard
- secure cookie-based authentication that avoids storing tokens in client JavaScript
- server-rendered learner pages that stay in sync with course enrollment and progress actions
- reusable course presentation logic that keeps catalog, detail, lesson, and dashboard views consistent
- instructor workflows that call real backend course creation and publishing endpoints
- a backend domain model that can grow into richer progress, mentorship, task, and reporting features

## Current Notes

- The learner dashboard now changes its greeting and learning copy based on whether the learner has started a course. New learners and learners with no course progress see "Welcome", "Ready to start", and "Start Learning"; once progress exists, the dashboard returns to "Welcome back", "Ready to continue", and "Continue Learning".
- Some learner enrollment and progress reads are represented with HTTPOnly cookies on the frontend while the backend API continues to mature. This keeps the current UX coherent without pretending the long-term data model is finished.
- Course lessons and modules are generated from course records in the frontend until the backend exposes first-class course content, module, and lesson entities.

## Roadmap Opportunities

- backend read endpoints for current learner enrollments and course progress
- persistent lesson/module/content models
- assignment submission upload handling
- certificate issuance backed by completion records
- richer analytics for admins, instructors, and mentors
- automated frontend and backend test coverage around auth, enrollment, and progress flows

## License

No license has been declared yet.
