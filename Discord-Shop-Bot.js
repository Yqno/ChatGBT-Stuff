const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// Prefix für die Slash Commands
const prefix = '!';

// Anzahl der Nachrichten, nach denen ein Coin vergeben wird
const messageThreshold = 10;

// Rolle für den Zugang zum Shop
const roleID = 'Rollen-ID';

// Kanal-ID des Spam-Kanals, in dem keine Coins vergeben werden
const spamChannelID = 'Kanal-ID';

// Startguthaben für jeden neuen Nutzer
const startingBalance = 100;

// Objekt für das Shop-System
const shopItems = {
  item1: { name: 'Item 1', price: 50 },
  item2: { name: 'Item 2', price: 100 },
  item3: { name: 'Item 3', price: 150 },
};

client.on('ready', () => {
  console.log(`Eingeloggt als ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'shop') {
    const embed = {
      title: 'Shop',
      description: 'Hier gibt es einige Gegenstände, die du kaufen kannst:',
      fields: [
        {
          name: shopItems.item1.name,
          value: `${shopItems.item1.price} Coins`,
          inline: true,
        },
        {
          name: shopItems.item2.name,
          value: `${shopItems.item2.price} Coins`,
          inline: true,
        },
        {
          name: shopItems.item3.name,
          value: `${shopItems.item3.price} Coins`,
          inline: true,
        },
      ],
    };

    interaction.reply({ embeds: [embed] });
  }
});

client.on('messageCreate', async (message) => {
  if (message.channel.id === spamChannelID) return;

  const userID = message.author.id;

  // Überprüfe, ob der Nutzer die benötigte Rolle hat, um im Shop einkaufen zu können
  const member = await message.guild.members.fetch(userID);
  if (!member.roles.cache.has(roleID)) return;

  // Füge dem Nutzer alle 10 Nachrichten einen Coin hinzu
  if (message.member.roles.cache.has(roleID)) {
    const coins = getUserCoins(userID);
    if ((coins + 1) % messageThreshold === 0) {
      addCoins(userID, 1);
      message.reply('Du hast einen Coin erhalten!');
    }
  }

  // Überprüfe, ob die Nachricht ein Slash-Command ist
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'balance') {
        const coins = getUserCoins(userID);

    message.reply(`Du hast ${coins} Coins auf deinem Konto.`);
  }

  if (command === 'buy') {
    const item = args[0];
    const coins = getUserCoins(userID);

    if (!item) {
      message.reply('Bitte gib einen Gegenstand an, den du kaufen möchtest.');
      return;
    }

    if (!shopItems[item]) {
      message.reply('Dieser Gegenstand ist nicht im Shop erhältlich.');
      return;
    }

    if (coins < shopItems[item].price) {
      message.reply('Du hast nicht genug Coins, um diesen Gegenstand zu kaufen.');
      return;
    }

    subtractCoins(userID, shopItems[item].price);
    message.reply(`Du hast ${shopItems[item].name} gekauft!`);
  }
});

// Funktion zum Hinzufügen von Coins zu einem Nutzer
function addCoins(userID, amount) {
  // Hier müsstest du deine eigene Implementierung zum Speichern der Coins verwenden
}

// Funktion zum Abziehen von Coins von einem Nutzer
function subtractCoins(userID, amount) {
  // Hier müsstest du deine eigene Implementierung zum Speichern der Coins verwenden
}

// Funktion zum Abrufen der Anzahl von Coins eines Nutzers
function getUserCoins(userID) {
  // Hier müsstest du deine eigene Implementierung zum Speichern der Coins verwenden
}

client.login('DEIN_DISCORD_BOT_TOKEN');

