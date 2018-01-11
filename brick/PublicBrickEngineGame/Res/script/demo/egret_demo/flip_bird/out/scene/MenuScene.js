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
var MenuScene = (function (_super) {
    __extends(MenuScene, _super);
    function MenuScene() {
        return _super.call(this) || this;
        // this.initView();
        // this.addEventListener(egret.Event.ADDED_TO_STAGE, this.initView, this);
    }
    MenuScene.prototype.initView = function () {
        console.log("菜单初始化");
        var bg = createBitmapByName("bg_png");
        bg.width = this.stage.stageWidth;
        bg.height = this.stage.stageHeight;
        this.addChild(bg);
        this.createButtonView();
    };
    MenuScene.prototype.createButtonView = function () {
        console.log("菜单按钮");
        var buttonStart = AssestUtil.createButton("开始");
        buttonStart.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            console.log("开始");
            GameController.GameView();
        }, this);
        buttonStart.x = this.stage.stageWidth / 2;
        buttonStart.y = this.stage.stageHeight / 3;
        var buttonMore = AssestUtil.createButton("更多游戏");
        egret.console_log("buttonMore.x", buttonMore.x);
        egret.console_log("buttonMore.y", buttonMore.y);
        buttonMore.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            console.log("更多游戏");
        }, this);
        buttonMore.x = this.stage.stageWidth / 2;
        buttonMore.y = this.stage.stageHeight * 2 / 3;
        this.addChild(buttonStart);
        this.addChild(buttonMore);
    };
    return MenuScene;
}(egret.DisplayObjectContainer));
