BK.Script.loadlib('GameRes://script/core/render/ScreenShot.js');

var backTex = new BK.Texture('GameRes://resource/texture/catchToy.png');
var background = new BK.Sprite(BK.Director.screenPixelSize.width, BK.Director.screenPixelSize.height, backTex, 0, 1, 1, 1);
BK.Script.log(1, 1, "w=" + BK.Director.screenPixelSize.width + " h=" + BK.Director.screenPixelSize.height);
background.zOrder = 10000;
BK.Director.root.addChild(background);

var webGLTicker = new BK.Ticker();
webGLTicker.interval = 1;
var temp = 0;
webGLTicker.setTickerCallBack(function (ts, duration) {
    temp = temp + 1;
    if (temp == 10) {
        BK.Script.log(1, 1, "temp=" + temp);
        var ss = new ScreenShot();
        ss.origin = { x: 500, y: 1000 };
        ss.size = { width: 500, height: 1000 };

         var path = ss.shotToFile(TYPE_PNG, "test1234567");// 截图并保存到file
        // var buff = ss.shotToBuff();// 截图并保存到buffer

        BK.Director.root.removeChild(background);
        var newBackTex = new BK.Texture("GameSandBox://test1234567.png");
        var newBackground = new BK.Sprite(500, 1000, newBackTex, 0, 1, 0, 0);
        background.zOrder = 10000;
        BK.Director.root.addChild(newBackground);
    }
});
