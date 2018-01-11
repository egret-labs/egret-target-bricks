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
var FireRingSmall = (function (_super) {
    __extends(FireRingSmall, _super);
    //    private qian:egret.DisplayObject;
    function FireRingSmall() {
        var _this = _super.call(this) || this;
        var animation_png_path = RES.basePath + "/animation_1/animation.png";
        var animation_json_path = RES.basePath + "/animation_1/animation.json";
        var delegate = new DefaultMovieClipDelegate(RES.getRes("animation_json"), animation_png_path, animation_json_path);
        _this.downDisplay = new MovieClip(delegate);
        // (<egret.MovieClip>this.downDisplay).frameRate = 24;
        // (<egret.MovieClip>this.downDisplay).gotoAndPlay("huoquan2Down");
        _this.downDisplay.frameRate = 24;
        _this.downDisplay.gotoAndPlay("huoquan2Down");
        delegate = new DefaultMovieClipDelegate(RES.getRes("animation_json"), animation_png_path, animation_json_path);
        _this.upDisplay = new MovieClip(delegate);
        // (<egret.MovieClip>this.upDisplay).frameRate = 24;
        // (<egret.MovieClip>this.upDisplay).gotoAndPlay("huoquan2Up");
        _this.upDisplay.frameRate = 24;
        _this.upDisplay.gotoAndPlay("huoquan2Up");
        var tou = StarlingSwfUtils.createImage("img_huoquan-tou-1");
        tou.x = -5;
        tou.y = -14 - 56;
        _this.addChild(tou);
        return _this;
        //        this.qian = StarlingSwfUtils.createImage("img_qiandai-1");
        //        this.qian.x = -15;
        //        this.qian.y = 5 - 56;
        //        this.addChild(this.qian);
    }
    FireRingSmall.prototype.onCreate = function () {
        _super.prototype.onCreate.call(this);
        this.isPass = false;
        //        this.qian.visible = true;
    };
    FireRingSmall.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
    };
    FireRingSmall.prototype.move = function (dt) {
        var coefficient = CONST.BASE_SPEED;
        this.x -= dt / coefficient;
        this.downDisplay.x -= dt / coefficient;
        this.upDisplay.x -= dt / coefficient;
    };
    FireRingSmall.prototype.check = function () {
        var role = GameScene.mainRole;
        if (role.x + 10 > this.x - 20 && role.x - 10 < this.x + 20) {
            if (role.y < this.y + 50) {
                if (!this.isPass) {
                    this.isPass = true;
                }
            }
            else if (role.y > this.y + 50 && role.y < this.y + 100) {
                GameScene.current.death();
            }
        }
    };
    FireRingSmall.prototype.setXY = function (x, y) {
        this.x = this.downDisplay.x = this.upDisplay.x = x;
        this.y = this.downDisplay.y = this.upDisplay.y = y;
    };
    FireRingSmall.key = "FireRingSmall";
    return FireRingSmall;
}(GameObject));
