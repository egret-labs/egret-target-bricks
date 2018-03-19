// BK.Script.loadlib('GameRes://script/core/ui/button.js');
// BK.Script.loadlib('GameRes://script/core/net/protocol.js');
// BK.Script.loadlib("GameRes://script/core/basics/av.js");
// BK.Script.loadlib("GameRes://script/core/basics/AVRoom.js");

// enum BKRoomEnvironment {
//     QQ_RELEASE = 0,
//     QQ_DEBUG   = 1,
//     DEMO_DEV   = 2
// }

// interface BKRoomManagerOption
// {
//     gameId:number,
//     openId:string,
//     environment?:BKRoomEnvironment,
//     onJoinRoom?:(statusCode:number,room:BK.Room)=>void,
//     onStartGame?:(err:number,cmd:string,data:any)=>void,
//     onExitRoom?:(err:number,cmd:string,data:any)=>void,
//     onLeaveRoom?:(err:number,cmd:string,data:any)=>void,
//     onReceiveBroadCastData?:(err:number,cmd:string,data:any)=>void,
//     onReceiveSyncData?:(err:number,cmd:string,data:any)=>void,
//     onSendBroadCastCallback?:(err:number,cmd:string,data:any)=>void,
//     onSendSyncCallback?:(err:number,cmd:string,data:any)=>void,
// }

// class BKRoomManager
// {
//     openId:string;
//     room:BK.Room;

//     options:BKRoomManagerOption;

//     constructor(option:BKRoomManagerOption)
//     {
//         this.options = option;
//         this.room = new BK.Room();
        
//         BK.Director.ticker.add(function(ts,duration){
//             this.room.updateSocket();
//         }.bind(this));

//         if (option.environment) {
//             this.room.environment = option.environment;
//         }
//     }

//     log(str)
//     {
//         BK.Script.log(0,0,"BKRoomManager:"+str);
//     }

//     masterCreateAndJoinRoomWithFixRoomId(fixRoomId:number)
//     {
//         if (this.options.environment && this.options.environment == BKRoomEnvironment.DEMO_DEV) {

//         }else{
//             this.log("Create with fix room failed!.BK.Room.environment is not "+BKRoomEnvironment.DEMO_DEV);
//         }
//     }

//     masterCreateAndJoinRoom()
//     {
//         this.room.createAndJoinRoom(this.options.gameId,this.options.openId,this._enterAndJoinRoomCallback.bind(this));
//     }

//     guestJoinRoom(roomId:number)
//     {
//         this.room.queryAndJoinRoom(this.options.gameId,roomId,this.options.openId,this._enterAndJoinRoomCallback.bind(this));
//     }

//     sendBroadcastData(data:BK.Buffer){

//     }

//     sendFrameSyncData(data:BK.Buffer,itemData:BK.Buffer)
//     {

//     }
//     ///callback functions
//     _enterAndJoinRoomCallback(statusCode,room)
//     {
//         if (this.options.onJoinRoom) {
//             this.options.onJoinRoom(statusCode,room)
//         }
//     }
// }

// interface BKUIManagerOptions
// {
//     designWidth :number,
//     designHeight:number,
//     onSpeakerOff?:()=>void,
//     onSpeakerOn?:()=>void,
//     onMicOff?:()=>void,
//     onMicOn?:()=>void,
//     onBeauty?:()=>void,
//     onStartRoom?:()=>void,
//     onCloseRoom?:()=>void,
//     onSwitchCamera?:()=>void,
// }
// class BKUIManager
// {
//     options:BKUIManagerOptions;
//     infomationText:BK.Text;

