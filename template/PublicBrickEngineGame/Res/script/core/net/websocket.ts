import "../../../BK"
BK.Script.loadlib("GameRes://script/core/net/dns.js");
BK.Script.loadlib("GameRes://script/core/net/url.js");
BK.Script.loadlib("GameRes://script/core/net/http_parser.js");

interface ISocket {
    options: Map<number>;
    curNetState(): BK_NET_STATE;
    canRecvLength(): number;
    send(data: BK.Buffer): number;
    recv(length: number): BK.Buffer;
    close(): number;
    connect(): number;
    update(): BK_SOCKET_STATE;
    isEnableSSL(): boolean;
    enableSSL(ssl:boolean): void;
}

interface ISocketEvent {
    onErrorEvent(so: ISocket): void;
    onUpdateEvent(so: ISocket): void;
    onTimeoutEvent(so: ISocket): void;
    onConnectingEvent(so: ISocket): void;
    onConnectedEvent(so: ISocket): void;
    onReconnectEvent(so: ISocket): void;
    onDisconnectEvent(so: ISocket): void;
}

class SocketEventMgr {
    public static readonly Instance: SocketEventMgr = new SocketEventMgr();
    private _wsArray: ISocket[] = [];
    private constructor() {
        BK.Director.ticker.add(function(ts:number, duration:number) {
            SocketEventMgr.Instance.dispatchEvent();
        })
    }

    add(so: ISocket): void {
        this._wsArray.push(so);
        BK.Script.log(1, 0, "SocketEventMgr.add!so = " + so);
    }

    del(so: ISocket): void {
        let idx:number = this._wsArray.indexOf(so, 0);
        if (idx >= 0) {
            this._wsArray.splice(idx, 1);
            BK.Script.log(1, 0, "SocketEventMgr.del!so = " + so);
        }
    }

    dispatchEvent(): void {
        this._wsArray.forEach(function(so:ISocket, index:number, array:ISocket[]){
            if (so) {
                so.update();
            }
        })
    }
}

class KSocket implements ISocket, ISocketEvent {
    private __nativeObj: BK.Socket;
    protected ip: string;
    protected port: number;
    protected prevNetState: BK_NET_STATE;
    protected prevConnTs: number;
    protected curConnRetrys: number;
    protected curConnTimeout: number;
    options: Map<number>;
    constructor(ip: string, port: number) {
        this.ip = ip;
        this.port = port;
        this.__nativeObj = new BK.Socket();
        this.prevConnTs = 0;
        this.curConnRetrys = 0;
        this.curConnTimeout = 0;
        this.prevNetState = BK_NET_STATE.UNCONNECT;
        this.options = {
            ConnectRetryCount: 3,
            ConnectTimeoutInterval: 3000
        };
    }

    protected __internalClose(): number {
        if (this.__nativeObj) {
            return this.__nativeObj.close();
        }
        return -2;
    }

    protected __internalSend(data: BK.Buffer): number {
        if (this.__nativeObj) {
            return this.__nativeObj.send(data);
        }
        return -2;
    }

    protected __internalRecv(length: number): BK.Buffer {
        if (this.__nativeObj) {
            return this.__nativeObj.receive(length);
        }
        return undefined;
    }

    protected __internalUpdate(): number {
        if (this.__nativeObj) {
            return this.__nativeObj.update();
        }
        return -2;
    }

