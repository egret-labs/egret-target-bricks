BK.Script.loadlib('GameRes://script/core/net/protocol.js');
BK.Script.loadlib('GameRes://script/core/ui/ui_event.js');
BK.Script.loadlib("GameRes://script/core/basics/av.js");
BK.Script.loadlib("GameRes://script/core/net/protocol.js");
BK.Script.loadlib('GameRes://script/core/basics/qav.js');
var designWidth = 750;
var designHeight = 1334;

BK.Director.root.scale = { x: BK.Director.screenPixelSize.width / designWidth, y: BK.Director.screenPixelSize.height / designHeight };

var backTex = new BK.Texture("GameRes://resource/texture/catchToy.png");
var background = new BK.Sprite(designWidth, designHeight, backTex, 0, 1, 1, 1);
BK.Director.root.addChild(background);

var style = {
    "fontSize": 30,
    "textColor": 0xFFFF0000,
    "maxWidth": designWidth,
    "maxHeight": designHeight,
    "width": designWidth,
    "height": 46,
    "textAlign": 0,
    "bold": 1,
    "italic": 0,
    "strokeColor": 0xFF000000,
    "strokeSize": 5,
    "shadowRadius": 5,
    /*"shadowDx": 10,
    "shadowDy": 10,
    "shadowColor": 0xFFFF0000*/
}

var style2 = {
    "fontSize": 30,
    "textColor": 0xFFFF0000,
    "maxWidth": designWidth,
    "maxHeight": 300,
    "width": designWidth,
    "height": 46 * 3,
    "textAlign": 0,
    "bold": 1,
    "italic": 0,
    "strokeColor": 0xFF000000,
    "strokeSize": 5,
    "shadowRadius": 5,
    /*"shadowDx": 10,
    "shadowDy": 10,
    "shadowColor": 0xFFFF0000*/
}

var style3 = {
    "fontSize": 20,
    "textColor": 0xFFFF0000,
    "maxWidth": BK.Director.screenPixelSize.width,
    "maxHeight": 300,
    "width": BK.Director.screenPixelSize.width,
    "height": 20 * 3,
    "textAlign": 0,
    "bold": 1,
    "italic": 0,
    "strokeColor": 0xFF000000,
    "strokeSize": 5,
    "shadowRadius": 5,
    /*"shadowDx": 10,
    "shadowDy": 10,
    "shadowColor": 0xFFFF0000*/
}

var closeBtn;
var leftBtn;
var rightBtn;
var topBtn;
var bottomBtn;
var stopBtn;
var catchBtn;
var myOpenIdText;
var roomListBtn;
var contentText;
var resetBtn;
var nextPlayerBtn;
var startGameBtn;
var msgBoxTips;
var msgBoxTipsYes;
var msgBoxTipsNo;
var roomText;

var canStartGame = false;
var joinBKRoomSucc = false;
var joinAVRoomSucc = false;
var GAME_ID = 2233;
var ROOM_ID = 775418012454758;
var LVROOM_ID = 0;
var DEVICE_ID = "317155"; //"317155"//"017113"//
var OP_KEY = "7585c04a0151467996794d3b95bd53e7";


/*1400042624, 17771*/
/*
BK.AVRoomManager.initRoom(1400036169, 14180, "", function (errCode, cmd, data) {
    BK.Script.log(1, 0, "catchToy!initRoom, errCode = " + errCode + ", cmd = " + cmd + ", data = " + JSON.stringify(data));
    if (errCode == 0) {

    }
});*/

function joinToyRoom(roomID, openId) {
    var httpget = new BK.HttpUtil("http://111.230.236.124:6811/debug/userJoin?room=" + roomID + "&user=" + openId);
    // 设置referer,cookie
    httpget.setHttpMethod("get")
    httpget.requestAsync(function (resp, code) {
        var respStr = resp.readAsString(true);
        BK.Script.log(1, 0, "catchToy!joinToyRoom resp, code = " + code + ", resp = " + respStr);
        if (code == 200) {
            var respObj = JSON.parse(respStr);
        }
    });
    BK.Script.log(1, 0, "catchToy!joinToyRoom, roomID = " + roomID + ", openId = " + openId);
}

