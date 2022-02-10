const discord = require('discord.js');

module.exports.run = async (client, message, args) => {

    const categoryID = "927193217760391169";

    var userName = message.author.username;

    var userDiscriminator = message.author.discriminator;

    var reason = args.join(" ");
    if (!reason) return message.channel.send("Gelieve een redenen mee te geven");

    var ticketBestaat = false;

    message.guild.channels.cache.forEach((channel) => {

        if (channel.name == userName.toLowerCase() + "-" + userDiscriminator) {

            message.channel.send("Je hebt al een ticket aangemaakt.");

            ticketBestaat = true;

            return;

        }

    });

    if (ticketBestaat) return;

    message.guild.channels.create(userName.toLowerCase() + "-" + userDiscriminator, { type: "text" }).then((createChan) => {

        createChan.setParent(categoryID).then((settedParent) => {

            // Perms zodat iedereen niets kan lezen.
            settedParent.permissionOverwrites.edit(message.guild.roles.cache.find(x => x.name === "@everyone"), {

                SEND_MESSAGES: false,
                VIEW_CHANNEL: false

            });

            // READ_MESSAGE_HISTORY Was vroeger READ_MESSAGES
            // Perms zodat de gebruiker die het command heeft getypt alles kan zien van zijn ticket.
            settedParent.permissionOverwrites.edit(message.author.id, {
                CREATE_INSTANT_INVITE: false,
                READ_MESSAGE_HISTORY: true,
                SEND_MESSAGES: true,
                ATTACH_FILES: true,
                CONNECT: true,
                ADD_REACTIONS: true,
                VIEW_CHANNEL: true
            });

            // Perms zodat de gebruikers die admin zijn alles kunnen zien van zijn ticket.
            settedParent.permissionOverwrites.edit(message.guild.roles.cache.find(x => x.name === "Support"), {
                CREATE_INSTANT_INVITE: false,
                READ_MESSAGE_HISTORY: true,
                SEND_MESSAGES: true,
                ATTACH_FILES: true,
                CONNECT: true,
                ADD_REACTIONS: true
            });

            let today = new Date();
            let dd = String(today.getDate()).padStart(2, '0'); // Nul toevoegen als het bv. 1 is -> 01
            let mm = String(today.getMonth() + 1).padStart(2, '0');
            let yyyy = today.getFullYear();
            today = `${dd}/${mm}/${yyyy}`;

            let embedParent = new discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ size: 4096 }))
                .setColor('BLUE')
                .setTitle('Nieuw ticket')
                .addFields(
                    { name: "Reden", value: reason, inline: true },
                    { name: "Aangemaakt op", value: today, inline: true }
                );



            message.channel.send(`✅ Ticket aangemaakt. Bekijk hem in ${channel}`);

            settedParent.send({ embeds: [embedParent] });

        }).catch(err => {
            message.channel.send('❌ Er is iets mis gelopen');
        });

    }).catch(err => {
        message.channel.send('❌ Er is iets mis gelopen');
    });

}

module.exports.help = {
    name: "new",
    category: "ticket",
    description: "Maak een ticket"
}

