function matchSkills(resumeSkills, jdSkills) {

  // 🔥 Remove duplicates first
  const uniqueResumeSkills = [...new Set(resumeSkills)];
  const uniqueJdSkills = [...new Set(jdSkills)];

  // ✅ Matched skills (unique)
  const matchedSkills = uniqueResumeSkills.filter(skill =>
    uniqueJdSkills.includes(skill)
  );

  // ✅ Missing skills (unique)
  const missingSkills = uniqueJdSkills.filter(skill =>
    !uniqueResumeSkills.includes(skill)
  );

  // ✅ Safe score calculation (avoid NaN)
  const score = uniqueJdSkills.length === 0
    ? 0
    : Math.round((matchedSkills.length / uniqueJdSkills.length) * 100);

  return {
    score,
    matchedSkills,
    missingSkills
  };
}

module.exports = matchSkills;