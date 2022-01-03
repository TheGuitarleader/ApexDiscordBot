const Discord = require('discord.js');
const config = require('../config.json');
const logger = require('kailogs');
const sqlite = require('sqlite3').verbose();
let db = new sqlite.Database('./BotData.db');

module.exports = function() {
    db.serialize(() => {
        db.run(`UPDATE brRanks SET oldRP = rankedScore`, function(err) {
            if(err) {
                logger.error(err, 'database');
            }
            else {
                logger.log("Updated rp values for table: 'brRanks'");
            }
        });

        db.run(`UPDATE arRanks SET oldRP = rankedScore`, function(err) {
            if(err) {
                logger.error(err, 'database');
            }
            else {
                logger.log("Updated rp values for table: 'arRanks'");
            }
        });
    });
}