function playSong(bot,index,songs){
    return new Promise(function(resolve,reject){
        var songstr = "./music/" + songs[index];
        const dispatcher = bot.voiceConnections.array()[0].playFile(songstr);
        dispatcher.on('end',(end)=>{
            resolve(index+1);
        });
    });
}

function playMusic(bot,songs){
    var currIndex = 20;
    var next = true;
    setInterval(()=>{
        if(next){
            next = false;
            playSong(bot,currIndex,songs).then(function(num){
                if(num == songs.length){
                    currIndex = 0;
                }else{
                    currIndex = num;
                }
                next = true;
            });
        }
    },10);
}

module.exports = {
    playSong : playSong,
    playMusic : playMusic
};