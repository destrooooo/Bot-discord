// const { Events } = require("discord.js");

// module.exports = {
//   name: Events.GuildMemberAdd,
//   execute(newMember) {
//     console.log(newMember);
//     bot.on("guildMemberAdd", (member) => {
//       member.guild.channels.get("channelID").send("Welcome");
//     });
//     const newGuy = GuildMemberAdd.get(user.username);
//     const channel = "1211599095739842663";
//     const victime = "368057423002599435";

//     client.channels.cache
//       .get(`1211599095739842663`)
//       .send(
//         `Ah super,` + newGuy + `est arrivé, hésites pas à harceler ` + victime
//       );
//   },
// };

const { Events } = require("discord.js");

module.exports = {
  name: Events.guildMemberAdd,
  execute(guildMemberAdd) {
    const moment = require("moment"); // To install moment, execute npm install moment

    client.on(guildMemberAdd, (member) => {
      // guildmemberadd is the event which gets triggered if somebody joins your Discord server
      const embed = new Discord.RichEmbed() // Create a new RichEmbed
        .setAuthor(member.user.tag, member.user.displayAvatarURL) // Show the Discord tag of the new member and it's avatar
        .setTitle("Member joined") // Title of the embed
        .setDescription(
          `bonjour ${member}, n'hésite pas à harceler grégoire ${moment(
            member.user.createdTimestamp,
            "X"
          ).fromNow()}`
        ) // Description of the embed
        .setTimestamp()
        .setColor("BLUE")
        .setFooter(`ID: ${member.id}`);

      message.channel
        .find((r) => r.name.toLowerCase() === "général")
        .send({
          // Send the embed to the defined channel
          embed,
        });
    });
  },
};
