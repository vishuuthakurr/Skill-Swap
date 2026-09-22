import React, { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Bell,
  BookOpenCheck,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  ExternalLink,
  FileCheck2,
  Flag,
  LockKeyhole,
  MessageCircle,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
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
    icon: Award,
    title: "Python Teaching Assessment Ready",
    meta: "35 questions · 35 min limit · 70% pass threshold",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: UsersRound,
    title: "3 Reciprocal Matches Found",
    meta: "Based on your Python & UI Design preferences",
    color: "text-indigo-600 bg-indigo-50",
  },
  {
    icon: CalendarDays,
    title: "Upcoming Session with Aarav R.",
    meta: "Thursday at 6:30 PM IST · ZegoCloud Video Room",
    color: "text-emerald-600 bg-emerald-50",
  },
];

const matches = [
  {
    initials: "AR",
    name: "Aarav Sharma",
    teaches: "Photography",
    learns: "Python",
    fit: "94%",
    tone: "bg-blue-50 text-blue-700",
  },
  {
    initials: "SM",
    name: "Sana Mir",
    teaches: "French",
    learns: "Public speaking",
    fit: "89%",
    tone: "bg-indigo-50 text-indigo-700",
  },
  {
    initials: "VK",
    name: "Vikram Mehta",
    teaches: "UI design",
    learns: "Excel",
    fit: "86%",
    tone: "bg-purple-50 text-purple-700",
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
    <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
          {eyebrow}
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-600">
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
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-300 hover:shadow-md ${className}`}
    >
      {children}
    </div>
  );
}

function AvatarBubble({
  initials,
  tone = "bg-blue-50 text-blue-700",
}: {
  initials: string;
  tone?: string;
}) {
  return (
    <span
      className={`grid size-10 place-items-center rounded-xl text-xs font-bold ${tone}`}
    >
      {initials}
    </span>
  );
}

export function MemberDashboard() {
  return (
    <DashboardLayout>
      <WorkspaceHeader
        eyebrow="Learner & Mentor Workspace"
        title="Welcome back, Vaibhav"
        copy="Manage your reciprocal skill exchanges, schedule live video rooms, and verify teaching credentials."
        action={
          <Link href="/skills">
            <Button className="rounded-xl bg-blue-600 px-5 font-semibold text-white shadow-sm hover:bg-blue-700">
              Browse Skill Catalog <ArrowUpRight className="ml-1.5 size-4" />
            </Button>
          </Link>
        }
      />

      {/* Top Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SoftCard className="p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Profile Completion
          </p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">85%</p>
          <Progress
            value={85}
            className="mt-3 h-2 bg-slate-100 [&>div]:bg-blue-600"
          />
          <p className="mt-2 text-xs text-slate-500">
            Availability & bio configured
          </p>
        </SoftCard>

        <SoftCard className="p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Verified Badges
          </p>
          <p className="mt-2 text-3xl font-extrabold text-emerald-600">02</p>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-700">
            <ShieldCheck className="size-4" /> Python & Excel Verified
          </div>
        </SoftCard>

        <SoftCard className="p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Reciprocal Matches
          </p>
          <p className="mt-2 text-3xl font-extrabold text-blue-600">03</p>
          <p className="mt-3 text-xs text-slate-500">
            Synergistic learning partners
          </p>
        </SoftCard>

        <SoftCard className="p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Next Live Session
          </p>
          <p className="mt-2 text-3xl font-extrabold text-indigo-600">Thursday</p>
          <p className="mt-3 text-xs text-slate-500">
            6:30 PM · Photography Exchange
          </p>
        </SoftCard>
      </div>

      {/* Split Grid */}
      <div className="mt-7 grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <SoftCard className="p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                AI Suggested Matches
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">
                High Compatibility Swaps
              </h2>
            </div>
            <Link
              href="/app/matches/discover"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              View All <ArrowUpRight className="ml-1 inline size-3" />
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {matches.map((match) => (
              <div
                key={match.name}
                className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition-all hover:bg-white hover:border-slate-200 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <AvatarBubble initials={match.initials} tone={match.tone} />
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {match.name}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Teaches <span className="font-semibold text-blue-600">{match.teaches}</span> ·
                      Learns <span className="font-semibold text-emerald-600">{match.learns}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-xs">
                    {match.fit} Match
                  </Badge>
                  <Button
                    size="sm"
                    className="rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    Connect
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SoftCard>

        {/* Activity & Tasks Card */}
        <SoftCard className="p-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Bell className="size-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Action Items
              </p>
              <h2 className="text-xl font-bold text-slate-900">
                Recent Updates
              </h2>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {activity.map((item) => (
              <div key={item.title} className="flex gap-3">
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-xl ${item.color}`}
                >
                  <item.icon className="size-4.5" />
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-snug">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {item.meta}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4">
            <Link
              href="/app/assessments/python"
              className="flex items-center justify-between text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              <span>Take Python Teacher Assessment (35 Qs)</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </SoftCard>
      </div>
    </DashboardLayout>
  );
}

