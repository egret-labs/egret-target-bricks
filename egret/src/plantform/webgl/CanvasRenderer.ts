namespace egret {

    let CAPS_STYLES = { none: 'butt', square: 'square', round: 'round' };


    export class BKCanvasRenderer extends egret.CanvasRenderer {
        constructor() {
            super();
        }



        public renderText(node: sys.TextNode, context: any): void {
            context.textAlign = "left";
            context.textBaseLine = "middle";
            context.lineJoin = "round";//确保描边样式是圆角
            let drawData = node.drawData;
            let length = drawData.length;
            let pos = 0;
            while (pos < length) {
                const x = drawData[pos++];
                const y = drawData[pos++];
                const text = drawData[pos++];
                const format: sys.TextFormat = drawData[pos++];
                const size = format.size == null ? node.size : format.size;
                context.setTextSize(size);
                // context.font = getFontString(node, format);
                const textColor = format.textColor == null ? node.textColor : format.textColor;
                const strokeColor = format.strokeColor == null ? node.strokeColor : format.strokeColor;
                const stroke = format.stroke == null ? node.stroke : format.stroke;
                const textColorstr = refitColorString(textColor, 6);//六位rgb格式
                const fill_red: number = parseInt(textColorstr.substring(0, 2), 16) / 255;
                const fill_green: number = parseInt(textColorstr.substring(2, 4), 16) / 255;
                const fill_blue: number = parseInt(textColorstr.substring(4, 6), 16) / 255;
                const strokeColorstr = refitColorString(strokeColor, 6);//六位rgb格式
                const stroke_red: number = parseInt(strokeColorstr.substring(0, 2), 16) / 255;
                const stroke_green: number = parseInt(strokeColorstr.substring(2, 4), 16) / 255;
                const stroke_blue: number = parseInt(strokeColorstr.substring(4, 6), 16) / 255;
                context.fillColor = { r: fill_red, g: fill_green, b: fill_blue, a: 1 };
                context.strokeColor = { r: stroke_red, g: stroke_green, b: stroke_blue, a: 1 };
                //ttf字体加载。默认传入为相对根目录的地址
                let fontFamily = format.fontFamily == null ? node.fontFamily : format.fontFamily;
                if (fontFamily && fontFamily !== 'Arial') {
                    let path = "GameRes://" + fontFamily;
                    if (BK.FileUtil.isFileExist(path)) {
                        context.fontPath = path;
                    }else{
                        context.fontPath = null;
                        console.log('字体'+path+"不存在，请确保fontFamily传入字体地址正确");
                    }
                }
                if (stroke) {
                    context.lineWidth = stroke * 2;
                } else {
                    context.lineWidth = 0;
                }
                //斜体与加粗
                const bold = format.bold == null ? node.bold : format.bold;
                const italic = format.italic = null ? node.italic : format.italic;
                context.setTextBold(bold);
                context.setTextItalic(italic);
                //BK error
                context.fillText(text, x + context.$offsetX, -y + context.$offsetY + node.height - size / 2 - 4);
            }
        }

        private _renderingMask = false;

        public renderGraphics(node: sys.GraphicsNode, context: any, forHitTest?: boolean): number {
            let drawData = node.drawData;
            let length = drawData.length;
            forHitTest = !!forHitTest;
            for (let i = 0; i < length; i++) {
                let path: sys.Path2D = drawData[i];
                switch (path.type) {
                    case sys.PathType.Fill:
                        let fillPath = <sys.FillPath>path;
                        // context.fillStyle = forHitTest ? BLACK_COLOR : getRGBAString(fillPath.fillColor, fillPath.fillAlpha);
                        let fill_str = refitColorString(fillPath.fillColor, 6);
                        let fill_red: number = parseInt(fill_str.substring(0, 2), 16) / 255;
                        let fill_green: number = parseInt(fill_str.substring(2, 4), 16) / 255;
                        let fill_blue: number = parseInt(fill_str.substring(4, 6), 16) / 255;

                        //MD
                        //BK通过drawStyle确定是fill还是stroke，0为fill，1为stroke
                        context.fillColor = { r: fill_red, g: fill_green, b: fill_blue, a: fillPath.fillAlpha };

                        context.drawStyle = 0;
                        this._renderPath(path, context);
                        if (this._renderingMask) {
                            context.clip();
                        }
                        else {
                            context.fill();
                        }
                        break;
                    case sys.PathType.GradientFill:
                        let g = <sys.GradientFillPath>path;
                        // context.fillStyle = forHitTest ? BLACK_COLOR : getGradient(context, g.gradientType, g.colors, g.alphas, g.ratios, g.matrix);
                        context.save();
                        let m = g.matrix;
                        context.drawStyle = 0;
                        this._renderPath(path, context);
                        context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                        context.fill();
                        context.restore();
                        break;
                    case sys.PathType.Stroke:
                        let strokeFill = <sys.StrokePath>path;
                        let lineWidth = strokeFill.lineWidth;
                        context.lineWidth = lineWidth;
                        // context.strokeStyle = forHitTest ? BLACK_COLOR : getRGBAString(strokeFill.lineColor, strokeFill.lineAlpha);
                        let stroke_str = refitColorString(strokeFill.lineColor, 6);
                        let stroke_red: number = parseInt(stroke_str.substring(0, 2), 16) / 255;
                        let stroke_green: number = parseInt(stroke_str.substring(2, 4), 16) / 255;
                        let stroke_blue: number = parseInt(stroke_str.substring(4, 6), 16) / 255;
                        context.strokeColor = { r: stroke_red, g: stroke_green, b: stroke_blue, a: strokeFill.lineAlpha };
                        context.drawStyle = 1;
                        context.lineCap = CAPS_STYLES[strokeFill.caps];
                        context.lineJoin = strokeFill.joints;
                        context.miterLimit = strokeFill.miterLimit;
                        if (context.setLineDash) {
                            context.setLineDash(strokeFill.lineDash);
                        }
                        //对1像素和3像素特殊处理，向右下角偏移0.5像素，以显示清晰锐利的线条。
                        let isSpecialCaseWidth = lineWidth === 1 || lineWidth === 3;
                        if (isSpecialCaseWidth) {
                            context.translate(0.5, 0.5);
                        }
                        context.drawStyle = 1;
                        this._renderPath(path, context);
                        context.stroke();
                        if (isSpecialCaseWidth) {
                            context.translate(-0.5, -0.5);
                        }
                        break;
                }
            }
            return length == 0 ? 0 : 1;
        }


        private _renderPath(path: sys.Path2D, context: CanvasRenderingContext2D): void {
            context.beginPath();
            let data = path.$data;
            let commands = path.$commands;
            let commandCount = commands.length;
            let pos = 0;
            for (let commandIndex = 0; commandIndex < commandCount; commandIndex++) {
                let command = commands[commandIndex];
                switch (command) {
                    case sys.PathCommand.CubicCurveTo:
                        context.bezierCurveTo(data[pos++] + context.$offsetX, data[pos++] + context.$offsetY, data[pos++] + context.$offsetX, data[pos++] + context.$offsetY, data[pos++] + context.$offsetX, data[pos++] + context.$offsetY);
                        break;
                    case sys.PathCommand.CurveTo:
                        context.quadraticCurveTo(data[pos++] + context.$offsetX, data[pos++] + context.$offsetY, data[pos++] + context.$offsetX, data[pos++] + context.$offsetY);
                        break;
                    case sys.PathCommand.LineTo:
                        context.lineTo(data[pos++] + context.$offsetX, data[pos++] + context.$offsetY);
                        break;
                    case sys.PathCommand.MoveTo:
                        context.moveTo(data[pos++] + context.$offsetX, data[pos++] + context.$offsetY);
                        break;
                }
            }
        }



        public drawNodeToBuffer(node: sys.RenderNode, buffer: sys.RenderBuffer, matrix: Matrix, forHitTest?: boolean): void {
            let context: any = buffer.context;
            context.transforms(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
            this.renderNode(node, context, forHitTest);
        }

        private renderNode(node: sys.RenderNode, context: CanvasRenderingContext2D, forHitTest?: boolean): number {
            let drawCalls = 0;
            // switch (node.type) {
            //     case sys.RenderNodeType.BitmapNode:
            //         drawCalls = this.renderBitmap(<sys.BitmapNode>node, context);
            //         break;
            //     case sys.RenderNodeType.TextNode:
            //         drawCalls = 1;
            //         this.renderText(<sys.TextNode>node, context);
            //         break;
            //     case sys.RenderNodeType.GraphicsNode:
            if (node.type == sys.RenderNodeType.GraphicsNode) {
                drawCalls = this.renderGraphics(<sys.GraphicsNode>node, context, forHitTest);
            } else {
                throw error('CanvasRenderer  renderNode 使用了未知的node类型');
            }
            // break;
            //     case sys.RenderNodeType.GroupNode:
            //         drawCalls = this.renderGroup(<sys.GroupNode>node, context);
            //         break;
            //     case sys.RenderNodeType.MeshNode:
            //         drawCalls = this.renderMesh(<sys.MeshNode>node, context);
            //         break;
            //     case sys.RenderNodeType.NormalBitmapNode:
            //         drawCalls += this.renderNormalBitmap(<sys.NormalBitmapNode>node, context);
            //         break;
            // }
            return drawCalls;
        }

    }










    //     /**
    //  * @private
    //  * 获取字体字符串
    //  */
    //     export function getFontString(node: sys.TextNode, format: sys.TextFormat): string {
    //         let italic: boolean = format.italic == null ? node.italic : format.italic;
    //         let bold: boolean = format.bold == null ? node.bold : format.bold;
    //         let size: number = format.size == null ? node.size : format.size;
    //         let fontFamily: string = format.fontFamily || node.fontFamily;
    //         let font: string = italic ? "italic " : "normal ";
    //         font += bold ? "bold " : "normal ";
    //         font += size + "px " + fontFamily;
    //         return font;
    //     }
    // export function getAlign(align_str:string){
    //     if(align)
    // }

    /**
      * 为16进制数字补0，输出字符串
      */
    export function refitColorString(num: number, length: number): string {
        let str = num.toString(16);
        let zero = "00000000";
        return zero.substr(0, length - str.length) + str;
    }

    if (window['renderMode'] == 'webgl') {
        egret.CanvasRenderer = BKCanvasRenderer as any;
    }
}