// BK.Script.loadlib('GameRes://script/core/basics/AVRoom.js');
// BK.Script.loadlib('GameRes://script/core/net/protocol.js');
// function debugLog(str:string) {
//     BK.Script.log(0,0,"DebugLog:"+str);
// }
// //AVROOM  information
// var sdkAppId :number= 1400035750;
// var accountType : number=14181;
// var avRoomId:number= 122333;
// var gameRoomId:number = 54321;
// BK.AVRoomManger.initAndEnterRoom( 
//     {
//     "sdkAppId" : sdkAppId,
//     "accountType" : accountType,
//     "avRoomId": avRoomId,
//     "gameRoomId":gameRoomId
//     },
//     function (errCode:number,cmd:string,data:any) {
//         // initAndEnterRoom callback
//         debugLog("error:"+errCode+" cmd:"+cmd+" data:"+JSON.stringify(data));
//     },
// );
// BK.AVRoomManger.setEventCallbackConfig({
//     eventHasAudioCallback:function (eventId,data) {
//         if (data.userInfo) {
//             for (let index = 0; index < data.userInfo.length; index++) {
//                 const user  = data.userInfo[index];
//                 debugLog("USER:"+user.openId+" HasAudio");            
//             }
//         }
//     },
//     eventNoAudioCallback:function (eventId,data) {
//         if (data.userInfo) {
//             for (let index = 0; index < data.userInfo.length; index++) {
//                 const user  = data.userInfo[index];
//                 debugLog("USER:"+user.openId+" NoAudio");            
//             }
//         }
//     },
//     eventNewSpeakCallback:function(eventId,data) {
//         if (data.userInfo) {
//             for (let index = 0; index < data.userInfo.length; index++) {
//                 const user  = data.userInfo[index];
//                 debugLog("USER:"+user.openId+" NewSpeak");            
//             }
//         }
//     },
//     eventOldStopSpeakCallback:function(eventId,data) {
//         if (data.userInfo) {
//             for (let index = 0; index < data.userInfo.length; index++) {
//                 const user  = data.userInfo[index];
//                 debugLog("USER:"+user.openId+" OldStopSpeak");            
//             }
//         }
//     },
//     eventEnterCallback:function(eventId,data) {
//         if (data.userInfo) {
//             for (let index = 0; index < data.userInfo.length; index++) {
//                 const user  = data.userInfo[index];
//                 debugLog("USER:"+user.openId+" Exit");            
//             }
//         }
//     },
//     eventExitCallback:function(eventId,data) {
//         if (data.userInfo) {
//             for (let index = 0; index < data.userInfo.length; index++) {
//                 const user  = data.userInfo[index];
//                 debugLog("USER:"+user.openId+" Enter");            
//             }
//         }
//     }
// });
// // BK.AVRoomManger.exitRoom(this.avRoomId,function(err:number,cmd:string,data:any)
// // {   
// //     BK.Script.log(0,0,"onCloseRoom error:"+err);
// // });
