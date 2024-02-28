const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bender_getalltags")
    .setDescription("Use it to test a get request"),
  async execute(interaction) {}
};
