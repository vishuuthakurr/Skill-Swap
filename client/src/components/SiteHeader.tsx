import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Layers,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";

const categories = [
  { name: "Programming & Tech", slug: "technology", count: "45+ skills" },
  { name: "Design & Creative", slug: "design", count: "30+ skills" },
  { name: "Languages & Culture", slug: "languages", count: "25+ skills" },
  { name: "Productivity & Business", slug: "productivity", count: "20+ skills" },
  { name: "Music & Performing Arts", slug: "music", count: "15+ skills" },
  { name: "Health & Wellbeing", slug: "wellbeing", count: "18+ skills" },
];

export default function SiteHeader() {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/skills?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      setLocation("/skills");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md transition-all">
      <div className="container flex h-16 items-center justify-between gap-4 lg:gap-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5"
          aria-label="Skill-Swap Home"
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 text-white shadow-md shadow-blue-500/20 transition-transform group-hover:scale-105">
            <GraduationCap className="size-5.5" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Skill<span className="text-blue-600">Swap</span>
              </span>
              <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                PRO
              </span>
            </div>
            <span className="hidden text-[10px] font-medium tracking-wide text-slate-500 sm:block">
              Peer Learning Marketplace
            </span>
          </div>
        </Link>

        {/* Categories Dropdown (Udemy Style) */}
        <div className="hidden lg:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="gap-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              >
                <Layers className="size-4 text-blue-600" />
                <span>Categories</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 p-2 shadow-lg">
              <DropdownMenuLabel className="text-xs font-semibold text-slate-500">
                Explore Tracks
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {categories.map((cat) => (
                <DropdownMenuItem
                  key={cat.name}
                  onClick={() => setLocation(`/skills`)}
                  className="flex items-center justify-between cursor-pointer py-2"
                >
                  <span className="font-medium text-slate-800">{cat.name}</span>
                  <span className="text-xs text-slate-400">{cat.count}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setLocation("/skills")}
                className="cursor-pointer font-semibold text-blue-600 hover:text-blue-700"
              >
                View all skills catalog →
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Global Search Bar (Udemy Style) */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative hidden flex-1 max-w-md md:block"
        >
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills, e.g. Python, UI Design, French..."
            className="h-10 w-full rounded-full border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-500/20"
          />
        </form>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-6 xl:flex" aria-label="Primary navigation">
          <Link
            href="/skills"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
          >
            Explore Catalog
          </Link>
          <Link
            href="/how-it-works"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
          >
            How It Works
          </Link>
          <Link
            href="/verify-certificate"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-emerald-600"
          >
            <ShieldCheck className="size-4 text-emerald-500" />
            Verify Credential
          </Link>
        </nav>

        {/* Auth CTA Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <Link
              href={
                user?.role === "admin" ? "/admin/dashboard" : "/app/dashboard"
              }
            >
              <Button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-500/25 transition-all hover:bg-blue-700">
                Workspace <ArrowRight className="ml-1.5 size-4" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-100"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  className="rounded-lg bg-blue-600 px-4.5 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-500/25 transition-all hover:bg-blue-700"
                >
                  Get Started Free
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation Drawer */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Open menu"
                className="rounded-lg border-slate-200 text-slate-700"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[310px] p-6">
              <div className="mb-6 flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                  <GraduationCap className="size-5" />
                </div>
                <div>
                  <span className="text-lg font-bold tracking-tight text-slate-900">
                    Skill<span className="text-blue-600">Swap</span>
                  </span>
                  <span className="ml-1.5 rounded bg-blue-100 px-1 py-0.5 text-[9px] font-bold text-blue-700">
                    PRO
                  </span>
                </div>
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="relative mb-6">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search skills..."
                  className="h-9 rounded-lg border-slate-200 pl-9 text-xs"
                />
              </form>

              <div className="flex flex-col gap-4 text-sm font-medium text-slate-700">
                <Link
                  href="/skills"
                  className="flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-slate-100"
                >
                  <BookOpen className="size-4 text-blue-600" />
                  Explore Catalog
                </Link>
                <Link
                  href="/how-it-works"
                  className="flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-slate-100"
                >
                  <Sparkles className="size-4 text-indigo-600" />
                  How It Works
                </Link>
                <Link
                  href="/verify-certificate"
                  className="flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-slate-100"
                >
                  <ShieldCheck className="size-4 text-emerald-600" />
                  Verify Certificate
                </Link>
              </div>

              <div className="mt-8 border-t border-slate-200 pt-6">
                {isAuthenticated ? (
                  <Link
                    href={
                      user?.role === "admin"
                        ? "/admin/dashboard"
                        : "/app/dashboard"
                    }
                  >
                    <Button className="w-full rounded-lg bg-blue-600 text-white font-semibold shadow-sm">
                      Go to Workspace
                    </Button>
                  </Link>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link href="/login">
                      <Button
                        variant="outline"
                        className="w-full rounded-lg"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button
                        className="w-full rounded-lg bg-blue-600 text-white font-semibold"
                      >
                        Get Started Free
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
