namespace egret {
    export class BKBitmap extends BKDisplayObject {
        protected $explicitBitmapWidth: number = NaN;
        protected $explicitBitmapHeight: number = NaN;

        protected readonly _size: Size = { width: 0.0, height: 0.0 };
        private readonly _bkSprite: BK.Sprite;
        /**
         * @internal
         */
        public $bitmapData: egret.BKBitmapData | null = null;
        protected $texture: egret.Texture | null = null;
        /**
         * @internal
         */
        public $scale9Grid: egret.Rectangle | null = null;

        public constructor(value: Texture | null = null) {
            super(new BK.Sprite(0, 0, {} as any, 0, 1, 1, 1));

            this._bkSprite = this._bkNode as BK.Sprite;
            this._bkSprite.anchor = { x: 0.0, y: 1.0 };
            this.texture = value;
        }

        public get texture(): Texture | null {
            return this.$texture;
        }

        public set texture(value: Texture | null) {
            this.$setTexture(value);
        }

        public $setTexture(value: Texture | null): void {
            if (this.$texture === value) {
                return;
            }
            this.$texture = value;

            if (this.$texture) {
                this.$bitmapData = <any>this.$texture.bitmapData as BKBitmapData;
                if (this.$bitmapData.bkTexture) {
                    this._bkSprite.setTexture(this.$bitmapData.bkTexture);
                    this._size.width = this.$getWidth();
                    this._size.height = this.$getHeight();
                    this._bkSprite.size = this._size;
                    this._bkSprite.adjustTexturePosition(
                        this.$texture.$bitmapX,
                        this.$texture.$sourceHeight - (this.$texture.$bitmapY + this.$texture.$bitmapHeight),
                        this.$texture.$bitmapWidth,
                        this.$texture.$bitmapHeight,
                        this.$texture.$rotated
                    );
                }
                else {
                    this.$bitmapData = null;
                    this._bkSprite.setTexture({} as any);
                }
            }
            else {
                this.$bitmapData = null;
                this._bkSprite.setTexture({} as any);
            }
        }
        public get scale9Grid(): egret.Rectangle {
            return this.$scale9Grid;
        }

        public set scale9Grid(value: egret.Rectangle) {
            let self = this;
            (self as any).$scale9Grid = value;
            self.$renderDirty = true;
        }
        /**
         * @private
         *
         * @param value
         */
        $setWidth(value: number): boolean {
            let self = this;
            if (value < 0 || value == self.$explicitBitmapWidth) {
                return false;
            }
            self.$explicitBitmapWidth = value;

            // MD
            this._size.width = value;
            this._bkSprite.size = this._size;

            return true;
        }

        /**
         * @private
         *
         * @param value
         */
        $setHeight(value: number): boolean {
            let self = this;
            if (value < 0 || value == self.$explicitBitmapHeight) {
                return false;
            }
            self.$explicitBitmapHeight = value;

            // MD
            this._size.height = value;
            this._bkSprite.size = this._size;

            return true;
        }

        /**
         * @private
         * 获取显示宽度
         */
        $getWidth(): number {
            return isNaN(this.$explicitBitmapWidth) ? this.$getContentBounds().width : this.$explicitBitmapWidth;
        }

        /**
         * @private
         * 获取显示宽度
         */
        $getHeight(): number {
            return isNaN(this.$explicitBitmapHeight) ? this.$getContentBounds().height : this.$explicitBitmapHeight;
        }

        /**
         * @private
         */
        $measureContentBounds(bounds: Rectangle): void {
            if (this.$texture) {
                let w: number = !isNaN(this.$explicitBitmapWidth) ? this.$explicitBitmapWidth : this.$texture.$getTextureWidth();
                let h: number = !isNaN(this.$explicitBitmapHeight) ? this.$explicitBitmapHeight : this.$texture.$getTextureHeight();
                bounds.setTo(0, 0, w, h);
            }
            else {
                let w = !isNaN(this.$explicitBitmapWidth) ? this.$explicitBitmapWidth : 0;
                let h = !isNaN(this.$explicitBitmapHeight) ? this.$explicitBitmapHeight : 0;

                bounds.setTo(0, 0, w, h);
            }
        }

        public $setAnchorOffsetX(value: number) {
            super.$setAnchorOffsetX(value);
            let anchorX = value / this._size.width;
            this._bkSprite.anchor = { x: anchorX, y: this._bkSprite.anchor.y };
        }

        public $setAnchorOffsetY(value: number) {
            super.$setAnchorOffsetY(value);
            let anchorY = 1.0 - value / this._size.height;
            this._bkSprite.anchor = { x: this._bkSprite.anchor.x, y: anchorY };
        }

    }

    egret.Bitmap = BKBitmap as any;
}
