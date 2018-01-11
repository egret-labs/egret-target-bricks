// BK.Script.loadlib("GameRes://script/demo/demo_xiaochu/data/GameData.js");
// BK.Script.loadlib("GameRes://script/demo/demo_xiaochu/data/LevelRequire.js");
var LevelGameDataParse = (function () {
    function LevelGameDataParse() {
    }
    //针对当前关卡JSON数据，进行解析
    LevelGameDataParse.parseLevelGameData = function (val) {
        GameData.stepNum = val.step;
        GameData.levelStepNum = val.step;
        GameData.elementTyps = val.element;
        GameData.levelBackgrouindImageName = val.levelbgimg;
        LevelGameDataParse.parseLevelReq(val.levelreq);
    };
    //解析过关条件数据
    LevelGameDataParse.parseLevelReq = function (val) {
        //console.log(val);
        GameData.levelreq.openChange();
        var len = val.length;
        for (var i = 0; i < len; i++) {
            GameData.levelreq.addElement(val[i].type, val[i].num);
        }
    };
    return LevelGameDataParse;
}());
