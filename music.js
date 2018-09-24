
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