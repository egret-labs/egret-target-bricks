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
var Player = (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this) || this;
        /**
         * 加速度，每秒钟的速度变化;
         */
        _this.acceleration = 0;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.initView, _this);
        _this.hasTrigger = false;
        return _this;
    }
    Object.defineProperty(Player.prototype, "width", {
        get: function () {
            return this._role.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "height", {
        get: function () {
            return this._role.height;
        },
        enumerable: true,
        configurable: true
    });
    Player.prototype.initView = function () {
        this.createRole();
        this.anchorOffsetX = this.width / 2;
        this.anchorOffsetY = this.height / 2;
    };
    Player.prototype.createRole = function () {
        this._role = createBitmapByName("player_png");
        this.addChild(this._role);
        this.defaultWidth = this._role.width;
        this.defaultHeight = this._role.height;
        this.jump_img = createBitmapByName("jump_png");
        this.jump_img.anchorOffsetX = this.jump_img.width / 2;
        this.jump_img.anchorOffsetY = this.jump_img.height / 2;
        this.jump_img.x = GameData.player.x;
        this.jump_img.y = GameData.player.y + GameData.player.height / 2;
        this.jump_img.visible = false;
        this.parent.addChild(this.jump_img);
        this.death_img = createBitmapByName("death_png");
        this.death_img.anchorOffsetX = this.death_img.width / 2;
        this.death_img.anchorOffsetY = this.death_img.height / 2;
        this.death_img.visible = false;
        this.parent.addChild(this.death_img);
    };
    Player.prototype.jump = function () {
        var _this = this;
        if (this.y < this._role.height)
            return;
        if (!GameData.isAlive)
            return;
        this.acceleration = -GameData.jumpSpeed;
        this.jump_img.x = GameData.player.x;
        this.jump_img.y = GameData.player.y + GameData.player.height / 2;
        this.jump_img.visible = true;
        egret.setTimeout(function () {
            _this.jump_img.visible = false;
        }, this, 100);
    };
    Player.prototype.death = function (isLanding) {
        var _this = this;
        if (isLanding === void 0) { isLanding = false; }
        GameData.isAlive = false;
        if (!isLanding) {
            this.death_img.x = GameData.player.x;
            this.death_img.y = GameData.player.y;
            this.death_img.visible = true;
            egret.setTimeout(function () {
                _this.death_img.visible = false;
            }, this, 300);
        }
    };
    Player.prototype.update = function (timeStamp) {
        this.y += this.acceleration;
        this.acceleration += GameData.gravity;
        if ((this.y + this._role.height / 2) > GameData.groundHeight) {
            this.death(true);
            GameController.GameEnd();
        }
    };
    return Player;
}(GameObject));
