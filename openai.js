const OpenAI = require("openai");
const { apiKey } = require("./config.json");

// Initialisez votre client OpenAI avec votre clé API provenant de config.json
const openai = new OpenAI({ apiKey });

module.exports = {
  complete: async function (params) {
    return await openai.complete(params);
  },
};
