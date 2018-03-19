var backTex = new BK.Texture('GameRes://resource/texture/catchToy.png');
var background = new BK.Sprite(BK.Director.screenPixelSize.width, BK.Director.screenPixelSize.height, backTex, 0, 1, 1, 1);
BK.Script.log(1,1,"w="+BK.Director.screenPixelSize.width+" h="+BK.Director.screenPixelSize.height);
background.zOrder = 10000;
BK.Director.root.addChild(background);

var webGLTicker = new BK.Ticker();
webGLTicker.interval = 1;
var temp = 0;
webGLTicker.setTickerCallBack(function(ts,duration){
    temp = temp + 1;
    if(temp == 10){
        var renderTexture = new BK.RenderTexture(BK.Director.screenPixelSize.width,BK.Director.screenPixelSize.height);
        BK.Render.renderToTexture(BK.Director.root,renderTexture);
        renderTexture.writeToDiskWithXY("GameSandBox://test1.png",100,100,500,500);
    }

});
