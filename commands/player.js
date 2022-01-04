const Discord = require('discord.js');
const config = require('../config.json');
const logger = require('kailogs');
const request = require('request');

module.exports = {
    name: "player",
    description: "Searches Apex for a player.",
    options: [
        {
          name: 'platform',
          type: 3, // 'STRING' Type
          description: 'The platform you play on',
          required: true,
          choices: [
            {
                name: 'PC (Origin)',
                value: 'PC'
            },
            {
                name: 'Xbox',
                value: 'X1'
            },
            {
                name: 'Playstation',
                value: 'PS4'
            }
          ]
        },
        {
            name: 'player_name',
            type: 3, // 'STRING' Type
            description: 'Your in game name.',
            required: true,
        }
      ],
    async execute(interaction, client) {
        var playerName = interaction.options.get('player_name').value;
        var platform = interaction.options.get('platform').value;

        var options = {
            url: `https://api.mozambiquehe.re/bridge?version=5&platform=${platform}&player=${playerName}&auth=${config.apex.apiKey}`,
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
                    embed.setTitle(`${getStatusEmote(info.realtime)} ${info.global.name}`, info.global.avatar)
                }
                else
                {
                    embed.setTitle(`${getStatusEmote(info.realtime)} ${info.global.name}`)
                }

                embed.setThumbnail(info.legends.selected.ImgAssets.icon)
                embed.addField("Level", info.global.level.toString(), true)
                embed.addField("BP Level", getBpLevel(info.global.battlepass).toString(), false)
                embed.addField("Rank", getRank(info.global.rank), true)
                embed.addField("RP", numCommas(info.global.rank.rankScore), true)

                interaction.reply({
                    embeds: [ embed ]
                })            
            }
            else if(info.Error != null)
            {
                logger.error("Returned Error: " + info.Error);
                interaction.reply({
                    content: '```' + info.Error + '```'
                })
            }
        }
          
        request(options, callback);
    }
}

function getRank(rank) {
    if(rank.rankName == "Master" || rank.rankName == "Apex Predator")
    {
        var format = `${rank.rankName}`;
        return format;
    }
    else
    {
        var format = `${rank.rankName} ${rank.rankDiv}`;
        return format;
    }
}

function numCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getBpLevel(bp) {
    return bp.level;

    // if(bp.level != -1)
    // {
    //     var format = bp.level
    //     return format;
    // }
    // else
    // {
    //     var format = "Not Purchased";
    //     return format;
    // }
}

function getStatusEmote(status) {
    if(status.isOnline == 0)
    {
        let offline = ":white_circle:"
        return offline;
    }
    else if(status.isOnline == 1)
    {
        let online = ":green_circle:"
        return online;
    }
    else if(status.isOnline == 1 && status.isInGame == 1)
    {
        let online = ":blue_circle:"
        return online;
    }
    else if(status.realtime.currentState != "offline")
    {
        let status = status.realtime.currentStateAsText
        return status;
    }
}