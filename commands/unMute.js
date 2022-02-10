const fs = require("fs");
const tempMute = JSON.parse(fs.readFileSync("./tempMutes.json", "utf8"));

module.exports.run = async (client, message, args) => {

    //tempmute gebruiker tijd(h,m,s)

    if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply("Sorry jij kan dit niet doen.");

    if (!args[0]) return message.reply("Gebruiker niet gevonden.");

    var mutePerson = message.guild.members.cache.get(message.mentions.users.first().id || message.guild.members.get(args[0]).id);

    if (!mutePerson) return message.reply("Gebruiker niet gevonden.");

    if (mutePerson.permissions.has("MANAGE_MESSAGES")) return message.reply("Je kan andere moderators/admins niet muten.");

    let muteRole = message.guild.roles.cache.get("896750620835479592");

    if (!muteRole) return message.channel.send("De rol Muted bestaat niet contacteer de bot owner.");


    if (!mutePerson.roles.cache.some(role => role.name === "Muted")) {
        message.channel.send("Deze persoon is al geunmuted!");
    } else {
        mutePerson.roles.remove(muteRole.id);
        message.channel.send(`${mutePerson} is geunmute`);

        tempMute[mutePerson].time = 0;

        fs.writeFile("./tempMutes.json", JSON.stringify(tempMute), (err) => {
            if (err) console.log(err)
        });

    }

}

module.exports.help = {
    name: "unmute",
    category: "moderation",
    description: "Geef een unmute aan een persoon"
}

