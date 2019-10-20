const jimp = require('jimp');
const Discord = require('discord.js');
const fs = require('fs');
const request = require('request');

const botDetails = require('./package.json');
const rawData = fs.readFileSync('./json/botinfo.json');
var rawDataRoles = fs.readFileSync('./json/roles.json');
const botToken = require('./json/bottoken.json');

const rawDataGuild = fs.readFileSync('./json/guildinfo.json');
const rawDataSeeded = fs.readFileSync('./json/seededinfo.json');
const rawDataIndiv = fs.readFileSync('./json/individualinfo.json');

const bot = new Discord.Client();
const botInfo = JSON.parse(rawData);
var rolesInfo = JSON.parse(rawDataRoles);
const guildInfo = JSON.parse(rawDataGuild);
const seedInfo = JSON.parse(rawDataSeeded);
const indivInfo = JSON.parse(rawDataIndiv);

const rolesJS = require('./roles.js');
const emotesJS = require('./emotes.js');
const guildWarJS = require('./guildwar.js');
const otherJS = require('./other.js');
const adminJS = require('./admin.js');

var botSpamControl = [];

bot.login(botToken.token);

bot.on('error',(err) => {
    console.log("bot error: " + err.message);
});

bot.on('ready',() => {
    bot.user.setActivity("with Korux");
    console.log(botDetails.name + " is online");
});

bot.on('message',(message) => {

    if(message.author.id == bot.user.id){

        function emitSpamError(){
            bot.destroy().then(function(){
                console.log("Spam Detected, Terminating Bot");
            })
            .catch(console.error);
        }

        if(message.attachments.array.length > 2 || 
        message.mentions.everyone ||
        message.mentions.channels.array.length > 0 ||
        message.mentions.roles.array.length > 0 || 
        message.tts){
            emitSpamError();
        }

        var now = Math.floor(Date.now());
        botSpamControl.push({"time" : now, "message" : message});

        var match = 0;
        for(var i = 0; i < botSpamControl.length;i++){

            if(botSpamControl[i].time > now - 1000){
                match++;
                if(match >= 6){
                    emitSpamError();
                }
            } else if (botSpamControl[i].time < now - 1000){
                botSpamControl = [];
            }
        }
    }

    if(message.content == "!commands"){
        var currCommands ='The Current Commands Are: \n ```';
        botInfo.allCommands.forEach(function(command){
            currCommands = currCommands + command.name + '\n';
        });
        currCommands += '```';
        message.channel.send(currCommands);
    }

// - ADMIN -

    if(message.content.substr(0,12) == "!botplaying "){
        adminJS.botPlaying(message,bot);
    }
    if(message.content.substr(0,9) == "!botname "){
        adminJS.botName(message,bot);
    }
    if(message.content.substr(0,10) == "!botavatar"){
        adminJS.botAvatar(message,bot,Discord);
    }
    if(message.content == "!forcequit4320"){ 
        bot.destroy().then(function(){
            console.log("Spam Detected, Terminating Bot");
        })
        .catch(console.error);
    }

// - ROLES - 

 /*   if(message.content == "!updateroles"){
        rolesJS.updateRoles(message,fs,bot).then(function(){
            rawDataRoles = fs.readFileSync("./json/roles.json");
            rolesInfo = JSON.parse(rawDataRoles);
        });        
    }
    if(message.content.substr(0,9) == "!addrole " || message.content.substr(0,12) == "!removerole "){ 
        rolesJS.updateRoles(message,fs,bot).then(function(){
            rawDataRoles = fs.readFileSync("./json/roles.json");
            rolesInfo = JSON.parse(rawDataRoles);
            rolesJS.addRemoveRole(message,message.content.split(" ")[0],rolesInfo);
        }); 
    }

    if(message.content == "!listroles"){
        rolesJS.updateRoles(message,fs,bot).then(function(){
            rawDataRoles = fs.readFileSync("./json/roles.json");
            rolesInfo = JSON.parse(rawDataRoles);
            rolesJS.listRoles(message,rolesInfo,bot);
        }); 
    }*/

// - EMOTES -

    if(message.content.substr(0,5) == "!emo "){
        emotesJS.emoteImage(message);
    }
    if(message.content.substr(0,8) == "!addemo "){
        emotesJS.addEmote(message,request,fs);
    }
    if(message.content.substr(0,9) == '!buttblow'){
        emotesJS.actionImage(message,"!buttblow",jimp);
    }
    if(message.content.substr(0,7) == '!banana'){
        emotesJS.actionImage(message,"!banana",jimp);
    }
    if(message.content.substr(0,5) == '!poke'){
        emotesJS.actionImage(message,"!poke",jimp);
    }
    if(message.content.substr(0,5) == '!slam'){
        emotesJS.actionImage(message,"!slam",jimp);
    }
    if(message.content.substr(0,7) == '!suplex'){
        emotesJS.actionImage(message,"!suplex",jimp);
    }
    if(message.content.substr(0,5) == "!slap"){
        emotesJS.slapImage(message,jimp);
    }
    if(message.content.substr(0,6) == "!bless"){
        emotesJS.roundImage(message,"!bless",jimp);
    }
    if(message.content.substr(0,5) == "!kiss"){
        emotesJS.roundImage(message,"!kiss",jimp);
    }
    if(message.content.substr(0,4) == "!hug"){
        emotesJS.roundImage(message,"!hug",jimp);
    }

// - GUILD WAR - 

    if(message.content.substr(0,3) == '!gw'){
        //guildWarJS.guildWar(message,guildInfo,seedInfo);
    }
    if(message.content.substr(0,12) == '!player_name'){
        //guildWarJS.playerName(message,indivInfo);
    }
    if(message.content.substr(0,10) == '!player_id'){
        //guildWarJS.playerID(message,indivInfo);
    }

// - OTHER -

    if(message.content == "!spark"){
        otherJS.spark(message,botInfo);
    }
    if(message.content == "!roll10" || message.content == "!roll10 legfes"){
        otherJS.roll10(message,botInfo);
    }
    if(message.content.substr(0,8) == "!choose "){
        otherJS.choose(message);
    }
    if(message.content.substr(0,5) == "!say "){
        otherJS.say(message);
    }
});