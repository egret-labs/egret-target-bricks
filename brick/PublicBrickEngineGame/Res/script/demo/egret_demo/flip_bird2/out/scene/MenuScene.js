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
        var bg = createBitmapByName("bg_dlbj_jpg");
        bg.width = this.stage.stageWidth;
        bg.height = this.stage.stageHeight;
        this.addChild(bg);
        this.createButtonView();
    };
    MenuScene.prototype.createButtonView = function () {
        console.log("菜单按钮");
        var btn_start = new egret.DisplayObjectContainer();
        var button_bg = createBitmapByName("btn_ksyx_png");
        btn_start.addChild(button_bg);
        btn_start.touchEnabled = true;
        btn_start.touchChildren = false;
        btn_start.anchorOffsetX = btn_start.width / 2;
        btn_start.anchorOffsetY = btn_start.height / 2;
        btn_start.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            console.log("开始");
            GameController.GameView();
        }, this);
        this.addChild(btn_start);
        btn_start.x = this.stage.stageWidth / 2;
        btn_start.y = this.stage.stageHeight / 6 * 5;
        var logo_img = createBitmapByName("logo_png");
        this.addChild(logo_img);
        logo_img.x = (this.stage.stageWidth - logo_img.width) / 2;
        logo_img.y = 30;
        // let more_img: egret.Bitmap = createBitmapByName("btn_gdyx_png");
        // this.addChild(more_img);
        // more_img.x =this.stage.stageWidth -more_img.width;
        // more_img.y =this.stage.stageHeight / 2-more_img.height;
        var zgsocre_img = createBitmapByName("zgfs_png");
        this.addChild(zgsocre_img);
        zgsocre_img.x = (this.stage.stageWidth - zgsocre_img.width) / 2;
        zgsocre_img.y = this.stage.stageHeight * .68;
    };
    return MenuScene;
}(egret.DisplayObjectContainer));
