const node_dir = require('node-dir');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

require('dotenv').config();
const clientId = process.env.CLIENT_ID;
const token = process.env.TOKEN;
const guildId = process.env.GUILD_ID;

const commands = [];

//fetch all files recursively in commands directory, return only files that ends with '.js'
let commandFiles = node_dir.files('./commands', {sync:true}).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./${file}`);
    //Check if data exits for the command, this is currently bad practice but it's working
    if (!(command.data === undefined)){
        commands.push(command.data.toJSON());
        console.log("command to add: " + command.data.name );
    }
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        if (commands.length !== 0) {
        await rest.put(
            //add the commands to discord

            //Routes.applicationCommands(clientId), //Global command deployment
            Routes.applicationGuildCommands(clientId, guildId), //Server command deployment
            { body: commands },
            );
            console.log('Successfully registered application commands.');
        } else console.log('No command added');
    } catch (error) {
        console.error(error);
    }
})();