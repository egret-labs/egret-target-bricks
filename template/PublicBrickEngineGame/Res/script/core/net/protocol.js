/**
 * Net Protocol For Cmshow Public
 * Created by wesleyxiao on 2017-05-27 19:00
 * last updated on 2017年06月19日18:33:41 by wesleyxiao
 */

//Error Status Code
// 成功
enGameHallSucc = 0;
// 1000~1999 , 公共错误码，各SERVER公共流程的错误码
eReqDataLenErr = 1000;     // 包体长度检查非法
eReqMagicErr = 1001;     // 魔术字非法
eReqFrontCmdErr = 1002;     // 前端命令字非法
eReqBackCmdErr = 1003;     // 后端命令字非法
eReqBackSrcErr = 1004;     // 后端命令来源非法
eReqFromIdErr = 1005;     // FromId非法
eSTDecryErr = 1006;     // ST解密失败
eReqDecryErr = 1007;     // 使用STKEY界面请求包失败
eSTExpire = 1008;     // ST过期
eSystmeErr = 1009;     // 系统异常
eVerUnvalid = 1010;		// 版本太低
eReqLimit = 1011;		// 请求频率限制
eGetSvrErr = 1012;		// 获取l5失败
// 2000~2999，GMGR服务错误码
eInitMemErr = 2001;  	//初始化访问存储失败
eQueryMemErr = 2002;		//查询存储失败
eUpdateMemErr = 2003;		//更新存储失败
eDelMemErr = 2004;		//删除存储失败
eGetConfigErr = 2005;		//获取服务配置错误
eNotifyCreateErr = 2006;		//通知游戏网关创建失败
eGetRoomIdErr = 2007;		//获取房间ID失败 或者 指定的房间ID不可用
eCmdInvalid = 2008;		//非法命令
eRoomNotExist = 2009;		//房间id不存在
eInBlackList = 2010;		//在黑名单
eMatchTimeOut = 2011;    //陌生人匹配超时
// 3000~3999，GSVR服务错误码
eGetRoomErr = 3000;     // 查询房间信息失败
eRoomStatusErr = 3001;     // 房间状态异常
eIsNotCreator = 3002;     // 请求开始游戏的用户并非房主
eIsNotInRoom = 3003;     // 用户未在房间内
eFlushTsErr = 3004;     // 更新时间戳异常
eLogoutIdErr = 3005;     // 请求登出LOGOUTID与fromid不一致
eIsNotInSvc = 3006;     // 当前服务器处于不可服务状态
eUsrOverFlow = 3007;     // 当前服务器活跃用户数超过限制
eRoomOverFlow = 3008;     // 当前服务器活跃房间数超过限制
eRoomIsExist = 3009;     // 房间ID已经存在不能再创建
eRmvUsrErr = 3010;     // 用户离开房间处理失败
eLoginSysErr = 3011;     // 用户加入房间发生系统异常
eUsrHasLoginErr = 3012;     // 用户重复加入房间
eRoomIsFullErr = 3013;     // 房间已满员
eCreateRoomErr = 3014;     // 创建房间失败，系统异常
ePlayerHasJoin = 3015;     // 玩家已经加入房间，不允许挑战影子
// 4000~4999，GCONN错误码
eFowardToClientErr = 4000;     // 下行消息转发失败
eFowardToSvrErr = 4001;     // 上行消息转发失败

function clone_(obj) {
    var o, i, j, k;
    if (typeof (obj) != "object" || obj === null) return obj;
    if (obj instanceof (Array)) {
        o = []; i = 0; j = obj.length;
        for (; i < j; i++) {
            if (typeof (obj[i]) == "object" && obj[i] != null) { o[i] = arguments.callee(obj[i]); }
            else { o[i] = obj[i]; }
        }
    } else {
        o = {};
        for (i in obj) {
            if (typeof (obj[i]) == "object" && obj[i] != null) { o[i] = arguments.callee(obj[i]); }
            else { o[i] = obj[i]; }
        }
    }
    return o;
}

//测试环境推荐的房间IP，Port
var DebugRecommandRoomSvrHost = "139.199.216.130";
var DebugRecommandRoomSvrPort = 10060;

//正式环境推荐的房间IP，Port
var NormalRecommandRoomSvrHost = "139.199.216.128";
var NormalRecommandRoomSvrPort = 10060;

var TLVType = new Object();
TLVType.Int8 = 0x21;
TLVType.Uint8 = 0x22;
TLVType.Int16 = 0x21;
TLVType.Uint16 = 0x24;
TLVType.Int32 = 0x25;
TLVType.Uint32 = 0x26;
TLVType.Int64 = 0x27;
TLVType.Uint64 = 0x28;
TLVType.Byte = 0x29;
TLVType.Double = 0x2a;
TLVType.Float = 0x2b;
TLVType.Int8Repeated = 0x31;
TLVType.Uint8Repeated = 0x32;
TLVType.Int16Repeated = 0x33;
TLVType.Uint16Repeated = 0x34;
TLVType.Int32Repeated = 0x35;
TLVType.Uint32Repeated = 0x36;
TLVType.Int64Repeated = 0x37;
TLVType.Uint64Repeated = 0x38;
TLVType.ByteRepeated = 0x39;
TLVType.DoubleRepeated = 0x3a;
TLVType.FloatRepeated = 0x3b;

var fixedHeaderLen = 120;
var HeaderLen = 12;

var currentGameMode = GameStatusInfo.gameMode;
var fromPlatform = GameStatusInfo.platform;
var currentAioType = GameStatusInfo.aioType;
var currentPlayerOpenId = GameStatusInfo.openId;
var isMaster = GameStatusInfo.isMaster;

//environment
NETWORK_ENVIRONMENT_QQ_RELEASE = 0;  //手Q环境，正式上线时使用此配置
NETWORK_ENVIRONMENT_QQ_DEBUG = 1;  //手Q环境，调试时使用此配置
NETWORK_ENVIRONMENT_DEMO_DEV = 2;  //开发环境,使用demo工程开发时使用此配置

//CMSHOW SERVER CMD
CMSHOW_SRV_CMD_JOIN_ROOM = "apollo_aio_game.join_room";  //加入房间
CMSHOW_SRV_CMD_QUIT_GAME = "apollo_aio_game.quit_room";  //退出房间
CMSHOW_SRV_CMD_START_GAME = "apollo_aio_game.start_game"; //开始游戏
CMSHOW_SRV_CMD_CANCEL_GAME = "apollo_aio_game.cancel_game_room"; //取消游戏
CMSHOW_SRV_CMD_CUSTOM_GAME_LOGIC = "apollo_game_openapi.custom_game_logic"//客户逻辑

CMSHOW_SC_CMD_STOP_GAME = "sc.force_stop_game.local"
CMSHOW_SC_CMD_PUSH_MSG = "sc.push_new_msg.local"

CMSHOW_CS_CMD_MINI_WND = "cs.make_room_min.local"
CMSHOW_CS_CMD_CLOSE_WND = "cs.close_room.local"
CMSHOW_CS_CMD_CREATE_ROOM = "cs.create_room.local"
CMSHOW_CS_CMD_JOIN_ROOM = "cs.join_room.local"
CMSHOW_CS_CMD_SEND_GAME_MSG = "cs.send_game_msg.local"
CMSHOW_CS_CMD_GAME_TIPS = "cs.game_tips.local"
CMSHOW_CS_CMD_GET_PLAYER_DRESS = "cs.get_dress_path.local"
CMSHOW_CS_CMD_GAME_READY = "cs.game_ready.local"
CMSHOW_CS_CMD_GAME_START = "cs.game_start.local"
CMSHOW_CS_CMD_SAVE_RECOMM_VIP = "cs.save_recommend_ip.local"
CMSHOW_CS_CMD_GET_SRV_IP_PORT = "cs.get_server_ip_port.local"
CMSHOW_CS_CMD_CHECK_PUBACCOUNT_STATE = "cs.check_pubAccount_state.local"
CMSHOW_CS_CMD_ENTER_PUBACCOUNT_CARD = "cs.enter_pubAccount_card.local"
CMSHOW_CS_CMD_SHARE_PIC = "cs.share_pic.local";
CMSHOW_CS_CMD_SHARE_IN_ARK = "cs.share_game_in_ark.local"
CMSHOW_AIO_PAUSE = "sc.aio_pause.local";
CMSHOW_AIO_RESUME = "sc.aio_resume.local";

CMD_CMSHOW_GAME_ENTER_BACKGROUND = "sc.game_enter_background.local"; //游戏退到后台
CMD_CMSHOW_GAME_ENTER_FORGROUND = "sc.game_enter_foreground.local"; //游戏回到前台
CMD_CMSHOW_GAME_MAXIMIZE = "sc.game_maximize.local";        //游戏界面最大化
CMD_CMSHOW_GAME_MINIMIZE = "sc.game_minimize.local";        //游戏界面最小化
CMSHOW_CS_CMD_AUDIOROOM_ENTERN = "cs.audioRoom_enter.local";
CMSHOW_CS_CMD_AUDIOROOM_EXIT = "cs.audioRoom_exit.local";
CMSHOW_CS_CMD_AUDIOROOM_UPDATEUSERINFO = "cs.audioRoom_update_userinfo.local";
CMSHOW_CS_CMD_AUDIOROOM_SET_MIC = "cs.audioRoom_set_mic.local";
CMSHOW_CS_CMD_AUDIOROOM_SET_SPEAKER = "cs.audioRoom_set_speaker.local";
CMSHOW_CS_CMD_AUDIOROOM_INIT = "cs.audioRoom_init.local";
CMSHOW_CS_CMD_AUDIOROOM_DISCONNECT = "cs.audioRoom_disconnect.local"
CMSHOW_CS_CMD_AUDIOROOM_CAMERASWITCH = "cs.audioRoom_cameraswitch.local"
CMSHOW_CS_CMD_AUDIOROOM_SET_BEAUTY = "cs.audioRoom_set_beauty.local"
CMSHOW_CS_CMD_AUDIOROOM_REQ_AUDIO_SESSION = "cs.audioRoom_req_audio_session.local"
/*
    BK.QQ.delegate.onStopGameEvent = 强制关闭游戏事件
    BK.QQ.delegate.onPushMsgEvent = 聊天消息通知事件
    BK.QQ.delegate.onJoinRoomEvent = 创建或加入房间QQ事件
    BK.QQ.delegate.onStartGameEvent = 开始游戏QQ事件
    BK.QQ.delegate.onQuitGameEvent = 退出游戏QQ事件
    BK.QQ.delegate.onCancelGameEvent = 取消游戏QQ事件
    BK.QQ.delegate.onGetPlayerDressEvent = 获取玩家装扮事件
    BK.QQ.delegate.onGetVIPInfoEvent = 获取VIP列表事件
*/

var currentRenderMode;
checkRenderMode = function () {
    if (currentRenderMode == 0) {
        BK.Script.renderMode = 1;
        currentRenderMode = 1;
    }
}

