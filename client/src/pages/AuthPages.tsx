import React, { FormEvent, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  apiRequest,
  loginAccount,
  registerAccount,
  verifyEmailOtp,
} from "@/lib/api";

function AuthShell({
  children,
  eyebrow,
}: {
  children: React.ReactNode;
  eyebrow: string;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800 antialiased">
      {/* Top Bar */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-500/30">
              <GraduationCap className="size-5" />
            </span>
            <span className="font-bold tracking-tight text-slate-900 text-lg">
              Skill-Swap <span className="text-blue-600">Pro</span>
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 transition"
          >
            <ArrowLeft className="size-3.5" /> Back to Catalog
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="container mx-auto flex flex-1 items-center justify-center p-4 py-8 sm:p-6 lg:py-12">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl lg:grid-cols-[.9fr_1.1fr]">
          {/* Left Hero Column */}
          <div className="relative hidden bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="relative z-10 space-y-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                <Sparkles className="size-3" /> {eyebrow}
              </span>

              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl leading-tight">
                Peer-to-Peer Learning with Verifiable Credentials.
              </h1>

              <p className="text-sm leading-relaxed text-slate-300">
                Exchange knowledge directly with expert peers. Conduct 1-on-1
                video sessions, complete graded skill assessments, and earn
                cryptographic certificates.
              </p>

              <div className="space-y-3 pt-4 text-xs text-slate-200">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                  <span>Interactive 1-on-1 video rooms with screen sharing</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                  <span>Standardized 35-question skill testing engine</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                  <span>SHA-256 tamper-proof completion certificates</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-12 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xs text-xs text-slate-300">
              <ShieldCheck className="size-5 text-emerald-400 shrink-0" />
              <span>
                Enterprise-grade security with OTP verification and encrypted sessions.
              </span>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <label className="block text-xs font-medium text-slate-700">
      {label}
      <div className="relative mt-1.5">
        <Input
          type={visible ? "text" : "password"}
          value={value}
          onChange={event => onChange(event.target.value)}
          className="h-11 rounded-xl border-slate-300 bg-white pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setVisible(current => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </label>
  );
}


export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await loginAccount({ email, password });
      window.sessionStorage.setItem(
        "skill_swap_access_token",
        result.access_token
      );
      window.location.assign("/app/dashboard");
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Sign in could not be completed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell eyebrow="Account Access">
      <div className="mx-auto w-full max-w-sm">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Welcome back
          </h2>
          <p className="mt-1.5 text-xs text-slate-500">
            Sign in to access your skills dashboard, live exchanges, and certificates.
          </p>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-xs font-medium text-slate-700">
            Email address
            <div className="relative mt-1.5">
              <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                required
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                className="h-11 rounded-xl border-slate-300 bg-white pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                placeholder="you@domain.com"
              />
            </div>
          </label>

          <PasswordField
            label="Password"
            value={password}
            onChange={setPassword}
          />

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {error && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700 font-medium">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            {loading ? "Signing in..." : "Sign in to Account"}{" "}
            <ArrowUpRight className="ml-1.5 size-4" />
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

export function Register() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <AuthShell eyebrow="Free Registration">
      <div className="mx-auto w-full max-w-sm">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Start Learning & Teaching
          </h2>
          <p className="mt-1.5 text-xs text-slate-500">
            Join the community. Your email will receive a secure OTP code.
          </p>
        </div>

        <form
          onSubmit={async event => {
            event.preventDefault();
            setError("");
            setLoading(true);
            try {
              await registerAccount({ name, email, password });
              setLocation(`/verify-email?email=${encodeURIComponent(email)}`);
            } catch (caught) {
              setError(
                caught instanceof Error
                  ? caught.message
                  : "Registration could not be completed."
              );
            } finally {
              setLoading(false);
            }
          }}
          className="mt-6 space-y-4"
        >
          <label className="block text-xs font-medium text-slate-700">
            Full name
            <Input
              required
              value={name}
              onChange={event => setName(event.target.value)}
              className="mt-1.5 h-11 rounded-xl border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              placeholder="e.g. John Doe"
            />
          </label>

          <label className="block text-xs font-medium text-slate-700">
            Email address
            <Input
              required
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              className="mt-1.5 h-11 rounded-xl border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              placeholder="you@domain.com"
            />
          </label>

          <PasswordField
            label="Create a password"
            value={password}
            onChange={setPassword}
          />

          <label className="flex items-start gap-2.5 text-xs text-slate-600">
            <input
              required
              type="checkbox"
              className="mt-0.5 size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>
              I agree to the{" "}
              <Link href="/terms" className="font-semibold text-blue-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and Privacy Policy.
            </span>
          </label>

          {error && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700 font-medium">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            {loading ? "Creating account..." : "Continue to Verification"}{" "}
            <ArrowUpRight className="ml-1.5 size-4" />
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

export function VerifyEmail() {
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const email =
    new URLSearchParams(window.location.search).get("email") || "your email";

  return (
    <AuthShell eyebrow="Security Check">
      <div className="mx-auto w-full max-w-sm">
        <span className="grid size-12 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
          <Mail className="size-6" />
        </span>

        <div className="mt-4">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Verify your email
          </h2>
          <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
            Enter the 6-digit code sent to <strong className="text-slate-800">{email}</strong>.
          </p>
        </div>

        {verified ? (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center">
            <Check className="mx-auto size-8 text-emerald-600" />
            <h3 className="mt-2 text-sm font-bold text-emerald-800">
              Email Verified Successfully!
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              Your profile is authenticated. Set up your learning skills to get matched.
            </p>
            <Link href="/onboarding">
              <Button className="mt-4 w-full rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold">
                Complete Profile Setup <ArrowUpRight className="ml-1.5 size-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <form
            onSubmit={async event => {
              event.preventDefault();
              setError("");
              setLoading(true);
              try {
                const result = await verifyEmailOtp({ email, code });
                window.sessionStorage.setItem(
                  "skill_swap_access_token",
                  result.access_token
                );
                setVerified(true);
              } catch (caught) {
                setError(
                  caught instanceof Error
                    ? caught.message
                    : "The verification code is incorrect or has expired."
                );
              } finally {
                setLoading(false);
              }
            }}
            className="mt-6 space-y-4"
          >
            <label className="block text-xs font-medium text-slate-700">
              6-Digit Security Code
              <Input
                required
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={event =>
                  setCode(event.target.value.replace(/\D/g, ""))
                }
                className="mt-1.5 h-14 rounded-xl border-slate-300 bg-white text-center text-2xl font-bold tracking-[0.4em] text-slate-900 placeholder:text-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                placeholder="000000"
              />
            </label>

            {error && (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700 font-medium">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading || code.length < 6}
              className="h-11 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
            >
              {loading ? "Verifying..." : "Verify & Continue"}{" "}
              <ShieldCheck className="ml-1.5 size-4" />
            </Button>

            <button
              type="button"
              onClick={async () => {
                try {
                  await apiRequest("/auth/resend-otp", {
                    method: "POST",
                    body: JSON.stringify({ email }),
                  });
                  setError(
                    "A fresh verification code has been dispatched to your email."
                  );
                } catch (caught) {
                  setError(
                    caught instanceof Error
                      ? caught.message
                      : "Please wait a moment before requesting another code."
                  );
                }
              }}
              className="w-full text-center text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              Resend verification code
            </button>
          </form>
        )}
      </div>
    </AuthShell>
  );
}

export function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <AuthShell eyebrow="Account Recovery">
      <div className="mx-auto w-full max-w-sm">
        <span className="grid size-12 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
          <LockKeyhole className="size-6" />
        </span>

        <div className="mt-4">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Reset password
          </h2>
          <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
            Enter your email and we'll send you a secure link to reset your account password.
          </p>
        </div>

        {sent ? (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center">
            <CheckCircle2 className="mx-auto size-8 text-emerald-600" />
            <h3 className="mt-2 text-sm font-bold text-emerald-800">
              Reset Link Sent!
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              Check your inbox. If an account matches that email, a password reset link is on its way.
            </p>
            <Link href="/login">
              <Button className="mt-4 w-full rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold">
                Return to Sign in
              </Button>
            </Link>
          </div>
        ) : (
          <form
            onSubmit={async event => {
              event.preventDefault();
              setError("");
              setLoading(true);
              try {
                await apiRequest("/auth/forgot-password", {
                  method: "POST",
                  body: JSON.stringify({ email }),
                });
                setSent(true);
              } catch (caught) {
                setError(
                  caught instanceof Error
                    ? caught.message
                    : "The reset request could not be completed."
                );
              } finally {
                setLoading(false);
              }
            }}
            className="mt-6 space-y-4"
          >
            <label className="block text-xs font-medium text-slate-700">
              Email address
              <Input
                required
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                className="mt-1.5 h-11 rounded-xl border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                placeholder="you@domain.com"
              />
            </label>

            {error && (
              <p className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700 font-medium">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
            >
              {loading ? "Sending..." : "Send Reset Link"}{" "}
              <ArrowUpRight className="ml-1.5 size-4" />
            </Button>
          </form>
        )}
      </div>
    </AuthShell>
  );
}

export function Onboarding() {
  const [, setLocation] = useLocation();
  const [teachSkills, setTeachSkills] = useState("");
  const [learnSkills, setLearnSkills] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kolkata (IST)");
  const [avatarState, setAvatarState] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <AuthShell eyebrow="Profile Setup">
      <div className="mx-auto w-full max-w-sm">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Step 1 of 3
            </span>
            <span className="text-xs text-slate-400">Profile Details</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Configure Your Skills
          </h2>
          <p className="mt-1.5 text-xs text-slate-500">
            Tell us what you want to teach and learn for automated matchmaking.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block text-xs font-medium text-slate-700">
            Skills I can teach
            <Input
              value={teachSkills}
              onChange={event => setTeachSkills(event.target.value)}
              className="mt-1.5 h-11 rounded-xl border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              placeholder="e.g. Python, Machine Learning, UI/UX"
            />
          </label>

          <label className="block text-xs font-medium text-slate-700">
            Skills I want to learn
            <Input
              value={learnSkills}
              onChange={event => setLearnSkills(event.target.value)}
              className="mt-1.5 h-11 rounded-xl border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              placeholder="e.g. Photography, React, Public Speaking"
            />
          </label>

          <label className="block text-xs font-medium text-slate-700">
            Profile photo / avatar
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="mt-1.5 block w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
              onChange={async event => {
                const file = event.target.files?.[0];
                if (!file) return;
                const form = new FormData();
                form.append("avatar", file);
                try {
                  setAvatarState("Uploading image...");
                  await apiRequest("/profile/avatar", {
                    method: "POST",
                    body: form,
                  });
                  setAvatarState("Avatar uploaded successfully");
                } catch (caught) {
                  setAvatarState(
                    caught instanceof Error
                      ? caught.message
                      : "Avatar upload failed."
                  );
                }
              }}
            />
            {avatarState && (
              <span className="mt-1.5 block text-xs font-medium text-emerald-600">
                {avatarState}
              </span>
            )}
          </label>

          <label className="block text-xs font-medium text-slate-700">
            Your timezone
            <Input
              value={timezone}
              onChange={event => setTimezone(event.target.value)}
              className="mt-1.5 h-11 rounded-xl border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          {error && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700 font-medium">
              {error}
            </p>
          )}

          <Button
            disabled={loading}
            onClick={async () => {
              setError("");
              setLoading(true);
              try {
                await apiRequest("/profile/me", {
                  method: "PATCH",
                  body: JSON.stringify({
                    teach_skills: teachSkills
                      .split(",")
                      .map(item => item.trim())
                      .filter(Boolean),
                    learn_skills: learnSkills
                      .split(",")
                      .map(item => item.trim())
                      .filter(Boolean),
                    timezone,
                    availability: {},
                    privacy: {},
                    notification_preferences: {},
                    recording_consent: false,
                  }),
                });
                setLocation("/app/dashboard");
              } catch (caught) {
                setError(
                  caught instanceof Error
                    ? caught.message
                    : "Your profile could not be saved."
                );
              } finally {
                setLoading(false);
              }
            }}
            className="h-11 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            {loading ? "Saving profile..." : "Save & Open Workspace"}{" "}
            <ArrowUpRight className="ml-1.5 size-4" />
          </Button>
        </div>

        {/* Steps progress indicator */}
        <div className="mt-6 flex gap-2">
          {[1, 2, 3].map(step => (
            <span
              key={step}
              className={`h-1.5 flex-1 rounded-full ${
                step === 1 ? "bg-blue-600" : "bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>
    </AuthShell>
  );
}

export function ResetPassword() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <AuthShell eyebrow="Account Security">
      <div className="mx-auto w-full max-w-sm">
        <span className="grid size-12 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
          <LockKeyhole className="size-6" />
        </span>

        <div className="mt-4">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Choose new password
          </h2>
          <p className="mt-1.5 text-xs text-slate-500">
            Enter and confirm your new secure password below.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <PasswordField
            label="New password"
            value={password}
            onChange={setPassword}
          />
          <PasswordField
            label="Confirm password"
            value={confirm}
            onChange={setConfirm}
          />

          {error && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700 font-medium">
              {error}
            </p>
          )}

          <Button
            disabled={loading}
            onClick={async () => {
              if (password.length < 8 || password !== confirm) {
                setError(
                  "Passwords must match and contain at least 8 characters."
                );
                return;
              }
              setLoading(true);
              try {
                const token =
                  new URLSearchParams(window.location.search).get("token") ||
                  "";
                await apiRequest("/auth/reset-password", {
                  method: "POST",
                  body: JSON.stringify({ token, password }),
                });
                setLocation("/login");
              } catch (caught) {
                setError(
                  caught instanceof Error
                    ? caught.message
                    : "The reset link is invalid or has expired."
                );
              } finally {
                setLoading(false);
              }
            }}
            className="h-11 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            {loading ? "Updating..." : "Update Password"}{" "}
            <ArrowUpRight className="ml-1.5 size-4" />
          </Button>
        </div>
      </div>
    </AuthShell>
  );
}
