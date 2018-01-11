interface RoomConfig {
  "sdkAppId" : number,
  "accountType" : number,
  "avRoomId": number,
  "gameRoomId":number
}

enum AVRoomEventID
{
  QAV_EVENT_ID_NONE                      = 0, ///< 默认值，无意义。
  QAV_EVENT_ID_ENDPOINT_ENTER            = 1, ///< 进入房间事件。
  QAV_EVENT_ID_ENDPOINT_EXIT             = 2, ///< 退出房间事件。
  QAV_EVENT_ID_ENDPOINT_HAS_CAMERA_VIDEO = 3, ///< 有发摄像头视频事件。
  QAV_EVENT_ID_ENDPOINT_NO_CAMERA_VIDEO  = 4, ///< 无发摄像头视频事件。
  QAV_EVENT_ID_ENDPOINT_HAS_AUDIO        = 5, ///< 有发语音事件。
  QAV_EVENT_ID_ENDPOINT_NO_AUDIO         = 6, ///< 无发语音事件。
  QAV_EVENT_ID_ENDPOINT_HAS_SCREEN_VIDEO = 7, ///< 有发屏幕视频事件。
  QAV_EVENT_ID_ENDPOINT_NO_SCREEN_VIDEO  = 8, ///< 无发屏幕视频事件。
  QAV_EVENT_ID_ENDPOINT_HAS_MEDIA_FILE_VIDEO = 9, ///< 有发文件视频事件。
  QAV_EVENT_ID_ENDPOINT_NO_MEDIA_FILE_VIDEO  = 10, ///< 无发文件视频事件。
  QAV_EVENT_ID_ENDPOINT_NEW_SPEAKING         = 42,     //新成员说话
  QAV_EVENT_ID_ENDPOINT_OLD_STOP_SPEAKING    = 43
}
interface AVRoomEventUserData
{
  openId:string
}
interface AVRoomEventData
{
  eventId:AVRoomEventID,
  userInfo:Array<AVRoomEventUserData>
}

interface AVRoomCallbackConfig{
  eventEnterCallback?:(evnetId:AVRoomEventID,data:any)=>void,
  eventExitCallback?:(evnetId:AVRoomEventID,data:any)=>void,
  eventHasCameraVideoCallback?:(evnetId:AVRoomEventID,data:any)=>void,
  eventNoCameraVideoCallback?:(evnetId:AVRoomEventID,data:any)=>void,
  eventHasAudioCallback?:(evnetId:AVRoomEventID,data:any)=>void,
  eventNoAudioCallback?:(evnetId:AVRoomEventID,data:any)=>void,
  eventHasScreenVideoCallback?:(evnetId:AVRoomEventID,data:any)=>void,
  eventNoScreenVideoCallback?:(evnetId:AVRoomEventID,data:any)=>void,
  eventHasMediaFileCallback?:(evnetId:AVRoomEventID,data:any)=>void,
  eventNoMediaFileCallback?:(evnetId:AVRoomEventID,data:any)=>void,
  eventNewSpeakCallback?:(evnetId:AVRoomEventID,data:any)=>void,
  eventOldStopSpeakCallback?:(evnetId:AVRoomEventID,data:any)=>void,
}

class AVRoomManager
{
  //是否已经初始化
  hasInit : boolean = false;
  eventCallbackConfig: AVRoomCallbackConfig;
  avRoomId:number;
  gameRoomId:number;

   log(str){
    BK.Script.log(0,0,"AVRoomManager:"+str);
  }

  constructor(){
      //监听用户数据
			BK.MQQ.SsoRequest.addListener("cs.audioRoom_update_userinfo.local", this, this.handleUserUpdate.bind(this));
  }

   initRoom(avAppId:number,avAccountType:number,callback:(errCode:number,cmd:string,data:any)=>void)
  {
    if (this.hasInit == true) {
      this.log("AVRoom has been init .can't init Room twice !!");
      return ;
    }
    var data = {
      "sdkAppId" : avAppId,
      "accountType" : avAccountType
    }
    let cmd = "cs.audioRoom_init.local";
    BK.MQQ.SsoRequest.addListener(cmd, this, function (errCode:number,cmd:string,data:any) {
        this.log("cmd:"+cmd+" errCode:"+errCode+" data:"+JSON.stringify(data));
        if (errCode == 0) {
          this.hasInit = true;
        }
        callback(errCode,cmd,data);
    }.bind(this));
    BK.MQQ.SsoRequest.send(data,cmd);
  }

