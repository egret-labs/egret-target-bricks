namespace egret {
    export class BKBitmapData extends HashObject {
        public readonly width: number = 0;
        public readonly height: number = 0;
        public readonly source: string | any = ""; // url 或 render node
        public readonly bkTexture: BK.Texture | null = null;
        public readonly isFlip: boolean;

        constructor(source: string | BK.Texture, isFlip: boolean = false) {
            super();

            this.source = source;
            this.isFlip = isFlip;
            if (typeof this.source === "string") {
                this.bkTexture = new BK.Texture(this.source);
            }
            else {
                this.bkTexture = this.source;
            }

            this.width = this.bkTexture.size.width;
            this.height = this.bkTexture.size.height;
        }

        static $invalidate() {

        }
    }
    if (window['renderMode'] != 'webgl') {
        egret.BitmapData = egret.BKBitmapData as any;
    }
}