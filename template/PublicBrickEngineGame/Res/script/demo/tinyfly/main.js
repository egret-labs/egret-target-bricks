BK.Script.loadlib('GameRes://script/demo/tinyfly/terrain.js');
BK.Script.loadlib('GameRes://script/demo/tinyfly/state_machine.js');
BK.Script.loadlib('GameRes://script/demo/tinyfly/ranklist.js');

//动作名称
var ROLE_JUMP = 'skiing_jump';
var ROLE_LAND = 'skiing_fall';
var ROLE_RUSH = 'skiing_continue';

// 角色状态机
var ROLE_STATE_SKI  = 1;
var ROLE_STATE_FLY  = 2;
var ROLE_STATE_LAND = 3;

//  角色属性
var ROLE_MASS = 6;
var ROLE_MIN_VEL_X = 200;
var ROLE_MAX_VEL_X = 10000;
var ROLE_MIN_VEL_Y = -300;
var ROLE_MAX_VEL_Y = 500;
var ROLE_APPLY_FORCE_Y = 1500000;

//终点位置
var FINISH_LOCATION_X = 0;
var FINISH_LOCATION_Y = 0;

var SPACE_GRAVITY = 200;

var controlPoints = [
                     {x :30,y : 200},
                     {x :24,y : 163},
                     {x :24,y : 239},
                     {x :25,y : 233},
                     {x :22,y : 223},
                     {x :20,y : 121},
                     {x :30,y : 178},
                     {x :24,y : 217},
                     {x :21,y : 174},
                     {x :30,y : 237},
                     {x :30,y : 215},
                     {x :29,y : 124},
                     {x :34,y : 128},
                     {x :24,y : 239},
                     {x :21,y : 122},
                     {x :20,y : 188},
                     {x :28,y : 198},
                     {x :31,y : 166},
                     {x :26,y : 123},
                     {x :34,y : 145},
                     {x :33,y : 186},
                     {x :35,y : 196},
                     {x :25,y : 234},
                     {x :23,y : 183},
                     {x :23,y : 228},
                     {x :25,y : 169},
                     {x :31,y : 163},
                     {x :26,y : 146},
                     {x :21,y : 191},
                     {x :30,y : 172},
                     {x :33,y : 124},
                     {x :30,y : 151},
                     {x :31,y : 222},
                     {x :22,y : 211},
                     {x :26,y : 168},
                     {x :22,y : 181},
                     {x :27,y : 178},
                     {x :21,y : 221},
                     {x :34,y : 186},
                     {x :28,y : 131},
                     {x :25,y : 206},
                     {x :20,y : 135},
                     {x :21,y : 226},
                     {x :21,y : 158},
                     {x :30,y : 198},
                     {x :27,y : 162},
                     {x :32,y : 171},
                     {x :20,y : 146},
                     {x :33,y : 167},
                     {x :31,y : 165},
                     {x :35,y : 207},
                     {x :27,y : 215},
                     {x :26,y : 209},
                     {x :27,y : 204},
                     {x :23,y : 164},
                     {x :21,y : 213},
                     {x :20,y : 189},
                     {x :32,y : 192},
                     {x :27,y : 142},
                     {x :28,y : 133},
                     {x :27,y : 214},
                     {x :27,y : 228},
                     {x :32,y : 238},
                     {x :35,y : 121},
                     {x :25,y : 227},
                     {x :33,y : 155},
                     {x :20,y : 240},
                     {x :21,y : 197},
                     {x :20,y : 154},
                     {x :26,y : 171},
                     {x :35,y : 228},
                     {x :33,y : 172},
                     {x :31,y : 123},
                     {x :24,y : 175},
                     {x :25,y : 176},
                     {x :24,y : 124},
                     {x :28,y : 167},
                     {x :28,y : 162},
                     {x :23,y : 227},
                     {x :24,y : 225},
                     {x :33,y : 225},
                     {x :21,y : 208},
                     {x :24,y : 196},
                     {x :20,y : 162},
                     {x :34,y : 238},
                     {x :29,y : 169},
                     {x :23,y : 122},
                     {x :23,y : 198},
                     {x :21,y : 189},
                     {x :24,y : 180},
                     {x :27,y : 163},
                     {x :32,y : 142},
                     {x :32,y : 218},
                     {x :35,y : 141},
                     {x :34,y : 210},
                     {x :24,y : 200}
];

