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
var Barrier = (function (_super) {
    __extends(Barrier, _super);
    function Barrier(enemyData) {
        var _this = _super.call(this) || this;
        /**
         * 标志量
         * 判断是水平撞上障碍还是竖直撞上
        */
        _this.isVerticalTrigger = false;
        _this._barrierData = enemyData;
        _this.hasTrigger = false;
        _this.createBarrier();
        return _this;
    }
    Barrier.prototype.createBarrier = function () {
        var data = this._barrierData;
        var type = data.type;
        var distance = data.distance;
        var y = data.y;
        this.barrier_down = createBitmapByName("polebot_new_png");
        this.barrier_down.anchorOffsetX = this.barrier_down.width / 2;
        this.barrier_down.y = y;
        this.barrier_up = createBitmapByName("polebot_new_png");
        this.barrier_up.anchorOffsetX = this.barrier_up.width / 2;
        this.barrier_up.rotation = 180;
        this.barrier_up.y = this.barrier_down.y - GameData.barrierWidth;
        this.addChild(this.barrier_down);
        this.addChild(this.barrier_up);
    };
    Barrier.prototype.update = function (timeStamp) {
        this.x -= GameData.speed;
        var player = GameData.player;
        if ((player.x + player.width / 2 > this.x - this.barrier_up.width / 2) && (player.x - player.width / 2 < this.barrier_up.x + this.x + this.barrier_up.width / 2)) {
            //在检测范围内，判断是否碰到障碍（y）
            //由于图片的大小问题，这里改用GameData中的playerRadius来判断碰撞位置
            if (player.y - GameData.playerRadius < this.barrier_up.y || player.y + GameData.playerRadius > this.barrier_down.y) {
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
    };
    return Barrier;
}(GameObject));
