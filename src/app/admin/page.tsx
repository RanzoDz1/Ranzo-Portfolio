"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, LogOut, RefreshCw, Mail, ShoppingBag, Trash2, LayoutGrid, Settings, Key, Globe, Save, BarChart3, Users, Monitor, MonitorSmartphone, MousePointer2 } from "lucide-react";

interface Submission {
    id: string;
    number?: number;
    title?: string;
    email?: string;
    name?: string;
    form_name?: string;
    created_at: string;
    human_fields?: Record<string, string>;
    ordered_human_fields?: { name: string; title: string; value: string }[];
    data: Record<string, string>;
}

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [loginError, setLoginError] = useState("");

    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetStatus, setResetStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

    const [activeTab, setActiveTab] = useState<"all" | "contact" | "order" | "analytics" | "settings">("all");
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [statuses, setStatuses] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [storageStatus, setStorageStatus] = useState<{ type: string; is_kv_connected: boolean; is_blob_connected: boolean; is_resend_connected?: boolean }>({ type: "unknown", is_kv_connected: false, is_blob_connected: false, is_resend_connected: false });

    // New States for Analytics & Settings Configs
    const [analytics, setAnalytics] = useState<any>(null);
    const [siteSettings, setSiteSettings] = useState<Record<string, string>>({
        global_email: "",
        global_phone: "",
        hero_title: "",
    });
    const [isSavingSettings, setIsSavingSettings] = useState(false);

    useEffect(() => {
        const authStatus = sessionStorage.getItem("admin_auth");
        if (authStatus === "true") setIsAuthenticated(true);
        try {
            const savedStatuses = JSON.parse(localStorage.getItem("admin_submission_statuses") || "{}");
            setStatuses(savedStatuses);
        } catch (e) { }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchSubmissions();
            fetchAnalytics();
            fetchSettings();
        }
    }, [isAuthenticated]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError("");
        setIsLoggingIn(true);
        await new Promise(r => setTimeout(r, 800));

        if (username && password) {
            try {
                const res = await fetch("/api/admin-auth", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });
                if (res.ok) {
                    const data = await res.json();
                    sessionStorage.setItem("admin_token", data.token);
                    setIsAuthenticated(true);
                    sessionStorage.setItem("admin_auth", "true");
                } else {
                    setLoginError("Invalid username or password");
                }
            } catch {
                setLoginError("Connection error. Please try again.");
            }
        } else {
            setLoginError("Please enter your credentials.");
        }
        setIsLoggingIn(false);
    };

    const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setResetStatus("submitting");
        try {
            const formData = new FormData();
            formData.append("form-name", "password_reset");
            formData.append("email", resetEmail);
            await fetch("/", { method: "POST", body: new URLSearchParams(formData as any).toString() });
            setResetStatus("success");
            setTimeout(() => { setShowForgotPassword(false); setResetStatus("idle"); setResetEmail(""); }, 4000);
        } catch (err) {
            setResetStatus("error");
            setTimeout(() => setResetStatus("idle"), 4000);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem("admin_auth");
        sessionStorage.removeItem("admin_token");
        setIsAuthenticated(false);
        setUsername("");
        setPassword("");
    };

    const fetchAnalytics = async () => {
        try {
            const res = await fetch("/api/analytics");
            if (res.ok) {
                const data = await res.json();
                setAnalytics(data);
            }
        } catch (error) {
            console.error("Failed to fetch analytics:", error);
        }
    };

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/settings");
            if (res.ok) {
                const data = await res.json();
                setSiteSettings(prev => ({ ...prev, ...data }));
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        }
    };

    const saveSettingItem = async (key: string, value: string) => {
        try {
            await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key, value }),
            });
        } catch (error) {
            console.error("Error saving setting", key, error);
            throw error;
        }
    };

    const handleSaveSettings = async () => {
        setIsSavingSettings(true);
        try {
            await saveSettingItem("global_email", siteSettings.global_email);
            await saveSettingItem("global_phone", siteSettings.global_phone);
            await saveSettingItem("hero_title", siteSettings.hero_title);
            alert("Settings saved dynamically to the Database!");
        } catch (error) {
            alert("Failed to save settings. Check logs.");
        } finally {
            setIsSavingSettings(false);
        }
    };

    const fetchSubmissions = async () => {
        setIsLoading(true);
        try {
            const adminToken = sessionStorage.getItem("admin_token");
            if (!adminToken) throw new Error("No admin token found. Please re-login.");

            const res = await fetch("/api/submit", { headers: { Authorization: `Bearer ${adminToken}` } });
            if (!res.ok) throw new Error(`API error: ${res.status}`);
            
            const jsonResponse = await res.json();
            const apiData: Submission[] = jsonResponse.submissions || [];

            if (jsonResponse.storage) setStorageStatus(jsonResponse.storage);

            let localData: Submission[] = [];
            try { localData = JSON.parse(localStorage.getItem("admin_local_submissions") || "[]"); } catch (e) { }

            const syncedLocalData = localData.filter(localSub => {
                const localEmail = localSub.data.email;
                const localType = localSub.form_name || localSub.data["form-name"];
                return !apiData.some(apiSub => {
                    const apiEmail = apiSub.data.email || apiSub.email;
                    const apiType = apiSub.form_name || apiSub.data["form-name"];
                    return apiEmail === localEmail && apiType === localType;
                });
            });

            setSubmissions([...syncedLocalData, ...apiData]);
            setLoginError("")
        } catch (error: any) {
            console.error(error);
            setLoginError("Failed to fetch online data. Check your connection or re-deploy the site.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteSubmission = async (id: string) => {
        if (!confirm("Are you sure you want to delete this submission?")) return;
        try {
            const adminToken = sessionStorage.getItem("admin_token");
            if (!id.startsWith('local-')) {
                const res = await fetch(`/api/submit?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${adminToken}` } });
                if (!res.ok) throw new Error("Failed to delete from server");
            }
            const localData: Submission[] = JSON.parse(localStorage.getItem("admin_local_submissions") || "[]");
            const updatedLocal = localData.filter(s => s.id !== id);
            localStorage.setItem("admin_local_submissions", JSON.stringify(updatedLocal));
            setSubmissions(prev => prev.filter(s => s.id !== id));
        } catch (error: any) {
            alert(error.message);
        }
    };

    const handleStatusChange = (id: string, newStatus: string) => {
        const updated = { ...statuses, [id]: newStatus };
        setStatuses(updated);
        localStorage.setItem("admin_submission_statuses", JSON.stringify(updated));
    };

    const displayedSubmissions = submissions.filter(s => {
        if (activeTab === "settings" || activeTab === "analytics") return false;
        const type = (s.form_name || s.data["form-name"] || "").toLowerCase();
        if (activeTab === "all") return type === "contact" || type === "order";
        return type === activeTab;
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] shadow-xl relative overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        {!showForgotPassword ? (
                            <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-6 mx-auto"><Lock size={24} /></div>
                                <h1 className="text-2xl font-bold text-center mb-2 text-[var(--foreground)]">Admin Access</h1>
                                <p className="text-[var(--muted-foreground)] text-sm text-center mb-8">Enter your credentials to access the admin portal.</p>

                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-[var(--foreground)]">Username</label>
                                        <input type="text" required value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-blue-500/50 outline-none text-[var(--foreground)]" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-medium text-[var(--foreground)]">Password</label>
                                            <button type="button" onClick={() => setShowForgotPassword(true)} className="text-xs text-blue-500 hover:text-blue-400 font-medium transition-colors">Forgot password?</button>
                                        </div>
                                        <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••••••••••" className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-blue-500/50 outline-none text-[var(--foreground)]" />
                                    </div>
                                    {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
                                    <button type="submit" disabled={isLoggingIn} className="w-full mt-4 py-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold flex justify-center items-center gap-2 disabled:opacity-70 transition-all">
                                        {isLoggingIn ? "Verifying..." : "Login"}
                                    </button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div key="forgot" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
                                <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-full flex items-center justify-center mb-6 mx-auto"><Mail size={24} /></div>
                                <h1 className="text-2xl font-bold text-center mb-2 text-[var(--foreground)]">Reset Password</h1>
                                <p className="text-[var(--muted-foreground)] text-sm text-center mb-8">Enter your admin email to receive a secure reset link.</p>

                                <form name="password_reset" method="POST" onSubmit={handlePasswordReset} className="space-y-4">
                                    <input type="hidden" name="form-name" value="password_reset" />
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-[var(--foreground)]">Admin Email</label>
                                        <input type="email" name="email" required value={resetEmail} onChange={e => setResetEmail(e.target.value)} placeholder="admin@example.com" className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-purple-500/50 outline-none text-[var(--foreground)]" />
                                    </div>
                                    <button type="submit" disabled={resetStatus === "submitting" || resetStatus === "success"} className={`w-full mt-4 py-3 rounded-xl text-white font-semibold flex justify-center items-center gap-2 transition-all ${resetStatus === "success" ? "bg-emerald-500" : "bg-purple-600 hover:bg-purple-700"} disabled:opacity-70`}>
                                        {resetStatus === "submitting" ? "Sending..." : resetStatus === "success" ? "Reset Link Sent!" : "Send Reset Link"}
                                    </button>
                                    {resetStatus === "error" && <p className="text-red-500 text-sm text-center mt-2">Failed to send request. Try again.</p>}
                                    <button type="button" onClick={() => setShowForgotPassword(false)} className="w-full py-2.5 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mt-2">Back to Login</button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--muted)] pb-20">
            <header className="bg-[var(--card)] border-b border-[var(--border)] sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <h1 className="font-bold text-xl flex items-center gap-2 text-[var(--foreground)]">
                        <Lock size={18} className="text-blue-500" /> Admin Dashboard
                    </h1>
                    <div className="flex items-center gap-4">
                        <button onClick={() => { fetchSubmissions(); fetchAnalytics(); fetchSettings(); }} disabled={isLoading} className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] rounded-lg transition-all" title="Refresh Data">
                            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
                        </button>
                        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                            <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 mt-8">
                <div className="flex flex-wrap gap-4 mb-8">
                    <button onClick={() => setActiveTab("analytics")} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === "analytics" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25" : "bg-[var(--card)] text-[var(--muted-foreground)] border border-[var(--border)] hover:bg-white/5"}`}>
                        <BarChart3 size={18} /> Analytics Space
                    </button>
                    <button onClick={() => setActiveTab("all")} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === "all" ? "bg-[var(--accent)] text-white shadow-lg shadow-blue-500/25" : "bg-[var(--card)] text-[var(--muted-foreground)] border border-[var(--border)] hover:bg-white/5"}`}>
                        <LayoutGrid size={18} /> All Submissions
                    </button>
                    <button onClick={() => setActiveTab("order")} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === "order" ? "bg-amber-600 text-white shadow-lg shadow-amber-600/25" : "bg-[var(--card)] text-[var(--muted-foreground)] border border-[var(--border)] hover:bg-white/5"}`}>
                        <ShoppingBag size={18} /> Requests Only
                    </button>
                    <button onClick={() => setActiveTab("contact")} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === "contact" ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25" : "bg-[var(--card)] text-[var(--muted-foreground)] border border-[var(--border)] hover:bg-white/5"}`}>
                        <Mail size={18} /> Messages
                    </button>
                    <button onClick={() => setActiveTab("settings")} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === "settings" ? "bg-slate-700 text-white shadow-lg shadow-slate-700/25" : "bg-[var(--card)] text-[var(--muted-foreground)] border border-[var(--border)] hover:bg-white/5"}`}>
                        <Settings size={18} /> CMS Settings
                    </button>
                </div>

                {isLoading && displayedSubmissions.length === 0 && activeTab !== "analytics" && activeTab !== "settings" ? (
                    <div className="flex justify-center py-20"><RefreshCw size={24} className="animate-spin text-[var(--muted-foreground)]" /></div>
                ) : activeTab === "analytics" ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Traffic Overview */}
                        <div className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center min-h-[160px]">
                            <Users size={32} className="text-emerald-500 mb-3" />
                            <h3 className="text-[var(--muted-foreground)] font-semibold text-sm">Total Website Views</h3>
                            <p className="text-4xl font-black mt-2 text-[var(--foreground)]">{analytics?.totalViews || 0}</p>
                        </div>
                        <div className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center min-h-[160px]">
                            <Globe size={32} className="text-blue-500 mb-3" />
                            <h3 className="text-[var(--muted-foreground)] font-semibold text-sm">Unique Visitors</h3>
                            <p className="text-4xl font-black mt-2 text-[var(--foreground)]">{analytics?.uniqueVisitors || 0}</p>
                        </div>
                        <div className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center min-h-[160px]">
                            <MousePointer2 size={32} className="text-amber-500 mb-3" />
                            <h3 className="text-[var(--muted-foreground)] font-semibold text-sm">Total Submissions</h3>
                            <p className="text-4xl font-black mt-2 text-[var(--foreground)]">{submissions.length}</p>
                        </div>

                        {/* Recent Paths */}
                        <div className="md:col-span-3 bg-[var(--card)] border border-[var(--border)] p-6 rounded-2xl shadow-xl mt-4">
                            <h3 className="text-xl font-bold mb-4">Live Real-time Traffic</h3>
                            {analytics?.recentLogs?.length > 0 ? (
                                <ul className="divide-y divide-[var(--border)] text-sm">
                                    {analytics.recentLogs.map((log: any, idx: number) => (
                                        <li key={idx} className="py-3 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {log.device === "Mobile" ? <MonitorSmartphone className="text-purple-500" size={18}/> : <Monitor className="text-sky-500" size={18}/>}
                                                <span className="font-semibold text-[var(--foreground)]">{log.pathname}</span>
                                                <span className="text-[var(--muted-foreground)] text-xs bg-[var(--muted)] px-2 py-0.5 rounded">{log.browser}</span>
                                            </div>
                                            <span className="text-[var(--muted-foreground)] tabular-nums">{new Date(log.visitedAt).toLocaleTimeString()} · {new Date(log.visitedAt).toLocaleDateString()}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-[var(--muted-foreground)] py-8 text-center border border-dashed rounded-lg">No traffic recorded yet. Try reloading the homepage.</p>
                            )}
                        </div>
                    </div>
                ) : activeTab === "settings" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Dynamic CMS Configurations */}
                        <div className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Settings size={20} /></div>
                                <h2 className="text-xl font-bold">Content CMS Form</h2>
                            </div>
                            <p className="text-sm text-[var(--muted-foreground)] mb-6">Modify these values to immediately update your public portfolio content across all sections using Prisma Postgres.</p>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold">Contact Email</label>
                                    <input type="text" value={siteSettings.global_email || ""} onChange={(e) => setSiteSettings({ ...siteSettings, global_email: e.target.value })} className="w-full px-4 py-2 border rounded-xl bg-[var(--background)] border-[var(--border)]" placeholder="e.g. yourname@gmail.com" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold">Contact Phone Number</label>
                                    <input type="text" value={siteSettings.global_phone || ""} onChange={(e) => setSiteSettings({ ...siteSettings, global_phone: e.target.value })} className="w-full px-4 py-2 border rounded-xl bg-[var(--background)] border-[var(--border)]" placeholder="e.g. +1 (555) 123-4567" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold">Hero Title Text</label>
                                    <input type="text" value={siteSettings.hero_title || ""} onChange={(e) => setSiteSettings({ ...siteSettings, hero_title: e.target.value })} className="w-full px-4 py-2 border rounded-xl bg-[var(--background)] border-[var(--border)]" placeholder="e.g. Building Next-Gen Experiences" />
                                </div>

                                <button onClick={handleSaveSettings} disabled={isSavingSettings} className="w-full mt-4 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all">
                                    <Save size={18} /> {isSavingSettings ? "Saving to Database..." : "Save Settings to Live Site"}
                                </button>
                            </div>
                        </div>

                        {/* Vercel KV Status (Kept exactly as before) */}
                        <div className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-slate-500/10 text-slate-500 rounded-lg"><Key size={20} /></div>
                                <h2 className="text-xl font-bold">Storage Integrations</h2>
                            </div>
                            <div className="space-y-6">
                                <div className={`p-4 rounded-xl border ${storageStatus.is_kv_connected ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`w-2 h-2 rounded-full ${storageStatus.is_kv_connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                                        <p className={`text-sm font-bold uppercase tracking-wider ${storageStatus.is_kv_connected ? 'text-emerald-500' : 'text-amber-500'}`}>Redis KV: {storageStatus.is_kv_connected ? 'Connected' : 'Disconnected'}</p>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`w-2 h-2 rounded-full ${storageStatus.is_blob_connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                                        <p className={`text-sm font-bold uppercase tracking-wider ${storageStatus.is_blob_connected ? 'text-emerald-500' : 'text-amber-500'}`}>Vercel Blob: {storageStatus.is_blob_connected ? 'Connected' : 'Disconnected'}</p>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`w-2 h-2 rounded-full ${storageStatus.is_resend_connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                                        <p className={`text-sm font-bold uppercase tracking-wider ${storageStatus.is_resend_connected ? 'text-emerald-500' : 'text-amber-500'}`}>Resend Email: {storageStatus.is_resend_connected ? 'Connected' : 'Disconnected'}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-[var(--muted-foreground)] pb-6 mb-2 border-b border-[var(--border)]">Your Postgres connection is driven via Prisma globally.</p>
                                <button onClick={() => fetchSubmissions()} className="w-full py-3 bg-[var(--muted)] hover:bg-[var(--border)] font-bold rounded-xl flex items-center justify-center gap-2 transition-all">
                                    <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} /> Check Connection Status
                                </button>
                            </div>
                        </div>
                    </div>
                ) : displayedSubmissions.length === 0 ? (
                    <div className="text-center py-20 border border-[var(--border)] border-dashed rounded-2xl bg-[var(--card)]">
                        <p className="text-[var(--muted-foreground)]">No submissions found.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        <AnimatePresence>
                            {displayedSubmissions.map((sub) => (
                                <motion.div key={sub.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-sm relative group">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                                        <div>
                                            <h3 className="font-bold text-lg">{sub.data.name}</h3>
                                            <a href={`mailto:${sub.data.email}`} className="text-sm text-blue-500">{sub.data.email}</a>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="text-xs bg-[var(--muted)] px-3 py-1 rounded-full text-[var(--muted-foreground)] font-medium">
                                                {new Date(sub.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-[var(--border)]">
                                        <p className="text-[var(--foreground)] whitespace-pre-wrap text-sm leading-relaxed">
                                            {sub.data.requirements || sub.data.message || "No message provided."}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </main>
        </div>
    );
}
