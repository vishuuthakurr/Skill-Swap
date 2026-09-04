import { Link } from "wouter";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  CircleDot,
  Layers3,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { startLogin } from "@/const";

const steps = [
  {
    number: "01",
    title: "Name your exchange",
    copy: "Tell us what you know well and what you are ready to learn next.",
  },
  {
    number: "02",
    title: "Meet your match",
    copy: "Find someone whose teaching and learning goals fit yours naturally.",
  },
  {
    number: "03",
    title: "Grow together",
    copy: "Make time for a focused session, then keep a record of what you shared.",
  },
];

const skillCloud = [
  "Python",
  "Photography",
  "Guitar",
  "UI design",
  "French",
  "Excel",
  "Public speaking",
  "Yoga",
];

export default function Home() {
  return (
    <div className="page-wash min-h-screen">
      <SiteHeader />
      <main>
        <section className="container relative grid min-h-[650px] items-center gap-16 py-20 lg:grid-cols-[1.06fr_.94fr] lg:py-28">
          <div className="max-w-2xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#d6cce2] bg-white/55 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#776b91]">
              <span className="size-1.5 rounded-full bg-[#8f81ad]" /> A kinder
              way to learn
            </div>
            <h1 className="max-w-xl font-serif text-6xl leading-[.98] tracking-[-0.045em] text-[#5b506e] sm:text-7xl">
              Exchange what you know.{" "}
              <em className="font-normal text-[#9b7390]">
                Discover what’s next.
              </em>
            </h1>
            <p className="mt-8 max-w-lg text-lg leading-8 text-slate-600">
              Skill-Swap makes peer learning feel less like a marketplace and
              more like a meaningful conversation between two curious people.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button
                onClick={() => startLogin()}
                className="h-12 rounded-full bg-[#6c5d88] px-7 text-sm text-white shadow-[0_14px_28px_rgba(108,93,136,0.22)] hover:bg-[#5d5077]"
              >
                Start your exchange <ArrowUpRight className="ml-2 size-4" />
              </Button>
              <Link href="/how-it-works">
                <Button
                  variant="ghost"
                  className="h-12 rounded-full px-5 text-[#6c5d88] hover:bg-white/50"
                >
                  See how it works <ArrowDownRight className="ml-2 size-4" />
                </Button>
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 text-xs text-slate-500">
              <span className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-[#668d7b]" /> Verified
                teaching profiles
              </span>
              <span className="flex items-center gap-2">
                <CircleDot className="size-3.5 text-[#9b7390]" /> Private by
                design
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="absolute -right-2 top-2 size-20 rounded-full border border-[#ded4eb] bg-white/30 blur-[1px]" />
            <div className="bracket rounded-[2rem] border border-white/85 bg-white/48 p-5 shadow-[0_24px_80px_rgba(117,98,145,0.13)] backdrop-blur-sm sm:p-8">
              <div className="flex items-start justify-between border-b border-[#e7e0eb] pb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                    Your learning constellation
                  </p>
                  <p className="mt-2 font-serif text-2xl text-[#5b506e]">
                    A little room to grow
                  </p>
                </div>
                <span className="grid size-10 place-items-center rounded-full bg-[#eef5f0] text-[#668d7b]">
                  <Sparkles className="size-4" />
                </span>
              </div>
              <div className="relative my-8 grid place-items-center">
                <div className="absolute h-48 w-48 rounded-full border border-dashed border-[#cfc4df]" />
                <div className="absolute h-32 w-32 rounded-full border border-[#dfd1e0]" />
                <div className="relative grid size-24 place-items-center rounded-full bg-[#eadff3] text-center text-[#675978] shadow-[0_10px_24px_rgba(121,95,145,0.16)]">
                  <span className="font-serif text-xl">You</span>
                  <span className="absolute -bottom-6 whitespace-nowrap text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    curious, always
                  </span>
                </div>
                <div className="absolute left-[5%] top-1/2 grid -translate-y-1/2 place-items-center rounded-2xl border border-white bg-[#f8e7ed] px-3 py-2 text-xs text-[#906c82] shadow-sm">
                  Python
                </div>
                <div className="absolute right-[3%] top-[23%] grid place-items-center rounded-2xl border border-white bg-[#e3f1e9] px-3 py-2 text-xs text-[#5d806d] shadow-sm">
                  Photography
                </div>
                <div className="absolute bottom-[4%] right-[10%] grid place-items-center rounded-2xl border border-white bg-[#f1ecfa] px-3 py-2 text-xs text-[#756889] shadow-sm">
                  French
                </div>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/55 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <span className="grid size-8 place-items-center rounded-full border-2 border-white bg-[#d8e8e1] text-[10px] text-[#577765]">
                      AR
                    </span>
                    <span className="grid size-8 place-items-center rounded-full border-2 border-white bg-[#f0dce6] text-[10px] text-[#936d83]">
                      SM
                    </span>
                    <span className="grid size-8 place-items-center rounded-full border-2 border-white bg-[#ded8ed] text-[10px] text-[#6c6081]">
                      VK
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.15em] text-[#668d7b]">
                    3 gentle possibilities
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-7 -left-8 hidden w-44 rounded-2xl border border-white/90 bg-white/75 p-4 shadow-[0_14px_30px_rgba(121,95,145,0.12)] backdrop-blur sm:block">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                A small promise
              </p>
              <p className="mt-2 font-serif text-lg leading-tight text-[#665a79]">
                Everyone has something worth sharing.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-white/70 bg-white/26 py-16">
          <div className="container grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#8f81ad]">
                The simple idea
              </p>
              <h2 className="mt-4 max-w-md font-serif text-4xl leading-tight text-[#5b506e]">
                Learning feels different when it goes both ways.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-slate-600">
              Skill-Swap helps you build a profile around reciprocity. A
              verified teaching skill becomes an invitation, a learning goal
              becomes a starting point, and every session becomes a small proof
              that progress is better together.
            </p>
          </div>
        </section>

        <section className="container py-24">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#8f81ad]">
                A gentle rhythm
              </p>
              <h2 className="mt-4 font-serif text-4xl text-[#5b506e]">
                From intention to exchange.
              </h2>
            </div>
            <Link
              href="/how-it-works"
              className="editorial-link text-sm text-[#6c5d88]"
            >
              Take the longer tour{" "}
              <ArrowUpRight className="ml-1 inline size-4" />
            </Link>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/70 md:grid-cols-3">
            {steps.map(step => (
              <div
                key={step.number}
                className="bg-[#fbfaf8]/65 p-8 transition-colors duration-200 hover:bg-white/80"
              >
                <span className="font-serif text-4xl text-[#c0b4ce]">
                  {step.number}
                </span>
                <h3 className="mt-16 font-serif text-2xl text-[#61567d]">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {step.copy}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="container pb-24">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-[#ede6f4]/65 p-8 sm:p-12">
            <div className="absolute right-0 top-0 size-72 rounded-full bg-[#dff0e7]/70 blur-3xl" />
            <div className="relative grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#776b91]">
                  The trust layer
                </p>
                <h2 className="mt-4 max-w-md font-serif text-4xl leading-tight text-[#5b506e]">
                  Confidence, without the noise.
                </h2>
                <p className="mt-5 max-w-md text-sm leading-7 text-slate-600">
                  Every teaching skill goes through an assessment. Every
                  conversation begins after a mutual match. Every completed
                  exchange can leave you with a certificate you can verify.
                </p>
                <Link href="/skills" className="mt-7 inline-block">
                  <Button
                    variant="outline"
                    className="rounded-full border-[#bfb5d0] bg-white/60 text-[#61567d] hover:bg-white"
                  >
                    Explore the skill garden{" "}
                    <ArrowUpRight className="ml-2 size-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/80 bg-white/56 p-6">
                  <ShieldCheck className="size-5 text-[#668d7b]" />
                  <h3 className="mt-8 font-serif text-xl text-[#61567d]">
                    Verified by practice
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    A skill badge means someone has taken the time to show what
                    they know.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/80 bg-white/56 p-6">
                  <UsersRound className="size-5 text-[#9b7390]" />
                  <h3 className="mt-8 font-serif text-xl text-[#61567d]">
                    Matched with care
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    See why a match fits before you decide to open a
                    conversation.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/80 bg-white/56 p-6 sm:col-span-2">
                  <Layers3 className="size-5 text-[#8f81ad]" />
                  <h3 className="mt-8 font-serif text-xl text-[#61567d]">
                    A record of momentum
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                    Keep your exchange notes, recordings, and certificates
                    together in one quiet place.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container pb-28">
          <div className="flex flex-col gap-7 border-t border-[#ddd4e4] pt-10 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-500">
                What could you share?
              </p>
              <div className="mt-5 flex max-w-3xl flex-wrap gap-3">
                {skillCloud.map(skill => (
                  <span
                    key={skill}
                    className="rounded-full border border-white bg-white/65 px-4 py-2 text-sm text-[#6b6275]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <Button
              onClick={() => startLogin()}
              className="rounded-full bg-[#6c5d88] px-6 text-white hover:bg-[#5d5077]"
            >
              Find your first exchange <ArrowUpRight className="ml-2 size-4" />
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
