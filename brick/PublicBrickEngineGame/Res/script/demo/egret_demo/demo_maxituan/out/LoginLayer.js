/**
 * Created by lcj on 14-7-29.
 */
var LoginLayer = (function () {
    function LoginLayer() {
        this.dt = 0;
        this.view = StarlingSwfUtils.createSprite("spr_loginUI");
        this.startBtn = this.view.getMovie("startBtn");
        egret.console_log("得到movie： this.startBtn", this.startBtn);
        StarlingSwfUtils.fixButton(this.startBtn, this.onStart, this);
        this.startBtn.x -= 120;
        this.view.getMovie("moreBtn").visible = false;
        var animation_png_path = RES.basePath + "/animation_1/animation.png";
        var animation_json_path = RES.basePath + "/animation_1/animation.json";
        var delegate = new DefaultMovieClipDelegate(RES.getRes("animation_json"), animation_png_path, animation_json_path);
        this.starMc1 = new MovieClip(delegate);
        this.starMc1.frameRate = 24;
        this.starMc1.x = 260 - 120;
        this.starMc1.y = 570;
        this.view.addChild(this.starMc1);
        this.starMc1.gotoAndPlay("star");
        egret.console_log("播放this.starMc1");
        var delegate = new DefaultMovieClipDelegate(RES.getRes("animation_json"), animation_png_path, animation_json_path);
        this.starMc2 = new MovieClip(delegate);
        this.starMc2.frameRate = 24;
        this.starMc2.x = 460 - 120;
        this.starMc2.y = 570;
        this.view.addChild(this.starMc2);
        this.starMc2.gotoAndPlay("star");
        egret.console_log("播放this.starMc2");
    }
    LoginLayer.prototype.onStart = function () {
        //        var stage = egret.MainContext.instance.stage;
        //        stage.touchEnabled = stage.touchChildren = false;
        //        this.startBtn.gotoAndPlay(0);
        //        egret.Tween.get(this).wait(1000).call(this.enterGame, this);
        egret.console_log("点击进入游戏按钮");
        this.enterGame();
    };
    LoginLayer.prototype.enterGame = function () {
        //        var stage = egret.MainContext.instance.stage;
        //        stage.touchEnabled = stage.touchChildren = true;
        //        this.startBtn.stop();
        var parent = this.view.parent;
        GameUtils.removeChild(this.view);
        var gameScene = new GameScene();
        egret.console_log("进入游戏界面12212222222222222222222");
        parent.addChild(gameScene);
        this.starMc1.stop();
        this.starMc2.stop();
        //        this.logoMc.stop();
        //BK.error
        //用egret.stopTick()代替
        // egret.Ticker.getInstance().unregister(this.update, this);
        egret.stopTick(this.update, this);
        // RES.getRes("bgSound").play(true);
    };
    LoginLayer.prototype.onMoreGame = function () {
        //console.log("更多游戏");
        //EgretShare.moreGame();
    };
    LoginLayer.prototype.update = function (dt) {
        this.dt += dt;
        if (this.dt > 10000) {
            this.dt -= 10000;
            this.addCloud();
        }
        var length = this.cloudContainer.numChildren;
        for (var i = 0; i < length; i++) {
            var cloud = this.cloudContainer.getChildAt(i);
            cloud.x -= dt / 50;
        }
    };
    LoginLayer.prototype.addCloud = function (x) {
        var num = Math.floor(Math.random() * 2 + 1);
        var cloud = StarlingSwfUtils.createImage("img_yun_" + num);
        this.cloudContainer.addChild(cloud);
        cloud.x = x || (CONST.GAME_WIDTH + 180);
        cloud.y = 30 + Math.floor(Math.random() * 80);
    };
    return LoginLayer;
}());
