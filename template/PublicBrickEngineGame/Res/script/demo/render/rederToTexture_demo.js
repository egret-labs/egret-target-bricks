// var node = new BK.Node();
// var backTex  =new BK.Texture('GameRes://resource/texture/plane_blue.png');
// var sp =new BK.Sprite(200,200,backTex,0,1,1,1);
// sp.name = "sprite";
// // sp.position = {x:100,y:100};
// node.position = {x:100,y:100};
// node.name = "super";
// node.addChild(sp);
// var node1 = new BK.Node();
// var sp1 =new BK.Sprite(200,200,backTex,0,1,1,1);
// sp1.name = "sprite1";
// // sp.position = {x:100,y:100};
// node1.position = {x:0,y:0};
// node1.name = "super1";
// node1.addChild(sp1);
// var node2 = new BK.Node();
// var sp2 =new BK.Sprite(200,200,backTex,0,1,1,1);
// sp2.name = "sprite2";
// // sp.position = {x:100,y:100};
// node2.position = {x:200,y:200};
// node2.name = "super2";
// node2.addChild(sp2);
// BK.Director.root.addChild(node);
// BK.Director.root.addChild(node1);
// BK.Director.root.addChild(node2);
// var superPos = {x:100,y:100};
// var pos = sp.convertToWorldSpace(superPos);
// BK.Script.log(0,0,"Position x:"+pos.x+" y:"+pos.y);
// var tex = BK.Texture.createTexture(BK.Director.screenPixelSize.width,BK.Director.screenPixelSize.height);
// BK.Script.log(1,1,"rogersxiao tex="+tex);
// //BK.Render.renderToTexture(BK.Director.root,tex);
// var temp = 0;
// BK.Director.ticker.add(function(ts,duration){
//     if(temp ==  0){
//         //BK.Render.treeRender( BK.Director.root,duration);
//         BK.Render.renderToTexture(BK.Director.root,tex);
//         tex.writeToDisk("GameSandBox://test.png");
//         temp= 1;
//         var cmd = "cs.share_pic.local";
//         var data = {
//                     "path":"GameSandBox://test.png"
//                    };
//         BK.MQQ.SsoRequest.send(data, cmd);
//     }
// })





//node添加图片
var node = new BK.Node();
var backTex = new BK.Texture('GameRes://resource/assets/bg.jpg');
var sp = new BK.Sprite(400, 400, backTex, 0, 1, 1, 1);
sp.name = "sprite";
// sp.position = {x:100,y:100};
node.position = { x: 0, y: 0 };
node.name = "super";
node.addChild(sp);

//node1添加图片
var node1 = new BK.Node();
var sp1 = new BK.Sprite(400, 400, backTex, 0, 1, 1, 1);
sp1.name = "sprite1";
// sp.position = {x:100,y:100};
node1.position = { x: 100, y: 100 };
node1.name = "super1";
node1.addChild(sp1);

//node2添加图片
var node2 = new BK.Node();
var sp2 = new BK.Sprite(400, 400, backTex, 0, 1, 1, 1);
sp2.name = "sprite2";
// sp.position = {x:100,y:100};
node2.position = { x: 200, y: 200 };
node2.name = "super2";
node2.addChild(sp2);

let node3 = new BK.Node();
node3.addChild(node);
node3.addChild(node2);


// BK.Director.root.addChild(node);
BK.Director.root.addChild(node1);
// BK.Director.root.addChild(node2);
// BK.Director.root.addChild(node3);


var superPos = { x: 100, y: 100 };
var pos = sp.convertToWorldSpace(superPos);
BK.Script.log(0, 0, "Position x:" + pos.x + " y:" + pos.y);
// var tex = BK.Texture.createTexture(BK.Director.screenPixelSize.width, BK.Director.screenPixelSize.height);
// BK.Script.log(1, 1, "rogersxiao tex=" + tex);
//BK.Render.renderToTexture(BK.Director.root,tex);


BK.Director.ticker.setTimeout(() => {
    // var tex = BK.Texture.createTexture(BK.Director.screenPixelSize.width, BK.Director.screenPixelSize.height);
    var tex = BK.Texture.createTexture(BK.Director.screenPixelSize.width, 350);
    BK.Render.renderToTexture(node3, tex);
    let new_sp = new BK.Sprite(tex.size.width, tex.size.height, tex, 0, 1, 1, 1);

    let node4 = new BK.Node();

    node4.addChild(new_sp);

    debugger;
    BK.Director.root.addChild(node4);
    BK.Director.ticker.setTimeout(() => {
        node4.position = { x: 0, y: BK.Director.screenPixelSize.height - new_sp.size.height };
    }, 100)

}, 4000)


// var temp = 0;
// BK.Director.ticker.add(function(ts,duration){
//     if(temp ==  0){
//         //BK.Render.treeRender( BK.Director.root,duration);
//         BK.Render.renderToTexture(BK.Director.root,tex);
//         // tex.writeToDisk("GameSandBox://test.png");
//         // temp= 1;
//         // var cmd = "cs.share_pic.local";
//         // var data = {
//         //             "path":"GameSandBox://test.png"
//         //            };
//         // BK.MQQ.SsoRequest.send(data, cmd);
//     }
// })