//     constructor(options:BKUIManagerOptions)
//     {
//         this.options = options;
//         this._scaleRoot(options.designWidth,options.designHeight);
//     }
//     _scaleRoot(designWidth:number,designHeight:number)
//     {
//         var scaleX = BK.Director.screenPixelSize.width / designWidth;
//         var scaleY = BK.Director.screenPixelSize.height / designHeight;
//         BK.Director.root.scale = {x:scaleX,y:scaleY};
//     }
//     updateInfomation(content:string){
//       if (this.infomationText) {
//         this.infomationText.content = content;
//       }
//     }
//     initUI()
//     {
//         var infoStr = ""
//         if (GameStatusInfo.isMaster == 1) {
//             infoStr = "房主模式.点击开始创建房间";
//         }else{
//             infoStr = "参加者模式.点击开始加入房间";
//         }
//         this.infomationText = this.infoNewText(infoStr);
//         this.infomationText.zOrder = -9999;
//         BK.Director.root.addChild(this.infomationText);

//         //隐藏按钮
//         var hideBtn = new BK.Button(100,100,"GameRes://resource/texture/hide.png",function () {
//                                 BK.Script.log(0,0,"hide click!");
//                                 BK.QQ.notifyHideGame();
//                             });
//         hideBtn.position = {x:10,y:this.options.designHeight-100-10}

//         //关闭按钮
//         var closeBtn = new BK.Button(100,100,"GameRes://resource/texture/close.png",function () {
//                                 BK.Script.log(0,0,"close click!");
//                                 BK.QQ.notifyCloseGame();
//                             });
//         closeBtn.position = {x:this.options.designWidth-100-10,y:this.options.designHeight-100-10}

//         //背景
//         var backTex  =new BK.Texture('GameRes://resource/texture/background.png');  
//         var background =new BK.Sprite(this.options.designWidth,this.options.designHeight,backTex,0,1,1,1);
//         background.zOrder = 10000;
//         BK.Director.root.addChild(background);
        
//         closeBtn.zOrder = -9999;
//         hideBtn.zOrder = -9999;
//         BK.Director.root.addChild(hideBtn);
//         BK.Director.root.addChild(closeBtn);

//         var volumeText = this.newText("声音");
//         volumeText.position = {x:10,y:this.options.designHeight-400}; 
        
//         volumeText.zOrder = -9999;
//         BK.Director.root.addChild(volumeText);
        
//         var volumePlus = new BK.Button(100,100,"GameRes://resource/texture/volume_off.png",function () {
//             BK.Script.log(0,0,"volumePlus click!");
//             this.options.onSpeakerOff();
//         }.bind(this));
//         volumePlus.position = {x:10,y:this.options.designHeight-400-100}
//         volumePlus.zOrder = -9999;
//         BK.Director.root.addChild(volumePlus);

//         var volumeMinus = new BK.Button(100,100,"GameRes://resource/texture/volume_on.png",function () {
//           this.options.onSpeakerOn();
//         }.bind(this));
//         volumeMinus.position = {x:150,y:this.options.designHeight-400-100}
//         volumeMinus.zOrder = -999;
//         BK.Director.root.addChild(volumeMinus);

//         //扬声器
//         var micText = this.newText("扬声器");
//         micText.position = {x:10,y:this.options.designHeight-700}; 
        
//         micText.zOrder = -9999;
//         BK.Director.root.addChild(micText);
        
//         var micOff = new BK.Button(100,100,"GameRes://resource/texture/mic_off.png",function () {
//             BK.Script.log(0,0,"onMicOff click!");
//             this.options.onMicOff();
//         }.bind(this));
//         micOff.position = {x:10,y:this.options.designHeight-700-100}
//         micOff.zOrder = -9999;
//         BK.Director.root.addChild(micOff);

//         var micOn = new BK.Button(100,100,"GameRes://resource/texture/mic_on.png",function () {
//             BK.Script.log(0,0,"onMicOn click!");
//             this.options.onMicOn();
//         }.bind(this));
//         micOn.position = {x:150,y:this.options.designHeight-700-100}
//         micOn.zOrder = -999;
//         BK.Director.root.addChild(micOn);

