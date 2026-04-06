"use client"; // Deployment trigger


import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, X, Sparkles } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { smoothScrollTo } from "@/lib/smoothScroll";

const navLinks = [
    { href: "#hero", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#projects", label: "Projects" },
    { href: "#services", label: "Services" },
    { href: "#skills", label: "Skills" },
    { href: "#contact", label: "Contact" },
];

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const [scrolled, setScrolled]       = useState(false);
    const [hidden, setHidden]           = useState(false);
    const [menuOpen, setMenuOpen]       = useState(false);
    const [activeSection, setActiveSection] = useState("");
    const lastY = useRef(0);

    useEffect(() => {
        let ticking = false;
        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const y = window.scrollY;
                setScrolled(y > 40);
                setHidden(y > 100 && y > lastY.current);
                lastY.current = y;

                // Active section detection — throttled via rAF
                let current = "";
                for (const { href } of navLinks) {
                    const el = document.getElementById(href.replace("#", ""));
                    if (el && el.getBoundingClientRect().top <= 150) current = href.replace("#", "");
                }
                setActiveSection(current);
                ticking = false;
            });
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleNavClick = useCallback((href: string) => {
        setMenuOpen(false);
        // Small delay to let mobile menu closing layout settle
        setTimeout(() => {
            smoothScrollTo(href);
        }, 10);
    }, []);

    return (
        <>
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: scrolled ? -50 : 0, opacity: scrolled ? 0 : 1 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="fixed top-0 left-0 right-0 z-[60] bg-[var(--card)]/98 border-b border-[var(--border)] text-[var(--foreground)] text-xs sm:text-sm font-medium py-2.5 px-4 text-center flex items-center justify-center gap-2 sm:gap-3 shadow-sm"
            >
                <Sparkles size={14} className="text-[var(--accent)] hidden sm:block" />
                <span>
                    <span className="hidden sm:inline text-[var(--muted-foreground)]">Exclusive Offer: </span>
                    Enjoy a <strong className="text-[var(--accent)] font-semibold">50% discount</strong> on your first premium web design project.
                </span>
                <button
                    onClick={() => handleNavClick("#services")}
                    className="ml-2 bg-[var(--accent)] text-white px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold hover:bg-[var(--accent-hover)] transition-all shadow-sm shadow-[var(--accent)]/20 pm-btn-primary"
                >
                    Get Started
                </button>
            </motion.div>

            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: hidden ? -120 : scrolled ? -36 : 0, opacity: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={`fixed top-[36px] sm:top-[36px] left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? "py-3 bg-[var(--background)]/95 border-b border-[var(--border)] shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
                    : "py-5"
                    }`}
            >
                <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <motion.a
                        href="#"
                        onClick={(e) => { e.preventDefault(); smoothScrollTo("top"); }}
                        className="text-xl font-bold tracking-tight"
                        whileHover={{ scale: 1.02 }}
                    >
                        <span className="text-gradient">Ranzo</span>
                        <span className="text-[var(--muted-foreground)] font-light">.dev</span>
                    </motion.a>

                    {/* Desktop nav */}
                    <ul className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <button
                                    onClick={() => handleNavClick(link.href)}
                                    className={`relative text-sm font-medium transition-colors duration-300 cursor-pointer pm-underline ${activeSection === link.href.replace("#", "")
                                            ? "text-[var(--foreground)]"
                                            : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                                        }`}
                                >
                                    {link.label}
                                    {activeSection === link.href.replace("#", "") && (
                                        <motion.span
                                            layoutId="nav-indicator"
                                            className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-[var(--accent)] rounded-full"
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* Right actions */}
                    <div className="flex items-center gap-3">
                        <motion.button
                            onClick={toggleTheme}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-9 h-9 rounded-full flex items-center justify-center border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--accent)] transition-all duration-300"
                            aria-label="Toggle theme"
                        >
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={theme}
                                    initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
                                </motion.span>
                            </AnimatePresence>
                        </motion.button>

                        <motion.button
                            onClick={() => handleNavClick("#contact")}
                            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(59, 130, 246, 0.25)" }}
                            whileTap={{ scale: 0.98 }}
                            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-all duration-300 pm-btn-primary"
                        >
                            Let&apos;s Talk
                        </motion.button>

                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden w-9 h-9 flex items-center justify-center text-[var(--foreground)]"
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-x-0 top-[60px] z-40 bg-[var(--background)]/98 border-b border-[var(--border)] md:hidden"
                    >
                        <ul className="flex flex-col px-6 py-6 gap-5">
                            {navLinks.map((link, i) => (
                                <motion.li
                                    key={link.href}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <button
                                        onClick={() => handleNavClick(link.href)}
                                        className={`text-base font-medium w-full text-left transition-colors duration-200 ${activeSection === link.href.replace("#", "")
                                                ? "text-[var(--accent)]"
                                                : "text-[var(--foreground)]"
                                            }`}
                                    >
                                        {link.label}
                                    </button>
                                </motion.li>
                            ))}
                            <motion.li
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: navLinks.length * 0.05, duration: 0.3 }}
                            >
                                <button
                                    onClick={() => handleNavClick("#contact")}
                                    className="w-full px-4 py-2.5 rounded-full text-sm font-semibold bg-[var(--accent)] text-white text-center"
                                >
                                    Let&apos;s Talk
                                </button>
                            </motion.li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
