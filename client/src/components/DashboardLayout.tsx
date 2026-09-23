import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { startLogin } from "@/const";
import { useIsMobile } from "@/hooks/useMobile";
import {
  Bell,
  BookOpenCheck,
  CalendarDays,
  ClipboardList,
  FileCheck2,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  PanelLeft,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
  UsersRound,
} from "lucide-react";
import { CSSProperties, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export type DashboardVariant = "member" | "admin";

type MenuItem = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
};

const memberItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "Overview", path: "/app/dashboard" },
  { icon: Search, label: "Discover Matches", path: "/app/matches/discover" },
  { icon: BookOpenCheck, label: "My Skills & Tests", path: "/app/my-skills" },
  { icon: MessageCircle, label: "Messages", path: "/app/messages" },
  { icon: CalendarDays, label: "Sessions", path: "/app/sessions" },
  { icon: FileCheck2, label: "Certificates", path: "/app/certificates" },
  { icon: Bell, label: "Notifications", path: "/app/notifications" },
];

const adminItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "Overview", path: "/admin/dashboard" },
  { icon: Users, label: "Users & Teachers", path: "/admin/users" },
  { icon: ActivityIcon, label: "Activity Monitor", path: "/admin/activity" },
  { icon: BookOpenCheck, label: "Question Bank", path: "/admin/skills" },
  { icon: ClipboardList, label: "Assessments", path: "/admin/assessments" },
  { icon: UsersRound, label: "Matches", path: "/admin/matches" },
  {
    icon: MessageCircle,
    label: "Communications",
    path: "/admin/communications",
  },
  { icon: CalendarDays, label: "Sessions", path: "/admin/sessions" },
  { icon: ShieldCheck, label: "Disputes & Reports", path: "/admin/reports" },
  { icon: FileCheck2, label: "Certificates", path: "/admin/certificates" },
  { icon: Bell, label: "Announcements", path: "/admin/announcements" },
  { icon: Settings2, label: "Settings", path: "/admin/settings" },
];

function ActivityIcon(props: React.ComponentProps<"span">) {
  return (
    <span {...props} className="relative block size-4">
      <span className="absolute bottom-0 left-0 h-2 w-1 rounded-full bg-current" />
      <span className="absolute bottom-0 left-1.5 h-4 w-1 rounded-full bg-current" />
      <span className="absolute bottom-0 left-3 h-3 w-1 rounded-full bg-current" />
    </span>
  );
}

export default function DashboardLayout({
  children,
  variant = "member",
}: {
  children: React.ReactNode;
  variant?: DashboardVariant;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const { loading, user } = useAuth();
  useEffect(() => {
    const saved = window.localStorage.getItem(`skill-swap-${variant}-sidebar`);
    if (saved) setSidebarWidth(Number(saved));
  }, [variant]);
  useEffect(() => {
    window.localStorage.setItem(
      `skill-swap-${variant}-sidebar`,
      String(sidebarWidth)
    );
  }, [sidebarWidth, variant]);
  if (loading) return <DashboardLayoutSkeleton />;
  if (!user)
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <GraduationCap className="size-6" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Sign In to SkillSwap PRO
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Access your courses, swaps, assessments, and verified credentials.
          </p>
          <Link href="/login">
            <Button
              className="mt-6 w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  return (
    <SidebarProvider
      style={{ "--sidebar-width": `${sidebarWidth}px` } as CSSProperties}
    >
      <DashboardContent
        variant={variant}
        items={variant === "admin" ? adminItems : memberItems}
        user={user}
      >
        {children}
      </DashboardContent>
    </SidebarProvider>
  );
}

function DashboardContent({
  children,
  variant,
  items,
  user,
}: {
  children: React.ReactNode;
  variant: DashboardVariant;
  items: MenuItem[];
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
}) {
  const [location, setLocation] = useLocation();
  const { toggleSidebar } = useSidebar();
  const { logout } = useAuth();
  const isMobile = useIsMobile();
  const current = items.find((item) => location.startsWith(item.path));

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      <Sidebar
        collapsible="icon"
        className="border-r border-slate-200 bg-white"
      >
        <SidebarHeader className="h-16 justify-center border-b border-slate-200 px-4">
          <Link
            href={variant === "admin" ? "/admin/dashboard" : "/app/dashboard"}
            className="flex items-center gap-2.5"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <GraduationCap className="size-5" />
            </div>
            <div className="group-data-[collapsible=icon]:hidden leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  Skill<span className="text-blue-600">Swap</span>
                </span>
                <span className="rounded bg-blue-100 px-1 py-0.2 text-[9px] font-bold text-blue-700">
                  {variant === "admin" ? "ADMIN" : "PRO"}
                </span>
              </div>
              <span className="text-[10px] text-slate-400">
                {variant === "admin" ? "Platform Control" : "Learning Workspace"}
              </span>
            </div>
          </Link>
        </SidebarHeader>

        <SidebarContent className="px-3 py-4">
          <div className="mb-2 flex items-center justify-between px-2 group-data-[collapsible=icon]:justify-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-data-[collapsible=icon]:hidden">
              {variant === "admin" ? "Platform Navigation" : "Workspace Menu"}
            </p>
            <button
              onClick={toggleSidebar}
              aria-label="Toggle navigation"
              className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <PanelLeft className="size-3.5" />
            </button>
          </div>

          <SidebarMenu className="gap-1">
            {items.map((item) => {
              const active = location.startsWith(item.path);
              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    isActive={active}
                    onClick={() => setLocation(item.path)}
                    tooltip={item.label}
                    className={`h-9.5 rounded-lg px-3 text-sm font-medium transition-colors ${
                      active
                        ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <item.icon className={`size-4.5 ${active ? "text-white" : "text-slate-500"}`} />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t border-slate-200 p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-2.5 rounded-xl p-2 text-left transition-colors hover:bg-slate-100 group-data-[collapsible=icon]:justify-center">
                <Avatar className="size-9 border border-slate-200 shadow-sm">
                  <AvatarFallback className="bg-blue-50 text-xs font-bold text-blue-700">
                    {user.name?.slice(0, 2).toUpperCase() || "SS"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                  <p className="truncate text-xs font-semibold text-slate-900">
                    {user.name || "Member"}
                  </p>
                  <p className="truncate text-[11px] text-slate-500">
                    {variant === "admin"
                      ? "Administrator"
                      : user.email || "Verified Member"}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 shadow-lg">
              <DropdownMenuItem
                onClick={() => logout()}
                className="cursor-pointer text-red-600 hover:bg-red-50"
              >
                <LogOut className="mr-2 size-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex-1 bg-slate-50">
        {isMobile && (
          <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="size-8 rounded-lg border border-slate-200" />
              <span className="text-base font-bold text-slate-900">
                {current?.label || "Workspace"}
              </span>
            </div>
          </div>
        )}
        <main className="min-h-screen p-5 sm:p-8 lg:p-10">{children}</main>
      </SidebarInset>
    </div>
  );
}
