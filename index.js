const jimp = require('jimp');
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const botDetails = require('./json/package.json');
const rawData = fs.readFileSync('./json/botinfo.json');
var rawDataRoles = fs.readFileSync('./json/roles.json');
const botInfo = JSON.parse(rawData);
var rolesInfo = JSON.parse(rawDataRoles);

bot.login('NDA2NzU4OTQ5MTc0NTA5NTc4.DU3nYw.JuyMFH9XdlTdXYFFstxYKP9epNg');

bot.on('ready',(ready) => {
    bot.user.setActivity("in Korux's Basement");
    console.log(botDetails.name + " is online");
});

bot.on('message',(message) => {

    if(message.content == "!updateroles"){
        var newRoles = {allRoles : []};
        var roles = message.guild.roles;
        message.channel.send("Roles Updated! the roles Are:\n");
        var output = '```\n';
        roles.forEach(function(role){
            output = output + role.name + '\n';
            newRoles.allRoles.push({name : role.name});
        });
        json = JSON.stringify(newRoles);
        fs.writeFileSync('./json/roles.json', json, 'utf8');
        output += '```';
        message.channel.send(output);
        rawDataRoles = fs.readFileSync("./json/roles.json");
        rolesInfo = JSON.parse(rawDataRoles);
    }

    if(message.content == "!readjsonroles"){
        var output = '```\n';
        rolesInfo.allRoles.forEach(function(role){
            output = output + role.name + '\n';
        });
        output += '```';
        message.channel.send(output);
    }

    if(message.content.substr(0,9) == "!addrole " || message.content.substr(0,12) == "!removerole "){ 
        var commandType = message.content.split(" ")[0]; 
        var roleStr = message.content.split(" ")[1];  
        var role = "";
        rolesInfo.allRoles.forEach(function(currRole){
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
                    if(role.name == 'bot'){
                        message.reply("Wait a minute... you're not a bot!");
                    }else{
                        message.member.addRole(role).catch(console.error); 
                        setTimeout(function(){
                            if(message.member.roles.has(role.id)){
                                message.reply("You joined " + role.name);
                            } else {
                                message.reply("I do not have permission to modify this role");
                            }
                        },200);
                    }
                    
                } 
                
            } else if (commandType == "!removerole"){
                if(!message.member.roles.has(role.id)){
                    message.reply("You do not have this role");
                } else{
                    message.member.removeRole(role).catch(console.error); 
                    setTimeout(function(){
                        if(!(message.member.roles.has(role.id))){
                            message.reply("You left " + role.name);
                        } else {
                            message.reply("I do not have permission to modify this role");
                        }
                    },200);
                } 
            } else {
                message.channel.send("Error! Contact Dev Please");
            }
            
        }
        
    } 

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
        var currTriggers = 'The Current Bosses in my Database are: \n ```\n';
        for(var i = 0; i < botInfo.BossTriggerInfo.length; i++){
            currTriggers = currTriggers + botInfo.BossTriggerInfo[i][Object.keys(botInfo.BossTriggerInfo[i])[0]][0].name +'\n';
        }
        currTriggers += '```';
        message.channel.send(currTriggers);
    }

    if(message.content == "!listroles"){
        var currRoles ='The Current Roles Are: \n ```\n';
        rolesInfo.allRoles.forEach(function(currRole){
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

    if(message.content.substr(0,9) == '!buttblow' || message.content.substr(0,7) == '!banana' || message.content.substr(0,5) == '!poke'){

        var url = message.mentions.users.first().avatarURL;
        var originalFile;
        var avatarFile = './action_images/avatar.png';;
        var outputFile;
        var width,height,x,y;

        if(message.content.substr(0,9) == '!buttblow'){
            originalFile = './action_images/buttblow.png';
            outputFile = './action_images/buttblow_out.png'; 
            width = 80;height = 80;
            x = 305; y = 185; 
        }else if(message.content.substr(0,7) == '!banana'){
            originalFile = './action_images/banana.png';
            outputFile = './action_images/banana_out.png';
            width = 60;height = 60;
            x = 241; y = 172; 
        }else if(message.content.substr(0,5) == '!poke'){
            originalFile = './action_images/poke.png';
            outputFile = './action_images/poke_out.png';
            width = 70;height = 70;
            x = 335; y = 160; 
        }

        if(url != null){
            var obj = url.indexOf('.png');
            var trueURL = url.substr(0,obj+4);
            jimp.read(trueURL)
            .then(function (image) {
                image.resize(width, height,jimp.RESIZE_BILINEAR)                               
                .write(avatarFile,function(){
                    jimp.read(avatarFile)
                    .then(function (image){
                        jimp.read(originalFile)
                        .then(function(actionImg){
                            actionImg.composite(image,x,y)
                            .write(outputFile,function(){
                                message.channel.send({file:outputFile}).catch(console.error());
                            });  
                        });
                    });
                });

            }).catch(function(err){
                console.error(err);
            });
        }
    }


    if(message.content.substr(0,5) == "!slap"){
        var outputFile = "./action_images/slap_out.png";
        var originalFile = "./action_images/slap.png";
        var imageCaption;
        if(message.mentions.users.array().length == 0){
            imageCaption = message.content.substr(6);
        } else {
            imageCaption = message.mentions.users.first().username;
        }

        var loadedImage;

        function measureText(font, text) {
            var x = 0;
            for (var i = 0; i < text.length; i++) {
                if (font.chars[text[i]]) {
                    x += font.chars[text[i]].xoffset
                        + (font.kernings[text[i]] && font.kernings[text[i]][text[i + 1]] ? font.kernings[text[i]][text[i + 1]] : 0)
                        + (font.chars[text[i]].xadvance || 0);
                }
            }
            return x;
        };

        
        jimp.read(originalFile)
            .then(function (image) {
                loadedImage = image;
                return jimp.loadFont(jimp.FONT_SANS_16_BLACK);
            })
            .then(function (font) {
                var xOffset = measureText(font, imageCaption);
                loadedImage.print(font, 168-(xOffset/2), 230, imageCaption)
                .write(outputFile,function(){
                    message.channel.send({file:outputFile});
                });
            })
            .catch(function (err) {
                console.error(err);
            });
        }
});