const { SlashCommandBuilder } = require("discord.js");
const { openai } = require("../../openai.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ask_gpt")
    .setDescription("ask gpt what u need")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("type ur question here")
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      // Vérifier si interaction.options est défini et si l'option "question" est présente
      if (!interaction.options || !interaction.options.getString("question")) {
        return interaction.reply("Please provide a question.");
      }

      const question = interaction.options.getString("question");

      // Envoyer la requête à l'API OpenAI
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant who responds succinctly",
          },
          { role: "user", content: question },
        ],
      });

      // Vérifier si une réponse a été renvoyée par l'API
      if (
        !response ||
        !response.data ||
        !response.data.choices ||
        response.data.choices.length === 0
      ) {
        return interaction.reply(
          "I'm sorry, I couldn't get a response at the moment."
        );
      }

      // Extraire le contenu de la première option de choix
      const content = response.data.choices[0].message.content;

      // Répondre à l'utilisateur avec le contenu de la réponse
      const reply = await interaction.reply(content);
      console.log(content);
      // Vérifier si la réponse a été correctement envoyée
      if (!reply) {
        console.log("Failed to send reply.");
      } else {
        console.log("Reply sent successfully.");
      }
    } catch (err) {
      console.error(err);
      return interaction.reply("As an AI robot, I errored out.");
    }
  },
};
