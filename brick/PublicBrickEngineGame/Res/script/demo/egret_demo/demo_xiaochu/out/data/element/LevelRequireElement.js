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
// BK.Script.loadlib("GameRes://script/demo/demo_xiaochu/data/element/BaseElement.js");
var LevelRequireElement = (function (_super) {
    __extends(LevelRequireElement, _super);
    function LevelRequireElement() {
        //游戏关卡通关条件数据
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.num = 0; //需要消除得元素数量
        return _this;
    }
    return LevelRequireElement;
}(BaseElement));
