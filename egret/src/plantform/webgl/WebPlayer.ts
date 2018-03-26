/**
 * 将原player与Webplayer和为一体
 */
namespace egret.web {
    /**
     * @private
     */
    export class BKWebPlayer extends egret.HashObject implements egret.sys.Screen {

        public constructor(options: runEgretOptions) {
            super();
            this.init(options);
            // this.initOrientation();
        }

        private init(options: runEgretOptions): void {
            let option = this.readOption(options);
            let stage = new egret.Stage();
            stage.$screen = this;
            stage.$scaleMode = option.scaleMode;
            stage.$orientation = option.orientation;
            stage.$maxTouches = option.maxTouches;
            stage.frameRate = option.frameRate;
            stage.textureScaleFactor = option.textureScaleFactor;

            let buffer = new sys.RenderBuffer(undefined, undefined, true);
            // let canvas = <HTMLCanvasElement>buffer.surface;
            // this.attachCanvas(container, canvas);

            // let webTouch = new WebTouchHandler(stage, canvas);
            // let player = new egret.sys.Player(buffer, stage, option.entryClassName);

            lifecycle.stage = stage;
            // lifecycle.addLifecycleListener(WebLifeCycleHandler);

            // let webInput = new HTMLInput();

            // if (option.showFPS || option.showLog) {
            //     if (!egret.nativeRender) {
            //         player.displayFPS(option.showFPS, option.showLog, option.logFilter, option.fpsStyles);
            //     }
            // }
            this.playerOption = option;
            // this.container = container;
            // this.canvas = canvas;
            this.stage = stage;
            this._touches = new sys.TouchHandler(this.stage);
            // this.player = player;
            // this.webTouchHandler = webTouch;

            //原player内容
            //
            this._entryClassName = option.entryClassName;
            this.screenDisplayList = this.createDisplayList(stage, buffer)


            // this.webInput = webInput;

            // egret.web.$cacheTextAdapter(webInput, stage, container, canvas);

            this.updateScreenSize();
            this.updateMaxTouches();

            this.start();
            // player.start();
        }

        // private initOrientation(): void {
        //     let self = this;
        //     window.addEventListener("orientationchange", function () {
        //         window.setTimeout(function () {
        //             egret.StageOrientationEvent.dispatchStageOrientationEvent(self.stage, StageOrientationEvent.ORIENTATION_CHANGE);
        //         }, 350);
        //     });
        // }

        /**
         * 读取初始化参数
         */
        private readOption(options: runEgretOptions): PlayerOption {
            let option: PlayerOption = {};
            option.entryClassName = options.entryClassName;
            option.scaleMode = options.scaleMode || egret.StageScaleMode.NO_SCALE;
            option.frameRate = +options.frameRate || 30;
            option.contentWidth = +options.contentWidth || 480;
            option.contentHeight = +options.contentHeight || 800;
            option.orientation = options.orientation || egret.OrientationMode.AUTO;
            option.maxTouches = 10;
            option.textureScaleFactor = 1;
            // option.textureScaleFactor = +container.getAttribute("texture-scale-factor") || 1;

            // option.showFPS = container.getAttribute("data-show-fps") == "true";

            // let styleStr = container.getAttribute("data-show-fps-style") || "";
            // let stylesArr = styleStr.split(",");
            // let styles = {};
            // for (let i = 0; i < stylesArr.length; i++) {
            //     let tempStyleArr = stylesArr[i].split(":");
            //     styles[tempStyleArr[0]] = tempStyleArr[1];
            // }
            // option.fpsStyles = styles;

            // option.showLog = container.getAttribute("data-show-log") == "true";
            // option.logFilter = container.getAttribute("data-log-filter");
            return option;
        }


        /**
         * @private
         */
        private createDisplayList(stage: Stage, buffer: egret.sys.RenderBuffer): egret.sys.DisplayList {
            let displayList: any = new egret.sys.BKDisplayList(stage);
            displayList.renderBuffer = buffer;
            stage.$displayList = displayList;
            //displayList.setClipRect(stage.$stageWidth, stage.$stageHeight);
            return displayList;
        }


        // /**
        //  * @private
        //  * 添加canvas到container。
        //  */
        // private attachCanvas(container: HTMLElement, canvas: HTMLCanvasElement): void {

        //     let style = canvas.style;
        //     style.cursor = "inherit";
        //     style.position = "absolute";
        //     style.top = "0";
        //     style.bottom = "0";
        //     style.left = "0";
        //     style.right = "0";
        //     container.appendChild(canvas);
        //     style = container.style;
        //     style.overflow = "hidden";
        //     style.position = "absolute";
        // }

        private playerOption: PlayerOption;

