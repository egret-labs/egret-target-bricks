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
/**
 * Created by lcj on 14-7-28.
 */
var GameScene = (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        var _this = _super.call(this) || this;
        _this.passTime = 0;
        _this.passSecond = 0;
        _this.score = 0;
        _this.score2 = 0;
        for (var i = 0; i < 40; i++) {
            ObjectPool.createObject(PurseBig);
            ObjectPool.createObject(PurseSmall);
        }
        ObjectPool.destroyAllObject();
        GameScene.current = _this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        _this.uiContainer = new egret.DisplayObjectContainer();
        var ui = StarlingSwfUtils.createSprite("spr_mainUI");
        _this.uiContainer.addChild(ui);
        _this.addChild(_this.uiContainer);
        _this.bgContainer = new egret.DisplayObjectContainer();
        _this.bgContainer.y = CONST.OFFSET_Y;
        _this.addBackground();
        _this.addChild(_this.bgContainer);
        _this.mileageContainer = new egret.DisplayObjectContainer();
        _this.addChild(_this.mileageContainer);
        _this.enemyContainerDown = new egret.DisplayObjectContainer();
        _this.addChild(_this.enemyContainerDown);
        var role = new MainRole();
        _this.addChild(role);
        GameScene.mainRole = role;
        _this.enemyContainerMiddle = new egret.DisplayObjectContainer();
        _this.addChild(_this.enemyContainerMiddle);
        _this.enemyContainerUp = new egret.DisplayObjectContainer();
        _this.addChild(_this.enemyContainerUp);
        _this.scoreTxt1 = new SpecialNumber();
        _this.scoreTxt1.x = 175;
        _this.scoreTxt1.y = 50;
        _this.uiContainer.addChild(_this.scoreTxt1);
        _this.scoreTxt2 = new SpecialNumber();
        _this.scoreTxt2.x = 295;
        _this.scoreTxt2.y = 50;
        _this.uiContainer.addChild(_this.scoreTxt2);
        _this.addScore(0);
        _this.addScore2(0);
        return _this;
    }
    GameScene.prototype.onAddToStage = function () {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        var config = RES.getRes("config_json");
        this.config = config.action.concat();
        for (var key in config.properties) {
            CONST[key] = config.properties[key];
        }
        this.startGame();
    };
    GameScene.prototype.startGame = function () {
        this.passTime = 0;
        //BK.error
        //用egret.startTick代替
        // egret.Ticker.getInstance().register(this.update, this);
        this.lastTime = egret.getTimer();
        egret.startTick(this.update, this);
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
        this.distanceList = [];
        this.isWin = false;
        this.isNearEndPoint = false;
        this.setSpeed(CONST.SPEED_NORMAL);
        this.randomOffsetX = 0;
        this.moveX = 0;
        //function onGetInfo():void {
        //    window.localStorage && window.localStorage.setItem && window.localStorage.setItem("uId", uId);
        //    var dataObj = JSON.parse(urlLoader.data);
        //    if(dataObj.top)
        //        CONST.USER_TOP = parseInt(dataObj.top);
        //}
        //var urlLoader = new egret.URLLoader();
        //urlLoader.addEventListener(egret.Event.COMPLETE, onGetInfo, this);
        //var uId = GameUtils.getUId();
        //urlLoader.load(new egret.URLRequest("http://games.egret-labs.org/silvercoin/api.php?uId=" + +uId + "&sign=" + hex_md5(parseInt(uId) + "dJTbCkUpeBcFCLbw9zeu") + "&mod=gameOver"));
    };
    GameScene.prototype.onTouch = function (event) {
        GameScene.mainRole.jump(CONST.JUMP_HEIGHT);
    };
    GameScene.prototype.setSpeed = function (speed) {
        if (this.isNearEndPoint) {
            speed = speed * 1.3;
        }
        CONST.BASE_SPEED = speed;
        var frameRate = speed / CONST.SPEED_NORMAL * 24;
        GameScene.mainRole.setFrameRate(frameRate);
    };
    GameScene.prototype.update = function (timestamp) {
        //扣除奖励积分
        var dt = timestamp - this.lastTime;
        this.passTime += dt;
        this.passSecond = Math.floor(this.passTime / 1000);
        this.moveX += dt / (CONST.BASE_SPEED * 1.5);
        if (this.isNearEndPoint) {
            var mainRole = GameScene.mainRole;
            mainRole.x += dt / (CONST.BASE_SPEED * 1.5);
            this.checkElements(dt, true);
            if (mainRole.x < CONST.ROLE_X) {
                mainRole.x = CONST.ROLE_X;
                this.isNearEndPoint = false;
            }
            return;
        }
        this.checkAddMileage();
        this.checkAddEnemy();
        this.checkElements(dt);
        this.lastTime = timestamp;
    };
    /**
     * 根据配置时间，增加敌人
     */
    GameScene.prototype.checkAddEnemy = function () {
        var moveX = this.getMoveX();
        var config = this.config[0];
        if (!config) {
            this.randomOffsetX = moveX;
            this.getRandomEnemy();
            return;
        }
        if (config && moveX > parseInt(config.distance) + this.randomOffsetX) {
            switch (config.type) {
                case "FireRing":
                    this.addFireRing();
                    break;
                case "FireRingSmall":
                    this.addFireRingSmall();
                    break;
                case "Pen":
                    this.addPen();
                    break;
                case "EndPoint":
                    this.addEndPoint();
                    break;
                case "BaseSpeed":
                    this.setSpeed(config.value);
                    break;
                case "Purse":
                    this.addPurse(config.purseType, config.y);
                    break;
            }
            //console.log("distance:"+config.distance);
            this.config.splice(0, 1);
            this.checkAddEnemy(); //重新检测一遍
        }
    };
    GameScene.prototype.getRandomEnemy = function () {
        var list = RES.getRes("config_json").random;
        var random = Math.floor(Math.random() * list.length);
        this.config = list[random].concat();
        console.log("开始随机怪,随机到第" + (random + 1) + "组怪");
    };
    /**
     * 检测是否需要加米数显示
     */
    GameScene.prototype.checkAddMileage = function () {
        this.distance = Math.floor(this.getMoveX() / CONST.PIXEL_PER_MILEAGE);
        var distance = this.distance;
        distance += 10;
        //加米数
        if (distance % 10 == 0 && this.distanceList.indexOf(distance) == -1) {
            this.distanceList.push(distance);
            var mileage = ObjectPool.createObject(Mileage);
            mileage.setValue(distance);
            mileage.x = CONST.GAME_WIDTH + 200;
            this.mileageContainer.addChild(mileage);
        }
    };
    /**
     * 加一个小钱袋
     */
    GameScene.prototype.addPurse = function (type, y) {
        var purse;
        if (type == 1) {
            purse = ObjectPool.createObject(PurseSmall);
        }
        else {
            purse = ObjectPool.createObject(PurseBig);
        }
        if (y) {
            y += CONST.OFFSET_Y;
        }
        purse.setXY(CONST.GAME_WIDTH + 50, y || CONST.ROLE_Y - 220);
        this.enemyContainerMiddle.addChild(purse);
    };
    /**
     * 加一个小火圈
     */
    GameScene.prototype.addFireRingSmall = function () {
        var fireRingSmall = ObjectPool.createObject(FireRingSmall);
        fireRingSmall.setXY(CONST.GAME_WIDTH + 50, CONST.ROLE_Y - 155);
        this.enemyContainerUp.addChild(fireRingSmall);
        this.enemyContainerUp.addChild(fireRingSmall.upDisplay);
        this.enemyContainerDown.addChild(fireRingSmall.downDisplay);
    };
    /**
     * 检测
     */
    GameScene.prototype.checkElements = function (dt, special) {
        if (special === void 0) { special = false; }
        var children = ObjectPool.list;
        var length = children.length;
        for (var i = 0; i < length; i++) {
            var gameObject = children[i];
            if (!special) {
                gameObject.move(dt);
            }
            else if (gameObject.key == FireRing.key || gameObject.key == FireRingSmall.key) {
                gameObject.move(dt);
            }
            if (gameObject.x < -CONST.GAME_WIDTH) {
                ObjectPool.destroyObject(gameObject);
                length--;
                i--;
            }
            else {
                //                gameObject.setVisible(true);
                gameObject.check();
            }
        }
    };
    /**
     * 加一个终点
     */
    GameScene.prototype.addEndPoint = function () {
        this.addPen();
        var endPoint = ObjectPool.createObject(EndPoint);
        endPoint.x = CONST.GAME_WIDTH + 75;
        this.mileageContainer.addChild(endPoint);
    };
    /**
     * 加一个火盆
     */
    GameScene.prototype.addPen = function () {
        var pen = ObjectPool.createObject(Pen);
        pen.setXY(CONST.GAME_WIDTH + 50, CONST.ROLE_Y);
        this.enemyContainerUp.addChild(pen);
    };
    /**
     * 加一个火圈
     */
    GameScene.prototype.addFireRing = function () {
        var fireRing = ObjectPool.createObject(FireRing);
        fireRing.setXY(CONST.GAME_WIDTH + 50, CONST.ROLE_Y - 140 + 8);
        this.enemyContainerUp.addChild(fireRing.upDisplay);
        this.enemyContainerUp.addChild(fireRing);
        this.enemyContainerDown.addChild(fireRing.downDisplay);
    };
    GameScene.prototype.getMoveX = function () {
        //        var firstBg = this.bgContainer.getChildAt(0);
        //        return -firstBg.x;
        return this.moveX;
    };
    /**
     * 加金币。。
     */
    GameScene.prototype.addScore = function (score) {
        this.score += score;
        this.scoreTxt1.setChar(this.score);
    };
    /**
     * 加银币。。
     */
    GameScene.prototype.addScore2 = function (score) {
        this.score2 += score;
        this.scoreTxt2.setChar(this.score2);
    };
    GameScene.prototype.death = function () {
        if (CONST.CAN_DEATH) {
            this.removeListener();
            GameScene.mainRole.death();
            this.showResult();
        }
    };
    GameScene.prototype.removeListener = function () {
        //BK.error
        //用egret.stopTick代替
        // egret.Ticker.getInstance().unregister(this.update, this);
        egret.stopTick(this.update, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
    };
    GameScene.prototype.showResult = function () {
        function show() {
            egret.console_log("显示结局");
            GameUtils.unlock();
            var resultLayer = new ResultLayer();
            this.parent.addChild(resultLayer.view);
            resultLayer.updateData(this.score, this.score2);
            egret.Tween.get(this).to({ scoreNum: 0, scoreNum2: 0 }, 2000);
        }
        GameUtils.lock();
        egret.Tween.get(this).wait(1000).call(show, this);
    };
    GameScene.prototype.addBackground = function () {
        var bg = ObjectPool.createObject(Background);
        if (this.bgContainer.numChildren) {
            bg.x = this.bgContainer.getChildAt(this.bgContainer.numChildren - 1).x + CONST.GAME_WIDTH;
        }
        else {
            bg.x = 0;
        }
        this.bgContainer.addChild(bg);
    };
    GameScene.prototype.setIsNearEndPoint = function (value) {
        this.isNearEndPoint = value;
        if (value) {
            this.setSpeed(CONST.BASE_SPEED);
        }
    };
    GameScene.prototype.win = function () {
        if (!this.isWin) {
            this.isWin = true;
            this.removeListener();
            var list = ObjectPool.list;
            var length = list.length;
            for (var i = 0; i < length; i++) {
                var item = list[i];
                if (item.win) {
                    item.win.call(item);
                }
            }
            egret.Tween.get(GameScene.mainRole).to({ x: CONST.GAME_WIDTH - 65 }, 1000).wait(3000).call(this.showResult, this);
        }
    };
    Object.defineProperty(GameScene.prototype, "scoreNum", {
        get: function () {
            return this.score;
        },
        set: function (value) {
            this.scoreTxt1.setChar(Math.floor(value));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameScene.prototype, "scoreNum2", {
        get: function () {
            return this.score2;
        },
        set: function (value) {
            this.scoreTxt2.setChar(Math.floor(value));
        },
        enumerable: true,
        configurable: true
    });
    return GameScene;
}(egret.DisplayObjectContainer));
