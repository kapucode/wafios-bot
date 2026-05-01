const { Client, GatewayIntentBits, Collection, Partials } = require("discord.js");
const bootstrap = require('./commands/utils/bootstrap.js')
const fs = require("fs");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction
  ]
});

// Coleções
client.prefixCommands = new Collection();
client.slashCommands = new Collection();
client.buttons = new Collection(); // ← NOVO: coleção para botões

// Carregar comandos prefix
const prefixFiles = fs.readdirSync("./commands/prefix").filter(f => f.endsWith(".js"));
for (const file of prefixFiles) {
  const command = require(`./commands/prefix/${file}`);
  client.prefixCommands.set(command.name, command)
  
  // 🔥 registrar aliases
  if (command.aliases) {
    for (const alias of command.aliases) {
      client.prefixCommands.set(alias, command);
    }
  }
}

// Carregar comandos slash
const slashFiles = fs.readdirSync("./commands/slash").filter(f => f.endsWith(".js"));
for (const file of slashFiles) {
  const command = require(`./commands/slash/${file}`);
  client.slashCommands.set(command.data.name, command);
}

// Caregar botões
const buttonFiles = fs.readdirSync("./buttons").filter(f => f.endsWith(".js"));
for (const file of buttonFiles) {
  const button = require(`./buttons/${file}`);
  client.buttons.set(button.id, button);
}

// Carregar eventos
const eventFiles = fs.readdirSync("./events").filter(f => f.endsWith(".js"));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

async function start() {
  await bootstrap(client)
  client.isReady = true

  await client.login(process.env.TOKEN)
}

start()