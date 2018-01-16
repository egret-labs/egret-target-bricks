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
        BK.Script.log(0, 0, "updateInfomation :" + content);
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
        this.infomationText.zOrder = -9999999;
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
        var backTex = new BK.Texture('GameRes://resource/texture/3px.png');
        var background = new BK.Sprite(this.options.designWidth, this.options.designHeight, backTex, 0, 1, 1, 1);
        background.zOrder = 10000;
        BK.Director.root.addChild(background);
        closeBtn.zOrder = -9999;
        hideBtn.zOrder = -9999;
        BK.Director.root.addChild(hideBtn);
        BK.Director.root.addChild(closeBtn);
        var currY = this.options.designHeight - 80;
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
        /**
        currY = currY - space1;
        var localVideoText = this.newText("本地视频信号");
        localVideoText.position = {x:10,y:currY};
        localVideoText.zOrder = -9999;
        BK.Director.root.addChild(localVideoText);
        
        currY = currY -space2;
        var localOff = new BK.Button(100,100,"GameRes://resource/texture/video_off.png",function () {
            BK.Script.log(0,0,"localOff click!");
            this.options.onLocalOff();
        }.bind(this));
        localOff.position = {x:10,y:currY}
        localOff.zOrder = -9999;
        BK.Director.root.addChild(localOff);
        var localOn = new BK.Button(100,100,"GameRes://resource/texture/video_on.png",function () {
            BK.Script.log(0,0,"localOn click!");
            this.options.onLocalOn();
        }.bind(this));
        localOn.position = {x:150,y:currY}
        localOn.zOrder = -999;
        BK.Director.root.addChild(localOn); */
        //摄像头开关
        currY = currY - space1;
        var cameraText = this.newText("摄像头开关");
        cameraText.position = { x: 10, y: currY };
        cameraText.zOrder = -9999;
        BK.Director.root.addChild(cameraText);
        currY = currY - space2;
        var cameraOff = new BK.Button(100, 100, "GameRes://resource/texture/camera_off.png", function () {
            BK.Script.log(0, 0, "cameraOff click!");
            this.options.onCameraOff();
        }.bind(this));
        cameraOff.position = { x: 10, y: currY };
        cameraOff.zOrder = -9999;
        BK.Director.root.addChild(cameraOff);
        var cameraOn = new BK.Button(100, 100, "GameRes://resource/texture/camera_on.png", function () {
            BK.Script.log(0, 0, "cameraOn click!");
            this.options.onCameraOn();
        }.bind(this));
        cameraOn.position = { x: 150, y: currY };
        cameraOn.zOrder = -999;
        BK.Director.root.addChild(cameraOn);
        //切换摄像头
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
        //获取房间内用户状态
        currY = currY - space1;
        var userInfoText = this.newText("用户状态");
        userInfoText.position = { x: 10, y: currY };
        userInfoText.zOrder = -9999;
        BK.Director.root.addChild(userInfoText);
        currY = currY - space2;
        var userInfoBtn = new BK.Button(100, 100, "GameRes://resource/texture/master.png", function () {
            BK.Script.log(0, 0, "userInfoBtn click!");
            this.options.onGetUserInfo();
        }.bind(this));
        userInfoBtn.position = { x: 10, y: currY };
        userInfoBtn.zOrder = -9999;
        BK.Director.root.addChild(userInfoBtn);
        ///第二列
        //模式
        // currY = this.options.designHeight - 200;
        // var column2X = this.options.designWidth/2.0;
        // var live_mode = new BK.Button(150,80,"GameRes://resource/texture/qav/live_mode.png",function () {
        //     BK.Script.log(0,0,"live_mode click!");
        //     this.options.onLiveMode();
        // }.bind(this));
        // live_mode.position = {x:column2X,y:currY}
        // live_mode.zOrder = -9999;
        // BK.Director.root.addChild(live_mode);
        // var realtime_mode = new BK.Button(150,80,"GameRes://resource/texture/qav/realtime_mode.png",function () {
        //     BK.Script.log(0,0,"realtime_mode click!");
        //     this.options.onRealTimeMode();
        // }.bind(this));
        // realtime_mode.position = {x:column2X+200,y:currY}
        // realtime_mode.zOrder = -9999;
        // BK.Director.root.addChild(realtime_mode);
        // //角色
        // currY = currY -space2*3;
        // var role_live_master = new BK.Button(150,80,"GameRes://resource/texture/qav/role_live_master.png",function () {
        //     BK.Script.log(0,0,"role_live_master click!");
        //     this.options.onLiveMaster();
        // }.bind(this));
        // role_live_master.position = {x:column2X,y:currY}
        // role_live_master.zOrder = -9999;
        // BK.Director.root.addChild(role_live_master);
        // currY = currY -space2*2;
        // var role_live_guest = new BK.Button(150,80,"GameRes://resource/texture/qav/role_live_guest.png",function () {
        //     BK.Script.log(0,0,"role_live_guest click!");
        //     this.options.onLiveGuest();
        // }.bind(this));
        // role_live_guest.position = {x:column2X,y:currY}
        // role_live_guest.zOrder = -9999;
        // BK.Director.root.addChild(role_live_guest);
        // currY = currY -space2*2;
        // var role_apollouser = new BK.Button(150,80,"GameRes://resource/texture/qav/role_apollouser.png",function () {
        //     BK.Script.log(0,0,"role_apollouser click!");
        //     this.options.onApollouser();
        // }.bind(this));
        // role_apollouser.position = {x:column2X,y:currY}
        // role_apollouser.zOrder = -9999;
        // BK.Director.root.addChild(role_apollouser);
        // beautyText.zOrder = -9999;
        // beauty.zOrder = -999;
        // BK.Director.root.addChild(beautyText);
        // BK.Director.root.addChild(beauty);
        //开始房间
        var startRoom = new BK.Button(200, 100, "GameRes://resource/texture/start_normal.png", function () {
            this.options.onStartRoom();
        }.bind(this));
        startRoom.setPressTexturePath('GameRes://resource/texture/start_pressed.png');
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
        currPlayerOpenIds.push(openId);
        if (openId == GameStatusInfo.openId) {
            BK.Script.log(1, 1, "添加本地信号view openID:" + openId);
            var avCamera = BK.AVCamera.start({
                identifier: "",
                width: uiManager.options.designWidth / 2.0,
                height: uiManager.options.designHeight / 2.0,
                scaleSample: 0.125,
                needFaceTracker: false,
                skipFaceTrackerNum: 60,
                //parent: nil, // 父亲节点，默认为root
                position: { x: uiManager.options.designWidth / 2.0, y: 0, z: 0 },
                onPrePreview: function (frameData) {
                    //BK.Script.log(1, 0, "features = " + JSON.stringify(frameData.faceFeatures));
                }
            });
        }
        else {
            BK.Script.log(1, 1, "添加远端信号view openID:" + openId);
            var height = 500;
            var width = height * 9 / 16;
            var pos = { x: 100, y: height * otherViewCount };
            var identifier = openId;
            ////////开发demo工程下，会将openid的最后5作为标识.手q环境下，依然用openid
            if (GameStatusInfo.devPlatform) {
                if (openId.length == 32) {
                    identifier = openId.substr(32 - 5, 5);
                    BK.Script.log(1, 0, "开发工程下 identifier= " + identifier);
                }
            }
            var othersView = new QAVView(identifier, width, height, true, undefined, pos, undefined);
            otherViewCount++;
        }
    }
}
///默认使用手Q debug配置
var env = 1 /* QQ_DEBUG */;
//开发平台下使用dev配置
if (GameStatusInfo.devPlatform) {
    env = 2 /* DEMO_DEV */;
}
// 
BK.QQAVManager.setQAVCfg({
    avRoleName: "white"
});
var roomManager = new BKRoomManager({
    gameId: GameStatusInfo.gameId,
    openId: GameStatusInfo.openId,
    environment: env,
    onJoinRoom: function (statusCode, room) {
        for (var index = 0; index < room.currentPlayers.length; index++) {
            var player = room.currentPlayers[index];
            BK.Script.log(0, 0, "onJoinRoom roomId:" + room.roomId + " openId:" + player.openId);
            addQAVView(player.openId);
            uiManager.updateInfomation(player.openId + "加入厘米秀房间成功");
            //如果是自己，开启心跳
            if (player.openId == GameStatusInfo.openId) {
                //心跳间隔5s
                roomManager.startHeartbeat(5 * 1000);
            }
        }
    }
});
var cameraPos = 0;
var beauty = 0;
var AudioCategory = 0; //模式 0实时
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
            if (err == 0) {
                uiManager.updateInfomation("离开视频房间 成功");
            }
            else {
                uiManager.updateInfomation("离开视频房间 失败");
            }
        });
    },
    onSpeakerOn: function () {
        BK.Script.log(0, 0, "onSpeakerOn");
        uiManager.updateInfomation("正在打开扬声器");
        BK.QQAVManager.setSpeaker(true, function (err, cmd, data) {
            BK.Script.log(0, 0, "onSpeakerOn error:" + err);
            if (err == 0) {
                uiManager.updateInfomation("打开扬声器 成功");
            }
            else {
                uiManager.updateInfomation("打开扬声器 失败");
            }
        });
    },
    onSpeakerOff: function () {
        BK.Script.log(0, 0, "onSpeakerOff");
        uiManager.updateInfomation("正在关闭扬声器");
        BK.QQAVManager.setSpeaker(false, function (err, cmd, data) {
            BK.Script.log(0, 0, "onSpeakerOn error:" + err);
            if (err == 0) {
                uiManager.updateInfomation("关闭扬声器 成功");
            }
            else {
                uiManager.updateInfomation("关闭扬声器 失败");
            }
        });
    },
    onMicOn: function () {
        uiManager.updateInfomation("正在打开麦克风");
        BK.QQAVManager.setMic(true, function (err, cmd, data) {
            BK.Script.log(0, 0, "setMic error:" + err);
            if (err == 0) {
                uiManager.updateInfomation("打开麦克风 成功");
            }
            else {
                uiManager.updateInfomation("打开麦克风 失败");
            }
        });
    },
    onMicOff: function () {
        uiManager.updateInfomation("正在关闭麦克风");
        BK.QQAVManager.setMic(false, function (err, cmd, data) {
            BK.Script.log(0, 0, "setMic error:" + err);
            if (err == 0) {
                uiManager.updateInfomation("关闭麦克风 成功");
            }
            else {
                uiManager.updateInfomation("关闭麦克风 失败");
            }
        });
    },
    //远程信号
    onRemoteOn: function () {
        BK.Script.log(0, 0, "onRemoteOn");
        BK.QQAVManager.setRemoteVideo(true);
        var openIdList = [];
        for (var index = 0; index < roomManager.room.currentPlayers.length; index++) {
            var player = roomManager.room.currentPlayers[index];
            openIdList.push(player.openId);
        }
        BK.QQAVManager.watchRemoteVideo(openIdList);
        uiManager.updateInfomation("远程信号 开启 成功");
    },
    onRemoteOff: function () {
        BK.Script.log(0, 0, "onRemoteOff");
        BK.QQAVManager.setRemoteVideo(false);
        uiManager.updateInfomation("远程信号 关闭 成功");
    },
    //切换摄像头
    onSwitchCamera: function () {
        BK.Script.log(0, 0, "onSwitchCamera");
        uiManager.updateInfomation("正在切换摄像头");
        var tmpPos = cameraPos;
        if (tmpPos == 1) {
            tmpPos = 0;
        }
        else {
            tmpPos = 1;
        }
        cameraPos = tmpPos;
        BK.QQAVManager.switchCamera(tmpPos, function (err, cmd, data) {
            BK.Script.log(0, 0, "onSwitchCamera err:" + err);
            if (tmpPos == 1) {
                uiManager.updateInfomation("切换摄像头 后置 成功");
            }
            else {
                uiManager.updateInfomation("切换摄像头 前置 成功");
            }
        }.bind(this));
    },
    //美颜
    onBeautyPlus: function () {
        BK.Script.log(0, 0, "onBeautyPlus");
        beauty = beauty + 1;
        BK.QQAVManager.setBeauty(beauty);
        uiManager.updateInfomation("增加美颜值:" + beauty);
    },
    onBeautyMinus: function () {
        BK.Script.log(0, 0, "onBeautyMinus");
        beauty = beauty - 1;
        BK.QQAVManager.setBeauty(beauty);
        uiManager.updateInfomation("减少美颜值:" + beauty);
    },
    //摄像头开关
    onCameraOn: function () {
        uiManager.updateInfomation("正在打开摄像头");
        BK.QQAVManager.enableCamera(true, function (err, cmd, data) {
            BK.Script.log(0, 0, "enableCamera true.err:" + err);
            if (err == 0) {
                uiManager.updateInfomation("打开摄像头 成功");
            }
            else {
                uiManager.updateInfomation("打开摄像头 失败");
            }
        });
    },
    onCameraOff: function () {
        uiManager.updateInfomation("正在关闭摄像头");
        BK.QQAVManager.enableCamera(false, function (err, cmd, data) {
            BK.Script.log(0, 0, "enableCamera false.err:" + err);
            if (err == 0) {
                uiManager.updateInfomation("关闭摄像头 成功");
            }
            else {
                uiManager.updateInfomation("关闭摄像头 失败");
            }
        });
    },
    onGetUserInfo: function () {
        // BK.QQAVManager.getEndpointList(function (err:number,cmd:string,data:any) {
        //     BK.Script.log(0,0,"getEndpointList false.err:"+err+" data:"+JSON.stringify(data));
        // });
        var idList = [];
        for (var index = 0; index < roomManager.room.currentPlayers.length; index++) {
            var player = roomManager.room.currentPlayers[index];
            idList.push(player.openId);
        }
        BK.QQAVManager.watchRemoteVideo(idList);
        var isFront = BK.QQAVManager.isFrontCamera();
        if (isFront /*boolean*/) {
            uiManager.updateInfomation("当前为前置摄像头");
        }
        else {
            uiManager.updateInfomation("当前为后置摄像头");
        }
    },
});
uiManager.initUI();
