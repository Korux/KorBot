function updateRoles(message,fs,bot){
    return new Promise(function(resolve,reject){
        var guild = message.guild.name;
        var newRoles = {guildRoles : []};
        newRoles.guildRoles.push({granted : []});
        newRoles.guildRoles.push({denied : []});
        newRoles.guildRoles.push({server : guild});
        var roles = message.guild.roles;
        var granted = "";
        var denied = "";
        roles.forEach(function(role){
            if(role.name != '@everyone'){
                if(role.editable == true){
                    newRoles.guildRoles[0].granted.push({name : role.name});
                    granted = granted  + role.name + '\n';
                }else{
                    newRoles.guildRoles[1].denied.push({name : role.name});
                    denied = denied + role.name + '\n';
                }
            }     
        });
        json = JSON.stringify(newRoles);
        fs.writeFile('./json/roles.json', json, 'utf8',function(){
            resolve();
        });  
    });
    
}

function addRemoveRole(message,commandType,rolesInfo){ 
    var roleStr;
    if(commandType == '!addrole'){
        roleStr = message.content.substr(9);
    } else {
        roleStr = message.content.substr(12);
    }
    roleStr = roleStr.trim();

    var role = "";
    rolesInfo.guildRoles[0].granted.forEach(function(currRole){
        if(roleStr.toLowerCase() == currRole.name.toLowerCase()){
            role = message.guild.roles.find("name", currRole.name);
        }
    });
    rolesInfo.guildRoles[1].denied.forEach(function(currRole){
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
                if(role.name == 'Bots'){
                    message.reply("Wait a minute... you're not a bot!");
                }else{
                    message.member.addRole(role).then(function(){
                        message.reply("You joined " + role.name);
                    }).catch(function(){
                        message.reply("I do not have permission to modify this role");
                    });
                }
                
            } 
            
        } else if (commandType == "!removerole"){
            if(!message.member.roles.has(role.id)){
                message.reply("You do not have this role");
            } else{
                message.member.removeRole(role).then(function(){
                    message.reply("You left " + role.name);
                }).catch(function(){
                    message.reply("I do not have permission to modify this role");
                });
            } 
        }
    }
    
} 


function listRoles(message,rolesInfo,bot){
    var currRoles ="";
    rolesInfo.guildRoles[0].granted.forEach(function(currRole){
        var thisRole = message.guild.roles.find('name',currRole.name);
        if (thisRole != null){
            if(thisRole.editable){
                currRoles = currRoles + currRole.name + '\n';
            }
        }
    });
    message.channel.send({embed: {
        color: 3447003,
        author: {
        name: "",
        icon_url: bot.user.avatarURL
        },
        title:"Current Roles",
        description:currRoles
        } 
    });
}

module.exports = {
    listRoles : listRoles,
    addRemoveRole : addRemoveRole,
    updateRoles : updateRoles
};