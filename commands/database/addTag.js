const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bender_addtag")
    .setDescription("Use it to test a post request")

    .addStringOption(option =>
      option
        .setName("name")
        .setDescription("Name of the tag to save")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("description")
        .setDescription("Description of the tag to save")
        .setRequired(true)
    ),
  async execute(interaction) {}
};
