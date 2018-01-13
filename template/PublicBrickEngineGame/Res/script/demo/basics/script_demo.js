/*
    1.打印log 
*/
BK.Script.log(1,1,"this is a log.");
BK.Script.log(1,1,9999);

/*
    2.获取当前运行的脚本路径
*/
var currFilePath = BK.Script.file();

/*
    3.获取文件路径 
    @param1 文件名
    @param2 后缀名（选填）
    @return 无
*/
var path = BK.Script.pathForResource("test","js");
// BK.Script.log(1,1,path);

/*
    4.获取绝对路径
    @param1 文件名
    @param2 后缀名（选填）
    @return 无
*/
var absPath = BK.Script.absolutePathForResource("test","js");
// BK.Script.log(1,1,absPath);

/*
    5.执行脚本文件  
    path 为脚本路径
    @return 无
 */
BK.Script.loadlib('GameRes://script/demo/test.js');




