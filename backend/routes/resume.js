const express = require("express");
const multer = require("multer");

const parseResume = require("../services/parser");
const extractSkills = require("../services/extractskills");
const matchSkills = require("../services/matchengine");
const detectDomain = require("../services/detectDomain");
const questionsDB = require("../data/questions");

const router = express.Router();
const upload = multer({ dest: "uploads/" });


// 🔥 NEW: Domain skill map (SAFE ADD)
const domainSkillsMap = {
  frontend: ["react", "javascript", "html", "css", "redux", "typescript"],
  backend: ["node", "express", "mongodb", "api", "sql", "microservices"],
  dataEngineering: [
    "spark", "pyspark", "etl", "kafka", "airflow",
    "hadoop", "aws", "sql", "datawarehouse", "databricks"
  ],
  dataAnalyst: ["excel", "sql", "python", "tableau", "power bi", "pandas"],
  uiux: ["figma", "design", "wireframe", "prototype", "ux", "ui"]
};


// 🔥 NEW: Feedback generator (SAFE ADD)
function generateFeedback({ strongSkills, missingSkills, domain }) {
  let message = "";

  if (strongSkills.length > 0) {
    message += `You are strong in ${strongSkills.slice(0, 5).join(", ")}. `;
  }

  if (missingSkills.length > 0) {
    message += `To become a better ${domain}, focus on ${missingSkills
      .slice(0, 5)
      .join(", ")}. `;
  }

  if (strongSkills.length >= 6) {
    message += `You are a strong fit for ${domain} roles.`;
  } else {
    message += `You have a good base but need improvement to be job-ready.`;
  }

  return message;
}


router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No resume uploaded" });
    }

    // 🔥 JD OPTIONAL
    const jobDescription = req.body.jobDescription || "";
    const isJDMode = jobDescription.trim().length > 0;

    // 🔹 Parse resume
    const resumeText = await parseResume(req.file.path);

    // 🔹 Extract + dedupe skills
    const resumeSkills = [
      ...new Set(
        extractSkills(resumeText).map((s) => s.toLowerCase())
      ),
    ];

    const jdSkills = isJDMode
      ? [
          ...new Set(
            extractSkills(jobDescription).map((s) => s.toLowerCase())
          ),
        ]
      : [];

    // 🔹 Match skills ONLY if JD exists
    const result = isJDMode
      ? matchSkills(resumeSkills, jdSkills)
      : {
          score: 0,
          matchedSkills: [],
          missingSkills: [],
        };

    // 🔹 Detect domains
    const resumeDomain = detectDomain(resumeSkills);
    const jdDomain = isJDMode ? detectDomain(jdSkills) : null;

    // 🔥 Suggestion logic
    const suggestedDomain =
      isJDMode && resumeDomain !== jdDomain ? resumeDomain : null;

    // 🔥 Suggestions (resume-only mode)
    const suggestions = [];

    if (!isJDMode) {
      if (resumeDomain === "dataEngineering") {
        suggestions.push("backend");
      } else if (resumeDomain === "backend") {
        suggestions.push("dataEngineering");
      }
    }

    // 🔹 Questions
    const resumeQuestions = questionsDB[resumeDomain] || [];
    const jdQuestions = jdDomain ? questionsDB[jdDomain] || [] : [];

    const defaultQuestions = suggestedDomain
      ? resumeQuestions
      : jdQuestions.length > 0
      ? jdQuestions
      : resumeQuestions;


    // ============================
    // 🔥 NEW AI LOGIC (SAFE ADD)
    // ============================

    const domainSkills = domainSkillsMap[resumeDomain] || [];

    const strongSkills = resumeSkills.filter((skill) =>
      domainSkills.includes(skill)
    );

    const missingDomainSkills = domainSkills.filter(
      (skill) => !resumeSkills.includes(skill)
    );

    const feedback = generateFeedback({
      strongSkills,
      missingSkills: missingDomainSkills,
      domain: resumeDomain,
    });


    // 🔥 FINAL RESPONSE (ONLY ADDED NEW FIELDS)
    res.json({
      mode: isJDMode ? "JD_MODE" : "RESUME_MODE",

      resumeSkills,
      jdSkills,

      resumeScore: result.score,
      matchedSkills: result.matchedSkills,
      missingSkills: result.missingSkills,

      resumeDomain,
      jdDomain,
      suggestedDomain,
      suggestions,

      resumeQuestions,
      jdQuestions,

      // 🔥 NEW (SAFE ADD)
      insights: {
        strongSkills,
        missingSkills: missingDomainSkills,
      },
      feedback,

      // backward compatibility (UNCHANGED)
      domain: suggestedDomain || jdDomain || resumeDomain,
      questions: defaultQuestions,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


// ================= QUIZ =================

router.post("/submit-answers", (req, res) => {
  const { answers, questions } = req.body;

  let score = 0;

  questions.forEach((q, index) => {
    if (answers[index] === q.answer) {
      score++;
    }
  });

  const percentage = Math.round((score / questions.length) * 100);

  res.json({
    score,
    total: questions.length,
    percentage,
  });
});

module.exports = router;