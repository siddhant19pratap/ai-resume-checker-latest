const skills = require("./skills");

function extractSkills(text) {

  if (!text) return [];

  const normalizedText = text
    .toLowerCase()
    .replace(/[^a-z0-9+.#]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const foundSkills = [];

  for (const skillKey in skills) {

    const aliases = skills[skillKey];

    for (const alias of aliases) {

      const escapedAlias = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const pattern = new RegExp(`\\b${escapedAlias}\\b`, "i");

      for (const skillKey in skills) {
        const aliases = skills[skillKey];

        for (const alias of aliases) {
          if (normalizedText.includes(alias.toLowerCase())) {
            foundSkills.push(skillKey);
            break;
          }
        }
      }
    }
  }

  return foundSkills;
}

module.exports = extractSkills;