const { Events } = require("discord.js");

module.exports = {
  name: Events.MessageCreate,
  execute(message) {
    const triggerWords = [
      "mathias",
      "math",
      "Math",
      "Matthias",
      "Mathias",
      "matthias",
      "matias",
      "Matias",
      "Mattias",
      "mattias",
    ];

    if (message.author.bot) return false;

    triggerWords.forEach((word) => {
      if (message.content.includes(word)) {
        // const gifList = [
        //   "https://tenor.com/fr/view/among-us-sus-discord-speech-bubble-among-us-discord-speech-bubble-ok-man-gif-7378430653913901797",
        //   "https://tenor.com/fr/view/mod-discord-mod-nerd-glasses-speech-bubble-gif-27462011",
        //   "https://tenor.com/fr/view/i-am-a-surgeon-dr-han-the-good-doctor-discord-bubble-discord-speech-bubble-gif-1845193550933450334",
        //   "https://tenor.com/fr/view/rat-showering-rat-shower-discord-discord-speech-bubble-gif-27671546",
        //   "https://tenor.com/fr/view/speech-bubble-speechbubble-discord-fish-meme-gif-802733525061050978",
        //   "https://tenor.com/fr/view/pass-the-banana-gif-23869409",
        //   "https://tenor.com/fr/view/kumala-savesta-kumalala-didnt-read-gif-25863481",
        //   "https://tenor.com/fr/view/arrow-loser-above-up-gif-21639973",
        //   "https://tenor.com/fr/view/cat-shut-up-gif-25699987",
        //   "https://tenor.com/fr/view/teletubbies-dies-of-cringe-meme-gif-27676616",
        //   "https://tenor.com/fr/view/dont-care-didnt-ask-didnt-ask-invisible-meme-discord-invisible-image-gif-25053275",
        // ];

        // message.reply(gifList[Math.floor(Math.random() * gifList.length)]);
        message.reply(
          "https://tenor.com/fr/view/rat-showering-rat-shower-discord-discord-speech-bubble-gif-27671546"
        );
      }
    });

    // if (message.author.id == 277397009286168576) {
    //   message.reply(
    //     "https://tenor.com/view/nerding-speech-bubble-pepe-nerd-gif-26077806"
    //   );
    // }
  },
};
