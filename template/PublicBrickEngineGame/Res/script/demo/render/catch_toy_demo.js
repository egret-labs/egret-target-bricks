BK.Script.loadlib('GameRes://script/core/net/protocol.js');
BK.Script.loadlib('GameRes://script/core/ui/ui_event.js');
BK.Script.loadlib("GameRes://script/core/basics/av.js");
BK.Script.loadlib("GameRes://script/core/basics/AVRoom.js");
BK.Director.clearColor = { r: 1, g: 1, b: 1, a: 1 };
var style = {
    "fontSize": 50,
    "textColor": 0xFFFF0000,
    "maxWidth": 600,
    "maxHeight": 400,
    "width": 400,
    "height": 200,
    "textAlign": 0,
    "bold": 1,
    "italic": 0,
    "strokeColor": 0xFF000000,
    "strokeSize": 5,
    "shadowRadius": 5,
    "shadowDx": 10,
    "shadowDy": 10,
    "shadowColor": 0xFFFF0000
}

var deviceText1 = new BK.Text(style, "设备017113");
var deviceText2 = new BK.Text(style, "设备317155");
var deviceText3 = new BK.Text(style, "设备317023");
deviceText1.zOrder = -999999;
deviceText2.zOrder = -999999;
deviceText3.zOrder = -999999;
deviceText1.position = {x: 50, y: BK.Director.screenPixelSize.height - 400, z: 0};
deviceText2.position = {x: 500, y: BK.Director.screenPixelSize.height - 400, z: 0};
deviceText3.position = {x: 900, y: BK.Director.screenPixelSize.height - 400, z: 0};
BK.Director.root.addChild(deviceText1);
BK.Director.root.addChild(deviceText2);
BK.Director.root.addChild(deviceText3);

var loginBtn = new BK.Text(style, "登陆娃娃机");
loginBtn.zOrder = -999999;
loginBtn.canUserInteract = true;
loginBtn.position = { x: 50, y: 0, z: 0 };
BK.Director.root.addChild(loginBtn);

var avBtn = new BK.Text(style, "打开视频");
avBtn.zOrder = -999999;
avBtn.canUserInteract = true;
avBtn.position = { x: 50, y: 200, z: 0 };
BK.Director.root.addChild(avBtn);

var closeBtn = new BK.Text(style, "关闭");
closeBtn.zOrder = -999999;
closeBtn.canUserInteract = true;
closeBtn.position = { x: 50, y: 400, z: 0 };
BK.Director.root.addChild(closeBtn);

var leftTex = new BK.Texture("GameRes://texture/direction_left.png");
var leftBtn = new BK.Sprite(200, 200, leftTex, 1, 1, 1, 1);
leftBtn.zOrder = -999999;
leftBtn.canUserInteract = true;
leftBtn.anchor = { x: 0.5, y: 0.5 };
leftBtn.position = { x: 350, y: 300, z: 0 };
BK.Director.root.addChild(leftBtn);

var rightTex = new BK.Texture("GameRes://texture/direction_right.png");
var rightBtn = new BK.Sprite(200, 200, rightTex, 1, 1, 1, 1);
rightBtn.zOrder = -999999;
rightBtn.canUserInteract = true;
rightBtn.anchor = { x: 0.5, y: 0.5 };
rightBtn.position = { x: 600, y: 300, z: 0 };
BK.Director.root.addChild(rightBtn);

var topTex = new BK.Texture("GameRes://texture/direction_top.png");
var topBtn = new BK.Sprite(200, 200, topTex, 0, 0, 1, 1);
topBtn.zOrder = -999999;
topBtn.canUserInteract = true;
topBtn.anchor = { x: 0.5, y: 0.5 };
topBtn.position = { x: 480, y: 530, z: 0 };
BK.Director.root.addChild(topBtn);

var bottomTex = new BK.Texture("GameRes://texture/direction_bottom.png");
var bottomBtn = new BK.Sprite(200, 200, bottomTex, 0, 0, 1, 1);
bottomBtn.zOrder = -999999;
bottomBtn.canUserInteract = true;
bottomBtn.anchor = { x: 0.5, y: 0.5 };
bottomBtn.position = { x: 480, y: 80, z: 0 };
BK.Director.root.addChild(bottomBtn);

var stopTex = new BK.Texture("GameRes://texture/stop.png");
var stopBtn = new BK.Sprite(200, 200, stopTex, 0, 1, 1, 1);
stopBtn.zOrder = -999999;
stopBtn.canUserInteract = true;
stopBtn.position = { x: 800, y: 0, z: 0 };
BK.Director.root.addChild(stopBtn);

var catchTex = new BK.Texture("GameRes://texture/catch.png");
var catchBtn = new BK.Sprite(200, 200, catchTex, 0, 1, 1, 1);
catchBtn.zOrder = -999999;
catchBtn.canUserInteract = true;
catchBtn.position = { x: 800, y: 250, z: 0 };
BK.Director.root.addChild(catchBtn);

var DEVICE_ID = "317155"//"017113"//
var OP_KEY = "7585c04a0151467996794d3b95bd53e7";

