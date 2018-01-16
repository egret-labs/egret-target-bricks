

BK.Script.loadlib("GameRes://script/core/net/websocket.js");

// e.g. 1
/*
    param@1: uri
    param@2: protocols
    param@3: caFilePath
*/
var ws = new BK.WebSocket("http://10.0.11.39:8081");
ws.onOpen = function (ws) {
    debugger;
    BK.Script.log(1, 0, "onOpen.js");
    BK.Script.log(1, 0, "1.readyState = " + ws.getReadyState());

    var data = {
        name: "xc",
        age: 18
    }
    var str = JSON.stringify(data);
    ws.send(str);


    // ws.send("1234567890/+1234567890/+1234567890/+1234567890/+1234567890/+1234567890/+1234567890/+1234567890/+1234567890/+1234567890/+1234567890/+------------1234567890/+1234567890/+1234567890/+1234567890/+1234567890/+1234567890/+1234567890/+1234567890/+1234567890/+1234567890/+======================1234567890/+1234567890/+1234567890/+1234567890/+1234567890/+1234567890/+1234567890/+1234567890/+1234567890/+1234567890/+我的名字叫三顺");
    // ws.send("我爱我的祖国");

    // var data = new BK.Buffer(8);
    // data.writeInt8Buffer(1);
    // data.writeInt8Buffer(12);
    // data.writeInt16Buffer(11);
    // data.writeInt32Buffer(22);
    // data.writeUint8Buffer(24);
    // data.writeUint16Buffer(4444);
    // data.writeUint32Buffer(94039);
    // data.writeStringBuffer("呵呵哒");
    // ws.send(data);

    // ws.send("3223gfw23我您仿佛 南方3呢奶粉3 内阁府4内热而哦过😫3回归0能不辜负你不");
    // ws.send("ff232家咖啡减肥3肌肤评价皮肤批发你逆风👨‍🌾3弄if 你哦分3弄 if你弄 if你3跑男饭陪你非南方牛皮内批发品");

    // data.rewind();

    // var data2 = new BK.Buffer(8);
    // data2.writeInt8Buffer(2);
    // data2.writeUint16Buffer(48293);
    // data2.writeInt32Buffer(11999911);
    // data2.writeInt16Buffer(data.length);
    // data2.writeBuffer(data);
    // data2.writeStringBuffer("我是祖国的花朵, 府4内热而哦过😫3回归0能不");
    // data2.writeUint8Buffer(88);
    // data2.writeUint16Buffer(9999);
    // data2.writeUint32Buffer(38593492);
    // data2.writeStringBuffer("1234567890/+1234567890/+1234567890/+1234567890/+1234567890/+123");
    // ws.send(data2);

    // ws.send("219392094ur后仍然会红红火火 i 后方文化恢复i 和发3或发发货后放 话发货9恢复糊返回分包v 的司法");
}

ws.onClose = function (ws) {
    BK.Script.log(1, 0, "onClose.js");
    BK.Script.log(1, 0, "1.readyState = " + ws.getReadyState());
}

ws.onError = function (ws) {
    BK.Script.log(1, 0, "onError.js");
    BK.Script.log(1, 0, "1.readyState = " + ws.getReadyState());
}

ws.onMessage = function (ws, data) {
    debugger;
    BK.Script.log(1, 0, "onMessage.js");
    
    let str = data.data.readStringBuffer();
    // if (!data.isBinary) {
    //     BK.Script.log(1, 0, "text = " + data.data.readAsString());
    // } else {
    //     var tag = data.data.readInt8Buffer();
    //     if (1 == tag ) {
    //         BK.Script.log(1, 0, "binary = " + data.data.readInt8Buffer());
    //         BK.Script.log(1, 0, "binary = " + data.data.readInt16Buffer());
    //         BK.Script.log(1, 0, "binary = " + data.data.readInt32Buffer());
    //         BK.Script.log(1, 0, "binary = " + data.data.readUint8Buffer());
    //         BK.Script.log(1, 0, "binary = " + data.data.readUint16Buffer());
    //         BK.Script.log(1, 0, "binary = " + data.data.readUint32Buffer());
    //         BK.Script.log(1, 0, "binary = " + data.data.readStringBuffer());
    //     } else if (2 == tag) {
    //         BK.Script.log(1, 0, "binary = " + data.data.readUint16Buffer());
    //         BK.Script.log(1, 0, "binary = " + data.data.readInt32Buffer());
    //         var len = data.data.readInt16Buffer();
    //         var buf = data.data.readBuffer(len);
    //         BK.Script.log(1, 0, "binary = " + buf.readInt8Buffer());
    //         BK.Script.log(1, 0, "binary = " + buf.readInt8Buffer());
    //         BK.Script.log(1, 0, "binary = " + buf.readInt16Buffer());
    //         BK.Script.log(1, 0, "binary = " + buf.readInt32Buffer());
    //         BK.Script.log(1, 0, "binary = " + buf.readUint8Buffer());
    //         BK.Script.log(1, 0, "binary = " + buf.readUint16Buffer());
    //         BK.Script.log(1, 0, "binary = " + buf.readUint32Buffer());
    //         BK.Script.log(1, 0, "binary = " + buf.readStringBuffer());
    //         BK.Script.log(1, 0, "binary = " + data.data.readStringBuffer());
    //         BK.Script.log(1, 0, "binary = " + data.data.readUint8Buffer());
    //         BK.Script.log(1, 0, "binary = " + data.data.readUint16Buffer());
    //         BK.Script.log(1, 0, "binary = " + data.data.readUint32Buffer());
    //         BK.Script.log(1, 0, "binary = " + data.data.readStringBuffer());
    //     }
    // }
}

ws.connect();

ws.setOptions({
    DefaultSegmentSize: 16
});
