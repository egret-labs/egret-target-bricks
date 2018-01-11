var GameController = (function () {
    function GameController() {
        this.menuScene = new MenuScene();
        this.gameScene = new GameScene();
        this.gameOverScene = new GameOverScene();
    }
    Object.defineProperty(GameController, "instance", {
        get: function () {
            if (!this._instance) {
                this._instance = new GameController();
            }
            return this._instance;
        },
        enumerable: true,
        configurable: true
    });
    GameController.prototype.setStage = function (stage) {
        this._stage = stage;
        // GameData.stageWidth = egret.MainContext.instance.stage.stageWidth;
        // GameData.stageHeight = egret.MainContext.instance.stage.stageHeight;
    };
    /**
     * 游戏初始化（进入菜单界面）
     */
    GameController.GameInit = function () {
        // let gameScene = this._instance.gameScene;
        // let menuScene = this._instance.menuScene;
        // let gameOverView = this._instance.gameOverScene;
        var stage = this._instance._stage;
        if (this._instance.gameScene.parent) {
            stage.removeChild(this._instance.gameScene);
            this._instance.gameScene = new GameScene();
        }
        if (this._instance.gameOverScene.parent) {
            stage.removeChild(this._instance.gameOverScene);
            this._instance.gameOverScene = new GameOverScene();
        }
        stage.addChild(this._instance.menuScene);
        this._instance.menuScene.initView();
    };
    /**
     * 进入游戏界面
     */
    GameController.GameView = function () {
        console.log("游戏开始");
        // let gameScene = this._instance.gameScene;
        // let menuScene = this._instance.menuScene;
        // let gameOverView = this._instance.gameOverScene;
        var stage = this._instance._stage;
        if (this._instance.menuScene.parent) {
            stage.removeChild(this._instance.menuScene);
            this._instance.menuScene = new MenuScene();
        }
        if (this._instance.gameOverScene.parent) {
            stage.removeChild(this._instance.gameOverScene);
            this._instance.gameOverScene = new GameOverScene();
        }
        if (this._instance.gameScene.parent) {
            stage.removeChild(this._instance.gameScene);
            this._instance.gameScene = new GameScene();
            console.log("删除主界面");
        }
        GameData.distance = 0;
        GameData.barrierCount = 0;
        GameData.eggCount = 0;
        GameData.isAlive = true;
        this.loadLevelData();
        GameData.elements = GameData.elements.concat();
        stage.addChild(this._instance.gameScene);
        this._instance.gameScene.initView();
    };
    GameController.GameStart = function () {
        GameData.hasStart = true;
        this._instance.gameScene.gameStartView();
        GameData.lastTime = egret.getTimer();
        this._instance.gameScene.startTicker();
        egret.ticker.resume();
        GameData.isPause = false;
    };
    GameController.loadLevelData = function () {
        var levelData = RES.getRes("config_json");
        GameData.elements = levelData.elements;
        GameData.speed = (levelData.properties.speed / 1920) * egret.MainContext.instance.stage.stageHeight;
        GameData.gravity = (levelData.properties.gravity / 1920) * egret.MainContext.instance.stage.stageHeight;
        GameData.jumpSpeed = (levelData.properties.jumpSpeed / 1920) * egret.MainContext.instance.stage.stageHeight;
        GameData.barrierWidth = levelData.properties.barrierWidth;
    };
    /**
     * 游戏结束
     */
    GameController.GameEnd = function () {
        GameData.hasStart = false;
        this._instance.gameScene.stopTicker();
        var gameOverView = this._instance.gameOverScene;
        var stage = this._instance._stage;
        stage.addChild(gameOverView);
        gameOverView.initView();
        stage.removeChild(this._instance.gameScene.pauseButton);
    };
    /**
     * 游戏暂停
     */
    GameController.GamePause = function () {
        if (GameData.isPause) {
            egret.ticker.resume();
            GameData.isPause = false;
        }
        else {
            egret.ticker.pause();
            GameData.isPause = true;
        }
    };
    return GameController;
}());