function leaveToyRoom(roomID, openId, callback) {
    var httpget = new BK.HttpUtil("http://111.230.236.124:6811/debug/leaveRoom?room=" + roomID + "&user=" + openId);
    // 设置referer,cookie
    httpget.setHttpMethod("get")
    httpget.requestAsync(function (resp, code) {
        var respStr = resp.readAsString(true);
        BK.Script.log(1, 0, "catchToy!leaveToyRoom resp, code = " + code + ", resp = " + respStr);
        if (code == 200) {
            var respObj = JSON.parse(respStr);
            callback && callback(0);
        } else {
            callback && callback(-1);
        }
    });
    BK.Script.log(1, 0, "catchToy!leaveToyRoom, roomID = " + roomID + ", openId = " + openId);
}

function getToyPlayUser(roomID, callback) {
    var httpget = new BK.HttpUtil("http://111.230.236.124:6811/debug/getPlayUser?room=" + roomID);
    // 设置referer,cookie
    httpget.setHttpMethod("get")
    httpget.requestAsync(function (resp, code) {
        var respStr = resp.readAsString(true);
        BK.Script.log(1, 0, "catchToy!getToyPlayUser resp, code = " + code + ", resp = " + respStr);
        if (code == 200) {
            var respObj = JSON.parse(respStr);
            //contentText.content = "下一个玩家：" + respObj.userID;
            callback && callback(0, respObj.userID);
        } else {
            callback && callback(-1, "");
        }
    });
    BK.Script.log(1, 0, "catchToy!getToyPlayUser, roomID = " + roomID);
}

function getToyInfo(roomID, callback) {
    var httpget = new BK.HttpUtil("http://111.230.236.124:6811/debug/getinfo?room=" + roomID);
    // 设置referer,cookie
    httpget.setHttpMethod("get")
    httpget.requestAsync(function (resp, code) {
        var respStr = resp.readAsString(true);
        BK.Script.log(1, 0, "catchToy!getToyInfo resp, code = " + code + ", resp = " + respStr);
        if (code == 200) {
            var respObj = JSON.parse(respStr);
            callback && callback(0, respObj);
        } else {
            callback && callback(-1, {});
        }
    });
    BK.Script.log(1, 0, "catchToy!getToyInfo, roomID = " + roomID);
}

function startToyGame(roomID, openId, callback) {
    var httpget = new BK.HttpUtil("http://111.230.236.124:6811/debug/startGame?room=" + roomID + "&user=" + openId);
    // 设置referer,cookie
    httpget.setHttpMethod("get")
    httpget.requestAsync(function (resp, code) {
        var respStr = resp.readAsString(true);
        BK.Script.log(1, 0, "catchToy!startToyGame resp, code = " + code + ", resp = " + respStr);
        if (code == 200) {
            var respObj = JSON.parse(respStr);
            if (respObj.state == 0) {
                if (callback) {
                    callback(0);
                }
            } else {
                callback && callback(-1);
            }
        } else {
            callback && callback(-1);
        }
    });
    BK.Script.log(1, 0, "catchToy!startToyGame, roomID = " + roomID);
}

function leaveToyGame(roomID, openId, callback) {
    var httpget = new BK.HttpUtil("http://111.230.236.124:6811/debug/leavegame?room=" + roomID + "&user=" + openId);
    // 设置referer,cookie
    httpget.setHttpMethod("get")
    httpget.requestAsync(function (resp, code) {
        var respStr = resp.readAsString(true);
        BK.Script.log(1, 0, "catchToy!leaveToyGame resp, code = " + code + ", resp = " + respStr);
        if (code == 200) {
            var respObj = JSON.parse(respStr);
            if (respObj.state == 0) {
                if (callback) {
                    callback(0);
                }
            } else {
                callback && callback(-1);
            }
        } else {
            callback && callback(-1);
        }
    });
    BK.Script.log(1, 0, "catchToy!leaveToyGame, roomID = " + roomID);
}

function resetToyRoom(roomID) {
    var httpget = new BK.HttpUtil("http://111.230.236.124:6811/debug/reset?room=" + roomID);
    // 设置referer,cookie
    httpget.setHttpMethod("get")
    httpget.requestAsync(function (resp, code) {
        var respStr = resp.readAsString(true);
        BK.Script.log(1, 0, "catchToy!resetToyRoom resp, code = " + code + ", resp = " + respStr);
        if (code == 200) {
            var respObj = JSON.parse(respStr);
        }
    });
    BK.Script.log(1, 0, "catchToy!resetToyRoom, roomID = " + roomID);
}

