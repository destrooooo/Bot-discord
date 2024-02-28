const { Events } = require("discord.js");
const { Tags } = require("../dbObjects.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === "bender_addtag") {
      const tagName = interaction.options.getString("name");
      const tagDescription = interaction.options.getString("description");

      try {
        // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
        const tag = await Tags.create({
          name: tagName,
          description: tagDescription,
          username: interaction.user.username
        });

        return interaction.reply(`Tag ${tag.name} added.`);
      } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
          return interaction.reply("That tag already exists.");
        }

        return interaction.reply("Something went wrong with adding a tag.");
      }
    } else if (commandName === "bender_getalltags") {
      // equivalent to: SELECT * FROM tags;
      const tagList = await Tags.findAll({
        attributes: ["name", "usage_count"]
      });
      const tagString =
        tagList.map(tag => tag.name + tag.usage_count).join(", ") ||
        "No tags set.";

      return interaction.reply(`List of tags: ${tagString}`);
    } else if (commandName === "bender_addtagcount") {
      const tagName = interaction.options.getString("name");
      const tag = await Tags.findOne({ where: { name: tagName } });

      if (tag != null) {
        tag.increment("usage_count");
        return interaction.reply(`Tag ${tagName} usage count incremented.`);
      } else {
        return interaction.reply(`No tag with name ${tagName} found.`);
      }
    }
  }
};