   enterRoom(roomId:number,avRoomId:number,callback:(errCode:number,cmd:string,data:any)=>void)
  {
			var data = {
				"avRoomId": avRoomId,
				"gameRoomId":roomId
      }
      this.avRoomId = avRoomId;
      this.gameRoomId = roomId;

      let cmd = "cs.audioRoom_enter.local"
			BK.MQQ.SsoRequest.addListener(cmd, this, function (errCode:number,cmd:string,data:any) {
        this.log("cmd:"+cmd+" errCode:"+errCode+" data:"+JSON.stringify(data));
        callback(errCode,cmd,data);
      }.bind(this));
			BK.MQQ.SsoRequest.send(data,cmd);
  }

   exitRoom(callback)
  {
    var data = {
      "avRoomId" : this.avRoomId
    }
    let cmd = "cs.audioRoom_exit.local"
    BK.MQQ.SsoRequest.addListener(cmd, this, callback);
    BK.MQQ.SsoRequest.send(data,cmd);
  }

   setMic(sw,callback){
    var data = {
      "switch" : sw
    }
    var cmd = "cs.audioRoom_set_mic.local";
    BK.MQQ.SsoRequest.addListener(cmd, this, callback);
    BK.MQQ.SsoRequest.send(data,cmd);
  }

   setSpeaker(sw,callback){
    var data = {
      "switch" : sw
    }
    var cmd = "cs.audioRoom_set_speaker.local";
    BK.MQQ.SsoRequest.addListener(cmd, this, callback);
    BK.MQQ.SsoRequest.send(data,cmd);
  }

   switchCamera(cameraPos:number,callback)
  {
    var data= {
      cameraPos:cameraPos
    }
    let cmd = "cs.audioRoom_cameraswitch.local";
    BK.MQQ.SsoRequest.addListener(cmd, this, function (errCode:number,cmd:string,data:any) {
      this.log("cmd:"+cmd+" errCode:"+errCode+" data:"+JSON.stringify(data));
      callback(errCode,cmd,data);
    }.bind(this));

    BK.MQQ.SsoRequest.send(data,cmd);
  }

  setUpdateUserInfoCallback(callback:(errCode:number,cmd:string,data:any)=>void){
    BK.MQQ.SsoRequest.addListener("cs.audioRoom_update_userinfo.local", this, callback);
  }

  startAVRoom(environment:number,callback:(errCode:number,cmd:string,data:any)=>void){
    //0&1是手Q环境
    if (environment == 1 || environment ==0) {
      if (BK.QQ) {
        //监听BK.QQ获取后台得到的AVRoomId等信息
          BK.QQ.addSSOJoinRoomCallBack(function (err:number,cmd:string,data:any) {
            if (data.gameRoomId && 
                data.avRoomId &&
                data.sdkAppId &&
                data.accountType) {
                  this.initAndEnterRoom(data,callback);
            }else{
              BK.Script.log(0,0,"addSSOJoinRoomCallBack data is incorrect.");
            }
          }.bind(this));
      }
    }else if (environment == 2) {
        var cfg:RoomConfig ={
          sdkAppId:1400035750,
          accountType:14181,
          avRoomId   :122333,
          gameRoomId :54321
        }
        this.initAndEnterRoom(cfg,callback);
    }
  }

  initAndEnterRoom(cfg:RoomConfig,callback:(errCode:number,cmd:string,data:any)=>void){
    if (cfg.sdkAppId == undefined)   {
      this.log("initAndEnterRoom sdkAppId is null;");
      return ;  
    } 
    if (cfg.accountType== undefined) {
      this.log("initAndEnterRoom accountType is null;");
      return ;
    }
    if (cfg.avRoomId== undefined){
      this.log("initAndEnterRoom avRoomId is null;");
      return ;
    }
    if (cfg.gameRoomId== undefined) 
    { 
      this.log("initAndEnterRoom gameRoomId is null;");
      return ;
    }
    this.log("initAndEnterRoom step1 initRoom cfg:"+JSON.stringify(cfg));
    this.initRoom(cfg.sdkAppId,cfg.accountType,function (initErrCode:number,initCmd:string,initData:any) {
        if (initErrCode == 0) {
          this.log("initAndEnterRoom step2 enterRoom");
          this.enterRoom(cfg.gameRoomId,cfg.avRoomId,callback);
        }else{
          this.log("initAndEnterRoom failed cmd:"+initCmd+" errCode:"+initErrCode+" data:"+JSON.stringify(initData));
          callback(initErrCode,initCmd,initData);
        }
    }.bind(this));
  }

