"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
  animate,
} from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Copy,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Layers,
  Truck,
  Globe,
  ShoppingBag,
  Server,
  Code2,
  Database,
  Cloud,
  Bot,
  Rocket,
  PenTool,
  Search,
  Wrench,
} from "lucide-react";

const EMAIL = "khalfiabdullah@gmail.com";
const PHONE = "+49 1520 4785579";
const PHONE_HREF = "tel:+4915204785579";

const ease = [0.22, 1, 0.36, 1] as const;

const projects = [
  {
    icon: Layers,
    tag: "Plattform · Full-Stack",
    title: "Vermittlungsplattform für Haushalts- und Handwerksleistungen",
    text: "Auftraggeber stellen Aufträge kostenlos ein und erhalten Angebote von geprüften Fachbetrieben aus ihrer Region. Konzeption, Frontend, Backend und Betrieb unter eigener Domain.",
    stack: ["Next.js", "React", "TypeScript", "Vercel"],
    hue: "from-indigo-500/30 via-violet-500/20 to-fuchsia-500/10",
    span: "md:col-span-2",
  },
  {
    icon: Truck,
    tag: "B2B-Plattform · Full-Stack",
    title: "Kuriervermittlung für Restaurants",
    text: "Restaurants buchen bei hohem Bestellaufkommen kurzfristig Lieferfahrer. Preisberechnung pro Lieferung und Kilometer, automatische Abrechnung und Bestätigung.",
    stack: ["Next.js", "React", "TypeScript"],
    hue: "from-emerald-500/30 via-teal-500/20 to-cyan-500/10",
    span: "",
  },
  {
    icon: Globe,
    tag: "Websites · Deutschland und USA",
    title: "Websites für lokale Unternehmen",
    text: "Unternehmensseiten für Einzelhandel, Lebensmittelhandel, Möbeltischlerei, Reinigungsservice und Entrümpelung. Mobil optimiert, suchmaschinenfreundlich, auf Anfragen ausgerichtet.",
    stack: ["JavaScript", "HTML/CSS", "SEO"],
    hue: "from-amber-500/30 via-orange-500/20 to-rose-500/10",
    span: "",
  },
  {
    icon: Sparkles,
    tag: "Persönliche Marke",
    title: "Website für meine Content-Marke",
    text: "Website zu meinen Reiseinhalten mit über einer Million Followern in den sozialen Medien. Gestaltung, Umsetzung und Betrieb in Eigenregie.",
    stack: ["Webentwicklung", "Content", "Vercel"],
    hue: "from-sky-500/30 via-blue-500/20 to-indigo-500/10",
    span: "",
  },
  {
    icon: ShoppingBag,
    tag: "E-Commerce · seit 2021",
    title: "Eigener Onlinehandel",
    text: "Aufbau und Betrieb eines eigenen Onlineshops: Produkt- und Stammdaten, Shopsystem, Kampagnen über Meta Ads und laufende Auswertung der Verkäufe.",
    stack: ["Shopify", "Produktdaten", "Meta Ads"],
    hue: "from-pink-500/30 via-rose-500/20 to-orange-500/10",
    span: "",
  },
  {
    icon: Server,
    tag: "IT-Betreuung · seit 2021",
    title: "IT für eigene Kunden",
    text: "Microsoft 365, Konten und Zugriffsrechte, Hosting, Domains, DNS und Zertifikate sowie die Behebung von Störungen im laufenden Betrieb.",
    stack: ["Microsoft 365", "Hosting", "DNS"],
    hue: "from-cyan-500/30 via-sky-500/20 to-emerald-500/10",
    span: "md:col-span-2",
  },
];

const stats = [
  { value: 2021, prefix: "seit ", suffix: "", label: "Webentwicklung für Kunden" },
  { value: 10, prefix: "", suffix: "+", label: "veröffentlichte Webprojekte" },
  { value: 2, prefix: "", suffix: "", label: "Full-Stack-Plattformen" },
  { value: 1, prefix: "", suffix: " Mio.+", label: "Follower als eigene Marke" },
];

const marquee = [
  "React", "Next.js", "TypeScript", "JavaScript", "Node.js", "Python", "SQL", "MongoDB",
  "Tailwind CSS", "REST-APIs", "Git", "Vercel", "Shopify", "Microsoft 365", "Claude Code",
];

