namespace egret {
    export class BKMesh extends BKDisplayObject {
        private _verticesDirty: boolean = true;
        private _boundsDirty: boolean = true;
        private readonly _bounds: Rectangle = new Rectangle();
        private readonly _bkMesh: BK.Mesh = new BK.Mesh({} as any, [], []);
        private $bitmapData: egret.BKBitmapData | null = null;
        private $texture: egret.Texture | null = null;

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

            this._transformDirty = true;

            if (this.$texture) {
                this.$bitmapData = <any>this.$texture.bitmapData as BKBitmapData;
                if (this.$bitmapData.bkTexture) {
                    (this._bkMesh as any).setTexture(this.$bitmapData.bkTexture);
                    (this._bkMesh as any).adjustTexturePosition(
                        this.$texture.$bitmapX,
                        this.$texture.$sourceHeight - (this.$texture.$bitmapY + this.$texture.$bitmapHeight),
                        this.$texture.$bitmapWidth,
                        this.$texture.$bitmapHeight,
                        this.$texture.$rotated
                    );
                }
                else {
                    this.$bitmapData = null;
                    (this._bkMesh as any).setTexture({} as any);
                }
            }
            else {
                this.$bitmapData = null;
                (this._bkMesh as any).setTexture({} as any);
            }
        }

        /**
         * @override
         */
        $updateVertices(): void {
            this._verticesDirty = true;
            this._boundsDirty = true;

            this.$renderNode = new sys.MeshNode();
        }
        /**
         * @override
         */
        $measureContentBounds(bounds: Rectangle): void {
            if (this._boundsDirty) {
                this._boundsDirty = false;
                let node = <sys.MeshNode>this.$renderNode;
                let vertices = node.vertices;
                if (vertices.length) {
                    this._bounds.setTo(Number.MAX_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
                    for (let i = 0, l = vertices.length; i < l; i += 2) {
                        let x = vertices[i];
                        let y = vertices[i + 1];
                        if (this._bounds.x > x) this._bounds.x = x;
                        if (this._bounds.width < x) this._bounds.width = x;
                        if (this._bounds.y > y) this._bounds.y = y;
                        if (this._bounds.height < y) this._bounds.height = y;
                    }
                    this._bounds.width -= this._bounds.x;
                    this._bounds.height -= this._bounds.y;
                } else {
                    this._bounds.setTo(0, 0, 0, 0);
                }
                node.bounds.copyFrom(this._bounds);
            }
            bounds.copyFrom(this._bounds);
        }
        /**
         * @override
         */
        $getRenderNode(): sys.RenderNode {
            if (this._verticesDirty) {
                this._verticesDirty = false;

                const meshNode = this.$renderNode as sys.MeshNode;
                const nodeVercices = meshNode.vertices;
                const nodeUV = meshNode.uvs;
                let bkVertices = (this._bkMesh as any).getVertices();
                if (!bkVertices) {
                    bkVertices = [];
                }

                if (bkVertices.length !== nodeVercices.length / 2) {
                    for (let i = bkVertices.length, l = nodeVercices.length / 2; i < l; ++i) {
                        bkVertices[i] = {};
                    }

                    for (let i = 0, iD = 0, l = bkVertices.length; i < l; ++i, iD += 2) {
                        const vertex = bkVertices[i];
                        vertex.x = nodeVercices[iD];
                        vertex.y = nodeVercices[iD + 1];
                        vertex.z = this._bkNode.zOrder;
                        vertex.r = 1.0;
                        vertex.g = 1.0;
                        vertex.b = 1.0;
                        vertex.a = 1.0;

                        vertex.u = nodeUV[iD];
                        vertex.v = nodeUV[iD + 1];
                    }
                }
                else {
                    for (let i = 0, iD = 0, l = bkVertices.length; i < l; ++i, iD += 2) {
                        const vertex = bkVertices[i];
                        vertex.x = nodeVercices[iD];
                        vertex.y = nodeVercices[iD + 1];
                    }
                }

                this._bkMesh.setVerticesAndIndices(bkVertices, meshNode.indices);
            }

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
    }
}