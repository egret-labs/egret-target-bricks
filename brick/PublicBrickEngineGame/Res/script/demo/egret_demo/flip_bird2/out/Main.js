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
BK.Script.loadlib("GameRes://script/demo/tests/egret.js");
BK.Script.loadlib("GameRes://script/demo/tests/tween.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/flip_bird2/out/data/GameData.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/flip_bird2/out/gameobject/Barrier.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/flip_bird2/out/gameobject/Egg.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/flip_bird2/out/gameobject/Enemy.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/flip_bird2/out/gameobject/IGameObject.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/flip_bird2/out/gameobject/Player.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/flip_bird2/out/scene/GameOverScene.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/flip_bird2/out/scene/GameScene.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/flip_bird2/out/scene/MenuScene.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/flip_bird2/out/AssetsUtils.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/flip_bird2/out/GameController.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/flip_bird2/out/AssetsUtils.js");
var Main = (function (_super) {
    __extends(Main, _super);
    /**
     * 加载进度界面
     * Process interface loading
     */
    // private loadingView: LoadingUI;
    function Main() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main.prototype.onAddToStage = function (event) {
        var gameContainer = new egret.DisplayObjectContainer();
        this.addChild(gameContainer);
        GameController.instance.setStage(gameContainer);
        GameController.GameInit();
        // this.addChild(mainScene);
    };
    return Main;
}(egret.DisplayObjectContainer));
RES.basePath = "resource/egret_resource/flip_bird2/resource";
var stage = egret.stage;
var main = new Main();
stage.addChild(main);
/**
 * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
 * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
 */
function createBitmapByName(name) {
    var result = new egret.Bitmap();
    var texture = RES.getRes(name);
    result.texture = texture;
    var scale = egret.stage.stageWidth / 1080;
    console.log("像素缩放 : ", scale, "  egret.stage.stageWidth: ", egret.stage.stageWidth);
    result.scaleX = result.scaleY = scale;
    return result;
}
