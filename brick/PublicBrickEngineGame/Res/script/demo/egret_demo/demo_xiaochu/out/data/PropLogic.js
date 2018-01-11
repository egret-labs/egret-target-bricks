BK.Script.loadlib("GameRes://script/demo/demo_xiaochu/data/GameData.js");
BK.Script.loadlib("GameRes://script/demo/demo_xiaochu/data/LinkLogic.js");
var PropLogic = (function () {
    function PropLogic() {
    }
    //道具逻辑，仅操作数组
    //道具编号以及说明
    // 1  炸弹   周围上下左右4个元素，加上被点击元素删除爆炸
    // 2  整行   一行都删掉
    // 3  整列   一列都删除
    // 0  同色   相同颜色的都删除
    // 4  铲子   挖出一个点击元素
    PropLogic.useProp = function (proptype, ellocation) {
        switch (proptype) {
            case 0:
                PropLogic.tongse(ellocation);
                break;
            case 1:
                PropLogic.zhadan(ellocation);
                break;
            case 2:
                PropLogic.zhenghang(ellocation);
                break;
            case 3:
                PropLogic.zhenglie(ellocation);
                break;
            case 4:
                PropLogic.chanzi(ellocation);
                break;
        }
    };
    PropLogic.chanzi = function (loc) {
        LinkLogic.lines = new Array();
        LinkLogic.lines.push([GameData.elements[GameData.mapData[Math.floor(loc / 8)][loc % 8]].id]);
    };
    //周围上下左右4个，共9个
    PropLogic.zhadan = function (loc) {
        LinkLogic.lines = new Array();
        var i = Math.floor(loc / 8);
        var t = loc % 8;
        var arr = new Array();
        arr.push(GameData.elements[GameData.mapData[i][t]].id);
        if (i > 0 && GameData.mapData[i - 1][t] != -1) {
            arr.push(GameData.elements[GameData.mapData[i - 1][t]].id);
        }
        if (i < (GameData.MaxRow - 1) && GameData.mapData[i + 1][t] != -1) {
            arr.push(GameData.elements[GameData.mapData[i + 1][t]].id);
        }
        if (t > 0 && GameData.mapData[i][t - 1] != -1) {
            arr.push(GameData.elements[GameData.mapData[i][t - 1]].id);
        }
        if (t < (GameData.MaxColumn - 1) && GameData.mapData[i][t + 1] != -1) {
            arr.push(GameData.elements[GameData.mapData[i][t + 1]].id);
        }
        LinkLogic.lines.push(arr);
    };
    PropLogic.zhenghang = function (loc) {
        LinkLogic.lines = new Array();
        var arr = new Array();
        var i = Math.floor(loc / 8);
        for (var t = 0; t < GameData.MaxColumn; t++) {
            if (GameData.mapData[i][t] != -1) {
                console.log(i, t);
                arr.push(GameData.elements[GameData.mapData[i][t]].id);
            }
        }
        LinkLogic.lines.push(arr);
    };
    PropLogic.zhenglie = function (loc) {
        LinkLogic.lines = new Array();
        var arr = new Array();
        var t = loc % 8;
        for (var i = 0; i < GameData.MaxRow; i++) {
            if (GameData.mapData[i][t] != -1) {
                arr.push(GameData.elements[GameData.mapData[i][t]].id);
            }
        }
        LinkLogic.lines.push(arr);
    };
    PropLogic.tongse = function (loc) {
        LinkLogic.lines = new Array();
        var arr = new Array();
        var type = GameData.elements[GameData.mapData[Math.floor(loc / 8)][loc % 8]].type;
        for (var i = 0; i < GameData.MaxRow; i++) {
            for (var t = 0; t < GameData.MaxColumn; t++) {
                if (GameData.mapData[i][t] != -1 && GameData.elements[GameData.mapData[i][t]].type == type) {
                    arr.push(GameData.elements[GameData.mapData[i][t]].id);
                }
            }
        }
        LinkLogic.lines.push(arr);
    };
    return PropLogic;
}());