    protected __internalConnect(): number {
        if (this.__nativeObj) {
            let ret:number = this.__nativeObj.connect(this.ip, this.port);
            let curNetStat:BK_NET_STATE = this.curNetState();
            switch (this.prevNetState) {
                case BK_NET_STATE.DISCONNECTED:
                    this.onReconnectEvent(this);
                case BK_NET_STATE.UNCONNECT: {
                    switch (curNetStat) {
                        case BK_NET_STATE.DISCONNECTED: {
                            this.onErrorEvent(this);
                            break;
                        }
                        case BK_NET_STATE.CONNECTING:
                        case BK_NET_STATE.SSL_SHAKEHANDING: {
                            this.prevConnTs = BK.Time.clock;
                            this.curConnTimeout = this.options.ConnectTimeoutInterval;
                            this.onConnectingEvent(this);
                            ret = 0;
                            break;
                        }
                        case BK_NET_STATE.CONNECTED:
                        case BK_NET_STATE.SSL_SHAKEHAND_DONE: {
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
    }

    protected __internalCanReadLength(): number {
        if (this.__nativeObj) {
            return this.__nativeObj.canReadLength();
        }
        return 0;
    }

    protected __internalIsEnableSSL(): boolean {
        if (this.__nativeObj) {
            return this.__nativeObj.getSSLEnable();
        }
        return false;
    }

    protected __internalEnableSSL(ssl: boolean): void {
        if (this.__nativeObj) {
            this.__nativeObj.setSSLEnable(ssl);
        }
    }

    protected __internalUpdateSSL(): BK_SOCKET_STATE {
        let state:BK_SOCKET_STATE = this.__internalUpdate();
        let curNetStat:BK_NET_STATE = this.curNetState();
        if (BK_SOCKET_STATE.FAIL != state) {
            switch (this.prevNetState) {
                case BK_NET_STATE.CONNECTING: {
                    switch (curNetStat) {
                        case BK_NET_STATE.CONNECTED: {
                            BK.Script.log(1, 0, "BK.Socket.update.ssl!connected, ip = " + this.ip + ", port = " + this.port);    
                            break;
                        }
                        default: {
                            let curTs:number = BK.Time.clock;
                            let diffT:number = BK.Time.diffTime(this.prevConnTs, curTs);
                            if (diffT * 1000 >= this.curConnTimeout) {
                                this.curConnRetrys = this.curConnRetrys + 1;
                                if (this.curConnRetrys < this.options.ConnectRetryCount) {
                                    this.close();
                                    this.connect();
                                    this.curConnTimeout = this.curConnTimeout * 2;
                                } else {
                                    this.onTimeoutEvent(this);
                                    this.close();
                                }
                            }
                        }
                    }
                    break;
                }
                case BK_NET_STATE.CONNECTED: {
                    break;
                }
                case BK_NET_STATE.SSL_SHAKEHANDING: {
                    switch (curNetStat) {
                        case BK_NET_STATE.SSL_SHAKEHAND_DONE: {
                            switch (state) {
                                case BK_SOCKET_STATE.CAN_WRITE:
                                case BK_SOCKET_STATE.CAN_READ_WRITE: {
                                    this.onConnectedEvent(this);
                                    break;
                                }
                            }
                            break;
                        }
                        default: {
                            let curTs:number = BK.Time.clock;
                            let diffT:number = BK.Time.diffTime(this.prevConnTs, curTs);
                            if (diffT * 1000 >= this.curConnTimeout) {
                                this.curConnRetrys = this.curConnRetrys + 1;
                                if (this.curConnRetrys < this.options.ConnectRetryCount) {
                                    this.close();
                                    this.connect();
                                    this.curConnTimeout = this.curConnTimeout * 2;
                                } else {
                                    this.onTimeoutEvent(this);
                                    this.close();
                                }
                            }
                        }
                    }
                    break;
                }
                case BK_NET_STATE.SSL_SHAKEHAND_DONE: {
                    switch (curNetStat) {
                        case BK_NET_STATE.SSL_SHAKEHAND_DONE: {
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
        } else {
            switch (this.prevNetState) {
                case BK_NET_STATE.CONNECTED:
                case BK_NET_STATE.CONNECTING: {
                    this.onDisconnectEvent(this);
                    break;
                }
                case BK_NET_STATE.SSL_SHAKEHANDING:
                case BK_NET_STATE.SSL_SHAKEHAND_FAIL:
                case BK_NET_STATE.SSL_SHAKEHAND_DONE: {
                    this.onErrorEvent(this);
                    break;
                }
            }
        }
        this.prevNetState = curNetStat;
        return state;
    }

    protected __internalUpdateNoSSL(): BK_SOCKET_STATE {
        let state:BK_SOCKET_STATE = this.__internalUpdate();
        let curNetStat:BK_NET_STATE = this.curNetState();
        //BK.Script.log(1, 0, "BK.Socket.update!prevNetStat = " + this.prevNetState + ", curNetStat = " + curNetStat);
        if (BK_SOCKET_STATE.FAIL != state) {
            switch (this.prevNetState) {
                case BK_NET_STATE.CONNECTING: {
                    switch (curNetStat) {
                        case BK_NET_STATE.CONNECTED: {
                            switch (state) {
                                case BK_SOCKET_STATE.CAN_WRITE: {
                                    this.onConnectedEvent(this);
                                    break;
                                }
                                case BK_SOCKET_STATE.CAN_READ_WRITE: {
                                    BK.Script.log(1, 0, "BK.Socket.update!unexcepted status");
                                    break;
                                }
                            }
                            break;
                        }
                        default: {
                            let curTs:number = BK.Time.clock;
                            let diffT:number = BK.Time.diffTime(this.prevConnTs, curTs);
                            if (diffT * 1000 >= this.curConnTimeout) {
                                this.curConnRetrys = this.curConnRetrys + 1;
                                if (this.curConnRetrys < this.options.ConnectRetryCount) {
                                    this.close();
                                    this.connect();
                                    this.curConnTimeout = this.curConnTimeout * 2;
                                } else {
                                    this.onTimeoutEvent(this);
                                    this.close();
                                }
                            }
                        }
                    }
                    break;
                }
                case BK_NET_STATE.CONNECTED: {
                    switch (curNetStat) {
                        case BK_NET_STATE.CONNECTED: {
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
        } else {
            switch (this.prevNetState) {
                case BK_NET_STATE.CONNECTED:
                case BK_NET_STATE.CONNECTING: {
                    this.onDisconnectEvent(this);
                    break;
                }
            }
        }
        this.prevNetState = curNetStat;
        return state;
    }

    curNetState(): BK_NET_STATE {
        if (this.__nativeObj) {
            return this.__nativeObj.state;
        }
        return BK_NET_STATE.UNCONNECT;
    }

    close(): number {
        let ret:number = this.__internalClose();
        if (!ret)
            this.prevNetState = BK_NET_STATE.UNCONNECT;
        SocketEventMgr.Instance.del(<ISocket>(this));
        return ret;
    }

    send(data: BK.Buffer): number {
        let ret:number = this.__internalSend(data);
        return ret;
    }

    recv(length: number): BK.Buffer {
        return this.__internalRecv(length);
    }

    canRecvLength(): number {
        return this.__internalCanReadLength();
    }

    update(): BK_SOCKET_STATE {
        if (this.isEnableSSL()) {
            return this.__internalUpdateSSL();
        }
        return this.__internalUpdateNoSSL();
    }

    connect(): number {
        let stat:BK_NET_STATE = this.curNetState();
        if (BK_NET_STATE.UNCONNECT == stat ||
            BK_NET_STATE.DISCONNECTED == stat) {
            let ret:number = this.__internalConnect();
            if (!ret) {
                SocketEventMgr.Instance.add(<ISocket>(this));
            }
            return ret;
        }
        return 0;
    }

    isEnableSSL(): boolean {
        return this.__internalIsEnableSSL();
    }

    enableSSL(ssl:boolean): void {
        this.__internalEnableSSL(ssl);
    }

    onErrorEvent(so: ISocket): void {
        BK.Script.log(1, 0, "BK.Socket.ErrorEvent");
    }

    onUpdateEvent(so: ISocket): number {
        //BK.Script.log(1, 0, "BK.Socket.UpdateEvent");
        return 0;
    }

    onTimeoutEvent(so: ISocket): void {
        BK.Script.log(1, 0, "BK.Socket.TimeoutEvent");
    }

    onConnectingEvent(so: ISocket): void {
        BK.Script.log(1, 0, "BK.Socket.ConnectingEvent");
    }

    onConnectedEvent(so: ISocket): void {
        BK.Script.log(1, 0, "BK.Socket.ConnectedEvent");
    }

    onReconnectEvent(so: ISocket): void {
        BK.Script.log(1, 0, "BK.Socket.ReconnectEvent");
    }

    onDisconnectEvent(so: ISocket): void {
        BK.Script.log(1, 0, "BK.Socket.DisconnectEvent");
    }
}



const enum BK_WS_PARSE_STATE {
    NEW_DATA           = 0,
    FRAME_HDR_1        = 1,
    FRAME_HDR_LEN      = 2,
    FRAME_HDR_LEN16_2  = 3,
    FRAME_HDR_LEN16_1  = 4,
    FRAME_HDR_LEN64_8  = 5,
    FRAME_HDR_LEN64_7  = 6,
    FRAME_HDR_LEN64_6  = 7,
    FRAME_HDR_LEN64_5  = 8,
    FRAME_HDR_LEN64_4  = 9,
    FRAME_HDR_LEN64_3  = 10,
    FRAME_HDR_LEN64_2  = 11,
    FRAME_HDR_LEN64_1  = 12,
    FRAME_MASK_KEY_1   = 13,
    FRAME_MASK_KEY_2   = 14,
    FRAME_MASK_KEY_3   = 15,
    FRAME_MASK_KEY_4   = 16,
    FRAME_PAYLOAD_DATA = 17
}

const enum BK_WS_OPCODE {
    CONTINOUS     = 0x0,
    TEXT_FRAME    = 0x1,
    BINARY_FRAME  = 0x2,
    CLOSE         = 0x8,
    PING          = 0x9,
    PONG          = 0xA
}

const enum BK_WS_PHASE_TIMEOUT {
    HANDSHAKE_REQUEST    = 0x1,
    HANDSHAKE_RESPONE    = 0x2,
    CLOSE_ACK            = 0x3, 
    CHECK_PONG_SEND_PING = 0x4,
    NO_PENDING_TIMEOUT   = 0x6
}

class WebSocketData {
    public data:BK.Buffer;
    public readonly isBinary:boolean;
    constructor(data:BK.Buffer, isBinary:boolean) {
        this.data = data;
        this.isBinary = isBinary;
    }
}

interface IKWebSocketDelegate {
    onOpen: (kws:KWebSocket) => void;
    onClose: (kws:KWebSocket) => void;
    onError: (kws:KWebSocket) => void;
    onMessage: (kws:KWebSocket, data:WebSocketData) => void;
    onSendComplete: (kws:KWebSocket) => void;
}

class KWebSocket extends KSocket {
    private static readonly isLittleEndian:boolean = BK.Misc.isLittleEndian();
    private path:string;
    private host:string;
    private httpVer:number;
    private httpParser:HTTPParser;
    private version:number;
    private protocols: string[];
    private extensions: string[];
    private handshakeSig:string;
    private mask4: BK.Buffer;
    private txbuf: BK.Buffer;
    private rxbuf: BK.Buffer;
    private rxbuflen: number;
    private txbufQue: Array<BK.Buffer>;
    private rxbufQue: Array<BK.Buffer>;
    private udataQue: Array<WebSocketData>;
    private maskBit: number;
    private opcode: BK_WS_OPCODE;
    private errcode: BK_WS_ERR_CODE;
    private message: string;
    private txFrameType: BK_WS_OPCODE;
    private rxFrameType: BK_WS_OPCODE;
    private peerClosed: boolean;
    private txSegCount: number;
    private rxSegCount: number;
    private isFinalSeg: boolean;
    private inTxSegFrame: boolean;
    private inRxSegFrame: boolean;
    private inPartialTxbuf: boolean;
    private inPingFrame: boolean;
    private inPongFrame: boolean;
    private txPingData: BK.Buffer;
    private rxPongData: BK.Buffer;
    private prevPhaseTickCount: number;
    private prevPingPongTickCount: number;
    private state: BK_WS_STATE;
    private parseState: BK_WS_PARSE_STATE;
    private phaseTimeout: BK_WS_PHASE_TIMEOUT;
    private pingpongTimer: BK_WS_PHASE_TIMEOUT;
    delegate: IKWebSocketDelegate;
    constructor(ip: string, port: number, host:string, path?:string) {
        super(ip, port);
        this.path = path ? path: "/";
        this.host = host;
        this.httpVer = 1.1;
        this.httpParser = new HTTPParser(HTTPParser.RESPONSE);
        this.version = 13;
        this.protocols = new Array<string>();
        this.extensions = new Array<string>();
        this.delegate = {
            onOpen: null, onClose: null, onError: null, onMessage: null, onSendComplete: null
        };
        if (!this.options) {
            this.options = {}
        }
        this.options.DrainSegmentCount = 8;
        this.options.DefaultSegmentSize = 512;
        this.options.PingPongInterval = 0;
        this.options.HandleShakeRequestTimeout = 10000;
        this.options.HandleShakeResponseTimeout = 10000;
        this.options.CloseAckTimeout = 20000;
        this.options.PingPongTimeout = 3000;
        this.clear();
    }

    clear(): void {
        this.mask4 = new BK.Buffer(4, false);
        this.txbuf = new BK.Buffer(128, true);
        this.rxbuf = new BK.Buffer(128, true);
        this.txbufQue = new Array<BK.Buffer>();
        this.rxbufQue = new Array<BK.Buffer>();
        this.udataQue = new Array<WebSocketData>();
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
        this.errcode = BK_WS_ERR_CODE.UNDEFINE;
        this.state = BK_WS_STATE.CLOSED;
        this.parseState = BK_WS_PARSE_STATE.NEW_DATA;
        this.phaseTimeout = 0;
        this.pingpongTimer = 0;
        this.prevPhaseTickCount = 0;
        this.prevPingPongTickCount = 0;
    }

    getReadyState(): BK_WS_STATE {
        return this.state;
    }

    getErrorCode(): BK_WS_ERR_CODE {
        return this.errcode;
    }

    getErrorString(): string {
        return this.message;
    }

    randomN(n:number): BK.Buffer {
        let b:BK.Buffer = new BK.Buffer(n, false);
        for (let i = 0; i < n; i++) {
            let r:number = Math.round(Math.random() * 65535);
            b.writeUint8Buffer(r);
        } 
        return b;
    }

    toHex(c:number):string {
        if (c >= 0 && c <= 9) return c.toString();
        switch (c) {
            case 10: return 'A';
            case 11: return 'B';
            case 12: return 'C';
            case 13: return 'D';
            case 14: return 'E';
            case 15: return 'F';
        }
        return 'u';
    }

    bufferToHexString(buf:BK.Buffer): string {
        let s:string = "";
        buf.rewind();
        while (!buf.eof) {
            let c:number = buf.readUint8Buffer();
            s = s.concat('x' + this.toHex((c & 0xF0) >> 4) + this.toHex((c & 0x0F)) + ' ');
        }
        return s;
    }

    startPhaseTimeout(phase: BK_WS_PHASE_TIMEOUT): void {
        if (phase == BK_WS_PHASE_TIMEOUT.NO_PENDING_TIMEOUT) {
            this.phaseTimeout = phase;
            this.prevPhaseTickCount = 0;
        } else {
            switch (this.state) {
                case BK_WS_STATE.HANDSHAKE_REQ: {
                    if (phase == BK_WS_PHASE_TIMEOUT.HANDSHAKE_REQUEST) {
                        this.phaseTimeout = phase;
                        this.prevPhaseTickCount = BK.Time.clock;
                        //BK.Script.log(1, 0, "BK.WebSocket.startPhaseTimeout! request, ts = " + this.prevPhaseTickCount);
                    }
                    break;
                }
                case BK_WS_STATE.HANDSHAKE_RESP: {
                    if (phase == BK_WS_PHASE_TIMEOUT.HANDSHAKE_RESPONE) {
                        this.phaseTimeout = phase;
                        this.prevPhaseTickCount = BK.Time.clock;
                        //BK.Script.log(1, 0, "BK.WebSocket.startPhaseTimeout! response, ts = " + this.prevPhaseTickCount);
                    }
                    break;
                }
                case BK_WS_STATE.CLOSING: {
                    if (phase == BK_WS_PHASE_TIMEOUT.CLOSE_ACK) {
                        this.phaseTimeout = phase;
                        this.prevPhaseTickCount = BK.Time.clock;
                        //BK.Script.log(1, 0, "BK.WebSocket.startPhaseTimeout! close ack, ts = " + this.prevPhaseTickCount);
                    }
                    break;
                }
                case BK_WS_STATE.ESTABLISHED: {
                    switch (phase) {
                        case BK_WS_PHASE_TIMEOUT.CHECK_PONG_SEND_PING: {
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
    }

    handlePhaseTimeout(): void {
        if (this.phaseTimeout == BK_WS_PHASE_TIMEOUT.NO_PENDING_TIMEOUT)
            return ;
        let interval:number = BK.Time.diffTime(this.prevPhaseTickCount, BK.Time.clock);
        switch (this.phaseTimeout) {
             case BK_WS_PHASE_TIMEOUT.HANDSHAKE_REQUEST: {
                if (interval * 1000 > this.options.HandleShakeRequestTimeout) {
                    BK.Script.log(1, 0, "BK.WebSocket.handlePhaseTimeout!handshake request timeout");
                    this.prevPhaseTickCount = BK.Time.clock;
                    this.state = BK_WS_STATE.FAILED;
                    this.errcode = BK_WS_ERR_CODE.HANDSHAKE_REQ_TIMEOUT;
                    this.message = "handshake request timeout";
                    super.close();
                    if (this.delegate.onError) {
                        this.delegate.onError(this);
                    }
                }
                break;
            }
            case BK_WS_PHASE_TIMEOUT.HANDSHAKE_RESPONE: {
                if (interval * 1000 > this.options.HandleShakeResponseTimeout) {
                    BK.Script.log(1, 0, "BK.WebSocket.handlePhaseTimeout!handshake response timeout");
                    this.prevPhaseTickCount = BK.Time.clock;
                    this.state = BK_WS_STATE.FAILED;
                    this.errcode = BK_WS_ERR_CODE.HANDSHAKE_RSP_TIMEOUT;
                    this.message = "handshake response timeout";
                    super.close();
                    if (this.delegate.onError) {
                        this.delegate.onError(this);
                    }
                }
                break;
            }
            case BK_WS_PHASE_TIMEOUT.CLOSE_ACK: {
                if (interval * 1000 > this.options.CloseAckTimeout) {
                    BK.Script.log(1, 0, "BK.WebSocket.handlePhaseTimeout!close ack timeout");
                    this.prevPhaseTickCount = BK.Time.clock;
                    if (BK_WS_STATE.CLOSING == this.state) {
                        if (!this.peerClosed) {
                            this.errcode = BK_WS_ERR_CODE.ABNORMAL_CLOSE;
                            this.message = "abnormal close";
                            this.startPhaseTimeout(BK_WS_PHASE_TIMEOUT.NO_PENDING_TIMEOUT);
                        }
                        super.close();
                        if (this.delegate.onError) {
                            this.delegate.onError(this);
                        }
                    }
                }
                break;
            }
            case BK_WS_PHASE_TIMEOUT.CHECK_PONG_SEND_PING: {
                if (interval * 1000 > this.options.PingPongTimeout) {
                    BK.Script.log(1, 0, "BK.WebSocket.handlePhaseTimeout!receive pong timeout");
                    this.prevPhaseTickCount = BK.Time.clock;
                }
                break;
            }
        }
    }

    restartPingPongTimer(): void {
        if (BK_WS_STATE.ESTABLISHED == this.state &&
            this.options.PingPongInterval > 0) {
            this.prevPingPongTickCount = BK.Time.clock;
            //BK.Script.log(0, 0, "BK.WebSocket.restartPingPongTimer!interval = " + this.options.PingPongInterval);
        }
    }

    handlePingPongTimer(): void {
        if (BK_WS_STATE.ESTABLISHED == this.state &&
            this.options.PingPongInterval > 0) {
            let interval:number = BK.Time.diffTime(this.prevPingPongTickCount, BK.Time.clock);
            if (interval * 1000 > this.options.PingPongInterval) {
                this.inPingFrame = false;
                this.txPingData = this.randomN(16);
                this.sendPingFrame(this.txPingData);
                this.restartPingPongTimer();
            }
        }
    }

    doHandshakePhase(): void {
        let s:string = "";
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
        } else {
            s = s.concat("Host:" + this.host + ":" + this.port + "\r\n");
        }

        s = s.concat("Upgrade:websocket\r\n");
        s = s.concat("Connection:Upgrade\r\n");

        let r16:BK.Buffer = this.randomN(16);
        let s64:string = BK.Misc.encodeBase64FromBuffer(r16);
        s = s.concat("Sec-WebSocket-Key:" + s64 + "\r\n");

        s = s.concat("Sec-WebSocket-Version:" + this.version + "\r\n\r\n");

        //BK.Script.log(1, 0, 'BK.WebSocket.doHandshakePhase! Request Message = ' + s);

        let sha:BK.Buffer = BK.Misc.sha1(s64.concat("258EAFA5-E914-47DA-95CA-C5AB0DC85B11"));
        this.handshakeSig = BK.Misc.encodeBase64FromBuffer(sha);

        //BK.Script.log(1, 0, "BK.WebSocket.doHandshakePhase!handshakeSig = " + this.handshakeSig);

        let data:BK.Buffer = new BK.Buffer(s.length, false);
        data.writeAsString(s, false);

        super.send(data);
        this.state = BK_WS_STATE.HANDSHAKE_REQ;
        this.startPhaseTimeout(BK_WS_PHASE_TIMEOUT.HANDSHAKE_REQUEST);
    }

    doSvrHandshakePhase1(resp:string): void {
        if (!resp)
            return;
        //BK.Script.log(1, 0, "doSvrHandshakePhase1! Response Message = " + resp);
        if (!this.httpParser.onComplete) {
            this.httpParser.onComplete = () => {
                //BK.Script.log(1, 0, "BK.WebSocket.doSvrHandshakePhase1!completed");
                for (let k in this.httpParser.headers) {
                    //BK.Script.log(1, 0, k + ": " + this.httpParser.headers[k] + "\r\n");
                }
                if (!this.doSvrHandshakePhase2()) {
                    this.errcode = BK_WS_ERR_CODE.HANDSHAKE_PARSE_ERROR;
                    this.message = "handshake parse error";
                    this.startPhaseTimeout(BK_WS_PHASE_TIMEOUT.NO_PENDING_TIMEOUT);
                    super.close();
                    if (this.delegate.onError) {
                        this.delegate.onError(this);
                    }
                } else {
                    this.restartPingPongTimer();
                    this.startPhaseTimeout(BK_WS_PHASE_TIMEOUT.NO_PENDING_TIMEOUT);
                    if (this.delegate.onOpen) {
                        this.delegate.onOpen(this);
                    }
                }
            }
        }
        this.httpParser.execute(resp);
        if (BK_WS_STATE.HANDSHAKE_REQ == this.state) {
            this.state = BK_WS_STATE.HANDSHAKE_RESP;
            this.startPhaseTimeout(BK_WS_PHASE_TIMEOUT.HANDSHAKE_RESPONE);
        }
    }

    doSvrHandshakePhase2(): boolean {
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
                    this.state = BK_WS_STATE.FAILED;
                    BK.Script.log(1, 0, "BK.WebSocket.doSvrHandshakePhase2!missing \'upgrade\' header");
                    return false;
                }
                if (undefined == this.httpParser.headers["connection"]) {
                    this.state = BK_WS_STATE.FAILED;
                    BK.Script.log(1, 0, "BK.WebSocket.doSvrHandshakePhase2!missing \'connection\' header");
                    return false;
                }
                if ("upgrade" != this.httpParser.headers["connection"].toLowerCase()) {
                    this.state = BK_WS_STATE.FAILED;
                    BK.Script.log(1, 0, "BK.WebSocket.doSvrHandshakePhase2!error \'connection\' header");
                    return false;
                }
                if (undefined == this.httpParser.headers["sec-websocket-accept"]) {
                    this.state = BK_WS_STATE.FAILED;
                    BK.Script.log(1, 0, "BK.WebSocket.doSvrHandshakePhase2!missing \'sec-websocket-accept\' header"); 
                    return false;
                }
                if (this.handshakeSig != this.httpParser.headers["sec-websocket-accept"]) {
                    this.state = BK_WS_STATE.FAILED;
                    BK.Script.log(1, 0, "BK.WebSocket.doSvrHandshakePhase2!error \'sec-websocket-accept\' header"); 
                    return false;
                }

                this.state = BK_WS_STATE.ESTABLISHED;
                //BK.Script.log(1, 0, "BK.WebSocket.doServerHanshakePhase2!success");
                return true;
            }
            case 401: {
                break;
            }
        }
        return false;
    }

    doFrameDataPhase(data:BK.Buffer, opCode:number, moreSegs:boolean = false): BK.Buffer {
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
        let total:number = 6;
        let length:number = data.length;
        
        if (this.extensions.length > 0) {
            
        }

        total = total + length;

        let buf:BK.Buffer = new BK.Buffer(total, false);
        let bitMask:number = 0;
        let isMask:boolean = false;
        switch (this.version) {
            case 13: {
                isMask = true;
                bitMask = 0x00000080;
                break;
            }
        }

        let fin:boolean = true;
        switch (opCode) {
            case BK_WS_OPCODE.TEXT_FRAME:
            case BK_WS_OPCODE.BINARY_FRAME: {
                if (moreSegs) {
                    if (!this.inTxSegFrame) {// first segment
                        fin = false;
                        this.inTxSegFrame = true;
                    } else {
                        fin = false;
                        opCode = BK_WS_OPCODE.CONTINOUS;
                    }
                } else {
                    if (this.inTxSegFrame) {// final segment
                        opCode = BK_WS_OPCODE.CONTINOUS;
                    }
                }
                break;
            }
        }

        if (!fin) {
            buf.writeUint8Buffer(0x0000000F & opCode);
        } else {
            buf.writeUint8Buffer(0x00000080 | (0x0000000F & opCode));
        }

        if (length < 126) {
            buf.writeUint8Buffer(bitMask | (0x0000007F & data.length));
        } else {
            if (length < 65536) {
                buf.writeUint8Buffer(bitMask | 126);
                if (KWebSocket.isLittleEndian) {
                    buf.writeUint8Buffer((0x0000FF00 & length)>>8);
                    buf.writeUint8Buffer((0x000000FF & length));
                } else {
                    buf.writeUint8Buffer((0x000000FF & length));
                    buf.writeUint8Buffer((0x0000FF00 & length)>>8);
                }
            } else {
                //buf.writeUint8Buffer(bitMask | 127);
                BK.Script.log(1, 0, "BK.WebSocket.doFrameDataPhase!js don't support 64bit data type");
            }
        }

        if (isMask) {
            let mask:BK.Buffer = this.randomN(4);
            BK.Misc.encodeBufferXorMask4(data, mask);
            buf.writeBuffer(mask);
        }

        buf.writeBuffer(data);
        return buf;
    }

    doSvrFrameDataPhase(data:BK.Buffer): boolean {
        if (!data)
            return true;
        while (!data.eof) {
            switch (this.parseState) {
                case BK_WS_PARSE_STATE.NEW_DATA: {
                    this.mask4.rewind();
                    this.rxbuf = new BK.Buffer(this.options.DefaultSegmentSize, true);
                    this.maskBit = 0;
                    this.rxbuflen = 0;
                    this.isFinalSeg = false;
                    this.parseState = BK_WS_PARSE_STATE.FRAME_HDR_1;
                }
                case BK_WS_PARSE_STATE.FRAME_HDR_1: {
                    let hdr1:number = data.readUint8Buffer();
                    if ((hdr1 & 0x00000080)) {
                        this.isFinalSeg = true;
                    } else {
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
                                    this.errcode = BK_WS_ERR_CODE.PROTO_ERRS;
                                    this.message = "protocol error";
                                    BK.Script.log(1, 0, "BK.WebSocket.doSvrFrameDataPhase!unknown opcode = " + this.opcode);
                                    return false;
                            }
                            break;
                        }
                    }
                    switch (this.opcode) {
                        case BK_WS_OPCODE.CLOSE:
                        case BK_WS_OPCODE.PING:
                        case BK_WS_OPCODE.PONG:
                        case BK_WS_OPCODE.CONTINOUS:
                            break;
                        default: {
                            if (!this.isFinalSeg) {
                                if (this.opcode != BK_WS_OPCODE.TEXT_FRAME && 
                                    this.opcode != BK_WS_OPCODE.BINARY_FRAME) {
                                    this.errcode = BK_WS_ERR_CODE.UNSUPPORTED_DATA;
                                    this.message = "unsupported data";
                                    BK.Script.log(1, 0, "BK.WebSocket.doSvrFrameDataPhase!illegal opcode = " + this.opcode);
                                    return false;
                                }
                            }
                            if (-1 == this.rxFrameType) {
                                this.rxFrameType = this.opcode;
                            } else if (this.rxFrameType != this.opcode) {
                                this.errcode = BK_WS_ERR_CODE.PROTO_ERRS;
                                this.message = "protocol error";
                                BK.Script.log(1, 0, "BK.WebSocket.doSvrFrameDataPhase!rxFrameType = " + this.rxFrameType + ", illegal opcode = " + this.opcode);
                                return false;
                            }
                        }
                    }
                    //BK.Script.log(0, 0, "BK.WebSocket.doSvrFrameDataPhase!finalSeg = " + this.isFinalSeg + ", opcode = " + this.opcode);
                    this.parseState = BK_WS_PARSE_STATE.FRAME_HDR_LEN;
                    if (data.eof)
                        return true;
                }
                case BK_WS_PARSE_STATE.FRAME_HDR_LEN: {
                    let hdrLen:number = data.readUint8Buffer();
                    this.maskBit = ((0x00000080 & hdrLen) >> 7);
                    switch ((0x0000007F & hdrLen)) {
                        case 126: {
                            this.parseState = BK_WS_PARSE_STATE.FRAME_HDR_LEN16_2;
                            if (data.eof)
                                return true;
                            break;
                        }
                        case 127: {
                            this.parseState = BK_WS_PARSE_STATE.FRAME_HDR_LEN64_8;
                            if (data.eof)
                                return true;
                            break;
                        }
                        default: {
                            this.rxbuflen = (0x0000007F & hdrLen);
                            if (this.maskBit == 1) {
                                this.parseState = BK_WS_PARSE_STATE.FRAME_MASK_KEY_1;
                            } else {
                                this.parseState = BK_WS_PARSE_STATE.FRAME_PAYLOAD_DATA;
                            }
                            //BK.Script.log(0, 0, "BK.WebSocket.doSvrFrameDataPhase!maskBit = " + this.maskBit + ", rxbuflen = " + this.rxbuflen);
                            if (this.rxbuflen > 0 && data.eof)
                                return true;
                        }
                    }
                }
            }
            switch (this.parseState) {
                case BK_WS_PARSE_STATE.FRAME_HDR_LEN16_2: {
                    let n:number = data.readUint8Buffer();
                    if (KWebSocket.isLittleEndian) {
                        this.rxbuflen |= ((0x000000FF & n) << 8);
                    } else {
                        this.rxbuflen |= (0x000000FF & n);
                    }
                    if (data.eof)
                        return true;
                }
                case BK_WS_PARSE_STATE.FRAME_HDR_LEN16_1: {
                    let n:number = data.readUint8Buffer();
                    if (KWebSocket.isLittleEndian) {
                        this.rxbuflen |= (0x000000FF & n);
                    } else {
                        this.rxbuflen |= ((0x000000FF & n) << 8);
                    }
                    if (this.maskBit == 1) {
                        this.parseState = BK_WS_PARSE_STATE.FRAME_MASK_KEY_1;
                    } else {
                        this.parseState = BK_WS_PARSE_STATE.FRAME_PAYLOAD_DATA;
                    }
                    if (this.rxbuflen > 0 && data.eof) {
                        return true;
                    }
                    break;
                }
                case BK_WS_PARSE_STATE.FRAME_HDR_LEN64_8: 
                case BK_WS_PARSE_STATE.FRAME_HDR_LEN64_7: 
                case BK_WS_PARSE_STATE.FRAME_HDR_LEN64_6: 
                case BK_WS_PARSE_STATE.FRAME_HDR_LEN64_5:
                case BK_WS_PARSE_STATE.FRAME_HDR_LEN64_4:
                case BK_WS_PARSE_STATE.FRAME_HDR_LEN64_3:
                case BK_WS_PARSE_STATE.FRAME_HDR_LEN64_2:
                case BK_WS_PARSE_STATE.FRAME_HDR_LEN64_1: {
                    this.errcode = BK_WS_ERR_CODE.PROTO_ERRS;
                    this.message = "protocol errors";
                    BK.Script.log(1, 0, "BK.WebSocket.doSvrFrameDataPhase!js don't support 64bit data type");
                    return false;
                }
            }
            switch (this.parseState) {
                case BK_WS_PARSE_STATE.FRAME_MASK_KEY_1: {
                    this.mask4.writeUint8Buffer(data.readUint8Buffer());
                    this.parseState = BK_WS_PARSE_STATE.FRAME_MASK_KEY_2;
                    if (data.eof)
                        return true;
                }
                case BK_WS_PARSE_STATE.FRAME_MASK_KEY_2: {
                    this.mask4.writeUint8Buffer(data.readUint8Buffer());
                    this.parseState = BK_WS_PARSE_STATE.FRAME_MASK_KEY_3;
                    if (data.eof)
                        return true;
                }
                case BK_WS_PARSE_STATE.FRAME_MASK_KEY_3: {
                    this.mask4.writeUint8Buffer(data.readUint8Buffer());
                    this.parseState = BK_WS_PARSE_STATE.FRAME_MASK_KEY_4;
                    if (data.eof)
                        return true;
                }
                case BK_WS_PARSE_STATE.FRAME_MASK_KEY_4: {
                    this.mask4.writeUint8Buffer(data.readUint8Buffer());
                    this.parseState = BK_WS_PARSE_STATE.FRAME_PAYLOAD_DATA;
                    if (data.eof)
                        return true;
                }
            }
            if (BK_WS_PARSE_STATE.FRAME_PAYLOAD_DATA == this.parseState) {
                this.rxbuf.writeBuffer(data.readBuffer(this.rxbuflen));
                if (this.rxbuf.length == this.rxbuflen) {
                    this.rxSegCount = this.rxSegCount + 1;
                    this.parseState = BK_WS_PARSE_STATE.NEW_DATA;
                    if (this.isFinalSeg) {
                        this.rxbuf.rewind();
                        switch (this.opcode) {
                            case BK_WS_OPCODE.CLOSE: {
                                BK.Script.log(0, 0, "BK.WebSocket.doSvrFrameDataPhase!receive close frame");
                                this.handleCloseFrame();
                                break;
                            }
                            case BK_WS_OPCODE.PING: {
                                BK.Script.log(0, 0, "BK.WebSocket.doSvrFrameDataPhase!receive ping frame");
                                this.handlePingFrame();
                                break;
                            }
                            case BK_WS_OPCODE.PONG: {
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
                    } else {
                        this.rxbuf.rewind();
                        this.rxbufQue.push(this.rxbuf);
                        //BK.Script.log(0, 0, "BK.WebSocket.doSvrFrameDataPhase!has more segments, segNo. = " + this.rxSegCount);
                    }
                }
            }
        }
        return true;
    }

    handleCloseFrame(): void {
        this.peerClosed = true;
        if (BK_WS_STATE.ESTABLISHED == this.state) {
            let errcode:number = this.rxbuf.readUint16Buffer();
            let msgbuff:BK.Buffer = this.rxbuf.readBuffer(this.rxbuflen - 2);
            if (!errcode) {
                this.errcode = BK_WS_ERR_CODE.NO_STATUS_RECV;
                this.message = "no status recv";
            } else {
                this.errcode = errcode;
                this.message = msgbuff.readAsString();
            }
            BK.Script.log(1, 0, "BK.WebSocket.handleCloseFrame!errcode = " + this.errcode + ", msg = " + this.message);
            this.sendCloseFrame(this.errcode, this.message);
        } else if (BK_WS_STATE.CLOSING == this.state) {
            this.startPhaseTimeout(BK_WS_PHASE_TIMEOUT.NO_PENDING_TIMEOUT);
        }
    }

    handlePingFrame(): void {
        if (BK_WS_STATE.ESTABLISHED == this.state) {
            if (this.rxbuflen > 128 - 3) {
                this.errcode = BK_WS_ERR_CODE.CONTROL_PACKET_LARGE;
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
    }

    handlePongFrame(): void {
        if (BK_WS_STATE.ESTABLISHED == this.state) {
            let data:BK.Buffer = new BK.Buffer(this.rxbuflen, true);
            data.writeBuffer(this.rxbuf.readBuffer(this.rxbuflen));
            this.startPhaseTimeout(BK_WS_PHASE_TIMEOUT.NO_PENDING_TIMEOUT);
            BK.Script.log(0, 0, "BK.WebSocket.handlePongFrame!pong data = " + this.bufferToHexString(data));
        }
    }

    sendFrameFromTxQ(t:BK_WS_OPCODE): boolean {
        if (BK_WS_STATE.ESTABLISHED != this.state)
            return;
        if (this.inPartialTxbuf) { // first handle partial buf
            let txBytes:number = super.send(this.txbuf);
            if (txBytes > 0) {
                this.restartPingPongTimer();
                if (txBytes < this.txbuf.length) {
                    let cap:number = this.txbuf.length - txBytes;
                    let buf:BK.Buffer = new BK.Buffer(cap, false);
                    this.txbuf.rewind();
                    this.txbuf.jumpBytes(txBytes);
                    buf.writeBuffer(this.txbuf.readBuffer(cap));
                    this.txbuf = buf;
                    return false;
                }
                this.inPartialTxbuf = false;
            } else {
                BK.Script.log(1, txBytes, "BK.WebSocket.sendFrameFromTxQ!partial send failed, data type = " + t);
                return false;
            }
        }

        let succ:boolean = true;
        let n:number = Math.min(this.options.DrainSegmentCount, this.txbufQue.length);
        for (; n > 0; n--) {
            let data:BK.Buffer = this.txbufQue.shift();
            let moreSegs:boolean = (this.txbufQue.length > 0);
            let frameData:BK.Buffer = this.doFrameDataPhase(data, t, moreSegs);
            let txBytes:number = super.send(frameData);
            if (txBytes > 0) {
                this.restartPingPongTimer();
                if (txBytes < frameData.length) {// partial send
                    frameData.rewind();
                    frameData.jumpBytes(txBytes);
                    this.txbuf.rewind();
                    this.txbuf.writeBuffer(frameData.readBuffer(frameData.length - txBytes));
                    this.inPartialTxbuf = true;
                    succ = false;
                    BK.Script.log(1, 0, "BK.WebSocket.sendFrameFromTxQ!partial send, total size = " + frameData.length + ", tx size = " + txBytes);
                    break;
                }
            } else {
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
    }

    recvFrameFromRxQ(t:BK_WS_OPCODE): void {
        let isBinary:boolean = (t == BK_WS_OPCODE.BINARY_FRAME);
        let udata:BK.Buffer = new BK.Buffer(128, true);
        while (this.rxbufQue.length > 0) {
            let rxbuf:BK.Buffer = this.rxbufQue.shift();
            udata.writeBuffer(rxbuf);
        }
        udata.rewind();
        this.udataQue.push(new WebSocketData(udata, isBinary));
    }

    __sendBinaryFrame(data:BK.Buffer, frameType:BK_WS_OPCODE): boolean {
        let totLen:number = data.length;
        let segLen:number = this.options.DefaultSegmentSize;
        let offset = 0;
        data.rewind();
        while (totLen > segLen) {
            let buf:BK.Buffer = new BK.Buffer(segLen, false);
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
            let buf:BK.Buffer = new BK.Buffer(totLen, false);
            data.rewind();
            data.jumpBytes(offset);
            buf.writeBuffer(data.readBuffer(totLen));
            buf.rewind();
            this.txbufQue.push(buf);
        }
        this.txFrameType = frameType;
        return this.sendFrameFromTxQ(frameType);
    }

    sendTextFrame(text:string): boolean {
        if (BK_WS_STATE.ESTABLISHED != this.state)
            return false;
        let data:BK.Buffer = new BK.Buffer(128, true);
        data.writeAsString(text, true);
        data.rewind();
        return this.__sendBinaryFrame(data, BK_WS_OPCODE.TEXT_FRAME);
    }

    sendBinaryFrame(data:BK.Buffer): boolean {
        if (BK_WS_STATE.ESTABLISHED != this.state)
            return;
        return this.__sendBinaryFrame(data, BK_WS_OPCODE.BINARY_FRAME);
    }

    sendCloseFrame(code:number, reason:string): void {
        let buf:BK.Buffer = new BK.Buffer(reason.length + 1, false);
        let data:BK.Buffer = new BK.Buffer(3 + reason.length, false);
        
        if (KWebSocket.isLittleEndian) {
            data.writeUint8Buffer((0x0000FF00 & code)>>8);
            data.writeUint8Buffer((0x000000FF & code));
        } else {
            data.writeUint8Buffer((0x000000FF & code));
            data.writeUint8Buffer((0x0000FF00 & code)>>8);
        }

        buf.writeAsString(reason, true);
        data.writeBuffer(buf);

        let frameData:BK.Buffer = this.doFrameDataPhase(data, BK_WS_OPCODE.CLOSE);
        super.send(frameData);
        this.state = BK_WS_STATE.CLOSING;
        this.startPhaseTimeout(BK_WS_PHASE_TIMEOUT.CLOSE_ACK);
        BK.Script.log(1, 0, "BK.WebSocket.sendCloseFrame!code = " + code + ", reason = " + reason);
    }

    sendPingFrame(data:BK.Buffer): void {
        if (this.inPingFrame)
            return;
        BK.Script.log(0, 0, "BK.WebSocket.sendPingFrame!ping data = " + this.bufferToHexString(data));
        let frameData:BK.Buffer = this.doFrameDataPhase(data, BK_WS_OPCODE.PING);
        super.send(frameData);
        this.inPingFrame = true;
        this.startPhaseTimeout(BK_WS_PHASE_TIMEOUT.CHECK_PONG_SEND_PING);
    }

    sendPongFrame(data:BK.Buffer): void {
        if (this.inPongFrame)
            return;
        let frameData:BK.Buffer = this.doFrameDataPhase(data, BK_WS_OPCODE.PONG);
        super.send(frameData);
        this.inPongFrame = true;
        //BK.Script.log(0, 0, "BK.WebSocket.sendPongFrame!");
    }

    onErrorEvent(so: ISocket): void {
        super.onErrorEvent(so);
        this.state = BK_WS_STATE.FAILED;
        this.errcode = BK_WS_ERR_CODE.ABNORMAL_CLOSE;
        this.message = "abnormal closure";
        if (this.delegate.onError) {
            this.delegate.onError(this);
        }
    }

    onDisconnectEvent(so: ISocket): void {
        super.onDisconnectEvent(so);
        switch (this.state) {
            case BK_WS_STATE.HANDSHAKE_REQ:
            case BK_WS_STATE.HANDSHAKE_RESP:
            case BK_WS_STATE.ESTABLISHED: {
                this.state = BK_WS_STATE.FAILED;
                this.errcode = BK_WS_ERR_CODE.ABNORMAL_CLOSE;
                this.message = "abnormal closure";
                if (this.delegate.onError) {
                    this.delegate.onError(this);
                }
                break;
            }
            case BK_WS_STATE.CLOSING: {
                this.state = BK_WS_STATE.CLOSED;
                if (this.delegate.onClose) {
                    this.delegate.onClose(this);
                }
                BK.Script.log(1, 0, "BK.WebSocket.onDisconnectEvent!enter closed state");
                break;
            }
        }
    }

    onConnectedEvent(so: ISocket): void {
        super.onConnectedEvent(so);
        if (BK_WS_STATE.CLOSED == this.state) {
            this.clear();
            this.doHandshakePhase();
            //BK.Script.log(1, 0, "BK.WebSocket.doHandshakePhase");
        }
    }

    onUpdateEvent(so: ISocket): number {
        super.onUpdateEvent(so);
        switch (this.state) {
            case BK_WS_STATE.HANDSHAKE_REQ:
            case BK_WS_STATE.HANDSHAKE_RESP: {
                let rlen:number = so.canRecvLength();
                if (rlen > 0) {
                    let buf:BK.Buffer = this.recv(rlen);
                    if (undefined != buf) {
                        this.doSvrHandshakePhase1(buf.readAsString(true));
                    }
                }
                this.handlePhaseTimeout();
                break;
            }
            case BK_WS_STATE.ESTABLISHED: {
                let rlen:number = so.canRecvLength();
                if (rlen > 0 &&
                    !this.doSvrFrameDataPhase(this.recv(rlen))) {
                    this.sendCloseFrame(this.errcode, this.message);
                    if (this.delegate.onError) {
                        this.delegate.onError(this);
                    }
                } else {
                    if (this.delegate.onMessage) {
                        while (this.udataQue.length > 0) {
                            let udata:WebSocketData = this.udataQue.shift();
                            this.delegate.onMessage(this, udata);
                        }
                    }
                    if (this.txbufQue.length > 0) {
                        this.sendFrameFromTxQ(this.txFrameType);
                    } else if (this.delegate.onSendComplete) {
                        this.delegate.onSendComplete(this);
                    }
                    this.inPongFrame = false;
                    this.handlePhaseTimeout();
                    this.handlePingPongTimer();
                }
                break;
            }
            case BK_WS_STATE.CLOSING: {
                let rlen:number = so.canRecvLength();
                if (rlen > 0 &&
                    this.doSvrFrameDataPhase(this.recv(rlen))) {
                    if (this.delegate.onMessage) {
                        while (this.udataQue.length > 0) {
                            let udata:WebSocketData = this.udataQue.shift();
                            this.delegate.onMessage(this, udata);
                        }
                    }
                }
                this.handlePhaseTimeout();
                break;
            }
        }
        return 0;
    }
}

class TxData {
    data: any;
    isBinary: boolean;
    constructor(data: any, isBinary: boolean) {
        this.data = data;
        this.isBinary = isBinary;
    }
};


class WebSocket implements BK.IWebSocket {
    private __nativeObj: KWebSocket;
    private options: Map<number>;
    private inTrans: boolean;
    private isPendingConn: boolean;
    private txdataQ: Array<TxData>;
    private port: number;
    private iplist: Array<string>;
    private host: string;
    private path: string;
    private scheme: string;
    onOpen: (ws:BK.IWebSocket) => void;
    onClose: (ws:BK.IWebSocket) => void;
    onError: (ws:BK.IWebSocket) => void;
    onMessage: (ws:BK.IWebSocket, data:WebSocketData) => void;
    constructor(url:string) {
        this.options = null;
        this.inTrans = false;
        this.isPendingConn = true;
        this.txdataQ = new Array<TxData>();

        var res = BK.URL("{}", url);
        this.scheme = res.protocol;
        this.port = res.port;
        this.path = res.path;
        this.host = res.hostname;
        BK.DNS.queryIPAddress(res.hostname, (reason:number, af:number, iplist:Array<string>)=>{
            switch (reason) {
                case 0: {
                    BK.Script.log(1, 0, "BK.WebSocket.queryIPAddress!iplist = " + JSON.stringify(iplist));
                    this.iplist = iplist;
                    this.__nativeObj = new KWebSocket(iplist[0], this.port, this.host, this.path);
                    if (this.scheme == "wss") {
                        this.__nativeObj.enableSSL(true);
                    }
                    if (this.options) {
                        this.setOptions(this.options);
                        this.options = null;
                    }
                    if (this.isPendingConn) {
                        this.connect();
                        this.isPendingConn = false;
                    }
                    this.__nativeObj.delegate.onOpen = (kws:KWebSocket)=>{
                        if (this.txdataQ.length > 0) {
                            this.send(this.txdataQ.shift());
                        }
                        if (this.onOpen) {
                            this.onOpen(this);
                        }
                    }
                    this.__nativeObj.delegate.onClose = (kws:KWebSocket)=>{
                        if (this.onClose) {
                            this.onClose(this);
                        }
                    }
                    this.__nativeObj.delegate.onError = (kws:KWebSocket)=>{
                        if (this.onError) {
                            this.onError(this);
                        }
                    }
                    this.__nativeObj.delegate.onMessage = (kws:KWebSocket, data:WebSocketData)=>{
                        if (this.onMessage) {
                            this.onMessage(this, data);
                        }
                    }
                    this.__nativeObj.delegate.onSendComplete = (kws:KWebSocket)=>{
                        if (this.txdataQ.length > 0) {
                            let txdata: TxData = this.txdataQ.shift();
                            if (!txdata.isBinary)
                                this.__nativeObj.sendTextFrame(txdata.data);
                            else
                                this.__nativeObj.sendBinaryFrame(txdata.data);
                            this.inTrans = true;
                        } else {
                            this.inTrans = false;
                        }
                    }
                    break;
                }
            }
        });
    }

    getReadyState(): BK_WS_STATE {
        if (this.__nativeObj) {
            return this.__nativeObj.getReadyState();
        }
        return BK_WS_STATE.CLOSED;
    }

    getErrorCode(): BK_WS_ERR_CODE {
        if (this.__nativeObj) {
            return this.__nativeObj.getErrorCode();
        }
        return BK_WS_ERR_CODE.UNDEFINE;
    }

    getErrorString(): string {
        if (this.__nativeObj) {
            return this.__nativeObj.getErrorString();
        }
        return "";
    }

    close(): void {
        let state:BK_WS_STATE = this.getReadyState();
        if (BK_WS_STATE.ESTABLISHED == state) {
            this.__nativeObj.sendCloseFrame(BK_WS_ERR_CODE.NORMAL_CLOSE, "see ya");
        }
    }

    connect(): boolean {
        if (this.__nativeObj) {
            return this.__nativeObj.connect() != 0;
        }
        return true;
    }

    send(data:any): boolean {
        let state:BK_WS_STATE = this.getReadyState();
        if (BK_WS_STATE.CLOSING == state || BK_WS_STATE.CLOSED == state) {
            return false;
        }
        if (typeof data == "string") {
            if (this.inTrans || state != BK_WS_STATE.ESTABLISHED) {
                this.txdataQ.push(new TxData(data, false));
            } else {
                this.inTrans = true;
                return this.__nativeObj.sendTextFrame(<string>data);
            }
        } else if (typeof data == "object") {
            if (this.inTrans || state != BK_WS_STATE.ESTABLISHED) {
                this.txdataQ.push(new TxData(data, true));
            } else {
                this.inTrans = true;
                return this.__nativeObj.sendBinaryFrame(<BK.Buffer>data);
            }
        }
        return false;
    }

    setOptions(options:any) {
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
    }
}

BK.WebSocket = WebSocket;
