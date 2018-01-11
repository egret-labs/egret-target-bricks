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
            this.data = new egret.BitmapData(url);
            $callAsync(egret.Event.dispatchEvent, egret.Event, this, egret.Event.COMPLETE);
        }

        // private dispatchIOError(url: string): void {
        //     let self = this;
        //     window.setTimeout(function (): void {
        //         if (DEBUG && !self.hasEventListener(IOErrorEvent.IO_ERROR)) {
        //             $error(1011, url);
        //         }
        //         self.dispatchEventWith(IOErrorEvent.IO_ERROR);
        //     }, 0);
        // }
    }

    ImageLoader = BKImageLoader;
}
