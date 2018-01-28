const jimp = require('jimp');
const Discord = require('discord.js');
const bot = new Discord.Client();
const botDetails = require('./json/package.json');
const fs = require('fs');
let rawData = fs.readFileSync('./json/botinfo.json');
const botInfo = JSON.parse(rawData);

bot.login('NDA2NzU4OTQ5MTc0NTA5NTc4.DU3nYw.JuyMFH9XdlTdXYFFstxYKP9epNg');

bot.on('ready',(ready) => {
    bot.user.setActivity('Azur Lane');
    console.log(botDetails.name + " is online");
});

bot.on('message',(message) => {

    if(message.content.substr(0,9) == "!addrole " || message.content.substr(0,12) == "!removerole "){ 
        var commandType = message.content.split(" ")[0]; 
        var roleStr = message.content.split(" ")[1];  
        var role = "";
        botInfo.allRoles.forEach(function(currRole){
            if(roleStr.toLowerCase() == currRole.name.toLowerCase()){
                role = message.guild.roles.find("name", currRole.name);
            }
        });

        if(role == ""){
            message.reply("No such role exists");
        } else {
            if(commandType == "!addrole"){
                if(message.member.roles.has(role.id)){
                    message.reply("You already have this role");
                } else{
                    message.reply("You joined " + role.name);
                    message.member.addRole(role).catch(console.error);
                } 
            } else if (commandType == "!removerole"){
                if(!message.member.roles.has(role.id)){
                    message.reply("You do not have this role");
                } else{
                    message.reply("You left " + role.name);
                    message.member.removeRole(role).catch(console.error);
                } 
            } else {
                message.channel.send("Error! Contact Dev Please");
            }
            
        }
        
    } 

    if(message.content == "!listroles"){
        var currRoles ='The Current Roles Are: \n ```';
        botInfo.allRoles.forEach(function(currRole){
            currRoles = currRoles + currRole.name + '\n';
        });
        currRoles += '```';
        message.channel.send(currRoles);
    }

    if(message.content.substr(0,5) == "!emo "){
        var emoteStr = message.content.substr(5);
        emoteStr = "https://raw.githubusercontent.com/Korux/poi_bot/master/images/" + emoteStr + ".png";
        message.channel.send({file:emoteStr}).catch(console.error);
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
        var randNum;
        var drawnCharas = [];
        var possibleSSRS = ["Summon","Gold Moon","Character"];
        var result = "You Got: \n";
        var ssrCount = 0;
        var ssrPercent = 0.0;
        for(var i = 0; i < 300;i++){
            randNum = Math.floor(Math.random()*100);
            if(randNum < 6){
                ssrCount ++;
                var SSR = possibleSSRS[Math.floor(Math.random()*3)];
                if(SSR == "Gold Moon"){
                    result = result + "<Gold Moon> \n";
                } else if (SSR == "Summon") { 
                    result = result + "<SSR Summon " + botInfo.SSRSummons[Math.floor(Math.random() * botInfo.SSRSummons.length)].name + "> \n"; 
                } else{
                    var rollResult = Math.floor(Math.random() * (botInfo.SSRCharasNonLimited.length + botInfo.SSRCharasLimited.length));
                        if(rollResult < botInfo.SSRCharasNonLimited.length){
                            var alreadyDrawn = drawnCharas.forEach(function(drawn){
                                if(drawn == botInfo.SSRCharasNonLimited[rollResult].name){
                                    return true;
                                }
                                return false;
                            });
                            if(alreadyDrawn){
                                result = result + "<Gold Moon> \n"
                            } else {
                                result = result + "<SSR Character " + botInfo.SSRCharasNonLimited[rollResult].name + "> \n";
                                drawnCharas.push(botInfo.SSRCharasNonLimited[rollResult].name);
                            }
                            
                        } else {
                            var alreadyDrawn = drawnCharas.forEach(function(drawn){
                                if(drawn == botInfo.SSRCharasLimited[rollResult - botInfo.SSRCharasNonLimited.length].name){
                                    return true;
                                }
                                return false;
                            });
                            if(alreadyDrawn){
                                result = result + "<Gold Moon> \n"
                            } else {
                                result = result + "<SSR Character " +  botInfo.SSRCharasLimited[rollResult - botInfo.SSRCharasNonLimited.length].name + "> \n";
                                drawnCharas.push(botInfo.SSRCharasLimited[rollResult - botInfo.SSRCharasNonLimited.length].name);
                            }
                            
                        }
                }
                
            }
        }
        var sparkOptions = ["You Sparked Your Dick Pick",
        "You sparked the E-sport pick",
        "You sparked the OP Grand Series weapon, fuck your Dama Bar stash",
        "You said 'fuck it' and sparked the meme pick"
        ]
        ssrPercent = ssrCount*100 / 300;
        result = result + "<" + ssrCount + " SSRs" + ">, " + ssrPercent + '% \n';
        result = result + sparkOptions[Math.floor(Math.random()*sparkOptions.length)];
        message.channel.send("```xml\n" + result + '```');
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


    if(message.content.substr(0,5) == "!slap"){
        var fileName = "./action_images/slap_name.png";
        var originalFile = "./action_images/slap_out.png";
        var imageCaption;
        if(message.mentions.users.array().length == 0){
            imageCaption = message.content.substr(6);
        } else {
            imageCaption = message.mentions.users.first().username;
        }
       
        var xVal = 45 - (imageCaption.length*5);
        var loadedImage;
        
        jimp.read(originalFile)
            .then(function (image) {
                loadedImage = image;
                return jimp.loadFont(jimp.FONT_SANS_16_BLACK);
            })
            .then(function (font) {
                loadedImage.print(font, 130+xVal, 230, imageCaption)
                            .write(fileName);
            })
            .then(function(){
                setTimeout(function(){
                    message.channel.send({file:"./action_images/slap_name.png"});
                },200);
                
            })
            .catch(function (err) {
                console.error(err);
            });
        }
});