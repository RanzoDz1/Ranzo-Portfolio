"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Code2, Layers, TrendingUp } from "lucide-react";
import { smoothScrollTo } from "@/lib/smoothScroll";
import { useCountUp } from "@/lib/usePremiumScroll";
import { pmEase } from "@/lib/animations";
import Image from "next/image";

// Premium workspace image — Unsplash
const WORKSPACE_IMG = "https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?w=800&q=80&fm=webp&auto=format&fit=crop";

const stats = [
    { value: "300+", label: "Projects Delivered" },
    { value: "#1", label: "Google Rankings Achieved" },
    { value: "5+", label: "Years Experience" },
    { value: "100%", label: "Client Satisfaction" },
];

const pills = [
    { icon: <Code2 size={14} />, text: "Webflow Developer" },
    { icon: <Layers size={14} />, text: "UI/UX Designer" },
    { icon: <TrendingUp size={14} />, text: "SEO Strategist" },
];

function StatCard({ stat, index, isInView }: { stat: typeof stats[0]; index: number; isInView: boolean }) {
    const [display, countRef] = useCountUp(stat.value, 1.2);

    return (
        <motion.div
            ref={countRef}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ delay: 0.1 + index * 0.06, duration: 0.4, ease: pmEase.entrance }}
            className="relative p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden group hover:border-blue-500/40 transition-all duration-300 pm-card"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <p className="text-4xl font-extrabold text-gradient mb-1">
                {display}
            </p>
            <p className="text-sm text-[var(--muted-foreground)] font-medium">
                {stat.label}
            </p>
        </motion.div>
    );
}

export default function About() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "0px" });

    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.06 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: pmEase.entrance } },
    };

    return (
        <section id="about" className="relative py-28 px-6 bg-[var(--background)]">
            {/* Background accent */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="max-w-6xl mx-auto" ref={ref}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid md:grid-cols-2 gap-16 items-center"
                >
                    {/* Left: Text */}
                    <div className="space-y-8">
                        <motion.div variants={itemVariants}>
                            <p className="text-blue-500 text-sm font-semibold tracking-widest uppercase mb-3">
                                About Me
                            </p>
                            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--foreground)] leading-tight">
                                Building the web&apos;s best{" "}
                                <span className="text-gradient">digital experiences</span>
                            </h2>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-4 text-[var(--muted-foreground)] text-base leading-relaxed">
                            <p>
                                I&apos;m <strong className="text-[var(--foreground)]">Ranzo</strong>, a web
                                designer and developer with a sharp eye for what makes digital
                                experiences convert. I specialize in crafting landing pages and
                                websites that are not just beautiful, they are built to rank,
                                load fast, and turn visitors into customers.
                            </p>
                            <p>
                                From{" "}
                                <strong className="text-[var(--foreground)]">winning Google rankings</strong>{" "}
                                to full product launches, every project I take on is
                                treated as a strategic product, not just a pretty page.
                            </p>
                        </motion.div>

                        {/* Pills */}
                        <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
                            {pills.map((pill) => (
                                <motion.span
                                    key={pill.text}
                                    whileHover={{ scale: 1.04, letterSpacing: "0.02em" }}
                                    transition={{ duration: 0.25, ease: pmEase.smooth }}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground)] text-sm font-medium cursor-default transition-all duration-300"
                                >
                                    <span className="text-blue-400">{pill.icon}</span>
                                    {pill.text}
                                </motion.span>
                            ))}
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <motion.button
                                onClick={() => smoothScrollTo("#contact")}
                                whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(59, 130, 246, 0.2)" }}
                                whileTap={{ scale: 0.98 }}
                                className="px-6 py-3 rounded-full bg-[var(--accent)] text-white font-semibold text-sm hover:bg-[var(--accent-hover)] transition-all duration-300 pm-btn-primary"
                            >
                                Work With Me →
                            </motion.button>
                        </motion.div>
                    </div>

                    {/* Right: Workspace image + Stats */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col gap-5"
                    >
                        {/* Premium workspace image — same subtle style as service cards */}
                        <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden pm-img-zoom border border-[var(--border)]">
                            <Image
                                src={WORKSPACE_IMG}
                                alt="Premium home office workspace"
                                fill
                                className="object-cover opacity-[0.55] mix-blend-luminosity"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                loading="lazy"
                            />
                            {/* Heavy brand-color overlay — matches service card darkness */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--card)]/70 via-[var(--card)]/40 to-blue-900/30 pointer-events-none" />
                            {/* Badge overlay */}
                            <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs text-white font-medium">Available for projects</span>
                            </div>
                        </div>

                        {/* Stats grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {stats.map((stat, i) => (
                                <StatCard key={stat.label} stat={stat} index={i} isInView={isInView} />
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
