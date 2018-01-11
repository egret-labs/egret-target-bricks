BK.Script.loadlib("GameRes://script/demo/demo_xiaochu/data/GameData.js");
BK.Script.loadlib("GameRes://script/demo/demo_xiaochu/data/LinkLogic.js");
var MapControl = (function () {
    function MapControl() {
    }
    //创建全地图元素
    MapControl.prototype.createElementAllMap = function () {
        this.createAllMap();
    };
    //根据空行创建元素
    //在游戏初始时候
    MapControl.prototype.createElements = function (num) {
        return this.createElementByNumber(num);
    };
    //根据数量创建元素
    //在游戏过程中
    MapControl.prototype.createElementByNumber = function (val) {
        var types = new Array();
        for (var i = 0; i < val; i++) {
            types.push(this.createType());
        }
        return types;
    };
    //创建全部地图元素
    //游戏开始时调用
    MapControl.prototype.createAllMap = function () {
        var len = GameData.MaxColumn * GameData.MaxRow;
        var type = "";
        var havelink = true;
        var id = 0;
        var ztype = "";
        var htype = "";
        for (var i = 0; i < GameData.MaxRow; i++) {
            for (var t = 0; t < GameData.MaxColumn; t++) {
                if (GameData.mapData[i][t] != -1) {
                    while (havelink) {
                        type = this.createType();
                        if (i > 1 && GameData.mapData[i - 1][t] != -1 && GameData.mapData[i - 2][t] != -1) {
                            if (GameData.elements[GameData.mapData[i - 1][t]].type == GameData.elements[GameData.mapData[i - 2][t]].type) {
                                ztype = GameData.elements[GameData.mapData[i - 1][t]].type;
                            }
                        }
                        if (t > 1 && GameData.mapData[i][t - 1] != -1 && GameData.mapData[i][t - 2] != -1) {
                            if (GameData.elements[GameData.mapData[i][t - 1]].type == GameData.elements[GameData.mapData[i][t - 2]].type) {
                                htype = GameData.elements[GameData.mapData[i][t - 1]].type;
                            }
                        }
                        if (type != ztype && type != htype) {
                            havelink = false;
                        }
                    }
                    //type = this.createType();
                    id = GameData.unuseeElements[0];
                    //console.log(id);
                    GameData.elements[id].type = type;
                    GameData.elements[id].location = i * GameData.MaxRow + t;
                    GameData.mapData[i][t] = id;
                    GameData.unuseeElements.shift();
                    havelink = true;
                    ztype = "";
                    htype = "";
                }
            }
        }
    };
    //随机创建一个类型元素
    MapControl.prototype.createType = function () {
        return GameData.elementTyps[Math.floor(Math.random() * GameData.elementTyps.length)].toString();
    };
    //针对某一个数据元素更新它得类型
    MapControl.prototype.changeTypeByID = function (id) {
        GameData.elements[id].type = this.createType();
    };
    //根据当前删除得地图元素，刷新所有元素得位置
    MapControl.prototype.updateMapLocation = function () {
        egret.console_log("根据当前删除得地图元素");
        //吧ID去重
        var ids = new Array();
        var len = LinkLogic.lines.length;
        for (var i = 0; i < len; i++) {
            var l = LinkLogic.lines[i].length;
            for (var t = 0; t < l; t++) {
                var rel = false;
                var ll = ids.length;
                for (var r = 0; r < ll; r++) {
                    if (ids[r] == LinkLogic.lines[i][t]) {
                        rel = true;
                    }
                }
                if (!rel) {
                    this.changeTypeByID(LinkLogic.lines[i][t]);
                    ids.push(LinkLogic.lines[i][t]);
                }
            }
        }
        //ids是此次被删除得元素ID,要更新其他得元素位置，并未这几个IDS定制新的类型和位置
        len = ids.length;
        var colarr = new Array(); //存储列编号得数据，记录共有几列需要移动位置
        for (i = 0; i < len; i++) {
            //GameData.mapData[Math.floor(GameData.elements[ids[i]]/GameData.MaxRow)][GameData.elements[ids[i]]%GameData.MaxColumn] = -2;
            rel = false;
            for (t = 0; t < colarr.length; t++) {
                if (colarr[t] == GameData.elements[ids[i]].location % GameData.MaxColumn) {
                    rel = true;
                }
            }
            if (!rel) {
                colarr.push(GameData.elements[ids[i]].location % GameData.MaxColumn);
            }
        }
        //重新得到当前这列ID的排序
        var colelids;
        len = colarr.length;
        for (i = 0; i < len; i++) {
            var newcolids = new Array();
            var removeids = new Array();
            for (t = GameData.MaxRow - 1; t >= 0; t--) {
                rel = false;
                for (var q = 0; q < ids.length; q++) {
                    if (ids[q] == GameData.mapData[t][colarr[i]]) {
                        removeids.push(ids[q]);
                        rel = true;
                    }
                }
                if (!rel) {
                    if (GameData.mapData[t][colarr[i]] != -1) {
                        newcolids.push(GameData.mapData[t][colarr[i]]);
                    }
                }
            }
            //合并两个数组
            newcolids = newcolids.concat(removeids);
            //将元素重新放入map中，并改变元素Location
            for (t = GameData.MaxRow - 1; t >= 0; t--) {
                if (GameData.mapData[t][colarr[i]] != -1) {
                    GameData.mapData[t][colarr[i]] = newcolids[0];
                    //console.log(newcolids);
                    GameData.elements[newcolids[0]].location = t * GameData.MaxRow + colarr[i];
                    newcolids.shift();
                }
            }
        }
    };
    return MapControl;
}());
