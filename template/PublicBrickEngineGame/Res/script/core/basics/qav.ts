interface QQAVConfig {
  enableMic?: boolean,    //开启麦克风 默认true
  enableSpeaker?: boolean,//开启扬声器，默认true
  enableAudio?: boolean,  //开启音频，默认true
  enableVideo?: boolean,  //开启视频，默认true
  cameraPos?: number,     //0前置，1后置，默认1        enableVideo需为true
  enableLocalVideo?: boolean, //接受本地视频，默认true enableVideo需为true
  enableRemoteVideo?: boolean,//接受远程视频，默认true enableVideo需为true
  beauty?: number, //美颜功能， [0-9] 默认 0.         enableVideo需为true
  faceDetector?: boolean  //人脸检测。默认关闭         enableVideo需为true

}

interface QQAVRoomConfig {
  "sdkAppId": number,
  "accountType": number,
  "avRoomId": number,
  "gameRoomId": number,
  "avKey" ?: string,
  "selfOpenId"?: string,
  "avRoleName"?: string
}

const enum QQAVRoomEventID {
  QAV_EVENT_ID_NONE = 0, ///< 默认值，无意义。
  QAV_EVENT_ID_ENDPOINT_ENTER = 1, ///< 进入房间事件。
  QAV_EVENT_ID_ENDPOINT_EXIT = 2, ///< 退出房间事件。
  QAV_EVENT_ID_ENDPOINT_HAS_CAMERA_VIDEO = 3, ///< 有发摄像头视频事件。
  QAV_EVENT_ID_ENDPOINT_NO_CAMERA_VIDEO = 4, ///< 无发摄像头视频事件。
  QAV_EVENT_ID_ENDPOINT_HAS_AUDIO = 5, ///< 有发语音事件。
  QAV_EVENT_ID_ENDPOINT_NO_AUDIO = 6, ///< 无发语音事件。
  QAV_EVENT_ID_ENDPOINT_HAS_SCREEN_VIDEO = 7, ///< 有发屏幕视频事件。
  QAV_EVENT_ID_ENDPOINT_NO_SCREEN_VIDEO = 8, ///< 无发屏幕视频事件。
  QAV_EVENT_ID_ENDPOINT_HAS_MEDIA_FILE_VIDEO = 9, ///< 有发文件视频事件。
  QAV_EVENT_ID_ENDPOINT_NO_MEDIA_FILE_VIDEO = 10, ///< 无发文件视频事件。
  QAV_EVENT_ID_ENDPOINT_NEW_SPEAKING = 42,     //新成员说话
  QAV_EVENT_ID_ENDPOINT_OLD_STOP_SPEAKING = 43
}

interface QQAVRoomEventUserData {
  openId: string
}

interface QAVRoomEventData {
  eventId: QQAVRoomEventID,
  userInfo: Array<QQAVRoomEventUserData>
}


interface QQAVCallbackConfig {
  eventEnterCallback?: (evnetId: QQAVRoomEventID, data: any) => void,
  eventExitCallback?: (evnetId: QQAVRoomEventID, data: any) => void,
  eventHasCameraVideoCallback?: (evnetId: QQAVRoomEventID, data: any) => void,
  eventNoCameraVideoCallback?: (evnetId: QQAVRoomEventID, data: any) => void,
  eventHasAudioCallback?: (evnetId: QQAVRoomEventID, data: any) => void,
  eventNoAudioCallback?: (evnetId: QQAVRoomEventID, data: any) => void,
  eventHasScreenVideoCallback?: (evnetId: QQAVRoomEventID, data: any) => void,
  eventNoScreenVideoCallback?: (evnetId: QQAVRoomEventID, data: any) => void,
  eventHasMediaFileCallback?: (evnetId: QQAVRoomEventID, data: any) => void,
  eventNoMediaFileCallback?: (evnetId: QQAVRoomEventID, data: any) => void,
  eventNewSpeakCallback?: (evnetId: QQAVRoomEventID, data: any) => void,
  eventOldStopSpeakCallback?: (evnetId: QQAVRoomEventID, data: any) => void,
}
const enum QAVCategory {
  QAVCategoryRealTime = 0, //0代表实时场景
  QAVCategoryLive = 1,      //1代表主播模式
  QAVCategoryWatch = 2,     //2代表观看模式
  QAVCategoryHighQuality = 3 //3代表高音质模式
};
class QAV {
  public eventCallbackConfig: QQAVCallbackConfig;
  public qavCfg: any

