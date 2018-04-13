

namespace egret {

    export class WebGlGraphics extends egret.Graphics {
        public constructor() {
            super();
        }


        /**
         * 为BK重新实现hittest
         * stageX，stageY为在egret逻辑大小中实际点击的屏幕位置
         */
        $hitTest(stageX: number, stageY: number): DisplayObject {
            //获取对象相对于自身的边界矩形
            let target = this.$targetDisplay;
            let rect = Rectangle.create();
            target.$measureContentBounds(rect);

            //获取点击位置相对于对象的本地位置
            let result = Point.create(0, 0);
            this.$targetDisplay.globalToLocal(stageX, stageY, result);
            if (result.x >= rect.x
                && result.x <= rect.x + rect.width
                && result.y >= rect.y
                && result.y <= rect.y + rect.height
            ) {
                return target;
            } else {
                return null;
            }

            // let m = target.$getInvertedConcatenatedMatrix();
            // let localX = m.a * stageX + m.c * stageY + m.tx;
            // let localY = m.b * stageX + m.d * stageY + m.ty;
            // let buffer = sys.canvasHitTestBuffer;
            // buffer.resize(3, 3);
            // let node = this.$renderNode;
            // let matrix = Matrix.create();
            // matrix.identity();
            // matrix.translate(1 - localX, 1 - localY);
            // sys.canvasRenderer.drawNodeToBuffer(node, buffer, matrix, true);
            // Matrix.release(matrix);

            // try {
            //     let data = buffer.getPixels(1, 1);
            //     if (data[3] === 0) {
            //         return null;
            //     }
            // }
            // catch (e) {
            //     throw new Error(sys.tr(1039));
            // }
            // return target;
        }

    }
    if (window['renderMode'] == 'webgl') {
        egret.Graphics = egret.WebGlGraphics;
    }
}