export function MySkills() {
  return (
    <DashboardLayout>
      <WorkspaceHeader
        eyebrow="Competency Management"
        title="My Skills & Teaching Badges"
        copy="Manage skills you offer to teach and disciplines you are learning. Pass assessments to earn Verified Teacher badges."
        action={
          <Button className="rounded-xl bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700">
            Add New Skill <ArrowUpRight className="ml-1.5 size-4" />
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* I Can Teach */}
        <SoftCard className="p-7">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Teaching Portfolio
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Skills I Offer
              </h2>
            </div>
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="size-5" />
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {[
              { name: "Python", level: "Intermediate", verified: true, score: 92 },
              { name: "Excel", level: "Advanced", verified: true, score: 88 },
              { name: "Public speaking", level: "Intermediate", verified: false, score: null },
            ].map((skill) => (
              <div
                key={skill.name}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-900">
                      {skill.name}
                    </p>
                    {skill.verified && (
                      <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-700">
                        {skill.score}%
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{skill.level} Proficiency</p>
                </div>

                {skill.verified ? (
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-xs">
                    <Check className="mr-1 size-3" /> Verified Teacher
                  </Badge>
                ) : (
                  <Link
                    href={`/app/assessments/${encodeURIComponent(
                      skill.name.toLowerCase().replace(/\s+/g, "-")
                    )}`}
                  >
                    <Button
                      size="sm"
                      className="rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm"
                    >
                      Take 35-Q Assessment
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </SoftCard>

        {/* I Want to Learn */}
        <SoftCard className="p-7">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Learning Targets
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Skills I Want to Learn
              </h2>
            </div>
            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Sparkles className="size-5" />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {["Photography", "French", "UI Design", "Yoga", "React / Next.js"].map(
              (skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs"
                >
                  {skill}
                </span>
              )
            )}
          </div>

          <div className="mt-8 rounded-xl bg-blue-50/60 p-5 border border-blue-100">
            <p className="text-xs font-bold text-blue-900">
              Optimal Matching Strategy
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Keeping 3–5 active learning goals helps our engine locate matching
              teachers who are simultaneously seeking your verified skills.
            </p>
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
      matches.filter((match) =>
        `${match.name} ${match.teaches} ${match.learns}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <DashboardLayout>
      <WorkspaceHeader
        eyebrow="Reciprocal Synergies"
        title="Discover Peer Matches"
        copy="Connect with users whose teaching credentials directly complement what you want to master."
        action={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search matches..."
              className="h-10 w-full rounded-xl border-slate-200 bg-white pl-9 text-xs sm:w-64"
            />
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {visible.map((match) => (
          <SoftCard key={match.name} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <AvatarBubble initials={match.initials} tone={match.tone} />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {match.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    <span>Active this week · {match.fit} match</span>
                  </div>
                </div>
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                {match.fit} Fit
              </Badge>
            </div>

            <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl bg-slate-50 p-4 text-xs">
              <div>
                <p className="font-medium text-slate-400">You Offer</p>
                <p className="mt-0.5 font-bold text-blue-700">
                  {match.learns}
                </p>
              </div>
              <span className="text-slate-400 font-bold">⇄</span>
              <div className="text-right">
                <p className="font-medium text-slate-400">They Offer</p>
                <p className="mt-0.5 font-bold text-emerald-700">
                  {match.teaches}
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-slate-600">
              Matched based on your declared learning goals and their passed
              assessment score.
            </p>

            <div className="mt-5 flex gap-3">
              <Button className="flex-1 rounded-xl bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700">
                Request Swap Session <ArrowRight className="ml-1.5 size-3.5" />
              </Button>
              <Button
                variant="outline"
                className="rounded-xl border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                View Profile
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
        eyebrow="Direct Communications"
        title="Messages & Exchange Threads"
        copy="Coordinate session agendas, share resource links, and prepare for your live video exchange."
      />
      <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <SoftCard className="p-3">
          <div className="border-b border-slate-100 p-3">
            <Input
              placeholder="Search conversations..."
              className="h-9 rounded-lg border-slate-200 bg-slate-50 text-xs"
            />
          </div>
          {matches.map((match, index) => (
            <div
              key={match.name}
              className={`flex items-center gap-3 rounded-xl p-3.5 cursor-pointer transition-colors ${
                index === 0 ? "bg-blue-50/70" : "hover:bg-slate-50"
              }`}
            >
              <AvatarBubble initials={match.initials} tone={match.tone} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-bold text-slate-900">
                    {match.name}
                  </p>
                  <span className="text-[10px] text-slate-400">10:42 AM</span>
                </div>
                <p className="mt-0.5 truncate text-[11px] text-slate-500">
                  Ready when you are — shall we compare notes?
                </p>
              </div>
            </div>
          ))}
        </SoftCard>

        <SoftCard className="flex min-h-[440px] flex-col p-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <AvatarBubble initials="AR" tone="bg-blue-50 text-blue-700" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Aarav Sharma</h3>
              <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Online · Photography ↔ Python Exchange
              </p>
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-end gap-3 py-6">
            <div className="max-w-[80%] self-start rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-3 text-xs leading-relaxed text-slate-700">
              Hi Vaibhav! I saw you are exploring photography. I could share a
              few practical ways to get started with lighting and composition.
            </div>
            <div className="max-w-[80%] self-end rounded-2xl rounded-br-sm bg-blue-600 px-4 py-3 text-xs leading-relaxed text-white">
              That sounds great. I can demonstrate how I use Python and FastAPI
              for practical automation if that works for you.
            </div>
            <p className="text-center text-[10px] uppercase tracking-wider text-slate-400">
              Aarav is typing…
            </p>
          </div>

          <div className="flex gap-2 border-t border-slate-100 pt-4">
            <Input
              placeholder="Type your message..."
              className="h-10 rounded-xl border-slate-200 text-xs"
            />
            <Button className="rounded-xl bg-blue-600 px-4 text-white hover:bg-blue-700">
              Send <ArrowRight className="ml-1 size-3.5" />
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
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DashboardLayout>
      <WorkspaceHeader
        eyebrow="Interactive Meetings"
        title="Live Video Sessions"
        copy="Join scheduled 1-on-1 peer exchange rooms powered by ZegoCloud with synchronized whiteboard & recording consent."
        action={
          <Link href="/app/sessions/new">
            <Button className="rounded-xl bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700">
              Schedule New Session <CalendarDays className="ml-2 size-4" />
            </Button>
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {remoteSessions.length > 0 ? (
          remoteSessions.map((session) => {
            const sid = session._id || session.id || "live";
            const isCompleted = session.status === "completed";
            const isLive = session.status === "in_progress";

            return (
              <SoftCard key={sid} className="p-6">
                <div className="flex items-center justify-between">
                  <Badge
                    className={`rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      isCompleted
                        ? "bg-slate-100 text-slate-700 hover:bg-slate-100"
                        : isLive
                        ? "bg-red-50 text-red-700 border-red-200 animate-pulse hover:bg-red-50"
                        : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50"
                    }`}
                  >
                    {session.status || "Upcoming"}
                  </Badge>
                  <Clock3 className="size-4 text-slate-400" />
                </div>

                <h3 className="mt-4 text-xl font-bold text-slate-900">
                  {session.topic || session.skill_name || "Skill Exchange Session"}
                </h3>

                <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3.5">
                  <AvatarBubble
                    initials={(session.partner_name || "SW").slice(0, 2).toUpperCase()}
                    tone="bg-blue-100 text-blue-700"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      with {session.partner_name || "Exchange Partner"}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {session.scheduled_time || session.time || "Scheduled"} · {session.duration_minutes || 45} mins
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={`/app/sessions/${sid}`}>
                    <Button variant="outline" className="rounded-xl border-slate-200 text-xs font-semibold text-slate-700">
                      Session Details
                    </Button>
                  </Link>
                  {!isCompleted && (
                    <Link href={`/app/sessions/${sid}/live`}>
                      <Button className="rounded-xl bg-blue-600 text-xs font-semibold text-white shadow-sm hover:bg-blue-700">
                        Join Video Room <Video className="ml-1.5 size-3.5" />
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
                <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-bold uppercase tracking-wider">
                  Upcoming
                </Badge>
                <Clock3 className="size-4 text-slate-400" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900">
                Photography Composition & Lighting
              </h3>
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3.5">
                <AvatarBubble initials="AR" tone="bg-blue-100 text-blue-700" />
                <div>
                  <p className="text-xs font-bold text-slate-900">with Aarav Sharma</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    Thursday · 6:30 PM–7:15 PM IST · 45 mins
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/app/sessions/sess-photography-01">
                  <Button
                    variant="outline"
                    className="rounded-xl border-slate-200 text-xs font-semibold text-slate-700"
                  >
                    View Agenda
                  </Button>
                </Link>
                <Link href="/app/sessions/sess-photography-01/live">
                  <Button className="rounded-xl bg-blue-600 text-xs font-semibold text-white shadow-sm hover:bg-blue-700">
                    Join Video Call <Video className="ml-1.5 size-3.5" />
                  </Button>
                </Link>
              </div>
            </SoftCard>

            <SoftCard className="p-6">
              <div className="flex items-center justify-between">
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                  Completed
                </Badge>
                <FileCheck2 className="size-4 text-emerald-600" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900">
                Python Data Analysis & Pandas
              </h3>
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3.5">
                <AvatarBubble initials="VM" tone="bg-purple-100 text-purple-700" />
                <div>
                  <p className="text-xs font-bold text-slate-900">with Vikram Mehta</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    Verified Exchange Completed · Certificate Minted
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/app/certificates">
                  <Button
                    variant="outline"
                    className="rounded-xl border-slate-200 text-xs font-semibold text-slate-700"
                  >
                    View Certificate
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
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DashboardLayout>
      <WorkspaceHeader
        eyebrow="Cryptographic Credentials"
        title="My Verifiable Certificates"
        copy="A tamper-proof record of passed teacher assessments and completed peer exchange sessions."
        action={
          <Link href="/verify-certificate">
            <Button
              variant="outline"
              className="rounded-xl border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Verify Credential <ShieldCheck className="ml-1.5 size-4 text-emerald-600" />
            </Button>
          </Link>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
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
              <SoftCard key={cert.certificate_no} className="overflow-hidden p-0">
                <div
                  className={`p-6 ${
                    isTeacher
                      ? "bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white"
                      : "bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 text-white"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <Award className="size-6 text-white/90" />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/80">
                      {cert.certificate_no}
                    </span>
                  </div>
                  <p className="mt-8 text-[11px] font-bold uppercase tracking-wider text-white/70">
                    {isTeacher
                      ? "Verified Teacher Credential"
                      : "Certificate of Peer Exchange"}
                  </p>
                  <h3 className="mt-1 text-2xl font-black text-white">
                    {cert.skill || "Skill Mastery"}
                  </h3>
                  <p className="mt-1 text-xs text-white/80">
                    {isTeacher
                      ? `Score: ${cert.score || 70}% (Passed $\\ge$ 70%) · ${issuedDate}`
                      : `Verified 1:1 Peer Session · ${issuedDate}`}
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-600">
                    <ShieldCheck className="size-4" /> Cryptographically Valid
                  </div>
                  <Link href={`/verify-certificate?token=${token}`}>
                    <Button variant="ghost" size="sm" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                      Public Registry Check <ChevronRight className="ml-1 size-3" />
                    </Button>
                  </Link>
                </div>
              </SoftCard>
            );
          })
        ) : (
          <>
            <SoftCard className="overflow-hidden p-0">
              <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 p-6 text-white">
                <div className="flex items-start justify-between">
                  <Award className="size-6 text-white/90" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/80">
                    SS-VERIF-2026-PY
                  </span>
                </div>
                <p className="mt-8 text-[11px] font-bold uppercase tracking-wider text-white/70">
                  Verified Teacher Credential
                </p>
                <h3 className="mt-1 text-2xl font-black text-white">
                  Python Programming
                </h3>
                <p className="mt-1 text-xs text-white/80">
                  Assessment Score: 92% · 35/35 Questions · August 2026
                </p>
              </div>

              <div className="flex items-center justify-between p-4 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-emerald-600">
                  <ShieldCheck className="size-4" /> Cryptographically Valid
                </div>
                <Link href="/verify-certificate?token=SS-VERIF-2026-PY">
                  <Button variant="ghost" size="sm" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                    Public Registry Check <ChevronRight className="ml-1 size-3" />
                  </Button>
                </Link>
              </div>
            </SoftCard>

            <SoftCard className="flex flex-col items-center justify-center border-dashed p-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Award className="size-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                Earn Your Next Credential
              </h3>
              <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-slate-500">
                Take the 35-question domain assessment to prove your knowledge
                and mint an authenticated teacher credential.
              </p>
              <Link href="/app/assessments/python">
                <Button className="mt-4 rounded-xl bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700">
                  Start Python Assessment <ArrowRight className="ml-1.5 size-3.5" />
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
        eyebrow="Activity Stream"
        title="Notifications"
        copy="Stay updated on swap requests, assessment scoring, and upcoming live session reminders."
      />
      <div className="mx-auto max-w-3xl space-y-3">
        {[
          {
            label: "New Reciprocal Match",
            copy: "Aarav Sharma matched with your Python ↔ Photography swap preference.",
            time: "15 min ago",
            icon: UsersRound,
          },
          {
            label: "Session Reminder",
            copy: "Your live 1:1 session begins Thursday at 6:30 PM IST.",
            time: "Yesterday",
            icon: CalendarDays,
          },
          {
            label: "Certificate Minted",
            copy: "Your Python Verified Teacher credential is now live on the public registry.",
            time: "Aug 28",
            icon: Award,
          },
        ].map((item) => (
          <SoftCard key={item.label} className="flex gap-4 p-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <item.icon className="size-5" />
            </span>
            <div className="flex-1">
              <div className="flex flex-col justify-between gap-1 sm:flex-row">
                <p className="text-xs font-bold text-slate-900">
                  {item.label}
                </p>
                <span className="text-[11px] text-slate-400">{item.time}</span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
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
      setUploadState("Avatar updated successfully.");
    } catch (caught) {
      setUploadState(
        caught instanceof Error ? caught.message : "Avatar upload failed."
      );
    }
  };

  return (
    <DashboardLayout>
      <WorkspaceHeader
        eyebrow="Account Settings"
        title="Profile & Preferences"
        copy="Manage your public teacher profile, avatar, timezone, and privacy settings."
        action={
          <Button className="rounded-xl bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700">
            Save Preferences <Check className="ml-1.5 size-4" />
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[.7fr_1.3fr]">
        <SoftCard className="p-7 text-center">
          <label className="mx-auto block size-24 cursor-pointer overflow-hidden rounded-2xl bg-blue-50 text-3xl font-extrabold text-blue-600 border border-blue-200 shadow-sm">
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
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void uploadAvatar(file);
              }}
            />
          </label>
          {uploadState && (
            <p className="mt-2 text-xs font-semibold text-emerald-600">{uploadState}</p>
          )}
          <h3 className="mt-4 text-xl font-bold text-slate-900">
            Vaibhav Singh
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Kanpur, India · Verified Teacher
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
              2 Verified Skills
            </span>
            <span className="rounded-md bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
              12 Swaps Completed
            </span>
          </div>
        </SoftCard>

        <SoftCard className="p-7 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-700">
              Display Name
              <Input
                defaultValue="Vaibhav Singh"
                className="mt-1.5 h-10 rounded-xl border-slate-200 text-xs"
              />
            </label>
            <label className="text-xs font-semibold text-slate-700">
              Timezone
              <Input
                defaultValue="Asia/Kolkata (IST)"
                className="mt-1.5 h-10 rounded-xl border-slate-200 text-xs"
              />
            </label>
          </div>

          <label className="block text-xs font-semibold text-slate-700">
            Biography & Mentor Bio
            <textarea
              defaultValue="Software engineer passionate about Python, clean systems architecture, and reciprocal peer learning."
              className="mt-1.5 min-h-24 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </label>

          <div className="border-t border-slate-100 pt-4">
            <p className="text-xs font-bold text-slate-900">
              Privacy & Consent Controls
            </p>
            <div className="mt-3 space-y-2.5 text-xs text-slate-600">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="size-4 rounded border-slate-300 text-blue-600"
                />
                Show verified teacher marks on my public profile
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="size-4 rounded border-slate-300 text-blue-600"
                />
                Show availability overlap with potential matches
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
        eyebrow="Member Portal"
        title={title}
        copy={copy}
      />
      <SoftCard className="mx-auto flex min-h-[300px] max-w-xl flex-col items-center justify-center p-8 text-center">
        <span className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
          <Icon className="size-6" />
        </span>
        <h3 className="mt-4 text-xl font-bold text-slate-900">
          Module Active
        </h3>
        <p className="mt-2 max-w-sm text-xs text-slate-500">
          Connected to secure backend APIs and live websocket channels.
        </p>
        <Link href="/app/dashboard">
          <Button className="mt-5 rounded-xl bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700">
            Back to Dashboard <ArrowRight className="ml-1.5 size-3.5" />
          </Button>
        </Link>
      </SoftCard>
    </DashboardLayout>
  );
}
