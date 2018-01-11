BK.Script.loadlib('GameRes://script/core/net/protocol.js');

//openid是由手机QQ分配，用于表示用户的id
var masterOpenId = "123456789012345678901234567890AB";
var joinerOpenId = "012345678901234567891234567890AB";

//每个游戏唯一标示符
var gameId = 2;

//广播通知给所有在线用户。广播的消息不保存。
function sendBroadcastData(game) {
    //用户定义的字段

    var req = '{"s":"12345678901234567890AB","m":"map","d":"2"}';
    
    BK.Script.log(0,0,"sendBroadcastData :"+ req.length);
    var data = new BK.Buffer(req.length);
    data.writeStringBuffer(req);
    var str = data.readStringBuffer();
    if(str){
        BK.Script.log(0,0,"sendBroadcastData str:"+ str);
    }else{
        if(!data){
            BK.Script.log(0,0,"sendBroadcastData data is undefined");
        }
        BK.Script.log(0,0,"sendBroadcastData str is undefined :"+ str);
    }
    game.sendBroadcastData(data);
}

function broadcastCallback(fromId,buff)
{
     var data = buff.readStringBuffer()
     BK.Script.log(0,0,"broadcastCallback :"+ buff.bufferLength());
     BK.Script.log(0,0,"broadcastCallback str:"+ data);
}

//发送帧同步事件
function sendSyncOpt(game,userDefineCmd)
{
    //预留字段，暂时填0
    var status = new BK.Buffer(1,1);
    status.writeUint8Buffer(0);

    //用户定义的字段
    var str = "ABC";
    //往buffer中写入string时，需多申请3个字节大小
    var opt = new BK.Buffer(str.length+3,1);
    opt.writeStringBuffer(str);

    BK.Script.log(1,1,"sync !!!!!send frame  1");
    //预留字段
    var extend = new BK.Buffer(1,1);
    extend.writeUint8Buffer(0);
    
    //send 
    game.syncOpt(status,opt,extend,undefined,function(ackSeq){
        BK.Script.log(1,1,"sync !!!!!后台确认号recv ack= "+ackSeq);
    });
}


function frameSyncCallback(frameDataArray){
    BK.Script.log(0,0,"收到帧同步数据");

    var frameCount = frameDataArray.length;
    for (var index = 0; index < frameDataArray.length; index++) {

        var players  =frameDataArray[index];
        BK.Script.log(0,0,"帧同步帧序列号 = " +players.frameSeq);

        BK.Script.log(1,1,"players count :" + players.length);      
        if(players){
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                BK.Script.log(0,0,"sync !!!!!!!!!!!! openid :"+player.openId);
                BK.Script.log(0,0,"sync !!!!!!!!!!!! itemId :"+player.itemId);
                var cmd = player.dataBuffer.readUint8Buffer();
                BK.Script.log(1,1,"sync !!!!!!!!!!!! cmd="+cmd);
            }
        }
    }
}

function sendFrameSyncCmd(game,cmd)
{
    //用户定义的字段
    var opt = new BK.Buffer(1,1);
    opt.writeUint8Buffer(cmd);

    BK.Script.log(1,1,"sync !!!!!send frame  1");

    var status = new BK.Buffer(1,1);
    status.writeUint8Buffer(0);

    //预留字段
    var extend = new BK.Buffer(1,1);
    extend.writeUint8Buffer(0);
        
    //send 
    game.syncOpt(status,opt,extend,undefined,function(){
        BK.Script.log(1,1,"sync !!!!!recv ack= "+game.ackSeq);
    });
}

