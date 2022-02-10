const discord = require('discord.js')

module.exports.run = async (client, message, args) => {


    if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply("Sorry jij kan dit niet doen");

    var mes = new discord.MessageEmbed()
        .setTitle("UNCLAIMED")
        .setDescription("Dit ticket is niet meer geclaimd. En kan weer worden geclaimd!")
        .setColor("#00ffb7")
        .setFooter(`${message.author.username} heeft het ticket geunclaimd!`)

    message.channel.send({ embeds: [mes] });

    message.delete();

}

module.exports.help = {
    name: "unclaim",
    category: "ticket",
    description: "unclaim een ticket"
}
