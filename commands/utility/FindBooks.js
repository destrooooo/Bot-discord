const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("find_books")
    .setDescription(
      "Recommande un livre similaire en fonction du nom d'un livre donné."
    )
    .addStringOption((option) =>
      option
        .setName("livre")
        .setDescription(
          "Le nom du livre pour lequel vous souhaitez obtenir une recommandation."
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    const livre = interaction.options.getString("livre");

    try {
      const response = await globalThis.fetch(
        `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(
          livre
        )}`
      );
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.items.length);
        const randomBook = data.items[randomIndex].volumeInfo;
        const bookTitle = randomBook.title;
        const bookAuthors = randomBook.authors
          ? randomBook.authors.join(", ")
          : "Inconnu";
        const bookDescription = randomBook.description || "Bonne lecture";
        interaction.reply({
          content: `Je vous recommande "${bookTitle}" par ${bookAuthors}.\n\nDescription : ${bookDescription}`,
          ephemeral: false,
        });
      } else {
        interaction.reply({
          content: `Aucun livre trouvé pour "${livre}".`,
          ephemeral: false,
        });
      }
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: "Une erreur est survenue lors de la recherche du livre.",
        ephemeral: false,
      });
    }
  },
};