//         //美颜
//         // var beauty = new BK.Button(100,100,"GameRes://resource/texture/beauty.png",function () {
//         //   this.options.onBeauty();
//         // }.bind(this));
//         // var beautyText = this.newText("美颜");
//         // beautyText.position = {x:10,y:this.options.designHeight-600};
//         // beauty.position = {x:10,y:this.options.designHeight-700};
  
//         // beautyText.zOrder = -9999;
//         // beauty.zOrder = -999;
//         // BK.Director.root.addChild(beautyText);
//         // BK.Director.root.addChild(beauty);
        
//         //开始房间
//         var startRoom = new BK.Button(200,100,"GameRes://resource/texture/start_normal.png",function () {
//           this.options.onStartRoom();
//         }.bind(this));
//         startRoom.setPressTexturePath('GameRes://resource/texture/start_pressed.png.png');
//         startRoom.position = {x:this.options.designWidth/2.0,y:this.options.designHeight/2.0};
//         startRoom.anchor = {x:0.5,y:0.5};
//         BK.Director.root.addChild(startRoom);

//         //关闭房间
//         var closeRoom = new BK.Button(200,100,"GameRes://resource/texture/rl_btn_close_normal.png",function () {
//             this.options.onCloseRoom();
//         }.bind(this));
//         closeRoom.setPressTexturePath("GameRes://resource/texture/rl_btn_close_press.png");
//         closeRoom.position = {x:this.options.designWidth/2.0,y:this.options.designHeight/2.0-150};
//         closeRoom.anchor = {x:0.5,y:0.5};
//         closeRoom.zOrder = -999;
//         BK.Director.root.addChild(closeRoom);
       
//     }

//     textStyle()
//     {
//         var style = {
//             "fontSize":40,
//             "textColor" : 0xFFFF0000,
//             "maxWidth" : 200,
//             "maxHeight": 400,
//             "width":this.options.designWidth,
//             "height":100,
//             "textAlign":0,
//             "bold":1,
//             "italic":0,
//             "strokeColor":0xFF000000,
//             "strokeSize":0,
//             "shadowRadius":0,
//             "shadowDx":0,
//             "shadowDy":0,
//             "shadowColor":0xFFFF0000
//         }
//         return style;
//     }
//     newText(content:string)
//     {
//         return new BK.Text(this.textStyle(), content);
//     }


//     infoTextStyle()
//     {
//         var style = {
//             "fontSize":20,
//             "textColor" : 0xFFFF0000,
//             "maxWidth" : 200,
//             "maxHeight": 400,
//             "width":this.options.designWidth,
//             "height":100,
//             "textAlign":0,
//             "bold":1,
//             "italic":0,
//             "strokeColor":0xFF000000,
//             "strokeSize":0,
//             "shadowRadius":0,
//             "shadowDx":0,
//             "shadowDy":0,
//             "shadowColor":0xFFFF0000
//         }
//         return style;
//     }
//     infoNewText(content:string)
//     {
//         return new BK.Text(this.infoTextStyle(), content);
//     }

//     userTextStyle()
//     {
//         var style = {
//             "fontSize":30,
//             "textColor" : 0xFFFF0000,
//             "maxWidth" : 200,
//             "maxHeight": 400,
//             "width":this.options.designWidth,
//             "height":100,
//             "textAlign":0,
//             "bold":1,
//             "italic":0,
//             "strokeColor":0xFF000000,
//             "strokeSize":0,
//             "shadowRadius":0,
//             "shadowDx":0,
//             "shadowDy":0,
//             "shadowColor":0xFFFF0000
//         }
//         return style;
//     }
//     newUserText(content:string)
//     { 
//         var tx =  new BK.Text(this.userTextStyle(), content);
//         return tx;
//     }
//     _isExistUserTextArray(openId:string)
//     {
//         for (let index = 0; index < this.userTextArray.length; index++) {
//             const userText = this.userTextArray[index];
//             if (userText.name == openId) {
//                 return true;
//             }
//         }
//         return false;
//     }

