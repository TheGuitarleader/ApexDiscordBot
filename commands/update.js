const Discord = require('discord.js');
const config = require('../config.json');
const logger = require('kailogs');
const updatePlayers = require('../functions/updatePlayers.js');
const updateRPDiff = require('../functions/updateRPDiff.js');

module.exports = {
    name: "update",
    description: "Manually updates user profiles",
    options: [
        {
          name: 'type',
          type: 3, // 'STRING' Type
          description: 'The type of update',
          required: true,
          choices: [
            {
                name: 'Players',
                value: 'players'
            },
            {
                name: 'RP',
                value: 'rp'
            }
          ]
        }
      ],
    async execute(interaction, client) {
        var type = interaction.options.get('type').value;
        if(type == "players") {
            updatePlayers(interaction.guild, client);
            interaction.reply({
                content: ":floppy_disk: **Updating player info...**",
                ephemeral: true
            });
        }
        else if(type == "rp") {
            updateRPDiff();
            interaction.reply({
                content: ":floppy_disk: **Updating rp values...**",
                ephemeral: true
            });
        }
    }
}