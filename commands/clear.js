const Discord = require('discord.js');
const config = require('../config.json');
const logger = require('kailogs');

module.exports = {
    name: "clear",
    description: "Deletes messages in a channel",
    group: "admin",
    async execute(message) {
        if (message.member.hasPermission("MANAGE_MESSAGES") || message.member.id == config.discord.devID)
        {
            message.channel.messages.fetch({ limit: number + 1 }).then(function(list) {
                message.channel.bulkDelete(list);
                logger.log(`Cleared ${list.size} messages on guild '${message.guild.id}' (${message.guild.name})`, 'command');
                message.channel.send(':white_check_mark: **Chats cleared!** :thumbsup:').then(msg => {
                    msg.delete({ timeout: 3000 });
                })
            }, function(err) {
                message.channel.send(":x: **Failed to delete messages**");
                logger.error(err, 'commands');
            })
        }
        else
        {
            message.channel.send(':no_entry_sign: **You are not authorized to use that command!**')
        }
    }
}