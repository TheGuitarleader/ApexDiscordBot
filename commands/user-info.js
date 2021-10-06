const Discord = require('discord.js');
const config = require('../config.json');
const logger = require('kailogs');

module.exports = {
    name: "user-info",
    description: "Gives you info on a user",
    group: 'admin',
    async execute(message, client, settings) {
        if (message.member.hasPermission("MANAGE_GUILD") || message.member.id == config.discord.devID)
        {
            var member = message.mentions.users.first();
            var user = client.users.cache.find(user => user.id === member.id);
            var guildMember = message.guild.members.cache.get(member.id);

            var createdDate = new Date(user.createdAt);
            var joinedDate = new Date(guildMember.joinedAt);
            var nitroDate = new Date(guildMember.premiumSince);
            
            console.log(guildMember);

            const embed = new Discord.MessageEmbed()
            .setColor(guildMember.displayHexColor)
            .setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL())
            .addField('Display name:', guildMember.displayName)
            .addField('Manageable:', guildMember.manageable)
            .addField('Account created:', `${createdDate.toString().split(" ").slice(0, 4).join(" ")} (${getActiveDays(user.createdAt)} days old)`)
            .addField('Joined server:', `${joinedDate.toString().split(" ").slice(0, 4).join(" ")} (${getActiveDays(guildMember.joinedAt)} days ago)`)
            .setFooter("ID: " + user.id)

            message.channel.send(embed);
        }
    }
}

function getActiveDays(date) {
    var createdDate = new Date(date);
    console.log(createdDate);
    var currentDate = new Date(Date.now());
    var diffDays = Math.ceil(Math.abs(currentDate - createdDate) / (1000 * 60 * 60 * 24));
    console.log(diffDays);
    return diffDays;
}