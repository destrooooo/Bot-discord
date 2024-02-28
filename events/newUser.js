const { Events } = require("discord.js");

module.exports = {
  name: Events.GuildMemberAdd,
  execute(message) {
    bot.on("guildMemberAdd", (member) => {
      member.guild.channels.get("channelID").send("Welcome");
    });
    const newGuy = GuildMemberAdd.get(user.username);
    const channel = "1211599095739842663";
    const victime = "368057423002599435";

    client.channels.cache
      .get(`1211599095739842663`)
      .send(
        `Ah super,` + newGuy + `est arrivé, hésites pas à harceler ` + victime
      );
  },
};
