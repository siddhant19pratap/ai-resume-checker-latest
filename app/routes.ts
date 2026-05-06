import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/auth", "routes/auth.tsx"),
  route("/upload", "routes/upload.tsx"),
  route("/result", "routes/result.tsx"),
  route("/jobs", "routes/jobs.tsx"),
  route("/quiz", "routes/quiz.tsx"),
  route("/post-job", "routes/post-job.tsx"),

  route("/resume-analysis", "routes/resume-analysis.tsx"),
  route("/ai-interview", "routes/ai-interview.tsx"),
  route("/practice", "routes/practice.tsx"),
  route("/cover-letter", "routes/cover-letter.tsx"),
] satisfies RouteConfig;