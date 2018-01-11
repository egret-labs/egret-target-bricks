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
var Mileage = (function (_super) {
    __extends(Mileage, _super);
    function Mileage() {
        return _super.call(this) || this;
    }
    Mileage.prototype.init = function () {
        var bg = StarlingSwfUtils.createImage("img_licheng-1");
        var stage = egret.MainContext.instance.stage;
        bg.y = CONST.GAME_HEIGHT - 65;
        this.addChild(bg);
        this.txt = new SpecialNumber();
        this.txt.y = bg.y + 10;
        this.addChild(this.txt);
    };
    Mileage.prototype.setValue = function (value) {
        var c = value + "";
        this.txt.setChar(c);
        this.txt.x = 10 + (4 - c.length) * 8;
    };
    Mileage.prototype.onCreate = function () {
        this.isAdded = true;
    };
    Mileage.key = "Mileage";
    return Mileage;
}(Background));
