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
BK.Script.loadlib("GameRes://script/demo/tests/egret.js");
BK.Script.loadlib("GameRes://script/demo/tests/tween.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_maxituan/out/gameObject/GameObject.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_maxituan/out/gameObject/Background.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_maxituan/out/gameObject/EndPoint.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_maxituan/out/gameObject/FireRing.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_maxituan/out/gameObject/FireRingSmall.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_maxituan/out/gameObject/MainRole.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_maxituan/out/gameObject/Mileage.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_maxituan/out/gameObject/ObjectPool.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_maxituan/out/gameObject/Pen.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_maxituan/out/gameObject/PurseBig.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_maxituan/out/gameObject/PurseSmall.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_maxituan/out/starlingswf/display/ISwfAnimation.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_maxituan/out/starlingswf/display/SwfMovieClip.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_maxituan/out/starlingswf/display/SwfSprite.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_maxituan/out/starlingswf/StarlingSwfSheetAnalyzer.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_maxituan/out/starlingswf/StarlingSwfUtils.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_maxituan/out/starlingswf/Swf.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_maxituan/out/starlingswf/SwfAssetManager.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_maxituan/out/starlingswf/SwfUpdateManager.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_maxituan/out/CONST.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_maxituan/out/GameScene.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_maxituan/out/GameUtils.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_maxituan/out/LoadingUI.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_maxituan/out/LoginLayer.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_maxituan/out/MovieClip.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_maxituan/out/ResultLayer.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_maxituan/out/ShareUtils.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_maxituan/out/SpecialNumber.js");
var app;
var GameApp = (function (_super) {
    __extends(GameApp, _super);
    function GameApp() {
        var _this = _super.call(this) || this;
        app = _this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        var stage = egret.stage;
        CONST.RESOLUTION_WIDTH = stage.stageWidth;
        CONST.RESOLUTION_HEIGHT = stage.stageHeight;
        // egret.console_log("更改宽高CONST.GAME_WIDTH: ", CONST.GAME_WIDTH, "  CONST.GAME_HEIGHT:", CONST.GAME_HEIGHT);
        if (_this.needFixHeight()) {
            var offset = CONST.RESOLUTION_HEIGHT - CONST.GAME_HEIGHT >> 1;
            _this.y = offset;
        }
        return _this;
        //BK.error
        //暂不支持scrollRect属性
        // this.scrollRect = new egret.Rectangle(0, 0, CONST.GAME_WIDTH, CONST.GAME_HEIGHT);
    }
    GameApp.prototype.onAddToStage = function (event) {
        egret.console_log("GameApp加入到舞台");
        //注入StarlingSwf资源解析器
        //egret.Injector.mapClass(RES.AnalyzerBase, starlingswf.StarlingSwfSheetAnalyzer, "starlingswf_sheet");
        //BK.error
        //RES。一类定义为值进行映射注入。暂不支持。
        // RES.registerAnalyzer("starlingswf_sheet", starlingswf.StarlingSwfSheetAnalyzer);
        //初始化Resource资源加载库
        // RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        //BK.error
        //加载配置文件并解析（不需要）
        // RES.loadConfig("resource/resource.json", "resource/");
        //BK.error
        //脏矩形策略（暂不支持）
        // this.stage.dirtyRegionPolicy = "off"
        RES.basePath = "resource/egret_resource/demo_maxituan/resource/assets";
        this.loadingView = new LoadingUI();
        this.addChild(this.loadingView);
        this.loadingView.playOverMovie();
    };
    // /**
    //  * 配置文件加载完成,开始预加载preload资源组。
    //  */
    // private onConfigComplete(event: RES.ResourceEvent): void {
    //     RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
    //     RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
    //     RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
    //     RES.loadGroup("loading");
    // }
    // /**
    //  * preload资源组加载完成
    //  */
    // private onResourceLoadComplete(event: RES.ResourceEvent): void {
    //     if (event.groupName == "loading") {
    //         this.loadingView = new LoadingUI();
    //         this.addChild(this.loadingView);
    //         RES.loadGroup("preload");
    //     }
    //     else if (event.groupName == "preload") {
    //         RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
    //         RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
    //         this.loadingView.playOverMovie();
    //     }
    // }
    // /**
    //  * preload资源组加载进度
    //  */
    // private onResourceProgress(event: RES.ResourceEvent): void {
    //     if (event.groupName == "preload") {
    //         this.loadingView.onProgress(event.itemsLoaded, event.itemsTotal);
    //     }
    // }
    /**
     * 创建游戏场景
     */
    GameApp.prototype.createGameScene = function () {
        //        egret.Profiler.getInstance().run();
        var title = "要钱不要命的慎入";
        var content = "赶紧来抢呀，要能超过我，今晚你请客！";
        var link = "http://static.egret-labs.org/h5game/1/release.html";
        var ico = "http://static.egret-labs.org/h5game/icons/10000001.jpg";
        //if(window.hasOwnProperty("EgretShare"))
        //    EgretShare.setShareData(title, content, link, ico);
        //else
        //    window["setShareInfo"] = function(){
        //        EgretShare.setShareData(title, content, link, ico);
        //    };
        //        if(egret.MainContext.runtimeType == egret.MainContext.RUNTIME_HTML5 && !window.hasOwnProperty("EgretShare"))
        //            document.addEventListener('EgretShareLoaded', function(){
        //                EgretShare.setShareData(title, content, link, ico)});
        //        else
        //            EgretShare.setShareData(title, content, link, ico);
        this.initStarlingSwf();
        var loginLayer = new LoginLayer();
        var view = loginLayer.view;
        egret.console_log("加入到主页面", view);
        this.addChild(view);
        // if (this.needFixHeight()) {
        //     //BK.error
        //     //没有egret.shape
        //     // var shapeUp: egret.Shape = new egret.Shape();
        //     // shapeUp.graphics.beginFill(0x113f78);
        //     // shapeUp.graphics.drawRect(0, 0, CONST.GAME_WIDTH, this.y);
        //     // shapeUp.graphics.endFill();
        //     // this.stage.addChild(shapeUp);
        //     // var shapeDown: egret.Shape = new egret.Shape();
        //     // shapeDown.graphics.beginFill(0x009700);
        //     // shapeDown.graphics.drawRect(0, this.y + CONST.GAME_HEIGHT, CONST.GAME_WIDTH, this.y);
        //     // shapeDown.graphics.endFill();
        //     // this.stage.addChild(shapeDown);
        // }
        egret.console_log("结束");
        //egret.Profiler.getInstance().run();
    };
    GameApp.prototype.needFixHeight = function () {
        return true;
    };
    GameApp.prototype.initStarlingSwf = function () {
        var list = ["starlingSwfUI"];
        var l = list.length;
        for (var i = 0; i < l; i++) {
            var key = list[i];
            var swfData = RES.getRes(key + "_swf_json");
            // egret.console_log("swfData解析",JSON.stringify(swfData));
            // var spriteSheet: egret.SpriteSheet = RES.getRes(key + "_json");
            var spriteSheet = new egret.SpriteSheet(RES.basePath + "/starlingSwfUI_2/starlingSwfUI.png", RES.basePath + "/starlingSwfUI_2/starlingSwfUI.json");
            var assetsManager = new starlingswf.SwfAssetManager();
            assetsManager.addSpriteSheet(key, spriteSheet);
            var swf = new starlingswf.Swf(swfData, assetsManager, 24);
            swf.name = key;
            StarlingSwfUtils.addSwf(swf);
        }
    };
    return GameApp;
}(egret.DisplayObjectContainer));
var stage = egret.stage;
var gameapp = new GameApp();
stage.addChild(gameapp);
