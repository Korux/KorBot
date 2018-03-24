const jimp = require('jimp');
const Discord = require('discord.js');
const fs = require('fs');

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

var botSpamControl = [];

bot.login(botToken.token);

bot.on('ready',(ready) => {
    bot.user.setActivity("Azur Lane");
    console.log(botDetails.name + " is online");
});

bot.on('error',(err) => {
    console.log(err);
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

// - ROLES - 

    if(message.content == "!updateroles"){
        rolesJS.updateRoles(message,fs,bot).then(function(){
            rawDataRoles = fs.readFileSync("./json/roles.json");
            rolesInfo = JSON.parse(rawDataRoles);
        });  
    }

    if(message.content.substr(0,9) == "!addrole " || message.content.substr(0,12) == "!removerole "){ 
        rolesJS.addRemoveRole(message,message.content.split(" ")[0],rolesInfo);
    }

    if(message.content == "!listroles"){
        rolesJS.listRoles(message,rolesInfo,bot);
    }

// - EMOTES -

    if(message.content.substr(0,5) == "!emo "){
        emotesJS.emoteImage(message);
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

// - GUILD WAR - 

    if(message.content.substr(0,3) == '!gw'){
        guildWarJS.guildWar(message,guildInfo,seedInfo);
    }
    if(message.content.substr(0,12) == '!player_name'){
        guildWarJS.playerName(message,indivInfo);
    }
    if(message.content.substr(0,10) == '!player_id'){
        guildWarJS.playerID(message,indivInfo);
    }

// - OTHER -

    if(message.content.substr(0,10) == "!triggers "){
        var boss = message.content.substr(10);
        var bossIndex = 0;
        var result = '**' + boss.toUpperCase() + ' TRIGGER INFO** \n```xml\n';
        var isBoss = false;
        for(var i = 0; i < botInfo.BossTriggerInfo.length; i++){
            if(boss.toLowerCase() == Object.keys(botInfo.BossTriggerInfo[i])[0]){
                isBoss = true;
                break;
            }
            bossIndex++;
        }

        if(isBoss){
            var bossTriggers = botInfo.BossTriggerInfo[bossIndex][boss.toLowerCase()];
            bossTriggers.forEach(function(thisTrigger){
                if(Object.keys(thisTrigger) == "trigger"){
                   result += thisTrigger.trigger; 
                }
            });
            result += '```';
            message.channel.send(result);
        } else {
            message.channel.send("That Boss is not in my database! ");
        }
        
    }

    if(message.content == "!listtriggers"){
        var currTriggers = 'The Current Bosses in my Database are: ```\n';
        for(var i = 0; i < botInfo.BossTriggerInfo.length; i++){
            currTriggers = currTriggers + botInfo.BossTriggerInfo[i][Object.keys(botInfo.BossTriggerInfo[i])[0]][0].name +'\n';
        }
        currTriggers += '```';
        message.channel.send(currTriggers);
    }

    if(message.content == "!commands"){
        var currCommands ='The Current Commands Are: \n ```';
        botInfo.allCommands.forEach(function(command){
            currCommands = currCommands + command.name + '\n';
        });
        currCommands += '```';
        message.channel.send(currCommands);
    }

    if(message.content == "!spark"){

        function checkDupes(arr,testAgainst){
            return new Promise (function(resolve,reject){
                arr.forEach(function(val){
                    if(testAgainst == val){
                        resolve(['true']);
                    }
                });
                resolve(['false',testAgainst]);
            });
        }

        var randNum;
        var drawnCharas = [];
        var possibleSSRS = ["Summon","Gold Moon","Character"];
        var result='';
        var ssrCount = 0;
        var ssrPercent = 0.0;
        var moonCount;

        function doSpark(){
            return new Promise(function(resolve,reject){
                for(var i = 0; i < 300;i++){
                        randNum = Math.floor(Math.random()*100);
                        if(randNum < 6){
                            ssrCount ++;
                            var SSR = possibleSSRS[Math.floor(Math.random()*3)];
                            if(SSR == "Gold Moon"){
                                result = "<Gold Moon> \n" + result;
                            } else if (SSR == "Summon") { 
                                result = result + "<SSR Summon " + botInfo.SSRSummons[Math.floor(Math.random() * botInfo.SSRSummons.length)].name + "> \n"; 
                            } else{
                                var rollResult = Math.floor(Math.random() * (botInfo.SSRCharasNonLimited.length + botInfo.SSRCharasLimited.length));
                                
                                if(rollResult < botInfo.SSRCharasNonLimited.length){
                                    checkDupes(drawnCharas,botInfo.SSRCharasNonLimited[rollResult].name).then(function(info){
                                        if(info[0] == 'true'){
                                            result = result + "<Gold Moon> \n";
                                        } else {
                                            result = result + "<SSR Character " + info[1] + "> \n";
                                            drawnCharas.push(info[1]);
                                        }
                                    }).catch(console.error);
                                    
                                } else {
                                    checkDupes(drawnCharas,botInfo.SSRCharasLimited[rollResult - botInfo.SSRCharasNonLimited.length].name).then(function(info){
                                        if(info[0] == 'true'){
                                            result = result + "<Gold Moon> \n";
                                        } else {
                                            result = result + "<SSR Character " +  info[1] + "> \n";
                                            drawnCharas.push(info[1]);  
                                        }
                                    }).catch(console.error);
                                    
                                }
                            }    
                        }
                    }
                resolve();
            });
        }

        doSpark().then(function(){
            ssrPercent = ssrCount*100 / 300;
            result = 'You got: \n' + result;
            result = result + "<" + ssrCount + " SSRs" + ">, " + ssrPercent + '% \n';
            message.channel.send("```xml\n" + result + '```');
        }).catch(console.error);

    
    }

    if(message.content == "!roll10" || message.content == "!roll10 legfes"){
        var SSRThreshhold;
        var SRThreshhold;
        if(message.content == "!roll10"){
            SSRThreshhold = 3;
            SRThreshhold = 18;
        } else {
            SSRThreshhold = 6;
            SRThreshhold = 18;
        }
        var possibleRolls = ["Dupe","Summon","Character","Weapon"];
        var result = "You got ";
        var rarity;
        var randNum;
        for (var i = 0; i < 9; i++){
            randNum = Math.floor(Math.random()*100);
            if(randNum < SSRThreshhold){
                rarity = "SSR";
            } else if (randNum < SRThreshhold){
                rarity = "SR";
            } else {
                rarity = "R";
            }
            if(rarity == "SSR"){
                var roll = possibleRolls[Math.floor(Math.random()*3)];
                if(roll == "Summon"){
                    result = result + '<' + rarity + ' ' + botInfo.SSRSummons[Math.floor(Math.random() * botInfo.SSRSummons.length)].name + '>' + ', ';
                } else if (roll == "Character"){
                    if(SSRThreshhold == 3){
                        result = result + '<' + rarity + ' ' + botInfo.SSRCharasNonLimited[Math.floor(Math.random() * botInfo.SSRCharasNonLimited.length)].name + '>' + ', ';
                    } else {
                        var rollResult = Math.floor(Math.random() * (botInfo.SSRCharasNonLimited.length + botInfo.SSRCharasLimited.length));
                        if(rollResult < botInfo.SSRCharasNonLimited.length){
                            result = result + '<' + rarity + ' ' + botInfo.SSRCharasNonLimited[rollResult].name + '>' + ', ';
                        } else {
                            result = result + '<' + rarity + ' ' + botInfo.SSRCharasLimited[rollResult - botInfo.SSRCharasNonLimited.length].name + '>' + ', ';
                        }
                    }
                } else {
                    result = result + '<' + rarity + ' ' + roll + '>' + ', ';
                }
                
            } else {
                var roll = possibleRolls[Math.floor(Math.random() * 4)];
                result = result + rarity + ' ' + roll + ', ';
            }
           
        }
        randNum = Math.floor(Math.random()*100);
        if(randNum < SSRThreshhold){
            rarity = "SSR";
        } else {
            rarity = "SR";
        }
        if(rarity == "SSR"){
            var roll = possibleRolls[Math.floor(Math.random()*3)];
                if(roll == "Summon"){
                    result = result + '<' + rarity + ' ' + botInfo.SSRSummons[Math.floor(Math.random() * botInfo.SSRSummons.length)].name + '>' + ', ';
                } else if (roll == "Character"){
                    if(SSRThreshhold == 3){
                        result = result + '<' + rarity + ' ' + botInfo.SSRCharasNonLimited[Math.floor(Math.random() * botInfo.SSRCharasNonLimited.length)].name + '>' + ', ';
                    } else {
                        var rollResult = Math.floor(Math.random() * (botInfo.SSRCharasNonLimited.length + botInfo.SSRCharasLimited.length));
                        if(rollResult < botInfo.SSRCharasNonLimited.length){
                            result = result + '<' + rarity + ' ' + botInfo.SSRCharasNonLimited[rollResult].name + '>' + ', ';
                        } else {
                            result = result + '<' + rarity + ' ' + botInfo.SSRCharasLimited[rollResult - botInfo.SSRCharasNonLimited.length].name + '>' + ', ';
                        }
                    }
                } else {
                    result = result + '<' + rarity + ' ' + roll + '>' + ', ';
                }
        } else {
            var roll = possibleRolls[Math.floor(Math.random() * 4)];
            result = result + rarity + ' ' + roll + ', ';
        }
        result = result.substr(0,result.length - 2);
        message.channel.send('```xml\n' + result + '```');
    }


    if(message.content.substr(0,8) == "!choose "){
        var concated = message.content.substr(8);
        var options = concated.split(",");
        options = options.filter(word => word.trim() != '');
        var pick = Math.floor(Math.random() * options.length);
        message.reply("I choose " + "**" + options[pick].trim() + "**");
    }
});
