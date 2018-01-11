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
var Pen = (function (_super) {
    __extends(Pen, _super);
    function Pen() {
        return _super.call(this) || this;
    }
    Pen.prototype.init = function () {
        var animation_png_path = RES.basePath + "/animation_1/animation.png";
        var animation_json_path = RES.basePath + "/animation_1/animation.json";
        var delegate = new DefaultMovieClipDelegate(RES.getRes("animation_json"), animation_png_path, animation_json_path);
        this.pen = new MovieClip(delegate);
        // (<egret.MovieClip>this.pen).frameRate = 24;
        // (<egret.MovieClip>this.pen).gotoAndPlay("huopen");
        this.pen.frameRate = 24;
        this.pen.gotoAndPlay("huopen");
        this.addChild(this.pen);
    };
    Pen.prototype.onCreate = function () {
        _super.prototype.onCreate.call(this);
        this.isPass = false;
        this.isAdded = true;
    };
    Pen.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    Pen.prototype.check = function () {
        var role = GameScene.mainRole;
        if (role.x + 20 > this.x - 20 && role.x - 10 < this.x + 20) {
            if (role.y > this.y - 50) {
                GameScene.current.death();
            }
            else if (role.y < this.y - 80) {
                if (!this.isPass) {
                    this.isPass = true;
                }
            }
        }
    };
    Pen.prototype.setXY = function (x, y) {
        this.x = x;
        this.y = y;
    };
    Pen.key = "Pen";
    return Pen;
}(Background));
