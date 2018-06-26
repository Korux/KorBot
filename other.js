function spark(message,botInfo){

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

function roll10(message,botInfo){
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

function choose(message){
    var concated = message.content.substr(8);
    var options = concated.split(",");
    options = options.filter(word => word.trim() != '');
    var pick = Math.floor(Math.random() * options.length);
    message.reply("I choose " + "**" + options[pick].trim() + "**");
}

function triggers(message,botInfo){
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

function listTriggers(message,botInfo){
    var currTriggers = 'The Current Bosses in my Database are: ```\n';
    for(var i = 0; i < botInfo.BossTriggerInfo.length; i++){
        currTriggers = currTriggers + botInfo.BossTriggerInfo[i][Object.keys(botInfo.BossTriggerInfo[i])[0]][0].name +'\n';
    }
    currTriggers += '```';
    message.channel.send(currTriggers);
}

function say(message){
    var msg = message.content.substr(5);
    message.delete().then(()=>{message.channel.send(msg)});
}

module.exports = {
    spark : spark,
    roll10 : roll10,
    choose : choose,
    triggers : triggers,
    listTriggers : listTriggers,
    say : say

};