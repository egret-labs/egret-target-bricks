namespace egret {
    export class BKSocket implements ISocket {

        $websocket: BK.IWebSocket;
        constructor() {

        }

        private host: string;
        private port: number;


        private onConnect: Function;
        private onClose: Function;
        private onSocketData: Function;
        private onError: Function;
        private thisObject: any;

        addCallBacks(onConnect: Function, onClose: Function, onSocketData: Function, onError: Function, thisObject: any): void {
            this.onConnect = onConnect;
            this.onClose = onClose;
            this.onSocketData = onSocketData;
            this.onError = onError;
            this.thisObject = thisObject;
        }

        /**
         * 连接
         */
        connect(host: string, port: number): void {
            let url = host + ":" + port
            this.connectByUrl(url);
        }

        /**
         * 连接
         */
        connectByUrl(url: string): void {
            this.$websocket = new BK.WebSocket(url);
            this.$websocket.connect();
            this._bindEvent();
        }

        private _bindEvent() {
            let that = this;
            let ws = this.$websocket;
            ws.onOpen = (ws) => {
                if (that.onConnect) {
                    that.onConnect.call(that.thisObject);
                }
            };
            ws.onClose = (ws) => {
                if (that.onClose) {
                    that.onClose.call(that.thisObject);
                }
            };
            ws.onError = (ws) => {
                if (that.onError) {
                    that.onError.call(that.thisObject);
                }
            };
            ws.onMessage = (ws, data) => {
                if (that.onSocketData) {
                    let result: any;
                    let bkbuffer: BK.Buffer = data.data;
                    if (!data.isBinary) {
                        // result = data.data.readAsString();
                        const egretBytes = new egret.ByteArray(bricksBufferToArrayBuffer(bkbuffer));
                        result = egretBytes.readUTFBytes(egretBytes.length);
                    } else {
                        result = bricksBufferToArrayBuffer(bkbuffer);
                    }
                    that.onSocketData.call(that.thisObject, result);
                }
            };
        }

        send(message: any): void {
            if (typeof message == "string") {
                this.$websocket.send(message);
            } else if (message instanceof ArrayBuffer) {
                // let b = new egret.ByteArray(message);
                // let msg = b.readUTF();
                // let bkBuffer = new BK.Buffer(msg.length);
                // bkBuffer.writeAsString(msg);
                const arrayBuffer = arrayBufferToBrickBuffer(message);
                this.$websocket.send(arrayBuffer);
            }
        }

        private resHandler(event: egret.Event) {
            switch (event.type) {
                case egret.Event.COMPLETE:
                    let request: egret.HttpRequest = event.currentTarget;
                    let ab = request.response;
                    console.log()
            }

        }

        close(): void {
            this.$websocket.close();
        }

        disconnect(): void {
            // if (this.$websocket.disconnect) {
            //     this.$websocket.disconnect();
            // }
            //BK.IWebSocket 不支持disconnect
            return;
        }

    }
    egret.ISocket = BKSocket;
}