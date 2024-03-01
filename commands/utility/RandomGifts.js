const giphy = require("giphy-api")("fw9qFhdRJ4aBx3OqitLCeKSL7C7L4jN0");
const { SlashCommandBuilder } = require("discord.js");

const randomGifCommand = new SlashCommandBuilder()
  .setName("randomgif")
  .setDescription("Envoie un GIF aléatoire");

module.exports = {
  data: randomGifCommand,
  async execute(interaction) {
    giphy.random("random", (err, res) => {
      if (err) {
        interaction.reply({
          content: "Une erreur est survenue lors de la recherche du gif.",
          ephemeral: true,
        });
      } else {
        console.log(res);
        const gifUrl = res.data.url;
        interaction.reply({
          content: `Voici un gif aléatoire : ${gifUrl}`,
          ephemeral: false,
        });
      }
    });
  },
};
