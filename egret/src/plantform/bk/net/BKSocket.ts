namespace egret {
    export class BKSocket implements ISocket {

        $socket: BK.IWebSocket;
        constructor(host: string, port: number) {
            this.host = host;
            this.port = port;
        }

        private host: string;
        private port: number;

        /**
         * 连接
         * @method egret.ISocket#connect
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 连接
         * @method egret.ISocket#connect
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        connect(host: string, port: number): void {
            let url = host + ":" + port
            this.connectByUrl(url);
        }

        /**
         * 连接
         * @method egret.ISocket#connect
         */
        connectByUrl(url: string): void {
            this.$socket = new BK.WebSocket(url);
            this.$socket.connect();
        }


        /**
         * 
         * @param onConnect 
         * @param onClose 
         * @param onSocketData 
         * @param onError 
         * @param thisObject 
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 
         * @param onConnect 
         * @param onClose 
         * @param onSocketData 
         * @param onError 
         * @param thisObject 
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        addCallBacks(onConnect: Function, onClose: Function, onSocketData: Function, onError: Function, thisObject: any): void {

        }

        /**
         * 
         * @param message 
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 
         * @param message 
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        send(message: any): void {

        }

        /**
         * 
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        close(): void {

        }
        /**
         * 
         * @version Egret 4.1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 
         * @version Egret 4.1.0
         * @platform Web,Native
         * @language zh_CN
         */
        disconnect(): void {

        }

    }
}