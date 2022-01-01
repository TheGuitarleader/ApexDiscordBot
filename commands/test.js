const config = require('../config.json');
const logger = require('kailogs');

module.exports = {
    name: "test",
    description: "Tests commands (Dev only)",
    group: 'dev',
    stat: null,
    async execute(message, client, settings) {
        if (message.member.id == config.discord.devID)
        {
            client.channels.cache.get(config.discord.generalCh).send(`Season ${config.apex['season-num']} "${config.apex['season-name']} is live on ${config.apex.time}"`);
        }
    }
}