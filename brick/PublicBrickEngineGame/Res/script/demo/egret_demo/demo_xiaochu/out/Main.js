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
BK.Script.loadlib("GameRes://script/demo/tests/egret.js");
BK.Script.loadlib("GameRes://script/demo/tests/tween.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_xiaochu/out/GameLogic.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_xiaochu/out/data/MapDataParse.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_xiaochu/out/data/LevelGameDataParse.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_xiaochu/out/data/GameData.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_xiaochu/out/data/MapControl.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_xiaochu/out/view/PropViewManage.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_xiaochu/out/view/GameBackGround.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_xiaochu/out/view/LevelReqViewManage.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_xiaochu/out/view/ElementViewManage.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_xiaochu/out/data/LinkLogic.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_xiaochu/out/event/ElementViewManageEvent.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_xiaochu/out/view/GameOverPanel.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_xiaochu/out/data/PropLogic.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_xiaochu/out/data/element/BaseElement.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_xiaochu/out/data/LevelRequire.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_xiaochu/out/data/element/GameElement.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_xiaochu/out/data/element/LevelRequireElement.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_xiaochu/out/view/ElementView.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_xiaochu/out/view/LevelElementView.js");
BK.Script.loadlib("GameRes://script/demo/egret_demo/demo_xiaochu/out/view/PropView.js");
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main.prototype.onAddToStage = function (event) {
        //egret.Profiler.getInstance().run();
        //初始化Resource资源加载库
        //initiate Resource loading library
        // RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        // RES.loadConfig("resource/resource.json", "resource/");
        this.createGameScene();
    };
    Main.prototype.createGameScene = function () {
        BK.Script.log(0, 0, "创建游戏界面");
        this._gameLayer = new egret.DisplayObjectContainer();
        this.addChild(this._gameLayer);
        this._gameLogic = new GameLogic(this._gameLayer);
        // let t = new egret.Timer(50);
        // t.addEventListener(egret.TimeEvent.TIMER, () => {
        //     this._gameLayer.rotation++;
        // }, this);
        // t.start();
    };
    Main.prototype.acreateGameScene = function () {
        GameData.initData(); //初始化数据
        var leveldata = RES.getRes("l1_json"); //初始化GameData数据
        MapDataParse.createMapData(leveldata.map); //创建地图数据
        LevelGameDataParse.parseLevelGameData(leveldata); //解析游戏关卡数据
        //console.log("ddd");
        //console.log(GameData.unuseeElements);
        var mapc = new MapControl();
        mapc.createElementAllMap();
        console.log(GameData.mapData);
        console.log(GameData.elements);
        //*************** test code ******************
        // var gbg: GameBackGround = new GameBackGround();
        // this.addChild(gbg);
        // gbg.changeBackground();
        // var cc: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
        // this.addChild(cc);
        // this.evm = new ElementViewManage(cc);
        // this.touchEnabled = true;
        // this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.click, this);
        /*this.darwbitmap();


        this.drawd();



        var s1:egret.Shape = new egret.Shape();
        s1.graphics.beginFill(0x00ff00);
        s1.graphics.lineStyle(5,0xff0000);
        s1.graphics.drawRect(0,0,GameData.stageW,50);
        s1.graphics.endFill();
        s1.y = 400;
        this.addChild(s1);

        var ss:egret.Shape = new egret.Shape();
        ss.graphics.beginFill(0x0000ff);
        ss.graphics.lineStyle(5,0xff0000);
        ss.graphics.drawRect(0,0,30,GameData.stageH);
        ss.graphics.endFill();
        ss.x = GameData.stageW - 40;
        this.addChild(ss);
*/
    };
    Main.prototype.click = function (evt) {
        this.evm.showAllElement();
        /*this.drawd();
        var rel = LinkLogic.isHaveLine();
        console.log(rel);
        console.log(LinkLogic.lines);

        rel = LinkLogic.isNextHaveLine();
        console.log("是否存在可消除的方块",rel);
*/
        //LinkLogic.changeOrder();
        // this.drawd();
        //this.darwbitmap();
        //this.move();
    };
    Main.prototype.move = function () {
        var l = this.els.length;
        var lo = 0;
        var xx = 0;
        var yy = 0;
        var ll = (GameData.stageW - 40) / GameData.MaxColumn;
        for (var i = 0; i < l; i++) {
            lo = GameData.elements[Number(this.els[i].name)].location;
            yy = (GameData.stageH - (GameData.stageW - 30) / 6 - 60) - ll * GameData.MaxColumn + ll * Math.floor(lo / 8);
            xx = 20 + ll * (lo % 8);
            egret.Tween.get(this.els[i]).to({ x: (xx + ll / 2), y: (yy + ll / 2) }, 700, egret.Ease.cubicInOut);
        }
    };
    Main.prototype.darwbitmap = function () {
        this.els = new Array();
        this.removeChildren();
        this.bgc = new egret.DisplayObjectContainer();
        this.addChild(this.bgc);
        //先贴背景
        var bg = new egret.Bitmap();
        bg.texture = RES.getRes("background_jpg");
        bg.width = GameData.stageW;
        bg.height = GameData.stageH;
        this.bgc.addChild(bg);
        var ll = (GameData.stageW - 40) / GameData.MaxColumn;
        for (var i = 0; i < GameData.MaxRow; i++) {
            for (var t = 0; t < GameData.MaxColumn; t++) {
                if (GameData.mapData[i][t] != -1) {
                    var kuai = new egret.Bitmap();
                    kuai.y = (GameData.stageH - (GameData.stageW - 30) / 6 - 60) - ll * GameData.MaxColumn + ll * i;
                    kuai.x = 20 + ll * t;
                    kuai.width = ll;
                    kuai.height = ll;
                    this.bgc.addChild(kuai);
                    //处理边框
                    if (i == 0) {
                        var bb = new egret.Bitmap();
                        bb.width = ll;
                        bb.height = 6;
                        bb.x = kuai.x; //kuai.x+3;
                        bb.y = kuai.y - 3; //kuai.y-3;
                        bb.texture = RES.getRes("bianheng_jpg");
                        this.bgc.addChild(bb);
                    }
                    if (i == (GameData.MaxRow - 1)) {
                        var bba = new egret.Bitmap();
                        bba.width = ll;
                        bba.height = 6;
                        bba.x = kuai.x; //kuai.x+3;
                        bba.y = ll + kuai.y + 3; //kuai.y-3;
                        bba.scaleY = -1;
                        bba.texture = RES.getRes("bianheng_jpg");
                        this.bgc.addChild(bba);
                    }
                    if (t == 0) {
                        var bbf = new egret.Bitmap();
                        bbf.width = 6;
                        bbf.height = ll;
                        bbf.x = kuai.x - 3; //kuai.x+3;
                        bbf.y = kuai.y; //kuai.y-3;
                        bbf.texture = RES.getRes("bianshu_jpg");
                        this.bgc.addChild(bbf);
                    }
                    if (t == (GameData.MaxColumn - 1)) {
                        var bbd = new egret.Bitmap();
                        bbd.width = 6;
                        bbd.height = ll;
                        bbd.x = ll + kuai.x + 3; //kuai.x+3;
                        bbd.y = kuai.y; //kuai.y-3;
                        bbd.texture = RES.getRes("bianshu_jpg");
                        bbd.scaleX = -1;
                        this.bgc.addChild(bbd);
                    }
                    if ((i % 2 == 0 && t % 2 == 0) || (i % 2 == 1 && t % 2 == 1)) {
                        kuai.texture = RES.getRes("elementbg1_png");
                    }
                    else {
                        kuai.texture = RES.getRes("elementbg2_png");
                    }
                    var el = new egret.DisplayObjectContainer();
                    var ele = new egret.Bitmap();
                    ele.texture = RES.getRes("e" + GameData.elements[GameData.mapData[i][t]].type + "_png");
                    ele.width = kuai.width - 10;
                    ele.height = kuai.height - 10;
                    ele.x = -1 * ele.width / 2;
                    ele.y = -1 * ele.height / 2;
                    el.addChild(ele);
                    el.x = kuai.x + kuai.width / 2;
                    el.y = kuai.y + kuai.height / 2;
                    // el.cacheAsBitmap = true;
                    this.addChild(el);
                    this.els.push(el);
                    el.name = GameData.elements[GameData.mapData[i][t]].id.toString();
                    //console.log(el.name);
                }
            }
        }
        // this.bgc.cacheAsBitmap = true;
    };
    Main.prototype.drawd = function () {
        this.removeChildren();
        var color = 0xffffff;
        for (var i = 0; i < GameData.MaxRow; i++) {
            for (var t = 0; t < GameData.MaxColumn; t++) {
                if (GameData.mapData[i][t] != -1) {
                    //BK.error
                    //暂时注释egret.shape
                    // var shp:egret.Shape = new egret.Shape();
                    // switch( GameData.elements[GameData.mapData[i][t]].type )
                    // {
                    //     case "0":
                    //         color = 0x0000ff;
                    //         break;
                    //     case "1":
                    //         color = 0xff0000;
                    //         break;
                    //     case "2":
                    //         color = 0x00ff00;
                    //         break;
                    //     case "3":
                    //         color = 0xff00ff;
                    //         break;
                    //     case "4":
                    //         color = 0x00ffff;
                    //         break;
                    //     case "5":
                    //         color = 0xffffff;
                    //         break;
                    // }
                    // shp.graphics.beginFill(color);
                    // shp.graphics.lineStyle(1,0);
                    // var ll:number = (GameData.stageW - 40)/GameData.MaxColumn;
                    // shp.graphics.drawRect(0,0,ll,ll);
                    // shp.graphics.endFill();
                    // shp.y = (GameData.stageH - (GameData.stageW - 30)/6 - 60 )-ll*GameData.MaxColumn+ll*i ;
                    // shp.x = 20+ ll*t;
                    // //console.log(shp.x,shp.y);
                    // this.addChild(shp);
                }
            }
        }
        //BK.error
        //暂时注释egret.shape
        // var ww: number = (GameData.stageW - 60) / 6;
        // var yy: number = GameData.stageH - ww - 30;
        // for (var q: number = 0; q < 6; q++) {
        //     var sh: egret.Shape = new egret.Shape();
        //     sh.graphics.beginFill(0x00ffff);
        //     sh.graphics.lineStyle(3, 0xff0000);
        //     sh.graphics.drawRect(0, 0, ww, ww);
        //     sh.graphics.endFill();
        //     sh.x = 30 + ww * q;
        //     sh.y = yy;
        //     this.addChild(sh);
        // }
    };
    return Main;
}(egret.DisplayObjectContainer));
RES.basePath = "resource/egret_resource/demo_xiaochu/resource/configs";
var stage1 = egret.stage;
var main = new Main();
stage1.addChild(main);
BK.Script.log(0, 0, "stage.children长度" + stage1.children.length);
// let t = new egret.Timer(1000);
// t.addEventListener(egret.TimeEvent.TIMER,()=>{
//     egret.console_log("fps: ",egret.stage.frameRate)
// },this);
// t.start()
// let t = new egret.Timer(30);
// t.addEventListener(egret.TimeEvent.TIMER, () => {
//     main.rotation++;
// }, this);
// t.start(); 
