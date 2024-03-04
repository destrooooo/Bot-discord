// Modules importation
const { Client, GatewayIntentBits, ChannelType } = require("discord.js");
const sqlite3 = require("sqlite3").verbose();
const config = require("../config.json"); // Charge la configuration depuis config.json

// Database init
let db = new sqlite3.Database(
  "./messages.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error(err.message); // error recognition
    } else {
      console.log("Connected to the messages database."); // connexion test
      // database creation if doesnt exist alrd
      db.run(
        "CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, authorID TEXT, timestamp TEXT, trigger TEXT)"
      );
    }
  }
);

// variable for channels
let commandChannel, citationChannel;

// bot creation with specific intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Event manager
client.once("ready", async () => {
  console.log(`Connecté en tant que ${client.user.tag}!`); // Log pour confirmer que le bot est connecté

  // Récupère la guilde à partir de l'ID spécifié dans config.json
  const guild = client.guilds.cache.get(config.guildId);
  if (!guild) {
    console.log("Guild not found"); // Si la guilde n'est pas trouvée, affiche un message d'erreur
    return;
  }

  // Vérifie l'existence du canal d'explication des commandes ou le crée
  commandChannel = guild.channels.cache.find(
    (channel) => channel.name === "explication-commandes"
  );
  if (!commandChannel) {
    // Crée le canal d'explication des commandes s'il n'existe pas
    try {
      commandChannel = await guild.channels.create({
        name: "explication-commandes",
        type: ChannelType.GuildText,
        reason: "Canal pour expliquer comment utiliser le bot",
      });
      // Envoie un message initial dans le canal
      commandChannel.send(
        "Voici comment vous pouvez utiliser le bot :\n!save <message> pour enregistrer une citation.\n!random pour afficher une citation aléatoire. Pour afficher une citation précise, utiliser le triggerword associé."
      );
    } catch (error) {
      console.error(
        "Erreur lors de la création du canal d'explication des commandes:",
        error
      );
    }
  }

  // Vérifie l'existence du canal des citations ou le crée
  citationChannel = guild.channels.cache.find(
    (channel) => channel.name === "citations-enregistrées"
  );
  if (!citationChannel) {
    // Crée le canal des citations s'il n'existe pas
    try {
      citationChannel = await guild.channels.create({
        name: "citations-enregistrées",
        type: ChannelType.GuildText,
        reason: "Canal pour afficher les citations enregistrées",
      });
      // Envoie un message initial dans le canal des citations
      citationChannel.send("Citations enregistrées :");
    } catch (error) {
      console.error(
        "Erreur lors de la création du canal des citations:",
        error
      );
    }
  }

  // Affichage des citations enregistrées dans la base de données dans le canal des citations
  db.all("SELECT content, authorID, trigger FROM messages", [], (err, rows) => {
    if (err) {
      console.error("Erreur lors de la récupération des citations:", err);
      return;
    }
    if (rows.length) {
      // Envoie chaque citation dans le canal des citations
      rows.forEach((row) => {
        citationChannel.send(
          `${row.content} - <@${row.authorID}> (Trigger-word: ${row.trigger})`
        );
      });
    } else {
      console.log("Aucune citation à envoyer.");
    }
  });
});

// Gestionnaire d'événements pour la création de messages et les commandes !save et !random
client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return; // Ignore les messages des bots ou en dehors des guildes

  // Commande pour enregistrer un nouveau message
  if (message.content.startsWith("!save")) {
    message.channel.send(
      "Veuillez entrer le texte de la citation que vous souhaitez enregistrer :"
    );

    const filter = (m) => m.author.id === message.author.id; // Filtre pour ne capter que les messages de l'auteur de la commande
    try {
      // Attend la réponse de l'utilisateur pour le texte de la citation
      const collectedText = await message.channel.awaitMessages({
        filter,
        max: 1,
        time: 60000,
        errors: ["time"],
      });
      const content = collectedText.first().content;

      // Demande ensuite le trigger word
      message.channel.send(
        "Veuillez maintenant entrer le trigger word pour cette citation :"
      );

      // Attend la réponse de l'utilisateur pour le trigger word
      const collectedTrigger = await message.channel.awaitMessages({
        filter,
        max: 1,
        time: 60000,
        errors: ["time"],
      });
      const trigger = collectedTrigger.first().content;
      console.log(trigger);
      // Insère la citation et le trigger word dans la base de données
      const authorID = message.author.id;
      const timestamp = new Date().toISOString();
      db.run(
        `INSERT INTO messages(content, authorID, timestamp, trigger) VALUES(?, ?, ?, ?)`,
        [content, authorID, timestamp, trigger],
        (err) => {
          if (err) {
            message.reply("Erreur lors de l'enregistrement du message.");
            console.error(`Erreur lors de l'enregistrement : ${err.message}`);
          } else {
            message.reply(
              `Message enregistré avec succès avec le trigger word "${trigger}" !`
            );
            // Envoie également la citation enregistrée dans le canal des citations
            if (citationChannel) {
              citationChannel.send(
                `"${content}" - <@${authorID}> (Trigger-word: ${trigger})`
              );
            } else {
              console.log("Le canal des citations n'a pas été trouvé.");
            }
          }
        }
      );
    } catch (error) {
      message.channel.send("Temps écoulé, aucun message enregistré.");
    }
  } else if (message.content === "!random") {
    // Commande pour afficher une citation aléatoire
    db.get(
      "SELECT * FROM messages ORDER BY RANDOM() LIMIT 1",
      [],
      (err, row) => {
        if (err) {
          console.error(
            `Erreur lors de la récupération d'un message aléatoire : ${err.message}`
          );
          message.reply("Erreur lors de la récupération du message.");
        } else if (row) {
          message.channel.send(`${row.content} - <@${row.authorID}>`);
        } else {
          message.reply("Aucun message enregistré trouvé.");
        }
      }
    );
  }
});

// Un autre gestionnaire d'événements messageCreate pour vérifier les trigger words dans les messages et afficher la citation associée
client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return; // Ignore les messages des bots ou en dehors des guildes

  // Vérifie les triggers pour chaque nouveau message
  db.all("SELECT content, trigger FROM messages", [], (err, rows) => {
    if (err) {
      console.error("Erreur lors de la récupération des triggers :", err);
      return;
    }
    rows.forEach((row) => {
      if (message.content.includes(row.trigger)) {
        message.channel.send(`${row.content} - Déclenché par ${row.trigger}`);
      }
    });
  });
});

// Gestion des erreurs
client.on("error", console.error);
client.on("warn", console.warn);
process.on("unhandledRejection", console.error);

// Connexion du bot à Discord avec le token spécifié dans config.json
client.login(config.token);
