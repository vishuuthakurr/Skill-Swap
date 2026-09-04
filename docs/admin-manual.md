# Skill-Swap administrator manual

## Administrator access

Use the protected administrator entry point. Django checks the JWT and administrator role on every admin endpoint. A hidden frontend link is not considered authorization. All sensitive access and state-changing actions must record the administrator, reason, target, timestamp, and outcome.

## Daily overview

The admin dashboard shows member count, verified teachers, active exchanges, open reports, registration activity, assessment outcomes, session activity, certificate issuance, integration health, and the latest platform events. Treat the dashboard as an operational overview, not as a replacement for the underlying records.

## User management

Search members by name, email, skill, role, status, report count, and activity window. Inspect profiles, skill verification, assessment history, match history, session metadata, certificates, reports, and security activity. Warning, suspension, reactivation, verification revocation, and deletion actions require a reason and append an immutable audit entry.

## Activity and audit monitoring

The activity monitor is the main whole-platform view. Use date, module, severity, user, and event-type filters. Ordinary events show privacy-aware metadata. Private message or recording access is exceptional and must require a reason, a permission check, and a dedicated audit record. Audit logs are append-only from the application’s point of view.

## Question bank and verification

Manage skill categories, question text, choices, correct answers, difficulty, active state, and versions. Publish a new version rather than mutating a version already used by an assessment attempt. Configure question count, pass mark, cooldown, maximum attempts, and verification expiry. Never expose answer keys to members.

## Reports, sessions, recordings, certificates

Review reports using severity and status. Assign, investigate, resolve, dismiss, or escalate with a reason. Session monitoring should show participant authorization, schedule, live status, completion confirmations, dispute state, and recording status. Recording controls must honor retention and consent policies. Certificate controls support public verification, revocation, restoration, and issuance-history review.

## Communication and support

Use announcements for platform-wide or targeted notices. Track draft, sent, failed, and cancelled deliveries across in-app notifications and Gmail SMTP. Support tickets need an owner, priority, status, internal notes, and member-visible replies.

## Secret handling

SMTP passwords, JWT secrets, Cloudinary API secrets, MongoDB credentials, and ZegoCloud server secrets belong only in Render environment configuration. They must not be editable in the browser, logged, placed in screenshots, or committed to GitHub.
