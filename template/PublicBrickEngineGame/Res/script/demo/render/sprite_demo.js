/**
 * 精灵类
 */
//竖屏模式下，以iPhone 6 (750x1334) 的分辨率为标准进行缩放。
var scale = BK.Director.screenPixelSize.width / 750;
BK.Director.root.scale = {x:scale,y:scale};

var circleTex  =new BK.Texture('GameRes://resource/texture/blue_circle.png');
var circle =new BK.Sprite(375,375,circleTex,0,1,1,1);
BK.Director.root.addChild(circle);

// var testTex = new BK.Texture("GameRes://resource/texture/terrain.png");
// var background = new BK.Sprite(375,375,testTex,0,1,1,1);
// background.position = {x:0,y:375};
// BK.Director.root.addChild(background);

var yscale =1;
BK.Director.ticker.add(function (ts,duration) {
    if (yscale<0) {
      yscale =1;
    }
    yscale = yscale - 0.01;
    circle.scale = {x:1,y:yscale};
    circle.adjustTexturePosition(0,0,circleTex.size.width,circleTex.size.height*yscale)
})
