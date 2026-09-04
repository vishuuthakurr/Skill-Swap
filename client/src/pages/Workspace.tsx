import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  FileCheck2,
  Flag,
  LockKeyhole,
  MessageCircle,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/DashboardLayout";
import { apiRequest } from "@/lib/api";

const activity = [
  {
    icon: ShieldCheck,
    title: "Your Python teaching assessment is ready",
    meta: "A 30–40 question check-in · 4 min",
    color: "text-[#668d7b] bg-[#e7f1ea]",
  },
  {
    icon: UsersRound,
    title: "Three exchanges fit your profile",
    meta: "Based on your learning constellation",
    color: "text-[#8f81ad] bg-[#eee6f7]",
  },
  {
    icon: CalendarDays,
    title: "Keep a little room on Thursday",
    meta: "You have an upcoming session",
    color: "text-[#9b7390] bg-[#f8e8ee]",
  },
];
const matches = [
  {
    initials: "AR",
    name: "Aarav R.",
    teaches: "Photography",
    learns: "Python",
    fit: "92%",
    tone: "bg-[#e4f2eb] text-[#5c806d]",
  },
  {
    initials: "SM",
    name: "Sana M.",
    teaches: "French",
    learns: "Public speaking",
    fit: "86%",
    tone: "bg-[#f8e8ee] text-[#946e83]",
  },
  {
    initials: "VK",
    name: "Vikram K.",
    teaches: "UI design",
    learns: "Excel",
    fit: "81%",
    tone: "bg-[#eee6f7] text-[#6c5d88]",
  },
];

function WorkspaceHeader({
  eyebrow,
  title,
  copy,
  action,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 border-b border-white/75 pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8f81ad]">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-serif text-4xl tracking-[-0.03em] text-[#5b506e]">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          {copy}
        </p>
      </div>
      {action}
    </div>
  );
}

function SoftCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[1.4rem] border border-white/80 bg-white/55 shadow-[0_12px_34px_rgba(117,98,145,0.06)] ${className}`}
    >
      {children}
    </div>
  );
}
function AvatarBubble({
  initials,
  tone = "bg-[#eee6f7] text-[#6c5d88]",
}: {
  initials: string;
  tone?: string;
}) {
  return (
    <span
      className={`grid size-10 place-items-center rounded-full text-xs font-semibold ${tone}`}
    >
      {initials}
    </span>
  );
}

export function MemberDashboard() {
  return (
    <DashboardLayout>
      <WorkspaceHeader
        eyebrow="Tuesday, September 04"
        title="Good morning, Vaibhav."
        copy="A small, clear view of the exchanges waiting for your attention."
        action={
          <Button className="rounded-full bg-[#6c5d88] text-white hover:bg-[#5d5077]">
            Complete your profile <ArrowUpRight className="ml-2 size-4" />
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SoftCard className="p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
            Profile rhythm
          </p>
          <p className="mt-4 font-serif text-3xl text-[#61567d]">72%</p>
          <Progress
            value={72}
            className="mt-4 h-1.5 bg-[#eeeaf1] [&>div]:bg-[#8f81ad]"
          />
          <p className="mt-3 text-xs text-slate-500">
            Add your availability next
          </p>
        </SoftCard>
        <SoftCard className="p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
            Verified skills
          </p>
          <p className="mt-4 font-serif text-3xl text-[#526e62]">02</p>
          <p className="mt-4 text-xs text-slate-500">Python · Excel</p>
        </SoftCard>
        <SoftCard className="p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
            New possibilities
          </p>
          <p className="mt-4 font-serif text-3xl text-[#795d72]">03</p>
          <p className="mt-4 text-xs text-slate-500">
            Reciprocal matches this week
          </p>
        </SoftCard>
        <SoftCard className="p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
            Next session
          </p>
          <p className="mt-4 font-serif text-3xl text-[#6c5d88]">Thu</p>
          <p className="mt-4 text-xs text-slate-500">Photography · 6:30 PM</p>
        </SoftCard>
      </div>
      <div className="mt-7 grid gap-7 xl:grid-cols-[1.2fr_.8fr]">
        <SoftCard className="p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                Suggested for you
              </p>
              <h2 className="mt-2 font-serif text-2xl text-[#61567d]">
                A few good fits
              </h2>
            </div>
            <Link
              href="/app/matches/discover"
              className="text-xs text-[#6c5d88]"
            >
              See all <ArrowUpRight className="ml-1 inline size-3" />
            </Link>
          </div>
          <div className="mt-7 space-y-3">
            {matches.map(match => (
              <div
                key={match.name}
                className="flex flex-col gap-4 rounded-2xl border border-white bg-white/55 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <AvatarBubble initials={match.initials} tone={match.tone} />
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {match.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      teaches{" "}
                      <span className="text-[#6c5d88]">{match.teaches}</span> ·
                      learns{" "}
                      <span className="text-[#668d7b]">{match.learns}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <span className="rounded-full bg-[#eef7f0] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#5d806d]">
                    {match.fit} fit
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-[#d8cfdf] bg-white/50 text-[#6c5d88]"
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SoftCard>
        <SoftCard className="p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-[#f8e8ee] text-[#946e83]">
              <Bell className="size-4" />
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                Your next note
              </p>
              <h2 className="mt-1 font-serif text-2xl text-[#795d72]">
                Stay in the loop
              </h2>
            </div>
          </div>
          <div className="mt-7 space-y-5">
            {activity.map(item => (
              <div key={item.title} className="flex gap-3">
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-full ${item.color}`}
                >
                  <item.icon className="size-4" />
                </span>
                <div>
                  <p className="text-sm leading-5 text-slate-700">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {item.meta}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/app/notifications"
            className="mt-7 inline-block text-xs text-[#6c5d88]"
          >
            Open notifications <ArrowUpRight className="ml-1 inline size-3" />
          </Link>
        </SoftCard>
      </div>
    </DashboardLayout>
  );
}

