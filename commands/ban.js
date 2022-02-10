const discord = require('discord.js')

module.exports.run = async (client, message, args) => {

    if (!message.member.permissions.has("BAN_MEMBERS")) return message.reply("Sorry jij kan dit niet doen");

    if (!message.guild.me.permissions.has("BAN_MEMBERS")) return message.reply("Ik heb geen permissions om deze gebruiker te kicken");

    if (!args[0]) return message.reply("Gelieve een gebruiker op te geven");

    if (!args[1]) return message.reply("Gelieve een redenen op te geven");

    var banUser = message.guild.members.cache.get(message.mentions.users.first().id || message.guild.members.get(args[0]).id);
    
    if (!banUser) return message.reply("Sorry kan deze persoon niet vinden");

    if (banUser.permissions.has("MANAGE_MESSAGES")) return message.reply('Ik kan geen moderators bannen.');

    var reason = args.slice(1).join(" ");

    var embedPrompt = new discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle("Gelieve te reageren binnen de 30 seconden")
    .setDescription(`Wil je ${banUser} bannen?`);

    var embed = new discord.MessageEmbed()
    .setColor("RED")
    .setDescription(`**Geband:** ${banUser} (${banUser.id})
    **Geband door:** ${message.author}
    **Reden:** ${reason}`)
    .setFooter(message.member.displayName)
    .setTimestamp();


    message.channel.send({ embeds: [embedPrompt] }).then(async msg => {
 
        let authorID = message.author.id;
        let time = 30;
        let reactions = ["✅", "❌"];
     
        // We gaan eerst de tijd * 1000 doen zodat we seconden uitkomen.
        time *= 1000;
     
        // We gaan iedere reactie meegegeven onder de reactie en deze daar plaatsen.
        for (const reaction of reactions) {
            await msg.react(reaction);
        }
     
        // Als de emoji de juiste emoji is die men heeft opgegeven en als ook de auteur die dit heeft aangemaakt er op klikt
        // dan kunnen we een bericht terug sturen.
        const filter = (reaction, user) => {
            return reactions.includes(reaction.emoji.name) && user.id === authorID;
        };
     
        // We kijken als de reactie juist is, dus met die filter en ook het aantal keren en binnen de tijd.
        // Dan kunnen we bericht terug sturen met dat icoontje dat is aangeduid.
        msg.awaitReactions({ filter, max: 1, time: time }).then(collected => {
            var emojiDetails = collected.first();


            if (emojiDetails.emoji.name === "✅") {
                msg.delete();


                banUser.ban({reason: reason}).catch(err => {
                    if (err) return message.channel.send(`Er is iets foutgegaan`);
                });

                message.channel.send({ embeds: [embed] });

            } else if (emojiDetails.emoji.name === "❌") {

                msg.delete();

                message.channel.send("Ban geanulleerd").then(msg =>{
                    message.delete();
                    setTimeout(() => msg.delete(), 5000); 
                });

            }            
        });
    });
    

}

module.exports.help = {
    name: "ban",
    category: "moderation",
    description: "een gebuiker verbannen"
}