        // /**
        //  * @private
        //  * 画布实例
        //  */
        // private canvas: HTMLCanvasElement;
        // /**
        //  * @private
        //  * 播放器容器实例
        //  */
        // private container: HTMLElement;

        /**
         * @private
         * 舞台引用
         */
        public stage: Stage;

        // private webTouchHandler: WebTouchHandler;
        private _touches: sys.TouchHandler;
        // private webInput: egret.web.HTMLInput;

        private readonly _mainTicker: BK.MainTicker = BK.Director.ticker;
        private _entryClassName: string;
        private screenDisplayList: egret.sys.DisplayList;
        /**
         * @private
         * 更新播放器视口尺寸
         */
        public updateScreenSize(): void {
            const screenPixelSize = BK.Director.screenPixelSize;
            let screenWidth: number = screenPixelSize.width;
            let screenHeight: number = screenPixelSize.height;
            Capabilities.$boundingClientWidth = screenWidth;
            Capabilities.$boundingClientHeight = screenHeight;
            let stageSize: sys.StageDisplaySize = egret.sys.screenAdapter.calculateStageSize(
                this.stage.$scaleMode,
                screenWidth, screenHeight,
                this.playerOption.contentWidth, this.playerOption.contentHeight
            );
            let stageWidth: number = stageSize.stageWidth;
            let stageHeight: number = stageSize.stageHeight;
            let displayWidth: number = stageSize.displayWidth;
            let displayHeight: number = stageSize.displayHeight;

            let top: number = (screenHeight - displayHeight) / 2;
            let left: number = (screenWidth - displayWidth) / 2;
            this.stage.$stageWidth = stageWidth;
            this.stage.$stageHeight = stageHeight;
            // BK.Director.root.position = { x: left, y: BK.Director.screenPixelSize.height - top };
            // BK.Director.root.scale = { x: displayWidth / stageWidth, y: displayHeight / stageHeight };
            // this._root.scale = { x: displayWidth / stageWidth, y: displayHeight / stageHeight };
            // this._viewRect.setTo(left, top, stageWidth, stageHeight);
            // BK.Director.renderSize = { width: stageWidth, height: stageHeight }; // can not work
            let scalex = displayWidth / stageWidth,
                scaley = displayHeight / stageHeight;
            let canvasScaleX = scalex * sys.DisplayList.$canvasScaleFactor;
            let canvasScaleY = scaley * sys.DisplayList.$canvasScaleFactor;
            sys.DisplayList.$setCanvasScale(canvasScaleX, canvasScaleY);
            this.updateStageSize(stageWidth, stageHeight);            
            // this.webTouchHandler.updateScaleMode(scalex, scaley, rotation);
            // this.webInput.$updateSize();
            // this.player.updateStageSize(stageWidth, stageHeight);

            // // todo
            // if(egret.nativeRender) {
            //     canvas.width = stageWidth * canvasScaleX;
            //     canvas.height = stageHeight * canvasScaleY;
            // }
        }

        public updateStageSize(stageWidth: number, stageHeight: number): void {
            let stage = this.stage;
            stage.$stageWidth = stageWidth;
            stage.$stageHeight = stageHeight;

            this.screenDisplayList.setClipRect(stageWidth, stageHeight);
            // if (this.stageDisplayList) {
            //     this.stageDisplayList.setClipRect(stageWidth, stageHeight);
            // }

            stage.dispatchEventWith(Event.RESIZE);
        }

        public setContentSize(width: number, height: number): void {
            let option = this.playerOption;
            option.contentWidth = width;
            option.contentHeight = height;
            this.updateScreenSize();
        }

        /**
         * @private
         * 更新触摸数量
         */
        public updateMaxTouches() {
            this._touches.$initMaxTouches();
        }

        public start() {


            let entryClassName = this._entryClassName;
            let rootClass: any;
            if (entryClassName) {
                rootClass = egret.getDefinitionByName(entryClassName);
            }
            if (rootClass) {
                let rootContainer: any = new rootClass();
                if (rootContainer instanceof egret.DisplayObject) {
                    this.stage.addChild(rootContainer);
                }
                else {
                    DEBUG && $error(1002, entryClassName);
                }
            }
            else {
                DEBUG && $error(1001, entryClassName);
            }

            ticker.$addPlayer(this as any);
        }


        /**
         * @private
         * 渲染屏幕
         */
        $render(triggerByFrame: boolean, costTicker: number): void {

            // if (this.showFPS || this.showLog) {
            //     this.stage.addChild(this.fps);
            // }
            let stage = this.stage;
            // let t1 = egret.getTimer();
            let drawCalls = stage.$displayList.drawToSurface();
            // let t2 = egret.getTimer();
            // if (triggerByFrame && this.showFPS) {
            //     this.fps.update(drawCalls, t2 - t1, costTicker);
            // }
        }
    }


}
