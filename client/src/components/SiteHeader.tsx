import { Link } from "wouter";
import { ArrowUpRight, Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";

const links = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/skills", label: "Explore skills" },
  { href: "/verify-certificate", label: "Verify a certificate" },
];

function NavigationLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex items-center gap-7" aria-label="Primary navigation">
      {links.map(link => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onNavigate}
          className="editorial-link text-sm text-slate-600 hover:text-[#61567d]"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export default function SiteHeader() {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="relative z-20 border-b border-white/70 bg-[#faf9f5]/70 backdrop-blur-xl">
      <div className="container flex h-[74px] items-center justify-between gap-6">
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label="Skill-Swap home"
        >
          <span className="relative grid size-10 place-items-center rounded-full border border-[#b9afcf] bg-[#f1ecfa] text-[#61567d] shadow-[0_6px_18px_rgba(112,94,146,0.12)]">
            <Sparkles className="size-4 transition-transform duration-200 group-hover:rotate-12" />
          </span>
          <span className="leading-none">
            <span className="block font-serif text-[22px] tracking-[-0.03em] text-[#61567d]">
              Skill-Swap
            </span>
            <span className="mt-1 block text-[9px] uppercase tracking-[0.28em] text-slate-500">
              learn in exchange
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <NavigationLinks />
          {isAuthenticated ? (
            <Link
              href={
                user?.role === "admin" ? "/admin/dashboard" : "/app/dashboard"
              }
            >
              <Button className="rounded-full bg-[#6c5d88] px-5 text-white shadow-[0_10px_22px_rgba(108,93,136,0.2)] hover:bg-[#5d5077]">
                Open workspace <ArrowUpRight className="ml-1 size-4" />
              </Button>
            </Link>
          ) : (
            <Button
              onClick={() => startLogin()}
              variant="outline"
              className="rounded-full border-[#bfb5d0] bg-white/50 px-5 text-[#61567d] hover:bg-[#f1ecfa]"
            >
              Sign in
            </Button>
          )}
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Open navigation"
                className="rounded-full border-[#cfc6dc] bg-white/50 text-[#61567d]"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[320px] border-l-[#ded7e9] bg-[#fbfaf8] p-7"
            >
              <div className="mb-10 flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full border border-[#b9afcf] bg-[#f1ecfa] text-[#61567d]">
                  <Sparkles className="size-4" />
                </span>
                <span className="font-serif text-xl text-[#61567d]">
                  Skill-Swap
                </span>
              </div>
              <div className="flex flex-col items-start gap-6">
                <NavigationLinks onNavigate={() => undefined} />
                {isAuthenticated ? (
                  <Link
                    href={
                      user?.role === "admin"
                        ? "/admin/dashboard"
                        : "/app/dashboard"
                    }
                  >
                    <Button className="rounded-full bg-[#6c5d88] text-white">
                      Open workspace
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={() => startLogin()}
                    className="rounded-full bg-[#6c5d88] text-white"
                  >
                    Sign in
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
