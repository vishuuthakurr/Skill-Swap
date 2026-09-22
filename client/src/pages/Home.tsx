import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FileCheck2,
  GraduationCap,
  Layers,
  Search,
  ShieldAlert,
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
import { startLogin } from "@/const";

const stats = [
  { label: "Vetted Assessment Pool", value: "105+ Questions" },
  { label: "Teacher Quality Gate", value: "70% Pass Mark" },
  { label: "Active Peer Swaps", value: "1,200+ Live" },
  { label: "Course Subscription Fees", value: "$0 Always" },
];

const featuredSkills = [
  {
    slug: "python",
    title: "Python for Data & Automation",
    category: "Technology",
    rating: 4.9,
    reviews: 142,
    swapsCount: 280,
    instructor: {
      name: "Aarav Sharma",
      avatar: "AS",
      verified: true,
      wants: "UI/UX Design",
    },
    gradient: "from-blue-600 to-indigo-700",
    badge: "Most Popular",
  },
  {
    slug: "ui-design",
    title: "UI/UX & Product Design Systems",
    category: "Design",
    rating: 4.9,
    reviews: 118,
    swapsCount: 195,
    instructor: {
      name: "Vikram Mehta",
      avatar: "VM",
      verified: true,
      wants: "Python",
    },
    gradient: "from-purple-600 to-pink-600",
    badge: "High Demand",
  },
  {
    slug: "french",
    title: "Conversational French & Phonetics",
    category: "Languages",
    rating: 4.8,
    reviews: 86,
    swapsCount: 130,
    instructor: {
      name: "Sana Mir",
      avatar: "SM",
      verified: true,
      wants: "Public Speaking",
    },
    gradient: "from-emerald-600 to-teal-700",
    badge: "Verified Teacher",
  },
  {
    slug: "javascript",
    title: "Modern JavaScript & React Patterns",
    category: "Technology",
    rating: 4.95,
    reviews: 164,
    swapsCount: 310,
    instructor: {
      name: "Rohan Patel",
      avatar: "RP",
      verified: true,
      wants: "Productivity",
    },
    gradient: "from-amber-600 to-orange-600",
    badge: "Top Rated",
  },
  {
    slug: "excel",
    title: "Advanced Financial Modeling in Excel",
    category: "Productivity",
    rating: 4.7,
    reviews: 94,
    swapsCount: 155,
    instructor: {
      name: "Priya Nair",
      avatar: "PN",
      verified: true,
      wants: "Photography",
    },
    gradient: "from-cyan-600 to-blue-700",
    badge: "Essential",
  },
  {
    slug: "public-speaking",
    title: "Keynote Delivery & Pitching",
    category: "Communication",
    rating: 4.85,
    reviews: 73,
    swapsCount: 110,
    instructor: {
      name: "David Chen",
      avatar: "DC",
      verified: true,
      wants: "Guitar",
    },
    gradient: "from-rose-600 to-red-700",
    badge: "High Impact",
  },
];

