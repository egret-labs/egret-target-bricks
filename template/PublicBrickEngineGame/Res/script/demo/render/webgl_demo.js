BK.Script.loadlib('GameRes://script/core/render/WebGLCore.js');


var gl = bkWebGLGetInstance();
var glTicker = new BK.Ticker();
glTicker.interval = 1;
glTicker.setTickerCallBack(function(ts, duration)
{
    gl.glClearColor(1,0,0,1);
    gl.glCommit();

});