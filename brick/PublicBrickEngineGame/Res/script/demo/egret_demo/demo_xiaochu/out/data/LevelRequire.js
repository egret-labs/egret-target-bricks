// BK.Script.loadlib("GameRes://script/demo/demo_xiaochu/data/element/LevelRequireElement.js");
var LevelRequire = (function () {
    function LevelRequire() {
        this.reqElements = new Array();
    }
    //过卡过关条件数量
    LevelRequire.prototype.getLevelReqNum = function () {
        return this.reqElements.length;
    };
    //添加一个关卡元素，类型与数量
    LevelRequire.prototype.addElement = function (type, num) {
        var element = new LevelRequireElement();
        element.num = num;
        element.type = type;
        this.reqElements.push(element);
    };
    //启动关卡条件修改
    LevelRequire.prototype.openChange = function () {
        this.reqElements = [];
    };
    //减少关卡中得元素数量
    LevelRequire.prototype.changeReqNum = function (type, num) {
        var l = this.getLevelReqNum();
        for (var i = 0; i < l; i++) {
            if (this.reqElements[i].type == type) {
                this.reqElements[i].num -= num;
                // console.log("最新数量",this.reqElements[i].num);
                egret.console_log("最新数量", this.reqElements[i].num);
                return;
            }
        }
    };
    //检测所有关卡元素是否都被删除
    LevelRequire.prototype.isClear = function () {
        var l = this.getLevelReqNum();
        for (var i = 0; i < l; i++) {
            if (this.reqElements[i].num > 0) {
                return false;
            }
        }
        egret.console_log("游戏结束");
        return true;
    };
    return LevelRequire;
}());
