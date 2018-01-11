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
        // this.anchorOffsetX = this.width / 2;
        // this.anchorOffsetY = this.height / 2;
    };
    Player.prototype.createRole = function () {
        // this._role = createBitmapByName("player_png");
        // this.addChild(this._role);
        this.setRoleState("zhan");
        this.defaultWidth = this._role.width;
        this.defaultHeight = this._role.height;
        this.jump_img = createBitmapByName("jump_new_png");
        this.jump_img.anchorOffsetX = this.jump_img.width / 2;
        this.jump_img.anchorOffsetY = this.jump_img.height / 2;
        this.jump_img.x = GameData.player.x;
        this.jump_img.y = GameData.player.y + GameData.player.height / 2;
        this.jump_img.visible = false;
        this.parent.addChild(this.jump_img);
        this.death_img = createBitmapByName("death_new_png");
        this.death_img.anchorOffsetX = this.death_img.width / 2;
        this.death_img.anchorOffsetY = this.death_img.height / 2;
        this.death_img.visible = false;
        this.parent.addChild(this.death_img);
    };
    Player.prototype.setRoleState = function (str) {
        if (this._role && this._role.parent)
            this._role.parent.removeChild(this._role);
        if (str == "zhan") {
            this._role = createBitmapByName("zhan_png");
            // this.addChild(this._role);
        }
        else if (str == "jump") {
            this._role = createBitmapByName("tiao1_png");
            // this.addChild(this._role);
        }
        else if (str == "death") {
            this._role = createBitmapByName("zhuang_png");
            // this.addChild(this._role);
        }
        else if (str == "diao") {
            this._role = createBitmapByName(Math.random() > 0.5 ? "tiao2_png" : "tiao3_png");
            // this.addChild(this._role);
        }
        else if (str == "down") {
            this._role = createBitmapByName("dao_png");
            // this.addChild(this._role);
            this.y += 25; //这里加25是因为dao_png图形比其余状态图形小，像素没铺满。
        }
        this._role.anchorOffsetX = this.width / 2;
        this._role.anchorOffsetY = this.height / 2;
        this._role.x = this._role.y = 0;
        this.addChild(this._role);
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
        this.setRoleState("jump");
        egret.setTimeout(function () {
            _this.jump_img.visible = false;
        }, this, 100);
        egret.setTimeout(function () {
            _this.setRoleState("diao");
        }, this, 400);
    };
    Player.prototype.death = function (isLanding) {
        var _this = this;
        if (isLanding === void 0) { isLanding = false; }
        GameData.isAlive = false;
        this.setRoleState("death");
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
            //小屁屁掉到底部了
            this.setRoleState("down");
        }
    };
    return Player;
}(GameObject));
