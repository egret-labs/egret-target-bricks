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
            if (BK.FileUtil.isFileExist(url)) {
                this.data = new egret.BitmapData(url);
                $callAsync(Event.dispatchEvent, Event, this, Event.COMPLETE);
            }
            else {
                $callAsync(Event.dispatchEvent, IOErrorEvent, this, IOErrorEvent.IO_ERROR);
            }
        }
    }

    ImageLoader = BKImageLoader;
}
