"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("../../../BK");
BK.Script.loadlib("GameRes://script/core/net/dns.js");
BK.Script.loadlib("GameRes://script/core/net/url.js");
BK.Script.loadlib("GameRes://script/core/net/http_parser.js");
var SocketEventMgr = (function () {
    function SocketEventMgr() {
        this._wsArray = [];
        BK.Director.ticker.add(function (ts, duration) {
            SocketEventMgr.Instance.dispatchEvent();
        });
    }
    SocketEventMgr.prototype.add = function (so) {
        this._wsArray.push(so);
        BK.Script.log(1, 0, "SocketEventMgr.add!so = " + so);
    };
    SocketEventMgr.prototype.del = function (so) {
        var idx = this._wsArray.indexOf(so, 0);
        if (idx >= 0) {
            this._wsArray.splice(idx, 1);
            BK.Script.log(1, 0, "SocketEventMgr.del!so = " + so);
        }
    };
    SocketEventMgr.prototype.dispatchEvent = function () {
        this._wsArray.forEach(function (so, index, array) {
            if (so) {
                so.update();
            }
        });
    };
    return SocketEventMgr;
}());
SocketEventMgr.Instance = new SocketEventMgr();
var KSocket = (function () {
    function KSocket(ip, port) {
        this.ip = ip;
        this.port = port;
        this.__nativeObj = new BK.Socket();
        this.prevConnTs = 0;
        this.curConnRetrys = 0;
        this.curConnTimeout = 0;
        this.prevNetState = 0 /* UNCONNECT */;
        this.options = {
            ConnectRetryCount: 3,
            ConnectTimeoutInterval: 3000
        };
    }
    KSocket.prototype.__internalClose = function () {
        if (this.__nativeObj) {
            return this.__nativeObj.close();
        }
        return -2;
    };
    KSocket.prototype.__internalSend = function (data) {
        if (this.__nativeObj) {
            return this.__nativeObj.send(data);
        }
        return -2;
    };
    KSocket.prototype.__internalRecv = function (length) {
        if (this.__nativeObj) {
            return this.__nativeObj.receive(length);
        }
        return undefined;
    };
    KSocket.prototype.__internalUpdate = function () {
        if (this.__nativeObj) {
            return this.__nativeObj.update();
        }
        return -2;
    };
    KSocket.prototype.__internalConnect = function () {
        if (this.__nativeObj) {
            var ret = this.__nativeObj.connect(this.ip, this.port);
            var curNetStat = this.curNetState();
            switch (this.prevNetState) {
                case 3 /* DISCONNECTED */:
                    this.onReconnectEvent(this);
                case 0 /* UNCONNECT */: {
                    switch (curNetStat) {
                        case 3 /* DISCONNECTED */: {
                            this.onErrorEvent(this);
                            break;
                        }
                        case 1 /* CONNECTING */:
                        case 4 /* SSL_SHAKEHANDING */: {
                            this.prevConnTs = BK.Time.clock;
                            this.curConnTimeout = this.options.ConnectTimeoutInterval;
                            this.onConnectingEvent(this);
                            ret = 0;
                            break;
                        }
                        case 2 /* CONNECTED */:
                        case 5 /* SSL_SHAKEHAND_DONE */: {
                            this.onConnectedEvent(this);
                            ret = 0;
                            break;
                        }
                    }
                    break;
                }
            }
            this.prevNetState = curNetStat;
            return ret;
        }
        return -2;
    };
    KSocket.prototype.__internalCanReadLength = function () {
        if (this.__nativeObj) {
            return this.__nativeObj.canReadLength();
        }
        return 0;
    };
    KSocket.prototype.__internalIsEnableSSL = function () {
        if (this.__nativeObj) {
            return this.__nativeObj.getSSLEnable();
        }
        return false;
    };
    KSocket.prototype.__internalEnableSSL = function (ssl) {
        if (this.__nativeObj) {
            this.__nativeObj.setSSLEnable(ssl);
        }
    };
    KSocket.prototype.__internalUpdateSSL = function () {
        var state = this.__internalUpdate();
        var curNetStat = this.curNetState();
        if (-1 /* FAIL */ != state) {
            switch (this.prevNetState) {
                case 1 /* CONNECTING */: {
                    switch (curNetStat) {
                        case 2 /* CONNECTED */: {
                            BK.Script.log(1, 0, "BK.Socket.update.ssl!connected, ip = " + this.ip + ", port = " + this.port);
                            break;
                        }
                        default: {
                            var curTs = BK.Time.clock;
                            var diffT = BK.Time.diffTime(this.prevConnTs, curTs);
                            if (diffT * 1000 >= this.curConnTimeout) {
                                this.curConnRetrys = this.curConnRetrys + 1;
                                if (this.curConnRetrys < this.options.ConnectRetryCount) {
                                    this.close();
                                    this.connect();
                                    this.curConnTimeout = this.curConnTimeout * 2;
                                }
                                else {
                                    this.onTimeoutEvent(this);
                                    this.close();
                                }
                            }
                        }
                    }
                    break;
                }
                case 2 /* CONNECTED */: {
                    break;
                }
                case 4 /* SSL_SHAKEHANDING */: {
                    switch (curNetStat) {
                        case 5 /* SSL_SHAKEHAND_DONE */: {
                            switch (state) {
                                case 2 /* CAN_WRITE */:
                                case 3 /* CAN_READ_WRITE */: {
                                    this.onConnectedEvent(this);
                                    break;
                                }
                            }
                            break;
                        }
                        default: {
                            var curTs = BK.Time.clock;
                            var diffT = BK.Time.diffTime(this.prevConnTs, curTs);
                            if (diffT * 1000 >= this.curConnTimeout) {
                                this.curConnRetrys = this.curConnRetrys + 1;
                                if (this.curConnRetrys < this.options.ConnectRetryCount) {
                                    this.close();
                                    this.connect();
                                    this.curConnTimeout = this.curConnTimeout * 2;
                                }
                                else {
                                    this.onTimeoutEvent(this);
                                    this.close();
                                }
                            }
                        }
                    }
                    break;
                }
                case 5 /* SSL_SHAKEHAND_DONE */: {
                    switch (curNetStat) {
                        case 5 /* SSL_SHAKEHAND_DONE */: {
                            this.onUpdateEvent(this);
                            break;
                        }
                        default: {
                            this.onErrorEvent(this);
                        }
                    }
                    break;
                }
            }
        }
        else {
            switch (this.prevNetState) {
                case 2 /* CONNECTED */:
                case 1 /* CONNECTING */: {
                    this.onDisconnectEvent(this);
                    break;
                }
                case 4 /* SSL_SHAKEHANDING */:
                case 6 /* SSL_SHAKEHAND_FAIL */:
                case 5 /* SSL_SHAKEHAND_DONE */: {
                    this.onErrorEvent(this);
                    break;
                }
            }
        }
        this.prevNetState = curNetStat;
        return state;
    };
    KSocket.prototype.__internalUpdateNoSSL = function () {
        var state = this.__internalUpdate();
        var curNetStat = this.curNetState();
        //BK.Script.log(1, 0, "BK.Socket.update!prevNetStat = " + this.prevNetState + ", curNetStat = " + curNetStat);
        if (-1 /* FAIL */ != state) {
            switch (this.prevNetState) {
                case 1 /* CONNECTING */: {
                    switch (curNetStat) {
                        case 2 /* CONNECTED */: {
                            switch (state) {
                                case 2 /* CAN_WRITE */: {
                                    this.onConnectedEvent(this);
                                    break;
                                }
                                case 3 /* CAN_READ_WRITE */: {
                                    BK.Script.log(1, 0, "BK.Socket.update!unexcepted status");
                                    break;
                                }
                            }
                            break;
                        }
                        default: {
                            var curTs = BK.Time.clock;
                            var diffT = BK.Time.diffTime(this.prevConnTs, curTs);
                            if (diffT * 1000 >= this.curConnTimeout) {
                                this.curConnRetrys = this.curConnRetrys + 1;
                                if (this.curConnRetrys < this.options.ConnectRetryCount) {
                                    this.close();
                                    this.connect();
                                    this.curConnTimeout = this.curConnTimeout * 2;
                                }
                                else {
                                    this.onTimeoutEvent(this);
                                    this.close();
                                }
                            }
                        }
                    }
                    break;
                }
                case 2 /* CONNECTED */: {
                    switch (curNetStat) {
                        case 2 /* CONNECTED */: {
                            this.onUpdateEvent(this);
                            break;
                        }
                        default: {
                            this.onErrorEvent(this);
                        }
                    }
                    break;
                }
            }
        }
        else {
            switch (this.prevNetState) {
                case 2 /* CONNECTED */:
                case 1 /* CONNECTING */: {
                    this.onDisconnectEvent(this);
                    break;
                }
            }
        }
        this.prevNetState = curNetStat;
        return state;
    };
    KSocket.prototype.curNetState = function () {
        if (this.__nativeObj) {
            return this.__nativeObj.state;
        }
        return 0 /* UNCONNECT */;
    };
    KSocket.prototype.close = function () {
        var ret = this.__internalClose();
        if (!ret)
            this.prevNetState = 0 /* UNCONNECT */;
        SocketEventMgr.Instance.del((this));
        return ret;
    };
    KSocket.prototype.send = function (data) {
        var ret = this.__internalSend(data);
        return ret;
    };
    KSocket.prototype.recv = function (length) {
        return this.__internalRecv(length);
    };
    KSocket.prototype.canRecvLength = function () {
        return this.__internalCanReadLength();
    };
    KSocket.prototype.update = function () {
        if (this.isEnableSSL()) {
            return this.__internalUpdateSSL();
        }
        return this.__internalUpdateNoSSL();
    };
    KSocket.prototype.connect = function () {
        var stat = this.curNetState();
        if (0 /* UNCONNECT */ == stat ||
            3 /* DISCONNECTED */ == stat) {
            var ret = this.__internalConnect();
            if (!ret) {
                SocketEventMgr.Instance.add((this));
            }
            return ret;
        }
        return 0;
    };
    KSocket.prototype.isEnableSSL = function () {
        return this.__internalIsEnableSSL();
    };
    KSocket.prototype.enableSSL = function (ssl) {
        this.__internalEnableSSL(ssl);
    };
    KSocket.prototype.onErrorEvent = function (so) {
        BK.Script.log(1, 0, "BK.Socket.ErrorEvent");
    };
    KSocket.prototype.onUpdateEvent = function (so) {
        //BK.Script.log(1, 0, "BK.Socket.UpdateEvent");
        return 0;
    };
    KSocket.prototype.onTimeoutEvent = function (so) {
        BK.Script.log(1, 0, "BK.Socket.TimeoutEvent");
    };
    KSocket.prototype.onConnectingEvent = function (so) {
        BK.Script.log(1, 0, "BK.Socket.ConnectingEvent");
    };
    KSocket.prototype.onConnectedEvent = function (so) {
        BK.Script.log(1, 0, "BK.Socket.ConnectedEvent");
    };
    KSocket.prototype.onReconnectEvent = function (so) {
        BK.Script.log(1, 0, "BK.Socket.ReconnectEvent");
    };
    KSocket.prototype.onDisconnectEvent = function (so) {
        BK.Script.log(1, 0, "BK.Socket.DisconnectEvent");
    };
    return KSocket;
}());
var WebSocketData = (function () {
    function WebSocketData(data, isBinary) {
        this.data = data;
        this.isBinary = isBinary;
    }
    return WebSocketData;
}());
var KWebSocket = (function (_super) {
    __extends(KWebSocket, _super);
    function KWebSocket(ip, port, host, path) {
        var _this = _super.call(this, ip, port) || this;
        _this.path = path ? path : "/";
        _this.host = host;
        _this.httpVer = 1.1;
        _this.httpParser = new HTTPParser(HTTPParser.RESPONSE);
        _this.version = 13;
        _this.protocols = new Array();
        _this.extensions = new Array();
        _this.delegate = {
            onOpen: null, onClose: null, onError: null, onMessage: null, onSendComplete: null
        };
        if (!_this.options) {
            _this.options = {};
        }
        _this.options.DrainSegmentCount = 8;
        _this.options.DefaultSegmentSize = 512;
        _this.options.PingPongInterval = 0;
        _this.options.HandleShakeRequestTimeout = 10000;
        _this.options.HandleShakeResponseTimeout = 10000;
        _this.options.CloseAckTimeout = 20000;
        _this.options.PingPongTimeout = 3000;
        _this.clear();
        return _this;
    }
    KWebSocket.prototype.clear = function () {
        this.mask4 = new BK.Buffer(4, false);
        this.txbuf = new BK.Buffer(128, true);
        this.rxbuf = new BK.Buffer(128, true);
        this.txbufQue = new Array();
        this.rxbufQue = new Array();
        this.udataQue = new Array();
        this.peerClosed = false;
        this.txSegCount = 0;
        this.rxSegCount = 0;
        this.rxFrameType = -1;
        this.isFinalSeg = false;
        this.inTxSegFrame = false;
        this.inRxSegFrame = false;
        this.inPartialTxbuf = false;
        this.inPingFrame = false;
        this.inPongFrame = false;
        this.errcode = 65535 /* UNDEFINE */;
        this.state = 0 /* CLOSED */;
        this.parseState = 0 /* NEW_DATA */;
        this.phaseTimeout = 0;
        this.pingpongTimer = 0;
        this.prevPhaseTickCount = 0;
        this.prevPingPongTickCount = 0;
    };
    KWebSocket.prototype.getReadyState = function () {
        return this.state;
    };
    KWebSocket.prototype.getErrorCode = function () {
        return this.errcode;
    };
    KWebSocket.prototype.getErrorString = function () {
        return this.message;
    };
    KWebSocket.prototype.randomN = function (n) {
        var b = new BK.Buffer(n, false);
        for (var i = 0; i < n; i++) {
            var r = Math.round(Math.random() * 65535);
            b.writeUint8Buffer(r);
        }
        return b;
    };
    KWebSocket.prototype.toHex = function (c) {
        if (c >= 0 && c <= 9)
            return c.toString();
        switch (c) {
            case 10: return 'A';
            case 11: return 'B';
            case 12: return 'C';
            case 13: return 'D';
            case 14: return 'E';
            case 15: return 'F';
        }
        return 'u';
    };
    KWebSocket.prototype.bufferToHexString = function (buf) {
        var s = "";
        buf.rewind();
        while (!buf.eof) {
            var c = buf.readUint8Buffer();
            s = s.concat('x' + this.toHex((c & 0xF0) >> 4) + this.toHex((c & 0x0F)) + ' ');
        }
        return s;
    };
    KWebSocket.prototype.startPhaseTimeout = function (phase) {
        if (phase == 6 /* NO_PENDING_TIMEOUT */) {
            this.phaseTimeout = phase;
            this.prevPhaseTickCount = 0;
        }
        else {
            switch (this.state) {
                case 2 /* HANDSHAKE_REQ */: {
                    if (phase == 1 /* HANDSHAKE_REQUEST */) {
                        this.phaseTimeout = phase;
                        this.prevPhaseTickCount = BK.Time.clock;
                        //BK.Script.log(1, 0, "BK.WebSocket.startPhaseTimeout! request, ts = " + this.prevPhaseTickCount);
                    }
                    break;
                }
                case 3 /* HANDSHAKE_RESP */: {
                    if (phase == 2 /* HANDSHAKE_RESPONE */) {
                        this.phaseTimeout = phase;
                        this.prevPhaseTickCount = BK.Time.clock;
                        //BK.Script.log(1, 0, "BK.WebSocket.startPhaseTimeout! response, ts = " + this.prevPhaseTickCount);
                    }
                    break;
                }
                case 1 /* CLOSING */: {
                    if (phase == 3 /* CLOSE_ACK */) {
                        this.phaseTimeout = phase;
                        this.prevPhaseTickCount = BK.Time.clock;
                        //BK.Script.log(1, 0, "BK.WebSocket.startPhaseTimeout! close ack, ts = " + this.prevPhaseTickCount);
                    }
                    break;
                }
                case 4 /* ESTABLISHED */: {
                    switch (phase) {
                        case 4 /* CHECK_PONG_SEND_PING */: {
                            this.options.PingPongTimeout = Math.min(this.options.PingPongTimeout, this.options.PingPongInterval);
                            break;
                        }
                    }
                    this.phaseTimeout = phase;
                    this.prevPhaseTickCount = BK.Time.clock;
                    break;
                }
            }
        }
    };
    KWebSocket.prototype.handlePhaseTimeout = function () {
        if (this.phaseTimeout == 6 /* NO_PENDING_TIMEOUT */)
            return;
        var interval = BK.Time.diffTime(this.prevPhaseTickCount, BK.Time.clock);
        switch (this.phaseTimeout) {
            case 1 /* HANDSHAKE_REQUEST */: {
                if (interval * 1000 > this.options.HandleShakeRequestTimeout) {
                    BK.Script.log(1, 0, "BK.WebSocket.handlePhaseTimeout!handshake request timeout");
                    this.prevPhaseTickCount = BK.Time.clock;
                    this.state = -1 /* FAILED */;
                    this.errcode = 4096 /* HANDSHAKE_REQ_TIMEOUT */;
                    this.message = "handshake request timeout";
                    _super.prototype.close.call(this);
                    if (this.delegate.onError) {
                        this.delegate.onError(this);
                    }
                }
                break;
            }
            case 2 /* HANDSHAKE_RESPONE */: {
                if (interval * 1000 > this.options.HandleShakeResponseTimeout) {
                    BK.Script.log(1, 0, "BK.WebSocket.handlePhaseTimeout!handshake response timeout");
                    this.prevPhaseTickCount = BK.Time.clock;
                    this.state = -1 /* FAILED */;
                    this.errcode = 4097 /* HANDSHAKE_RSP_TIMEOUT */;
                    this.message = "handshake response timeout";
                    _super.prototype.close.call(this);
                    if (this.delegate.onError) {
                        this.delegate.onError(this);
                    }
                }
                break;
            }
            case 3 /* CLOSE_ACK */: {
                if (interval * 1000 > this.options.CloseAckTimeout) {
                    BK.Script.log(1, 0, "BK.WebSocket.handlePhaseTimeout!close ack timeout");
                    this.prevPhaseTickCount = BK.Time.clock;
                    if (1 /* CLOSING */ == this.state) {
                        if (!this.peerClosed) {
                            this.errcode = 1006 /* ABNORMAL_CLOSE */;
                            this.message = "abnormal close";
                            this.startPhaseTimeout(6 /* NO_PENDING_TIMEOUT */);
                        }
                        _super.prototype.close.call(this);
                        if (this.delegate.onError) {
                            this.delegate.onError(this);
                        }
                    }
                }
                break;
            }
            case 4 /* CHECK_PONG_SEND_PING */: {
                if (interval * 1000 > this.options.PingPongTimeout) {
                    BK.Script.log(1, 0, "BK.WebSocket.handlePhaseTimeout!receive pong timeout");
                    this.prevPhaseTickCount = BK.Time.clock;
                }
                break;
            }
        }
    };
    KWebSocket.prototype.restartPingPongTimer = function () {
        if (4 /* ESTABLISHED */ == this.state &&
            this.options.PingPongInterval > 0) {
            this.prevPingPongTickCount = BK.Time.clock;
            //BK.Script.log(0, 0, "BK.WebSocket.restartPingPongTimer!interval = " + this.options.PingPongInterval);
        }
    };
    KWebSocket.prototype.handlePingPongTimer = function () {
        if (4 /* ESTABLISHED */ == this.state &&
            this.options.PingPongInterval > 0) {
            var interval = BK.Time.diffTime(this.prevPingPongTickCount, BK.Time.clock);
            if (interval * 1000 > this.options.PingPongInterval) {
                this.inPingFrame = false;
                this.txPingData = this.randomN(16);
                this.sendPingFrame(this.txPingData);
                this.restartPingPongTimer();
            }
        }
    };
    KWebSocket.prototype.doHandshakePhase = function () {
        var s = "";
        /*
            example:
            GET /chat HTTP/1.1
            Host: server.example.com
            Upgrade: websocket
            Connection: Upgrade
            Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
            Origin: http://example.com
            Sec-WebSocket-Protocol: chat, superchat
            Sec-WebSocket-Version: 13
        */
        s = s.concat("GET " + this.path + " HTTP/" + this.httpVer + "\r\n");
        if (this.port == 80 || this.port == 443) {
            s = s.concat("Host:" + this.host + "\r\n");
        }
        else {
            s = s.concat("Host:" + this.host + ":" + this.port + "\r\n");
        }
        s = s.concat("Upgrade:websocket\r\n");
        s = s.concat("Connection:Upgrade\r\n");
        var r16 = this.randomN(16);
        var s64 = BK.Misc.encodeBase64FromBuffer(r16);
        s = s.concat("Sec-WebSocket-Key:" + s64 + "\r\n");
        s = s.concat("Sec-WebSocket-Version:" + this.version + "\r\n\r\n");
        //BK.Script.log(1, 0, 'BK.WebSocket.doHandshakePhase! Request Message = ' + s);
        var sha = BK.Misc.sha1(s64.concat("258EAFA5-E914-47DA-95CA-C5AB0DC85B11"));
        this.handshakeSig = BK.Misc.encodeBase64FromBuffer(sha);
        //BK.Script.log(1, 0, "BK.WebSocket.doHandshakePhase!handshakeSig = " + this.handshakeSig);
        var data = new BK.Buffer(s.length, false);
        data.writeAsString(s, false);
        _super.prototype.send.call(this, data);
        this.state = 2 /* HANDSHAKE_REQ */;
        this.startPhaseTimeout(1 /* HANDSHAKE_REQUEST */);
    };
    KWebSocket.prototype.doSvrHandshakePhase1 = function (resp) {
        var _this = this;
        if (!resp)
            return;
        //BK.Script.log(1, 0, "doSvrHandshakePhase1! Response Message = " + resp);
        if (!this.httpParser.onComplete) {
            this.httpParser.onComplete = function () {
                //BK.Script.log(1, 0, "BK.WebSocket.doSvrHandshakePhase1!completed");
                for (var k in _this.httpParser.headers) {
                    //BK.Script.log(1, 0, k + ": " + this.httpParser.headers[k] + "\r\n");
                }
                if (!_this.doSvrHandshakePhase2()) {
                    _this.errcode = 4098 /* HANDSHAKE_PARSE_ERROR */;
                    _this.message = "handshake parse error";
                    _this.startPhaseTimeout(6 /* NO_PENDING_TIMEOUT */);
                    _super.prototype.close.call(_this);
                    if (_this.delegate.onError) {
                        _this.delegate.onError(_this);
                    }
                }
                else {
                    _this.restartPingPongTimer();
                    _this.startPhaseTimeout(6 /* NO_PENDING_TIMEOUT */);
                    if (_this.delegate.onOpen) {
                        _this.delegate.onOpen(_this);
                    }
                }
            };
        }
        this.httpParser.execute(resp);
        if (2 /* HANDSHAKE_REQ */ == this.state) {
            this.state = 3 /* HANDSHAKE_RESP */;
            this.startPhaseTimeout(2 /* HANDSHAKE_RESPONE */);
        }
    };
    KWebSocket.prototype.doSvrHandshakePhase2 = function () {
        switch (this.httpParser.statusCode) {
            case 101: {
                /*
                    example:
                    HTTP/1.1 101 Switching Protocols
                    Upgrade: WebSocket
                    Connection: Upgrade
                    WebSocket-Accept: 0FyGj/H5Dcoqr76kHJ5BLozTDYQ=
                */
                if (undefined == this.httpParser.headers["upgrade"]) {
                    this.state = -1 /* FAILED */;
                    BK.Script.log(1, 0, "BK.WebSocket.doSvrHandshakePhase2!missing \'upgrade\' header");
                    return false;
                }
                if (undefined == this.httpParser.headers["connection"]) {
                    this.state = -1 /* FAILED */;
                    BK.Script.log(1, 0, "BK.WebSocket.doSvrHandshakePhase2!missing \'connection\' header");
                    return false;
                }
                if ("upgrade" != this.httpParser.headers["connection"].toLowerCase()) {
                    this.state = -1 /* FAILED */;
                    BK.Script.log(1, 0, "BK.WebSocket.doSvrHandshakePhase2!error \'connection\' header");
                    return false;
                }
                if (undefined == this.httpParser.headers["sec-websocket-accept"]) {
                    this.state = -1 /* FAILED */;
                    BK.Script.log(1, 0, "BK.WebSocket.doSvrHandshakePhase2!missing \'sec-websocket-accept\' header");
                    return false;
                }
                if (this.handshakeSig != this.httpParser.headers["sec-websocket-accept"]) {
                    this.state = -1 /* FAILED */;
                    BK.Script.log(1, 0, "BK.WebSocket.doSvrHandshakePhase2!error \'sec-websocket-accept\' header");
                    return false;
                }
                this.state = 4 /* ESTABLISHED */;
                //BK.Script.log(1, 0, "BK.WebSocket.doServerHanshakePhase2!success");
                return true;
            }
            case 401: {
                break;
            }
        }
        return false;
    };
    KWebSocket.prototype.doFrameDataPhase = function (data, opCode, moreSegs) {
        if (moreSegs === void 0) { moreSegs = false; }
        /*
            WebSocket Frame Format:
            0                   1                   2                   3
            0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
            +-+-+-+-+-------+-+-------------+-------------------------------+
            |F|R|R|R| opcode|M| Payload len |    Extended payload length    |
            |I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
            |N|V|V|V|       |S|             |   (if payload len==126/127)   |
            | |1|2|3|       |K|             |                               |
            +-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
            |     Extended payload length continued, if payload len == 127  |
            + - - - - - - - - - - - - - - - +-------------------------------+
            |                               |Masking-key, if MASK set to 1  |
            +-------------------------------+-------------------------------+
            | Masking-key (continued)       |          Payload Data         |
            +-------------------------------- - - - - - - - - - - - - - - - +
            :                     Payload Data continued ...                :
            + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
            |                     Payload Data continued ...                |
            +---------------------------------------------------------------+
        */
        var total = 6;
        var length = data.length;
        if (this.extensions.length > 0) {
        }
        total = total + length;
        var buf = new BK.Buffer(total, false);
        var bitMask = 0;
        var isMask = false;
        switch (this.version) {
            case 13: {
                isMask = true;
                bitMask = 0x00000080;
                break;
            }
        }
        var fin = true;
        switch (opCode) {
            case 1 /* TEXT_FRAME */:
            case 2 /* BINARY_FRAME */: {
                if (moreSegs) {
                    if (!this.inTxSegFrame) {
                        fin = false;
                        this.inTxSegFrame = true;
                    }
                    else {
                        fin = false;
                        opCode = 0 /* CONTINOUS */;
                    }
                }
                else {
                    if (this.inTxSegFrame) {
                        opCode = 0 /* CONTINOUS */;
                    }
                }
                break;
            }
        }
        if (!fin) {
            buf.writeUint8Buffer(0x0000000F & opCode);
        }
        else {
            buf.writeUint8Buffer(0x00000080 | (0x0000000F & opCode));
        }
        if (length < 126) {
            buf.writeUint8Buffer(bitMask | (0x0000007F & data.length));
        }
        else {
            if (length < 65536) {
                buf.writeUint8Buffer(bitMask | 126);
                if (KWebSocket.isLittleEndian) {
                    buf.writeUint8Buffer((0x0000FF00 & length) >> 8);
                    buf.writeUint8Buffer((0x000000FF & length));
                }
                else {
                    buf.writeUint8Buffer((0x000000FF & length));
                    buf.writeUint8Buffer((0x0000FF00 & length) >> 8);
                }
            }
            else {
                //buf.writeUint8Buffer(bitMask | 127);
                BK.Script.log(1, 0, "BK.WebSocket.doFrameDataPhase!js don't support 64bit data type");
            }
        }
        if (isMask) {
            var mask = this.randomN(4);
            BK.Misc.encodeBufferXorMask4(data, mask);
            buf.writeBuffer(mask);
        }
        buf.writeBuffer(data);
        return buf;
    };
    KWebSocket.prototype.doSvrFrameDataPhase = function (data) {
        if (!data)
            return true;
        while (!data.eof) {
            switch (this.parseState) {
                case 0 /* NEW_DATA */: {
                    this.mask4.rewind();
                    this.rxbuf = new BK.Buffer(this.options.DefaultSegmentSize, true);
                    this.maskBit = 0;
                    this.rxbuflen = 0;
                    this.isFinalSeg = false;
                    this.parseState = 1 /* FRAME_HDR_1 */;
                }
                case 1 /* FRAME_HDR_1 */: {
                    var hdr1 = data.readUint8Buffer();
                    if ((hdr1 & 0x00000080)) {
                        this.isFinalSeg = true;
                    }
                    else {
                        this.isFinalSeg = false;
                    }
                    this.opcode = (hdr1 & 0x0000000F);
                    switch (this.version) {
                        case 13: {
                            switch (this.opcode) {
                                case 3:
                                case 4:
                                case 5:
                                case 6:
                                case 7:
                                case 0xb:
                                case 0xc:
                                case 0xd:
                                case 0xe:
                                case 0xf:
                                    this.errcode = 1002 /* PROTO_ERRS */;
                                    this.message = "protocol error";
                                    BK.Script.log(1, 0, "BK.WebSocket.doSvrFrameDataPhase!unknown opcode = " + this.opcode);
                                    return false;
                            }
                            break;
                        }
                    }
                    switch (this.opcode) {
                        case 8 /* CLOSE */:
                        case 9 /* PING */:
                        case 10 /* PONG */:
                        case 0 /* CONTINOUS */:
                            break;
                        default: {
                            if (!this.isFinalSeg) {
                                if (this.opcode != 1 /* TEXT_FRAME */ &&
                                    this.opcode != 2 /* BINARY_FRAME */) {
                                    this.errcode = 1003 /* UNSUPPORTED_DATA */;
                                    this.message = "unsupported data";
                                    BK.Script.log(1, 0, "BK.WebSocket.doSvrFrameDataPhase!illegal opcode = " + this.opcode);
                                    return false;
                                }
                            }
                            if (-1 == this.rxFrameType) {
                                this.rxFrameType = this.opcode;
                            }
                            else if (this.rxFrameType != this.opcode) {
                                this.errcode = 1002 /* PROTO_ERRS */;
                                this.message = "protocol error";
                                BK.Script.log(1, 0, "BK.WebSocket.doSvrFrameDataPhase!rxFrameType = " + this.rxFrameType + ", illegal opcode = " + this.opcode);
                                return false;
                            }
                        }
                    }
                    //BK.Script.log(0, 0, "BK.WebSocket.doSvrFrameDataPhase!finalSeg = " + this.isFinalSeg + ", opcode = " + this.opcode);
                    this.parseState = 2 /* FRAME_HDR_LEN */;
                    if (data.eof)
                        return true;
                }
                case 2 /* FRAME_HDR_LEN */: {
                    var hdrLen = data.readUint8Buffer();
                    this.maskBit = ((0x00000080 & hdrLen) >> 7);
                    switch ((0x0000007F & hdrLen)) {
                        case 126: {
                            this.parseState = 3 /* FRAME_HDR_LEN16_2 */;
                            if (data.eof)
                                return true;
                            break;
                        }
                        case 127: {
                            this.parseState = 5 /* FRAME_HDR_LEN64_8 */;
                            if (data.eof)
                                return true;
                            break;
                        }
                        default: {
                            this.rxbuflen = (0x0000007F & hdrLen);
                            if (this.maskBit == 1) {
                                this.parseState = 13 /* FRAME_MASK_KEY_1 */;
                            }
                            else {
                                this.parseState = 17 /* FRAME_PAYLOAD_DATA */;
                            }
                            //BK.Script.log(0, 0, "BK.WebSocket.doSvrFrameDataPhase!maskBit = " + this.maskBit + ", rxbuflen = " + this.rxbuflen);
                            if (this.rxbuflen > 0 && data.eof)
                                return true;
                        }
                    }
                }
            }
            switch (this.parseState) {
                case 3 /* FRAME_HDR_LEN16_2 */: {
                    var n = data.readUint8Buffer();
                    if (KWebSocket.isLittleEndian) {
                        this.rxbuflen |= ((0x000000FF & n) << 8);
                    }
                    else {
                        this.rxbuflen |= (0x000000FF & n);
                    }
                    if (data.eof)
                        return true;
                }
                case 4 /* FRAME_HDR_LEN16_1 */: {
                    var n = data.readUint8Buffer();
                    if (KWebSocket.isLittleEndian) {
                        this.rxbuflen |= (0x000000FF & n);
                    }
                    else {
                        this.rxbuflen |= ((0x000000FF & n) << 8);
                    }
                    if (this.maskBit == 1) {
                        this.parseState = 13 /* FRAME_MASK_KEY_1 */;
                    }
                    else {
                        this.parseState = 17 /* FRAME_PAYLOAD_DATA */;
                    }
                    if (this.rxbuflen > 0 && data.eof) {
                        return true;
                    }
                    break;
                }
                case 5 /* FRAME_HDR_LEN64_8 */:
                case 6 /* FRAME_HDR_LEN64_7 */:
                case 7 /* FRAME_HDR_LEN64_6 */:
                case 8 /* FRAME_HDR_LEN64_5 */:
                case 9 /* FRAME_HDR_LEN64_4 */:
                case 10 /* FRAME_HDR_LEN64_3 */:
                case 11 /* FRAME_HDR_LEN64_2 */:
                case 12 /* FRAME_HDR_LEN64_1 */: {
                    this.errcode = 1002 /* PROTO_ERRS */;
                    this.message = "protocol errors";
                    BK.Script.log(1, 0, "BK.WebSocket.doSvrFrameDataPhase!js don't support 64bit data type");
                    return false;
                }
            }
            switch (this.parseState) {
                case 13 /* FRAME_MASK_KEY_1 */: {
                    this.mask4.writeUint8Buffer(data.readUint8Buffer());
                    this.parseState = 14 /* FRAME_MASK_KEY_2 */;
                    if (data.eof)
                        return true;
                }
                case 14 /* FRAME_MASK_KEY_2 */: {
                    this.mask4.writeUint8Buffer(data.readUint8Buffer());
                    this.parseState = 15 /* FRAME_MASK_KEY_3 */;
                    if (data.eof)
                        return true;
                }
                case 15 /* FRAME_MASK_KEY_3 */: {
                    this.mask4.writeUint8Buffer(data.readUint8Buffer());
                    this.parseState = 16 /* FRAME_MASK_KEY_4 */;
                    if (data.eof)
                        return true;
                }
                case 16 /* FRAME_MASK_KEY_4 */: {
                    this.mask4.writeUint8Buffer(data.readUint8Buffer());
                    this.parseState = 17 /* FRAME_PAYLOAD_DATA */;
                    if (data.eof)
                        return true;
                }
            }
            if (17 /* FRAME_PAYLOAD_DATA */ == this.parseState) {
                this.rxbuf.writeBuffer(data.readBuffer(this.rxbuflen));
                if (this.rxbuf.length == this.rxbuflen) {
                    this.rxSegCount = this.rxSegCount + 1;
                    this.parseState = 0 /* NEW_DATA */;
                    if (this.isFinalSeg) {
                        this.rxbuf.rewind();
                        switch (this.opcode) {
                            case 8 /* CLOSE */: {
                                BK.Script.log(0, 0, "BK.WebSocket.doSvrFrameDataPhase!receive close frame");
                                this.handleCloseFrame();
                                break;
                            }
                            case 9 /* PING */: {
                                BK.Script.log(0, 0, "BK.WebSocket.doSvrFrameDataPhase!receive ping frame");
                                this.handlePingFrame();
                                break;
                            }
                            case 10 /* PONG */: {
                                BK.Script.log(0, 0, "BK.WebSocket.doSvrFrameDataPhase!receive pong frame");
                                this.handlePongFrame();
                                break;
                            }
                            default: {
                                this.rxbufQue.push(this.rxbuf);
                                this.recvFrameFromRxQ(this.rxFrameType);
                                //BK.Script.log(0, 0, "BK.WebSocket.doSvrFrameDataPhase!no more segments, segNo. = " + this.rxSegCount);
                                this.rxSegCount = 0;
                                this.rxFrameType = -1;
                            }
                        }
                    }
                    else {
                        this.rxbuf.rewind();
                        this.rxbufQue.push(this.rxbuf);
                        //BK.Script.log(0, 0, "BK.WebSocket.doSvrFrameDataPhase!has more segments, segNo. = " + this.rxSegCount);
                    }
                }
            }
        }
        return true;
    };
    KWebSocket.prototype.handleCloseFrame = function () {
        this.peerClosed = true;
        if (4 /* ESTABLISHED */ == this.state) {
            var errcode = this.rxbuf.readUint16Buffer();
            var msgbuff = this.rxbuf.readBuffer(this.rxbuflen - 2);
            if (!errcode) {
                this.errcode = 1005 /* NO_STATUS_RECV */;
                this.message = "no status recv";
            }
            else {
                this.errcode = errcode;
                this.message = msgbuff.readAsString();
            }
            BK.Script.log(1, 0, "BK.WebSocket.handleCloseFrame!errcode = " + this.errcode + ", msg = " + this.message);
            this.sendCloseFrame(this.errcode, this.message);
        }
        else if (1 /* CLOSING */ == this.state) {
            this.startPhaseTimeout(6 /* NO_PENDING_TIMEOUT */);
        }
    };
    KWebSocket.prototype.handlePingFrame = function () {
        if (4 /* ESTABLISHED */ == this.state) {
            if (this.rxbuflen > 128 - 3) {
                this.errcode = 4099 /* CONTROL_PACKET_LARGE */;
                this.message = "ping packet large";
                return;
            }
            if (this.inPongFrame) {
                BK.Script.log(1, 0, "BK.WebSocket.handlePingFrame!already recv ping, drop it.");
                return;
            }
            this.rxPongData = new BK.Buffer(this.rxbuflen, true);
            this.rxPongData.writeBuffer(this.rxbuf.readBuffer(this.rxbuflen));
            this.sendPongFrame(this.rxPongData);
        }
    };
    KWebSocket.prototype.handlePongFrame = function () {
        if (4 /* ESTABLISHED */ == this.state) {
            var data = new BK.Buffer(this.rxbuflen, true);
            data.writeBuffer(this.rxbuf.readBuffer(this.rxbuflen));
            this.startPhaseTimeout(6 /* NO_PENDING_TIMEOUT */);
            BK.Script.log(0, 0, "BK.WebSocket.handlePongFrame!pong data = " + this.bufferToHexString(data));
        }
    };
    KWebSocket.prototype.sendFrameFromTxQ = function (t) {
        if (4 /* ESTABLISHED */ != this.state)
            return;
        if (this.inPartialTxbuf) {
            var txBytes = _super.prototype.send.call(this, this.txbuf);
            if (txBytes > 0) {
                this.restartPingPongTimer();
                if (txBytes < this.txbuf.length) {
                    var cap = this.txbuf.length - txBytes;
                    var buf = new BK.Buffer(cap, false);
                    this.txbuf.rewind();
                    this.txbuf.jumpBytes(txBytes);
                    buf.writeBuffer(this.txbuf.readBuffer(cap));
                    this.txbuf = buf;
                    return false;
                }
                this.inPartialTxbuf = false;
            }
            else {
                BK.Script.log(1, txBytes, "BK.WebSocket.sendFrameFromTxQ!partial send failed, data type = " + t);
                return false;
            }
        }
        var succ = true;
        var n = Math.min(this.options.DrainSegmentCount, this.txbufQue.length);
        for (; n > 0; n--) {
            var data = this.txbufQue.shift();
            var moreSegs = (this.txbufQue.length > 0);
            var frameData = this.doFrameDataPhase(data, t, moreSegs);
            var txBytes = _super.prototype.send.call(this, frameData);
            if (txBytes > 0) {
                this.restartPingPongTimer();
                if (txBytes < frameData.length) {
                    frameData.rewind();
                    frameData.jumpBytes(txBytes);
                    this.txbuf.rewind();
                    this.txbuf.writeBuffer(frameData.readBuffer(frameData.length - txBytes));
                    this.inPartialTxbuf = true;
                    succ = false;
                    BK.Script.log(1, 0, "BK.WebSocket.sendFrameFromTxQ!partial send, total size = " + frameData.length + ", tx size = " + txBytes);
                    break;
                }
            }
            else {
                succ = false;
                BK.Script.log(1, txBytes, "BK.WebSocket.sendFrameFromTxQ!send failed, data type = " + t);
                break;
            }
        }
        if (succ) {
            if (!this.txbufQue.length && this.inTxSegFrame) {
                // notify send complete
                this.inTxSegFrame = false;
            }
        }
        return succ;
    };
    KWebSocket.prototype.recvFrameFromRxQ = function (t) {
        var isBinary = (t == 2 /* BINARY_FRAME */);
        var udata = new BK.Buffer(128, true);
        while (this.rxbufQue.length > 0) {
            var rxbuf = this.rxbufQue.shift();
            udata.writeBuffer(rxbuf);
        }
        udata.rewind();
        this.udataQue.push(new WebSocketData(udata, isBinary));
    };
    KWebSocket.prototype.__sendBinaryFrame = function (data, frameType) {
        var totLen = data.length;
        var segLen = this.options.DefaultSegmentSize;
        var offset = 0;
        data.rewind();
        while (totLen > segLen) {
            var buf = new BK.Buffer(segLen, false);
            data.rewind();
            data.jumpBytes(offset);
            buf.writeBuffer(data.readBuffer(segLen));
            buf.rewind();
            this.txbufQue.push(buf);
            offset = offset + segLen;
            totLen = totLen - segLen;
            //BK.Script.log(1, 0, "BK.WebSocket.__sendBinaryFrame!offset = " + offset + ", totLen = " + totLen);
        }
        if (totLen > 0) {
            var buf = new BK.Buffer(totLen, false);
            data.rewind();
            data.jumpBytes(offset);
            buf.writeBuffer(data.readBuffer(totLen));
            buf.rewind();
            this.txbufQue.push(buf);
        }
        this.txFrameType = frameType;
        return this.sendFrameFromTxQ(frameType);
    };
    KWebSocket.prototype.sendTextFrame = function (text) {
        if (4 /* ESTABLISHED */ != this.state)
            return false;
        var data = new BK.Buffer(128, true);
        data.writeAsString(text, true);
        data.rewind();
        return this.__sendBinaryFrame(data, 1 /* TEXT_FRAME */);
    };
    KWebSocket.prototype.sendBinaryFrame = function (data) {
        if (4 /* ESTABLISHED */ != this.state)
            return;
        return this.__sendBinaryFrame(data, 2 /* BINARY_FRAME */);
    };
    KWebSocket.prototype.sendCloseFrame = function (code, reason) {
        var buf = new BK.Buffer(reason.length + 1, false);
        var data = new BK.Buffer(3 + reason.length, false);
        if (KWebSocket.isLittleEndian) {
            data.writeUint8Buffer((0x0000FF00 & code) >> 8);
            data.writeUint8Buffer((0x000000FF & code));
        }
        else {
            data.writeUint8Buffer((0x000000FF & code));
            data.writeUint8Buffer((0x0000FF00 & code) >> 8);
        }
        buf.writeAsString(reason, true);
        data.writeBuffer(buf);
        var frameData = this.doFrameDataPhase(data, 8 /* CLOSE */);
        _super.prototype.send.call(this, frameData);
        this.state = 1 /* CLOSING */;
        this.startPhaseTimeout(3 /* CLOSE_ACK */);
        BK.Script.log(1, 0, "BK.WebSocket.sendCloseFrame!code = " + code + ", reason = " + reason);
    };
    KWebSocket.prototype.sendPingFrame = function (data) {
        if (this.inPingFrame)
            return;
        BK.Script.log(0, 0, "BK.WebSocket.sendPingFrame!ping data = " + this.bufferToHexString(data));
        var frameData = this.doFrameDataPhase(data, 9 /* PING */);
        _super.prototype.send.call(this, frameData);
        this.inPingFrame = true;
        this.startPhaseTimeout(4 /* CHECK_PONG_SEND_PING */);
    };
    KWebSocket.prototype.sendPongFrame = function (data) {
        if (this.inPongFrame)
            return;
        var frameData = this.doFrameDataPhase(data, 10 /* PONG */);
        _super.prototype.send.call(this, frameData);
        this.inPongFrame = true;
        //BK.Script.log(0, 0, "BK.WebSocket.sendPongFrame!");
    };
    KWebSocket.prototype.onErrorEvent = function (so) {
        _super.prototype.onErrorEvent.call(this, so);
        this.state = -1 /* FAILED */;
        this.errcode = 1006 /* ABNORMAL_CLOSE */;
        this.message = "abnormal closure";
        if (this.delegate.onError) {
            this.delegate.onError(this);
        }
    };
    KWebSocket.prototype.onDisconnectEvent = function (so) {
        _super.prototype.onDisconnectEvent.call(this, so);
        switch (this.state) {
            case 2 /* HANDSHAKE_REQ */:
            case 3 /* HANDSHAKE_RESP */:
            case 4 /* ESTABLISHED */: {
                this.state = -1 /* FAILED */;
                this.errcode = 1006 /* ABNORMAL_CLOSE */;
                this.message = "abnormal closure";
                if (this.delegate.onError) {
                    this.delegate.onError(this);
                }
                break;
            }
            case 1 /* CLOSING */: {
                this.state = 0 /* CLOSED */;
                if (this.delegate.onClose) {
                    this.delegate.onClose(this);
                }
                BK.Script.log(1, 0, "BK.WebSocket.onDisconnectEvent!enter closed state");
                break;
            }
        }
    };
    KWebSocket.prototype.onConnectedEvent = function (so) {
        _super.prototype.onConnectedEvent.call(this, so);
        if (0 /* CLOSED */ == this.state) {
            this.clear();
            this.doHandshakePhase();
            //BK.Script.log(1, 0, "BK.WebSocket.doHandshakePhase");
        }
    };
    KWebSocket.prototype.onUpdateEvent = function (so) {
        _super.prototype.onUpdateEvent.call(this, so);
        switch (this.state) {
            case 2 /* HANDSHAKE_REQ */:
            case 3 /* HANDSHAKE_RESP */: {
                var rlen = so.canRecvLength();
                if (rlen > 0) {
                    var buf = this.recv(rlen);
                    if (undefined != buf) {
                        this.doSvrHandshakePhase1(buf.readAsString(true));
                    }
                }
                this.handlePhaseTimeout();
                break;
            }
            case 4 /* ESTABLISHED */: {
                var rlen = so.canRecvLength();
                if (rlen > 0 &&
                    !this.doSvrFrameDataPhase(this.recv(rlen))) {
                    this.sendCloseFrame(this.errcode, this.message);
                    if (this.delegate.onError) {
                        this.delegate.onError(this);
                    }
                }
                else {
                    if (this.delegate.onMessage) {
                        while (this.udataQue.length > 0) {
                            var udata = this.udataQue.shift();
                            this.delegate.onMessage(this, udata);
                        }
                    }
                    if (this.txbufQue.length > 0) {
                        this.sendFrameFromTxQ(this.txFrameType);
                    }
                    else if (this.delegate.onSendComplete) {
                        this.delegate.onSendComplete(this);
                    }
                    this.inPongFrame = false;
                    this.handlePhaseTimeout();
                    this.handlePingPongTimer();
                }
                break;
            }
            case 1 /* CLOSING */: {
                var rlen = so.canRecvLength();
                if (rlen > 0 &&
                    this.doSvrFrameDataPhase(this.recv(rlen))) {
                    if (this.delegate.onMessage) {
                        while (this.udataQue.length > 0) {
                            var udata = this.udataQue.shift();
                            this.delegate.onMessage(this, udata);
                        }
                    }
                }
                this.handlePhaseTimeout();
                break;
            }
        }
        return 0;
    };
    return KWebSocket;
}(KSocket));
KWebSocket.isLittleEndian = BK.Misc.isLittleEndian();
var TxData = (function () {
    function TxData(data, isBinary) {
        this.data = data;
        this.isBinary = isBinary;
    }
    return TxData;
}());
;
var WebSocket = (function () {
    function WebSocket(url) {
        var _this = this;
        this.options = null;
        this.inTrans = false;
        this.isPendingConn = true;
        this.txdataQ = new Array();
        var res = BK.URL("{}", url);
        this.scheme = res.protocol;
        this.port = res.port;
        this.path = res.path;
        this.host = res.hostname;
        BK.DNS.queryIPAddress(res.hostname, function (reason, af, iplist) {
            switch (reason) {
                case 0: {
                    BK.Script.log(1, 0, "BK.WebSocket.queryIPAddress!iplist = " + JSON.stringify(iplist));
                    _this.iplist = iplist;
                    _this.__nativeObj = new KWebSocket(iplist[0], _this.port, _this.host, _this.path);
                    if (_this.scheme == "wss") {
                        _this.__nativeObj.enableSSL(true);
                    }
                    if (_this.options) {
                        _this.setOptions(_this.options);
                        _this.options = null;
                    }
                    if (_this.isPendingConn) {
                        _this.connect();
                        _this.isPendingConn = false;
                    }
                    _this.__nativeObj.delegate.onOpen = function (kws) {
                        if (_this.txdataQ.length > 0) {
                            _this.send(_this.txdataQ.shift());
                        }
                        if (_this.onOpen) {
                            _this.onOpen(_this);
                        }
                    };
                    _this.__nativeObj.delegate.onClose = function (kws) {
                        if (_this.onClose) {
                            _this.onClose(_this);
                        }
                    };
                    _this.__nativeObj.delegate.onError = function (kws) {
                        if (_this.onError) {
                            _this.onError(_this);
                        }
                    };
                    _this.__nativeObj.delegate.onMessage = function (kws, data) {
                        if (_this.onMessage) {
                            _this.onMessage(_this, data);
                        }
                    };
                    _this.__nativeObj.delegate.onSendComplete = function (kws) {
                        if (_this.txdataQ.length > 0) {
                            var txdata = _this.txdataQ.shift();
                            if (!txdata.isBinary)
                                _this.__nativeObj.sendTextFrame(txdata.data);
                            else
                                _this.__nativeObj.sendBinaryFrame(txdata.data);
                            _this.inTrans = true;
                        }
                        else {
                            _this.inTrans = false;
                        }
                    };
                    break;
                }
            }
        });
    }
    WebSocket.prototype.getReadyState = function () {
        if (this.__nativeObj) {
            return this.__nativeObj.getReadyState();
        }
        return 0 /* CLOSED */;
    };
    WebSocket.prototype.getErrorCode = function () {
        if (this.__nativeObj) {
            return this.__nativeObj.getErrorCode();
        }
        return 65535 /* UNDEFINE */;
    };
    WebSocket.prototype.getErrorString = function () {
        if (this.__nativeObj) {
            return this.__nativeObj.getErrorString();
        }
        return "";
    };
    WebSocket.prototype.close = function () {
        var state = this.getReadyState();
        if (4 /* ESTABLISHED */ == state) {
            this.__nativeObj.sendCloseFrame(1000 /* NORMAL_CLOSE */, "see ya");
        }
    };
    WebSocket.prototype.connect = function () {
        if (this.__nativeObj) {
            return this.__nativeObj.connect() != 0;
        }
        return true;
    };
    WebSocket.prototype.send = function (data) {
        var state = this.getReadyState();
        if (1 /* CLOSING */ == state || 0 /* CLOSED */ == state) {
            return false;
        }
        if (typeof data == "string") {
            if (this.inTrans || state != 4 /* ESTABLISHED */) {
                this.txdataQ.push(new TxData(data, false));
            }
            else {
                this.inTrans = true;
                return this.__nativeObj.sendTextFrame(data);
            }
        }
        else if (typeof data == "object") {
            if (this.inTrans || state != 4 /* ESTABLISHED */) {
                this.txdataQ.push(new TxData(data, true));
            }
            else {
                this.inTrans = true;
                return this.__nativeObj.sendBinaryFrame(data);
            }
        }
        return false;
    };
    WebSocket.prototype.setOptions = function (options) {
        if (!this.__nativeObj) {
            this.options = options;
            return;
        }
        if (options.DrainSegmentCount)
            this.__nativeObj.options.DrainSegmentCount = options.DrainSegmentCount;
        if (options.DefaultSegmentSize)
            this.__nativeObj.options.DefaultSegmentSize = options.DefaultSegmentSize;
        if (options.PingPongInterval)
            this.__nativeObj.options.PingPongInterval = options.PingPongInterval;
        if (options.HandleShakeRequestTimeout)
            this.__nativeObj.options.HandleShakeRequestTimeout = options.HandleShakeRequestTimeout;
        if (options.HandleShakeResponseTimeout)
            this.__nativeObj.options.HandleShakeResponseTimeout = options.HandleShakeResponseTimeout;
        if (options.CloseAckTimeout)
            this.__nativeObj.options.CloseAckTimeout = options.CloseAckTimeout;
        if (options.PingPongTimeout)
            this.__nativeObj.options.PingPongTimeout = options.PingPongTimeout;
    };
    return WebSocket;
}());
BK.WebSocket = WebSocket;
