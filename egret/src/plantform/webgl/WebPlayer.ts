/**
 * 将原player与Webplayer和为一体
 */
namespace egret.web {
    /**
     * @private
     */
    export class BKWebPlayer extends egret.HashObject implements egret.sys.Screen {
        public static _viewRect: Rectangle = new egret.Rectangle();

        public constructor(options: BKRunEgretOptions) {
            super();
            this.init(options);
        }

        private init(options: BKRunEgretOptions): void {
            let option = this.readOption(options);
            let stage = new egret.Stage();
            stage.$screen = this;
            stage.$scaleMode = option.scaleMode;
            stage.$orientation = option.orientation;
            stage.$maxTouches = option.maxTouches;
            stage.frameRate = option.frameRate;
            stage.textureScaleFactor = option.textureScaleFactor;

            let buffer = new sys.RenderBuffer(undefined, undefined, true);
            lifecycle.stage = stage;
            this.playerOption = option;
            this.stage = stage;
            sys.$TempStage = this.stage;
            this._touches = new sys.TouchHandler(this.stage);

            BK.Director.ticker.add((ts, duration) => {
                this._touchHandler();
            });
            this._entryClassName = option.entryClassName;
            this.showFPS = option.showFPS;
            this.totalTick = 0;
            this.totalTime = 0;
            this.lastTime = 0;
            this.drawCalls = 0;
            this.costRender = 0;
            this.costTicker = 0;


            if (egret.FPSDisplay) {
                fpsDisplay = new egret.FPSDisplay(stage, this.showFPS, false, null, null);
            }

            this.screenDisplayList = this.createDisplayList(stage, buffer)
            this.updateScreenSize();
            this.updateMaxTouches();
            this.start();
        }



        /**
         * 触摸处理器
         */
        private _touchHandler(): void {
            const touchEvents = BK.TouchEvent.getTouchEvent();
            if (!touchEvents || touchEvents.length === 0) {
                return;
            }
            const screenH = BK.Director.screenPixelSize.height;
            const canvasScaleX = egret.sys.DisplayList.$canvasScaleX;
            const canvasScaleY = egret.sys.DisplayList.$canvasScaleY;
            for (const touchEvent of touchEvents) {
                const touchID = touchEvent.id;
                const screenPixelSize = BK.Director.screenPixelSize;
                const touchPosition = BK.Director.root.convertToNodeSpace(touchEvent);

                const touchX = touchPosition.x / canvasScaleX;
                const touchY = (screenH - touchPosition.y - BKWebPlayer._viewRect.y) / canvasScaleY;

                if (touchEvent.status === 1) {
                    this._touches.onTouchEnd(touchX, touchY, touchID);
                } else if (touchEvent.status === 2) {
                    this._touches.onTouchBegin(touchX, touchY, touchID);
                } else if (touchEvent.status === 3) {
                    this._touches.onTouchMove(touchX, touchY, touchID);
                }
            }

            BK.TouchEvent.updateTouchStatus();
        }

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
            option.showFPS = options['showFPS'];
            return option;
        }


        /**
         * @private
         */
        private createDisplayList(stage: Stage, buffer: egret.sys.RenderBuffer): egret.sys.DisplayList {
            let displayList: any = new egret.sys.BKDisplayList(stage);
            displayList.renderBuffer = buffer;
            stage.$displayList = displayList;
            return displayList;
        }


        private playerOption: PlayerOption;
        /**
         * @private
         * 舞台引用
         */
        public stage: Stage;
        private _touches: sys.TouchHandler;


        private readonly _mainTicker: BK.MainTicker = BK.Director.ticker;
        private _entryClassName: string;
        private screenDisplayList: egret.sys.DisplayList;
        /**
         * @private
         * 更新播放器视口尺寸
         */
        public updateScreenSize(): void {

            let orientation = this.stage.$orientation;
            if (orientation == egret.OrientationMode.AUTO || orientation == egret.OrientationMode.PORTRAIT) {
                BK.Director.screenMode = BK_SCREEN_MODE.OrientationPortrait
            } else if (orientation == egret.OrientationMode.LANDSCAPE) {
                BK.Director.screenMode = BK_SCREEN_MODE.OrientationLandscapeRight;
            } else if (orientation == egret.OrientationMode.LANDSCAPE_FLIPPED) {
                BK.Director.screenMode = BK_SCREEN_MODE.OrientationLandscapeLeft;

            }

            const screenPixelSize = BK.Director.screenPixelSize;
            let screenWidth: number = screenPixelSize.width;
            let screenHeight: number = screenPixelSize.height;
            Capabilities['$boundingClientWidth'] = screenWidth;
            Capabilities['$boundingClientHeight'] = screenHeight;
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
            let scalex = displayWidth / stageWidth,
                scaley = displayHeight / stageHeight;

            BKWebPlayer._viewRect.setTo(left, top, stageWidth, stageHeight);
            let canvasScaleX = scalex * sys.DisplayList.$canvasScaleFactor;
            let canvasScaleY = scaley * sys.DisplayList.$canvasScaleFactor;
            sys.DisplayList.$setCanvasScale(canvasScaleX, canvasScaleY);
            this.updateStageSize(stageWidth, stageHeight);
        }

        public updateStageSize(stageWidth: number, stageHeight: number): void {
            let stage = this.stage;
            stage.$stageWidth = stageWidth;
            stage.$stageHeight = stageHeight;

            this.screenDisplayList.setClipRect(stageWidth, stageHeight);
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

            //获取主类，加入场景
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
                rootClass = global.Main;
                if (rootClass) {
                    let rootContainer: any = new rootClass();
                    if (rootContainer.addChild) {
                        this.stage.addChild(rootContainer);
                    }
                    else {
                        DEBUG && $error(1002, entryClassName);
                    }
                } else {
                    DEBUG && $error(1001, entryClassName);
                }
            }


            ticker.$addPlayer(this as any);
        }


        private showFPS: boolean;

        private totalTick: number;
        private lastTime: number;
        private totalTime: number;
        private drawCalls: number;
        private costRender: number;
        private costTicker: number;

        /**
         * @private
         * 渲染屏幕
         */
        $render(triggerByFrame: boolean, costTicker: number): void {
            let stage = this.stage;
            let t1 = egret.getTimer();
            let drawCalls = stage.$displayList.drawToSurface();
            let t2 = egret.getTimer();

            if (triggerByFrame && this.showFPS && fpsDisplay) {
                let costRender = t2 - t1;
                let current = egret.getTimer();
                this.totalTime += current - this.lastTime;
                this.lastTime = current;
                this.totalTick++;
                this.drawCalls += drawCalls;
                this.costRender += costRender;
                this.costTicker += costTicker;
                if (this.totalTime >= 1000) {
                    let lastFPS = Math.min(Math.ceil(this.totalTick * 1000 / this.totalTime), ticker.$frameRate);
                    let lastDrawCalls = Math.round(this.drawCalls / this.totalTick);
                    let lastCostRedner = Math.round(this.costRender / this.totalTick);
                    let lastCostTicker = Math.round(this.costTicker / this.totalTick);

                    fpsDisplay.update({ fps: lastFPS, draw: lastDrawCalls, costTicker: lastCostTicker, costRender: lastCostRedner });
                    this.totalTick = 0;
                    this.totalTime = this.totalTime % 1000;
                    this.drawCalls = 0;
                    this.costRender = 0;
                    this.costTicker = 0;
                }
            }
        }
    }

    let fpsDisplay: egret.FPSDisplay;

}
