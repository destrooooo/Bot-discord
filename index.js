// Import required packages & token
const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  Collection,
  GatewayIntentBits,
  ButtonStyle,
} = require("discord.js");
const { token } = require("./config.json");
const { EmbedBuilder, ButtonBuilder } = require("@discordjs/builders");

// Create a new client to run the bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Create a command collection
client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

// Get the individual commands from their respective subfolder inside "commands"
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

// Get the events from the "event" folder
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Run the specified command
client.on("interactionCreate", async (interaction) => {
  try {
    if (interaction.isCommand()) {
      // Fetch the command in the Collection with that name and assign it to the variable command
      const command = client.commands.get(interaction.commandName);
      // If command does not exist, return
      if (!command) return;
      await command.execute(interaction);
    }

    if (interaction.isButton()) {
      // Get the message that was interacted with
      const message = interaction.message;
      const messageID = message.id;

      // Get the search result for that message from the resultMap
      const searchResult = await resultMap.get(messageID);
      if (interaction.customId === "prev") {
        searchResult.prevSearch();
      } else if (interaction.customId === "next") {
        searchResult.nextSearch();
      }

      // Update the embed with information from new image
      const oldEmbed = message.embeds[0];
      const newEmbed = new EmbedBuilder(oldEmbed)
        .setDescription(
          `Result ${searchResult.currentResult + 1} of ${
            searchResult.resultArray.length
          }`
        )
        // .spliceFields(0, 1, {
        //   name: searchResult.currentSearch().title,
        //   value: searchResult.currentSearch().displayLink,
        // })

        .spliceFields(
          0,
          1,
          { name: "Title", value: searchResult.currentSearch().title },
          { name: "Link", value: searchResult.currentSearch().displayLink }
        )

        .setImage(await searchResult.currentSearch().link);

      // Update the "View Original" button to point to the new image
      const actionRow = message.components[0];
      actionRow.spliceComponents(
        2,
        1,
        new ButtonBuilder()
          .setLabel("View Original")
          .setStyle(ButtonStyle.Primary)
          .setURL(searchResult.currentSearch().image.contextLink)
      );

      // Edit the original message
      await interaction.update({ embeds: [newEmbed], components: [actionRow] });
      return;
    }
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(token);
