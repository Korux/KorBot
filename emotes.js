function slapImage(message,jimp){
    var originalFile = "./action_images/img_in/slap.png";
    var outputFile = "./action_images/img_out/slap_out.png";
    if(message.mentions.users.array().length == 0){
        imageCaption = message.content.substr(6);
    } else {
        imageCaption = message.mentions.users.first().username;
    }
    var loadedImage;

    function measureText(font, text) {
        var x = 0;
        for (var i = 0; i < text.length; i++) {
            if (font.chars[text[i]]) {
                x += font.chars[text[i]].xoffset
                    + (font.kernings[text[i]] && font.kernings[text[i]][text[i + 1]] ? font.kernings[text[i]][text[i + 1]] : 0)
                    + (font.chars[text[i]].xadvance || 0);
            }
        }
        return x;
    };
    
    jimp.read(originalFile)
        .then(function (image) {
            loadedImage = image;
            return jimp.loadFont(jimp.FONT_SANS_16_BLACK);   
        })
        .then(function (font) {
            var xOffset = measureText(font, imageCaption);
            loadedImage.print(font, 168-(xOffset/2), 230, imageCaption)
            .write(outputFile,function(){
                message.channel.send({file:outputFile}).catch(console.error);
            });  
        })
        .catch(function (err) {
            console.error(err);
        });
}

function emoteImage(message){
    var emoteStr = message.content.split(" ")[1];
    var addStr = "./images/additional_images/" + emoteStr + ".png";
    emoteStr = "./images/" + emoteStr + ".png";
    message.channel.send({file:emoteStr}).catch(function(){
        message.channel.send({file:addStr}).catch(console.error);
    });
}

function actionImage(message,actionType,jimp){
    var url;
    if(message.mentions.users.array().length == 0){
        console.log("no mention");
        return;
    } else {
        url = message.mentions.users.first().displayAvatarURL;
    }
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

function roundImage(message,actionType,jimp){
    var url;
    if(message.mentions.users.array().length == 0){
        console.log("no mention");
        return;
    } else {
        url = message.mentions.users.first().displayAvatarURL;
    }
    var avatarFile = './action_images/img_out/avatar.png';
    var avatarOptions;

    if(actionType == '!bless'){
        avatarOptions = {
            width : 85,
            height : 85,
            x : 125,
            y : 60,
            rotate : 0,
            originalFile : './action_images/img_in/bless.png',
            outputFile : './action_images/img_out/bless_out.png'
        };
    }else if(actionType == '!hug'){
        avatarOptions = {
            width : 76,
            height : 76,
            x : 175,
            y : 125,
            rotate : 0,
            originalFile : './action_images/img_in/hug.png',
            outputFile : './action_images/img_out/hug_out.png'
        };
    }else if(actionType == '!kiss'){
        avatarOptions = {
            width : 111,
            height : 111,
            x : 101,
            y : 70,
            rotate : -12,
            originalFile : './action_images/img_in/kiss.png',
            outputFile : './action_images/img_out/kiss_out.png'
        };
    }

    if(url!=null){
        var obj = url.indexOf('.png');
        var trueURL = url.substr(0,obj+4);
        var p1 = jimp.read(trueURL);
        var p2 = jimp.read("./action_images/img_in/mask.png");
        var p3 = jimp.read(avatarOptions.originalFile);
        Promise.all([p1, p2,p3]).then(function(images){
            var avatar = images[0];
            var mask = images[1];
            var out = images[2];
            mask
            .scale(2)
            .rotate(avatarOptions.rotate)
            .scale(0.5)
            .resize(avatarOptions.width,avatarOptions.height,jimp.RESIZE_BILINEAR);
            avatar
            .scale(2)
            .rotate(avatarOptions.rotate)
            .scale(0.5)
            .resize(avatarOptions.width,avatarOptions.height,jimp.RESIZE_BILINEAR)
            .mask(mask,0,0);
            out.composite(avatar,avatarOptions.x,avatarOptions.y).write(avatarOptions.outputFile,function(){
                message.channel.send({file:avatarOptions.outputFile}).catch(console.error());
            });             
        }).catch(function(err){
            console.error(err);
        });
    }
}

module.exports = {
    actionImage : actionImage,
    emoteImage : emoteImage,
    slapImage : slapImage,
    roundImage : roundImage
};