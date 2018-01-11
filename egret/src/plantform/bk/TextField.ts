namespace egret {
    export class BKTextField extends egret.BKDisplayObject {
        protected readonly _size: Size = { width: 100.0, height: 200.0 };
        private _bkText: BK.Text;

        constructor() {
            super(new BK.Text(undefined, ""));
            this._bkText = this._bkNode as any;
            this._bkText.anchor = { x: 0.0, y: 1.0 };

            this._bkText.bold = 0;
            this._bkText.italic = false;
            this._bkText.maxSize = { width: 2048, height: 2048 };
            this._bkText.shadowColor = 0x00000000;
            this._bkText.shadowOffset = { x: 0, y: 0 };
            this._bkText.shadowRadius = 0;
            this._bkText.strokeColor = 0x00000000;
            this._bkText.strokeSize = 0;
        }
        /**
         * 为16进制数字补0，输出字符串
         */
        private _refitString(num: number, length: number): string {
            let str = num.toString(16);
            let zero = "00000000";

            return zero.substr(0, length - str.length) + str;
        }

        /**
         * 文字字号大小
         */
        public get size(): number {
            return this._bkText.fontSize;
        }
        public set size(value: number) {
            this._bkText.fontSize = value;
        }
        /**
         * 是否显示为粗体
         */
        public get bold(): boolean {
            return this._bkText.bold > 0;
        }
        public set bold(bold: boolean) {
            this._bkText.bold = bold ? 1 : 0;
        }
        /**
         * 是否显示为斜体
         */
        public get italic(): boolean {
            return this._bkText.italic;
        }
        public set italic(value: boolean) {
            this._bkText.italic = value;
        }
        /**
         * 文本的水平对齐方式
         */
        public get textAlign(): string {
            switch (this._bkText.horizontalAlign) {
                case 0:
                    return egret.HorizontalAlign.LEFT;
                case 1:
                    return egret.HorizontalAlign.CENTER;
                case 2:
                    return egret.HorizontalAlign.RIGHT;
            }
        }
        public set textAlign(value: string) {
            switch (value) {
                case egret.HorizontalAlign.LEFT:
                    this._bkText.horizontalAlign = 0;
                    break;
                case egret.HorizontalAlign.CENTER:
                    this._bkText.horizontalAlign = 1;
                    break;
                case egret.HorizontalAlign.RIGHT:
                    this._bkText.horizontalAlign = 2;
                    break;
            }
        }

        public get text(): string {
            return this._bkText.content;
        }
        public set text(value: string) {
            this._bkText.content = value;
        }

        /**
         * 字体颜色，格式为0x000000的RGB编码格式字符串
         */
        public get textColor(): number {
            let argb_str = this._refitString(this._bkText.fontColor, 8);//00 ff ff 00八位argb格式
            let rbg_str = argb_str.substring(2, 8);
            return parseInt(rbg_str, 16);
        }
        public set textColor(value: number) {
            let rgb_str = this._refitString(value, 6);//六位rgb格式
            let old_argb_str = this._refitString(this._bkText.fontColor, 8);
            let new_argb_str = old_argb_str.substring(0, 2) + rgb_str;
            let argb_num = parseInt(new_argb_str, 16);
            this._bkText.fontColor = argb_num;
        }

        /**
         * 描边颜色，格式为0x000000的RGB编码格式字符串
         */
        public get strokeColor(): number {
            let argb_str = this._refitString(this._bkText.strokeColor, 8);//00 ff ff 00八位argb格式
            let rbg_str = argb_str.substring(2, 8);
            return parseInt(rbg_str);
        }
        public set strokeColor(strokeColor: number) {
            let rgb_str = this._refitString(strokeColor, 6);//六位rgb格式
            let old_argb_str = this._refitString(this._bkText.strokeColor, 8);
            let new_argb_str = old_argb_str.substring(0, 2) + rgb_str;
            let argb_num = parseInt(new_argb_str, 16);
            this._bkText.fontColor = argb_num;
        }

        /**
         * 描边宽度
         */
        public get stroke(): number {
            return this._bkText.strokeSize;
        }
        public set stroke(value: number) {
            this._bkText.strokeSize = value;
        }

        public $setWidth(value: number) {
            super.$setWidth(value);

            this._size.width = value;
            this._bkText["style"].width = this._size.width;
        }

        public $setHeight(value: number) {
            super.$setHeight(value);

            this._size.height = value;
            this._bkText["style"].height = this._size.height;
        }

        public $setAnchorOffsetX(value: number) {
            super.$setAnchorOffsetX(value);
            let anchorX = value / this._size.width;
            this._bkText.anchor = { x: anchorX, y: this._bkText.anchor.y };
        }

        public $setAnchorOffsetY(value: number) {
            super.$setAnchorOffsetY(value);
            let anchorY = 1.0 - value / this._size.height;
            this._bkText.anchor = { x: this._bkText.anchor.x, y: anchorY };
        }


        /**
          * Get the BitmapText measured width
          * @version Egret 2.4
          * @platform Web,Native
          * @language en_US
          */
        /**
         * 获取位图文本测量宽度
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get textWidth(): number {
            return this._bkText['width'];
        }

        /**
         * Get Text BitmapText height
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 获取位图文本测量高度
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get textHeight(): number {
            return this._bkText['height'];
        }
    }

    egret.TextField = BKTextField as any;
}