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
    if (answers.length !== selectedQuestions.length) {
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
  const progress = Math.round((answeredCount / selectedQuestions.length) * 100);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Navbar */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-black/60 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Navbar />
        </div>
      </div>

      {/* Header */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-6">
            <p className="text-xs font-medium text-blue-400 uppercase tracking-widest mb-2">Skills Quiz</p>
            <h1 className="text-3xl font-semibold text-white capitalize">
              {domain} Quiz
            </h1>
          </div>

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
              <span>{answeredCount} of {selectedQuestions.length} answered</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-1.5 bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
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
              className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-sm font-semibold text-white mb-4 leading-relaxed">
                <span className="text-zinc-500 mr-2">{index + 1}.</span>
                {q.question}
              </h2>

              <div className="space-y-2.5">
                {q.options.map((opt: string, i: number) => {
                  const isSelected = answers[index] === opt;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(index, opt)}
                      className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-all duration-200 flex items-center justify-between gap-3 ${
                        isSelected
                          ? "border-blue-500 bg-blue-600/10 text-white"
                          : "border-zinc-700 bg-zinc-800/40 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 hover:bg-zinc-800/60"
                      }`}
                    >
                      <span>{opt}</span>
                      <div
                        className={`shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          isSelected ? "border-blue-500" : "border-zinc-600"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Submit */}
          <div className="pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading || answeredCount < selectedQuestions.length}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed text-sm font-medium transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Submitting...
                </span>
              ) : "Submit Answers"}
            </button>
          </div>

        </div>
      </section>
    </main>
  );
}
