import { Link, useLocation } from "react-router";

const Navbar = () => {
  const { pathname } = useLocation();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="flex items-center justify-between">
      {/* Brand */}
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:shadow-blue-600/50 transition-all duration-200">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="text-sm font-semibold tracking-tight text-white">
          Ambix<span className="text-blue-400">ious</span>
        </span>
      </Link>

      {/* Nav Links */}
      <div className="hidden sm:flex items-center gap-0.5">
        {[
          { to: "/jobs", label: "Browse Jobs" },
          { to: "/cover-letter", label: "Cover Letter" },
          { to: "/practice", label: "Practice" },
        ].map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive(to)
                ? "text-white bg-white/8"
                : "text-white/45 hover:text-white/90 hover:bg-white/5"
            }`}
          >
            {label}
          </Link>
        ))}
        <Link
          to="/ai-interview"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
            isActive("/ai-interview")
              ? "text-white bg-white/8"
              : "text-white/45 hover:text-white/90 hover:bg-white/5"
          }`}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: isActive("/ai-interview") ? "#60a5fa" : "rgba(96,165,250,0.5)" }}
          />
          AI Interview
        </Link>
      </div>

      {/* CTA */}
      <Link
        to="/upload"
        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          isActive("/upload")
            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
            : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30"
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9m-5-4v8m0 0l-3-3m3 3l3-3" />
        </svg>
        Upload Resume
      </Link>
    </nav>
  );
};

export default Navbar;
