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
 * Created by lcj on 14-7-29.
 */
var Background = (function (_super) {
    __extends(Background, _super);
    function Background() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    Background.prototype.init = function () {
        this.background = StarlingSwfUtils.createSprite("spr_bg");
        this.addChild(this.background);
        this.y = 75;
    };
    Background.prototype.win = function () {
        if (this.background) {
            var container = this.background.getMovie("audienceContainer");
            container.gotoAndPlay(0);
        }
    };
    Background.prototype.onCreate = function () {
        this.isAdded = false;
        if (this.background) {
            // this.cacheAsBitmap = false;
            var container = this.background.getMovie("audienceContainer");
            container.gotoAndStop(0);
        }
    };
    Background.prototype.onDestroy = function () {
    };
    Background.prototype.move = function (dt) {
        var coefficient = dt / (CONST.BASE_SPEED * 1.5);
        if (CONST.BASE_SPEED < 0) {
            coefficient = dt / CONST.BASE_SPEED * 1.3;
        }
        this.x -= coefficient;
        if (!this.isAdded && this.x <= 0) {
            this.isAdded = true;
            GameScene.current.addBackground();
        }
    };
    Background.key = "Background";
    return Background;
}(GameObject));
