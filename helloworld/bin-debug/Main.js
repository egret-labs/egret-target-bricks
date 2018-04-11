//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main.prototype.onAddToStage = function (event) {
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin
            context.onUpdate = function () {
            };
        });
        egret.lifecycle.onPause = function () {
            egret.ticker.pause();
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
        };
        this.runGame().catch(function (e) {
            console.log(e);
        });
    };
    Main.prototype.runGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, userInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadResource()];
                    case 1:
                        _a.sent();
                        this.createGameScene();
                        return [4 /*yield*/, RES.getResAsync("description_json")];
                    case 2:
                        result = _a.sent();
                        this.startAnimation(result);
                        return [4 /*yield*/, platform.login()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, platform.getUserInfo()];
                    case 4:
                        userInfo = _a.sent();
                        console.log(userInfo);
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loadingView, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        loadingView = new LoadingUI();
                        this.stage.addChild(loadingView);
                        return [4 /*yield*/, RES.loadConfig("resource/default.res.json", "resource/")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, RES.loadGroup("preload", 0, loadingView)];
                    case 2:
                        _a.sent();
                        this.stage.removeChild(loadingView);
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    Main.prototype.createGameScene = function () {
        var sky = this.createBitmapByName("bg_jpg");
        this.addChild(sky);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        // let topMask = new egret.Shape();
        // topMask.graphics.beginFill(0x000000, 0.5);
        // topMask.graphics.drawRect(0, 0, stageW, 172);
        // topMask.graphics.endFill();
        // topMask.y = 220;
        // this.addChild(topMask);
        // topMask.touchEnabled = true;
        // topMask.addEventListener(egret.TouchEvent.TOUCH_BEGIN, () => {
        //     console.log("触摸mask")
        // }, this);
        // let l = new egret.Shape();
        // l.graphics.lineStyle(2, 0xffffff);
        // l.graphics.moveTo(0, 0);
        // l.graphics.lineTo(0, 117);
        // l.graphics.endFill();
        // l.x = 172;
        // l.y = 61;
        // this.addChild(l);
        // let line = new egret.Shape();
        // line.graphics.lineStyle(2, 0x00ff00);
        // line.graphics.moveTo(100, 100);
        // line.graphics.lineTo(500, 500);
        // line.graphics.endFill();
        // this.addChild(line);
        // let bline = new egret.Shape();
        // bline.graphics.lineStyle(2, 0x00ff00);
        // bline.graphics.moveTo(100, 100);
        // bline.graphics.curveTo(200, 200, 400, 50);
        // bline.graphics.endFill();
        // this.addChild(bline);
        // let icon1 = this.createBitmapByName("bg_jpg");
        // this.addChild(icon1);
        // icon1.x = 400;
        // icon1.y = 220;
        // let icon2 = this.createBitmapByName("bg_jpg");
        // icon2.width = icon2.height = 180;
        // this.addChild(icon2);
        // icon2.x = 400;
        // icon2.y = 220;
        var colorLabel1 = new egret.TextField();
        colorLabel1.width = stageW - 172;
        colorLabel1.textAlign = "center";
        colorLabel1.text = "Hello Egret撒打算打算打算打算打算打算的直线擦拭名字，行，nmnvjahsdksjadlzxicuoiqwexzkljclvjz";
        colorLabel1.textColor = 0x000000;
        colorLabel1.size = 24;
        colorLabel1.width = 300;
        colorLabel1.height = 500;
        colorLabel1.x = 172;
        colorLabel1.y = 80;
        this.addChild(colorLabel1);
        var colorLabel2 = new egret.TextField();
        colorLabel2.width = stageW - 172;
        colorLabel2.textAlign = "center";
        colorLabel2.text = "1456723127947127937987897198247979173712973917928379";
        colorLabel2.textColor = 0x000000;
        colorLabel2.size = 24;
        colorLabel2.width = 300;
        colorLabel2.height = 500;
        colorLabel2.x = 172;
        colorLabel2.y = 200;
        this.addChild(colorLabel2);
        var colorLabel3 = new egret.TextField();
        colorLabel3.width = stageW - 172;
        colorLabel3.textAlign = "center";
        colorLabel3.text = "萨拉赫丁了解了卡家里的家乐福哈里斯就对啦就是老大和跨世纪的辣椒素的灵魂";
        colorLabel3.textColor = 0x000000;
        colorLabel3.size = 24;
        colorLabel3.width = 300;
        colorLabel3.height = 500;
        colorLabel3.x = 172;
        colorLabel3.y = 400;
        this.addChild(colorLabel3);
        var textfield = new egret.TextField();
        this.addChild(textfield);
        textfield.alpha = 0;
        textfield.width = stageW - 172;
        textfield.textAlign = egret.HorizontalAlign.CENTER;
        textfield.size = 24;
        textfield.textColor = 0xffffff;
        textfield.x = 172;
        textfield.y = 135;
        this.textfield = textfield;
        this.touchEnabled = true;
        //增加了缩小按钮
        var audio = RES.getRes("race_background_mp3");
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            // console.log("点击了缩小按钮");
            // BK.QQ.notifyHideGame();
            audio.play(0, 1);
        }, this);
        // (BK.MQQ.Account as any).getHeadEx(GameStatusInfo.openId, (openId, imgUrl) => {
        //     if ("" != imgUrl) {
        //         let bitmapData = new egret.BitmapData(imgUrl);
        //         let texture = new egret.Texture();
        //         texture.bitmapData = bitmapData;
        //         let bitmap = new egret.Bitmap(texture);
        //         this.addChild(bitmap);
        //     }
        // });
        //同时测试websokcet
        // this.socketTest();
        //加载网络资源
        // //bricks 原声
        // let buffer;
        // let BKtexture = new BK.Texture(buffer, width, height);
        // let bitmapData = new egret.BitmapData(BKtexture);
        // let egretTexture = new egret.Texture();
        // egretTexture.bitmapData = bitmapData;
        // let bitmap = new egret.Bitmap();
        // bitmap.texture = egretTexture;
        // this.addChild(bitmap);
        // //webgl
        // let buffer;
        // (BK.FileUtil as any).writeBufferToFile("GameSandBox://image1", buffer);
        // let bitmapData = new egret.BitmapData("GameSandBox://image1.png");
        // let egretTexture = new egret.Texture();
        // egretTexture.bitmapData = bitmapData;
        // let bitmap = new egret.Bitmap();
        // bitmap.texture = egretTexture;
        // this.addChild(bitmap);
        // egret.setTimeout(()=>{
        //     sky.scrollRect = new egret.Rectangle(0, 0, 100, 100);
        // },this,3000);
        // sky.scrollRect = new egret.Rectangle(0, 0, 100, 100);
        // let t = new egret.Timer(50);
        // t.addEventListener(egret.TimerEvent.TIMER, () => {
        //     let rect = sky.scrollRect;
        //     if (rect.x + rect.width >= sky.width) {
        //         rect.width = 100;
        //         rect.y += 20;
        //         sky.y += 20;
        //     }
        //     if (rect.y + rect.height >= sky.height) {
        //         rect.y = 0;
        //         sky.y = 0;
        //     }
        //     rect.width += 20;
        //     sky.scrollRect = rect;
        // }, this);
        // t.start();
        // egret.setTimeout(()=>{
        //     t.stop();
        //     sky.scrollRect = null;
        // },this,10000)
        // let mask = this.createBitmapByName("egret_icon_png");
        // let sprite = this.createBitmapByName("bg_jpg");
        // mask.x = mask.y = 500;
        // this.addChild(sprite);
        //   egret.setTimeout(()=>{
        //       debugger
        //     sprite.mask = mask;
        // },this,3000)
        // let audio = RES.getRes('race_background_mp3');
        // (audio as egret.Sound).play(0,1) 
    };
    Main.prototype.socketTest = function () {
        this.socket = new egret.WebSocket();
        //设置数据格式为二进制，默认为字符串
        this.socket.type = egret.WebSocket.TYPE_BINARY;
        //添加收到数据侦听，收到数据会调用此方法
        this.socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
        //添加链接打开侦听，连接成功会调用此方法
        this.socket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
        //添加链接关闭侦听，手动关闭或者服务器关闭连接会调用此方法
        this.socket.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
        //添加异常侦听，出现异常会调用此方法
        this.socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
        //连接服务器
        this.socket.connect("10.0.11.142", 8081);
    };
    ;
    /**
     * 接受信息
     */
    Main.prototype.onReceiveMessage = function (e) {
        //接收字符串
        // let msg = this.socket.readUTF();
        // let data = JSON.parse(msg);
        // console.log("收到信息", data);
        //接收二进制
        debugger;
        var byte = new egret.ByteArray();
        this.socket.readBytes(byte);
        var str = byte.readUTF();
        // let str1 = this.socket.readUTF();
        debugger;
        // let boo: boolean = byte.readBoolean();
        // let num: number = byte.readInt();
        // let msg = this.socket.readUTF();
        // let data = JSON.parse(msg);
        // console.log(`收到信息,str:  ${str}  ,bool: ${boo}   ,num: ${num}`);
    };
    ;
    /**
     * 连接成功
     */
    Main.prototype.onSocketOpen = function () {
        console.log("socket连接成功");
        debugger;
        var date = {
            name: "ajknjnzkjxn",
            age: 12131328,
            url: "http://10.0.11.9:8081"
        };
        var str = JSON.stringify(date);
        // this.socket.writeUTF(str);
        var byte = new egret.ByteArray();
        byte.writeUTF(str);
        this.socket.writeBytes(byte);
        //准备写信息
    };
    ;
    /**
     * 服务器关闭
     */
    Main.prototype.onSocketClose = function () {
        debugger;
        console.log("服务器关闭");
    };
    ;
    /**
     * 出现异常
     */
    Main.prototype.onSocketError = function () {
        debugger;
        console.log("服务器异常");
    };
    ;
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    Main.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    Main.prototype.startAnimation = function (result) {
        var _this = this;
        var parser = new egret.HtmlTextParser();
        var textflowArr = result.map(function (text) { return parser.parse(text); });
        var textfield = this.textfield;
        var count = -1;
        var change = function () {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            var textFlow = textflowArr[count];
            // 切换描述内容
            // Switch to described content
            textfield.textFlow = textFlow;
            var tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, _this);
        };
        change();
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
//# sourceMappingURL=Main.js.map