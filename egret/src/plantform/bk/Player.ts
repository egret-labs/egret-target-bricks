//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

namespace egret {
    export class BKPlayer extends HashObject implements egret.sys.Screen {
        public static instance: BKPlayer;
        public readonly stage: Stage = new egret.Stage();

        private readonly _mainTicker: BK.MainTicker = BK.Director.ticker;
        private readonly _viewRect: Rectangle = new egret.Rectangle();
        private readonly _touch: sys.TouchHandler = new sys.TouchHandler(this.stage);
        // private readonly _root: BK.Node = new BK.Node();
        /**
         * @internal
         */
        public readonly _displayList: DisplayObject[] = [];
        private _options: BKRunEgretOptions;

        public constructor(options: BKRunEgretOptions) {
            super();

            BKPlayer.instance = this;

            this._options = options;

            // BK.Director.root.addChild(this._root);
            // this._root.addChild((<any>this.stage as BKStage)._bkNode);
            BK.Director.root.addChild((<any>this.stage as BKStage)._bkNode);
            lifecycle.stage = this.stage;
            // lifecycle.addLifecycleListener(WebLifeCycleHandler); ?

            sys.$TempStage = this.stage;
            this.stage.$screen = this;
            this.stage.maxTouches = 10;
            this.stage.frameRate = this._options.frameRate;
            this.stage.orientation = this._options.orientation;
            this.stage.scaleMode = this._options.scaleMode;

            this._mainTicker.add(() => {
                this._touchHandler();
                ticker.update();
                ticker["callLaters"]();
                //
                for (const displayObject of this._displayList) {
                    displayObject.$getRenderNode();
                }
            }, this);

            this.updateScreenSize();
            this.updateMaxTouches();

            //加入背景
            let tex = new BK.Texture('GameRes://resource/pixel.png');
            let background_node = new BK.Sprite(0, 0, tex, 0, 1, 1, 1)
            let rgb_str = options.background.toString(16);
            let red = parseInt(rgb_str.substring(0, 2), 16) / 255;
            var green = parseInt(rgb_str.substring(2, 4), 16) / 255;
            var blue = parseInt(rgb_str.substring(4, 6), 16) / 255;
            background_node.vertexColor = { r: red, g: green, b: blue, a: 1 };
            background_node.size = { width: this.stage.stageWidth, height: this.stage.stageHeight };
            background_node.position = { x: 0, y: -this.stage.stageHeight }
            BK.Director.root.addChild(background_node);
            background_node.zOrder = 1;

            //
            let entryClassName = this._options.entryClassName;
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
        }

        private _touchHandler(): void {
            const touchEvents = BK.TouchEvent.getTouchEvent();
            if (!touchEvents || touchEvents.length === 0) {
                return;
            }

            for (const touchEvent of touchEvents) {
                const touchID = touchEvent.id;
                const screenPixelSize = BK.Director.screenPixelSize;
                const touchPosition = BK.Director.root.convertToNodeSpace(touchEvent);
                const touchX = touchPosition.x;
                const touchY = -touchPosition.y;

                if (touchEvent.status === 1) {
                    this._touch.onTouchEnd(touchX, touchY, touchID);
                } else if (touchEvent.status === 2) {
                    this._touch.onTouchBegin(touchX, touchY, touchID);
                } else if (touchEvent.status === 3) {
                    this._touch.onTouchMove(touchX, touchY, touchID);
                }
            }

            BK.TouchEvent.updateTouchStatus();
        }

        public updateScreenSize(): void {
            const screenPixelSize = BK.Director.screenPixelSize;
            let screenWidth: number = screenPixelSize.width;
            let screenHeight: number = screenPixelSize.height;
            Capabilities.$boundingClientWidth = screenWidth;
            Capabilities.$boundingClientHeight = screenHeight;
            let stageSize: sys.StageDisplaySize = egret.sys.screenAdapter.calculateStageSize(
                this.stage.$scaleMode,
                screenWidth, screenHeight,
                this._options.contentWidth, this._options.contentHeight
            );
            let stageWidth: number = stageSize.stageWidth;
            let stageHeight: number = stageSize.stageHeight;
            let displayWidth: number = stageSize.displayWidth;
            let displayHeight: number = stageSize.displayHeight;

            let top: number = (screenHeight - displayHeight) / 2;
            let left: number = (screenWidth - displayWidth) / 2;
            this.stage.$stageWidth = stageWidth;
            this.stage.$stageHeight = stageHeight;
            BK.Director.root.position = { x: left, y: BK.Director.screenPixelSize.height - top };
            BK.Director.root.scale = { x: displayWidth / stageWidth, y: displayHeight / stageHeight };
            // this._root.scale = { x: displayWidth / stageWidth, y: displayHeight / stageHeight };
            this._viewRect.setTo(left, top, stageWidth, stageHeight);
            // BK.Director.renderSize = { width: stageWidth, height: stageHeight }; // can not work

            this.stage.dispatchEventWith(Event.RESIZE);
        }

        public setContentSize(width: number, height: number): void {
            const option = this._options;
            option.contentWidth = width;
            option.contentHeight = height;
            this.updateScreenSize();
        }

        public updateMaxTouches() {
            this._touch.$initMaxTouches();
        }
    }

    export type BKRunEgretOptions = {
        renderMode?: string;
        audioType?: number;
        screenAdapter?: sys.IScreenAdapter;
        antialias?: boolean;
        canvasScaleFactor?: number;
        calculateCanvasScaleFactor?: (context: CanvasRenderingContext2D) => number;
        entryClassName?: string;
        scaleMode?: string;
        frameRate?: number;
        contentWidth?: number;
        contentHeight?: number;
        orientation?: string;
        background: number;
    }
}