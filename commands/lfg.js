const sqlite = require('sqlite3').verbose();
const Discord = require('discord.js');
const config = require('../config.json');
const logger = require('kailogs');

let db = new sqlite.Database('./BotData.db');

module.exports = {
    name: "lfg",
    description: "Helps you find players for Apex",
    group: 'general',
    async execute(message, client) {
        var args = message.content.split(' ');
        var mode = args[1].toLowerCase();

        if(mode == "br" || mode == "ranked")
        {
            FindPlayers("brRanks", message.guild.member(message.author.id).displayName, 10, message);
        }
        else if(mode == "ar" || mode == "arenas-ranked")
        {
            FindPlayers("arRanks", message.guild.member(message.author.id).displayName, 10, message);
        }
        else
        {
            message.channel.send(':x: `' + mode + '`** is not a valid parameter!**');
        }
    }
}

function numCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function FindPlayers(table, playerName, buffer, message) {
    let players = [];

    console.log("Buffer: " + buffer);
    db.get(`SELECT * FROM ${table} WHERE username = ?`, [playerName], (err, rank) => {
        if(err){
            console.log(err);
        }

        console.log("Buffer: " + buffer);
        db.all(`SELECT * FROM ${table} WHERE rankedScore >= ${rank.rankedScore - buffer} AND rankedScore <= ${(rank.rankedScore + buffer) - 20} AND level >= ${rank.level - buffer} AND level <= ${(rank.level + buffer) - 20}`, (err, rows) => {
            if(err){
                console.log(err);
            }
            else
            {
                rows.forEach((row) => {
                    if(!players.includes(row.username) && row.username != playerName)
                    {
                        if(rank.legend != row.legend)
                        {
                            players.push(row);
                            console.log("Added");
                        }
                        else
                        {
                            console.log("Found player that uses same Legend");
                        }
                    }
                });

                console.log(`Players: ${players.length}`);
                if(players.length < 2 && buffer < 500)
                {
                    console.log("Running again...");
                    //count++;
                    FindPlayers(table, playerName, buffer + 50, message);
                }
                else {
                    displayPlayers(message.channel, players);
                }
            }
        });
    });
}

function displayPlayers(channel, players) {

    console.log(players);

    const embed = new Discord.MessageEmbed();
    embed.setColor(config.discord.embedHex);
    embed.setFooter("");
    
    if(players.length == 0)
    {
        embed.setDescription("There were no players found. Players are found my matching RP, Level, and previously played Legends. The server also has few members to match you with depending on your skill level. Also this command is also in beta so there might be a problem with the algorithm.");
    }
    else if(players.length == 1)
    {
        embed.setTitle(`I found you ${players.length} player!`);
    }
    else
    {
        embed.setTitle(`I found you ${players.length} players!`);
    }

    players.forEach((player) => {
        console.log(player);
        embed.addField(`${player.username} (${player.legend})`, `${player.rankedTier} (${numCommas(player.rankedScore)} RP)`)
    });

    channel.send(embed);
}

function numCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}