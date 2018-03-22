namespace egret {

    export class BKMesh extends BKDisplayObject {
        private _textureDirty: boolean = true;
        private _boundsDirty: boolean = true;
        private readonly _bounds: Rectangle = new Rectangle();
        private readonly _bkMesh: BK.Mesh;
        private $bitmapData: egret.BKBitmapData | null = null;
        private $texture: egret.Texture | null = null;

        public constructor() {
            super(
                new BK.Mesh(
                    emptyTexture,
                    [
                        { x: 0.0, y: 0.0, z: 0.0, r: 1.0, g: 1.0, b: 1.0, a: 1.0, u: 0.0, v: 1.0 },
                        { x: 0.0, y: 0.0, z: 0.0, r: 1.0, g: 1.0, b: 1.0, a: 1.0, u: 1.0, v: 1.0 },
                        { x: 0.0, y: -0.0, z: 0.0, r: 1.0, g: 1.0, b: 1.0, a: 1.0, u: 0.0, v: 0.0 }
                    ],
                    [
                        0, 1, 2
                    ]
                )
            );

            this.$renderNode = new sys.MeshNode() as any;

            this._bkMesh = this._bkNode as any;
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

            this._transformDirty = true;

            if (this.$texture) {
                this.$bitmapData = <any>this.$texture.bitmapData as BKBitmapData;
                if (this.$bitmapData.bkTexture) {
                    (this._bkMesh as any).setTexture(this.$bitmapData.bkTexture);
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
            this._boundsDirty = true;
            this.$renderDirty = true;
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
        $updateRenderNode(): void {
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

                const subTextureRotated = this.$texture.$rotated;
                const subTextureX = this.$texture.$bitmapX;
                const subTextureY = this.$texture.$bitmapY;
                const subTextureWidth = this.$texture.$bitmapWidth;
                const subTextureHeight = this.$texture.$bitmapHeight;
                const textureWidth = this.$texture.$sourceWidth;
                const textureHeight = this.$texture.$sourceHeight;

                const kx1 = subTextureX / textureWidth;
                const kx2 = subTextureRotated ? subTextureHeight / textureWidth : subTextureWidth / textureWidth;
                const ky1 = subTextureY / textureHeight;
                const ky2 = subTextureRotated ? subTextureWidth / textureHeight : subTextureHeight / textureHeight;

                for (let i = 0, iD = 0, l = bkVertices.length; i < l; ++i, iD += 2) {
                    const vertex = bkVertices[i];
                    const u = nodeUV[iD];
                    const v = nodeUV[iD + 1];

                    vertex.x = nodeVercices[iD];
                    vertex.y = -nodeVercices[iD + 1];
                    vertex.z = this._bkNode.zOrder;
                    vertex.r = 1.0;
                    vertex.g = 1.0;
                    vertex.b = 1.0;
                    vertex.a = 1.0;

                    // uv
                    if (subTextureRotated) {
                        vertex.u = kx1 + (1.0 - v) * kx2;
                        vertex.v = 1.0 - (ky1 + u * ky2);
                    }
                    else {
                        vertex.u = kx1 + u * kx2;
                        vertex.v = 1.0 - (ky1 + v * ky2);
                    }
                }
            }
            else {
                for (let i = 0, iD = 0, l = bkVertices.length; i < l; ++i, iD += 2) {
                    const vertex = bkVertices[i];
                    vertex.x = nodeVercices[iD];
                    vertex.y = -nodeVercices[iD + 1];
                }
            }

            this._bkMesh.setVerticesAndIndices(bkVertices, meshNode.indices); // 需要提供更加高性能的接口
        }
    }
    //MD
    if (window['renderMode'] != 'webgl') {
        egret.Mesh = egret.BKMesh as any;
    }
}