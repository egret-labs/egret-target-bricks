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
var GameObject = (function (_super) {
    __extends(GameObject, _super);
    function GameObject() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GameObject.prototype.onCreate = function () {
    };
    GameObject.prototype.onDestroy = function () {
    };
    GameObject.prototype.check = function () {
    };
    GameObject.prototype.setVisible = function (value) {
        if (this.visible != value) {
            this.visible = value;
            if (this.downDisplay) {
                this.downDisplay.visible = value;
            }
            if (this.upDisplay) {
                this.upDisplay.visible = value;
            }
        }
    };
    GameObject.prototype.setXY = function (x, y) {
    };
    GameObject.prototype.move = function (dt) {
    };
    return GameObject;
}(egret.DisplayObjectContainer));