const skills = [
  { icon: Code2, group: "Frontend", items: ["React", "Next.js", "TypeScript", "JavaScript", "HTML/CSS", "Tailwind CSS", "Framer Motion"] },
  { icon: Database, group: "Backend und Daten", items: ["Node.js", "Python", "SQL", "MongoDB", "REST-APIs", "Webhooks"] },
  { icon: Cloud, group: "Betrieb und Deployment", items: ["Vercel", "Git", "Hosting", "Domains und DNS", "Zertifikate"] },
  { icon: Bot, group: "KI und Werkzeuge", items: ["Claude Code", "KI-gestützte Entwicklung", "Automatisierung", "Microsoft 365"] },
];

const steps = [
  { icon: Search, title: "Verstehen", text: "Ziele, Nutzer und Anforderungen klären, bevor die erste Zeile Code entsteht." },
  { icon: PenTool, title: "Gestalten", text: "Struktur und Oberfläche so planen, dass sie auf jedem Gerät intuitiv funktionieren." },
  { icon: Rocket, title: "Umsetzen", text: "Sauberer, wartbarer Code mit modernen Frameworks, schnell geliefert dank KI-gestützter Entwicklung." },
  { icon: Wrench, title: "Betreiben", text: "Deployment, Hosting und Pflege, damit die Anwendung zuverlässig läuft." },
];

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function Counter({ value, prefix, suffix }: { value: number; prefix: string; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(value > 100 ? value - 30 : 0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(value > 100 ? value - 30 : 0, value, {
      duration: 1.8,
      ease,
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => c.stop();
  }, [inView, value]);
  return (
    <span ref={ref}>
      {prefix}
      {n}
      {suffix}
    </span>
  );
}

function SpotlightCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const mx = useMotionValue(-300);
  const my = useMotionValue(-300);
  const bg = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, rgba(139,92,246,0.18), transparent 60%)`;
  return (
    <div
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      onMouseLeave={() => {
        mx.set(-300);
        my.set(-300);
      }}
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-colors duration-500 hover:border-white/20 ${className}`}
    >
      <motion.div className="pointer-events-none absolute inset-0 z-0" style={{ background: bg }} />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

function CopyEmail() {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(EMAIL).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1800);
        });
      }}
      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
      aria-label="E-Mail-Adresse kopieren"
    >
      {done ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
      {done ? "Kopiert" : "E-Mail kopieren"}
    </button>
  );
}

