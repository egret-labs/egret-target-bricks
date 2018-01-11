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
        var bg = createBitmapByName("bg_png");
        bg.width = egret.stage.stageWidth;
        bg.height = egret.stage.stageHeight;
        this.addChild(bg);
        this.createGameScene();
        this.touchEnabled = true;
        this.touchChildren = false;
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickHandler, this);
    };
    GameScene.prototype.createGameScene = function () {
        this.gameObjectList = [];
        this.displayList = [];
        this.UIContainer = new egret.DisplayObjectContainer;
        this.barrierContainer = new egret.DisplayObjectContainer;
        this.roleContainer = new egret.DisplayObjectContainer;
        this.mileageContainer = new egret.DisplayObjectContainer;
        this.addChild(this.barrierContainer);
        this.addChild(this.roleContainer);
        this.addChild(this.mileageContainer);
        this.addChild(this.UIContainer);
        this.createUI();
        this.createRole();
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
        this.barrierCountText = new egret.TextField();
        this.barrierCountText.x = egret.stage.stageWidth / 2;
        this.barrierCountText.y = 100;
        this.barrierCountText.size = 120;
        this.barrierCountText.stroke = 5;
        this.changeBarrierCount(0);
        this.UIContainer.addChild(this.barrierCountText);
        this.eggCountText = new egret.TextField();
        this.eggCountText.x = 100;
        this.eggCountText.y = 100;
        this.eggCountText.size = 120;
        this.eggCountText.stroke = 5;
        this.changeEggCount(0);
        this.UIContainer.addChild(this.eggCountText);
        var egg_img = createBitmapByName("egg_png");
        egg_img.anchorOffsetX = egg_img.width / 2;
        egg_img.anchorOffsetY = egg_img.height / 2;
        egg_img.y = this.eggCountText.y;
        egg_img.x = this.eggCountText.x + this.eggCountText.width / 2 + 100;
        this.UIContainer.addChild(egg_img);
        this.pauseButton = createBitmapByName("pause_png");
        this.pauseButton.touchEnabled = true;
        this.pauseButton.anchorOffsetX = this.pauseButton.width / 2;
        this.pauseButton.anchorOffsetY = this.pauseButton.height / 2;
        this.pauseButton.x = egret.stage.stageWidth * 9 / 10;
        this.pauseButton.y = 100;
        this.pauseButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            console.log("暂停");
            GameController.GamePause();
        }, this);
        egret.stage.addChild(this.pauseButton);
        var containerStartGame = new egret.DisplayObjectContainer();
        var readyText = new egret.TextField();
        readyText.text = "准备!";
        readyText.size = 180;
        readyText.textColor = 0xFFA500;
        readyText.stroke = 5;
        readyText.strokeColor = 0x000000;
        readyText.anchorOffsetX = readyText.width / 2;
        readyText.anchorOffsetY = readyText.height / 2;
        readyText.x = egret.stage.stageWidth / 2;
        readyText.y = egret.stage.stageHeight / 4;
        containerStartGame.addChild(readyText);
        var hand = createBitmapByName("hand_png");
        hand.anchorOffsetX = hand.width / 2;
        hand.anchorOffsetY = hand.height / 2;
        hand.x = egret.stage.stageWidth / 2;
        hand.y = egret.stage.stageHeight / 2;
        containerStartGame.addChild(hand);
        var startText = new egret.TextField();
        startText.text = "点击开始游戏";
        startText.textAlign = egret.HorizontalAlign.LEFT;
        startText.textWidth = 800;
        startText.size = 100;
        startText.stroke = 8;
        startText.strokeColor = 0x000000;
        startText.anchorOffsetX = startText.width / 2;
        startText.anchorOffsetY = startText.height / 2;
        startText.x = egret.stage.stageWidth / 2;
        startText.y = egret.stage.stageHeight * 2 / 3;
        containerStartGame.addChild(startText);
        this.containerStartGame = containerStartGame;
        this.UIContainer.addChild(containerStartGame);
    };
    /**
     * 创建角色
     */
    GameScene.prototype.createRole = function () {
        console.log("创建角色");
        GameData.player = new Player();
        GameData.player.x = 300;
        GameData.player.y = this.stage.stageHeight / 3;
        this.roleContainer.addChild(GameData.player);
        this.gameObjectList.push(GameData.player);
        this.platform = createBitmapByName("platform_png");
        this.platform.anchorOffsetX = this.platform.width / 2;
        this.platform.x = 300;
        console.log("this._player.defaultHeight", GameData.player.defaultHeight);
        this.platform.y = GameData.player.y + GameData.player.defaultHeight / 2;
        this.roleContainer.addChild(this.platform);
    };
    /**
     * 创建里程,0表示开局时建立，1表示建立新的显示条
     */
    GameScene.prototype.createMileage = function () {
        console.log("创建里程显示");
        var mileage1 = createBitmapByName("floor_png");
        mileage1.y = this.stage.stageHeight - mileage1.height + 20;
        this.mileageContainer.addChild(mileage1);
        var mileage2 = createBitmapByName("floor_png");
        mileage2.y = this.stage.stageHeight - mileage2.height + 20;
        mileage2.x = -mileage2.width;
        this.mileageContainer.addChild(mileage2);
        var mileage3 = createBitmapByName("floor_png");
        mileage3.y = this.stage.stageHeight - mileage3.height + 20;
        mileage3.x = mileage3.width;
        this.mileageContainer.addChild(mileage3);
        var mileage4 = createBitmapByName("floor_png");
        mileage4.y = this.stage.stageHeight - mileage4.height + 20;
        mileage4.x = mileage4.width * 2;
        this.mileageContainer.addChild(mileage4);
        var mileage5 = createBitmapByName("floor_png");
        mileage5.y = this.stage.stageHeight - mileage5.height + 20;
        mileage5.x = -mileage5.width * 2;
        this.mileageContainer.addChild(mileage5);
        GameData.mileageWidth = mileage1.width;
        GameData.groundHeight = mileage3.y;
        console.log("this.mileageWidth: ", GameData.mileageWidth);
    };
    /**
     * 更新时间用
     */
    GameScene.prototype.changeBarrierCount = function (time) {
        this.barrierCountText.text = time + "";
        this.barrierCountText.anchorOffsetX = this.barrierCountText.width / 2;
        this.barrierCountText.anchorOffsetY = this.barrierCountText.height / 2;
    };
    /**
     * 更新鸡蛋显示文本用
     */
    GameScene.prototype.changeEggCount = function (time) {
        this.eggCountText.text = time + "";
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
        if (element && GameData.distance >= element.distance) {
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
