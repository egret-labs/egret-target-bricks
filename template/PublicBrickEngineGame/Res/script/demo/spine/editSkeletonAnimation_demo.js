
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



var beginPoint;
function onBegin(node,evt,x,y)
{
    //1.所有被点击的slot
    var hitSlots = [];
    for (var index = 0; index < slotNames.length; index++) {
        var element = slotNames[index];
        if (node.hittestSlotByName(element,{x:x,y:y})) {
            BK.Script.log(0,0,"hittestSlotByName hit! name = "+element);
            hitSlots.push(element);
        }
    }
    //2.获取draworder最高的slot
    var topSlotName = undefined;
    var topIdx = -1;
    for (var index = 0; index < hitSlots.length; index++) {
        var slotName = hitSlots[index];
        var slotIdx  = node.getSlotDrawOrder(slotName);
        if (slotIdx > topIdx) {
            topIdx = slotIdx;
            topSlotName = slotName;
        }
    }
    
    if (topSlotName) {
        var boneName = node.getBoneNameBySlotName(topSlotName);
        BK.Script.log(0,0,"hittestSlotByName topSlotName:"+topSlotName+ " boneName:"+boneName);
    }
}
function onMove(node,evt,x,y)
{
}
function onEnd(node,evt,x,y)
{
    for (var index = 0; index < slotNames.length; index++) {
        var element = slotNames[index];
        BK.Script.log(0,0,"element = "+element);
        node.setSlotColor(element,{r:1,g:1,b:1,a:1})
    }
}

UIEventHandler.addNodeEvent(ani,UI_NODE_ENENT_TOUCH_BEGIN,onBegin);
UIEventHandler.addNodeEvent(ani,UI_NODE_ENENT_TOUCH_MOVED,onMove);
UIEventHandler.addNodeEvent(ani,UI_NODE_ENENT_TOUCH_END,onEnd);
