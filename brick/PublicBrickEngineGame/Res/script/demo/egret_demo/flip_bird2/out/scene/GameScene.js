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
var GameScene = (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        return _super.call(this) || this;
        // this.addEventListener(egret.Event.ADDED_TO_STAGE, this.initView, this);
    }
    GameScene.prototype.initView = function () {
        var bg = createBitmapByName("bg_yxjm_jpg");
        bg.width = this.stage.stageWidth;
        bg.height = this.stage.stageHeight;
        this.addChild(bg);
        this.createGameScene();
        this.touchEnabled = true;
        this.touchChildren = false;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickHandler, this);
    };
    GameScene.prototype.createGameScene = function () {
        this.gameObjectList = [];
        this.displayList = [];
        this.UI1Container = new egret.DisplayObjectContainer;
        this.UI2Container = new egret.DisplayObjectContainer;
        this.barrierContainer = new egret.DisplayObjectContainer;
        this.roleContainer = new egret.DisplayObjectContainer;
        this.mileageContainer = new egret.DisplayObjectContainer;
        this.seaContainer = new egret.DisplayObjectContainer;
        this.airContainer = new egret.DisplayObjectContainer;
        this.treeContainer = new egret.DisplayObjectContainer;
        this.pauseContainer = new egret.DisplayObjectContainer;
        this.addChild(this.seaContainer);
        this.addChild(this.airContainer);
        this.addChild(this.treeContainer);
        this.addChild(this.barrierContainer);
        this.addChild(this.roleContainer);
        this.addChild(this.mileageContainer);
        this.addChild(this.UI1Container);
        this.addChild(this.UI2Container);
        this.stage.addChild(this.pauseContainer);
        this.createUI();
        this.createRole();
        this.createSea();
        this.crateAir();
        this.crateTree();
        this.createMileage();
    };
    GameScene.prototype.startTicker = function () {
        egret.ticker.$startTick(this.update, this);
    };
    GameScene.prototype.stopTicker = function () {
        egret.ticker.$stopTick(this.update, this);
    };
    /**
     * 创建UI
     */
    GameScene.prototype.createUI = function () {
        console.log("创建UI");
        var offsetH = this.stage.stageHeight / 18;
        this.UI2Container.visible = false;
        this.pauseContainer.visible = false;
        //蛋计数UI
        var eggBg_img = createBitmapByName("nav_bg_png");
        // eggBg_img.anchorOffsetX = eggBg_img.width / 2;
        // eggBg_img.anchorOffsetY = eggBg_img.height / 2;
        eggBg_img.y = 10 + offsetH;
        eggBg_img.x = 30;
        this.UI2Container.addChild(eggBg_img);
        this.eggCountText = new egret.TextField();
        // this.eggCountText.font = RES.getRes("barrie_fnt");
        this.eggCountText.x = 200;
        this.eggCountText.y = 60 + offsetH;
        this.changeEggCount(0);
        this.UI2Container.addChild(this.eggCountText);
        var egg_img = createBitmapByName("icon_cd_png");
        // egg_img.anchorOffsetX = egg_img.width / 2;
        // egg_img.anchorOffsetY = egg_img.height / 2;
        egg_img.y = 15 + offsetH;
        egg_img.x = 60;
        this.UI2Container.addChild(egg_img);
        //障碍计数UI
        this.barrierCountText = new egret.TextField();
        // this.barrierCountText.font = RES.getRes("eggCount_fnt");
        this.UI2Container.addChild(this.barrierCountText);
        this.barrierCountText.x = (this.stage.stageWidth) / 2;
        this.barrierCountText.y = 60 + offsetH;
        // this.barrierCountText.size = 120;
        // this.barrierCountText.stroke = 5
        this.changeBarrierCount(0);
        this.UI2Container.addChild(this.barrierCountText);
        //暂停按钮UI
        var pauseButton = createBitmapByName("btn_suspended_png");
        pauseButton.touchEnabled = true;
        pauseButton.anchorOffsetX = pauseButton.width / 2;
        // pauseButton.anchorOffsetY = pauseButton.height / 2;
        pauseButton.x = this.stage.stageWidth * 9 / 10;
        pauseButton.y = 10 + offsetH;
        pauseButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            console.log("暂停");
            GameController.GamePause();
        }, this);
        while (this.pauseContainer.numChildren > 0)
            this.pauseContainer.removeChildAt(0);
        this.pauseContainer.addChild(pauseButton);
        var containerStartGame = new egret.DisplayObjectContainer();
        var ready_img = createBitmapByName("zb_png");
        ready_img.x = (this.stage.stageWidth - ready_img.width) / 2;
        ready_img.y = 200;
        containerStartGame.addChild(ready_img);
        var hand = createBitmapByName("icon_dj_png");
        hand.anchorOffsetX = hand.width / 2;
        hand.anchorOffsetY = hand.height / 2;
        hand.x = this.stage.stageWidth / 2;
        hand.y = this.stage.stageHeight * .55;
        containerStartGame.addChild(hand);
        var start_img = createBitmapByName("djcxksyx_png");
        start_img.anchorOffsetX = start_img.width / 2;
        start_img.anchorOffsetY = start_img.height / 2;
        start_img.x = this.stage.stageWidth / 2;
        start_img.y = this.stage.stageHeight * .65;
        containerStartGame.addChild(start_img);
        var ho1_img = createBitmapByName("ho1_png");
        containerStartGame.addChild(ho1_img);
        ho1_img.x = this.stage.stageWidth * .2;
        ho1_img.y = this.stage.stageHeight * .4;
        var ho2_img = createBitmapByName("ho2_png");
        containerStartGame.addChild(ho2_img);
        ho2_img.x = this.stage.stageWidth * .65;
        ho2_img.y = this.stage.stageHeight * .55;
        var ho3_img = createBitmapByName("ho3_png");
        containerStartGame.addChild(ho3_img);
        ho3_img.x = this.stage.stageWidth * .75;
        ho3_img.y = this.stage.stageHeight * .55;
        this.containerStartGame = containerStartGame;
        this.UI1Container.addChild(containerStartGame);
    };
    GameScene.prototype.removePause = function () {
        if (this.pauseContainer && this.pauseContainer.parent) {
            this.UI2Container.visible = false;
            while (this.pauseContainer.numChildren > 0)
                this.pauseContainer.removeChildAt(0);
        }
    };
    /**
     * 创建角色
     */
    GameScene.prototype.createRole = function () {
        console.log("创建角色");
        GameData.player = new Player();
        GameData.player.x = this.stage.stageWidth / 2 + 100;
        GameData.player.y = this.stage.stageHeight / 3;
        this.roleContainer.addChild(GameData.player);
        // this.platform.x = this.stage.stageHeight-GameData.player.width/2;
        this.gameObjectList.push(GameData.player);
        this.platform = createBitmapByName("tz_png");
        this.platform.anchorOffsetX = this.platform.width / 2;
        this.platform.x = 300;
        this.platform.x = this.stage.stageWidth / 2;
        console.log("this._player.defaultHeight", GameData.player.defaultHeight);
        this.platform.y = GameData.player.y + GameData.player.defaultHeight / 2 - 3;
        this.roleContainer.addChild(this.platform);
    };
    /**
     * 创建里程,0表示开局时建立，1表示建立新的显示条
     */
    GameScene.prototype.createMileage = function () {
        console.log("创建里程显示");
        var mileage1 = createBitmapByName("floor_new_png");
        mileage1.y = this.stage.stageHeight - mileage1.height + 20;
        this.mileageContainer.addChild(mileage1);
        var mileage2 = createBitmapByName("floor_new_png");
        mileage2.y = this.stage.stageHeight - mileage2.height + 20;
        mileage2.x = -mileage2.width;
        this.mileageContainer.addChild(mileage2);
        var mileage3 = createBitmapByName("floor_new_png");
        mileage3.y = this.stage.stageHeight - mileage3.height + 20;
        mileage3.x = mileage3.width;
        this.mileageContainer.addChild(mileage3);
        var mileage4 = createBitmapByName("floor_new_png");
        mileage4.y = this.stage.stageHeight - mileage4.height + 20;
        mileage4.x = mileage4.width * 2;
        this.mileageContainer.addChild(mileage4);
        var mileage5 = createBitmapByName("floor_new_png");
        mileage5.y = this.stage.stageHeight - mileage5.height + 20;
        mileage5.x = -mileage5.width * 2;
        this.mileageContainer.addChild(mileage5);
        GameData.mileageWidth = mileage1.width;
        GameData.groundHeight = mileage3.y;
        console.log("this.mileageWidth: ", GameData.mileageWidth);
    };
    //背景的云循环显示
    GameScene.prototype.crateAir = function () {
        var airimg_1 = createBitmapByName("yun_png");
        airimg_1.y = 20;
        airimg_1.x = 0;
        this.airContainer.addChild(airimg_1);
        var airimg_2 = createBitmapByName("yun_png");
        airimg_2.y = 20;
        airimg_2.x = airimg_2.width;
        this.airContainer.addChild(airimg_2);
        var airimg_3 = createBitmapByName("yun_png");
        airimg_3.y = 20;
        airimg_3.x = airimg_3.width * 2;
        this.airContainer.addChild(airimg_3);
        GameData.airWidth = airimg_1.width * 3;
    };
    //背景的树循环显示
    GameScene.prototype.crateTree = function () {
        var treeimg_1 = createBitmapByName("island_png");
        treeimg_1.y = this.stage.stageHeight - this.seaContainer.height - treeimg_1.height;
        treeimg_1.x = 0;
        this.treeContainer.addChild(treeimg_1);
        var treeimg_2 = createBitmapByName("island1_png");
        treeimg_2.y = this.stage.stageHeight - this.seaContainer.height - treeimg_2.height;
        treeimg_2.x = treeimg_1.width + treeimg_1.x + 100;
        this.treeContainer.addChild(treeimg_2);
        var treeimg_3 = createBitmapByName("island2_png");
        treeimg_3.y = this.stage.stageHeight - this.seaContainer.height - treeimg_3.height;
        treeimg_3.x = treeimg_2.x + treeimg_2.width + 200;
        this.treeContainer.addChild(treeimg_3);
        var treeimg_4 = createBitmapByName("island_png");
        treeimg_4.y = this.stage.stageHeight - this.seaContainer.height - treeimg_4.height;
        treeimg_4.x = treeimg_3.x + treeimg_3.width + 200;
        this.treeContainer.addChild(treeimg_4);
        var treeimg_5 = createBitmapByName("island1_png");
        treeimg_5.y = this.stage.stageHeight - this.seaContainer.height - treeimg_5.height;
        treeimg_5.x = treeimg_4.x + treeimg_4.width + 200;
        this.treeContainer.addChild(treeimg_5);
        var treeimg_6 = createBitmapByName("island2_png");
        treeimg_6.y = this.stage.stageHeight - this.seaContainer.height - treeimg_6.height;
        treeimg_6.x = treeimg_5.x + treeimg_5.width + 200;
        this.treeContainer.addChild(treeimg_6);
        GameData.treeWidth = this.treeContainer.width;
    };
    //背景的sea循环显示
    GameScene.prototype.createSea = function () {
        var seaimg_1 = createBitmapByName("sea_png");
        seaimg_1.y = this.stage.stageHeight - seaimg_1.height;
        seaimg_1.x = 0;
        this.seaContainer.addChild(seaimg_1);
        var seaimg_2 = createBitmapByName("sea_png");
        seaimg_2.y = this.stage.stageHeight - seaimg_2.height;
        seaimg_2.x = -seaimg_2.width;
        this.seaContainer.addChild(seaimg_2);
        var seaimg_3 = createBitmapByName("sea_png");
        seaimg_3.y = this.stage.stageHeight - seaimg_3.height;
        seaimg_3.x = seaimg_3.width;
        this.seaContainer.addChild(seaimg_3);
        var seaimg_4 = createBitmapByName("sea_png");
        seaimg_4.y = this.stage.stageHeight - seaimg_4.height;
        seaimg_4.x = seaimg_4.width * 2;
        this.seaContainer.addChild(seaimg_4);
        var seaimg_5 = createBitmapByName("sea_png");
        seaimg_5.y = this.stage.stageHeight - seaimg_5.height;
        seaimg_5.x = -seaimg_5.width * 2;
        this.seaContainer.addChild(seaimg_5);
        GameData.seaWidth = seaimg_1.width;
    };
    /**
     * 更新时间用
     */
    GameScene.prototype.changeBarrierCount = function (time) {
        this.barrierCountText.text = time.toString();
        this.barrierCountText.anchorOffsetX = this.barrierCountText.width / 2;
        this.barrierCountText.anchorOffsetY = this.barrierCountText.height / 2;
    };
    /**
     * 更新鸡蛋显示文本用
     */
    GameScene.prototype.changeEggCount = function (time) {
        this.eggCountText.text = time.toString();
        this.eggCountText.anchorOffsetX = this.eggCountText.width / 2;
        this.eggCountText.anchorOffsetY = this.eggCountText.height / 2;
    };
    GameScene.prototype.clickHandler = function (e) {
        if (!GameData.hasStart && !GameData.isAlive) {
            GameController.GameView();
            return;
        }
        if (!GameData.hasStart) {
            GameController.GameStart();
            return;
        }
        GameData.player.jump();
    };
    GameScene.prototype.gameStartView = function () {
        var _this = this;
        this.containerStartGame.visible = false;
        this.UI2Container.visible = true;
        this.pauseContainer.visible = true;
        egret.Tween.get(this.platform).to({ x: -this.platform.width }, 500).call(function () {
            _this.roleContainer.removeChild(_this.platform);
        });
        egret.Tween.get(GameData.player).to({ x: 300 }, 500);
    };
    GameScene.prototype.update = function (timeStamp) {
        if (!GameData.hasStart)
            return true;
        if (this.mileageContainer.x + GameData.mileageWidth < 0)
            this.mileageContainer.x = 0;
        this.mileageContainer.x -= GameData.speed;
        if (this.seaContainer.x + GameData.seaWidth < 0)
            this.seaContainer.x = 0;
        this.seaContainer.x -= GameData.speed;
        if (this.airContainer.x + GameData.airWidth < 0)
            this.airContainer.x = this.stage.stageWidth;
        this.airContainer.x -= GameData.speed;
        if (this.treeContainer.x + GameData.treeWidth < 0)
            this.treeContainer.x = this.stage.stageWidth;
        this.treeContainer.x -= GameData.speed;
        GameData.distance += GameData.speed / 2;
        for (var _i = 0, _a = this.gameObjectList; _i < _a.length; _i++) {
            var gameObject = _a[_i];
            gameObject.update(timeStamp);
        }
        for (var _b = 0, _c = this.displayList; _b < _c.length; _b++) {
            var displayObject = _c[_b];
            displayObject.update(timeStamp);
        }
        this.checkAddElement();
        this.check();
        GameData.lastTime = timeStamp;
        return true;
    };
    GameScene.prototype.checkAddElement = function () {
        var element = GameData.elements[0];
        var target;
        if (element && GameData.distance >= element.distance + GameData.cycle * GameData.maxMileage) {
            if (element.type === "wall") {
                var barrier = new Barrier(element);
                barrier.x = this.stage.stageWidth;
                this.barrierContainer.addChild(barrier);
                target = barrier;
            }
            else if (element.type === "egg") {
                var egg = new Egg(element);
                egg.x = this.stage.stageWidth;
                egg.y = element.y;
                this.barrierContainer.addChild(egg);
                target = egg;
            }
            else if (element.type === "enemy") {
                var enemy = new Enemy(element);
                enemy.x = this.stage.stageWidth;
                enemy.y = element.y;
                this.barrierContainer.addChild(enemy);
                target = enemy;
            }
            this.gameObjectList.push(target);
            GameData.elements.splice(0, 1);
            if (GameData.elements.length <= 0) {
                GameData.elements = RES.getRes("config_json").elements;
                GameData.cycle++;
            }
        }
    };
    GameScene.prototype.check = function () {
        var object = this.gameObjectList[1];
        var player = GameData.player;
        if (object && !object.hasTrigger && GameData.player.x > object.x + GameData.barrierWidth / 2) {
            if (object instanceof Barrier) {
                GameData.barrierCount++;
            }
            this.changeBarrierCount(GameData.barrierCount);
            object.hasTrigger = true;
            this.displayList.push(object);
            this.gameObjectList.splice(1, 1);
        }
        if (object instanceof Egg) {
            if (player.x + player.width / 2 > object.x - object.width / 2 && player.x - player.width / 2 < object.x + object.width / 2) {
                if (player.y - player.width / 2 > object.y - object.height / 2 - player.height && player.y + player.width / 2 < object.y + object.height / 2 + player.height) {
                    GameData.eggCount++;
                    this.changeEggCount(GameData.eggCount);
                    object.hasTrigger = true;
                    var parent_1 = object.parent;
                    parent_1.removeChild(object);
                    this.gameObjectList.splice(1, 1);
                    return;
                }
            }
        }
        var displayObject = this.displayList[0];
        if (displayObject instanceof Barrier && displayObject.x < -100) {
            var parent_2 = displayObject.parent;
            parent_2.removeChild(displayObject);
            this.displayList.splice(0, 1);
            return;
        }
    };
    return GameScene;
}(egret.DisplayObjectContainer));
