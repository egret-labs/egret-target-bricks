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
 * Created by lcj on 14-7-31.
 */
var EndPoint = (function (_super) {
    __extends(EndPoint, _super);
    function EndPoint() {
        return _super.call(this) || this;
    }
    EndPoint.prototype.init = function () {
        var bg = StarlingSwfUtils.createImage("img_taizi_1");
        bg.y = 320;
        this.addChild(bg);
    };
    EndPoint.prototype.onCreate = function () {
        this.isAdded = true;
    };
    EndPoint.prototype.move = function (dt) {
        _super.prototype.move.call(this, dt);
        if (this.x < CONST.GAME_WIDTH - 100) {
            GameScene.current.setIsNearEndPoint(true);
        }
    };
    EndPoint.key = "EndPoint";
    return EndPoint;
}(Background));
