import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import Navbar from "~/components/Navbar";
import ScoreCircle from "~/components/Scorecircle";

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = "frontend" | "backend" | "fullstack" | "dataEngineering" | "dataAnalyst" | "uiux";
type Level = "entry" | "mid" | "senior";
type InterviewType = "technical" | "behavioral" | "mixed";
type Step = "setup" | "interview" | "analyzing" | "results";

interface Question {
  text: string;
  category: "technical" | "behavioral";
}

interface QuestionFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  modelAnswer: string;
}

interface Results {
  overallScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  questionFeedback: QuestionFeedback[];
}

// ─── Config ───────────────────────────────────────────────────────────────────

const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY as string;

const roleConfig: Record<Role, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  frontend: {
    label: "Frontend Developer",
    color: "#60a5fa",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.2)",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  backend: {
    label: "Backend Developer",
    color: "#a78bfa",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.2)",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    ),
  },
  fullstack: {
    label: "Full Stack Developer",
    color: "#34d399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.2)",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
      </svg>
    ),
  },
  dataEngineering: {
    label: "Data Engineer",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.2)",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18" />
      </svg>
    ),
  },
  dataAnalyst: {
    label: "Data Analyst",
    color: "#f87171",
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.2)",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  uiux: {
    label: "UI/UX Designer",
    color: "#e879f9",
    bg: "rgba(232,121,249,0.08)",
    border: "rgba(232,121,249,0.2)",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
};

// ─── Question Bank ────────────────────────────────────────────────────────────

