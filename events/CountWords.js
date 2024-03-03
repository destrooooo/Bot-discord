const { Events, Collection } = require("discord.js");

// Map pour stocker les mots utilisés par chaque utilisateur
const userWordCounts = new Collection();

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    // Vérifie si le message provient d'un bot ou s'il ne provient pas d'un serveur (par exemple, message privé)
    if (message.author.bot || !message.guild) return;

    // Récupère l'utilisateur qui a envoyé le message
    const user = message.author;

    // Récupère le contenu du message et le divise en mots
    const words = message.content.toLowerCase().split(/\s+/);

    // Met à jour le nombre d'occurrences de chaque mot pour l'utilisateur
    words.forEach((word) => {
      if (!userWordCounts.has(user.id)) {
        userWordCounts.set(user.id, new Collection());
      }

      const userWordCount = userWordCounts.get(user.id);
      const count = userWordCount.has(word) ? userWordCount.get(word) + 1 : 1;
      userWordCount.set(word, count);
    });

    // Trouve le mot le plus utilisé par l'utilisateur
    let mostUsedWord = "";
    let highestCount = 0;
    userWordCounts.get(user.id).forEach((count, word) => {
      if (count > highestCount) {
        mostUsedWord = word;
        highestCount = count;
      }
      console.log(mostUsedWord);
      console.log(highestCount);
    });

    // Envoie le mot le plus utilisé par l'utilisateur dans le canal spécifique
    if (mostUsedWord !== "") {
      const channel = message.guild.channels.cache.find(
        (ch) => ch.name === "général"
      );
      if (!channel) return console.error("Le canal spécifié est introuvable.");

      channel.send(
        `${user.username}'s most used word: ${mostUsedWord} (${highestCount} times)`
      );
      console.log(Collection);
    }
  },
};
