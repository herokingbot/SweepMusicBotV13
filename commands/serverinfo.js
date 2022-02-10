const discord = require("discord.js");

module.exports.run = async (client, message, args) => {

    var botEmbed = new discord.MessageEmbed()
    .setTitle("Commands")
    .setDescription("Hieronder zie je info over de server.")
    .setColor("DARK_GOLD")
    .setTimestamp()
    .setFooter("You can also use any command as a slash command.")
    .addFields(
        {name:"Bot naam", value:client.user.username},
        {name:"Je bent de server gejoined op", value: message.member.joinedAt.toString() },
        {name:"Totaal Members", value: message.guild.memberCount.toString() }
    );




    return message.channel.send({ embeds: [botEmbed] });
}

module.exports.help = {
    name: "serverinfo",
    category: "info",
    description: "Geeft info over de server"
}