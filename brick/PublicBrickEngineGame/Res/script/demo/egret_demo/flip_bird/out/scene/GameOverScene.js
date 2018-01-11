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
var GameOverScene = (function (_super) {
    __extends(GameOverScene, _super);
    function GameOverScene() {
        return _super.call(this) || this;
        // this.addEventListener(egret.Event.ADDED_TO_STAGE,this.initView,this);
        // this.initView();
    }
    GameOverScene.prototype.initView = function () {
        var hand = createBitmapByName("hand_png");
        hand.anchorOffsetX = hand.width / 2;
        hand.anchorOffsetY = hand.height / 2;
        hand.x = this.stage.stageWidth / 2;
        hand.y = this.stage.stageHeight / 2;
        this.addChild(hand);
        var startText = new egret.TextField();
        startText.text = "点击重新游戏";
        startText.textWidth = 800;
        startText.textAlign = egret.HorizontalAlign.LEFT;
        egret.console_log("字符串宽度", startText.width);
        startText.size = 100;
        startText.stroke = 8;
        startText.strokeColor = 0x000000;
        startText.anchorOffsetX = startText.width / 2;
        startText.anchorOffsetY = startText.height / 2;
        startText.x = this.stage.stageWidth / 2;
        startText.y = this.stage.stageHeight * 2 / 3;
        this.addChild(startText);
        var menuButton = AssestUtil.createButton("菜单");
        menuButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            console.log("菜单");
            GameController.GameInit();
        }, this);
        menuButton.x = this.stage.stageWidth / 2;
        menuButton.y = this.stage.stageHeight / 5;
        this.addChild(menuButton);
        var shareButton = AssestUtil.createButton("分享");
        shareButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            console.log("分享");
        }, this);
        shareButton.x = this.stage.stageWidth / 2;
        shareButton.y = this.stage.stageHeight * 2 / 5;
        this.addChild(shareButton);
    };
    return GameOverScene;
}(egret.DisplayObjectContainer));
