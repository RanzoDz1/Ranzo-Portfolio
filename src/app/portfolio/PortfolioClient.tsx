"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useMotionTemplate, useScroll, animate } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Copy,
  Mail,
  Phone,
  MapPin,
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
  Languages,
} from "lucide-react";

type Lang = "de" | "en";

const EMAIL = "khalfiabdullah@gmail.com";
const PHONE = "+49 1520 4785579";
const PHONE_HREF = "tel:+4915204785579";

const ease = [0.22, 1, 0.36, 1] as const;

const projectMeta = [
  { icon: Layers, stack: ["Next.js", "React", "TypeScript", "Vercel"], hue: "from-indigo-500/30 via-violet-500/20 to-fuchsia-500/10", span: "md:col-span-2" },
  { icon: Truck, stack: ["Next.js", "React", "TypeScript"], hue: "from-emerald-500/30 via-teal-500/20 to-cyan-500/10", span: "" },
  { icon: Globe, stack: ["JavaScript", "HTML/CSS", "SEO"], hue: "from-amber-500/30 via-orange-500/20 to-rose-500/10", span: "" },
  { icon: ShoppingBag, stack: ["Shopify", "Meta Ads"], hue: "from-pink-500/30 via-rose-500/20 to-orange-500/10", span: "" },
  { icon: Server, stack: ["Microsoft 365", "Hosting", "DNS"], hue: "from-cyan-500/30 via-sky-500/20 to-emerald-500/10", span: "" },
];

