const Discord = require('discord.js');
const client = new Discord.Client({autoReconnect:true});
var Stream = "http://stream01.iloveradio.de/iloveradio5.mp3";
var previousplaying = "none";
var nowplaying = "W.I.P. | DELUUXE.NL";
var opus = require('node-opus');
var internetradio = require('node-internet-radio');
const ms = require('ms');
var songcount = 0;

var rate = 96000;
var encoder = new opus.OpusEncoder(rate);


// Create an event listener for messages
client.on('message', message => {
    if (message.content === 'AJ join') {
      if(message.member.status != 'offline') {
        if (message.member.voiceChannel) {       
            message.member.voiceChannel.join()
            .then(connection => { // Connection is an instance of VoiceConnection
                connection.playStream("http://stream01.iloveradio.de/iloveradio5.mp3");
                message.reply('Im there!');
                //console.log('playing in new channel');
                client.guilds.get('266614161868324865').channels.get('382125620286717952').send('playing in a new channel: ' + message.member.voiceChannel.name + '. On server: ' + message.guild.name + '.');
                console.log('playing in a new channel: ' + message.member.voiceChannel.name + '. On server: ' + message.guild.name + '.');
            })
            .catch(console.log);
            } else {
            message.reply('You need to join a voice channel first!');
        }
      } else {
        message.reply("please go online before asking that!");
      }
    }
    if (message.content === 'AJ leave') {
        if ((message.guild.voiceConnection) && (message.member.voiceChannel)) {
            message.guild.voiceConnection.disconnect();
            message.reply('okay, i see im not wanted anymore, ill go now :cry:');
            client.guilds.get('266614161868324865').channels.get('382125620286717952').send('disconnected from a channel: ' + message.member.voiceChannel.name + '. On server: ' + message.guild.name + '.');
            console.log('left a channel: ' + message.member.voiceChannel.name + '. On server: ' + message.guild.name + '.');
        } else if (!(message.member.voiceChannel)) {
            message.reply('you are not even in a voice channel!');
        } else {
            message.reply('cannot leave a channel that im not connected to.');
        }
    }
    if (message.content === 'AJ help') {
        message.channel.send({embed: {
            color: 3447003,
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL
            },
            title: "AJ help",
            url: "http://www.DELUUXE.NL/",
            description: "Here are the commands you can use for me.",
            fields: [{
                name: "AJ join",
                value: "Makes me join your current voice channel so i can play in it all day long. :smiley:"
              },
              {
                name: "AJ leave",
                value: "Makes me leave the voice channel you are connected to."
              },
              {
                name: "AJ info",
                value: "Tells you information about the bot, such as server count, amount of users and a importand note."
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
    if (message.content === 'AJ info') {
        message.channel.send({embed: {
            color: 3447003,
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL
            },
            title: "AJ information",
            url: "http://www.DELUUXE.NL/",
            description: "Here is some information about me.",
            fields: [{
                name: "Server/guild count",
                value: "At the moment i'm connected to " + client.guilds.size + " servers/guilds."
              },
              {
                name: "Uptime",
                value: "I have been running for " + ms(client.uptime, { long: true }) + "."
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
                value: "I currently have a connection speed of " + Math.round(client.ping) + "ms."
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

var previousplaying = '';
const checkNowPlaying = function (err, station) {
    if (err) { /*console.log('error', err);*/ return; }
    nowplaying = (station.title);
    if (nowplaying != previousplaying) {
      console.log(nowplaying);
      client.user.setActivity(nowplaying, { type: 'PLAYING' });
      previousplaying = (nowplaying);
      songcount = songcount + 1;
      console.log("songs played after rejoin " + songcount);
        if (songcount >= 5) {
          console.log("BOT REJOINED");
          client.channels.filter(c => c.type === 'voice' && c.members.has(client.user.id)).forEach(async (chan)  => {
              await chan.leave();
             chan.join().then(connection => { connection.playStream("http://stream01.iloveradio.de/iloveradio5.mp3"); });
          });
          songcount = 0;
        }
    }
}

const intervalHandler = function (){
  internetradio.getStationInfo(Stream, checkNowPlaying, internetradio.StreamSource.STREAM);
}


client.on('ready', () => {
    console.log("You are connected to " + client.guilds.size + " servers!");
    console.log('I am ready!'); 
    console.log("im currently connected to " + client.guilds.map(g => g.name));
    client.user.setStatus('online');

    console.log("BOT REJOINED");
    client.channels.filter(c => c.type === 'voice' && c.members.has(client.user.id)).forEach(async (chan)  => {
      await chan.leave();
      chan.join().then(connection => { connection.playStream("http://stream01.iloveradio.de/iloveradio5.mp3"); });
    });

    var interval = setInterval (intervalHandler, 5000); // time between each interval in milliseconds
});

client.login(process.env.TOKEN);
