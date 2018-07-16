
function queueSong(message,queue,songs){
    var info = message.content.split(" ");
    var title = "";
    var song;
    for(var i = 1; i < info.length;i++){
        title+=info[i];
        title+= " ";
    }
    title = title.toLowerCase().trim();
    var possibleSongs = [];
    for(var i = 0; i < songs.length; i++){
        song = songs[i];
        var name = song.split(" - ")[1];
        name = name.toLowerCase().trim().slice(0,-4).trim();
        if(name.includes(title)){
            possibleSongs.push(song);
        }
    }
    if(possibleSongs.length > 1){
        message.channel.send("More than 1 song found");
        possibleSongs.forEach(song=>{
            message.channel.send(song);
        });
    }else if(possibleSongs.length < 1){
        message.channel.send("No song found");
    }else{
        queue[1].push(possibleSongs[0]);
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
    var info = message.content.split(" ");
    var song = info[1];
    var title = "";
    for(var i = 2; i < info.length;i++){
        title+=info[i];
        title+= " ";
    }
    DLYTLink(song,title,fs,ytdl).then(()=>{message.channel.send("song saved with title: " + title)});
}


module.exports = {
    saveSong : saveSong,
    queueSong : queueSong,
    displayQueue : displayQueue
}