var countDownTexs = null;
var countDown = 0;
var countDownSp = null;
function startGameUI(callback) {
    var num = ["GameRes://resource/texture/ranklist/num/bonus/finish/1.png",
        "GameRes://resource/texture/ranklist/num/bonus/finish/2.png",
        "GameRes://resource/texture/ranklist/num/bonus/finish/3.png",
        "GameRes://resource/texture/ranklist/num/bonus/finish/4.png",
        "GameRes://resource/texture/ranklist/num/bonus/finish/5.png"];

    if (!countDownTexs) {
        countDownTexs = new Array(5);
        for (var i = 0; i < 5; i++) {
            countDownTexs[i] = new BK.Texture(num[i]);
        }
    }

    if (!countDownSp) {
        countDownSp = new BK.Sprite(42, 56, null, 0, 1, 1, 1);
        countDownSp.zOrder = -9999999;
        countDownSp.anchor = { x: 0.5, y: 0.5 };
        countDownSp.position = { x: designWidth / 2, y: designHeight / 2, z: 0 };
    }

    function updateCountDownSprite() {
        if (countDown == 5) {
            countDown = 0;
            BK.Director.root.removeChild(countDownSp);
            BK.Director.ticker.removeInterval(updateCountDownSprite);
            callback && callback();
            return;
        }
        BK.Script.log(1, -1, "catchToy!countDown =  " + countDown);
        countDownSp.setTexture(countDownTexs[4 - countDown]);
        countDown = countDown + 1;
    }

    countDownSp.setTexture(null);
    BK.Director.root.addChild(countDownSp);
    BK.Director.ticker.setInterval(updateCountDownSprite, 1000, updateCountDownSprite);
}

var room = new BK.Room;

if (GameStatusInfo.devPlatform) {
    //2 为测试环境
    room.environment = 2;
}else{
    //1 手Q Debug环境
    room.environment = 1;
}
room.setBroadcastDataCallBack(function (fromId, respData, toId) {
    var data = respData.readAsString(true);
    var respObj = JSON.parse(data);
    BK.Script.log(1, 0, "catchToy!broadcast, data = " + data + ", toId = " + toId);
    BK.Script.log(1, 0, "catchToy!broadcast, cmd = " + respObj.cmd);
    if (contentText)
        contentText.content = data;
    if (respObj.cmd == 1) {
        BK.Script.log(1, 0, "catchToy!娃娃机空闲");
    } else if (respObj.cmd == 2) {
        BK.Script.log(1, 0, "catchToy!娃娃机上机广播, userID = " + respObj.ext.userID);
    } else if (respObj.cmd == 3) {
        BK.Script.log(1, 0, "catchToy!娃娃机下机广播, userID = " + respObj.ext.userID);
        if (respObj.ext.userID == GameStatusInfo.openId) {
            canStartGame = false;
        }
    } else if (respObj.cmd == 4) {
        BK.Script.log(1, 0, "catchToy!提醒用户上机, userID = " + toId);
        if (toId == GameStatusInfo.openId) {
            canStartGame = true;
        }
    }
});

var GRAN_CRANE_CMD = "apollo_game_openapi.gran_crane_cmd";
var openKey = null;
var t1 = 0;
function getOpenKeyByGameId(gameId, callback) {
    var data = {
        "gameId": gameId
    };

    BK.MQQ.SsoRequest.send(data, "cs.on_get_open_key.local");

    BK.MQQ.SsoRequest.addListener("cs.on_get_open_key.local", null, function (errCode, cmd, data) {
        var t2 = BK.Time.clock;
        var delta = BK.Time.diffTime(t1, t2);
        BK.Script.log(1, 0, "catchToy!cost = " + delta + ", errorCode = " + errCode + ", cmd = " + cmd + ", resp = " + JSON.stringify(data));
        callback && callback(data);
    });
}

function requestSSO(subcmd, direction, state) {
    var data = {
        "gameid": 2233,
        "cmd": subcmd,
        "deviceid": DEVICE_ID,
        "opkey": OP_KEY,
        "direct": direction,
        "state": state
    };
    BK.Script.log(1, 0, "catchToy!request = " + JSON.stringify(data));
    BK.MQQ.SsoRequest.send(data, GRAN_CRANE_CMD);
    //room.sendControlCommand(subcmd, JSON.stringify(data), "123");
    t1 = BK.Time.clock;
}

