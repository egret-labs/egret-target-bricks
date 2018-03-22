namespace egret {
    export class BKBitmap extends BKDisplayObject {
        protected $explicitBitmapWidth: number = NaN;
        protected $explicitBitmapHeight: number = NaN;
        protected readonly _size: Size = { width: 0, height: 0 };
        private _bkSprite: BK.Sprite | BKSprite9;
        private hasScale9Grid = false;
        /**
         * @internal
         */
        public $bitmapData: egret.BKBitmapData | null = null;
        protected $texture: egret.Texture | null = null;
        protected $scale9Grid: egret.Rectangle | null = null;

        public constructor(value: Texture | null = null) {
            super(new BK.Sprite(0, 0, {} as any, 0, 1, 1, 1));

            this._bkSprite = this._bkNode as BK.Sprite;
            this.texture = value;
        }

        protected _updateBKNodeMatrix(): void {
            if (!this.$texture) {
                return;
            }

            const matrix = this.$getMatrix();
            const bkMatrix = (this._bkNode.transform as any).matrix;
            let tx = matrix.tx;
            let ty = matrix.ty;
            const pivotX = this.$anchorOffsetX;
            const pivotY = this.$anchorOffsetY - this._size.height;
            if (pivotX !== 0.0 || pivotY !== 0.0) {
                tx -= matrix.a * pivotX + matrix.c * pivotY;
                ty -= matrix.b * pivotX + matrix.d * pivotY;
            }

            bkMatrix.set(matrix.a, -matrix.b, -matrix.c, matrix.d, tx, -ty);
        }

        public get texture(): Texture | null {
            return this.$texture;
        }

        public set texture(value: Texture | null) {
            if (this.$texture === value) {
                return;
            }

            this.$setTexture(value);
        }
        /**
         * @private
         */
        $setTexture(value: Texture | null): void {
            this.$texture = value;

            if (this.$texture) {
                this._transformDirty = true;
                this.$bitmapData = <any>this.$texture.bitmapData as BKBitmapData;
                if (this.$bitmapData.bkTexture) {
                    this._bkSprite.setTexture(this.$bitmapData.bkTexture);
                    if (this.$bitmapData.isFlip)
                        (this._bkSprite as BK.Sprite).setUVFlip(0, 0);
                    this._bkSprite.adjustTexturePosition(
                        this.$texture.$bitmapX,
                        this.$texture.$sourceHeight - (this.$texture.$bitmapY + this.$texture.$bitmapHeight),
                        this.$texture.$bitmapWidth,
                        this.$texture.$bitmapHeight,
                        this.$texture.$rotated
                    );
                    this._size.width = this.$getWidth()//this.$texture.$bitmapWidth;
                    this._size.height = this.$getHeight()//this.$texture.$bitmapHeight;
                    this._bkSprite.size = this._size;

                    if (this.$texture['scale9Grid'] && !this.hasScale9Grid) {
                        let rectangle = new egret.Rectangle();
                        rectangle.setTo(this.$texture['scale9Grid'].x, this.$texture['scale9Grid'].y, this.$texture['scale9Grid'].width, this.$texture['scale9Grid'].height);
                        this.$setScale9Grid(rectangle);
                    }
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

        public get scale9Grid(): egret.Rectangle | null {
            return this.$scale9Grid;
        }
        public set scale9Grid(value: egret.Rectangle | null) {
            this.$setScale9Grid(value);
        }

        protected $setScale9Grid(value: egret.Rectangle | null): void {
            let self = this;
            if (self.$scale9Grid == value) {
                return;
            }

            // MD
            if (self.$scale9Grid) {
                if (value) {
                    (this._bkSprite as any).setScale9Grid(value);
                }
                else {
                    this._bkSprite = new BK.Sprite(0, 0, {} as any, 0, 1, 1, 1);
                    this._replaceNode(this._bkSprite);
                    this.$setTexture(this.$texture);
                }
            }
            else if (value) {
                this._bkSprite = new BKSprite9();
                this._replaceNode(this._bkSprite as any);
                this._bkSprite.setScale9Grid(value);
                this.hasScale9Grid = true;
                this.$setTexture(this.$texture);
            }

            this._bkSprite.size = this._size;
            self.$scale9Grid = value;
            self.$renderDirty = true;
        }
        /**
         * @override
         */
        $setWidth(value: number): boolean {
            let self = this;
            if (value < 0 || value == self.$explicitBitmapWidth) {
                return false;
            }
            self.$explicitBitmapWidth = value;

            // MD
            this._transformDirty = true;
            this._size.width = value;
            this._bkSprite.size = this._size;

            return true;
        }
        /**
         * @override
         */
        $setHeight(value: number): boolean {
            let self = this;
            if (value < 0 || value == self.$explicitBitmapHeight) {
                return false;
            }
            self.$explicitBitmapHeight = value;

            // MD
            this._transformDirty = true;
            this._size.height = value;
            this._bkSprite.size = this._size;

            return true;
        }
        /**
         * @override
         */
        $getWidth(): number {
            return isNaN(this.$explicitBitmapWidth) ? this.$getContentBounds().width : this.$explicitBitmapWidth;
        }
        /**
         * @override
         */
        $getHeight(): number {
            return isNaN(this.$explicitBitmapHeight) ? this.$getContentBounds().height : this.$explicitBitmapHeight;
        }
        /**
         * @override
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
    }
    if (window['renderMode'] != 'webgl') {
        egret.Bitmap = egret.BKBitmap as any;
    }

}
