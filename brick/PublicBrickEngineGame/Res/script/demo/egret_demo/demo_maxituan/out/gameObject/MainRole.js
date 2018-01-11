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
var MainRole = (function (_super) {
    __extends(MainRole, _super);
    function MainRole() {
        var _this = _super.call(this) || this;
        _this.vyAdd = 60;
        _this.jumpUpVy = -10;
        _this.isJumping = false;
        _this.dt = 0;
        _this.x = CONST.ROLE_X;
        _this.y = CONST.ROLE_Y;
        var animation_png_path = RES.basePath + "/animation_1/animation.png";
        var animation_json_path = RES.basePath + "/animation_1/animation.json";
        var delegate = new DefaultMovieClipDelegate(RES.getRes("animation_json"), animation_png_path, animation_json_path);
        _this.mc = new MovieClip(delegate);
        _this.mc.frameRate = 24;
        _this.addChild(_this.mc);
        _this.changeState("roleRun");
        // egret.Ticker.getInstance().register(this.updatePos, this);
        // 用egret.startTick替代
        _this.lastTime = egret.getTimer();
        egret.startTick(_this.updatePos, _this);
        return _this;
    }
    Object.defineProperty(MainRole.prototype, "y", {
        get: function () {
            return _super.prototype.$getY.call(this);
        },
        set: function (value) {
            _super.prototype.$setY.call(this, value);
        },
        enumerable: true,
        configurable: true
    });
    MainRole.prototype.setFrameRate = function (value) {
        console.log("frameRate:" + value);
        this.mc.frameRate = value;
    };
    MainRole.prototype.death = function () {
        this.changeState("roleDie");
        this.removeListener();
    };
    MainRole.prototype.removeListener = function () {
        // egret.Ticker.getInstance().unregister(this.updatePos, this);
        // 用egret.stopTick替代
        egret.stopTick(this.updatePos, this);
    };
    MainRole.prototype.jump = function (height) {
        if (this.isJumping) {
            return;
        }
        this.jumpUpVy = -height * 4;
        this.vyAdd = -this.jumpUpVy * 1.9;
        this.isJumping = true;
        this.dt = 0;
        // RES.getRes("jumpSound").play(0, 1);
    };
    MainRole.prototype.updatePos = function (timestamp) {
        var dt = timestamp - this.lastTime;
        this.dt += dt / 1000;
        var h = this.dt * (this.jumpUpVy + 1 / 2 * this.vyAdd * this.dt);
        this.y = CONST.ROLE_Y + h;
        if (this.isJumping && this.x > CONST.GAME_WIDTH - 100) {
            if (this.y >= CONST.ROLE_Y - 50) {
                this.y = CONST.ROLE_Y - 50;
                this.isJumping = false;
                this.mc.frameRate = 15;
                this.changeState("roleWin");
                this.removeListener();
                GameScene.current.win();
                return;
            }
        }
        else if (this.y >= CONST.ROLE_Y) {
            this.y = CONST.ROLE_Y;
            this.isJumping = false;
        }
        if (this.isJumping) {
            this.changeState("roleJump");
        }
        else {
            this.changeState("roleRun");
        }
        this.lastTime = timestamp;
    };
    MainRole.prototype.changeState = function (state) {
        if (CONST.BASE_SPEED <= 3.5) {
            if (state == "roleRun" || state == "roleJump") {
                state = state + "2";
            }
        }
        if (this.currentFrame != state) {
            this.currentFrame = state;
            this.mc.gotoAndPlay(this.currentFrame);
        }
    };
    return MainRole;
}(egret.DisplayObjectContainer));
