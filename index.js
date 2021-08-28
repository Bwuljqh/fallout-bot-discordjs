require('dotenv').config();

const { Client, Intents, Collection } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
module.exports = client;

const TOKEN = process.env.TOKEN;

client.commands = new Collection();

//fetch the modules from /handlers, they will register all the commands and events
['Events', 'Commands'].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

//Connect the bot to discord
client.login(TOKEN);