BK.Script.loadlib("GameRes://script/core/ui/ui_event.js");

var tx0 = new BK.Texture("GameRes://resource/texture/monster.png");
var tx1 = new BK.Texture("GameRes://resource/texture/monster_NRM.png");
var sp = new BK.Sprite(BK.Director.screenPixelSize.width, BK.Director.screenPixelSize.height, tx0, 0, 1, 1, 1);
sp.position = {x: 0, y: 0}
sp.canUserInteract = true;

BK.Director.root.addChild(sp);

var material = new BK.Render.Material("GameRes://script/demo/render/shader/light2D.vs", "GameRes://script/demo/render/shader/light2D.fs");
material.setTexture(0, tx0);
material.setTexture(1, tx1);

material.uniforms.uSampler = 0;
material.uniforms.nSampler = 1;

material.setUniform3fv("lightPos", [210, 202, 1]);
material.setUniform3fv("adjustAtt", [0.05, 0.0001, 0.0001]);
material.setUniform4fv("lightColor", [1.0, 0.8, 0.6, 1.0]);
material.setUniform4fv("ambientColor", [0.5, 0.6, 0.6, 1.0]);

sp.attachComponent(material);

function onBegin(node,evt,x,y)
{
    material.setUniform3fv("lightPos", [x, y, 1]);
}


function onMove(node, evt, x,y)
{
    material.setUniform3fv("lightPos", [x, y, 1]);
}


UIEventHandler.addNodeEvent(sp, UI_NODE_ENENT_TOUCH_BEGIN, onBegin);
UIEventHandler.addNodeEvent(sp, UI_NODE_ENENT_TOUCH_MOVED, onMove);

/**
 * 物理引擎demo
 */


/**
 * 创建space
 * gravity  重力
 * iterations
 */
var space = new BK.Physics.Space({"x":0,"y":-100}, 5)
BK.Director.attachSpace(space)

var screenScale = BK.Director.screenScale;

var tris = [{x: -20 * screenScale, y: -20 * screenScale}, {x: 0, y: 15 * screenScale}, {x: 20 * screenScale, y: -20 * screenScale}];
var staticBody = space.staticBody;
for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 6; j++) {
        var stagger = (j % 2) * 40;
        var offset = {x: (i * 80 + stagger) * screenScale, y: (j * 100 - 50) * screenScale};
        var shape = new BK.Physics.PolygonShape(staticBody, tris, {a:1, b:0, c:0, d:1, tx: offset.x, ty: offset.y}, 0);
        space.addShape(shape);
        shape.friction = 1.0;
        shape.elasticity = 1.0;
    }
}

var verts = new Array(5);
var minX = 10000, maxX = 0, minY = 10000, maxY = 0;
for (var i = 0; i < 5; i++) {
    var angle = -2.0 * 3.1415926 * i / 5;
    verts[i] = {x: 10 * Math.cos(angle) * screenScale, y: 10 * Math.sin(angle) * screenScale};
    if (minX > verts[i].x)
        minX = verts[i].x;
    if (minY > verts[i].y)
        minY = verts[i].y;
    if (maxX < verts[i].x)
        maxX = verts[i].x;
    if (maxY < verts[i].y)
        maxY = verts[i].y;
}

for (var i = 0; i < 100; i++) {
    var mass = 10;
    var moment = BK.Physics.momentForPolygon(mass, verts, {x:0,y:0}, 0);
    var body = new BK.Physics.Body(0, mass, moment, {"x":0,"y":0});
    var x = Math.random() * BK.Director.screenPixelSize.width;
    body.position = {x: x, y: BK.Director.screenPixelSize.height, z: 0};
    space.addBody(body);
    
    var shape = new BK.Physics.PolygonShape(body, verts, {a:1,b:0,c:0,d:1,tx:0,ty:0}, 0);
    shape.friction = 0.4;
    shape.elasticity = 0;
    space.addShape(shape);
    
    var centroid = body.centerOfGravity;
    var backTex = new BK.Texture('GameRes://resource/texture/star.png');
    var sp = new BK.Sprite(maxX - minX, maxY - minY, backTex,0,1,1,1);
    sp.anchor = {x: 0.5, y: 0.5};
    sp.attachComponent(body);
    
    sp.position = {x: x, y: BK.Director.screenPixelSize.height - 100, z: 0};
    BK.Director.root.addChild(sp);
}

//打开测试包围盒
BK.Physics.setSwitch(true);


