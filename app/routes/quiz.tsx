import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { message } from "antd";
import Navbar from "~/components/Navbar";

// ✅ Added: random question selector
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

  // ✅ Added: select only 5 random questions (runs once)
  const [selectedQuestions] = useState(() =>
    getRandomQuestions(questions, 5)
  );

  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSelect = (qIndex: number, option: string) => {
    const updated = [...answers];
    updated[qIndex] = option;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    // ✅ Updated: use selectedQuestions
    if (answers.length !== selectedQuestions.length) {
      message.error("Please answer all questions");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/submit-answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({domain,answers,questions: selectedQuestions}),
      });

      const data = await res.json();

      navigate("/result", {
        state: {
          resumeScore: state.score,

          quizScore: data.score,
          // ✅ Updated
          percentage: Math.round(
            (data.score / selectedQuestions.length) * 100
          ),
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

  // ✅ Updated
  const progress = Math.round(
    (answers.filter(Boolean).length / selectedQuestions.length) * 100
  );

  return (
    <main className="min-h-screen bg-[#030712] text-white relative overflow-hidden">

      {/* 🌌 Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-900/30 via-black to-cyan-900/20" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[40px_40px]" />
      </div>

      {/* 🔝 Navbar */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <Navbar />
        </div>
      </div>

      {/* 🚀 Header */}
            <section className="relative z-10 text-center py-16">
              <h1 className="text-5xl md:text-6xl text-white font-bold mb-6">
                {domain?.toUpperCase()} Quiz
              </h1>



        {/* Progress */}
        <div className="max-w-2xl mx-auto px-4">
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-2 bg-linear-to-r from-indigo-500 via-blue-500 to-cyan-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-400 mt-2 text-right">
            {progress}% completed
          </p>
        </div>
      </section>

      {/* 📄 Questions */}
      <section className="relative z-10 pb-20">
        <div className="max-w-4xl mx-auto px-4 space-y-6">

          {/* ✅ Updated */}
          {selectedQuestions.map((q: any, index: number) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6"
            >

              {/* Question */}
              <h2 className="text-lg font-semibold mb-4">
                {index + 1}. {q.question}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {q.options.map((opt: string, i: number) => {
                  const isSelected = answers[index] === opt;

                  return (
                    <div
                      key={i}
                      onClick={() => handleSelect(index, opt)}
                      className={`cursor-pointer rounded-xl border px-4 py-3 transition-all duration-200 flex justify-between items-center
                        ${
                          isSelected
                            ? "border-cyan-500 bg-cyan-500/10"
                            : "border-white/10 hover:border-cyan-400/40 hover:bg-white/5"
                        }
                      `}
                    >
                      <span className="text-sm text-gray-200">{opt}</span>

                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                          ${
                            isSelected
                              ? "border-cyan-400"
                              : "border-gray-500"
                          }
                        `}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Submit */}
          <div className="pt-6">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 cursor-pointer transition-all duration-200 active:scale-95 rounded-full bg-linear-to-r from-indigo-500 via-blue-500 to-cyan-500 hover:opacity-90 shadow-lg shadow-cyan-500/20 font-medium disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Answers"}
            </button>
          </div>

        </div>
      </section>
    </main>
  );
}