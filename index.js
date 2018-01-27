const Discord = require('discord.js');
const bot = new Discord.Client();
const allRoles = ["Admin","RoleOne","RoleTwo","RoleThree"];

bot.login('NDA2NzAxMDI1NDEyNzc1OTM4.DU3C9g.nWf_r0cc3b8aDM81dc6_a0Ul1vU');

bot.on('ready',(ready) => {
    console.log("bot online");
});

bot.on('message',(message) => {
    if(message.content.substr(0,9) == "!addrole " || message.content.substr(0,12) == "!removerole "){ 
        var commandType = message.content.split(" ")[0]; 
        var roleStr = message.content.split(" ")[1];  
        var role = "";
        for(var i = 0; i < allRoles.length; i++){
            if(roleStr == allRoles[i]){
                role = message.guild.roles.find("name",roleStr);
            }
        }   
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