import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { message, Modal } from "antd";
import Navbar from "~/components/Navbar";

export default function Upload() {
  const navigate = useNavigate();
  const location = useLocation();

  const domainLabels: Record<string, string> = {
    frontend: "Frontend Developer",
    backend: "Backend Developer",
    dataEngineering: "Data Engineer",
    dataAnalyst: "Data Analyst",
    uiux: "UI/UX Designer",
  };

  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState(
    location.state?.jobDescription || ""
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiData, setApiData] = useState<any>(null);

  const isJDMode = jobDescription.trim().length > 0;

  // 🔥 COMMON API
  const callAPI = async () => {
    if (!file) {
      message.error("Please upload a resume");
      return null;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);

      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setApiData(data);
      return data;

    } catch (err) {
      console.error(err);
      setError("Failed to analyze resume. Please try again.");
      message.error("Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Resume Only
  const handleResumeOnly = async () => {
    const data = await callAPI();
    if (!data) return;

    navigate("/resume-analysis", {
      state: data,
    });
  };

  // 🔹 JD Mode
  const handleJDMode = async () => {
    if (!isJDMode) {
      message.warning("Please enter Job Description");
      return;
    }

    const data = await callAPI();
    if (!data) return;

    setIsModalOpen(true);
  };

  const handleCancel = () => setIsModalOpen(false);

  const isSameDomain =
    apiData && apiData.resumeDomain === apiData.jdDomain;

  return (
    <main className="min-h-screen bg-[#030712] text-white relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-900/30 via-black to-cyan-900/20" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[40px_40px]" />
      </div>

      {/* Navbar */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <Navbar />
        </div>
      </div>

      {/* Title */}
      <section className="relative z-10 text-center py-10">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 text-transparent bg-clip-text">
          Upload Resume
        </h1>
      </section>

      {/* Form */}
      <section className="relative z-10 pb-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 space-y-8">

            {/* Upload */}
            <div>
              <label className="text-sm text-gray-400">Resume (PDF)</label>

              <label className="block border border-dashed border-white/20 rounded-2xl p-10 text-center cursor-pointer hover:border-cyan-400/40 transition bg-white/5">
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />

                <p className="text-gray-300">
                  {file ? file.name : "Click to upload your resume"}
                </p>
              </label>
            </div>

            {/* JD */}
            <div>
              <label className="text-sm text-gray-400">
                Job Description (Optional)
              </label>

              <textarea
                rows={5}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col gap-3">

              <button
                onClick={handleResumeOnly}
                disabled={!file || loading}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 py-3 rounded-full disabled:bg-gray-500"
              >
                {loading ? "Processing..." : "Check Your Skills"}
              </button>

              <button
                onClick={handleJDMode}
                disabled={!file || !isJDMode || loading}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 py-3 rounded-full disabled:bg-gray-600"
              >
                {loading ? "Processing..." : "Analyze with JD"}
              </button>

            </div>

            {error && <p className="text-red-400">{error}</p>}
          </div>
        </div>
      </section>

      {/* ✅ FINAL MODAL */}
      <Modal open={isModalOpen} onCancel={handleCancel} footer={null} centered>

        {apiData && apiData.mode === "JD_MODE" && (
          <div className="rounded-xl overflow-hidden">

            <div className="text-center py-4 font-semibold">
              Resume vs Job Analysis
            </div>

            <div className={`grid ${isSameDomain ? "grid-cols-1" : "grid-cols-2"}`}>

              {/* LEFT */}
              <div className="bg-green-50 p-6 text-center">
                <p>Your Best Match</p>

                <h3 className="text-green-600 font-bold">
                  {domainLabels[apiData.resumeDomain]}
                </h3>

                {isSameDomain && (
                  <p className="text-green-600 font-semibold mt-1">
                    Perfect Match 🎯
                  </p>
                )}

                <p className="text-3xl font-bold mt-2">
                  {apiData.resumeScore}%
                </p>

                <button
                  onClick={() =>
                    navigate("/quiz", {
                      state: {
                        domain: apiData.resumeDomain,
                        questions: apiData.resumeQuestions,
                      },
                    })
                  }
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 mt-4 rounded"
                >
                  Take Quiz
                </button>
              </div>

              {/* RIGHT */}
              {!isSameDomain && (
                <div className="bg-red-50 p-6 text-center">
                  <p>This Job Role</p>

                  <h3 className="text-red-600 font-bold">
                    {domainLabels[apiData.jdDomain]}
                  </h3>

                  <p className="text-3xl font-bold mt-2">
                    {apiData.resumeScore}%
                  </p>

                  <button
                    onClick={() =>
                      navigate("/quiz", {
                        state: {
                          domain: apiData.jdDomain,
                          questions: apiData.jdQuestions,
                        },
                      })
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 mt-4 rounded"
                  >
                    Take Quiz
                  </button>
                </div>
              )}
            </div>

            <div className="p-4">
              <button
                onClick={handleCancel}
                className="w-full border py-2 rounded hover:bg-gray-100"
              >
                Maybe Later
              </button>
            </div>

          </div>
        )}

      </Modal>
    </main>
  );
}