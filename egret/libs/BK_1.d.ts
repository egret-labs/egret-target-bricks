declare namespace BK {


    export interface TouchEventInfo {
        id: number;
        x: number;
        y: number;
        /**
         * 点击态
         * 1.点击抬起
         * 2.点击中
         * 3.移动中
         */
        status: number;
    }

    /**
     * 每次手指点击时，都会产生于手指数量相同的触控对象，其中保存了当前手指的id位置，点击态等信息。
     * 接受触控的流程：
     * 1.调用getTouchEvent获取触控点数组。
     * 2.处理触摸事件
     * 3.调用updateTouchStatus更新触控点
     * 
     * 需注意:确保全局仅有一处地方使用getTouchEvent获取点击事件。
     * 同一时间内获取多次会导致触摸事件混乱。
     */
    export class TouchEvent {

        /**
         * 获取触摸事件
         * @return {TouchEventInfo}
         */
        static getTouchEvent(): TouchEventInfo[];

        /**
         * 更新触摸事件。调用getTouchEvent之后必须调用该方法。
         */
        static updateTouchStatus();
    }

    /**
     * 图集
     * 
     * @class SpriteSheetCache
     */
    // export class SpriteSheetCache {
    //     /**
    //      * 根据图集文件中小图名称，获取小图的位置信息和纹理对象
    //      * 
    //      * @param {string} filename 
    //      * @returns {SheetTextureInfo} 
    //      * @memberof SpriteSheetCache
    //      */
    //     static getTextureFrameInfoByFileName(filename: string): SheetTextureInfo;
    // }

    export namespace SpriteSheetCache {

        function getTextureFrameInfoByFileName(filename: string): SheetTextureInfo;

        /**
 * 根据图集文件中小图名称，获取小图的位置信息和纹理对象
 * 
 * @param {string} filename 
 * @returns {SheetTextureInfo} 
 * @memberof SpriteSheetCache
 */
        function getTextureFrameInfoByFileName(filename: string): SheetTextureInfo;

        /**
         * 根据图集文件中小图名称，获取纹理路径名称
         * 
         * @param {string} filename 
         * @returns {string} 
         * @memberof SpriteSheetCache
         */
        function getTexturePathByFilename(filename: string): string;

        /**
         * 根据小图名称创建一个精灵
         * 
         * @param {string} filename 小图名称
         * @param {number} width 精灵的宽
         * @param {number} height 精灵的高
         * @returns {BK.Sprite} 
         * @memberof SpriteSheetCache
         */
        function getSprite(filename: string, width?: number, height?: number): BK.Sprite;
    }

    /**
     * 帧动画
     * 
     * @class AnimatedSprite
     */
    export interface AnimatedSprite extends Sprite {
        /**
         * 
         * @param textureInfoArr 
         */
        constructor(textureInfoArr: Array<BK.SheetTextureInfo>);

        /**
         * 
         * @param completeCallback 
         */
        setCompleteCallback(completeCallback: (animatedSprite: AnimatedSprite, count: number) => void);

        /**
         * 每一帧的持续时间，以秒为单位。默认1/30秒；
         */
        delayUnits: number;

        /**
         * 暂停。
         * true为暂停，false运行
         */
        paused: boolean;

        /**
         * 开始播放
         * @param beginFrameIndex 开始播放的帧数(选填，默认为0)
         * @param repeatCount 播放次数（选填，默认为-1.代表无限循环）
         */
        play(beginFrameIndex: number, repeatCount: number);

        /**
         * 结束播放
         * @param frameIdx 停止播放时显示的帧(选填，默认为-1.随机选取一帧最后显示)
         */
        stop(frameIdx: number);
    }

    /**
     * 蒙版节点
     */
    export class ClipNode extends BK.Sprite {
        /**
         * 默认为false。true时，取alpha 0～alphaThreshold 值，false时取alphaThreashold-1值
         */
        inverted: boolean;

        /**
         * 裁剪透明度的阀值
         */
        alphaThreshold: number;

        constructor(stencilSp: BK.Sprite);

        addChild(sprite: BK.Sprite);
    }

    export class ClipRectNode extends BK.Node {
        /**
         * 裁切区域
         *
         */
        clipRegion: { x: number, y: number, width: number, height: number };

        /**
         * 是否开启裁切，默认为true
         */
        enableClip: boolean;

        constructor(x: number, y: number, width: number, height: number);
    }

    export interface SpriteSheetCache {
        /**
         * 根据图集文件中某个文件的名字获取sprite
         */
        getSprite(name: string, width?: number, height?: number)
    }


    export class HttpUtil {

        constructor(path: string);
        setHttpMethod(mothod: string): void;
        setHttpCookie(data: any): void;
        requestAsync(callback: Function): void;
        setHttpPostData(data: string);
    }

    export class Audio {
        /**
         * @param type 音乐类型，0表示背景音乐，1表示效果音乐。
         * @param musicPath 音乐路径。
         * @param loop 重复次数，-1为循环播放
         */
        constructor(type: number, musicPath: string, loop: number, num: number);

        static switch: boolean;
        /**
         * 开始播放
         */
        startMusic();

        /**
         * 暂停
         */
        pauseMusic();

        /**
         * 继续播放
         */
        resumeMusic();

        /**
         * 停止播放
         */
        stopMusic();
    }

    export class Canvas extends BK.Node {
        /**
         * @param width 宽
         * @param height 高
         */
        constructor(width: number, height: number);

        /**
         * 背景颜色
         */
        backgroundColor: { r: number, g: number, b: number, a: number };

        /**
         * 使用h5坐标系(若不开启，默认使用左下角坐标系)
         */
        useH5Mode()
        /**
         * 设置canvas alpha
         */
        globalAlpha: number;

        /**
         * 设置绘制线条宽度
         */
        lineWidth: number;

        lineJoin: number;

        lineCap: number;

        /**
         * 指定颜色填充
         */
        fillColor: { r: number, g: number, b: number, a: number };

        /**
         * 绘制一个园
         */
        drawCircle(x: number, y: number, radius: number);

        /**
         * 结束图形绘制，对上一次调用绘制之后添加的图形进行应用
         */
        fill();
        /**
         * 指定描边颜色填充
         */
        strokeColor: { r: number, g: number, b: number, a: number };

        /**
         * 结束描边绘制，对上一次调用绘制之后添加的图形进行应用
         */
        stroke()
        /**
         * 绘制一个椭圆
         */
        drawEllipse(x: number, y: number, width: number, height: number);

        /**
         * 绘制弧线
         */
        arc(x: number, y: number, radius: number, sAngle: number, eAngle: number, counterclockwise: boolean)

        /**
         * 绘制介于两条直线的弧
         */
        arcTo(x1: number, y1: number, x2: number, y2: number, r: number)
        /**
         * 将当前绘图位置移动到(x,y);
         */
        moveTo(x: number, y: number);

        /**
         * 绘制一个矩形边框
         */
        strokeRect(x: number, y: number, width: number, height: number);

        /**
         * 绘制一个矩形边框
         */
        fillRect(x: number, y: number, width: number, height: number);

        /**
         * 绘制图片
         * @param path 图片地址,形如:"GameRes://resource/texture/icon.png"
         * @param stretchW 横向拉伸，不拉伸为0
         * @param stretchH 纵向拉伸，不拉伸为0
         * @param pixelW 图片取贴图的像素宽
         * @param pixelH 图片取贴图的像素高
         * @param x 水平位置
         * @param y 垂直位置
         * @param width 图片宽度
         * @param height 图片高度
         * param 
         */
        drawImage(path: string, stretchW: number, stretchH: number, pixelW: number, pixelH: number, x: number, y: number, width: number, height: number)


        /**
         * 开始绘制线
         */
        beginPath();

        /**
         * 使用当前线条从当前位置绘制到(x,y)
         */
        lineTo(x: number, y: number);

        /**
         * 结束当前线的绘制
         */
        closePath();

        /**
         * 使用当前线条样式和由 (controlX, controlY) 指定的控制点绘制一条从当前绘图位置开始到 (anchorX, anchorY) 结束的二次贝塞尔曲线。当前绘图位置随后设置为 (anchorX, anchorY)
         * @param controlX 一个数字，指定控制点相对于父显示对象注册点的水平位置。
         * @param controlY 一个数字，指定控制点相对于父显示对象注册点的垂直位置。
         * @param anchorX 一个数字，指定下一个锚点相对于父显示对象注册点的水平位置。
         * @param anchorY 一个数字，指定下一个锚点相对于父显示对象注册点的垂直位置。
         */
        quadraticCurveTo(controlX: number, controlY: number, anchorX: number, anchorY: number);

        /**
         * 从当前绘图位置到指定的锚点绘制一条三次贝塞尔曲线。三次贝塞尔曲线由两个锚点和两个控制点组成。该曲线内插这两个锚点，并向两个控制点弯曲
         * @param controlX1 指定首个控制点相对于父显示对象的注册点的水平位置。
         * @param controlY1 指定首个控制点相对于父显示对象的注册点的垂直位置。
         * @param controlX2 指定第二个控制点相对于父显示对象的注册点的水平位置。
         * @param controlY2 指定第二个控制点相对于父显示对象的注册点的垂直位置。
         * @param anchorX 指定锚点相对于父显示对象的注册点的水平位置。
         * @param anchorY 指定锚点相对于父显示对象的注册点的垂直位置。
         */
        bezierCurveTo(controlX1: number, controlY1: number, controlX2: number,
            controlY2: number, anchorX: number, anchorY: number);

        /**
         * 字体
         * 
         */
        font: any;
        //字体的具体构成
        // var style = {
        //     "fontSize":20,
        //     "textColor" : 0xFFFF0000,
        //     "maxWidth" : 200,
        //     "maxHeight": 400,
        //     "width":100,
        //     "height":200,
        //     "textAlign":0,
        //     "bold":1,
        //     "italic":1,
        //     "strokeColor":0xFF000000,
        //     "strokeSize":5,
        //     "shadowRadius":5,
        //     "shadowDx":10,
        //     "shadowDy":10,
        //     "shadowColor":0xFFFF0000
        // }

        /**
         * 绘制文字
         */
        fillText(content: string, x: number, y: number);

        /**
         * 清除绘制区域
         */
        clearRect(x: number, y: number, width: number, height: number);

        //测量文本范围
        measureText(text: string, maxX: number, maxY: number): { width: number, height: number };

        //文本基线
        textBaseLine: string;

        //文本对齐方式
        textAlign: string;

        //字体地址
        fontPath: string;

        //设置文本对齐方式
        setTextAlign(type: number);

        //设置文本字号
        setTextSize(size: number)

        //设置加粗
        setTextBold(bold: boolean);

        //设置斜体
        setTextItalic(italic: boolean);

        //宽高属性
        size: { width: number, height: number };
    }

    export class Image {
        /**
         * 根据地址获取图片资源
         * 第二个参数为format
         * COLOR_RGBA8888 = 6
         */
        static loadImage(path: string, format?: number)
    }

    export interface Sprite {
        contentSize;
    }

}