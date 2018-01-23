BK.Script.loadlib('GameRes://script/core/ui/button.js');
BK.Script.loadlib('GameRes://script/core/net/protocol.js');
BK.Script.loadlib('GameRes://script/core/basics/qav.js');
BK.Script.loadlib('GameRes:///script/core/net/room_manager.js');
BK.Script.loadlib("GameRes://script/core/basics/av.js");
var BKUIManager = (function () {
    function BKUIManager(options) {
        this.userTextArray = [];
        this.options = options;
        this._scaleRoot(options.designWidth, options.designHeight);
    }
    BKUIManager.prototype._scaleRoot = function (designWidth, designHeight) {
        var scaleX = BK.Director.screenPixelSize.width / designWidth;
        var scaleY = BK.Director.screenPixelSize.height / designHeight;
        BK.Director.root.scale = { x: scaleX, y: scaleY };
    };
    BKUIManager.prototype.updateInfomation = function (content) {
        if (this.infomationText) {
            this.infomationText.content = content;
        }
    };
    BKUIManager.prototype.initSelectRoomIdUI = function (selectCallback) {
        this.roomId = 0;
        this.roomIdSelectContainer = new BK.Node();
        var height = this.options.designWidth / 10;
        var width = this.options.designWidth / 10;
        for (var index = 0; index < 10; index++) {
            var textPath = "GameRes://resource/texture/number/" + index + ".png";
            var numBtn = new BK.Button(width, height, textPath, function (btn) {
                BK.Script.log(0, 0, "click! btn :" + btn.name);
                var selectNum = parseInt(btn.name);
                this.updateSelectText(selectNum);
            }.bind(this));
            numBtn.name = index.toString();
            numBtn.position = { x: width * index, y: height * 2 + 30 };
            this.roomIdSelectContainer.addChild(numBtn);
        }
        this.roomIdSelectContainer.name = "roomIdSelectContainer";
        this.roomIdSelectContainer.canUserInteract = true;
        BK.Director.root.addChild(this.roomIdSelectContainer);
        this.selectText = this.newText("roomId:");
        this.selectText.name = "selectText";
        this.selectText.position = { x: 0, y: 30 };
        this.roomIdSelectContainer.addChild(this.selectText);
        var confirmRoom = new BK.Button(200, 100, "GameRes://resource/texture/start_normal.png", function () {
            selectCallback(this.roomId);
        }.bind(this));
        confirmRoom.setPressTexturePath('GameRes://resource/texture/start_pressed.png.png');
        confirmRoom.position = { x: this.options.designWidth / 2.0, y: 0 };
        confirmRoom.anchor = { x: 0.5, y: 0.5 };
        this.roomIdSelectContainer.addChild(confirmRoom);
        this.roomIdSelectContainer.position = { x: 0, y: this.options.designHeight / 2.0 };
    };
    BKUIManager.prototype.initMasterJoinerSelectUI = function (selectCallback) {
        var masterBtn = new BK.Button(200, 200, "GameRes://resource/texture/master.png", function () {
            selectCallback(true);
        }.bind(this));
        masterBtn.position = { x: this.options.designWidth / 3.0, y: this.options.designHeight / 2.0 };
        masterBtn.anchor = { x: 0.5, y: 0.5 };
        BK.Director.root.addChild(masterBtn);
        //关闭房间
        var joinerBtn = new BK.Button(200, 200, "GameRes://resource/texture/joiner.png", function () {
            selectCallback(false);
        }.bind(this));
        joinerBtn.position = { x: this.options.designWidth * 2 / 3.0, y: this.options.designHeight / 2.0 };
        joinerBtn.anchor = { x: 0.5, y: 0.5 };
        BK.Director.root.addChild(joinerBtn);
    };
    BKUIManager.prototype.clearAllNode = function () {
        var children = BK.Director.root.children;
        for (var index = 0; index < children.length; index++) {
            var node = children[index];
            node.removeFromParent();
        }
    };
    BKUIManager.prototype.updateSelectText = function (selectNum) {
        this.roomId = this.roomId * 10 + selectNum;
        this.selectText.content = "roomId:" + this.roomId;
    };
    BKUIManager.prototype.initUI = function () {
        var infoStr = "";
        if (GameStatusInfo.isMaster == 1) {
            infoStr = "房主模式.点击开始创建房间";
        }
        else {
            infoStr = "参加者模式.点击开始加入房间";
        }
        this.infomationText = this.infoNewText(infoStr);
        this.infomationText.zOrder = -9999;
        BK.Director.root.addChild(this.infomationText);
        //隐藏按钮
        var hideBtn = new BK.Button(100, 100, "GameRes://resource/texture/hide.png", function () {
            BK.Script.log(0, 0, "hide click!");
            BK.QQ.notifyHideGame();
        });
        hideBtn.position = { x: 10, y: this.options.designHeight - 100 - 10 };
        //关闭按钮
        var closeBtn = new BK.Button(100, 100, "GameRes://resource/texture/close.png", function () {
            BK.Script.log(0, 0, "close click!");
            BK.QQ.notifyCloseGame();
        });
        closeBtn.position = { x: this.options.designWidth - 100 - 10, y: this.options.designHeight - 100 - 10 };
        //背景
        var backTex = new BK.Texture('GameRes://resource/texture/background.png');
        var background = new BK.Sprite(this.options.designWidth, this.options.designHeight, backTex, 0, 1, 1, 1);
        background.zOrder = 10000;
        BK.Director.root.addChild(background);
        closeBtn.zOrder = -9999;
        hideBtn.zOrder = -9999;
        BK.Director.root.addChild(hideBtn);
        BK.Director.root.addChild(closeBtn);
        var currY = this.options.designHeight - 200;
        var space1 = 100;
        var space2 = 50;
        currY = currY - space1;
        //扬声器开关
        var volumeText = this.newText("扬声器开关");
        volumeText.position = { x: 10, y: currY };
        volumeText.zOrder = -9999;
        BK.Director.root.addChild(volumeText);
        currY = currY - space2;
        var volumePlus = new BK.Button(100, 100, "GameRes://resource/texture/volume_off.png", function () {
            BK.Script.log(0, 0, "volumePlus click!");
            this.options.onSpeakerOff();
        }.bind(this));
        volumePlus.position = { x: 10, y: currY };
        volumePlus.zOrder = -9999;
        BK.Director.root.addChild(volumePlus);
        var volumeMinus = new BK.Button(100, 100, "GameRes://resource/texture/volume_on.png", function () {
            this.options.onSpeakerOn();
        }.bind(this));
        volumeMinus.position = { x: 150, y: currY };
        volumeMinus.zOrder = -999;
        BK.Director.root.addChild(volumeMinus);
        //麦克风
        currY = currY - space1;
        var micText = this.newText("麦克风开关");
        micText.position = { x: 10, y: currY };
        micText.zOrder = -9999;
        BK.Director.root.addChild(micText);
        currY = currY - space2;
        var micOff = new BK.Button(100, 100, "GameRes://resource/texture/mic_off.png", function () {
            BK.Script.log(0, 0, "onMicOff click!");
            this.options.onMicOff();
        }.bind(this));
        micOff.position = { x: 10, y: currY };
        micOff.zOrder = -9999;
        BK.Director.root.addChild(micOff);
        var micOn = new BK.Button(100, 100, "GameRes://resource/texture/mic_on.png", function () {
            BK.Script.log(0, 0, "onMicOn click!");
            this.options.onMicOn();
        }.bind(this));
        micOn.position = { x: 150, y: currY };
        micOn.zOrder = -999;
        BK.Director.root.addChild(micOn);
        //本地视频信号
        currY = currY - space1;
        var localVideoText = this.newText("本地视频信号");
        localVideoText.position = { x: 10, y: currY };
        localVideoText.zOrder = -9999;
        BK.Director.root.addChild(localVideoText);
        currY = currY - space2;
        var localOff = new BK.Button(100, 100, "GameRes://resource/texture/video_off.png", function () {
            BK.Script.log(0, 0, "localOff click!");
            this.options.onLocalOff();
        }.bind(this));
        localOff.position = { x: 10, y: currY };
        localOff.zOrder = -9999;
        BK.Director.root.addChild(localOff);
        var localOn = new BK.Button(100, 100, "GameRes://resource/texture/video_on.png", function () {
            BK.Script.log(0, 0, "localOn click!");
            this.options.onLocalOn();
        }.bind(this));
        localOn.position = { x: 150, y: currY };
        localOn.zOrder = -999;
        BK.Director.root.addChild(localOn);
        //
        currY = currY - space1;
        var switchText = this.newText("切换摄像头");
        switchText.position = { x: 10, y: currY };
        switchText.zOrder = -9999;
        BK.Director.root.addChild(switchText);
        currY = currY - space2;
        var switchBtn = new BK.Button(100, 100, "GameRes://resource/texture/switch.png", function () {
            BK.Script.log(0, 0, "switchBtn click!");
            this.options.onSwitchCamera();
        }.bind(this));
        switchBtn.position = { x: 10, y: currY };
        switchBtn.zOrder = -9999;
        BK.Director.root.addChild(switchBtn);
        ///远端视频信号
        currY = currY - space1;
        var remoteVideoText = this.newText("远端视频信号");
        remoteVideoText.position = { x: 10, y: currY };
        remoteVideoText.zOrder = -9999;
        BK.Director.root.addChild(remoteVideoText);
        currY = currY - space2;
        var remoteOff = new BK.Button(100, 100, "GameRes://resource/texture/video_off.png", function () {
            BK.Script.log(0, 0, "remoteOff click!");
            this.options.onRemoteOff();
        }.bind(this));
        remoteOff.position = { x: 10, y: currY };
        remoteOff.zOrder = -9999;
        BK.Director.root.addChild(remoteOff);
        var remoteOn = new BK.Button(100, 100, "GameRes://resource/texture/video_on.png", function () {
            BK.Script.log(0, 0, "remoteOn click!");
            this.options.onRemoteOn();
        }.bind(this));
        remoteOn.position = { x: 150, y: currY };
        remoteOn.zOrder = -999;
        BK.Director.root.addChild(remoteOn);
        // //美颜
        currY = currY - space1;
        var beautyText = this.newText("美颜");
        beautyText.position = { x: 10, y: currY };
        beautyText.zOrder = -9999;
        BK.Director.root.addChild(beautyText);
        currY = currY - space2;
        var beautyPlus = new BK.Button(100, 100, "GameRes://resource/texture/plus.png", function () {
            BK.Script.log(0, 0, "beautyPlus click!");
            // this.options.onRemoteOff();
            this.options.onBeautyPlus();
        }.bind(this));
        beautyPlus.position = { x: 10, y: currY };
        beautyPlus.zOrder = -9999;
        BK.Director.root.addChild(beautyPlus);
        var beautyMinus = new BK.Button(100, 100, "GameRes://resource/texture/minus.png", function () {
            BK.Script.log(0, 0, "beautyMinus click!");
            this.options.onBeautyMinus();
        }.bind(this));
        beautyMinus.position = { x: 150, y: currY };
        beautyMinus.zOrder = -999;
        BK.Director.root.addChild(beautyMinus);
        // beautyText.zOrder = -9999;
        // beauty.zOrder = -999;
        // BK.Director.root.addChild(beautyText);
        // BK.Director.root.addChild(beauty);
        //开始房间
        var startRoom = new BK.Button(200, 100, "GameRes://resource/texture/start_normal.png", function () {
            this.options.onStartRoom();
        }.bind(this));
        startRoom.setPressTexturePath('GameRes://resource/texture/start_pressed.png.png');
        startRoom.position = { x: this.options.designWidth - 200, y: this.options.designHeight / 2.0 };
        startRoom.anchor = { x: 0.5, y: 0.5 };
        BK.Director.root.addChild(startRoom);
        //关闭房间
        var closeRoom = new BK.Button(200, 100, "GameRes://resource/texture/rl_btn_close_normal.png", function () {
            this.options.onCloseRoom();
            1;
        }.bind(this));
        closeRoom.setPressTexturePath("GameRes://resource/texture/rl_btn_close_press.png");
        closeRoom.position = { x: this.options.designWidth - 200, y: this.options.designHeight / 2.0 - 150 };
        closeRoom.anchor = { x: 0.5, y: 0.5 };
        closeRoom.zOrder = -999;
        BK.Director.root.addChild(closeRoom);
    };
    BKUIManager.prototype.textStyle = function () {
        var style = {
            "fontSize": 40,
            "textColor": 0xFFFF0000,
            "maxWidth": 200,
            "maxHeight": 400,
            "width": this.options.designWidth,
            "height": 100,
            "textAlign": 0,
            "bold": 1,
            "italic": 0,
            "strokeColor": 0xFF000000,
            "strokeSize": 0,
            "shadowRadius": 0,
            "shadowDx": 0,
            "shadowDy": 0,
            "shadowColor": 0xFFFF0000
        };
        return style;
    };
    BKUIManager.prototype.newText = function (content) {
        return new BK.Text(this.textStyle(), content);
    };
    BKUIManager.prototype.infoTextStyle = function () {
        var style = {
            "fontSize": 20,
            "textColor": 0xFFFF0000,
            "maxWidth": 200,
            "maxHeight": 400,
            "width": this.options.designWidth,
            "height": 100,
            "textAlign": 0,
            "bold": 1,
            "italic": 0,
            "strokeColor": 0xFF000000,
            "strokeSize": 0,
            "shadowRadius": 0,
            "shadowDx": 0,
            "shadowDy": 0,
            "shadowColor": 0xFFFF0000
        };
        return style;
    };
    BKUIManager.prototype.infoNewText = function (content) {
        return new BK.Text(this.infoTextStyle(), content);
    };
    BKUIManager.prototype.userTextStyle = function () {
        var style = {
            "fontSize": 30,
            "textColor": 0xFFFF0000,
            "maxWidth": 200,
            "maxHeight": 400,
            "width": this.options.designWidth,
            "height": 100,
            "textAlign": 0,
            "bold": 1,
            "italic": 0,
            "strokeColor": 0xFF000000,
            "strokeSize": 0,
            "shadowRadius": 0,
            "shadowDx": 0,
            "shadowDy": 0,
            "shadowColor": 0xFFFF0000
        };
        return style;
    };
    BKUIManager.prototype.newUserText = function (content) {
        var tx = new BK.Text(this.userTextStyle(), content);
        return tx;
    };
    BKUIManager.prototype._isExistUserTextArray = function (openId) {
        for (var index = 0; index < this.userTextArray.length; index++) {
            var userText = this.userTextArray[index];
            if (userText.name == openId) {
                return true;
            }
        }
        return false;
    };
    BKUIManager.prototype.userTextWithOpenId = function (openId) {
        if (this._isExistUserTextArray(openId) == false) {
            var userTxt = this.newUserText("OpenId:" + openId);
            var y = 100 + 100 * this.userTextArray.length;
            userTxt.position = { x: this.options.designWidth / 4.0, y: y };
            userTxt.name = openId;
            BK.Director.root.addChild(userTxt);
            this.userTextArray.push(userTxt);
        }
        else {
            for (var index = 0; index < this.userTextArray.length; index++) {
                var userText = this.userTextArray[index];
                if (userText.name == openId) {
                    return userText;
                }
            }
        }
    };
    BKUIManager.prototype.serUserTextContent = function (openId, content) {
        var text = this.userTextWithOpenId(openId);
        if (text) {
            text.content = content;
        }
    };
    return BKUIManager;
}());
///////房间管理///////
///
var currPlayerOpenIds = [];
var otherViewCount = 0;
function addQAVView(openId) {
    var isExist = false;
    for (var index = 0; index < currPlayerOpenIds.length; index++) {
        var playerOpenId = currPlayerOpenIds[index];
        if (openId == playerOpenId) {
            isExist = true;
        }
    }
    if (isExist == false) {
        if (openId == GameStatusInfo.openId) {
            var avCamera = BK.AVCamera.start({
                identifier: "",
                width: uiManager.options.designWidth / 2.0,
                height: uiManager.options.designHeight / 2.0,
                scaleSample: 0.125,
                needFaceTracker: true,
                skipFaceTrackerNum: 3,
                //parent: nil, // 父亲节点，默认为root
                position: { x: uiManager.options.designWidth / 2.0, y: 0, z: 0 },
                onPrePreview: function (frameData) {
                    BK.Script.log(1, 0, "features = " + JSON.stringify(frameData.faceFeatures));
                }
            });
        }
        else {
            var pos = { x: 100, y: otherViewCount * 400 };
            var othersView = new QAVView(openId, 300, 300, true, undefined, pos, undefined);
            otherViewCount++;
        }
        currPlayerOpenIds.push(openId);
    }
}
///默认使用手Q debug配置
var env = 1 /* QQ_DEBUG */;
//开发平台下使用dev配置
if (GameStatusInfo.devPlatform) {
    env = 2 /* DEMO_DEV */;
}
var roomManager = new BKRoomManager({
    gameId: GameStatusInfo.gameId,
    openId: GameStatusInfo.openId,
    environment: env,
    onJoinRoom: function (statusCode, room) {
        BK.Script.log(0, 0, "onJoinRoom:");
        // BK.QQAVManager.setMic(true, function (errCode: number, cmd: string, data: any) {
        //     BK.Script.log(1, 1, "BK.QQAVManager.setMic errCode:"+errCode+" cmd:"+cmd+" data:"+JSON.stringify(data));
        // });
        // BK.QQAVManager.setSpeaker(true, function (errCode: number, cmd: string, data: any) {
        //     BK.Script.log(1, 1, "BK.QQAVManager.setSpeaker errCode:"+errCode+" cmd:"+cmd+" data:"+JSON.stringify(data));
        // });
        // BK.QQAVManager.setBeauty(8);
        // BK.QQAVManager.switchCamera(true,0, function (errCode: number, cmd: string, data: any) {
        //     BK.Script.log(1, 1, "BK.QQAVManager.switchCamera errCode:"+errCode+" cmd:"+cmd+" data:"+JSON.stringify(data));
        // });
        // BK.QQAVManager.setRemoteVideo(false)
        // BK.QQAVManager.setLocalVideo(true)
        for (var index = 0; index < room.currentPlayers.length; index++) {
            var player = room.currentPlayers[index];
            addQAVView(player.openId);
            uiManager.updateInfomation(player.openId + "加入厘米秀房间成功");
        }
    }
});
var cameraPos = 0;
var beauty = 0;
// iPhone 6 (750x1334) 的分辨率为标准进行缩放。
var uiManager = new BKUIManager({
    designWidth: 750,
    designHeight: 1334,
    onStartRoom: function () {
        BK.Script.log(0, 0, "onStartRoom");
        if (GameStatusInfo.isMaster == 1) {
            uiManager.updateInfomation("正在创建厘米秀房间");
            roomManager.masterCreateAndJoinRoom();
        }
        else {
            uiManager.updateInfomation("正在加入厘米秀房间");
            roomManager.guestJoinRoom(GameStatusInfo.roomId);
        }
    },
    onCloseRoom: function () {
        BK.Script.log(0, 0, "onCloseRoom");
        uiManager.updateInfomation("离开视频房间");
        BK.QQAVManager.exitRoom(function (err, cmd, data) {
            BK.Script.log(0, 0, "onCloseRoom error:" + err);
            uiManager.updateInfomation("离开视频房间成功");
        });
    },
    onSpeakerOn: function () {
        BK.Script.log(0, 0, "onSpeakerOn");
        uiManager.updateInfomation("正在打开扬声器");
        BK.QQAVManager.setSpeaker(true, function (err, cmd, data) {
            BK.Script.log(0, 0, "onSpeakerOn error:" + err);
            uiManager.updateInfomation("打开扬声器成功");
        });
    },
    onSpeakerOff: function () {
        BK.Script.log(0, 0, "onSpeakerOff");
        uiManager.updateInfomation("正在关闭扬声器");
        BK.QQAVManager.setSpeaker(false, function (err, cmd, data) {
            BK.Script.log(0, 0, "onSpeakerOn error:" + err);
            uiManager.updateInfomation("关闭扬声器成功");
        });
    },
    onMicOn: function () {
        uiManager.updateInfomation("正在打开麦克风");
        BK.QQAVManager.setMic(true, function (err, cmd, data) {
            BK.Script.log(0, 0, "setMic error:" + err);
            uiManager.updateInfomation("打开麦克风");
        });
    },
    onMicOff: function () {
        uiManager.updateInfomation("正在关闭麦克风");
        BK.QQAVManager.setMic(false, function (err, cmd, data) {
            BK.Script.log(0, 0, "setMic error:" + err);
            uiManager.updateInfomation("关闭麦克风成功");
        });
    },
    //本地信号
    onLocalOn: function () {
        BK.Script.log(0, 0, "onLocalOn");
        BK.QQAVManager.setLocalVideo(true);
    },
    onLocalOff: function () {
        BK.Script.log(0, 0, "onLocalOff");
        BK.QQAVManager.setLocalVideo(false);
    },
    //远程信号
    onRemoteOn: function () {
        BK.Script.log(0, 0, "onRemoteOn");
        BK.QQAVManager.setRemoteVideo(true);
    },
    onRemoteOff: function () {
        BK.Script.log(0, 0, "onRemoteOff");
        BK.QQAVManager.setRemoteVideo(false);
    },
    //切换摄像头
    onSwitchCamera: function () {
        BK.Script.log(0, 0, "onSwitchCamera");
        var tmpPos = cameraPos;
        if (tmpPos == 1) {
            tmpPos = 0;
        }
        else {
            tmpPos = 1;
        }
        cameraPos = tmpPos;
        BK.QQAVManager.switchCamera(true, tmpPos, function (err, cmd, data) {
            BK.Script.log(0, 0, "onSwitchCamera err:" + err);
        });
    },
    //美颜
    onBeautyPlus: function () {
        BK.Script.log(0, 0, "onBeautyPlus");
        beauty = beauty + 1;
        BK.QQAVManager.setBeauty(beauty);
    },
    onBeautyMinus: function () {
        BK.Script.log(0, 0, "onBeautyMinus");
        beauty = beauty - 1;
        BK.QQAVManager.setBeauty(beauty);
    }
});
uiManager.initUI();
