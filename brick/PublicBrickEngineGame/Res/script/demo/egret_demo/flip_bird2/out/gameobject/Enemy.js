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
BK.Script.loadlib("GameRes://script/demo/egret_demo/flip_bird2/out/gameobject/IGameObject.js");
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy(enemyData) {
        var _this = _super.call(this) || this;
        _this.speed = 1;
        /**
         * 标志量
         * 判断是水平撞上障碍还是竖直撞上
        */
        _this.isVerticalTrigger = false;
        _this._enemyData = enemyData;
        _this.hasTrigger = false;
        _this.isToTarget = true;
        _this.createEgg();
        return _this;
    }
    Object.defineProperty(Enemy.prototype, "width", {
        get: function () {
            return this.enemy_img.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Enemy.prototype, "height", {
        get: function () {
            return this.enemy_img.height;
        },
        enumerable: true,
        configurable: true
    });
    Enemy.prototype.createEgg = function () {
        var data = this._enemyData;
        var type = data.type;
        var distance = data.distance;
        var y = data.y;
        this.enemy_img = createBitmapByName("enemy_new_png");
        this.enemy_img.anchorOffsetX = this.enemy_img.width / 2;
        this.enemy_img.anchorOffsetY = this.enemy_img.height / 2;
        this.addChild(this.enemy_img);
        this.lastTime = egret.getTimer();
    };
    Enemy.prototype.update = function (timeStamp) {
        this.x -= GameData.speed;
        if (this.isToTarget) {
            this.y -= this.speed;
        }
        else {
            this.y += this.speed;
        }
        var player = GameData.player;
        if ((player.x + player.width / 2 > this.x - this.enemy_img.width / 2) && (player.x - player.width / 2 < this.enemy_img.x + this.x + this.enemy_img.width / 2)) {
            //在检测范围内，判断是否碰到障碍（y）
            // if (player.y - player.height / 2 > this.y - this.enemy_img.height / 2 - player.height && player.y + player.height / 2 < this.y + this.enemy_img.height / 2 + player.height) {
            if (Math.sqrt(Math.pow(this.x - player.x, 2) + Math.pow(this.y - player.y, 2)) < GameData.playerRadius + GameData.enemyRadius) {
                if (!GameData.isAlive)
                    return;
                // GameData.isAlive = false;
                GameData.player.death();
                if (this.isVerticalTrigger) {
                    GameData.speed = GameData.speed / 2;
                }
                else {
                    GameData.speed = -GameData.speed / 2;
                }
            }
            else {
                if (!this.isVerticalTrigger && GameData.isAlive) {
                    //进入碰撞范围,但未碰撞，之后发生碰撞都是竖直碰撞
                    this.isVerticalTrigger = true;
                }
            }
        }
        if (timeStamp - this.lastTime >= 1000) {
            if (this.isToTarget) {
                this.isToTarget = false;
                this.lastTime = timeStamp;
                return;
            }
            if (!this.isToTarget) {
                this.isToTarget = true;
                this.lastTime = timeStamp;
                return;
            }
        }
    };
    return Enemy;
}(GameObject));
