
var openID = "012345678901234567890123456789ab";

/**
 * 获取昵称
 */
 BK.MQQ.Account.getNick(openID,function(openId,nick){
   BK.Script.log(0,0,"Nick :"+ nick);
 });

/**
 * 获取头像
 */
BK.MQQ.Account.getHead(openID,function(openId,BuffInfo){

    var buff = BuffInfo.buffer;
    var width = BuffInfo.width;
    var height = BuffInfo.height;
    BK.Script.log(0,0,"headeBuff :"+ openId + " buff:"+ buff + " width:"+ width +" height:"+height);


    var tex = new BK.Texture(buff,width,height);
    var sp =new BK.Sprite(200,200,tex,0,1,1,1);
    
    BK.Director.root.addChild(sp);

});


/**
 * 打开一个网页
 */
BK.MQQ.Webview.open("http://www.qq.com");