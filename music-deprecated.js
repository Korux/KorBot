
function queueSong(message,queue,songs){
    var info = message.content.split(" ");
    var song;
    var possibleSongs = [];
    for(var i = 0; i < songs.length; i++){
        song = songs[i];
        var name = song.replace(" - "," ");
        name = name.toLowerCase().trim().slice(0,-4).trim();
        var matchCount = 0;
        for(var j = 1; j < info.length; j++){
            if(name.includes(info[j])){
                matchCount++;
            }
        }
        if(matchCount == info.length-1){
            possibleSongs.push(song);
        }
    }
    if(possibleSongs.length > 1){
        var out = "";
        out += "More than 1 song found\n";
        possibleSongs.forEach(song=>{
            out+=song.trim(0,-4);
            out+="\n";
        });
        message.channel.send(out);
    }else if(possibleSongs.length < 1){
        message.channel.send("No song found");
    }else{
        queue[1].push(possibleSongs[0].split(" - ")[1]);
        queue[0].push(possibleSongs[0].split(" - ")[0]);
        queue[2].push(possibleSongs[0]);
        message.channel.send("```\n" + possibleSongs[0].slice(0,-4) + "\nhas been added to the queue" + "\n```");
    }
    return queue;
}

function displayQueue(message,bot,queue){
    var artistString = "";
    var songString = "";
    queue[0].forEach((artist)=>{
        artistString+=artist;
        artistString+='\n';
    });
    queue[1].forEach((song)=>{
        songString+=song.slice(0,-4);
        songString+='\n';
    });
    message.channel.send({embed:{
        color: 3447003,
        author: {
        name: "Song Queue",
        icon_url: bot.user.avatarURL
        },
        fields:[
            {
                name : "Artists",
                value : "------\n"+artistString,
                inline : true,
            },
            {
                name:"Songs",
                value : "------\n"+songString,
                inline : true,
            }
        ]
    }});
}

function DLYTLink(ytLink,songstr,fs,ytdl){
	return new Promise(function(resolve,reject){
		var stream = fs.createWriteStream("./music/"+songstr+".mp3");
		var ytStream = ytdl(ytLink,{filter: "audioonly"}).pipe(stream);
		ytStream.on('finish',()=>{resolve(1)});
	});
}

function saveSong(message,fs,ytdl){
    return new Promise(function(resolve,reject){
        var info = message.content.split(" ");
        var song = info[1];
        var title = "";
        for(var i = 2; i < info.length;i++){
            title+=info[i];
            title+= " ";
        }
        DLYTLink(song,title,fs,ytdl).then(()=>{
            message.channel.send("song saved with title: " + title);
            resolve();
        });
    });
}

function findArtist(message,songs){
    var artist = message.content.slice(8,message.content.length);
    artist = artist.toLowerCase().trim();
    var song;
    var output = "";
    for(var i = 0; i < songs.length; i++){
        song = songs[i];
        var songArtist = song.split(" - ")[0];
        songArtist = songArtist.toLowerCase().trim();
        var allArtists = songArtist.split(",");
        for(var j = 0; j < allArtists.length;j++){
            if(artist == allArtists[j].trim()){
                output += songs[i].slice(0,-4);
                output += "\n";
            }
        }
    }
    if(output == ""){
        message.channel.send("No Artist Found");
    }else{
        message.channel.send("```\n" + output + "\n```");
    }
}

module.exports = {
    saveSong : saveSong,
    queueSong : queueSong,
    displayQueue : displayQueue,
    findArtist : findArtist
}


//0-----------------------------------------------------------------------
// - MUSIC -

//--------------------------------------------------------------

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function fill(size){
    a = [];
    for(var i = 0; i < size;i++){
        a.push(i);
    }
    return a;
}

function playSong(index,songs,pos,queued){
    return new Promise(function(resolve){
        dispatcher = null;
        var songstr = "./music/" + songs[index];
        np = songs[index].slice(0,-4);
        var timer;
        console.log("song: " + songstr+'\n');
        dispatcher = bot.voiceConnections.array()[0].playFile(songstr);
        dispatcher.on('start',()=>{
            timer = Date.now();
            bot.voiceConnections.array()[0].player.streamingData.pausedTime = 0;
        });
        dispatcher.on('end',()=>{
            if(queued){
                queue[1].shift();
                queue[0].shift();
                queue[2].shift();
            }
            var timeElapsed = Date.now() - timer;
            var secsElapsed = Math.floor(timeElapsed/1000);
            dispatcher = null;
            if(secsElapsed < 10){
                resolve(-1);
            }else{
                resolve(pos+1);
            }
        });
    });
}

function playMusic(){
    var currIndex = 0;
    var randList = fill(songs.length);
    randList = shuffle(randList);
    var next = true;
    songScript = setInterval(()=>{
        if(next){
            next = false;
            var pos = randList[currIndex];
            var songList = songs;
            var isQueued = false;
            if(queue[1].length > 0){
                pos = 0;
                songList = queue[2];
                currIndex = currIndex - 1;
                isQueued = true;
            }
            playSong(pos,songList,currIndex,isQueued).then(function(num){
                if(num == -1){
                   resetMusicConn().then(()=>{return;});
                }
                if(num == randList.length){
                    currIndex = 0;
                    randList = fill(songs.length);
                    randList = shuffle(randList);
                }else{
                    currIndex = num;
                }
                next = true;
            });
        }
    },1000);
}

function resetMusicConn(){
    return new Promise(function(resolve){
		clearInterval(songScript);
		voiceChl.leave();
        setTimeout(()=>{
            voiceChl.join().then((connection)=>{   
                connection.on('error',(err) => {
                    console.log("Voice Connection Error: " + err.message);
                });
                connection.on('ready',()=>{resetMusicConn()});
                console.log(botDetails.name + " has joined music channel");
                playMusic();
                resolve();
            }).catch((err)=>{
                console.log('15 sec timeout');
                console.log('error msg: ' + err.message);
                console.log('attempting reconnect');
                resetMusicConn();
            });
        },500);
    });
}

function quitMusicConn(){
    clearInterval(songScript);
    voiceChl.leave();
    setTimeout(()=>{bot.destroy().then(console.log("bot terminated"));},1100);
}

//--------------------------------------------------------------

// placed in bot.on ready function

var guilds = bot.guilds.array();
guilds.forEach(guild=>{
    if(guild.name == "Nayu's basement"){
        var channels = guild.channels.array();
        channels.forEach(ch=>{
            if(ch.name == "Music"){
                voiceChl = ch;
                voiceChl.join().then((connection)=>{
                    connection.on('error',(err) => {
                        console.log("Voice Connection Error: " + err.message);
                    });
                    connection.on('ready',()=>{resetMusicConn()});
                    console.log(botDetails.name + " has joined music channel");
                    playMusic();
                });
            }
        });
    }
});

//-------------------------------------

// - MUSIC -    attach to end of bot message commands

if(message.content.substr(0,10) == "!savesong "){
    if(message.member.roles.find("name", "Admin")){
        musicJS.saveSong(message,fs,ytdl).then(()=>{songs = fs.readdirSync('./music');});
    }else{
        message.channel.send("you do not have permission to add songs");
    }
}
if(message.content.substr(0,6) == "!song "){
    queue = musicJS.queueSong(message,queue,songs);
}
if(message.content == "!queue"){
    musicJS.displayQueue(message,bot,queue);
}
if(message.content == "!np"){
    message.channel.send(np);
}
if(message.content.substr(0,8) == "!artist "){
    musicJS.findArtist(message,songs);
}
if(message.content == "!reset"){
    resetMusicConn();
}

