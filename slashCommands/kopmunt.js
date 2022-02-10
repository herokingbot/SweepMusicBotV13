const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('kopmunt')
        .setDescription('Doe kop of munt met de bot.'),
    async execute(client, interaction) {

        var values = ["Kop", "Munt",];

        var result = values[Math.floor(Math.random() * values.length)];

        return interaction.reply(`🎖️ je hebt **${result}** gegooid!`);

    }
}

