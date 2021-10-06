const Discord = require('discord.js');
const config = require('../config.json');
const logger = require('kailogs');
const request = require('request');
const sqlite = require('sqlite3').verbose();
let db = new sqlite.Database('./BotData.db');

module.exports = {
    name: "verify",
    description: "Sends a options poll to the channel",
    group: 'general',
    stat: null,
    async execute(message, client) {
        args = message.content.split(' ');

        console.log(args);

        platform = args[1];

        // if(platform != "PC" || platform != "PS4" || platform != "X1")
        // {
        //     console.log(platform);
        //     message.channel.send(":x: **Invaild platform type!**")
        // }

        var options = {
            url: `https://api.mozambiquehe.re/bridge?version=5&platform=${platform}&player=${args[2]}&auth=${config.apex.apiKey}`,
        };

        function callback(error, response, body) {
            var info = JSON.parse(body);

            if (info.Error == undefined) {

                const embed = new Discord.MessageEmbed()
                embed.setColor(config.discord.embedHex)

                if(info.global.avatar != "Not available")
                {
                    embed.setAuthor(info.global.name, info.global.avatar)
                }
                else
                {
                    embed.setAuthor(info.global.name)
                }

                embed.setThumbnail(info.legends.selected.ImgAssets.icon)

                embed.addField("Level", info.global.level, true)
                embed.addField("BP Level", getBpLevel(info.global.battlepass), false)
                embed.addField("Rank", getRank(info.global.rank.rankName, info.global.rank.rankDiv), false)
                embed.addField("Status", getStatus(info.realtime), false)
                message.channel.send(embed).then(msg => {
                    msg.delete({ timeout: 8000 })
                });

                var guild = message.guild;
                var member = guild.member(message.author);
                member.setNickname(info.global.name);

                addRoles(guild, member, info);

                db.serialize(() => {
                    db.run(`INSERT OR REPLACE INTO accounts(discordID, originID, discordUser, originUser, platform) VALUES("${message.author.id}", "${info.global.uid}", "${message.author.username}", "${info.global.name}", "${info.global.platform}")`, function(err) {
                        if(err) {
                            logger.error(err, 'database');
                        }
                
                        logger.log(`Added profile for user '${info.global.name}'`, 'main');
    
                        var user = message.author;
                        const modEmbed = new Discord.MessageEmbed()
                        modEmbed.setColor('fff200')
                        modEmbed.setThumbnail(info.legends.selected.ImgAssets.icon)
                        modEmbed.setAuthor(`${user.username}#${user.discriminator} verified account`)
                        modEmbed.addField("Name", info.global.name, true)
                        modEmbed.addField("Level", info.global.level, false)
                        modEmbed.addField("Rank", getRank(info.global.arena.rankName, info.global.arena.rankDiv), true)
                        modEmbed.addField("RP", info.global.rank.rankScore, true)
                        modEmbed.setFooter("ID: " + user.id)
                        client.channels.cache.get(config.discord.logging).send(modEmbed);
                    });

                    db.run(`INSERT OR REPLACE INTO brRanks(uid, username, rankedTier, rankedScore, level, legend) VALUES("${info.global.uid}", "${info.global.name}", "${getRank(info.global.rank.rankName, info.global.rank.rankDiv)}", "${info.global.rank.rankScore}", "${info.global.level}", "${info.realtime.selectedLegend}")`, function(err) {
                        if(err) {
                            logger.error(err, 'database');
                        }
                    });
        
                    db.run(`INSERT OR REPLACE INTO arRanks(uid, username, rankedTier, rankedScore, level, legend) VALUES("${info.global.uid}", "${info.global.name}", "${getRank(info.global.arena.rankName, info.global.arena.rankDiv)}", "${info.global.arena.rankScore}", "${info.global.level}", "${info.realtime.selectedLegend}")`, function(err) {
                        if(err) {
                            logger.error(err, 'database');
                        }
                    });
                })
            }
            else if(info.Error != null)
            {
                message.channel.send(':x: ```' + info.Error + '```');
                logger.error("Returned Error: " + info.Error);
            }
        }

        request(options, callback);
        logger.log(`Sending Player API request: ${options.url}`);
        message.channel.send(":floppy_disk: **Finding player...**").then(msg => {
            msg.delete({ timeout: 3000 });
            message.delete({ timeout: 10000 });
        });
    }
}

function getRank(rankName, rankTier) {
    if(rankName == "Unranked" || rankName == "Master" || rankName == "Apex Predator")
    {
        return rankName;
    }
    else
    {
        let rank = rankName + " " + rankTier
        return rank;
    }
}

function getBpLevel(bp) {
    if(bp.level != -1)
    {
        var format = bp.level
        return format;
    }
    else
    {
        var format = "Not Purchased";
        return format;
    }
}

function getStatus(status) {
    if(status.isOnline == 0)
    {
        let offline = "Offline"
        return offline;
    }
    else if(status.isOnline == 1)
    {
        let online = "Online"
        return online;
    }
    else if(status.isOnline == 1 && status.isInGame == 1)
    {
        let online = "In Game"
        return online;
    }
    else if(status.realtime.currentState != "offline")
    {
        let status = status.realtime.currentStateAsText
        return status;
    }
}

function addRoles(guild, member, player) {
    member.roles.add(guild.roles.cache.find(r => r.id === config.discord.role));

    var rank = player.global.rank.rankName;
    var platform = player.global.platform;

    // let rankRole = guild.roles.cache.find(r => r.name === rank)
    // member.roles.add(rankRole);

    if(platform == "PC")
    {
        let role = guild.roles.cache.find(r => r.name === "PC")
        member.roles.add(role);
    }
    else if(platform == "PS4")
    {
        let role = guild.roles.cache.find(r => r.name === "PS4")
        member.roles.add(role);
    }
    else if(platform == "X1")
    {
        let role = guild.roles.cache.find(r => r.name === "Xbox")
        member.roles.add(role);
    }
}