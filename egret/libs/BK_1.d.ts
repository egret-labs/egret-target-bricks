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
    }

    export class Audio {
        /**
         * @param type 音乐类型，0表示背景音乐，1表示效果音乐。
         * @param musicPath 音乐路径。
         * @param loop 重复次数，-1为循环播放
         */
        constructor(type: number, musicPath: string, loop: number);

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
}