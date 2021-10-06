const config = require('../config.json');
const logger = require('kailogs');

module.exports = {
    name: "restart",
    description: "Restarts the bot (Dev only)",
    group: 'dev',
    stat: null,
    async execute(message, client, settings) {
        if (message.member.id == config.discord.devID)
        {
            //logger.log("Restart requested. Saving log...");
            //logger.save('Restart');
            message.channel.send(":white_check_mark: **Restarting...**").then(msg => {
                process.exit();
            })
        }
    }
}