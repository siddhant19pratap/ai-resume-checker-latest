const domainSkills = require("./domainSkills");

function detectDomain(resumeSkills) {
  let bestDomain = null;
  let maxMatch = 0;

  for (const domain in domainSkills) {
    const skills = domainSkills[domain];

    const matchCount = resumeSkills.filter(skill =>
      skills.includes(skill)
    ).length;

    if (matchCount > maxMatch) {
      maxMatch = matchCount;
      bestDomain = domain;
    }
  }

  return bestDomain;
}

module.exports = detectDomain;