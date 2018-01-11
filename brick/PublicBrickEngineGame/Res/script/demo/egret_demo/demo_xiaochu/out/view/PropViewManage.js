// BK.Script.loadlib("GameRes://script/demo/demo_xiaochu/view/PropView.js");
var PropViewManage = (function () {
    function PropViewManage(root) {
        this._currentID = -1;
        this._layer = root;
        this.init();
    }
    PropViewManage.prototype.init = function () {
        this._props = new Array();
        this.testdata();
    };
    PropViewManage.prototype.testdata = function () {
        for (var i = 0; i < 5; i++) {
            var prop = new PropView(i);
            prop.name = "prop" + i;
            // prop._view_activate.name = "prop" + i + "img";
            // prop._view_box.name = "prop" + i + "box";
            // prop._numText.name = "prop" + i + "text"
            // prop.$node.vertexColor = { r: 1, g: 1, b: 1, a: 1 / i + 2 };
            prop.x = 15 + (35 + prop.width) * i;
            // console.log("道具宽度",prop.width);
            egret.console_log("道具宽度", prop.width);
            prop.y = GameData.stageH - prop.height - 10; //- 15;
            egret.console_log("道具位置， ", "prop.x", prop.x, "prop.y", prop.y);
            this._layer.addChild(prop);
            this._props.push(prop);
            prop.num = Math.floor(Math.random() * 5);
            prop.id = i;
            prop.addEventListener(egret.TouchEvent.TOUCH_TAP, this.click, this);
        }
    };
    PropViewManage.prototype.click = function (evt) {
        egret.console_log("触摸道具", evt.currentTarget.name);
        if (this._currentID != -1) {
            this._props[this._currentID].setFocus(false);
            if (this._currentID == evt.currentTarget.id) {
                egret.console_log("取消触摸", this._currentID);
                this._currentID = -1;
                PropViewManage.proptype = -1;
            }
            else {
                this._currentID = evt.currentTarget.id;
                egret.console_log("当前激活道具ID", this._currentID);
                this._props[this._currentID].setFocus(true);
                PropViewManage.proptype = this._props[this._currentID].proptype;
            }
        }
        else {
            this._currentID = evt.currentTarget.id;
            egret.console_log("当前激活道具ID", this._currentID);
            this._props[this._currentID].setFocus(true);
            PropViewManage.proptype = this._props[this._currentID].proptype;
        }
    };
    PropViewManage.prototype.useProp = function () {
        egret.console_log("当前焦点ID", this._currentID);
        this._props[this._currentID].num--;
        this._props[this._currentID].setFocus(false);
        this._currentID = -1;
        PropViewManage.proptype = -1;
    };
    PropViewManage.proptype = -1; //道具类型
    return PropViewManage;
}());
