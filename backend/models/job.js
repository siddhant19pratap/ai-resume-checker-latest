const jobs = [];

function addJob(job) {
  jobs.push(job);
}

function getJobs() {
  return jobs;
}

module.exports = { addJob, getJobs };