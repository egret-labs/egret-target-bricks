/**
 * 物理引擎demo
 */

var COMPONENT_PHYSIC_2D = 1;
/**
 * 创建space
 * gravity  重力
 * iterations 
 */
var space = new BK.Physics.Space({"x":0,"y":-100},5)
BK.Director.attachSpace(space)

function addAbBall(x,y)
{
    var width = 100
    var bodytype = 0 // 0动态刚体 1运动学刚体 2 静态刚体
    var mass  = 1
    var raduis = width/2
    var moment = BK.Physics.momentForCircle(mass, raduis, 0, {x:0, y:0})
    var body = new BK.Physics.Body(bodytype,mass,moment,{"x":x,"y":y});
    space.addBody(body)

    var cicleShape =new BK.Physics.CircleShape(body,raduis,0,0);
    space.addShape(cicleShape);
    body.collisionType = 111;

    var backTex  =new BK.Texture('GameRes://resource/texture/background.png');
    var sp =new BK.Sprite(width,width,backTex,0,1,1,1);
   
    sp.position = {"x":x,"y":y};
    sp.attachComponent(body);
    sp.bodyOffset = {x: raduis, y: raduis};
    
    var qb = sp.queryComponent(COMPONENT_PHYSIC_2D);
    qb.force = ({x: 2000, y: -1500});

    // 位置改变时每次回调。返回false时。物理引擎不在控制位置
    // sp.postionUpdateCallback =  function(){
    //     BK.Script.log(0,0,"postionUpdateCallback");
    //     return false;
    // };
    //body.force = {x:00,y:-10000};
    return sp;
}
var sp  = addAbBall(300,400);
BK.Director.root.addChild(sp);


//线段shape
var pts = [ {"x":0,"y":0}, {"x":450,"y":0} ]
var isSmooth = true
var raduis = 1
var elasticity =1 //弹性系数
var friction = 1 //摩擦力

var staticBody = new BK.Physics.Body(2,0,0,{"x":50,"y":10});
var segments = new BK.Physics.SegmentShape(staticBody,pts,elasticity,friction,raduis,isSmooth);
space.addBody(staticBody);
for (var i=0;i<segments.length;i++)
{
    var sg = segments[i];
    space.addShape(sg)
}


var polyPts = [
    {"x":0 ,"y":0},
    {"x":150,"y":0},
    {"x":150,"y":150},
    {"x":0 ,"y":150}
]
var transForm = {"a": 1, "b":0, "c":0, "d":1, "tx":0, "ty":0}

//盒子1
var boxBody = new BK.Physics.Body(2,0,0,{"x":150,"y":100});
space.addBody(boxBody);
var polyShape = new BK.Physics.PolygonShape(boxBody,polyPts,transForm,1);
space.addShape(polyShape);


//盒子2
var boxBody2 = new BK.Physics.Body(2,0,0,{"x":400,"y":100});
space.addBody(boxBody2);
var polyShape2 = new BK.Physics.PolygonShape(boxBody2,polyPts,transForm,1);
space.addShape(polyShape2);

//盒子3
var boxBody3 = new BK.Physics.Body(2,0,0,{"x":600,"y":100});
space.addBody(boxBody3);
var polyShape3 = new BK.Physics.PolygonShape(boxBody3,polyPts,transForm,1);
space.addShape(polyShape3);


boxBody.collisionType = 222;
boxBody2.collisionType = 333;
boxBody3.collisionType = 444;



BK.Physics.addCollisionHandler(space,111,boxBody3.collisionType,null,
    function(arbiter){  //begin
        // 返回false时，pre，post不会调用，separate会调用
        //返回true时,调用pre
        //BK.Script.log(0,0,"box 3 begin....");
        var bodies = arbiter.getBodies();
        var nor = arbiter.normal;
        BK.Script.log(1, 0, "normal = " + nor);
        return true;
        // return true;  //true代表接受碰撞，false代表忽略碰撞，seprate函数依然会调用
    },
    //每一帧下回调 pre + post 
    function(arbiter){//pre
        // BK.Script.log(0,0,"box 3 pre...");        
         // 返回false时，post不会调用，separate会调用
        return true;
    },
    function(arbiter){ //post   物理相交时调用
        // BK.Script.log(0,0,"box 3 post....");
    },
    function(arbiter){ //separate
        // BK.Script.log(0,0,"box 3 separate....");
    }
);



BK.Physics.addCollisionHandler(space,111,boxBody2.collisionType,null,
    function(arbiter){  //begin
        BK.Script.log(0,0,"box 2 begin....");
        var bodies = arbiter.getBodies();
                               var force = bodies[0].force;
                               var velocity = bodies[1].velocity;
                               var position = bodies[0].position;
        var nor = arbiter.normal;
        BK.Script.log(1, 0, "normal.x = " + nor.x + "normal.y = " + nor.y);
                               BK.Script.log(1, 0, "force.x = " + force.x + "force.y = " + force.y);
                               BK.Script.log(1, 0, "velocity.x = " + velocity.x + "velocity.y = " + velocity.y);
                               BK.Script.log(1, 0, "position.x = " + position.x + "position.y = " + position.y);
        return true; 
    },
    function(arbiter){//pre
        // BK.Script.log(0,0,"box 2 pre..."); 
        return true;
    },
    function(arbiter){ //post   物理相交时调用
        // BK.Script.log(0,0,"box 2 post....");
    },
    function(arbiter){ //separate
        BK.Script.log(0,0,"box 2 separate....");
    }
);


//打开测试包围盒
BK.Physics.setSwitch(true);
