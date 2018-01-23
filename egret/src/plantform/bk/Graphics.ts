namespace egret {
    export class BKGraphics {

        public static pixelPath: string = "GameRes://resource/pixel.png";
        public static circlePath: string = "GameRes://resource/circle.png"

        private stageW: number;
        private stageH: number;
        // private offsetX: number;
        // private offsetY: number;

        // public _BKCanvas: BK.Canvas;

        // public _BKNode: BK.Node;

        /**
         * Initializes a Graphics object.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建一个 Graphics 对象。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public constructor() {
            let stage = egret.lifecycle.stage
            this.stageW = stage.stageWidth;
            this.stageH = stage.stageHeight;
            // this._BKNode = new BK.Node();
            // this._BKCanvas = new BK.Canvas(2 * this.stageW, 2 * this.stageH)//sys.GraphicsNode();
            // this._BKCanvas.position = { x: - this.stageW, y: - this.stageH };
            // this.offsetX = this.stageW;
            // this.offsetY = this.stageH;
            // this._BKCanvas.backgroundColor = { r: 0, g: 0, b: 0, a: 0 };
        }

        /**
         * @private
         */
        // $renderNode: sys.GraphicsNode;
        /**
         * 绑定到的目标显示对象
         */
        private targetDisplay: DisplayObject;

        /**
         * @private
         * 设置绑定到的目标显示对象
         */
        $setTarget(target: DisplayObject): void {
            if (this.targetDisplay) {
                this.targetDisplay.$renderNode = null;
            }
            // (target as BKDisplayObject)._bkNode.addChild(this._BKNode);
            // target._bkNode.addChild(this._BKCanvas);
            this.targetDisplay = target;
        }

        /**
         * 当前移动到的坐标X
         */
        private lastX: number;
        /**
         * 当前移动到的坐标Y
         */
        private lastY: number;
        /**
         * 当前正在绘制的填充
         */
        // private fillPath: sys.Path2D = null;
        private isFillPath: boolean;

        /**
         * 当前正在绘制的线条
         */
        // private strokePath: sys.StrokePath = null;
        private isStrokePath: boolean;
        /**
         * 线条的左上方宽度
         */
        private topLeftStrokeWidth = 0;
        /**
         * 线条的右下方宽度
         */
        private bottomRightStrokeWidth = 0;

        /**
         * 线条宽度
         */
        private lineWidth: number = 0;


        private strokeColor: { r: number, g: number, b: number, a: number } = { r: 0, g: 0, b: 0, a: 0 };
        private fillColor: { r: number, g: number, b: number, a: number } = { r: 0, g: 0, b: 0, a: 0 };

        /**
         * 对1像素和3像素特殊处理，向右下角偏移0.5像素，以显示清晰锐利的线条。
         */
        private setStrokeWidth(width: number) {
            switch (width) {
                case 1:
                    this.topLeftStrokeWidth = 0;
                    this.bottomRightStrokeWidth = 1;
                    break;
                case 3:
                    this.topLeftStrokeWidth = 1;
                    this.bottomRightStrokeWidth = 2;
                    break;
                default:
                    let half = Math.ceil(width * 0.5) | 0;
                    this.topLeftStrokeWidth = half;
                    this.bottomRightStrokeWidth = half;
                    break;
            }
        }

        /**
         * Specify a simple single color fill that will be used for subsequent calls to other Graphics methods (for example, lineTo() and drawCircle()) when drawing.
         * Calling the clear() method will clear the fill.
         * @param color Filled color
         * @param alpha Filled Alpha value
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 指定一种简单的单一颜色填充，在绘制时该填充将在随后对其他 Graphics 方法（如 lineTo() 或 drawCircle()）的调用中使用。
         * 调用 clear() 方法会清除填充。
         * @param color 填充的颜色
         * @param alpha 填充的 Alpha 值
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public beginFill(color: number, alpha: number = 1): void {
            color = +color || 0;
            alpha = +alpha || 0;
            this.isFillPath = true;
            let rgb_str = this._refitString(color, 6);//六位rgb格式
            let red: number = parseInt(rgb_str.substring(0, 2), 16) / 255;
            let green: number = parseInt(rgb_str.substring(2, 4), 16) / 255;
            let blue: number = parseInt(rgb_str.substring(4, 6), 16) / 255;
            this.fillColor = { r: red, g: green, b: blue, a: alpha };
        }

        /**
          * 为16进制数字补0，输出字符串
          */
        private _refitString(num: number, length: number): string {
            let str = num.toString(16);
            let zero = "00000000";
            return zero.substr(0, length - str.length) + str;
        }


        /**
         * Specifies a gradient fill used by subsequent calls to other Graphics methods (such as lineTo() or drawCircle()) for the object.
         * Calling the clear() method clears the fill.
         * @param type A value from the GradientType class that specifies which gradient type to use: GradientType.LINEAR or GradientType.RADIAL.
         * @param colors An array of RGB hexadecimal color values used in the gradient; for example, red is 0xFF0000, blue is 0x0000FF, and so on. You can specify up to 15 colors. For each color, specify a corresponding value in the alphas and ratios parameters.
         * @param alphas An array of alpha values for the corresponding colors in the colors array;
         * @param ratios An array of color distribution ratios; valid values are 0-255.
         * @param matrix A transformation matrix as defined by the egret.Matrix class. The egret.Matrix class includes a createGradientBox() method, which lets you conveniently set up the matrix for use with the beginGradientFill() method.
         * @platform Web,Native
         * @version Egret 2.4
         * @language en_US
         */
        /**
         * 指定一种渐变填充，用于随后调用对象的其他 Graphics 方法（如 lineTo() 或 drawCircle()）。
         * 调用 clear() 方法会清除填充。
         * @param type 用于指定要使用哪种渐变类型的 GradientType 类的值：GradientType.LINEAR 或 GradientType.RADIAL。
         * @param colors 渐变中使用的 RGB 十六进制颜色值的数组（例如，红色为 0xFF0000，蓝色为 0x0000FF，等等）。对于每种颜色，请在 alphas 和 ratios 参数中指定对应值。
         * @param alphas colors 数组中对应颜色的 alpha 值数组。
         * @param ratios 颜色分布比率的数组。有效值为 0 到 255。
         * @param matrix 一个由 egret.Matrix 类定义的转换矩阵。egret.Matrix 类包括 createGradientBox() 方法，通过该方法可以方便地设置矩阵，以便与 beginGradientFill() 方法一起使用
         * @platform Web,Native
         * @version Egret 2.4
         * @language zh_CN
         */
        public beginGradientFill(type: string, colors: number[], alphas: number[], ratios: number[], matrix: egret.Matrix = null): void {
            //暂不使用
        }

        /**
         * Apply fill to the lines and curves added after the previous calling to the beginFill() method.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 对从上一次调用 beginFill()方法之后添加的直线和曲线应用填充。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public endFill(): void {
            // // this.fillPath = null;
            if (this.isFillPath) {
                // this._BKCanvas.fill();
                this.isFillPath = false;
            }
            if (this.isStrokePath) {
                // this._BKCanvas.stroke();
                // this._BKCanvas.closePath();
                this.isStrokePath = false;
            }
        }

        /**
         * Specify a line style that will be used for subsequent calls to Graphics methods such as lineTo() and drawCircle().
         * @param thickness An integer, indicating the thickness of the line in points. Valid values are 0 to 255. If a number is not specified, or if the parameter is undefined, a line is not drawn. If a value less than 0 is passed, the default value is 0. Value 0 indicates hairline thickness; the maximum thickness is 255. If a value greater than 255 is passed, the default value is 255.
         * @param color A hexadecimal color value of the line (for example, red is 0xFF0000, and blue is 0x0000FF, etc.). If no value is specified, the default value is 0x000000 (black). Optional.
         * @param alpha Indicates Alpha value of the line's color. Valid values are 0 to 1. If no value is specified, the default value is 1 (solid). If the value is less than 0, the default value is 0. If the value is greater than 1, the default value is 1.
         * @param pixelHinting A boolean value that specifies whether to hint strokes to full pixels. This affects both the position of anchors of a curve and the line stroke size itself. With pixelHinting set to true, the line width is adjusted to full pixel width. With pixelHinting set to false, disjoints can appear for curves and straight lines.
         * @param scaleMode Specifies the scale mode to be used
         * @param caps Specifies the value of the CapsStyle class of the endpoint type at the end of the line. (default = CapsStyle.ROUND)
         * @param joints Specifies the type of joint appearance of corner.  (default = JointStyle.ROUND)
         * @param miterLimit Indicates the limit number of cut miter.
         * @param lineDash set the line dash.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 指定一种线条样式以用于随后对 lineTo() 或 drawCircle() 等 Graphics 方法的调用。
         * @param thickness 一个整数，以点为单位表示线条的粗细，有效值为 0 到 255。如果未指定数字，或者未定义该参数，则不绘制线条。如果传递的值小于 0，则默认值为 0。值 0 表示极细的粗细；最大粗细为 255。如果传递的值大于 255，则默认值为 255。
         * @param color 线条的十六进制颜色值（例如，红色为 0xFF0000，蓝色为 0x0000FF 等）。如果未指明值，则默认值为 0x000000（黑色）。可选。
         * @param alpha 表示线条颜色的 Alpha 值的数字；有效值为 0 到 1。如果未指明值，则默认值为 1（纯色）。如果值小于 0，则默认值为 0。如果值大于 1，则默认值为 1。
         * @param pixelHinting 布尔型值，指定是否提示笔触采用完整像素。它同时影响曲线锚点的位置以及线条笔触大小本身。在 pixelHinting 设置为 true 的情况下，线条宽度会调整到完整像素宽度。在 pixelHinting 设置为 false 的情况下，对于曲线和直线可能会出现脱节。
         * @param scaleMode 用于指定要使用的比例模式
         * @param caps 用于指定线条末端处端点类型的 CapsStyle 类的值。默认值：CapsStyle.ROUND
         * @param joints 指定用于拐角的连接外观的类型。默认值：JointStyle.ROUND
         * @param miterLimit 用于表示剪切斜接的极限值的数字。
         * @param lineDash 设置虚线样式。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */

        public lineStyle(thickness: number = NaN, color: number = 0, alpha: number = 1.0, pixelHinting: boolean = false,
            scaleMode: string = "normal", caps: string = null, joints: string = null, miterLimit: number = 3, lineDash?: number[]) {
            if (thickness <= 0) {
                this.isStrokePath = false;
                this.lineWidth = 0;
                this.setStrokeWidth(0);
            } else {
                color = +color || 0;
                alpha = +alpha || 0;
                this.setStrokeWidth(thickness);
                this.lineWidth = thickness;
                // this._BKCanvas.lineWidth = thickness;
                this.isStrokePath = true;
                let rgb_str = this._refitString(color, 6);
                let red: number = parseInt(rgb_str.substring(0, 2), 16) / 255;
                let green: number = parseInt(rgb_str.substring(2, 4), 16) / 255;
                let blue: number = parseInt(rgb_str.substring(4, 6), 16) / 255;
                this.strokeColor = { r: red, g: green, b: blue, a: alpha };
                // this._BKCanvas.strokeColor = { r: red, g: green, b: blue, a: alpha };
            }
        }

        /**
         * Draw a rectangle
         * @param x x position of the center, relative to the registration point of the parent display object (in pixels).
         * @param y y position of the center, relative to the registration point of the parent display object (in pixels).
         * @param width Width of the rectangle (in pixels).
         * @param height Height of the rectangle (in pixels).
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 绘制一个矩形
         * @param x 圆心相对于父显示对象注册点的 x 位置（以像素为单位）。
         * @param y 相对于父显示对象注册点的圆心的 y 位置（以像素为单位）。
         * @param width 矩形的宽度（以像素为单位）。
         * @param height 矩形的高度（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public drawRect(x: number, y: number, width: number, height: number): void {
            let _x = +x || 0;
            let _y = - y || 0;
            width = +width || 0;
            height = +height || 0;
            if (this.isFillPath) {
                let texture = new BK.Texture(BKGraphics.pixelPath);
                this.addSprite(texture, _x, _y, width, height)
            }
        }

        /**
         * Draw a rectangle with rounded corners.
         * @param x x position of the center, relative to the registration point of the parent display object (in pixels).
         * @param y y position of the center, relative to the registration point of the parent display object (in pixels).
         * @param width Width of the rectangle (in pixels).
         * @param height Height of the rectangle (in pixels).
         * @param ellipseWidth Width used to draw an ellipse with rounded corners (in pixels).
         * @param ellipseHeight Height used to draw an ellipse with rounded corners (in pixels). (Optional) If no value is specified, the default value matches the value of the ellipseWidth parameter.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 绘制一个圆角矩形。
         * @param x 圆心相对于父显示对象注册点的 x 位置（以像素为单位）。
         * @param y 相对于父显示对象注册点的圆心的 y 位置（以像素为单位）。
         * @param width 矩形的宽度（以像素为单位）。
         * @param height 矩形的高度（以像素为单位）。
         * @param ellipseWidth 用于绘制圆角的椭圆的宽度（以像素为单位）。
         * @param ellipseHeight 用于绘制圆角的椭圆的高度（以像素为单位）。 （可选）如果未指定值，则默认值与为 ellipseWidth 参数提供的值相匹配。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public drawRoundRect(x: number, y: number, width: number, height: number, ellipseWidth: number, ellipseHeight?: number): void {
            //暂不支持

        }

        private roundRect(x: number, y: number, width: number, height: number, ellipseWidth: number, ellipseHeight: number) {
        }

        /**
         * Draw a circle.
         * @param x x position of the center, relative to the registration point of the parent display object (in pixels).
         * @param y y position of the center, relative to the registration point of the parent display object (in pixels).
         * @param r Radius of the circle (in pixels).
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 绘制一个圆。
         * @param x 圆心相对于父显示对象注册点的 x 位置（以像素为单位）。
         * @param y 相对于父显示对象注册点的圆心的 y 位置（以像素为单位）。
         * @param radius 圆的半径（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public drawCircle(x: number, y: number, radius: number): void {
            let _x = +x || 0;
            let _y = - y || 0;
            radius = +radius || 0;
            if (this.isFillPath) {
                let texture = new BK.Texture(BKGraphics.circlePath);
                this.addSprite(texture, _x, _y, radius * 2, radius * 2, true);
            }
        }

        private addSprite(texture: BK.Texture, x: number, y: number, width: number, height: number, isCenter: boolean = false) {
            let rect = new BK.Sprite(width, height, texture, 0, 1, 1, 1);
            rect.position = { x: x, y: y };
            rect.vertexColor = this.fillColor;
            if (isCenter) {
                rect.anchor = { x: 0.5, y: 0.5 };
            } else {
                rect.anchor = { x: 0, y: 1 };
            }
            this.targetDisplay['_bkNode'].addChild(rect);
        }


        /**
         * Draw an ellipse.
         * @param x A number indicating the horizontal position, relative to the registration point of the parent display object (in pixels).
         * @param y A number indicating the vertical position, relative to the registration point of the parent display object (in pixels).
         * @param width Width of the rectangle (in pixels).
         * @param height Height of the rectangle (in pixels).
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 绘制一个椭圆。
         * @param x 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
         * @param y 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
         * @param width 矩形的宽度（以像素为单位）。
         * @param height 矩形的高度（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public drawEllipse(x: number, y: number, width: number, height: number): void {
            let _x = +x || 0;
            let _y = - y || 0;
            width = +width || 0;
            height = +height || 0;
            if (this.isFillPath) {
                let texture = new BK.Texture(BKGraphics.circlePath);
                let rect = new BK.Sprite(width, height, texture, 0, 1, 1, 1);
                rect.position = { x: _x, y: _y - height };
                rect.vertexColor = this.fillColor;
                this.targetDisplay['_bkNode'].addChild(rect);
            }
        }

        /**
         * Move the current drawing position to (x, y). If any of these parameters is missed, calling this method will fail and the current drawing position keeps unchanged.
         * @param x A number indicating the horizontal position, relative to the registration point of the parent display object (in pixels).
         * @param y A number indicating the vertical position, relative to the registration point of the parent display object (in pixels).
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 将当前绘图位置移动到 (x, y)。如果缺少任何一个参数，则此方法将失败，并且当前绘图位置不改变。
         * @param x 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
         * @param y 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public moveTo(x: number, y: number): void {
            let _x = x || 0;
            let _y = - y || 0;
            this.lastX = _x;
            this.lastY = _y;
            // this._BKCanvas.moveTo(_x, _y);
            // let fillPath = this.fillPath;
            // let strokePath = this.strokePath;
            // fillPath && fillPath.moveTo(x, y);
            // strokePath && strokePath.moveTo(x, y);
            // this.includeLastPosition = false;
            // this.lastX = _x;
            // this.lastY = _y;
            // this.$renderNode.dirtyRender = true;
        }

        /**
         * Draw a straight line from the current drawing position to (x, y) using the current line style; the current drawing position is then set to (x, y).
         * @param x A number indicating the horizontal position, relative to the registration point of the parent display object (in pixels).
         * @param y A number indicating the vertical position, relative to the registration point of the parent display object (in pixels).
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 使用当前线条样式绘制一条从当前绘图位置开始到 (x, y) 结束的直线；当前绘图位置随后会设置为 (x, y)。
         * @param x 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
         * @param y 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public lineTo(x: number, y: number): void {
            if (this.isStrokePath) {
                let _x = x || 0;
                let _y = - y || 0;
                let _lastX = this.lastX !== undefined ? this.lastX : x;
                let _lastY = this.lastY !== undefined ? this.lastY : y;

                //由x,y,lastx,lasty算出相对的偏移角度以及距离；
                let distance = Math.sqrt(Math.pow(_x - _lastX, 2) + Math.pow(_y - _lastY, 2))
                let rotation: number;
                if (_x - _lastX !== 0) {
                    rotation = (Math.atan((_y - _lastY) / (_x - _lastX)) / Math.PI) * 180;
                } else {
                    rotation = _y - _lastY > 0 ? 90 : -90;
                }

                let texture = new BK.Texture(BKGraphics.pixelPath,6,0,0,1,1);
                let line = new BK.Sprite(distance, this.lineWidth, texture, 0, 1, 1, 1);
                line.position = { x: _lastX, y: _lastY };
                line.rotation = { x: 0, y: 0, z: rotation }
                line.vertexColor = this.strokeColor;
                this.targetDisplay['_bkNode'].addChild(line);
                this.lastX = _x;
                this.lastY = _y;
            }
            // this._BKCanvas.lineTo(_x, _y);
            // let fillPath = this.fillPath;
            // let strokePath = this.strokePath;
            // fillPath && fillPath.lineTo(x, y);
            // strokePath && strokePath.lineTo(x, y);
            // this.updatePosition(x, y);
            // this.$renderNode.dirtyRender = true;
        }

        /**
         * Draw a quadratic Bezier curve from the current drawing position to (anchorX, anchorY) using the current line style according to the control points specified by (controlX, controlY). The current drawing position is then set to (anchorX, anchorY).
         * If the curveTo() method is called before the moveTo() method, the default value of the current drawing position is (0, 0). If any of these parameters is missed, calling this method will fail and the current drawing position keeps unchanged.
         * The drawn curve is a quadratic Bezier curve. A quadratic Bezier curve contains two anchor points and one control point. The curve interpolates the two anchor points and bends to the control point.
         * @param controlX A number indicating the horizontal position of the control point, relative to the registration point of the parent display object.
         * @param controlY A number indicating the vertical position of the control point, relative to the registration point of the parent display object.
         * @param anchorX A number indicating the horizontal position of the next anchor point, relative to the registration point of the parent display object.
         * @param anchorY A number indicating the vertical position of the next anchor point, relative to the registration point of the parent display object.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 使用当前线条样式和由 (controlX, controlY) 指定的控制点绘制一条从当前绘图位置开始到 (anchorX, anchorY) 结束的二次贝塞尔曲线。当前绘图位置随后设置为 (anchorX, anchorY)。
         * 如果在调用 moveTo() 方法之前调用了 curveTo() 方法，则当前绘图位置的默认值为 (0, 0)。如果缺少任何一个参数，则此方法将失败，并且当前绘图位置不改变。
         * 绘制的曲线是二次贝塞尔曲线。二次贝塞尔曲线包含两个锚点和一个控制点。该曲线内插这两个锚点，并向控制点弯曲。
         * @param controlX 一个数字，指定控制点相对于父显示对象注册点的水平位置。
         * @param controlY 一个数字，指定控制点相对于父显示对象注册点的垂直位置。
         * @param anchorX 一个数字，指定下一个锚点相对于父显示对象注册点的水平位置。
         * @param anchorY 一个数字，指定下一个锚点相对于父显示对象注册点的垂直位置。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public curveTo(controlX: number, controlY: number, anchorX: number, anchorY: number): void {
            // let _controlX = this.offsetX + controlX || 0;
            // let _controlY = this.offsetY - controlY || 0;
            // let _anchorX = this.offsetX + anchorX || 0;
            // let _anchorY = this.offsetY - anchorY || 0;
            // this._BKCanvas.quadraticCurveTo(_controlX, _controlY, _anchorX, _anchorY)
            // // let fillPath = this.fillPath;
            // // let strokePath = this.strokePath;
            // // fillPath && fillPath.curveTo(controlX, controlY, anchorX, anchorY);
            // // strokePath && strokePath.curveTo(controlX, controlY, anchorX, anchorY);
            // this.extendBoundsByPoint(controlX, controlY);
            // this.extendBoundsByPoint(anchorX, anchorY);
            // this.updatePosition(anchorX, anchorY);
            // // this.$renderNode.dirtyRender = true;
        }

        /**
         * Draws a cubic Bezier curve from the current drawing position to the specified anchor. Cubic Bezier curves consist of two anchor points and two control points. The curve interpolates the two anchor points and two control points to the curve.
         * @param controlX1 Specifies the first control point relative to the registration point of the parent display the horizontal position of the object.
         * @param controlY1 Specifies the first control point relative to the registration point of the parent display the vertical position of the object.
         * @param controlX2 Specify the second control point relative to the registration point of the parent display the horizontal position of the object.
         * @param controlY2 Specify the second control point relative to the registration point of the parent display the vertical position of the object.
         * @param anchorX Specifies the anchor point relative to the registration point of the parent display the horizontal position of the object.
         * @param anchorY Specifies the anchor point relative to the registration point of the parent display the vertical position of the object.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从当前绘图位置到指定的锚点绘制一条三次贝塞尔曲线。三次贝塞尔曲线由两个锚点和两个控制点组成。该曲线内插这两个锚点，并向两个控制点弯曲。
         * @param controlX1 指定首个控制点相对于父显示对象的注册点的水平位置。
         * @param controlY1 指定首个控制点相对于父显示对象的注册点的垂直位置。
         * @param controlX2 指定第二个控制点相对于父显示对象的注册点的水平位置。
         * @param controlY2 指定第二个控制点相对于父显示对象的注册点的垂直位置。
         * @param anchorX 指定锚点相对于父显示对象的注册点的水平位置。
         * @param anchorY 指定锚点相对于父显示对象的注册点的垂直位置。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public cubicCurveTo(controlX1: number, controlY1: number, controlX2: number,
            controlY2: number, anchorX: number, anchorY: number): void {
            // let _controlX1 = this.offsetX + controlX1 || 0;
            // let _controlY1 = this.offsetY - controlY1 || 0;
            // let _controlX2 = this.offsetX + controlX2 || 0;
            // let _controlY2 = this.offsetY - controlY2 || 0;
            // let _anchorX = this.offsetX + anchorX || 0;
            // let _anchorY = this.offsetY - anchorY || 0;
            // this._BKCanvas.bezierCurveTo(_controlX1, _controlY1, _controlX2, _controlY2, _anchorX, _anchorY);
            // // let fillPath = this.fillPath;
            // // let strokePath = this.strokePath;
            // // fillPath && fillPath.cubicCurveTo(controlX1, controlY1, controlX2, controlY2, anchorX, anchorY);
            // // strokePath && strokePath.cubicCurveTo(controlX1, controlY1, controlX2, controlY2, anchorX, anchorY);
            // this.extendBoundsByPoint(controlX1, controlY1);
            // this.extendBoundsByPoint(controlX2, controlY2);
            // this.extendBoundsByPoint(anchorX, anchorY);
            // this.updatePosition(anchorX, anchorY);
            // // this.$renderNode.dirtyRender = true;
        }

        /**
         * adds an arc to the path which is centered at (x, y) position with radius r starting at startAngle and ending
         * at endAngle going in the given direction by anticlockwise (defaulting to clockwise).
         * @param x The x coordinate of the arc's center.
         * @param y The y coordinate of the arc's center.
         * @param radius The arc's radius.
         * @param startAngle The angle at which the arc starts, measured clockwise from the positive x axis and expressed in radians.
         * @param endAngle The angle at which the arc ends, measured clockwise from the positive x axis and expressed in radians.
         * @param anticlockwise if true, causes the arc to be drawn counter-clockwise between the two angles. By default it is drawn clockwise.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 绘制一段圆弧路径。圆弧路径的圆心在 (x, y) 位置，半径为 r ，根据anticlockwise （默认为顺时针）指定的方向从 startAngle 开始绘制，到 endAngle 结束。
         * @param x 圆弧中心（圆心）的 x 轴坐标。
         * @param y 圆弧中心（圆心）的 y 轴坐标。
         * @param radius 圆弧的半径。
         * @param startAngle 圆弧的起始点， x轴方向开始计算，单位以弧度表示。
         * @param endAngle 圆弧的终点， 单位以弧度表示。
         * @param anticlockwise 如果为 true，逆时针绘制圆弧，反之，顺时针绘制。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public drawArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void {

            // if (radius < 0 || startAngle === endAngle) {
            //     return;
            // }
            // let _x = this.offsetX + x || 0;
            // let _y = this.offsetY - y || 0;
            // radius = +radius || 0;
            // startAngle = +startAngle || 0;
            // endAngle = +endAngle || 0;
            // anticlockwise = !!anticlockwise;
            // let _startAngle = clampAngle(-endAngle);
            // let _endAngle = clampAngle(startAngle);



            // this._BKCanvas.arc(_x, _y, radius, _startAngle, _endAngle, anticlockwise);
            // if (this.isStrokePath && this.isFillPath) {
            //     this._BKCanvas.fill();
            //     this._BKCanvas.arc(_x, _y, radius, _startAngle, _endAngle, anticlockwise);
            //     this._BKCanvas.stroke();
            // }
            // let endX = x + Math.cos(endAngle) * radius;
            // let endY = y + Math.sin(endAngle) * radius;
            // this.updatePosition(endX, endY);
        }

        /**
         * Clear graphics that are drawn to this Graphics object, and reset fill and line style settings.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 清除绘制到此 Graphics 对象的图形，并重置填充和线条样式设置。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public clear(): void {
            // // this.$renderNode.clear();
            // this.updatePosition(0, 0);
            // this.minX = Infinity;
            // this.minY = Infinity;
            // this.maxX = -Infinity;
            // this.maxY = -Infinity;

            // this._BKCanvas.clearRect(0, 0, 2 * this.stageW, 2 * this.stageH);
            // this.isFillPath = false;
            // this.isStrokePath = false;
        }

        /**
         * @private
         */
        private minX: number = Infinity;
        /**
         * @private
         */
        private minY: number = Infinity;
        /**
         * @private
         */
        private maxX: number = -Infinity;
        /**
         * @private
         */
        private maxY: number = -Infinity;

        /**
         * @private
         */
        private extendBoundsByPoint(x: number, y: number): void {
            this.extendBoundsByX(x);
            this.extendBoundsByY(y);
        }

        /**
         * @private
         */
        private extendBoundsByX(x: number): void {
            this.minX = Math.min(this.minX, x - this.topLeftStrokeWidth);
            this.maxX = Math.max(this.maxX, x + this.bottomRightStrokeWidth);
            this.updateNodeBounds();
        }

        /**
         * @private
         */
        private extendBoundsByY(y: number): void {
            this.minY = Math.min(this.minY, y - this.topLeftStrokeWidth);
            this.maxY = Math.max(this.maxY, y + this.bottomRightStrokeWidth);
            this.updateNodeBounds();
        }

        /**
         * @private
         */
        private updateNodeBounds(): void {
            // let node = this.$renderNode;
            // node.x = this.minX;
            // node.y = this.minY;
            // node.width = Math.ceil(this.maxX - this.minX);
            // node.height = Math.ceil(this.maxY - this.minY);
        }

        /**
         * 是否已经包含上一次moveTo的坐标点
         */
        private includeLastPosition: boolean = true;

        /**
         * 更新当前的lineX和lineY值，并标记尺寸失效。
         * @private
         */
        private updatePosition(x: number, y: number): void {
            if (!this.includeLastPosition) {
                this.extendBoundsByPoint(this.lastX, this.lastY);
                this.includeLastPosition = true;
            }
            this.lastX = x;
            this.lastY = y;
            this.extendBoundsByPoint(x, y);
        }


        /**
         * @private
         */
        $measureContentBounds(bounds: Rectangle): void {
            if (this.minX === Infinity) {
                bounds.setEmpty();
            }
            else {
                bounds.setTo(this.minX, this.minY, this.maxX - this.minX, this.maxY - this.minY);
            }
        }

        /**
         * @private
         *
         */
        $hitTest(stageX: number, stageY: number): DisplayObject {
            // if (this._BKCanvas.hittest({ x: stageX, y: stageY })) {
            //     return this.targetDisplay;
            // }
            return null;
        }

        /**
         * @private
         */
        public $onRemoveFromStage(): void {
            // if (this.$renderNode) {
            //     this.$renderNode.clean();
            // }
        }
    }

    function clampAngle(value): number {
        value %= Math.PI * 2;
        if (value < 0) {
            value += Math.PI * 2;
        }
        return value;

    }

    egret.Graphics = BKGraphics as any;
}