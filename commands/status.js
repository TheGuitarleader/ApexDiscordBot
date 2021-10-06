const Discord = require('discord.js');
const sqlite = require('sqlite3').verbose();
const config = require('../config.json');
const logger = require('kailogs');
const request = require('request');

module.exports = {
    name: "status",
    description: "Gives the server status of Apex Legends",
    group: 'status',
    async execute(message, client) {
        var args = message.content.split(' ');
        var type = args[1].toLowerCase();

        var options = {
            url: `https://api.mozambiquehe.re/servers?auth=${config.apex.apiKey}`,
        };

        function callback(error, response, body) {
            var info = JSON.parse(body);

            if (info.Error == undefined) {

                if(type == "origin")
                {
                    displayStatus(message.channel, info.Origin_login, "Origin Login")
                }
                else if(type == "novafusion")
                {
                    displayStatus(message.channel, info.EA_novafusion, "EA Novafusion")
                }
                else if(type == "accounts")
                {
                    displayStatus(message.channel, info.EA_accounts, "EA Accounts")
                }
                else if(type == "crossplay")
                {
                    displayStatus(message.channel, info.ApexOauth_Crossplay, "Apex Crossplay")
                }
                else if(type == "api")
                {
                    var json = info.selfCoreTest;

                    console.log(json);
                    console.log(body);

                    const embed = new Discord.MessageEmbed()
                    .setColor(config.discord.embedHex)
                    .setTitle("APIs")
                    .addField("Stats-API", `${json["Stats-API"].Status}   ${json["Stats-API"].ResponseTime} ms`)
                    .addField("Discord-API", `UP   ${client.ws.ping} ms`)
                    .addField("Origin-API", `${json["Origin-API"].Status}   ${json["Origin-API"].ResponseTime} ms`)
                    .addField("Playstation-API", `${json["Playstation-API"].Status}   ${json["Playstation-API"].ResponseTime} ms`)
                    .addField("Xbox-API", `${json["Xbox-API"].Status}   ${json["Xbox-API"].ResponseTime} ms`)
                    .setFooter("apexlegendsstatus.com")
                    message.channel.send(embed);
                }
                else if(type == "console")
                {
                    var json = info.otherPlatforms;

                    const embed = new Discord.MessageEmbed()
                    .setColor(config.discord.embedHex)
                    .setTitle("Consoles")
                    .addField("Playstation-Network", `${json["Playstation-Network"].Status}`)
                    .addField("Xbox-Live", `${json["Xbox-Live"].Status}`)
                    .setFooter("apexlegendsstatus.com")
                    message.channel.send(embed);
                }
                else if(type == "view")
                {
                    const embed = new Discord.MessageEmbed()
                    .setColor(config.discord.embedHex)
                    .setTitle("Status Types")
                    .addField("accounts", "EA Accounts")
                    .addField("api", "APIs")
                    .addField("console", "Consoles")
                    .addField("crossplay", "Apex Crossplay")
                    .addField("novafusion", "EA Novafusion")
                    .addField("origin", "Origin Login")                   
                    .setFooter("apexlegendsstatus.com")
                    message.channel.send(embed);
                }   
            }
        }
          
        request(options, callback);
        message.channel.send(":computer: Pinging...").then(msg => {
            msg.delete({ timeout: 3000 });
        });
    }
}

function displayStatus(channel, json, name) {
    console.log(json);

    const embed = new Discord.MessageEmbed()
    .setColor(config.discord.embedHex)
    .setTitle(name)
    .addField("EU-West", `${json["EU-West"].Status}     ${json["EU-West"].ResponseTime} ms`, true)
    .addField("EU-East", `${json["EU-East"].Status}     ${json["EU-East"].ResponseTime} ms`, true)
    .addField("US-West", `${json["US-West"].Status}     ${json["US-West"].ResponseTime} ms`, true)
    .addField("US-Central", `${json["US-Central"].Status}       ${json["US-Central"].ResponseTime} ms`, true)
    .addField("US-East", `${json["US-East"].Status}     ${json["US-East"].ResponseTime} ms`, true)
    .addField("South America", `${json.SouthAmerica.Status}     ${json.SouthAmerica.ResponseTime} ms`, true)
    .setFooter("apexlegendsstatus.com")
    channel.send(embed);
}

function getStatus(status) {
    if(status == 0)
    {
        let offline = "Offline"
        return offline;
    }
    else if(status == 1)
    {
        let online = "Online"
        return online;
    }
}