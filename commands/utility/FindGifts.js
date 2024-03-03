const { SlashCommandBuilder } = require("discord.js");
const giphy = require("giphy-api")("fw9qFhdRJ4aBx3OqitLCeKSL7C7L4jN0");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("find_gift")
    .setDescription("Recherche un GIF en fonction d'un terme.")
    .addStringOption((option) =>
      option
        .setName("terme")
        .setDescription("Le terme à rechercher")
        .setRequired(true)
    ),
  async execute(interaction) {
    const terme = interaction.options.getString("terme");

    giphy.search({ q: terme, limit: 1 }, (err, res) => {
      if (err) {
        console.error(err);
        interaction.reply({
          content: "Une erreur est survenue lors de la recherche du GIF.",
          ephemeral: true,
        });
      } else {
        const gifUrl = res.data.length ? res.data[0].images.original.url : null;
        if (gifUrl) {
          interaction.reply({
            content: `Voici un GIF correspondant à "${terme}": ${gifUrl}`,
            ephemeral: true,
          });
        } else {
          interaction.reply({
            content: `Aucun GIF trouvé pour le terme "${terme}".`,
            ephemeral: true,
          });
        }
      }
    });
  },
};
