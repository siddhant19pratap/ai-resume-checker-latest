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

  const { questions = [], domain } = state || {};
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
          resumeScore: state.score,
          quizScore: data.score,
          percentage: Math.round((data.score / selectedQuestions.length) * 100),
          total: selectedQuestions.length,
          matchedSkills: state.matchedSkills,
          missingSkills: state.missingSkills,
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
