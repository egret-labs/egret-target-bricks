BK.Script.loadlib('GameRes://script/core/render/spriteSheetCache.js');

//加载图集
var texPath = "GameRes://resource/texture/spritesheet/test.png";
var jsonPath = "GameRes://resource/texture/spritesheet/test.json";
BK.SpriteSheetCache.loadSheet(jsonPath,texPath);
//
BK.SpriteSheetCache.removeSheet(jsonPath, texPath);

//通过图集生成普通sprite
var sp = BK.SpriteSheetCache.getSprite("icon.png",100,100);
if(sp){
    BK.Director.root.addChild(sp);
}


//通过普通图生成九宫图
var texture2   = new BK.Texture("GameRes://resource/texture/blue_circle.png");
var sprite9_2 = new BK.Sprite9(texture2.size.width,texture2.size.height,texture2,{top:64,bottom:64,left:64,right:64},{x:0,y:0});
sprite9_2.position = {x:100,y:100};
sprite9_2.size = {width:300,height:150};
BK.Director.root.addChild(sprite9_2);


//通过图集生成九宫图
var texture   = BK.SpriteSheetCache.getTextureByFilename("green_btn.png");
var frameInfo = BK.SpriteSheetCache.getFrameInfoByFilename("green_btn.png");
if (frameInfo && texture) {
    var sprite9 = new BK.Sprite9(frameInfo.frame.w,frameInfo.frame.h,texture,{top:32,bottom:32,left:64,right:64},{x:frameInfo.frame.x,y:frameInfo.frame.y},true);
    sprite9.name = "__sprite9";
    BK.Director.root.addChild(sprite9);
    sprite9.size = {width:300,height:150};
    sprite9.position = {x:200,y:200};
}