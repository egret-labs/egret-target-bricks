BK.Script.loadlib("GameRes://script/core/ui/ui_event.js");
var nightTex = new BK.Texture("GameRes://resource/texture/night.png");
var nightSp = new BK.Sprite(BK.Director.screenPixelSize.width, BK.Director.screenPixelSize.height, nightTex, 0, 1, 1, 1);
nightSp.canUserInteract = true;
BK.Director.root.addChild(nightSp);

var stencilTex = new BK.Texture("GameRes://resource/texture/mask/balls.png");
var stencilSp = new  BK.Sprite(200, 200, stencilTex, 0, 1, 1, 1);

var clipNode =new BK.ClipNode(stencilSp);
stencilSp.anchor = {x: 0.5, y:0.5};
stencilSp.position = {x: 150, y: 150, z: 0};

var tex = new BK.Texture("GameRes://resource/texture/icon.png");
var sp =new BK.Sprite(200,200,tex,0,1,1,1);
sp.position = {x: 150, y: 150, z:0 };
sp.anchor = {x: 0.5, y:0.5};

nightSp.addChild(clipNode);
clipNode.addChild(sp);
clipNode.inverted = true;
clipNode.alphaThreshold = 0.5;
clipNode.canUserInteract = true;

var stencilTex2 = new BK.Texture("GameRes://resource/texture/star.png");
var stencilSp2 = new BK.Sprite(200, 200, stencilTex2, 0, 1, 1, 1);
var tempSP = new BK.Sprite(200, 200, null, 0, 1, 1, 1);
tempSP.addChild(stencilSp2);
tempSP.anchor = {x: 0.5, y : 0.5};
tempSP.position = {x: 350, y : 600, z: 0};

var sp2 = new BK.Sprite(200, 200, tex, 0, 1, 1, 1);
sp2.name = "sp2";
sp2.anchor = {x: 0.5, y : 0.5};
sp2.position = {x: 350, y : 600, z: 0};
//sp2.mask = new BK.ClipMask(stencilSp2, false, 0.0);
//sp2.mask = new BK.ClipMask(tempSP, false, 0.0);
//sp2.mask.inverted = false;
//sp2.mask.alphaThreshold = 0.0;
sp2.canUserInteract = true;

var sp2Parent=new BK.Sprite(200, 200, tex, 0, 1, 1, 1);
sp2Parent.addChild(sp2);
sp2Parent.mask = new BK.ClipMask(tempSP, false, 0.0);
nightSp.addChild(sp2Parent);
//nightSp.addChild(sp2);
/*
var clipNode2 = new BK.ClipNode(stencilSp2);
clipNode2.name = "clipNode2";
clipNode2.addChild(sp2);
clipNode2.inverted = false;
clipNode2.alphaThreshold = 0.0;
clipNode2.canUserInteract = true;

nightSp.addChild(clipNode2);*/

var rot = 0;
BK.Director.ticker.add(function(){
                       sp.rotation = {x: 0, y:0, z:rot};
                       stencilSp.rotation = {x: 0, y: 0, z:rot};
                       
                       sp2.rotation = {x: 0, y: 0, z:-rot};
                       //stencilSp2.rotation = {x: 0, y: 0, z:-rot};
                       rot = rot + 1;
})

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

UIEventHandler.addNodeEvent(sp2, UI_NODE_ENENT_TOUCH_BEGIN, onBegin);
UIEventHandler.addNodeEvent(sp2, UI_NODE_ENENT_TOUCH_MOVED, onMove);
