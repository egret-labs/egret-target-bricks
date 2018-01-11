

var backTex  =new BK.Texture('GameRes://resource/texture/terrain.png');
var sp =new BK.Sprite(375,375,backTex,0,1,1,1);

var tex2 = new BK.Texture("GameRes://resource/texture/terrain.png");
sp.setTexture(tex2);
sp.size = {width:100,height:100};
//BK.Director.root.addChild(sp);
sp.position = {x:100,y:100};

sp.pivot = {x:50,y:50};
var anchor = sp.anchor;


var testTex = new BK.Texture("GameRes://resource/texture/spritesheet/test.png");
var iconSp = new BK.Sprite(50,50,testTex,0,1,1,1);
iconSp.adjustTexturePosition(1,131,256,256);
// iconSp.position = {x:100,y:100};
//sp.addChild(iconSp);


for (var i = 0; i < 5000; ++i){
    var t ;
    

    if (i % 2 == 0){
        t = new BK.Sprite(50,50,testTex,0,1,1,1);
    }else{
        t = new BK.Sprite(50,50,backTex,0,1,1,1);
    }
    
    t.position = {x:i*50, y:i*50};
    BK.Director.root.addChild(t);
}
