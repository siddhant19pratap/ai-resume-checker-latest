import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "~/components/Navbar";

export default function Jobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/api/jobs/list")
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
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Navbar */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-black/60 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Navbar />
        </div>
      </div>

      {/* Header */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-medium text-blue-400 uppercase tracking-widest mb-2">Job Board</p>
              <h1 className="text-3xl font-semibold text-white">Available Jobs</h1>
            </div>
            <button
              onClick={() => navigate("/post-job")}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium transition-all duration-200"
            >
              + Post Job
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-6">

          {jobs.length === 0 ? (
            <div className="max-w-sm mx-auto text-center py-10">
              <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-10">
                <div className="w-12 h-12 mx-auto mb-5 rounded-xl bg-zinc-800 flex items-center justify-center">
                  <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2h-3.586a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 0012.586 2H6a2 2 0 00-2 2v9m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-white mb-2">No jobs posted yet</h3>
                <p className="text-sm text-zinc-500 mb-6">Be the first to post a job listing.</p>
                <button
                  onClick={() => navigate("/post-job")}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium transition-all duration-200"
                >
                  Post a Job
                </button>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="group bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-700 hover:shadow-xl transition-all duration-200"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h2 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors duration-200">
                          {job.title}
                        </h2>
                        <p className="text-sm text-zinc-500 mt-0.5">{job.company}</p>
                      </div>
                      <span className="shrink-0 px-2.5 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                        Open
                      </span>
                    </div>

                    <p className="text-sm text-zinc-400 line-clamp-4 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  <button
                    onClick={() => checkMatch(job)}
                    className="mt-5 w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-sm font-medium transition-all duration-200"
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
