"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, CheckCircle2, CreditCard, Phone, Paperclip, X } from "lucide-react";
import { trackEvent } from "@/components/Analytics";
import { pmEase } from "@/lib/animations";

export default function Contact() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [cmsSettings, setCmsSettings] = useState({ email: "ranzodzt@gmail.com", phone: "+4915204785579" });

    useEffect(() => {
        fetch("/api/settings")
            .then(res => res.json())
            .then(data => {
                if (data.global_email || data.global_phone) {
                    setCmsSettings(prev => ({
                        email: data.global_email || prev.email,
                        phone: data.global_phone || prev.phone
                    }));
                }
            })
            .catch(() => {});
    }, []);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setFileName(file ? file.name : null);
    }, []);

    const clearFile = useCallback(() => {
        setFileName(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("submitting");
        trackEvent("form_submission", { form_name: "contact" });
        const form = e.currentTarget;
        const formData = new FormData(form);

        // Explicitly grab the file if it exists and append it (helps with some React environments)
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
            // Submit to our Next.js API route (cross-platform)
            const res = await fetch("/api/submit", {
                method: "POST",
                body: formData, // Send FormData directly for multipart/form-data support (files)
            });

            if (!res.ok) throw new Error("Submission failed");

            // Also save locally for instant same-device display
            try {
                const submissionObj = {
                    id: 'local-' + Date.now(),
                    form_name: "contact",
                    created_at: new Date().toISOString(),
                    data: Object.fromEntries(formData.entries()),
                };
                const existing = JSON.parse(localStorage.getItem("admin_local_submissions") || "[]");
                localStorage.setItem("admin_local_submissions", JSON.stringify([submissionObj, ...existing]));
            } catch (e) { /* ignore local sync errors */ }

            setStatus("success");
            trackEvent("form_success", { form_name: "contact" });
            form.reset();
            setTimeout(() => setStatus("idle"), 5000);
        } catch (error) {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 5000);
        }
    };

    return (
        <section id="contact" className="pt-12 pb-28 px-6 bg-[var(--muted)]">
            <div className="max-w-2xl mx-auto text-center" ref={ref}>
                {/* Header */}
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, ease: pmEase.entrance }}
                    className="text-blue-500 text-sm font-semibold tracking-widest uppercase mb-3"
                >
                    Get in Touch
                </motion.p>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.08, duration: 0.4, ease: pmEase.entrance }}
                    className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--foreground)]"
                >
                    Ready to{" "}
                    <span className="text-gradient">Collaborate?</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.16, duration: 0.4, ease: pmEase.entrance }}
                    className="mt-5 text-[var(--muted-foreground)] max-w-md mx-auto leading-relaxed"
                >
                    I&apos;m open to freelance projects, consulting, and design collaborations.
                    Drop me an email and I&apos;ll get back to you within 24 hours.
                </motion.p>

                {/* Contact cards */}
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-stretch max-w-xl mx-auto">
                    {/* Email card */}
                    <motion.a
                        href={`mailto:${cmsSettings.email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 30, scale: 0.96 }}
                        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                        transition={{ delay: 0.24, duration: 0.4, ease: pmEase.entrance }}
                        whileHover={{ scale: 1.02, y: -2, transition: { duration: 0.22, ease: pmEase.smooth } }}
                        className="group flex-1 flex items-center justify-between p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-blue-500/40 hover:shadow-[var(--pm-shadow-premium)] transition-all duration-300"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300">
                                <Mail size={19} />
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-medium text-[var(--muted-foreground)] mb-0.5">Email</p>
                                <p className="text-sm font-bold text-[var(--foreground)]">Send an Email</p>
                            </div>
                        </div>
                        <motion.span
                            className="text-sm text-blue-400 font-semibold ml-2"
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                            →
                        </motion.span>
                    </motion.a>

                    {/* WhatsApp card */}
                    <motion.a
                        href={`https://wa.me/${cmsSettings.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 30, scale: 0.96 }}
                        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                        transition={{ delay: 0.32, duration: 0.4, ease: pmEase.entrance }}
                        whileHover={{ scale: 1.02, y: -2, transition: { duration: 0.22, ease: pmEase.smooth } }}
                        className="group flex-1 flex items-center justify-between p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-green-500/40 hover:shadow-[var(--pm-shadow-premium)] transition-all duration-300"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 group-hover:bg-green-500/20 group-hover:scale-110 transition-all duration-300">
                                <Phone size={19} />
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-medium text-[var(--muted-foreground)] mb-0.5">WhatsApp</p>
                                <p className="text-sm font-bold text-[var(--foreground)]">Let's Chat</p>
                            </div>
                        </div>
                        <motion.span
                            className="text-sm text-green-400 font-semibold ml-2"
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                            →
                        </motion.span>
                    </motion.a>
                </div>

                {/* Payment Methods */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mt-6 flex items-center justify-center gap-6"
                >
                    <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-300 cursor-default">
                        <CreditCard size={16} className="text-blue-500" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Stripe</span>
                    </div>
                    <div className="w-px h-3 bg-[var(--border)]" />
                    <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-300 cursor-default">
                        <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.723a.641.641 0 0 1 .63-.53h7.104c3.483 0 5.483 1.636 5.86 4.341.258 1.838-.138 3.328-1.574 4.148-.485.281-.986.516-1.554.593v.025c.57.106 1.05.356 1.353.943.43.834.331 1.968-.148 4.218-.328 1.543-.37 2.067-.09 2.508.192.302.571.39 1.127.391.096.002.193.003.287.014a.641.641 0 0 1 .536.81l-.09.388a.641.641 0 0 1-.624.496H11.08a.641.641 0 0 1-.633-.74L11.527 15h-3.32l-1.131 6.337zM14.546 8.5c0-1.5-1-2.5-3-2.5h-4.5l-1 5.5h4c2.5 0 4.5-1 4.5-3z" /></svg>
                        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">PayPal</span>
                    </div>
                </motion.div>

                <form
                    name="contact"
                    method="POST"
                    encType="multipart/form-data"
                    onSubmit={handleSubmit}
                    className="mt-12 text-left max-w-xl mx-auto space-y-4"
                >
                    <input type="hidden" name="form-name" value="contact" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label htmlFor="name" className="text-sm font-medium text-[var(--foreground)]">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                placeholder="John Doe"
                                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] outline-none text-base sm:text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] pm-input"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="text-sm font-medium text-[var(--foreground)]">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                placeholder="john@example.com"
                                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] outline-none text-base sm:text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] pm-input"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="service" className="text-sm font-medium text-[var(--foreground)]">Service Required</label>
                        <select
                            id="service"
                            name="service"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] outline-none text-base sm:text-sm text-[var(--foreground)] appearance-none pm-input"
                        >
                            <option value="">Select a service...</option>
                            <option value="Landing Page">Landing Page Design</option>
                            <option value="Website Redesign">Website Redesign</option>
                            <option value="Webflow Migration">Webflow Migration</option>
                            <option value="SEO Optimization">SEO Optimization</option>
                            <option value="Dashboard Design">Dashboard Design</option>
                            <option value="Mobile App">Mobile App Development</option>
                            <option value="Conversion Optimization">Conversion Optimization</option>
                            <option value="Speed Optimization">Speed Optimization</option>
                            <option value="CMS Integration">CMS Integration</option>
                            <option value="Consulting">Consulting / Other</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="message" className="text-sm font-medium text-[var(--foreground)]">Project Requirements</label>
                        <textarea
                            id="message"
                            name="message"
                            required
                            rows={4}
                            placeholder="Tell me about your project goals, timeline, and budget..."
                            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] resize-none pm-input"
                        ></textarea>
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

                    <motion.button
                        whileHover={status === "submitting" ? {} : { scale: 1.02, boxShadow: "0 0 25px rgba(59, 130, 246, 0.2)" }}
                        whileTap={status === "submitting" ? {} : { scale: 0.98 }}
                        type="submit"
                        disabled={status === "submitting" || status === "success"}
                        className={`w-full mt-4 flex justify-center items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg pm-btn-primary ${status === "success"
                            ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25"
                            : "bg-[var(--accent)] hover:bg-[var(--accent-hover)] shadow-blue-500/25"
                            } disabled:opacity-70 disabled:cursor-not-allowed`}
                    >
                        {status === "submitting" ? (
                            <><span className="pm-spinner" /><span>Sending...</span></>
                        ) : status === "success" ? (
                            <>
                                <CheckCircle2 size={18} />
                                Message Sent!
                            </>
                        ) : (
                            <>
                                <Mail size={18} />
                                Send Message
                            </>
                        )}
                    </motion.button>
                    {status === "error" && (
                        <p className="text-red-500 text-sm mt-2 text-center">Something went wrong. Please try again.</p>
                    )}
                </form>

                {/* Direct Payment Links */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5, duration: 0.55, ease: pmEase.entrance }}
                    className="mt-10 max-w-xl mx-auto pt-8 border-t border-[var(--border)]"
                >
                    <p className="text-sm font-medium text-[var(--foreground)] mb-4 text-center">Or make a direct payment</p>
                    <div className="grid grid-cols-2 gap-4">
                        <a
                            href="https://buy.stripe.com/6oU7sMemJ3NueenfN62Nq02"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-blue-500/50 hover:bg-blue-500/5 hover:shadow-[var(--pm-shadow-mid)] transition-all duration-300 group"
                        >
                            <CreditCard size={18} className="text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                            <span className="font-semibold text-[var(--foreground)]">Stripe</span>
                        </a>
                        <a
                            href="https://www.paypal.com/ncp/payment/PADRXBQ3QR5BY"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-blue-500/50 hover:bg-blue-500/5 hover:shadow-[var(--pm-shadow-mid)] transition-all duration-300 group"
                        >
                            <svg className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.723a.641.641 0 0 1 .63-.53h7.104c3.483 0 5.483 1.636 5.86 4.341.258 1.838-.138 3.328-1.574 4.148-.485.281-.986.516-1.554.593v.025c.57.106 1.05.356 1.353.943.43.834.331 1.968-.148 4.218-.328 1.543-.37 2.067-.09 2.508.192.302.571.39 1.127.391.096.002.193.003.287.014a.641.641 0 0 1 .536.81l-.09.388a.641.641 0 0 1-.624.496H11.08a.641.641 0 0 1-.633-.74L11.527 15h-3.32l-1.131 6.337zM14.546 8.5c0-1.5-1-2.5-3-2.5h-4.5l-1 5.5h4c2.5 0 4.5-1 4.5-3z" /></svg>
                            <span className="font-semibold text-[var(--foreground)]">PayPal</span>
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
