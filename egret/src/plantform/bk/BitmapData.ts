namespace egret {
    export class BKBitmapData extends HashObject {
        public readonly width: number = 0;
        public readonly height: number = 0;
        public readonly source: string | any = ""; // url 或 render node
        public readonly bkTexture: BK.Texture | null = null;

        constructor(source: string | any) {
            super();

            this.source = source;
            if (typeof this.source === "string") {
                this.bkTexture = new BK.Texture(this.source);
                this.width = this.bkTexture.size.width;
                this.height = this.bkTexture.size.height;
            }
            else {
                // TODO
            }

        }
        static $invalidate() {

        }
    }

    egret.BitmapData = BKBitmapData as any;
}