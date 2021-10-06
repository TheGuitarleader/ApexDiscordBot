const Discord = require('discord.js');
const config = require('../config.json');
const fs = require('fs');

module.exports = {
    name: "help",
    description: "All bot commands",
    group: 'general',
    async execute(message, client) {

        let commands = client.commands.array();
        const embed = new Discord.MessageEmbed();
        embed.setColor(config.discord.embedHex);
        embed.setTitle("General Commands");
        commands.forEach((c) => {
            console.log(c.group);
            if(c.group == "general") {
                embed.addField('`' + config.discord.botPrefix + c.name + '`', c.description);
            }
        });
        message.channel.send(embed);
    }
}