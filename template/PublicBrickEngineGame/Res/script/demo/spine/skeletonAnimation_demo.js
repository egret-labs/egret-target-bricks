/**
 * 骨骼动画
 */

//1.厘米秀 spine 
var jsonPath = BK.Script.pathForResource("GameRes://resource/spine/suit/default/role/role", 'json');
var atlasPath = BK.Script.pathForResource("GameRes://resource/spine/suit/default/role/role", 'atlas');
    
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
var ani =new BK.SkeletonAnimation(atlasPath, jsonPath, 1,startCB,completeCB,endCB );
ani.name = "CMGril"
ani.position = {x:300,y:200};
ani.vertexColor = {r:0.9, g:1, b:0.9, a:1}
//加载装扮
var  accArray = ['FaceSuit', 'BackSuit', 'BottomSuit', 'FaceOrnament', 'TopSuit', 'HairType'];
for (var i=0;i<accArray.length;i++)
{
    var j = "GameRes://resource/spine/suit/default/" + accArray[i] + "/dress";
    var a = "GameRes://resource/spine/suit/default/" + accArray[i] + "/dress";
    var jPath = BK.Script.pathForResource(j, 'json');
    var aPath = BK.Script.pathForResource(a, 'atlas');
    ani.setAccessory(jPath, aPath);
}

//气泡
var bubbleJsonPath = BK.Script.pathForResource("GameRes://resource/spine/bubble/1/dress", 'json');
var bubbleAtlasPath = BK.Script.pathForResource("GameRes://resource/spine/bubble/1/dress", 'atlas');
ani.setAccessoryWithInfo(bubbleJsonPath, bubbleAtlasPath, "你好");

//添加动画
var animJson  = BK.Script.pathForResource("GameRes://resource/spine/action/archery/action", 'json');
var animAtlas = BK.Script.pathForResource("GameRes://resource/spine/action/archery/action", 'atlas');
ani.setAccessoryAnimation(animJson, animAtlas, "anim1");

var animJson2  = BK.Script.pathForResource("GameRes://resource/spine/action/activityleg/action", 'json');
var animAtlas2 = BK.Script.pathForResource("GameRes://resource/spine/action/activityleg/action", 'atlas');
ani.setAccessoryAnimation(animJson2, animAtlas2, "anim2");


//播放动画
/**
 * 播放动画
 * track 索引id
 * name  名称
 * loop  是否循环
 */
ani.setAnimation(12312,"anim1",true)

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
// ani.setAttachmentBySlotName("Eyes",eyeAttMnt);


// //2. 普通spine动画
// var jsonPath = BK.Script.pathForResource("GameRes://resource/spine/suit/decelerator/Decelerator", 'json');
// var atlasPath = BK.Script.pathForResource("GameRes://resource/spine/suit/decelerator/Decelerator", 'atlas');
// var rice =new BK.SkeletonAnimation(atlasPath, jsonPath, 1,null,null,null );
// rice.position = {x:200,y:100};
// BK.Director.root.addChild(rice);
// //播放动画
// rice.setAnimation(00,"animation",true)

// //启动spine动画颜色叠加，
// rice.canMixVertexColor = true ;
// var alpha = 0;
// BK.Director.ticker.add(function (ts,du) {
//     if(alpha>=1){
//         alpha = 0;
//     }
//     alpha += 0.1;
//     rice.vertexColor = {r:1, g:1, b:1, a:alpha}
// })
