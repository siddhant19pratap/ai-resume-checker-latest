import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "~/components/Navbar";

interface Job {
  id: number;
  title: string;
  company: string;
  description: string;
  location?: string;
  jobType?: string;
  salary?: string;
  postedAt?: number;
}

interface ResumeCache {
  skills: string[];
  domain: string;
  uploadedAt: number;
}

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  linkedin: "",
  years: "",
};

function inputCls(err: boolean) {
  const base =
    "w-full bg-white/[0.04] rounded-xl px-4 py-2.5 text-sm text-white/85 outline-none transition-all duration-200 placeholder-white/20";
  const errStyle = err
    ? "border border-red-500/50 focus:border-red-500/60"
    : "border border-white/[0.07] focus:border-blue-500/40";
  return `${base} ${errStyle}`;
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-white/40 uppercase tracking-widest">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
    </div>
  );
}

function formatDate(ts?: number) {
  if (!ts) return null;
  const diff = Math.floor((Date.now() - ts) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff} days ago`;
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function computeMatch(job: Job, skills: string[]): number {
  if (!skills.length) return 0;
  const haystack = `${job.title} ${job.description}`.toLowerCase();
  const matched = skills.filter((s) => haystack.includes(s.toLowerCase())).length;
  return Math.round((matched / skills.length) * 100);
}

function matchColor(score: number) {
  if (score >= 65) return { text: "#4ade80", bg: "rgba(34,197,94,0.10)", border: "rgba(34,197,94,0.20)" };
  if (score >= 40) return { text: "#fbbf24", bg: "rgba(251,191,36,0.10)", border: "rgba(251,191,36,0.20)" };
  return { text: "rgba(255,255,255,0.35)", bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.09)" };
}

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [resumeCache, setResumeCache] = useState<ResumeCache | null>(null);

  // Drawer
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerView, setDrawerView] = useState<"detail" | "apply">("detail");

  // Apply form
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Partial<typeof emptyForm>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState("");
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/jobs/list")
      .then((r) => r.json())
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem("ambix_resume_cache");
    if (raw) {
      try { setResumeCache(JSON.parse(raw)); } catch {}
    }
  }, []);

  const filtered = jobs.filter(
    (j) =>
      !search ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase())
  );

  const openJob = (job: Job) => {
    setActiveJob(job);
    setDrawerView("detail");
    setSubmitted(false);
    setForm(emptyForm);
    setErrors({});
    setResumeFile(null);
    setResumeError("");
    document.body.style.overflow = "hidden";
    rafRef.current = requestAnimationFrame(() =>
      requestAnimationFrame(() => setDrawerVisible(true))
    );
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setTimeout(() => {
      setActiveJob(null);
      document.body.style.overflow = "";
    }, 300);
  };

  useEffect(
    () => () => {
      document.body.style.overflow = "";
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  const validate = () => {
    const e: Partial<typeof emptyForm> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email address";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    return e;
  };

  const handleApply = async () => {
    const e = validate();
    let hasErrors = Object.keys(e).length > 0;
    if (!resumeFile) {
      setResumeError("Please attach your resume");
      hasErrors = true;
    }
    if (hasErrors) {
      setErrors(e);
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("resume", resumeFile!);
      await fetch(`http://localhost:3001/api/jobs/${activeJob!.id}/apply`, {
        method: "POST",
        body: fd,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const goCheckMatch = (job: Job, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigate("/upload", {
      state: {
        jobDescription: job.description,
        jobTitle: job.title,
        company: job.company,
      },
    });
  };

  const setField = (k: keyof typeof emptyForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((prev) => ({ ...prev, [k]: "" }));
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      {/* Navbar */}
      <div className="sticky top-0 z-40 backdrop-blur-xl border-b" style={{ background: "rgba(5,8,22,0.85)", borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Navbar />
        </div>
      </div>

      {/* Page Header */}
      <section className="pt-12 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-2">
                Opportunities
              </p>
              <h1 className="text-3xl font-bold text-white tracking-tight">Browse Jobs</h1>
              {!loading && (
                <p className="text-sm text-white/35 mt-1.5">
                  {filtered.length} {filtered.length === 1 ? "position" : "positions"} available
                  {resumeCache && (
                    <span className="ml-2 text-green-400/70">· Resume loaded</span>
                  )}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {!resumeCache && (
                <button
                  onClick={() => navigate("/upload")}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.55)" }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9m-5-4v8m0 0l-3-3m3 3l3-3" />
                  </svg>
                  Upload Resume for Match Scores
                </button>
              )}
              <button
                onClick={() => navigate("/post-job")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold transition-all duration-200 shadow-lg shadow-blue-600/25"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Post a Job
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-lg">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by title or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl pl-10 pr-10 py-3 text-sm text-white/80 placeholder-white/20 outline-none transition-all duration-200 focus:border-blue-500/40"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Job Grid */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-6">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl p-6 animate-pulse" style={{ background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-start gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl shrink-0" style={{ background: "rgba(255,255,255,0.06)" }} />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 rounded-lg w-3/4" style={{ background: "rgba(255,255,255,0.06)" }} />
                      <div className="h-3 rounded-lg w-1/2" style={{ background: "rgba(255,255,255,0.06)" }} />
                    </div>
                  </div>
                  <div className="space-y-2 mb-5">
                    <div className="h-3 rounded-lg" style={{ background: "rgba(255,255,255,0.06)" }} />
                    <div className="h-3 rounded-lg w-5/6" style={{ background: "rgba(255,255,255,0.06)" }} />
                    <div className="h-3 rounded-lg w-4/6" style={{ background: "rgba(255,255,255,0.06)" }} />
                  </div>
                  <div className="h-8 rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }} />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="max-w-sm mx-auto text-center py-16">
              <div className="bg-[#0a0f1e] border border-white/[0.07] rounded-2xl p-10">
                <div className="w-14 h-14 mx-auto mb-5 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)" }}>
                  {search ? (
                    <svg className="w-7 h-7 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  ) : (
                    <svg className="w-7 h-7 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2h-3.586a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 0012.586 2H6a2 2 0 00-2 2v9m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4" />
                    </svg>
                  )}
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  {search ? "No results found" : "No jobs posted yet"}
                </h3>
                <p className="text-sm text-white/35 mb-6">
                  {search ? `No positions match "${search}"` : "Be the first to post an opportunity."}
                </p>
                {search ? (
                  <button onClick={() => setSearch("")} className="px-5 py-2.5 rounded-xl text-sm font-medium transition-colors" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)" }}>
                    Clear Search
                  </button>
                ) : (
                  <button onClick={() => navigate("/post-job")} className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-medium transition-colors shadow-lg shadow-blue-600/20">
                    Post a Job
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((job) => {
                const matchScore = resumeCache ? computeMatch(job, resumeCache.skills) : null;
                const mc = matchScore !== null ? matchColor(matchScore) : null;
                return (
                  <div
                    key={job.id}
                    onClick={() => openJob(job)}
                    className="group relative bg-[#0a0f1e]/80 border border-white/[0.07] rounded-2xl p-6 flex flex-col cursor-pointer hover:border-white/[0.12] hover:bg-[#0d1525] hover:shadow-2xl hover:shadow-black/50 transition-all duration-200"
                  >
                    {/* Card header */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                        <span className="text-blue-300 font-bold text-sm">{job.company[0].toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors duration-200 truncate leading-snug">
                          {job.title}
                        </h2>
                        <p className="text-xs text-white/35 mt-0.5 truncate">{job.company}</p>
                      </div>
                      <span className="shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        Hiring
                      </span>
                    </div>

                    {/* Tags */}
                    {(job.jobType || job.location) && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {job.jobType && (
                          <span className="px-2 py-0.5 rounded-md text-white/45 text-xs font-medium" style={{ background: "rgba(255,255,255,0.06)" }}>
                            {job.jobType}
                          </span>
                        )}
                        {job.location && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-white/45 text-xs font-medium" style={{ background: "rgba(255,255,255,0.06)" }}>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {job.location}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Description snippet */}
                    <p className="text-xs text-white/40 line-clamp-3 leading-relaxed flex-1">
                      {job.description}
                    </p>

                    {/* Footer */}
                    <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
                      <span className="text-xs text-white/25">
                        {job.postedAt ? formatDate(job.postedAt) : "View details →"}
                      </span>
                      {mc !== null ? (
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                          style={{ background: mc.bg, border: `1px solid ${mc.border}`, color: mc.text }}
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          {matchScore}% match
                        </span>
                      ) : (
                        <button
                          onClick={(e) => goCheckMatch(job, e)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/55 hover:text-white/80 transition-all duration-200"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                          Check Match
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Drawer ── */}
      {activeJob && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${drawerVisible ? "opacity-100" : "opacity-0"}`}
            onClick={closeDrawer}
          />

          {/* Panel */}
          <div
            className={`relative w-full max-w-[520px] flex flex-col bg-[#080d1a] border-l border-white/[0.07] shadow-2xl transition-transform duration-300 ease-out ${drawerVisible ? "translate-x-0" : "translate-x-full"}`}
          >
            {/* Drawer topbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07] shrink-0">
              <div className="flex items-center gap-2">
                {drawerView === "apply" && (
                  <button
                    onClick={() => { setDrawerView("detail"); setSubmitted(false); setErrors({}); }}
                    className="p-1.5 rounded-lg text-white/35 hover:text-white/70 transition-colors mr-1"
                    style={{ background: "transparent" }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                <span className="text-sm font-semibold text-white">
                  {drawerView === "apply" ? "Submit Application" : "Job Details"}
                </span>
              </div>
              <button
                onClick={closeDrawer}
                className="p-2 rounded-xl text-white/35 hover:text-white/70 transition-all duration-200"
                style={{ background: "transparent" }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto">
              {drawerView === "detail" ? (
                <div className="p-6 space-y-5">
                  {/* Hero */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600/25 to-indigo-600/10 border border-blue-500/25 flex items-center justify-center shrink-0">
                      <span className="text-blue-300 font-bold text-xl">{activeJob.company[0].toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h1 className="text-xl font-bold text-white leading-snug">{activeJob.title}</h1>
                      <p className="text-sm text-white/40 mt-1">{activeJob.company}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                          Actively Hiring
                        </span>
                        {activeJob.postedAt && (
                          <span className="text-xs text-white/25">Posted {formatDate(activeJob.postedAt)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Metadata cards */}
                  {(activeJob.location || activeJob.jobType || activeJob.salary) && (
                    <div className="grid grid-cols-2 gap-3">
                      {activeJob.location && (
                        <MetaCard
                          icon={<svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                          label="Location" value={activeJob.location}
                        />
                      )}
                      {activeJob.jobType && (
                        <MetaCard
                          icon={<svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                          label="Job Type" value={activeJob.jobType}
                        />
                      )}
                      {activeJob.salary && (
                        <MetaCard
                          icon={<svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                          label="Salary" value={activeJob.salary}
                        />
                      )}
                    </div>
                  )}

                  {/* Resume Match Section */}
                  {resumeCache && (() => {
                    const score = computeMatch(activeJob, resumeCache.skills);
                    const mc = matchColor(score);
                    const matchedSkills = resumeCache.skills.filter((s) =>
                      `${activeJob.title} ${activeJob.description}`.toLowerCase().includes(s.toLowerCase())
                    );
                    return (
                      <div className="rounded-xl p-4" style={{ background: mc.bg, border: `1px solid ${mc.border}` }}>
                        <div className="flex items-center justify-between mb-2.5">
                          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">Your Resume Match</p>
                          <span className="text-2xl font-bold tabular-nums" style={{ color: mc.text }}>{score}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full mb-3" style={{ background: "rgba(255,255,255,0.07)" }}>
                          <div
                            className="h-1.5 rounded-full transition-all duration-700"
                            style={{ width: `${score}%`, background: mc.text, opacity: 0.85 }}
                          />
                        </div>
                        {matchedSkills.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {matchedSkills.slice(0, 10).map((s) => (
                              <span key={s} className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                                style={{ background: mc.bg, border: `1px solid ${mc.border}`, color: mc.text }}>
                                {s}
                              </span>
                            ))}
                            {matchedSkills.length > 10 && (
                              <span className="px-2 py-0.5 text-xs text-white/30">+{matchedSkills.length - 10} more</span>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-white/30">No overlapping skills detected in this job description.</p>
                        )}
                      </div>
                    );
                  })()}

                  <div className="border-t border-white/[0.06]" />

                  {/* Full description */}
                  <div>
                    <h2 className="text-sm font-semibold text-white mb-3">About this Role</h2>
                    <div className="text-sm text-white/65 leading-7 whitespace-pre-line">
                      {activeJob.description}
                    </div>
                  </div>
                </div>
              ) : submitted ? (
                /* ── Success State ── */
                <div className="flex flex-col items-center justify-center min-h-[420px] p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-5">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Application Sent!</h2>
                  <p className="text-sm text-white/55 leading-relaxed">
                    Your application for{" "}
                    <span className="text-white font-medium">{activeJob.title}</span> at{" "}
                    <span className="text-white font-medium">{activeJob.company}</span> has been received.
                  </p>
                  <p className="text-xs text-white/25 mt-3 mb-8">
                    The hiring team will reach out if your profile is a match.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setDrawerView("detail"); setSubmitted(false); }}
                      className="px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)" }}
                    >
                      View Job
                    </button>
                    <button
                      onClick={closeDrawer}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-medium transition-colors"
                    >
                      Browse More Jobs
                    </button>
                  </div>
                </div>
              ) : (
                /* ── Apply Form ── */
                <div className="p-6 space-y-5">
                  {/* Job mini-card */}
                  <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                      <span className="text-blue-300 font-bold text-sm">{activeJob.company[0].toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{activeJob.title}</p>
                      <p className="text-xs text-white/40 truncate">{activeJob.company}</p>
                    </div>
                  </div>

                  <Field label="Full Name" required error={errors.name}>
                    <input type="text" placeholder="Jane Doe" value={form.name} onChange={setField("name")} className={inputCls(!!errors.name)} />
                  </Field>
                  <Field label="Email Address" required error={errors.email}>
                    <input type="email" placeholder="jane@example.com" value={form.email} onChange={setField("email")} className={inputCls(!!errors.email)} />
                  </Field>
                  <Field label="Phone Number" required error={errors.phone}>
                    <input type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={setField("phone")} className={inputCls(!!errors.phone)} />
                  </Field>
                  <Field label="LinkedIn Profile (optional)">
                    <input type="url" placeholder="https://linkedin.com/in/yourprofile" value={form.linkedin} onChange={setField("linkedin")} className={inputCls(false)} />
                  </Field>
                  <Field label="Years of Experience (optional)">
                    <select value={form.years} onChange={setField("years")} className={inputCls(false) + " appearance-none cursor-pointer"}>
                      <option value="">Select experience level</option>
                      <option value="0-1">0–1 years · Entry level</option>
                      <option value="1-3">1–3 years · Junior</option>
                      <option value="3-5">3–5 years · Mid level</option>
                      <option value="5-8">5–8 years · Senior</option>
                      <option value="8+">8+ years · Lead / Principal</option>
                    </select>
                  </Field>

                  <Field label="Resume" required error={resumeError}>
                    <div
                      onClick={() => resumeInputRef.current?.click()}
                      className={[
                        "relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 cursor-pointer transition-all duration-200",
                        resumeError
                          ? "border-red-500/50 bg-red-500/5 hover:border-red-500/70"
                          : resumeFile
                          ? "border-blue-500/40 bg-blue-500/5 hover:border-blue-500/60"
                          : "border-white/[0.1] hover:border-white/[0.18]",
                      ].join(" ")}
                    >
                      {resumeFile ? (
                        <>
                          <div className="w-9 h-9 rounded-xl bg-blue-600/15 border border-blue-500/25 flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <p className="text-sm font-medium text-blue-300 text-center max-w-[220px] truncate">{resumeFile.name}</p>
                          <p className="text-xs text-white/30">{(resumeFile.size / 1024).toFixed(0)} KB · Click to change</p>
                        </>
                      ) : (
                        <>
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                            <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9m-5-4v8m0 0l-3-3m3 3l3-3" />
                            </svg>
                          </div>
                          <p className="text-sm font-medium text-white/60">Click to upload resume</p>
                          <p className="text-xs text-white/25">PDF, DOC, or DOCX · Max 5 MB</p>
                        </>
                      )}
                      <input
                        ref={resumeInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null;
                          setResumeFile(file);
                          if (file) setResumeError("");
                        }}
                      />
                    </div>
                  </Field>
                  <div className="h-4" />
                </div>
              )}
            </div>

            {/* ── Sticky Footer ── */}
            {drawerView === "detail" ? (
              <div className="shrink-0 px-6 py-4 border-t border-white/[0.07]" style={{ background: "#080d1a" }}>
                <div className="flex gap-3">
                  {resumeCache ? (
                    <button
                      onClick={() =>
                        navigate("/cover-letter", {
                          state: {
                            jobDescription: activeJob.description,
                            jobTitle: activeJob.title,
                            company: activeJob.company,
                          },
                        })
                      }
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                      style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.22)", color: "rgba(196,181,253,0.85)" }}
                    >
                      Generate Cover Letter
                    </button>
                  ) : (
                    <button
                      onClick={() => goCheckMatch(activeJob)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white/90 transition-all duration-200"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      Check Resume Match
                    </button>
                  )}
                  <button
                    onClick={() => setDrawerView("apply")}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold transition-all duration-200 shadow-lg shadow-blue-600/25"
                  >
                    Apply Now →
                  </button>
                </div>
              </div>
            ) : !submitted ? (
              <div className="shrink-0 px-6 py-4 border-t border-white/[0.07]" style={{ background: "#080d1a" }}>
                <button
                  onClick={handleApply}
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold transition-all duration-200 shadow-lg shadow-blue-600/25"
                >
                  {submitting ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Application"
                  )}
                </button>
                <p className="text-xs text-white/25 text-center mt-2">
                  Your details will be shared with the hiring team.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </main>
  );
}

function MetaCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl p-3.5"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] text-white/30 uppercase tracking-wide font-semibold">{label}</p>
        <p className="text-xs text-white/80 font-medium mt-0.5 truncate">{value}</p>
      </div>
    </div>
  );
}
