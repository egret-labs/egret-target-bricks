
var width = BK.Director.screenPixelSize.width;
var height = BK.Director.screenPixelSize.height;

var bitmap1 = BK.Texture.createBitmapTexture(512, 512);
var bitmap2 = BK.Texture.createBitmapTexture(512, 512);
var bitmap3 = BK.Texture.createBitmapTexture(512, 512);
var bitmap4 = BK.Texture.createBitmapTexture(512, 512);

var sprite1 = new BK.Sprite(width / 2, height / 2, bitmap1, 0, 1, 1, 1);
var sprite2 = new BK.Sprite(width / 2, height / 2, bitmap2, 0, 1, 1, 1);
var sprite3 = new BK.Sprite(width / 2, height / 2, bitmap3, 0, 1, 1, 1);
var sprite4 = new BK.Sprite(width / 2, height / 2, bitmap4, 0, 1, 1, 1);
BK.Director.root.addChild(sprite1);
BK.Director.root.addChild(sprite2);
BK.Director.root.addChild(sprite3);
BK.Director.root.addChild(sprite4);

sprite2.position = {x : width / 2, y : 0, z: 0};
sprite3.position = {x : width / 2, y : height / 2, z: 0};
sprite4.position = {x : 0, y : height / 2, z: 0};

var image1 = BK.Image.loadImage("GameRes://resource/texture/icon.png");
var image2 = BK.Image.loadImage("GameRes://resource/texture/night.png");

bitmap1.uploadSubData(0, 0, image2.width, image2.height, image2.buffer);
bitmap1.uploadSubData(0, 0, image1.width, image1.height, image1.buffer);

bitmap2.uploadSubData(0, 0, image2.width, image2.height, image2.buffer);
bitmap2.uploadSubData(0, 0, image1.width, image1.height, image1.buffer);

bitmap3.uploadSubData(0, 0, image2.width, image2.height, image2.buffer);
bitmap3.uploadSubData(0, 0, image1.width, image1.height, image1.buffer);

bitmap4.uploadSubData(0, 0, image2.width, image2.height, image2.buffer);
bitmap4.uploadSubData(0, 0, image1.width, image1.height, image1.buffer);

var x = 0, y = 0;
//BK.Director.ticker.interval = 2;
BK.Director.ticker.add(function(ts, dt){
    if (x == 200) x = 0;
    if (y == 200) y = 0;
    bitmap1.uploadSubData(0, 0, image2.width, image2.height, image2.buffer);
    bitmap1.uploadSubData(x, y, image1.width, image1.height, image1.buffer);

    bitmap2.uploadSubData(0, 0, image2.width, image2.height, image2.buffer);
    bitmap2.uploadSubData(x, y, image1.width, image1.height, image1.buffer);

    bitmap3.uploadSubData(0, 0, image2.width, image2.height, image2.buffer);
    bitmap3.uploadSubData(x, y, image1.width, image1.height, image1.buffer);

    bitmap4.uploadSubData(0, 0, image2.width, image2.height, image2.buffer);
    bitmap4.uploadSubData(x, y, image1.width, image1.height, image1.buffer);
    x = x + 1;
    y = y + 1;
});
