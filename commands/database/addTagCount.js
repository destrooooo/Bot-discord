const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bender_addtagcount")
    .setDescription("Use it to test a put request")

    .addStringOption(option =>
      option
        .setName("name")
        .setDescription("Name of the tag to update")
        .setRequired(true)
    ),
  async execute(interaction) {}
};
