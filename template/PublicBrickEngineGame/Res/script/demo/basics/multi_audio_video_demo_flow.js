/**
 * Bricks 引擎
 *
 * 自主控制音视频房间流程模式
 *
 * 例子表现：多台设备运行此代码后，会加入相同的房间，能互相听到房间的内所有人说话
 */
BK.Script.loadlib('GameRes://script/core/basics/qav.js');
var cfg = {
    sdkAppId: 1400035750,
    accountType: 14181,
    avRoomId: 122333,
    gameRoomId: 54321,
    selfOpenId: GameStatusInfo.openId
};
BK.QQAVManager.initQAVRoom(cfg, function (initErrCode, initCmd, initData) {
    if (initErrCode == 0) {
        BK.Script.log(0, 0, "initQAVRoom init succed");
        BK.QQAVManager.enterQAVRoom(cfg, function (errCode, cmd, data) {
            if (errCode == 0) {
                BK.Script.log(0, 0, "initAndEnterRoom enterRoom succ!");
                //开启麦克风、扬声器等操作
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
            }
            else {
                BK.Script.log(0, 0, "initAndEnterRoom enterRoom failed!");
            }
        }.bind(this));
    }
    else {
        BK.Script.log(0, 0, "initQAVRoom failed cmd:" + initCmd + " errCode:" + initErrCode + " data:" + JSON.stringify(initData));
    }
}.bind(this));
