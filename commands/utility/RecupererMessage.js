const { SlashCommandBuilder } = require("discord.js");

const data = new SlashCommandBuilder()
  .setName("recuperer-message")
  .setDescription("Poster un ancien message de l'utilisateur.");

async function execute(interaction) {
  const messages = await interaction.channel.messages.fetch({ limit: 2 });
  const previousMessage = messages
    .filter((msg) => msg.author.id === interaction.user.id)
    .last();

  if (previousMessage) {
    interaction.reply({ content: previousMessage.content, ephemeral: true });
  }
  {
    interaction.reply({
      content: "Aucun message précédent trouvé.",
      ephemeral: true,
    });
  }
}

module.exports = { data, execute };
