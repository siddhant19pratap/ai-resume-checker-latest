import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "~/components/Navbar";

export default function Jobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/jobs/list")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error("Failed to load jobs", err));
  }, []);

  const checkMatch = (job: any) => {
    navigate("/upload", {
      state: {
        jobDescription: job.description,
        jobTitle: job.title,
        company: job.company,
      },
    });
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

      {/* 🚀 Hero */}
      <section className="relative z-10 text-center py-24">

        {/* JOB BOARD */}
        <p className="
          text-lg md:text-xl 
          tracking-[0.4em] 
          text-cyan-400 
          mb-6 
          uppercase 
          font-bold
        ">
          JOB BOARD
        </p>

        <h1 className="
          text-5xl md:text-7xl font-bold
          bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500
          bg-clip-text text-transparent
          drop-shadow-[0_0_20px_rgba(59,130,246,0.35)]
          inline-block
        ">
          Available Jobs
        </h1>

      </section>

      {/* 📄 Content */}
      <section className="relative z-10 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* ❌ Empty State */}
          {jobs.length === 0 ? (
            <div className="max-w-2xl mx-auto text-center">

              <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-12">

                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-cyan-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 13V6a2 2 0 00-2-2h-3.586a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 0012.586 2H6a2 2 0 00-2 2v9m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4"
                    />
                  </svg>
                </div>

                {/* Text */}
                <h3 className="text-xl font-semibold mb-2">
                  No jobs posted yet
                </h3>

                <p className="text-gray-400 mb-6">
                  Check back later or post your own job
                </p>

                {/* Button */}
                <button
                  onClick={() => navigate("/post-job")}
                  className="px-6 py-3 rounded-full bg-linear-to-r cursor-pointer transition-all duration-200 active:scale-95 from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/20 hover:opacity-90 "
                >
                  + Post Job
                </button>

              </div>

            </div>
          ) : (
            /* ✅ Jobs Grid */
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 flex flex-col justify-between"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-400 transition">
                      {job.title}
                    </h2>

                    <p className="text-cyan-400 text-sm mb-4">
                      {job.company}
                    </p>

                    <p className="text-sm text-gray-400 line-clamp-4 mb-6">
                      {job.description}
                    </p>
                  </div>

                  <button
                    onClick={() => checkMatch(job)}
                    className="mt-auto w-full py-2.5 cursor-pointer transition-all duration-200 active:scale-95 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 hover:opacity-90  shadow-md shadow-cyan-500/20 text-sm font-medium"
                  >
                    Check Resume Match
                  </button>
                </div>
              ))}

            </div>
          )}

        </div>
      </section>
    </main>
  );
}