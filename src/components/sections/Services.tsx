"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Layout, Monitor, Zap, Smartphone, BarChart2, Bot, X, CheckCircle2, Paperclip } from "lucide-react";
import { services } from "@/lib/data";
import { smoothScrollTo } from "@/lib/smoothScroll";
import { trackEvent } from "@/components/Analytics";
import { pmEase } from "@/lib/animations";
import Image from "next/image";
const serviceImages: Record<string, string> = {
    layout: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&q=70&fm=webp&auto=format&fit=crop",
    monitor: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&q=70&fm=webp&auto=format&fit=crop",
    zap: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=70&fm=webp&auto=format&fit=crop",
    smartphone: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=70&fm=webp&auto=format&fit=crop",
    "bar-chart": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=70&fm=webp&auto=format&fit=crop",
    bot: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=70&fm=webp&auto=format&fit=crop",
};

const iconMap: Record<string, React.ReactNode> = {
    layout: <Layout size={22} />,
    monitor: <Monitor size={22} />,
    zap: <Zap size={22} />,
    smartphone: <Smartphone size={22} />,
    "bar-chart": <BarChart2 size={22} />,
    bot: <Bot size={22} />,
};

const accentClasses = [
    { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", hover: "group-hover:bg-blue-500/20 group-hover:border-blue-500/40" },
    { bg: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-400", hover: "group-hover:bg-violet-500/20 group-hover:border-violet-500/40" },
    { bg: "bg-cyan-500/10", border: "border-cyan-500/20", text: "text-cyan-400", hover: "group-hover:bg-cyan-500/20 group-hover:border-cyan-500/40" },
    { bg: "bg-pink-500/10", border: "border-pink-500/20", text: "text-pink-400", hover: "group-hover:bg-pink-500/20 group-hover:border-pink-500/40" },
    { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", hover: "group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40" },
    { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400", hover: "group-hover:bg-amber-500/20 group-hover:border-amber-500/40" },
];

export default function Services() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "0px" });

    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setFileName(file ? file.name : null);
    }, []);

    const clearFile = useCallback(() => {
        setFileName(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, []);

    // Close modal on escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSelectedService(null);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, []);

    const handleOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("submitting");
        const form = e.currentTarget;
        const formData = new FormData(form);

        // Explicitly grab the file if it exists and append it
        const fileInput = fileInputRef.current;
        if (fileInput && fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            if (file.size > 4.5 * 1024 * 1024) {
                alert("File size exceeds 4.5MB limit. Please choose a smaller file.");
                setStatus("idle");
                return;
            }
            formData.set("attachment", file);
        }

        try {
            // Submit to our Next.js API route
            const res = await fetch("/api/submit", {
                method: "POST",
                body: formData,
            });

            // Send email notification via FormSubmit.co (directly from browser)
            fetch("https://formsubmit.co/ajax/ranzodzt@gmail.com", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({
                    name: formData.get("name"),
                    email: formData.get("email"),
                    message: `Service: ${formData.get("service")}\n\n${formData.get("requirements") || formData.get("message")}`,
                    _subject: `New service order from ${formData.get("name")} — ${formData.get("service")}`,
                    _replyto: formData.get("email") as string,
                    _captcha: "false",
                }),
            }).catch(() => {});

            if (!res.ok) throw new Error("Submission failed");

            // Also save locally for instant same-device display
            try {
                const submissionObj = {
                    id: 'local-' + Date.now(),
                    form_name: "order",
                    created_at: new Date().toISOString(),
                    data: Object.fromEntries(formData.entries()),
                };
                const existing = JSON.parse(localStorage.getItem("admin_local_submissions") || "[]");
                localStorage.setItem("admin_local_submissions", JSON.stringify([submissionObj, ...existing]));
            } catch (e) { /* ignore local sync errors */ }

            setStatus("success");
            setTimeout(() => {
                setStatus("idle");
                setSelectedService(null);
                form.reset();
            }, 3000);
        } catch (error) {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 4000);
        }
    };

    return (
        <section id="services" className="py-28 px-6 bg-[var(--background)] relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-64 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto" ref={ref}>
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, ease: pmEase.entrance }}
                        className="text-blue-500 text-sm font-semibold tracking-widest uppercase mb-3"
                    >
                        What I Do
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.08, duration: 0.55, ease: pmEase.entrance }}
                        className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--foreground)]"
                    >
                        Services &amp;{" "}
                        <span className="text-gradient">Expertise</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.16, duration: 0.55, ease: pmEase.entrance }}
                        className="mt-4 text-[var(--muted-foreground)] max-w-lg mx-auto"
                    >
                        From a single landing page to a full product suite, I cover every layer of the digital experience.
                    </motion.p>
                </div>

                {/* 6-service grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {services.map((service, i) => {
                        const accent = accentClasses[i % accentClasses.length];
                        return (
                            <motion.div
                                key={service.title}
                                initial={{ opacity: 0, y: 32 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.4, delay: 0.04 + i * 0.06, ease: pmEase.entrance }}
                                whileHover={{ y: -4, transition: { duration: 0.25, ease: pmEase.smooth } }}
                                className="group relative p-7 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-blue-500/30 transition-all duration-200 hover:shadow-[var(--pm-shadow-premium)] overflow-hidden cursor-pointer flex flex-col"
                            >
                                {/* Corner glow */}
                                <div
                                    className={`absolute top-0 right-0 w-24 h-24 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                                    style={{ background: `radial-gradient(circle at top right, ${accent.text.replace("text-", "").replace("-400", "")}15, transparent)` }}
                                />

                                {/* Subtle Unsplash background image per card — pointer-events-none so button stays clickable */}
                                {serviceImages[service.icon] && (
                                    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl" aria-hidden="true">
                                        <Image
                                            src={serviceImages[service.icon]}
                                            alt=""
                                            fill
                                            className="object-cover opacity-25 group-hover:opacity-40 group-hover:scale-105 transition-all duration-500 will-change-transform"
                                            sizes="400px"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] via-[var(--card)]/90 to-transparent" />
                                    </div>
                                )}

                                {/* Icon */}
                                <div className={`relative z-10 w-11 h-11 rounded-xl ${accent.bg} border ${accent.border} flex items-center justify-center ${accent.text} mb-5 ${accent.hover} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                    {iconMap[service.icon]}
                                </div>

                                <h3 className="relative z-10 text-lg font-bold text-[var(--foreground)] mb-2">
                                    {service.title}
                                </h3>
                                <p className="relative z-10 text-sm text-[var(--muted-foreground)] leading-relaxed mb-5">
                                    {service.description}
                                </p>

                                {/* Highlights */}
                                <div className="relative z-10 flex flex-wrap gap-2">
                                    {service.highlights.map((h) => (
                                        <span
                                            key={h}
                                            className="text-xs px-2.5 py-1 rounded-full bg-[var(--muted)] border border-[var(--border)] text-[var(--muted-foreground)] font-medium"
                                        >
                                            {h}
                                        </span>
                                    ))}
                                </div>
                                <div className="relative z-10 mt-auto pt-6 w-full">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedService(service.title);
                                            trackEvent("service_request_open", { service_title: service.title });
                                        }}
                                        className={`w-full py-2.5 rounded-xl border border-[var(--border)] text-sm font-semibold transition-all duration-200 ${accent.text} bg-transparent hover:bg-blue-500/10 hover:border-blue-500/40 hover:text-white cursor-pointer`}
                                    >
                                        Request Now
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA strip */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.2, duration: 0.55, ease: pmEase.entrance }}
                    className="mt-14 p-8 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 text-center"
                >
                    <p className="text-lg font-medium text-[var(--foreground)] mb-2">
                        Not sure what you need?
                    </p>
                    <p className="text-[var(--muted-foreground)] text-sm mb-6">
                        Tell me about your project and I&apos;ll recommend the best approach for your goals and budget.
                    </p>
                    <motion.button
                        onClick={() => smoothScrollTo("#contact")}
                        whileHover={{ scale: 1.04, boxShadow: "0 0 20px rgba(59, 130, 246, 0.25)" }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "tween", duration: 0.2 }}
                        className="px-6 py-3 rounded-full bg-[var(--accent)] text-white font-semibold text-sm hover:bg-[var(--accent-hover)] transition-all duration-300 pm-btn-primary"
                    >
                        Get a Free Consultation
                    </motion.button>
                </motion.div>
            </div>

            {/* Order Modal */}
            <AnimatePresence>
                {selectedService && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { duration: 0.2 } }}
                            exit={{ opacity: 0, transition: { duration: 0.15 } }}
                            onClick={() => setSelectedService(null)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-[6px] z-50 transition-opacity"
                        />
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                transition={{ duration: 0.2, ease: pmEase.smooth }}
                                className="w-full max-w-lg bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl p-6 relative pointer-events-auto"
                            >
                                <button
                                    onClick={() => setSelectedService(null)}
                                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--muted)] transition-colors text-[var(--muted-foreground)]"
                                >
                                    <X size={20} />
                                </button>

                                <h3 className="text-2xl font-bold mb-1 text-[var(--foreground)]">Submit a Request</h3>
                                <p className="text-[var(--muted-foreground)] text-sm mb-6">You are requesting: <span className="font-semibold text-[var(--foreground)]">{selectedService}</span></p>

                                <form name="order" method="POST" encType="multipart/form-data" onSubmit={handleOrderSubmit} className="space-y-4">
                                    <input type="hidden" name="form-name" value="order" />
                                    <input type="hidden" name="service" value={selectedService} />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label htmlFor="order-name" className="text-sm font-medium text-[var(--foreground)]">Name</label>
                                            <input type="text" id="order-name" name="name" required placeholder="John Doe" className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] outline-none transition-all pm-input" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label htmlFor="order-email" className="text-sm font-medium text-[var(--foreground)]">Email</label>
                                            <input type="email" id="order-email" name="email" required placeholder="john@example.com" className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] outline-none transition-all pm-input" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="requirements" className="text-sm font-medium text-[var(--foreground)]">Project Details & Requirements</label>
                                        <textarea id="requirements" name="requirements" required rows={4} placeholder="Describe your vision, timeline, and any specific needs..." className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] outline-none transition-all resize-none pm-input"></textarea>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-[var(--foreground)]">Attachment <span className="text-[var(--muted-foreground)]">(Optional - PDF or Image)</span></label>
                                        {/* Hidden native input — always English via our custom button */}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            id="attachment"
                                            name="attachment"
                                            accept=".pdf,image/*"
                                            className="sr-only"
                                            onChange={handleFileChange}
                                        />
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-blue-500/10 text-blue-400 text-sm font-semibold hover:bg-blue-500/20 hover:border-blue-500/40 transition-all duration-200"
                                            >
                                                <Paperclip size={14} />
                                                Choose File
                                            </button>
                                            {fileName ? (
                                                <span className="flex items-center gap-2 text-sm text-[var(--foreground)] truncate max-w-[200px]">
                                                    <span className="truncate">{fileName}</span>
                                                    <button type="button" onClick={clearFile} className="flex-shrink-0 text-[var(--muted-foreground)] hover:text-red-400 transition-colors">
                                                        <X size={13} />
                                                    </button>
                                                </span>
                                            ) : (
                                                <span className="text-sm text-[var(--muted-foreground)]">No file selected</span>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === "submitting" || status === "success"}
                                        className={`w-full py-3.5 rounded-xl text-white font-semibold flex justify-center items-center gap-2 transition-all duration-300 shadow-lg ${status === "success"
                                            ? "bg-emerald-500 shadow-emerald-500/25"
                                            : "bg-[var(--accent)] hover:bg-[var(--accent-hover)] shadow-blue-500/25"
                                            } disabled:opacity-70`}
                                    >
                                        {status === "submitting" ? (
                                            <><span className="pm-spinner" /><span>Processing...</span></>
                                        ) : status === "success" ? (
                                            <>
                                                <CheckCircle2 size={18} />
                                                Order Received!
                                            </>
                                        ) : (
                                            "Confirm Request"
                                        )}
                                    </button>
                                    {status === "error" && <p className="text-red-500 text-sm text-center">Submission failed. Try again.</p>}
                                </form>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </section >
    );
}
