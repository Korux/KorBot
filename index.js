const Discord = require('discord.js');
const bot = new Discord.Client();
var allRoles;

bot.login('NDA2NzU4OTQ5MTc0NTA5NTc4.DU3nYw.JuyMFH9XdlTdXYFFstxYKP9epNg');

bot.on('ready',(ready) => {
    console.log("bot online");
});

bot.on('message',(message) => {

    if(message.content == "!getroles"){
        allRoles = message.guild.roles;
        
    }

    if(message.content.substr(0,9) == "!addrole " || message.content.substr(0,12) == "!removerole "){ 
        var commandType = message.content.split(" ")[0]; 
        var roleStr = message.content.split(" ")[1];  
        var role = "";
        allRoles.forEach(function (value, key, mapObj) {  
            if(roleStr.toLowerCase() == value.name.toLowerCase()){
                role = value;
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
        emoteStr = "https://raw.githubusercontent.com/Korux/leepBot/master/images/" + emoteStr + ".png";
        message.channel.send({file:emoteStr}).catch(console.error);
    }
});