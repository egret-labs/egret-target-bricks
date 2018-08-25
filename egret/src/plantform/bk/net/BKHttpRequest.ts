namespace egret {
    export class BKHttpRequest extends EventDispatcher implements HttpRequest {
        private _responseType: string;
        public get responseType(): string {
            return this._responseType;
        }
        public set responseType(value: string) {
            this._responseType = value;
        }

        private _response: any;
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

            if (self.isNetUrl(self._url)) {
                let originalUrl = self._url;
                let encodeURL = this.encodeURL(originalUrl);
                this._bkHttpRequest = new BK.HttpUtil(encodeURL);
                let method: string;
                if (this._method === egret.HttpMethod.POST) {
                    method = "post";
                } else {
                    method = "get";
                }
                this._bkHttpRequest.setHttpMethod(method);
                if (this._method === egret.HttpMethod.POST) {
                    //根据现在的发送信息类型以及实际传入数据类型进行data的数据转换
                    if (typeof data == "string") {
                        this._bkHttpRequest.setHttpPostData(data);
                    } else {
                        let bkBuffer = arrayBufferToBricksBuffer(data);
                        (this._bkHttpRequest as any).setHttpRawBody(bkBuffer);
                    }
                }
                if (this.headerObj) {
                    for (let key in this.headerObj) {
                        this._bkHttpRequest.setHttpHeader(key, this.headerObj[key]);
                    }
                }

                this._bkHttpRequest.requestAsync((res, code) => {
                    if (Number(code) === 200) {
                        if (self._responseType === HttpResponseType.ARRAY_BUFFER) {
                            self._response = bricksBufferToArrayBuffer(res);
                        }
                        else {
                            const egretBytes = new egret.ByteArray(bricksBufferToArrayBuffer(res));
                            self._response = egretBytes.readUTFBytes(egretBytes.length);
                        }

                        $callAsync(Event.dispatchEvent, Event, self, Event.COMPLETE);
                    }
                    else {
                        $warn(1019, code);
                        Event.dispatchEvent(self, IOErrorEvent.IO_ERROR);
                    }
                })
            }
            else if (!BK.FileUtil.isFileExist(self._url)) {
                $callAsync(Event.dispatchEvent, IOErrorEvent, self, IOErrorEvent.IO_ERROR);
            }
            else {
                const bkBuffer = BK.FileUtil.readFile(self._url);
                if (self._responseType === HttpResponseType.ARRAY_BUFFER) {
                    self._response = bricksBufferToArrayBuffer(bkBuffer);
                }
                else {
                    self._response = bkBuffer.readAsString() || "";
                }

                $callAsync(Event.dispatchEvent, Event, self, Event.COMPLETE);
            }
        }

        private encodeURL(originalUrl: string) {
            if (!originalUrl || originalUrl === '')
                return '';
            let search_index = originalUrl.indexOf(`?`)
            if (search_index < 0)
                return originalUrl;
            let head = originalUrl.slice(0, search_index);
            let search = originalUrl.slice(search_index + 1);
            let searchArr = search.split('&');
            let new_search = "";
            for (let i = 0; i < searchArr.length; i++) {
                let str = searchArr[i];//"data=xxx";
                let strArr = str.split('=');
                let name = strArr[0];
                let value = strArr[1] ? strArr[1] : "";
                new_search += name + "=" + encodeURIComponent(value);
                if (i < searchArr.length - 1) {
                    new_search += "&";
                }
            }
            return head + "?" + new_search;

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