/**
 * Node节点
 */

var node = new BK.Node();
node.id = 1;
node.name = "test";
node.position = {x:100,y:100};
// node.scale = {x:1.5,y:1.5};
node.rotation = {x:0,y:0,z:0};
node.hidden = false;
node.vertexColor = {r:1,g:1,b:1,a:1};
node.canUserInteract = true;
node.zOrder = 1;

BK.Director.root.addChild(node);

//1.添加节点
var testTex = new BK.Texture("GameRes://resource/texture/star.png");
var childNode1 = new BK.Sprite(100,100,testTex,0,1,1,1);
childNode1.name = "testChild";
childNode1.id = 123;
node.addChild(childNode1);

//2.移除节点
//2.1 通过名字移除，并且销毁
// if(node.removeChildByName("testChild",true)){
//   BK.Script.log(0,0,"Remove succeed!");
// }else{
//   BK.Script.log(0,0,"Remove failed!");
// }

//2.2通过id移除
// if (node.removeChildById(123,false)) {
//   BK.Script.log(0,0,"Remove succeed!");
// }else{
//   BK.Script.log(0,0,"Remove failed!");
// }

//2.3 自己从
node.removeFromParent();

// var localPos = node.convertToNodeSpace({x:100,y:100});
// BK.Script.log(0,0,"local pos x = "+ localPos.x + " y = "+localPos.y);

// var worldPos = node.convertToWorldSpace({x:100,y:100});
// BK.Script.log(0,0,"worldPos pos x = "+ worldPos.x + " y = "+worldPos.y);

