import { FormEvent, useState } from "react";
import {
  AlertCircle,
  Check,
  FileCheck2,
  Loader2,
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

  const verify = async (event: FormEvent) => {
    event.preventDefault();
    const value = certificate.trim();
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
        setMessage("No certificate was found with that verification number.");
        return;
      }
      if (!response.ok) {
        setState("unavailable");
        setMessage(
          "The verification service could not complete the request. Please try again shortly."
        );
        return;
      }
      const data = (await response.json()) as {
        status?: string;
        skill?: string;
        certificate_no?: string;
      };
      const next =
        data.status === "revoked"
          ? "revoked"
          : data.status === "expired"
            ? "expired"
            : "valid";
      setState(next);
      setMessage(
        next === "valid"
          ? `This is a valid Skill-Swap certificate${data.skill ? ` for ${data.skill}` : ""}.`
          : next === "revoked"
            ? "This certificate has been revoked by an administrator."
            : "This certificate is no longer active."
      );
    } catch {
      setState("unavailable");
      setMessage(
        "The verification service is temporarily unavailable. Please try again shortly."
      );
    }
  };

  const resultStyles: Record<
    Exclude<VerificationState, "idle" | "loading">,
    { box: string; icon: React.ReactNode; title: string }
  > = {
    valid: {
      box: "border-[#cfe4d7] bg-[#eef7f0]",
      icon: <Check className="size-5 text-[#5f8d72]" />,
      title: "Certificate verified",
    },
    revoked: {
      box: "border-[#efcaca] bg-[#fff3f2]",
      icon: <XCircle className="size-5 text-[#b46769]" />,
      title: "Certificate revoked",
    },
    expired: {
      box: "border-[#ead7bf] bg-[#fff8ec]",
      icon: <AlertCircle className="size-5 text-[#ad8355]" />,
      title: "Certificate expired",
    },
    not_found: {
      box: "border-[#e7e1eb] bg-[#f7f5f8]",
      icon: <FileCheck2 className="size-5 text-[#8f81ad]" />,
      title: "Certificate not found",
    },
    unavailable: {
      box: "border-[#e7e1eb] bg-[#f7f5f8]",
      icon: <AlertCircle className="size-5 text-[#8f81ad]" />,
      title: "Verification unavailable",
    },
  };

  return (
    <div className="mx-auto max-w-2xl rounded-[1.75rem] border border-white/80 bg-white/56 p-8 shadow-[0_20px_60px_rgba(117,98,145,0.08)] sm:p-12">
      <div className="grid size-14 place-items-center rounded-2xl bg-[#eee6f7] text-[#6c5d88]">
        <FileCheck2 className="size-6" />
      </div>
      <h2 className="mt-8 font-serif text-3xl text-[#61567d]">
        Certificate lookup
      </h2>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        Use the number shown on the certificate or follow a recipient’s secure
        validation link.
      </p>
      <form onSubmit={verify} className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Input
          value={certificate}
          onChange={event => {
            setCertificate(event.target.value);
            setState("idle");
          }}
          placeholder="e.g. SS-2026-00481"
          className="h-12 rounded-xl border-white bg-white/75"
          aria-label="Certificate number"
        />
        <Button
          type="submit"
          disabled={state === "loading"}
          className="h-12 rounded-xl bg-[#6c5d88] text-white"
        >
          {state === "loading" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Check status"
          )}
        </Button>
      </form>
      {state !== "idle" && state !== "loading" && (
        <div
          className={`mt-8 rounded-2xl border p-5 ${resultStyles[state].box}`}
        >
          <div className="flex items-start gap-3">
            {resultStyles[state].icon}
            <div>
              <p className="font-medium text-slate-700">
                {resultStyles[state].title}
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{message}</p>
            </div>
          </div>
        </div>
      )}
      <div className="mt-10 flex gap-3 border-t border-[#e5dee9] pt-6 text-xs leading-6 text-slate-500">
        <ShieldCheck className="size-4 shrink-0 text-[#668d7b]" /> Certificate
        data is public only to the extent defined by the recipient’s privacy
        settings.
      </div>
    </div>
  );
}