  //是否已经初始化
  _hasInitFlag: boolean = false;
  _initData : any;
  _hasSuccEnter: boolean = false;

  //兼容ios下只能允许运行一次init的问题
  _iosHasInitFlag : boolean = false;

  _callbackQueue: Array<(errCode) => void>;

  avRoomId: number;
  avKey: string;
  gameRoomId: number;
  selfOpenId: string;
  avRoleName: string;

  _isFrontCamera: boolean = false;

  log(str) {
    BK.Script.log(0, 0, "QQAVManager:" + str);
  }
  errorLog(str) {
    BK.Script.log(1, 1, "QQAVManager Error:" + str);
  }

  constructor() {
    this._callbackQueue = [];
    //监听用户数据
    BK.MQQ.SsoRequest.addListener("cs.audioRoom_update_userinfo.local", this, this.__handleUserUpdate.bind(this));
  }

  ///Public///
  public setQAVCfg(cfg: any) {
    this.qavCfg = cfg;
  }

  public setUpdateUserInfoCallback(callback: (errCode: number, cmd: string, data: any) => void) {
    let cmd = "cs.audioRoom_update_userinfo.local";
    BK.MQQ.SsoRequest.removeListener(cmd,this);
    BK.MQQ.SsoRequest.addListener(cmd, this, callback);
  }

  public setEventCallbackConfig(callbackCfg: QQAVCallbackConfig) {
    this.eventCallbackConfig = callbackCfg;
  }

  public initQAV(cfg: QQAVConfig, callback: (errCode: number, cmd: string, data: any) => void) {
    this.setQAVCfg(cfg);
    this.__startQAVRoom(callback);
  }

  public setMic(sw: boolean, callback: (errCode: number, cmd: string, data: any) => void) {
    this.__enterQAVRoomIfNeed(function (err) {
      if (err == 0) {
        var data = {
          "switch": sw
        }
        var cmd = "cs.audioRoom_set_mic.local";
        BK.MQQ.SsoRequest.removeListener(cmd,this);
        BK.MQQ.SsoRequest.addListener(cmd, this, callback);
        BK.MQQ.SsoRequest.send(data, cmd);
      } else {
        this.errorLog("setMic failed!start qav room failed");
      }
    }.bind(this));
  }

  public setSpeaker(sw: boolean, callback: (errCode: number, cmd: string, data: any) => void) {
    this.__enterQAVRoomIfNeed(function (err) {
      if (err == 0) {
        var data = {
          "switch": sw
        }
        var cmd = "cs.audioRoom_set_speaker.local";
        BK.MQQ.SsoRequest.removeListener(cmd,this);
        BK.MQQ.SsoRequest.addListener(cmd, this, callback);
        BK.MQQ.SsoRequest.send(data, cmd);
      } else {
        this.errorLog("setSpeaker failed!start qav room failed");
      }
    }.bind(this));
  }

  public switchCamera(cameraPos: number, callback: (errCode: number, cmd: string, data: any) => void) {
    this.__enterQAVRoomIfNeed(function (err) {
      if (err == 0) {
        var data = {
          "cameraPos": cameraPos
        }
        let cmd = "cs.audioRoom_camera_switch.local";
        BK.MQQ.SsoRequest.removeListener(cmd,this);
        BK.MQQ.SsoRequest.addListener(cmd, this, function (errCode: number, cmd: string, data: any) {
          if (errCode == 0) {
            if (cameraPos == 0) {
              this._isFrontCamera = true;
            } else {
              this._isFrontCamera = false;
            }
          }
          callback(errCode, cmd, data);
        }.bind(this));

        BK.MQQ.SsoRequest.send(data, cmd);
      } else {
        this.errorLog("switchCamera failed!start qav room failed");
      }
    }.bind(this));
  }

