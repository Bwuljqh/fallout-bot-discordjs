const node_dir = require('node-dir');

module.exports = (client) => {
    console.log("Jentre dans command  handler ");
    let commandsFiles = node_dir.files('./commands', {sync:true}).filter(file => file.endsWith('.js'));
    for (const file of commandsFiles) {
        const command = require(`../${file}`);
        client.commands.set(command.data.name, command);

    }
    console.log("Jai passé le command handler");
};