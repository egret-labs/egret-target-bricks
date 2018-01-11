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
/**
 * tween缓动动画
 */
BK.Script.loadlib("GameRes://script/demo/tests/tween.js");
var LoadingUI_1 = (function (_super) {
    __extends(LoadingUI_1, _super);
    function LoadingUI_1() {
        var _this = _super.call(this) || this;
        _this.createView();
        return _this;
    }
    LoadingUI_1.prototype.createView = function () {
        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.y = 300;
        // this.textField.textwid = 480;
        // this.textField.height = 100;
        this.textField.textAlign = "center";
    };
    LoadingUI_1.prototype.setProgress = function (current, total) {
        this.textField.text = "Loading..." + current + "/" + total;
    };
    return LoadingUI_1;
}(egret.DisplayObjectContainer));
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this.defaultX = 260;
        _this.defaultY = 330;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main.prototype.onAddToStage = function (event) {
        console_log("onAddToStage");
        RES.basePath = "resource/egret_resource/HelloWorld/resource";
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin
            context.onUpdate = function () {
                console.log('hello,world');
            };
        });
        egret.lifecycle.onPause = function () {
            egret.ticker.pause();
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
        };
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI_1();
        this.stage.addChild(this.loadingView);
        console_log("loadingView位置，x：", this.loadingView.x, "   y：" + this.loadingView.y);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        // RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    Main.prototype.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        // RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        // RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        // RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    Main.prototype.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            // RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            // RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    };
    // /**
    //  * 资源组加载出错
    //  *  The resource group loading failed
    //  */
    // private onItemLoadError(event: RES.ResourceEvent) {
    //     console.warn("Url:" + event.resItem.url + " has failed to load");
    // }
    // /**
    //  * 资源组加载出错
    //  *  The resource group loading failed
    //  */
    // private onResourceLoadError(event: RES.ResourceEvent) {
    //     //TODO
    //     console.warn("Group:" + event.groupName + " has failed to load");
    //     //忽略加载失败的项目
    //     //Ignore the loading failed projects
    //     this.onResourceLoadComplete(event);
    // }
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    Main.prototype.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    Main.prototype.createGameScene = function () {
        console_log("现在的this.x: ", this.x);
        console_log("现在的this.y: ", this.y);
        var sky = this.createBitmapByName("bg_jpg");
        console_log("现在的sky.x: ", sky.x);
        console_log("现在的sky.y: ", sky.y);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        var container = new egret.DisplayObjectContainer();
        container.addChild(sky);
        container.x = stageW / 2;
        container.y = stageH / 2;
        // sky.anchorOffsetX = stageW / 2;
        // sky.anchorOffsetY = stageH / 2;
        this.addChild(container);
        egret.setTimeout(function () {
            debugger;
            container.anchorOffsetX = stageW / 2;
            container.anchorOffsetY = stageH / 2;
        }, this, 3000);
        var tex = sky.$texture.$texture;
        egret.console_log("tex", tex);
        // let topMask = new egret.Shape();
        // topMask.graphics.beginFill(0x000000, 0.5);
        // topMask.graphics.drawRect(0, 0, stageW, 172);
        // topMask.graphics.endFill();
        // topMask.y = 33;
        // this.addChild(topMask);
        var icon = this.createBitmapByName("egret_icon_png");
        icon.x = 26;
        icon.y = 33;
        this.addChild(icon);
        // egret.setTimeout(() => {
        //     egret.console_log("更换贴图")
        //     RES.basePath = "script/demo/demo_xiaochu/resource/configs";
        //     let texture_ = RES.getRes("background_jpg")
        //     sky.texture = texture_;
        // }, this, 5000)
        var icon2 = this.createBitmapByName("egret_icon_png");
        // this.addChild(icon2);
        icon2.x = 26;
        icon2.y = 33;
        var container1 = new egret.DisplayObjectContainer();
        // container1.x = 350;
        // container1.y = 350
        container1.addChild(icon2);
        container1.name = "container1";
        container1.anchorOffsetX = icon2.width / 2;
        container1.anchorOffsetY = icon2.height / 2;
        icon2.name = "icon2";
        this.name = "main";
        // container1.rotation = 70;
        var container2 = new egret.DisplayObjectContainer();
        container2.x = stageW / 2;
        container2.y = stageH / 2;
        container2.addChild(container1);
        var t2 = new egret.Timer(30);
        t2.addEventListener(egret.TimeEvent.TIMER, function () {
            container.rotation++;
            // sky.y += 10;
        }, this);
        t2.start();
        // let container3 = new egret.DisplayObjectContainer();
        // container3.x = 350;
        // container3.y = 350
        // container3.addChild(icon2);
        this.addChild(container2);
        /**
         * http测试
         */
        var request = new egret.HttpRequest();
        request.open("http://httpbin.org/get", egret.HTTPMethod.GET);
        request.send();
        request.addEventListener(egret.Event.COMPLETE, function (e) {
            egret.console_log("收到http信息", e.data);
        }, this);
        /**
         * Sound测试
         */
        //测试用地址，之后会改变调用方式
        var soundPath = "script/demo/tinyfly/music/race_background.mp3";
        var sound = new egret.Sound();
        sound.load(soundPath);
        sound.type = egret.Sound.MUSIC;
        egret.setTimeout(function () {
            sound.play();
        }, this, 3000);
        // sound.play(0, 1);
        egret.setTimeout(function () {
            egret.console_log("暂停");
            // sound.close();
            sound.pause();
            // BK.Audio.switch = false;
        }, this, 6000);
        egret.setTimeout(function () {
            egret.console_log("继续");
            sound.resume();
        }, this, 9000);
        egret.setTimeout(function () {
            egret.console_log("结束");
            sound.close();
        }, this, 12000);
        egret.setTimeout(function () {
            egret.console_log("重新开始");
            sound.play();
        }, this, 14000);
        /**
         * 新加入的点击事件测试代码
         */
        this.icon = icon;
        icon2.touchEnabled = true;
        icon2.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
        }, this);
        container1.touchChildren = false;
        container1.touchEnabled = true;
        container1.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
            console_log("点击container1,   x:", e.stageX, "   y:", e.stageY);
        }, this);
        // sky.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (e: egret.TouchEvent) => {
        //     console_log("移动开始,touchID   : ", e.touchPointID);
        //     this.lastX = e.stageX;
        //     this.lastY = e.stageY;
        // }, this);
        // sky.addEventListener(egret.TouchEvent.TOUCH_MOVE, (e: egret.TouchEvent) => {
        //     console_log("移动中,touchID   : ", e.touchPointID);
        //     let movementX = e.stageX - this.lastX;
        //     let movementY = e.stageY - this.lastY;
        //     icon2.x = icon2.x + movementX;
        //     icon2.y = icon2.y + movementY;
        //     console_log(`icon2.x: ${icon2.x} ,  icon2.y: ${icon2.y}`);
        //     this.lastX = e.stageX;
        //     this.lastY = e.stageY;
        // }, this);
        // sky.addEventListener(egret.TouchEvent.TOUCH_END, (e: egret.TouchEvent) => {
        //     console_log("移动结束,touchID   : ", e.touchPointID);
        //     this.lastX = 0;
        //     this.lastY = 0;
        // }, this);
        var colorLabel = new egret.TextField();
        colorLabel.textColor = 0xffffff;
        colorLabel.textWidth = stageW - 172;
        colorLabel.textAlign = "center";
        colorLabel.text = "Hello Egret";
        // colorLabel.stroke = 10;
        // colorLabel.strokeColor = 0xff0000;
        // colorLabel.textAlign = egret.HorizontalAlign.LEFT;
        // colorLabel.size = 24;
        colorLabel.size = 60;
        colorLabel.x = 172;
        colorLabel.y = 80;
        this.addChild(colorLabel);
        var textfield = new egret.TextField();
        textfield.alpha = 0;
        textfield.textWidth = stageW - 172;
        textfield.textAlign = egret.HorizontalAlign.CENTER;
        // textfield.size = 24;
        textfield.size = 60;
        textfield.textColor = 0xffffff;
        textfield.x = 172;
        textfield.y = 135;
        this.textfield = textfield;
        this.addChild(textfield);
        var texPath = "GameRes://resource/texture/spritesheet/test.png";
        var jsonPath = "GameRes://resource/texture/spritesheet/test.json";
        var spritesheet = new egret.SpriteSheet(texPath, jsonPath);
        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json.
        // RES.getResAsync("description_json", this.startAnimation, this)
        /** 可以读取json但是无法转位富文本，先写个代替的string组 */
        var json = RES.getRes("fighter.json");
        // console_log("读取json： ", json);
        var result = ["Open-source,Free,Multi-platform", "Push Game Forword", "HTML5 Game Engine"];
        this.startAnimation(result);
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    Main.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        // // let texture: egret.Texture = RES.getRes(name);
        // let arr = name.split("_");
        // arr.pop();
        // let _name = ""
        // arr.map((value, index) => {
        //     _name += (index < arr.length - 1) ? value + "_" : value;
        // });
        console_log("name: ", name);
        var texture = RES.getRes(name); //改写为根据地址读取
        // let texture2: egret.Texture = RES.getRes("resource/texture/Egret/" + _name + "_png");//改写为根据地址读取
        result.texture = texture;
        return result;
    };
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    Main.prototype.startAnimation = function (result) {
        var _this = this;
        console_log("描述文件加载成功，开始播放动画");
        var twGroup = [
            { x: this.defaultX + 200, y: this.defaultY },
            { x: this.defaultX + 200, y: this.defaultY + 200 },
            { x: this.defaultX, y: this.defaultY }
        ];
        var textfield = this.textfield;
        var count = -1;
        var change = function () {
            egret.console_log();
            count++;
            if (count >= result.length) {
                count = 0;
            }
            // 切换描述内容
            // Switch to described content
            textfield.text = result[count];
            var tw = egret.Tween.get(textfield);
            var icon_tw = egret.Tween.get(_this.icon);
            tw.to({ "alpha": 1 }, 200);
            icon_tw.to({ "x": twGroup[count].x, "y": twGroup[count].y }, 400, egret.Ease.backIn);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, _this);
        };
        change();
    };
    return Main;
}(egret.DisplayObjectContainer));
// var stage = egret.lifecycle.stage;
egret.stage.name = "stage";
var main = new Main();
console_log(0, 0, "main.x: " + main.x);
console_log(0, 0, "main.y: " + main.y);
console_log(0, 0, "main.node.x: " + main.$node.position.x);
console_log(0, 0, "main.node.y: " + main.$node.position.y);
main.name = "main";
egret.stage.addChild(main);
console_log(0, 0, "main.x: " + main.x);
console_log(0, 0, "main.y: " + main.y);
console_log(0, 0, "main.node.x: " + main.$node.position.x);
console_log(0, 0, "main.node.y: " + main.$node.position.y);
var t = new egret.Timer(30, 0);
t.addEventListener(egret.TimeEvent.TIMER, function () {
    RES.ResourceEvent.dispatchProgressEvent(RES.resItem, "preload", loaded, total);
    egret.console_log("\u8FDB\u5EA6  " + loaded + "/" + total + "%");
    if (loaded >= total) {
        RES.ResourceEvent.dispatchRESEvent(RES.resItem, RES.ResourceEvent.GROUP_COMPLETE, false, false, "preload");
        console_log("触发GROUP_COMPLETE");
        t.stop();
    }
    loaded++;
}, this);
var loaded = 0;
var total = 100;
egret.setTimeout(function () {
    RES.ResourceEvent.dispatchRESEvent(RES.resItem, RES.ResourceEvent.CONFIG_COMPLETE);
    console_log("触发CONFIG_COMPLETE: " + loaded + "%");
    t.start();
}, this, 1000);
function console_log() {
    var others = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        others[_i] = arguments[_i];
    }
    var str = "";
    if (others)
        for (var _a = 0, others_1 = others; _a < others_1.length; _a++) {
            var other = others_1[_a];
            str += other;
        }
    BK.Script.log(0, 0, str);
}