BK.QQ = (function () {
    return new function () {
        this.gameCfg = clone_(GameStatusInfo);
        this.gameCfg.gameId = parseInt(this.gameCfg.gameId);
        
        this.arkData = {
                "modeWording":"",          //等待加入时展示的wording, 如：计时模式，关卡-4等
            }


        this.setArkData = function (modeWording)
        {
            this.arkData.modeWording = modeWording;          //等待加入时展示的wording, 如：计时模式，关卡-4等
        }

        if (this.gameCfg.roomId) {
            this.gameCfg.roomId = parseInt(this.gameCfg.roomId);
        }

        if (this.gameCfg.isMaster == 1) {
            this.gameCfg.isCreator = true;
        } else {
            this.gameCfg.isCreator = false;
        }

        this.delegate = {};
        this.ssoJoinRoomCallback;
        this.ssoJoinRoomCallbackPublic;


        BK.MQQ.SsoRequest.addListener(CMD_CMSHOW_GAME_ENTER_BACKGROUND, this, function () {
            var isAndroid = GameStatusInfo.platform == "android" ? 1 : 2;
            if (isAndroid == 1) {
                BK.Director.tickerPause();
            }
        });

        BK.MQQ.SsoRequest.addListener(CMD_CMSHOW_GAME_ENTER_FORGROUND, this, function () {
            var isAndroid = GameStatusInfo.platform == "android" ? 1 : 2;
            if (isAndroid == 1) {
                BK.Director.tickerResume();
            }
        });

        BK.MQQ.SsoRequest.addListener(CMD_CMSHOW_GAME_MINIMIZE, this, function () {
            var isAndroid = GameStatusInfo.platform == "android" ? 1 : 2;
            if (isAndroid == 1) {
                BK.Script.renderMode = 0;
                currentRenderMode = 0;
            }

        });

        BK.MQQ.SsoRequest.addListener(CMD_CMSHOW_GAME_MAXIMIZE, this, function () {
            var isAndroid = GameStatusInfo.platform == "android" ? 1 : 2;
            if (isAndroid == 1) {
                BK.Script.renderMode = 1;
                currentRenderMode = 1;
            }

        });

        //游戏内购
        /**
         * 
         * @param {*} gameOrientation 1（默认，竖屏）2.横屏（home键在左边）3.横屏 （home键在右边）
         * @param {*} transparent   是否透明
         * @param {*} itemList 
         */
        this.qPayPurchase = function(gameOrientation,transparent,itemList,callback){
            var cmd = "cs.openWebViewWithoutUrl.local";
            var transparentNum = 1;
            if(transparent == true){
                transparentNum = 1;
            }else{
                transparentNum = 0;
            }
            var data =  {
                "gameOrientation": gameOrientation,   //1（默认，竖屏）2.横屏（home键在左边）3.横屏 （home键在右边）
                "openId": GameStatusInfo.openId,  //ios android都需要
                "transparent":transparentNum,     //是否透明 默认为1(透明) 0为不透明 ios android  都需要
                "businessType":1,       //业务类型 1 代表支付 ios android  都需要
                "itemList": itemList     
            }
            if (callback) {
                var cbCmd = "sc.apolloGameWebMessage.local";
                BK.MQQ.SsoRequest.addListener(cbCmd, undefined, function (errCode,cmd,data) {
                    callback(errCode,data);
                }.bind(this));
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        }

        //分享游戏至手Q
        this.shareToMQQ = function (title, summary, detailUrl, picUrl) {
        	var cmd = "cs.share_game_result.local";
        	var data = {
                "cmd": cmd,
                "from": GameStatusInfo.platform,
                "gameId": GameStatusInfo.gameId,
                "openId": GameStatusInfo.openId,
                "gameVersion": GameStatusInfo.gameVersion,
                "roomId": GameStatusInfo.roomId,
                "title": title,
            	"summary": summary,
            	"detailUrl": detailUrl,
            	"picUrl": picUrl
            };

            BK.MQQ.SsoRequest.send(data, cmd);
        }

        //成绩上报
        this.scoreUpload = function (scoreData,callback,arkData) {
            //请求数据
            var cmd = "apollo_aio_game.report_user_score_3rd";

            var data = {
                "cmd": cmd,
                "from": GameStatusInfo.platform,
                "gameId": GameStatusInfo.gameId,
                "openId": GameStatusInfo.openId,
                "version": GameStatusInfo.gameVersion,
                "roomId": GameStatusInfo.roomId,
                "gData": scoreData,
            };
            if (arkData) {
                data["arkData"]= arkData;
            }
            if (callback) {
                BK.MQQ.SsoRequest.addListener(cmd, undefined, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        }

        //获取房间内的用户成绩数据
        this.getRoomUserScoreInfo = function (roomId, callback) {
            var cmd = "apollo_aio_game.get_room_info_3rd";
            var data = {
                "cmd" :cmd,
                "from" : GameStatusInfo.platform, //描述请求来源或场景 h5.xxx.yyy/ios.xxx.yyy/android.xxx.yyy 用于后台统计
                "gameId":GameStatusInfo.gameId,  //游戏ID
                "version":GameStatusInfo.gameVersion,      //游戏版本
                "roomId": roomId,      //房间ID
            }
            if (callback) {
                BK.MQQ.SsoRequest.addListener(cmd, undefined, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        }

        //查询某个用户在一款游戏中的积分
        this.getUserGameinfo = function (openId, cycleType, callback) {
            var cmd = "apollo_aio_game.get_user_gameinfo_3rd";
            var data = {
                "cmd": cmd,
                "from": GameStatusInfo.platform,
                "gameId": GameStatusInfo.gameId,
                "openId": GameStatusInfo.openId,
                "version": GameStatusInfo.gameVersion,
                "roomId": GameStatusInfo.roomId,
               	"toOpenId": openId,
            	"cycleNum": cycleType
            };
            if (callback) {
                BK.MQQ.SsoRequest.addListener(cmd, undefined, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        }

        //查询用户货币余额  currencyType:   1- 获取游戏点券 2-获取游戏二级货币（暂不能用
        this.getUserCurrencyInfo = function (currencyType, callback) {
            var cmd = "apollo_aio_game.get_user_curreInfo";
            var data = {
                "cmd": cmd,
                "from": GameStatusInfo.platform,
                "gameId": GameStatusInfo.gameId,
                "openId": GameStatusInfo.openId,
                "version": GameStatusInfo.gameVersion,
                "mask": currencyType
            };
            if (callback) {
                BK.MQQ.SsoRequest.addListener(cmd, undefined, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        }

        //获取厘米秀形象数据
        this.getCmshowDressInfo = function (openId, callback) {
            //根据openId 获取厘米秀装扮
            var cmd = "cs.get_dress_path.local";
            if (callback) {
                BK.MQQ.SsoRequest.addListener(cmd, undefined, callback);
            }
            var data = {
                "openId": openId
            }
            BK.MQQ.SsoRequest.send(data, "cs.get_dress_path.local");
        }

        //获取游戏所有道具
        this.getGameItemList = function (callback) {
            var cmd = "apollo_aio_game.get_game_itemList";
            var data = {
                    "cmd":cmd,
                    "from": GameStatusInfo.platform,  //描述请求来源或场景 h5.xxx.yyy/ios.xxx.yyy/android.xxx.yyy 用于后台统计
                    "gameId":GameStatusInfo.gameId
            }
            if (callback) {
                BK.MQQ.SsoRequest.addListener(cmd, undefined, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        }

        //获取用户拥有的游戏道具
        this.getUserGameItems = function (callback) {
            var cmd = "apollo_aio_game.get_user_game_items";
            var data = {
            	"cmd": cmd,
                "from": GameStatusInfo.platform,
                "gameId": GameStatusInfo.gameId,
                "openId": GameStatusInfo.openId
            };
            if (callback) {
                BK.MQQ.SsoRequest.addListener(cmd, undefined, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        }

        //购买道具
        this.buyGameItems = function (currencyType, items,callback) {
            var cmd = "apollo_aio_game.buy_game_items";
            var data = {
                "cmd": cmd,
                "from": GameStatusInfo.platform,
                "gameId": GameStatusInfo.gameId,
            	"curreType": currencyType, //3-游戏点券 4-二级货币（暂不能用）
            	"itemIdList": items
            };
            if (callback) {
                BK.MQQ.SsoRequest.addListener(cmd, undefined, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        }

        this.notifyNewRoom = function (roomId, retCode) {
            var data = {
                "gameId": this.gameCfg.gameId,
                "roomId": roomId,
                "retcode": retCode
            }
            if (!this.gameCfg.roomId) {
                this.gameCfg.roomId = roomId;
            }
            BK.Script.log(0, 0, "BK.QQ.notifyNewRoom!gameId = " + data.gameId + ", roomId = " + data.roomId + ", retCode = " + retCode);
            BK.MQQ.SsoRequest.send(data, CMSHOW_CS_CMD_CREATE_ROOM);
        }

        this.notifyHideGame = function () {
            var data = {
                "gameId": this.gameCfg.gameId,
                "roomId": this.gameCfg.roomId,
                "sessionId": Number(this.gameCfg.sessionId)
            }
            BK.Script.log(0, 0, "BK.QQ.notifyHideGame!gameId = " + data.gameId + ", roomId = " + data.roomId + ", sessionId = " + data.sessionId);
            BK.MQQ.SsoRequest.send(data, CMSHOW_CS_CMD_MINI_WND);
        }

        this.notifyCloseGame = function () {
            this._closeRoom();
            var data = {
                "gameId": this.gameCfg.gameId,
                "roomId": this.gameCfg.roomId,
                "sessionId": Number(this.gameCfg.sessionId)
            }
            BK.Script.log(0, 0, "BK.QQ.notifyCloseGame!gameId = " + data.gameId + ", roomId = " + data.roomId + ", sessioinId = " + data.sessionId);
            BK.MQQ.SsoRequest.send(data, CMSHOW_CS_CMD_CLOSE_WND);
        }

        this.notifyReadyGame = function () {
            var data = {
                "gameId": this.gameCfg.gameId,
                "roomId": this.gameCfg.roomId,
                "sessionId": Number(this.gameCfg.sessionId)
            }
            BK.MQQ.SsoRequest.send(data, CMSHOW_CS_CMD_GAME_READY);
        }

        this.notifyGameTips = function (tips) {
            var data = {
                "gameId": this.gameCfg.gameId,
                "roomId": this.gameCfg.roomId,
                "sessionId": Number(this.gameCfg.sessionId),
                "tips": tips
            }
            BK.MQQ.SsoRequest.send(data, CMSHOW_CS_CMD_GAME_TIPS);
        }

        this.notifyGameTipsWaiting = function () {
            this.notifyGameTips("等待玩家加入");
        }
        this.notifyGameTipsSomeOneJoinRoom = function (nick) {
            this.notifyGameTips(nick + "加入房间");
        }
        this.notifyGameTipsSomeOneLeaveRoom = function (nick) {
            this.notifyGameTips(nick + "离开房间");
        }
        this.notifyGameTipsReady = function () {
            this.notifyGameTips("游戏即将开始");
        }
        this.notifyGameTipsPlaying = function () {
            this.notifyGameTips("游戏进行中");
        }
        this.notifyGameTipsGameOver = function () {
            this.notifyGameTips("游戏已结束");
        }
        this.inviteFriend = function (wording) {
            var cmd = "cs.invite_friends.local";
            var data = {
                cmd: cmd,
                wording: wording,
            };
            BK.MQQ.SsoRequest.send(data, cmd);
        }

        this.uploadData = function (action, enter, result, param1, param2, param3) {
            var cmd = "cs.report_data_2_compass.local";
            var gameId = this.gameCfg.gameId;

            if (this.gameCfg.platform == 'ios') {
                action = action.toString();
                result = result.toString()
            }

            var data = {
                "cmd": cmd,
                "actionName": action,
                "enter": enter,
                "result": result,
                "r2": gameId.toString(),
                "r3": param1,
                "r4": param2,
                "r5": param3
            };
            BK.MQQ.SsoRequest.send(data, cmd);
        }

        this.sharePic = function (path) {
            var data = {
                "gameId": this.gameCfg.gameId,
                "roomId": this.gameCfg.roomId,
                "sessionId": Number(this.gameCfg.sessionId),
                "path": path
            }
            BK.MQQ.SsoRequest.send(data, CMSHOW_CS_CMD_SHARE_PIC);
        }

        this.addSSOJoinRoomCallBack = function (callback) {
            this.ssoJoinRoomCallbackPublic = callback;
        }

        //查询是否关注公众号
        this.checkPubAccountState = function (puin, callback) {
            if (callback) {
                BK.MQQ.SsoRequest.addListener(CMSHOW_CS_CMD_CHECK_PUBACCOUNT_STATE, this, callback);
            }
            var cmd = CMSHOW_CS_CMD_CHECK_PUBACCOUNT_STATE;
            var data = {
                "cmd": cmd,
                "puin": puin,
            };
            BK.MQQ.SsoRequest.send(data, cmd);

        }
        //进入公众号资料卡
        this.enterPubAccountCard = function (puin) {
            var cmd = CMSHOW_CS_CMD_ENTER_PUBACCOUNT_CARD;
            var data = {
                "cmd": cmd,
                "puin": puin,
            };
            BK.MQQ.SsoRequest.send(data, cmd);
        }

        //获取openkey
        this.fetchOpenKey = function (callback) {
            var cmd = "cs.on_get_open_key.local";

            var data = {
                "gameId" : GameStatusInfo.gameId
            };
            if (callback) {
                BK.MQQ.SsoRequest.addListener(cmd, this, callback);
            }
            BK.MQQ.SsoRequest.send(data, cmd);
        }

        //监听游戏退到后台事件
        this.listenGameEventEnterBackground = function (obj,callback) {
            var cmd = "sc.game_enter_background.local";
            if (callback) {
                BK.MQQ.SsoRequest.addListener(cmd, obj, callback);
            }
        }

        //监听游戏回到前台
        this.listenGameEventEnterForeground = function (obj,callback) {
            var cmd = "sc.game_enter_foreground.local";
            if (callback) {
                BK.MQQ.SsoRequest.addListener(cmd, obj, callback);
            }
        }

        //监听游戏界面最大化
        this.listenGameEventMaximize = function (obj,callback) {
            var cmd = "sc.game_maximize.local";
            if (callback) {
                BK.MQQ.SsoRequest.addListener(cmd, obj, callback);
            }
        }

        //监听游戏界面最小化
        this.listenGameEventMinimize = function (obj,callback) {
            var cmd = "sc.game_maximize.local";
            if (callback) {
                BK.MQQ.SsoRequest.addListener(cmd, obj, callback);
            }
        }

        this._event4GetVIPInfo = function (errCode, cmd, data) {
            BK.Script.log(0, 0, "BK.QQ._event4GetVIPInfo!errCode = " + errCode + " cmd = " + cmd + " data = " + JSON.stringify(data));
            if (this.delegate.onGetVIPInfoEvent) {
                this.delegate.onGetVIPInfoEvent(errCode, cmd, data);
            }
            BK.MQQ.SsoRequest.removeListener(CMSHOW_CS_CMD_GET_SRV_IP_PORT, this);
        }

        this.notifyGetVIPInfo = function () {
            BK.MQQ.SsoRequest.send({}, CMSHOW_CS_CMD_GET_SRV_IP_PORT);
            BK.MQQ.SsoRequest.addListener(CMSHOW_CS_CMD_GET_SRV_IP_PORT, this, this._event4GetVIPInfo.bind(this));
        }

        this.notifySaveRecommVIP = function (ip, port) {
            BK.Script.log(0, 0, "BK.QQ.notifySaveRecommVIP!ip = " + ip + ", port = " + port);
            var data = {
                "gameId": this.gameCfg.gameId,
                "roomId": this.game.roomId,
                "sessionId": Number(this.gameCfg.sessionId),
                "ip": ip,
                "port": port
            }
            BK.MQQ.SsoRequest.send(data, CMSHOW_CS_CMD_SAVE_RECOMM_VIP);
        }

        this._event4GetPlayerDress = function (errCode, cmd, data) {
            BK.Script.log(0, 0, "BK.QQ._event4GetPlayerDress!errCode = " + errCode + ", cmd = " + cmd + ", data = " + JSON.stringify(data));
            if (this.delegate.onGetPlayerDressEvent) {
                this.delegate.onGetPlayerDressEvent(errCode, cmd, data);
            }
            BK.MQQ.SsoRequest.removeListener(CMSHOW_CS_CMD_GET_PLAYER_DRESS, this);
        }

        this.notifyGetPlayerDress = function (openId) {
            var data = {
                "openId": openId
            }
            BK.MQQ.SsoRequest.send(data, CMSHOW_CS_CMD_GET_PLAYER_DRESS);
            BK.MQQ.SsoRequest.addListener(CMSHOW_CS_CMD_GET_PLAYER_DRESS, this, this._event4GetPlayerDress.bind(this));
        }

        this._startGameLocal = function (retcode, resp) {
            var data = {
                "gameId": this.gameCfg.gameId,
                "roomId": this.gameCfg.roomId,
                "sessionId": Number(this.gameCfg.sessionId),
                "resp": resp,    //透传joinRoomSvr命令字的回包数据
                "retcode": retcode,
                "gameMode": this.gameCfg.gameMode     //0 表示聊天窗 1 表示排行榜 2表示面板发起挑战
            }
            BK.MQQ.SsoRequest.send(data, CMSHOW_CS_CMD_GAME_START);
        }

        this.notifyJoinRoom = function (newJoinPlayers, resp, retCode) {
            if (newJoinPlayers && newJoinPlayers.length > 0) {
                newJoinPlayers.forEach(function (player) {
                    // var avRoomId = resp.data.avRoomId;
                    // var appId = resp.data.sdkAppId;
                    // var accountType = resp.data.accountType;
                    var isMine = player.openId == currentPlayerOpenId ? true : false;
                    BK.Script.log(1, 1, "player.openid=" + player.openId + " currentPlayerOpenId=" + currentPlayerOpenId);
                    var avRoomId = 0;
                    if (resp && resp.data && resp.data.avRoomId) {
                        avRoomId = resp.data.avRoomId;
                    }
                    var sdkAppId = 0;
                    if (resp && resp.data && resp.data.sdkAppId) {
                        sdkAppId = resp.data.sdkAppId;
                    }
                    var accountType = 0;
                    if (resp && resp.data && resp.data.accountType) {
                        accountType = resp.data.accountType;
                    }

                    var someOneJoinGame = {
                        "gameId": this.gameCfg.gameId,
                        "openId": player.openId,   			// 当前加入房间的人
                        "isCreator": (this.gameCfg.isCreator && player.openId == currentPlayerOpenId) ? 1 : 0,   // 0是加入，1是创建
                        "roomId": this.gameCfg.roomId,
                        "resp": resp,              // 透传joinRoomSvr命令字的回包数据
                        "retcode": retCode,        //表示成功
                        "gameMode": this.gameCfg.gameMode, //表示聊天窗 1 表示排行榜 2表示面板发起挑战
                        "avRoomId": avRoomId,
                        "sdkAppId": sdkAppId,
                        "accountType": accountType,
                        "isMine": isMine,
                        "isDisableSendMsg" : !this.isAutoSendJoinRoomNotify
                    }
                   BK.Script.log(0, 0, "BK.QQ.notifyJoinroom isDisableSendMsg: "+someOneJoinGame.isDisableSendMsg);
                    BK.MQQ.SsoRequest.send(someOneJoinGame, CMSHOW_CS_CMD_JOIN_ROOM);
                }, this);
            } else {
                BK.Script.log(0, 0, "BK.QQ.notifyJoinRoom!newJoinPlayers data error");
            }
        }

        this.SendGameMsg = function () {
         if (this.gameCfg.roomId && this.gameCfg.roomId > 0)
             {
                 var JoinGameMsg = {
                     "gameId": this.gameCfg.gameId,
                     "openId": GameStatusInfo.openId,   // 当前加入房间的人
                     "roomId": this.gameCfg.roomId,
                     "gameMode": this.gameCfg.gameMode
                 }
                 
                 BK.Script.log(0, 0, "SendGameMsg : gameId="+ JoinGameMsg.gameId+"  openId="+JoinGameMsg.openId+ " roomId="+JoinGameMsg.roomId+"  gameMode="+JoinGameMsg.gameMode);
                 BK.MQQ.SsoRequest.send(JoinGameMsg, CMSHOW_CS_CMD_SEND_GAME_MSG);
             
             }
        }
         
         this.ShareToArk = function(title,summary,picUrl,detailUrl)
         {
             var data = {
             "title": title,
             "summary": summary,
             "detailUrl": detailUrl,
             "picUrl": picUrl,
             "gameId": this.gameCfg.gameId,
             "roomId": this.gameCfg.roomId,
             "gameMode":this.gameCfg.gameMode,
             "gameVersion": this.gameCfg.gameVersion
            }
            BK.Script.log(0, 0, "ShareToArk title="+ data.title+"  summary="+data.summary+ " roomId="+data.roomId+"  gameMode="+data.gameMode+"  detailUrl="+data.detailUrl+ " picUrl="+data.picUrl+"  gameId="+data.gameId+"  gameversion="+data.gameversion);
            BK.MQQ.SsoRequest.send(data, CMSHOW_CS_CMD_SHARE_IN_ARK);
         }

        this._event4QuitGame = function (errCode, cmd, data) {
            BK.Script.log(0, 0, "BK.QQ._event4QuitGame errCode = " + errCode + " cmd = " + cmd + " data = " + JSON.stringify(data));
            if (this.delegate.onQuitGameEvent) {
                this.delegate.onQuitGameEvent(errCode, cmd, data);
            }
            BK.MQQ.SsoRequest.removeListener(CMSHOW_SRV_CMD_QUIT_GAME, this);
        }

        this._event4CancelGame = function (errCode, cmd, data) {
            BK.Script.log(0, 0, "BK.QQ._event4CancelGame errCode = " + errCode + " cmd = " + cmd + " data = " + JSON.stringify(data));
            if (this.delegate.onCancelGameEvent) {
                this.delegate.onCancelGameEvent(errCode, cmd, data);
            }
            BK.MQQ.SsoRequest.removeListener(CMSHOW_SRV_CMD_CANCEL_GAME, this);
        }

        this.notifyQuitGameSrv = function () {
            var data = {
                "cmd": CMSHOW_SRV_CMD_QUIT_GAME,
                "from": this.gameCfg.platform,
                "gameId": this.gameCfg.gameId,
                "roomId": this.gameCfg.roomId
            }

            BK.Script.log(0, 0, "BK.QQ.notifyQuitGameSrv!" +
                ", cmd = " + data.cmd +
                ", from = " + data.from +
                ", gameId = " + data.gameId +
                ", roomId = " + data.roomId)

            BK.MQQ.SsoRequest.send(data, CMSHOW_SRV_CMD_QUIT_GAME);
            BK.MQQ.SsoRequest.addListener(CMSHOW_SRV_CMD_QUIT_GAME, this, this._event4QuitGame.bind(this));
        }

        this.notifyCancelGameSrv = function () {
            var data = {
                "cmd": CMSHOW_SRV_CMD_CANCEL_GAME,
                "from": this.gameCfg.platform,
                "gameId": this.gameCfg.gameId,
                "roomId": this.gameCfg.roomId
            }

            BK.Script.log(0, 0, "BK.QQ.notifyCancelGameSrv!" +
                ", cmd = " + data.cmd +
                ", from = " + data.from +
                ", gameId = " + data.gameId +
                ", roomId = " + data.roomId)

            BK.MQQ.SsoRequest.send(data, CMSHOW_SRV_CMD_CANCEL_GAME);
            BK.MQQ.SsoRequest.addListener(CMSHOW_SRV_CMD_CANCEL_GAME, this, this._event4CancelGame.bind(this));
        }

        this._event4StartGame = function (errCode, cmd, data) {
            BK.Script.log(0, 0, "BK.QQ._event4StartGame! errCode = " + errCode + " cmd = " + cmd + " data = " + JSON.stringify(data));
            this.hasStartGameSucc = (errCode == 0) ? true : false;
            this._startGameLocal(errCode, data);
            if (this.delegate.onStartGameEvent) {
                this.delegate.onStartGameEvent(errCode, cmd, data);
            }
            BK.MQQ.SsoRequest.removeListener(CMSHOW_SRV_CMD_START_GAME, this);
        }

        this.notifyStartGameSrv = function () {
            var data = {
                "cmd": CMSHOW_SRV_CMD_START_GAME,
                "from": this.gameCfg.platform,
                "gameId": this.gameCfg.gameId,
                "roomId": this.gameCfg.roomId
            }

            BK.Script.log(0, 0, "BK.QQ.notifyStartGameSrv!" +
                ", cmd = " + data.cmd +
                ", from = " + data.from +
                ", gameId = " + data.gameId +
                ", roomId = " + data.roomId);

            BK.MQQ.SsoRequest.send(data, CMSHOW_SRV_CMD_START_GAME);
            BK.MQQ.SsoRequest.addListener(CMSHOW_SRV_CMD_START_GAME, this, this._event4StartGame.bind(this));
        }

        this._event4JoinRoom = function (errCode, cmd, data) {
            BK.Script.log(0, 0, "BK.QQ._event4JoinRoom errCode = " + errCode + " cmd = " + cmd + " data = " + JSON.stringify(data));
            if (this.delegate.onJoinRoomEvent) {
                this.delegate.onJoinRoomEvent(errCode, cmd, data);
            }

            this.hasJoinRoomSucc = (errCode == 0) ? true : false;

            // //3.notify mqq some one join room
            BK.QQ.notifyJoinRoom(this.newJoinPlayers, data, errCode);
            BK.MQQ.SsoRequest.removeListener(CMSHOW_SRV_CMD_JOIN_ROOM, this);
            if (this.ssoJoinRoomCallback) {
                this.ssoJoinRoomCallback(errCode, cmd, data);
            }
            if (this.ssoJoinRoomCallbackPublic) {
                data["gameId"] = this.gameCfg.gameId;
                data["gameRoomId"] = this.gameCfg.roomId;
                data["avRoomId"] = data.data.avRoomId ? data.data.avRoomId : 0,
                data["sdkAppId"] = data.data.sdkAppId ? data.data.sdkAppId : 0,
                data["accountType"] = data.data.accountType ? data.data.accountType : 0,
                this.ssoJoinRoomCallbackPublic(errCode, cmd, data);
            }
        }

        this.notifyNewOrJoinRoomSrv = function (newJoinPlayers, roomId, isCreator) {
            var data = {
                "cmd": CMSHOW_SRV_CMD_JOIN_ROOM,
                "from": this.gameCfg.platform,
                "aioType": this.gameCfg.aioType,
                "sessionId": Number(this.gameCfg.sessionId),  //会话ID
                "gameId": this.gameCfg.gameId,         //游戏ID
                "version": this.gameCfg.gameVersion,   //游戏版本
                "roomId": roomId,        //房间ID
                "opType": isCreator,        //操作类型[1:创建房间;2:加入房间]
                "gameMode": this.gameCfg.gameMode,
                // "shadow":1,          // 1-和影子PK，0，实时PK
                // "toUin":123455656,   // 用于和官方小人的PK，官方小人加入房间时用,
                "roomVol" : this.roomVol,

                "arkData" : this.arkData
            };



            BK.Script.log(1, 1, 'BK.QQ.notifyNewOrJoinRoomSrv!' +
                ', cmd = ' + data.cmd +
                ', from = ' + data.from +
                ', aioType = ' + data.aioType +
                ', sessionId = ' + data.sessionId +
                ', gameId = ' + data.gameId +
                ', version = ' + data.version +
                ', roomId = ' + data.roomId +
                ', opType = ' + data.opType);

            this.newJoinPlayers = newJoinPlayers;

            BK.MQQ.SsoRequest.addListener(CMSHOW_SRV_CMD_JOIN_ROOM, this, this._event4JoinRoom.bind(this));
            BK.MQQ.SsoRequest.send(data, CMSHOW_SRV_CMD_JOIN_ROOM);
        }

        this._customGameLogicCallBack = undefined;
        this._event4CustomLogic = function (errCode, cmd, data) {

            if (this._customGameLogicCallBack != undefined) {
                this._customGameLogicCallBack(errCode, cmd, data)
            }

            BK.MQQ.SsoRequest.removeListener(CMSHOW_SRV_CMD_CUSTOM_GAME_LOGIC, this);

        }

        this.reqCustomLogic = function (data, callback) {

            if (data != undefined) {
                this._customGameLogicCallBack = callback
                BK.MQQ.SsoRequest.addListener(CMSHOW_SRV_CMD_CUSTOM_GAME_LOGIC, this, this._event4CustomLogic.bind(this));
                BK.MQQ.SsoRequest.send(data, CMSHOW_SRV_CMD_CUSTOM_GAME_LOGIC);
            }
            else {
                BK.Script.log(0, 0, "reqCustomLogic data undefined!");
            }

        }


        this.hasJoinRoom = function () {
            return this.hasJoinRoomSucc;
        }

        this.hasStartGame = function () {
            return this.hasStartGameSucc;
        }

        // QQ -> Game
        this._event4PushMsg = function (errCode, cmd, data) {
            BK.Script.log(0, 0, "BK.QQ._event4PushMsg!errCode = " + errCode + " cmd = " + cmd + " data = " + JSON.stringify(data));
            if (this.delegate.onPushMsgEvent) {
                this.delegate.onPushMsgEvent(errCode, cmd, data);
            }
        }

        this._event4StopGame = function (errCode, cmd, data) {
            BK.Script.log(0, 0, "BK.QQ._event4StopGame!errCode = " + errCode + " cmd = " + cmd + " data = " + JSON.stringify(data));
            if (this.delegate.onStopGameEvent) {
                this.delegate.onStopGameEvent(errCode, cmd, data);
            }
        }

        this._closeRoom = function () {
            if (!this.hasStartGameSucc) {
                if (this.gameCfg.roomId && this.gameCfg.roomId != 0) {
                    if (this.gameCfg.isCreator) {
                        this.notifyCancelGameSrv();
                    } else {
                        this.notifyQuitGameSrv();
                    }
                }

            }
        }

        BK.MQQ.SsoRequest.addListener(CMSHOW_SC_CMD_PUSH_MSG, this, this._event4PushMsg.bind(this));
        BK.MQQ.SsoRequest.addListener(CMSHOW_SC_CMD_STOP_GAME, this, this._event4StopGame.bind(this));
    }
})();


BK.Room = function () {
    this.roomId;
    this.gameId;
    this.mId;
    this.ownerId;
    this.createTs;
    this.status;
    this.playerNum;
    this.ip0;
    this.ip1;
    this.msgSeq = 1;
    this.ackSeq;
    this.lastFrame = 0;
    this.startGameTs = 0;
    this.createRoomCallBack;
    this.queryRoomInfoCallBack;
    this.joinRoomCallBack;
    this.leaveRoomCallBack;
    this.startGameCallBack;
    this.broadcastDataCallBack;
    this.setUserDataCallBack;
    this.getUserDataCallBack;
    this.sendSyncOptCallBack;
    this.forceStopGameCallBack;
    this.frameSyncListener;
    this.queryFrameDataCallBack;
    this.matchGameCallBack;
    this.queryMatchGameCallBack;
    this.quitMatchGameCallBack;
    this.disconnectNetCallBack;
    this.reJoinRoomCallBack;
    this.socket = new BK.Socket;
    this.reqArray = new Array();
    this.newJoinPlayers = [];
    this.currentPlayers = [];
    this.isCreator = (GameStatusInfo.isMaster == 1) ? true : false;
    this.gameStatusInfo = GameStatusInfo;
    this.serverConnected;
    this._isDebug = false;
    this._environment = NETWORK_ENVIRONMENT_QQ_RELEASE;
    this.headerVersion = 0x0301;
    this.recommandRoomSvrHost = NormalRecommandRoomSvrHost;
    this.recommandRoomSvrPort = NormalRecommandRoomSvrPort;
    this.netTimeOutTs = 0;
    this.options = null;

    this.setArkData = function (modeWording)
    {
        BK.QQ.setArkData(modeWording);
    }
    this.setRoomVol = function(roomVol) {
        BK.QQ.roomVol = roomVol;
    }

	this.read32BytesToString = function (buff) {
        var str = ""
        for (var i = 0; i < 32; i++) {
            var ch = buff.readUint8Buffer();
            str = str + String.fromCharCode(ch);
        }
        return str
    }
    this.writeOpenIdIntoBuffer = function (buffer, openId) {
        var writeBuf = new BK.Buffer(32);
        if (openId.length == 32) {
            for (var i = 0; i < 32; i++) {
                var ascii = openId.charCodeAt(i);
                writeBuf.writeUint8Buffer(ascii);
            }
        } else {
            for (var i = 0; i < 32; i++) {
                writeBuf.writeUint8Buffer(0);
            }
            BK.Script.log(0, 0, "writeOpenIdIntoBuffer.length is not 32 bytes,Write empty data");
        }
        buffer.writeBuffer(writeBuf);
    }

    this.addHeader = function (header, len, stLen) {
        header.writeUint16Buffer(0x1234);
        header.writeUint16Buffer(this.headerVersion);
        header.writeUint16Buffer(0);
        header.writeUint16Buffer(stLen);
        header.writeUint32Buffer(len);
    }

    this.addFixedHeader = function (buff, cmd, gameId, roomId, fromId, toId, token, appId, accessToken) {
        if (toId == undefined) { toId = ""; }
        if (token == undefined) { token = 0; }
        if (appId == undefined) { appId = 0; }
        if (accessToken == undefined) { accessToken = 0; }

        buff.writeUint16Buffer(72);
        buff.writeUint16Buffer(cmd);
        buff.writeUint32Buffer(0);
        buff.writeUint64Buffer(1111);
        buff.writeUint64Buffer(gameId);
        buff.writeUint64Buffer(roomId);

        this.writeOpenIdIntoBuffer(buff, fromId);

        this.writeOpenIdIntoBuffer(buff, toId);

        buff.writeUint64Buffer(token);
        buff.writeUint64Buffer(appId);
        buff.writeUint64Buffer(accessToken);
    }

    this.getHeader = function (buff) {
        var magic = buff.readUint16Buffer();
        var ver = buff.readUint16Buffer();
        var seq = buff.readUint16Buffer();
        var stlen = buff.readUint16Buffer();
        var bodyLen = buff.readUint32Buffer();
        var header = new Object();
        header.magic = magic;
        header.ver = ver;
        header.stlen = stlen;
        header.bodyLen = bodyLen;
        header.seq = seq;
        return header;
    }

    this.getFixedHeader = function (buff) {
        var fixLen = buff.readUint16Buffer();
        var cmd = buff.readUint16Buffer();
        var ret = buff.readUint32Buffer();
        var date = buff.readUint64Buffer();
        var gameId = buff.readUint64Buffer();
        var roomId = buff.readUint64Buffer();
        var fromId = "";
        var toId = "";

        fromId = this.read32BytesToString(buff);
        toId = this.read32BytesToString(buff);

        var token = buff.readUint64Buffer();
        var appId = buff.readUint64Buffer();
        var accessToken = buff.readUint64Buffer();

        var fixHead = new Object();
        fixHead.fixLen = fixLen;
        fixHead.cmd = cmd;
        fixHead.ret = ret;
        fixHead.date = date;
        fixHead.gameId = gameId;
        fixHead.roomId = roomId;
        fixHead.fromId = fromId;
        fixHead.toId = toId;
        fixHead.token = token;
        fixHead.appId = appId;
        fixHead.accessToken = accessToken;

        return fixHead;
    }


    this.matchGame = function (gameId, openId, callback) {
        this.mId = openId;
        this.gameId = parseInt(gameId);
        var con = this.socket.connect(this.recommandRoomSvrHost, this.recommandRoomSvrPort);
        BK.Script.log(0, 0, "socket con =" + con);
        if (con == -1) {
            BK.Script.log(0, 0, "socket connect failed! " + con);
        } else {
            this.serverConnected = 1;
        }
        this.matchGameCallBack = callback;
        var funObj = new Object();
        funObj.cmd = 0x24;
        funObj.arg0 = gameId;
        funObj.arg1 = openId;
        this.reqArray.push(funObj);
        BK.Script.log(0, 0, "createRoom ");
    }

    this.requestMatch = function (gameId, openId) {
        BK.Script.log(0, 0, "match game request in");
        var body = new BK.Buffer(fixedHeaderLen, 1);
        this.addFixedHeader(body, 0x24, gameId, 0, openId);
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stLen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stLen, 1);
        this.addHeader(buff, body.bufferLength(), stLen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        BK.Script.log(0, 0, "match game request buffer : " + buff.bufferLength() + " body len:" + body.bufferLength());
        return buff;
    }

    this.queryMatchGame = function (gameId, openId, callback) {
        BK.Script.log(0, 0, "queryMatchGame in ");
        this.mId = openId;
        this.gameId = parseInt(gameId);
        this.queryMatchGameCallBack = callback;
        var funObj = new Object();
        funObj.cmd = 0x26;
        funObj.arg0 = gameId;
        funObj.arg1 = openId;
        this.reqArray.push(funObj);
    }

    this.requestQueryMatch = function (gameId, openId) {
        BK.Script.log(0, 0, "query match game request in");
        var body = new BK.Buffer(fixedHeaderLen, 1);
        this.addFixedHeader(body, 0x26, gameId, 0, openId);
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stLen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stLen, 1);
        this.addHeader(buff, body.bufferLength(), stLen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        BK.Script.log(0, 0, "query match game request buffer : " + buff.bufferLength() + " body len:" + body.bufferLength());
        return buff;
    }

    this.quitMatchGame = function (gameId, openId, callback) {
        BK.Script.log(0, 0, "quitMatchGame in ");
        this.mId = openId;
        this.gameId = parseInt(gameId);
        this.quitMatchGameCallBack = callback;
        var funObj = new Object();
        funObj.cmd = 0x28;
        funObj.arg0 = gameId;
        funObj.arg1 = openId;
        this.reqArray.push(funObj);
    }

    this.requestQuitMatch = function (gameId, openId) {
        BK.Script.log(0, 0, "quit match game request in");
        var body = new BK.Buffer(fixedHeaderLen, 1);
        this.addFixedHeader(body, 0x28, gameId, 0, openId);
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stLen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stLen, 1);
        this.addHeader(buff, body.bufferLength(), stLen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        BK.Script.log(0, 0, "quit match game request buffer : " + buff.bufferLength() + " body len:" + body.bufferLength());
        return buff;
    }

    this.createRoom = function (gameId, openId, callback) {
        this.mId = openId;
        this.gameId = parseInt(gameId);
        if (this.serverConnected != 1) {
            var con = this.socket.connect(this.recommandRoomSvrHost, this.recommandRoomSvrPort);
            BK.Script.log(0, 0, "socket con =" + con);
            if (con == -1) {
                BK.Script.log(0, 0, "socket connect failed! " + con);
            } else {
                this.serverConnected = 1;
            }
        }

        this.createRoomCallBack = callback;
        var funObj = new Object();
        funObj.cmd = 0x6;
        funObj.arg0 = gameId;
        funObj.arg1 = openId;
        this.reqArray.push(funObj);
        BK.Script.log(0, 0, "createRoom ");
    }

    this.requestCreateRoom = function (gameId, openId) {
        BK.Script.log(0, 0, "create room request in");
        var body = new BK.Buffer(fixedHeaderLen, 1);
        this.addFixedHeader(body, 0x6, gameId, 0, openId);
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stLen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stLen, 1);
        this.addHeader(buff, body.bufferLength(), stLen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        BK.Script.log(0, 0, "create room request buffer : " + buff.bufferLength() + " body len:" + body.bufferLength());
        return buff;
    }

    this.requestQueryRoom = function () {
        var body = new BK.Buffer(fixedHeaderLen, 1);
        this.addFixedHeader(body, 0xa, this.gameId, this.roomId, this.mId);
        var st = BK.Security.getST();

        BK.Security.encrypt(body);
        var stlen = st.bufferLength();

        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buff, body.bufferLength(), stlen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        return buff;
    }

    this.queryRoom = function (gameId, roomId, fromId, callback) {
        this.mId = fromId;
        this.roomId = parseFloat(roomId);
        this.gameId = parseInt(gameId);;
        this.queryRoomInfoCallBack = callback;
        var funObj = new Object();
        funObj.cmd = 0xa;
        this.reqArray.push(funObj);
        BK.Script.log(0, 0, "queryRoom push");
    }

    this.joinRoom = function (src, callback, notify) {
        this.joinRoomCallBack = callback;
        BK.QQ.isAutoSendJoinRoomNotify = (notify?notify:1);
        BK.Script.log(0, 0, "BK.QQ.notifyJoinroom isDisableSendMsg   isAuto: "+notify + "           isAutoSendJoin:  "+BK.QQ.isAutoSendJoinRoomNotify);
        var funObj = new Object();
        funObj.cmd = 0x2;
        funObj.arg0 = src;
        this.reqArray.push(funObj);
    }

    this.requestJoinRoom = function (src) {

        BK.Script.log(0, 0, "join room request");
        var body = new BK.Buffer(fixedHeaderLen + 5, 1);
        this.addFixedHeader(body, 0x2, this.gameId, this.roomId, this.mId);

        var tlv = new BK.TLV(5);
        tlv.bkJSTLVWriteUInt8(src, TLVType.Uint8, 201);
        body.writeBuffer(tlv.bkJSTLVGetBuffer());
        var st = BK.Security.getST();

        BK.Security.encrypt(body);
        var stlen = st.bufferLength();

        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buff, body.bufferLength(), stlen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);

        return buff;
    }

    this.setReJoinRoomCallBack = function (callback) {
        this.reJoinRoomCallBack = callback;
    }
    this.reConnectAndJoinRoom = function () {
        var con = this.socket.connect(this.gameSvrIp, this.gameSvrPort);
        BK.Script.log(0, 0, "socket con =" + con);
        if (con == -1) {
            BK.Script.log(0, 0, "socket connect failed! " + con);
            return -1;
        } else {
            this.serverConnected = 1;
        }

        if (con == 0) {
            BK.Script.log(0, 0, "socket connect =0 ");
        }

        if (con >= 0) {
            BK.Script.log(0, 0, "rejoinroom send");

            this.joinRoom(1, function (statusCode, room) {
                BK.Script.log(0, 0, "rejoinroom statusCode:" + statusCode + " roomid is " + room.roomId);
                if (this.reJoinRoomCallBack) {
                    this.reJoinRoomCallBack(statusCode);
                }
            });
        }
    }

    this.leaveRoom = function (callback, reason) {
        if (reason == undefined) { reason = -1; };
        var funObj = new Object();
        funObj.cmd = 0x4;
        funObj.arg0 = reason;
        this.reqArray.push(funObj);
        this.leaveRoomCallBack = callback;
        BK.Script.log(0, 0, "leaveRoom push");
    }

    this.setLeaveRoomCallback = function (callback) {
        this.leaveRoomCallBack = callback;
    }

    this.requestLeaveRoom = function (reason) {

        var tlv = new BK.TLV(40 + 4);
        var buf = new BK.Buffer(40, 1);
        this.writeOpenIdIntoBuffer(buf, this.mId);

        buf.writeUint64Buffer(reason);
        tlv.bkJSTLVWriteBuffer(buf, TLVType.Byte, 201);

        var body = new BK.Buffer(fixedHeaderLen + tlv.bkJSTLVGetLength(), 1);
        this.addFixedHeader(body, 0x4, this.gameId, this.roomId, this.mId);
        body.writeBuffer(tlv.bkJSTLVGetBuffer());

        var st = BK.Security.getST();
        var stlen = st.bufferLength();;
        BK.Security.encrypt(body);
        buff = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buff, body.bufferLength(), stlen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);

        BK.Script.log(0, 0, "leave room buffer : " + buff.bufferLength() + " body len:" + body.bufferLength());

        return buff;
    }

    this.startGame = function (callback) {
        this.startGameCallBack = callback;
        var funObj = new Object();
        funObj.cmd = 0x8;
        this.reqArray.push(funObj);
        BK.Script.log(0, 0, "startGame push");
    }

    this.setStartGameCallback = function (callback) {
        this.startGameCallBack = callback;
    }

    this.requestStartGame = function () {
        var body = new BK.Buffer(fixedHeaderLen, 1);
        this.addFixedHeader(body, 0x8, this.gameId, this.roomId, this.mId);
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stlen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buff, body.bufferLength(), stlen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);

        return buff;
    }

    this.setBroadcastDataCallBack = function (callback) {
        this.broadcastDataCallBack = callback;
    }

    this.sendBroadcastData = function (buff) {
        var funObj = new Object();
        funObj.cmd = 0x1;
        funObj.arg0 = buff;
        this.reqArray.push(funObj);
    }

	this.requestsendBroadcastData = function (buf) {
		var bufLen = buf.capacity ? buf.capacity : buf.bufferLength();
		var body = new BK.Buffer(fixedHeaderLen + bufLen, 1);
		this.addFixedHeader(body, 0x1, this.gameId, this.roomId, this.mId);
        body.writeBuffer(buf);
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stlen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buff, body.bufferLength(), stlen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);

        return buff;
    }

    this.setUserData = function (buff, callback) {
        BK.Script.log(0, 0, "setUserData call");

        this.setUserDataCallBack = callback;
        var funObj = new Object();
        funObj.cmd = 0x20;
        funObj.arg0 = buff;
        this.reqArray.push(funObj);
        BK.Script.log(0, 0, "setUserData push");

    }

	this.requestSetUserData = function (buf) {
		var bufLen = buf.capacity ? buf.capacity : buf.bufferLength();
		var body = new BK.Buffer(fixedHeaderLen + bufLen, 1);
		this.addFixedHeader(body, 0x20, this.gameId, this.roomId, this.mId);
        body.writeBuffer(buf);
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stlen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buff, body.bufferLength(), stlen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        return buff;
    }

    this.getUserData = function (roomId, callback) {
        if (roomId == undefined) { roomId = 0; }
        this.getUserDataCallBack = callback;
        var funObj = new Object();
        funObj.cmd = 0x22;
        funObj.arg0 = roomId;
        this.reqArray.push(funObj);
        BK.Script.log(0, 0, "getUserData push roomId = " + roomId);
    }

    this.requestGetUserData = function (roomId) {
        var body = new BK.Buffer(fixedHeaderLen, 1);
        this.addFixedHeader(body, 0x22, this.gameId, this.roomId, this.mId);
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stlen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buff, body.bufferLength(), stlen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);
        return buff;
    }

    this.syncOpt = function (statusBuf, optBuf, extendBuf, itemListBuf, callback) {
        this.sendSyncOptCallBack = callback;
        var funObj = new Object();;
        funObj.cmd = 0xe;
        funObj.arg0 = statusBuf;
        funObj.arg1 = optBuf;
        funObj.arg2 = extendBuf;
        funObj.arg3 = itemListBuf;
        this.reqArray.push(funObj);
    }

    this.sendSyncOpt = function (opt, callback) {
        var status = new BK.Buffer(1, 1);
        status.writeUint8Buffer(0);

        //预留字段
        var extend = new BK.Buffer(1, 1);
        extend.writeUint8Buffer(0);

        //send
        this.syncOpt(status, opt, extend, undefined, callback);
    }

    this.requestSyncOpt = function (statusBuf, optBuf, extendBuf, itemListBuf) {
        var statusBufLen = statusBuf.capacity ? statusBuf.capacity : statusBuf.bufferLength();
        var optBufLen = optBuf.capacity ? optBuf.capacity : optBuf.bufferLength();
        var extendBufLen = extendBuf.capacity ? extendBuf.capacity : extendBuf.bufferLength();

        var sendTlvLen = 8 + 8 + 4 + statusBufLen + 4 + optBufLen + 4 + extendBufLen;
        if (itemListBuf) {
            var itemListBufLen = itemListBuf.capacity ? itemListBuf.capacity : itemListBuf.bufferLength();
            sendTlvLen = sendTlvLen + 4 + itemListBufLen;
            BK.Script.log(0, 0, "requestSyncOpt with item len" + itemListBufLen);
        }

        var tlv = new BK.TLV(sendTlvLen);
        tlv.bkJSTLVWriteUInt32(this.msgSeq, TLVType.Uint32, 201);
        tlv.bkJSTLVWriteUInt32(this.lastFrame, TLVType.Uint32, 202);
        tlv.bkJSTLVWriteBuffer(statusBuf, TLVType.Byte, 203);
        tlv.bkJSTLVWriteBuffer(optBuf, TLVType.Byte, 204);
        tlv.bkJSTLVWriteBuffer(extendBuf, TLVType.Byte, 205);
        if (itemListBuf) {
            tlv.bkJSTLVWriteBuffer(itemListBuf, TLVType.Byte, 206);
        }

        BK.Script.log(0, 0, "requestSyncOpt this.msgSeq:" + this.msgSeq + " this.lastFrame:" + this.lastFrame);

        var res = tlv.bkJSParseTLV();

        BK.Script.log(0, 0, "requestSyncOpt tlv len:" + tlv.bkJSTLVGetLength() + " fix header:" + fixedHeaderLen)

        var body = new BK.Buffer(fixedHeaderLen + tlv.bkJSTLVGetLength(), 1);

        this.addFixedHeader(body, 0xe, this.gameId, this.roomId, this.mId);
        body.writeBuffer(tlv.bkJSTLVGetBuffer());

        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stlen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buff, body.bufferLength(), stlen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);

        this.msgSeq += 1;
        return buff;
    }

    this.setFrameSyncListener = function (listener) {
        this.frameSyncListener = listener;
    }

    this.queryFrameData = function (beginFrame, count, callback) {
        this.queryFrameDataCallBack = callback;
        var funObj = new Object();
        funObj.cmd = 0x12;
        funObj.arg0 = beginFrame;
        funObj.arg1 = count;
        this.reqArray.push(funObj);
    }

    this.requestQueryFrameData = function (beginFrame, count) {
        var tlv = new BK.TLV(8 + 8 + 6);
        tlv.bkJSTLVWriteUInt32(this.lastFrame, TLVType.Uint32, 201);
        tlv.bkJSTLVWriteUInt32(beginFrame, TLVType.Uint32, 202);
        tlv.bkJSTLVWriteUInt16(count, TLVType.Uint16, 203);

        var body = new BK.Buffer(fixedHeaderLen + tlv.bkJSTLVGetLength(), 1);
        this.addFixedHeader(body, 0x12, this.gameId, this.roomId, this.mId);
        body.writeBuffer(tlv.bkJSTLVGetBuffer());

        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stlen = st.bufferLength();
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buff, body.bufferLength(), stlen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);

        return buff;
    }

    this.sendControlCommand = function(subcmd, data, openKey, callback) {
		var funObj = new Object();
		funObj.cmd = 0x30;
		funObj.arg0 = subcmd;
		funObj.arg1 = data;
		funObj.arg2 = openKey;
		this.reqArray.push(funObj);
        this.controlCommandCallback = callback;
	}

	this.requestControlCommand = function(subcmd, data, openkey) {
		/*
			subcmd: 对应对外映射的命令码
			data: 用户上行请求参数
		*/
		var tlv = new BK.TLV(14 + data.bufferLength() + openkey.bufferLength()); // 4 + datalen + 4 + subcmd + 4 + openkey
		tlv.bkJSTLVWriteBuffer(data, TLVType.Byte, 201);
		tlv.bkJSTLVWriteUInt16(subcmd,TLVType.Uint16, 202);
		tlv.bkJSTLVWriteBuffer(openkey, TLVType.Byte, 203);
		var body = new BK.Buffer(fixedHeaderLen + tlv.bkJSTLVGetLength(), 1);
		this.addFixedHeader(body, 0x30, this.gameId, this.roomId, this.mId);
		body.writeBuffer(tlv.bkJSTLVGetBuffer());

		BK.Security.encrypt(body);

		var st = BK.Security.getST();
		var stlen = st.bufferLength();
		var buffer = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
		this.addHeader(buffer, body.bufferLength(), stlen);
		buffer.writeBuffer(st);
		buffer.writeBuffer(body);
		return buffer;
	}


    this.sendKeepAlive = function () {
        var funObj = new Object();
        funObj.cmd = 0xc;
        this.reqArray.push(funObj);
		if (this.netTimeOutTs != 0) {
            var now = BK.Time.timestamp;
            var netCost = now - this.netTimeOutTs;


            if (netCost > 5) {
                if (this.disconnectNetCallBack) {

                    this.disconnectNetCallBack();
                }


            }
        } else {

        }
    }

    this.requestSendKeepAlive = function () {
        var body = new BK.Buffer(fixedHeaderLen, 1);
        this.addFixedHeader(body, 0xc, this.gameId, this.roomId, this.mId);
        var st = BK.Security.getST();
        BK.Security.encrypt(body);
        var stlen = st.bufferLength();;
        var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stlen, 1);
        this.addHeader(buff, body.bufferLength(), stlen);
        buff.writeBuffer(st);
        buff.writeBuffer(body);

        return buff;
    }


    this.recvCreateRoom = function (buff, bodyLen) {
        BK.Script.log(0, 0, "recvCreateRoom bodyLen=" + bodyLen);

        var tlvBuff = buff.readBuffer(bodyLen);
        var tlv = new BK.TLV(tlvBuff);
        var res = tlv.bkJSParseTLV();
        if (res) {
            var buffer = res.tag202;
            var ipType = buffer.readUint8Buffer();
            var resServe = buffer.readUint8Buffer();
            var port = buffer.readUint16Buffer();
            buffer.readUint64Buffer();
            buffer.readUint32Buffer();
            var ip0 = buffer.readUint8Buffer();
            var ip1 = buffer.readUint8Buffer();
            var ip2 = buffer.readUint8Buffer();
            var ip3 = buffer.readUint8Buffer();

            var buffer2 = res.tag201;
            var ipType2 = buffer2.readUint8Buffer();
            var resServe2 = buffer2.readUint8Buffer();
            var port2 = buffer2.readUint16Buffer();
            buffer2.readUint64Buffer();
            buffer2.readUint32Buffer();
            var ip0_2 = buffer2.readUint8Buffer();
            var ip1_2 = buffer2.readUint8Buffer();
            var ip2_2 = buffer2.readUint8Buffer();
            var ip3_2 = buffer2.readUint8Buffer();

            var netAddr = new Object();
            netAddr.ipType_1 = ipType;
            netAddr.resServe_1 = resServe;
            netAddr.ipType_2 = ipType2;
            netAddr.resServe_2 = resServe2;
            netAddr.port_1 = port;
            netAddr.ip_1 = ip0 + "." + ip1 + "." + ip2 + "." + ip3;
            netAddr.port_2 = port2;
            netAddr.ip_2 = ip0_2 + "." + ip1_2 + "." + ip2_2 + "." + ip3_2;

            this.ip0 = netAddr.ip_1;
            this.ip1 = netAddr.ip_2;

            return netAddr;
        } else {
            BK.Script.log(0, 0, "recvCreateRoom parse failed.");
            return undefined;
        }
    }

    this.recvQueryRoom = function (buff, bodyLen) {
        BK.Script.log(0, 0, "recvQueryRoom bodyLen:" + bodyLen);
        var tlvBuff = buff.readBuffer(bodyLen);
        var tlv = new BK.TLV(tlvBuff);
        var res = tlv.bkJSParseTLV();
        if (res) {
            var buffer = res.tag202;
            var ipType = buffer.readUint8Buffer();
            var resServe = buffer.readUint8Buffer();
            var port = buffer.readUint16Buffer();
            buffer.readUint64Buffer();
            buffer.readUint32Buffer();
            var ip0 = buffer.readUint8Buffer();
            var ip1 = buffer.readUint8Buffer();
            var ip2 = buffer.readUint8Buffer();
            var ip3 = buffer.readUint8Buffer();

            var buffer2 = res.tag201;
            var ipType2 = buffer2.readUint8Buffer();
            var resServe2 = buffer2.readUint8Buffer();
            var port2 = buffer2.readUint16Buffer();
            buffer2.readUint64Buffer();
            buffer2.readUint32Buffer();
            var ip0_2 = buffer2.readUint8Buffer();
            var ip1_2 = buffer2.readUint8Buffer();
            var ip2_2 = buffer2.readUint8Buffer();
            var ip3_2 = buffer2.readUint8Buffer();

            var buffer3 = res.tag203;
            var ownerId = this.read32BytesToString(buffer3)
            var createTs = buffer3.readUint64Buffer();
            var status = buffer3.readUint8Buffer();
            var playerNum = buffer3.readUint8Buffer();

            var ext_num = res.tag205;
            if (ext_num == undefined) {
                ext_num = 0;
            }

            var players = [];
            for (var i = 0; i < playerNum; i++) {
                var player = {};
                player.uid = this.read32BytesToString(buffer3);;
                player.status = buffer3.readUint8Buffer();;
                players.push(player);
            }

            var roomInfo = new Object();
            roomInfo.ipType_1 = ipType;
            roomInfo.resServe_1 = resServe;
            roomInfo.ipType_2 = ipType2;
            roomInfo.resServe_2 = resServe2;
            roomInfo.port_1 = port;
            roomInfo.ip_1 = ip0 + "." + ip1 + "." + ip2 + "." + ip3;
            roomInfo.port_2 = port2;
            roomInfo.ip_2 = ip0_2 + "." + ip1_2 + "." + ip2_2 + "." + ip3_2;

            roomInfo.ownerId = ownerId;
            roomInfo.createTs = createTs;
            roomInfo.status = status;
            roomInfo.playerNum = playerNum;
            roomInfo.ext_num = ext_num;

            this.ip0 = roomInfo.ip_1;
            this.ip1 = roomInfo.ip_2;
            this.ownerId = ownerId;
            this.createTs = createTs;
            this.status = status;
            this.playerNum = playerNum;
            this.players = players;
            return roomInfo;
        } else {
            BK.Script.log(0, 0, "recvQueryRoom parse failed.bodyLen is 0");
            return undefined;
        }
    }

    this.recvJoinRoom = function (buff, bodyLen) {

        var tlvBuff = buff.readBuffer(bodyLen);
        var tlv = new BK.TLV(tlvBuff);
        var res = tlv.bkJSParseTLV();
        var buffer = res.tag201;
        var ownerId = this.read32BytesToString(buffer)
        var createTs = buffer.readUint64Buffer();
        var status = buffer.readUint8Buffer();
        var playerNum = buffer.readUint8Buffer();
        var players = [];
        for (var i = 0; i < playerNum; i++) {
            var player = {};

            var openid = this.read32BytesToString(buffer);
            var joinTs = buffer.readUint64Buffer();
            var status = buffer.readUint8Buffer();

            player["openId"] = openid;
            player.status = status;
            player.joinTs = joinTs;
            players.push(player);

        }

        this.ownerId = ownerId;
        this.createTs = createTs;
        this.status = status;
        this.playerNum = playerNum;

        if (this.currentPlayers.length == 0) {
            players.forEach(function (element) {
                this.newJoinPlayers.push(element);
            }, this);
        } else {
            var tmpArray = [];
            BK.Script.log(0, 0, "recvJoinRoom!curPlayers = " + JSON.stringify(this.currentPlayers));
            BK.Script.log(0, 0, "recvJoinRoom!joinPlayers = " + JSON.stringify(players));
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                var isFormerJoin = false;
                for (var j = 0; j < this.currentPlayers.length; j++) {
                    var formerNewJoinPlayer = this.currentPlayers[j];
                    if (formerNewJoinPlayer.openId == player.openId) {
                        isFormerJoin = true;
                        break;
                    }
                }

                if (isFormerJoin == false) {
                    tmpArray.push(player);
                }
            }

            this.newJoinPlayers = tmpArray;
            BK.Script.log(0, 0, "recvJoinRoom!newPlayers = " + JSON.stringify(this.newJoinPlayers));
        }

        this.currentPlayers = players;
        BK.Script.log(0, 0, "recvJoinRoom ownerId=" + ownerId + ",createTs =" + createTs + ",playerNum:" + playerNum);
    }

    this.recvLeaveRoom = function (buff, bodyLen) {
        var tlvBuff = buff.readBuffer(bodyLen);
        var tlv = new BK.TLV(tlvBuff);
        var res = tlv.bkJSParseTLV();
        if (res) {
            var buffer = res.tag201;
            var logOutId = this.read32BytesToString(buffer)
            var reason = buff.readUint64Buffer();
            var leaveInfo = new Object();
            BK.Script.log(0, 0, "recvLeaveRoom!ret = " + reason);
            leaveInfo.reason = reason;
            leaveInfo.logOutId = logOutId;
            this.currentPlayers.splice(this.currentPlayers.indexOf(logOutId));
            return leaveInfo;
        } else {
            BK.Script.log(0, 0, "recvLeaveRoom parse failed.bodylen is " + bodyLen);
            return undefined;
        }
    }

    this.recvStartGame = function (buff, bodyLen) {
        this.startGameTs = BK.Time.timestamp;
        BK.Script.log(0, 0, "recvStartGame");
    }

    this.recvPushFrameSync = function (buff, bodyLen) {
        var tlvBuff = buff.readBuffer(bodyLen);
        var tlv = new BK.TLV(tlvBuff);
        var res = tlv.bkJSParseTLV();
        var needAck = res.tag201;
        var isFinish = res.tag202;
        var frameData = res.tag203;
        var frameDataArr = new Array();
        for (var i = 0; i < frameData.length; i++) {

            var frameSeq = frameData[i].readUint32Buffer();
            this.lastFrame = frameSeq;

            var len = frameData[i].bufferLength() - 4;
            BK.Script.log(0, 0, "sync recv len= " + frameData[i].bufferLength() + " frameData.length=" + frameData.length);

            var userDataArr = new Array();
            while (len > 0) {
                BK.Script.log(0, 0, "push frameNo=" + this.lastFrame);

                var dataLen = frameData[i].readUint16Buffer();

                BK.Script.log(0, 0, "push databuf 2 datalen=" + dataLen);
                var openid = this.read32BytesToString(frameData[i]);
                var itemid = frameData[i].readUint64Buffer();

                var dataBuf = frameData[i].readBuffer(dataLen);

                var userData = {
                    "openId": openid,
                    "itemId": itemid,
                    "dataBuffer": dataBuf
                }
                BK.Script.log(0, 0, "push databuf openid=" + openid);
                BK.Script.log(0, 0, "push databuf itemid=" + itemid);

                userDataArr.push(userData);
                len -= (2 + 32 + 8);
                len -= dataLen;
            }
            userDataArr.frameSeq = frameSeq;
            frameDataArr.push(userDataArr);
        }

        this.frameSyncListener(frameDataArr);
    }

    this.recvQueryFrameSync = function (buff, bodyLen) {
        var tlvBuff = buff.readBuffer(bodyLen);
        var tlv = new BK.TLV(tlvBuff);
        var res = tlv.bkJSParseTLV();
        if (!res) {
            BK.Script.log(0, 0, "recvQueryFrameSync empty.");
            this.queryFrameDataCallBack(0,undefined);
            return ;
        }
        var frameData = res.tag201;
        var frameDataArr = new Array();
        for (var i = 0; i < frameData.length; i++) {
            frameData[i].readUint32Buffer();
            var len = frameData[i].bufferLength() - 4;
            BK.Script.log(0, 0, "sync query recv = " + frameData[i].bufferLength() + " frameData.length=" + frameData.length);

            var userDataArr = new Array();
            while (len > 0) {
                BK.Script.log(0, 0, "push frameNo=" + this.lastFrame);

                var dataLen = frameData[i].readUint16Buffer();

                BK.Script.log(0, 0, "push databuf 2 datalen=" + dataLen);
                var openid = this.read32BytesToString(frameData[i]);
                var itemid = frameData[i].readUint64Buffer();

                var dataBuf = frameData[i].readBuffer(dataLen);

                var userData = {
                    "openId": openid,
                    "itemId": itemid,
                    "dataBuffer": dataBuf
                }
                BK.Script.log(0, 0, "push databuf openid=" + openid);
                BK.Script.log(0, 0, "push databuf itemid=" + itemid);

                userDataArr.push(userData);
                len -= (2 + 32 + 8);
                len -= dataLen;
            }
            frameDataArr.push(userDataArr);
        }
        BK.Script.log(0, 0, "query end");

        this.queryFrameDataCallBack(0,frameDataArr);
    }

    this.recvControlCommand = function(buffer, bodylen) {
		var body = buffer.readBuffer(bodylen);
		var tlv = new BK.TLV(body);
		var res = tlv.bkJSParseTLV();
        var resp = {};
		if (res.tag201) {
			resp = JSON.parse(res.tag201.readAsString());
		}
        if (this.controlCommandCallback) {
            this.controlCommandCallback(0, resp);
        }
	}

	this.recvSSOJoinRoom = function (errCode, cmd, data) {
		BK.Script.log(1, 1, "recvSSOJoinRoom = true data=" + JSON.stringify(data));
		if (errCode == 0) {
			var avRoomId = data.data.avRoomId;
			var appId = data.data.sdkAppId;
			var accountType = data.data.accountType;
			GameStatusInfo.avAppId = appId;
			GameStatusInfo.avAccountType = accountType;
			GameStatusInfo.avRoomId = avRoomId;
			GameStatusInfo.roomId = this.roomId;
		}
	}

	this.handleServerError = function (fixedHeader) {
        BK.Script.log(0, 1, "handleServerError!cmd = " + fixedHeader.cmd + ", errCode = " + fixedHeader.ret);


        switch (fixedHeader.cmd) {
            case 0x7:
                this.roomId = fixedHeader.roomId;
                this.createRoomCallBack(header.ret, null, fixedHeader.roomId);
                break;
            case 0xb:
                this.queryRoomInfoCallBack(fixedHeader.ret, null);
                break;
            case 0x3:
                //1.callback
                this.joinRoomCallBack(fixedHeader.ret, this);
                break;
            case 0x5:
                this.leaveRoomCallBack(fixedHeader.ret, null);
                break;
            case 0x9:
                this.startGameCallBack(fixedHeader.ret);
                break;
            case 0x1:
                this.broadcastDataCallBack(fixedHeader.fromId, null);
                break;
            case 0x21:
                this.setUserDataCallBack(fixedHeader.ret);
                break;
            case 0x23:
                this.getUserDataCallBack(fixedHeader.ret, null);
                break;
            case 0xf:
                this.sendSyncOptCallBack();
                break;
            case 0x10:
                break;
            case 0x13:
                this.queryFrameDataCallBack(fixedHeader.ret, null);
                break;
            case 0x25:
                this.matchGameCallBack(fixedHeader.ret);
                break;
            case 0x27:
                this.queryMatchGameCallBack(fixedHeader.ret);
                break;
            case 0x29:
                this.quitMatchGameCallBack(fixedHeader.ret);
                break;
            case 0x31: {
                this.controlCommandCallback && this.controlCommandCallback(fixedHeader.ret, {});
				break;
			}
        }
    }

	this.handleRecv = function (buff) {

        var header = this.getHeader(buff);
        if (header.stlen != 0) {
            var st = buff.readBuffer(header.stlen);
            BK.Script.log(0, 0, "st.len = " + header.stlen);
        }
        var body = buff.readBuffer(header.bodyLen);
        BK.Security.decrypt(body);
        var fixedHeader = this.getFixedHeader(body);

        this.netTimeOutTs = 0;


        if (fixedHeader.ret != 0) {
            this.handleServerError(fixedHeader);
            return;
        }

        BK.Script.log(0, 0, "handleRecv = " + fixedHeader.cmd + ",bodyLen=" + header.bodyLen + ",bodyreal=" + body.bufferLength());


        switch (fixedHeader.cmd) {
            case 0x7:
                this.roomId = fixedHeader.roomId;
                var addr = this.recvCreateRoom(body, body.bufferLength() - fixedHeaderLen);
                BK.Script.log(0, 0, "magic = " + header.magic + ",stlen = " + header.stlen + ",bodyLen=" + header.bodyLen + ",cmd=" + fixedHeader.cmd + ",roomId=" + fixedHeader.roomId);
                this.createRoomCallBack(fixedHeader.ret, addr, fixedHeader.roomId);

                //notifiy mqq created room
                BK.QQ.notifyNewRoom(this.roomId, fixedHeader.ret);
                break;
            case 0xb:
                var roomInfo = this.recvQueryRoom(body, body.bufferLength() - fixedHeaderLen);
                this.queryRoomInfoCallBack(fixedHeader.ret, roomInfo);
                BK.Script.log(0, 0, "magic = " + header.magic + ",stlen = " + header.stlen + ",bodyLen=" + header.bodyLen + ",cmd=" + fixedHeader.cmd + ",roomId=" + fixedHeader.roomId);
                break;
            case 0x3:
                this.recvJoinRoom(body, body.bufferLength() - fixedHeaderLen);
                //1.callback
                this.joinRoomCallBack(fixedHeader.ret, this);

                //2.notify cmshow server
                for (var i = 0; i < this.newJoinPlayers.length; i++) {
                    if (this.newJoinPlayers[i].openId == currentPlayerOpenId) {
						BK.QQ.ssoJoinRoomCallback = this.recvSSOJoinRoom.bind(this);
						BK.QQ.notifyNewOrJoinRoomSrv(this.newJoinPlayers, this.roomId, this.ownerId == GameStatusInfo.openId ? 1 : 2);
                        return;
                    }
                }
                //3.notify mqq some one join room
                BK.QQ.notifyJoinRoom(this.newJoinPlayers, {}, fixedHeader.ret);
                break;
            case 0x5:
                var leaveInfo = this.recvLeaveRoom(body, body.bufferLength() - fixedHeaderLen);
                if (this.leaveRoomCallBack) {
                    this.leaveRoomCallBack(fixedHeader.ret, leaveInfo);
                }
                break;
            case 0x9:
                this.recvStartGame(body, body.bufferLength() - fixedHeaderLen);
                this.startGameCallBack(fixedHeader.ret);
                BK.QQ.notifyStartGameSrv();
                break;
            case 0x1:
                var buf = body.readBuffer(body.bufferLength() - fixedHeaderLen);
                this.broadcastDataCallBack(fixedHeader.fromId, buf, fixedHeader.toId);
                break;
            case 0x21:
                var buf = body.readBuffer(body.bufferLength() - fixedHeaderLen);
                this.setUserDataCallBack(fixedHeader.ret);
                break;
            case 0x23:
                var buf = body.readBuffer(body.bufferLength() - fixedHeaderLen);
                this.getUserDataCallBack(fixedHeader.ret, buf);
                break;
            case 0xf:
                var ack = body.readUint32Buffer();
                this.ackSeq = ack;
                this.sendSyncOptCallBack();
                break;
            case 0x10:
                this.recvPushFrameSync(body, body.bufferLength() - fixedHeaderLen);
                break;
            case 0x13:
                this.recvQueryFrameSync(body, body.bufferLength() - fixedHeaderLen);
                break;
            case 0x25:
                this.matchGameCallBack(fixedHeader.ret);
                break;
            case 0x27:
                this.roomId = fixedHeader.roomId;
                this.queryMatchGameCallBack(fixedHeader.ret);
                break;
            case 0x29:
                this.roomId = fixedHeader.roomId;
                this.quitMatchGameCallBack(fixedHeader.ret);
                break;
            case 0x31: {
				this.recvControlCommand(body, body.bufferLength() - fixedHeaderLen);
				break;
			}
        }
    }

    this.requestSocket = function (funObj) {
        var buff;
        BK.Script.log(0, 0, "requestSocket = " + funObj.cmd);

        switch (funObj.cmd) {
            case 0x6:
                buff = this.requestCreateRoom(funObj.arg0, funObj.arg1);
                break;
            case 0xa:
                buff = this.requestQueryRoom();
                break;
            case 0x2:
                buff = this.requestJoinRoom(funObj.arg0);
                break;
            case 0x4:
                buff = this.requestLeaveRoom(funObj.arg0);
                break;
            case 0x8:
                buff = this.requestStartGame();
                break;
            case 0x1:
                buff = this.requestsendBroadcastData(funObj.arg0);
                break;
            case 0x20:
                buff = this.requestSetUserData(funObj.arg0);
                break;
            case 0x22:
                buff = this.requestGetUserData(funObj.arg0);
                break;
            case 0xe:
                buff = this.requestSyncOpt(funObj.arg0, funObj.arg1, funObj.arg2, funObj.arg3);
                break;
            case 0x12:
                buff = this.requestQueryFrameData(funObj.arg0, funObj.arg1);
                break;
            case 0x24:
                buff = this.requestMatch(funObj.arg0, funObj.arg1);
                break;
            case 0x26:
                buff = this.requestQueryMatch(funObj.arg0, funObj.arg1);
                break;
            case 0x28:
                buff = this.requestQuitMatch(funObj.arg0, funObj.arg1);
                break;
            case 0xc:

                buff = this.requestSendKeepAlive();
                if (this.netTimeOutTs == 0) {
                    this.netTimeOutTs = BK.Time.timestamp;
                }
                break;
            case 0x30: {
				var data = new BK.Buffer();
				var openkey = new BK.Buffer();
				data.writeAsString(funObj.arg1);
				openkey.writeAsString(funObj.arg2);
				buff = this.requestControlCommand(funObj.arg0, data, openkey);
				break;
			}
        }
        if (buff != undefined) {
            BK.Script.log(0, 0, "requestSocket = " + funObj.cmd);
            this.socket.send(buff);
        }
    }

    this.seperatePackHandle = function () {
        while (true) {

            var checkBuff = this.socket.receiveNotRemove();
            var totalLen = checkBuff.bufferLength();
            var header = this.getHeader(checkBuff);

            //先取出包头，计算最前的一个包的大小
            var onePackLen = header.stlen + header.bodyLen + HeaderLen;

            BK.Script.log(0, 0, "this.socket.receive():totalLen = " + totalLen + "  onePackLen=" + onePackLen);
            //如果只有一个包直接处理
            if (totalLen == onePackLen) {
                BK.Script.log(0, 0, "  this.socket.receive():onePackLen=" + onePackLen);
                var rBuf = this.socket.receive(onePackLen);
                if (rBuf != undefined) {
                    this.handleRecv(rBuf);
                }
                break;
            }
            //该包只有一部分
            else if (totalLen < onePackLen) {
                BK.Script.log(0, 0, "  this.socket.receive():part of onePackLen=" + onePackLen);
                break;
            }
            //多包组合的情况，
            else if (totalLen > onePackLen) {
                BK.Script.log(0, 0, "  this.socket.receive():Multipacks onePackLen=" + onePackLen);
                var rBuf = this.socket.receive(onePackLen);
                if (rBuf != undefined) {
                    this.handleRecv(rBuf);
                }
            }
        }
    }


    this.curConnRetrys = 0;
    this.curConnTimeout = 0;
    this.prevNetState = 0 /* UNCONNECT */;

    this.reConnectTime = 0;

    this.updateNet = function () {
        var state = this.socket.update();
        var curNetStat = this.socket.state;
        if (-1 /* FAIL */ != state) {
            //BK.Script.log(0, 0, "BK.Socket.update!prevNetStat = " + this.prevNetState + ", curNetStat = " + curNetStat);
            switch (this.prevNetState) {
                case 1 /* CONNECTING */: {
                    switch (curNetStat) {
                        case 2 /* CONNECTED */: {
                            switch (state) {
                                case 2 /* CAN_WRITE */: {
                                    this.onConnectedEvent();
                                    break;
                                }
                                case 3 /* CAN_READ_WRITE */: {
                                    BK.Script.log(0, 0, "BK.Socket.update!unexcepted status");
                                    break;
                                }
                            }
                            break;
                        }
                        default: {
                            // var curTs = BK.Time.clock;
                            // var diffT = BK.Time.diffTime(this.prevConnTs, curTs);
                            // if (diffT * 1000 >= this.curConnTimeout) {
                            //     this.curConnRetrys = this.curConnRetrys + 1;
                            //     if (this.curConnRetrys < this.options.ConnectRetryCount) {
                            //         this.close();
                            //         this.connect();
                            //         this.curConnTimeout = this.curConnTimeout * 2;
                            //     }
                            //     else {
                            //         this.onTimeoutEvent();
                            //         this.close();
                            //     }
                            // }
                        }
                    }
                    break;
                }
                case 2 /* CONNECTED */: {
                    switch (curNetStat) {
                        case 2 /* CONNECTED */: {
                            this.onUpdateEvent();
                            break;
                        }
                        default: {
                            this.onErrorEvent();
                        }
                    }
                    break;
                }
            }
        }
        else {
            BK.Script.log(0, 0, "BK.Socket.DisconnectEvent prevNetState=" + this.prevNetState);
            switch (this.prevNetState) {
                case 3:
                case 2 /* CONNECTED */:
                case 1 /* CONNECTING */: {
                    this.onDisconnectEvent();
                    break;
                }

            }
        }
        this.prevNetState = curNetStat;
        return state;
    };

    this.onErrorEvent = function () {
        BK.Script.log(0, 0, "BK.Socket.ErrorEvent");
    };
    this.onUpdateEvent = function () {
        //BK.Script.log(0, 0, "BK.Socket.UpdateEvent");
        return 0;
    };
    this.onTimeoutEvent = function () {
        BK.Script.log(0, 0, "BK.Socket.TimeoutEvent");
    };
    this.onConnectingEvent = function () {
        BK.Script.log(0, 0, "BK.Socket.ConnectingEvent");
    };
    this.onConnectedEvent = function () {
        BK.Script.log(0, 0, "BK.Socket.ConnectedEvent");
    };
    this.onReconnectEvent = function () {
        BK.Script.log(0, 0, "BK.Socket.ReconnectEvent");
    };
    this.onDisconnectEvent = function () {
        BK.Script.log(0, 0, "BK.Socket.DisconnectEvent");
        if (this.disconnectNetCallBack) {
            this.disconnectNetCallBack();
        }
        if (this.reConnectTime < 3) {
            BK.Script.log(0, 0, "BK.Socket.DisconnectEvent reconnectAndJoinRoom");
            var ts = BK.Time.timestamp;
            var cost = (ts - this.startGameTs) / 60;

            if (cost < 5) {
                this.reConnectTime++;
                this.reConnectAndJoinRoom();
            } else {
                BK.Script.log(0, 0, "BK.Socket.DisconnectEvent over 5 min");
            }

        }

    };

    this.setDisconnectNetCallBack = function (callback) {
        this.disconnectNetCallBack = callback;
    }

    this.updateSocket = function () {

        var update = this.updateNet();
        //2可读 ，3可读写
        if (update == 3 || update == 2) {
            if (this.reqArray.length > 0) {
                var funObj = this.reqArray.pop();
                if (funObj != undefined && funObj != null) {
                    this.requestSocket(funObj);
                }
            }
        }
        //  1 可写 ，3可读写
        if (update == 3 || update == 1) {
            this.seperatePackHandle();
        }
        //BK.Script.log(0, 0, "BKSocket.update=" + update);

        return update;
    }
    //创建并加入房间
    this.createAndJoinRoom = function (gameId, masterOpenId, callback,isSendMsg) {

        this.createRoom(gameId, masterOpenId, function (createStatusCode, netAddr, roomId) {
            if (createStatusCode == 0) {

                BK.Script.log(0, 0, "创建游戏 statusCode:" + createStatusCode + " roomId:" + roomId);

                this.gameSvrIp = netAddr.ip_2
                this.gameSvrPort = netAddr.port_2;

                this.roomSvrIp = netAddr.ip_1;
                this.roomSvrPort = netAddr.port_1;

                this.socket.close();
                this.socket.connect(this.gameSvrIp, this.gameSvrPort);

                this.joinRoom(0, function (statusCode, room) {
                    BK.Script.log(0, 0, "加入房间 statusCode:" + statusCode + " roomid is " + room.roomId);

                    callback(statusCode, this);
                },isSendMsg);
            } else {
                callback(createStatusCode, this);
            }
        });
    }


    //查询并且加房间
    this.queryAndJoinRoom = function (gameId, roomId, joinerOpenId, callback,isSendMsg) {

        if (this.serverConnected != 1) {
            this.socket.close();
            this.socket.connect(this.recommandRoomSvrHost, this.recommandRoomSvrPort);
        }

        this.queryRoom(gameId, roomId, joinerOpenId, function (queryStatusCode, roomInfo) {
            if (queryStatusCode == 0) {

                this.gameSvrIp = roomInfo.ip_2
                this.gameSvrPort = roomInfo.port_2;

                this.roomSvrIp = roomInfo.ip_1;
                this.roomSvrPort = roomInfo.port_1;

                this.socket.close();
                this.socket.connect(this.gameSvrIp, this.gameSvrPort);

                this.joinRoom(0, function (statusCode, room) {
                    BK.Script.log(0, 0, "加入房间 statusCode:" + statusCode + " roomid is " + room.roomId);

                    callback(statusCode, this);
                },isSendMsg);

            } else {
                callback(queryStatusCode, undefined);
            }
        });
    }

    //despite the ticker update.
    this.forceLeaveRoom = function (callback, reason) {
        var funObj = new Object();
        funObj.cmd = 0x4;
        funObj.arg0 = reason;
        this.leaveRoomCallBack = callback;

        var buff = this.requestLeaveRoom(funObj.arg0);

        var update = this.socket.update();

        if (update == 3 || update == 2) {
            this.socket.send(buff);
            BK.Script.log(0, 0, "forceLeaveRoom push");
        } else {
            BK.Script.log(0, 0, "forceLeaveRoom push Failed. Socket not allow Send.");
        }
    }

    this._event4StopGame = function (errCode, cmd, data) {
        BK.Script.log(0, 0, "BK.Room._event4StopGame!errCode = " + errCode + ", cmd = " + cmd + ", data = " + JSON.stringify(data));
        if (errCode == 0) {
            //ticker maybe has been disposed.So force to send leave game message.
            this.forceLeaveRoom(function (retCode, leaveInfo) {
                BK.Script.log(0, 0, "forceLeaveRoom callback");
            }, 0);
        }
    }

    BK.MQQ.SsoRequest.addListener(CMSHOW_SC_CMD_STOP_GAME, this, this._event4StopGame.bind(this));

    ///
    ///DEBUG ENVIRMONET BEGIN
    ///
    //当启动调试时，声明 创建使用固定房间号的函数
    this.addDebugFunctions = function () {

        //使用固定房间号创建房间
        this.createFixedRoom = function (gameId, openId, roomId, callback) {
            this.roomId = roomId
            this.mId = openId;
            this.gameId = gameId;
            var con = this.socket.connect(this.recommandRoomSvrHost, this.recommandRoomSvrPort);
            BK.Script.log(0, 0, "socket con =" + con);
            if (con != -1) { BK.Script.log(0, 0, "socket connect failed! " + con); }
            this.createRoomCallBack = callback;
            var funObj = new Object();
            funObj.cmd = 0x6;
            funObj.arg0 = gameId;
            funObj.arg1 = openId;
            this.reqArray.push(funObj);
            BK.Script.log(0, 0, "create Fixed Room ");
        }
        //使用固定房间号创建并加入房间
        this.createAndJoinFixedRoom = function (gameId, masterOpenId, roomId, callback,isSendMsg) {
            this.createFixedRoom(gameId, masterOpenId, roomId, function (createStatusCode, netAddr, roomId) {
                if (createStatusCode == 0) {

                    BK.Script.log(0, 0, "创建固定房间号 游戏 statusCode:" + createStatusCode + " roomId:" + roomId);

                    this.gameSvrIp = netAddr.ip_2;
                    this.gameSvrPort = netAddr.port_2;

                    this.roomSvrIp = netAddr.ip_1;
                    this.roomSvrPort = netAddr.port_1;

                    this.socket.close();
                    this.socket.connect(this.gameSvrIp, this.gameSvrPort);

                    this.joinRoom(0, function (statusCode, room) {
                        BK.Script.log(0, 0, "加入房间 statusCode:" + statusCode + " roomid is " + room.roomId);

                        callback(statusCode, this);
                    },isSendMsg);
                } else {
                    callback(createStatusCode, this);
                }
            });
        }

        //使用固定房间创建房间时，重写创建房间的请求
        this.requestCreateRoom = function (gameId, openId) {
            var fixedRoomId = this.roomId;
            if (!fixedRoomId) {
                fixedRoomId = 0;
            }
            BK.Script.log(0, 0, "create fixed room request in fixedRoomId:" + fixedRoomId);

            var body = new BK.Buffer(fixedHeaderLen, 1);
            this.addFixedHeader(body, 0x6, gameId, fixedRoomId, openId);
            var st = BK.Security.getST();
            BK.Security.encrypt(body);
            var stLen = st.bufferLength();
            var buff = new BK.Buffer(HeaderLen + body.bufferLength() + stLen, 1);
            this.addHeader(buff, body.bufferLength(), stLen);
            buff.writeBuffer(st);
            buff.writeBuffer(body);
            BK.Script.log(0, 0, "create room request buffer : " + buff.bufferLength() + " body len:" + body.bufferLength());
            return buff;
        }
    }

    Object.defineProperty(this, "isDebug", {
        get: function () {
            return this._isDebug;
        },
        set: function (obj) {
            if (obj == true) {
                this.addDebugFunctions();
                this.headerVersion = 0x101;//非加密
                this.recommandRoomSvrHost = DebugRecommandRoomSvrHost;
                this.recommandRoomSvrPort = DebugRecommandRoomSvrPort;
            }
            this._isDebug = obj;
        }
    });

    Object.defineProperty(this, "environment", {
        get: function () {
            return this._environment;
        },
        set: function (obj) {
            //手Q测试环境，使用加密，测试服务器
            if (obj == NETWORK_ENVIRONMENT_QQ_DEBUG) {
                this.headerVersion = 0x0301;
                this.recommandRoomSvrHost = DebugRecommandRoomSvrHost;
                this.recommandRoomSvrPort = DebugRecommandRoomSvrPort;
            }
            //开发环境，使用非加密，测试服务器
            else if (obj == NETWORK_ENVIRONMENT_DEMO_DEV) {
                this.addDebugFunctions();
                this.headerVersion = 0x101;//非加密
                this.recommandRoomSvrHost = DebugRecommandRoomSvrHost;
                this.recommandRoomSvrPort = DebugRecommandRoomSvrPort;
                this._isDebug = true;
            }
            this._environment = obj;
        }
    });
    ///
    ///DEBUG ENVIRMONET END
    ///
}


BK.Script.log(0, 0, "protocol.js Load Succeed!");
