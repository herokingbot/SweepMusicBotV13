const botConfig = require("../botConfig.json");

module.exports.run = async (client, message, args) => {

    try {

        var prefix = botConfig.prefix;

        var respone = "**Bot Commands**\r\n\n";
        var general = "**__Algemeen__**\r\n";
        var info = "**__Informatie__**\r\n";
        var ticket = "**__Ticket__**\r\n";
        var moderation = "**__Moderation__**\r\n";

        client.commands.forEach(command => {
            
            switch(command.help.category) {

                case "general":
                    general += `${prefix}${command.help.name} - ${command.help.description}\r\n`;
                break;
                case "info":
                    info += `${prefix}${command.help.name} - ${command.help.description}\r\n`;
                    break;
                        case "ticket":
                        ticket += `${prefix}${command.help.name} - ${command.help.description}\r\n`;
                        break;
                        case "moderation":
                            moderation += `${prefix}${command.help.name} - ${command.help.description}\r\n`;
                            break;

            }
        })

        respone += general + info + ticket + moderation;


        message.author.send(respone).then(() => {
        return message.reply("Alle commands kan je vinden in je prive berichten 📬");
    }).catch(() => {
        return message.reply("Je privé berichten zijn uitgeschakeld je hebt dus geen bericht ontvangen");   
    })     

    } catch (error) {
        message.reply("Er is iets misgelopen! Contacteer de bot owner: Brecht_like#7376");
    }
}

module.exports.help = {
    name: "help",
    category: "info",
    description: "Geeft alle commands van de bot"
}

