const openai = require("openai");
const { apiKey } = require("./config.json");
console.log(apiKey);
// Initialisez votre client OpenAI avec votre clé API provenant de config.json
const openaiClient = new openai.OpenAI({ apiKey });

module.exports = {
  openai: openaiClient,
};
