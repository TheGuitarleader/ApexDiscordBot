const Discord = require('discord.js');
const config = require('../config.json');
const logger = require('kailogs');
const sqlite = require('sqlite3').verbose();
let db = new sqlite.Database('./BotData.db');

module.exports = {
    name: "me",
    description: "Shows all the info the bot know about you",
    async execute(interaction, client) {
        var user = interaction.member.user;
        var guildMember = interaction.member;

        var createdDate = new Date(user.createdAt);
        var joinedDate = new Date(guildMember.joinedAt);

        db.get(`SELECT * FROM accounts WHERE discordID = "${user.id}"`, (err, profile) => {
            console.log(profile);
            db.get(`SELECT * FROM brRanks WHERE uid = "${profile.originID}"`, (err, rank) => {
                console.log(rank);

                const embed = new Discord.MessageEmbed()
                .setColor(guildMember.displayHexColor)
                .setAuthor({ name: `${user.username}#${user.discriminator}`, iconURL: user.avatarURL()})
                .addField('In-Game name:', rank.username, true)
                .addField('Platform:', getPlatform(profile.platform), true)
                .addField("Level", numCommas(rank.level), false)
                .addField("Rank", rank.rankedTier, true)
                .addField("RP", numCommas(rank.rankedScore), true)
                .addField('Account created:', `${createdDate.toString().split(" ").slice(0, 4).join(" ")} (${getActiveDays(user.createdAt)} days old)`)
                .addField('Joined server:', `${joinedDate.toString().split(" ").slice(0, 4).join(" ")} (${getActiveDays(guildMember.joinedAt)} days ago)`)
                .addField('Discord ID:', profile.discordID)
                .addField('Origin ID:', profile.originID)
        
                interaction.reply({
                    embeds: [ embed ],
                    ephemeral: true
                });
            });
        });
    }
}

function getActiveDays(date) {
    var createdDate = new Date(date);
    console.log(createdDate);
    var currentDate = new Date(Date.now());
    var diffDays = Math.ceil(Math.abs(currentDate - createdDate) / (1000 * 60 * 60 * 24) -1);
    console.log(diffDays);
    return numCommas(diffDays);
}

function getPlatform(platform) {
    if(platform == "PC")
    {
        return "`Steam/Origin`";
    }
    else if(platform == "X1")
    {
        return "`Xbox`";
    }
    else if(platform == "PS4")
    {
        return "`Playstation`";
    }
}

function numCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getRank(rank) {
    if(rank.rankedTier == "Master" || rank.rankedTier == "Apex Predator")
    {
        var format = `${rank.rankedTier}`;
        return format;
    }
    else
    {
        var format = `${rank.rankName} ${rank.rankDiv}`;
        return format;
    }
}