const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Renvoie un pong'),
  async execute(client, interaction) {
    await interaction.reply('Pong!');
  },
};