function sendItemFrameSync(game,openId,itemId){

    BK.Script.log(1,1,"sendItemFrameSync 1");

    var status = new BK.Buffer(1,1);
    status.writeUint8Buffer(0);

	//预留字段
    var extend = new BK.Buffer(1,1);
    extend.writeUint8Buffer(0);
		
     //用户定义的字段
    var opt = new BK.Buffer(1,1);
    opt.writeUint8Buffer(0);

    var itemListBuf = new BK.Buffer(32+1+8,1);
    //写入连续32个字节的字符串，此处不可直接使用writeStringBuffer。因会在写入的字符串中前后添加string的长度
    for(var i = 0 ; i < 32 ; i++ ){
        var ascii = openId.charCodeAt(i);
        itemListBuf.writeUint8Buffer(ascii);
    }

    itemListBuf.writeUint8Buffer(1);
    itemListBuf.writeUint64Buffer(itemId);

    game.syncOpt(status,opt,extend,itemListBuf,function(){
        BK.Script.log(1,1,"sendItemFrameSync sync !!!!!recv ack= "+game.ackSeq);
    });
}


// 房主创建房间流程
var game = new BK.Room();
// 手Q环境，正式上线时使用 NETWORK_ENVIRONMENT_QQ_RELEASE 或 0 或不设置
// 手Q环境，调试时使用 NETWORK_ENVIRONMENT_QQ_DEBUG  或 1
// 开发环境,使用demo工程开发时使用 NETWORK_ENVIRONMENT_DEMO_DEV 或2
game.environment = NETWORK_ENVIRONMENT_DEMO_DEV;

game.setRoomVol(4);
game.setArkData("计时模式，关卡-4");


//添加到ticker中进行定时刷新
BK.Director.ticker.add(function(ts,duration){
    game.updateSocket();
});

game.setLeaveRoomCallback(function(statusCode,leaveInfo)
{
    if(leaveInfo){
        BK.Script.log(1,1,"leaveRoom reason:"+leaveInfo.reason);
        BK.Script.log(1,1,"leaveRoom logOutId:"+leaveInfo.logOutId);
    }
});

// //使用固定房间号创建房间
// var fixedRoomId = 231;
// game.createAndJoinFixedRoom(gameId,masterOpenId,fixedRoomId,function (statusCode,room) {
//     if(statusCode == 0){
//         BK.Script.log(0,0,"固定房间号-加入房间成功");
        
//         BK.Script.log(0,0,"当前玩家：");
//         room.currentPlayers.forEach(function(player) {
// 			BK.Script.log(1,1,"recvJoinRoom opeid:"+player["openId"] );
// 			BK.Script.log(1,1,"recvJoinRoom joinTs:"+player["joinTs"] );
// 			BK.Script.log(1,1,"recvJoinRoom status:"+player["status"] );
// 		}, this);

     
//         //设置广播回调监听
//         game.setBroadcastDataCallBack(broadcastCallback);
//         //发送广播事件
//         sendBroadcastData(game);

//         //监听帧同步
//         game.setFrameSyncListener(frameSyncCallback);
//         game.startGame(function (statusCode){
//             BK.Script.log(0,0,"开始游戏！！"+statusCode);
//             //发送一次帧同步消息
//             // sendItemFrameSync(game,masterOpenId,122333);
//             sendSyncOpt(game,123);
//         }) ;

//         //发送心跳包 
//         //PS: 服务器在30s内如无收到 帧同步，广播，心跳包之一的上行包，则判定为离开。因此需确保30s内有上述三者之一的上行包
//         game.sendKeepAlive();
//     }else{
//         BK.Script.log(0,0,"创建房间失败 错误码："+ statusCode);
//     }
// })

