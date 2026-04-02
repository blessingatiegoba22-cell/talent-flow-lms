# UI Decisions

- Use this file to record frontend stack and UI decisions.
- Document framework choices, styling approach, component strategy, and state handling.
- Add notes for routing, forms, accessibility, testing, and frontend tooling.

## Frontend Structure Notes

- `app/` is the Next.js App Router layer. Keep route files such as `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, and route-specific folders here.
- `app/layout.tsx` is the global layout. Global metadata, fonts, and `globals.css` should be managed here.
- Route groups like `(auth)` and `(root)` are for organization and shared layouts only. The group name does not appear in the final URL.
- `component/` is for reusable UI and page-level components.
- `component/shared/` is for our own shared components built by the team. These are custom app components, not generated library primitives.
- When a component is added through shadcn, it should stay in the auto-generated `ui` folder. Do not mix shadcn-generated components into `shared`.
- `lib/` is for app-level modules and integrations such as API clients, auth helpers, config setup, service wrappers, schema wiring, and anything that connects the app to external systems.
- `utils/` is for small pure helper functions such as formatters, validators, string helpers, date helpers, number helpers, and lightweight reusable utilities.
- `store/` is for Zustand stores, slices, selectors, actions, persistence logic, and any global client state that must be shared across multiple screens.
- Keep page-specific components out of `shared`. If a component only supports one screen or one feature flow, place it close to that feature or keep it as a dedicated component in `component/`.

## Route Group Usage

- `app/(auth)/` is for authentication-related pages only.
- Pages that belong in `(auth)` include `sign-in`, `sign-up`, `forgot-password`, `reset-password`, `verify-email`, `confirm-email`, `invite-acceptance`, and any account-access or account-recovery flow.
- `app/(root)/` is for the main product experience after a user enters the app.
- Pages that belong in `(root)` include `dashboard`, `courses`, `learning-paths`, `lessons`, `profile`, `settings`, `notifications`, `billing`, and other signed-in application pages.
- Public marketing pages can stay in the top-level `app/` tree if they should not share the authenticated app shell.
- Do not place auth screens inside `(root)`, and do not place dashboard or product screens inside `(auth)`.
- If the public landing page stays at `app/page.tsx`, do not also keep another `page.tsx` at `app/(root)/page.tsx` for the same `/` route. In that case, the main app homepage should move into something like `app/(root)/dashboard/page.tsx`.

## Conventions

- Use constants to create data and map over them in JSX for cleaner and more maintainable code.
- Create dedicated mock data files when needed instead of hardcoding repeated sample data directly inside components.
- Extract repeated UI into reusable components instead of duplicating markup across pages.
- Keep shared app components in `component/shared/` and keep feature-specific components close to the feature that uses them.
- Prefer typed props, typed function parameters, and typed return values. Keep components and utilities type-safe by default.
- Avoid `any`. If a type is unclear, define the interface, type alias, or reusable shape instead of falling back to `any`.
- Reuse existing types when possible instead of redefining the same shape in multiple files.
- Use constants for repeated labels, links, tabs, navigation items, and static configuration values.
- Keep business logic and transformation logic out of JSX where possible. Prepare the data before the return block and keep JSX focused on rendering.
- Use clear and descriptive names for files, components, functions, variables, and store actions.
- Prefer small focused components over very large files that handle too many responsibilities.
- Put generic helpers in `utils/` and app-specific integrations or setup code in `lib/`.
- Keep global state in `store/` only when it is truly shared across multiple parts of the app. Do not move local component state into the global store unnecessarily.
- Prefer composition over deeply nested conditional JSX. Break complex sections into smaller components when readability starts dropping.
- Keep imports clean and organized. Remove unused imports, variables, and dead code before opening a PR.
- Use one source of truth for repeated values. If a value is reused in multiple places, move it to a constant, config, utility, or shared type.
- When adding new folders or patterns, keep naming and structure consistent with the existing project conventions.

## Styling Rules

- Colors, spacing, font sizes, radii, widths, heights, and layout values should come directly from Figma.
- Frontend implementation should mirror Figma exactly unless there is a clear reason to deviate.
- No silent improvisation. If a developer makes any styling or layout decision that differs from Figma, that decision must be clearly stated in the PR or handoff notes with the reason for the change.
- Shared design values should stay consistent across pages. If Figma changes, the code should be updated to match the new source of truth.

## Collaboration Rules

- Every developer must create a personal branch before starting work on a feature.
- Branches should follow a clear personal naming pattern such as `sheriff/landing-page`, `abejide/sign-in-flow`, or `jb/dashboard-shell` and so on.
- Do not start feature work directly on the main branch.
- Do not commit or push local agent files to the repository. This includes `CLAUDE.md`, `AGENTS.md`, `any ai agentic file`, `x`, and other local AI-assistant or machine-specific working files.
- Keep PRs focused on the feature or fix being worked on so reviews stay clean and traceable.
- Always notify before pushing or creating PR's
