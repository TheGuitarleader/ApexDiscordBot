const Discord = require('discord.js');
const config = require('../config.json');
const logger = require('kailogs');

module.exports = {
    name: "clear",
    description: "Deletes messages in a channel",
    async execute(interaction, client) {
        if (interaction.member.hasPermission("MANAGE_MESSAGES") || interaction.member.id == config.discord.devID)
        {
            interaction.channel.messages.fetch({ limit: number + 1 }).then(function(list) {
                interaction.channel.bulkDelete(list);
                logger.log(`Cleared ${list.size} messages on guild '${interaction.guild.name}' (${interaction.guild.id})`, this.name);
                interaction.reply(':white_check_mark: **Chats cleared!** :thumbsup:').then(msg => {
                    msg.delete({ timeout: 3000 });
                })
            }, function(err) {
                logger.error(err, this.name);
                interaction.reply({
                    contents: ":x: **Failed to delete messages**"
                });
            })
        }
        else
        {
            message.channel.send(':no_entry_sign: **You are not authorized to use that command!**')
        }
    }
}