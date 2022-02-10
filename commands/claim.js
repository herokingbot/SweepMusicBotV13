const discord = require('discord.js')

module.exports.run = async (client, message, args) => {


    if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply("Sorry jij kan dit niet doen");

    var mes = new discord.MessageEmbed()
        .setTitle("CLAIMED")
        .setDescription("Dit ticket is geclaimd!")
        .setColor("#00ffb7")
        .setFooter(`${message.author.username} heeft het ticket geclaimd!`)

    message.channel.send({ embeds: [mes] });

    message.delete();

}

module.exports.help = {
    name: "claim",
    category: "ticket",
    description: "claim een ticket"
}
