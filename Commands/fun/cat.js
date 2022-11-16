const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "cat",
    data: new SlashCommandBuilder()
        .setName("cat")
        .setDescription('Shows a random image of a cat.'),
    async execute(client, interaction) {
        const res = await axios.get(`https://api.thecatapi.com/v1/images/search`);
        const image = res.data[0].url;

        const embed = new EmbedBuilder()
            .setColor(client.getRandomColor())
            .setTitle('🐱 Just a cat :')
            .setImage(image)
            .setTimestamp()
            .setFooter({ text: "He's cute isn't he?" });

        await interaction.reply({ embeds: [ embed ] });
    },
};
