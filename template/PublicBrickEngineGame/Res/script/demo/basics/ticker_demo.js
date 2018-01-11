/**
 * Ticker
 */
var t = new BK.Ticker();
t.interval = 1; //帧间隔  每帧时间为 interval/60 秒 。即1代表 60帧。2代表30帧
t.setTickerCallBack( function (ts,duration) {
    //do other things...
});