export function MySkills() {
  return (
    <DashboardLayout>
      <WorkspaceHeader
        eyebrow="Your learning constellation"
        title="My skills"
        copy="Keep the exchange balanced: the things you can share, and the things you are ready to explore."
        action={
          <Button className="rounded-full bg-[#6c5d88] text-white">
            Add a skill <ArrowUpRight className="ml-2 size-4" />
          </Button>
        }
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <SoftCard className="p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#668d7b]">
                I can teach
              </p>
              <h2 className="mt-2 font-serif text-2xl text-[#526e62]">
                With confidence
              </h2>
            </div>
            <ShieldCheck className="size-5 text-[#668d7b]" />
          </div>
          <div className="mt-7 space-y-3">
            {[
              { name: "Python", level: "Intermediate", verified: true },
              { name: "Excel", level: "Comfortable", verified: true },
              { name: "Public speaking", level: "Growing", verified: false },
            ].map(skill => (
              <div
                key={skill.name}
                className="flex items-center justify-between rounded-2xl border border-white bg-white/55 p-4"
              >
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    {skill.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{skill.level}</p>
                </div>
                {skill.verified ? (
                  <Badge className="rounded-full bg-[#e7f1ea] text-[10px] font-medium text-[#5d806d] hover:bg-[#e7f1ea]">
                    <Check className="mr-1 size-3" /> Verified Teacher
                  </Badge>
                ) : (
                  <Link href={`/app/assessments/${encodeURIComponent(skill.name.toLowerCase().replace(/\s+/g, "-"))}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full border-[#d8cfdf] bg-white/50 text-xs text-[#6c5d88] hover:bg-[#eee6f7]"
                    >
                      Take assessment
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </SoftCard>
        <SoftCard className="p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#9b7390]">
                I want to learn
              </p>
              <h2 className="mt-2 font-serif text-2xl text-[#795d72]">
                With curiosity
              </h2>
            </div>
            <Sparkles className="size-5 text-[#9b7390]" />
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            {["Photography", "French", "UI design", "Yoga"].map(skill => (
              <span
                key={skill}
                className="rounded-full border border-white bg-[#f8edf3] px-4 py-2 text-sm text-[#795d72]"
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-[#f5f1f7] p-5">
            <p className="text-sm font-medium text-[#61567d]">
              A useful next step
            </p>
            <p className="mt-2 text-xs leading-6 text-slate-600">
              Add the times you are usually free. Availability helps us make
              matches that can actually meet.
            </p>
            <Button
              variant="link"
              className="mt-2 h-auto p-0 text-xs text-[#6c5d88]"
            >
              Set availability <ArrowUpRight className="ml-1 size-3" />
            </Button>
          </div>
        </SoftCard>
      </div>
    </DashboardLayout>
  );
}

export function DiscoverMatches() {
  const [query, setQuery] = useState("");
  const visible = useMemo(
    () =>
      matches.filter(match =>
        `${match.name} ${match.teaches} ${match.learns}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query]
  );
  return (
    <DashboardLayout>
      <WorkspaceHeader
        eyebrow="Reciprocal possibilities"
        title="Discover matches"
        copy="These suggestions are explainable by design: see the skill you can share, the one they want to learn, and the common ground in between."
        action={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search matches"
              className="h-10 w-full rounded-full border-white bg-white/70 pl-9 sm:w-56"
            />
          </div>
        }
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {visible.map(match => (
          <SoftCard key={match.name} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <AvatarBubble initials={match.initials} tone={match.tone} />
                <div>
                  <h2 className="font-serif text-2xl text-[#61567d]">
                    {match.name}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    online this week · {match.fit} match fit
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-slate-400"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </div>
            <div className="mt-7 grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-2xl bg-white/65 p-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.18em] text-slate-500">
                  You offer
                </p>
                <p className="mt-2 text-sm font-medium text-[#6c5d88]">
                  {match.learns}
                </p>
              </div>
              <span className="text-[#b5a8c5">↔</span>
              <div className="text-right">
                <p className="text-[9px] uppercase tracking-[0.18em] text-slate-500">
                  They offer
                </p>
                <p className="mt-2 text-sm font-medium text-[#668d7b]">
                  {match.teaches}
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-600">
              Your learning goal meets their verified teaching skill, and your
              availability looks close enough for a calm weekly rhythm.
            </p>
            <div className="mt-6 flex gap-3">
              <Button className="rounded-full bg-[#6c5d88] text-white">
                Send a request <ArrowUpRight className="ml-2 size-4" />
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-[#d8cfdf] bg-white/50 text-[#6c5d88]"
              >
                View profile
              </Button>
            </div>
          </SoftCard>
        ))}
      </div>
    </DashboardLayout>
  );
}

export function Messages() {
  return (
    <DashboardLayout>
      <WorkspaceHeader
        eyebrow="A private place to begin"
        title="Conversations"
        copy="Your messages open only after a match is accepted. Take your time, ask a good first question, and decide together when to meet."
        action={
          <Button className="rounded-full bg-[#6c5d88] text-white">
            Find a match <Search className="ml-2 size-4" />
          </Button>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <SoftCard className="p-3">
          <div className="border-b border-[#eee8f0] p-4">
            <Input
              placeholder="Search conversations"
              className="h-10 rounded-full border-white bg-white/65"
            />
          </div>
          {matches.map((match, index) => (
            <div
              key={match.name}
              className={`flex items-center gap-3 rounded-2xl p-4 ${index === 0 ? "bg-[#eee6f7]/60" : "hover:bg-white/60"}`}
            >
              <AvatarBubble initials={match.initials} tone={match.tone} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-medium text-slate-700">
                    {match.name}
                  </p>
                  <span className="text-[10px] text-slate-400">10:42</span>
                </div>
                <p className="mt-1 truncate text-xs text-slate-500">
                  Ready when you are — shall we compare notes?
                </p>
              </div>
            </div>
          ))}
        </SoftCard>
        <SoftCard className="flex min-h-[430px] flex-col p-6 sm:p-8">
          <div className="flex items-center gap-3 border-b border-[#eee8f0] pb-5">
            <AvatarBubble initials="AR" tone="bg-[#e4f2eb] text-[#5c806d]" />
            <div>
              <h2 className="font-serif text-2xl text-[#61567d]">Aarav R.</h2>
              <p className="mt-1 text-xs text-slate-500">
                <span className="mr-1 inline-block size-1.5 rounded-full bg-[#72a589]" />{" "}
                online · Photography ↔ Python
              </p>
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-end gap-3 py-6">
            <div className="max-w-[80%] self-start rounded-2xl rounded-bl-sm bg-white/80 px-4 py-3 text-sm leading-6 text-slate-600">
              Hi Vaibhav — I saw you are exploring photography. I could share a
              few ways to start with light and composition.
            </div>
            <div className="max-w-[80%] self-end rounded-2xl rounded-br-sm bg-[#eee6f7] px-4 py-3 text-sm leading-6 text-[#675978]">
              That sounds lovely. I can show you how I use Python to make small
              data stories if that feels useful.
            </div>
            <p className="text-center text-[10px] uppercase tracking-[0.18em] text-slate-400">
              Aarav is typing…
            </p>
          </div>
          <div className="flex gap-3 border-t border-[#eee8f0] pt-5">
            <Input
              placeholder="Write a thoughtful message"
              className="h-11 rounded-full border-white bg-white/70"
            />
            <Button className="size-11 shrink-0 rounded-full bg-[#6c5d88] p-0 text-white">
              <ArrowUpRight className="size-4" />
            </Button>
          </div>
        </SoftCard>
      </div>
    </DashboardLayout>
  );
}

export function Sessions() {
  const [remoteSessions, setRemoteSessions] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    apiRequest<any>("/sessions")
      .then((data) => {
        if (!isMounted) return;
        const list = Array.isArray(data)
          ? data
          : data?.sessions || data?.data || [];
        if (list.length > 0) {
          setRemoteSessions(list);
        }
      })
      .catch(() => {
        // Sample fallback active
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DashboardLayout>
      <WorkspaceHeader
        eyebrow="Make a little room"
        title="Sessions"
        copy="See what is coming up, prepare for the conversation, and keep a clear record of what you shared."
        action={
          <Link href="/app/sessions/new">
            <Button className="rounded-full bg-[#6c5d88] text-white hover:bg-[#5c4e75]">
              Schedule a session <CalendarDays className="ml-2 size-4" />
            </Button>
          </Link>
        }
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {remoteSessions.length > 0 ? (
          remoteSessions.map((session) => {
            const sid = session._id || session.id || "live";
            const isCompleted = session.status === "completed";
            const isLive = session.status === "in_progress";
            return (
              <SoftCard key={sid} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge
                      className={`rounded-full text-[10px] uppercase tracking-[0.15em] ${
                        isCompleted
                          ? "bg-[#e7f1ea] text-[#5d806d] hover:bg-[#e7f1ea]"
                          : isLive
                          ? "bg-[#fde2e4] text-[#b93850] hover:bg-[#fde2e4] animate-pulse"
                          : "bg-[#f8e8ee] text-[#946e83] hover:bg-[#f8e8ee]"
                      }`}
                    >
                      {session.status || "Upcoming"}
                    </Badge>
                    <h2 className="mt-5 font-serif text-2xl text-[#61567d]">
                      {session.topic || session.skill_name || "Skill Exchange Session"}
                    </h2>
                  </div>
                  <Clock3 className="size-5 text-[#9b7390]" />
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <AvatarBubble
                    initials={(session.partner_name || "SW").slice(0, 2).toUpperCase()}
                    tone="bg-[#e4f2eb] text-[#5c806d]"
                  />
                  <div>
                    <p className="text-sm text-slate-700">
                      with {session.partner_name || "Exchange Partner"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {session.scheduled_time || session.time || "Upcoming"} · {session.duration_minutes || 45} mins
                    </p>
                  </div>
                </div>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href={`/app/sessions/${sid}`}>
                    <Button variant="outline" className="rounded-full border-[#d8cfdf] bg-white/50 text-[#6c5d88]">
                      View details
                    </Button>
                  </Link>
                  {!isCompleted && (
                    <Link href={`/app/sessions/${sid}/live`}>
                      <Button className="rounded-full bg-[#6c5d88] text-white hover:bg-[#5c4e75]">
                        Join Room <Video className="ml-2 size-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </SoftCard>
            );
          })
        ) : (
          <>
            <SoftCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="rounded-full bg-[#f8e8ee] text-[10px] uppercase tracking-[0.15em] text-[#946e83] hover:bg-[#f8e8ee]">
                    Upcoming
                  </Badge>
                  <h2 className="mt-5 font-serif text-2xl text-[#61567d]">
                    Photography for everyday eyes
                  </h2>
                </div>
                <Clock3 className="size-5 text-[#9b7390]" />
              </div>
              <div className="mt-6 flex items-center gap-3">
                <AvatarBubble initials="AR" tone="bg-[#e4f2eb] text-[#5c806d]" />
                <div>
                  <p className="text-sm text-slate-700">with Aarav R.</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Thursday · 6:30 PM–7:15 PM · IST
                  </p>
                </div>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/app/sessions/sess-photography-01">
                  <Button
                    variant="outline"
                    className="rounded-full border-[#d8cfdf] bg-white/50 text-[#6c5d88]"
                  >
                    View details
                  </Button>
                </Link>
                <Link href="/app/sessions/sess-photography-01/live">
                  <Button className="rounded-full bg-[#6c5d88] text-white hover:bg-[#5c4e75]">
                    Join Video Call <Video className="ml-2 size-4" />
                  </Button>
                </Link>
              </div>
            </SoftCard>
            <SoftCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="rounded-full bg-[#e7f1ea] text-[10px] uppercase tracking-[0.15em] text-[#5d806d] hover:bg-[#e7f1ea]">
                    Completed
                  </Badge>
                  <h2 className="mt-5 font-serif text-2xl text-[#61567d]">
                    Python in small stories
                  </h2>
                </div>
                <FileCheck2 className="size-5 text-[#668d7b]" />
              </div>
              <div className="mt-6 flex items-center gap-3">
                <AvatarBubble initials="VK" tone="bg-[#eee6f7] text-[#6c5d88]" />
                <div>
                  <p className="text-sm text-slate-700">with Vikram K.</p>
                  <p className="mt-1 text-xs text-slate-500">
                    August 28 · Certificate issued
                  </p>
                </div>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/app/sessions/sess-python-02">
                  <Button
                    variant="outline"
                    className="rounded-full border-[#d8cfdf] bg-white/50 text-[#6c5d88]"
                  >
                    View details
                  </Button>
                </Link>
                <Link href="/app/certificates">
                  <Button
                    variant="ghost"
                    className="rounded-full text-[#6c5d88] hover:bg-[#eee6f7]"
                  >
                    View certificate
                  </Button>
                </Link>
              </div>
            </SoftCard>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export function Certificates() {
  const [remoteCertificates, setRemoteCertificates] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    apiRequest<any>("/certificates")
      .then((data) => {
        if (!isMounted) return;
        const list = Array.isArray(data)
          ? data
          : data?.certificates || data?.data || [];
        if (list.length > 0) {
          setRemoteCertificates(list);
        }
      })
      .catch(() => {
        // Fallback to sample
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DashboardLayout>
      <WorkspaceHeader
        eyebrow="Proof of progress"
        title="Certificates"
        copy="A quiet archive of the exchanges and verified credentials you have earned. Each certificate has a public validation link."
        action={
          <Link href="/verify-certificate">
            <Button
              variant="outline"
              className="rounded-full border-[#d8cfdf] bg-white/50 text-[#6c5d88] hover:bg-[#eee6f7]"
            >
              Verify one <ShieldCheck className="ml-2 size-4" />
            </Button>
          </Link>
        }
      />
      <div className="grid gap-5 md:grid-cols-2">
        {remoteCertificates.length > 0 ? (
          remoteCertificates.map((cert) => {
            const isTeacher = cert.type === "teacher_verification";
            const token = cert.verification_token || cert.certificate_no;
            const issuedDate = cert.issued_at
              ? new Date(cert.issued_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Recently issued";

            return (
              <SoftCard key={cert.certificate_no} className="overflow-hidden">
                <div
                  className={`p-8 ${
                    isTeacher
                      ? "bg-gradient-to-br from-[#e4f2eb] via-[#f4f9f6] to-[#eee6f7]"
                      : "bg-gradient-to-br from-[#eee6f7] via-[#f8e8ee] to-[#e5f2eb]"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <Sparkles className="size-5 text-[#6c5d88]" />
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6c5d88]">
                      {cert.certificate_no}
                    </span>
                  </div>
                  <p className="mt-14 text-[10px] uppercase tracking-[0.24em] text-[#6c5d88]">
                    {isTeacher
                      ? "Verified Teacher Credential"
                      : "Certificate of completed exchange"}
                  </p>
                  <h2 className="mt-2 font-serif text-3xl text-[#5b506e]">
                    {cert.skill || "Skill Exchange"}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {isTeacher
                      ? `Score: ${cert.score || 70}% · Verified Teacher Mark · ${issuedDate}`
                      : `A verified peer learning exchange · ${issuedDate}`}
                  </p>
                </div>
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-2 text-xs text-[#5d806d]">
                    <ShieldCheck className="size-4" /> Valid & Verified
                  </div>
                  <Link href={`/verify-certificate?token=${token}`}>
                    <Button variant="ghost" className="text-xs text-[#6c5d88]">
                      Public check <ChevronRight className="ml-1 size-3" />
                    </Button>
                  </Link>
                </div>
              </SoftCard>
            );
          })
        ) : (
          <>
            <SoftCard className="overflow-hidden">
              <div className="bg-gradient-to-br from-[#eee6f7] via-[#f8e8ee] to-[#e5f2eb] p-8">
                <div className="flex items-start justify-between">
                  <Sparkles className="size-5 text-[#6c5d88]" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6c5d88]">
                    SS-2026-00481
                  </span>
                </div>
                <p className="mt-16 text-[10px] uppercase tracking-[0.24em] text-[#6c5d88]">
                  Certificate of completed exchange
                </p>
                <h2 className="mt-3 font-serif text-3xl text-[#5b506e]">
                  Python in small stories
                </h2>
                <p className="mt-3 text-sm text-slate-600">
                  A verified learning exchange · August 28, 2026
                </p>
              </div>
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-2 text-xs text-[#5d806d]">
                  <ShieldCheck className="size-4" /> Valid certificate
                </div>
                <Link href="/verify-certificate?token=SS-2026-00481">
                  <Button variant="ghost" className="text-xs text-[#6c5d88]">
                    Public check <ChevronRight className="ml-1 size-3" />
                  </Button>
                </Link>
              </div>
            </SoftCard>
            <SoftCard className="flex min-h-[285px] flex-col items-center justify-center border-dashed p-8 text-center">
              <span className="grid size-12 place-items-center rounded-full bg-[#f5f1f7] text-[#b3a7c5]">
                <FileCheck2 className="size-5" />
              </span>
              <h2 className="mt-5 font-serif text-2xl text-[#61567d]">
                Your next one begins with an assessment.
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
                Pass a 35-question teacher assessment or complete a skill exchange to mint your verified certificate.
              </p>
              <Link href="/app/assessments/python">
                <Button variant="link" className="mt-3 text-[#6c5d88]">
                  Take an assessment <ArrowUpRight className="ml-1 size-3" />
                </Button>
              </Link>
            </SoftCard>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export function Notifications() {
  return (
    <DashboardLayout>
      <WorkspaceHeader
        eyebrow="Small notes, in one place"
        title="Notifications"
        copy="Stay connected to the people, sessions, and decisions that shape your exchange."
      />
      <div className="mx-auto max-w-3xl space-y-3">
        {[
          {
            label: "New match suggestion",
            copy: "Aarav R. could be a good fit for your Photography ↔ Python exchange.",
            time: "12 min ago",
            icon: UsersRound,
          },
          {
            label: "Session reminder",
            copy: "Your Photography session begins Thursday at 6:30 PM.",
            time: "Yesterday",
            icon: CalendarDays,
          },
          {
            label: "Certificate ready",
            copy: "Your certificate for Python in small stories is ready to view.",
            time: "Aug 28",
            icon: FileCheck2,
          },
        ].map(item => (
          <SoftCard key={item.label} className="flex gap-4 p-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#eee6f7] text-[#6c5d88]">
              <item.icon className="size-4" />
            </span>
            <div className="flex-1">
              <div className="flex flex-col justify-between gap-1 sm:flex-row">
                <p className="text-sm font-medium text-slate-700">
                  {item.label}
                </p>
                <span className="text-xs text-slate-400">{item.time}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {item.copy}
              </p>
            </div>
          </SoftCard>
        ))}
      </div>
    </DashboardLayout>
  );
}

export function Profile() {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploadState, setUploadState] = useState("");
  const uploadAvatar = async (file: File) => {
    const form = new FormData();
    form.append("avatar", file);
    try {
      setUploadState("Uploading…");
      const result = await apiRequest<{
        avatar: { url?: string; public_id?: string };
      }>("/profile/avatar", { method: "POST", body: form, headers: {} });
      setAvatarUrl(result.avatar.url || "");
      setUploadState("Avatar updated");
    } catch (caught) {
      setUploadState(
        caught instanceof Error ? caught.message : "Avatar upload failed."
      );
    }
  };
  return (
    <DashboardLayout>
      <WorkspaceHeader
        eyebrow="Your public shape"
        title="Profile & settings"
        copy="Choose what people see before a match, and keep the rest of your learning space private."
        action={
          <Button className="rounded-full bg-[#6c5d88] text-white">
            Save changes <Check className="ml-2 size-4" />
          </Button>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[.7fr_1.3fr]">
        <SoftCard className="p-7 text-center">
          <label className="mx-auto block size-24 cursor-pointer overflow-hidden rounded-full bg-gradient-to-br from-[#eee6f7] via-[#f8e8ee] to-[#e4f2eb] font-serif text-3xl text-[#6c5d88]">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile avatar"
                className="size-full object-cover"
              />
            ) : (
              <span className="grid size-full place-items-center">VS</span>
            )}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              onChange={event => {
                const file = event.target.files?.[0];
                if (file) void uploadAvatar(file);
              }}
            />
          </label>
          {uploadState && (
            <p className="mt-3 text-xs text-[#668d7b]">{uploadState}</p>
          )}
          <h2 className="mt-5 font-serif text-2xl text-[#61567d]">
            Vaibhav Singh
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Kanpur · learning in public
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="rounded-full bg-[#e7f1ea] px-3 py-1 text-[10px] text-[#5d806d]">
              2 verified skills
            </span>
            <span className="rounded-full bg-[#eee6f7] px-3 py-1 text-[10px] text-[#6c5d88]">
              3 exchanges
            </span>
          </div>
        </SoftCard>
        <SoftCard className="p-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-xs text-slate-500">
              Display name
              <Input
                defaultValue="Vaibhav Singh"
                className="mt-2 h-11 rounded-xl border-white bg-white/70 text-sm text-slate-700"
              />
            </label>
            <label className="text-xs text-slate-500">
              Timezone
              <Input
                defaultValue="Asia/Kolkata (IST)"
                className="mt-2 h-11 rounded-xl border-white bg-white/70 text-sm text-slate-700"
              />
            </label>
          </div>
          <label className="mt-5 block text-xs text-slate-500">
            Short biography
            <textarea
              defaultValue="I like turning complex ideas into small, useful stories."
              className="mt-2 min-h-28 w-full rounded-xl border border-white bg-white/70 p-3 text-sm text-slate-700 outline-none ring-[#b4a7ca] focus:ring-2"
            />
          </label>
          <div className="mt-6 border-t border-[#eee8f0] pt-6">
            <p className="text-sm font-medium text-slate-700">
              Privacy choices
            </p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="size-4 accent-[#6c5d88]"
                />{" "}
                Show my verified skills on my public profile
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="size-4 accent-[#6c5d88]"
                />{" "}
                Let matches see my availability overlap
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="size-4 accent-[#6c5d88]" />{" "}
                Allow recording by default for new sessions
              </label>
            </div>
          </div>
        </SoftCard>
      </div>
    </DashboardLayout>
  );
}

export function SimpleMemberPage({
  title,
  copy,
  icon: Icon = LockKeyhole,
}: {
  title: string;
  copy: string;
  icon?: typeof LockKeyhole;
}) {
  return (
    <DashboardLayout>
      <WorkspaceHeader
        eyebrow="Your private workspace"
        title={title}
        copy={copy}
      />
      <SoftCard className="mx-auto flex min-h-[330px] max-w-2xl flex-col items-center justify-center p-10 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-[#eee6f7] text-[#6c5d88]">
          <Icon className="size-6" />
        </span>
        <h2 className="mt-6 font-serif text-3xl text-[#61567d]">
          A thoughtful space is taking shape.
        </h2>
        <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">
          The secure Django API boundary will connect this view to your real
          member data, session state, and notifications.
        </p>
        <Button className="mt-7 rounded-full bg-[#6c5d88] text-white">
          Continue exploring <ArrowUpRight className="ml-2 size-4" />
        </Button>
      </SoftCard>
    </DashboardLayout>
  );
}