BK.MQQ.SsoRequest.addListener(GRAN_CRANE_CMD, null, function (errCode, cmd, data) {
    var t2 = BK.Time.clock;
    var delta = BK.Time.diffTime(t1, t2);
    BK.Script.log(1, 0, "catchToy!cost = " + delta + ", errorCode = " + errCode + ", cmd = " + cmd + ", resp = " + JSON.stringify(data));
});

/*
{"appId":363,"gameId":2014,"openkey":"E175FD9828CB21526A56A8843BD46EE7","openKey":"E175FD9828CB21526A56A8843BD46EE7"}
*/
getOpenKeyByGameId(GameStatusInfo.gameId, function(resp) {
    if (resp)
        openKey = resp.openKey;
})

var needRotate = true;
var MAIN_VIEW_ZORDER = -10000;
var AUXS_VIEW_ZORDER = -10001;
var mainView = null;
var videoRenders = null;
function getFreeVideoRender(identifier) {
    if (!videoRenders) {
        videoRenders = new Array;
    }

    for (var i = 0; i < videoRenders.length; i++) {
        if (videoRenders[i].identifier == identifier) {
            return videoRenders[i];
        }
    }

    var view = null;
    if (videoRenders.length > 0) {
        if (!needRotate) {
            view = new QAVView(identifier/*"144115209756117260"*/, 240, 320, true, undefined, undefined);
            view.zOrder = AUXS_VIEW_ZORDER;
            view.canUserInteract = true;
            view.position = { x: designWidth - 240 - 10, y: designHeight - 320 - 20, z: 0 };
        } else {
            view = new QAVView(identifier, 320, 240, true, undefined, undefined);
            view.zOrder = MAIN_VIEW_ZORDER;
            view.canUserInteract = true;
            view.anchor = { x: 0.5, y: 0.5 };
            view.rotation = { x: 0, y: 0, z: -90 };
            view.position = { x: designWidth - 240 / 2 - 10, y: designHeight - 320 / 2 - 20, z: 0 };
        }
    } else {
        if (!needRotate) {
            view = new QAVView(identifier/*"144115209756117260"*/, designWidth, designHeight, true, undefined, undefined);
            view.zOrder = MAIN_VIEW_ZORDER;
            view.canUserInteract = true;
            mainView = view;
        } else {
            view = new QAVView(identifier, designHeight, designWidth, true, undefined, undefined);
            view.zOrder = MAIN_VIEW_ZORDER;
            view.canUserInteract = true;
            view.anchor = { x: 0.5, y: 0.5 };
            view.rotation = { x: 0, y: 0, z: -90 };
            view.position = { x: designWidth / 2, y: designHeight / 2, z: 0 };
            mainView = view;
        }
    }

    function onTouchRenderView(node) {
        var viewSize = node.size;
        if (viewSize.width != designWidth ||
            viewSize.height != designHeight) {
            var viewPos = node.position;
            if (mainView != null) {
                mainView.size = viewSize;
                mainView.position = viewPos;
                mainView.zOrder = AUXS_VIEW_ZORDER;
                if (!needRotate) {
                    node.size = { width: designWidth, height: designHeight };
                    node.position = { x: 0, y: 0, z: 0 };
                } else {
                    node.size = { width: designHeight, height: designWidth };
                    node.position = { x: designWidth / 2, y: designHeight / 2, z: 0 };
                }
                node.zOrder = MAIN_VIEW_ZORDER;
                mainView = node;
            }
        }
    }

    BK.Director.root.addChild(view);
    UIEventHandler.addNodeEvent(view, UI_NODE_ENENT_TOUCH_BEGIN, onTouchRenderView);

    var render = { 'renderView': view, 'identifier': identifier };
    videoRenders.push(render);
    return render;
}

