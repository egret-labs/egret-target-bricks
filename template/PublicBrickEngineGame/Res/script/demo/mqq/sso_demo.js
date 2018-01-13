/**
 * 引擎与手Q时间、数据交互
 */

BK.Script.loadlib('GameRes://script/core/net/protocol.js');

//引擎 --> 手Q环境

//创建房间成功
var createRoomData = {
    "roomId": 1024,
    "retcode": 0  //表示成功
}
BK.MQQ.SsoRequest.send(createRoomData,"cs.create_room.local");

//玩家加入房间
var someOneJoinGame = {
    "openId" : "1725000451",   // 当前加入房间的人
    "isCreator": 0,      //0是加入，1是创建
    "roomId": 1024,
    "resp":{},           // 透传joinRoomSvr命令字的回包数据
    "retcode": 0 ,        //表示成功
    "gameMode": 0        //表示聊天窗 1 表示排行榜 2表示面板发起挑战
}
BK.MQQ.SsoRequest.send(someOneJoinGame,"cs.join_room.local");

//游戏开始
var gameStartData = {
    "resp":  {},    //透传joinRoomSvr命令字的回包数据
    "gameMode":1     //0 表示聊天窗 1 表示排行榜 2表示面板发起挑战
}
BK.MQQ.SsoRequest.send(gameStartData,"cs.game_start.local");



//聊天窗展示tips
var showTipsData = {"tips": "等待玩家加入"};
BK.MQQ.SsoRequest.send(showTipsData,"cs.game_tips.local");


//请求道具 
function getItems() {
    var cmd = "apollo_aio_game.get_user_game_items";
    var data = {
        cmd: cmd,
        from: GameStatusInfo.platform,
        gameId: GameStatusInfo.gameId,
        openId: GameStatusInfo.openId,
    };
    
    BK.MQQ.SsoRequest.addListener(cmd,undefined,function(errCode,cmd,data){
        BK.Script.log(0,0," reveive sso cmd = "+ cmd)
        var itemList = [];
        if(data){
            if(data.data){
                if(data.data.itemList){
                    data.data.itemList.forEach(function(element) {
                                                var item = {
                                                    "consumed": element.consumed, //是否消耗型 【0-非消耗型 1-消耗型】
                                                    "iconUrl":  element.iconUrl,  //素材iconurl
                                                    "id": element.id,             //道具ID
                                                    "name": element.name,         //道具名称
                                                    "num": element.num            //活动获得道具数
                                                }
                                                itemList.push(item);
                                                BK.Script.log(0,0,"consumed="+ item.consumed + " iconUrl="+item.iconUrl + " id="+item.id + " name="+item.name + " num="+item.num) ;   
                                            }, this);
                }
            }
        }
    });
    BK.MQQ.SsoRequest.send(data,cmd);

}


//成绩上报
function uploadScore() {
    var data = {
        "cmd" : cmd,
        "from" : "ios",       //描述请求来源或场景 h5.xxx.yyy/ios.xxx.yyy/android.xxx.yyy 用于后台统计
        "openId":"4558665DATRGFGFS455",   //上报用户的openId
        "gameId":1,           //游戏ID
        "version":"2.0",      //游戏版本
        "roomId" : 123,       //房间ID
        //具体的得分数据数组。数组中每个元素为一个用户的得分
    　　"gData":[
    　　     {
                //第一个用户的得分
    　　         "openId":"4558665DATRGFGFS455",
    　　         "scoreInfo":{
                        "score":4455,   //用户得分  必须上报
                        //附加参数，上报和使用都由第三方决定，最多支持5个附加参数，可选
                        "a1":1,
                        "a2":2,
    　　               },
    　　          "actInfo":{     //活动数据由第三方配置定义，key值统一用p1,p2,...此数据只用于活动，不会保存到用户的房间数据里, 现支持最多支持16个
　　                   "p1":1,    //参数0
　　                   "p2":5,    //参数1
　　              },
    　　     },
            {
                 //第二个用户的得分
    　　         "openId":"SDJIIWJIEQWJ232389DA",
    　　         "scoreInfo":{
                        "score":4455,   //用户得分  必须上报
                        //附加参数，上报和使用都由第三方决定，最多支持5个附加参数，可选
                        "a1":1,
                        "a2":2,
    　　               },
    　　          "actInfo":{     //活动数据由第三方配置定义，key值统一用p1,p2,...此数据只用于活动，不会保存到用户的房间数据里, 现支持最多支持16个
　　                   "p1":1,    //参数0
　　                   "p2":5,    //参数1
　　              },
            }
            //第n个用户的得分 ...
        ],
        //735新加，支持各模式玩游戏
        "arkData":{
            /**模式一**/
            "pkMode":1,                    //pk模式 1-PVP  2-PVE
            "wording":"胜利",             //结果展示wording
            "groupInfo":
            [
             {
             "rank":1,                     //组排名，如有并列第一的则两组的rank都是1
             "openIds":["4558665DATRGFGFS455","SDJIIWJIEQWJ232389DA"],         //组成员openId
             "grpWording":                       //组 wording，可选
             [
              ["得分","123","分" ],
              ["用时","123","秒" ],
              ["杀怪","123" ],
              ]
             }
             ]
        }
    };
    BK.QQ.scoreUpload(data,function(err,cmd,data){
        //errCode ，0表示成功其他为异常
        //data = {}
    });
}

