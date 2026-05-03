import { Link } from "react-router";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between">

      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-2 hover:scale-105 transition-all duration-300"
      >
        <h1 className="text-3xl md:text-4xl font-black tracking-tight 
          bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 
          bg-clip-text text-transparent">
          Ambixious
        </h1>
      </Link>

      {/* Right Side */}
      <div className="flex items-center gap-3 md:gap-4">

        {/* Browse Jobs */}
        <Link
          to="/jobs"
          className="px-4 md:px-5 py-2 rounded-lg border cursor-pointer transition-all duration-200 active:scale-95 border-white/10 bg-white/5 hover:bg-white/10  text-sm md:text-base"
        >
          Browse Jobs
        </Link>

        {/* Post Job */}
        <Link
          to="/post-job"
          className="px-4 md:px-5 py-2 rounded-lg cursor-pointer transition-all duration-200 active:scale-95 border border-white/10 bg-white/5 hover:bg-white/10 text-sm md:text-base"
        >
          Post Job
        </Link>

        {/* Upload Resume */}
        <Link
          to="/upload"
          className="px-5 md:px-6 py-2.5 md:py-3 rounded-lg bg-linear-to-r from-cyan-500 to-blue-500 hover:opacity-90 cursor-pointer transition-all duration-200 active:scale-95 shadow-lg shadow-cyan-500/20 flex items-center gap-2 text-sm md:text-base"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 md:h-5 md:w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9m-5-9v8m0 0l-3-3m3 3l3-3"
            />
          </svg>
          Upload Resume
        </Link>

      </div>
    </nav>
  );
};

export default Navbar;