function onTouchDown(node, evt, x, y) {
    if (node == leftBtn) {
        BK.Script.log(1, 0, "catchToy!向左移动夹子");
        if (joinBKRoomSucc == true &&
            joinAVRoomSucc == true) {
            requestSSO(2, 0, 1);
        }
    } else if (node == rightBtn) {
        BK.Script.log(1, 0, "catchToy!向右移动夹子");
        if (joinBKRoomSucc == true &&
            joinAVRoomSucc == true) {
            requestSSO(2, 1, 1);
        }
    } else if (node == topBtn) {
        BK.Script.log(1, 0, "catchToy!向前移动夹子");
        if (joinBKRoomSucc == true &&
            joinAVRoomSucc == true) {
            requestSSO(2, 3, 1);
        }
    } else if (node == bottomBtn) {
        BK.Script.log(1, 0, "catchToy!向后移动夹子");
        if (joinBKRoomSucc == true &&
            joinAVRoomSucc == true) {
            requestSSO(2, 2, 1);
        }
    } else if (node == stopBtn) {
        BK.Script.log(1, 0, "catchToy!停止移动夹子");
        if (joinBKRoomSucc == true &&
            joinAVRoomSucc == true) {
            requestSSO(2, 0, 0);
        }
    } else if (node == catchBtn) {
        BK.Script.log(1, 0, "catchToy!夹子抓娃娃了");
        if (joinBKRoomSucc == true &&
            joinAVRoomSucc == true) {
            requestSSO(3, 0, 0);
            BK.Director.ticker.setTimeout(function () {
                BK.Director.root.addChild(msgBoxTips);

            }, 1000 * 10);
        }
    } else if (node == myOpenIdText) {
        var buff = new BK.Buffer();
        buff.writeAsString("hello world!!");
        room.sendBroadcastData(buff);
        BK.Script.log(1, 0, "catchToy!send data = " + buff.readAsString(true));
    } else if (node == resetBtn) {
        resetToyRoom(ROOM_ID);
    } else if (node == nextPlayerBtn) {
        getToyPlayUser(ROOM_ID);
    } else if (node == startGameBtn) {
        if (canStartGame == true) {
            startToyGame(ROOM_ID, GameStatusInfo.openId, function (succ) {
                if (0 == succ) {
                    if (joinBKRoomSucc == true &&
                        joinAVRoomSucc == true) {
                        startGameUI(function () {
                            requestSSO(1, 0, 0);
                        });
                    }
                }
            });
        } else {
            contentText.content = "你当前不能操作娃娃机";
        }
    } else if (node == msgBoxTipsNo) {
        BK.Director.root.removeChild(msgBoxTips);
        leaveToyGame(ROOM_ID, GameStatusInfo.openId, function (succ) {
            canStartGame = false;
        });
    } else if (node == msgBoxTipsYes) {
        BK.Director.root.removeChild(msgBoxTips);
        if (canStartGame == true) {
            if (joinBKRoomSucc == true &&
                joinAVRoomSucc == true) {
                startGameUI(function () {
                    requestSSO(1, 0, 0);
                });
            }
        }
    }
}

function onTouchUp(node, evt, x, y) {
    if (node == leftBtn ||
        node == rightBtn ||
        node == topBtn ||
        node == bottomBtn) {
        BK.Script.log(1, 0, "catchToy!停止移动夹子");
        if (joinBKRoomSucc == true &&
            joinAVRoomSucc == true) {
            requestSSO(2, 0, 0);
        }
    }
}


