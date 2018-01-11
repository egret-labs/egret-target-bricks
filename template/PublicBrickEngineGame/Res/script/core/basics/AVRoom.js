var AVRoomEventID;
(function (AVRoomEventID) {
    AVRoomEventID[AVRoomEventID["QAV_EVENT_ID_NONE"] = 0] = "QAV_EVENT_ID_NONE";
    AVRoomEventID[AVRoomEventID["QAV_EVENT_ID_ENDPOINT_ENTER"] = 1] = "QAV_EVENT_ID_ENDPOINT_ENTER";
    AVRoomEventID[AVRoomEventID["QAV_EVENT_ID_ENDPOINT_EXIT"] = 2] = "QAV_EVENT_ID_ENDPOINT_EXIT";
    AVRoomEventID[AVRoomEventID["QAV_EVENT_ID_ENDPOINT_HAS_CAMERA_VIDEO"] = 3] = "QAV_EVENT_ID_ENDPOINT_HAS_CAMERA_VIDEO";
    AVRoomEventID[AVRoomEventID["QAV_EVENT_ID_ENDPOINT_NO_CAMERA_VIDEO"] = 4] = "QAV_EVENT_ID_ENDPOINT_NO_CAMERA_VIDEO";
    AVRoomEventID[AVRoomEventID["QAV_EVENT_ID_ENDPOINT_HAS_AUDIO"] = 5] = "QAV_EVENT_ID_ENDPOINT_HAS_AUDIO";
    AVRoomEventID[AVRoomEventID["QAV_EVENT_ID_ENDPOINT_NO_AUDIO"] = 6] = "QAV_EVENT_ID_ENDPOINT_NO_AUDIO";
    AVRoomEventID[AVRoomEventID["QAV_EVENT_ID_ENDPOINT_HAS_SCREEN_VIDEO"] = 7] = "QAV_EVENT_ID_ENDPOINT_HAS_SCREEN_VIDEO";
    AVRoomEventID[AVRoomEventID["QAV_EVENT_ID_ENDPOINT_NO_SCREEN_VIDEO"] = 8] = "QAV_EVENT_ID_ENDPOINT_NO_SCREEN_VIDEO";
    AVRoomEventID[AVRoomEventID["QAV_EVENT_ID_ENDPOINT_HAS_MEDIA_FILE_VIDEO"] = 9] = "QAV_EVENT_ID_ENDPOINT_HAS_MEDIA_FILE_VIDEO";
    AVRoomEventID[AVRoomEventID["QAV_EVENT_ID_ENDPOINT_NO_MEDIA_FILE_VIDEO"] = 10] = "QAV_EVENT_ID_ENDPOINT_NO_MEDIA_FILE_VIDEO";
    AVRoomEventID[AVRoomEventID["QAV_EVENT_ID_ENDPOINT_NEW_SPEAKING"] = 42] = "QAV_EVENT_ID_ENDPOINT_NEW_SPEAKING";
    AVRoomEventID[AVRoomEventID["QAV_EVENT_ID_ENDPOINT_OLD_STOP_SPEAKING"] = 43] = "QAV_EVENT_ID_ENDPOINT_OLD_STOP_SPEAKING";
})(AVRoomEventID || (AVRoomEventID = {}));
var AVRoomManager = (function () {
    function AVRoomManager() {
        //是否已经初始化
        this.hasInit = false;
        //监听用户数据
        BK.MQQ.SsoRequest.addListener("cs.audioRoom_update_userinfo.local", this, this.handleUserUpdate.bind(this));
    }
    AVRoomManager.prototype.log = function (str) {
        BK.Script.log(0, 0, "AVRoomManager:" + str);
    };
    AVRoomManager.prototype.initRoom = function (avAppId, avAccountType, callback) {
        if (this.hasInit == true) {
            this.log("AVRoom has been init .can't init Room twice !!");
            return;
        }
        var data = {
            "sdkAppId": avAppId,
            "accountType": avAccountType
        };
        var cmd = "cs.audioRoom_init.local";
        BK.MQQ.SsoRequest.addListener(cmd, this, function (errCode, cmd, data) {
            this.log("cmd:" + cmd + " errCode:" + errCode + " data:" + JSON.stringify(data));
            if (errCode == 0) {
                this.hasInit = true;
            }
            callback(errCode, cmd, data);
        }.bind(this));
        BK.MQQ.SsoRequest.send(data, cmd);
    };
    AVRoomManager.prototype.enterRoom = function (roomId, avRoomId, callback) {
        var data = {
            "avRoomId": avRoomId,
            "gameRoomId": roomId
        };
        this.avRoomId = avRoomId;
        this.gameRoomId = roomId;
        var cmd = "cs.audioRoom_enter.local";
        BK.MQQ.SsoRequest.addListener(cmd, this, function (errCode, cmd, data) {
            this.log("cmd:" + cmd + " errCode:" + errCode + " data:" + JSON.stringify(data));
            callback(errCode, cmd, data);
        }.bind(this));
        BK.MQQ.SsoRequest.send(data, cmd);
    };
    AVRoomManager.prototype.exitRoom = function (callback) {
        var data = {
            "avRoomId": this.avRoomId
        };
        var cmd = "cs.audioRoom_exit.local";
        BK.MQQ.SsoRequest.addListener(cmd, this, callback);
        BK.MQQ.SsoRequest.send(data, cmd);
    };
    AVRoomManager.prototype.setMic = function (sw, callback) {
        var data = {
            "switch": sw
        };
        var cmd = "cs.audioRoom_set_mic.local";
        BK.MQQ.SsoRequest.addListener(cmd, this, callback);
        BK.MQQ.SsoRequest.send(data, cmd);
    };
    AVRoomManager.prototype.setSpeaker = function (sw, callback) {
        var data = {
            "switch": sw
        };
        var cmd = "cs.audioRoom_set_speaker.local";
        BK.MQQ.SsoRequest.addListener(cmd, this, callback);
        BK.MQQ.SsoRequest.send(data, cmd);
    };
    AVRoomManager.prototype.switchCamera = function (cameraPos, callback) {
        var data = {
            cameraPos: cameraPos
        };
        var cmd = "cs.audioRoom_cameraswitch.local";
        BK.MQQ.SsoRequest.addListener(cmd, this, function (errCode, cmd, data) {
            this.log("cmd:" + cmd + " errCode:" + errCode + " data:" + JSON.stringify(data));
            callback(errCode, cmd, data);
        }.bind(this));
        BK.MQQ.SsoRequest.send(data, cmd);
    };
    AVRoomManager.prototype.setUpdateUserInfoCallback = function (callback) {
        BK.MQQ.SsoRequest.addListener("cs.audioRoom_update_userinfo.local", this, callback);
    };
    AVRoomManager.prototype.startAVRoom = function (environment, callback) {
        //0&1是手Q环境
        if (environment == 1 || environment == 0) {
            if (BK.QQ) {
                //监听BK.QQ获取后台得到的AVRoomId等信息
                BK.QQ.addSSOJoinRoomCallBack(function (err, cmd, data) {
                    if (data.gameRoomId &&
                        data.avRoomId &&
                        data.sdkAppId &&
                        data.accountType) {
                        this.initAndEnterRoom(data, callback);
                    }
                    else {
                        BK.Script.log(0, 0, "addSSOJoinRoomCallBack data is incorrect.");
                    }
                }.bind(this));
            }
        }
        else if (environment == 2) {
            var cfg = {
                sdkAppId: 1400035750,
                accountType: 14181,
                avRoomId: 122333,
                gameRoomId: 54321
            };
            this.initAndEnterRoom(cfg, callback);
        }
    };
    AVRoomManager.prototype.initAndEnterRoom = function (cfg, callback) {
        if (cfg.sdkAppId == undefined) {
            this.log("initAndEnterRoom sdkAppId is null;");
            return;
        }
        if (cfg.accountType == undefined) {
            this.log("initAndEnterRoom accountType is null;");
            return;
        }
        if (cfg.avRoomId == undefined) {
            this.log("initAndEnterRoom avRoomId is null;");
            return;
        }
        if (cfg.gameRoomId == undefined) {
            this.log("initAndEnterRoom gameRoomId is null;");
            return;
        }
        this.log("initAndEnterRoom step1 initRoom cfg:" + JSON.stringify(cfg));
        this.initRoom(cfg.sdkAppId, cfg.accountType, function (initErrCode, initCmd, initData) {
            if (initErrCode == 0) {
                this.log("initAndEnterRoom step2 enterRoom");
                this.enterRoom(cfg.gameRoomId, cfg.avRoomId, callback);
            }
            else {
                this.log("initAndEnterRoom failed cmd:" + initCmd + " errCode:" + initErrCode + " data:" + JSON.stringify(initData));
                callback(initErrCode, initCmd, initData);
            }
        }.bind(this));
    };
    AVRoomManager.prototype.handleUserUpdate = function (errCode, cmd, data) {
        if (data) {
            this.log("handleUserUpdate data:" + JSON.stringify(data));
            if (data.eventId == AVRoomEventID.QAV_EVENT_ID_ENDPOINT_ENTER) {
                this.log("进入房间事件:" + JSON.stringify(data.userInfo));
                if (this.eventCallbackConfig.eventEnterCallback) {
                    this.eventCallbackConfig.eventEnterCallback(data.eventId, data);
                }
            }
            else if (data.eventId == AVRoomEventID.QAV_EVENT_ID_ENDPOINT_EXIT) {
                this.log("退出房间事件:" + JSON.stringify(data.userInfo));
                if (this.eventCallbackConfig.eventExitCallback) {
                    this.eventCallbackConfig.eventExitCallback(data.eventId, data);
                }
            }
            else if (data.eventId == AVRoomEventID.QAV_EVENT_ID_ENDPOINT_HAS_CAMERA_VIDEO) {
                this.log("有发摄像头视频事件。:" + JSON.stringify(data.userInfo));
                if (this.eventCallbackConfig.eventHasCameraVideoCallback) {
                    this.eventCallbackConfig.eventHasCameraVideoCallback(data.eventId, data);
                }
            }
            else if (data.eventId == AVRoomEventID.QAV_EVENT_ID_ENDPOINT_NO_CAMERA_VIDEO) {
                this.log("无发摄像头视频事件。:" + JSON.stringify(data.userInfo));
                if (this.eventCallbackConfig.eventNoCameraVideoCallback) {
                    this.eventCallbackConfig.eventNoCameraVideoCallback(data.eventId, data);
                }
            }
            else if (data.eventId == AVRoomEventID.QAV_EVENT_ID_ENDPOINT_HAS_AUDIO) {
                this.log("有发语音事件。:" + JSON.stringify(data.userInfo));
                if (this.eventCallbackConfig.eventHasAudioCallback) {
                    this.eventCallbackConfig.eventHasAudioCallback(data.eventId, data);
                }
            }
            else if (data.eventId == AVRoomEventID.QAV_EVENT_ID_ENDPOINT_NO_AUDIO) {
                this.log("无发语音事件。:" + JSON.stringify(data.userInfo));
                if (this.eventCallbackConfig.eventNoAudioCallback) {
                    this.eventCallbackConfig.eventNoAudioCallback(data.eventId, data);
                }
            }
            else if (data.eventId == AVRoomEventID.QAV_EVENT_ID_ENDPOINT_HAS_SCREEN_VIDEO) {
                this.log("有发屏幕视频事件。:" + JSON.stringify(data.userInfo));
                if (this.eventCallbackConfig.eventHasScreenVideoCallback) {
                    this.eventCallbackConfig.eventHasScreenVideoCallback(data.eventId, data);
                }
            }
            else if (data.eventId == AVRoomEventID.QAV_EVENT_ID_ENDPOINT_NO_SCREEN_VIDEO) {
                this.log("无发屏幕视频事件。:" + JSON.stringify(data.userInfo));
                if (this.eventCallbackConfig.eventNoScreenVideoCallback) {
                    this.eventCallbackConfig.eventNoScreenVideoCallback(data.eventId, data);
                }
            }
            else if (data.eventId == AVRoomEventID.QAV_EVENT_ID_ENDPOINT_HAS_MEDIA_FILE_VIDEO) {
                this.log("有发文件视频事件。:" + JSON.stringify(data.userInfo));
                if (this.eventCallbackConfig.eventHasMediaFileCallback) {
                    this.eventCallbackConfig.eventHasMediaFileCallback(data.eventId, data);
                }
            }
            else if (data.eventId == AVRoomEventID.QAV_EVENT_ID_ENDPOINT_NO_MEDIA_FILE_VIDEO) {
                this.log("无发文件视频事件。:" + JSON.stringify(data.userInfo));
                if (this.eventCallbackConfig.eventNoMediaFileCallback) {
                    this.eventCallbackConfig.eventNoMediaFileCallback(data.eventId, data);
                }
            }
            else if (data.eventId == AVRoomEventID.QAV_EVENT_ID_ENDPOINT_NEW_SPEAKING) {
                this.log("新成员说话:" + JSON.stringify(data.userInfo));
                if (this.eventCallbackConfig.eventNewSpeakCallback) {
                    this.eventCallbackConfig.eventNewSpeakCallback(data.eventId, data);
                }
            }
            else if (data.eventId == AVRoomEventID.QAV_EVENT_ID_ENDPOINT_OLD_STOP_SPEAKING) {
                this.log("旧成员停止说话:" + JSON.stringify(data.userInfo));
                if (this.eventCallbackConfig.eventOldStopSpeakCallback) {
                    this.eventCallbackConfig.eventOldStopSpeakCallback(data.eventId, data);
                }
            }
        }
    };
    AVRoomManager.prototype.setEventCallbackConfig = function (callbackCfg) {
        this.eventCallbackConfig = callbackCfg;
    };
    return AVRoomManager;
}());
BK.AVRoomManager = new AVRoomManager();
// var BKAVRoomManager = new AVRoomManager();
//DEMO
// BK.AVRoomManager.initAndEnterRoom( 
//    {
//      "sdkAppId" : 1400035750,
//      "accountType" : 14181,
//      "avRoomId": 123,
//      "gameRoomId":54321
//     },
//     function (errCode,cmd,data) {
//       BK.Script.log(0,0,"BKAVRoomManager.initAndEnterRoom");
//   }); 
