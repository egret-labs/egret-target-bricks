BK.Script.loadlib('GameRes://script/core/render/animatedSprite.js');

//DEMO
var texPath = "GameRes://resource/texture//spritesheet/fighter.png";
var jsonPath = "GameRes://resource/texture//spritesheet/fighter.json";
BK.SpriteSheetCache.loadSheet(jsonPath, texPath);
var textureInfoArr = new Array();
for (var i = 0; i < 30; i++) {
    var val = i < 10 ? '0' + i : i;
    var textureInfo = BK.SpriteSheetCache.getTextureFrameInfoByFileName('rollSequence00' + val + '.png');
    textureInfoArr.push(textureInfo);
}
var aniSp = new BK.AnimatedSprite(textureInfoArr);
aniSp.anchor = { x: 0.5, y: 0.5 };
aniSp.size = { width: 175 * 2, height: 240 * 2 };
var scrSize = BK.Director.screenPixelSize;
aniSp.position = { x: scrSize.width / 2.0, y: scrSize.height / 2.0 };
BK.Director.root.addChild(aniSp);

aniSp.delayUnits = 1/60;//设置每一帧持续时间，以秒为单位。默认1/30秒
aniSp.play(); //

//播放完一次的回调
aniSp.setCompleteCallback(function (ani,count) {
    BK.Script.log(0,0,"setCompleteCallback count:"+count);
    // aniSp.paused = true;
});

//全部播放完的回调
aniSp.setEndCallback(function (ani,count) {
    BK.Script.log(0,0,"setEndCallback count:"+count);
});