//     userTextWithOpenId(openId:string){
//         if (this._isExistUserTextArray(openId) == false) {
//             var userTxt = this.newUserText("OpenId:"+openId);
//             var y = 100 + 100 * this.userTextArray.length;
//             userTxt.position = {x:this.options.designWidth/4.0,y:y};
//             userTxt.name = openId;
//             BK.Director.root.addChild(userTxt);
//             this.userTextArray.push(userTxt);
//         }else{
//             for (let index = 0; index < this.userTextArray.length; index++) {
//                 const userText = this.userTextArray[index];
//                 if (userText.name == openId) {
//                     return userText;
//                 }
//             }
//         }
//     }

//     userTextArray : Array<BK.Text> = [];

//     serUserTextContent(openId:string,content:string){
//         var text = this.userTextWithOpenId(openId);
//         if(text){
//            text.content = content;
//         }
//     }
// }

// /////////程序主入口//////////
// var manager = null;
// var uiManager = null;
// var environment = 2; //手Q测试环境1 demo工程环境2
// function DebugLog(str:string) {
//     BK.Script.log(0,0,"debugLog:"+str);
//     uiManager.updateInfomation(str);
// }

// function starAvRoom(environment) {
//     BK.AVRoomManager.startAVRoom(environment,function (errCode:number,cmd:string,data:any) {
//                 // initAndEnterRoom callback
//         DebugLog("error:"+errCode+" cmd:"+cmd+" data:"+JSON.stringify(data));
//         if (errCode == 0) {
//             uiManager.updateInfomation("加入视频房间成功 error:"+errCode);     
            
//             var avCamera = BK.AVCamera.start({
//                 identifier: "", // unique id (openId)
//                 width: 300,
//                 height: 300,
//                 //cameraPos : 1,
//                // beauty:9 ,
//                 //whitening:9,
//                 scaleSample: 0.125,
//                 needFaceTracker: false,
//                 //parent: nil, // 父亲节点，默认为root
//                 position: {x: 300, y: 300, z: 0}, // 相对于父亲左下角的坐标
//                 onPrePreview: function(frameData) {
//                     BK.Script.log(1, 0, "features = " + JSON.stringify(frameData.faceFeatures));
//                 },
//                 onStartRoom : function (succ,errInfo) {
//                     BK.Script.log(1, 0, "onStartRoom succ:" +succ +" errInfo:"+errInfo);
//                 }
//             });
    
//             var othersView = new QAVView("22222", 300, 300, true, undefined, undefined);
            

//         }else{
//             uiManager.updateInfomation("加入视频房间失败！ error:"+errCode+"data:"+JSON.stringify(data));        
//         }
//     });
//     BK.AVRoomManager.setEventCallbackConfig({
//         eventHasAudioCallback:function (eventId,data) {
//             if (data.userInfo) {
//                 for (let index = 0; index < data.userInfo.length; index++) {
//                     const user  = data.userInfo[index];
//                     DebugLog("USER:"+user.openId+" HasAudio");            
//                 }
//             }
//         },
//         eventNoAudioCallback:function (eventId,data) {
//             if (data.userInfo) {
//                 for (let index = 0; index < data.userInfo.length; index++) {
//                     const user  = data.userInfo[index];
//                     DebugLog("USER:"+user.openId+" NoAudio");            
//                 }
//             }
//         },
//         eventNewSpeakCallback:function(eventId,data) {
//             if (data.userInfo) {
//                 for (let index = 0; index < data.userInfo.length; index++) {
//                     const user  = data.userInfo[index];
//                     DebugLog("USER:"+user.openId+" NewSpeak");            
//                 }
//             }
//         },
//         eventOldStopSpeakCallback:function(eventId,data) {
//             if (data.userInfo) {
//                 for (let index = 0; index < data.userInfo.length; index++) {
//                     const user  = data.userInfo[index];
//                     DebugLog("USER:"+user.openId+" OldStopSpeak");            
//                 }
//             }
//         },
//         eventEnterCallback:function(eventId,data) {
//             if (data.userInfo) {
//                 for (let index = 0; index < data.userInfo.length; index++) {
//                     const user  = data.userInfo[index];
//                     DebugLog("USER:"+user.openId+" Exit");            
//                 }
//             }
//         },
//         eventExitCallback:function(eventId,data) {
//             if (data.userInfo) {
//                 for (let index = 0; index < data.userInfo.length; index++) {
//                     const user  = data.userInfo[index];
//                     DebugLog("USER:"+user.openId+" Enter");            
//                 }
//             }
//         }
//     });
// }

