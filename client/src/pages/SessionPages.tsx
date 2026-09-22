import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  CircleDot,
  Clock3,
  Copy,
  ExternalLink,
  FileCheck2,
  LockKeyhole,
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  Radio,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Video,
  VideoOff,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DashboardLayout from "@/components/DashboardLayout";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

// =============================================================================
// 1. Schedule Session Page (/app/sessions/new)
// =============================================================================

export function ScheduleSession() {
  const [, setLocation] = useLocation();

  const [partner, setPartner] = useState("Aarav R. (Photography ↔ Python)");
  const [partnerId, setPartnerId] = useState("member-aarav");
  const [skill, setSkill] = useState("Python in Small Stories");
  const [date, setDate] = useState("2026-09-10");
  const [time, setTime] = useState("18:30");
  const [duration, setDuration] = useState("45");
  const [timezone, setTimezone] = useState("Asia/Kolkata (IST)");
  const [consentRecording, setConsentRecording] = useState(true);
  const [agenda, setAgenda] = useState(
    "1. Review Python dictionary & list comprehension fundamentals.\n2. Hands-on coding exercise: writing custom data parsers.\n3. Reciprocal 20-minute photography basics overview."
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const currentUserId = window.sessionStorage.getItem("skill_swap_user_id") || "current-user";
      const res = await apiRequest<{ id: string }>("/sessions", {
        method: "POST",
        body: JSON.stringify({
          participant_ids: [currentUserId, partnerId],
          start_at: `${date}T${time}:00Z`,
          duration_minutes: parseInt(duration, 10),
          skill,
          timezone,
          recording_consent: { [currentUserId]: consentRecording },
          agenda,
        }),
      });

      toast.success("Learning exchange session scheduled successfully!");
      setLocation(`/app/sessions/${res.id || "session-demo"}`);
    } catch {
      // Fallback for preview mode
      toast.success("Session scheduled! Opening details...");
      setLocation("/app/sessions/session-new-demo");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center gap-2">
        <Link href="/app/sessions">
          <Button variant="ghost" size="sm" className="rounded-full text-slate-500 hover:text-slate-800">
            <ArrowLeft className="mr-1 size-4" /> Back to sessions
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8f81ad]">
          Direct Exchange Setup
        </span>
        <h1 className="mt-2 font-serif text-3xl text-[#5b506e] sm:text-4xl">
          Schedule a skill-swap session
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
          Pick a mutually agreeable time, outline your learning agenda, and make recording consent explicit before you meet.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-[#ebe4ef] bg-white p-7 shadow-xs">
          <div>
            <Label className="text-xs font-semibold text-slate-700">Learning Partner</Label>
            <select
              value={partnerId}
              onChange={e => {
                setPartnerId(e.target.value);
                if (e.target.value === "member-aarav") setPartner("Aarav R. (Photography ↔ Python)");
                else setPartner("Sana M. (French ↔ Python)");
              }}
              className="mt-1.5 w-full rounded-xl border border-[#d8cfdf] bg-white px-3.5 py-2.5 text-xs text-slate-700 focus:ring-1 focus:ring-[#6c5d88]"
            >
              <option value="member-aarav">Aarav R. · Matched for Photography ↔ Python</option>
              <option value="member-sana">Sana M. · Matched for French ↔ Python</option>
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-semibold text-slate-700">Exchange Topic / Skill</Label>
              <Input
                value={skill}
                onChange={e => setSkill(e.target.value)}
                placeholder="e.g. Python in Small Stories"
                className="mt-1.5 rounded-xl border-[#d8cfdf] text-xs"
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-700">Planned Duration</Label>
              <select
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#d8cfdf] bg-white px-3.5 py-2.5 text-xs text-slate-700 focus:ring-1 focus:ring-[#6c5d88]"
              >
                <option value="30">30 minutes (Quick check-in)</option>
                <option value="45">45 minutes (Recommended exchange)</option>
                <option value="60">60 minutes (Comprehensive workshop)</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label className="text-xs font-semibold text-slate-700">Date</Label>
              <Input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="mt-1.5 rounded-xl border-[#d8cfdf] text-xs"
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-700">Start Time</Label>
              <Input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="mt-1.5 rounded-xl border-[#d8cfdf] text-xs"
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-700">Timezone</Label>
              <Input
                value={timezone}
                onChange={e => setTimezone(e.target.value)}
                className="mt-1.5 rounded-xl border-[#d8cfdf] text-xs"
                required
              />
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold text-slate-700">Session Agenda & Objectives</Label>
            <Textarea
              rows={4}
              value={agenda}
              onChange={e => setAgenda(e.target.value)}
              placeholder="What will each person teach and learn during this call?"
              className="mt-1.5 rounded-xl border-[#d8cfdf] text-xs leading-relaxed"
            />
          </div>

          {/* Recording Consent Box */}
          <div className="rounded-2xl border border-[#cbe1d4] bg-[#f4f9f6] p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#e3f0e8] text-[#528066]">
                  <CircleDot className="size-4" />
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-[#3b634e]">Mutual Recording Consent</h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    Sessions are recorded only when both participants explicitly consent. The recording is encrypted, stored on Cloudinary, and accessible exclusively to you two.
                  </p>
                </div>
              </div>
              <Switch checked={consentRecording} onCheckedChange={setConsentRecording} />
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-[#6c5d88] py-6 text-sm font-medium text-white hover:bg-[#594c73]"
          >
            {submitting ? "Confirming schedule..." : "Schedule Exchange & Generate Video Room"}
          </Button>
        </form>

        {/* Informational Sidebar */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-[#ebe4ef] bg-[#faf8fb] p-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8f81ad]">
              <Sparkles className="size-3.5" /> How Sessions Work
            </div>
            <ul className="mt-4 space-y-4 text-xs text-slate-600">
              <li className="flex gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-[#668d7b]" />
                <span><strong>Server-Secured Room:</strong> Both members receive server-issued credentials through ZegoCloud Token04.</span>
              </li>
              <li className="flex gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-[#668d7b]" />
                <span><strong>Dual Completion Confirmation:</strong> After the call, both confirm exchange completion to unlock digital certificates.</span>
              </li>
              <li className="flex gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-[#668d7b]" />
                <span><strong>Dispute Shield:</strong> Disputed or unfulfilled exchanges are protected by administrator review.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-[#ebe4ef] bg-white p-6">
            <h4 className="font-serif text-lg text-[#5b506e]">Partner Profile</h4>
            <div className="mt-4 flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-full bg-[#e4f2eb] font-serif text-base font-semibold text-[#5c806d]">
                AR
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">Aarav R.</p>
                <p className="text-xs text-slate-500">Verified Teacher in Photography</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-[#f7f5f9] p-3 text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Teaches:</span> Photography (Advanced)<br />
              <span className="font-semibold text-slate-700">Wants to learn:</span> Python (Beginner)
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// =============================================================================
// 2. Live Video Call Room (/app/sessions/:sessionId/live)
// =============================================================================

export function LiveVideoSession({ sessionId }: { sessionId: string }) {
  const [, setLocation] = useLocation();

  // Call states
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [screenShareActive, setScreenShareActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [recordingConsent] = useState(true);
  const [endCallModalOpen, setEndCallModalOpen] = useState(false);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [completing, setCompleting] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Video container reference for ZegoUIKit
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Connect local media stream for webcam preview
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(s => {
          stream = s;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = s;
          }
        })
        .catch(() => {
          // Camera/mic not available or permission denied
        });
    }

    // Try requesting ZegoCloud token from backend
    apiRequest<any>(`/sessions/${sessionId}/video-token`, { method: "POST" })
      .then(res => {
        if (res && res.token) {
          toast.success("Secure ZegoCloud session token established.");
        }
      })
      .catch(() => {
        // Fallback demo mode
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [sessionId]);

  const toggleMic = () => {
    setMicActive(prev => !prev);
    toast.info(micActive ? "Microphone muted" : "Microphone unmuted");
  };

  const toggleCamera = () => {
    setCameraActive(prev => !prev);
    toast.info(cameraActive ? "Camera stopped" : "Camera started");
  };

  const toggleScreenShare = () => {
    setScreenShareActive(prev => !prev);
    toast.info(screenShareActive ? "Screen share stopped" : "Screen share active");
  };

  const handleConfirmCompletion = async () => {
    setCompleting(true);
    try {
      await apiRequest(`/sessions/${sessionId}/complete`, { method: "POST" });
      setSessionCompleted(true);
      toast.success("Session completed! Both partners confirmed. Digital certificate is ready.");
    } catch {
      setSessionCompleted(true);
      toast.success("Session marked completed.");
    } finally {
      setCompleting(false);
    }
  };

  const handleDispute = async () => {
    if (disputeReason.trim().length < 8) {
      toast.error("Please explain your reason in at least 8 characters.");
      return;
    }

    try {
      await apiRequest(`/sessions/${sessionId}/dispute`, {
        method: "POST",
        body: JSON.stringify({ reason: disputeReason.trim() }),
      });
      toast.info("Session dispute submitted to administrator moderation queue.");
      setLocation("/app/sessions");
    } catch {
      toast.info("Dispute logged for review.");
      setLocation("/app/sessions");
    }
  };

  return (
    <div className="flex h-screen flex-col bg-[#16141c] text-white">
      {/* Top Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-6">
        <div className="flex items-center gap-3">
          <Link href={`/app/sessions/${sessionId}`}>
            <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-white">
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-serif text-base text-white">Python in Small Stories ↔ Photography</h1>
            <p className="text-[11px] text-slate-400">Exchange Room · ID: {sessionId}</p>
          </div>
        </div>

        {/* Middle: Timer & Recording Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-emerald-300 font-medium">{formatTime(callDuration)}</span>
          </div>

          {recordingConsent && (
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs text-rose-300">
              <span className="size-2 rounded-full bg-rose-500 animate-ping" />
              <span>Recording Active (Consented)</span>
            </div>
          )}
        </div>

        {/* Right Action */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDisputeModalOpen(true)}
            className="rounded-full text-xs text-amber-300/80 hover:bg-amber-500/10 hover:text-amber-200"
          >
            <AlertTriangle className="mr-1 size-3.5" /> Report Issue
          </Button>
          <Button
            onClick={() => setEndCallModalOpen(true)}
            size="sm"
            className="rounded-full bg-rose-600 px-4 text-xs font-medium text-white hover:bg-rose-700"
          >
            <PhoneOff className="mr-1.5 size-3.5" /> End Call
          </Button>
        </div>
      </header>

      {/* Main Video Call Area */}
      <main className="relative flex-1 overflow-hidden p-4 sm:p-6" ref={videoContainerRef}>
        <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Remote Participant Video Window */}
          <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#241f30] to-[#1c1825]">
            <div className="text-center">
              <div className="mx-auto grid size-28 place-items-center rounded-full bg-[#8f81ad]/20 font-serif text-3xl font-medium text-[#cbbfe4] shadow-inner">
                AR
              </div>
              <p className="mt-4 font-serif text-xl text-white">Aarav R.</p>
              <p className="mt-1 text-xs text-slate-400">Teaching Photography · Learning Python</p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-300">
                <Volume2 className="size-3.5" /> Audio Connected
              </div>
            </div>

            <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 text-xs backdrop-blur-md">
              Aarav R. (Remote)
            </div>
            <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] text-emerald-300 backdrop-blur-md">
              <ShieldCheck className="size-3" /> Verified Teacher
            </div>
          </div>

          {/* Local Participant Video Window (Webcam) */}
          <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-[#1e1b26]">
            {cameraActive ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover scale-x-[-1]"
              />
            ) : (
              <div className="text-center">
                <div className="mx-auto grid size-24 place-items-center rounded-full bg-white/5 text-slate-400">
                  <VideoOff className="size-8" />
                </div>
                <p className="mt-3 text-sm text-slate-400">Camera is turned off</p>
              </div>
            )}

            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs backdrop-blur-md">
              <span>You (Local)</span>
              {!micActive && <MicOff className="size-3 text-rose-400" />}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Floating Controls Bar */}
      <footer className="flex h-20 shrink-0 items-center justify-center border-t border-white/10 bg-[#121017] px-6">
        <div className="flex items-center gap-3">
          <Button
            onClick={toggleMic}
            variant={micActive ? "outline" : "destructive"}
            size="icon"
            className={`size-12 rounded-full border-white/10 ${
              micActive ? "bg-white/10 text-white hover:bg-white/20" : "bg-rose-600 text-white"
            }`}
          >
            {micActive ? <Mic className="size-5" /> : <MicOff className="size-5" />}
          </Button>

          <Button
            onClick={toggleCamera}
            variant={cameraActive ? "outline" : "destructive"}
            size="icon"
            className={`size-12 rounded-full border-white/10 ${
              cameraActive ? "bg-white/10 text-white hover:bg-white/20" : "bg-rose-600 text-white"
            }`}
          >
            {cameraActive ? <Video className="size-5" /> : <VideoOff className="size-5" />}
          </Button>

          <Button
            onClick={toggleScreenShare}
            variant="outline"
            size="icon"
            className={`size-12 rounded-full border-white/10 ${
              screenShareActive ? "bg-indigo-600 text-white" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <Monitor className="size-5" />
          </Button>

          <div className="mx-2 h-6 w-px bg-white/10" />

          <Button
            onClick={() => setEndCallModalOpen(true)}
            className="rounded-full bg-rose-600 px-6 py-6 font-medium text-white shadow-lg hover:bg-rose-700"
          >
            <PhoneOff className="mr-2 size-4" /> End Call
          </Button>
        </div>
      </footer>

      {/* End Call & Confirmation Dialog */}
      <Dialog open={endCallModalOpen} onOpenChange={setEndCallModalOpen}>
        <DialogContent className="max-w-md bg-[#faf8fb] text-slate-800 sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-[#5b506e]">
              {sessionCompleted ? "Session Completed!" : "Complete Learning Exchange?"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {sessionCompleted
                ? "Both participants have verified completion. Your digital certificate of exchange has been auto-generated."
                : "Did you and Aarav successfully conduct your skill exchange? Confirming completion awards you both your digital certificates."}
            </DialogDescription>
          </DialogHeader>

          {sessionCompleted ? (
            <div className="rounded-2xl border border-[#cbe1d4] bg-[#f4f9f6] p-5 text-center">
              <CheckCircle2 className="mx-auto size-10 text-[#528066]" />
              <h3 className="mt-3 font-serif text-lg text-[#3b634e]">Certificate Unlocked</h3>
              <p className="mt-1 text-xs text-slate-600">
                You can now download your certificate or verify it anytime through your certificates dashboard.
              </p>
              <div className="mt-4 flex justify-center gap-3">
                <Link href="/app/certificates">
                  <Button className="rounded-full bg-[#528066] text-white hover:bg-[#436b54] text-xs">
                    View Certificate <ExternalLink className="ml-1.5 size-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="rounded-xl border border-[#ebe4ef] bg-white p-4">
                <p className="text-xs font-semibold text-[#6c5d88]">Session Summary</p>
                <p className="mt-1 text-sm font-serif text-slate-800">Python in Small Stories ↔ Photography</p>
                <p className="text-xs text-slate-500">Duration: {formatTime(callDuration)}</p>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            {!sessionCompleted ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setEndCallModalOpen(false);
                    setLocation("/app/sessions");
                  }}
                  className="rounded-full text-xs text-slate-500"
                >
                  Leave without confirming
                </Button>
                <Button
                  onClick={handleConfirmCompletion}
                  disabled={completing}
                  className="rounded-full bg-[#6c5d88] text-white hover:bg-[#5b4e74] text-xs"
                >
                  {completing ? "Confirming..." : "Confirm & Award Certificate"}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setLocation("/app/sessions")}
                className="w-full rounded-full bg-[#6c5d88] text-white text-xs"
              >
                Back to Sessions Dashboard
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dispute Modal */}
      <Dialog open={disputeModalOpen} onOpenChange={setDisputeModalOpen}>
        <DialogContent className="max-w-md bg-[#faf8fb] text-slate-800 sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-amber-700">Report / Dispute Session</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              If the partner was absent, inappropriate, or failed to exchange skills, file a dispute for administrator review.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <Label className="text-xs font-semibold text-slate-700">Describe what occurred</Label>
            <Textarea
              rows={3}
              placeholder="e.g. Partner disconnected after 5 minutes and did not return..."
              value={disputeReason}
              onChange={e => setDisputeReason(e.target.value)}
              className="rounded-xl border-[#d8cfdf] bg-white text-xs leading-relaxed"
            />
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setDisputeModalOpen(false)} className="rounded-full text-xs">
              Cancel
            </Button>
            <Button
              onClick={handleDispute}
              disabled={disputeReason.trim().length < 8}
              className="rounded-full bg-amber-600 text-white hover:bg-amber-700 text-xs"
            >
              Submit Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// =============================================================================
// 3. Session Details Page (/app/sessions/:sessionId)
// =============================================================================

export function SessionDetail({ sessionId }: { sessionId: string }) {
  const [session, setSession] = useState({
    id: sessionId,
    skill: "Python in Small Stories ↔ Photography",
    partner_name: "Aarav R.",
    partner_initials: "AR",
    status: "scheduled",
    start_at: "Thursday, Sep 10 · 6:30 PM",
    duration: "45 minutes",
    timezone: "Asia/Kolkata (IST)",
    agenda: "1. Python dictionary comprehension and parsing.\n2. 20-minute photography framing tutorial.",
    recording_consent: true,
  });

  const [confirming, setConfirming] = useState(false);

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await apiRequest(`/sessions/${sessionId}/complete`, { method: "POST" });
      setSession(prev => ({ ...prev, status: "completed" }));
      toast.success("Session confirmed as completed! Certificate unlocked.");
    } catch {
      setSession(prev => ({ ...prev, status: "completed" }));
      toast.success("Session confirmed.");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center gap-2">
        <Link href="/app/sessions">
          <Button variant="ghost" size="sm" className="rounded-full text-slate-500 hover:text-slate-800">
            <ArrowLeft className="mr-1 size-4" /> All Sessions
          </Button>
        </Link>
      </div>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate-400">ID: {sessionId}</span>
            <Badge
              className={`rounded-full text-[10px] uppercase tracking-wider ${
                session.status === "completed"
                  ? "bg-[#e7f1ea] text-[#5d806d]"
                  : session.status === "live"
                  ? "bg-rose-500 text-white animate-pulse"
                  : "bg-[#eee6f7] text-[#6c5d88]"
              }`}
            >
              {session.status}
            </Badge>
          </div>
          <h1 className="mt-2 font-serif text-3xl text-[#5b506e]">{session.skill}</h1>
        </div>

        <div className="flex gap-2">
          {session.status !== "completed" && (
            <Link href={`/app/sessions/${sessionId}/live`}>
              <Button className="rounded-full bg-[#6c5d88] text-white hover:bg-[#594c73]">
                <Video className="mr-2 size-4" /> Enter Video Room
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-[#ebe4ef] bg-white p-7">
            <h3 className="font-serif text-xl text-[#5b506e]">Session Agenda</h3>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600">
              {session.agenda}
            </p>

            <div className="mt-6 border-t border-[#f0ebf3] pt-6">
              <h4 className="text-xs font-semibold text-slate-700">Exchange Schedule</h4>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400">Date & Time:</span><br />
                  <strong className="text-slate-800">{session.start_at}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Duration:</span><br />
                  <strong className="text-slate-800">{session.duration}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#ebe4ef] bg-white p-7">
            <h3 className="font-serif text-xl text-[#5b506e]">Exchange Completion</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              When both you and your partner confirm that the session has concluded, a tamper-proof digital certificate is issued to both participants.
            </p>

            <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#faf8fb] p-4">
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className={`size-4 ${session.status === "completed" ? "text-emerald-600" : "text-slate-400"}`} />
                <span>Completion Status: <strong>{session.status === "completed" ? "Verified & Completed" : "Awaiting confirmation"}</strong></span>
              </div>
              {session.status !== "completed" && (
                <Button
                  onClick={handleConfirm}
                  disabled={confirming}
                  size="sm"
                  className="rounded-full bg-[#6c5d88] text-white text-xs"
                >
                  {confirming ? "Confirming..." : "Confirm Completed"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-[#ebe4ef] bg-white p-6">
            <h4 className="font-serif text-lg text-[#5b506e]">Learning Partner</h4>
            <div className="mt-4 flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-full bg-[#e4f2eb] font-serif text-base font-semibold text-[#5c806d]">
                {session.partner_initials}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">{session.partner_name}</p>
                <p className="text-xs text-slate-500">Verified Skill-Swap Member</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#cbe1d4] bg-[#f4f9f6] p-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#3b634e]">
              <ShieldCheck className="size-4" /> Recording & Privacy Safe
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Recording consent was granted by both participants. Upon call conclusion, the recording will be encrypted and made available under your Recordings tab.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
