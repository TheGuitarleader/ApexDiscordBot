const Discord = require('discord.js');
const fs = require('fs');
const config = require('../config.json');
const package = require('../package.json');
const logger = require('kailogs');

module.exports = {
    name: "changelog",
    description: "Sends a message talking about whats changed",
    group: 'general',
    async execute(interaction, client) {
        var changelog = await readChangelog('./textfiles/changelog.txt');
        
        const embed = new Discord.MessageEmbed()
        .setColor(config.discord.embedHex)
        .setTitle(`What's new with ${client.user.username} v${package.version}?`)
        .setDescription(changelog)

        logger.log(`Displayed changelog on guild ${interaction.guild.id} (${interaction.guild.name})`, this.name);
        interaction.reply({
            embeds: [ embed ]
        });
    }
}

async function readChangelog(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', function (err, data) {
            if(err){
                reject(err);
            }
            resolve(data);
        });
    });
}