function initRoomUI() {
    resetBtn = new BK.Text(style, "清空等待队列");
    resetBtn.zOrder = -99999999;
    resetBtn.canUserInteract = true;
    resetBtn.position = { x: 300, y: designHeight - resetBtn.height - 30, z: 0 };
    BK.Director.root.addChild(resetBtn);

    nextPlayerBtn = new BK.Text(style, "下一个玩家");
    nextPlayerBtn.zOrder = -9999999;
    nextPlayerBtn.canUserInteract = true;
    nextPlayerBtn.position = { x: 50, y: designHeight - nextPlayerBtn.height - 200, z: 0 };
    //BK.Director.root.addChild(nextPlayerBtn);

    roomText = new BK.Text(style, "当前房间人数");
    roomText.zOrder = -9999999;
    roomText.position = { x: 50, y : designHeight - roomText.height - 200, z: 0};
    BK.Director.root.addChild(roomText);

    startGameBtn = new BK.Text(style, "开始游戏");
    startGameBtn.zOrder = -99999999;
    startGameBtn.canUserInteract = true;
    startGameBtn.position = { x: 50, y: designHeight - startGameBtn.height - 300, z: 0 };
    BK.Director.root.addChild(startGameBtn);

    myOpenIdText = new BK.Text(style, "我: " + GameStatusInfo.openId);
    myOpenIdText.zOrder = -99999999;
    myOpenIdText.canUserInteract = true;
    myOpenIdText.position = { x: 50, y: designHeight - myOpenIdText.height - 400, z: 0 };
    BK.Director.root.addChild(myOpenIdText);

    contentText = new BK.Text(style3, "");
    contentText.zOrder = -9999999;
    contentText.position = { x: 50, y: designHeight - contentText.height - 500, z: 0 };
    BK.Director.root.addChild(contentText);

    msgBoxTips = new BK.Text(style, "是否继续?");
    msgBoxTips.zOrder = -99999999;
    msgBoxTips.canUserInteract = true;
    msgBoxTips.position = { x: (designWidth - msgBoxTips.width) / 2, y: (designHeight - msgBoxTips.height) / 2, z: 0 };

    msgBoxTipsYes = new BK.Text(style, "继续");
    msgBoxTipsYes.zOrder = -999999999;
    msgBoxTipsYes.canUserInteract = true;
    msgBoxTipsYes.position = { x: 0, y: -80, z: 0 };

    msgBoxTipsNo = new BK.Text(style, "不想玩了");
    msgBoxTipsNo.zOrder = -999999999;
    msgBoxTipsNo.canUserInteract = true;
    msgBoxTipsNo.position = { x: 100, y: -80, z: 0 };
    msgBoxTips.addChild(msgBoxTipsYes);
    msgBoxTips.addChild(msgBoxTipsNo);

    var topTex = new BK.Texture("GameRes://resource/texture/direction_top.png");
    topBtn = new BK.Sprite(100, 100, topTex, 0, 0, 1, 1);
    topBtn.zOrder = -999999;
    topBtn.canUserInteract = true;
    topBtn.anchor = { x: 0.5, y: 0.5 };
    topBtn.position = { x: 150, y: 300, z: 0 };
    BK.Director.root.addChild(topBtn);

    var bottomTex = new BK.Texture("GameRes://resource/texture/direction_bottom.png");
    bottomBtn = new BK.Sprite(100, 100, bottomTex, 0, 0, 1, 1);
    bottomBtn.zOrder = -999999;
    bottomBtn.canUserInteract = true;
    bottomBtn.anchor = { x: 0.5, y: 0.5 };
    bottomBtn.position = { x: 150, y: 100, z: 0 };
    BK.Director.root.addChild(bottomBtn);

    var leftTex = new BK.Texture("GameRes://resource/texture/direction_left.png");
    leftBtn = new BK.Sprite(100, 100, leftTex, 1, 1, 1, 1);
    leftBtn.zOrder = -999999;
    leftBtn.canUserInteract = true;
    leftBtn.anchor = { x: 0.5, y: 0.5 };
    leftBtn.position = { x: 50, y: 200, z: 0 };
    BK.Director.root.addChild(leftBtn);

    var rightTex = new BK.Texture("GameRes://resource/texture/direction_right.png");
    rightBtn = new BK.Sprite(100, 100, rightTex, 1, 1, 1, 1);
    rightBtn.zOrder = -999999;
    rightBtn.canUserInteract = true;
    rightBtn.anchor = { x: 0.5, y: 0.5 };
    rightBtn.position = { x: 250, y: 200, z: 0 };
    BK.Director.root.addChild(rightBtn);

    var catchTex = new BK.Texture("GameRes://resource/texture/catch.png");
    catchBtn = new BK.Sprite(100, 100, catchTex, 0, 1, 1, 1);
    catchBtn.zOrder = -999999;
    catchBtn.canUserInteract = true;
    catchBtn.position = { x: 350, y: 300, z: 0 };
    BK.Director.root.addChild(catchBtn);


    UIEventHandler.addNodeEvent(resetBtn, UI_NODE_ENENT_TOUCH_BEGIN, onTouchDown);
    UIEventHandler.addNodeEvent(nextPlayerBtn, UI_NODE_ENENT_TOUCH_BEGIN, onTouchDown);
    UIEventHandler.addNodeEvent(startGameBtn, UI_NODE_ENENT_TOUCH_BEGIN, onTouchDown);
    UIEventHandler.addNodeEvent(leftBtn, UI_NODE_ENENT_TOUCH_BEGIN, onTouchDown);
    UIEventHandler.addNodeEvent(rightBtn, UI_NODE_ENENT_TOUCH_BEGIN, onTouchDown);
    UIEventHandler.addNodeEvent(topBtn, UI_NODE_ENENT_TOUCH_BEGIN, onTouchDown);
    UIEventHandler.addNodeEvent(bottomBtn, UI_NODE_ENENT_TOUCH_BEGIN, onTouchDown);
    UIEventHandler.addNodeEvent(catchBtn, UI_NODE_ENENT_TOUCH_BEGIN, onTouchDown);
    UIEventHandler.addNodeEvent(myOpenIdText, UI_NODE_ENENT_TOUCH_BEGIN, onTouchDown);
    UIEventHandler.addNodeEvent(msgBoxTipsNo, UI_NODE_ENENT_TOUCH_BEGIN, onTouchDown);
    UIEventHandler.addNodeEvent(msgBoxTipsYes, UI_NODE_ENENT_TOUCH_BEGIN, onTouchDown);
    UIEventHandler.addNodeEvent(leftBtn, UI_NODE_ENENT_TOUCH_END, onTouchUp);
    UIEventHandler.addNodeEvent(rightBtn, UI_NODE_ENENT_TOUCH_END, onTouchUp);
    UIEventHandler.addNodeEvent(topBtn, UI_NODE_ENENT_TOUCH_END, onTouchUp);
    UIEventHandler.addNodeEvent(bottomBtn, UI_NODE_ENENT_TOUCH_END, onTouchUp);
}
var roomSize = 0;
function enterRoom(callback) {
    BK.Script.log(1, 0, "catchToy!enterRoom, roomID = " + ROOM_ID + ", lvRoomID = " + LVROOM_ID + ", deviceID = " + DEVICE_ID);
    room.queryAndJoinRoom(GAME_ID, ROOM_ID, GameStatusInfo.openId, function (statusCode, room) {
        BK.Script.log(1, 0, "catchToy!join room callback, code = " + statusCode + ", room = " + JSON.stringify(room));
        if (statusCode != 0) {
            if (callback) {
                callback(-1);
            }
            return;
        }
        joinToyRoom(ROOM_ID, GameStatusInfo.openId);
        joinBKRoomSucc = true;

        var cfg = {
            sdkAppId: /*1400036169,*/1400042624,
            accountType: /*14180,*/17771,
            avRoomId: /*200011, */Number(LVROOM_ID),
            gameRoomId: Number(ROOM_ID)
        }

        BK.QQAVManager.initAndEnterRoom(cfg, function (errCode, cmd, data) {
            BK.Script.log(1, 0, "catchToy!enter video room, errcode = " + errCode + ", cmd = " + cmd + ", data = " + JSON.stringify(data));
            if (errCode != 0) {
                if (callback) {
                    callback(-1);
                }
                return;

            }
            joinAVRoomSucc = true;
            BK.QQAVManager.setRemoteVideo(true);
            if (callback) {
                callback(0);
            }
        });

        BK.QQAVManager.setEventCallbackConfig({
            eventEnterCallback: function (eventId, data) {
                roomSize = roomSize + 1;
                roomText.content = "当前房间人数: " + roomSize;
            },
            eventExitCallback: function (eventId, data) {
                roomSize = roomSize - 1;
                roomText.content = "当前房间人数: " + roomSize;
            },
            eventHasCameraVideoCallback: function (eventId, data) {
                BK.Script.log(1, 0, "catchToy!hasCameraVideo, data = " + JSON.stringify(data));
                for (var i = 0; i < data.userInfo.length; i++) {
                    var videoRender = null;
                    if (data.userInfo[i].openId) {
                        videoRender = getFreeVideoRender(data.userInfo[i].openId);
                    } else if (data.userInfo[i].identifier) {
                        videoRender = getFreeVideoRender(data.userInfo[i].identifier);
                    }
                }
            }
        });

        BK.Director.ticker.setInterval(function () {
            room.sendKeepAlive();
        }, 1000 * 3);
    });
    BK.Director.ticker.add(function (ts, dt) {
        room.updateSocket();
    });
}

