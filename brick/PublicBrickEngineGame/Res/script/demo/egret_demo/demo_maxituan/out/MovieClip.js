/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @class egret.MovieClip
 * @classdesc 影片剪辑，可以通过影片剪辑播放序列帧动画。
 * @extends egret.DisplayObjectContainer
 */
var MovieClip = (function (_super) {
    __extends(MovieClip, _super);
    function MovieClip(data, /*texture?: egret.Texture*/ texPath, jsonPath) {
        var _this = _super.call(this) || this;
        /**
         * 动画的播放帧频
         * @member {number} egret.MovieClip#frameRate
         */
        _this.frameRate = 60;
        if (data instanceof DefaultMovieClipDelegate) {
            _this.delegate = data;
        }
        else {
            _this.delegate = new DefaultMovieClipDelegate(data, texPath, jsonPath);
        }
        _this.delegate.setMovieClip(_this);
        return _this;
    }
    /**
     * 播放指定动画
     * @method egret.MovieClip#gotoAndPlay
     * @param frameName {string} 指定帧的帧名称

     */
    MovieClip.prototype.gotoAndPlay = function (frameName) {
        // egret.console_log("gotoAndPlay播放frameName11111: ", frameName);
        this.delegate.gotoAndPlay(frameName);
    };
    /**
     * 播放并暂停指定动画
     * @method egret.MovieClip#gotoAndStop
     * @param frameName {string} 指定帧的帧名称

     */
    MovieClip.prototype.gotoAndStop = function (frameName) {
        this.delegate.gotoAndStop(frameName);
    };
    /**
     * 暂停动画
     * @method egret.MovieClip#stop
     */
    MovieClip.prototype.stop = function () {
        this.delegate.stop();
    };
    /**
     * @method egret.MovieClip#dispose
     */
    MovieClip.prototype.dispose = function () {
        this.delegate.dispose();
    };
    /**
     * 方法名改为 dispose
     * @method egret.MovieClip#release
     * @deprecated
     */
    MovieClip.prototype.release = function () {
        this.dispose();
    };
    /**
     * @method egret.MovieClip#getCurrentFrameIndex
     * @deprecated
     * @returns {number}
     */
    MovieClip.prototype.getCurrentFrameIndex = function () {
        return this.delegate["_currentFrameIndex"];
    };
    /**
     * 获取当前影片剪辑的帧频数
     * @method egret.MovieClip#getTotalFrame
     * @deprecated
     * @returns {number}
     */
    MovieClip.prototype.getTotalFrame = function () {
        return this.delegate["_totalFrame"];
    };
    /**
     * @method egret.MovieClip#setInterval
     * @deprecated
     * @param value {number}
     */
    MovieClip.prototype.setInterval = function (value) {
        this.frameRate = 60 / value;
    };
    /**
     * @method egret.MovieClip#getIsPlaying
     * @deprecated
     * @returns {boolean}
     */
    MovieClip.prototype.getIsPlaying = function () {
        return this.delegate["isPlaying"];
    };
    return MovieClip;
}(egret.DisplayObjectContainer));
var DefaultMovieClipDelegate = (function () {
    function DefaultMovieClipDelegate(data, texPath, jsonPath) {
        this.data = data;
        this._totalFrame = 0;
        this._passTime = 0;
        this._currentFrameIndex = 0;
        this._isPlaying = false;
        // egret.console_log("创建DefaultMovieClipDelegate")
        this._frameData = data;
        this._spriteSheet = new egret.SpriteSheet(texPath, jsonPath);
    }
    DefaultMovieClipDelegate.prototype.setMovieClip = function (movieClip) {
        this.movieClip = movieClip;
        this.bitmap = new egret.Bitmap();
        this.movieClip.addChild(this.bitmap);
    };
    DefaultMovieClipDelegate.prototype.gotoAndPlay = function (frameName) {
        // egret.console_log("DefaultMovieClipDelegate中的gotoAndPlay,frameName:", frameName);
        this.checkHasFrame(frameName);
        this._isPlaying = true;
        this._currentFrameIndex = 0;
        this._currentFrameName = frameName;
        this._totalFrame = this._frameData.frames[frameName].totalFrame;
        this.playNextFrame();
        this._passTime = 0;
        //BK.error
        // egret.Ticker.getInstance().register(this.update, this);
        this.lastTime = egret.getTimer();
        egret.startTick(this.update, this);
    };
    DefaultMovieClipDelegate.prototype.gotoAndStop = function (frameName) {
        this.checkHasFrame(frameName);
        this.stop();
        this._passTime = 0;
        this._currentFrameIndex = 0;
        this._currentFrameName = frameName;
        this._totalFrame = this._frameData.frames[frameName].totalFrame;
        this.playNextFrame();
    };
    DefaultMovieClipDelegate.prototype.stop = function () {
        this._isPlaying = false;
        //BK.error
        // egret.Ticker.getInstance().unregister(this.update, this);
        egret.stopTick(this.update, this);
    };
    DefaultMovieClipDelegate.prototype.dispose = function () {
    };
    DefaultMovieClipDelegate.prototype.checkHasFrame = function (name) {
        if (this._frameData.frames[name] == undefined) {
        }
    };
    DefaultMovieClipDelegate.prototype.changeBitmap = function (bitmap, x, y) {
        // let parent = this.bitmap.parent;
        var index = this.movieClip.getChildIndex(this.bitmap);
        // egret.console_log("帧更换图片index : ", index)
        if (index >= 0) {
            this.movieClip.removeChild(this.bitmap);
        }
        this.bitmap = bitmap;
        this.bitmap.x = x;
        this.bitmap.y = y;
        if (index >= 0) {
            this.movieClip.addChildAt(this.bitmap, index);
        }
        else {
            this.movieClip.addChild(this.bitmap);
        }
    };
    DefaultMovieClipDelegate.prototype.update = function (timeStamp) {
        var advancedTime = timeStamp - this.lastTime;
        var oneFrameTime = 1000 / this.movieClip.frameRate;
        var last = this._passTime % oneFrameTime;
        var num = Math.floor((last + advancedTime) / oneFrameTime);
        while (num >= 1) {
            if (num == 1) {
                this.playNextFrame();
            }
            else {
                this.playNextFrame(false);
            }
            num--;
        }
        this._passTime += advancedTime;
        this.lastTime = timeStamp;
    };
    DefaultMovieClipDelegate.prototype.playNextFrame = function (needShow) {
        if (needShow === void 0) { needShow = true; }
        var frameData = this._frameData.frames[this._currentFrameName].childrenFrame[this._currentFrameIndex];
        var name = frameData.res;
        // egret.console_log("下一帧1111111", needShow);
        // egret.console_log("获取Bitmap22222： ", name);
        if (needShow) {
            //Bk.error
            // var texture: egret.Texture = this.getTexture(frameData.res);
            // var bitmap = this.bitmap;
            // bitmap.texture = texture;
            // bitmap.x = frameData.x;
            // bitmap.y = frameData.y;
            //新写法
            var bitmap = this.getBitmap(name);
            // egret.console_log("当前图片： ", bitmap);
            this.changeBitmap(bitmap, frameData.x, frameData.y);
        }
        if (frameData.action != null) {
            this.movieClip.dispatchEventWith(frameData.action);
        }
        this._currentFrameIndex++;
        if (this._currentFrameIndex == this._totalFrame) {
            this._currentFrameIndex = 0;
            if (frameData.action != egret.Event.COMPLETE) {
                this.movieClip.dispatchEventWith(egret.Event.COMPLETE);
            }
        }
    };
    // private getTexture(name: string): egret.Texture {
    //     var resData = this._frameData.res[name];
    //     var texture = this._spriteSheet.getTexture(name);
    //     // if (!texture) {
    //     //     texture = this._spriteSheet.createTexture(name, resData.x, resData.y, resData.w, resData.h);
    //     // }
    //     return texture;
    // }
    DefaultMovieClipDelegate.prototype.getBitmap = function (name) {
        // egret.console_log("DefaultMovieClipDelegate寻找bitmap")
        var bitmap = this._spriteSheet.getBitmap(name);
        if (bitmap.isSheets) {
            // egret.console_log("找到了")
            return bitmap;
        }
        return null;
    };
    return DefaultMovieClipDelegate;
}());
