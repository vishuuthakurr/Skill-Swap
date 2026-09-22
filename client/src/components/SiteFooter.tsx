import { Link } from "wouter";
import {
  ArrowUpRight,
  Award,
  CheckCircle2,
  GraduationCap,
  Heart,
  ShieldCheck,
  Video,
} from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      {/* Top Banner / Feature Callouts */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-8">
        <div className="container grid grid-cols-2 gap-6 md:grid-cols-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <Award className="size-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Vetted Assessments</p>
              <p className="text-[11px] text-slate-400">70% benchmark pass mark</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Verified Badges</p>
              <p className="text-[11px] text-slate-400">Cryptographic certificates</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Video className="size-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">1:1 Live Rooms</p>
              <p className="text-[11px] text-slate-400">Built-in HD video & chat</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Zero Subscription</p>
              <p className="text-[11px] text-slate-400">100% reciprocal exchange</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container grid gap-10 py-12 sm:grid-cols-2 md:grid-cols-4">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
              <GraduationCap className="size-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">
                Skill<span className="text-blue-400">Swap</span>
              </span>
              <span className="ml-1.5 rounded bg-blue-900/60 px-1 py-0.5 text-[9px] font-bold text-blue-300">
                PRO
              </span>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            The next-generation peer learning exchange platform. Learn from
            practitioners, test your skills, and earn verified teacher
            credentials.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Platform Status: Operational (v2.4 Pro)</span>
          </div>
        </div>

        {/* Explore Links */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Catalog & Tracks
          </p>
          <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
            <li>
              <Link href="/skills" className="transition-colors hover:text-white">
                Python Programming
              </Link>
            </li>
            <li>
              <Link href="/skills" className="transition-colors hover:text-white">
                UI & Product Design
              </Link>
            </li>
            <li>
              <Link href="/skills" className="transition-colors hover:text-white">
                French & Language Practice
              </Link>
            </li>
            <li>
              <Link href="/skills" className="transition-colors hover:text-white">
                Data Science & Analytics
              </Link>
            </li>
            <li>
              <Link href="/skills" className="transition-colors hover:text-white">
                Public Speaking & Pitching
              </Link>
            </li>
          </ul>
        </div>

        {/* Platform Links */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Platform & Trust
          </p>
          <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
            <li>
              <Link href="/how-it-works" className="transition-colors hover:text-white">
                How Skill Swapping Works
              </Link>
            </li>
            <li>
              <Link href="/verify-certificate" className="transition-colors hover:text-emerald-400">
                Verify a Certificate
              </Link>
            </li>
            <li>
              <Link href="/help" className="transition-colors hover:text-white">
                Assessment Benchmarks
              </Link>
            </li>
            <li>
              <Link href="/help" className="transition-colors hover:text-white">
                Security & Video Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="transition-colors hover:text-white">
                Code of Conduct
              </Link>
            </li>
          </ul>
        </div>

        {/* Support & Legal */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Support & Legal
          </p>
          <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
            <li>
              <Link href="/help" className="flex items-center gap-1 transition-colors hover:text-white">
                Help & FAQ Center <ArrowUpRight className="size-3" />
              </Link>
            </li>
            <li>
              <Link href="/contact" className="transition-colors hover:text-white">
                Contact Stewards
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="transition-colors hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="transition-colors hover:text-white">
                Terms of Exchange
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 py-6 text-xs text-slate-500">
        <div className="container flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p>© 2026 Skill-Swap Inc. Built for reciprocal knowledge exchange.</p>
          <p className="flex items-center gap-1.5">
            Empowering curious learners worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
