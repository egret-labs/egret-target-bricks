
const enum BKRoomEnvironment {
  QQ_RELEASE = 0,
  QQ_DEBUG   = 1,
  DEMO_DEV   = 2
}

interface BKRoomManagerOption
{
  gameId:number,
  openId:string,
  environment?:BKRoomEnvironment,
  qavCfg?:BK.QAVConfig,
  onJoinRoom?:(statusCode:RoomErrorCode,room:BK.Room)=>void,
  onStartGame?:(err:RoomErrorCode)=>void,
  onExitRoom?:(err:RoomErrorCode,cmd:string,data:any)=>void,
  onLeaveRoom?:(err:RoomErrorCode,cmd:string,data:any)=>void,
  onReceiveBroadCastData?:(err:RoomErrorCode,cmd:string,data:any)=>void,
  onReceiveSyncData?:(err:RoomErrorCode,cmd:string,data:any)=>void,
  onSendBroadCastCallback?:(err:RoomErrorCode,cmd:string,data:any)=>void,
  onSendSyncCallback?:(err:RoomErrorCode,cmd:string,data:any)=>void,
}

class BKRoomManager
{
  openId:string;
  room:BK.Room;

  options:BKRoomManagerOption;

  constructor(option:BKRoomManagerOption)
  {
      this.options = option;
      this.room = new BK.Room({
          qavCfg:option.qavCfg
      });
      BK.Director.ticker.add(function(ts,duration){
          this.room.updateSocket();
      }.bind(this));
      if (option.environment) {
          this.room.environment = option.environment;
      }
  }

  log(str)
  {
      BK.Script.log(0,0,"BKRoomManager:"+str);
  }

  masterCreateAndJoinRoomWithFixRoomId(fixRoomId:number)
  {
      if (this.options.environment && this.options.environment == BKRoomEnvironment.DEMO_DEV) {
         this.room.createAndJoinFixedRoom(this.options.gameId,this.options.openId,fixRoomId,this._enterAndJoinRoomCallback.bind(this))
      }else{
          this.log("Create with fix room failed!.BK.Room.environment is not "+BKRoomEnvironment.DEMO_DEV);
      }
  }

  masterCreateAndJoinRoom()
  {
      this.room.createAndJoinRoom(this.options.gameId,this.options.openId,this._enterAndJoinRoomCallback.bind(this));
  }

  guestJoinRoom(roomId:number)
  {
      this.room.queryAndJoinRoom(this.options.gameId,roomId,this.options.openId,this._enterAndJoinRoomCallback.bind(this));
  }

  sendBroadcastData(data:BK.Buffer){
      this.room.sendBroadcastData(data)
  }

  sendFrameSyncData(opt:BK.Buffer,itemData:BK.Buffer)
  {
      //预留字段，暂时填0
      var status = new BK.Buffer(1,1);
      status.writeUint8Buffer(0);

      //预留字段
      var extend = new BK.Buffer(1,1);
      extend.writeUint8Buffer(0);
      
      //send 
      this.room.syncOpt(status,opt,extend,undefined,function(ackSeq){
          this._syncOptCallback(ackSeq);
      }.bind(this));
  }

  startGame(callback:(retCode:RoomErrorCode)=>void){
      this.room.startGame(callback);
  }

  ///callback functions
  _startGameCallback(retCode:RoomErrorCode)
  {
      if (this.options.onStartGame) {
          this.options.onStartGame(retCode);
      }
  }

  //加入房间后回调
  _enterAndJoinRoomCallback(retCode:RoomErrorCode,room:BK.Room)
  {
      if (this.options.onJoinRoom) {
          this.options.onJoinRoom(retCode,room)
      }
  }
  //发送帧同步后后台确认回调
  _syncOptCallback(ackSeq){
      this.log("sync !!!!!后台确认号recv ack= "+ackSeq);
  }
}