const qBank: Record<Role, Record<string, Question[]>> = {
  frontend: {
    technical: [
      { text: "Explain the difference between React's useState and useReducer hooks. When would you choose one over the other?", category: "technical" },
      { text: "How does the browser's event loop work? What is the difference between microtasks and macrotasks?", category: "technical" },
      { text: "What is the virtual DOM and how does React's reconciliation algorithm (diffing) work?", category: "technical" },
      { text: "Explain CSS specificity and the cascade. How do you avoid specificity conflicts in large projects?", category: "technical" },
      { text: "Describe code splitting and lazy loading. How would you implement them in a React app?", category: "technical" },
      { text: "What are Web Workers? When would you use them to improve performance?", category: "technical" },
      { text: "Explain the differences between SSR, SSG, and CSR. When would you choose each approach?", category: "technical" },
      { text: "How would you diagnose and optimize a React application that is experiencing performance issues?", category: "technical" },
      { text: "What are React Server Components and how do they differ from traditional client components?", category: "technical" },
      { text: "Explain how you would implement debounce and throttle from scratch without libraries.", category: "technical" },
    ],
    behavioral: [
      { text: "Tell me about a time you had to refactor a large codebase. What was your strategy?", category: "behavioral" },
      { text: "Describe a situation where you had to deliver a complex UI feature under a tight deadline.", category: "behavioral" },
      { text: "How do you keep up with the rapidly changing frontend ecosystem?", category: "behavioral" },
      { text: "Tell me about a time you disagreed with a design or technical decision. How did you handle it?", category: "behavioral" },
      { text: "Describe the most complex UI component you've built. What challenges did you overcome?", category: "behavioral" },
    ],
  },
  backend: {
    technical: [
      { text: "Explain the CAP theorem and how it guides architectural decisions in distributed systems.", category: "technical" },
      { text: "What are database indexes, how do they work internally, and what are the trade-offs?", category: "technical" },
      { text: "Describe the key differences between REST, GraphQL, and gRPC. When would you use each?", category: "technical" },
      { text: "How would you design a robust rate limiting system for a public API?", category: "technical" },
      { text: "Explain event-driven architecture and message queues. How do Kafka and RabbitMQ differ?", category: "technical" },
      { text: "What is the N+1 query problem and what strategies exist to solve it?", category: "technical" },
      { text: "How would you implement database sharding? What challenges does it introduce?", category: "technical" },
      { text: "Walk through the JWT authentication flow and discuss its security considerations.", category: "technical" },
      { text: "What are the main architectural challenges of microservices compared to a monolith?", category: "technical" },
      { text: "How would you design a multi-layer caching strategy for a high-traffic API?", category: "technical" },
    ],
    behavioral: [
      { text: "Tell me about a production outage you experienced. How did you diagnose and resolve it?", category: "behavioral" },
      { text: "Describe a time you significantly improved the performance of a slow backend service.", category: "behavioral" },
      { text: "How do you approach API versioning when introducing breaking changes?", category: "behavioral" },
      { text: "Tell me about a time you had to balance scalability against simplicity.", category: "behavioral" },
      { text: "How do you approach writing documentation for complex backend systems?", category: "behavioral" },
    ],
  },
  fullstack: {
    technical: [
      { text: "How do you design authentication and authorization in a full-stack application?", category: "technical" },
      { text: "Explain the trade-offs between server-side rendering and client-side rendering for SEO and performance.", category: "technical" },
      { text: "How would you architect a real-time collaborative editing feature end-to-end?", category: "technical" },
      { text: "What is CORS, why does it exist, and how do you configure it correctly?", category: "technical" },
      { text: "How do you manage state synchronization between the frontend and backend efficiently?", category: "technical" },
      { text: "Describe how you would implement file uploads with progress tracking across the full stack.", category: "technical" },
      { text: "How would you build a search feature with full-text search, filters, and pagination?", category: "technical" },
      { text: "Explain CI/CD pipelines and how you would set one up for a full-stack application.", category: "technical" },
      { text: "How do you handle database migrations in production without causing downtime?", category: "technical" },
      { text: "Describe your strategy for error handling, logging, and observability across the full stack.", category: "technical" },
    ],
    behavioral: [
      { text: "Tell me about a full-stack feature you built end-to-end that you're proud of.", category: "behavioral" },
      { text: "How do you manage technical debt while moving fast on a product?", category: "behavioral" },
      { text: "Describe a time you had to bridge a gap between frontend and backend requirements.", category: "behavioral" },
      { text: "How do you decide between using an existing library and building something yourself?", category: "behavioral" },
      { text: "Tell me about a time you discovered and fixed a critical security vulnerability.", category: "behavioral" },
    ],
  },
  dataEngineering: {
    technical: [
      { text: "Explain batch vs. stream processing. When would you choose one over the other?", category: "technical" },
      { text: "How does Spark's lazy evaluation work and how does the Catalyst optimizer improve performance?", category: "technical" },
      { text: "How would you design a data pipeline to ingest and process 1TB of daily log data?", category: "technical" },
      { text: "Explain the medallion architecture (Bronze, Silver, Gold layers) and its benefits.", category: "technical" },
      { text: "What is data lineage, why does it matter, and how do you implement it?", category: "technical" },
      { text: "How do you handle schema evolution in a production data pipeline without breaking downstream consumers?", category: "technical" },
      { text: "Explain partitioning strategies in Spark and how they affect job performance.", category: "technical" },
      { text: "What are the key architectural differences between OLTP and OLAP systems?", category: "technical" },
      { text: "How would you design idempotent data pipelines to safely handle reruns and failures?", category: "technical" },
      { text: "What are slowly changing dimensions (SCDs)? Describe Type 1, 2, and 3 with trade-offs.", category: "technical" },
    ],
    behavioral: [
      { text: "Tell me about a significant data quality issue you discovered and how you resolved it.", category: "behavioral" },
      { text: "Describe a time you optimized a slow data pipeline. What was your approach?", category: "behavioral" },
      { text: "How do you collaborate effectively with data scientists and business analysts?", category: "behavioral" },
      { text: "Tell me about a large dataset migration you led. How did you minimize downtime?", category: "behavioral" },
      { text: "How do you approach monitoring, alerting, and SLA management for data pipelines?", category: "behavioral" },
    ],
  },
  dataAnalyst: {
    technical: [
      { text: "Explain INNER JOIN, LEFT JOIN, and FULL OUTER JOIN with practical examples.", category: "technical" },
      { text: "How would you detect, investigate, and handle outliers in a dataset?", category: "technical" },
      { text: "How would you design an A/B test for a new product feature? Walk through the process.", category: "technical" },
      { text: "Explain cohort analysis — what is it and when is it the right tool to use?", category: "technical" },
      { text: "How do you determine statistical significance in an experiment? What p-value threshold would you use and why?", category: "technical" },
      { text: "Explain SQL window functions and give examples of when you'd use RANK, LAG, and SUM OVER.", category: "technical" },
      { text: "Walk me through how you would build a customer churn prediction model from scratch.", category: "technical" },
      { text: "Explain the four types of analytics: descriptive, diagnostic, predictive, and prescriptive.", category: "technical" },
      { text: "What principles guide you when designing dashboards for executive stakeholders?", category: "technical" },
      { text: "What is Customer Lifetime Value (CLV) and how would you calculate and segment it?", category: "technical" },
    ],
    behavioral: [
      { text: "Tell me about an insight from your analysis that directly influenced a key business decision.", category: "behavioral" },
      { text: "How do you communicate complex data findings to non-technical stakeholders?", category: "behavioral" },
      { text: "Describe the messiest dataset you've worked with and how you cleaned it.", category: "behavioral" },
      { text: "Tell me about a time your initial analysis assumptions proved to be wrong.", category: "behavioral" },
      { text: "How do you prioritize competing data requests from multiple stakeholders?", category: "behavioral" },
    ],
  },
  uiux: {
    technical: [
      { text: "What's the difference between UX and UI design? How do they complement each other in practice?", category: "technical" },
      { text: "Walk me through how you would conduct user research for a brand new product feature.", category: "technical" },
      { text: "What are the WCAG accessibility guidelines and which levels do you design for?", category: "technical" },
      { text: "How do you design for mobile, tablet, and desktop simultaneously? What is your approach to responsive design?", category: "technical" },
      { text: "Explain information architecture. How does it affect navigation and findability?", category: "technical" },
      { text: "What is a design system? What are its core components and how does it scale across a product?", category: "technical" },
      { text: "How do you define and measure the success of a UX design after launch?", category: "technical" },
      { text: "Explain the double diamond design process and when you'd apply it.", category: "technical" },
      { text: "What are micro-interactions? Give examples and explain why they matter for perceived quality.", category: "technical" },
      { text: "How do you handle conflicting design feedback from different stakeholders?", category: "technical" },
    ],
    behavioral: [
      { text: "Walk me through your design process for a recent project that had significant constraints.", category: "behavioral" },
      { text: "Tell me about a time you had to advocate strongly for the user against business or technical pressure.", category: "behavioral" },
      { text: "How do you handle design critique? How do you decide what feedback to act on?", category: "behavioral" },
      { text: "Describe a time when user testing completely changed your design direction.", category: "behavioral" },
      { text: "How do you collaborate with developers to ensure your designs are implemented faithfully?", category: "behavioral" },
    ],
  },
};

