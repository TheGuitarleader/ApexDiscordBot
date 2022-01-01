const sqlite = require('sqlite3').verbose();
const Discord = require('discord.js');
const fs = require('fs');
const config = require('../config.json');
const request = require('request');
const logger = require('kailogs');

let db = new sqlite.Database('./BotData.db');

module.exports = {
    name: "pro-ranked",
    description: "Shows the top ranks of pro players",
    group: 'general',
    async execute(interaction, client) {   
        getPros('./textfiles/pro-uids.txt').then((uids) => {
            var options = {
                url: `https://api.mozambiquehe.re/bridge?platform=PC&uid=${uids}&auth=${config.apex.apiKey}`,
            };

            console.log(options.url);
        
            function makeCallback(error, response, body) {
                var data = JSON.parse(body);

                const embed = new Discord.MessageEmbed();
                embed.setColor(config.discord.embedHex);
                embed.setTitle(":tada:  Top Pro Ranked");
                embed.setFooter(`${getRemainingDays(config.apex.splitTime)} days remaining`);
    
                data.sort((a, b) => parseFloat(b.global.rank.rankScore) - parseFloat(a.global.rank.rankScore));
                console.log(data);
                
                data.forEach((d) => {
                    console.log(d.global.rank);
                    embed.addField(`#${numCommas(d.global.rank.ladderPosPlatform)} - ${d.global.name}`, `${getRank(d.global.rank)}`);
                });

                interaction.editReply({
                    content: ':floppy_disk: **Data retrieved.**',
                    embeds: [ embed ]
                });
            }
              
            request(options, makeCallback);
            interaction.reply({
                content: ':floppy_disk: **Retrieving data...**  *Please allow up to 25 secs for the API to respond.*',
                ephemeral: true
            });
        })
    }
}

function getPros(path) {
    return new Promise((res, rej) => {
        let result = [];
        fs.readFile(path, 'utf8', function(err, data) {
            if(err){
                rej(err);
            }

            var array = data.toString().split("\n");
            for(i in array) {
                result.push(array[i].replace("\r",""));
            }
            res(result);
        });
    });
}

function getRank(rank) {
    if(rank.rankName == "Unranked" || rank.rankName == "Master" || rank.rankName == "Apex Predator")
    {
        var format = `${rank.rankName} (${numCommas(rank.rankScore)} RP)`;
        return format;
    }
    else
    {
        var format = `${rank.rankName} ${rank.rankDiv} (${numCommas(rank.rankScore)} RP)`;
        return format;
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