// 获取房间内的用户成绩数据
function getRoomScore() {
    var data = {
        "cmd" : cmd,
        "from" : "xxxxx",       //描述请求来源或场景 h5.xxx.yyy/ios.xxx.yyy/android.xxx.yyy 用于后台统计
        "gameId":1,           //游戏ID
    　　 "version":"2.0",      //游戏版本
        "roomId": 123,      //房间ID
    };

    BK.QQ.getRoomUserScoreInfo(data,function(errCode,cmd,data){
         if(data.data){
            var userRank = data.data.userRank;
            for (var idx = 0; idx < userRank.length; idx++) {
                var singleUserRank = userRank[idx];
                var openId = singleUserRank.openId;
                var score  = singleUserRank.score;
                var rank   = singleUserRank.rank;
                //可选
                // var a1 = singleUserRank.a1;
                // var a2 = singleUserRank.a2;
                // ...
                //
            }
         }
    });
}


//查询某个用户在一款游戏中的积分
function getUserTotalPoint()
{
    var data = {
        "from" : "xxxxx",     //描述###请求来源或场景 h5.xxx.yyy/ios.xxx.yyy/android.xxx.yyy 用于后台统计
        "gameId":1,           //游戏ID
    　　 "toOpenId":"123",     //需要查询的openId（如果是查自己的数据，则不用传， 注意此参数仅在游戏当天有用）
    　　 "version":"2.0",      //游戏版本
        "cycleNum":0           //周期序号 【0-本周期， 1-上一周期， 2-上两周期】 目前后台会保存三个周期的游戏数据，例如若一个周期为1星期，则0代表本星期的数据。
    }; 
    BK.QQ.getUserGameinfo(data,function(err,cmd,data){
        //回包数据
         if(data.data){
            var openId = data.data.openId;      //用户openId
            var myPoint = data.data.myPoint;    //用户积分
         }
    });
}

//根据openId 获取厘米秀装扮
BK.QQ.getCmshowDressInfo(GameStatusInfo.openId,function(errCode,cmd,data){
	BK.Script.log(0,0,"cmd = "+ cmd + " data = " + data);
	if(errCode == 0){
	    var jPath = BK.Script.pathForResource(data.skltPath.atlas, 'json');
	    var aPath = BK.Script.pathForResource(data.skltPath.json, 'atlas'); 
	    var ani =new BK.SkeletonAnimation(aPath, jPath, 1,null,null,null );
	    for (var i=0;i<data.dressPath.length;i++)
	    {
	        var j = data.dressPath[i].atlas;
	        var a = data.dressPath[i].atlas;
	        var jPath = BK.Script.pathForResource(j, 'json');
	        var aPath = BK.Script.pathForResource(a, 'atlas');
	        ani.setAccessory(jPath, aPath);
	    }
	    ani.position = {x:100,y:100};
	    BK.Director.root.addChild(ani);
	}
});


