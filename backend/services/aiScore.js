const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeResume(resumeText) {

  const model = genAI.getGenerativeModel({model: "gemini-2.0-flash"});

  const prompt = `
You are an expert resume reviewer.

Analyze the following resume and return a JSON response with:

1. score (out of 100)
2. skills_detected
3. strengths
4. improvements

Resume:
${resumeText}

Return ONLY JSON.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text();
}

module.exports = analyzeResume;