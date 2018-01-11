/**
 * HTTP请求
 */

 


function onResponse (res,code)
{    
	var string = res.readAsString();
    BK.Script.log(0,0,"httpLog  response code= "+code);
    BK.Script.log(0,0,"httpLog  call back  :"+string);
}

//get 请求
var httpget = new BK.HttpUtil("http://ipad-bjwb.bjd.com.cn/DigitalPublication/publish/Handler/APINewsList.ashx?date=20131129&startRecord=1&len=5&udid=1234567890&terminalType=Iphone&cid=213");
// 设置referer,cookie
httpget.setHttpReferer("www.abc.com");
httpget.setHttpMethod("get")
httpget.setHttpCookie("cookie1=value1; cookie2=value2; cookie3=value3;");
httpget.requestAsync(onResponse);


//
// //post请求1

// var httppost1 = new BK.HttpUtil("http://ipad-bjwb.bjd.com.cn/DigitalPublication/publish/Handler/APINewsList.ashx");
// httppost1.setHttpMethod("post")
// httppost1.setHttpPostData("date=20131129&startRecord=1&len=5&udid=1234567890&terminalType=Iphone&cid=213")

// //设置referer,cookie
// httppost1.setHttpReferer("http://hlddz.huanle.qq.com");
// httppost1.setHttpCookie("cookie1=value1; cookie2=value2; cookie3=value3;");
// httppost1.requestAsync(onResponse);


////
////
//
////post请求2
//var httppost2 = new BK.HttpUtil("http://ipad-bjwb.bjd.com.cn/DigitalPublication/publish/Handler/APINewsList.ashx");
//httppost2.setHttpMethod("post")
//httppost2.setHttpPostData("date=201311299&startRecorda=1&lena=5&udida=1234567890&terminalType=Iphone&cid=213")
//
////设置referer,cookie
//httppost2.setHttpReferer("www.abc.com");
//httppost2.setHttpCookie("cookie1=value1; cookie2=value2; cookie3=value3;");
//
//httppost2.requestAsync(onResponse);

