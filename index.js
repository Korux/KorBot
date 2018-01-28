const jimp = require('jimp');
const Discord = require('discord.js');
const bot = new Discord.Client();
const botInfo = require('./json/package.json');
const roles = require('./json/roles.json');
const commands = require('./json/commands.json');

bot.login('NDA2NzU4OTQ5MTc0NTA5NTc4.DU3nYw.JuyMFH9XdlTdXYFFstxYKP9epNg');

bot.on('ready',(ready) => {
    console.log(botInfo.name + " is online");
});

bot.on('message',(message) => {

    if(message.content.substr(0,9) == "!addrole " || message.content.substr(0,12) == "!removerole "){ 
        var commandType = message.content.split(" ")[0]; 
        var roleStr = message.content.split(" ")[1];  
        var role = "";
        roles.allRoles.forEach(function(currRole){
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

    if(message.content.substr(0,5) == "!emo "){
        var emoteStr = message.content.substr(5);
        emoteStr = "https://raw.githubusercontent.com/Korux/poi_bot/master/images/" + emoteStr + ".png";
        message.channel.send({file:emoteStr}).catch(console.error);
    }

    if(message.content == "!commands"){
        message.channel.send("The Current Commands Are: ");
        commands.allCommands.forEach(function(command){
            message.channel.send( '`' + command.name + '`' + '\n');
        });
    }

    if(message.content == "!roll10"){
        var possibleRolls = ["Dupe","Summon","Character","Weapon"];
        var result = "You got ";
        var rarity;
        var randNum;
        for (var i = 0; i < 9; i++){
            randNum = Math.floor(Math.random()*100);
            if(randNum < 3){
                rarity = "SSR";
            } else if (randNum < 15){
                rarity = "SR";
            } else {
                rarity = "R";
            }
            if(rarity == "SSR"){
                var roll = possibleRolls[Math.floor(Math.random()*3)];
                result = result + '<' + rarity + ' ' + roll + '>' + ', ';
            } else {
                var roll = possibleRolls[Math.floor(Math.random() * 4)];
                result = result + rarity + ' ' + roll + ', ';
            }
           
        }
        randNum = Math.floor(Math.random()*100);
        if(randNum < 3){
            rarity = "SSR";
        } else {
            rarity = "SR";
        }
        if(rarity == "SSR"){
            var roll = possibleRolls[Math.floor(Math.random()*3)];
            result = result + '<' + rarity + ' ' + roll + '>' + ', ';
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
        var fileName = "slap_name.png";
        var originalFile = "./images/slap_out.png";
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
                    message.channel.send({file:"./slap_name.png"});
                },1000);
                
            })
            .catch(function (err) {
                console.error(err);
            });
        }
});