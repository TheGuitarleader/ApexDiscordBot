const Discord = require('discord.js');
const config = require('../config.json');
const request = require('request');
const logger = require('kailogs');
const sqlite = require('sqlite3').verbose();
let db = new sqlite.Database('./BotData.db');

module.exports = function(guild, client) {

    getPcUsers().then((pcUsers) => {
        updateDB("PC", pcUsers, guild, client);
    });

    // getPs4Users().then((ps4Users) => {
    //     console.log(ps4Users);
    //     updateDB("PS4", ps4Users);
    // });

    getXboxUsers().then((xboxUsers) => {
        updateDB("X1", xboxUsers, guild, client);
    });
}

//
// Functions
//
const getPcUsers = () => {
    return new Promise((res, rej) => {
        let result = [];
        db.each(`SELECT originID FROM accounts WHERE platform = "PC"`, (err, row) => {
            if(err) {
                rej(err)
            }
            result.push(row.originID);
        }, () => {
            res(result);
        })
    })
}

const getPs4Users = () => {
    return new Promise((res, rej) => {
        let result = [];
        db.each(`SELECT originID FROM accounts WHERE platform = "PS4"`, (err, row) => {
            if(err) {
                rej(err)
            }
            result.push(row.originID);
        }, () => {
            res(result);
        })
    })
}

const getXboxUsers = () => {
    return new Promise((res, rej) => {
        let result = [];
        db.each(`SELECT * FROM accounts WHERE platform = "X1"`, (err, row) => {
            if(err) {
                rej(err)
            }
            result.push(row.originID);
        }, () => {
            res(result);
        })
    })
}

function updateDB(platform, uids, guild, client) {
    var options = {
        url: `https://api.mozambiquehe.re/bridge?platform=${platform}&uid=${uids}&auth=${config.apex.apiKey}`,
    };

    console.log(options.url);

    function makeCallback(error, response, body) {
        var info = JSON.parse(body);

        try {
            if(Array.isArray(info) && info != undefined)
            {
                info.forEach((player) => { 
    
                    if(player.global != undefined)
                    {
                        client.user.setStatus('online');
                        //logger.log(`Updating player: ${player.global.name}`, 'function')
    
                        db.serialize(() => {
                            db.run(`UPDATE accounts SET originUser = "${player.global.name}" WHERE originID = "${player.global.uid}"`, function(err) {
                                if(err) {
                                    logger.error(err, 'api');
                                    console.log(err);
                                }
                            });
        
                            db.get(`SELECT * FROM accounts WHERE originID = "${player.global.uid}"`, (err, user) => {
                                if(err) {
                                    logger.error(err, 'api');
                                }
                                else
                                {
                                    try 
                                    {
                                        guild.members.fetch(user.discordID).then((member) => {
                                            if(member.manageable == true) {
                                                member.setNickname(player.global.name);
                                                updateRoles(player, member);
                                            }
                                            else
                                            {
                                                //logger.warn(`Unable to update ${member.displayName}'s name!'`);
                                            }
            
                                            //console.log(player.global);
                                        });
            
                                        //let gameRole = guild.roles.cache.find(r => r.name === "In Game")
            
                                        // if(player.realtime.isInGame == 0 && player.realtime.isOnline == 1)
                                        // {
                                        //     member.roles.remove(gameRole);
                                        // }
                                        // else if(player.realtime.isInGame == 1 && player.realtime.isOnline == 1)
                                        // {
                                        //     member.roles.add(gameRole);
                                        // }
                                        // else if(player.realtime.isInGame == 0 && player.realtime.isOnline == 0)
                                        // {
                                        //     member.roles.remove(gameRole);
                                        // }
                                    } catch (err) 
                                    {
                                        logger.error(err, 'function')
                                    }
                                }
                            });
        
                            db.run(`UPDATE brRanks SET username = "${player.global.name}", rankedTier = "${getRank(player.global.rank.rankName, player.global.rank.rankDiv)}", rankedScore = "${player.global.rank.rankScore}", level = "${player.global.level}", legend = "${player.realtime.selectedLegend}" WHERE uid = "${player.global.uid}"`, function(err) {
                                if(err) {
                                    logger.error(err, 'api');
                                    console.log(err);
                                }
                            });
    
                            db.run(`UPDATE arRanks SET username = "${player.global.name}", rankedTier = "${getRank(player.global.arena.rankName, player.global.arena.rankDiv)}", rankedScore = "${player.global.arena.rankScore}", level = "${player.global.level}", legend = "${player.realtime.selectedLegend}" WHERE uid = "${player.global.uid}"`, function(err) {
                                if(err) {
                                    logger.error(err, 'api');
                                    console.log(err);
                                }
                            });
                        });
                    }
                    else
                    {
                        client.user.setStatus('dnd');
                        logger.error("Returned Error: " + player.Error, 'api');
                        // client.users.fetch(config.discord.devID).then((dev) => {
                        //     dev.send("Returned Error: " + player.Error);
                        // })
                    }
                });
            }
            else
            {
                var player = info;
    
                if(player.global != undefined)
                {
                    db.serialize(() => {
                        db.run(`UPDATE accounts SET originUser = "${player.global.name}" WHERE originID = "${player.global.uid}"`, function(err) {
                            if(err) {
                                logger.error(err, 'api');
                                console.log(err);
                            }
                        });
        
                        db.get(`SELECT * FROM accounts WHERE originID = "${player.global.uid}"`, (err, user) => {
                            if(err) {
                                logger.error(err, 'api');
                            }
                            else
                            {
                                try 
                                {
                                    guild.members.fetch(user.discordID).then((member) => {
                                        if(member.manageable == true) {
                                            member.setNickname(player.global.name);
                                            updateRoles(player, member);
                                        }
                                        else
                                        {
                                            //logger.warn(`Unable to update ${member.displayName}'s name!'`);
                                        }
        
                                        console.log(player.global);
                                    });
        
                                } catch (err) 
                                {
                                    logger.error(err, 'api')
                                }
                            }
                        });
                        
                        db.run(`UPDATE brRanks SET username = "${player.global.name}", rankedTier = "${getRank(player.global.rank.rankName, player.global.rank.rankDiv)}", rankedScore = "${player.global.rank.rankScore}", level = "${player.global.level}", legend = "${player.realtime.selectedLegend}" WHERE uid = "${player.global.uid}"`, function(err) {
                            if(err) {
                                logger.error(err, 'api');
                                console.log(err);
                            }
                        });
    
                        db.run(`UPDATE arRanks SET username = "${player.global.name}", rankedTier = "${getRank(player.global.arena.rankName, player.global.arena.rankDiv)}", rankedScore = "${player.global.arena.rankScore}", level = "${player.global.level}", legend = "${player.realtime.selectedLegend}" WHERE uid = "${player.global.uid}"`, function(err) {
                            if(err) {
                                logger.error(err, 'api');
                                console.log(err);
                            }
                        });
                    });
                }
                else
                {
                    client.user.setStatus('dnd');
                    console.log("api error", 'api');
                }
            }
        }
        catch(err) {
            logger.error(err, 'api');
        }
    }
      
    request(options, makeCallback);
    //logger.log(`Sending Player API request: ${options.url}`);
}

