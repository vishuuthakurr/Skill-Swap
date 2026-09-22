import React, { FormEvent, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Eye,
  EyeOff,
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
    <div className="page-wash flex min-h-screen flex-col">
      <div className="container flex items-center justify-between py-7">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full border border-[#b9afcf] bg-[#f1ecfa] text-[#61567d]">
            <Sparkles className="size-4" />
          </span>
          <span className="font-serif text-xl text-[#61567d]">Skill-Swap</span>
        </Link>
        <Link href="/" className="text-xs text-slate-500 hover:text-[#6c5d88]">
          <ArrowLeft className="mr-1 inline size-3" /> back to home
        </Link>
      </div>
      <main className="container flex flex-1 items-center justify-center py-10">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/80 bg-white/42 shadow-[0_24px_80px_rgba(117,98,145,0.12)] lg:grid-cols-[.8fr_1.2fr]">
          <div className="hidden bg-gradient-to-br from-[#eee6f7] via-[#f8e8ee] to-[#e5f2eb] p-12 lg:block">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#776b91]">
              {eyebrow}
            </p>
            <h1 className="mt-28 max-w-sm font-serif text-5xl leading-[1.02] text-[#5b506e]">
              A little room for{" "}
              <em className="font-normal text-[#9b7390]">what’s next.</em>
            </h1>
            <p className="mt-6 max-w-sm text-sm leading-7 text-slate-600">
              Build a learning profile that starts with generosity and grows
              with every good exchange.
            </p>
            <div className="mt-20 flex items-center gap-3 text-xs text-[#668d7b]">
              <ShieldCheck className="size-4" /> Verification is part of the
              welcome.
            </div>
          </div>
          <div className="bg-white/65 p-7 sm:p-12">{children}</div>
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
    <label className="block text-xs text-slate-500">
      {label}
      <div className="relative mt-2">
        <Input
          type={visible ? "text" : "password"}
          value={value}
          onChange={event => onChange(event.target.value)}
          className="h-11 rounded-xl border-white bg-white/75 pr-11 text-sm text-slate-700"
        />
        <button
          type="button"
          onClick={() => setVisible(current => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#6c5d88]"
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
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
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
          : "Sign in could not be completed."
      );
    }
  };
  return (
    <AuthShell eyebrow="Welcome back">
      <div className="mx-auto max-w-md">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8f81ad]">
          Return to your exchange
        </p>
        <h2 className="mt-4 font-serif text-4xl text-[#5b506e]">
          Welcome back.
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Sign in to see your matches, conversations, and next small step.
        </p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <label className="block text-xs text-slate-500">
            Email address
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                required
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                className="h-11 rounded-xl border-white bg-white/75 pl-10 text-sm"
                placeholder="you@example.com"
              />
            </div>
          </label>
          <PasswordField
            label="Password"
            value={password}
            onChange={setPassword}
          />
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-xs text-[#6c5d88]">
              Forgot password?
            </Link>
          </div>
          {error && (
            <p className="rounded-xl bg-[#fff3f2] px-3 py-2 text-xs text-[#a66a62]">
              {error}
            </p>
          )}
          <Button
            type="submit"
            className="h-11 w-full rounded-xl bg-[#6c5d88] text-white hover:bg-[#5d5077]"
          >
            Sign in <ArrowUpRight className="ml-2 size-4" />
          </Button>
        </form>
        <p className="mt-8 text-center text-sm text-slate-500">
          New to Skill-Swap?{" "}
          <Link href="/register" className="text-[#6c5d88]">
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
  return (
    <AuthShell eyebrow="Make your beginning">
      <div className="mx-auto max-w-md">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8f81ad]">
          Start with intention
        </p>
        <h2 className="mt-4 font-serif text-4xl text-[#5b506e]">
          Make an account.
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Your email will be verified before you can open a teaching profile.
        </p>
        <form
          onSubmit={async event => {
            event.preventDefault();
            setError("");
            try {
              await registerAccount({ name, email, password });
              setLocation(`/verify-email?email=${encodeURIComponent(email)}`);
            } catch (caught) {
              setError(
                caught instanceof Error
                  ? caught.message
                  : "Registration could not be completed."
              );
            }
          }}
          className="mt-8 space-y-5"
        >
          <label className="block text-xs text-slate-500">
            Your name
            <Input
              required
              value={name}
              onChange={event => setName(event.target.value)}
              className="mt-2 h-11 rounded-xl border-white bg-white/75 text-sm"
              placeholder="How should we call you?"
            />
          </label>
          <label className="block text-xs text-slate-500">
            Email address
            <Input
              required
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              className="mt-2 h-11 rounded-xl border-white bg-white/75 text-sm"
              placeholder="you@example.com"
            />
          </label>
          <PasswordField
            label="Create a password"
            value={password}
            onChange={setPassword}
          />
          <label className="flex items-start gap-3 text-xs leading-5 text-slate-500">
            <input
              required
              type="checkbox"
              className="mt-0.5 size-4 accent-[#6c5d88]"
            />
            <span>
              I agree to the{" "}
              <Link href="/terms" className="text-[#6c5d88]">
                community guidelines
              </Link>{" "}
              and privacy policy.
            </span>
          </label>
          {error && (
            <p className="rounded-xl bg-[#fff3f2] px-3 py-2 text-xs text-[#a66a62]">
              {error}
            </p>
          )}
          <Button
            type="submit"
            className="h-11 w-full rounded-xl bg-[#6c5d88] text-white"
          >
            Continue to email verification{" "}
            <ArrowUpRight className="ml-2 size-4" />
          </Button>
        </form>
        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="text-[#6c5d88]">
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
  const email =
    new URLSearchParams(window.location.search).get("email") || "your email";
  return (
    <AuthShell eyebrow="A verified beginning">
      <div className="mx-auto max-w-md">
        <span className="grid size-12 place-items-center rounded-2xl bg-[#e7f1ea] text-[#668d7b]">
          <Mail className="size-5" />
        </span>
        <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8f81ad]">
          Check your inbox
        </p>
        <h2 className="mt-4 font-serif text-4xl text-[#5b506e]">
          One small code.
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          We sent a six-digit OTP through Gmail SMTP. It expires soon and can
          only be used once.
        </p>
        {verified ? (
          <div className="mt-8 rounded-2xl border border-[#cfe4d7] bg-[#eef7f0] p-5">
            <p className="flex items-center gap-2 text-sm font-medium text-[#526e62]">
              <Check className="size-4" /> Email verified
            </p>
            <p className="mt-2 text-xs leading-6 text-slate-600">
              Continue to create the profile that will shape your first match.
            </p>
            <Link href="/onboarding">
              <Button className="mt-5 rounded-full bg-[#6c5d88] text-white">
                Set up profile <ArrowUpRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <form
            onSubmit={async event => {
              event.preventDefault();
              setError("");
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
                    : "That code could not be verified."
                );
              }
            }}
            className="mt-8 space-y-5"
          >
            <label className="block text-xs text-slate-500">
              Verification code
              <Input
                required
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={event =>
                  setCode(event.target.value.replace(/\D/g, ""))
                }
                className="mt-2 h-14 rounded-xl border-white bg-white/75 text-center text-xl tracking-[0.4em]"
                placeholder="000000"
              />
            </label>
            {error && (
              <p className="rounded-xl bg-[#fff3f2] px-3 py-2 text-xs text-[#a66a62]">
                {error}
              </p>
            )}
            <Button
              type="submit"
              className="h-11 w-full rounded-xl bg-[#6c5d88] text-white"
            >
              Verify email <ShieldCheck className="ml-2 size-4" />
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
                    "If the account can be verified, a new code has been sent."
                  );
                } catch (caught) {
                  setError(
                    caught instanceof Error
                      ? caught.message
                      : "Please wait before requesting another code."
                  );
                }
              }}
              className="w-full text-xs text-[#6c5d88]"
            >
              Resend code · 00:48
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
  return (
    <AuthShell eyebrow="A safe reset">
      <div className="mx-auto max-w-md">
        <span className="grid size-12 place-items-center rounded-2xl bg-[#eee6f7] text-[#6c5d88]">
          <LockKeyhole className="size-5" />
        </span>
        <h2 className="mt-8 font-serif text-4xl text-[#5b506e]">
          Forgotten password?
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Enter your email and we will send a secure reset path without
          revealing whether an account exists.
        </p>
        {sent ? (
          <div className="mt-8 rounded-2xl border border-[#cfe4d7] bg-[#eef7f0] p-5">
            <p className="text-sm font-medium text-[#526e62]">
              If that email is with us, a reset link is on its way.
            </p>
            <Link href="/login">
              <Button className="mt-5 rounded-full bg-[#6c5d88] text-white">
                Return to sign in
              </Button>
            </Link>
          </div>
        ) : (
          <form
            onSubmit={async event => {
              event.preventDefault();
              setError("");
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
              }
            }}
            className="mt-8 space-y-5"
          >
            <label className="block text-xs text-slate-500">
              Email address
              <Input
                required
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                className="mt-2 h-11 rounded-xl border-white bg-white/75"
              />
            </label>
            {error && (
              <p className="rounded-xl bg-[#fff3f2] px-3 py-2 text-xs text-[#a66a62]">
                {error}
              </p>
            )}
            <Button className="h-11 w-full rounded-xl bg-[#6c5d88] text-white">
              Send reset path <ArrowUpRight className="ml-2 size-4" />
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
  return (
    <AuthShell eyebrow="Your learning constellation">
      <div className="mx-auto max-w-md">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8f81ad]">
          Step 1 of 3
        </p>
        <h2 className="mt-4 font-serif text-4xl text-[#5b506e]">
          What brings you here?
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          We will use these details to make matches that feel possible, not
          random.
        </p>
        <div className="mt-8 space-y-5">
          <label className="block text-xs text-slate-500">
            Skills I can teach
            <Input
              value={teachSkills}
              onChange={event => setTeachSkills(event.target.value)}
              className="mt-2 h-11 rounded-xl border-white bg-white/75"
              placeholder="Add a skill, like Python"
            />
          </label>
          <label className="block text-xs text-slate-500">
            Skills I want to learn
            <Input
              value={learnSkills}
              onChange={event => setLearnSkills(event.target.value)}
              className="mt-2 h-11 rounded-xl border-white bg-white/75"
              placeholder="Add a skill, like Photography"
            />
          </label>
          <label className="block text-xs text-slate-500">
            Profile avatar
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="mt-2 block w-full rounded-xl border border-white bg-white/70 p-3 text-xs text-slate-500"
              onChange={async event => {
                const file = event.target.files?.[0];
                if (!file) return;
                const form = new FormData();
                form.append("avatar", file);
                try {
                  setAvatarState("Uploading securely…");
                  await apiRequest("/profile/avatar", {
                    method: "POST",
                    body: form,
                  });
                  setAvatarState("Avatar ready");
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
              <span className="mt-2 block text-xs text-[#668d7b]">
                {avatarState}
              </span>
            )}
          </label>
          <label className="block text-xs text-slate-500">
            Your usual timezone
            <Input
              value={timezone}
              onChange={event => setTimezone(event.target.value)}
              className="mt-2 h-11 rounded-xl border-white bg-white/75"
            />
          </label>
          {error && (
            <p className="rounded-xl bg-[#fff3f2] px-3 py-2 text-xs text-[#a66a62]">
              {error}
            </p>
          )}
          <Button
            onClick={async () => {
              setError("");
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
              }
            }}
            className="h-11 w-full rounded-xl bg-[#6c5d88] text-white"
          >
            Enter my workspace <ArrowUpRight className="ml-2 size-4" />
          </Button>
        </div>
        <div className="mt-7 flex gap-2">
          {[1, 2, 3].map(step => (
            <span
              key={step}
              className={`h-1.5 flex-1 rounded-full ${step === 1 ? "bg-[#6c5d88]" : "bg-[#e6e0ea]"}`}
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
  return (
    <AuthShell eyebrow="A safe reset">
      <div className="mx-auto max-w-md">
        <span className="grid size-12 place-items-center rounded-2xl bg-[#eee6f7] text-[#6c5d88]">
          <LockKeyhole className="size-5" />
        </span>
        <h2 className="mt-8 font-serif text-4xl text-[#5b506e]">
          Choose a new password.
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Use the one-time link from your email. The token is never stored in
          the browser after submission.
        </p>
        <div className="mt-8 space-y-5">
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
            <p className="rounded-xl bg-[#fff3f2] px-3 py-2 text-xs text-[#a66a62]">
              {error}
            </p>
          )}
          <Button
            onClick={async () => {
              if (password.length < 8 || password !== confirm) {
                setError(
                  "Passwords must match and contain at least eight characters."
                );
                return;
              }
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
                    : "The reset link could not be used."
                );
              }
            }}
            className="h-11 w-full rounded-xl bg-[#6c5d88] text-white"
          >
            Save new password <ArrowUpRight className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    </AuthShell>
  );
}
