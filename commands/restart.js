const config = require('../config.json');
const logger = require('kailogs');

module.exports = {
    name: "restart",
    description: "Restarts the bot (Dev only)",
    async execute(interaction, client) {
        if (interaction.member.id == config.discord.devID)
        {
            interaction.reply({
                content: ":white_check_mark: **Restarting...**",
                ephemeral: true
            }).then(msg => {
                process.exit();
            })
        }
        else
        {
            interaction.reply({
                content: ":no_entry_sign: **Unauthorised**",
                ephemeral: true
            })
        }
    }
}