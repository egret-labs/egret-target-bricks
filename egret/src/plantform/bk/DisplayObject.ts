namespace egret {
    export type Size = { width: number, height: number };
    export type Vec3 = { x: number, y: number, z: number };
    export type Color = { r: number, g: number, b: number, a: number };

    export class BKDisplayObject extends egret.DisplayObject {
        /**
         * @internal
         * @private
         */
        public _bkNode: BK.Node;
        protected readonly _position: Vec3 = { x: 0.0, y: 0.0, z: 0.0 };
        protected readonly _scale: Vec3 = { x: 1.0, y: 1.0, z: 0.0 };
        protected readonly _rotation: Vec3 = { x: 0.0, y: 0.0, z: 0.0 };
        protected readonly _color: Color = { r: 1.0, g: 1.0, b: 1.0, a: 1.0 };

        public constructor(bkNode: BK.Node | null = null) {
            super();

            this._bkNode = bkNode || new BK.Node();
        }

        /**
         * @private
         */
        $hitTest(stageX: number, stageY: number): DisplayObject {
            let self = this;
            if (!self.$visible) {
                return null;
            }
            let m = self.$getInvertedConcatenatedMatrix();
            if (m.a == 0 && m.b == 0 && m.c == 0 && m.d == 0) {//防止父类影响子类
                return null;
            }
            let bounds = self.$getContentBounds();
            let localX = m.a * stageX + m.c * stageY + m.tx;
            let localY = m.b * stageX + m.d * stageY + m.ty;
            if (bounds.contains(localX, localY)) {
                if (!self.$children) {//容器已经检查过scrollRect和mask，避免重复对遮罩进行碰撞。

                    let rect = self.$scrollRect ? self.$scrollRect : self.$maskRect;
                    if (rect && !rect.contains(localX, localY)) {
                        return null;
                    }
                    if (self.$mask && !self.$mask.$hitTest(stageX, stageY)) {
                        return null;
                    }
                }
                return self;
            }
            return null;
        }

        $setX(value: number): boolean {
            let self = this;
            if (self.$x == value) {
                return false;
            }
            self.$x = value;
            //
            self._position.x = value;
            self._bkNode.position = self._position;

            return true;
        }

        $setY(value: number): boolean {
            let self = this;
            if (self.$y == value) {
                return false;
            }
            self.$y = value;
            //
            self._position.y = -value;
            self._bkNode.position = self._position;

            return true;
        }

        $setScaleX(value: number): void {
            super.$setScaleX(value);
            //
            this._scale.x = value;
            this._bkNode.scale = this._scale;
        }

        $setScaleY(value: number): void {
            super.$setScaleY(value);
            //
            this._scale.y = value;
            this._bkNode.scale = this._scale;
        }

        $setRotation(value: number): void {
            super.$setRotation(value);
            //
            this._rotation.z = value;
            this._bkNode.rotation = this._rotation;
        }

        $setVisible(value: boolean): void {
            super.$setVisible(value);
            //
            this._bkNode.hidden = !value;
        }

        $setAlpha(value: number): void {
            super.$setAlpha(value);
            //
            this._color.a = value;
            this._bkNode.vertexColor = this._color;
        }
    }

    egret.DisplayObject = BKDisplayObject;
}
