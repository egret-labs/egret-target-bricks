
/**
 * 写入一段文字 到 沙盒文件路径下的 名为test的文件中
 * @path    文件路径 
 * @content 内容
 * @return 无
 */
BK.FileUtil.writeFile("GameSandBox://test","testFileObject");


/**
 * 读取文件
 * @path 文件路径
 * @return BK.Buffer对象
 */
var buff = BK.FileUtil.readFile("GameSandBox://test");
var string = buff.readAsString();
BK.Script.log(1,1,"readFile content="+string);

/**
 * 写入BK.Buffer 到指定目录
 * @path 文件路径
 * @buff 待写入的BK.Buffer对象
 * @return 无
 */
BK.FileUtil.writeBufferToFile("GameSandBox://demo/tst/demo/test3",buff);

