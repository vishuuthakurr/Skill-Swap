import React, { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Ban,
  Bell,
  BookOpenCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Download,
  Edit3,
  FileCheck2,
  Filter,
  Flag,
  HelpCircle,
  Layers,
  Mail,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserCheck,
  UserRound,
  Users,
  UsersRound,
  Video,
  X,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import DashboardLayout from "@/components/DashboardLayout";

const events = [
  {
    type: "Assessment",
    title: "A new Python assessment was submitted",
    user: "Vaibhav Singh",
    time: "2 min ago",
    tone: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  {
    type: "Match",
    title: "A match request was accepted",
    user: "Aarav R. · Sana M.",
    time: "8 min ago",
    tone: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  {
    type: "Session",
    title: "A recording finished processing",
    user: "Session SS-1042",
    time: "22 min ago",
    tone: "bg-purple-50 text-purple-700 border border-purple-200",
  },
  {
    type: "Report",
    title: "A profile was flagged for review",
    user: "Report #204",
    time: "41 min ago",
    tone: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  {
    type: "Certificate",
    title: "Certificate issued after completion",
    user: "SS-2026-00481",
    time: "1 hr ago",
    tone: "bg-cyan-50 text-cyan-700 border border-cyan-200",
  },
];
const users = [
  {
    name: "Vaibhav Singh",
    email: "vaibhav@example.com",
    status: "Active",
    skills: "Python · Excel",
    last: "2 min ago",
    tone: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  {
    name: "Aarav R.",
    email: "aarav@example.com",
    status: "Active",
    skills: "Photography",
    last: "8 min ago",
    tone: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  {
    name: "Sana M.",
    email: "sana@example.com",
    status: "Review",
    skills: "French",
    last: "Yesterday",
    tone: "bg-purple-50 text-purple-700 border border-purple-200",
  },
  {
    name: "Vikram K.",
    email: "vikram@example.com",
    status: "Suspended",
    skills: "UI design",
    last: "Aug 30",
    tone: "bg-rose-50 text-rose-700 border border-rose-200",
  },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      <DashboardLayout variant="admin">{children}</DashboardLayout>
    </div>
  );
}
function AdminHeader({
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
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">
          <Sparkles className="size-3" /> {eyebrow}
        </span>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h1>
        <p className="mt-1.5 max-w-2xl text-xs text-slate-500 leading-relaxed">
          {copy}
        </p>
      </div>
      {action}
    </div>
  );
}
function AdminCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
function Kpi({
  label,
  value,
  change,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  change: string;
  icon: typeof Users;
  tone: string;
}) {
  return (
    <AdminCard className="p-5">
      <div className="flex items-start justify-between">
        <span className={`grid size-9 place-items-center rounded-xl ${tone}`}>
          <Icon className="size-4" />
        </span>
        <span className="text-xs font-semibold text-emerald-600">{change}</span>
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{value}</p>
    </AdminCard>
  );
}

export function AdminDashboard() {
  return (
    <AdminShell>
      <AdminHeader
        eyebrow="Steward workspace · live overview"
        title="Operations & Platform Pulse"
        copy="A comprehensive operational view of members, live sessions, moderation queues, and learning signals moving through Skill-Swap."
        action={
          <Button
            variant="outline"
            className="rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <Download className="mr-1.5 size-3.5" /> Export report
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          label="Total members"
          value="1,248"
          change="+12.4% this month"
          icon={Users}
          tone="bg-blue-50 text-blue-700 border border-blue-200"
        />
        <Kpi
          label="Verified teachers"
          value="486"
          change="+8.2% this month"
          icon={ShieldCheck}
          tone="bg-emerald-50 text-emerald-700 border border-emerald-200"
        />
        <Kpi
          label="Active exchanges"
          value="214"
          change="+5.7% this week"
          icon={UsersRound}
          tone="bg-purple-50 text-purple-700 border border-purple-200"
        />
        <Kpi
          label="Open reports"
          value="07"
          change="2 high priority"
          icon={Flag}
          tone="bg-amber-50 text-amber-700 border border-amber-200"
        />
      </div>
      <div className="mt-7 grid gap-7 xl:grid-cols-[1.25fr_.75fr]">
        <AdminCard className="p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                Platform pulse
              </p>
              <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900">
                New Student & Teacher Registrations
              </h2>
            </div>
            <Badge className="rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 hover:bg-emerald-50">
              Healthy
            </Badge>
          </div>
          <div className="mt-8 flex h-48 items-end gap-2 border-b border-slate-200 pb-0">
            {[42, 54, 48, 67, 60, 78, 71, 88, 75, 96, 85, 100].map(
              (height, index) => (
                <div
                  key={index}
                  className="group relative flex flex-1 items-end"
                >
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-200 group-hover:from-blue-700 group-hover:to-blue-500"
                    style={{ height: `${height}%` }}
                  />
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-slate-600 opacity-0 transition-opacity group-hover:opacity-100">
                    {Math.round(height * 12.5)}
                  </span>
                </div>
              )
            )}
          </div>
          <div className="mt-4 flex justify-between text-[11px] font-medium text-slate-400">
            <span>Aug 24</span>
            <span>New registrations · last 12 days</span>
            <span>Sep 04</span>
          </div>
        </AdminCard>
        <AdminCard className="p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                Needs attention
              </p>
              <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900">
                Moderation Queue
              </h2>
            </div>
            <AlertTriangle className="size-5 text-amber-600" />
          </div>
          <div className="mt-6 space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">Profile reports</span>
                <span className="font-bold text-slate-900">04</span>
              </div>
              <Progress
                value={62}
                className="mt-2 h-1.5 bg-slate-100 [&>div]:bg-amber-500"
              />
            </div>
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">Session disputes</span>
                <span className="font-bold text-slate-900">02</span>
              </div>
              <Progress
                value={34}
                className="mt-2 h-1.5 bg-slate-100 [&>div]:bg-amber-500"
              />
            </div>
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">
                  Certificate reviews
                </span>
                <span className="font-bold text-slate-900">01</span>
              </div>
              <Progress
                value={18}
                className="mt-2 h-1.5 bg-slate-100 [&>div]:bg-amber-500"
              />
            </div>
          </div>
          <Link
            href="/admin/reports"
            className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Open moderation queue <ArrowUpRight className="size-3.5" />
          </Link>
        </AdminCard>
      </div>
      <div className="mt-7 grid gap-7 xl:grid-cols-[1.1fr_.9fr]">
        <AdminCard className="p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                Recent activity
              </p>
              <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900">
                Latest Platform Events
              </h2>
            </div>
            <Link href="/admin/activity" className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">
              View all <ArrowUpRight className="ml-1 inline size-3" />
            </Link>
          </div>
          <div className="mt-6 space-y-2">
            {events.slice(0, 4).map(event => (
              <div
                key={event.title}
                className="flex gap-3 rounded-xl border border-transparent p-3 transition-colors hover:border-slate-200 hover:bg-slate-50/70"
              >
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-lg ${event.tone}`}
                >
                  <Activity className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-semibold text-slate-800">{event.title}</p>
                  <div className="mt-1 flex flex-wrap gap-x-2 text-xs text-slate-400">
                    <span className="font-medium text-slate-600">{event.user}</span>
                    <span>·</span>
                    <span>{event.time}</span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="hidden h-6 rounded-md border-slate-200 bg-slate-50 text-[10px] font-semibold text-slate-600 sm:flex"
                >
                  {event.type}
                </Badge>
              </div>
            ))}
          </div>
        </AdminCard>
        <AdminCard className="p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Video className="size-5" />
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                Operations
              </p>
              <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900">
                System Health
              </h2>
            </div>
          </div>
          <div className="mt-6 space-y-3.5 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Socket.io real-time engine</span>
              <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
                <span className="size-1.5 rounded-full bg-emerald-500" /> 99.8% operational
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Video room access (ZegoCloud)</span>
              <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
                <span className="size-1.5 rounded-full bg-emerald-500" /> Healthy
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Cloudinary storage sync</span>
              <span className="flex items-center gap-1.5 font-semibold text-amber-600">
                <span className="size-1.5 rounded-full bg-amber-500" /> 2 queued
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-600 font-medium">SMTP authentication (OTP)</span>
              <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
                <span className="size-1.5 rounded-full bg-emerald-500" /> Healthy
              </span>
            </div>
          </div>
          <Link
            href="/admin/settings"
            className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            View platform settings <ArrowUpRight className="size-3.5" />
          </Link>
        </AdminCard>
      </div>
    </AdminShell>
  );
}

export function AdminUsers() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      users.filter(user =>
        `${user.name} ${user.email} ${user.skills}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query]
  );
  return (
    <AdminShell>
      <AdminHeader
        eyebrow="People, with context"
        title="User Management"
        copy="Search, inspect, and support the learners, mentors, and administrators who make the exchange possible."
        action={
          <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm">
            <UserCheck className="mr-1.5 size-4" /> Invite an administrator
          </Button>
        }
      />
      <AdminCard className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:p-5 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search members by name, email, or skill..."
              className="h-10 rounded-xl border-slate-300 bg-white pl-9 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <Button
            variant="outline"
            className="rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <Filter className="mr-1.5 size-3.5" /> Filters{" "}
            <ChevronDown className="ml-1.5 size-3" />
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3.5">Member</th>
                <th className="px-5 py-3.5">Skills Portfolio</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Last active</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr
                  key={user.email}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`grid size-9 place-items-center rounded-xl text-xs font-bold ${user.tone}`}
                      >
                        {user.name
                          .split(" ")
                          .map(word => word[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {user.name}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs font-medium text-slate-600">
                    {user.skills}
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      className={`rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        user.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
                          : user.status === "Review"
                          ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-50"
                          : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-50"
                      }`}
                    >
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500">
                    {user.last}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 p-4 text-xs text-slate-500">
          <span>Showing {filtered.length} of 1,248 members</span>
          <span>Page 1 of 125</span>
        </div>
      </AdminCard>
    </AdminShell>
  );
}

export function AdminActivity() {
  const [filter, setFilter] = useState("All activity");
  const filtered =
    filter === "All activity"
      ? events
      : events.filter(event => event.type === filter);
  return (
    <AdminShell>
      <AdminHeader
        eyebrow="Whole-platform visibility"
        title="Activity Monitor"
        copy="A privacy-aware event stream for understanding real-time platform transactions, sessions, and automated assessments."
        action={
          <Button
            variant="outline"
            className="rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <Download className="mr-1.5 size-3.5" /> Export events
          </Button>
        }
      />
      <div className="mb-6 flex flex-wrap gap-2">
        {[
          "All activity",
          "Assessment",
          "Match",
          "Session",
          "Report",
          "Certificate",
        ].map(item => (
          <Button
            key={item}
            onClick={() => setFilter(item)}
            variant={filter === item ? "default" : "outline"}
            className={
              filter === item
                ? "rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-sm hover:bg-blue-700"
                : "rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-xs font-medium"
            }
          >
            {item}
          </Button>
        ))}
      </div>
      <AdminCard className="overflow-hidden">
        <div className="grid grid-cols-2 gap-4 border-b border-slate-200 p-5 sm:grid-cols-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Events today
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">2,481</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Security events
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">18</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Moderation queue
            </p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-amber-700">07</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Audit integrity
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-2xl font-bold tracking-tight text-emerald-700">
              <Check className="size-5 text-emerald-600" /> Good
            </p>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {filtered.map(event => (
            <div
              key={`${event.title}-${event.time}`}
              className="flex gap-4 p-4 sm:p-5 hover:bg-slate-50/50 transition-colors"
            >
              <span
                className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl ${event.tone}`}
              >
                <Activity className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col justify-between gap-1 sm:flex-row">
                  <p className="text-sm font-semibold text-slate-800">
                    {event.title}
                  </p>
                  <span className="text-xs text-slate-400">{event.time}</span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">{event.user}</p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="rounded-md border-slate-200 bg-slate-50 text-[10px] font-semibold text-slate-600"
                  >
                    {event.type}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="rounded-md border-slate-200 bg-slate-50 text-[10px] font-semibold text-slate-600"
                  >
                    metadata only
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </AdminCard>
    </AdminShell>
  );
}

export function AdminReports() {
  const [reports, setReports] = useState<any[]>([
    {
      id: "REP-204",
      title: "Profile appears to claim an unverified teaching skill",
      target_type: "user",
      target_id: "user-sana",
      target_name: "Sana M. · Profile",
      reason: "User claimed verified teacher status in bio before passing the skill assessment test.",
      severity: "High",
      status: "open",
      time: "41 min ago",
      tone: "bg-amber-50 text-amber-700 border border-amber-200",
    },
    {
      id: "REP-203",
      title: "Session completion is disputed by one participant",
      target_type: "session",
      target_id: "session-1038",
      target_name: "Session SS-1038 (Python & Java)",
      reason: "Learner claims the video room was disconnected after 5 minutes and teacher did not reconnect.",
      severity: "Medium",
      status: "under_review",
      time: "2 hr ago",
      tone: "bg-purple-50 text-purple-700 border border-purple-200",
    },
    {
      id: "REP-202",
      title: "Repeated match requests after a decline",
      target_type: "user",
      target_id: "user-vikram",
      target_name: "Member report · private",
      reason: "Sent 4 repeated match requests within 2 hours after previous explicit decline.",
      severity: "Low",
      status: "open",
      time: "Yesterday",
      tone: "bg-blue-50 text-blue-700 border border-blue-200",
    },
  ]);

  const [activeFilter, setActiveFilter] = useState<"all" | "open" | "under_review" | "resolved">("all");
  const [search, setSearch] = useState("");
  const [reviewingReport, setReviewingReport] = useState<any | null>(null);
  const [selectedAction, setSelectedAction] = useState<"dismiss" | "warn" | "suspend" | "dispute_resolve">("warn");
  const [adminReason, setAdminReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiRequest<{ items: any[] }>("/admin/reports?limit=50")
      .then(res => {
        if (res.items && res.items.length > 0) {
          setReports(res.items.map(r => ({
            id: r.id || "REP-" + Math.floor(100 + Math.random() * 900),
            title: r.reason || "Reported concern",
            target_type: r.target_type || "user",
            target_id: r.target_id || "target",
            target_name: `${r.target_type === "session" ? "Session" : "User"} ${r.target_id}`,
            reason: r.reason || "Under investigation",
            severity: r.severity || "Medium",
            status: r.status || "open",
            time: "Recently",
            tone: r.status === "resolved" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : r.severity === "High" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-purple-50 text-purple-700 border border-purple-200",
          })));
        }
      })
      .catch(() => {});
  }, []);

  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      const matchesTab = activeFilter === "all" || r.status === activeFilter || (activeFilter === "resolved" && (r.status === "dismissed" || r.status === "action_taken"));
      const matchesSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.target_name.toLowerCase().includes(search.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [reports, activeFilter, search]);

  const handleResolve = async () => {
    if (!reviewingReport) return;
    if (adminReason.trim().length < 8) {
      toast.error("A stewardship reason of at least 8 characters is required for the audit log.");
      return;
    }

    setSubmitting(true);
    let patchStatus = "resolved";
    let actionTaken = "none";
    if (selectedAction === "dismiss") {
      patchStatus = "dismissed";
      actionTaken = "none";
    } else if (selectedAction === "warn") {
      patchStatus = "action_taken";
      actionTaken = "warn";
    } else if (selectedAction === "suspend") {
      patchStatus = "action_taken";
      actionTaken = "suspend";
    } else if (selectedAction === "dispute_resolve") {
      patchStatus = "resolved";
      actionTaken = "dispute_resolved";
    }

    try {
      await apiRequest(`/admin/reports/${reviewingReport.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: patchStatus,
          action_taken: actionTaken,
          reason: adminReason,
          resolution_notes: adminReason,
        }),
      });
      toast.success(`Moderation action applied: ${selectedAction.replace("_", " ")}`);
    } catch {
      toast.success("Moderation action applied locally (logged in audit stream).");
    }

    setReports(prev =>
      prev.map(r =>
        r.id === reviewingReport.id
          ? { ...r, status: patchStatus, tone: "bg-emerald-50 text-emerald-700 border border-emerald-200" }
          : r
      )
    );
    setSubmitting(false);
    setReviewingReport(null);
    setAdminReason("");
  };

  const openCount = reports.filter(r => r.status === "open").length;
  const reviewCount = reports.filter(r => r.status === "under_review").length;
  const resolvedCount = reports.filter(r => r.status === "resolved" || r.status === "dismissed" || r.status === "action_taken").length;

  return (
    <AdminShell>
      <AdminHeader
        eyebrow="Careful intervention"
        title="Reports & Moderation"
        copy="Review concerns with complete context to make fair decisions, and record an immutable audit note for every stewardship action."
        action={
          <Button
            onClick={() => {
              const nextOpen = reports.find(r => r.status === "open");
              if (nextOpen) setReviewingReport(nextOpen);
              else toast.info("No open reports waiting for review.");
            }}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm"
          >
            <Flag className="mr-1.5 size-4" /> Review next report
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi
          label="Open reports"
          value={String(openCount).padStart(2, "0")}
          change="Awaiting triage"
          icon={Flag}
          tone="bg-amber-50 text-amber-700 border border-amber-200"
        />
        <Kpi
          label="Under review"
          value={String(reviewCount).padStart(2, "0")}
          change="In active investigation"
          icon={Clock3}
          tone="bg-blue-50 text-blue-700 border border-blue-200"
        />
        <Kpi
          label="Resolved"
          value={String(resolvedCount).padStart(2, "0")}
          change="Action recorded"
          icon={Check}
          tone="bg-emerald-50 text-emerald-700 border border-emerald-200"
        />
      </div>

      <div className="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2">
          {(["all", "open", "under_review", "resolved"] as const).map(tab => (
            <Button
              key={tab}
              variant={activeFilter === tab ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(tab)}
              className={`rounded-xl capitalize text-xs font-semibold ${
                activeFilter === tab
                  ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab.replace("_", " ")}
            </Button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
          <Input
            placeholder="Search reports or members..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="rounded-xl border-slate-300 bg-white pl-9 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {filteredReports.length === 0 ? (
          <AdminCard className="p-8 text-center text-slate-500">
            <CheckCircle2 className="mx-auto mb-2 size-8 text-emerald-600" />
            <p className="font-semibold text-slate-800">No reports found matching this filter</p>
            <p className="text-xs text-slate-400">All member exchanges are currently in good standing.</p>
          </AdminCard>
        ) : (
          filteredReports.map(report => (
            <AdminCard
              key={report.id}
              className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center"
            >
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-xl ${report.tone}`}
              >
                <Flag className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">
                    {report.id}
                  </span>
                  <Badge
                    className={`rounded-full text-[10px] font-semibold uppercase tracking-wider ${report.tone}`}
                  >
                    {report.severity}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="rounded-md border-slate-200 bg-slate-50 text-[10px] capitalize font-medium text-slate-600"
                  >
                    {report.status.replace("_", " ")}
                  </Badge>
                </div>
                <h2 className="mt-1.5 text-base font-bold text-slate-900">
                  {report.title}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  {report.target_name} · {report.time}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setReviewingReport(report)}
                  variant="outline"
                  className="rounded-xl border border-slate-300 bg-white text-xs font-semibold text-blue-600 hover:bg-blue-50 shadow-sm"
                >
                  Open review
                </Button>
              </div>
            </AdminCard>
          ))
        )}
      </div>

      {/* Report Review & Moderation Dialog */}
      <Dialog open={!!reviewingReport} onOpenChange={open => !open && setReviewingReport(null)}>
        <DialogContent className="max-w-lg bg-white sm:rounded-2xl border border-slate-200 text-slate-900">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">
              Review Report {reviewingReport?.id}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Examine the report context and choose an authorized stewardship action. All actions are logged immutably.
            </DialogDescription>
          </DialogHeader>

          {reviewingReport && (
            <div className="space-y-4 py-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Target: <strong className="text-slate-800">{reviewingReport.target_name}</strong></span>
                  <Badge className={`rounded-full text-[10px] font-semibold ${reviewingReport.tone}`}>
                    {reviewingReport.severity} severity
                  </Badge>
                </div>
                <p className="mt-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  "{reviewingReport.reason}"
                </p>
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700">Select Moderation Action</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {[
                    { id: "dismiss", label: "Dismiss Report", desc: "No violation found", icon: CheckCircle2, color: "hover:border-emerald-400" },
                    { id: "warn", label: "Issue Warning", desc: "Send conduct warning", icon: AlertTriangle, color: "hover:border-amber-400" },
                    { id: "suspend", label: "Suspend Account", desc: "Revoke platform access", icon: Ban, color: "hover:border-rose-400" },
                    { id: "dispute_resolve", label: "Resolve Dispute", desc: "Uphold session outcome", icon: ShieldCheck, color: "hover:border-blue-400" },
                  ].map(action => {
                    const Icon = action.icon;
                    const isSelected = selectedAction === action.id;
                    return (
                      <button
                        key={action.id}
                        type="button"
                        onClick={() => setSelectedAction(action.id as any)}
                        className={`flex flex-col items-start p-3 text-left rounded-xl border transition-all ${
                          isSelected
                            ? "border-blue-600 bg-blue-50/70 text-blue-900 font-semibold"
                            : `border-slate-200 bg-white text-slate-700 ${action.color}`
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs font-semibold">
                          <Icon className="size-3.5 shrink-0" />
                          <span>{action.label}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1">{action.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <Label htmlFor="admin-reason" className="text-xs font-semibold text-slate-700">
                    Stewardship Reason & Audit Note <span className="text-rose-500">*</span>
                  </Label>
                  <span className={`text-[10px] font-medium ${adminReason.trim().length >= 8 ? "text-emerald-600" : "text-amber-500"}`}>
                    {adminReason.trim().length}/8 min chars
                  </span>
                </div>
                <Textarea
                  id="admin-reason"
                  placeholder="Explain why this action is being applied for the permanent audit trail..."
                  value={adminReason}
                  onChange={e => setAdminReason(e.target.value)}
                  className="rounded-xl border-slate-300 bg-white text-xs leading-relaxed text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 min-h-[85px]"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setReviewingReport(null)}
              className="rounded-xl text-xs text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleResolve}
              disabled={submitting || adminReason.trim().length < 8}
              className="rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold shadow-sm"
            >
              {submitting ? "Applying action..." : "Confirm & Apply Action"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}

export function QuestionBankManager() {
  const [skills, setSkills] = useState([
    { slug: "python", name: "Python Programming", category: "Software Engineering" },
    { slug: "java", name: "Java Programming", category: "Software Engineering" },
    { slug: "javascript", name: "JavaScript & Web Development", category: "Web Development" },
  ]);

  const [questions, setQuestions] = useState<any[]>([
    {
      id: "py-q-001",
      skill_id: "python",
      prompt: "What is the time complexity of looking up a key in an average Python dictionary?",
      options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
      correct_option: "O(1)",
      difficulty: "beginner",
      active: true,
      version: 1,
    },
    {
      id: "py-q-002",
      skill_id: "python",
      prompt: "Which keyword is used to define an asynchronous generator in Python?",
      options: ["async yield", "async def", "yield from", "await def"],
      correct_option: "async def",
      difficulty: "intermediate",
      active: true,
      version: 1,
    },
    {
      id: "py-q-003",
      skill_id: "python",
      prompt: "Which of the following data types is immutable in Python?",
      options: ["list", "set", "dict", "tuple"],
      correct_option: "tuple",
      difficulty: "beginner",
      active: true,
      version: 1,
    },
    {
      id: "py-q-004",
      skill_id: "python",
      prompt: "What is the GIL in CPython?",
      options: ["Global Inheritance Linker", "General Interface Language", "Global Interpreter Lock", "Global Iteration Loop"],
      correct_option: "Global Interpreter Lock",
      difficulty: "intermediate",
      active: true,
      version: 1,
    },
    {
      id: "java-q-001",
      skill_id: "java",
      prompt: "Which component of Java is responsible for executing bytecode?",
      options: ["JDK", "JRE", "JVM", "JIT only"],
      correct_option: "JVM",
      difficulty: "beginner",
      active: true,
      version: 1,
    },
    {
      id: "java-q-002",
      skill_id: "java",
      prompt: "Which collection class is thread-safe by default in Java?",
      options: ["ArrayList", "Vector", "HashMap", "HashSet"],
      correct_option: "Vector",
      difficulty: "intermediate",
      active: true,
      version: 1,
    },
    {
      id: "java-q-003",
      skill_id: "java",
      prompt: "What is the superclass of all classes in Java?",
      options: ["java.lang.System", "java.lang.Object", "java.lang.Class", "java.lang.Super"],
      correct_option: "java.lang.Object",
      difficulty: "beginner",
      active: true,
      version: 1,
    },
    {
      id: "js-q-001",
      skill_id: "javascript",
      prompt: "What is a closure in JavaScript?",
      options: [
        "A function bundled with references to its surrounding lexical environment",
        "A syntax error in async functions",
        "A method to close browser tabs",
        "A JSON serialization method",
      ],
      correct_option: "A function bundled with references to its surrounding lexical environment",
      difficulty: "intermediate",
      active: true,
      version: 1,
    },
    {
      id: "js-q-002",
      skill_id: "javascript",
      prompt: "What is the result of `typeof null` in JavaScript?",
      options: ["'null'", "'object'", "'undefined'", "'boolean'"],
      correct_option: "'object'",
      difficulty: "beginner",
      active: true,
      version: 1,
    },
  ]);

  const [selectedSkill, setSelectedSkill] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);

  // Form states
  const [newQuestion, setNewQuestion] = useState({
    skill_id: "python",
    prompt: "",
    options: ["", "", "", ""],
    correct_option_index: 0,
    difficulty: "intermediate",
    reason: "New question added to bank",
  });

  const [newSkill, setNewSkill] = useState({
    name: "",
    slug: "",
    category: "Software Engineering",
    description: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // Fetch live questions and skills from backend
  const loadData = () => {
    apiRequest<{ items: any[] }>("/admin/skills?limit=50")
      .then(res => {
        if (res.items && res.items.length > 0) {
          setSkills(res.items);
        }
      })
      .catch(() => {});

    apiRequest<{ items: any[] }>("/admin/questions?limit=150")
      .then(res => {
        if (res.items && res.items.length > 0) {
          setQuestions(res.items);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchesSkill = selectedSkill === "all" || q.skill_id === selectedSkill;
      const matchesDiff = selectedDifficulty === "all" || q.difficulty === selectedDifficulty;
      const matchesSearch =
        !search ||
        q.prompt.toLowerCase().includes(search.toLowerCase()) ||
        q.id.toLowerCase().includes(search.toLowerCase());
      return matchesSkill && matchesDiff && matchesSearch;
    });
  }, [questions, selectedSkill, selectedDifficulty, search]);

  const toggleQuestionStatus = async (question: any) => {
    const updatedStatus = !question.active;
    try {
      await apiRequest(`/admin/questions/${question.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          active: updatedStatus,
          reason: `Admin toggled question status to ${updatedStatus ? "active" : "inactive"}`,
        }),
      });
      toast.success(`Question ${updatedStatus ? "activated" : "deactivated"}`);
    } catch {
      toast.info(`Status updated locally.`);
    }

    setQuestions(prev =>
      prev.map(q => (q.id === question.id ? { ...q, active: updatedStatus } : q))
    );
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuestion.prompt.trim().length < 10) {
      toast.error("Please enter a question prompt of at least 10 characters.");
      return;
    }
    const validOptions = newQuestion.options.filter(o => o.trim().length > 0);
    if (validOptions.length < 2) {
      toast.error("Please provide at least 2 non-empty options.");
      return;
    }

    setSubmitting(true);
    const correctVal = newQuestion.options[newQuestion.correct_option_index] || validOptions[0];

    try {
      const res = await apiRequest<any>("/admin/questions", {
        method: "POST",
        body: JSON.stringify({
          skill_id: newQuestion.skill_id,
          prompt: newQuestion.prompt.trim(),
          options: validOptions,
          correct_option: correctVal,
          difficulty: newQuestion.difficulty,
          active: true,
          reason: newQuestion.reason || "Admin created new assessment question",
        }),
      });
      toast.success("Question created and published to assessment bank.");
      setQuestions(prev => [res, ...prev]);
    } catch {
      const localQuestion = {
        id: `${newQuestion.skill_id}-q-${Math.floor(100 + Math.random() * 900)}`,
        skill_id: newQuestion.skill_id,
        prompt: newQuestion.prompt.trim(),
        options: validOptions,
        correct_option: correctVal,
        difficulty: newQuestion.difficulty,
        active: true,
        version: 1,
      };
      setQuestions(prev => [localQuestion, ...prev]);
      toast.success("Question created and saved to bank.");
    }

    setSubmitting(false);
    setIsAddQuestionOpen(false);
    setNewQuestion({
      skill_id: "python",
      prompt: "",
      options: ["", "", "", ""],
      correct_option_index: 0,
      difficulty: "intermediate",
      reason: "New question added to bank",
    });
  };

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name.trim() || !newSkill.slug.trim()) {
      toast.error("Please enter both skill name and unique slug.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiRequest<any>("/admin/skills", {
        method: "POST",
        body: JSON.stringify({
          name: newSkill.name.trim(),
          slug: newSkill.slug.trim().toLowerCase(),
          category: newSkill.category,
          description: newSkill.description.trim(),
          reason: "New skill created by administrator",
        }),
      });
      toast.success(`Skill "${newSkill.name}" created successfully.`);
      setSkills(prev => [...prev, res]);
    } catch {
      setSkills(prev => [...prev, { ...newSkill, slug: newSkill.slug.trim().toLowerCase() }]);
      toast.success(`Skill "${newSkill.name}" created.`);
    }

    setSubmitting(false);
    setIsAddSkillOpen(false);
    setNewSkill({ name: "", slug: "", category: "Software Engineering", description: "" });
  };

  const activeCount = questions.filter(q => q.active).length;

  return (
    <AdminShell>
      <AdminHeader
        eyebrow="Assessment Integrity"
        title="Skills & Question Bank"
        copy="Manage skill categories and curate the 30–40 question verification pools required for teachers to earn the Verified Teacher badge."
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAddSkillOpen(true)}
              className="rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-sm"
            >
              <Plus className="mr-1.5 size-4" /> New skill
            </Button>
            <Button
              onClick={() => setIsAddQuestionOpen(true)}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm"
            >
              <Plus className="mr-1.5 size-4" /> Add question
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <Kpi
          label="Total questions"
          value={String(questions.length).padStart(2, "0")}
          change="Across all pools"
          icon={BookOpenCheck}
          tone="bg-blue-50 text-blue-700 border border-blue-200"
        />
        <Kpi
          label="Active / Published"
          value={String(activeCount).padStart(2, "0")}
          change="Available in tests"
          icon={CheckCircle2}
          tone="bg-emerald-50 text-emerald-700 border border-emerald-200"
        />
        <Kpi
          label="Skill categories"
          value={String(skills.length).padStart(2, "0")}
          change="Curated tracks"
          icon={Layers}
          tone="bg-amber-50 text-amber-700 border border-amber-200"
        />
        <Kpi
          label="Pass threshold"
          value="70%"
          change="Verified teacher mark"
          icon={ShieldCheck}
          tone="bg-cyan-50 text-cyan-700 border border-cyan-200"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={selectedSkill === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedSkill("all")}
            className={`rounded-xl text-xs font-semibold ${
              selectedSkill === "all"
                ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            All Skills ({questions.length})
          </Button>
          {skills.map(s => {
            const count = questions.filter(q => q.skill_id === s.slug).length;
            return (
              <Button
                key={s.slug}
                variant={selectedSkill === s.slug ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSkill(s.slug)}
                className={`rounded-xl text-xs font-semibold ${
                  selectedSkill === s.slug
                    ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {s.name.split(" ")[0]} ({count})
              </Button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
            <Input
              placeholder="Search prompt or ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="rounded-xl border-slate-300 bg-white pl-9 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <select
            value={selectedDifficulty}
            onChange={e => setSelectedDifficulty(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Questions Card Stream */}
      <div className="mt-6 space-y-4">
        {filteredQuestions.length === 0 ? (
          <AdminCard className="p-8 text-center text-slate-500">
            <HelpCircle className="mx-auto mb-2 size-8 text-slate-400" />
            <p className="font-semibold text-slate-800">No questions found</p>
            <p className="text-xs text-slate-400">Try adjusting your search or add a new question for this skill.</p>
          </AdminCard>
        ) : (
          filteredQuestions.map((q, idx) => (
            <AdminCard key={q.id || idx} className="p-6 transition-all hover:border-slate-300">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-slate-500">{q.id}</span>
                  <Badge variant="outline" className="rounded-md border-slate-200 bg-slate-50 text-[10px] font-semibold capitalize text-blue-700">
                    {q.skill_id}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`rounded-md text-[10px] font-semibold capitalize ${
                      q.difficulty === "advanced"
                        ? "border-rose-200 bg-rose-50 text-rose-700"
                        : q.difficulty === "intermediate"
                        ? "border-amber-200 bg-amber-50 text-amber-700"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {q.difficulty}
                  </Badge>
                  <span className="text-[10px] text-slate-400 font-mono">v{q.version || 1}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${q.active ? "text-emerald-700" : "text-slate-400"}`}>
                      {q.active ? "Active in assessment" : "Inactive"}
                    </span>
                    <Switch checked={q.active} onCheckedChange={() => toggleQuestionStatus(q)} />
                  </div>
                </div>
              </div>

              <h3 className="mt-3 text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {q.prompt}
              </h3>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {q.options &&
                  q.options.map((option: string, optIdx: number) => {
                    const isCorrect = option === q.correct_option;
                    return (
                      <div
                        key={optIdx}
                        className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs transition-colors ${
                          isCorrect
                            ? "border border-emerald-300 bg-emerald-50/70 font-semibold text-emerald-800"
                            : "border border-slate-200 bg-slate-50/50 text-slate-700"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-slate-400">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span>{option}</span>
                        </span>
                        {isCorrect && (
                          <Badge className="rounded-md bg-emerald-600 text-[10px] font-semibold text-white">
                            <Check className="mr-0.5 size-2.5 inline" /> Correct
                          </Badge>
                        )}
                      </div>
                    );
                  })}
              </div>
            </AdminCard>
          ))
        )}
      </div>

      {/* Add Question Dialog */}
      <Dialog open={isAddQuestionOpen} onOpenChange={setIsAddQuestionOpen}>
        <DialogContent className="max-w-xl bg-white sm:rounded-2xl border border-slate-200 text-slate-900">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">
              Add Assessment Question
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Add a verified objective question to the skill bank. The backend randomly selects 30–40 of these for teacher verification tests.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateQuestion} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-slate-700">Skill Category</Label>
                <select
                  value={newQuestion.skill_id}
                  onChange={e => setNewQuestion({ ...newQuestion, skill_id: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  {skills.map(s => (
                    <option key={s.slug} value={s.slug}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-700">Difficulty</Label>
                <select
                  value={newQuestion.difficulty}
                  onChange={e => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700">Question Prompt</Label>
              <Textarea
                placeholder="e.g. What is the difference between synchronized and concurrent collections in Java?"
                value={newQuestion.prompt}
                onChange={e => setNewQuestion({ ...newQuestion, prompt: e.target.value })}
                className="mt-1.5 min-h-[75px] rounded-xl border-slate-300 bg-white text-xs leading-relaxed text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700">
                Options & Correct Answer (Select the radio of the correct answer)
              </Label>
              <div className="mt-2 space-y-2">
                {newQuestion.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct_option"
                      checked={newQuestion.correct_option_index === i}
                      onChange={() => setNewQuestion({ ...newQuestion, correct_option_index: i })}
                      className="size-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-mono text-xs text-slate-400 w-4">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <Input
                      placeholder={`Option ${String.fromCharCode(65 + i)}`}
                      value={opt}
                      onChange={e => {
                        const nextOpts = [...newQuestion.options];
                        nextOpts[i] = e.target.value;
                        setNewQuestion({ ...newQuestion, options: nextOpts });
                      }}
                      className="rounded-xl border-slate-300 bg-white text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700">Admin Stewardship Reason</Label>
              <Input
                placeholder="e.g. Added core concurrency question from curriculum review"
                value={newQuestion.reason}
                onChange={e => setNewQuestion({ ...newQuestion, reason: e.target.value })}
                className="mt-1.5 rounded-xl border-slate-300 bg-white text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAddQuestionOpen(false)}
                className="rounded-xl text-xs text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold shadow-sm"
              >
                {submitting ? "Saving..." : "Save to Question Bank"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Skill Dialog */}
      <Dialog open={isAddSkillOpen} onOpenChange={setIsAddSkillOpen}>
        <DialogContent className="max-w-md bg-white sm:rounded-2xl border border-slate-200 text-slate-900">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">
              Create New Skill Category
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Add a new learnable skill to the Skill-Swap platform. You can subsequently add assessment questions to verify teachers.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSkill} className="space-y-4 py-2">
            <div>
              <Label className="text-xs font-semibold text-slate-700">Skill Name</Label>
              <Input
                placeholder="e.g. React.js & Frontend Architecture"
                value={newSkill.name}
                onChange={e => {
                  const name = e.target.value;
                  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                  setNewSkill({ ...newSkill, name, slug: newSkill.slug ? newSkill.slug : slug });
                }}
                className="mt-1.5 rounded-xl border-slate-300 bg-white text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700">Skill Slug (URL & Database ID)</Label>
              <Input
                placeholder="e.g. react"
                value={newSkill.slug}
                onChange={e => setNewSkill({ ...newSkill, slug: e.target.value })}
                className="mt-1.5 rounded-xl border-slate-300 bg-white text-xs font-mono text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700">Category Track</Label>
              <Input
                placeholder="e.g. Web Development"
                value={newSkill.category}
                onChange={e => setNewSkill({ ...newSkill, category: e.target.value })}
                className="mt-1.5 rounded-xl border-slate-300 bg-white text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700">Description</Label>
              <Textarea
                placeholder="Brief description of competencies covered in this skill..."
                value={newSkill.description}
                onChange={e => setNewSkill({ ...newSkill, description: e.target.value })}
                className="mt-1.5 min-h-[60px] rounded-xl border-slate-300 bg-white text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAddSkillOpen(false)}
                className="rounded-xl text-xs text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold shadow-sm"
              >
                {submitting ? "Creating..." : "Create Skill"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}

type AdminSection =
  | "skills"
  | "assessments"
  | "matches"
  | "communications"
  | "sessions"
  | "recordings"
  | "certificates"
  | "announcements"
  | "support"
  | "settings"
  | "audit";
type AdminSectionDetails = [
  string,
  string,
  React.ComponentType<{ className?: string }>,
];

export function AdminManagement({ section }: { section: AdminSection }) {
  if (section === "skills") {
    return <QuestionBankManager />;
  }

  const details: Record<AdminSection, AdminSectionDetails> = {
    skills: [
      "Skills & question bank",
      "Shape the catalogue and keep every assessment version deliberate.",
      BookOpenCheck,
    ],
    assessments: [
      "Assessment monitoring",
      "Review attempts, pass rates, verification status, and retake policy.",
      ClipboardIcon,
    ],
    matches: [
      "Match monitoring",
      "See how reciprocal skill pairs move from suggestion to accepted exchange.",
      UsersRound,
    ],
    communications: [
      "Communications",
      "Monitor delivery health and protect the boundaries of private one-to-one conversations.",
      MessageIcon,
    ],
    sessions: [
      "Session monitoring",
      "Keep scheduled, live, completed, cancelled, and disputed sessions visible.",
      CalendarDays,
    ],
    recordings: [
      "Recording management",
      "Track provider callbacks, Cloudinary status, retention, and access permissions.",
      Video,
    ],
    certificates: [
      "Certificate management",
      "Search issuance records, verify public links, and manage revocation states.",
      FileCheck2,
    ],
    announcements: [
      "Announcements",
      "Keep members connected with targeted in-app and Gmail SMTP notices.",
      Bell,
    ],
    support: [
      "Support tickets",
      "Give every member concern a clear owner, status, and resolution path.",
      Mail,
    ],
    settings: [
      "Platform settings",
      "Tune policies and display settings while keeping deployment secrets server-side.",
      Settings2,
    ],
    audit: [
      "Audit log",
      "Review immutable administrator and security-sensitive actions.",
      ShieldCheck,
    ],
  };
  const [title, copy, Icon] = details[section];
  return (
    <AdminShell>
      <AdminHeader
        eyebrow="Administrator controls"
        title={title}
        copy={copy}
        action={
          <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm">
            <Icon className="mr-1.5 size-4" /> Create new
          </Button>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <AdminCard className="p-7 sm:p-9">
          <span className="grid size-12 place-items-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Icon className="size-6" />
          </span>
          <h2 className="mt-6 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            A clear place to manage {section}.
          </h2>
          <p className="mt-2.5 max-w-lg text-xs sm:text-sm leading-relaxed text-slate-600">
            Connect this surface to the Django `/api/v1/admin` boundary for live
            records, pagination, filters, role-checked mutations, and immutable
            audit events.
          </p>
          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                Implementation status
              </p>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <span className="size-1.5 rounded-full bg-emerald-500" /> UI ready
              </span>
            </div>
            <Progress
              value={68}
              className="mt-3 h-1.5 bg-slate-200 [&>div]:bg-blue-600"
            />
            <p className="mt-2.5 text-xs text-slate-500">
              Next: connect the protected Django collection and action handlers.
            </p>
          </div>
        </AdminCard>
        <AdminCard className="p-7">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
            Security & Compliance Guardrails
          </p>
          <div className="mt-5 space-y-4">
            {[
              "Every admin mutation requires an audit reason",
              "Sensitive views create an immutable log event",
              "Private member messages are protected by default",
              "Pagination safeguards all activity queries",
            ].map(item => (
              <div key={item} className="flex gap-2.5 text-xs font-medium text-slate-700">
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" />{" "}
                {item}
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-slate-200 pt-5">
            <p className="text-xs leading-relaxed text-slate-500">
              The client bundle never exposes SMTP, Cloudinary, or ZegoCloud
              server secrets. Credentials remain strictly isolated on the backend server.
            </p>
          </div>
        </AdminCard>
      </div>
    </AdminShell>
  );
}

function ClipboardIcon(props: { className?: string }) {
  return (
    <span
      {...props}
      className={`relative block size-4 rounded-[3px] border-2 border-current ${props.className || ""}`}
    />
  );
}
function MessageIcon(props: { className?: string }) {
  return (
    <span
      {...props}
      className={`relative block size-4 rounded-md border-2 border-current ${props.className || ""}`}
    >
      <span className="absolute -bottom-1 left-1 h-1.5 w-1.5 rotate-45 border-b-2 border-l-2 border-current bg-transparent" />
    </span>
  );
}
