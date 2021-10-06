const Discord = require('discord.js');
const config = require('../config.json');
const logger = require('kailogs');

module.exports = {
    name: "ping",
    description: "Checks the connection of the bot",
    group: 'general',
    stat: null,
    async execute(message, client) {
        message.channel.send("Pinging...").then(msg =>{
            var botping = Math.round(message.client.ws.ping);
            var ping = msg.createdTimestamp - message.createdTimestamp;

            var embed = new Discord.MessageEmbed()
            .setDescription(":hourglass_flowing_sand: " + ping + "ms\n\n:stopwatch: " + botping + "ms")
            .setColor(config.discord.embedHex)
            
            msg.delete();
            message.channel.send(embed);
            logger.log(`Ping requested. ${ping}ms latency, ${botping}ms API responce time.`, 'command');
      });
    }
}