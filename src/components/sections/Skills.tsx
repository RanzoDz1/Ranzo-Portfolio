"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { skills } from "@/lib/data";
import { pmEase } from "@/lib/animations";

const categoryColors: Record<string, string> = {
    tool: "from-blue-500 to-cyan-400",
    code: "from-violet-500 to-purple-400",
    marketing: "from-emerald-500 to-teal-400",
    design: "from-rose-500 to-pink-400",
};

const toolLogos = [
    { name: "Webflow", emoji: "🌐" },
    { name: "Figma", emoji: "🎨" },
    { name: "Next.js", emoji: "▲" },
    { name: "Tailwind", emoji: "💨" },
    { name: "Framer", emoji: "🖱️" },
    { name: "Notion", emoji: "📝" },
    { name: "Vercel", emoji: "⬡" },
    { name: "SEMrush", emoji: "📊" },
];

const toolkitGroups: { title: string; dot: string; items: string[] }[] = [
    {
        title: "Languages",
        dot: "from-violet-500 to-purple-400",
        items: [
            "TypeScript", "JavaScript", "Python", "PHP", "C#", "Java", "Go",
            "Rust", "C++", "Ruby", "Swift", "Kotlin", "SQL", "Bash", "HTML5", "CSS3",
        ],
    },
    {
        title: "Frameworks & Runtimes",
        dot: "from-blue-500 to-cyan-400",
        items: [
            "Next.js", "React", "Vue", "Svelte", "Node.js", "Laravel", ".NET",
            "Django", "FastAPI", "Express", "Spring Boot", "Tailwind CSS",
            "Framer Motion", "React Native", "Flutter", "WordPress",
        ],
    },
    {
        title: "Data & Backend",
        dot: "from-emerald-500 to-teal-400",
        items: [
            "PostgreSQL", "MySQL", "MongoDB", "Redis", "Supabase", "Firebase",
            "Prisma", "GraphQL", "REST APIs", "Airtable",
        ],
    },
    {
        title: "Cloud & DevOps",
        dot: "from-sky-500 to-indigo-400",
        items: [
            "Vercel", "AWS", "Docker", "GitHub Actions", "Netlify", "Cloudflare",
            "Nginx", "Linux", "Git", "CI/CD",
        ],
    },
    {
        title: "AI & Automation",
        dot: "from-amber-500 to-orange-400",
        items: [
            "Claude Code", "Anthropic API", "OpenAI API", "LangChain",
            "MCP Servers", "n8n", "Make", "Zapier", "Prompt Engineering",
            "RAG Pipelines",
        ],
    },
    {
        title: "Design & Growth",
        dot: "from-rose-500 to-pink-400",
        items: [
            "Figma", "Webflow", "Framer", "Adobe XD", "Photoshop",
            "SEO Strategy", "GA4", "SEMrush", "Notion", "Shopify",
        ],
    },
];

export default function Skills() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "0px" });

    return (
        <section id="skills" className="py-28 px-6 bg-[var(--muted)]">
            <div className="max-w-6xl mx-auto" ref={ref}>
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, ease: pmEase.entrance }}
                        className="text-blue-500 text-sm font-semibold tracking-widest uppercase mb-3"
                    >
                        Toolkit
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.08, duration: 0.55, ease: pmEase.entrance }}
                        className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--foreground)]"
                    >
                        Skills &amp;{" "}
                        <span className="text-gradient">Tools</span>
                    </motion.h2>
                </div>

                <div className="grid md:grid-cols-2 gap-16 items-start">
                    {/* Skill bars */}
                    <div className="space-y-6">
                        {skills.map((skill, i) => (
                            <motion.div
                                key={skill.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.08 + i * 0.06, ease: pmEase.entrance }}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-semibold text-[var(--foreground)]">
                                        {skill.name}
                                    </span>
                                    <span className="text-xs font-medium text-[var(--muted-foreground)]">
                                        {skill.level}%
                                    </span>
                                </div>
                                <div className="h-2 rounded-full bg-[var(--border)] overflow-hidden">
                                    <motion.div
                                        className={`h-full rounded-full bg-gradient-to-r ${categoryColors[skill.category]}`}
                                        initial={{ width: "0%" }}
                                        animate={isInView ? { width: `${skill.level}%` } : { width: "0%" }}
                                        transition={{ duration: 0.8, delay: 0.15 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Tool grid */}
                    <div>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-widest mb-6"
                        >
                            Core Stack
                        </motion.p>
                        <div className="grid grid-cols-4 gap-3">
                            {toolLogos.map((tool, i) => (
                                <motion.div
                                    key={tool.name}
                                    initial={{ opacity: 0, scale: 0.85 }}
                                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                    transition={{ duration: 0.5, delay: 0.15 + i * 0.05, ease: pmEase.entrance }}
                                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-blue-500/30 hover:-translate-y-1 hover:shadow-[var(--pm-shadow-mid)] transition-all duration-200 cursor-default"
                                >
                                    <span className="text-2xl">{tool.emoji}</span>
                                    <span className="text-xs font-medium text-[var(--muted-foreground)] text-center">
                                        {tool.name}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Legend */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="mt-8 flex flex-wrap gap-3"
                        >
                            {Object.entries(categoryColors).map(([cat, grad]) => (
                                <span key={cat} className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                                    <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${grad}`} />
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </span>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Daily Toolkit */}
                <div className="mt-14">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.1, duration: 0.5, ease: pmEase.entrance }}
                        className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-widest mb-4"
                    >
                        Daily Toolkit
                    </motion.p>

                    <div className="border-t border-[var(--border)]">
                        {toolkitGroups.map((group, gi) => (
                            <motion.div
                                key={group.title}
                                initial={{ opacity: 0, y: 10 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.45, delay: 0.12 + gi * 0.05, ease: pmEase.entrance }}
                                className="flex flex-col sm:flex-row sm:items-start gap-1.5 sm:gap-5 py-3 border-b border-[var(--border)]"
                            >
                                <div className="flex items-center gap-2 sm:w-40 sm:shrink-0 sm:pt-1">
                                    <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${group.dot}`} />
                                    <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                                        {group.title}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {group.items.map((item) => (
                                        <span
                                            key={`${group.title}-${item}`}
                                            className="px-2.5 py-1 rounded-md text-[11px] font-medium border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-blue-500/40 transition-colors duration-200 cursor-default"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
