// GameRes:://script/demo/webgl/webgl_bunnymark.js
BK.Script.loadlib('GameRes://script/demo/webgl/common/common.js');
BK.Script.loadlib('GameRes://script/demo/webgl/core/director.js');
BK.Script.loadlib('GameRes://script/demo/webgl/scene/sprite.js');

BK.Director.showDiagnosticsUI = false;

function createText (x, y, content) {
    var style = {
        "fontSize": 20,            //字号
        "textColor": 0xFFFF0000, //颜色  ARGB编码
        "maxWidth": 400,            //最大宽度
        "maxHeight": 100,            //最大高度
        "width": 400,                    //宽度
        "height": 100,                //高度
        "textAlign": 0                //对其方式 0左 1中 2右
    };

    var txt = new BK.Text(style, content);
    txt.position = {
        x: x,
        y: y
    };
    BK.Director.root.addChild(txt);
    return txt;
}

var bunnys = [];
var bunnyTrimRects = [
    {
        x: 2, y: 86, w: 26, h: 37
    },
    {
        x: 2, y: 125, w: 26, h: 37
    },
    {
        x: 2, y: 164, w: 26, h: 37
    },
    {
        x: 2, y: 2, w: 26, h: 37
    }
];
var trimRect = null;
var bunnyType = 0;
var gravity = 0.5;

var maxX = 0;
var minX = 0;
var maxY = 0;
var minY = 0;

var startBunnyCount = 2102;
var isAdding = false;
var count = 0;
var amount = 100;
var number = 0;

var bunnysTex;

var _anchor = {x: 0.5, y: 1};
var _scale = {x: 0, y: 0};
var fbs;
function init () {
    var pixelSize = BK.Director.screenPixelSize;
    maxX = pixelSize.width;
    maxY = pixelSize.height;
    minX = 0;
    minY = 0;

    // fbs = createText(0, 50, 0);
    //number = createText(maxX / 2 - 25, maxY / 2 - 25, 0);

    //bunnysTex = new BK.Texture('GameRes://resource/bunnys.png');
    bunnysTex = BK.director_instance.load_texture('GameRes://resource/bunnys.png');

    trimRect = bunnyTrimRects[0];

    for (var i = 0; i < startBunnyCount; i++) {
        //var sp = new BK.Sprite(trimRect.w,trimRect.h, bunnysTex, 0,1,1,1);
        var sp = new Sprite(trimRect.w,trimRect.h, bunnysTex, 0,1,1,1);
        sp.adjustTexturePosition(trimRect.x, trimRect.y, trimRect.w, trimRect.h);
        //sp.anchor = _anchor;
        sp.speedX = Math.random() * 10;
        sp.speedY = (Math.random() * 10) - 5;
        sp.setPosition(0, maxY * 0.7, 0);
        //sp.position = {x: 0, y: maxY * 0.7};
        _scale.x = _scale.y = 0.5 + Math.random() * 0.5;
        sp.setScale(_scale.x, _scale.y, 1.0);
        sp.setRotationZ(360 * (Math.random() * 0.2 - 0.1));
        bunnys.push(sp);
        //BK.Director.root.addChild(sp);
        BK.director_instance.root_node.addChild(sp);
    }

    count = startBunnyCount;
    //number.content = count;
    number = count;
    mmlog('========================================== number : ' + number);

    //BK.Director.ticker.add(tickerUpdate);

    var t = new BK.Ticker();
    t.interval = 1; //帧间隔  每帧时间为 interval/60 秒 。即1代表 60帧。2代表30帧
    t.setTickerCallBack(tickerUpdate);
}

function tickerUpdate (ts, duration) {
    // fbs.content = BK.Director.fps.toFixed(2);
    updateTouch();
    update(duration);
}

function updateTouch() {
    var touchArr = BK.TouchEvent.getTouchEvent();
    if (touchArr === undefined) {
        return;
    }
    for (var i = 0; i < touchArr.length; i++) {
        var x = touchArr[i].x;
        var y = touchArr[i].y;
        // touch up
        if (touchArr[i].status === 1) {
            bunnyType++;
            bunnyType %= 5;
            trimRect = bunnyTrimRects[bunnyType];
            isAdding = false;
        }
        // touch down
        if (touchArr[i].status === 2) {
            isAdding = true;
        }
    }
    BK.TouchEvent.updateTouchStatus();
    BK.Script.log(1, 1, "updateTouchStatus");
}
function update (dt) {
    var bunny, bunnysp, i;
    if (isAdding) {
        for (i = 0; i < amount; i++) {
            //var sp = new BK.Sprite(trimRect.w, trimRect.h, bunnysTex, 0, 1, 1, 1);
            var sp = new Sprite(trimRect.w, trimRect.h, bunnysTex, 0, 1, 1, 1);
            sp.adjustTexturePosition(trimRect.x, trimRect.y, trimRect.w, trimRect.h);
            //sp.anchor = _anchor;
            sp.speedX = Math.random() * 10;
            sp.speedY = (Math.random() * 10) - 5;
            sp.setPosition(0, maxY * 0.7, 0);
            //sp.position = {x: 0, y: maxY * 0.7};
            _scale.x = _scale.y = 0.5 + Math.random() * 0.5;
            //sp.scale = _scale;
            sp.setScale(_scale.x, _scale.y, 1.0);
            //sp.rotation.z = 360 * (Math.random() * 0.2 - 0.1);
            sp.setRotationZ(360 * (Math.random() * 0.2 - 0.1));
            bunnys.push(sp);
            //BK.Director.root.addChild(sp);
            BK.director_instance.root_node.addChild(sp);
            count++;
        }
        //number.content = count;
        number = count
        mmlog('========================================== number : ' + number);
    }

    //var start = BK.Time.timestamp;
    for (i = 0; i < bunnys.length; i++) {
        bunny = bunnys[i];

        var x = bunny.position.x + bunny.speedX;
        var y = bunny.position.y - bunny.speedY;

        bunny.speedY += gravity;

        if (x > maxX) {
            bunny.speedX *= -1;
            x = maxX;
        }
        else if (x < minX) {
            bunny.speedX *= -1;
            x = minX;
        }

        if (y < minY) {
            bunny.speedY *= -0.85;
            y = minY;
            if (Math.random() > 0.5) {
                bunny.speedY -= Math.random() * 6;
            }
        }
        else if (y > maxY) {
            bunny.speedY = 0;
            y = maxY;
        }

        bunny.setPosition(x, y, 0);
        // bunny.position = {
        //     x: x,
        //     y: y
        // };
    }
    //var end = BK.Time.timestamp;
    //console.log('Update / Delta Time =', end-start, '/', dt*1000, '=', ((end-start)/(dt*1000)).toFixed(2));
}

init();

