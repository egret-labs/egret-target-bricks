/**
 * 使用socket连接服务器，进行读写操作
 */

var socket = new BK.Socket();
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