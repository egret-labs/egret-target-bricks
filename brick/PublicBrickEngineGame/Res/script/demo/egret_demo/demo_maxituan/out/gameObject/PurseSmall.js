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
 * Created by lcj on 14-8-2.
 */
var PurseSmall = (function (_super) {
    __extends(PurseSmall, _super);
    function PurseSmall() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    PurseSmall.prototype.init = function () {
        this.bitmap = StarlingSwfUtils.createImage("img_qiandai-1");
        this.bitmap.x = -this.bitmap.width >> 1;
        this.addChild(this.bitmap);
        this.mc = GameUtils.createMovieClip();
        this.mc.addEventListener("complete", this.onPlayComplete, this);
        this.addChild(this.mc);
        this.mc.x = 25;
        this.mc.y = 20;
        this.mc.visible = false;
    };
    PurseSmall.prototype.onPlayComplete = function () {
        this.mc.visible = false;
        this.mc.stop();
    };
    PurseSmall.prototype.onCreate = function () {
        _super.prototype.onCreate.call(this);
        this.isPass = false;
        this.bitmap.visible = true;
    };
    PurseSmall.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    PurseSmall.prototype.move = function (dt) {
        var coefficient = CONST.BASE_SPEED;
        this.x -= dt / coefficient;
    };
    PurseSmall.prototype.check = function () {
        var role = GameScene.mainRole;
        if (role.x + 20 > this.x - 15 && role.x - 20 < this.x + 15) {
            if (role.y < this.y + 100) {
                if (!this.isPass) {
                    this.isPass = true;
                    GameScene.current.addScore(1);
                    this.bitmap.visible = false;
                    this.mc.visible = true;
                    this.mc.gotoAndPlay("jinbidonghua");
                }
            }
        }
    };
    PurseSmall.prototype.setXY = function (x, y) {
        this.x = x;
        this.y = y;
    };
    PurseSmall.key = "PurseSmall";
    return PurseSmall;
}(GameObject));