function updateRoles(player, member) {   
    console.log(player.global.name);
    console.log(player.global.level);
    //console.log(member.roles);
    
    if(player.global.level > 499)
    {
        var role = member.guild.roles.cache.find(r => r.name === "Level 500+");
        if(!member.roles.cache.find(r => r.name === "Level 500+"))
        {
            member.roles.add(role);

            var prevRole = member.guild.roles.cache.find(r => r.name === "Level 400+");
            member.roles.remove(prevRole);
        }
    }
    else if(player.global.level > 400 && player.global.level < 499)
    {
        var role = member.guild.roles.cache.find(r => r.name === "Level 400+");
        if(!member.roles.cache.find(r => r.name === "Level 400+"))
        {
            member.roles.add(role);

            var prevRole = member.guild.roles.cache.find(r => r.name === "Level 300+");
            member.roles.remove(prevRole);
        }
    }
    else if(player.global.level > 300 && player.global.level < 399)
    {
        var role = member.guild.roles.cache.find(r => r.name === "Level 300+");
        if(!member.roles.cache.find(r => r.name === "Level 300+"))
        {
            member.roles.add(role);

            var prevRole = member.guild.roles.cache.find(r => r.name === "Level 200+");
            member.roles.remove(prevRole);
        }
    }
    else if(player.global.level > 200 && player.global.level < 299)
    {
        var role = member.guild.roles.cache.find(r => r.name === "Level 200+");
        if(!member.roles.cache.find(r => r.name === "Level 200+"))
        {
            member.roles.add(role);

            var prevRole = member.guild.roles.cache.find(r => r.name === "Level 100+");
            member.roles.remove(prevRole);
        }
    }
    else if(player.global.level > 100 && player.global.level < 199)
    {
        var role = member.guild.roles.cache.find(r => r.name === "Level 100+");
        if(!member.roles.cache.find(r => r.name === "Level 100+"))
        {
            member.roles.add(role);

            var prevRole = member.guild.roles.cache.find(r => r.name === "Level 1+");
            member.roles.remove(prevRole);
        }
    }
    else if(player.global.level > 0 && player.global.level < 99)
    {
        var role = member.guild.roles.cache.find(r => r.name === "Level 1+");
        if(!member.roles.cache.find(r => r.name === "Level 1+"))
        {
            member.roles.add(role);
        }
    }
}

function getRank(rankName, rankTier) {
    if(rankName == "Unranked" || rankName == "Master" || rankName == "Apex Predator")
    {
        return rankName;
    }
    else
    {
        let rank = rankName + " " + rankTier
        return rank;
    }
}