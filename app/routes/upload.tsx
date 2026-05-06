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

      const res = await fetch("http://localhost:3001/api/upload", {
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

  const handleResumeOnly = async () => {
    const data = await callAPI();
    if (!data) return;
    navigate("/resume-analysis", { state: data });
  };

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

  const isSameDomain = apiData && apiData.resumeDomain === apiData.jdDomain;

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Navbar */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-black/60 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Navbar />
        </div>
      </div>

      {/* Header */}
      <section className="py-12 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-3xl font-semibold text-white mb-2">Upload Resume</h1>
          <p className="text-sm text-zinc-500">Get instant AI feedback on your resume</p>
        </div>
      </section>

      {/* Form */}
      <section className="pb-24">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8 space-y-6 shadow-lg">

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Resume
              </label>
              <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-zinc-700 rounded-xl p-8 cursor-pointer hover:border-blue-500/50 hover:bg-zinc-800/40 transition-all duration-200">
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <svg className="w-8 h-8 text-zinc-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9m-5-9v8m0 0l-3-3m3 3l3-3" />
                </svg>
                {file ? (
                  <div className="text-center">
                    <p className="text-sm font-medium text-blue-400">{file.name}</p>
                    <p className="text-xs text-zinc-500 mt-1">Click to change file</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-zinc-400">Click to upload your resume</p>
                    <p className="text-xs text-zinc-600 mt-1">PDF only</p>
                  </div>
                )}
              </label>
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Job Description
                <span className="ml-2 text-xs text-zinc-500 font-normal">Optional</span>
              </label>
              <textarea
                rows={5}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here to get a match score..."
                className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200 resize-none"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handleResumeOnly}
                disabled={!file || loading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-sm font-medium transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Processing...
                  </span>
                ) : "Analyze Resume"}
              </button>

              <button
                onClick={handleJDMode}
                disabled={!file || !isJDMode || loading}
                className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-800/50 disabled:text-zinc-600 disabled:cursor-not-allowed border border-zinc-700 text-sm font-medium transition-all duration-200"
              >
                {loading ? "Processing..." : "Match with Job Description"}
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Modal */}
      <Modal open={isModalOpen} onCancel={handleCancel} footer={null} centered>
        {apiData && apiData.mode === "JD_MODE" && (
          <div className="rounded-xl overflow-hidden">
            <div className="text-center py-4 font-semibold text-gray-800">
              Resume vs Job Analysis
            </div>

            <div className={`grid ${isSameDomain ? "grid-cols-1" : "grid-cols-2"}`}>
              <div className="bg-green-50 p-6 text-center">
                <p className="text-sm text-gray-500 mb-1">Your Best Match</p>
                <h3 className="text-green-600 font-bold text-lg">
                  {domainLabels[apiData.resumeDomain]}
                </h3>
                {isSameDomain && (
                  <p className="text-green-600 font-semibold mt-1 text-sm">Perfect Match</p>
                )}
                <p className="text-3xl font-bold mt-3 text-gray-800">{apiData.resumeScore}%</p>
                <button
                  onClick={() => navigate("/quiz", { state: { domain: apiData.resumeDomain, questions: apiData.resumeQuestions } })}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 mt-4 rounded-lg text-sm font-medium transition-colors"
                >
                  Take Quiz
                </button>
              </div>

              {!isSameDomain && (
                <div className="bg-red-50 p-6 text-center">
                  <p className="text-sm text-gray-500 mb-1">This Job Role</p>
                  <h3 className="text-red-600 font-bold text-lg">
                    {domainLabels[apiData.jdDomain]}
                  </h3>
                  <p className="text-3xl font-bold mt-3 text-gray-800">{apiData.resumeScore}%</p>
                  <button
                    onClick={() => navigate("/quiz", { state: { domain: apiData.jdDomain, questions: apiData.jdQuestions } })}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 mt-4 rounded-lg text-sm font-medium transition-colors"
                  >
                    Take Quiz
                  </button>
                </div>
              )}
            </div>

            <div className="p-4">
              <button
                onClick={handleCancel}
                className="w-full border border-gray-200 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors text-gray-600"
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
