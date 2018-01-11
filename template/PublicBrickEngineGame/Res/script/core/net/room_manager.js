var BKRoomManager = (function () {
    function BKRoomManager(option) {
        this.options = option;
        this.room = new BK.Room({
            qavCfg: option.qavCfg
        });
        BK.Director.ticker.add(function (ts, duration) {
            this.room.updateSocket();
        }.bind(this));
        if (option.environment) {
            this.room.environment = option.environment;
        }
    }
    BKRoomManager.prototype.log = function (str) {
        BK.Script.log(0, 0, "BKRoomManager:" + str);
    };
    BKRoomManager.prototype.masterCreateAndJoinRoomWithFixRoomId = function (fixRoomId) {
        if (this.options.environment && this.options.environment == 2 /* DEMO_DEV */) {
            this.room.createAndJoinFixedRoom(this.options.gameId, this.options.openId, fixRoomId, this._enterAndJoinRoomCallback.bind(this));
        }
        else {
            this.log("Create with fix room failed!.BK.Room.environment is not " + 2 /* DEMO_DEV */);
        }
    };
    BKRoomManager.prototype.masterCreateAndJoinRoom = function () {
        this.room.createAndJoinRoom(this.options.gameId, this.options.openId, this._enterAndJoinRoomCallback.bind(this));
    };
    BKRoomManager.prototype.guestJoinRoom = function (roomId) {
        this.room.queryAndJoinRoom(this.options.gameId, roomId, this.options.openId, this._enterAndJoinRoomCallback.bind(this));
    };
    BKRoomManager.prototype.sendBroadcastData = function (data) {
        this.room.sendBroadcastData(data);
    };
    BKRoomManager.prototype.sendFrameSyncData = function (opt, itemData) {
        //预留字段，暂时填0
        var status = new BK.Buffer(1, 1);
        status.writeUint8Buffer(0);
        //预留字段
        var extend = new BK.Buffer(1, 1);
        extend.writeUint8Buffer(0);
        //send 
        this.room.syncOpt(status, opt, extend, undefined, function (ackSeq) {
            this._syncOptCallback(ackSeq);
        }.bind(this));
    };
    BKRoomManager.prototype.startGame = function (callback) {
        this.room.startGame(callback);
    };
    ///callback functions
    BKRoomManager.prototype._startGameCallback = function (retCode) {
        if (this.options.onStartGame) {
            this.options.onStartGame(retCode);
        }
    };
    //加入房间后回调
    BKRoomManager.prototype._enterAndJoinRoomCallback = function (retCode, room) {
        if (this.options.onJoinRoom) {
            this.options.onJoinRoom(retCode, room);
        }
    };
    //发送帧同步后后台确认回调
    BKRoomManager.prototype._syncOptCallback = function (ackSeq) {
        this.log("sync !!!!!后台确认号recv ack= " + ackSeq);
    };
    return BKRoomManager;
}());
