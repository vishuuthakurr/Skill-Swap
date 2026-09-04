# Skill-Swap backend architecture

## MongoDB collections

The service uses MongoDB collections rather than relational tables. Every document carries a stable `id`, `created_at`, `updated_at`, and where appropriate `status`, `owner_id`, and `audit` metadata.

| Collection            | Purpose                                                                 | Critical indexes                                |
| --------------------- | ----------------------------------------------------------------------- | ----------------------------------------------- |
| `users`               | Account identity, bcrypt hash, role, email verification, account status | unique normalized email; status; created_at     |
| `profiles`            | Public profile, avatar, bio, timezone, availability, privacy            | unique user_id                                  |
| `skills`              | Skill catalogue and categories                                          | unique slug; active/category                    |
| `user_skills`         | Teach/learn direction and per-skill verification                        | unique user_id+skill_id+direction; skill/status |
| `questions`           | Versioned assessment question bank                                      | skill/version/active                            |
| `assessment_attempts` | Randomized question IDs, submitted answers, score, result               | user/skill/submitted_at                         |
| `matches`             | Explainable reciprocal match records                                    | participant IDs; skill pair; status             |
| `match_requests`      | Request lifecycle and expiry                                            | recipient/status; requester/status              |
| `conversations`       | Authorized one-to-one room metadata                                     | unique match_id; participant IDs                |
| `messages`            | Persisted chat messages and read state                                  | conversation_id+sent_at                         |
| `sessions`            | Schedule, participants, room, completion, dispute                       | participant/status/start time                   |
| `recordings`          | ZegoCloud asset and Cloudinary storage metadata                         | unique session/provider_asset_id                |
| `certificates`        | Unique certificate number, signed verification token, asset, status     | unique number; unique token; recipient          |
| `reports`             | User/profile/message/session/certificate reports                        | status/priority/created_at                      |
| `notifications`       | In-app notification payload and delivery state                          | user/read/created_at                            |
| `announcements`       | Admin announcements and target audience                                 | status/published_at                             |
| `support_tickets`     | User support requests and replies                                       | status/assignee/created_at                      |
| `activity_logs`       | User activity metadata for admin monitoring                             | created_at; user/module/type                    |
| `audit_logs`          | Append-only security and administrator events                           | created_at; actor/action/target                 |
| `otp_tokens`          | Hashed, expiring one-time codes                                         | email/purpose/expiry                            |

## API boundaries

All Django endpoints are under `/api/v1`. Use serializers for input/output, service functions for business rules, and permission classes for ownership and administrator checks.

```text
POST   /auth/register
POST   /auth/verify-otp
POST   /auth/login
POST   /auth/refresh
POST   /auth/logout
POST   /auth/forgot-password
POST   /auth/reset-password
GET    /profile/me
PATCH  /profile/me
POST   /profile/avatar
GET    /skills
POST   /skills (admin)
GET    /skills/:id
GET    /my-skills
POST   /assessments/start
GET    /assessments/:id/questions
POST   /assessments/:id/submit
GET    /assessments/:id/result
GET    /matches/discover
GET    /matches/requests
POST   /matches/requests
PATCH  /matches/requests/:id
GET    /matches/:id
GET    /conversations
GET    /conversations/:id/messages
POST   /conversations/:id/messages
POST   /sessions
GET    /sessions
PATCH  /sessions/:id
POST   /sessions/:id/video-token
POST   /sessions/:id/complete
POST   /sessions/:id/dispute
GET    /recordings
GET    /certificates
GET    /certificates/:id
GET    /certificates/verify/:token
POST   /reports
GET    /notifications
PATCH  /notifications/:id/read
POST   /support-tickets

GET    /admin/dashboard
GET    /admin/users
GET    /admin/users/:id
PATCH  /admin/users/:id/status
GET    /admin/activity
GET    /admin/skills
PATCH  /admin/skills/:id
GET    /admin/questions
POST   /admin/questions
PATCH  /admin/questions/:id
GET    /admin/assessment-attempts
GET    /admin/matches
GET    /admin/communications
GET    /admin/sessions
GET    /admin/recordings
GET    /admin/reports
PATCH  /admin/reports/:id
GET    /admin/certificates
PATCH  /admin/certificates/:id/status
POST   /admin/announcements
GET    /admin/support-tickets
PATCH  /admin/support-tickets/:id
GET    /admin/settings
PATCH  /admin/settings
GET    /admin/audit-logs
```

## Protected state transitions

- Assessment: `not_started → in_progress → submitted → passed|failed → eligible_for_retake|expired`.
- Match request: `candidate → sent → accepted|declined|expired`.
- Session: `draft → scheduled → ready → live → ended → completion_pending → completed|disputed|cancelled`.
- Recording: `disabled → requested → processing → ready|failed → expired|deleted`.
- Certificate: `eligible → generating → issued → revoked`.
- Report: `open → assigned → under_review → resolved|dismissed|escalated`.

## Security invariants

1. Assessment answers are scored only from the server-side question version.
2. A teacher badge is scoped to one user and one skill.
3. A conversation exists only for an accepted match and contains exactly two participants.
4. A video token is short-lived, session-scoped, and issued only to a session participant.
5. Recording URLs are signed and expire; raw provider/storage credentials are never returned.
6. Certificate issuance is idempotent by session ID and certificate number.
7. Admin sensitive-content access requires a reason and creates an audit event.
8. Activity logs are append-only for the application role; audit logs are append-only and restricted to administrators.
