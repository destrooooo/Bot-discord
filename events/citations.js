// Importing necessary modules from discord.js and initializing sqlite3 for database management
const { Client, GatewayIntentBits, ChannelType } = require("discord.js");
const sqlite3 = require("sqlite3").verbose();
const config = require("../config.json"); // Load the configuration from config.json

// Initializing the SQLite database with an additional 'posted' column to track message status
let db = new sqlite3.Database(
  "./messages.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error(`Database connection error: ${err.message}`); // Displays errors related to database connection
    } else {
      console.log("Connected to the messages database."); // Confirms successful database connection
      // Creates the messages table if it does not already exist, including a 'posted' flag
      db.run(
        "CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, authorID TEXT, timestamp TEXT, trigger TEXT, posted INTEGER DEFAULT 0)"
      );
    }
  }
);

// Variables to store references to created channels
let commandChannel, citationChannel;

// Creating the bot with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Event handler that runs once the bot is ready
client.once("ready", async () => {
  console.log(`Connected as ${client.user.tag}!`); // Log to confirm the bot is connected

  // Retrieves the guild from the ID specified in config.json
  const guild = client.guilds.cache.get(config.guildId);
  if (!guild) {
    console.log("Guild not found"); // Displays an error message if the guild is not found
    return;
  }

  // Checks for the existence of the command explanation channel or creates it
  commandChannel = await getOrCreateChannel(
    guild,
    "explication-commandes",
    "Channel to explain how to use the bot"
  );
  commandChannel.send(
    "Here is how you can use the bot:\n!save <message> to save a quote.\n!random to display a random quote.\nTo display a specific quote, use the associated trigger word."
  );

  // Checks for the existence of the quotes channel or creates it
  citationChannel = await getOrCreateChannel(
    guild,
    "citations-enregistrées",
    "Channel to display saved quotes"
  );

  // Displaying the saved quotes from the database in the quotes channel if not already posted
  postUnpostedMessages();
});

// Function to get or create a channel by name
async function getOrCreateChannel(guild, channelName, reason) {
  let channel = guild.channels.cache.find(
    (channel) =>
      channel.name === channelName && channel.type === ChannelType.GuildText
  );
  if (!channel) {
    try {
      channel = await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        reason: reason,
      });
    } catch (error) {
      console.error(`Error while creating the ${channelName} channel:`, error);
    }
  }
  return channel;
}

// Function to post messages that haven't been posted yet
function postUnpostedMessages() {
  db.all("SELECT * FROM messages WHERE posted = 0", [], (err, rows) => {
    if (err) {
      console.error("Error retrieving unposted quotes:", err);
      return;
    }
    rows.forEach((row) => {
      citationChannel
        .send(
          `${row.content} - <@${row.authorID}> (Trigger-word: ${row.trigger})`
        )
        .then(() => {
          db.run(
            "UPDATE messages SET posted = 1 WHERE id = ?",
            [row.id],
            (updateErr) => {
              if (updateErr) {
                console.error("Error updating the 'posted' flag:", updateErr);
              }
            }
          );
        })
        .catch((sendErr) => {
          console.error(
            "Error sending message to the quotes channel:",
            sendErr
          );
        });
    });
  });
}

// Handling message creation, including !save and !random commands
client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return; // Ignores messages from bots or outside guilds

  if (message.content.startsWith("!save")) {
    handleSaveCommand(message);
  } else if (message.content === "!random") {
    displayRandomQuote(message);
  }
});

// Function to handle the save command
async function handleSaveCommand(message) {
  message.channel.send("Please enter the text of the quote you want to save:");

  const filter = (m) => m.author.id === message.author.id;
  try {
    const collectedText = await message.channel.awaitMessages({
      filter,
      max: 1,
      time: 60000,
      errors: ["time"],
    });
    const content = collectedText.first().content;

    message.channel.send("Please now enter the trigger word for this quote:");

    const collectedTrigger = await message.channel.awaitMessages({
      filter,
      max: 1,
      time: 60000,
      errors: ["time"],
    });
    const trigger = collectedTrigger.first().content;

    const authorID = message.author.id;
    const timestamp = new Date().toISOString();

    db.run(
      "INSERT INTO messages(content, authorID, timestamp, trigger, posted) VALUES(?, ?, ?, ?, 0)",
      [content, authorID, timestamp, trigger],
      (err) => {
        if (err) {
          message.reply("Error while saving the message.");
          console.error(`Error while saving: ${err.message}`);
        } else {
          message.reply(
            `Message successfully saved with the trigger word "${trigger}"!`
          );
          // Optionally, immediately post the message to the quotes channel
          citationChannel.send(
            `${content} - <@${authorID}> (Trigger-word: ${trigger})`
          );
        }
      }
    );
  } catch (error) {
    message.channel.send("Time expired, no message saved.");
  }
}

// Function to display a random quote
function displayRandomQuote(message) {
  db.get("SELECT * FROM messages ORDER BY RANDOM() LIMIT 1", [], (err, row) => {
    if (err) {
      console.error("Error retrieving a random message:", err.message);
      message.reply("Error retrieving the message.");
    } else if (row) {
      message.channel.send(`${row.content} - <@${row.authorID}>`);
    } else {
      message.reply("No saved messages found.");
    }
  });
}

// Error handling
client.on("error", console.error);
client.on("warn", console.warn);
process.on("unhandledRejection", console.error);

// Connecting the bot to Discord with the token specified in config.json
client.login(config.token);
