# Talent Flow LMS

Talent Flow LMS is a monorepo for the learning management platform. It houses both the frontend and the backend in one repository so product, engineering, and deployment work can stay organized in a single place as the system grows.

## Monorepo Overview

This repository is currently split into two main workspaces:

```text
talent-flow-lms/
├── Frontend/
└── Backend/
```

- `Frontend/` contains the web application and all frontend-related tooling.
- `Backend/` is reserved for the API, services, business logic, and backend tooling.

Keeping both sides of the platform in one monorepo helps us:

- keep frontend and backend development aligned
- centralize project documentation
- make collaboration across teams easier
- grow shared standards over time

## Frontend

The frontend for this project is planned around **Next.js 16.2.1**, which is the latest stable Next.js release at the time this README was updated.

### Frontend Direction

- Framework: `Next.js 16.2.1`
- Purpose: build the main user-interfacing web application
- Location: `Frontend/`

### Frontend Tooling

This section is intentionally lightweight for now and will be expanded as frontend decisions are finalized.

Planned areas to document later:

- styling approach
- UI/component strategy
- state management
- data fetching patterns
- form handling and validation
- testing setup
- linting and formatting
- deployment workflow

## Backend

The backend lives in the `Backend/` directory.

### Backend Stack

This section is intentionally left open for the backend team to define and maintain.

Backend team can update this section with:

- language and runtime
- framework
- database and ORM choices
- authentication and authorization approach
- background jobs, queues, or workers
- API architecture
- testing tools
- deployment and infrastructure details

## Documentation Notes

This README is the high-level entry point for the monorepo. As the project evolves, we can extend it with:

- setup instructions
- local development workflow
- environment variable guidance
- workspace-specific commands
- architecture notes
- contribution standards
