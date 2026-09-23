import { useMemo, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock,
  FileCheck2,
  GraduationCap,
  Layers,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CertificateVerificationPanel from "@/components/CertificateVerificationPanel";
import { startLogin } from "@/const";

export const skills = [
  {
    name: "Python",
    category: "Technology",
    count: 28,
    rating: 4.9,
    reviews: 142,
    gradient: "from-blue-600 to-indigo-700",
    badge: "Highest Demand",
    description: "Data structures, algorithms, FastAPI, and data manipulation.",
  },
  {
    name: "UI design",
    category: "Design",
    count: 22,
    rating: 4.88,
    reviews: 118,
    gradient: "from-purple-600 to-pink-600",
    badge: "Popular Track",
    description: "Design systems, typography, Figma workflows, and user testing.",
  },
  {
    name: "JavaScript",
    category: "Technology",
    count: 31,
    rating: 4.95,
    reviews: 164,
    gradient: "from-amber-600 to-orange-600",
    badge: "Top Rated",
    description: "ES6+, React, asynchronous workflows, and node fundamentals.",
  },
  {
    name: "French",
    category: "Languages",
    count: 16,
    rating: 4.8,
    reviews: 86,
    gradient: "from-emerald-600 to-teal-700",
    badge: "Active Swaps",
    description: "Conversational fluency, phonetics, and grammatical precision.",
  },
  {
    name: "Photography",
    category: "Creative practice",
    count: 19,
    rating: 4.75,
    reviews: 94,
    gradient: "from-rose-600 to-red-600",
    badge: "Visual Arts",
    description: "Composition, lighting control, color grading, and Lightroom.",
  },
  {
    name: "Excel",
    category: "Productivity",
    count: 24,
    rating: 4.7,
    reviews: 102,
    gradient: "from-cyan-600 to-blue-700",
    badge: "Career Essential",
    description: "Advanced VLOOKUP/XLOOKUP, pivot reporting, and macros.",
  },
  {
    name: "Public speaking",
    category: "Communication",
    count: 14,
    rating: 4.85,
    reviews: 73,
    gradient: "from-violet-600 to-purple-800",
    badge: "Executive Skill",
    description: "Stage presence, executive pitch structures, and vocal pacing.",
  },
  {
    name: "Guitar",
    category: "Music",
    count: 12,
    rating: 4.65,
    reviews: 62,
    gradient: "from-yellow-600 to-amber-700",
    badge: "Instrumental",
    description: "Chord progressions, fingerstyle technique, and musical ear.",
  },
  {
    name: "Yoga",
    category: "Wellbeing",
    count: 15,
    rating: 4.9,
    reviews: 88,
    gradient: "from-teal-600 to-emerald-700",
    badge: "Mindfulness",
    description: "Breathwork, posture alignment, and mindful daily mobility.",
  },
];

function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

function PageIntro({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: React.ReactNode;
  copy: string;
}) {
  return (
    <section className="border-b border-slate-200 bg-white py-14 sm:py-18">
      <div className="container">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          <Sparkles className="size-3.5 text-blue-600" />
          <span>{eyebrow}</span>
        </div>
        <h1 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
          {copy}
        </p>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const sequence = [
    {
      number: "01",
      title: "Define What You Know & Seek",
      copy: "Build your learning and teaching profile. Declare skills you can mentor others in, and subjects you want to acquire.",
      icon: Layers,
    },
    {
      number: "02",
      title: "Take the 35-Question Assessment",
      copy: "Pass our timed, randomized 35-question knowledge assessment with 70%+ score to earn your official 'Verified Teacher' mark.",
      icon: Award,
    },
    {
      number: "03",
      title: "Match Reciprocally with Peers",
      copy: "Our matching engine identifies reciprocal synergy: your Python expertise paired with someone's UI design prowess.",
      icon: Users,
    },
    {
      number: "04",
      title: "Collaborate in Live Video Sessions",
      copy: "Schedule time and enter built-in 1:1 HD video rooms powered by ZegoCloud with synchronized whiteboard & text chat.",
      icon: Video,
    },
    {
      number: "05",
      title: "Earn Verifiable Cryptographic Proof",
      copy: "Upon successful session completion, receive a tamper-proof certificate that can be publicly validated anytime.",
      icon: ShieldCheck,
    },
  ];

  return (
    <PublicShell>
      <PageIntro
        eyebrow="Proven Reciprocal Learning Framework"
        title={
          <>
            The Structured Path to{" "}
            <span className="text-blue-600">Mastery via Peer Exchange</span>
          </>
        }
        copy="Skill-Swap is designed from the ground up to make peer learning rigorous, trustworthy, and mutually rewarding."
      />

      <section className="container py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sequence.map((step) => (
            <article
              key={step.number}
              className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-blue-600">
                  {step.number}
                </span>
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <step.icon className="size-5" />
                </div>
              </div>
              <h2 className="mt-6 text-xl font-bold text-slate-900">
                {step.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {step.copy}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="container pb-20">
        <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-8 sm:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Guaranteed Authenticity
              </span>
              <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                Every Assessment & Swap Is Verifiable.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
                No pay-to-play credentials. Every teacher badge requires passing
                a 35-question domain assessment, and each certificate includes a
                tamper-proof cryptographic verification token.
              </p>
            </div>
            <Link href="/verify-certificate">
              <Button className="shrink-0 rounded-xl bg-blue-600 px-6 font-semibold text-white shadow-sm hover:bg-blue-700">
                Verify Any Certificate <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}

export function Skills() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) setQuery(q);
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(skills.map((skill) => skill.category))),
  ];

  const visible = useMemo(
    () =>
      skills.filter(
        (skill) =>
          (category === "All" || skill.category === category) &&
          (skill.name.toLowerCase().includes(query.toLowerCase()) ||
            skill.category.toLowerCase().includes(query.toLowerCase()))
      ),
    [category, query]
  );

  return (
    <PublicShell>
      <PageIntro
        eyebrow="Marketplace Catalog"
        title={
          <>
            Explore All Available{" "}
            <span className="text-blue-600">Skill Circles</span>
          </>
        }
        copy="Browse verified peer courses across technology, design, languages, and business. Connect with peers to swap skills 1-on-1."
      />

      <section className="container py-12">
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search skills, topics, or categories..."
              className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 text-sm focus-visible:bg-white focus-visible:border-blue-600"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((item) => (
              <Button
                key={item}
                onClick={() => setCategory(item)}
                variant={category === item ? "default" : "outline"}
                className={
                  category === item
                    ? "rounded-lg bg-blue-600 text-white font-semibold text-xs shadow-sm hover:bg-blue-700"
                    : "rounded-lg border-slate-200 text-slate-600 text-xs hover:border-blue-300 hover:text-blue-600"
                }
              >
                {item}
              </Button>
            ))}
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((skill) => (
            <Link
              key={skill.name}
              href={`/skills/${skill.name.toLowerCase().replaceAll(" ", "-")}`}
            >
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-slate-200/50 cursor-pointer">
                {/* Header Gradient */}
                <div
                  className={`h-28 bg-gradient-to-tr ${skill.gradient} p-4 text-white flex flex-col justify-between`}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                      {skill.category}
                    </span>
                    <span className="rounded bg-white/90 px-2 py-0.5 text-[10px] font-bold text-slate-900 shadow-sm">
                      {skill.badge}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold leading-tight text-white drop-shadow-sm">
                    {skill.name}
                  </h2>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                  <div>
                    <p className="text-xs leading-relaxed text-slate-600 line-clamp-2">
                      {skill.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                      <div className="flex items-center gap-1 font-bold text-amber-500">
                        <Star className="size-3.5 fill-amber-400 text-amber-400" />
                        <span>{skill.rating}</span>
                        <span className="font-normal text-slate-400">
                          ({skill.reviews})
                        </span>
                      </div>
                      <span className="font-medium text-slate-600">
                        {skill.count} Active Teachers
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-xs font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
                      View Circle Details{" "}
                      <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                      <ShieldCheck className="size-3.5" /> Verified
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {visible.length === 0 && (
          <div className="py-20 text-center">
            <Sparkles className="mx-auto size-8 text-slate-400" />
            <h3 className="mt-4 text-xl font-bold text-slate-900">
              No matching skill circles found
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Try adjusting your search terms or filter by category.
            </p>
          </div>
        )}
      </section>
    </PublicShell>
  );
}

export function SkillDetail({ slug }: { slug: string }) {
  const name = slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  const skill = skills.find(
    (item) => item.name.toLowerCase() === name.toLowerCase()
  ) ?? {
    name,
    category: "Specialized Skill",
    count: 12,
    rating: 4.8,
    reviews: 64,
    gradient: "from-blue-600 to-indigo-700",
    badge: "Active Track",
    description: "Master fundamentals, practical projects, and peer exchange.",
  };

  return (
    <PublicShell>
      <PageIntro
        eyebrow={`${skill.category} Track`}
        title={
          <>
            Master & Exchange{" "}
            <span className="text-blue-600">{skill.name}</span>
          </>
        }
        copy={`Join the ${skill.name} peer circle. Learn from verified practitioners, test your knowledge in the 35-question assessment, and swap skills 1-on-1.`}
      />

      <section className="container grid gap-8 py-14 lg:grid-cols-[1.2fr_.8fr]">
        {/* Left Column: Syllabus & Swap Overview */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <span className="rounded bg-blue-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
              Exchange Overview
            </span>
            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              How You Learn & Teach {skill.name}
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
              <p>
                Skill-Swap pairs reciprocal goals so that learning is 100% free
                and mutually motivated. When you offer {skill.name}, you connect
                with peers who can teach you complementary disciplines.
              </p>
              <p>
                To earn the <strong>Verified Teacher</strong> ribbon, you must
                pass our randomized 35-question timed domain assessment with a
                score of 70% or higher.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/login">
                <Button
                  className="rounded-xl bg-blue-600 px-6 font-semibold text-white shadow-md hover:bg-blue-700"
                >
                  Join {skill.name} Circle <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href={`/app/assessments/${slug}`}>
                <Button
                  variant="outline"
                  className="rounded-xl border-slate-300 font-semibold text-slate-700 hover:border-blue-600 hover:text-blue-600"
                >
                  Take 35-Q Assessment
                </Button>
              </Link>
            </div>
          </div>

          {/* Syllabus / Benchmark Topics */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">
              Assessment Benchmark Topics
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              The 35 questions evaluate proficiency across these critical areas:
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs font-medium text-slate-800">
                  Core syntax & fundamentals
                </span>
              </div>
              <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs font-medium text-slate-800">
                  Practical problem-solving
                </span>
              </div>
              <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs font-medium text-slate-800">
                  Architecture & design patterns
                </span>
              </div>
              <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs font-medium text-slate-800">
                  Troubleshooting & debugging
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Track Stats Card */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Track Metrics
            </p>
            <div className="mt-6 space-y-6">
              <div>
                <p className="text-3xl font-extrabold text-slate-900">
                  {skill.count} Active Teachers
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Ready to exchange sessions this week
                </p>
              </div>
              <div className="h-px bg-slate-100" />
              <div>
                <p className="text-3xl font-extrabold text-emerald-600">
                  70% Pass Gate
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Rigorous 35-question timed assessment
                </p>
              </div>
              <div className="h-px bg-slate-100" />
              <div>
                <p className="text-3xl font-extrabold text-blue-600">
                  1:1 HD Video
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Built-in ZegoCloud video rooms
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}

export function CertificateVerify() {
  return (
    <PublicShell>
      <PageIntro
        eyebrow="Public Trust Registry"
        title={
          <>
            Verify Authenticity of{" "}
            <span className="text-blue-600">Skill-Swap Credentials</span>
          </>
        }
        copy="Enter any Skill-Swap certificate ID or verification token below to query our live registry and validate recipient, skill score, and issue date."
      />
      <section className="container py-14">
        <CertificateVerificationPanel />
      </section>
    </PublicShell>
  );
}

export function InfoPage({
  type,
}: {
  type: "help" | "contact" | "privacy" | "terms";
}) {
  const infoMap = {
    help: {
      eyebrow: "Help & FAQ Center",
      title: "Frequently Asked Questions",
      intro:
        "Everything you need to know about peer matching, the 35-question assessment engine, live video rooms, and certificate validation.",
    },
    contact: {
      eyebrow: "Support & Contact",
      title: "Connect with Platform Stewards",
      intro:
        "Get in touch for account assistance, dispute resolution, or community feedback.",
    },
    privacy: {
      eyebrow: "Data Protection",
      title: "Privacy & Video Session Policy",
      intro:
        "Learn how we safeguard user data, session consent, and encrypted communication tokens.",
    },
    terms: {
      eyebrow: "Code of Conduct",
      title: "Community Guidelines & Terms",
      intro:
        "Our standards for respectful, collaborative, and reciprocal peer exchanges.",
    },
  }[type];

  return (
    <PublicShell>
      <PageIntro
        eyebrow={infoMap.eyebrow}
        title={infoMap.title}
        copy={infoMap.intro}
      />
      <section className="container grid gap-8 py-14 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:col-span-2 space-y-4 text-sm leading-relaxed text-slate-600">
          <h2 className="text-xl font-bold text-slate-900">
            About Skill-Swap Standards
          </h2>
          <p>
            Skill-Swap is built on three foundational pillars: transparency,
            rigorous quality gates, and mutual reciprocity. We eliminate the
            traditional friction and expensive paywalls of online learning.
          </p>
          <p>
            Every user who represents themselves as a teacher has taken and
            passed a domain test. Every session is hosted in encrypted video
            channels, and every completed exchange awards a verifiable digital
            credential.
          </p>
          <div className="pt-4">
            <Link href="/skills">
              <Button className="rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-700">
                Explore All Skills <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-blue-50/50 p-6 space-y-4">
          <CircleHelp className="size-8 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900">
            Have a Question?
          </h3>
          <p className="text-xs text-slate-600">
            Check your workspace dashboard or reach out to our team directly.
          </p>
          <Link href="/contact">
            <Button variant="outline" className="w-full rounded-lg border-blue-200 text-blue-700 hover:bg-blue-100">
              Contact Support
            </Button>
          </Link>
        </div>
      </section>
    </PublicShell>
  );
}
