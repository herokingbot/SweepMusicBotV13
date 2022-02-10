const fs = require("fs");
const discord = require("discord.js"); 

module.exports.run = async (client, message, args) => {

    if(!message.member.permissions.has("KICK_MEMBERS")) return message.reply("Sorry jij kan dit niet doen.");

    if (!args[0]) return message.reply("Gebruiker niet gevonden.");

    if (!args[1]) return message.reply("Je hebt geen reden meegegeven");

    var warnUser = message.guild.members.cache.get(message.mentions.users.first().id || message.guild.members.get(args[0]).id);

    var reason = args.slice(1).join(" ");

    if(!warnUser) return message.reply("Gebruiker niet gevonden.");

    if(warnUser.permissions.has("MANAGE_MESSAGES")) return message.reply("Je kan andere moderators/admins niet waarschuwen.");

    const warns = JSON.parse(fs.readFileSync("./warnings.json", "UTF8"));

    if (!warns[warnUser.id]) warns[warnUser.id] = {
        warns: 0
    }
    

    warns[warnUser.id].warns++;

    var embed = new discord.MessageEmbed()
    .setColor("#ff0000")
    .setFooter(message.member.displayName, message.author.displayAvatarURL)
    .setTimestamp()
    .setDescription(`**Gewarnd:** ${warnUser.user.username} (${warnUser.id})
        **Warning door:** ${message.author}
        **Reden: ** ${reason}`)
    .addField("Aantal warns", warns[warnUser.id].warns.toString());

    const channel = message.member.guild.channels.cache.get("929863998650875994");

    if(!channel) return;

    channel.send({embeds: [embed] });

    if (warns[warnUser.id].warns == 5) {
 
        var mes = new discord.MessageEmbed()
            .setDescription("PAS OP " + warnUser.user.username)
            .setColor("#ee0000")
            .addField("Bericht", "Nog 5 warns en je hebt een ban!! Pas dus op!!");
     
        message.channel.send({ embeds: [mes] });

        
     
    } else if (warns[warnUser.id].warns == 10) {
     
        message.guild.members.ban(warnUser, { reason: reason });
        message.channel.send(`${warnUser} Heeft 10 warns en is dus verbannen`);
     
    }

    fs.writeFile("./warnings.json", JSON.stringify(warns), (err) => {
        if (err) console.log(err);
    });

}



module.exports.help = {
    name: "warn",
    category: "moderation",
    description: "Waarschuwd een gebruiker"
}



