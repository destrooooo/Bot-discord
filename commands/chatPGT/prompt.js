const { SlashCommandBuilder } = require("discord.js");
//const { openai } = require("../../openai.js").openai;
const { complete } = require("../../openai.js");

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
      // making sure interaction.options is desfined and if "question" is present
      if (!interaction.options || !interaction.options.getString("question")) {
        return interaction.reply("Please provide a question.");
      }

      const question = interaction.options.getString("question");
      console.log(question);
      // Send the API request to OpenAI
      const response = await openai.complete({
        prompt: question,
        maxTokens: 150,
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant who responds succinctly",
          },
          { role: "user", content: question },
        ],
      });

      // Making sure the Api made a response
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

      // Get the first response of chatgpt
      const content = response.data.choices[0].message.content;

      // Respond to user with chatgpt answer
      const reply = await interaction.reply(content);
      console.log(content);
      // Making sure the reply have been sucessfully sent
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

//const reason =
//interaction.options.getString("reason") ?? "No reason provided"; // à réutiliser

// .addStringOption(option =>
//   option.setName("question").setDescription("type ur question here").setRequired(true)
