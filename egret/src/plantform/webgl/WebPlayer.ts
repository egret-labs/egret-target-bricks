/**
 * 将原player与Webplayer和为一体
 */
namespace egret.web {
    /**
     * @private
     */
    export class BKWebPlayer extends egret.HashObject implements egret.sys.Screen {

        // public _viewRect: Rectangle = new egret.Rectangle();
        public static _viewRect: Rectangle = new egret.Rectangle();

        public constructor(options: BKRunEgretOptions) {
            super();
            this.init(options);
            // this.initOrientation();
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
            this.screenDisplayList = this.createDisplayList(stage, buffer)
            this.updateScreenSize();
            this.updateMaxTouches();

            // this.screenDisplayList.offsetX = this._viewRect.x;
            // this.screenDisplayList.offsetY = -this._viewRect.y;

            // //加入背景
            // let tex = new BK.Texture('GameRes://resource/pixel.png');
            // let background_node = new BK.Sprite(0, 0, tex, 0, 1, 1, 1)
            // let rgb_str = options.background.toString(16);
            // let red = parseInt(rgb_str.substring(0, 2), 16) / 255;
            // var green = parseInt(rgb_str.substring(2, 4), 16) / 255;
            // var blue = parseInt(rgb_str.substring(4, 6), 16) / 255;
            // background_node.vertexColor = { r: red, g: green, b: blue, a: 1 };
            // background_node.size = { width: this.stage.stageWidth, height: this.stage.stageHeight };
            // background_node.position = { x: 0, y: -this.stage.stageHeight }
            // BK.Director.root.addChild(background_node);
            // background_node.zOrder = 1;
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


        /**
         * @private
         * 渲染屏幕
         */
        $render(triggerByFrame: boolean, costTicker: number): void {
            let stage = this.stage;
            let drawCalls = stage.$displayList.drawToSurface();
        }
    }


}
