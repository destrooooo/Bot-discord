const { SlashCommandBuilder } = require("discord.js");

const data = new SlashCommandBuilder()
  .setName("find_book_by_words")
  .setDescription("Recommande un livre en fonction du mot clé du livre donné.")
  .addStringOption((option) =>
    option
      .setName("mot-cle")
      .setDescription(
        "Le mot clé du livre pour lequel vous souhaitez obtenir une recommandation."
      )
      .setRequired(true)
  );

async function execute(interaction) {
  const motCle = interaction.options.getString("mot-cle");

  try {
    const response = await globalThis.fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        motCle
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
      const bookDescription =
        randomBook.description ||
        (randomBook.description
          ? randomBook.description
          : "Aucune description disponible.");
      interaction.reply({
        content: `Je vous recommande "${bookTitle}" par ${bookAuthors}.\n\nDescription : ${bookDescription}`,
        ephemeral: false,
      });
    } else {
      interaction.reply({
        content: `Aucun livre trouvé pour le mot clé "${motCle}".`,
        ephemeral: true,
      });
    }
  } catch (error) {
    console.error(error);
    interaction.reply({
      content: "Une erreur est survenue lors de la recherche du livre.",
      ephemeral: true,
    });
  }
}

module.exports = { data, execute };
