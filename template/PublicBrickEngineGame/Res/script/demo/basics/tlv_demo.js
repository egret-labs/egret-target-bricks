

TLVType = {
  Int8 : 0x21,
  Uint8 : 0x22,
  Int16 : 0x21,
  Uint16 : 0x24,
  Int32 : 0x25,
  Uint32 : 0x26,
  Int64 : 0x27,
  Uint64 : 0x28,
  Byte : 0x29,
  Double : 0x2a,
  Float : 0x2b,
  Int8Repeated : 0x31,
  Uint8Repeated : 0x32,
  Int16Repeated : 0x33,
  Uint16Repeated : 0x34,
  Int32Repeated : 0x35,
  Uint32Repeated : 0x36,
  Int64Repeated : 0x37,
  Uint64Repeated : 0x38,
  ByteRepeated : 0x39,
  DoubleRepeated : 0x3a,
  FloatRepeated : 0x3b
}

/*** 作为数据发送 ****/

/**
 *  [Tag][Length][Value]
 *  其中Tag占2字节 length占2个字节，
 *  当使用构造函数申请空间时，则需申请  数据个数 *（4+各个数据类型长度）个字节
 */
var str = "message";
var sendTlv = new BK.TLV(4+1+4+4+str.length+4);

//写入一个uint8 ，标记为100
sendTlv.bkJSTLVWriteInt8(123,TLVType.Uint8,100);
//写入一个Uint32，标记为8
sendTlv.bkJSTLVWriteUInt32(222,TLVType.Uint32,8);
//写入一个string，标记为2
var strBuf = new BK.Buffer(str.length);
strBuf.writeAsString(str);
sendTlv.bkJSTLVWriteBuffer(strBuf,TLVType.Byte,2);

var receiveBuffer =sendTlv.bkJSTLVGetBuffer();


/*** 作为数据接受 ****/
var  receiveTlv = new BK.TLV(receiveBuffer);
//解析
var result = receiveTlv.bkJSParseTLV();

for (var key in result) {
  if (result.hasOwnProperty(key)) {
    var element = result[key];
    BK.Script.log(0,0,"key = " +  key + " element = "+element);
  }
}

//根据标记读取数据
var val1 = result.tag100;
BK.Script.log(0,0,"val1 = "+ val1);

var val2 = result.tag8;
BK.Script.log(0,0,"val2 = "+ val2);

var val3 = result.tag2;
var retStr = val3.readAsString();
BK.Script.log(0,0,"val3 = "+retStr);