
BK.Script.loadlib('GameRes://script/core/net/protocol.js');
BK.Script.loadlib('GameRes://script/core/net/room_manager.js');

///默认使用手Q debug配置
var env = BKRoomEnvironment.QQ_DEBUG;
//开发平台下使用dev配置
if (GameStatusInfo.devPlatform) {
    env = BKRoomEnvironment.DEMO_DEV;
}
var roomManager = new BKRoomManager({
    gameId:GameStatusInfo.gameId,
    openId:GameStatusInfo.openId,
    environment:env,
    onJoinRoom:function (statusCode:number,room:BK.Room) {
        BK.Script.log(0,0,"onJoinRoom:");
    }
});

roomManager.masterCreateAndJoinRoom();