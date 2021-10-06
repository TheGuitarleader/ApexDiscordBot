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

    // getXboxUsers().then((xboxUsers) => {
    //     updateDB("X1", xboxUsers, guild, client);
    // });
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
                                logger.error(err, 'database');
                                console.log(err);
                            }
                        });
    
                        db.get(`SELECT * FROM accounts WHERE originID = "${player.global.uid}"`, (err, user) => {
                            if(err) {
                                logger.error(err, 'database');
                            }
                            else
                            {
                                try 
                                {
                                    var member = guild.member(user.discordID);

                                    if(member.manageable == true) {
                                        member.setNickname(player.global.name);
                                    }
                                    else
                                    {
                                        logger.warn(`Unable to update ${member.displayName}'s name!'`);
                                    }
    
                                    console.log(player.global.name)
                                    console.log(player.realtime);
        
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
    
                        db.run(`INSERT OR REPLACE INTO brRanks(uid, username, rankedTier, rankedScore, level, legend) VALUES("${player.global.uid}", "${player.global.name}", "${getRank(player.global.rank.rankName, player.global.rank.rankDiv)}", "${player.global.rank.rankScore}", "${player.global.level}", "${player.realtime.selectedLegend}")`, function(err) {
                            if(err) {
                                logger.error(err, 'database');
                                console.log(err);
                            }
                        });
            
                        db.run(`INSERT OR REPLACE INTO arRanks(uid, username, rankedTier, rankedScore, level, legend) VALUES("${player.global.uid}", "${player.global.name}", "${getRank(player.global.arena.rankName, player.global.arena.rankDiv)}", "${player.global.arena.rankScore}", "${player.global.level}", "${player.realtime.selectedLegend}")`, function(err) {
                            if(err) {
                                logger.error(err, 'database');
                            }
                        });
                    });
                }
                else
                {
                    client.user.setStatus('dnd');
                    logger.error("Returned Error: " + player.Error, 'function');
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
                            logger.error(err, 'database');
                            console.log(err);
                        }
                    });
    
                    db.get(`SELECT * FROM accounts WHERE originID = "${player.global.uid}"`, (err, user) => {
                        if(err) {
                            logger.error(err, 'database');
                        }
                        else
                        {
                            try 
                            {
                                var member = guild.member(user.discordID);
    
                                console.log(player.global.name)
                                console.log(player.realtime);
    
                                member.setNickname(player.global.name);
    
                                let gameRole = guild.roles.cache.find(r => r.name === "In Game")
    
                                if(player.realtime.isInGame == 0 && player.realtime.isOnline == 1)
                                {
                                    member.roles.remove(gameRole);
                                }
                                else if(player.realtime.isInGame == 1 && player.realtime.isOnline == 1)
                                {
                                    member.roles.add(gameRole);
                                }
                                else if(player.realtime.isInGame == 0 && player.realtime.isOnline == 0)
                                {
                                    member.roles.remove(gameRole);
                                }
                            } catch (err) 
                            {
                                logger.error(err, 'function')
                            }
                        }
                    });
                    
                    db.run(`INSERT OR REPLACE INTO brRanks(uid, username, rankedTier, rankedScore) VALUES("${player.global.uid}", "${player.global.name}", "${getRank(player.global.rank.rankName, player.global.rank.rankDiv)}", "${player.global.rank.rankScore}")`, function(err) {
                        if(err) {
                            logger.error(err, 'database');
                            console.log(err);
                        }
                    });
        
                    db.run(`INSERT OR REPLACE INTO arRanks(uid, username, rankedTier, rankedScore) VALUES("${player.global.uid}", "${player.global.name}", "${getRank(player.global.arena.rankName, player.global.arena.rankDiv)}", "${player.global.arena.rankScore}")`, function(err) {
                        if(err) {
                            logger.error(err, 'database');
                        }
                    });
                });
            }
            else
            {
                client.user.setStatus('dnd');
                console.log("api error", 'function');
            }
        }
    }
      
    request(options, makeCallback);
    logger.log(`Sending Player API request: ${options.url}`);
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