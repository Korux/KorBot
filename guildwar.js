function guildWar(message,guildInfo,seedInfo){
    message.channel.send("This data is from: FEB 2018 - DARK ADV GW")
    var possibleGuilds = [];
    var possibleSeeds = [];
    var guildName = message.content.substr(4);
    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } 
    const getOutput = (guild,i,type) => {
        return 'http://game.granbluefantasy.jp/#guild/detail/' + guild[i].id + '\n'+'-----------------\n'+'```css\n'+'GUILD - ' + guild[i].name + '\n\n'
        + 'TYPE - ' + type + '\n\n'+ 'ID - ' + guild[i].id + '\n\n'+'PRELIM RANKING - ' + guild[i].rank + '\n\n'+'PRELIM HONOR - ' 
        + numberWithCommas(guild[i].honor) + '```';
    }
    guildInfo.forEach(function(guild){
        if(guild.name == guildName){
            possibleGuilds.push(guild);
        }
    });
    seedInfo.forEach(function(seed){
        if(seed.name == guildName){
            possibleSeeds.push(seed);
        }
    });
    if(possibleGuilds.length + possibleSeeds.length == 0){
        message.channel.send('Could not find crew. This may be an unranked crew or you dont know how to spell/capitalize.');
    } else if (possibleGuilds.length + possibleSeeds.length == 1){
        if(possibleGuilds.length == 1){
            message.channel.send(getOutput(possibleGuilds,0,'normal'));
        }else{
            message.channel.send(getOutput(possibleSeeds,0,'seeded'));
        }     
    }else if (possibleGuilds.length + possibleSeeds.length <=3){
        message.channel.send('Found ' + (possibleGuilds.length + possibleSeeds.length) + ' possible guilds \n\n');
        for(var i = 0; i < possibleGuilds.length;i++){
            message.channel.send(getOutput(possibleGuilds,i,'normal') + '\n\n');
        }
        for(var i = 0; i < possibleSeeds.length;i++){
            message.channel.send(getOutput(possibleSeeds,i,'seeded') + '\n\n');
        }
    }else{
        message.channel.send('Found ' + (possibleGuilds.length + possibleSeeds.length) + ' possible guilds, posting top 3 \n\n');
        var numPosted = 0;
        for(var i = 0; i < possibleSeeds.length;i++){
            if(numPosted < 3){
                message.channel.send(getOutput(possibleSeeds,i,'seeded') + '\n\n');
                numPosted++;
            }
        }
        for(var i = 0; i < possibleGuilds.length;i++){
            if(numPosted < 3){
                message.channel.send(getOutput(possibleGuilds,i,'normal') + '\n\n');
                numPosted++;
            }
        }   
    }
}

function playerName(message,indivInfo){
    message.channel.send("This data is from: JULY 2018 - WIND ADV GW")
    var name = message.content.substr(13);
    var possibleNames = [];
    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } 
    const getOutput = (name,i) => {
        return 'http://game.granbluefantasy.jp/#profile/' + name[i].id + '\n'+'-----------------\n'+'```css\n'+'NAME - ' + name[i].name + '\n\n'
        + 'RANK - ' + name[i].rank + '\n\n'+ 'ID - ' + name[i].id + '\n\n'+'BATTLES - ' + name[i].battles + '\n\n'+'HONOR - ' 
        + numberWithCommas(name[i].honor) + '```';
    }
    indivInfo.forEach(function(ind){
        if(ind.name == name){
            possibleNames.push(ind);
        }
    });

    if(possibleNames.length == 0){
        message.channel.send('Could not find player. This player may not be in the top 80k or you dont know how to spell/capitalize.');
    } else if (possibleNames.length == 1){
            message.channel.send(getOutput(possibleNames,0));
    }else if (possibleNames.length <=3){
        message.channel.send('Found ' + possibleNames.length + ' possible players \n\n');
        for(var i = 0; i < possibleNames.length;i++){
            message.channel.send(getOutput(possibleNames,i) + '\n\n');
        }  
    }else{
        message.channel.send('Found ' + possibleNames.length + ' possible players, posting top 3 \n\n');
        for(var i = 0; i < 3;i++){
            message.channel.send(getOutput(possibleNames,i) + '\n\n');
        }
    }
}

function playerID(message,indivInfo){
    message.channel.send("This data is from: JULY 2018 - WIND ADV GW")
    var id = message.content.substr(11);
    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } 
    const getOutput = (name) => {
        return 'http://game.granbluefantasy.jp/#profile/' + name.id + '\n'+'-----------------\n'+'```css\n'+'NAME - ' + name.name + '\n\n'
        + 'RANK - ' + name.rank + '\n\n'+ 'ID - ' + name.id + '\n\n'+'BATTLES - ' + name.battles + '\n\n'+'HONOR - ' 
        + numberWithCommas(name.honor) + '```';
    }
    var found = false;
    indivInfo.forEach(function(ind){
        if(ind.id == id){
            message.channel.send(getOutput(ind));
            found = true;
        }
    });
    if(!found) message.channel.send("Could not Find ID. Invalid ID or this player is not in the top 120k");
}

module.exports = {
    guildWar : guildWar,
    playerName : playerName,
    playerID : playerID

};