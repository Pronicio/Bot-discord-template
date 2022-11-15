const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    name: "ping",
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Basic command to ping the bot.'),
    async execute(client, interaction) {
        await interaction.reply(`Pong ! Bot's latency : **${Math.round(client.ws.ping)}ms**`);
    },
};
