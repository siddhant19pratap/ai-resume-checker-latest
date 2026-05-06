import { Link } from "react-router";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-xl font-bold tracking-tight text-white">
          Ambixious
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <Link
          to="/jobs"
          className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all duration-200"
        >
          Browse Jobs
        </Link>

        <Link
          to="/post-job"
          className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all duration-200"
        >
          Post Job
        </Link>

        <Link
          to="/upload"
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm text-white font-medium transition-all duration-200 flex items-center gap-1.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9m-5-9v8m0 0l-3-3m3 3l3-3" />
          </svg>
          Upload Resume
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