export default function PortfolioClient() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProg } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroProg, [0, 1], [0, 140]);
  const heroOpacity = useTransform(heroProg, [0, 0.8], [1, 0]);

  const cx = useMotionValue(-500);
  const cy = useMotionValue(-500);
  const glow = useMotionTemplate`radial-gradient(600px circle at ${cx}px ${cy}px, rgba(99,102,241,0.10), transparent 70%)`;

  const headline = ["Webanwendungen,", "die", "begeistern", "und", "zuverlässig", "laufen."];

  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-[#06070b] text-white antialiased selection:bg-violet-500/40"
      onMouseMove={(e) => {
        cx.set(e.clientX);
        cy.set(e.clientY);
      }}
      style={{ fontFeatureSettings: '"ss01", "cv11"' }}
    >
      <motion.div className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400" style={{ scaleX: progress }} />
      <motion.div className="pointer-events-none fixed inset-0 z-0" style={{ background: glow }} />

      {/* Aurora background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute -left-40 -top-40 h-[42rem] w-[42rem] rounded-full bg-indigo-600/25 blur-[140px]"
          animate={{ x: [0, 80, -40, 0], y: [0, 60, 20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-40 top-20 h-[36rem] w-[36rem] rounded-full bg-fuchsia-600/20 blur-[140px]"
          animate={{ x: [0, -70, 30, 0], y: [0, 40, -30, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-1/3 top-[70rem] h-[40rem] w-[40rem] rounded-full bg-cyan-500/10 blur-[160px]"
          animate={{ x: [0, 60, -60, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%)",
          }}
        />
      </div>

      {/* Nav */}
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease }}
        className="fixed inset-x-0 top-4 z-50 mx-auto w-[calc(100%-2rem)] max-w-5xl"
      >
        <div className="flex items-center justify-between rounded-full border border-white/10 bg-black/40 px-5 py-3 backdrop-blur-2xl">
          <a href="#top" className="text-sm font-semibold tracking-tight">
            Abdullah Khalfi
          </a>
          <div className="hidden items-center gap-7 text-sm text-white/60 md:flex">
            <a className="transition hover:text-white" href="#projekte">Projekte</a>
            <a className="transition hover:text-white" href="#kenntnisse">Kenntnisse</a>
            <a className="transition hover:text-white" href="#arbeitsweise">Arbeitsweise</a>
            <a className="transition hover:text-white" href="#kontakt">Kontakt</a>
          </div>
          <a
            href="#kontakt"
            className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black transition hover:bg-white/90"
          >
            Kontakt
          </a>
        </div>
      </motion.nav>

      <main id="top" className="relative z-10">
        {/* Hero */}
        <section ref={heroRef} className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-6 pb-20 pt-36">
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Ab sofort verfügbar · Freiburg, hybrid oder remote
            </motion.div>

            <h1 className="mt-8 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-7xl">
              {headline.map((w, i) => (
                <motion.span
                  key={i}
                  className={`mr-[0.22em] inline-block ${w === "begeistern" ? "bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent" : ""}`}
                  initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.9, delay: 0.25 + i * 0.08, ease }}
                >
                  {w}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.9, ease }}
              className="mt-8 max-w-2xl text-lg leading-relaxed text-white/60"
            >
              Ich bin Abdullah Khalfi, Webentwickler aus Freiburg. Seit 2021 entwickle ich Plattformen, Websites und
              Shops mit React, Next.js und TypeScript, von der ersten Idee bis zum laufenden Betrieb.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.05, ease }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <a
                href="#projekte"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:shadow-[0_0_40px_rgba(167,139,250,0.45)]"
              >
                Projekte ansehen
                <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10"
              >
                <Mail className="h-4 w-4" />
                Nachricht schreiben
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 1 }}
            className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 sm:block"
          >
            <div className="flex h-10 w-6 justify-center rounded-full border border-white/20 pt-2">
              <motion.div
                className="h-2 w-1 rounded-full bg-white/60"
                animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </section>

        {/* Stats */}
        <section className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08} className="bg-[#06070b] p-7">
                <div className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl">
                  <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
                </div>
                <div className="mt-2 text-sm text-white/50">{s.label}</div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Marquee */}
        <section className="relative mt-24 overflow-hidden py-6 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
          <motion.div
            className="flex w-max gap-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
          >
            {[...marquee, ...marquee].map((t, i) => (
              <span key={i} className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-sm text-white/70">
                {t}
              </span>
            ))}
          </motion.div>
        </section>

        {/* Projects */}
        <section id="projekte" className="mx-auto max-w-6xl scroll-mt-28 px-6 py-28">
          <Reveal>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-violet-300/80">Ausgewählte Arbeiten</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
              Von der Plattform bis zum Onlineshop.
            </h2>
            <p className="mt-5 max-w-2xl text-white/55">
              Kundennamen nenne ich aus Rücksicht auf meine Auftraggeber nicht. Live-Beispiele zeige ich gern im
              persönlichen Gespräch.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {projects.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.title} delay={(i % 3) * 0.08} className={p.span}>
                  <SpotlightCard className="h-full">
                    <div className="flex h-full flex-col p-7">
                      <div className={`relative mb-7 h-40 overflow-hidden rounded-2xl bg-gradient-to-br ${p.hue}`}>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_55%)]" />
                        <div className="absolute left-4 top-4 flex gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
                          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                        </div>
                        <motion.div
                          className="absolute bottom-0 left-6 right-6 top-12 rounded-t-xl border border-white/15 bg-black/30 p-4 backdrop-blur-md"
                          whileHover={{ y: -6 }}
                          transition={{ duration: 0.5, ease }}
                        >
                          <Icon className="h-6 w-6 text-white/90" />
                          <div className="mt-4 h-2 w-2/3 rounded-full bg-white/25" />
                          <div className="mt-2 h-2 w-1/2 rounded-full bg-white/15" />
                          <div className="mt-2 h-2 w-3/5 rounded-full bg-white/10" />
                        </motion.div>
                      </div>
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/45">{p.tag}</p>
                      <h3 className="mt-3 text-xl font-semibold leading-snug tracking-tight">{p.title}</h3>
                      <p className="mt-3 flex-1 leading-relaxed text-white/55">{p.text}</p>
                      <ul className="mt-6 flex flex-wrap gap-2">
                        {p.stack.map((s) => (
                          <li key={s} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* Skills */}
        <section id="kenntnisse" className="mx-auto max-w-6xl scroll-mt-28 px-6 py-24">
          <Reveal>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-violet-300/80">Kenntnisse</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">Moderner Stack, sauber umgesetzt.</h2>
          </Reveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {skills.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.group} delay={i * 0.08}>
                  <SpotlightCard className="h-full">
                    <div className="p-7">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                          <Icon className="h-5 w-5 text-violet-300" />
                        </span>
                        <h3 className="text-lg font-semibold">{s.group}</h3>
                      </div>
                      <ul className="mt-6 flex flex-wrap gap-2">
                        {s.items.map((it, j) => (
                          <motion.li
                            key={it}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.15 + j * 0.05, duration: 0.4, ease }}
                            className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-white/80"
                          >
                            {it}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* Process */}
        <section id="arbeitsweise" className="mx-auto max-w-6xl scroll-mt-28 px-6 py-24">
          <Reveal>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-violet-300/80">Arbeitsweise</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">Vom Gedanken bis zum Betrieb.</h2>
          </Reveal>
          <div className="relative mt-14 grid gap-5 md:grid-cols-4">
            <div className="absolute left-0 right-0 top-[3.25rem] hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent md:block" />
            {steps.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.title} delay={i * 0.12}>
                  <div className="relative">
                    <div className="flex h-[6.5rem] items-center">
                      <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[#0c0d14] shadow-[0_0_40px_rgba(139,92,246,0.15)]">
                        <Icon className="h-6 w-6 text-white" />
                        <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-xs font-semibold">
                          {i + 1}
                        </span>
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">{p.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* Contact */}
        <section id="kontakt" className="mx-auto max-w-6xl scroll-mt-28 px-6 pb-16 pt-24">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-indigo-500/15 via-violet-500/10 to-fuchsia-500/10 p-8 sm:p-14">
              <motion.div
                className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-violet-500/30 blur-[100px]"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative grid gap-12 lg:grid-cols-[1.2fr_1fr]">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.25em] text-violet-200/80">Kontakt</p>
                  <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
                    Lassen Sie uns sprechen.
                  </h2>
                  <p className="mt-5 max-w-md text-white/60">
                    Ich bin ab sofort verfügbar, gern in Festanstellung, in Freiburg, hybrid oder remote. Meinen
                    Lebenslauf und Arbeitsproben sende ich Ihnen gern zu.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href={`mailto:${EMAIL}?subject=Anfrage%20zu%20Ihrem%20Portfolio`}
                      className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:shadow-[0_0_40px_rgba(167,139,250,0.45)]"
                    >
                      E-Mail schreiben
                      <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                    <a
                      href={`mailto:${EMAIL}?subject=Anfrage%20Lebenslauf`}
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                    >
                      Lebenslauf anfordern
                    </a>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur">
                    <div className="flex min-w-0 items-center gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                        <Mail className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs text-white/45">E-Mail</div>
                        <a href={`mailto:${EMAIL}`} className="block truncate font-medium hover:underline">
                          {EMAIL}
                        </a>
                      </div>
                    </div>
                    <CopyEmail />
                  </div>
                  <a
                    href={PHONE_HREF}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur transition hover:border-white/20"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                      <Phone className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="text-xs text-white/45">Telefon</div>
                      <div className="font-medium">{PHONE}</div>
                    </div>
                  </a>
                  <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="text-xs text-white/45">Standort</div>
                      <div className="font-medium">Freiburg im Breisgau · Deutsch (C1), Englisch, Arabisch</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <footer className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 pb-12 text-sm text-white/35 sm:flex-row">
          <span>© {new Date().getFullYear()} Abdullah Khalfi</span>
          <span>Mit Next.js, TypeScript und Framer Motion entwickelt</span>
        </footer>
      </main>
    </div>
  );
}
