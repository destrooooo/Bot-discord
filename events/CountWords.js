const { Events, Collection } = require("discord.js");

// Map to store the words used by each user
const userWordCounts = new Collection();

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    // Checks if the message is from a bot or if it's not from a server (e.g., private message)
    if (message.author.bot || !message.guild) return;

    // Retrieves the user who sent the message
    const user = message.author;

    // Retrieves the content of the message and splits it into words
    const words = message.content.toLowerCase().split(/\s+/);

    // Updates the count of each word for the user
    words.forEach((word) => {
      if (!userWordCounts.has(user.id)) {
        userWordCounts.set(user.id, new Collection());
      }

      const userWordCount = userWordCounts.get(user.id);
      const count = userWordCount.has(word) ? userWordCount.get(word) + 1 : 1;
      userWordCount.set(word, count);
    });

    // Finds the most used word by the user
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

    // Sends the user's most used word in the specific channel
    if (mostUsedWord !== "") {
      const channel = message.guild.channels.cache.find(
        (ch) => ch.name === "general"
      );
      if (!channel)
        return console.error("The specified channel cannot be found.");

      channel.send(
        `${user.username}'s most used word: ${mostUsedWord} (${highestCount} times)`
      );
      console.log(Collection);
    }
  },
};
