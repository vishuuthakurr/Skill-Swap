import { FormEvent, useState, useEffect } from "react";
import {
  AlertCircle,
  Award,
  Check,
  FileCheck2,
  Loader2,
  Search,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type VerificationState =
  | "idle"
  | "loading"
  | "valid"
  | "revoked"
  | "expired"
  | "not_found"
  | "unavailable";

export default function CertificateVerificationPanel() {
  const [certificate, setCertificate] = useState("");
  const [state, setState] = useState<VerificationState>("idle");
  const [message, setMessage] = useState("");
  const [certData, setCertData] = useState<{
    status?: string;
    skill?: string;
    certificate_no?: string;
    recipient_name?: string;
    issued_at?: string;
    score?: number;
  } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token") || params.get("cert");
    if (token) {
      setCertificate(token);
      void executeVerify(token);
    }
  }, []);

  const executeVerify = async (val: string) => {
    const value = val.trim();
    if (!value) {
      setState("not_found");
      setMessage("Enter a certificate number to begin a lookup.");
      return;
    }
    setState("loading");
    try {
      const base =
        (import.meta.env.VITE_API_BASE_URL as string | undefined) || "/api/v1";
      const response = await fetch(
        `${base}/certificates/verify/${encodeURIComponent(value)}`
      );
      if (response.status === 404) {
        setState("not_found");
        setMessage("No verified certificate was found matching that token or ID.");
        setCertData(null);
        return;
      }
      if (!response.ok) {
        setState("unavailable");
        setMessage(
          "The verification service could not complete the request. Please try again shortly."
        );
        setCertData(null);
        return;
      }
      const data = await response.json();
      setCertData(data);
      const next =
        data.status === "revoked"
          ? "revoked"
          : data.status === "expired"
          ? "expired"
          : "valid";
      setState(next);
      setMessage(
        next === "valid"
          ? `Authentic Skill-Swap Credential verified${data.skill ? ` for ${data.skill}` : ""}.`
          : next === "revoked"
          ? "This certificate has been revoked by platform moderators."
          : "This credential has expired."
      );
    } catch {
      setState("unavailable");
      setMessage(
        "The verification service is temporarily unavailable. Please try again shortly."
      );
      setCertData(null);
    }
  };

  const verify = async (event: FormEvent) => {
    event.preventDefault();
    await executeVerify(certificate);
  };

  const resultStyles: Record<
    Exclude<VerificationState, "idle" | "loading">,
    { box: string; icon: React.ReactNode; title: string }
  > = {
    valid: {
      box: "border-emerald-200 bg-emerald-50/70",
      icon: <Check className="size-5 text-emerald-600" />,
      title: "Certificate Cryptographically Verified",
    },
    revoked: {
      box: "border-red-200 bg-red-50/70",
      icon: <XCircle className="size-5 text-red-600" />,
      title: "Certificate Revoked",
    },
    expired: {
      box: "border-amber-200 bg-amber-50/70",
      icon: <AlertCircle className="size-5 text-amber-600" />,
      title: "Certificate Expired",
    },
    not_found: {
      box: "border-slate-200 bg-slate-50",
      icon: <FileCheck2 className="size-5 text-slate-400" />,
      title: "Certificate Not Found",
    },
    unavailable: {
      box: "border-slate-200 bg-slate-50",
      icon: <AlertCircle className="size-5 text-slate-400" />,
      title: "Verification Service Offline",
    },
  };

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm">
        <Award className="size-7" />
      </div>
      <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
        Certificate Authenticity Lookup
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        Enter a Skill-Swap certificate ID (e.g. SS-VERIF-2026-PY) or verification token to validate issuer authenticity and recipient mark.
      </p>

      <form onSubmit={verify} className="mt-8 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={certificate}
            onChange={(event) => {
              setCertificate(event.target.value);
              setState("idle");
            }}
            placeholder="e.g. SS-VERIF-2026-PY or SS-2026-00481"
            className="h-12 rounded-xl border-slate-200 pl-10 text-sm focus-visible:border-blue-600"
            aria-label="Certificate number"
          />
        </div>
        <Button
          type="submit"
          disabled={state === "loading"}
          className="h-12 rounded-xl bg-blue-600 px-6 font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          {state === "loading" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Verify Credential"
          )}
        </Button>
      </form>

      {state !== "idle" && state !== "loading" && (
        <div
          className={`mt-8 rounded-2xl border p-5 ${resultStyles[state].box}`}
        >
          <div className="flex items-start gap-3">
            {resultStyles[state].icon}
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">
                {resultStyles[state].title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{message}</p>
              {certData && state === "valid" && (
                <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-white/80 p-3.5 text-xs border border-emerald-100">
                  <div>
                    <span className="text-slate-400 block font-medium">Recipient</span>
                    <span className="font-bold text-slate-800">{certData.recipient_name || "Verified Member"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Discipline / Skill</span>
                    <span className="font-bold text-slate-800">{certData.skill || "Skill Mastery"}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-500">
        <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
        <span>Cryptographic registry checked in real-time. Tamper-evident verification.</span>
      </div>
    </div>
  );
}
