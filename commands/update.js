const Discord = require('discord.js');
const config = require('../config.json');
const logger = require('kailogs');
const updatePlayers = require('../functions/updatePlayers.js');

module.exports = {
    name: "update",
    description: "Manually updates user profiles",
    group: 'admin',
    async execute(message, client) {

        message.channel.send(":floppy_disk: **Updating player info...**")
        updatePlayers(message.guild, client);
    }
}