const Discord = require('discord.js');
const bot = new Discord.Client();

bot.login('NDA2NzAxMDI1NDEyNzc1OTM4.DU3C9g.nWf_r0cc3b8aDM81dc6_a0Ul1vU');

bot.on('ready',(ready) => {
    console.log("bot online");
});

bot.on('message',(message) => {
    if(message.content == "test1"){
        try{
            message.reply(message.author.avatarURL);
        }catch(TypeError){
            message.reply("you have none retard");
        }
    }

    if(message.content.substr(0,5) == "!emo "){
        var emoteStr = message.content.substr(5);
        emoteStr = "https://github.com/Korux/leepBot/blob/master/images/" + emoteStr + ".png";
        message.channel.send({file:emoteStr});
    }
});