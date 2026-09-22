import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Abdullah Khalfi | Portfolio",
  description:
    "Webentwicklung, E-Commerce und IT: ausgewählte Projekte von Abdullah Khalfi, Freiburg.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://ranzo.dev/portfolio" },
};

const projects = [
  {
    tag: "Plattform · Full-Stack",
    title: "Vermittlungsplattform für Haushalts- und Handwerksleistungen",
    text: "Auftraggeber stellen Aufträge kostenlos ein und erhalten Angebote von geprüften Fachbetrieben aus ihrer Region, etwa für Umzug, Sanitär, Elektrik oder Reinigung. Umgesetzt von der Konzeption über Frontend und Backend bis zum Betrieb unter eigener Domain.",
    stack: ["Next.js", "React", "TypeScript", "Vercel"],
  },
  {
    tag: "B2B-Plattform · Full-Stack",
    title: "Kuriervermittlung für Restaurants",
    text: "Restaurants buchen bei hohem Bestellaufkommen kurzfristig unabhängige Lieferfahrer. Transparente Preisberechnung pro Lieferung und Kilometer sowie automatische Abrechnung und Vermittlungsbestätigung.",
    stack: ["Next.js", "React", "TypeScript", "Vercel"],
  },
  {
    tag: "Websites · Lokale Unternehmen",
    title: "Websites für lokale Betriebe in Deutschland und den USA",
    text: "Mehrere Unternehmensseiten für Betriebe aus Einzelhandel, Lebensmittelhandel, Möbeltischlerei, Reinigungsservice und Entrümpelung. Mobil optimiert, suchmaschinenfreundlich aufgebaut und auf Anfragen und Kundengewinnung ausgerichtet.",
    stack: ["HTML/CSS", "JavaScript", "SEO", "Vercel"],
  },
  {
    tag: "Persönliche Website",
    title: "Website für meine eigene Content-Marke",
    text: "Website zu meinen Reiseinhalten mit über einer Million Followern in den sozialen Medien. Konzeption, Gestaltung, Umsetzung und Betrieb in Eigenregie.",
    stack: ["Webentwicklung", "Content", "Vercel"],
  },
  {
    tag: "E-Commerce · seit 2021",
    title: "Eigener Onlinehandel",
    text: "Aufbau und Betrieb eines eigenen Onlineshops: Produkt- und Stammdaten, Shopsystem, Kampagnen über Meta Ads und die laufende Auswertung von Verkäufen.",
    stack: ["Shopify", "Produktdaten", "Meta Ads"],
  },
  {
    tag: "IT-Betreuung · seit 2021",
    title: "IT für eigene Kunden",
    text: "Einrichtung und Betreuung von Microsoft 365, Konten und Zugriffsrechten, Hosting, Domains, DNS und Zertifikaten sowie die Behebung von Störungen im laufenden Betrieb.",
    stack: ["Microsoft 365", "Hosting", "DNS", "Windows"],
  },
];

const skills = [
  { group: "Frontend", items: ["React", "Next.js", "TypeScript", "JavaScript", "HTML/CSS", "Tailwind CSS"] },
  { group: "Backend und Daten", items: ["Node.js", "Python", "SQL", "MongoDB", "REST-APIs"] },
  { group: "Betrieb", items: ["Vercel", "Git", "Hosting", "Domains und DNS", "Microsoft 365"] },
  { group: "Arbeitsweise", items: ["KI-gestützte Entwicklung mit Claude Code", "Strukturierte Fehleranalyse", "Saubere Dokumentation"] },
];

const facts = [
  { value: "seit 2021", label: "Webentwicklung für eigene Kunden" },
  { value: "10+", label: "veröffentlichte Webprojekte" },
  { value: "4 Jahre", label: "Service Lead in der Prüftechnik" },
];

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-900 antialiased">
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
        <header className="border-b border-zinc-200 pb-12">
          <p className="text-sm font-medium uppercase tracking-widest text-blue-600">Portfolio</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Abdullah Khalfi</h1>
          <p className="mt-3 text-lg text-zinc-600">Webentwicklung · E-Commerce · IT · Freiburg im Breisgau</p>
          <p className="mt-6 max-w-3xl leading-relaxed text-zinc-700">
            Seit 2021 entwickle und betreibe ich Webanwendungen und Websites für eigene Kunden, von der Idee bis
            zum laufenden Betrieb. Als gelernter Elektroniker für Betriebstechnik und früherer Service Lead in der
            Prüftechnik arbeite ich strukturiert, genau und lösungsorientiert.
          </p>
          <dl className="mt-10 grid gap-6 sm:grid-cols-3">
            {facts.map((f) => (
              <div key={f.label} className="rounded-xl border border-zinc-200 p-5">
                <dt className="text-sm text-zinc-500">{f.label}</dt>
                <dd className="mt-1 text-2xl font-semibold">{f.value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <section className="py-14">
          <h2 className="text-2xl font-semibold tracking-tight">Ausgewählte Projekte</h2>
          <p className="mt-2 text-zinc-600">
            Kundennamen nenne ich aus Rücksicht auf meine Auftraggeber nicht. Live-Beispiele zeige ich gern im
            Gespräch.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {projects.map((p) => (
              <article key={p.title} className="flex flex-col rounded-2xl border border-zinc-200 p-6 transition hover:border-blue-300 hover:shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wider text-blue-600">{p.tag}</p>
                <h3 className="mt-2 text-lg font-semibold leading-snug">{p.title}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-zinc-700">{p.text}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <li key={s} className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700">{s}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-zinc-200 py-14">
          <h2 className="text-2xl font-semibold tracking-tight">Kenntnisse</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {skills.map((s) => (
              <div key={s.group}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">{s.group}</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {s.items.map((i) => (
                    <li key={i} className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm">{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-zinc-200 py-14">
          <h2 className="text-2xl font-semibold tracking-tight">Werdegang</h2>
          <ol className="mt-8 space-y-6">
            <li className="grid gap-1 sm:grid-cols-[10rem_1fr]">
              <span className="text-sm text-zinc-500">seit 2021</span>
              <span><strong className="font-semibold">Webentwicklung, E-Commerce und IT</strong> für eigene Kunden und eigene Projekte</span>
            </li>
            <li className="grid gap-1 sm:grid-cols-[10rem_1fr]">
              <span className="text-sm text-zinc-500">4 Jahre</span>
              <span><strong className="font-semibold">Elektrotechnische Prüftechnik</strong>, zuletzt Service Lead mit einem Team von 5 bis 20 Personen</span>
            </li>
            <li className="grid gap-1 sm:grid-cols-[10rem_1fr]">
              <span className="text-sm text-zinc-500">2018 bis 2022</span>
              <span><strong className="font-semibold">Ausbildung zum Elektroniker für Betriebstechnik</strong>, IHK-Abschluss</span>
            </li>
          </ol>
        </section>

        <footer className="border-t border-zinc-200 pt-10">
          <h2 className="text-2xl font-semibold tracking-tight">Kontakt</h2>
          <p className="mt-3 text-zinc-700">
            <a className="text-blue-600 underline-offset-4 hover:underline" href="mailto:khalfiabdullah@gmail.com">khalfiabdullah@gmail.com</a>
          </p>
          <p className="mt-1 text-zinc-500">Freiburg im Breisgau · Deutsch (C1), Englisch, Arabisch</p>
        </footer>
      </div>
    </main>
  );
}
