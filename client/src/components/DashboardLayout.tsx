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
  { icon: Search, label: "Discover matches", path: "/app/matches/discover" },
  { icon: BookOpenCheck, label: "My skills", path: "/app/my-skills" },
  { icon: MessageCircle, label: "Conversations", path: "/app/messages" },
  { icon: CalendarDays, label: "Sessions", path: "/app/sessions" },
  { icon: FileCheck2, label: "Certificates", path: "/app/certificates" },
  { icon: Bell, label: "Notifications", path: "/app/notifications" },
];

const adminItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "Overview", path: "/admin/dashboard" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: ActivityIcon, label: "Activity monitor", path: "/admin/activity" },
  { icon: BookOpenCheck, label: "Skills & questions", path: "/admin/skills" },
  { icon: ClipboardList, label: "Assessments", path: "/admin/assessments" },
  { icon: UsersRound, label: "Matches", path: "/admin/matches" },
  {
    icon: MessageCircle,
    label: "Communications",
    path: "/admin/communications",
  },
  { icon: CalendarDays, label: "Sessions", path: "/admin/sessions" },
  { icon: ShieldCheck, label: "Reports & moderation", path: "/admin/reports" },
  { icon: FileCheck2, label: "Certificates", path: "/admin/certificates" },
  { icon: Bell, label: "Announcements", path: "/admin/announcements" },
  { icon: Settings2, label: "Platform settings", path: "/admin/settings" },
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
  const [sidebarWidth, setSidebarWidth] = useState(272);
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
      <div className="page-wash flex min-h-screen items-center justify-center p-6">
        <div className="bracket max-w-md rounded-[1.75rem] border border-white/80 bg-white/60 p-10 text-center shadow-[0_20px_60px_rgba(117,98,145,0.12)]">
          <Sparkles className="mx-auto size-8 text-[#8f81ad]" />
          <h1 className="mt-6 font-serif text-3xl text-[#5b506e]">
            Sign in to continue
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Your private learning workspace is waiting for you.
          </p>
          <Button
            onClick={() => startLogin()}
            className="mt-7 rounded-full bg-[#6c5d88] px-7 text-white"
          >
            Sign in
          </Button>
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
  const { state, toggleSidebar } = useSidebar();
  const { logout } = useAuth();
  const isMobile = useIsMobile();
  const current = items.find(item => location.startsWith(item.path));
  return (
    <>
      <Sidebar
        collapsible="icon"
        className="border-r border-[#e7e1eb] bg-[#fbfaf8]/90"
      >
        <SidebarHeader className="h-20 justify-center border-b border-[#eee9f0]">
          <Link
            href={variant === "admin" ? "/admin/dashboard" : "/app/dashboard"}
            className="flex items-center gap-3 px-2"
          >
            <span className="grid size-9 place-items-center rounded-full border border-[#b9afcf] bg-[#f1ecfa] text-[#61567d]">
              <Sparkles className="size-4" />
            </span>
            <span className="group-data-[collapsible=icon]:hidden">
              <span className="block font-serif text-xl text-[#61567d]">
                Skill-Swap
              </span>
              <span className="block text-[9px] uppercase tracking-[0.2em] text-slate-500">
                {variant === "admin" ? "steward workspace" : "your exchange"}
              </span>
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="px-2 py-5">
          <div className="mb-3 flex items-center justify-between px-2 group-data-[collapsible=icon]:justify-center">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400 group-data-[collapsible=icon]:hidden">
              {variant === "admin" ? "Monitor" : "Workspace"}
            </p>
            <button
              onClick={toggleSidebar}
              aria-label="Toggle navigation"
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-[#f1ecfa] hover:text-[#61567d]"
            >
              <PanelLeft className="size-4" />
            </button>
          </div>
          <SidebarMenu>
            {items.map(item => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  isActive={location.startsWith(item.path)}
                  onClick={() => setLocation(item.path)}
                  tooltip={item.label}
                  className="h-10 rounded-xl text-slate-600 data-[active=true]:bg-[#eee6f7] data-[active=true]:text-[#61567d]"
                >
                  <item.icon className="size-4" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t border-[#eee9f0] p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-[#f4f0f6] group-data-[collapsible=icon]:justify-center">
                <Avatar className="size-9 border border-white shadow-sm">
                  <AvatarFallback className="bg-[#e9e2f2] text-xs text-[#6c5d88]">
                    {user.name?.slice(0, 2).toUpperCase() || "SS"}
                  </AvatarFallback>
                </Avatar>
                <span className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                  <span className="block truncate text-sm font-medium text-slate-700">
                    {user.name || "Member"}
                  </span>
                  <span className="block truncate text-xs text-slate-500">
                    {variant === "admin"
                      ? "Administrator"
                      : user.email || "Member"}
                  </span>
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem
                onClick={() => logout()}
                className="cursor-pointer text-[#ba6268]"
              >
                <LogOut className="mr-2 size-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-transparent">
        {isMobile && (
          <div className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-white/80 bg-[#fbfaf8]/85 px-3 backdrop-blur">
            <SidebarTrigger className="size-9 rounded-lg bg-white/60" />
            <span className="font-serif text-lg text-[#61567d]">
              {current?.label || "Workspace"}
            </span>
          </div>
        )}
        <main className="min-h-screen p-4 sm:p-7 lg:p-10">{children}</main>
      </SidebarInset>
    </>
  );
}