//物理
var space = new BK.Physics.Space({"x":0,"y":-SPACE_GRAVITY},10)
BK.Director.attachSpace(space)


function createTerrain()
{
    var terr =new terrain(8,controlPoints);
    terr.processData();
    var vertexes = terr.vertexes;
    var indics  = terr.indics;
    if(terr.finishPoint){
        FINISH_LOCATION_X = terr.finishPoint.x;
        FINISH_LOCATION_Y = terr.finishPoint.y;
    }else{
        BK.Script.log(0,0,"finish is not define!!!");
    }

    var tex =new BK.Texture('GameRes://resource/texture/terrain.png');
    var  mesh = new BK.Mesh(tex,vertexes,indics);
    mesh.terrain = terr;
    mesh.name = 'mesh';
    BK.Director.root.addChild(mesh);
    
    //添加物理
    //线段shape
    var body = new BK.Physics.Body(1,100,125000,{x:0,y:0});
    space.addBody(body);
    // mesh.attachBody(body,0,0);
    var pts = terr.smoothPoints;
    var segments = new BK.Physics.SegmentShape(body,pts,0,0,1,true);
    for (var i=0;i<segments.length;i++)
    {
        var sg = segments[i];
        space.addShape(sg)
    }
    return mesh;
}

function loadScene(parent)
{
    var size = BK.Director.renderSize;
        //背景
    var backTex  =new BK.Texture('GameRes://resource/texture/background.png');   
    var background =new BK.Sprite(size.width,size.height,backTex,0,1,1,1);
    background.name = 'background';
    BK.Director.root.addChild(background);

    var mesh = createTerrain();

    //小旗子
    var flagTex  =new BK.Texture('GameRes://resource/texture/finish.png');
    var finishFlag = new BK.Sprite(50,50,flagTex,0,1,1,1);
    finishFlag.name = 'finishFlag';
    finishFlag.position = {x:FINISH_LOCATION_X,y:FINISH_LOCATION_Y};
    mesh.addChild(finishFlag);
}
var finsh = false;
//加载玩家状态机
function loadRoleUpdate(role)
{
    //添加三个状态，滑行，
    var skiState =  FSM.newState(ROLE_STATE_SKI,
        //enter
        function(node, state){
            // node.body.mass =  ROLE_MASS;
            node.setAnimation(0,ROLE_RUSH,true)
        },
        //exit
        null,
        //update 
        function(node, state){
            var pos = node.position;

            if(pos.x > FINISH_LOCATION_X)
            {
                // node.position = {x:FINISH_LOCATION_X,y:FINISH_LOCATION_Y};
                node.body.velocity = {x:0, y:0};
                if(finsh == false)
                {
                    var endTS = (new Date()).valueOf(); 
                    loadRankList((endTS-startTS)/1000);
                    finsh = true;
                }
            }else{
                var mesh = BK.Director.root.getNodeByName("mesh");

                var N = mesh.terrain.getNormal(pos.x, pos.y);
                var  angl = Math.atan2(-N.x, N.y) * 180 / Math.PI;
                node.rotation = {x:0,y:180,z:angl};

                var vel = node.body.velocity;

                if (vel.x < ROLE_MIN_VEL_X)
                {
                    vel.x = ROLE_MIN_VEL_X
                }
                // if (vel.x > ROLE_MAX_VEL_X )
                // {
                //     vel.x = ROLE_MAX_VEL_X
                // }
                if (vel.y < ROLE_MIN_VEL_Y ){
                    vel.y = ROLE_MIN_VEL_Y
                }
                // if (vel.y > ROLE_MAX_VEL_Y ){
                //     vel.y = ROLE_MAX_VEL_Y
                // }
                node.body.velocity = {x:vel.x, y:vel.y};

                var touchArr = BK.TouchEvent.getTouchEvent();
                if(touchArr)
                {
                    for(var i=0;i<touchArr.length;i++){
                        if(touchArr[i].status == 2 ){
                            BK.Script.log(0,0,"node force !!!!!!!!!");
                            node.body.applyForce(0, -ROLE_APPLY_FORCE_Y)
                            break;
                        }
                    }
                
                    BK.TouchEvent.updateTouchStatus();
                }
            }
    });
    FSM.addState(role,skiState);
    role.setCurrentState(ROLE_STATE_SKI);
}

