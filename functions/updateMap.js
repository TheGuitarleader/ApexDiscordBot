const Discord = require('discord.js');
const config = require('../config.json');
const request = require('request');
const logger = require('kailogs');
const sqlite = require('sqlite3').verbose();
let db = new sqlite.Database('./BotData.db');

module.exports = function(client) {
    var options = {
        url: `https://api.mozambiquehe.re/maprotation?version=2&auth=${config.apex.apiKey}`,
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);

            if(info.battle_royale != undefined)
            {
                var map = info.battle_royale.current.map;
                client.user.setPresence({ activity: { name: `on ${map}` }});
                logger.log(`Updated map to '${map}'`);
            }
            else
            {
                client.user.setStatus('dnd');
                logger.error("Returned Error: " + player.Error, 'function');
            }
        }
    }
      
    request(options, callback);
    logger.log(`Sending Map API request: ${options.url}`);
}