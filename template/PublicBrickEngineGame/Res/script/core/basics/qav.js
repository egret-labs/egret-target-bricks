/**
 * Brick引擎
 *
 * 音视频控制类
 */
(function (global, factory) {
    if (typeof global === 'object') {
        //暂时仅支持UMD。此处预留AMD与CMD能力
        // typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        // typeof define === 'function' && define.amd ? define(factory) :
        BK.QQAVManager = factory();
    }
}(BK, function () {
    ;
    var QAV = (function () {
        function QAV() {
            //是否已经初始化
            this._hasInitFlag = false;
            this._hasSuccEnter = false;
            //兼容ios下只能允许运行一次init的问题
            this._iosHasInitFlag = false;
            this._isFrontCamera = false;
            ///Private///
            this._hasStartQAVRoomFlag = false;
            this._callbackQueue = [];
            //监听用户数据
            BK.MQQ.SsoRequest.addListener("cs.audioRoom_disconnect.local", this, this.__handleRoomDisconnect.bind(this));
            BK.MQQ.SsoRequest.addListener("cs.audioRoom_update_userinfo.local", this, this.__handleUserUpdate.bind(this));
        }
        QAV.prototype.log = function (str) {
            BK.Script.log(0, 0, "QQAVManager:" + str);
        };
        QAV.prototype.errorLog = function (str) {
            BK.Script.log(1, 1, "QQAVManager Error:" + str);
        };
        ///Public///
        QAV.prototype.setQAVCfg = function (cfg) {
            this.qavCfg = cfg;
        };
        QAV.prototype.setUpdateUserInfoCallback = function (callback) {
            var cmd = "cs.audioRoom_update_userinfo.local";
            BK.MQQ.SsoRequest.removeListener(cmd, this);
            BK.MQQ.SsoRequest.addListener(cmd, this, callback);
        };
        QAV.prototype.setEventCallbackConfig = function (callbackCfg) {
            this.eventCallbackConfig = callbackCfg;
        };
        QAV.prototype.initQAV = function (cfg, callback) {
            this.setQAVCfg(cfg);
            this.__startQAVRoom(callback);
        };
        QAV.prototype.setMic = function (sw, callback) {
            this.__enterQAVRoomIfNeed(function (err) {
                if (err == 0) {
                    var data = {
                        "switch": sw
                    };
                    var cmd = "cs.audioRoom_set_mic.local";
                    BK.MQQ.SsoRequest.removeListener(cmd, this);
                    BK.MQQ.SsoRequest.addListener(cmd, this, callback);
                    BK.MQQ.SsoRequest.send(data, cmd);
                }
                else {
                    this.errorLog("setMic failed!start qav room failed");
                }
            }.bind(this));
        };
        QAV.prototype.setSpeaker = function (sw, callback) {
            this.__enterQAVRoomIfNeed(function (err) {
                if (err == 0) {
                    var data = {
                        "switch": sw
                    };
                    var cmd = "cs.audioRoom_set_speaker.local";
                    BK.MQQ.SsoRequest.removeListener(cmd, this);
                    BK.MQQ.SsoRequest.addListener(cmd, this, callback);
                    BK.MQQ.SsoRequest.send(data, cmd);
                }
                else {
                    this.errorLog("setSpeaker failed!start qav room failed");
                }
            }.bind(this));
        };
        QAV.prototype.switchCamera = function (cameraPos, callback) {
            this.__enterQAVRoomIfNeed(function (err) {
                if (err == 0) {
                    var data = {
                        "cameraPos": cameraPos
                    };
                    var cmd = "cs.audioRoom_camera_switch.local";
                    BK.MQQ.SsoRequest.removeListener(cmd, this);
                    BK.MQQ.SsoRequest.addListener(cmd, this, function (errCode, cmd, data) {
                        if (errCode == 0) {
                            if (cameraPos == 0) {
                                this._isFrontCamera = true;
                            }
                            else {
                                this._isFrontCamera = false;
                            }
                        }
                        callback(errCode, cmd, data);
                    }.bind(this));
                    BK.MQQ.SsoRequest.send(data, cmd);
                }
                else {
                    this.errorLog("switchCamera failed!start qav room failed");
                }
            }.bind(this));
        };
        QAV.prototype.enableCamera = function (enable, callback) {
            this.__enterQAVRoomIfNeed(function (err) {
                if (err == 0) {
                    var data = {
                        "switch": enable
                    };
                    var cmd = "cs.audioRoom_camera_enable.local";
                    this._isFrontCamera = true;
                    BK.MQQ.SsoRequest.removeListener(cmd, this);
                    BK.MQQ.SsoRequest.addListener(cmd, this, callback);
                    BK.MQQ.SsoRequest.send(data, cmd);
                }
                else {
                    this.errorLog("enableCamera failed!start qav room failed");
                }
            }.bind(this));
        };
        QAV.prototype.setBeauty = function (beauty) {
            this.__enterQAVRoomIfNeed(function (err) {
                if (err == 0) {
                    var data = {
                        "beauty": beauty
                    };
                    BK.MQQ.SsoRequest.send(data, "cs.audioRoom_set_beauty.local");
                }
                else {
                    this.errorLog("setBeauty failed!start qav room failed");
                }
            }.bind(this));
        };
        //本地信号监听开关
        QAV.prototype.setLocalVideo = function (sw) {
            this.__enterQAVRoomIfNeed(function (err) {
                if (err == 0) {
                    var data = {
                        "switch": sw
                    };
                    var cmd = "cs.audioRoom_set_local_video.local";
                    BK.MQQ.SsoRequest.send(data, cmd);
                }
                else {
                    this.errorLog("setLocalVideo failed!start qav room failed");
                }
            }.bind(this));
        };
        //监听远端某个人的信号
        QAV.prototype.watchRemoteVideo = function (openIdList) {
            this.__enterQAVRoomIfNeed(function (err) {
                if (err == 0) {
                    this.log("watchRemoteVideo ok1");
                    var data = {
                        "openIdList": openIdList
                    };
                    var cmd = "cs.audioRoom_watch_remote_video.local";
                    BK.MQQ.SsoRequest.send(data, cmd);
                    this.log("watchRemoteVideo ok2");
                }
                else {
                    this.errorLog("watchRemoteVideo failed!start qav room failed");
                }
            }.bind(this));
        };
        //远端信号监听开关
        QAV.prototype.setRemoteVideo = function (sw) {
            this.__enterQAVRoomIfNeed(function (err) {
                if (err == 0) {
                    var data = {
                        "switch": sw
                    };
                    var cmd = "cs.audioRoom_set_remote_video.local";
                    BK.MQQ.SsoRequest.send(data, cmd);
                }
                else {
                    this.errorLog("setMic failed!start qav room failed");
                }
            }.bind(this));
        };
        QAV.prototype.exitRoom = function (callbck) {
            this._hasInitFlag = false;
            this.__exitQAVRoom(function (errCode, cmd, data) {
                this.log("exit qav room errCode:" + errCode);
                callbck(errCode, cmd, data);
            }.bind(this));
        };
        QAV.prototype.getEndpointList = function (callback) {
            var data = {};
            var cmd = "cs.audioRoom_get_endpointList.local";
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        QAV.prototype.isFrontCamera = function () {
            return this._isFrontCamera;
            // this.__exitQAVRoom(function (errCode: number, cmd: string, data: any) {
            //     var reqdata= {};
            //     var cmd = "cs.audioRoom_is_front_camera.local";
            //     if (callback) {
            //       BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            //     }
            //     BK.MQQ.SsoRequest.send(reqdata, cmd);
            // }.bind(this));
        };
        QAV.prototype.getFluidCtrlCfg = function (data, callback) {
            var cmd = "cs.audioRoom_get_fluid_ctrl_cfg.local";
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        QAV.prototype.changeAudioCategory = function (category, callback) {
            var cmd = "cs.audioRoom_change_audio_category.local";
            var data = {
                category: category
            };
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        QAV.prototype.changeQAVRole = function (role, callback) {
            var cmd = "cs.audioRoom_change_qav_role.local";
            var data = {
                role: role
            };
            if (callback) {
                BK.MQQ.SsoRequest.removeListener(cmd, this);
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        QAV.prototype.__enterQAVRoomIfNeed = function (callback) {
            if (!this._hasSuccEnter) {
                this.log("__enterQAVRoomIfNeed entering qav room.");
                this._callbackQueue.push(callback);
                //只启动一次
                if (this._hasStartQAVRoomFlag == false) {
                    this._hasStartQAVRoomFlag = true;
                    this.__startQAVRoom(function (errCode, cmd, data) {
                        for (var index = 0; index < this._callbackQueue.length; index++) {
                            var tmpCB = this._callbackQueue[index];
                            tmpCB(errCode);
                        }
                        this._callbackQueue.splice(0, this._callbackQueue.length);
                    }.bind(this));
                }
            }
            else {
                callback(0);
            }
        };
        QAV.prototype.initQAVRoom = function (cfg, callback) {
            var cmd = "cs.audioRoom_init.local";
            ////ios下只初始化一次
            if (GameStatusInfo.platform == "ios" && this._iosHasInitFlag == true) {
                this.log("ios init once ");
                callback(0, cmd, this._initData);
                return;
            }
            ////
            if (this._hasInitFlag == true) {
                this.log("AVRoom has been init .can't init Room twice !!");
                return;
            }
            BK.MQQ.SsoRequest.removeListener(cmd, this);
            BK.MQQ.SsoRequest.addListener(cmd, this, function (errCode, cmd, data) {
                this.log("cmd:" + cmd + " errCode:" + errCode + " data:" + JSON.stringify(data));
                if (errCode == 0) {
                    this._hasInitFlag = true;
                    this._initData = data;
                    if (GameStatusInfo.platform == "ios") {
                        this._iosHasInitFlag = true;
                        this.log("_iosHasInitFlag");
                    }
                }
                callback(errCode, cmd, data);
            }.bind(this));
            BK.MQQ.SsoRequest.send(cfg, cmd);
        };
        QAV.prototype.enterQAVRoom = function (cfg, callback) {
            var roomId = cfg.gameRoomId;
            var avRoomId = cfg.avRoomId;
            var avRoleName = cfg.avRoleName;
            var avKey = cfg.avKey;
            var data = {
                "avRoomId": avRoomId,
                "gameRoomId": roomId,
                "avRoleName": avRoleName,
                "avKey": avKey
            };
            this.avRoomId = avRoomId;
            this.gameRoomId = roomId;
            this.avRoleName = avRoleName;
            var cmd = "cs.audioRoom_enter.local";
            BK.MQQ.SsoRequest.removeListener(cmd, this);
            BK.MQQ.SsoRequest.addListener(cmd, this, function (errCode, cmd, data) {
                this.log("cmd:" + cmd + " errCode:" + errCode + " data:" + JSON.stringify(data));
                callback(errCode, cmd, data);
            }.bind(this));
            BK.MQQ.SsoRequest.send(data, cmd);
            BK.MQQ.SsoRequest.removeListener("cs.close_room.local", this);
            BK.MQQ.SsoRequest.addListener("cs.close_room.local", this, function (errCode, cmd, data) {
                this.log("BK.QAVManager.closeGame!exitQAVRoom, avRoomId = " + this.avRoomId);
                this.__exitQAVRoom();
            }.bind(this));
            BK.MQQ.SsoRequest.removeListener("cs.audioRoom_req_audio_session.local", this);
            BK.MQQ.SsoRequest.addListener("cs.audioRoom_req_audio_session.local", this, function (errCode, cmd, data) {
                this.log("BK.QAVManager.reqAudioSession!result = " + JSON.stringify(data));
            }.bind(this));
        };
        QAV.prototype.__exitQAVRoom = function (callback) {
            var data = {
                "avRoomId": this.avRoomId
            };
            var cmd = "cs.audioRoom_exit.local";
            BK.MQQ.SsoRequest.removeListener(cmd, this);
            BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            BK.MQQ.SsoRequest.send(data, cmd);
        };
        QAV.prototype.__checkGameStatusInfoParam = function () {
            if (!GameStatusInfo.avAppId) {
                this.log("GameStatusInfo.avAppId is null");
                return null;
            }
            if (!GameStatusInfo.avAccountType) {
                this.log("GameStatusInfo.avAccountType is null");
                return null;
            }
            if (!GameStatusInfo.avRoomId) {
                this.log("GameStatusInfo.avRoomId is null");
                return null;
            }
            if (!GameStatusInfo.roomId) {
                this.log("GameStatusInfo.roomId is null");
                return null;
            }
            var cfg = {
                sdkAppId: GameStatusInfo.avAppId,
                accountType: GameStatusInfo.avAccountType,
                avRoomId: GameStatusInfo.avRoomId,
                gameRoomId: GameStatusInfo.roomId
            };
            return cfg;
        };
        QAV.prototype.__addQAVCfg = function (cfg) {
            if (this.qavCfg) {
                for (var key in this.qavCfg) {
                    if (this.qavCfg.hasOwnProperty(key)) {
                        var element = this.qavCfg[key];
                        cfg[key] = element;
                    }
                }
            }
            return cfg;
        };
        QAV.prototype.__startQAVRoom = function (callback) {
            //1.手Q环境
            if (!GameStatusInfo.devPlatform) {
                var cfg = this.__checkGameStatusInfoParam();
                //1.1先从gamestatusinfo里面取qavroom的数据
                if (cfg) {
                    cfg = this.__addQAVCfg(cfg);
                    this.initAndEnterRoom(cfg, function (errCode, cmd, data) {
                        callback(errCode, cmd, data);
                    }.bind(this));
                }
                else {
                    BK.QQ.addSSOJoinRoomCallBack(function (err, cmd, data) {
                        if (data.gameRoomId &&
                            data.avRoomId &&
                            data.sdkAppId &&
                            data.accountType) {
                            data = this.__addQAVCfg(data);
                            this.initAndEnterRoom(data, callback);
                        }
                        else {
                            BK.Script.log(0, 0, "addSSOJoinRoomCallBack data is incorrect.");
                        }
                    }.bind(this));
                }
            }
            else {
                var cfg = {
                    sdkAppId: 1400035750,
                    accountType: 14181,
                    avRoomId: 122333,
                    gameRoomId: 54321,
                    selfOpenId: GameStatusInfo.openId,
                };
                cfg = this.__addQAVCfg(cfg);
                this.initAndEnterRoom(cfg, callback);
            }
        };
        QAV.prototype.initAndEnterRoom = function (cfg, callback) {
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
            this.setQAVCfg(cfg);
            this.log("initAndEnterRoom step1 initRoom cfg:" + JSON.stringify(cfg));
            this.initQAVRoom(cfg, function (initErrCode, initCmd, initData) {
                if (initErrCode == 0) {
                    this.log("initAndEnterRoom step2 enterRoom");
                    this.enterQAVRoom(cfg, function (errCode, cmd, data) {
                        if (errCode == 0) {
                            this.log("initAndEnterRoom step2 enterRoom succ!");
                            this._hasSuccEnter = true;
                        }
                        else {
                            this._hasStartQAVRoomFlag = false;
                        }
                        callback(errCode, cmd, data);
                    }.bind(this));
                }
                else {
                    this.log("initAndEnterRoom failed cmd:" + initCmd + " errCode:" + initErrCode + " data:" + JSON.stringify(initData));
                    this._hasStartQAVRoomFlag = false;
                    callback(initErrCode, initCmd, initData);
                }
            }.bind(this));
        };
        QAV.prototype.__handleUserUpdate = function (errCode, cmd, data) {
            if (data) {
                this.log("handleUserUpdate data:" + JSON.stringify(data));
                if (data.eventId == 1 /* QAV_EVENT_ID_ENDPOINT_ENTER */) {
                    this.log("进入房间事件:" + JSON.stringify(data.userInfo));
                    if (this.eventCallbackConfig && this.eventCallbackConfig.eventEnterCallback) {
                        this.eventCallbackConfig.eventEnterCallback(data.eventId, data);
                    }
                }
                else if (data.eventId == 2 /* QAV_EVENT_ID_ENDPOINT_EXIT */) {
                    this.log("退出房间事件:" + JSON.stringify(data.userInfo));
                    if (this.eventCallbackConfig && this.eventCallbackConfig.eventExitCallback) {
                        this.eventCallbackConfig.eventExitCallback(data.eventId, data);
                    }
                }
                else if (data.eventId == 3 /* QAV_EVENT_ID_ENDPOINT_HAS_CAMERA_VIDEO */) {
                    this.log("有发摄像头视频事件。:" + JSON.stringify(data.userInfo));
                    if (this.eventCallbackConfig && this.eventCallbackConfig.eventHasCameraVideoCallback) {
                        this.eventCallbackConfig.eventHasCameraVideoCallback(data.eventId, data);
                    }
                }
                else if (data.eventId == 4 /* QAV_EVENT_ID_ENDPOINT_NO_CAMERA_VIDEO */) {
                    this.log("无发摄像头视频事件。:" + JSON.stringify(data.userInfo));
                    if (this.eventCallbackConfig && this.eventCallbackConfig.eventNoCameraVideoCallback) {
                        this.eventCallbackConfig.eventNoCameraVideoCallback(data.eventId, data);
                    }
                }
                else if (data.eventId == 5 /* QAV_EVENT_ID_ENDPOINT_HAS_AUDIO */) {
                    this.log("有发语音事件。:" + JSON.stringify(data.userInfo));
                    if (this.eventCallbackConfig && this.eventCallbackConfig.eventHasAudioCallback) {
                        this.eventCallbackConfig.eventHasAudioCallback(data.eventId, data);
                    }
                }
                else if (data.eventId == 6 /* QAV_EVENT_ID_ENDPOINT_NO_AUDIO */) {
                    this.log("无发语音事件。:" + JSON.stringify(data.userInfo));
                    if (this.eventCallbackConfig && this.eventCallbackConfig.eventNoAudioCallback) {
                        this.eventCallbackConfig.eventNoAudioCallback(data.eventId, data);
                    }
                }
                else if (data.eventId == 7 /* QAV_EVENT_ID_ENDPOINT_HAS_SCREEN_VIDEO */) {
                    this.log("有发屏幕视频事件。:" + JSON.stringify(data.userInfo));
                    if (this.eventCallbackConfig && this.eventCallbackConfig.eventHasScreenVideoCallback) {
                        this.eventCallbackConfig.eventHasScreenVideoCallback(data.eventId, data);
                    }
                }
                else if (data.eventId == 8 /* QAV_EVENT_ID_ENDPOINT_NO_SCREEN_VIDEO */) {
                    this.log("无发屏幕视频事件。:" + JSON.stringify(data.userInfo));
                    if (this.eventCallbackConfig && this.eventCallbackConfig.eventNoScreenVideoCallback) {
                        this.eventCallbackConfig.eventNoScreenVideoCallback(data.eventId, data);
                    }
                }
                else if (data.eventId == 9 /* QAV_EVENT_ID_ENDPOINT_HAS_MEDIA_FILE_VIDEO */) {
                    this.log("有发文件视频事件。:" + JSON.stringify(data.userInfo));
                    if (this.eventCallbackConfig && this.eventCallbackConfig.eventHasMediaFileCallback) {
                        this.eventCallbackConfig.eventHasMediaFileCallback(data.eventId, data);
                    }
                }
                else if (data.eventId == 10 /* QAV_EVENT_ID_ENDPOINT_NO_MEDIA_FILE_VIDEO */) {
                    this.log("无发文件视频事件。:" + JSON.stringify(data.userInfo));
                    if (this.eventCallbackConfig && this.eventCallbackConfig.eventNoMediaFileCallback) {
                        this.eventCallbackConfig.eventNoMediaFileCallback(data.eventId, data);
                    }
                }
                else if (data.eventId == 42 /* QAV_EVENT_ID_ENDPOINT_NEW_SPEAKING */) {
                    this.log("新成员说话:" + JSON.stringify(data.userInfo));
                    if (this.eventCallbackConfig && this.eventCallbackConfig.eventNewSpeakCallback) {
                        this.eventCallbackConfig.eventNewSpeakCallback(data.eventId, data);
                    }
                }
                else if (data.eventId == 43 /* QAV_EVENT_ID_ENDPOINT_OLD_STOP_SPEAKING */) {
                    this.log("旧成员停止说话:" + JSON.stringify(data.userInfo));
                    if (this.eventCallbackConfig && this.eventCallbackConfig.eventOldStopSpeakCallback) {
                        this.eventCallbackConfig.eventOldStopSpeakCallback(data.eventId, data);
                    }
                }
            }
        };
        QAV.prototype.__handleRoomDisconnect = function (errCode, cmd, data) {
            if (this.eventCallbackConfig && this.eventCallbackConfig.eventRoomDisconnectCallback) {
                this.eventCallbackConfig.eventRoomDisconnectCallback(data); // {reason: %d, errorInfo: %s}
            }
        };
        return QAV;
    }());
    return new QAV();
}));
