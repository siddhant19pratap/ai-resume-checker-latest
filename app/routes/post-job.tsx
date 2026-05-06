import { useState } from "react";
import { useNavigate } from "react-router";
import { message } from "antd";
import Navbar from "~/components/Navbar";

export default function PostJob() {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title || !company || !description) {
      message.error("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/jobs/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, company, description }),
      });

      if (!res.ok) throw new Error();

      message.success("Job posted successfully!");
      setTitle("");
      setCompany("");
      setDescription("");
      navigate("/jobs");
    } catch (err) {
      console.error(err);
      message.error("Failed to post job");
    }
  };

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
          <h1 className="text-3xl font-semibold text-white mb-2">Post a Job</h1>
          <p className="text-sm text-zinc-500">Add a new listing to the job board</p>
        </div>
      </section>

      {/* Form */}
      <section className="pb-24">
        <div className="max-w-xl mx-auto px-6">
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8 shadow-lg space-y-5">

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-300">Job Title</label>
              <input
                type="text"
                placeholder="e.g. Frontend Developer"
                className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-300">Company Name</label>
              <input
                type="text"
                placeholder="e.g. Google"
                className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-300">Job Description</label>
              <textarea
                rows={6}
                placeholder="Write a detailed job description..."
                className="w-full bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => navigate("/jobs")}
                className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-sm font-medium transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-medium transition-all duration-200"
              >
                Post Job
              </button>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
