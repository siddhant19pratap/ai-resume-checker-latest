const express = require("express");
const router = express.Router();
const { addJob, getJobs } = require("../models/job");

router.post("/post", (req, res) => {

  const { title, company, description } = req.body;

  const job = {
    id: Date.now(),
    title,
    company,
    description
  };

  addJob(job);

  res.json(job);
});

router.get("/list", (req, res) => {
  res.json(getJobs());
});

module.exports = router;