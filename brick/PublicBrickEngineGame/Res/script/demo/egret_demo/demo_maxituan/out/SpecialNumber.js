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
 * 特殊字的显示
 * Created by cf on 14-6-20.
 */
var SpecialNumber = (function (_super) {
    __extends(SpecialNumber, _super);
    function SpecialNumber() {
        var _this = _super.call(this) || this;
        _this.gap = 2;
        _this.charName = "img_word--";
        return _this;
    }
    /**
     * 设置显示的字符串
     */
    SpecialNumber.prototype.setChar = function (c) {
        if (this.currentChar == c) {
            return;
        }
        this.clear();
        this.currentChar = c + "";
        var w = 0;
        var length = this.currentChar.length;
        for (var i = 0; i < length; i++) {
            var str = this.currentChar.charAt(i);
            try {
                var image = StarlingSwfUtils.createImage(this.charName + str);
                if (image) {
                    image.x = w;
                    w += image.width + this.gap;
                    this.addChild(image);
                }
            }
            catch (e) {
                console.log(e);
            }
        }
    };
    SpecialNumber.prototype.getChar = function () {
        return this.currentChar;
    };
    SpecialNumber.prototype.clear = function () {
        while (this.numChildren) {
            this.removeChildAt(0);
        }
    };
    return SpecialNumber;
}(egret.DisplayObjectContainer));
