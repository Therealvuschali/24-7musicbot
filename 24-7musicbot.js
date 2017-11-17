const Discord = require('discord.js');
const client = new Discord.Client({autoReconnect:true});
var internetradio = require('node-internet-radio');
var Stream = "http://stream12.iloveradio.de/iloveradio5-aac.mp3";
var previousplaying = "none";
var nowplaying = "iloveradio.de/ilovemashup";
var opus = require('node-opus');
var rate = 96000;
var encoder = new opus.OpusEncoder(rate);


// Create an event listener for messages
client.on('message', message => {
    if (message.content === 'musicbot join') {
        if (message.member.voiceChannel) {       
            message.member.voiceChannel.join()
            .then(connection => { // Connection is an instance of VoiceConnection
                message.reply('Im there m8!');
                connection.playStream(Stream);
                console.log('playing in new channel');
            })
            .catch(console.log);
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }
    if (message.content === 'musicbot leave') {
        if ((message.guild.voiceConnection) && message.member.voiceChannel) {
            message.guild.voiceConnection.disconnect();
            message.reply('okay, i see im not wanted anymore, ill go now :cry:')
            console.log('disconnected from a channel');
        } else if (!(message.member.voiceChannel)) {
            message.reply('you are not even in a voice channel!');
        } else {
            message.reply('cannot leave a channel that im not connected to.');
        }
    }
    if (message.content === 'musicbot help') {
        message.channel.send({embed: {
            color: 3447003,
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL
            },
            title: "24/7 🔊 help",
            url: "http://www.DELUUXE.NL/",
            description: "Here are the commands you can use for me.",
            fields: [{
                name: "musicbot join",
                value: "Makes me join your current voice channel so i can play in it all day long. :)"
              },
              {
                name: "musicbot leave",
                value: "Makes me leave the voice channel you are connected to."
              },
              {
                name: "musicbot info",
                value: "Tells you how many servers im connected at that moment."
              },
              {
                name: "note",
                value: "this bot is designed to play 24/7 in a voice channel, and thus its not recommended that you make it join and/or leave too often."
              },
            ],
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL,
              text: "Creator: DELUUXE"
            }
          }
        });
    }
    if (message.content === 'musicbot info') {
        message.channel.send({embed: {
            color: 3447003,
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL
            },
            title: "24/7 🔊 information",
            url: "http://www.DELUUXE.NL/",
            description: "Here is some information about me.",
            fields: [{
                name: "Server/guild count",
                value: "At the moment im connected to " + client.guilds.size + " servers/guilds."
              },
              {
                name: "Uptime",
                value: "i have been running for " + (Math.round(client.uptime / (1000 * 60 * 60))) + " hours, " + (Math.round(client.uptime / (1000 * 60)) % 60) + " minutes, and " + (Math.round(client.uptime / 1000) % 60) + " seconds."
              },
              {
                name: "User count",
                value: "I'm serving " + client.users.size + " users currently."
              },
              {
                name: "Connected voicechannel count",
                value: "I'm connected to " + client.voiceConnections.size + " voice channels."
              },
              {
                name: "Ping",
                value: "I currently have a connection speed of" + client.ping + "ms"
              },
            ],
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL,
              text: "Created by DELUUXE"
            }
        }
        });
    }
});

client.on('ready', () => {
    console.log("You are connected to " + client.guilds.size + " servers!");
    console.log('I am ready!'); 
    client.user.setStatus('online');
    
    var previousplaying = ''; 
    const checkNowPlaying = function (err, station) {
        if (err) { console.log('error', err); return; }
        nowplaying = (station.title);
        if (nowplaying != previousplaying) {
            console.log(nowplaying);
            client.user.setGame(nowplaying);
            previousplaying = (nowplaying);
            client.channels.filter(c => c.type === 'voice' && c.members.has(client.user.id)).forEach(async (chan)  => {
                await chan.leave();
                chan.join().then(connection => { connection.playStream(Stream); });
            });
        }
    }
    var interval = setInterval (function (){
            internetradio.getStationInfo(Stream, checkNowPlaying);
    }, 5000); // time between each interval in milliseconds

});

client.login(process.env.TOKEN);
