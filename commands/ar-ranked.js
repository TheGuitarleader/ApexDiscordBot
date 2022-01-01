const sqlite = require('sqlite3').verbose();
const Discord = require('discord.js');
const config = require('../config.json');
const logger = require('kailogs');

let db = new sqlite.Database('./BotData.db');

module.exports = {
    name: "ar-ranked",
    description: "Shows the top ranks on the server",
    options: [
        {
          name: 'tier',
          type: 3, // 'STRING' Type
          description: 'The ranked tier',
          required: true,
          choices: [
            {
                name: 'Top',
                value: 'top'
            },
            {
                name: 'Master',
                value: 'master'
            },
            {
                name: 'Diamond',
                value: 'diamond'
            },
            {
                name: 'Platinum',
                value: 'platinum'
            },
            {
                name: 'Gold',
                value: 'gold'
            },
            {
                name: 'Silver',
                value: 'silver'
            },
            {
                name: 'Bronze',
                value: 'bronze'
            }
          ]
        }
      ],
    async execute(interaction, client) {   
        var rank = interaction.options.get('tier').value;

        if(rank == "top")
        {
            let data = [];
            db.all(`SELECT * FROM arRanks ORDER BY rankedScore DESC`, (err, row) => {
                if(err){
                    logger.error(err, this.name);
                }
                row.forEach((rows) => {
                    data.push(rows);
                })
    
                const embed = new Discord.MessageEmbed();
                embed.setColor(config.discord.embedHex);
                embed.setTitle(":tada:  Top 10 Ranked");
                embed.setFooter(`${getRemainingDays(config.apex.splitTime)} days remaining`);
    
                console.log(data);
    
                var num = 1;
                data.forEach((d) => {
                    if(num <= 10)
                    {
                        embed.addField(`#${num} - ${d.username}`, `${d.rankedTier} (${numCommas(d.rankedScore)} RP)`);
                        num++;
                    }
                })
                interaction.reply({
                    embeds: [ embed ]
                });
            });
        }
        else if(rank == "master")
        {
            let data = [];
            db.all(`SELECT * FROM arRanks WHERE rankedTier LIKE '%Master%' ORDER BY rankedScore DESC`, (err, row) => {
                if(err){
                    logger.error(err, this.name);
                }
                row.forEach((rows) => {
                    data.push(rows);
                })
    
                const embed = new Discord.MessageEmbed();
                embed.setColor(config.discord.embedHex);
                embed.setTitle(":tada:  Top 10 Master");
                embed.setFooter(`${getRemainingDays(config.apex.splitTime)} days remaining`);
    
                console.log(data);
    
                var num = 1;
                data.forEach((d) => {
                    if(num <= 10)
                    {
                        embed.addField(`#${num} - ${d.username}`, `${d.rankedTier} (${numCommas(d.rankedScore)} RP)`);
                        num++;
                    }
                })
                interaction.reply({
                    embeds: [ embed ]
                });
            });
        }
        else if(rank == "diamond")
        {
            let data = [];
            db.all(`SELECT * FROM arRanks WHERE rankedTier LIKE '%Diamond%' ORDER BY rankedScore DESC`, (err, row) => {
                if(err){
                    logger.error(err, this.name);
                }
                row.forEach((rows) => {
                    data.push(rows);
                })
    
                const embed = new Discord.MessageEmbed();
                embed.setColor(config.discord.embedHex);
                embed.setTitle(":tada:  Top 10 Diamond");
                embed.setFooter(`${getRemainingDays(config.apex.splitTime)} days remaining`);
    
                console.log(data);
    
                var num = 1;
                data.forEach((d) => {
                    if(num <= 10)
                    {
                        embed.addField(`#${num} - ${d.username}`, `${d.rankedTier} (${numCommas(d.rankedScore)} RP)`);
                        num++;
                    }
                })
                interaction.reply({
                    embeds: [ embed ]
                });
            });
        }
        else if(rank == "platinum")
        {
            let data = [];
            db.all(`SELECT * FROM arRanks WHERE rankedTier LIKE '%Platinum%' ORDER BY rankedScore DESC`, (err, row) => {
                if(err){
                    logger.error(err, this.name);
                }
                row.forEach((rows) => {
                    data.push(rows);
                })
    
                const embed = new Discord.MessageEmbed();
                embed.setColor(config.discord.embedHex);
                embed.setTitle(":tada:  Top 10 Platinum");
                embed.setFooter(`${getRemainingDays(config.apex.splitTime)} days remaining`);
    
                console.log(data);
    
                var num = 1;
                data.forEach((d) => {
                    if(num <= 10)
                    {
                        embed.addField(`#${num} - ${d.username}`, `${d.rankedTier} (${numCommas(d.rankedScore)} RP)`);
                        num++;
                    }
                })
                interaction.reply({
                    embeds: [ embed ]
                });
            });
        }
        else if(rank == "gold")
        {
            let data = [];
            db.all(`SELECT * FROM arRanks WHERE rankedTier LIKE '%Gold%' ORDER BY rankedScore DESC`, (err, row) => {
                if(err){
                    logger.error(err, this.name);
                }
                row.forEach((rows) => {
                    data.push(rows);
                })
    
                const embed = new Discord.MessageEmbed();
                embed.setColor(config.discord.embedHex);
                embed.setTitle(":tada:  Top 10 Gold");
                embed.setFooter(`${getRemainingDays(config.apex.splitTime)} days remaining`);
    
                console.log(data);
    
                var num = 1;
                data.forEach((d) => {
                    if(num <= 10)
                    {
                        embed.addField(`#${num} - ${d.username}`, `${d.rankedTier} (${numCommas(d.rankedScore)} RP)`);
                        num++;
                    }
                })
                interaction.reply({
                    embeds: [ embed ]
                });
            });
        }
        else if(rank == "silver")
        {
            let data = [];
            db.all(`SELECT * FROM arRanks WHERE rankedTier LIKE '%Silver%' ORDER BY rankedScore DESC`, (err, row) => {
                if(err){
                    logger.error(err, this.name);
                }
                row.forEach((rows) => {
                    data.push(rows);
                })
    
                const embed = new Discord.MessageEmbed();
                embed.setColor(config.discord.embedHex);
                embed.setTitle(":tada:  Top 10 Silver");
                embed.setFooter(`${getRemainingDays(config.apex.splitTime)} days remaining`);
    
                console.log(data);
    
                var num = 1;
                data.forEach((d) => {
                    if(num <= 10)
                    {
                        embed.addField(`#${num} - ${d.username}`, `${d.rankedTier} (${numCommas(d.rankedScore)} RP)`);
                        num++;
                    }
                })
                interaction.reply({
                    embeds: [ embed ]
                });
            });
        }
        else if(rank == "bronze")
        {
            let data = [];
            db.all(`SELECT * FROM arRanks WHERE rankedTier LIKE '%Bronze%' ORDER BY rankedScore DESC`, (err, row) => {
                if(err){
                    logger.error(err, this.name);
                }
                row.forEach((rows) => {
                    data.push(rows);
                })
    
                const embed = new Discord.MessageEmbed();
                embed.setColor(config.discord.embedHex);
                embed.setTitle(":tada:  Top 10 Bronze");
                embed.setFooter(`${getRemainingDays(config.apex.splitTime)} days remaining`);
    
                console.log(data);
    
                var num = 1;
                data.forEach((d) => {
                    if(num <= 10)
                    {
                        embed.addField(`#${num} - ${d.username}`, `${d.rankedTier} (${numCommas(d.rankedScore)} RP)`);
                        num++;
                    }
                })
                interaction.reply({
                    embeds: [ embed ]
                });
            });
        }
        else
        {
            let data = [];
            db.all(`SELECT * FROM arRanks ORDER BY rankedScore DESC`, (err, row) => {
                if(err){
                    logger.error(err, this.name);
                }
                row.forEach((rows) => {
                    data.push(rows);
                })
    
                const embed = new Discord.MessageEmbed();
                embed.setColor(config.discord.embedHex);
                embed.setTitle(":tada:  Top 10 Ranked");
                embed.setFooter(`${getRemainingDays(config.apex.splitTime)} days remaining`);
                console.log()
    
                console.log(data);
    
                var num = 1;
                data.forEach((d) => {
                    if(num <= 10)
                    {
                        embed.addField(`#${num} - ${d.username}`, `${d.rankedTier} (${numCommas(d.rankedScore)} RP)`);
                        num++;
                    }
                })
                interaction.reply({
                    embeds: [ embed ]
                });
            });
        }
    }
}

function numCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getRemainingDays(date) {
    var createdDate = new Date(date);
    var currentDate = new Date(Date.now());
    var diffDays = Math.ceil(Math.abs(currentDate - createdDate) / (1000 * 60 * 60 * 24)) - 1;
    console.log(diffDays);
    return diffDays;
}