function pickQuestions(role: Role, type: InterviewType, count: 5 | 10): Question[] {
  const bank = qBank[role];
  let pool: Question[];
  if (type === "technical") {
    pool = [...bank.technical];
  } else if (type === "behavioral") {
    const needed = Math.min(count, bank.behavioral.length);
    pool = [...bank.behavioral.slice(0, needed), ...bank.technical.slice(0, count - needed)];
  } else {
    const tCount = Math.ceil(count * 0.6);
    pool = [...bank.technical.slice(0, tCount), ...bank.behavioral.slice(0, count - tCount)];
  }
  return [...pool].sort(() => Math.random() - 0.5).slice(0, count);
}

async function callGemini(
  role: Role,
  level: Level,
  type: InterviewType,
  questions: Question[],
  answers: string[]
): Promise<Results | null> {
  const roleLabel = roleConfig[role].label;
  const lvlLabel = level === "entry" ? "Entry Level" : level === "mid" ? "Mid Level" : "Senior";
  const qa = questions
    .map((q, i) => `Q${i + 1}: ${q.text}\nA${i + 1}: ${answers[i]?.trim() || "(No answer provided)"}`)
    .join("\n\n");

  const prompt = `You are a senior hiring manager and technical interviewer evaluating a ${lvlLabel} ${roleLabel} candidate.

Interview type: ${type}
Number of questions: ${questions.length}

Interview transcript:
${qa}

Evaluate each answer. Respond ONLY with a valid JSON object — no markdown, no preamble:
{
  "overallScore": <integer 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength>", "<strength>", "<strength>"],
  "weaknesses": ["<area to improve>", "<area to improve>"],
  "questionFeedback": [
    {
      "score": <integer 0-10>,
      "strengths": ["<specific positive point>"],
      "improvements": ["<specific improvement>"],
      "modelAnswer": "<1-2 sentence model answer hint>"
    }
  ]
}

The questionFeedback array must contain exactly ${questions.length} items in order.
Calibrate scoring to ${lvlLabel} expectations. Be specific and constructive.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 3000 },
        }),
      }
    );
    const data = await res.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const clean = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    return JSON.parse(clean) as Results;
  } catch {
    return null;
  }
}

const ANALYZE_STEPS = [
  "Reading your responses…",
  "Evaluating technical depth…",
  "Generating personalized feedback…",
  "Finalizing your report…",
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AIInterview() {
  const navigate = useNavigate();

  // Setup state
  const [step, setStep] = useState<Step>("setup");
  const [role, setRole] = useState<Role | null>(null);
  const [level, setLevel] = useState<Level>("mid");
  const [interviewType, setInterviewType] = useState<InterviewType>("mixed");
  const [questionCount, setQuestionCount] = useState<5 | 10>(5);

  // Interview state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Analyzing state
  const [analyzeStep, setAnalyzeStep] = useState(0);

  // Results state
  const [results, setResults] = useState<Results | null>(null);
  const [expandedQ, setExpandedQ] = useState<number | null>(0);

  // ── Start interview ──────────────────────────────────────────────────────────
  const startInterview = () => {
    if (!role) return;
    const qs = pickQuestions(role, interviewType, questionCount);
    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(""));
    setCurrentQ(0);
    setStep("interview");
  };

  // ── Answer helpers ───────────────────────────────────────────────────────────
  const setAnswer = (val: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQ] = val;
      return next;
    });
  };

  const goNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
    }
  };

  const goPrev = () => {
    if (currentQ > 0) setCurrentQ((q) => q - 1);
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const submitInterview = async () => {
    setStep("analyzing");
    setAnalyzeStep(0);

    // advance fake analysis steps
    const timers: ReturnType<typeof setTimeout>[] = [];
    ANALYZE_STEPS.forEach((_, i) => {
      if (i > 0) timers.push(setTimeout(() => setAnalyzeStep(i), i * 1200));
    });

    const res = await callGemini(role!, level, interviewType, questions, answers);
    timers.forEach(clearTimeout);

    if (res) {
      setResults(res);
    } else {
      // fallback mock result so the page always works
      setResults({
        overallScore: 65,
        summary:
          "Unable to connect to AI service. Here is a placeholder result. Please check your connection and try again.",
        strengths: ["Attempted all questions", "Showed willingness to engage"],
        weaknesses: ["Could not evaluate in detail due to network error"],
        questionFeedback: questions.map(() => ({
          score: 6,
          strengths: ["Response recorded"],
          improvements: ["AI analysis unavailable — review your answer manually"],
          modelAnswer: "Model answer unavailable.",
        })),
      });
    }
    setExpandedQ(0);
    setStep("results");
  };

  // ── Textarea auto-focus on question change ───────────────────────────────────
  useEffect(() => {
    if (step === "interview") textareaRef.current?.focus();
  }, [currentQ, step]);

  // ── Keyboard shortcut: Ctrl+Enter = next ─────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (step !== "interview") return;
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (currentQ < questions.length - 1) goNext();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const progress = questions.length ? Math.round(((currentQ + 1) / questions.length) * 100) : 0;
  const answeredCount = answers.filter((a) => a.trim().length > 0).length;

  const gradeInfo = results
    ? results.overallScore >= 80
      ? { label: "Excellent", color: "#4ade80", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.2)" }
      : results.overallScore >= 60
      ? { label: "Good", color: "#fbbf24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.2)" }
      : { label: "Needs Work", color: "#f87171", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)" }
    : null;

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      {/* Navbar */}
      <div
        className="sticky top-0 z-40 backdrop-blur-xl border-b"
        style={{ background: "rgba(5,8,22,0.85)", borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Navbar />
        </div>
      </div>

      {/* Atmospheric blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[500px] h-[400px] bg-violet-600/6 rounded-full blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[100px]" />
      </div>

      {/* ══════════════════ SETUP ══════════════════ */}
      {step === "setup" && (
        <div className="max-w-3xl mx-auto px-6 py-14">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <p className="eyebrow mb-3">AI Interview</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3" style={{ letterSpacing: "-0.03em" }}>
              Practice Makes Perfect
            </h1>
            <p className="text-sm text-white/40 mb-5 leading-relaxed">
              Simulate a real interview with AI-powered feedback. Answer questions, then get detailed coaching.
            </p>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.18)", color: "#fbbf24" }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Frontend demo — AI feedback powered by Gemini
            </div>
          </div>

          <div className="space-y-8">
            {/* Role Selection */}
            <div className="animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
                Select Role <span className="text-red-400">*</span>
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(Object.keys(roleConfig) as Role[]).map((r) => {
                  const cfg = roleConfig[r];
                  const selected = role === r;
                  return (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className="relative flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-150"
                      style={{
                        background: selected ? cfg.bg : "rgba(255,255,255,0.03)",
                        border: `1px solid ${selected ? cfg.border : "rgba(255,255,255,0.07)"}`,
                        boxShadow: selected ? `0 0 0 1px ${cfg.border}` : "none",
                      }}
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          background: selected ? cfg.bg : "rgba(255,255,255,0.05)",
                          border: `1px solid ${selected ? cfg.border : "rgba(255,255,255,0.08)"}`,
                          color: selected ? cfg.color : "rgba(255,255,255,0.4)",
                        }}
                      >
                        {cfg.icon}
                      </div>
                      <span
                        className="text-xs font-semibold leading-tight"
                        style={{ color: selected ? cfg.color : "rgba(255,255,255,0.6)" }}
                      >
                        {cfg.label}
                      </span>
                      {selected && (
                        <div
                          className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ background: cfg.color }}
                        >
                          <svg className="w-2.5 h-2.5 text-[#050816]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Level + Type row */}
            <div className="grid sm:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              {/* Experience Level */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Experience Level</p>
                <div className="flex gap-2">
                  {(["entry", "mid", "senior"] as Level[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLevel(l)}
                      className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 capitalize"
                      style={{
                        background: level === l ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${level === l ? "rgba(59,130,246,0.35)" : "rgba(255,255,255,0.07)"}`,
                        color: level === l ? "#60a5fa" : "rgba(255,255,255,0.45)",
                      }}
                    >
                      {l === "entry" ? "Entry" : l === "mid" ? "Mid" : "Senior"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Count */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Questions</p>
                <div className="flex gap-2">
                  {([5, 10] as const).map((n) => (
                    <button
                      key={n}
                      onClick={() => setQuestionCount(n)}
                      className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150"
                      style={{
                        background: questionCount === n ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${questionCount === n ? "rgba(59,130,246,0.35)" : "rgba(255,255,255,0.07)"}`,
                        color: questionCount === n ? "#60a5fa" : "rgba(255,255,255,0.45)",
                      }}
                    >
                      {n} Questions
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interview Type */}
            <div className="animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Interview Type</p>
              <div className="grid grid-cols-3 gap-3">
                {(
                  [
                    {
                      type: "technical" as InterviewType,
                      label: "Technical",
                      desc: "Deep-dive into your technical knowledge and problem-solving",
                      color: "#60a5fa",
                      bg: "rgba(59,130,246,0.08)",
                      border: "rgba(59,130,246,0.2)",
                    },
                    {
                      type: "behavioral" as InterviewType,
                      label: "Behavioral",
                      desc: "Situational and experience-based questions using STAR format",
                      color: "#34d399",
                      bg: "rgba(52,211,153,0.08)",
                      border: "rgba(52,211,153,0.2)",
                    },
                    {
                      type: "mixed" as InterviewType,
                      label: "Mixed",
                      desc: "Balanced mix of technical depth and behavioral scenarios",
                      color: "#a78bfa",
                      bg: "rgba(139,92,246,0.08)",
                      border: "rgba(139,92,246,0.2)",
                    },
                  ] as const
                ).map(({ type, label, desc, color, bg, border }) => {
                  const selected = interviewType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setInterviewType(type)}
                      className="p-4 rounded-xl text-left transition-all duration-150 relative"
                      style={{
                        background: selected ? bg : "rgba(255,255,255,0.03)",
                        border: `1px solid ${selected ? border : "rgba(255,255,255,0.07)"}`,
                      }}
                    >
                      {selected && (
                        <div
                          className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ background: color }}
                        >
                          <svg className="w-2.5 h-2.5 text-[#050816]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      <p className="text-sm font-semibold mb-1.5" style={{ color: selected ? color : "rgba(255,255,255,0.7)" }}>
                        {label}
                      </p>
                      <p className="text-[11px] leading-relaxed text-white/30">{desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <button
                onClick={startInterview}
                disabled={!role}
                className="w-full py-4 rounded-2xl text-sm font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed"
                style={{
                  background: role ? "linear-gradient(135deg, #3b82f6, #6366f1)" : "rgba(255,255,255,0.05)",
                  color: role ? "white" : "rgba(255,255,255,0.2)",
                  border: role ? "none" : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: role ? "0 4px 24px rgba(59,130,246,0.35)" : "none",
                }}
              >
                {role ? `Start ${roleConfig[role].label} Interview →` : "Select a role to begin"}
              </button>
              {!role && (
                <p className="text-center text-xs text-white/25 mt-2">Choose a role from the grid above</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ INTERVIEW ══════════════════ */}
      {step === "interview" && (
        <div className="max-w-2xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 animate-fade-in-up">
            <div className="flex items-center gap-3">
              {role && (
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    background: roleConfig[role].bg,
                    border: `1px solid ${roleConfig[role].border}`,
                    color: roleConfig[role].color,
                  }}
                >
                  {roleConfig[role].icon}
                  {roleConfig[role].label}
                </div>
              )}
              <span
                className="text-xs px-2 py-1 rounded-full font-medium capitalize"
                style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {interviewType}
              </span>
            </div>
            <button
              onClick={() => {
                if (confirm("End interview and discard answers?")) setStep("setup");
              }}
              className="text-xs text-white/25 hover:text-white/50 transition-colors"
            >
              Quit
            </button>
          </div>

          {/* Progress */}
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/40 font-medium">
                Question {currentQ + 1} of {questions.length}
              </span>
              <span className="text-xs font-bold text-white/50">{progress}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                  boxShadow: "0 0 8px rgba(59,130,246,0.5)",
                }}
              />
            </div>
          </div>

          {/* Question card */}
          <div
            className="rounded-2xl p-7 mb-5 animate-fade-in-up"
            style={{
              background: "#0a0f1e",
              border: "1px solid rgba(255,255,255,0.065)",
              animationDelay: "0.08s",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.25)" }}
              >
                {currentQ + 1}
              </span>
              <span
                className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{
                  background:
                    questions[currentQ]?.category === "technical"
                      ? "rgba(59,130,246,0.1)"
                      : "rgba(52,211,153,0.1)",
                  color:
                    questions[currentQ]?.category === "technical"
                      ? "#60a5fa"
                      : "#34d399",
                  border:
                    questions[currentQ]?.category === "technical"
                      ? "1px solid rgba(59,130,246,0.2)"
                      : "1px solid rgba(52,211,153,0.2)",
                }}
              >
                {questions[currentQ]?.category}
              </span>
            </div>
            <p className="text-base font-semibold text-white leading-relaxed">
              {questions[currentQ]?.text}
            </p>
          </div>

          {/* Answer area */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.12s" }}>
            <textarea
              ref={textareaRef}
              rows={7}
              value={answers[currentQ] ?? ""}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here… Be as detailed and specific as you can. Press Ctrl+Enter to move to the next question."
              className="w-full rounded-2xl px-5 py-4 text-sm leading-relaxed resize-none outline-none transition-all duration-200 placeholder-white/20"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.85)",
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.35)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 3px rgba(59,130,246,0.07)";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            />
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[11px] text-white/20">
                {answers[currentQ]?.length ?? 0} characters · Ctrl+Enter to advance
              </span>
              <span className="text-[11px] text-white/20">
                {answeredCount}/{questions.length} answered
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3 mt-6 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            <button
              onClick={goPrev}
              disabled={currentQ === 0}
              className="px-5 py-3 rounded-xl text-sm font-medium transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}
            >
              ← Previous
            </button>

            {currentQ < questions.length - 1 ? (
              <button
                onClick={goNext}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-150"
                style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", boxShadow: "0 4px 16px rgba(59,130,246,0.25)" }}
              >
                Next Question →
              </button>
            ) : (
              <button
                onClick={submitInterview}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-150"
                style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", boxShadow: "0 4px 16px rgba(34,197,94,0.25)" }}
              >
                Submit for AI Feedback →
              </button>
            )}
          </div>

          {/* Jump to unanswered hint */}
          {answeredCount < questions.length && currentQ === questions.length - 1 && (
            <p className="text-center text-xs text-amber-400/60 mt-3">
              {questions.length - answeredCount} question{questions.length - answeredCount > 1 ? "s" : ""} unanswered — you can still submit and get partial feedback
            </p>
          )}
        </div>
      )}

      {/* ══════════════════ ANALYZING ══════════════════ */}
      {step === "analyzing" && (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 animate-fade-in">
          <div className="text-center max-w-sm">
            {/* Spinner */}
            <div className="relative w-20 h-20 mx-auto mb-8">
              <div
                className="absolute inset-0 rounded-full border-2 animate-spin"
                style={{ borderColor: "rgba(99,102,241,0.15)", borderTopColor: "#6366f1" }}
              />
              <div
                className="absolute inset-2 rounded-full border-2 animate-spin"
                style={{ borderColor: "rgba(59,130,246,0.1)", borderBottomColor: "#3b82f6", animationDirection: "reverse", animationDuration: "1.5s" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>

            <h2 className="text-xl font-bold text-white mb-2">Analyzing your responses</h2>
            <p className="text-sm text-white/35 mb-8">
              Gemini AI is reviewing your {questions.length} answers…
            </p>

            {/* Step indicators */}
            <div className="space-y-3 text-left">
              {ANALYZE_STEPS.map((label, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                    style={{
                      background:
                        i < analyzeStep
                          ? "rgba(34,197,94,0.2)"
                          : i === analyzeStep
                          ? "rgba(59,130,246,0.2)"
                          : "rgba(255,255,255,0.05)",
                      border:
                        i < analyzeStep
                          ? "1px solid rgba(34,197,94,0.3)"
                          : i === analyzeStep
                          ? "1px solid rgba(59,130,246,0.3)"
                          : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {i < analyzeStep ? (
                      <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : i === analyzeStep ? (
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white/20" />
                    )}
                  </div>
                  <span
                    className="text-sm transition-colors duration-300"
                    style={{
                      color:
                        i < analyzeStep
                          ? "rgba(255,255,255,0.5)"
                          : i === analyzeStep
                          ? "rgba(255,255,255,0.85)"
                          : "rgba(255,255,255,0.25)",
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ RESULTS ══════════════════ */}
      {step === "results" && results && (
        <div className="max-w-3xl mx-auto px-6 py-12 pb-24">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 animate-fade-in-up">
            <div>
              <p className="eyebrow mb-2">Interview Results</p>
              <h1 className="text-3xl font-bold text-white tracking-tight" style={{ letterSpacing: "-0.03em" }}>
                Your Performance
              </h1>
              {role && (
                <p className="text-sm text-white/35 mt-1">
                  {roleConfig[role].label} · {level === "entry" ? "Entry" : level === "mid" ? "Mid" : "Senior"} Level · {interviewType}
                </p>
              )}
            </div>
            {gradeInfo && (
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold self-start sm:self-auto"
                style={{ background: gradeInfo.bg, border: `1px solid ${gradeInfo.border}`, color: gradeInfo.color }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: gradeInfo.color }} />
                {gradeInfo.label}
              </div>
            )}
          </div>

          {/* Score + Summary row */}
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            {/* Score circle */}
            <div
              className="rounded-2xl p-6 flex flex-col items-center justify-center text-center animate-fade-in-up"
              style={{ background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.065)", animationDelay: "0.05s" }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-white/35 mb-4">Overall Score</p>
              <ScoreCircle score={results.overallScore} size={100} />
              <p className="text-xs text-white/30 mt-3">{results.overallScore}/100</p>
            </div>

            {/* Summary */}
            <div
              className="sm:col-span-2 rounded-2xl p-6 animate-fade-in-up"
              style={{ background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.065)", animationDelay: "0.1s" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center"
                  style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)" }}
                >
                  <svg className="w-3.5 h-3.5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/35">AI Summary</p>
              </div>
              <p className="text-sm text-white/70 leading-relaxed mb-5">{results.summary}</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-green-400/60 mb-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    Strengths
                  </p>
                  <ul className="space-y-1">
                    {results.strengths.map((s, i) => (
                      <li key={i} className="text-xs text-white/55 leading-relaxed">· {s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-400/60 mb-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Areas to Improve
                  </p>
                  <ul className="space-y-1">
                    {results.weaknesses.map((w, i) => (
                      <li key={i} className="text-xs text-white/55 leading-relaxed">· {w}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Per-question breakdown */}
          <div
            className="rounded-2xl overflow-hidden animate-fade-in-up"
            style={{ background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.065)", animationDelay: "0.15s" }}
          >
            <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/35">Question Breakdown</p>
            </div>

            {questions.map((q, i) => {
              const fb = results.questionFeedback[i];
              const isOpen = expandedQ === i;
              const scoreColor =
                !fb ? "#60a5fa" :
                fb.score >= 8 ? "#4ade80" : fb.score >= 5 ? "#fbbf24" : "#f87171";

              return (
                <div key={i} style={{ borderBottom: i < questions.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <button
                    className="w-full px-6 py-4 flex items-center gap-4 text-left transition-colors hover:bg-white/[0.02]"
                    onClick={() => setExpandedQ(isOpen ? null : i)}
                  >
                    {/* Score badge */}
                    <div
                      className="w-9 h-9 rounded-xl shrink-0 flex flex-col items-center justify-center"
                      style={{
                        background: fb ? `rgba(${fb.score >= 8 ? "34,197,94" : fb.score >= 5 ? "251,191,36" : "239,68,68"},0.1)` : "rgba(255,255,255,0.05)",
                        border: `1px solid ${scoreColor}30`,
                      }}
                    >
                      <span className="text-xs font-bold leading-none" style={{ color: scoreColor }}>{fb?.score ?? "—"}</span>
                      <span className="text-[8px] text-white/25 leading-none">/10</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs text-white/30 font-medium">Q{i + 1}</span>
                        <span
                          className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                          style={{
                            background: q.category === "technical" ? "rgba(59,130,246,0.1)" : "rgba(52,211,153,0.1)",
                            color: q.category === "technical" ? "#60a5fa" : "#34d399",
                          }}
                        >
                          {q.category}
                        </span>
                      </div>
                      <p className="text-sm text-white/70 truncate pr-4">{q.text}</p>
                    </div>

                    <svg
                      className="w-4 h-4 text-white/25 shrink-0 transition-transform duration-200"
                      style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 space-y-4" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                      {/* Your answer */}
                      {answers[i]?.trim() && (
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/25 mb-1.5">Your Answer</p>
                          <p className="text-xs text-white/50 leading-relaxed bg-white/[0.02] rounded-xl px-4 py-3 border border-white/[0.05]">
                            {answers[i]}
                          </p>
                        </div>
                      )}

                      {fb && (
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div className="rounded-xl p-4" style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.12)" }}>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-green-400/60 mb-2">What was good</p>
                            <ul className="space-y-1">
                              {fb.strengths.map((s, si) => (
                                <li key={si} className="text-xs text-white/55 leading-relaxed">✓ {s}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="rounded-xl p-4" style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.12)" }}>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-400/60 mb-2">To improve</p>
                            <ul className="space-y-1">
                              {fb.improvements.map((s, si) => (
                                <li key={si} className="text-xs text-white/55 leading-relaxed">→ {s}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {fb?.modelAnswer && (
                        <div className="rounded-xl p-4" style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.12)" }}>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-400/60 mb-1.5">Model Answer Hint</p>
                          <p className="text-xs text-white/55 leading-relaxed">{fb.modelAnswer}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <button
              onClick={() => {
                setStep("setup");
                setRole(null);
                setResults(null);
                setQuestions([]);
                setAnswers([]);
                setCurrentQ(0);
              }}
              className="flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-white/60 hover:text-white/85"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              Try Another Role
            </button>
            <button
              onClick={() => navigate("/jobs")}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200"
              style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", boxShadow: "0 4px 20px rgba(59,130,246,0.3)" }}
            >
              Browse Jobs →
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
