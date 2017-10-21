const Discord = require('discord.js');
const client = new Discord.Client({autoReconnect:true});
var internetradio = require('node-internet-radio');
var Stream = "http://stream12.iloveradio.de/iloveradio5-aac.mp3";
var previousplaying = "none";


// Create an event listener for messages
client.on('message', message => {
    // If the message is "ping"
    if (message.content === 'ping') {
      // Send "pong" to the same channel
      message.channel.send('pong');
    }
    if (message.content === 'u suck m8') {
        message.channel.send('but you suck balls XD');
    }
    if (message.content === 'no u') {
        message.channel.send('No u');
    }
    if (message.content === 'it works') {
        message.channel.send('ofcourse it works :wink:');
    }
    if (message.content === 'exit musicbot') {
        message.channel.send('the music bot is now going offline. bye bye')
        .then(connection => {
            client.user.setStatus('idle')
            process.exit(0);
        })   
    }
    if (message.content === 'musicbot join') {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
              .then(connection => { // Connection is an instance of VoiceConnection
                message.reply('Im there m8!');
                connection.playStream('http://stream12.iloveradio.de/iloveradio5-aac.mp3');
                console.log('playing in new channel');
              })
              .catch(console.log);
        } else {
            message.reply('You fucking idiot, you need to join a voice channel first!');
        }
    }
    if (message.content === 'fuckoff') {
        if (message.member.voiceChannel) {
                message.guild.voiceConnection.disconnect();
                message.reply('okay, i see im not wanted anymore, ill go now :cry:')
                console.log('disconnected from a channel');
        } else {
            message.reply('You fucking idiot, you are not even in a voice channel!');
        }
    }
    if (message.content === 'musicbot help') {
        message.channel.sendFile("GIFCAT.gif", "GIFCAT.gif");
        setTimeout(function() {
            message.reply('I mean, you wanted help? Here you go, use **musicbot join** to make me join and play. use **fuckoff** to make me leave the channel.');
        }, 5000);
    }
    if (message.content.includes("i will win")) {
        message.reply('I dont think so, i have all day :stuck_out_tongue:');
    }
});

client.on('ready', () => {
    console.log("You are connected to " + client.guilds.size + " servers!");
    console.log('I am ready!'); 
    client.user.setStatus('online');
    client.user.setGame("iloveradio.de/ilovemashup");
    let channel = client.channels.get('272849981898227724');
    channel.join().then(connection => { connection.playStream('http://stream12.iloveradio.de/iloveradio5-aac.mp3'); })
    console.log('Connected and playing on YGS');
    let channel1 = client.channels.get('344602529533001728');
    channel1.join().then(connection => { connection.playStream('http://stream12.iloveradio.de/iloveradio5-aac.mp3'); })
    console.log('Connected and playing on MGATW');
    
    var previousplaying = ''; 
    const checkNowPlaying = function (err, station) {
        if (err) { console.log('error', err); return; }
        nowplaying = (station.title);
        if (nowplaying != previousplaying) {
            console.log(nowplaying);
            client.user.setGame(nowplaying);
            previousplaying = (nowplaying);
        }
    }
    var interval = setInterval (function (){
            internetradio.getStationInfo(Stream, checkNowPlaying);
    }, 5000); // time between each interval in milliseconds
});

    
client.login(process.env.TOKEN);
