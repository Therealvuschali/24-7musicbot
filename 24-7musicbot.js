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
        if (message.member.voiceChannel) {
            message.guild.voiceConnection.disconnect();
            message.reply('okay, i see im not wanted anymore, ill go now :cry:')
            console.log('disconnected from a channel');
        } else {
        message.reply('You are not even in a voice channel!');
        }
    }
    if (message.content === 'musicbot help') {
        message.reply(' Here you go, use **musicbot join** to make me join and play. use **musicbot leave** to make me leave the channel.');
    }
    if (message.content === 'musicbot info') {
        message.reply('im currently connected to ' + client.guilds.size + ' discord servers !');
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
