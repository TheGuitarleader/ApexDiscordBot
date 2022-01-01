const sqlite = require('sqlite3').verbose();
const Discord = require('discord.js');
const config = require('../config.json');
const logger = require('kailogs');

let db = new sqlite.Database('./BotData.db');

module.exports = {
    name: "lfg",
    description: "Helps you find players for Apex",
    options: [
        {
          name: 'mode',
          type: 3, // 'STRING' Type
          description: 'The mode to find players on.',
          required: true,
          choices: [
            {
                name: 'Battle Royal Ranked',
                value: 'brRanks'
            },
            {
                name: 'Arenas Ranked',
                value: 'arRanks'
            }
          ]
        }
      ],
    async execute(interaction, client) {
        console.log(interaction.options.get('mode').value);
        console.log(interaction.member.displayName);
        FindRankedPlayers(interaction.options.get('mode').value, interaction.member.displayName, 10, interaction);
    }
}

function numCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function FindPubPlayers(table, playerName, buffer, message) {
    let players = [];

    console.log("Buffer: " + buffer);
    db.get(`SELECT * FROM ${table} WHERE username = ?`, [playerName], (err, rank) => {
        if(err){
            console.log(err);
        }

        console.log("Buffer: " + buffer);
        db.all(`SELECT * FROM ${table} WHERE level >= ${rank.level - buffer} AND level <= ${(rank.level + buffer) - 20}`, (err, rows) => {
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
                    FindPubPlayers(table, playerName, buffer + 50, message);
                }
                else {
                    displayPlayers(players);
                }
            }
        });
    });
}

function FindRankedPlayers(table, playerName, buffer, interaction) {
    let players = [];

    console.log("Buffer: " + buffer);
    db.get(`SELECT * FROM ${table} WHERE username = ?`, [playerName], (err, rank) => {
        if(err){
            console.log(err);
        }

        console.log("Buffer: " + buffer);
        db.all(`SELECT * FROM ${table} WHERE rankedScore >= ${rank.rankedScore - buffer} AND rankedScore <= ${(rank.rankedScore + buffer) - 20}`, (err, rows) => {
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
                    FindRankedPlayers(table, playerName, buffer + 50, interaction);
                }
                else {
                    displayPlayers(interaction, players);
                }
            }
        });
    });
}

function displayPlayers(interaction, players) {

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

    interaction.reply({
        embeds: [embed],
        ephemeral: true
    });
}

function numCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}