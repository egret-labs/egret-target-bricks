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
        var topMask = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.5);
        topMask.graphics.drawRect(0, 0, stageW, 172);
        topMask.graphics.endFill();
        topMask.y = 220;
        this.addChild(topMask);
        var shp1 = new egret.Shape();
        shp1.graphics.beginFill(0xff0000);
        shp1.graphics.moveTo(100, 100);
        shp1.graphics.lineTo(300, 200);
        shp1.graphics.lineTo(200, 500);
        shp1.graphics.lineTo(0, 550);
        shp1.graphics.lineTo(-100, 220);
        shp1.graphics.lineTo(100, 100);
        shp1.graphics.endFill();
        shp1.x = 200;
        shp1.y = 0;
        this.addChild(shp1);
        var shp2 = new egret.Shape();
        shp2.graphics.beginFill(0x00ff00);
        shp2.graphics.moveTo(100, 100);
        shp2.graphics.lineTo(300, 200);
        shp2.graphics.lineTo(200, 500);
        shp2.graphics.lineTo(-100, 220);
        shp2.graphics.lineTo(0, 550);
        shp2.graphics.lineTo(100, 100);
        shp2.graphics.endFill();
        this.addChild(shp2);
        shp2.x = 200;
        shp2.y = 300;
        var shp3 = new egret.Shape();
        shp3.graphics.beginFill(0x0000ff);
        shp3.graphics.moveTo(100, 100);
        shp3.graphics.lineTo(-100, 220);
        shp3.graphics.lineTo(0, 550);
        shp3.graphics.lineTo(200, 500);
        shp3.graphics.lineTo(300, 200);
        shp3.graphics.lineTo(100, 100);
        shp3.graphics.endFill();
        this.addChild(shp3);
        shp3.x = 200;
        shp3.y = 600;
        var textfield = new egret.TextField();
        this.addChild(textfield);
        textfield.text = "123";
        var t = new egret.Timer(1000);
        t.addEventListener(egret.TimerEvent.TIMER, function () {
            console.log(BK.Director.fps);
            textfield.text = Math.floor(BK.Director.fps) + "";
        }, this);
        t.start();
        // let imageLoader = new egret.ImageLoader();
        // imageLoader.addEventListener(egret.Event.COMPLETE, (data) => {
        //     let texture = new egret.Texture();
        //     texture.bitmapData = data;
        //     let image = new egret.Bitmap(texture);
        //     this.addChild(image);
        // }, this);
        // (BK.MQQ.Account as any).getHeadEx(GameStatusInfo.openId, (openId, imgUrl) => {
        //     if ("" != imgUrl) {
        //         imageLoader.load(imgUrl);
        //     }
        // });
        //同时测试websokcet
        // this.socketTest();
    };
    // socket: egret.WebSocket;
    // socketTest() {
    //     this.socket = new egret.WebSocket();
    //     //设置数据格式为二进制，默认为字符串
    //     this.socket.type = egret.WebSocket.TYPE_BINARY;
    //     //添加收到数据侦听，收到数据会调用此方法
    //     this.socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
    //     //添加链接打开侦听，连接成功会调用此方法
    //     this.socket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
    //     //添加链接关闭侦听，手动关闭或者服务器关闭连接会调用此方法
    //     this.socket.addEventListener(egret.Event.CLOSE, this.onSocketClose, this);
    //     //添加异常侦听，出现异常会调用此方法
    //     this.socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSocketError, this);
    //     //连接服务器
    //     this.socket.connect("10.0.11.142", 8081);
    // };
    // /**
    //  * 接受信息
    //  */
    // onReceiveMessage(e) {
    //     //接收字符串
    //     // let msg = this.socket.readUTF();
    //     // let data = JSON.parse(msg);
    //     // console.log("收到信息", data);
    //     //接收二进制
    //     let byte = new egret.ByteArray();
    //     this.socket.readBytes(byte);
    //     let str = byte.readUTF();
    //     // let str1 = this.socket.readUTF();
    //     // let boo: boolean = byte.readBoolean();
    //     // let num: number = byte.readInt();
    //     // let msg = this.socket.readUTF();
    //     // let data = JSON.parse(msg);
    //     // console.log(`收到信息,str:  ${str}  ,bool: ${boo}   ,num: ${num}`);
    // };
    // /**
    //  * 连接成功
    //  */
    // onSocketOpen() {
    //     console.log("socket连接成功");
    //     let date = {
    //         name: "ajknjnzkjxn",
    //         age: 12131328,
    //         url: "http://10.0.11.9:8081"
    //     };
    //     let str = JSON.stringify(date);
    //     // this.socket.writeUTF(str);
    //     let byte = new egret.ByteArray();
    //     byte.writeUTF(str);
    //     this.socket.writeBytes(byte);
    //     //准备写信息
    // };
    // /**
    //  * 服务器关闭
    //  */
    // onSocketClose() {
    //     console.log("服务器关闭");
    // };
    // /**
    //  * 出现异常
    //  */
    // onSocketError() {
    //     console.log("服务器异常");
    // };
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
        // let parser = new egret.HtmlTextParser();
        // let textflowArr = result.map(text => parser.parse(text));
        // let textfield = this.textfield;
        // let count = -1;
        // let change = () => {
        //     count++;
        //     if (count >= textflowArr.length) {
        //         count = 0;
        //     }
        //     let textFlow = textflowArr[count];
        //     // 切换描述内容
        //     // Switch to described content
        //     textfield.textFlow = textFlow;
        //     let tw = egret.Tween.get(textfield);
        //     tw.to({ "alpha": 1 }, 200);
        //     tw.wait(2000);
        //     tw.to({ "alpha": 0 }, 200);
        //     tw.call(change, this);
        // };
        // change();
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
