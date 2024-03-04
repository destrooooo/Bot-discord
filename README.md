# Destrotest Bot

Discord Bot that does several things :

1. Allows users to save messages and images in a database and call them with a pre-determined trigger.

- to save a message, use the command "!save", when prompted, enter the message you want to save (can also be a link), then a prompt will ask for a trigger, enter it (can also be a link)
- to call a saved message, just type the trigger
- you can call a random saved message with the command "!random"
- you can see all saved messages in the "citations-enregistrées" channel along with their associated trigger
- each time a message is saved, it will appear along with its associated trigger in the "citations-enregistrées" channel
- you can see the bot commands in the "explication-commande" channel
- if these channels do not exist, the bot will automatically create them
- the bots database is named messages.db and will automatically be created if it does not exist

2. Allows users to search for images directly via the google image API

- use the command "/françois_search" to call the bot
- search for images in the prompt window.
- Have up to 10 results

3. Get a Lion pic just by saying Lion

4. Get a book recommendation by mentioning the title of a similar book

5. Find a random books by author

6. Find a book with a single word

7. Find Gif using a single word

8. Get a random gif

9. Acknowledge which word you’re saying the most (do no try to be obscene, it works...)

## How to install

- git clone https://github.com/destrooooo/Bot-discord.git

- npm i to install dependencies (the list of dependencies is described below)

"@google-cloud/translate": "^8.1.0",
"axios": "^1.6.7",
"discord-api-types": "^0.37.71",
"discord.js": "^14.14.1",
"dotenv": "^16.4.5",
"gaxios": "^6.3.0",
"giphy-api": "^2.0.2",
"google-books-search": "^0.3.1",
"googleapis": "^133.0.0",
"keyv": "^4.5.4",
"node-fetch": "^3.3.2",
"request": "^2.88.2",
"sequelize": "^6.37.1",
"sqlite3": "^5.1.7"

- get the config.json available on the google drive, don’t forget to change guildID in the process
