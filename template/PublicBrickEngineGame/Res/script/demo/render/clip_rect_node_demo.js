BK.Script.loadlib("GameRes://script/core/ui/ui_event.js");
var clipNode =new BK.ClipRectNode(50, 50, 100, 100);
//clipNode.scale = {x: 2, y: 2, z:1};
clipNode.position = {x: 50, y: 50, z: 0};

BK.Director.root.addChild(clipNode);

var tex = new BK.Texture("GameRes://resource/texture/icon.png");
var sp =new BK.Sprite(475,475,tex,0,1,1,1);

clipNode.addChild(sp);

clipNode.clipRegion = {x: 0, y: 0, width: 300, height: 100};
//clipNode.enableClip = true;
clipNode.canUserInteract = true;

function onBegin(node,evt,x,y)
{
    node.beginPosition = {x:x,y:y};
    node.beginSpPos = node.position;
}

function onMove(node,evt,x,y)
{
    var deltaX = x - node.beginPosition.x;
    var deltaY = y - node.beginPosition.y;
    
    var pos = {x:0,y:0};
    pos.x = node.beginSpPos.x + deltaX ;
    pos.y = node.beginSpPos.y + deltaY;
    node.position = pos;
}

function onEnd(node,evt,x,y)
{
    var deltaX = x - node.beginPosition.x;
    var deltaY = y - node.beginPosition.y;
    
    var pos = {x:0,y:0};
    pos.x = node.beginSpPos.x + deltaX ;
    pos.y = node.beginSpPos.y + deltaY;
    node.position = pos;
}

UIEventHandler.addNodeEvent(clipNode, UI_NODE_ENENT_TOUCH_BEGIN, onBegin);
UIEventHandler.addNodeEvent(clipNode, UI_NODE_ENENT_TOUCH_MOVED, onMove);
