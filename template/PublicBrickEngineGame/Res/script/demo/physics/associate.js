
BK.Script.loadlib('GameRes://script/core/ui/ui_event.js');

var screenScale = BK.Director.screenScale;
BK.Director.root.scale = {x: screenScale / 3, y: screenScale / 3, z: 1};

var space = new BK.Physics.Space({"x":0,"y":-100}, 128)
BK.Director.attachSpace(space)

var polyPts = [
               {"x":0 ,"y":0},
               {"x":200,"y":0},
               {"x":200,"y":200},
               {"x":0 ,"y":200}
               ]
var transForm = {"a": 1, "b":0, "c":0, "d":1, "tx":-100, "ty":-100}

var width = 300
var bodytype = 0 // 0动态刚体 1运动学刚体 2 静态刚体
var mass  = 1
var moment = BK.Physics.momentForPolygon(mass, polyPts, {x:0, y:0}, 0);
var body = new BK.Physics.Body(bodytype,mass,moment,{"x":0,"y":0});
space.addBody(body)

var polyShape = new BK.Physics.PolygonShape(body,polyPts,transForm,0);
space.addShape(polyShape);

var tex  =new BK.Texture('GameRes://resource/texture/night.png');
var sp =new BK.Sprite(500,500,tex,0,1,1,1);
sp.position = {x: 0, y: 1000, z: 0};
sp.canUserInteract = true;

var tex2 = new BK.Texture('GameRes://resource/texture/background.png');
var sp2 = new BK.Sprite(300, 300, tex2, 0, 1, 1, 1);
sp2.name = "middle";
sp2.position = {x: 150, y: 200, z: 0};

var tex3 = new BK.Texture('GameRes://resource/texture/icon.png');
var sp3 = new BK.Sprite(200, 200, tex3, 0, 1, 1, 1);
sp3.name = "star";
sp3.position = {x: 100, y: 100, z: 0};

sp.addChild(sp2);
sp2.addChild(sp3);
BK.Director.root.addChild(sp);

sp2.scale = {x: 2, y: 2, z: 1};
sp3.attachComponent(body);

sp.anchor = {x: 0.5, y: 0.5}
sp2.anchor = {x: 0.5, y: 0.5}
sp3.anchor = {x: 0.5, y: 0.5}


var moment2 = BK.Physics.momentForCircle(mass, 50, 0, {x: 0, y:0});
var body2 = new BK.Physics.Body(bodytype,mass,moment2,{x:0,y:0});
space.addBody(body2)
var circleShape = new BK.Physics.CircleShape(body2, 50, 0, 0);
space.addShape(circleShape);

var tex4 = new BK.Texture('GameRes://resource/texture/test.png');
var sp4 = new BK.Sprite(300, 300, tex4, 0, 1, 1, 1);
sp4.position = {x: 300, y: 1500, z: 0};

var tex5 = new BK.Texture('GameRes://resource/texture/blue_circle.png');
var sp5 = new BK.Sprite(100, 100, tex5, 0, 1, 1, 1);
sp4.addChild(sp5);
BK.Director.root.addChild(sp4);

sp5.anchor = {x: 0.5, y: 0.5};
sp5.attachComponent(body2);



var segPts = [
               {"x":0 ,"y":0},
               {"x":150,"y":0},
               {"x":150,"y":150},
               {"x":0 ,"y":150},
               {"x":0, "y":0}
               ]
for (var i = 0; i < 5; i++) {
    segPts[i].x = segPts[i].x - 150/2;
    segPts[i].y = segPts[i].y - 150/2;
}
var moment3 = BK.Physics.momentForPolygon(1, segPts, {x: 0, y: 0}, 0);
var boxBody = new BK.Physics.Body(0,1,100,{"x":150,"y":100});
space.addBody(boxBody);
var segments = new BK.Physics.SegmentShape(boxBody,segPts,1,1,0,1);
for (var i=0;i<segments.length;i++)
{
    var sg = segments[i];
    space.addShape(sg)
}

var tex6 = new BK.Texture('GameRes://resource/texture/snake.png');
var sp6 = new BK.Sprite(150, 150, tex6, 0, 1, 1, 1);
sp6.canUserInteract = 1;
sp6.anchor = {x: 0.5, y: 0.5};
sp6.position = {x: 700, y: 700};
sp6.bodyOffset = {x: 150 * screenScale / 3, y: 150 * screenScale / 3};

sp6.attachComponent(boxBody);
BK.Director.root.addChild(sp6);

function onBegin(node,evt,x,y)
{
    BK.Script.log("sprite touch begin x:"+x + " y:"+y);
    
    sp3.position = {x: 100, y: 100, z:0};
    sp3.scale = {x: 2, y: 1, z: 1};
    
    sp4.scale = {x: 2, y: 2, z: 1};
    
    sp6.scale = {x: 2, y: 1.5, z: 1};
}

UIEventHandler.addNodeEvent(sp6,UI_NODE_ENENT_TOUCH_BEGIN,onBegin);

var rot = 0;
var posX = 0;

BK.Director.ticker.add(function(ts, dt) {
                       rot = rot + 1;
                       posX = posX + 2;
                       //body.angle = 0.01745329251994 * rot;
                       var spp = sp.position;
                       sp.position = {x: posX, y: spp.y, z: spp.z};
                       sp3.rotation = {x: 0, y: 0, z: -rot};
                       sp6.rotation = {x: 0, y: 0, z: -rot};
                       body.force = {x: 0, y: 100};
                       boxBody.force = {x: 0, y: 100};
                       })

//打开测试包围盒
BK.Physics.setSwitch(true);
