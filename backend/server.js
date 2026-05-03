require("dotenv").config();

const express = require("express");
const cors = require("cors");

const resumeRoutes = require("./routes/resume");
const jobRoutes = require("./routes/jobs");
const interviewRoutes = require("./routes/interview"); // ✅ NEW

const app = express();

app.use(cors());
app.use(express.json());

// Resume parsing routes
app.use("/api", resumeRoutes);

// Job posting routes
app.use("/api/jobs", jobRoutes);

// Interview question generation routes
app.use("/api/interview", interviewRoutes); // ✅ NEW

app.get("/", (req, res) => {
  res.send("Resume AI Backend Running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
}); 
