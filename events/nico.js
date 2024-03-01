const { Events } = require("discord.js");

module.exports = {
  name: Events.MessageCreate,
  execute(message) {
    const triggerWords = ["Grégoire", "Greg", "gregoire", "grégoire", "greg"];

    if (message.author.bot) return false;

    triggerWords.forEach((word) => {
      if (message.content.includes(word)) {
        message.reply(
          "https://cdn.discordapp.com/attachments/1211599095739842663/1211632876248891462/nique-gregoire.png?ex=65eee80c&is=65dc730c&hm=6197ea4db89019b8a582145c27c9c5fe3dff9aa58dc81f5e51bf7eb23d4c1acf&"
        );
      }
    });

    if (message.author.id == 142335378064408585) {
      message.reply("Ta gueule");
    }
  },
};
