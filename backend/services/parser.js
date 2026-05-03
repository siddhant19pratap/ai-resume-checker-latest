const fs = require("fs");
const pdfParse = require("pdf-parse");

async function parseResume(filePath) {

  const dataBuffer = fs.readFileSync(filePath);

  const data = await pdfParse(dataBuffer);

  return data.text;
}

module.exports = parseResume;