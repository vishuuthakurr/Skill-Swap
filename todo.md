# Project TODO

- [x] Establish the Skill-Swap visual system with pastel lavender, blush, pale mint gradients, editorial serif typography, wide-spaced sans-serif labels, geometric corner brackets, faint vertical rules, airy layouts, responsive behavior, and accessible contrast.
- [x] Build public landing page with Skill-Swap value proposition, workflow, trust signals, calls to action, and calm editorial presentation.
- [x] Build public How It Works page covering registration, assessment, matching, chat, sessions, and certificates.
- [x] Build public skill browsing and skill detail pages with search, category filters, and privacy-safe information.
- [x] Build public help, contact, privacy policy, terms, and community-guidelines pages.
- [x] Build public certificate-verification page with valid, revoked, expired, and not-found states.
- [x] Implement member registration with validation, Gmail SMTP OTP verification, resend/expiry/rate-limit states, JWT authentication, bcrypt password hashing, logout, forgot-password, and reset-password flows.
- [x] Implement member onboarding for profile, avatar, teach skills, learn skills, skill levels, timezone, availability, privacy, notification preferences, and recording consent.
- [x] Implement Cloudinary avatar upload with server-side validation and safe media references.
- [x] Implement member dashboard with verification progress, matches, requests, messages, upcoming sessions, notifications, and certificates.
- [x] Implement profile view/edit pages with privacy controls, skill badges, availability, and public preview.
- [x] Implement teach/learn skill management and per-skill verification state.
- [x] Implement randomized 30–40 question skill assessments with server-side scoring, versioning, pass threshold, attempt limits, cooldowns, and result history.
- [x] Implement per-skill Verified Teacher status and badge display.
- [x] Implement reciprocal explainable matching based on complementary teach/learn skills, verification, level, availability, timezone, and trust signals.
- [x] Implement match discovery, match details, request send/accept/decline/expire states, and protected access rules.
- [x] Implement safe reporting, blocking, warnings, and moderation states for members.
- [x] Implement authorized one-to-one Socket.io conversations with JWT authorization, persisted message history, typing indicators, online presence, read/unread states, and notification events.
- [x] Implement conversations list and protected conversation detail pages with connection-loss and empty states.
- [ ] Implement session scheduling, participant authorization, timezone-safe date handling, reminders, rescheduling, cancellation, and status lifecycle.
- [ ] Implement server-issued ZegoCloud credentials and protected one-to-one video session page.
- [ ] Implement explicit recording consent, recording indicator, recording metadata, Cloudinary storage references, processing states, and access-controlled recordings.
- [ ] Implement session completion confirmation, dispute handling, and moderation review workflow.
- [ ] Implement idempotent certificate generation for eligible completed exchanges, secure Cloudinary asset storage, member certificate list/detail pages, revocation state, and public validation links.
- [ ] Implement in-app notifications for account, matching, messaging, session, recording, certificate, moderation, support, and admin-announcement events.
- [ ] Build protected admin login and role-based admin layout.
- [ ] Build admin overview dashboard with platform analytics, KPI cards, charts, operational health, and recent activity feed.
- [ ] Build admin user management, user detail, status actions, search, filters, pagination, and activity history.
- [ ] Build admin whole-platform activity monitoring with event filters, severity, module, date range, and privacy-aware metadata.
- [ ] Build admin skills/category management and skill lifecycle actions.
- [ ] Build admin question bank management, versioning, publishing, archiving, and assessment configuration.
- [ ] Build admin assessment-attempt monitoring and per-skill verification review.
- [ ] Build admin match monitoring with requests, statuses, skill pairs, and conversion metrics.
- [ ] Build admin communication monitoring with conversation metadata, delivery health, reports, and restricted audited content access.
- [ ] Build admin session monitoring, disputes, ZegoCloud/recording statuses, and participant support actions.
- [ ] Build admin recording management with Cloudinary/provider status, retry, retention, and deletion controls.
- [ ] Build admin reports and moderation queue with assignment, resolution reasons, user restrictions, and audit trail.
- [ ] Build admin certificate management with search, verification, revoke/restore, regeneration, and issuance audit trail.
- [ ] Build admin announcements with audience targeting, Gmail SMTP/in-app delivery, drafts, sent, failed, and cancelled states.
- [ ] Build admin support-ticket management with assignment, priority, internal notes, replies, and user notifications.
- [ ] Build admin non-secret settings for policies, upload limits, retention, templates, report categories, and maintenance messages.
- [ ] Build admin profile/security page and administrator session activity.
- [ ] Implement MongoDB collections, indexes, state fields, relationships, and data ownership for all core entities.
- [x] Implement Django REST API boundaries under /api/v1 with validation, authorization, consistent error contracts, and idempotency for critical mutations.
- [x] Implement JavaScript Socket.io service boundaries, shared JWT validation, room authorization, message persistence, and event logging.
- [x] Implement Gmail SMTP, Cloudinary, and ZegoCloud service adapters with environment-based secrets and failure handling.
- [x] Implement immutable activity/audit logs for user and administrator events, including sensitive-access logging.
- [x] Implement security hardening: HTTPS assumptions, CORS allowlist, secure headers, rate limits, input validation, upload restrictions, JWT expiry/revocation, and private signed media URLs.
- [x] Add Vitest/unit coverage for scoring, matching, permissions, state transitions, certificate idempotency, and critical UI behavior.
- [ ] Add API, Socket.io authorization, provider-adapter, integration failure, responsive, accessibility, and end-to-end journey test coverage.
- [x] Add Postman collection, architecture diagrams, MongoDB schema documentation, deployment configuration, environment-variable documentation, administrator manual, member manual, and final academic project report.
- [x] Verify all major pages through the live preview at desktop and mobile breakpoints.
- [x] Run type checks, formatting, tests, and production build; fix all actionable errors before final checkpoint.
- [ ] Save the completed project checkpoint and deliver the project version plus documentation to the user.

