export type ApiError = { error?: { detail?: string }; detail?: string };

const baseUrl =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) || "/api/v1";

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? window.sessionStorage.getItem("skill_swap_access_token")
      : null;
  const isMultipart =
    typeof FormData !== "undefined" && init.body instanceof FormData;
  const requestHeaders = {
    ...(isMultipart ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init.headers || {}),
  };

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...init,
      credentials: "include",
      headers: requestHeaders,
    });
  } catch (_err) {
    if (baseUrl.startsWith("http")) {
      try {
        response = await fetch(`/api/v1${path}`, {
          ...init,
          credentials: "include",
          headers: requestHeaders,
        });
      } catch {
        throw new Error(
          "Network error: Unable to connect to the backend server. Please verify the API is running."
        );
      }
    } else {
      throw new Error(
        "Network error: Unable to connect to the backend server. Please verify the API is running."
      );
    }
  }

  const payload = (await response.json().catch(() => ({}))) as T & ApiError;
  if (!response.ok)
    throw new Error(
      payload.error?.detail ||
        payload.detail ||
        "The request could not be completed."
    );
  return payload;
}

export function registerAccount(input: {
  name: string;
  email: string;
  password: string;
}) {
  return apiRequest<{ message: string; email: string; dev_otp?: string }>(
    "/auth/register",
    {
    method: "POST",
    body: JSON.stringify(input),
  });
}
export function verifyEmailOtp(input: { email: string; code: string }) {
  return apiRequest<{ message: string; access_token: string }>(
    "/auth/verify-otp",
    { method: "POST", body: JSON.stringify(input) }
  );
}
export function loginAccount(input: { email: string; password: string }) {
  return apiRequest<{ access_token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
export function verifyCertificate(identifier: string) {
  return apiRequest<{
    status: string;
    valid: boolean;
    certificate_no?: string;
    skill?: string;
  }>(`/certificates/verify/${encodeURIComponent(identifier)}`);
}
