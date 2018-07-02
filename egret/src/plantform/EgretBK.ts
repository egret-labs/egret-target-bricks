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
//
console = console || {} as any;
console.warn = console.log = function (...others: any[]): void {
    let str = "";
    if (others) {
        for (let other of others) {
            str += " " + other;
        }
    }
    /**
     * BK.Script.log 
     * 第一个参数为测试级别，0为debug级别，发布版本不输出。1为关键级别，可在发布版本输出（手Q环境）
     */

    BK.Script.log(1, 0, str);
};
console.assert = function (c: boolean, ...others: any[]): void {
    if (!c) {
        console.log.apply(null, others);
    }
};

namespace egret.bricks{
    /**
     * 玩一玩平台支持库版本号
     */
    export let version = "1.0.20";
}

namespace egret {
    egret.getTimer = function getTimer(): number {
        return Math.round(BK.Time.timestamp * 1000);
    };
    //BK的setTimeout与egret的setTimeout处理方法不同，
    //egret通过key值索引找到listener然后将其清除，
    //BK则是直接清除对象Object绑定的所有listener
    //暂时完全按照BK的方法执行
    /**
     * @private
     */
    export function setTimeout(listener: () => void, thisObject: any, delay: number): void {
        BK.Director.ticker.setTimeout(listener, delay, thisObject);
    }
    /**
     * @private
     */
    export function clearTimeout(object: any): void {
        BK.Director.ticker.removeTimeout(object);
    }


    let isRunning: boolean = false;
    let player: BKPlayer;

    let webPlayer: egret.web.BKWebPlayer;
    let system_options: BKRunEgretOptions;
    /**
     * @private
     * 网页加载完成，实例化页面中定义的Egret标签
     */
    function runEgret(options?: BKRunEgretOptions): void {
        if (isRunning) {
            return;
        }
        isRunning = true;

        if (!options) {
            options = {} as any;
        }
        system_options = options;

        modifyBricks();

        let renderMode = options.renderMode;
        if (renderMode == "webgl") {
            modifyEgretToBKWebgl(options);
        } else {
            modifyEgretToBricks(options);
        }

    }

    function modifyBricks(): void {
    }
    /**
     * 将当前渲染模式变为BK原生
     */
    function modifyEgretToBricks(options: BKRunEgretOptions): void {
        /**
         * 为贴合BK原生方法，对eui部分方法进行修改
         */
        if (typeof eui !== "undefined") {
            type BKImageType = BKBitmap & eui.Image;
            interface BKImage extends BKImageType {
            }

            Object.defineProperty(eui.Image.prototype, "scale9Grid", {
                set: function (this: BKImage, value: egret.Rectangle | null): void {
                    (this as any).$setScale9Grid(value);
                    (this as any).invalidateDisplayList();
                },
                enumerable: true,
                configurable: true
            });
            /**
             * eui.Image 方法修改
             */
            eui.Image.prototype.$updateRenderNode = function (this: BKImage): void {
                let image = this['$bitmapData'];
                if (!image) {
                    return null;
                }

                let uiValues = this['$UIComponent'];
                let width = uiValues[eui.sys.UIKeys.width];
                let height = uiValues[eui.sys.UIKeys.height];
                if (width === 0 || height === 0) {
                    return null;
                }

                (this as any)._size.width = (this as any).$getWidth();
                (this as any)._size.height = (this as any).$getHeight();
                (this as any)._bkSprite.size = (this as any)._size;
            };

        }
        /**
         * 读取websocket
         */
        if (typeof WebSocket !== undefined) {
            egret.ISocket = egret.BKSocket;
        }

        if (options.screenAdapter) {
            egret.sys.screenAdapter = options.screenAdapter;
        }
        else if (!egret.sys.screenAdapter) {
            egret.sys.screenAdapter = new egret.sys.DefaultScreenAdapter();
        }

        sys.systemRenderer = new BKSystemRenderer();
        sys.canvasRenderer = new BKSystemRenderer();

        player = new BKPlayer(options);
    }
    /**
     * 将当前渲染模式变为BK-Webgl模式
     */
    function modifyEgretToBKWebgl(options: BKRunEgretOptions): void {
        //为贴合玩一玩平台webgl，修改egret库中deleteWebGLTexture方法
        egret.WebGLUtils.deleteWebGLTexture = function (bitmapData) {
            // debugger
            if (bitmapData) {
                var gl = bitmapData.glContext;
                if (gl) {
                    gl.deleteTexture(bitmapData);
                } else {
                    gl = bkWebGLGetInstance();
                    gl.deleteTexture(bitmapData);
                }
            }
        };


        // WebGL上下文参数自定义
        if (options.renderMode == "webgl") {
            // WebGL抗锯齿默认关闭，提升PC及某些平台性能
            let antialias = options.antialias;
            egret.web.WebGLRenderContext.antialias = !!antialias;
        }

        /**
         * 没有canvasbuffer
         */
        sys.CanvasRenderBuffer = web.CanvasRenderBuffer;
        setRenderMode(options.renderMode);

        let canvasScaleFactor;
        if (options.canvasScaleFactor) {
            canvasScaleFactor = options.canvasScaleFactor;
        }
        else if (options.calculateCanvasScaleFactor) {
            canvasScaleFactor = options.calculateCanvasScaleFactor(sys.canvasHitTestBuffer.context);
        }
        else {
            //based on : https://github.com/jondavidjohn/hidpi-canvas-polyfill
            let context = sys.canvasHitTestBuffer.context;
            let backingStore = context.backingStorePixelRatio ||
                context.webkitBackingStorePixelRatio ||
                context.mozBackingStorePixelRatio ||
                context.msBackingStorePixelRatio ||
                context.oBackingStorePixelRatio ||
                context.backingStorePixelRatio || 1;
            canvasScaleFactor = (window.devicePixelRatio || 1) / backingStore;
        }
        sys.DisplayList.$canvasScaleFactor = canvasScaleFactor;

        let ticker = egret.ticker;
        startTicker(ticker);
        if (options.screenAdapter) {
            egret.sys.screenAdapter = options.screenAdapter;
        }
        else if (!egret.sys.screenAdapter) {
            egret.sys.screenAdapter = new egret.sys.DefaultScreenAdapter();
        }
        webPlayer = new egret.web.BKWebPlayer(options);
    }

    /**
     * 设置渲染模式。"auto","webgl","canvas"
     * @param renderMode
     */
    function setRenderMode(renderMode: string): void {
        if (renderMode == "webgl") {
            sys.RenderBuffer = web.WebGLRenderBuffer;
            sys.systemRenderer = new egret.web.WebGLRenderer();
            sys.canvasRenderer = new CanvasRenderer();
            sys.customHitTestBuffer = new egret.web.WebGLRenderBuffer(3, 3);
            sys.canvasHitTestBuffer = new egret.web.CanvasRenderBuffer(3, 3);
            Capabilities["renderMode" + ""] = "webgl";
        }
    }

    /**
     * @private
     * 启动心跳计时器。
     */
    function startTicker(ticker: egret.sys.SystemTicker): void {
        // if (system_options.frameRate && system_options.frameRate > 0) {
        //     BK.Director.ticker.interval = 60 / system_options.frameRate;
        // } else {
        BK.Director.ticker.interval = 1;

        BK.Director.ticker.add((ts, duration) => {
            ticker.update();
        });
    }

    egret.runEgret = runEgret;
}