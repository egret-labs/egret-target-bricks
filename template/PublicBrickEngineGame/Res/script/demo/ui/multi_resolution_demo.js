//竖屏模式下，以iPhone 6 (750x1334) 的分辨率为标准进行缩放。
// var scale = BK.Director.screenPixelSize.width / 750;
// BK.Director.root.scale = {x:scale,y:scale};

BK.Director.screenMode = 2;

BK.Script.log(0,0,"width = "+  BK.Director.screenPixelSize.width + " height = "+ BK.Director.screenPixelSize.height);

// BK.Script.log(0,0,"Scale = "+ scale + " width in pixel = "+ BK.Director.screenPixelSize.width);
var backTex  =new BK.Texture('GameRes://resource/texture/terrain.png');
var sp =new BK.Sprite(375,375,backTex,0,1,1,1);
sp.setTexture(backTex);
BK.Director.root.addChild(sp);

var sp2 =new BK.Sprite(375,375,backTex,0,1,1,1);
sp2.position = {x:375,y:375};
sp2.setTexture(backTex);
BK.Director.root.addChild(sp2);

var jsonPath = BK.Script.pathForResource("GameRes://resource/spine/suit/decelerator/Decelerator", 'json');
var atlasPath = BK.Script.pathForResource("GameRes://resource/spine/suit/decelerator/Decelerator", 'atlas');
var rice =new BK.SkeletonAnimation(atlasPath, jsonPath, 1,null,null,null );
rice.position = {x:200,y:100};
BK.Director.root.addChild(rice);
