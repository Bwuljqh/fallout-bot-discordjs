module.exports = {
    name: 'interactionCreate',
    async execute(interaction , client) {
        console.log("Jentre dans interaction event");
        if (interaction.isCommand()) {
            console.log("Jai vérifié si cétait bien une commande");
            //await interaction.deferReply( {ephemeral: false} ).catch(() => {});
            const command = client.commands.get(interaction.commandName);
            if (!command) return await interaction.followUp({content: 'This command no longer exists does not exist'}) && client.commands.delete(interaction.commandName);
            command.execute(client, interaction);
            console.log("Jai passé le intercation event");
        }
    },
};