const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/generate", async (req, res) => {

  const { resumeText } = req.body;

  if (!resumeText) {
    return res.status(400).json({
      error: "resumeText is required"
    });
  }

  const prompt = `
You are an expert technical interviewer.

Based on the following resume generate:

1. 3 technical interview questions
2. 3 behavioral interview questions

Resume:
${resumeText}
`;

  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash"
    });

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({
      questions: response
    });

  } catch (err) {

    console.error("Gemini error:", err);

    res.status(500).json({
      error: "AI generation failed"
    });

  }

});

module.exports = router;