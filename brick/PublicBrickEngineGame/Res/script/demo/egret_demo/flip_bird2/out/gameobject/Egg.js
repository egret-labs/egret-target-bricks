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
var Egg = (function (_super) {
    __extends(Egg, _super);
    function Egg(enemyData) {
        var _this = _super.call(this) || this;
        /**
         * 标志量
         * 判断是水平撞上障碍还是竖直撞上
        */
        _this.isVerticalTrigger = false;
        _this._eggData = enemyData;
        _this.hasTrigger = false;
        _this.createEgg();
        return _this;
    }
    Object.defineProperty(Egg.prototype, "width", {
        get: function () {
            return this.egg_img.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Egg.prototype, "height", {
        get: function () {
            return this.egg_img.height;
        },
        enumerable: true,
        configurable: true
    });
    Egg.prototype.createEgg = function () {
        var data = this._eggData;
        var type = data.type;
        var distance = data.distance;
        var y = data.y;
        this.egg_img = createBitmapByName("egg_new_png");
        this.egg_img.anchorOffsetX = this.egg_img.width / 2;
        this.addChild(this.egg_img);
    };
    Egg.prototype.update = function (timeStamp) {
        this.x -= GameData.speed;
    };
    return Egg;
}(GameObject));
