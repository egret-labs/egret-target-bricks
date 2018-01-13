namespace egret {
    export class BKHttpRequest extends EventDispatcher implements HttpRequest {
        private _responseType: string;
        public get responseType(): string {
            return this._responseType;
        }
        public set responseType(value: string) {
            this._responseType = value;
        }

        private _response: string;
        public get response(): any {
            return this._response;
        }

        private _withCredentials: boolean;
        public get withCredentials(): boolean {
            return this._withCredentials;
        }
        public set withCredentials(value: boolean) {
            this._withCredentials = value;
        }

        private _url: string = "";
        private _method: string = "";
        public open(url: string, method: string = "GET"): void {
            this._url = url;
            this._method = method;
        }

        /**
         * @private
         */
        private urlData: any = {};

        private _bkHttpRequest: BK.HttpUtil;
        /**
         * @private
         * 发送请求.
         * @param data 需要发送的数据
         */
        public send(data?: any): void {
            let self = this;
            console.log(self._url);
            
            if (self.isNetUrl(self._url)) {
                this._bkHttpRequest = new BK.HttpUtil(this._url); // 没文档，只能新建实例
                this._bkHttpRequest.setHttpMethod(this._method);
                this._bkHttpRequest.setHttpCookie(data); // 如何传 head
                this._bkHttpRequest.requestAsync((res, code) => { // 不知道 code 给的什么
                    if (Number(code) === 200) {
                        let result: string;
                        if (self._responseType === HttpResponseType.ARRAY_BUFFER) {
                            // TODO
                        }
                        else {
                            result = res.readAsString() || "";
                        }

                        self._response = result;
                        $callAsync(Event.dispatchEvent, Event, self, Event.COMPLETE);
                    }
                    else {
                        $warn(1019, code);
                        Event.dispatchEvent(self, IOErrorEvent.IO_ERROR);
                    }
                })
            }
            else if (!BK.FileUtil.isFileExist(self._url)) {
                // let promise = PromiseObject.create(); // TODO
                // promise.onSuccessFunc = readFileAsync;
                // promise.onErrorFunc = function () {
                //     Event.dispatchEvent(self, IOErrorEvent.IO_ERROR);
                // };
                // promise.onResponseHeaderFunc = this.onResponseHeader;
                // promise.onResponseHeaderThisObject = this;
                // egret_native.download(self._url, self._url, promise);
                $callAsync(Event.dispatchEvent, IOErrorEvent, self, IOErrorEvent.IO_ERROR);
            }
            else {
                if (self._responseType === HttpResponseType.ARRAY_BUFFER) {
                    // egret_native.readFileAsync(self._url, promise, "ArrayBuffer"); // TODO
                    $callAsync(Event.dispatchEvent, IOErrorEvent, self, IOErrorEvent.IO_ERROR);
                }
                else {
                    const bkBuffer = BK.FileUtil.readFile(self._url);
                    self._response = bkBuffer.readAsString();
                    $callAsync(Event.dispatchEvent, Event, self, Event.COMPLETE);
                }
            }
        }

        /**
         * 是否是网络地址
         * @param url
         * @returns {boolean}
         */
        private isNetUrl(url: string): boolean {
            return url.indexOf("http://") != -1 || url.indexOf("HTTP://") != -1 || url.indexOf("https://") != -1 || url.indexOf("HTTPS://") != -1;
        }

        /**
         * @private
         * 如果请求已经被发送,则立刻中止请求.
         */
        public abort(): void {
        }

        private responseHeader: string = "";

        private onResponseHeader(headers: string): void {
            this.responseHeader = "";
            let obj = JSON.parse(headers);
            for (let key in obj) {
                this.responseHeader += key + ": " + obj[key] + "\r\n";
            }
        }

        /**
         * @private
         * 返回所有响应头信息(响应头名和值), 如果响应头还没接受,则返回"".
         */
        public getAllResponseHeaders(): string {
            return this.responseHeader;
        }

        private headerObj: any;
        /**
         * @private
         * 给指定的HTTP请求头赋值.在这之前,您必须确认已经调用 open() 方法打开了一个url.
         * @param header 将要被赋值的请求头名称.
         * @param value 给指定的请求头赋的值.
         */
        public setRequestHeader(header: string, value: string): void {
            if (!this.headerObj) {
                this.headerObj = {};
            }
            this.headerObj[header] = value;
        }

        /**
         * @private
         * 返回指定的响应头的值, 如果响应头还没被接受,或该响应头不存在,则返回"".
         * @param header 要返回的响应头名称
         */
        public getResponseHeader(header: string): string {
            return "";
        }
    }

    egret.HttpRequest = BKHttpRequest as any;
}