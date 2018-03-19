/**
 * 使用socket连接服务器，进行读写操作
 */

var socket = new BK.Socket(0);
var connet = 0;
var time = 0;

BK.Director.ticker.add(function (ts,duration) {
    time = time + 1;
    if(time < 5){
        return;
    }
    if(connet == 0){
        connet = connet + 1;
        var con = socket.connect("127.0.0.1",9527);
        BK.Script.log(1,1,"socket con ="+con);
    }
    var update = socket.update();
    BK.Script.log(1,1,"socket update ="+update);

    //current socket is readable and writable.
    if(update == 3){
        var buff = new BK.Buffer(4);
        buff.writeUint32Buffer(1234);
        socket.send(buff);
        BK.Script.log(1,1,"socket send ");
    }
});

//BK.Script.loadlib('GameRes://script/core/net/kcp.js');
//var kcp = new KCP();
//var count = 0;
//var startTime = BK.Time.timestamp;
//BK.Director.ticker.add(function(ts,duration){
//                       if(count == 0){
//                       kcp.socket.connect("0.0.0.0",41235);
//                       }
//                       var update = kcp.update(ts);
//                       if(update == 3 || update == 2){
//                       if(ts - startTime>200){
//                       startTime = ts;
//                       var str = "frame "+count;
//                       BK.Script.log(0,0,"  str = "+str+"  "+str.length);
//                       var sendBuf = new BK.Buffer(str.length);
//                       sendBuf.writeAsString(str);
//                       kcp.send(sendBuf);
//                       count++;
//                       }
//                       }
//                       if(update == 3 || update == 1){
//                       var buff = new BK.Buffer(100);
//                       var n = kcp.recv(buff);
//                       if(n>0){
//                       BK.Script.log(0,0,"  result = "+buff.readAsString());
//                       }
//                       }
//                       });

