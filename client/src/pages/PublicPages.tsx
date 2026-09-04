import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowUpRight,
  Check,
  CircleHelp,
  FileCheck2,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CertificateVerificationPanel from "@/components/CertificateVerificationPanel";

const skills = [
  {
    name: "Python",
    category: "Technology",
    count: 18,
    tone: "bg-[#eee6f7] text-[#6c5d88]",
  },
  {
    name: "Photography",
    category: "Creative practice",
    count: 12,
    tone: "bg-[#f8e8ee] text-[#946e83]",
  },
  {
    name: "French",
    category: "Languages",
    count: 9,
    tone: "bg-[#e4f2eb] text-[#5c806d]",
  },
  {
    name: "UI design",
    category: "Design",
    count: 14,
    tone: "bg-[#f4eddd] text-[#8b7652]",
  },
  {
    name: "Public speaking",
    category: "Communication",
    count: 7,
    tone: "bg-[#e9e8f5] text-[#6f6b96]",
  },
  {
    name: "Excel",
    category: "Productivity",
    count: 11,
    tone: "bg-[#e4f0f1] text-[#5c7f84]",
  },
  {
    name: "Guitar",
    category: "Music",
    count: 8,
    tone: "bg-[#f6e8de] text-[#9a755f]",
  },
  {
    name: "Yoga",
    category: "Wellbeing",
    count: 6,
    tone: "bg-[#e7f1e9] text-[#60816f]",
  },
];

function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-wash min-h-screen">
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
    <section className="container border-b border-white/70 py-20 sm:py-28">
      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8f81ad]">
        {eyebrow}
      </p>
      <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-[1.02] tracking-[-0.035em] text-[#5b506e] sm:text-6xl">
        {title}
      </h1>
      <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">{copy}</p>
    </section>
  );
}

export function HowItWorks() {
  const sequence = [
    [
      "01",
      "Make a profile with intention",
      "Start with what you know and what you would love to understand better. Your profile is a living snapshot, not a résumé.",
    ],
    [
      "02",
      "Show what you can teach",
      "A short skill assessment helps the community understand where your experience is strongest. Pass a skill, earn its Verified Teacher mark.",
    ],
    [
      "03",
      "Find a reciprocal fit",
      "Our matching logic looks for complementary goals: your Python for someone’s French, their photography for your public speaking.",
    ],
    [
      "04",
      "Make space for a session",
      "Open a private conversation, choose a time, and meet in a focused video room with optional recording consent.",
    ],
    [
      "05",
      "Leave with a record",
      "Confirm the exchange together and keep a secure recording reference or a verifiable certificate when the session is complete.",
    ],
  ];
  return (
    <PublicShell>
      <PageIntro
        eyebrow="A quiet five-step rhythm"
        title={
          <>
            Good exchanges begin with{" "}
            <em className="font-normal text-[#9b7390]">curiosity.</em>
          </>
        }
        copy="Skill-Swap is designed to make the journey from ‘I’d like to learn’ to ‘we made progress’ feel clear, safe, and human."
      />
      <section className="container py-20">
        <div className="grid gap-px overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/70 md:grid-cols-2">
          {sequence.map(([number, title, copy]) => (
            <article key={number} className="bg-white/38 p-8 sm:p-10">
              <span className="font-serif text-4xl text-[#c0b4ce]">
                {number}
              </span>
              <h2 className="mt-12 font-serif text-2xl text-[#61567d]">
                {title}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">
                {copy}
              </p>
            </article>
          ))}
        </div>
      </section>
      <section className="container pb-24">
        <div className="rounded-[1.75rem] border border-white/80 bg-[#e7f1ea]/55 p-8 sm:p-12">
          <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#668d7b]">
                The trust layer
              </p>
              <h2 className="mt-3 font-serif text-3xl text-[#526e62]">
                Every step should feel explainable.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
                You can see why a match was suggested, when a session is
                recorded, and how a certificate was issued. No mysterious
                scores. No hidden doors.
              </p>
            </div>
            <ShieldCheck className="size-12 shrink-0 text-[#668d7b]" />
          </div>
        </div>
      </section>
    </PublicShell>
  );
}