const steps = [
  {
    step: "01",
    title: "Define What You Teach & Learn",
    desc: "Create your profile with skills you can mentor in and subjects you are looking to master.",
    icon: Layers,
  },
  {
    step: "02",
    title: "Pass the 35-Question Assessment",
    desc: "Prove your knowledge through a 35-question timed assessment and earn the Verified Teacher credential.",
    icon: Award,
  },
  {
    step: "03",
    title: "Match with Reciprocal Peers",
    desc: "Our algorithm pairs you with motivated partners whose learning targets align with yours.",
    icon: Users,
  },
  {
    step: "04",
    title: "Collaborate in Live Video & Certify",
    desc: "Schedule 1:1 HD video sessions in ZegoCloud and receive cryptographic verifiable proof.",
    icon: Video,
  },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/skills?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      setLocation("/skills");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <main>
        {/* Hero Section (Coursera + Udemy Hybrid) */}
        <section className="relative overflow-hidden border-b border-slate-200 bg-white py-16 lg:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />

          <div className="container relative z-10 grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1.5 text-xs font-semibold text-blue-700 shadow-sm">
                <Sparkles className="size-3.5 text-blue-600" />
                <span>Next-Gen EdTech • 100% Reciprocal Peer Learning</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Master Any Skill. <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
                  Teach What You Know.
                </span>
              </h1>

              <p className="max-w-xl text-lg leading-relaxed text-slate-600">
                Exchange knowledge directly with real practitioners. No costly
                tuition or monthly subscriptions—unlock verified teacher
                badges, take rigorous assessments, and meet in 1:1 HD video
                rooms.
              </p>

              {/* Udemy-style Hero Search Bar */}
              <form
                onSubmit={handleHeroSearch}
                className="flex max-w-xl flex-col gap-2 sm:flex-row"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What do you want to learn? (e.g. Python, UI Design)"
                    className="h-12 w-full rounded-xl border-slate-300 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 transition-all focus-visible:border-blue-600 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-600/20"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-12 rounded-xl bg-blue-600 px-6 font-semibold text-white shadow-md shadow-blue-500/25 transition-all hover:bg-blue-700"
                >
                  Explore Catalog
                </Button>
              </form>

              {/* Trending Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Trending:</span>
                {["Python", "UI/UX Design", "French", "JavaScript", "Excel"].map(
                  (tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() =>
                        setLocation(`/skills?q=${encodeURIComponent(tag)}`)
                      }
                      className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>

              {/* Trust Signals */}
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 sm:grid-cols-3">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <ShieldCheck className="size-4 text-emerald-600" />
                  <span>Verified Teachers</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <Award className="size-4 text-blue-600" />
                  <span>Verifiable Credentials</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <Video className="size-4 text-indigo-600" />
                  <span>Built-in ZegoCloud Rooms</span>
                </div>
              </div>
            </div>

            {/* Right Card / Interactive Preview */}
            <div className="relative mx-auto w-full max-w-lg">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
                {/* Header Badge */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Live Reciprocal Match
                    </span>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">
                    <ShieldCheck className="mr-1 size-3.5" /> 94% Compatibility
                  </Badge>
                </div>

                {/* Match Card Details */}
                <div className="mt-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-blue-600 text-base font-bold text-white shadow">
                      AS
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900">Aarav Sharma</h4>
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          ✓ Verified Teacher
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-amber-500 font-semibold">
                        <Star className="size-3.5 fill-amber-400 text-amber-400" />
                        <span>4.9</span>
                        <span className="text-slate-400 font-normal">
                          (142 verified swaps)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3.5 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">Offers to Teach</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                        <span className="size-2 rounded-full bg-blue-600" /> Python & FastApi
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Seeks to Learn</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                        <span className="size-2 rounded-full bg-purple-600" /> UI/UX Design
                      </span>
                    </div>
                  </div>

                  {/* Assessment Proof Preview */}
                  <div className="rounded-xl border border-slate-100 bg-blue-50/50 p-3.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                        <Award className="size-4 text-blue-600" /> Assessment Score
                      </span>
                      <span className="font-bold text-blue-700">92% (35/35 Questions)</span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-blue-100 overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: "92%" }} />
                    </div>
                  </div>

                  <Button
                    onClick={() => startLogin()}
                    className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
                  >
                    Start Swap with Aarav <ArrowRight className="ml-2 size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Ribbon */}
        <section className="border-b border-slate-200 bg-slate-900 py-8 text-white">
          <div className="container grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((item) => (
              <div key={item.label} className="text-center sm:text-left">
                <p className="text-2xl font-extrabold tracking-tight text-white lg:text-3xl">
                  {item.value}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-400">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Udemy-Style Featured Skills Catalog */}
        <section className="container py-16 sm:py-20">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Explore Top Disciplines
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Featured Skill Exchanges
              </h2>
              <p className="mt-2 text-sm text-slate-600 max-w-xl">
                Browse our verified peer network. Join any skill circle, pass
                the assessment, or schedule an exchange session.
              </p>
            </div>
            <Link href="/skills">
              <Button
                variant="outline"
                className="gap-2 border-slate-300 font-semibold text-slate-700 hover:border-blue-600 hover:text-blue-600"
              >
                View Full Catalog ({featuredSkills.length * 5}+ Skills)
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredSkills.map((skill) => (
              <Link key={skill.slug} href={`/skills/${skill.slug}`}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-slate-200/50 cursor-pointer">
                  {/* Card Thumbnail / Header */}
                  <div
                    className={`relative h-32 bg-gradient-to-tr ${skill.gradient} p-4 text-white flex flex-col justify-between`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                        {skill.category}
                      </span>
                      <span className="rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-bold text-slate-900 shadow-sm">
                        {skill.badge}
                      </span>
                    </div>
                    <p className="text-lg font-bold leading-snug drop-shadow-sm text-white">
                      {skill.title}
                    </p>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                    <div>
                      {/* Rating & Swaps */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 font-bold text-amber-500">
                          <Star className="size-3.5 fill-amber-400 text-amber-400" />
                          <span>{skill.rating}</span>
                          <span className="font-normal text-slate-400">
                            ({skill.reviews})
                          </span>
                        </div>
                        <span className="text-slate-500 font-medium">
                          {skill.swapsCount} Swaps Completed
                        </span>
                      </div>

                      {/* Instructor Row */}
                      <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-3.5">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-700">
                          {skill.instructor.avatar}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1">
                            <span className="truncate text-xs font-bold text-slate-900">
                              {skill.instructor.name}
                            </span>
                            <ShieldCheck className="size-3.5 text-emerald-600 shrink-0" />
                          </div>
                          <p className="truncate text-[11px] text-slate-500">
                            Seeking: <span className="font-medium text-slate-700">{skill.instructor.wants}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                      <span className="text-xs font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
                        Request Exchange <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                      <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        100% Free Swap
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>

        {/* How It Works (Coursera 4-Step Cards) */}
        <section className="border-y border-slate-200 bg-white py-16 sm:py-20">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Peer Learning Framework
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                How Skill-Swap Works
              </h2>
              <p className="mt-3 text-sm text-slate-600">
                A structured four-step methodology ensuring quality teaching,
                reciprocal growth, and authenticated credentials.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((item) => (
                <div
                  key={item.step}
                  className="relative rounded-2xl border border-slate-200 bg-slate-50/60 p-6 transition-all hover:bg-white hover:shadow-lg hover:border-blue-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-blue-600">
                      {item.step}
                    </span>
                    <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                      <item.icon className="size-5" />
                    </div>
                  </div>
                  <h3 className="mt-6 text-base font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Verifiable Credentials & Trust Banner */}
        <section className="container py-16 sm:py-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8 sm:p-12 text-white shadow-xl">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
              <div>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                  <ShieldCheck className="mr-1.5 size-3.5" />
                  Cryptographic Trust Protocol
                </Badge>
                <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Real Credentials for Real Knowledge.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-300 max-w-xl">
                  Every passed assessment and completed swap is recorded with a
                  unique verification token. Share your proof on LinkedIn, your
                  portfolio, or verify any certificate instantly on our public
                  registry.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/verify-certificate">
                    <Button className="rounded-xl bg-blue-600 px-6 font-semibold text-white shadow-md hover:bg-blue-700">
                      Verify a Certificate <ArrowUpRight className="ml-2 size-4" />
                    </Button>
                  </Link>
                  <Button
                    onClick={() => startLogin()}
                    variant="outline"
                    className="rounded-xl border-slate-700 text-white bg-white/10 hover:bg-white/20"
                  >
                    Take Practice Assessment
                  </Button>
                </div>
              </div>

              {/* Certificate Preview Card */}
              <div className="rounded-2xl border border-slate-700/80 bg-slate-800/80 p-6 backdrop-blur shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3 text-xs">
                  <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="size-4" /> Valid Credential
                  </span>
                  <span className="font-mono text-slate-400">
                    SS-VERIF-2026-PY
                  </span>
                </div>
                <div className="mt-4 text-center py-4">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                    <Award className="size-6" />
                  </div>
                  <h4 className="mt-3 font-bold text-white text-base">
                    Certificate of Competence
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Python Programming & Algorithm Analysis
                  </p>
                  <p className="text-xs font-semibold text-emerald-400 mt-2">
                    Score: 94% • Verified Peer Teacher
                  </p>
                </div>
                <div className="border-t border-slate-700 pt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Issued by SkillSwap Institute</span>
                  <span className="text-blue-400 font-medium">Tamper-Proof</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
