/**
 * BK.Buffer 支持多种数据同时写入与读取
 * 
 * 读写操作相当于堆操作
 * 写入的操作相当于压栈，
 * 读取的操作相当于出栈。
 * 
 * 此时注意的是写入string时，需要额外申请3个字节。用于作为tag
 */
var str = "this is a message."
var buff = new BK.Buffer(str.length + 3 + 1 + 4);

var numUint8 = 1;
var numFloat = 2.0;

// [uint8]
// [float] 
buff.writeUint8Buffer(numUint8);
// [uint8]
// [float] 
buff.writeFloatBuffer(numFloat);
// [uint8]
// [float]
// [string] 
buff.writeStringBuffer(str);

//移动指针至栈顶
buff.rewind();

// [uint8]
// [float]
// [string] 
BK.Script.log(0,0,buff.readUint8Buffer());

// [float]
// [string] 
BK.Script.log(0,0,buff.readFloatBuffer());

// [string] 
BK.Script.log(0,0,buff.readStringBuffer());


/**
 * 若Buffer存储的数据是全string
 * 使用readAsString与writeAsString
 */
var buffAllStr = new BK.Buffer(str.length);
buffAllStr.writeAsString(str);
BK.Script.log(0,0,buffAllStr.readAsString());

//如读取从文件中读取一段数据，并以string的方式输出
var buff = BK.FileUtil.readFile("GameRes://resource/spine/action/jump/action.json");
var string = buff.readAsString();
BK.Script.log(1,1,"readFile content="+string);