const skillMeta = [
  { icon: Code2, items: ["React", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Framer Motion"] },
  { icon: Database, items: ["Node.js", "Express", "Python", "C#", "REST APIs", "SQL", "PostgreSQL", "MongoDB", "Prisma"] },
  { icon: Cloud, items: ["Vercel", "Git", "GitHub", "Hosting", "DNS", "SSL"] },
  { icon: Bot, items: ["Claude Code", "Claude API", "OpenAI API", "Webhooks", "Figma", "Shopify", "Microsoft 365"] },
];

const marquee = [
  "React", "Next.js", "TypeScript", "JavaScript", "Node.js", "Python", "C#", "SQL", "PostgreSQL",
  "MongoDB", "Tailwind CSS", "REST APIs", "Git", "Vercel", "Shopify", "Microsoft 365", "Claude Code",
];

const stepIcons = [Search, PenTool, Rocket, Wrench];

const t = {
  de: {
    nav: ["Projekte", "Kenntnisse", "Arbeitsweise", "Kontakt"],
    contactBtn: "Kontakt",
    badge: "Ab sofort verfügbar · Freiburg, hybrid oder remote",
    headline: ["Webanwendungen,", "die", "begeistern", "und", "zuverlässig", "laufen."],
    accent: "begeistern",
    intro:
      "Ich bin Abdullah Khalfi, Webentwickler aus Freiburg. Seit 2021 entwickle ich Plattformen, Websites und Shops mit React, Next.js und TypeScript, von der ersten Idee bis zum laufenden Betrieb.",
    ctaProjects: "Projekte ansehen",
    ctaMail: "Nachricht schreiben",
    stats: [
      { value: 2021, prefix: "seit ", suffix: "", label: "Webentwicklung für Kunden" },
      { value: 10, prefix: "", suffix: "+", label: "veröffentlichte Webprojekte" },
      { value: 5, prefix: "", suffix: "+ Jahre", label: "Praxis in Web und IT" },
      { value: 0, prefix: "", suffix: "", label: "Kunden in Deutschland und den USA", text: "DE · USA" },
    ],
    projKicker: "Ausgewählte Arbeiten",
    projTitle: "Von der Plattform bis zum Onlineshop.",
    projNote: "Kundennamen nenne ich aus Rücksicht auf meine Auftraggeber nicht. Live-Beispiele zeige ich gern im persönlichen Gespräch.",
    projects: [
      { tag: "Plattform · Full-Stack", title: "Vermittlungsplattform für Haushalts- und Handwerksleistungen", text: "Auftraggeber stellen Aufträge kostenlos ein und erhalten Angebote von geprüften Fachbetrieben aus ihrer Region. Konzeption, Frontend, Backend und Betrieb unter eigener Domain." },
      { tag: "B2B-Plattform · Full-Stack", title: "Kuriervermittlung für Restaurants", text: "Restaurants buchen bei hohem Bestellaufkommen kurzfristig Lieferfahrer. Preisberechnung pro Lieferung und Kilometer, automatische Abrechnung und Bestätigung." },
      { tag: "Websites · Deutschland und USA", title: "Websites für lokale Unternehmen", text: "Unternehmensseiten für Einzelhandel, Lebensmittelhandel, Möbeltischlerei, Reinigungsservice und Entrümpelung. Mobil optimiert, suchmaschinenfreundlich, auf Anfragen ausgerichtet." },
      { tag: "E-Commerce · seit 2021", title: "Eigener Onlinehandel", text: "Aufbau und Betrieb eines eigenen Onlineshops: Produkt- und Stammdaten, Shopsystem, Kampagnen über Meta Ads und laufende Auswertung der Verkäufe." },
      { tag: "IT-Betreuung · seit 2021", title: "IT für eigene Kunden", text: "Microsoft 365, Konten und Zugriffsrechte, Hosting, Domains, DNS und Zertifikate sowie die Behebung von Störungen im laufenden Betrieb." },
    ],
    skillKicker: "Kenntnisse",
    skillTitle: "Moderner Stack, sauber umgesetzt.",
    skillGroups: ["Frontend", "Backend und Daten", "Betrieb und Deployment", "KI und Werkzeuge"],
    stepKicker: "Arbeitsweise",
    stepTitle: "Vom Gedanken bis zum Betrieb.",
    steps: [
      { title: "Verstehen", text: "Ziele, Nutzer und Anforderungen klären, bevor die erste Zeile Code entsteht." },
      { title: "Gestalten", text: "Struktur und Oberfläche so planen, dass sie auf jedem Gerät intuitiv funktionieren." },
      { title: "Umsetzen", text: "Sauberer, wartbarer Code mit modernen Frameworks, schnell geliefert dank KI-gestützter Entwicklung." },
      { title: "Betreiben", text: "Deployment, Hosting und Pflege, damit die Anwendung zuverlässig läuft." },
    ],
    cKicker: "Kontakt",
    cTitle: "Lassen Sie uns sprechen.",
    cText: "Ich bin ab sofort verfügbar, gern in Festanstellung, in Freiburg, hybrid oder remote. Meinen Lebenslauf und Arbeitsproben sende ich Ihnen gern zu.",
    cMail: "E-Mail schreiben",
    cCv: "Lebenslauf anfordern",
    mailSubject: "Anfrage%20zu%20Ihrem%20Portfolio",
    cvSubject: "Anfrage%20Lebenslauf",
    lEmail: "E-Mail",
    lPhone: "Telefon",
    lLocation: "Standort",
    location: "Freiburg im Breisgau",
    lLang: "Sprachen",
    langs: "Deutsch, Englisch, Arabisch",
    copy: "E-Mail kopieren",
    copied: "Kopiert",
    footer: "Mit Next.js, TypeScript und Framer Motion entwickelt",
    switchHref: "/portfolio/en",
    switchLabel: "EN",
  },
  en: {
    nav: ["Projects", "Skills", "Process", "Contact"],
    contactBtn: "Contact",
    badge: "Available now · Freiburg, Germany · hybrid or remote",
    headline: ["Web", "applications", "that", "impress", "and", "run", "reliably."],
    accent: "impress",
    intro:
      "I'm Abdullah Khalfi, a web developer based in Freiburg, Germany. Since 2021 I have been building platforms, websites and online shops with React, Next.js and TypeScript, from the first idea to production.",
    ctaProjects: "View projects",
    ctaMail: "Send a message",
    stats: [
      { value: 2021, prefix: "since ", suffix: "", label: "building for clients" },
      { value: 10, prefix: "", suffix: "+", label: "web projects shipped" },
      { value: 5, prefix: "", suffix: "+ years", label: "hands-on in web and IT" },
      { value: 0, prefix: "", suffix: "", label: "clients in Germany and the US", text: "DE · US" },
    ],
    projKicker: "Selected work",
    projTitle: "From platforms to online shops.",
    projNote: "Out of respect for my clients I don't name them here. I'm happy to show live examples in a personal conversation.",
    projects: [
      { tag: "Platform · Full-stack", title: "Marketplace for home and trade services", text: "Customers post jobs for free and receive quotes from vetted local professionals. Concept, frontend, backend and operation on its own domain." },
      { tag: "B2B platform · Full-stack", title: "Courier dispatch for restaurants", text: "Restaurants book delivery drivers on short notice during peak hours. Pricing per delivery and kilometre, automated billing and confirmation." },
      { tag: "Websites · Germany and US", title: "Websites for local businesses", text: "Business websites for retail, grocery, custom cabinetry, cleaning and clearance services. Mobile-first, search-engine friendly and built to generate enquiries." },
      { tag: "E-commerce · since 2021", title: "Own online store", text: "Built and run my own online store: product data, shop system, Meta Ads campaigns and ongoing sales analysis." },
      { tag: "IT support · since 2021", title: "IT for my own clients", text: "Microsoft 365, accounts and access rights, hosting, domains, DNS and certificates, plus troubleshooting in day-to-day operation." },
    ],
    skillKicker: "Skills",
    skillTitle: "A modern stack, cleanly executed.",
    skillGroups: ["Frontend", "Backend and data", "Operations and deployment", "AI and tools"],
    stepKicker: "Process",
    stepTitle: "From idea to production.",
    steps: [
      { title: "Understand", text: "Clarify goals, users and requirements before the first line of code." },
      { title: "Design", text: "Plan structure and interface so they feel intuitive on every device." },
      { title: "Build", text: "Clean, maintainable code with modern frameworks, delivered fast with AI-assisted development." },
      { title: "Run", text: "Deployment, hosting and maintenance so the application keeps running reliably." },
    ],
    cKicker: "Contact",
    cTitle: "Let's talk.",
    cText: "I'm available now, ideally for a permanent role, in Freiburg, hybrid or remote. I'm happy to send you my CV and work samples.",
    cMail: "Send an email",
    cCv: "Request my CV",
    mailSubject: "Enquiry%20about%20your%20portfolio",
    cvSubject: "CV%20request",
    lEmail: "Email",
    lPhone: "Phone",
    lLocation: "Location",
    location: "Freiburg, Germany",
    lLang: "Languages",
    langs: "English, German, Arabic",
    copy: "Copy email",
    copied: "Copied",
    footer: "Built with Next.js, TypeScript and Framer Motion",
    switchHref: "/portfolio",
    switchLabel: "DE",
  },
} as const;

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function Counter({ value, prefix, suffix }: { value: number; prefix: string; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const start = value > 100 ? value - 30 : 0;
  const [n, setN] = useState(start);
  useEffect(() => {
    if (!inView) return;
    const c = animate(start, value, { duration: 1.6, ease, onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, value, start]);
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
  const bg = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, rgba(139,92,246,0.16), transparent 60%)`;
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
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0c12]/90 transition-colors duration-500 hover:border-white/20 ${className}`}
    >
      <motion.div className="pointer-events-none absolute inset-0 z-0" style={{ background: bg }} />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

/** Mouse-following light. Moved with transform only (GPU-composited), at most one update per frame. */
function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let x = -1000;
    let y = -1000;
    let raf = 0;
    const paint = () => {
      raf = 0;
      if (ref.current) ref.current.style.transform = `translate3d(${x - 350}px, ${y - 350}px, 0)`;
    };
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    if (ref.current) ref.current.style.opacity = "1";
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[1] h-[700px] w-[700px] opacity-0 transition-opacity duration-700 will-change-transform"
      style={{
        transform: "translate3d(-1000px,-1000px,0)",
        background: "radial-gradient(circle at center, rgba(129,140,248,0.13), rgba(139,92,246,0.06) 35%, transparent 65%)",
      }}
    />
  );
}

function CopyEmail({ label, done: doneLabel }: { label: string; done: string }) {
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
      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
      aria-label={label}
    >
      {done ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
      {done ? doneLabel : label}
    </button>
  );
}

export default function PortfolioClient({ lang = "de" }: { lang?: Lang }) {
  const c = t[lang];
  const { scrollYProgress } = useScroll();
  const ids = ["projekte", "kenntnisse", "arbeitsweise", "kontakt"];

  return (
    <div
      lang={lang}
      className="relative min-h-screen overflow-x-hidden bg-[#06070b] text-white antialiased selection:bg-violet-500/40"
      style={{ fontFeatureSettings: '"ss01", "cv11"' }}
    >
      <motion.div
        className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 will-change-transform"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Fixed ambient light: keeps the whole page softly lit, never pure black. Static, no filters. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(60rem 40rem at 100% 100%, rgba(99,102,241,0.08), transparent 60%), radial-gradient(50rem 35rem at 0% 80%, rgba(168,85,247,0.06), transparent 60%), radial-gradient(40rem 30rem at 50% 50%, rgba(56,189,248,0.03), transparent 70%)",
        }}
      />

      {/* Top aurora + fine grid across the full page height */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(45rem 45rem at -5% -5%, rgba(79,70,229,0.22), transparent 60%), radial-gradient(38rem 38rem at 105% 10%, rgba(192,38,211,0.16), transparent 60%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <CursorGlow />

      {/* Nav */}
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease }}
        className="fixed inset-x-0 top-4 z-50 mx-auto w-[calc(100%-2rem)] max-w-5xl"
      >
        <div className="flex items-center justify-between rounded-full border border-white/10 bg-[#0a0b10]/85 px-5 py-3 backdrop-blur-md">
          <a href="#top" className="text-sm font-semibold tracking-tight">
            Abdullah Khalfi
          </a>
          <div className="hidden items-center gap-7 text-sm text-white/60 md:flex">
            {c.nav.map((label, i) => (
              <a key={label} className="transition hover:text-white" href={`#${ids[i]}`}>
                {label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <a
              href={c.switchHref}
              className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold tracking-wider text-white/70 transition hover:border-white/30 hover:text-white"
              aria-label={lang === "de" ? "English version" : "Deutsche Version"}
            >
              {c.switchLabel}
            </a>
            <a href="#kontakt" className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black transition hover:bg-white/90">
              {c.contactBtn}
            </a>
          </div>
        </div>
      </motion.nav>

      <main id="top" className="relative z-10">
        {/* Hero */}
        <section className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-6 pb-20 pt-36">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {c.badge}
          </motion.div>

          <h1 className="mt-8 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-7xl">
            {c.headline.map((w, i) => (
              <motion.span
                key={i}
                className={`mr-[0.22em] inline-block ${w === c.accent ? "bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent" : ""}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.07, ease }}
              >
                {w}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75, ease }}
            className="mt-8 max-w-2xl text-lg leading-relaxed text-white/60"
          >
            {c.intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <a
              href="#projekte"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:shadow-[0_0_40px_rgba(167,139,250,0.45)]"
            >
              {c.ctaProjects}
              <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <Mail className="h-4 w-4" />
              {c.ctaMail}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
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
            {c.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.07} className="bg-[#07080d] p-7">
                <div className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl">
                  {"text" in s ? s.text : <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />}
                </div>
                <div className="mt-2 text-sm text-white/50">{s.label}</div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Marquee (transform only) */}
        <section className="relative mt-24 overflow-hidden py-6 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
          <motion.div className="flex w-max gap-4" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 38, repeat: Infinity, ease: "linear" }}>
            {[...marquee, ...marquee].map((m, i) => (
              <span key={i} className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-sm text-white/70">
                {m}
              </span>
            ))}
          </motion.div>
        </section>

        {/* Projects */}
        <section id="projekte" className="mx-auto max-w-6xl scroll-mt-28 px-6 py-28">
          <Reveal>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-violet-300/80">{c.projKicker}</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">{c.projTitle}</h2>
            <p className="mt-5 max-w-2xl text-white/55">{c.projNote}</p>
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {c.projects.map((p, i) => {
              const m = projectMeta[i];
              const Icon = m.icon;
              return (
                <Reveal key={p.title} delay={(i % 3) * 0.07} className={m.span}>
                  <SpotlightCard className="h-full">
                    <div className="flex h-full flex-col p-7">
                      <div className={`relative mb-7 h-40 overflow-hidden rounded-2xl bg-gradient-to-br ${m.hue}`}>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_55%)]" />
                        <div className="absolute left-4 top-4 flex gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
                          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                        </div>
                        <div className="absolute bottom-0 left-6 right-6 top-12 rounded-t-xl border border-white/15 bg-black/30 p-4 transition-transform duration-500 group-hover:-translate-y-1.5">
                          <Icon className="h-6 w-6 text-white/90" />
                          <div className="mt-4 h-2 w-2/3 rounded-full bg-white/25" />
                          <div className="mt-2 h-2 w-1/2 rounded-full bg-white/15" />
                          <div className="mt-2 h-2 w-3/5 rounded-full bg-white/10" />
                        </div>
                      </div>
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/45">{p.tag}</p>
                      <h3 className="mt-3 text-xl font-semibold leading-snug tracking-tight">{p.title}</h3>
                      <p className="mt-3 flex-1 leading-relaxed text-white/55">{p.text}</p>
                      <ul className="mt-6 flex flex-wrap gap-2">
                        {m.stack.map((s) => (
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
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-violet-300/80">{c.skillKicker}</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">{c.skillTitle}</h2>
          </Reveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {skillMeta.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={i} delay={i * 0.07}>
                  <SpotlightCard className="h-full">
                    <div className="p-7">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                          <Icon className="h-5 w-5 text-violet-300" />
                        </span>
                        <h3 className="text-lg font-semibold">{c.skillGroups[i]}</h3>
                      </div>
                      <ul className="mt-6 flex flex-wrap gap-2">
                        {s.items.map((it, j) => (
                          <motion.li
                            key={it}
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 + j * 0.04, duration: 0.35, ease }}
                            className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-white/80 transition-colors hover:border-violet-400/40 hover:text-white"
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
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-violet-300/80">{c.stepKicker}</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">{c.stepTitle}</h2>
          </Reveal>
          <div className="relative mt-14 grid gap-5 md:grid-cols-4">
            <motion.div
              className="absolute left-0 right-0 top-[3.25rem] hidden h-px origin-left bg-gradient-to-r from-indigo-400/0 via-violet-400/50 to-fuchsia-400/0 md:block"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease }}
            />
            {c.steps.map((p, i) => {
              const Icon = stepIcons[i];
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
              <div
                className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem]"
                style={{ background: "radial-gradient(circle, rgba(139,92,246,0.28), transparent 65%)" }}
              />
              <div className="relative grid gap-12 lg:grid-cols-[1.2fr_1fr]">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.25em] text-violet-200/80">{c.cKicker}</p>
                  <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">{c.cTitle}</h2>
                  <p className="mt-5 max-w-md text-white/60">{c.cText}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href={`mailto:${EMAIL}?subject=${c.mailSubject}`}
                      className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:shadow-[0_0_40px_rgba(167,139,250,0.45)]"
                    >
                      {c.cMail}
                      <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                    <a
                      href={`mailto:${EMAIL}?subject=${c.cvSubject}`}
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                    >
                      {c.cCv}
                    </a>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 p-5">
                    <div className="flex min-w-0 items-center gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                        <Mail className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs text-white/45">{c.lEmail}</div>
                        <a href={`mailto:${EMAIL}`} className="block truncate font-medium hover:underline">
                          {EMAIL}
                        </a>
                      </div>
                    </div>
                    <CopyEmail label={c.copy} done={c.copied} />
                  </div>
                  <a href={PHONE_HREF} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/30 p-5 transition hover:border-white/20">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                      <Phone className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="text-xs text-white/45">{c.lPhone}</div>
                      <div className="font-medium">{PHONE}</div>
                    </div>
                  </a>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/30 p-5">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                        <MapPin className="h-5 w-5" />
                      </span>
                      <div>
                        <div className="text-xs text-white/45">{c.lLocation}</div>
                        <div className="font-medium">{c.location}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/30 p-5">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                        <Languages className="h-5 w-5" />
                      </span>
                      <div>
                        <div className="text-xs text-white/45">{c.lLang}</div>
                        <div className="font-medium">{c.langs}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <footer className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 pb-12 text-sm text-white/35 sm:flex-row">
          <span>© {new Date().getFullYear()} Abdullah Khalfi</span>
          <span>{c.footer}</span>
        </footer>
      </main>
    </div>
  );
}