function enterCatchToyGame(deviceID, roomID, lvRoomID) {
    ROOM_ID = roomID;
    LVROOM_ID = /*10078*/lvRoomID;
    DEVICE_ID = deviceID;
    removeGameUI();
    enterRoom(function (succ) {
        if (0 == succ) {
            BK.Script.log(1, 0, "catchToy!enterCatchToyGame, deviceID = " + deviceID + ", roomID = " + roomID + ", lvRoomID = " + lvRoomID);
            initRoomUI();
            /*BK.Director.ticker.setInterval(function () {
                getToyPlayUser(ROOM_ID, function (succ, userID) {
                    BK.Script.log(1, 0, "catchToy!getUserInfo, userID = " + userID + ", openId = " + GameStatusInfo.openId);
                    if (userID == GameStatusInfo.openId) {
                        canStartGame = true;
                    }
                });
            }, 1000 * 3)*/
        }
    });
}

var itemText;
function removeGameUI() {
    if (itemText) {
        for (var i = 0; i < itemText.length; i++) {
            BK.Director.root.removeChild(itemText[i]);
        }
    }
}

function initGameUI_RoomList(roomList) {
    function _onClickItemText(node) {
        for (var i = 0; i < roomList.length; i++) {
            if (roomList[i].deviceID == node.name) {
                //roomList[i].roomID = "382802698210190";
                //joinToyRoom(roomList[i].roomID, "");
                enterCatchToyGame(roomList[i].deviceID, Number(roomList[i].roomID), roomList[i].lvRoomID);
                break;
            }
        }
    }
    itemText = new Array(roomList.length);
    var height = designHeight;
    for (var i = 0; i < roomList.length; i++) {
        itemText[i] = new BK.Text(style2, JSON.stringify(roomList[i]));
        itemText[i].name = roomList[i].deviceID;
        itemText[i].zOrder = -99999999;
        itemText[i].canUserInteract = true;
        itemText[i].position = { x: 0, y: height - itemText[i].size.height - 100, z: 0 };
        BK.Script.log(1, 0, "catchToy!initGameUI_RoomList, width = " + itemText[i].width + ", height = " + height + ", " + itemText[i].size.height);
        BK.Director.root.addChild(itemText[i]);
        height = height - itemText[i].size.height - 100;
        UIEventHandler.addNodeEvent(itemText[i], UI_NODE_ENENT_TOUCH_BEGIN, _onClickItemText);
    }
}

