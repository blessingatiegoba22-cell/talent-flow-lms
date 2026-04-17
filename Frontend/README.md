# Talent Flow LMS Frontend

The Talent Flow LMS frontend is a Next.js application that turns the platform's learning, instruction, and administration workflows into a polished web product. It owns the public website, authentication screens, role-based dashboards, course discovery, learner progress experience, instructor course workspace, and admin-facing interface.

This app is built to feel like a real LMS product, not a demo shell: users can sign up, sign in, browse published courses from the backend, enroll, start lessons, track progress, manage learning activity, and move through role-specific dashboard areas.

## What The Frontend Built

### Public Experience

- landing page with navigation, hero, about, feature, and footer sections
- brand assets and optimized responsive imagery
- SEO metadata through the App Router root layout

### Authentication

- student sign-up flow backed by the FastAPI `/users/student` endpoint
- sign-in flow backed by `/auth/login`
- automatic sign-in after successful student registration
- forgot-password and reset-password screens
- role-selection sign-up entry points for student, mentor, and teacher paths
- server actions for auth requests and backend validation error mapping
- secure cookie handoff from backend responses into Next.js server cookies

### Learner Product

- authenticated learner layout and dashboard shell
- personalized learner greeting using the signed-in user's first name
- first-time learning copy that says "Welcome", "Ready to start", and "Start Learning" until a course has real progress
- returning learner copy that changes back to "Welcome back", "Ready to continue", and "Continue Learning" after the learner starts a course
- course catalog with search, category and level filtering, sorting, pagination, recommended courses, and popular courses
- course detail pages with enrollment, generated modules, lesson lists, materials, progress bars, and course metadata
- lesson view with responsive lesson navigation, video-style presentation, overview content, and progress advancement
- My Learning page with enrolled and completed course groupings
- assignment pages for viewing, submitting, and success states
- discussions, teams, notifications, profile settings, and certificate screens

### Instructor Product

- instructor dashboard shell
- course workspace for creating course drafts with backend `POST /courses/`
- publishing flow using backend `PATCH /courses/{course_id}/publish`
- course library, draft/published metrics, publish readiness panel, assessment preview, media preview, and instructor notes
- server-readable draft cache so newly created courses stay visible immediately in the instructor workspace

### Admin Product

- admin dashboard with platform overview, metrics, and quick actions
- admin teams page
- admin profile and notifications pages
- shared dashboard chrome, sidebar, account menu, and responsive layout patterns

## Technical Stack

| Area | Choice |
|---|---|
| Framework | Next.js 16.2.2 App Router |
| UI runtime | React 19.2.4 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Forms | React Hook Form |
| Validation | Zod |
| Icons | Lucide React |
| UI primitives | local shadcn-style components and Radix package support |
| Backend integration | server actions and server-side fetch helpers |

## Source Structure

```text
Frontend/
├── app/
│   ├── (auth)/              # sign-in, sign-up, password recovery routes
│   ├── (root)/              # authenticated learner, instructor, admin routes
│   ├── api/auth/            # frontend auth route support
│   ├── layout.tsx           # global metadata and document shell
│   └── page.tsx             # public landing page
├── components/
│   ├── auth/                # forms, auth shell, fields, submit buttons
│   ├── dashboard/           # dashboard shell, course widgets, role screens
│   ├── landing/             # marketing site sections
│   ├── shared/              # shared image/loading helpers
│   └── ui/                  # base UI primitives
├── data/                    # static dashboard and landing content
├── lib/                     # API clients, server actions, cookies, presenters
└── public/                  # product imagery and brand assets
```

## Key Frontend Decisions

### Server-first backend integration

The app calls the FastAPI backend from trusted server utilities and server actions. This keeps API credentials, cookie handling, and validation translation out of browser-only code wherever possible.

### HTTPOnly cookie auth

The backend sets JWTs as HTTPOnly cookies. The frontend parses backend `Set-Cookie` headers and writes them into the Next.js cookie store so protected server-rendered routes can fetch the current user with `/users/me`.

### Role-based routing

Routes are grouped by purpose:

- `(auth)` for unauthenticated account flows
- `(root)/learner` for learner workspace screens
- `(root)/instructor` for instructor workspace screens
- `(root)/admin` for admin screens

`lib/routes.ts` centralizes role-to-dashboard routing.

### Presentation adapters

`lib/course-presenter.ts` converts backend course records into UI-friendly view models. This keeps catalog cards, dashboard cards, learning lists, detail pages, and lesson pages consistent.

### Progress and enrollment bridge

The backend already supports enrollment writes, but the frontend does not yet have a complete backend read endpoint for the current learner's enrolled courses and progress. To keep the product experience coherent today, the frontend stores recent enrolled course IDs and progress in HTTPOnly cookies:

- `lib/enrolled-courses.ts`
- `lib/course-progress.ts`

Those cookies power server-rendered dashboard, catalog, course detail, and My Learning views until the backend exposes the full learner progress API.

## Backend Contracts Used

The frontend currently talks to these backend endpoints:

```text
POST /users/student
POST /auth/login
POST /auth/logout
GET  /users/me
GET  /courses/
GET  /courses/{course_id}
POST /courses/
PATCH /courses/{course_id}/publish
POST /courses/{course_id}/enroll
```

Set `NEXT_PUBLIC_API_BASE_URL` to the backend origin, for example:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Local Development

Install dependencies:

```bash
npm install
```

Create the local environment file:

```bash
printf "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000\n" > .env.local
```

Run the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev     # start the Next.js dev server
npm run build   # create a production build
npm run start   # run the production server
npm run lint    # run ESLint
```

## Important Files

- `lib/auth-actions.ts`: server actions for sign-in, sign-up, and logout
- `lib/auth-service.ts`: backend auth API calls and current-user fetch
- `lib/backend.ts`: typed backend fetch helper and backend error handling
- `lib/backend-cookies.ts`: backend cookie parsing and Next.js cookie storage
- `lib/course-service.ts`: course API client
- `lib/course-actions.ts`: enroll, progress, and demo-state server actions
- `lib/course-presenter.ts`: course-to-view-model mapping and generated lesson structure
- `components/dashboard/learner-user-copy.tsx`: learner-specific greeting copy
- `app/(root)/learner/dashboard/page.tsx`: learner dashboard composition and start/continue copy state
- `components/dashboard/instructor-course-workspace.tsx`: instructor course builder and publishing UI

## Product UX Notes

- New learners or learners with no started course see onboarding-oriented dashboard copy.
- The dashboard returns to continuation-oriented copy as soon as any enrolled course has progress above zero.
- Course lesson progress advances once per viewed lesson in the browser and is persisted through a server action.
- Course modules and lessons are generated from backend course metadata until the backend adds persistent content models.
- Instructor draft visibility is supported with a short server-readable cookie cache so the workspace updates immediately after course creation and publish actions.

## Quality Bar

The frontend is organized around reusable UI slices, predictable server actions, and typed adapters between backend payloads and product screens. Future work should preserve those boundaries:

- keep backend calls in `lib/*service.ts` and server actions
- keep route pages focused on data loading and composition
- keep display components reusable and prop-driven
- move temporary cookie-backed state to backend APIs as those endpoints become available
- add focused tests around auth, enrollment, progress, and instructor publishing before broad refactors