// manager = new BKRoomManager(
//     {
//         gameId:GameStatusInfo.gameId,
//         openId:GameStatusInfo.openId,
//         environment:environment,
//         onJoinRoom:function (statusCode:number,room:BK.Room) {
//             // room.currentPlayers
//             for (let index = 0; index < room.currentPlayers.length; index++) {
//                 const player = room.currentPlayers[index];
//                 if (GameStatusInfo.openId == player.openId) {
//                     BK.Script.log(0,0,"onJoinRoom statusCode:"+statusCode+" room:"+JSON.stringify(room));
//                     starAvRoom(environment);
//                     uiManager.updateInfomation("加入厘米秀房间成功"); 
//                 }
//                 uiManager.updateInfomation(player.openId+"加入厘米秀房间成功"); 
//             }
//         }
//     }
// );
// // iPhone 6 (750x1334) 的分辨率为标准进行缩放。
// uiManager = new BKUIManager({
//     designWidth:750,
//     designHeight:1334,
//     onStartRoom:function () {
//         BK.Script.log(0,0,"onStartRoom");
//         if (GameStatusInfo.isMaster == 1) {
//             uiManager.updateInfomation("正在创建厘米秀房间");
//             manager.masterCreateAndJoinRoom();
//         }else{
//             uiManager.updateInfomation("正在加入厘米秀房间");
//             manager.guestJoinRoom(GameStatusInfo.roomId);
//         }
//     },
//     onCloseRoom:function () {
//         BK.Script.log(0,0,"onCloseRoom");
//         uiManager.updateInfomation("离开视频房间");
//         BK.AVRoomManager.exitRoom(function(err:number,cmd:string,data:any)
//         {   
//             BK.Script.log(0,0,"onCloseRoom error:"+err);
//             uiManager.updateInfomation("离开视频房间成功");
//         })
//     },
//     onSpeakerOn:function(){
//       BK.Script.log(0,0,"onSpeakerOn");  
//       uiManager.updateInfomation("正在打开扬声器");
//       BK.AVRoomManager.setSpeaker(true,function(err:number,cmd:string,data:any)
//       {   
//           BK.Script.log(0,0,"onSpeakerOn error:"+err);
//           uiManager.updateInfomation("打开扬声器成功");
//       })
//     }, 
//     onSpeakerOff:function(){
//       BK.Script.log(0,0,"onSpeakerOff");  
//       uiManager.updateInfomation("正在关闭扬声器"); 
//       BK.AVRoomManager.setSpeaker(false,function(err:number,cmd:string,data:any)
//       {   
//           BK.Script.log(0,0,"onSpeakerOn error:"+err);
//           uiManager.updateInfomation("关闭扬声器成功");          
//       })
//     },
//     onMicOn:function () {
//         uiManager.updateInfomation("正在打开麦克风");
//         BK.AVRoomManager.setMic(true,function(err:number,cmd:string,data:any)
//         {   
//             BK.Script.log(0,0,"setMic error:"+err);
//             uiManager.updateInfomation("打开麦克风");
//         })
//     },
//     onMicOff:function () {
//         uiManager.updateInfomation("正在关闭麦克风");
//         BK.AVRoomManager.setMic(false,function(err:number,cmd:string,data:any)
//         {   
//             BK.Script.log(0,0,"setMic error:"+err);
//             uiManager.updateInfomation("关闭麦克风成功");
//         })
//     }
// });
// uiManager.initUI();