//加载玩家所有信息
function loadPlayer(name, id,scale,isFlipY, x, y)
{
    var jsonPath  = BK.Script.pathForResource("GameRes://resource/spine/suit/default/role/role", 'json');
    var atlasPath = BK.Script.pathForResource("GameRes://resource/spine/suit/default/role/role", 'atlas');
    
    //加载骨骼
    var ani =new BK.SkeletonAnimation(atlasPath, jsonPath, 1,null,null,null );
    ani.position = {x:x,y:y};
    ani.name = name;
    ani.id = id;
    ani.scale = {x:scale,y:scale};
    var rotationY = 0;
    if(isFlipY==true) rotationY =180;
    ani.rotation = {x:0,y:rotationY,z:0};

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

    //添加动画
    var animJsonRush  = BK.Script.pathForResource("GameRes://resource/spine/action/skiing_continue/action", 'json');
    var animAtlasRush = BK.Script.pathForResource("GameRes://resource/spine/action/skiing_continue/action", 'atlas');
    ani.setAccessoryAnimation(animJsonRush, animAtlasRush, ROLE_RUSH);
    
    var animJsonLand  = BK.Script.pathForResource("GameRes://resource/spine/action/skiing_fall/action", 'json');
    var animAtlasLand = BK.Script.pathForResource("GameRes://resource/spine/action/skiing_fall/action", 'atlas');
    ani.setAccessoryAnimation(animJsonLand, animAtlasLand, ROLE_LAND);
    
    var animJsonJump  = BK.Script.pathForResource("GameRes://resource/spine/action/skiing_jump/action", 'json');
    var animAtlasJump = BK.Script.pathForResource("GameRes://resource/spine/action/skiing_jump/action", 'atlas');
    ani.setAccessoryAnimation(animJsonJump, animAtlasJump, ROLE_JUMP);
    
    var mesh = BK.Director.root.getNodeByName("mesh")
    BK.Director.ticker.add(function(ts,duration)
    {
        var pos = ani.position;
        mesh.position = {x:(-1)*(pos.x-80),y:0 };
    });

    mesh.addChild(ani);

    //添加物理引擎绑定
    var raduis = 20;
    var body = new BK.Physics.Body(0,80,125000,{x:x,y:y});
    space.addBody(body);
    var cicleShape =new BK.Physics.CircleShape(body,raduis,0,0);
    space.addShape(cicleShape);
    ani.attachBody(body,0,raduis);

    //添加状态机
	loadRoleUpdate(ani)
}

function loadRankList(time)
{
    var deviceRenderSize = BK.Director.renderSize;

    var devScreenX = deviceRenderSize.width;
    var devScreenY = deviceRenderSize.height;

    var designDeviceWidth = 750;
    var designDeviceHeight = 1334;

    var designWidth = 652;
    var designHeight = 759;

    var width  = devScreenX * designWidth / designDeviceWidth //--宽
    var height = width * designHeight / designWidth //--高
    var x = (devScreenX - width)/2.0
    var y = (devScreenY - height)/2.0

    var data = [
        {nick:"nick",rank:0,time:time,bouns:23,belongType:1 }
    ];
    var rankListView =  addRankListView(data,x,y,width,height,null,null,null );
    BK.Director.root.addChild(rankListView);
}
var startTS = (new Date()).valueOf(); 
loadScene(BK.Director.root);
loadPlayer('player',1,0.2,true,100,200);
