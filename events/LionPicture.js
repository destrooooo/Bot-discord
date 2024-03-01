const { Events } = require("discord.js");

module.exports = {
  name: Events.MessageCreate,
  execute(message) {
    const triggerWords = ["Lion", "Lionceau", "Lionne", "lion"];

    if (message.author.bot) return false;

    triggerWords.forEach((word) => {
      if (message.content.includes(word)) {
        message.reply(
          "https://imgs.search.brave.com/DX3XBW2pjhJUkb7QrmA2FXArBFF6zsVQVFItU2hLlEc/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvQUIy/Njk2My9mci9waG90/by9saW9uLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz05ME9D/WVhJQ3RyX041d1lL/a2VIWUEyc2poYkVp/UldBUlZ3Z2lGU0Ny/aDJ3PQ"
        );
      }
    });

    if (message.author.id == "1211597000152322090") {
      message.reply("Lion");
    }
  },
};
