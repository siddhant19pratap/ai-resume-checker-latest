const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const { addJob, getJobs, getJobById, applyToJob } = require("../models/job");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../backend/uploads"),
  filename: (req, file, cb) => {
    cb(null, `resume_${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".doc", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
});

router.post("/post", (req, res) => {
  const { title, company, description, location, jobType, salary } = req.body;

  const job = {
    id: Date.now(),
    title,
    company,
    description,
    location: location || null,
    jobType: jobType || null,
    salary: salary || null,
    postedAt: Date.now(),
  };

  addJob(job);
  res.json(job);
});

router.get("/list", (req, res) => {
  res.json(getJobs());
});

router.get("/:id", (req, res) => {
  const job = getJobById(req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(job);
});

router.post("/:id/apply", upload.single("resume"), (req, res) => {
  const { name, email, phone, linkedin, years } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const resumePath = req.file ? req.file.filename : null;
  const success = applyToJob(req.params.id, { name, email, phone, linkedin, years, resumePath });
  if (!success) return res.status(404).json({ error: "Job not found" });

  res.json({ success: true, message: "Application submitted successfully" });
});

module.exports = router;
