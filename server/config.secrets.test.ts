import { describe, expect, it } from "vitest";
import "dotenv/config";

const required = [
  "MONGODB_URI",
  "DJANGO_SECRET_KEY",
  "JWT_SIGNING_KEY",
  "GMAIL_SMTP_USER",
  "GMAIL_SMTP_APP_PASSWORD",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "ZEGO_APP_ID",
  "ZEGO_SERVER_SECRET",
  "VITE_API_BASE_URL",
  "SOCKET_SERVICE_URL",
] as const;

describe("integration secret configuration", () => {
  it("has the required environment contract without exposing values", () => {
    for (const key of required)
      expect(process.env[key], `${key} is required`).toBeTruthy();
    expect(() => new URL(process.env.VITE_API_BASE_URL!)).not.toThrow();
    expect(() => new URL(process.env.SOCKET_SERVICE_URL!)).not.toThrow();
  });

  it("can probe the configured Django health endpoint when explicitly enabled", async () => {
    if (process.env.VALIDATE_LIVE_SECRETS !== "1") return;
    const base = process.env.VITE_API_BASE_URL!.replace(/\/api\/v1\/?$/, "");
    const response = await fetch(`${base}/health`, {
      signal: AbortSignal.timeout(5000),
    });
    expect(response.status).toBeLessThan(500);
  });
});
