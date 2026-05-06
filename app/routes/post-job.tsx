import { useState } from "react";
import { useNavigate } from "react-router";
import { message } from "antd";
import Navbar from "~/components/Navbar";

export default function PostJob() {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [salary, setSalary] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title || !company || !description) {
      message.error("Title, company, and description are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/jobs/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, company, description, location, jobType, salary }),
      });

      if (!res.ok) throw new Error();

      message.success("Job posted successfully!");
      navigate("/jobs");
    } catch (err) {
      console.error(err);
      message.error("Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      {/* Navbar */}
      <div className="sticky top-0 z-50 backdrop-blur-xl border-b" style={{ background: "rgba(5,8,22,0.85)", borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Navbar />
        </div>
      </div>

      {/* Header */}
      <section className="pt-14 pb-8 text-center relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[250px] bg-blue-600/7 rounded-full blur-[90px]" />
        </div>
        <div className="max-w-6xl mx-auto px-6 relative animate-fade-in-up">
          <p className="eyebrow mb-3">Job Board</p>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2" style={{ letterSpacing: "-0.03em" }}>Post a Job</h1>
          <p className="text-sm text-white/35">Add a new listing to the job board</p>
        </div>
      </section>

      {/* Form */}
      <section className="pb-24">
        <div className="max-w-xl mx-auto px-6">
          <div className="rounded-2xl p-8 space-y-5 animate-fade-in-up" style={{ background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }}>

            <FormField label="Job Title" required>
              <input
                type="text"
                placeholder="e.g. Senior Frontend Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputCls}
              />
            </FormField>

            <FormField label="Company Name" required>
              <input
                type="text"
                placeholder="e.g. Acme Corp"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className={inputCls}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Job Type">
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className={inputCls + " appearance-none cursor-pointer"}
                >
                  <option value="">Select type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Internship">Internship</option>
                </select>
              </FormField>

              <FormField label="Location">
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={inputCls}
                />
              </FormField>
            </div>

            <FormField label="Salary Range">
              <input
                type="text"
                placeholder="e.g. $120k – $160k / yr"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className={inputCls}
              />
            </FormField>

            <FormField label="Job Description" required>
              <textarea
                rows={7}
                placeholder="Write a detailed job description — responsibilities, requirements, benefits..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={inputCls + " resize-none"}
              />
            </FormField>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => navigate("/jobs")}
                className="flex-1 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-white/80 transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                  boxShadow: "0 4px 20px rgba(59,130,246,0.3)",
                }}
              >
                {loading ? "Posting…" : "Post Job"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const inputCls =
  "w-full bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white/85 placeholder-white/20 outline-none transition-all duration-200 focus:border-blue-500/40 focus:bg-white/[0.04]";

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-white/40 uppercase tracking-widest">
        {label}
        {required && <span className="text-red-400 ml-0.5 normal-case tracking-normal font-normal"> *</span>}
      </label>
      {children}
    </div>
  );
}
