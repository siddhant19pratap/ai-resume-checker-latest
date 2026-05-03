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
      const res = await fetch("http://localhost:5000/api/jobs/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          company,
          description,
        }),
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
    <main className="min-h-screen bg-[#030712] text-white relative overflow-hidden">

      {/* 🌌 Background */}
      <div className="absolute inset-0 z-0">
        {/* Gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-indigo-900/30 via-black to-cyan-900/20" />

        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[40px_40px]" />
      </div>

      {/* 🔝 Navbar */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <Navbar />
        </div>
      </div>

      {/* 🚀 Title */}
      <section className="relative z-10 text-center py-5 ">
        <h1 className="text-5xl md:text-6xl text-white! font-bold">
          Post a Job
        </h1>
      </section>

      {/* 📄 Form */}
      <section className="relative z-10 pb-20">
        <div className="max-w-2xl mx-auto px-4">

          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-10 space-y-6">

            {/* Job Title */}
            <div className="space-y-2 flex flex-col gap-2">
              <label className="text-sm text-gray-400 ">
                Job Title
              </label>
              <input
                type="text"
                placeholder="e.g. Frontend Developer"
                className="w-full  bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Company */}
            <div className="space-y-2 flex flex-col gap-2">
              <label className="text-sm text-gray-400">
                Company Name
              </label>
              <input
                type="text"
                placeholder="e.g. Google"
                className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="space-y-2 flex flex-col gap-2">
              <label className="text-sm text-gray-400">
                Job Description
              </label>
              <textarea
                rows={6}
                placeholder="Write detailed job description..."
                className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none resize-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="w-full py-3 cursor-pointer transition-all duration-200 active:scale-95 rounded-full bg-linear-to-r from-indigo-500 via-blue-500 to-cyan-500 hover:opacity-90  shadow-lg shadow-cyan-500/20 font-medium flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Post Job
            </button>

          </div>

        </div>
      </section>
    </main>
  );
}