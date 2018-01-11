
var GameStatusInfo =  {
    "svrIp" : "14.17.42.125",
    "gameVersion" : "408.2",
    "isMaster" : 1,
    "skey" : "MtSSM7QRn4",
    "dressPath" : [
                   {
                   "atlas" : "\/Clothes\/1\/playRes\/dress",
                   "json" : "\/Clothes\/1\/playRes\/dress"
                   },
                   {
                   "atlas" : "\/Clothes\/2\/playRes\/dress",
                   "json" : "\/Clothes\/2\/playRes\/dress"
                   },
                   {
                   "atlas" : "\/Clothes\/3\/playRes\/dress",
                   "json" : "\/Clothes\/3\/playRes\/dress"
                   },
                   {
                   "atlas" : "\/Clothes\/4\/playRes\/dress",
                   "json" : "\/Clothes\/4\/playRes\/dress"
                   },
                   {
                   "atlas" : "\/Clothes\/5\/playRes\/dress",
                   "json" : "\/Clothes\/5\/playRes\/dress"
                   },
                   {
                   "atlas" : "\/Clothes\/6\/playRes\/dress",
                   "json" : "\/Clothes\/6\/playRes\/dress"
                   },
                   {
                   "atlas" : "\/Clothes\/7\/playRes\/dress",
                   "json" : "\/Clothes\/7\/playRes\/dress"
                   }
                   ],
    "gameId" : 3,
    "apolloStatus" : 1,
    "networkType" : 0,
    "aioType" : 4,
    "roomId" : "0",
    "platform" : "ios",
    "gameMode" : 0,
    "openId" : "72ED98114FE0D68FD23650B303B8AD80",
    "spriteDesignHeight" : 368,
    "QQVer" : "7.1.0.0",
    "isFirstPlay" : 1,
    "skltPath" : {
        "atlas" : "\/Role\/0\/playRes\/role",
        "json" : "\/Role\/0\/playRes\/role"
    },
    "port" : 10060
}


BK.MQQ.SsoRequest.listenerInfos = [];

BK.MQQ.SsoRequest.addListener = function (cmd,target,callback){
    
    var  listenerInfoTmp = {
        "cmd":cmd,
        "target":target,
        "callback":callback
    }
    
    var isExist = false;
    
    BK.MQQ.SsoRequest.listenerInfos.forEach(function(listenerInfo) {
        
        if(listenerInfo["cmd"] == cmd && listenerInfo["target"] == target ){
        listenerInfo.callback = callback;
        isExist == true;
        }
        
    }, this);
    
    if(isExist == false){
        BK.MQQ.SsoRequest.listenerInfos.push(listenerInfoTmp);
    }
}

BK.MQQ.SsoRequest.removeListener = function (cmd,target){
    var len = BK.MQQ.SsoRequest.listenerInfos.length;
    
    var removeIndex = -1;
    for (var index = 0; index < len; index++) {
        var listenerInfo = BK.MQQ.SsoRequest.listenerInfos[index];
        if(listenerInfo["cmd"] == cmd && listenerInfo["target"] == target ){
            removeIndex = index;
        }
    }
    if(removeIndex != -1){
        BK.MQQ.SsoRequest.listenerInfos.splice(removeIndex,1);
    }
}


BK.MQQ.SsoRequest.callback = function (errCode,cmd,data) {
    BK.Script.log(0,0,"BK.MQQ.SsoRequest.callback errCode:" + errCode + " cmd:"+cmd+" . data:"+data);
    if(cmd == "sc.init_global_var.local")
    {
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var element = data[key];
                GameStatusInfo[key] = element;
            }
        }
        
    }else if(cmd == "sc.on_get_open_key.local"){
        GameStatusInfo.openKeyInfo = data;
    }
    
    BK.MQQ.SsoRequest.listenerInfos.forEach(function(listenerInfo) {
                                            
        if(listenerInfo["cmd"] == cmd ){
        var callback = listenerInfo["callback"];
        callback(errCode,cmd,data);
    }
    
    }, this);
}
