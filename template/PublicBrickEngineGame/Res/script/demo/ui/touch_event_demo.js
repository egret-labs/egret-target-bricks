BK.Script.loadlib('GameRes://script/core/ui/ui_event.js');

var backTex  =new BK.Texture('GameRes://resource/texture/star.png');

function onBegin(node,evt,x,y)
{
    BK.Script.log("sprite touch begin x:"+x + " y:"+y);
    node.beginPosition = {x:x,y:y};
    node.beginSpPos = node.position;

    node.vertexColor = {r:1,g:1,b:1,a:0.8};
}

function onMove(node,evt,x,y)
{
    var deltaX = x - node.beginPosition.x;
    var deltaY = y - node.beginPosition.y;
    
    BK.Script.log("sprite touch move ! delta x:"+deltaX + " y:"+deltaY);
    var pos = {x:0,y:0};
    pos.x = node.beginSpPos.x + deltaX ;
    pos.y = node.beginSpPos.y + deltaY;
    node.position = pos;
}

function onEnd(node,evt,x,y)
{
    BK.Script.log("sprite touch end !  obj"+node+" evt:"+evt + " x:" + x  +" y:"+y);

    node.vertexColor = {r:1,g:1,b:1,a:1};
    
    var deltaX = x - node.beginPosition.x;
    var deltaY = y - node.beginPosition.y;

    var pos = {x:0,y:0};
    pos.x = node.beginSpPos.x + deltaX ;
    pos.y = node.beginSpPos.y + deltaY;
    node.position = pos;
}

function createStar(x,y) {
    var sp =new BK.Sprite(200,200,backTex,0,1,1,1);
    sp.position = {x:x,y:y};
    sp.canUserInteract = true;

    UIEventHandler.addNodeEvent(sp,UI_NODE_ENENT_TOUCH_BEGIN,onBegin);
    UIEventHandler.addNodeEvent(sp,UI_NODE_ENENT_TOUCH_MOVED,onMove);
    UIEventHandler.addNodeEvent(sp,UI_NODE_ENENT_TOUCH_END,onEnd);

    BK.Director.root.addChild(sp);
}

for (var i = 0; i < 10; i++) {
    createStar(
        Math.random() * BK.Director.renderSize.width, 
        Math.random() * BK.Director.renderSize.height
    );
}
