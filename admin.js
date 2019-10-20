function botName(message,bot){
    if(message.author.id == 209516819466289153){
        var name = message.content.substr(9);
        bot.user.setUsername(name).catch(console.error);
    }else{
        message.channel.send("Stop.");
    } 
}

function botAvatar(message,bot,Discord){
    if(message.author.id == 209516819466289153){
        var avatar = '';
        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
        message.channel.send("Waiting on Avatar");
        collector.on('collect',msg => {
            avatar = msg.attachments.first().url;
            bot.user.setAvatar(avatar).catch(console.error);
        });
    }else{
        message.channel.send("No.");
    } 
}

function botPlaying(message,bot){
    if(message.author.id == 209516819466289153){
        var playing = message.content.substr(12);
        bot.user.setActivity(playing).catch(console.error);
    }else{
        message.channel.send("Go Away.");
    } 
}

module.exports = {
    botName:botName,
    botAvatar:botAvatar,
    botPlaying:botPlaying
};