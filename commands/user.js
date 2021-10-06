const Discord = require('discord.js');
const config = require('../config.json');
const logger = require('kailogs');
const request = require('request');

module.exports = {
    name: "player",
    description: "Searches Apex for a player (Origin ONLY)",
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

        console.log(options.url);

        function callback(error, response, body) {
            var info = JSON.parse(body);

            if (info.Error == undefined) {

                const embed = new Discord.MessageEmbed()
                embed.setColor(config.discord.embedHex)
                //embed.setURL(`https://apexlegendsstatus.com/profile/uid/${info.global.platform}/${info.global.uid}`)
                //embed.setTitle(info.global.name)

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
                embed.addField("BP Level", getBpLevel(info.global.battlepass), true)
                embed.addField("Rank", getRank(info.global.rank), false)
                embed.addField("Status", getStatus(info.realtime), true)
                message.channel.send(embed);             
            }
            else if(info.Error != null)
            {
                message.channel.send(':x: ```' + info.Error + '```');
                logger.error("Returned Error: " + info.Error);
            }
        }
          
        request(options, callback);
        message.channel.send(":floppy_disk: **Finding player...**").then(msg => {
            msg.delete({ timeout: 2500 });
        });
    }
}

function getRank(rank) {
    if(rank.rankName == "Master" || rank.rankName == "Apex Predator")
    {
        var format = `${rank.rankName} (${rank.rankScore})`;
        return format;
    }
    else
    {
        var format = `${rank.rankName} ${rank.rankDiv} (${rank.rankScore})`;
        return format;
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