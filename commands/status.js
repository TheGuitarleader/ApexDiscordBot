const Discord = require('discord.js');
const sqlite = require('sqlite3').verbose();
const config = require('../config.json');
const logger = require('kailogs');
const request = require('request');

module.exports = {
    name: "status",
    description: "Gives the server status of Apex Legends",
    options: [
        {
          name: 'type',
          type: 3, // 'STRING' Type
          description: 'The platform you play on',
          required: true,
          choices: [
            {
                name: 'Origin Login',
                value: 'origin'
            },
            {
                name: 'EA Novafusion',
                value: 'novafusion'
            },
            {
                name: 'EA Accounts',
                value: 'accounts'
            },
            {
                name: 'Apex Crossplay',
                value: 'crossplay'
            },
            {
                name: 'APIs',
                value: 'api'
            },
            {
                name: 'Consoles',
                value: 'console'
            }
          ]
        }
      ],
    async execute(interaction, client) {
        var type = interaction.options.get('type').value;

        var options = {
            url: `https://api.mozambiquehe.re/servers?auth=${config.apex.apiKey}`,
        };

        function callback(error, response, body) {
            var info = JSON.parse(body);

            if (info.Error == undefined) {

                if(type == "origin")
                {
                    displayStatus(interaction, info.Origin_login, "Origin Login")
                }
                else if(type == "novafusion")
                {
                    displayStatus(interaction, info.EA_novafusion, "EA Novafusion")
                }
                else if(type == "accounts")
                {
                    displayStatus(interaction, info.EA_accounts, "EA Accounts")
                }
                else if(type == "crossplay")
                {
                    displayStatus(interaction, info.ApexOauth_Crossplay, "Apex Crossplay")
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
                    interaction.reply({
                        embeds: [ embed ],
                        ephemeral: true
                    });
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
                    interaction.reply({
                        embeds: [ embed ],
                        ephemeral: true
                    });
                } 
            }
        }
          
        request(options, callback);
    }
}

function displayStatus(interaction, json, name) {
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
    interaction.reply({
        embeds: [ embed ],
        ephemeral: true
    });
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