function initGameUI() {
    closeBtn = new BK.Text(style, "关闭");
    closeBtn.zOrder = -999999;
    closeBtn.canUserInteract = true;
    closeBtn.position = { x: 30, y: designHeight - closeBtn.height - 30, z: 0 };
    BK.Script.log(1, 0, "catchToy!height = " + closeBtn.height);
    BK.Director.root.addChild(closeBtn);
    UIEventHandler.addNodeEvent(closeBtn, UI_NODE_ENENT_TOUCH_BEGIN, function () {
        if (joinBKRoomSucc == true) {
            leaveToyRoom(ROOM_ID, GameStatusInfo.openId, function (succ) {
                if (joinAVRoomSucc == true) {
                    BK.QQAVManager.__exitQAVRoom();
                }
                room.forceLeaveRoom(function () {
                    BK.QQ.notifyCloseGame();
                });
            });
        } else {
            BK.QQ.notifyCloseGame();
        }
    });

    roomListBtn = new BK.Text(style, "获取房间列表");
    roomListBtn.zOrder = -9999999;
    roomListBtn.canUserInteract = true;
    roomListBtn.position = { x: (designWidth - roomListBtn.width) / 2, y: (designHeight - roomListBtn.height) / 2, z: 0 };
    BK.Director.root.addChild(roomListBtn);
    BK.Script.log(1, 0, "catchToy!GameUI, width = " + roomListBtn.width);
    UIEventHandler.addNodeEvent(roomListBtn, UI_NODE_ENENT_TOUCH_BEGIN, function () {
        var httpget = new BK.HttpUtil("http://111.230.236.124:6811/debug/roomList");
        // 设置referer,cookie
        httpget.setHttpMethod("get")
        httpget.requestAsync(function (resp, code) {
            var respStr = resp.readAsString(true);
            BK.Script.log(1, 0, "catchToy!roomList, code = " + code + ", resp = " + respStr);
            if (code == 200) {
                var respObj = JSON.parse(respStr);
                initGameUI_RoomList(respObj);
                BK.Director.root.removeChild(roomListBtn);
            }
        });
    });
}

BK.Script.log(1, 0, "catchToy!GameStatusCfg = " + JSON.stringify(GameStatusInfo));
initGameUI();
if (GameStatusInfo.roomId && Number(GameStatusInfo.roomId) > 0) {
    getToyInfo(GameStatusInfo.roomId, function (succ, respData) {
        if (0 == succ) {
            BK.Director.root.removeChild(roomListBtn);
            enterCatchToyGame(respData.deviceID, Number(respData.roomID), respData.lvRoomID);
        }
    })
}
