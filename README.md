# Skill-Swap

Skill-Swap is a verified peer-to-peer learning platform for exchanging skills through assessments, reciprocal matching, protected conversations, video sessions, recordings, and verifiable certificates. The project also includes a protected administrator portal for analytics, activity monitoring, moderation, support, announcements, and audit review.

## Exact submitted technology stack

The project preserves the submitted technologies: React.js; Tailwind CSS / Bootstrap styling; Django with Python; MongoDB; JWT and bcrypt authentication; Socket.io; ZegoCloud; Cloudinary; Gmail SMTP; Render; Netlify/Vercel; VS Code; Postman; and GitHub.

The React client in this workspace is the polished member/admin presentation layer. The Django source of truth is under `django_backend/`, and the JavaScript Socket.io service is under `socket_service/`. Django owns application state and business rules. Socket.io handles authorized live events and delegates persistence/authorization to Django.

## Run the React preview

```bash
pnpm install
pnpm dev
```

Useful checks:

```bash
pnpm check
pnpm test
pnpm build
```

## Pages

Public pages include the landing page, How It Works, skills directory, skill detail, help, contact, privacy, terms/community guidelines, and certificate verification. Auth surfaces include registration, email verification, login, password reset, and onboarding. Member pages include dashboard, profile, skills, matching, requests, conversations, sessions, recordings, certificates, notifications, settings, and help/report. Administrator pages include overview, users, activity monitor, skills/questions, assessments, matches, communications, sessions, recordings, reports, certificates, announcements, support, settings, audit logs, and administrator security.

## Backend setup

```bash
cd django_backend
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
python manage.py runserver
```

The Django API exposes `/health/` and `/api/v1/`. MongoDB collections, indexes, state machines, and endpoint contracts are documented in `django_backend/architecture.md`. Keep credentials in environment configuration; do not commit `.env` files.

## Socket.io setup

```bash
cd socket_service
npm install
npm start
```

The service requires `JWT_SECRET`, `DJANGO_API_URL`, `FRONTEND_ORIGINS`, and a Render-provided `PORT`. It authenticates the shared JWT, authorizes two-person conversation rooms, forwards messages to Django for persistence, and emits message, typing, presence, and read events.

## Deployment

`render.yaml` contains the two Render services: Django API and Socket.io service. `netlify.toml` and `vercel.json` contain React SPA routing configuration. The required environment-variable contract is documented in `docs/environment.md`.

## Documentation

- `docs/architecture.md`: system context and data-flow diagrams.
- `docs/SKILL_SWAP_API.postman_collection.json`: API request collection.
- `docs/member-manual.md`: member operations and safety guidance.
- `docs/admin-manual.md`: administrator monitoring and moderation guidance.
- `docs/academic-project-report.md`: final academic report draft.
- `django_backend/architecture.md`: MongoDB collections, API boundaries, state transitions, and security invariants.
- `todo.md`: implementation ledger and remaining integration work.
