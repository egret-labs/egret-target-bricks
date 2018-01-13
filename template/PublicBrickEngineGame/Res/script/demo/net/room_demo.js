BK.Script.loadlib('GameRes://script/core/net/protocol.js');
BK.Script.loadlib('GameRes://script/core/net/room_manager.js');
///默认使用手Q debug配置
var env = 1 /* QQ_DEBUG */;
//开发平台下使用dev配置
if (GameStatusInfo.devPlatform) {
    env = 2 /* DEMO_DEV */;
}
var roomManager = new BKRoomManager({
    gameId: GameStatusInfo.gameId,
    openId: GameStatusInfo.openId,
    environment: env,
    onJoinRoom: function (statusCode, room) {
        BK.Script.log(0, 0, "onJoinRoom:");
    }
});
roomManager.masterCreateAndJoinRoom();
