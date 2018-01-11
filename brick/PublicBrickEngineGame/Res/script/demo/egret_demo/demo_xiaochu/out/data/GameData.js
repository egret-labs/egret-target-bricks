// BK.Script.loadlib("GameRes://script/demo/demo_xiaochu/data/LevelRequire.js");
// BK.Script.loadlib("GameRes://script/demo/demo_xiaochu/data/element/GameElement.js");
var GameData = (function () {
    function GameData() {
    }
    //初始化游戏数据，仅仅创建空对象
    GameData.initData = function () {
        GameData.mapData = new Array();
        for (var i = 0; i < GameData.MaxRow; i++) {
            var arr = new Array();
            GameData.mapData.push(arr);
            for (var t = 0; t < GameData.MaxColumn; t++) {
                GameData.mapData[i].push(-2);
            }
        }
        GameData.levelreq = new LevelRequire();
        GameData.elements = new Array();
        GameData.unuseeElements = new Array();
        var len = GameData.MaxColumn * GameData.MaxRow;
        var ele;
        for (var q = 0; q < len; q++) {
            ele = new GameElement();
            ele.id = q;
            GameData.elements.push(ele);
            GameData.unuseeElements.push(q);
        }
        GameData.stageW = egret.stage.stageWidth; //egret.MainContext.instance.stage.stageWidth;///2;
        GameData.stageH = egret.stage.stageHeight - 200; //egret.MainContext.instance.stage.stageHeight;
    };
    GameData.unmapnum = 0; //空白地图块数量
    GameData.stepNum = 0; //玩家剩余步数
    GameData.levelStepNum = 0; //当前关卡步数
    GameData.levelBackgrouindImageName = ""; //当前关卡背景图资源名
    GameData.MaxRow = 8; //最大的行
    GameData.MaxColumn = 8; //最大的列
    GameData.currentElementNum = 0; //当前关卡游戏中地图可用元素数量
    //舞台宽高，此封装为了方便调用
    GameData.stageW = 0;
    GameData.stageH = 0;
    return GameData;
}());
