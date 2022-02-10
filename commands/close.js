const discord = require('discord.js');

module.exports.run = async (client, message, args) => {

    const categoryID = "927193217760391169";

    if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply("Sorry jij kan dit niet doen!");

    if(message.channel.parentId == categoryID) {

        message.channel.delete();

        var embedTicket = new discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL({ size: 4096 }))
        .setTitle("Ticket, " + message.channel.name)
        .setDescription("Het ticket is gemarkeerd als **compleet**")
        .setFooter("Ticket gesloten");

        var ticketChannel = message.member.guild.channels.cache.find(channel => channel.name === "📛home-bot-logs");
        if(!ticketChannel) return message.reply("Het ticket logs kan niet worden gevonden contacteer de bot owner!");

        return ticketChannel.send({ embeds: [embedTicket] });

    }else {
        return message.channel.send("Gelieve dit commando in een ticket kanaal uit te voeren.");
    }

}

module.exports.help = {
    name: "close",
    category: "ticket",
    description: "sluit een ticket"
}

