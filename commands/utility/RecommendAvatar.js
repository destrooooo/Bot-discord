const { SlashCommandBuilder } = require("discord.js");

const data = new SlashCommandBuilder()
  .setName("recommend-avatar")
  .setDescription(
    "Recommande une photo de profil en fonction du nom d'utilisateur."
  )
  .addStringOption((option) =>
    option
      .setName("username")
      .setDescription(
        "Le nom d'utilisateur pour lequel vous souhaitez obtenir une recommandation de photo de profil."
      )
      .setRequired(true)
  );

async function execute(interaction) {
  const username = interaction.options.getString("username");

  try {
    const fetch = await import("node-fetch");
    const response = await fetch.default(
      `https://source.unsplash.com/featured/?${encodeURIComponent(username)}`
    );
    const imageUrl = response.url;

    interaction.reply({
      content: `Voici une photo de profil recommandée pour "${username}": ${imageUrl}`,
      ephemeral: false,
    });
  } catch (error) {
    console.error(error);
    interaction.reply({
      content:
        "Une erreur est survenue lors de la recherche de la photo de profil.",
      ephemeral: true,
    });
  }
}

module.exports = { data, execute };
