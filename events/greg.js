const { Events } = require("discord.js");

module.exports = {
  name: Events.MessageCreate,
  execute(message) {
    const triggerWords = [
      "Gregoire",
      "Grégoire",
      "Greg",
      "grégoire",
      "gregoire",
      "greg",
    ];

    if (message.author.bot) return false;

    triggerWords.forEach((word) => {
      if (message.content.includes(word)) {
        message.reply("Est un déchet");
      }
    });

    if (message.author.id == 368057423002599435) {
      message.reply(
        "https://tenor.com/view/pacman-nerd-nerd-emoji-nerd-alert-gif-25980639"
      );
    }
  },
};
