/**
 * 精灵类
 */
//竖屏模式下，以iPhone 6 (750x1334) 的分辨率为标准进行缩放。
var scale = BK.Director.screenPixelSize.width / 750;
//BK.Director.root.scale = {x:scale,y:scale*(-1)};
BK.Director.root.scale = {x:scale,y:scale};

var baseNode = new BK.Node();
BK.Director.root.addChild(baseNode);
baseNode.tag = 9;
baseNode.position = {x:0,y:400}
baseNode.scale = {x:1,y:-1}

var graphics = new BK.Graphics();

var testTex = new BK.Texture("GameRes://resource/texture/spritesheet/test.png");
var sp0 = new BK.Sprite(375,375,testTex,0,1,1,1);
sp0.adjustTexturePosition(1,131,256,256);
sp0.position = {x:0,y:375*0};
baseNode.addChild(sp0);
sp0.name = "sp0"
sp0.graphics = graphics;

var sp2 = new BK.Sprite(375,375,testTex,0,1,1,1);
sp2.adjustTexturePosition(1,131,256,256);
sp2.position = {x:0,y:375*1};
baseNode.addChild(sp2)
sp2.graphics = graphics;


graphics.drawTexture(testTex,1,131,256,256,0,0,1);
graphics.drawTexture(testTex,131,1,128,64,1,0,1);

var style = {
    "fontSize":20,
    "textColor" : 0xFFFF0000,
    "maxWidth" : 200,
    "maxHeight": 400,
    "width":100,
    "height":200,
    "textAlign":0,
    "bold":1,
    "italic":1,
    "strokeColor":0xFF000000,
    "strokeSize":5,
    "shadowRadius":5,
    "shadowDx":10,
    "shadowDy":10,
    "shadowColor":0xFFFF0000
}
var text = new BK.Text(style,"Rich text with a lot of options and across multiple lines")
graphics.drawText(text,0,1);
graphics.drawRect(0,0,100,100,{r:0.3,g:0.9,b:0.6,a:0.5});