  public enableCamera(enable: boolean, callback: (errCode: number, cmd: string, data: any) => void) {
    this.__enterQAVRoomIfNeed(function (err) {
      if (err == 0) {
        var data = {
          "switch": enable
        }
        let cmd = "cs.audioRoom_camera_enable.local";
        this._isFrontCamera = true;
        BK.MQQ.SsoRequest.removeListener(cmd,this);
        BK.MQQ.SsoRequest.addListener(cmd, this, callback);
        BK.MQQ.SsoRequest.send(data, cmd);
      } else {
        this.errorLog("enableCamera failed!start qav room failed");
      }
    }.bind(this));
  }

  public setBeauty(beauty: number) {
    this.__enterQAVRoomIfNeed(function (err) {
      if (err == 0) {
        var data = {
          "beauty": beauty
        }
        BK.MQQ.SsoRequest.send(data, "cs.audioRoom_set_beauty.local");
      } else {
        this.errorLog("setBeauty failed!start qav room failed");
      }
    }.bind(this));

  }

  //本地信号监听开关
  public setLocalVideo(sw: boolean) {
    this.__enterQAVRoomIfNeed(function (err) {
      if (err == 0) {
        var data = {
          "switch": sw
        }
        var cmd = "cs.audioRoom_set_local_video.local";
        BK.MQQ.SsoRequest.send(data, cmd);
      } else {
        this.errorLog("setLocalVideo failed!start qav room failed");
      }
    }.bind(this));

  }

  //监听远端某个人的信号
  public watchRemoteVideo(openIdList: Array<string>) {
    this.__enterQAVRoomIfNeed(function (err) {
      if (err == 0) {
        this.log("watchRemoteVideo ok1")
        var data = {
          "openIdList": openIdList
        }
        var cmd = "cs.audioRoom_watch_remote_video.local";
        BK.MQQ.SsoRequest.send(data, cmd);
        this.log("watchRemoteVideo ok2")
      } else {
        this.errorLog("watchRemoteVideo failed!start qav room failed");
      }
    }.bind(this));
  }

  //远端信号监听开关
  public setRemoteVideo(sw: boolean) {
    this.__enterQAVRoomIfNeed(function (err) {
      if (err == 0) {
        var data = {
          "switch": sw
        }
        var cmd = "cs.audioRoom_set_remote_video.local";
        BK.MQQ.SsoRequest.send(data, cmd);

      } else {
        this.errorLog("setMic failed!start qav room failed");
      }
    }.bind(this));
  }

  public exitRoom(callbck: (errCode: number, cmd: string, data: any) => void) {
    this._hasInitFlag = false;
    this.__exitQAVRoom(function (errCode: number, cmd: string, data: any) {
      this.log("exit qav room errCode:" + errCode);
      callbck(errCode, cmd, data);
    }.bind(this));
  }

  public getEndpointList(callback: (errCode: number, cmd: string, data: any) => void) {
    var data = {};
    var cmd = "cs.audioRoom_get_endpointList.local";
    if (callback) {
      BK.MQQ.SsoRequest.removeListener(cmd,this);
      BK.MQQ.SsoRequest.addListener(cmd, this, callback);
    }
    BK.MQQ.SsoRequest.send(data, cmd);
  }

  public isFrontCamera() {
    return this._isFrontCamera;
    // this.__exitQAVRoom(function (errCode: number, cmd: string, data: any) {
    //     var reqdata= {};
    //     var cmd = "cs.audioRoom_is_front_camera.local";
    //     if (callback) {
    //       BK.MQQ.SsoRequest.addListener(cmd, this, callback);
    //     }
    //     BK.MQQ.SsoRequest.send(reqdata, cmd);
    // }.bind(this));
  }

  public getFluidCtrlCfg(data: any, callback: (errCode: number, cmd: string, data: any) => void) {
    var cmd = "cs.audioRoom_get_fluid_ctrl_cfg.local"
    if (callback) {
      BK.MQQ.SsoRequest.removeListener(cmd,this);
      BK.MQQ.SsoRequest.addListener(cmd, this, callback);
    }
    BK.MQQ.SsoRequest.send(data, cmd);
  }

  public changeAudioCategory(category: QAVCategory, callback: (errCode: number, cmd: string, data: any) => void) {
    var cmd = "cs.audioRoom_change_audio_category.local";
    var data = {
      category: category
    };
    if (callback) {
      BK.MQQ.SsoRequest.removeListener(cmd,this);
      BK.MQQ.SsoRequest.addListener(cmd, this, callback);
    }
    BK.MQQ.SsoRequest.send(data, cmd);
  }