- [x] Wire avatar upload and signed avatar display into the member onboarding/profile UI, then verify upload/read error states.
- [ ] Standardize Django API error/response contracts and add idempotency/validation coverage for all critical mutations under /api/v1.
- [x] Add inspectable Socket.io tests for JWT auth, room authorization, persistence, unread/presence/typing, and event logging.
- [x] Add inspectable tests or code evidence for Gmail SMTP and ZegoCloud adapters, including failure-path handling and integration validation.

- [x] Add executable Socket.io tests covering Django-backed conversation authorization, persisted message handoff success/failure, typing events, unread/read-state events, and audit/event logging.
- [x] Replace the placeholder ZegoCloud credential stub with real server-token generation and add success/failure tests.
- [x] Expand provider-adapter tests to cover Gmail SMTP send failure handling and the ZegoCloud integration contract.

- [x] Add a Django provider-adapter test that mocks smtplib.SMTP to fail during connect/login/send and verifies Gmail SMTP fails safely with a clear error.

- [x] Wrap Gmail SMTP transport/connect/login/send failures in a clear adapter-level RuntimeError and update the provider test to assert that safe error contract.

- [x] Add executable Socket.io tests for both typing_start and typing_stop plus explicit unread-state event behavior.
- [x] Wire audit/event logging into the live Socket.io service and test join, send_message, read, and disconnect logging.
- [x] Add integration-style Socket.io tests against server handlers for authorized room joins and message handoff beyond isolated helpers.

- [x] Add a Node integration test that instantiates the Socket.io server handlers, mocks the Django audit endpoint, and verifies audit events fire on join, send_message, message_read, and disconnect.
- [x] Add authenticated Socket.io integration tests for authorized and unauthorized room joins and persisted message handoff success/failure through real server event handlers.

- [x] Add a real handler integration test for message-persistence failure and assert the live callback returns the delivery error.
- [x] Add an integration test for Socket.io auth middleware with valid and invalid JWTs before handler registration.

- [x] Add a real Socket.io middleware integration test that invokes the io.use auth path and verifies valid JWTs reach handler registration while invalid JWTs are rejected before connection handlers run.

- [x] Add a Socket.io server-flow integration test wiring auth middleware and connection-handler registration together, proving valid JWTs reach handler setup while invalid auth stops setup.

- [x] Add a Django `/api/v1/audit-events` endpoint and tests proving Socket.io join/send/read/disconnect audit writes persist immutably.
- [ ] Expand audit/activity logging across critical member and administrator flows with sensitive-access tests.
- [x] Add broader validation tests for critical authentication, matching, session, certificate, and admin mutations.
- [x] Implement signed/private access patterns for protected recording and certificate assets and add failure-path tests.

- [x] Add Django tests for all Socket.io audit actions and verify immutable audit records are persisted through the endpoint.
- [x] Add an integration test proving the live Socket.io service triggers the Django audit endpoint for join, send_message, message_read, and disconnect.
- [x] Add protected certificate-media tests plus unauthorized, missing, not-ready, and signer-failure paths for recording/certificate assets.

- [x] Add an audit-endpoint test with a fake Mongo collection that asserts all four Socket.io actions persist immutable records with actor, target, and source metadata.

- [x] Add a Socket.io runtime/server-flow integration test that wires registerSocketRuntime with mocked Django fetch and asserts `/audit-events` is called for join, send_message, message_read, and disconnect in one authenticated connection flow.

- [x] Include a unique jti in every issued Django JWT and verify revocation tests exercise newly issued tokens.
- [x] Align ZegoCloud participant authorization with the session participant_ids record shape and add a regression test.
- [x] Align certificate eligibility domain rules with completed-session confirmations and add a regression test.

- [x] Update the Django revocation test to issue a token through create_access_token, persist its jti in revoked_tokens, and assert the exact token is rejected.

- [x] Add an executable Django mutation-validation matrix covering registration, OTP, reset, skills, match requests, sessions, reports, blocks, assessment start, session actions, certificates, and admin reason/field validation.

- [ ] Add mutation-validation tests for invalid OTP verification/resend inputs and rate-limit/error states.
- [ ] Add certificate issuance validation tests for ineligible sessions, invalid skill payloads, and authorization/state rejection.
- [ ] Expand admin mutation-validation tests for disallowed fields, empty allowed fields, unknown collections, and invalid record combinations.
- [ ] Expand session-action validation tests for invalid action names, short dispute reasons on existing sessions, and consent/complete payload validation.
