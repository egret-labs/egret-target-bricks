namespace egret {
    export type Size = { width: number, height: number };
    export type Vec3 = { x: number, y: number, z: number };
    export type Color = { r: number, g: number, b: number, a: number };

    export class BKDisplayObject extends egret.DisplayObject {
        /**
         * @internal
         */
        public _transformDirty: boolean = true;
        /**
         * @internal
         */
        public _colorDirty: number = 0;
        /**
         * @internal
         */
        public readonly _color: Color = { r: 1.0, g: 1.0, b: 1.0, a: 1.0 };
        /**
         * @internal
         */
        public _bkNode: BK.Node;

        public constructor(bkNode: BK.Node | null = null) {
            super();

            this._bkNode = bkNode || new BK.Node();
        }

        protected _replaceNode(node: BK.Node): void {
            this._transformDirty = true;
            node.vertexColor = this._color;
            node.hidden = !this.visible;

            if (this._bkNode.parent) {
                this._bkNode.parent.addChild(node, this.parent.getChildIndex(this));
                this._bkNode.parent.removeChild(this._bkNode);
            }

            node.zOrder = this._bkNode.zOrder;
            this._bkNode = node;
        }
        /**
         * @internal
         */
        public _updateColor(): void {
            const parent = <any>this.$parent as BKDisplayObject;
            if (parent) {
                if (this._colorDirty === 2 || parent._colorDirty !== 0) {
                    this._colorDirty = 1;
                    this._color.a = parent.$alpha * this.$alpha;
                    this._bkNode.vertexColor = this._color;
                }
                else if (this._colorDirty === 1) {
                    this._colorDirty = 0;
                }
            }
            else {
                if (this._colorDirty === 2) {
                    this._colorDirty = 1;
                    this._color.a = this.$alpha;
                    this._bkNode.vertexColor = this._color;
                }
                else if (this._colorDirty === 1) {
                    this._colorDirty = 0;
                }
            }
        }
        /**
         * @override
         */
        $setVisible(value: boolean): void {
            super.$setVisible(value);

            // MD
            this._bkNode.hidden = !value;
        }
        /**
         * @override
         */
        $setAlpha(value: number): void {
            super.$setAlpha(value);

            this._colorDirty = 2; // self and child.
        }
        /**
         * @override
         */
        public set blendMode(value: string) {
            let self = this;
            let mode = sys.blendModeToNumber(value);
            self.$blendMode = mode;

            // MD
            switch (value) {
                case egret.BlendMode.NORMAL:
                    (this._bkNode as any).blendMode = 1;
                    break;

                case egret.BlendMode.ADD:
                    (this._bkNode as any).blendMode = 0;
                    break;

                case egret.BlendMode.ERASE:
                    break;

                default:
                    break;
            }
        }
        /**
         * @override
         */
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
        /**
         * @override
         */
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
         * @override
         */
        $setMatrix(matrix: Matrix, needUpdateProperties: boolean = true): void {
            super.$setMatrix(matrix, needUpdateProperties);
            this._transformDirty = true;
        }
        /**
         * @override
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
        /**
         * @override
         */
        $getRenderNode(): sys.RenderNode {
            // MD
            this._updateColor();

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
        /**
         * @override
         */
        $onAddToStage(stage: Stage, nestLevel: number): void {
            super.$onAddToStage(stage, nestLevel);

            // MD
            const index = BKPlayer.instance._displayList.indexOf(this);
            if (index < 0) {
                BKPlayer.instance._displayList.push(this);
            }
        }
        /**
         * @override
         */
        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();

            // MD
            const index = BKPlayer.instance._displayList.indexOf(this);
            if (index >= 0) {
                BKPlayer.instance._displayList.splice(index, 1);
            }
        }
    }

    egret.DisplayObject = BKDisplayObject;
}
