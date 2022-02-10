const discord = require('discord.js')

module.exports.run = async (client, message, args) => {

    // !review aantal bericht bericht bericht

    const amountStars = args[0];

    if(!amountStars || amountStars < 1 || amountStars > 5) return message.reply("Geef een aantal sterren op tussen 1 t.e.m. 5");

    const messageReview = args.splice(1, args.length).join(" ") || '**Geen bericht meegegeven**';

    const reviewChannel = message.member.guild.channels.cache.get("929825048464883732");

    if(!reviewChannel) return message.reply("Kanaal niet gevonden!");

    var stars = "";

    for(var i = 0; i < amountStars; i++) {

        stars += ":star: ";

    } 

    message.delete();

    const review = new discord.MessageEmbed()
    .setTitle(`${message.author.username} heeft een review geschreven! 🎉`)
    .setColor("RED")
    .setThumbnail("https://cdn.discordapp.com/avatars/929822490480476200/3a0d1ba263571361d0213ff880df2d6b.png?size=256")
    .setFooter("Bot gemaakt door Brecht_like#7376")
    .addField("Sterren:", `${stars}`)
    .addField("Review:", `${messageReview}`);

    message.channel.send(`${message.author.username} je review staat in <#929825048464883732>! 🎉`);

    return reviewChannel.send({ embeds: [review] });

}

module.exports.help = {
    name: "review",
    category: "general",
    description: "Schrijf een review"
}

