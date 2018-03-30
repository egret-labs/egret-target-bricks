namespace egret {
    export class BKImageLoader extends EventDispatcher implements ImageLoader {
        public static crossOrigin: string = null;

        /**
         * @private
         * 使用 load() 方法加载成功的 BitmapData 图像数据。
         */
        public data: BitmapData = null;

        private _crossOrigin: string = null;
        private _hasCrossOriginSet: boolean = false;
        public set crossOrigin(value: string) {
            this._hasCrossOriginSet = true;
            this._crossOrigin = value;
        }
        public get crossOrigin(): string {
            return this._crossOrigin;
        }

        public load(url: string): void {
            if (url.indexOf('http://') >= 0 || url.indexOf('https://') >= 0) {
                //动态加载
                debugger;
                //根据url存储缓存的图片到沙盒中
                let sha1 = this._sha1FromUrl(url);
                let buff = BK.FileUtil.readFile("GameSandBox://webcache/image" + sha1);
                if (buff && buff.length > 0) {
                    this._loadFromBuffer.call(this, buff);
                } else {
                    var httpGet = new BK.HttpUtil(url);
                    httpGet.setHttpMethod("get")
                    httpGet.requestAsync(function (res, code) {
                        if (code == 200) {
                            (BK.FileUtil as any).writeBufferToFile("GameSandBox://webcache/image" + sha1, res);
                            this._loadFromBuffer.call(this, res);
                        } else {
                            console.log("BK http加载外部资源失败, url = " + url + ", code = " + code);
                            $callAsync(Event.dispatchEvent, IOErrorEvent, this, IOErrorEvent.IO_ERROR);
                        }
                    }.bind(this));
                }

            } else {
                if (BK.FileUtil.isFileExist(url)) {
                    this.data = new egret.BitmapData(url);
                    $callAsync(Event.dispatchEvent, Event, this, Event.COMPLETE);
                }
                else {
                    $callAsync(Event.dispatchEvent, IOErrorEvent, this, IOErrorEvent.IO_ERROR);
                }
            }
        }

        /**
         * 将url通过sha1算法解析
         * 返回sha1之后的url
         */
        private _sha1FromUrl(url) {
            var bufSha = BK.Misc.sha1(url);
            var sha1 = "";
            for (var i = 0; i < bufSha.length; i++) {
                var charCode = bufSha.readUint8Buffer();
                sha1 += charCode.toString(16);
            }
            return sha1;
        }

        /**
         * 通过buffer读取texture
         */
        private _loadFromBuffer(buffer) {
            let texture = (BK.Texture as any).createTextureWithBuffer(buffer);
            this.data = new egret.BitmapData(texture);
            $callAsync(Event.dispatchEvent, Event, this, Event.COMPLETE);
            // var circle = new BK.Sprite(375, 375, circleTex, 0, 1, 1, 1);
            // BK.Director.root.addChild(circle);
        }
    }


    ImageLoader = BKImageLoader;
}
