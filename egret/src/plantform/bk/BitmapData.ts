namespace egret {
    export class BKBitmapData extends HashObject {
        public readonly width: number = 0;
        public readonly height: number = 0;
        public readonly source: string = "";

        constructor(source: string) {
            super();

            const bkTexture = new BK.Texture(source);

            this.width = bkTexture.size.width;
            this.height = bkTexture.size.height;
            this.source = source;
        }
    }

    egret.BitmapData = BKBitmapData as any;
}