//普通创建房间
game.createAndJoinRoom(gameId,masterOpenId,function (statusCode,room) {
    if(statusCode == 0){
        BK.Script.log(0,0,"加入房间成功");
        BK.Script.log(0,0,"当前玩家：");
        room.currentPlayers.forEach(function(player) {
			BK.Script.log(1,1,"recvJoinRoom opeid:"+player["openId"] );
			BK.Script.log(1,1,"recvJoinRoom joinTs:"+player["joinTs"] );
			BK.Script.log(1,1,"recvJoinRoom status:"+player["status"] );
		}, this);

        //设置广播回调监听
        game.setBroadcastDataCallBack(broadcastCallback);
        //发送广播事件
        sendBroadcastData(game);
        
        //设置云端存储玩家数据
        var dataInfo = "this is a message";
        var testUin8 = 1;
        var userDataBuf = new BK.Buffer(dataInfo.length+3+1,1); //当使用Buffer进行网络通信时，需多申请3个字节长度
        userDataBuf.writeStringBuffer(dataInfo);
        userDataBuf.writeUint8Buffer(testUin8);
        game.setUserData(userDataBuf,function(retCode){
			BK.Script.log(1,1,"设置云端存储 返回 = "+retCode );

             //获取云端存储数据
            game.getUserData(room.roomId,function (retCode,buf) {
            var dataInfo = buf.readStringBuffer();
            var testUin8 = buf.readInt8Buffer();
            //云端数据
                BK.Script.log(1,1,"获取云端存储 dataInfo = "+dataInfo+" testUin8="+testUin8);
            });
        });
       
        //监听帧同步
        game.setFrameSyncListener( function (frameDataArray){

                var seq = game.lastFrame;
                BK.Script.log(0,0,"收到帧同步数据 last frame seq = "+seq);

                var frameCount = frameDataArray.length;
                for (var index = 0; index < frameDataArray.length; index++) {
                    var players  =frameDataArray[index];
                    BK.Script.log(1,1,"frame seq :" + players.frameSeq);      
                    if(players){
                        for (var i = 0; i < players.length; i++) {
                            var player = players[i];
                            BK.Script.log(0,0,"sync !!!!!!!!!!!! openid :"+player.openId);
                            BK.Script.log(0,0,"sync !!!!!!!!!!!! itemId :"+player.itemId);
                            var cmd = player.dataBuffer.readUint8Buffer();
                            BK.Script.log(1,1,"sync !!!!!!!!!!!! cmd="+cmd);
                        }
                    }
                }
        });

        game.startGame(function (statusCode){
            BK.Script.log(0,0,"开始游戏！！"+statusCode);
            //发送一次带道具消耗的帧同步消息 PS:道具ID必须为正常，否则后台会返回1009系统异常
            // sendItemFrameSync(game,masterOpenId,1237788);
            //发送不带道具的帧同步消息
            sendFrameSyncCmd(game,123);
            
            //发送心跳包 
            //PS: 服务器在30s内如无收到 帧同步，广播，心跳包之一的上行包，则判定为离开。因此需确保30s内有上述三者之一的上行包
            //game.sendKeepAlive();
            // game.leaveRoom();
        }) ;

    }else{
        BK.Script.log(0,0,"创建房间失败 错误码："+ statusCode);
    }
})

BK.QQ.SendGameMsg()


/*.
 // 参加者加入房间流程
 // roomId 真实手Q环境中，由手Q提供，此处暂时hardcode
 var game2 = new BK.Room();

// 手Q环境，正式上线时使用 NETWORK_ENVIRONMENT_QQ_RELEASE 或 0 或不设置
// 手Q环境，调试时使用 NETWORK_ENVIRONMENT_QQ_DEBUG  或 1
// 开发环境,使用demo工程开发时使用 NETWORK_ENVIRONMENT_DEMO_DEV 或2
game2.environment = NETWORK_ENVIRONMENT_DEMO_DEV;
 //2.添加到ticker中进行定时刷新
 BK.Director.ticker.add(function(ts,duration){
     game2.updateSocket();
 });

 //PS:. 房主在参加者加入房前 ，不能startGame,否则无法加入房间
 game2.queryAndJoinRoom(gameId,roomId,joinerOpenId,function(statusCode,room){
     if(statusCode == 0){
         BK.Script.log(0,0,"queryAndJoinRoom statusCode:"+ statusCode);
        BK.Script.log(0,0,"当前玩家：");
        room.currentPlayers.forEach(function(player) {
                                    BK.Script.log(1,1,"recvJoinRoom opeid:"+player["openId"] );
                                    BK.Script.log(1,1,"recvJoinRoom joinTs:"+player["joinTs"] );
                                    BK.Script.log(1,1,"recvJoinRoom status:"+player["status"] );
                                }, this);
        
        game2.leaveRoom();
     }else{
         BK.Script.log(0,0,"加入房间失败。statusCode:"+statusCode);
     }
 });
 */
