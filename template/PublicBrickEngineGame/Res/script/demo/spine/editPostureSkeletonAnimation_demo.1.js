BK.Script.loadlib('GameRes://script/core/ui/button.js');

//竖屏模式下，以iPhone 6 (750x1334) 的分辨率为标准进行缩放。
var designWidth = 750;
var designHeight = 1334;
var scaleX = BK.Director.screenPixelSize.width / designWidth;
var scaleY = BK.Director.screenPixelSize.height / designHeight;
BK.Director.root.scale = {x:scaleX,y:scaleY};

//加载骨骼 
var jsonPath = BK.Script.pathForResource("GameRes://resource/spine/suit/default/role/role", 'json');
var atlasPath = BK.Script.pathForResource("GameRes://resource/spine/suit/default/role/role", 'atlas');
var ani =new BK.SkeletonAnimation(atlasPath, jsonPath, 1,null,null,null );
ani.name = "CMGril"
ani.position = {x:designWidth/2.,y:0};
ani.scale = {x:2,y:2};
//加载7件装扮
var  accArray = ['FaceSuit', 'BackSuit', 'BottomSuit', 'FaceOrnament', 'TopSuit', 'HairType'];
for (var i=0;i<accArray.length;i++)
{
    var j = "GameRes://resource/spine/suit/default/" + accArray[i] + "/dress";
    var a = "GameRes://resource/spine/suit/default/" + accArray[i] + "/dress";
    var jPath = BK.Script.pathForResource(j, 'json');
    var aPath = BK.Script.pathForResource(a, 'atlas');
    ani.setAccessory(jPath, aPath);
}

BK.Director.root.canUserInteract = true;
ani.canUserInteract = true;
BK.Director.root.addChild(ani)

//获取slot名字数组
var slotNames = ani.getSlotNames(); 
//获取bone名字数组
var bones = ani.getBoneNames();
//获取accessory附件数组
var accessoryTypes = ani.accessoryTypes;

for (var index = 0; index < bones.length; index++) {
    var b = bones[index];
    BK.Script.log(0,0,"bones = "+b);
    
}

var beginPoint;
var touchTopSuit = false;
function onBegin(node,evt,x,y)
{
    var element = "TopSuit";
    if (node.hittestAccessory("TopSuit",{x:x,y:y})) {
        BK.Script.log(0,0,"hit! name = "+element);
        node.setAccessoryColor(element,{r:1,g:1,b:0,a:1})
        beginPoint = node.convertToNodeSpace({x:x,y:y});   
        touchTopSuit = true;      
    }
}
function onMove(node,evt,x,y)
{
    if (beginPoint) {
        var movePt = node.convertToNodeSpace({x:x,y:y});
        var pt = node.position;
        node.position = {x:pt.x +(movePt.x - beginPoint.x) ,y: pt.y + (movePt.y - beginPoint.y)};
    }
}
function onEnd(node,evt,x,y)
{
    if (beginPoint) {
        var movePt = node.convertToNodeSpace({x:x,y:y});
        var pt = node.position;
        node.position = {x:pt.x +(movePt.x - beginPoint.x) ,y: pt.y + (movePt.y - beginPoint.y)};
        beginPoint = null;
        touchTopSuit = false; 
        
        //颜色回到默认
        for (var index = 0; index < slotNames.length; index++) {
            var element = slotNames[index];
            node.setSlotColor(element,{r:1,g:1,b:1,a:1})
        }
    }
}

UIEventHandler.addNodeEvent(ani,UI_NODE_ENENT_TOUCH_BEGIN,onBegin);
UIEventHandler.addNodeEvent(ani,UI_NODE_ENENT_TOUCH_MOVED,onMove);
UIEventHandler.addNodeEvent(ani,UI_NODE_ENENT_TOUCH_END,onEnd);

var normal = 'GameRes://resource/texture/blue_circle.png'

var leftBtnSpace = 50;

/**
 * 控制手的按钮
 */
//左边
var Upperarm_Right01 = new BK.Button(100,100,normal,function (node) {
    var ro = ani.getBoneRotation('Upperarm_Right01');
    ani.setBoneRotation('Upperarm_Right01',ro-10);
});
Upperarm_Right01.position = {x:leftBtnSpace,y:designHeight-100-100};
BK.Director.root.addChild(Upperarm_Right01);


var Forearm_Right01 = new BK.Button(100,100,normal,function (node) {
    var ro = ani.getBoneRotation('Forearm_Right01');
    ani.setBoneRotation('Forearm_Right01',ro-10);
});
Forearm_Right01.position = {x:leftBtnSpace,y:designHeight-100-100-120};
BK.Director.root.addChild(Forearm_Right01);

//右边
var Upperarm_Left01 = new BK.Button(100,100,normal,function (node) {
    var ro = ani.getBoneRotation('Upperarm_Left01');
    ani.setBoneRotation('Upperarm_Left01',ro-10);
});
Upperarm_Left01.position = {x:designWidth-leftBtnSpace-100,y:designHeight-100-100};
BK.Director.root.addChild(Upperarm_Left01);

var Forearm_Left01 = new BK.Button(100,100,normal,function (node) {
    var ro = ani.getBoneRotation('Forearm_Left01');
    ani.setBoneRotation('Forearm_Left01',ro-10);
});
Forearm_Left01.position = {x:designWidth-leftBtnSpace-100,y:designHeight-100-100-120};
BK.Director.root.addChild(Forearm_Left01);


/**
 * 控制脚的按钮
 */
//左边

var Pants_Right01 = new BK.Button(100,100,normal,function (node) {
    var ro = ani.getBoneRotation('Pants_Right01');
    ani.setBoneRotation('Pants_Right01',ro-10);
});
Pants_Right01.position = {x:leftBtnSpace,y:100+100};
BK.Director.root.addChild(Pants_Right01);

var Pants_Right03 = new BK.Button(100,100,normal,function (node) {
    var ro = ani.getBoneRotation('Pants_Right03');
    ani.setBoneRotation('Pants_Right03',ro+10);
});
Pants_Right03.position = {x:leftBtnSpace,y:80};
BK.Director.root.addChild(Pants_Right03);



//右边
var Pants_Left01 = new BK.Button(100,100,normal,function (node) {
    var ro = ani.getBoneRotation('Pants_Left01');
    ani.setBoneRotation('Pants_Left01',ro-10);
});
Pants_Left01.position = {x:designWidth-leftBtnSpace-100,y:100+100};
BK.Director.root.addChild(Pants_Left01);

var Pants_Left03 = new BK.Button(100,100,normal,function (node) {
    var ro = ani.getBoneRotation('Pants_Left03');
    ani.setBoneRotation('Pants_Left03',ro+10);
});
Pants_Left03.position = {x:designWidth-leftBtnSpace-100,y:80};
BK.Director.root.addChild(Pants_Left03);
