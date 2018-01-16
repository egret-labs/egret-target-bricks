namespace egret {
    export type Size = { width: number, height: number };
    export type Vec3 = { x: number, y: number, z: number };
    export type Color = { r: number, g: number, b: number, a: number };

    export class BKDisplayObject extends egret.DisplayObject {
        /**
         * @internal
         */
        public _transformDirty: boolean = true;
        protected readonly _color: Color = { r: 1.0, g: 1.0, b: 1.0, a: 1.0 };
        /**
         * @internal
         */
        public _bkNode: BK.Node;

        public constructor(bkNode: BK.Node | null = null) {
            super();

            this._bkNode = bkNode || new BK.Node();
        }

        $setVisible(value: boolean): void {
            super.$setVisible(value);

            // MD
            this._bkNode.hidden = !value;
        }

        $setAlpha(value: number): void {
            super.$setAlpha(value);

            // MD
            this._color.a = value;
            this._bkNode.vertexColor = this._color;
        }

        $setX(value: number): boolean {
            let self = this;
            if (self.$x == value) {
                return false;
            }
            self.$x = value;

            // MD
            this._transformDirty = true;

            return true;
        }

        $setY(value: number): boolean {
            let self = this;
            if (self.$y == value) {
                return false;
            }
            self.$y = value;

            // MD
            this._transformDirty = true;

            return true;
        }

        /**
         * @private
         */
        $hitTest(stageX: number, stageY: number): DisplayObject {
            let self = this;
            if (!self.$visible) { // MD
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

        // MD
        $getRenderNode(): sys.RenderNode {
            if (this._transformDirty || (this as any).$matrixDirty) {
                this._transformDirty = false;
                const matrix = this.$getMatrix();
                const bkMatrix = (this._bkNode.transform as any).matrix;
                let tx = matrix.tx;
                let ty = matrix.ty;
                const pivotX = this.$anchorOffsetX;
                const pivotY = this.$anchorOffsetY;
                if (pivotX !== 0.0 || pivotY !== 0.0) {
                    tx -= matrix.a * pivotX + matrix.c * pivotY;
                    ty -= matrix.b * pivotX + matrix.d * pivotY;
                }

                bkMatrix.set(matrix.a, -matrix.b, -matrix.c, matrix.d, tx, -ty);
            }

            return this._bkNode as any;
        }

        $onAddToStage(stage: Stage, nestLevel: number): void {
            super.$onAddToStage(stage, nestLevel);

            // MD
            const index = BKPlayer.instance._displayList.indexOf(this);
            if (index < 0) {
                BKPlayer.instance._displayList.push(this);
            }
        }

        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();

            // MD
            const index = BKPlayer.instance._displayList.indexOf(this);
            if (index >= 0) {
                BKPlayer.instance._displayList.splice(index, 1);
            }
        }

        // // MD
        // $getMatrix(): Matrix {
        //     let self = this;
        //     if ((self as any).$matrixDirty) {
        //         (self as any).$matrixDirty = false;

        //         (self as any).$matrix.$updateScaleAndRotation((self as any).$scaleX, (self as any).$scaleY, (self as any).$skewX, (self as any).$skewY);
        //     }

        //     (self as any).$matrix.tx = self.$x;
        //     (self as any).$matrix.ty = self.$y;
        //     return (self as any).$matrix;
        // }
    }

    egret.DisplayObject = BKDisplayObject;
}
