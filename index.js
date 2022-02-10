const { Client, Intents, Collection, MessageEmbed } = require("discord.js");
const botConfig = require("./botConfig.json");
const fs = require("fs");

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const tempMute = JSON.parse(fs.readFileSync("./tempMutes.json", "utf8"));
const swearWords = require("./Data/SwearWords.json");
const levelFile = require("./Data/levels.json");

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_PRESENCES]
});

client.commands = new Collection();
client.slashCommands = new Collection();
const slashCommands = [];

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith(".js"));

for (const file of commandFiles) {

    const command = require(`./commands/${file}`);

    client.commands.set(command.help.name, command);

    console.log(`De file ${command.help.name}.js is geladen`);

}

const commandSlashFiles = fs.readdirSync('./slashCommands').filter(file => file.endsWith(".js"));

for (const fileSlash of commandSlashFiles) {

    const commandSlash = require(`./slashCommands/${fileSlash}`);

    client.slashCommands.set(commandSlash.data.name, commandSlash);
    slashCommands.push(commandSlash.data.toJSON());

    console.log(`De file ${commandSlash.data.name}.js is geladen`);

}

client.once("ready", () => {
    console.log(`${client.user.username} is online`);
    client.user.setActivity(`Sweepmusic.nl`, { type: "LISTENING" });


    // const guild = client.guilds.cache.get("851014801906728960");
    // let commands;

    // if (guild) {
    //    commands = guild.commands;
    // } else {
    //     commands = client.application.commands;
    //  }






    const checkTempMute = async () => {

        // Omdat we over object propertys gaan moeten we dit anders doen dan een array.
        // We gaan hier over iedere key in het object gaan in het tempMutes.json bestand.
        for (const result of Object.keys(tempMute)) {
            // We halen het ID er uit.
            const idMember = result;
            // We halen de tijd op vanuit het hele bestand bij die key (ID) en dan de tijd.
            const time = tempMute[result].time;

            // Tijd van nu ophalen.
            let date = new Date();
            let dateMilli = date.getTime();
            // Tijd bij gebruiker omvormen naar leesbare tijd.
            let dateReset = new Date(time);

            // Als de tijd van het muten kleiner is als de tijd van nu en de tijd staat niet op 0
            // dan mag deze persoon verlost worden van het zwijgen.
            if (dateReset < dateMilli && time != 0) {

                try {
                    // We halen de server op.
                    let guild = await client.guilds.fetch("851014801906728960");
                    // We gaan de persoon gegevens ophalen aan de hand van de idMember waar we de tekens < @ ! > weghalen.
                    const mutePerson = guild.members.cache.find(member => member.id === idMember.replace(/[<@!>]/g, ''));
                    // We halen de rol op.
                    let muteRole = guild.roles.cache.get('896750620835479592');
                    // We kijken na als de rol bestaat.
                    if (!muteRole) return console.log("De rol Muted bestaat niet.");
                    // We verwijderen de rol van de persoon.
                    await (mutePerson.roles.remove(muteRole.id));
                    // We zetten de tijd op 0.
                    tempMute[mutePerson].time = 0;
                    // We slaan dit mee op in het document.
                    fs.writeFile("./tempMutes.json", JSON.stringify(tempMute), (err) => {
                        if (err) console.log(err);
                    });
                }
                catch (err) {
                    console.log(err + " Persoon kon niet geunmute worden wegens deze persoon niet meer op de server is");
                }
            }
        }
        setTimeout(checkTempMute, 1000 * 60); // We zetten een timeout van 1 minuut.
    }
    checkTempMute(); // We starten de functie met de timeout.


    let guildId = "864625192508981280";
    let clientId = "929695129541963806";

    const rest = new REST({ version: '9' }).setToken(botConfig.token);

    (async () => {
        try {
            console.log('Started refreshing application (/) commands.');

            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: slashCommands },
            );

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();

});

client.on("interactionCreate", async interaction => {

     if (interaction.isSelectMenu()) {
} else if (interaction.isCommand()) {


    const slashCommand = client.slashCommands.get(interaction.commandName);
    if(!slashCommand) return;

    try{

        await slashCommand.execute(client, interaction);

    }catch(err){
        await interaction.reply({ content: "Er liep iets mis", ephemeral: true });
    }


}

});

client.on("guildMemberAdd", async (member) => {

    var role = member.guild.roles.cache.get("895663587849302016");

    if (!role) return;

    member.roles.add(role);

    var channel = member.guild.channels.cache.get("929846265477476382");

    if (!channel) return;

    channel.send(`Hey ${member}, welkom in Leeuwaarden!!`);

    for (const result of Object.keys(tempMute)) {
        // Voor meer uitleg zie vorig stuk.
        const idMember = result;
        const time = tempMute[result].time;

        // We kijken na als het de persoon is die op de server is gekomen.
        if (idMember.replace(/[<@!>]/g, '') == member.id) {

            let date = new Date();
            let dateMilli = date.getTime();
            let dateReset = new Date(time);

            let muteRole = member.guild.roles.cache.get('896750620835479592');

            if (!muteRole) return message.channel.send("De rol muted bestaat niet");

            try {
                // Als de tijd van de mute nog groter is dan de tijd van nu moet die de rol terug krijgen.
                if (dateReset > dateMilli) {
                    await (member.roles.add(muteRole.id));
                } else if (time != 0) {
                    // Anders mag de rol weg maar omdat deze opnieuw aanmeld is deze al weg en gaan we enkel
                    // de tijd op nul zetten zodat we niet nog eens moeten opslaan.
                    let guild = await client.guilds.fetch("851014801906728960");
                    const mutePerson = guild.members.cache.find(member => member.id === idMember.replace(/[<@!>]/g, ''));
                    tempMute[mutePerson].time = 0;

                    fs.writeFile("./tempMutes.json", JSON.stringify(tempMute), (err) => {
                        if (err) console.log(err);
                    });
                }
            } catch (err) {
                console.log(err + " Iets liep mis met de rollen toevoegen/verwijderen.");
            }
        }
    }

});

client.on("messageCreate", async message => {

    if (message.author.bot) return;

    var prefix = botConfig.prefix;

    var messageArray = message.content.split(" ");

    var command = messageArray[0];

    if (!message.content.startsWith(prefix)) {

        RandomXP(message);

        var msg = message.content.toLowerCase();

        for (let index = 0; index < swearWords.length; index++) {
            const swearWord = swearWords[index];

            if (msg.includes(swearWord.toLowerCase())) {

                message.delete();
                return await message.channel.send("Je mag niet vloeken.").then(msg => {
                    setTimeout(() => {
                        msg.delete()
                    }, 3000);
                })

            }

        }

    }
    else {
        const commandData = client.commands.get(command.slice(prefix.length));

        if (!commandData) return;

        var arguments = messageArray.slice(1);

        try {

            await commandData.run(client, message, arguments);


        } catch (error) {
            console.log(error);
            await message.reply("Er was een probleem tijdens het uitvoeren van deze command. ")

        }
    }
});

function RandomXP(message) {

    var randomXP = Math.floor(Math.random() * 15) + 1;


    var idUser = message.author.id;

    if(!levelFile[idUser]){

        levelFile[idUser] = {

            xp: 0,
            level: 0
        }
    }

    levelFile[idUser].xp += randomXP;

    var levelUser = levelFile[idUser].level;
    var xpUser = levelFile[idUser].xp;
    var nextLevelXp = levelUser * 300;

    if(nextLevelXp == 0) nextLevelXp = 100;

    if(xpUser >= nextLevelXp) {

        levelFile[idUser].level += 1;

        fs.writeFile("./Data/levels.json", JSON.stringify(levelFile),
            err => {
                if (err) return console.log("Er ging iets fout met het XP Systeem!")
            });

            var embedLevel = new MessageEmbed()
            .setDescription("***Nieuw level***")
            .setColor("#00FF00")
            .addField("Nieuw level:", levelFile[idUser].level.toString());
            message.channel.send({ embeds: [embedLevel] });

    }

}

client.login(process.env.token);