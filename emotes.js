function actionImage(message,actionType,jimp){

    var url = message.mentions.users.first().displayAvatarURL;
    var avatarFile = './action_images/img_out/avatar.png';
    var avatarOptions;

    if(actionType == '!buttblow'){
        avatarOptions = {
            width : 85,
            height : 85,
            x : 300,
            y : 180,
            rotate : 20,
            originalFile : './action_images/img_in/buttblow.png',
            outputFile : './action_images/img_out/buttblow_out.png'
        };
    }else if(actionType == '!banana'){
        avatarOptions = {
            width : 60,
            height : 60,
            x : 241,
            y : 172,
            rotate : 0,
            originalFile : './action_images/img_in/banana.png',
            outputFile : './action_images/img_out/banana_out.png'
        };
    }else if(actionType == '!poke'){
        avatarOptions = {
            width : 75,
            height : 75,
            x : 335,
            y : 165,
            rotate : 12,
            originalFile : './action_images/img_in/poke.png',
            outputFile : './action_images/img_out/poke_out.png'
        };
    }else if(actionType == '!slam'){
        
        avatarOptions = {
            width : 100,
            height : 100,
            x : 80,
            y : 190,
            rotate : -35,
            originalFile : './action_images/img_in/slam.png',
            outputFile : './action_images/img_out/slam_out.png'
        };
    }else if (actionType == '!suplex'){
        avatarOptions = {
            width : 90,
            height : 90,
            x : 40,
            y : 120,
            rotate : -160,
            originalFile : './action_images/img_in/suplex.png',
            outputFile : './action_images/img_out/suplex_out.png'
        };
    }

    if(url != null){
        var obj = url.indexOf('.png');
        var trueURL = url.substr(0,obj+4);
        jimp.read(trueURL)
        .then(function (image) {
            image
            .scale(2)
            .rotate(avatarOptions.rotate)
            .scale(0.5)
            .resize(avatarOptions.width, avatarOptions.height,jimp.RESIZE_BILINEAR)                           
            .write(avatarFile,function(){
                jimp.read(avatarFile)
                .then(function (image){
                    jimp.read(avatarOptions.originalFile)
                    .then(function(actionImg){
                        actionImg.composite(image,avatarOptions.x,avatarOptions.y)
                        .write(avatarOptions.outputFile,function(){
                            message.channel.send({file:avatarOptions.outputFile}).catch(console.error());
                        });  
                    });
                });
            });

        }).catch(function(err){
            console.error(err);
        });
    }
}

module.exports = {
    actionImage : actionImage
};