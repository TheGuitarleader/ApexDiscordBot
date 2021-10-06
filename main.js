const fs = require('fs');
const Discord = require('discord.js');
const Client = require('./client/client');
const config = require('./config.json');
const package = require('./package.json');
const logger = require('kailogs');
const clock = require('date-events')();
const moment = require('moment');
const updatePlayers = require('./functions/updatePlayers.js');
const updateMap = require('./functions/updateMap.js');

const client = new Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const sqlite = require('sqlite3').verbose();
let db = new sqlite.Database('./BotData.db');

for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

logger.loadLog('./logs');
logger.log(`${package.name} v${package.version}`, 'main');
client.login(config.discord.token);

client.once('disconnect', () => {
	logger.warn('Disconnected from Discord', 'main');
});

client.once('ready', () => {
    logger.log('Online and connected to Discord', 'main');
    updateMap(client);
});

// Saves the log at 11:59pm
clock.on('23:59', function (date) {
    logger.save();
    logger.createLog('./logs');
});

setInterval(function() {
    console.log("Updating Players");
    client.guilds.fetch(config.discord.guild).then((guild) => {updatePlayers(guild, client)}).catch(logger.error);
}, 120000);

setInterval(function() {
    console.log("Updating Map");
    updateMap(client);
}, 302000)

// Handle commands
client.on('message', async message => {
    if(message.author.bot) return;
    if(!message.content.startsWith(config.discord.botPrefix)) return;
    
    try {
        const args = message.content.slice(config.discord.botPrefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName);
        command.execute(message, client); 
        logger.log(`Ran command: '${config.discord.botPrefix}${commandName}' from '${message.author.username}'`, 'main');
        
    } catch(err) {
        logger.warn(`Unknown command: '${message.content}' from '${message.author.username}' (${message.guild.name})`, 'main');
        logger.error(err, 'main');
    }
});


//
// Voice Channel create and delete
//
client.on('voiceStateUpdate', (oldState, newState) => {
    var catagory = client.channels.cache.get(config.discord.channel);
    var channels = catagory.children.filter((c) => c.type !== "category");

    if(newState.channel != null && newState.channel.name == 'Join to Create!') { 
        newState.guild.channels.create(`Party Chat`, {
            type: 'voice',
            parent: config.discord.channel,
            userLimit: 3
        }).then(vc => {
            newState.setChannel(vc);
        })
    }

    if(oldState.channel != null && oldState.channel.name == 'Party Chat' )
    {
        if(oldState.channel.members.size < 1)
        {
            oldState.channel.delete();
        }
    }
});

//
// New member joins
//
client.on('guildMemberAdd', member => {
    logger.log(`User '${member.username}' (${member.id}) joined server '${member.guild.id}' (${member.guild.name})`)

    var user = client.users.cache.find(user => user.id === member.id);
    var createdDate = new Date(user.createdAt);

    const embed = new Discord.MessageEmbed()
    .setColor('1f8b4c')
    .setAuthor(`${user.username}#${user.discriminator} joined the guild`)
    .addField('Total Users:', member.guild.memberCount, true)
    .addField('Account created:', `${createdDate.toString().split(" ").slice(0, 4).join(" ")} (${getActiveDays(user.createdAt) -1} days old)`, true)
    .setFooter("ID: " + user.id)
    client.channels.cache.get(config.discord.logging).send(embed);
});


//
// Member leaves
//
client.on('guildMemberRemove', member => {
    logger.log(`User '${member.username}' (${member.id}) left server '${member.guild.id}' (${member.guild.name})`)

    var user = client.users.cache.find(user => user.id === member.id);
    var createdDate = new Date(user.createdAt);

    const embed = new Discord.MessageEmbed()
    .setColor('E74C3C')
    .setAuthor(`${user.username}#${user.discriminator} left the guild`)
    .addField('Total Users:', member.guild.memberCount, true)
    .addField('Account created:', `${createdDate.toString().split(" ").slice(0, 4).join(" ")} (${getActiveDays(user.createdAt) -1} days old)`, true)
    .setFooter("ID: " + user.id)
    client.channels.cache.get(config.discord.logging).send(embed);

    db.serialize(() => {
        db.run(`DELETE FROM rankings WHERE username = "${member.displayName}"`, (err) => {
            if(err){
                logger.error(err, 'database');
            }
            else
            {
                logger.log(`Removed rankings for user '${user.username}' from database`, 'event');
            }
        });

        db.run(`DELETE FROM accounts WHERE discordID = "${member.id}"`, (err) => {
            if(err){
                logger.error(err, 'database');
            }
            else
            {
                logger.log(`Removed account '${user.username}'`, 'event');
            }
        });
    })
});


//
// Log invite creates
//
client.on('inviteCreate', (invite) => {
    console.log(invite);
    logger.log(`User '${invite.inviter.username}' created invite' (${invite.code})`)

    var user = client.users.cache.find(user => user.id === invite.inviter.id);
    var createdDate = new Date(invite.createdAt);
    var expireDate = new Date(invite.expiresAt);

    const embed = new Discord.MessageEmbed()
    .setColor('1f8b4c')
    .setAuthor(`${user.username}#${user.discriminator} created invite`, user.avatarURL())
    .addField('Code:', invite.code)
    .addField('Created:', `${moment(createdDate).format('llll')} (${getActiveMinutes(invite.createdAt)} minutes ago)`)
    .addField('Expires:', `${moment(expireDate).format('llll')} (${getActiveMinutes(invite.expiresAt)} minutes)`)
    .setFooter("ID: " + user.id)
    client.channels.cache.get(config.discord.logging).send(embed);
});


//
// Functions
//
function getActiveMinutes(date) {
    var createdDate = new Date(date);
    console.log(createdDate);
    var currentDate = new Date(Date.now());
    var diffMin = Math.ceil(Math.abs(currentDate - createdDate) / (1000 * 60));
    console.log(diffMin);
    return diffMin;
}

function getActiveDays(date) {
    var createdDate = new Date(date);
    console.log(createdDate);
    var currentDate = new Date(Date.now());
    var diffDays = Math.ceil(Math.abs(currentDate - createdDate) / (1000 * 60 * 60 * 24));
    console.log(diffDays);
    return diffDays;
}