BK.Script.loadlib('GameRes://script/core/net/protocol.js');
BK.Script.loadlib('GameRes://script/core/basics/qav.js');
BK.Script.loadlib('GameRes://script/core/ui/button.js');
BK.Script.loadlib('GameRes:///script/core/net/room_manager.js');
BK.Script.loadlib("GameRes://script/core/basics/av.js");
//DEMO
//1启动BK.Room
///默认使用手Q debug配置
var env = 1 /* QQ_DEBUG */;
//开发平台下使用dev配置
if (GameStatusInfo.devPlatform) {
    env = 2 /* DEMO_DEV */;
}
///////房间管理///////
var roomManager = new BKRoomManager({
    gameId: GameStatusInfo.gameId,
    openId: GameStatusInfo.openId,
    environment: env,
    onJoinRoom: function (statusCode, room) {
        BK.Script.log(0, 0, "onJoinRoom:");
        //接受本地相机信号。true则可以显示相机信息
        BK.QQAVManager.setLocalVideo(true);
        //接受远端信号。true则可以接受他人视频信号
        BK.QQAVManager.setRemoteVideo(false);
        //麦克风
        BK.QQAVManager.setMic(true, function (errCode, cmd, data) {
            BK.Script.log(1, 1, "BK.QQAVManager.setMic errCode:" + errCode + " cmd:" + cmd + " data:" + JSON.stringify(data));
        });
        //扬声器
        BK.QQAVManager.setSpeaker(true, function (errCode, cmd, data) {
            if (errCode == 0) {
                BK.Script.log(0, 0, "enableCamera Succ");
            }
            else {
                BK.Script.log(0, 0, "enableCamera Failed");
            }
            BK.Script.log(1, 1, "BK.QQAVManager.setSpeaker errCode:" + errCode + " cmd:" + cmd + " data:" + JSON.stringify(data));
        });
        //启动相机
        BK.QQAVManager.enableCamera(true, function (err, cmd, data) {
            if (err == 0) {
                BK.Script.log(0, 0, "enableCamera Succ");
            }
            else {
                BK.Script.log(0, 0, "enableCamera Failed");
            }
        });
        //切换相机
        BK.QQAVManager.switchCamera(0, function (errCode, cmd, data) {
            BK.Script.log(1, 1, "BK.QQAVManager.switchCamera errCode:" + errCode + " cmd:" + cmd + " data:" + JSON.stringify(data));
        });
        //美颜
        BK.QQAVManager.setBeauty(8);
        //离开视频房间
        BK.QQAVManager.exitRoom(function (err, cmd, data) {
            BK.Script.log(0, 0, "onCloseRoom error:" + err);
            uiManager.updateInfomation("离开视频房间成功");
        });
    }
});
///UI
var normal = 'GameRes://resource/texture/rl_btn_confirm_normal.png';
var btn = new BK.Button(200, 100, normal, function (node) {
    if (GameStatusInfo.isMaster == 1) {
        roomManager.masterCreateAndJoinRoom();
    }
    else {
        roomManager.guestJoinRoom(GameStatusInfo.roomId);
    }
});
btn.position = { x: 100, y: 100 };
BK.Director.root.addChild(btn);
var avCamera = BK.AVCamera.start({
    identifier: "",
    width: 300,
    height: 300,
    scaleSample: 0.125,
    needFaceTracker: false,
    //parent: nil, // 父亲节点，默认为root
    position: { x: 300, y: 300, z: 0 },
    onPrePreview: function (frameData) {
        BK.Script.log(1, 0, "features = " + JSON.stringify(frameData.faceFeatures));
    }
});
