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
var LevelElementView = (function (_super) {
    __extends(LevelElementView, _super);
    function LevelElementView() {
        var _this = _super.call(this) || this;
        _this.eltype = ""; //代表元素类型
        _this.init();
        return _this;
    }
    Object.defineProperty(LevelElementView.prototype, "num", {
        get: function () {
            return Number(this.bittext.text);
        },
        set: function (val) {
            if (val <= 0) {
                //已经没了，显示对号
                if (!this.checkmarkbit) {
                    this.checkmarkbit = new egret.Bitmap();
                    this.checkmarkbit.texture = RES.getRes("checkmark_png");
                    this.checkmarkbit.x = (this.bitmap.width - this.checkmarkbit.width) / 2;
                    this.checkmarkbit.y = this.bitmap.height + this.bitmap.y - this.checkmarkbit.height / 2;
                    this.addChild(this.checkmarkbit);
                    this.removeChild(this.bittext);
                }
            }
            else {
                this.bittext.text = val.toString();
            }
        },
        enumerable: true,
        configurable: true
    });
    LevelElementView.prototype.init = function () {
        this.touchChildren = false;
        if (!this.bitmap) {
            this.bitmap = new egret.Bitmap();
        }
        var bitwidth = (GameData.stageW - 40) / GameData.MaxColumn;
        this.bitmap.width = bitwidth;
        this.bitmap.height = bitwidth;
        this.addChild(this.bitmap);
        this.bittext = new egret.TextField();
        // this.bittext.font = RES.getRes("number_fnt");
        this.bittext.text = "0";
        this.bittext.x = (bitwidth - 100) / 2;
        this.bittext.textColor = 0xff0000;
        this.bittext.y = this.bitmap.height + this.bitmap.y - 100 / 2;
        //this.bittext.scaleX = 0.3;
        //this.bittext.scaleY = 0.3;
        this.addChild(this.bittext);
    };
    LevelElementView.prototype.setTexture = function (val) {
        this.bitmap.texture = RES.getRes(val);
    };
    return LevelElementView;
}(egret.DisplayObjectContainer));
