const sqlite = require('sqlite3').verbose();
const Discord = require('discord.js');
const config = require('../config.json');
const logger = require('kailogs');

let db = new sqlite.Database('./BotData.db');

module.exports = {
    name: "ar-ranked",
    description: "Shows the top Arenas ranks on the server",
    group: 'general',
    async execute(message, client, settings) {   
        let args = message.content.split(' ');
        
        if(args.length > 0)
        {
            var rank = args[1].toLowerCase();
        }

        if(rank == "top")
        {
            let data = [];
            db.all(`SELECT * FROM arRanks ORDER BY rankedScore DESC`, (err, row) => {
                if(err){
                    logger.error(err, 'commands');
                }
                row.forEach((rows) => {
                    data.push(rows);
                })
    
                const embed = new Discord.MessageEmbed();
                embed.setColor(config.discord.embedHex);
                embed.setTitle(":tada:  Arenas Top 10 Ranked");
                embed.setFooter("Refreshes every 2 minutes");
    
                console.log(data);
    
                var num = 1;
                data.forEach((d) => {
                    if(num <= 10)
                    {
                        embed.addField(`#${num} - ${d.username}`, `${d.rankedTier} (${numCommas(d.rankedScore)} RP)`);
                        num++;
                    }
                })
                message.channel.send(embed);
            });
        }
        else if(rank == "master")
        {
            let data = [];
            db.all(`SELECT * FROM arRanks WHERE rankedTier LIKE '%Master%' ORDER BY rankedScore DESC`, (err, row) => {
                if(err){
                    logger.error(err, 'commands');
                }
                row.forEach((rows) => {
                    data.push(rows);
                })
    
                const embed = new Discord.MessageEmbed();
                embed.setColor(config.discord.embedHex);
                embed.setTitle(":tada:  Arenas Top 10 Master");
                embed.setFooter("Refreshes every 2 minutes");
    
                console.log(data);
    
                var num = 1;
                data.forEach((d) => {
                    if(num <= 10)
                    {
                        embed.addField(`#${num} - ${d.username}`, `${d.rankedTier} (${numCommas(d.rankedScore)} RP)`);
                        num++;
                    }
                })
                message.channel.send(embed);
            });
        }
        else if(rank == "diamond")
        {
            let data = [];
            db.all(`SELECT * FROM arRanks WHERE rankedTier LIKE '%Diamond%' ORDER BY rankedScore DESC`, (err, row) => {
                if(err){
                    logger.error(err, 'commands');
                }
                row.forEach((rows) => {
                    data.push(rows);
                })
    
                const embed = new Discord.MessageEmbed();
                embed.setColor(config.discord.embedHex);
                embed.setTitle(":tada:  Arenas Top 10 Diamond");
                embed.setFooter("Refreshes every 2 minutes");
    
                console.log(data);
    
                var num = 1;
                data.forEach((d) => {
                    if(num <= 10)
                    {
                        embed.addField(`#${num} - ${d.username}`, `${d.rankedTier} (${numCommas(d.rankedScore)} RP)`);
                        num++;
                    }
                })
                message.channel.send(embed);
            });
        }
        else if(rank == "platinum")
        {
            let data = [];
            db.all(`SELECT * FROM arRanks WHERE rankedTier LIKE '%Platinum%' ORDER BY rankedScore DESC`, (err, row) => {
                if(err){
                    logger.error(err, 'commands');
                }
                row.forEach((rows) => {
                    data.push(rows);
                })
    
                const embed = new Discord.MessageEmbed();
                embed.setColor(config.discord.embedHex);
                embed.setTitle(":tada:  Arenas Top 10 Platinum");
                embed.setFooter("Refreshes every 2 minutes");
    
                console.log(data);
    
                var num = 1;
                data.forEach((d) => {
                    if(num <= 10)
                    {
                        embed.addField(`#${num} - ${d.username}`, `${d.rankedTier} (${numCommas(d.rankedScore)} RP)`);
                        num++;
                    }
                })
                message.channel.send(embed);
            });
        }
        else if(rank == "gold")
        {
            let data = [];
            db.all(`SELECT * FROM arRanks WHERE rankedTier LIKE '%Gold%' ORDER BY rankedScore DESC`, (err, row) => {
                if(err){
                    logger.error(err, 'commands');
                }
                row.forEach((rows) => {
                    data.push(rows);
                })
    
                const embed = new Discord.MessageEmbed();
                embed.setColor(config.discord.embedHex);
                embed.setTitle(":tada:  Arenas Top 10 Gold");
                embed.setFooter("Refreshes every 2 minutes");
    
                console.log(data);
    
                var num = 1;
                data.forEach((d) => {
                    if(num <= 10)
                    {
                        embed.addField(`#${num} - ${d.username}`, `${d.rankedTier} (${numCommas(d.rankedScore)} RP)`);
                        num++;
                    }
                })
                message.channel.send(embed);
            });
        }
        else if(rank == "silver")
        {
            let data = [];
            db.all(`SELECT * FROM arRanks WHERE rankedTier LIKE '%Silver%' ORDER BY rankedScore DESC`, (err, row) => {
                if(err){
                    logger.error(err, 'commands');
                }
                row.forEach((rows) => {
                    data.push(rows);
                })
    
                const embed = new Discord.MessageEmbed();
                embed.setColor(config.discord.embedHex);
                embed.setTitle(":tada:  Arenas Top 10 Silver");
                embed.setFooter("Refreshes every 2 minutes");
    
                console.log(data);
    
                var num = 1;
                data.forEach((d) => {
                    if(num <= 10)
                    {
                        embed.addField(`#${num} - ${d.username}`, `${d.rankedTier} (${numCommas(d.rankedScore)} RP)`);
                        num++;
                    }
                })
                message.channel.send(embed);
            });
        }
        else if(rank == "bronze")
        {
            let data = [];
            db.all(`SELECT * FROM arRanks WHERE rankedTier LIKE '%Bronze%' ORDER BY rankedScore DESC`, (err, row) => {
                if(err){
                    logger.error(err, 'commands');
                }
                row.forEach((rows) => {
                    data.push(rows);
                })
    
                const embed = new Discord.MessageEmbed();
                embed.setColor(config.discord.embedHex);
                embed.setTitle(":tada:  Arenas Top 10 Bronze");
                embed.setFooter("Refreshes every 2 minutes");
    
                console.log(data);
    
                var num = 1;
                data.forEach((d) => {
                    if(num <= 10)
                    {
                        embed.addField(`#${num} - ${d.username}`, `${d.rankedTier} (${numCommas(d.rankedScore)} RP)`);
                        num++;
                    }
                })
                message.channel.send(embed);
            });
        }
    }
}

function numCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}