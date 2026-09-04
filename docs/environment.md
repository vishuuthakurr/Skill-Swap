# Skill-Swap environment contract

## Django / Render

| Variable                | Purpose                                     |                   Required |
| ----------------------- | ------------------------------------------- | -------------------------: |
| `DJANGO_SECRET_KEY`     | Django signing secret                       |                        Yes |
| `DJANGO_DEBUG`          | Development-only debug toggle               | Yes; `false` in production |
| `DJANGO_ALLOWED_HOSTS`  | Allowed Django hosts                        |                        Yes |
| `MONGODB_URI`           | Managed MongoDB connection string           |                        Yes |
| `MONGODB_DATABASE`      | MongoDB database name                       |                        Yes |
| `JWT_SECRET`            | Shared access-token signing secret          |                        Yes |
| `JWT_ACCESS_MINUTES`    | Short access-token lifetime                 |                Recommended |
| `SMTP_HOST`             | Gmail SMTP host                             |                        Yes |
| `SMTP_PORT`             | Gmail SMTP port                             |                        Yes |
| `SMTP_USERNAME`         | Gmail sender/account                        |                        Yes |
| `SMTP_PASSWORD`         | Gmail app password, never a normal password |                        Yes |
| `DEFAULT_FROM_EMAIL`    | Verified sender address                     |                        Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud                            |                        Yes |
| `CLOUDINARY_API_KEY`    | Cloudinary server key                       |                        Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary server secret                    |                        Yes |
| `ZEGO_APP_ID`           | ZegoCloud application identifier            |                        Yes |
| `ZEGO_SERVER_SECRET`    | ZegoCloud server credential                 |                        Yes |
| `CORS_ALLOWED_ORIGINS`  | React frontend origins                      |                        Yes |

## Socket.io / Render

| Variable           | Purpose                                                            |
| ------------------ | ------------------------------------------------------------------ |
| `PORT`             | Render-provided service port; never hardcode in deployment         |
| `JWT_SECRET`       | Same shared signing secret as Django                               |
| `DJANGO_API_URL`   | Django API base URL used for authorization and message persistence |
| `FRONTEND_ORIGINS` | Allowed React origins                                              |

## React / Netlify or Vercel

Only public, non-secret configuration may be exposed to React, such as `VITE_API_BASE_URL`, `VITE_SOCKET_URL`, and `VITE_ZEGO_APP_ID` if the provider explicitly requires the public app identifier. Never expose `JWT_SECRET`, `SMTP_PASSWORD`, `CLOUDINARY_API_SECRET`, `ZEGO_SERVER_SECRET`, or MongoDB credentials.

## Secret rules

Use deployment secret stores and local `.env` files excluded by Git. Rotate secrets after accidental exposure, use a Gmail app password for SMTP, restrict Cloudinary upload presets, keep storage URLs private where possible, and avoid logging tokens, OTPs, passwords, signed URLs, or raw provider callbacks.
