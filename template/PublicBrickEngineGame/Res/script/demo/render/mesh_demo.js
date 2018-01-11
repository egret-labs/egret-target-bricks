/**
 * 网格贴图
 */


//Demo 1 
var tex =new BK.Texture('GameRes://resource/texture/terrain.png');
var  vertexes = [
     {"x":0, "y":0,"z":0,     "r":1,"g":1,"b":1,"a":1, "u":0,"v":0},
     {"x":320, "y":0,"z":0,   "r":1,"g":1,"b":1,"a":1, "u":0,"v":0},
     {"x":320, "y":320,"z":0, "r":1,"g":1,"b":1,"a":1, "u":0,"v":0},
];
var indices = [0,1,2];
var  mesh = new BK.Mesh(tex,vertexes,indices);
BK.Director.root.addChild(mesh);

//重设顶点与索引数组
// mesh.setVerticesAndIndices(vertexes,indices);

//新增顶点与索引数组
var  newVertexes = [
     {"x":0, "y":320,"z":0,     "r":1,"g":1,"b":1,"a":1, "u":0,"v":0},
];
var newIndices = [0,2,3];
mesh.addVerticesAndIndices(newVertexes,newIndices);

// //移除顶点与索引数组
// var vexIdx = 0;
// var vexLen = 0;
// var iIdx = 0;
// var iLen = 0;
// mesh.removeVerticesAndIndices(vexIdx,vexLen,iIdx,iLen);



// Demo 2  生成如山坡状的网格
BK.Script.loadlib('GameRes://script/demo/tinyfly/terrain.js');
var controlPoints = [
     {"x":0,"y":100,"isup":true},
     {"x":20,"y":300,"isup":false},
     {"x":20,"y":200,"isup":false},
     {"x":20,"y":300,"isup":true},
     {"x":20,"y":200,"isup":false},
     {"x":20,"y":200,"isup":true},
     {"x":20,"y":100,"isup":false}
];
var tex =new BK.Texture('GameRes://resource/texture/terrain.png');
var terr =new terrain(10,controlPoints);
terr.processData();
var vertexes = terr.vertexes;
var indices  = terr.indics;
var  moutainMesh = new BK.Mesh(tex,vertexes,indices);
BK.Director.root.addChild(moutainMesh);

var scale = BK.Director.screenPixelSize.width / 640;
BK.Director.root.scale = {x:scale,y:scale};