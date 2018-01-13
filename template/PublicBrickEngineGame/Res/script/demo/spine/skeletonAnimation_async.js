
BK.Script.loadlib("GameRes://script/core/io/skeletonAsync.js");

var  accArray = ['FaceSuit', 'BackSuit', 'BottomSuit', 'FaceOrnament', 'TopSuit', 'HairType'];

/**
 * 骨骼动画
 */

//1.厘米秀 spine 

    
function startCB(animName,trackId,skeletonAnimation)
{
    BK.Script.log(0,0,"Start Event Callback");
}
function completeCB(animName,trackId,skeletonAnimation)
{
    BK.Script.log(0,0,"Complete Event Callback animName = "+ animName);

    // skeletonAnimation.setAnimation(12312,"anim2",true)
}
function endCB(animName,trackId,skeletonAnimation)
{
    BK.Script.log(0,0,"End Event Callback");
}

/**
 * 骨骼动画构造函数 （加载骨骼）
 * atlasPath altas文件路径
 * jsjsonPath json文件路径
 * timeScale  播放速率 1为正常速率
 * startCB    开始播放事件回调
 * completeCB 动画播放完毕
 * endCB      动画播放完成，即将播放另外的动画
 */
skeletonAnimationAsync("GameRes://resource/spine/suit/default/role/role",1,startCB,completeCB,endCB,function(ani){
	BK.Script.log(1,1,"role done ani="+ani);

	ani.name = "CMGril"
	ani.position = {x:300,y:200};
	ani.vertexColor = {r:0.9, g:1, b:0.9, a:1}

	//加载装扮
	for (var i=0;i<accArray.length;i++)
	{
	   setAccessoryAsync(ani,"GameRes://resource/spine/suit/default/" + accArray[i] + "/dress",function(){
	   		BK.Script.log(1,1,"dress done");
	   })
	}
//气泡
var bubbleJsonPath = BK.Script.pathForResource("GameRes://resource/spine/bubble/1/dress", 'json');
var bubbleAtlasPath = BK.Script.pathForResource("GameRes://resource/spine/bubble/1/dress", 'atlas');
setAccessoryWithInfoAsync(ani,"GameRes://resource/spine/bubble/1/dress", "你好",function(){});

//添加动画

setAccessoryAnimationAsync(ani,"GameRes://resource/spine/action/archery/action","anim1",function(){
			ani.setAnimation(12312,"anim1",true)
		});
//setAccessoryAnimationAsync(ani,"GameRes://resource/spine/action/activityleg/action","anim2",function(){});


//播放动画
/**
 * 播放动画
 * track 索引id
 * name  名称
 * loop  是否循环
 */

BK.Director.root.addChild(ani)

BK.Script.log(0,0, "load ended!!");


//获取slot名字数组
var names = ani.getSlotNames();
//获取bone名字数组
var bones = ani.getBoneNames();

//根据骨骼名字设置某个骨骼大小
//例如将右手放大2倍
ani.setBoneScale("Hand_Right",2.0,2.0);

//根据slot获得attachment
var eyeAttMnt = ani.getAttachmentBySlotName("Eyes");

//根据slot名设置attachment，第二个参数赋值undefined、null表示隐藏
ani.setAttachmentBySlotName("Eyes",null);
});