export function Skills() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = [
    "All",
    ...Array.from(new Set(skills.map(skill => skill.category))),
  ];
  const visible = useMemo(
    () =>
      skills.filter(
        skill =>
          (category === "All" || skill.category === category) &&
          skill.name.toLowerCase().includes(query.toLowerCase())
      ),
    [category, query]
  );
  return (
    <PublicShell>
      <PageIntro
        eyebrow="A garden of possibilities"
        title={
          <>
            Start with the skill that keeps{" "}
            <em className="font-normal text-[#9b7390]">returning.</em>
          </>
        }
        copy="Browse a growing collection of practical, creative, and everyday skills. Join the exchange to see people whose goals complement yours."
      />
      <section className="container py-16">
        <div className="flex flex-col gap-4 rounded-2xl border border-white/80 bg-white/48 p-4 shadow-[0_12px_40px_rgba(117,98,145,0.06)] md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Search a skill"
              className="h-11 rounded-xl border-white bg-white/70 pl-11"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(item => (
              <Button
                key={item}
                onClick={() => setCategory(item)}
                variant={category === item ? "default" : "outline"}
                className={
                  category === item
                    ? "rounded-full bg-[#6c5d88] text-white"
                    : "rounded-full border-[#ddd4e4] bg-white/50 text-slate-600"
                }
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map(skill => (
            <Link
              key={skill.name}
              href={`/skills/${skill.name.toLowerCase().replaceAll(" ", "-")}`}
            >
              <article className="group h-full rounded-2xl border border-white/85 bg-white/52 p-6 transition-all duration-200 hover:-translate-y-1 hover:bg-white/80 hover:shadow-[0_16px_34px_rgba(117,98,145,0.1)]">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] ${skill.tone}`}
                >
                  {skill.category}
                </span>
                <h2 className="mt-12 font-serif text-2xl text-[#61567d]">
                  {skill.name}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {skill.count} exchange possibilities
                </p>
                <span className="mt-8 inline-flex items-center text-xs text-[#6c5d88]">
                  Explore skill{" "}
                  <ArrowUpRight className="ml-1 size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </article>
            </Link>
          ))}
        </div>
        {visible.length === 0 && (
          <div className="py-20 text-center">
            <Sparkles className="mx-auto size-7 text-[#b3a7c5]" />
            <p className="mt-4 font-serif text-2xl text-[#61567d]">
              Nothing here yet.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Try another phrase or browse every category.
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
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  const skill = skills.find(
    item => item.name.toLowerCase() === name.toLowerCase()
  ) ?? {
    name,
    category: "Skill",
    count: 0,
    tone: "bg-[#eee6f7] text-[#6c5d88]",
  };
  return (
    <PublicShell>
      <PageIntro
        eyebrow={skill.category}
        title={
          <>
            There is always another way to see{" "}
            <em className="font-normal text-[#9b7390]">{skill.name}.</em>
          </>
        }
        copy={`Explore the ${skill.name} exchange and meet people who are ready to share their experience while learning something from you.`}
      />
      <section className="container grid gap-7 py-16 md:grid-cols-[1.1fr_.9fr]">
        <div className="bracket rounded-[1.75rem] border border-white/80 bg-white/56 p-8 sm:p-10">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] ${skill.tone}`}
          >
            Open skill circle
          </span>
          <h2 className="mt-10 font-serif text-3xl text-[#61567d]">
            What you could exchange
          </h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
            <p>
              Skill-Swap pairs teaching and learning goals so the exchange is
              reciprocal from the beginning.
            </p>
            <p>
              Members who offer this skill can complete a focused assessment and
              earn a Verified Teacher mark. You can learn at your own pace and
              schedule time that respects both calendars.
            </p>
          </div>
          <Button
            className="mt-8 rounded-full bg-[#6c5d88] text-white"
            onClick={() => window.location.assign("/login")}
          >
            Join the skill circle <ArrowUpRight className="ml-2 size-4" />
          </Button>
        </div>
        <div className="rounded-[1.75rem] border border-white/80 bg-[#e7f1ea]/55 p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#668d7b]">
            A few signals
          </p>
          <div className="mt-8 space-y-6">
            <div>
              <p className="font-serif text-3xl text-[#526e62]">
                {skill.count}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                current exchange possibilities
              </p>
            </div>
            <div className="h-px bg-white/80" />
            <div>
              <p className="font-serif text-3xl text-[#526e62]">30–40</p>
              <p className="mt-1 text-sm text-slate-600">
                questions in the teaching assessment
              </p>
            </div>
            <div className="h-px bg-white/80" />
            <div>
              <p className="font-serif text-3xl text-[#526e62]">1:1</p>
              <p className="mt-1 text-sm text-slate-600">
                focused, private session format
              </p>
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
        eyebrow="A record you can carry"
        title={
          <>
            Verify a moment of{" "}
            <em className="font-normal text-[#9b7390]">shared progress.</em>
          </>
        }
        copy="Enter a Skill-Swap certificate number to check its current status. Public verification reveals only the details intended to be shared."
      />
      <section className="container py-20">
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
  const copy = {
    help: {
      eyebrow: "A little guidance",
      title: (
        <>
          Questions are part of the{" "}
          <em className="font-normal text-[#9b7390]">journey.</em>
        </>
      ),
      intro:
        "Find your way around Skill-Swap with simple answers about profiles, assessments, matches, sessions, and certificates.",
    },
    contact: {
      eyebrow: "We are listening",
      title: (
        <>
          Tell us where the path feels{" "}
          <em className="font-normal text-[#9b7390]">unclear.</em>
        </>
      ),
      intro:
        "For account support, safety concerns, or platform feedback, reach out to the Skill-Swap support team.",
    },
    privacy: {
      eyebrow: "Privacy policy",
      title: (
        <>
          Your learning story stays{" "}
          <em className="font-normal text-[#9b7390]">yours.</em>
        </>
      ),
      intro:
        "This page explains what Skill-Swap stores, why it is needed, and how recordings, certificates, and administrator access are protected.",
    },
    terms: {
      eyebrow: "Community guidelines",
      title: (
        <>
          Make room for a{" "}
          <em className="font-normal text-[#9b7390]">good exchange.</em>
        </>
      ),
      intro:
        "Skill-Swap works when members communicate honestly, respect consent, and treat every session as a shared space.",
    },
  }[type];
  return (
    <PublicShell>
      <PageIntro eyebrow={copy.eyebrow} title={copy.title} copy={copy.intro} />
      <section className="container grid gap-6 py-16 md:grid-cols-3">
        <div className="rounded-[1.5rem] border border-white/80 bg-white/52 p-7 md:col-span-2">
          <h2 className="font-serif text-3xl text-[#61567d]">
            A clear place to begin
          </h2>
          <div className="mt-6 space-y-5 text-sm leading-7 text-slate-600">
            <p>
              Skill-Swap is designed around consent, explainability, and
              thoughtful participation. We keep the member experience simple
              while making the important rules visible.
            </p>
            <p>
              For this academic project, the full operational policy, support
              workflow, and data-retention rules are documented alongside the
              deployed application so administrators and members can refer to
              the same source of truth.
            </p>
            <p>
              When you are ready, visit the member workspace to set up a profile
              or explore the public certificate verification flow.
            </p>
          </div>
          <Link href="/" className="mt-8 inline-block">
            <Button
              variant="outline"
              className="rounded-full border-[#c9bfd6] bg-white/55 text-[#6c5d88]"
            >
              Return to the beginning <ArrowUpRight className="ml-2 size-4" />
            </Button>
          </Link>
        </div>
        <div className="rounded-[1.5rem] border border-white/80 bg-[#f6edf3]/65 p-7">
          <CircleHelp className="size-6 text-[#9b7390]" />
          <h2 className="mt-10 font-serif text-2xl text-[#795d72]">
            Need a human answer?
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Use the support path inside your workspace for account-specific
            help, reports, or session concerns.
          </p>
        </div>
      </section>
    </PublicShell>
  );
}