  public changeQAVRole(role: string, callback: (errCode: number, cmd: string, data: any) => void) {
    var cmd = "cs.audioRoom_change_qav_role.local";
    var data = {
      role: role
    }
    if (callback) {
      BK.MQQ.SsoRequest.removeListener(cmd,this);
      BK.MQQ.SsoRequest.addListener(cmd, this, callback);
    }
    BK.MQQ.SsoRequest.send(data, cmd);
  }

  ///Private///
  _hasStartQAVRoomFlag = false;
  private __enterQAVRoomIfNeed(callback: (errCode) => void) {
    if (!this._hasSuccEnter) {
      this.log("__enterQAVRoomIfNeed entering qav room.");
      this._callbackQueue.push(callback);
      //只启动一次
      if (this._hasStartQAVRoomFlag == false) {
        this._hasStartQAVRoomFlag = true;
        this.__startQAVRoom(function (errCode: number, cmd: string, data: any) {

          for (let index = 0; index < this._callbackQueue.length; index++) {
            const tmpCB = this._callbackQueue[index];
            tmpCB(errCode);
          }
          this._callbackQueue.splice(0, this._callbackQueue.length);
        }.bind(this));
      }
    } else {
      callback(0);
    }
  }

  private __initQAVRoom(cfg: QQAVRoomConfig, callback: (errCode: number, cmd: string, data: any) => void) {
    let cmd = "cs.audioRoom_init.local";

    ////ios下只初始化一次
    if (GameStatusInfo.platform == "ios" && this._iosHasInitFlag == true ) {
      this.log("ios init once ");
      callback(0, cmd, this._initData);
      return ;
    }
    ////
    if (this._hasInitFlag == true) {
      this.log("AVRoom has been init .can't init Room twice !!");
      return;
    }
    BK.MQQ.SsoRequest.removeListener(cmd,this);
    BK.MQQ.SsoRequest.addListener(cmd, this, function (errCode: number, cmd: string, data: any) {
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
  }

  private __enterQAVRoom(cfg: QQAVRoomConfig, callback: (errCode: number, cmd: string, data: any) => void) {
     
    var roomId: number = cfg.gameRoomId;
    var avRoomId: number =  cfg.avRoomId
    var avRoleName: string = cfg.avRoleName;
    var avKey : string = cfg.avKey;

    var data = {
      "avRoomId": avRoomId,
      "gameRoomId": roomId,
      "avRoleName": avRoleName,
      "avKey" : avKey
    }
    this.avRoomId = avRoomId;
    this.gameRoomId = roomId;
    this.avRoleName = avRoleName;

    let cmd = "cs.audioRoom_enter.local"
    BK.MQQ.SsoRequest.removeListener(cmd,this);
    BK.MQQ.SsoRequest.addListener(cmd, this, function (errCode: number, cmd: string, data: any) {
      this.log("cmd:" + cmd + " errCode:" + errCode + " data:" + JSON.stringify(data));
      callback(errCode, cmd, data);
    }.bind(this));
    BK.MQQ.SsoRequest.send(data, cmd);

    BK.MQQ.SsoRequest.removeListener("cs.close_room.local",this);
    BK.MQQ.SsoRequest.addListener("cs.close_room.local", this, function (errCode: number, cmd: string, data: any) {
      this.log("BK.QAVManager.closeGame!exitQAVRoom, avRoomId = " + this.avRoomId);
      this.__exitQAVRoom();
    }.bind(this));

    BK.MQQ.SsoRequest.removeListener("cs.audioRoom_req_audio_session.local",this);
    BK.MQQ.SsoRequest.addListener("cs.audioRoom_req_audio_session.local", this, function (errCode, cmd, data) {
      this.log("BK.QAVManager.reqAudioSession!result = " + JSON.stringify(data));
    }.bind(this));
  }

  private __exitQAVRoom(callback) {
    var data = {
      "avRoomId": this.avRoomId
    }
    let cmd = "cs.audioRoom_exit.local";

    BK.MQQ.SsoRequest.removeListener(cmd,this);
    BK.MQQ.SsoRequest.addListener(cmd, this, callback);
    BK.MQQ.SsoRequest.send(data, cmd);
  }

  private __checkGameStatusInfoParam() {
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
    var cfg: QQAVRoomConfig = {
      sdkAppId: GameStatusInfo.avAppId,
      accountType: GameStatusInfo.avAccountType,
      avRoomId: GameStatusInfo.avRoomId,
      gameRoomId: GameStatusInfo.roomId
    }
    return cfg;
  }

  private __addQAVCfg(cfg: any) {
    if (this.qavCfg) {
      for (const key in this.qavCfg) {
        if (this.qavCfg.hasOwnProperty(key)) {
          const element = this.qavCfg[key];
          cfg[key] = element;
        }
      }
    }
    return cfg;
  }

  private __startQAVRoom(callback: (errCode: number, cmd: string, data: any) => void) {
    //1.手Q环境
    if (!GameStatusInfo.devPlatform) {
      var cfg = this.__checkGameStatusInfoParam();
      //1.1先从gamestatusinfo里面取qavroom的数据
      if (cfg) {
        cfg = this.__addQAVCfg(cfg);
        this.initAndEnterRoom(cfg, function (errCode: number, cmd: string, data: any) {
          callback(errCode, cmd, data);
        }.bind(this));
      }
      //1.2.如果没有。则监听BK.QQ获取后台得到的AVRoomId等信息
      else {
        BK.QQ.addSSOJoinRoomCallBack(function (err: number, cmd: string, data: any) {
          if (data.gameRoomId &&
            data.avRoomId &&
            data.sdkAppId &&
            data.accountType) {

            data = this.__addQAVCfg(data);

            this.initAndEnterRoom(data, callback);
          } else {
            BK.Script.log(0, 0, "addSSOJoinRoomCallBack data is incorrect.");
          }
        }.bind(this));
      }
    }
    //2.开发环境
    else {
      var cfg: QQAVRoomConfig = {
        sdkAppId: 1400035750,
        accountType: 14181,
        avRoomId: 122333,
        gameRoomId: 54321,
        selfOpenId: GameStatusInfo.openId,
      }
      cfg = this.__addQAVCfg(cfg);
      this.initAndEnterRoom(cfg, callback);
    }
  }

  private initAndEnterRoom(cfg: QQAVRoomConfig, callback: (errCode: number, cmd: string, data: any) => void) {
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
    this.__initQAVRoom(cfg, function (initErrCode: number, initCmd: string, initData: any) {
      if (initErrCode == 0) {
        this.log("initAndEnterRoom step2 enterRoom");
        this.__enterQAVRoom(cfg, function (errCode: number, cmd: string, data: any) {
          if (errCode == 0) {
            this.log("initAndEnterRoom step2 enterRoom succ!");
            this._hasSuccEnter = true;
          } else {
            this._hasStartQAVRoomFlag = false;
          }
          callback(errCode, cmd, data);
        }.bind(this));
      } else {
        this.log("initAndEnterRoom failed cmd:" + initCmd + " errCode:" + initErrCode + " data:" + JSON.stringify(initData));
        this._hasStartQAVRoomFlag = false;
        callback(initErrCode, initCmd, initData);
      }
    }.bind(this));
  }

  private __handleUserUpdate(errCode: number, cmd: string, data: QAVRoomEventData) {
    if (data) {
      this.log("handleUserUpdate data:" + JSON.stringify(data));
      if (data.eventId == QQAVRoomEventID.QAV_EVENT_ID_ENDPOINT_ENTER) {
        this.log("进入房间事件:" + JSON.stringify(data.userInfo));
        if (this.eventCallbackConfig && this.eventCallbackConfig.eventEnterCallback) {
          this.eventCallbackConfig.eventEnterCallback(data.eventId, data);
        }
      } else if (data.eventId == QQAVRoomEventID.QAV_EVENT_ID_ENDPOINT_EXIT) {
        this.log("退出房间事件:" + JSON.stringify(data.userInfo));
        if (this.eventCallbackConfig && this.eventCallbackConfig.eventExitCallback) {
          this.eventCallbackConfig.eventExitCallback(data.eventId, data);
        }

      } else if (data.eventId == QQAVRoomEventID.QAV_EVENT_ID_ENDPOINT_HAS_CAMERA_VIDEO) {
        this.log("有发摄像头视频事件。:" + JSON.stringify(data.userInfo));
        if (this.eventCallbackConfig && this.eventCallbackConfig.eventHasCameraVideoCallback) {
          this.eventCallbackConfig.eventHasCameraVideoCallback(data.eventId, data);
        }

      } else if (data.eventId == QQAVRoomEventID.QAV_EVENT_ID_ENDPOINT_NO_CAMERA_VIDEO) {
        this.log("无发摄像头视频事件。:" + JSON.stringify(data.userInfo));
        if (this.eventCallbackConfig && this.eventCallbackConfig.eventNoCameraVideoCallback) {
          this.eventCallbackConfig.eventNoCameraVideoCallback(data.eventId, data);
        }

      } else if (data.eventId == QQAVRoomEventID.QAV_EVENT_ID_ENDPOINT_HAS_AUDIO) {
        this.log("有发语音事件。:" + JSON.stringify(data.userInfo));
        if (this.eventCallbackConfig && this.eventCallbackConfig.eventHasAudioCallback) {
          this.eventCallbackConfig.eventHasAudioCallback(data.eventId, data);
        }

      } else if (data.eventId == QQAVRoomEventID.QAV_EVENT_ID_ENDPOINT_NO_AUDIO) {
        this.log("无发语音事件。:" + JSON.stringify(data.userInfo));
        if (this.eventCallbackConfig && this.eventCallbackConfig.eventNoAudioCallback) {
          this.eventCallbackConfig.eventNoAudioCallback(data.eventId, data);
        }

      } else if (data.eventId == QQAVRoomEventID.QAV_EVENT_ID_ENDPOINT_HAS_SCREEN_VIDEO) {
        this.log("有发屏幕视频事件。:" + JSON.stringify(data.userInfo));

        if (this.eventCallbackConfig && this.eventCallbackConfig.eventHasScreenVideoCallback) {
          this.eventCallbackConfig.eventHasScreenVideoCallback(data.eventId, data);
        }

      } else if (data.eventId == QQAVRoomEventID.QAV_EVENT_ID_ENDPOINT_NO_SCREEN_VIDEO) {
        this.log("无发屏幕视频事件。:" + JSON.stringify(data.userInfo));
        if (this.eventCallbackConfig && this.eventCallbackConfig.eventNoScreenVideoCallback) {
          this.eventCallbackConfig.eventNoScreenVideoCallback(data.eventId, data);
        }

      } else if (data.eventId == QQAVRoomEventID.QAV_EVENT_ID_ENDPOINT_HAS_MEDIA_FILE_VIDEO) {
        this.log("有发文件视频事件。:" + JSON.stringify(data.userInfo));
        if (this.eventCallbackConfig && this.eventCallbackConfig.eventHasMediaFileCallback) {
          this.eventCallbackConfig.eventHasMediaFileCallback(data.eventId, data);
        }

      } else if (data.eventId == QQAVRoomEventID.QAV_EVENT_ID_ENDPOINT_NO_MEDIA_FILE_VIDEO) {
        this.log("无发文件视频事件。:" + JSON.stringify(data.userInfo));
        if (this.eventCallbackConfig && this.eventCallbackConfig.eventNoMediaFileCallback) {
          this.eventCallbackConfig.eventNoMediaFileCallback(data.eventId, data);
        }

      } else if (data.eventId == QQAVRoomEventID.QAV_EVENT_ID_ENDPOINT_NEW_SPEAKING) {
        this.log("新成员说话:" + JSON.stringify(data.userInfo));
        if (this.eventCallbackConfig && this.eventCallbackConfig.eventNewSpeakCallback) {
          this.eventCallbackConfig.eventNewSpeakCallback(data.eventId, data);
        }

      } else if (data.eventId == QQAVRoomEventID.QAV_EVENT_ID_ENDPOINT_OLD_STOP_SPEAKING) {
        this.log("旧成员停止说话:" + JSON.stringify(data.userInfo));
        if (this.eventCallbackConfig && this.eventCallbackConfig.eventOldStopSpeakCallback) {
          this.eventCallbackConfig.eventOldStopSpeakCallback(data.eventId, data);
        }
      }
    }
  }
}
if (!BK.QQAVManager) {
  BK.QQAVManager = new QAV();
}
