module.exports.run = async (client, message, args) => {

    return message.channel.send(`🏓| Latency is ${Math.round(client.ws.ping)}ms`);
}



module.exports.help = {
    name: "ping",
    category: "general",
    description: "geeft de ping van de bot!"
}

