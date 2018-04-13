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

class Main extends egret.DisplayObjectContainer {



    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin

            context.onUpdate = () => {

            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        this.runGame().catch(e => {
            console.log(e);
        })



    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        const result = await RES.getResAsync("description_json")
        this.startAnimation(result);
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);

    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private textfield: egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        let sky = this.createBitmapByName("bg_jpg");
        this.addChild(sky);
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;

        let topMask = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.5);
        topMask.graphics.drawRect(0, 0, stageW, 172);
        topMask.graphics.endFill();
        topMask.y = 220;
        this.addChild(topMask);



        let shp1 = new egret.Shape();
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

        let shp2 = new egret.Shape();
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

        let shp3 = new egret.Shape();
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


    }


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
    //     debugger;
    //     let byte = new egret.ByteArray();
    //     this.socket.readBytes(byte);
    //     let str = byte.readUTF();
    //     // let str1 = this.socket.readUTF();
    //     debugger;
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
    //     debugger;
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
    //     debugger;
    //     console.log("服务器关闭");
    // };
    // /**
    //  * 出现异常
    //  */
    // onSocketError() {
    //     debugger;
    //     console.log("服务器异常");
    // };










    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string) {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result: string[]) {
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
    }
}