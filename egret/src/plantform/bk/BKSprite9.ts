namespace egret {
    export class BKSprite9 {
        private _contentWidth: number = 0;
        private _contentHeight: number = 0;
        private readonly _size: Size = { width: 0.0, height: 0.0 };
        private readonly _rawGrid: egret.Rectangle = new egret.Rectangle();
        private readonly _grid: egret.Rectangle = new egret.Rectangle();
        private readonly _leftTop: BK.Sprite = new BK.Sprite(0, 0, {} as any, 0, 1, 1, 1);
        private readonly _centerTop: BK.Sprite = new BK.Sprite(0, 0, {} as any, 0, 1, 1, 1);
        private readonly _rightTop: BK.Sprite = new BK.Sprite(0, 0, {} as any, 0, 1, 1, 1);
        private readonly _leftCenter: BK.Sprite = new BK.Sprite(0, 0, {} as any, 0, 1, 1, 1);
        private readonly _centerCenter: BK.Sprite = new BK.Sprite(0, 0, {} as any, 0, 1, 1, 1);
        private readonly _rightCenter: BK.Sprite = new BK.Sprite(0, 0, {} as any, 0, 1, 1, 1);
        private readonly _leftBottom: BK.Sprite = new BK.Sprite(0, 0, {} as any, 0, 1, 1, 1);
        private readonly _centerBottom: BK.Sprite = new BK.Sprite(0, 0, {} as any, 0, 1, 1, 1);
        private readonly _rightBottom: BK.Sprite = new BK.Sprite(0, 0, {} as any, 0, 1, 1, 1);
        private readonly __nativeObj: BK.Node = new BK.Node();

        public constructor() {
            //
            const names = Object.getOwnPropertyNames(this.__nativeObj);
            names.forEach(function (element) {
                var key = element;
                // log("name:"+key);
                Object.defineProperty(this, key, {
                    get: function () {
                        return this.__nativeObj[key];
                    },
                    set: function (obj) {
                        this.__nativeObj[key] = obj;
                    }
                });
            }, this);

            this.__nativeObj.addChild(this._leftTop);
            this.__nativeObj.addChild(this._centerTop);
            this.__nativeObj.addChild(this._rightTop);
            this.__nativeObj.addChild(this._leftCenter);
            this.__nativeObj.addChild(this._centerCenter);
            this.__nativeObj.addChild(this._rightCenter);
            this.__nativeObj.addChild(this._leftBottom);
            this.__nativeObj.addChild(this._centerBottom);
            this.__nativeObj.addChild(this._rightBottom);
        }

        private _updateGrid(): void {
            this._grid.x = this._rawGrid.x;
            this._grid.y = this._rawGrid.y;
            this._grid.width = this._contentWidth - this._rawGrid.x - this._rawGrid.width;
            this._grid.height = this._contentHeight - this._rawGrid.y - this._rawGrid.height;
        }

        public dispose(): void {
            this.__nativeObj.dispose();
        }

        public setTexture(value: BK.Texture): void {
            this._leftTop.setTexture(value);
            this._centerTop.setTexture(value);
            this._rightTop.setTexture(value);
            this._leftCenter.setTexture(value);
            this._centerCenter.setTexture(value);
            this._rightCenter.setTexture(value);
            this._leftBottom.setTexture(value);
            this._centerBottom.setTexture(value);
            this._rightBottom.setTexture(value);
        }
        /**
         * x y 描述左上角size，width height 描述右下角size
         */
        public setScale9Grid(value: egret.Rectangle): void {
            this._rawGrid.setTo(
                value.x,
                value.y,
                value.width,
                value.height
            );
            this._updateGrid();
        }

        public adjustTexturePosition(offsetX: number, offsetY: number, contentWidth: number, contentHeight: number, rotated: boolean): void {
            this._contentWidth = contentWidth;
            this._contentHeight = contentHeight;
            this._updateGrid();

            const ltW = this._grid.x;
            const ltH = this._grid.y;
            const rbW = this._grid.width;
            const rbH = this._grid.height;
            const centerWidth = contentWidth - ltW - rbW;
            const centerHeight = contentHeight - ltH - rbH;

            if (rotated === true) {
                // TODO
            }
            else {
                const x1 = offsetX;
                const x2 = offsetX + ltW;
                const x3 = offsetX + (contentWidth - rbW);
                const y1 = offsetY;
                const y2 = offsetY + rbH;
                const y3 = offsetY + (contentHeight - ltH);

                this._leftTop.adjustTexturePosition(x1, y3, ltW, ltH);
                this._centerTop.adjustTexturePosition(x2, y3, centerWidth, ltH);
                this._rightTop.adjustTexturePosition(x3, y3, rbW, ltH);
                this._leftCenter.adjustTexturePosition(x1, y2, ltW, centerHeight);
                this._centerCenter.adjustTexturePosition(x2, y2, centerWidth, centerHeight);
                this._rightCenter.adjustTexturePosition(x3, y2, rbW, centerHeight);
                this._leftBottom.adjustTexturePosition(x1, y1, ltW, rbH);
                this._centerBottom.adjustTexturePosition(x2, y1, centerWidth, rbH);
                this._rightBottom.adjustTexturePosition(x3, y1, rbW, rbH);
            }
        }

        public get size(): Size {
            return this._size;
        }

        public set size(value: Size) {
            const contentWidth = this._size.width = value.width;
            const contentHeight = this._size.height = value.height;
            let ltW = this._grid.x;
            let ltH = this._grid.y;
            let rbW = this._grid.width;
            let rbH = this._grid.height;

            if (contentWidth < ltW + rbW) {
                const dW = (ltW + rbW - contentWidth) * 0.5;
                ltW -= dW;
                rbW -= dW;
            }

            if (contentHeight < ltH + rbH) {
                const dH = (ltH + rbH - contentHeight) * 0.5;
                ltH -= dH;
                rbH -= dH;
            }

            const centerWidth = contentWidth - ltW - rbW;
            const centerHeight = contentHeight - ltH - rbH;

            this._leftTop.position = { x: 0.0, y: rbH + centerHeight };
            this._centerTop.position = { x: ltW, y: rbH + centerHeight };
            this._rightTop.position = { x: ltW + centerWidth, y: rbH + centerHeight };
            this._leftCenter.position = { x: 0.0, y: rbH };
            this._centerCenter.position = { x: ltW, y: rbH };
            this._rightCenter.position = { x: ltW + centerWidth, y: rbH };
            this._leftBottom.position = { x: 0.0, y: 0.0 };
            this._centerBottom.position = { x: ltW, y: 0.0 };
            this._rightBottom.position = { x: ltW + centerWidth, y: 0.0 };

            this._leftTop.size = { width: ltW + 1, height: ltH + 1 };
            this._centerTop.size = { width: centerWidth + 1, height: ltH + 1 };
            this._rightTop.size = { width: rbW, height: ltH + 1 };
            this._leftCenter.size = { width: ltW + 1, height: centerHeight + 1 };
            this._centerCenter.size = { width: centerWidth + 1, height: centerHeight + 1 };
            this._rightCenter.size = { width: rbW + 1, height: centerHeight + 1 };
            this._leftBottom.size = { width: ltW + 1, height: rbH };
            this._centerBottom.size = { width: centerWidth + 1, height: rbH };
            this._rightBottom.size = { width: rbW, height: rbH };
        }
    }
}