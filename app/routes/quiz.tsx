import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { message } from "antd";
import Navbar from "~/components/Navbar";

function getRandomQuestions(allQuestions: any[], count = 5) {
  if (allQuestions.length <= count) return allQuestions;
  const shuffled = [...allQuestions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

export default function Quiz() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { questions = [], domain, score: resumeScore, matchedSkills, missingSkills } = state || {};
  const [selectedQuestions] = useState(() => getRandomQuestions(questions, 5));
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSelect = (qIndex: number, option: string) => {
    const updated = [...answers];
    updated[qIndex] = option;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    if (answers.filter(Boolean).length !== selectedQuestions.length) {
      message.error("Please answer all questions");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3001/api/submit-answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, answers, questions: selectedQuestions }),
      });
      const data = await res.json();
      navigate("/result", {
        state: {
          resumeScore,
          quizScore: data.score,
          percentage: Math.round((data.score / selectedQuestions.length) * 100),
          total: selectedQuestions.length,
          matchedSkills: matchedSkills ?? [],
          missingSkills: missingSkills ?? [],
        },
      });
    } catch (err) {
      console.error(err);
      message.error("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const answeredCount = answers.filter(Boolean).length;
  const progress = Math.round((answeredCount / Math.max(selectedQuestions.length, 1)) * 100);

  if (!state) {
    return (
      <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/30 text-sm mb-4">No quiz data found.</p>
          <a href="/upload" className="px-5 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.25)" }}>
            Upload Resume
          </a>
        </div>
      </main>
    );
  }

  if (selectedQuestions.length === 0) {
    return (
      <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <svg className="w-7 h-7 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-white mb-2">No questions available</h3>
          <p className="text-sm text-white/35 mb-6">We don't have quiz questions for this domain yet.</p>
          <a href="/upload" className="px-5 py-2.5 rounded-xl text-sm font-medium text-white"
            style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", boxShadow: "0 4px 16px rgba(59,130,246,0.3)" }}>
            Go Back
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      {/* Navbar */}
      <div
        className="sticky top-0 z-50 backdrop-blur-xl border-b"
        style={{ background: "rgba(5,8,22,0.85)", borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Navbar />
        </div>
      </div>

      {/* Header + Progress */}
      <section className="pt-12 pb-8 relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-violet-600/7 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-3xl mx-auto px-6 relative animate-fade-in-up">
          <p className="eyebrow mb-2">Skills Assessment</p>
          <h1
            className="text-3xl font-bold text-white tracking-tight mb-6 capitalize"
            style={{ letterSpacing: "-0.03em" }}
          >
            {domain ? `${domain} Quiz` : "Skills Quiz"}
          </h1>

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-white/40">
                {answeredCount} / {selectedQuestions.length} answered
              </span>
              <span className="text-xs font-bold text-white/50">{progress}%</span>
            </div>
            <div
              className="w-full h-1.5 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <div
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                  boxShadow: progress > 0 ? "0 0 8px rgba(59,130,246,0.5)" : "none",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Questions */}
      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-6 space-y-4">
          {selectedQuestions.map((q: any, index: number) => (
            <div
              key={index}
              className="rounded-2xl p-6 animate-fade-in-up"
              style={{
                background: "#0a0f1e",
                border: "1px solid rgba(255,255,255,0.065)",
                animationDelay: `${index * 0.05}s`,
              }}
            >
              {/* Question */}
              <h2 className="text-sm font-semibold text-white leading-relaxed mb-5">
                <span className="text-white/25 mr-2 font-medium tabular-nums">{index + 1}.</span>
                {q.question}
              </h2>

              {/* Options */}
              <div className="space-y-2.5">
                {q.options.map((opt: string, i: number) => {
                  const isSelected = answers[index] === opt;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(index, opt)}
                      className="w-full text-left rounded-xl px-4 py-3 text-sm transition-all duration-150 flex items-center justify-between gap-3"
                      style={{
                        background: isSelected
                          ? "rgba(59,130,246,0.1)"
                          : "rgba(255,255,255,0.025)",
                        border: isSelected
                          ? "1px solid rgba(59,130,246,0.4)"
                          : "1px solid rgba(255,255,255,0.06)",
                        color: isSelected ? "#fff" : "rgba(255,255,255,0.55)",
                        boxShadow: isSelected ? "0 0 0 1px rgba(59,130,246,0.15)" : "none",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
                          (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)";
                          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                          (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)";
                          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)";
                        }
                      }}
                    >
                      <span className="flex-1">{opt}</span>
                      <div
                        className="shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-150"
                        style={{
                          borderColor: isSelected ? "#3b82f6" : "rgba(255,255,255,0.15)",
                          background: isSelected ? "rgba(59,130,246,0.2)" : "transparent",
                        }}
                      >
                        {isSelected && (
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Submit */}
          <div className="pt-2">
            <button
              onClick={handleSubmit}
              disabled={loading || answeredCount < selectedQuestions.length}
              className="w-full py-4 rounded-2xl text-sm font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed"
              style={{
                background:
                  loading || answeredCount < selectedQuestions.length
                    ? "rgba(255,255,255,0.04)"
                    : "linear-gradient(135deg, #3b82f6, #6366f1)",
                color:
                  loading || answeredCount < selectedQuestions.length
                    ? "rgba(255,255,255,0.2)"
                    : "white",
                border:
                  loading || answeredCount < selectedQuestions.length
                    ? "1px solid rgba(255,255,255,0.06)"
                    : "none",
                boxShadow:
                  loading || answeredCount < selectedQuestions.length
                    ? "none"
                    : "0 4px 24px rgba(59,130,246,0.3)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Submitting…
                </span>
              ) : answeredCount < selectedQuestions.length ? (
                `Answer ${selectedQuestions.length - answeredCount} more question${selectedQuestions.length - answeredCount > 1 ? "s" : ""}`
              ) : (
                "Submit Answers →"
              )}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
