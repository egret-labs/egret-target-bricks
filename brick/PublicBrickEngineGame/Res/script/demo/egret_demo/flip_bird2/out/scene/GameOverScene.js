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
        var hand = createBitmapByName("icon_dj_png");
        hand.anchorOffsetX = hand.width / 2;
        hand.anchorOffsetY = hand.height / 2;
        hand.x = this.stage.stageWidth / 2;
        hand.y = this.stage.stageHeight * .55;
        this.addChild(hand);
        var start_img = createBitmapByName("djksyx_png");
        start_img.anchorOffsetX = start_img.width / 2;
        start_img.anchorOffsetY = start_img.height / 2;
        start_img.x = this.stage.stageWidth / 2;
        start_img.y = this.stage.stageHeight * .65;
        this.addChild(start_img);
        var menuButton = createBitmapByName("btn_cd_png");
        menuButton.touchEnabled = true;
        menuButton.anchorOffsetX = menuButton.width / 2;
        menuButton.anchorOffsetY = menuButton.height / 2;
        // menuButton.x = this.stage.stageWidth * 9 / 10;
        // menuButton.y = 100;
        menuButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            console.log("菜单");
            GameController.GameInit();
        }, this);
        menuButton.x = this.stage.stageWidth / 2;
        menuButton.y = this.stage.stageHeight * .25;
        this.addChild(menuButton);
        var shareButton = createBitmapByName("btn_fx_png");
        shareButton.touchEnabled = true;
        shareButton.anchorOffsetX = shareButton.width / 2;
        shareButton.anchorOffsetY = shareButton.height / 2;
        // menuButton.x = this.stage.stageWidth * 9 / 10;
        // menuButton.y = 100;
        shareButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            console.log("分享");
        }, this);
        shareButton.x = this.stage.stageWidth / 2;
        shareButton.y = this.stage.stageHeight * .4;
        this.addChild(shareButton);
    };
    return GameOverScene;
}(egret.DisplayObjectContainer));
