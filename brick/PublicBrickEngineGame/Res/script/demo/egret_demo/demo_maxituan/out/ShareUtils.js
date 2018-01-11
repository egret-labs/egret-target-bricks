// /**
//  * Created by lcj on 14-8-5.
//  */
// class ShareUtils {
//     public static moreGame():void {
//         if (ShareUtils.isInU9()) {
//             location.href = "u9time://gamelist";
//         }
//         else {
//             window.open("http://egret-game.b0.upaiyun.com/game.html", "_self");
//         }
//     }
//     private static shareToWeChat():void {
//         //if (window.hasOwnProperty("WeixinApi")) {
//         //    WeixinApi.ready(function (api:WeixinApi) {
//         //        var info:WeixinShareInfo = new WeixinShareInfo();
//         //        info.title = ShareUtils.shareTitle;
//         //        info.desc = ShareUtils.shareDesc;
//         //        info.link = window.location.href;
//         //        info.imgUrl = "http://egret-game.b0.upaiyun.com/icons/10000001.jpg";
//         //        api.shareToFriend(info);
//         //        api.shareToTimeline(info);
//         //    });
//         //}
//     }
//     private static gameInfo:any = {};
//     private static getInfoFromU9():void {
//         console.log("getInfo");
//         if(ShareUtils.isNative()) {
//             console.log("请求getInfo");
//             egret.ExternalInterface.addCallback("getInfo",function (value){
//                 console.log("收到请求getInfo:" + value);
//                 ShareUtils.gameInfo = JSON.parse(value);
//             });
//             egret.ExternalInterface.call("getInfo","");
//         }
//     }
//     private static isNative():boolean {
//         return egret.MainContext.runtimeType == egret.MainContext.RUNTIME_NATIVE;
//     }
//     public static shareToU9():void {
//         var url:string;
//         var msg = encodeURIComponent(ShareUtils.shareDesc);
//         var uid = ShareUtils.getUid();
//         if(egret.MainContext.runtimeType == egret.MainContext.RUNTIME_NATIVE) {
//             url = "http://egret-game.b0.upaiyun.com/native/demo/money/index.html?channel=weixin";
//             if(ShareUtils.gameInfo["app_id"]) {
//                 url += "&app_id=" + ShareUtils.gameInfo["app_id"]
//             }
//             if(ShareUtils.gameInfo["game_id"]) {
//                 url += "&game_id=" + ShareUtils.gameInfo["game_id"]
//             }
//             if(ShareUtils.gameInfo["device_id"]) {
//                 url += "&device_id=" + ShareUtils.gameInfo["device_id"]
//             }
//             url = encodeURIComponent(url);
//             var link = "uid=" + uid + "&game_url=" + url + "&msg=" + msg;
//             if (!uid) {
//                 link = "game_url=" + url + "&msg=" + msg;
//             }
//             link = "u9time://share?" + link;
//             console.log("ExternalInterface.call:" + "key = share,value = " + link);
//             egret.ExternalInterface.call("share", link);
//         }
//         else {
//             url = location.href;
//             if (location.search == "") {
//                 url += "?channel=weixin";
//             }
//             else {
//                 url += "&channel=weixin";
//             }
//             url = encodeURIComponent(url);
//             var link = "u9time://share?" + "uid=" + uid + "&game_url=" + url + "&msg=" + msg;
//             if (!uid) {
//                 link = "u9time://share?" + "game_url=" + url + "&msg=" + msg;
//             }
//             location.href = link;
//         }
//     }
//     private static shareTitle:string;
//     private static shareDesc:string;
//     public static setShareInfo(title:string, desc:string):void {
//         ShareUtils.shareTitle = title;
//         ShareUtils.shareDesc = desc;
//         ShareUtils.shareToWeChat();
//     }
//     public static isInWeChat():boolean {
//         if (ShareUtils.isNative()) {
//             return false;
//         }
//         else {
//             var ua:string = window.navigator.userAgent;
//             return ua.indexOf("MicroMessenger") != -1;
//         }
//     }
//     private static isInU9():boolean {
//         if (ShareUtils.isNative()) {
//             return true;
//         }
//         else {
//             var ua:string = window.navigator.userAgent;
//             return ua.indexOf("EgretRuntime") != -1 && ua.indexOf("yoyo") != -1;
//         }
//     }
//     private static findLocationProperty(key:string):string {
//         if(ShareUtils.gameInfo[key]) {
//             return ShareUtils.gameInfo[key];
//         }
//         if (window.hasOwnProperty("location")) {
//             var search = location.search;
//             if (search == "") {
//                 return null;
//             }
//             search = search.slice(1);
//             var searchArr = search.split("&");
//             var length = searchArr.length;
//             for (var i:number = 0; i < length; i++) {
//                 var str = searchArr[i];
//                 var arr = str.split("=");
//                 if (arr[0] == key) {
//                     return arr[1];
//                 }
//             }
//         }
//         return null;
//     }
//     private static getUid():string {
//         return ShareUtils.findLocationProperty("uid");
//     }
//     public static onEnterGame():void {
//         ShareUtils.getInfoFromU9();
//         var appId:string = ShareUtils.findLocationProperty("app_id");
//         var gameId:string = ShareUtils.findLocationProperty("game_id");
//         var deviceId:string = ShareUtils.findLocationProperty("device_id");
//         if (appId && gameId) {
//             if (!deviceId) {
//                 deviceId = egret.localStorage.getItem("device_id");
//                 if (!deviceId) {
//                     deviceId = <any>Math.random();
//                 }
//             }
//             egret.localStorage.setItem("device_id", deviceId);
//             var url:string = "http://statistics.egret-labs.org/api.php?app_id=" + appId + "&game_id=" + gameId + "&device_id=" + deviceId;
//             var channel = ShareUtils.findLocationProperty("channel");
//             if (channel && ShareUtils.isInWeChat()) {
//                 url += "&channel=" + channel;
//             }
//             if (url) {
//                 var urlLoader = new egret.URLLoader();
//                 urlLoader.load(new egret.URLRequest(url));
//             }
//         }
//     }
// } 
