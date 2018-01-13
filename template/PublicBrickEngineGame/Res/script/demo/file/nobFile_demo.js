BK.Script.loadlib("GameRes://script/core/io/FileManager.js");
var sp;
var backTex;
var node = new BK.Node();
var fileManager = new BK.FileManager();
fileManager.readFile('GameRes://resource/texture/plane_blue.png',function(buff){
	backTex  = BK.Texture.createTextureWithBuffer(buff,'GameRes://resource/texture/plane_blue.png');
	sp = new BK.Sprite(200,200,backTex,0,1,1,1);
	sp.name = "sprite";
// sp.position = {x:100,y:100};
	node.position = {x:100,y:100};
	node.name = "super";
	node.addChild(sp);
	BK.Director.root.addChild(node);
});


BK.Director.ticker.add(function(ts,duration){
	fileManager.update();
});

