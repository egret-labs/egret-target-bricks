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
var GameElement = (function (_super) {
    __extends(GameElement, _super);
    function GameElement() {
        //游戏元素，用于标记当前舞台种出现的元素数据
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = 0; //唯一ID，代表当前舞台上得元素,这个ID要和view中得元素ID对应
        _this.location = 0; //位置坐标，使用0-81来进行记录
        return _this;
    }
    return GameElement;
}(BaseElement));
