import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export type AuthUser = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: any;
};

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

const DEFAULT_DEMO_USER: AuthUser = {
  id: "demo-user-01",
  name: "Vaibhav Singh",
  email: "vaibhav@skillswap.local",
  role: "user",
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = "/login" } =
    options ?? {};

  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = window.sessionStorage.getItem("skill_swap_user");
      if (stored) return JSON.parse(stored);
      // Auto-fallback to demo session if token is set
      const token = window.sessionStorage.getItem("skill_swap_access_token");
      if (token) return DEFAULT_DEMO_USER;
    } catch {}
    return null;
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCurrentUser = useCallback(async () => {
    if (typeof window === "undefined") return;
    const token = window.sessionStorage.getItem("skill_swap_access_token");
    if (!token) return;

    try {
      setLoading(true);
      const data = await apiRequest<AuthUser>("/auth/me");
      if (data && data.id) {
        setUser(data);
        window.sessionStorage.setItem("skill_swap_user", JSON.stringify(data));
      }
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (loading) return;
    if (user) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;

    window.location.href = redirectPath;
  }, [redirectOnUnauthenticated, redirectPath, loading, user]);

  const logout = useCallback(async () => {
    try {
      await apiRequest("/auth/logout", { method: "POST" }).catch(() => {});
    } catch {}
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("skill_swap_access_token");
      window.sessionStorage.removeItem("skill_swap_user");
      window.sessionStorage.removeItem("manus-cookie");
    }
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }, []);

  const loginAsDemo = useCallback((role: "user" | "admin" = "user") => {
    const demo: AuthUser = {
      ...DEFAULT_DEMO_USER,
      role,
      name: role === "admin" ? "Admin Moderator" : "Vaibhav Singh",
      email: role === "admin" ? "admin@skillswap.local" : "vaibhav@skillswap.local",
    };
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("skill_swap_access_token", "demo-token-" + Date.now());
      window.sessionStorage.setItem("skill_swap_user", JSON.stringify(demo));
    }
    setUser(demo);
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: Boolean(user),
    refresh: fetchCurrentUser,
    logout,
    loginAsDemo,
  };
}
