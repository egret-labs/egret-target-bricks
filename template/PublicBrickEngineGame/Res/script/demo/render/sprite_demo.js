/**
 * 精灵类
 */
//竖屏模式下，以iPhone 6 (750x1334) 的分辨率为标准进行缩放。
var scale = BK.Director.screenPixelSize.width / 750;
BK.Director.root.scale = {x:scale,y:scale};

var circleTex  =new BK.Texture('GameRes://resource/texture/blue_circle.png');
var circle =new BK.Sprite(375,375,circleTex,0,1,1,1);
BK.Director.root.addChild(circle);
