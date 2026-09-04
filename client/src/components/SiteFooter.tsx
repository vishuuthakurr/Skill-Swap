import { Link } from "wouter";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/70 bg-[#f5f1f7]/70">
      <div className="container grid gap-10 py-12 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full border border-[#b9afcf] bg-[#f1ecfa] text-[#61567d]">
              <Sparkles className="size-4" />
            </span>
            <span className="font-serif text-xl text-[#61567d]">
              Skill-Swap
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-7 text-slate-600">
            A thoughtful exchange for the things we know, the things we are
            learning, and the people we meet along the way.
          </p>
        </div>
        <div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">
            Explore
          </p>
          <div className="flex flex-col gap-3 text-sm text-slate-600">
            <Link href="/how-it-works" className="hover:text-[#61567d]">
              How it works
            </Link>
            <Link href="/skills" className="hover:text-[#61567d]">
              Browse skills
            </Link>
            <Link href="/verify-certificate" className="hover:text-[#61567d]">
              Verify a certificate
            </Link>
          </div>
        </div>
        <div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">
            Care & clarity
          </p>
          <div className="flex flex-col gap-3 text-sm text-slate-600">
            <Link
              href="/help"
              className="inline-flex items-center gap-1 hover:text-[#61567d]"
            >
              Help center <ArrowUpRight className="size-3" />
            </Link>
            <Link href="/privacy" className="hover:text-[#61567d]">
              Privacy policy
            </Link>
            <Link href="/terms" className="hover:text-[#61567d]">
              Community guidelines
            </Link>
          </div>
        </div>
      </div>
      <div className="container flex flex-col gap-2 border-t border-white/80 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 Skill-Swap. Made for meaningful exchanges.</span>
        <span className="tracking-[0.16em]">LEARN · SHARE · GROW</span>
      </div>
    </footer>
  );
}