var GRAN_CRANE_CMD = "apollo_game_openapi.gran_crane_cmd";
var t1 = 0;
function requestSSO(subcmd, direction, state) {
    var data = {
        "gameid": 3002,
        "cmd": subcmd,
        "deviceid": DEVICE_ID,
        "opkey": OP_KEY,
        "direct": direction,
        "state": state
    };
    BK.Script.log(1, 0, "catchToy!request = " + JSON.stringify(data));
    BK.MQQ.SsoRequest.send(data, GRAN_CRANE_CMD);
    t1 = BK.Time.clock;
}

BK.MQQ.SsoRequest.addListener(GRAN_CRANE_CMD, null, function (errCode, cmd, data) {
    var t2 = BK.Time.clock;
    var delta = BK.Time.diffTime(t1, t2);
    BK.Script.log(1, 0, "catchToy!cost = " + delta + ", errorCode = " + errCode + ", cmd = " + cmd + ", resp = " + JSON.stringify(data));
});

BK.AVRoomManager.initRoom(1400042624, 17771, "", function (errCode, cmd, data) {
    BK.Script.log(1, 0, "catchToy!initRoom, errCode = " + errCode + ", cmd = " + cmd + ", data = " + JSON.stringify(data));
    if (errCode == 0) {

    }
});

function onBegin(node, evt, x, y) {
    if (node == closeBtn) {
        BK.Script.log(1, 0, "catchToy!关闭房间");
        BK.AVRoomManager.exitRoom();
        BK.QQ.notifyCloseGame();
    } else if (node == loginBtn) {
        BK.Script.log(1, 0, "catchToy!登陆娃娃机");
        requestSSO(1, 0, 0);
    } else if (node == avBtn) {
        BK.Script.log(1, 0, "catchToy!打开视频吧");
        /*
        appid 1400042624
        accountType 17771
        roomid 10005 
        */
        //enterRoom(roomId:number,avRoomId:number,callback:(errCode:number,cmd:string,data:any)=>void)
        BK.AVRoomManager.enterRoom(0, 10001, function (errCode, cmd, data) {
            var othersView = new QAVView("1234", BK.Director.screenPixelSize.width, BK.Director.screenPixelSize.height, true, undefined, undefined);
            //othersView.anchor = {x: 0.5, y: 0.5};
            //othersView.rotation = {x: 0, y: 0, z: -90};
            BK.Director.root.addChild(othersView);
        });
    } else if (node == leftBtn) {
        BK.Script.log(1, 0, "catchToy!向左移动夹子");
        requestSSO(2, 0, 1);
    } else if (node == rightBtn) {
        BK.Script.log(1, 0, "catchToy!向右移动夹子");
        requestSSO(2, 1, 1);
    } else if (node == topBtn) {
        BK.Script.log(1, 0, "catchToy!向前移动夹子");
        requestSSO(2, 3, 1);
    } else if (node == bottomBtn) {
        BK.Script.log(1, 0, "catchToy!向后移动夹子");
        requestSSO(2, 2, 1);
    } else if (node == stopBtn) {
        BK.Script.log(1, 0, "catchToy!停止移动夹子");
        requestSSO(2, 0, 0);
    } else if (node == catchBtn) {
        BK.Script.log(1, 0, "catchToy!夹子抓娃娃了");
        requestSSO(3, 0, 0);
    } else if (node == deviceText1) {
        DEVICE_ID = "017113";
    } else if (node == deviceText2) {
        DEVICE_ID = "317155";
    } else if (node == deviceText3) {
        DEVICE_ID = "317023";
    }
}

UIEventHandler.addNodeEvent(closeBtn, UI_NODE_ENENT_TOUCH_BEGIN, onBegin);
UIEventHandler.addNodeEvent(loginBtn, UI_NODE_ENENT_TOUCH_BEGIN, onBegin);
UIEventHandler.addNodeEvent(avBtn, UI_NODE_ENENT_TOUCH_BEGIN, onBegin);
UIEventHandler.addNodeEvent(leftBtn, UI_NODE_ENENT_TOUCH_BEGIN, onBegin);
UIEventHandler.addNodeEvent(rightBtn, UI_NODE_ENENT_TOUCH_BEGIN, onBegin);
UIEventHandler.addNodeEvent(topBtn, UI_NODE_ENENT_TOUCH_BEGIN, onBegin);
UIEventHandler.addNodeEvent(bottomBtn, UI_NODE_ENENT_TOUCH_BEGIN, onBegin);
UIEventHandler.addNodeEvent(stopBtn, UI_NODE_ENENT_TOUCH_BEGIN, onBegin);
UIEventHandler.addNodeEvent(catchBtn, UI_NODE_ENENT_TOUCH_BEGIN, onBegin);
UIEventHandler.addNodeEvent(deviceText1, UI_NODE_ENENT_TOUCH_BEGIN, onBegin);
UIEventHandler.addNodeEvent(deviceText2, UI_NODE_ENENT_TOUCH_BEGIN, onBegin);
UIEventHandler.addNodeEvent(deviceText3, UI_NODE_ENENT_TOUCH_BEGIN, onBegin);