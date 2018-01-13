//竖屏模式下，以iPhone 6 (750x1334) 的分辨率为标准进行缩放。
var scale = BK.Director.screenPixelSize.width / 750;
BK.Director.root.scale = {x:scale,y:scale};

//create a texture from image path
var starTex = new BK.Texture('GameRes://resource/texture/star.png');

//create a sprite from texture
var star = new BK.Sprite(750/2,750/2,starTex,0,1,1,1);

//set anchor point to the center of the sprite
star.anchor = {x:0.5,y:0.5};

//put the sprite to the center of screen
star.position = {x:750/2 , y:1334/2};

//add the sprite to the root node
BK.Director.root.addChild(star);

//add update rotation function to main ticker
var rotate = 0;
BK.Director.ticker.add (function (ts,duration) {
    star.rotation = {x:0,y:0,z:rotate}; //rotation
    rotate=rotate+1;
});

