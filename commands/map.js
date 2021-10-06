const Discord = require('discord.js');
const config = require('../config.json');
const package = require('../package.json');
const request = require('request');
const logger = require('kailogs');

module.exports = {
    name: "map",
    description: "Give the current map and the time left",
    group: "general",
    async execute(message, client) {
        var options = {
            url: `https://api.mozambiquehe.re/maprotation?version=2&auth=${config.apex.apiKey}`,
        };

        var args = message.content.split(' ');
        var mode = args[1].toLowerCase();

        if(mode == "br")
        {
            function callback(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var info = JSON.parse(body);
    
                    console.log(info);
    
                    const embed = new Discord.MessageEmbed()
                    .setColor(config.discord.embedHex)
                    .setTitle(`Battle Royal: ${info.battle_royale.current.map}`)
                    .addField("Time Left", info.battle_royale.current.remainingTimer, true)
                    .addField("Next", `${info.battle_royale.next.map} (For ${info.battle_royale.next.DurationInMinutes} Minutes)`, true)
                    .setImage(info.battle_royale.current.asset)
                    message.channel.send(embed);  
                }
            }
              
            request(options, callback);
        }
        else if(mode == "arenas")
        {
            function callback(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var info = JSON.parse(body);
    
                    console.log(info);
    
                    const embed = new Discord.MessageEmbed()
                    .setColor(config.discord.embedHex)
                    .setTitle(`Arenas: ${info.arenas.current.map}`)
                    .addField("Time Left", info.arenas.current.remainingTimer, true)
                    .addField("Next", `${info.arenas.next.map} (For ${info.arenas.next.DurationInMinutes} Minutes)`, true)
                    .setImage(info.arenas.current.asset)
                    message.channel.send(embed);  
                }
            }
              
            request(options, callback);
        }
        else if(mode == "arenas-ranked")
        {
            function callback(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var info = JSON.parse(body);
    
                    console.log(info);
    
                    const embed = new Discord.MessageEmbed()
                    .setColor(config.discord.embedHex)
                    .setTitle(`Ranked Arenas: ${info.arenasRanked.current.map}`)
                    .addField("Time Left", info.arenasRanked.current.remainingTimer, true)
                    .addField("Next", `${info.arenasRanked.next.map} (For ${info.arenasRanked.next.DurationInMinutes} Minutes)`, true)
                    .setImage(info.arenasRanked.current.asset)
                    message.channel.send(embed);  
                }
            }
              
            request(options, callback);
        }
        else
        {
            message.channel.send(':x: `' + mode + '`** is not a valid parameter!** Usage `!map <br>|<arenas>|<arenas-ranked>`');
        }
    }
}