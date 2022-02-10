module.exports.run = async (client, message, args) => {
 
    var  values = ["Kop", "Munt",];

    var result = values[Math.floor(Math.random() *values.length)];

    return message.channel.send(`🎖️ je hebt **${result}** gegooid!`);

}

module.exports.help = {
    name: "kopmunt",
    category: "general",
    description: "doet kop of munt"
}