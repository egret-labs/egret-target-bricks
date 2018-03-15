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
    /**
     * @private
     * 网页加载完成，实例化页面中定义的Egret标签
     */
    function runEgret(options?: BKRunEgretOptions): void {
        if (isRunning) {
            return;
        }
        isRunning = true;

        modifyBricks();
        modifyEgret();

        if (!options) {
            options = {} as any;
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

    function modifyBricks(): void {
    }

    function modifyEgret(): void {
        if (typeof eui !== "undefined") {
            type BKImageType = BKBitmap & eui.Image;
            interface BKImage extends BKImageType {
            }

            Object.defineProperty(eui.Image.prototype, "scale9Grid", {
                set: function (this: BKImage, value: egret.Rectangle | null): void {
                    (this as any).$setScale9Grid(value);
                    this.invalidateDisplayList();
                },
                enumerable: true,
                configurable: true
            });

            eui.Image.prototype.$updateRenderNode = function (this: BKImage): void {
                let image = this.$bitmapData;
                if (!image) {
                    return null;
                }

                let uiValues = this.$UIComponent;
                let width = uiValues[eui.sys.UIKeys.width];
                let height = uiValues[eui.sys.UIKeys.height];
                if (width === 0 || height === 0) {
                    return null;
                }

                (this as any)._size.width = this.$getWidth();
                (this as any)._size.height = this.$getHeight();
                (this as any)._bkSprite.size = (this as any)._size;
            };

        }

        if (typeof WebSocket !== undefined) {
            egret.ISocket = egret.BKSocket;
        }
        egret.MovieClip = BKMovieClip as any;
    }

    egret.runEgret = runEgret;
}

if (DEBUG) {
}