  handleUserUpdate(errCode:number,cmd:string,data:AVRoomEventData){
      if (data) {
        this.log("handleUserUpdate data:"+JSON.stringify(data));
        if (data.eventId == AVRoomEventID.QAV_EVENT_ID_ENDPOINT_ENTER) {
          this.log("进入房间事件:"+JSON.stringify(data.userInfo));
          if (this.eventCallbackConfig.eventEnterCallback) {
            this.eventCallbackConfig.eventEnterCallback(data.eventId,data);
          }

        }else if (data.eventId == AVRoomEventID.QAV_EVENT_ID_ENDPOINT_EXIT) {
          this.log("退出房间事件:"+JSON.stringify(data.userInfo));
          if (this.eventCallbackConfig.eventExitCallback) {
            this.eventCallbackConfig.eventExitCallback(data.eventId,data);
          }
          
        }else if (data.eventId == AVRoomEventID.QAV_EVENT_ID_ENDPOINT_HAS_CAMERA_VIDEO) {
          this.log("有发摄像头视频事件。:"+JSON.stringify(data.userInfo));
          if (this.eventCallbackConfig.eventHasCameraVideoCallback) {
            this.eventCallbackConfig.eventHasCameraVideoCallback(data.eventId,data);
          }
          
        }else if (data.eventId == AVRoomEventID.QAV_EVENT_ID_ENDPOINT_NO_CAMERA_VIDEO) {
          this.log("无发摄像头视频事件。:"+JSON.stringify(data.userInfo));
          if (this.eventCallbackConfig.eventNoCameraVideoCallback) {
            this.eventCallbackConfig.eventNoCameraVideoCallback(data.eventId,data);
          }
          
        }else if (data.eventId == AVRoomEventID.QAV_EVENT_ID_ENDPOINT_HAS_AUDIO) {
          this.log("有发语音事件。:"+JSON.stringify(data.userInfo));
          if (this.eventCallbackConfig.eventHasAudioCallback) {
            this.eventCallbackConfig.eventHasAudioCallback(data.eventId,data);
          }
          
        }else if (data.eventId == AVRoomEventID.QAV_EVENT_ID_ENDPOINT_NO_AUDIO) {
          this.log("无发语音事件。:"+JSON.stringify(data.userInfo));
          if (this.eventCallbackConfig.eventNoAudioCallback) {
            this.eventCallbackConfig.eventNoAudioCallback(data.eventId,data);
          }
          
        }else if (data.eventId == AVRoomEventID.QAV_EVENT_ID_ENDPOINT_HAS_SCREEN_VIDEO) {
          this.log("有发屏幕视频事件。:"+JSON.stringify(data.userInfo));

          if (this.eventCallbackConfig.eventHasScreenVideoCallback) {
            this.eventCallbackConfig.eventHasScreenVideoCallback(data.eventId,data);
          }
          
        }else if (data.eventId == AVRoomEventID.QAV_EVENT_ID_ENDPOINT_NO_SCREEN_VIDEO) {
          this.log("无发屏幕视频事件。:"+JSON.stringify(data.userInfo));
          if (this.eventCallbackConfig.eventNoScreenVideoCallback) {
            this.eventCallbackConfig.eventNoScreenVideoCallback(data.eventId,data);
          }
          
        }else if (data.eventId == AVRoomEventID.QAV_EVENT_ID_ENDPOINT_HAS_MEDIA_FILE_VIDEO) {
          this.log("有发文件视频事件。:"+JSON.stringify(data.userInfo));
          if (this.eventCallbackConfig.eventHasMediaFileCallback) {
            this.eventCallbackConfig.eventHasMediaFileCallback(data.eventId,data);
          }
          
        }else if (data.eventId == AVRoomEventID.QAV_EVENT_ID_ENDPOINT_NO_MEDIA_FILE_VIDEO) {
          this.log("无发文件视频事件。:"+JSON.stringify(data.userInfo));
          if (this.eventCallbackConfig.eventNoMediaFileCallback) {
            this.eventCallbackConfig.eventNoMediaFileCallback(data.eventId,data);
          }
          
        }else if (data.eventId == AVRoomEventID.QAV_EVENT_ID_ENDPOINT_NEW_SPEAKING) {
          this.log("新成员说话:"+JSON.stringify(data.userInfo));
          if (this.eventCallbackConfig.eventNewSpeakCallback) {
            this.eventCallbackConfig.eventNewSpeakCallback(data.eventId,data);
          }
          
        }else if (data.eventId == AVRoomEventID.QAV_EVENT_ID_ENDPOINT_OLD_STOP_SPEAKING) {
          this.log("旧成员停止说话:"+JSON.stringify(data.userInfo));
          if (this.eventCallbackConfig.eventOldStopSpeakCallback) {
            this.eventCallbackConfig.eventOldStopSpeakCallback(data.eventId,data);
          }
        }
      }
  }

  setEventCallbackConfig(callbackCfg:AVRoomCallbackConfig)
  {
    this.eventCallbackConfig = callbackCfg;
  }
  
}
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