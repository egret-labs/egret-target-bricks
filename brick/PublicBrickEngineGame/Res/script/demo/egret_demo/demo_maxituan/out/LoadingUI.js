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
var LoadingUI = (function (_super) {
    __extends(LoadingUI, _super);
    function LoadingUI() {
        var _this = _super.call(this) || this;
        _this.createView();
        return _this;
    }
    LoadingUI.instance = function () {
        return LoadingUI._instance == null ? LoadingUI._instance = new LoadingUI() : LoadingUI._instance;
    };
    LoadingUI.prototype.addToStage = function () {
        var stage = egret.MainContext.instance.stage;
        stage.addChild(this);
    };
    LoadingUI.prototype.removeFromStage = function () {
        var stage = egret.MainContext.instance.stage;
        stage.removeChild(this);
    };
    LoadingUI.prototype.createView = function () {
        var bg = new egret.Bitmap(RES.getRes("egretLogo_png"));
        egret.console_log("createView触发,bg: ", bg);
        this.addChild(bg);
        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.size = 60;
        this.textField.textColor = 0x000000;
        this.textField.x = 0;
        this.textField.y = egret.stage.stageHeight / 2;
        egret.console_log("文本宽度：", this.textField.width);
        this.textField.textAlign = egret.HorizontalAlign.CENTER;
        this.textField.height = 200;
        this.textField.width = egret.stage.stageHeight / 2;
        // this.textField.width = 480;
        // this.textField.height = 100;
    };
    LoadingUI.prototype.playOverMovie = function () {
        egret.console_log("playOverMovie触发");
        this.textField.alpha = 0;
        this.textField.text = "Powered by Egret Engine";
        var tw = egret.Tween.get(this.textField);
        tw.to({ "alpha": 1 }, 1200);
        tw.wait(400);
        tw.to({ "alpha": 0 }, 700);
        tw.call(this.allOver, this);
    };
    LoadingUI.prototype.allOver = function () {
        egret.console_log("加载动画结束，执行createGameScene");
        app.createGameScene();
    };
    LoadingUI.prototype.onProgress = function (current, total) {
        this.textField.text = "游戏加载中..." + (Math.ceil(current / total * 100)).toString() + "%";
        //        this._progress.setProgress(current, total);
    };
    return LoadingUI;
}(egret.DisplayObjectContainer));
