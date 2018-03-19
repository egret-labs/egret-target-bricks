
BK.Script.log(1,1,"ImageSelector_demo start load");
BK.Script.loadlib('GameRes://lib/protocol.js');
BK.Script.loadlib('GameRes://script/core/ui/button.js');


var backTex  =new BK.Texture('GameRes://resource/texture/terrain.png');
var sp =new BK.Sprite(375,375,backTex,0,1,1,1);
sp.size = {width:1000,height:1000};
BK.Director.root.addChild(sp);
sp.position = {x:100,y:100};



function buttonClickcb (node)
{
    var imageSelector = new BK.ImageSelector();
    imageSelector.type = node.id;
    imageSelector.callback = function(selector){
        var status = selector.resultCode;
        if(status == 1) //选择图片成功
        {
            var texture = selector.getTexture();
            sp.setTexture(texture);
//            var size = selector.imageSize;
//            sp.size = size;
            
            var textureData = selector.getTextureData();
        }
        BK.Script.log(1,1,"ImageSelector callBack status: "+status);
    }
    imageSelector.selectImage()
}




var normal = 'GameRes://resource/texture/rl_btn_confirm_normal.png'
var btn = new BK.Button(200,100,normal,buttonClickcb);
btn.setNormalTexturePath('GameRes://resource/texture/rl_btn_confirm_normal.png');
btn.setPressTexturePath('GameRes://resource/texture/rl_btn_confirm_press.png');
btn.position = {x:0,y:0}
btn.id = 0;

var normal2 = 'GameRes://resource/texture/rl_btn_confirm_normal.png'
var btn2 = new BK.Button(200,100,normal2,buttonClickcb);
btn2.setNormalTexturePath('GameRes://resource/texture/rl_btn_confirm_normal.png');
btn2.setPressTexturePath('GameRes://resource/texture/rl_btn_confirm_press.png');
btn2.position = {x:0,y:-150}
btn2.id = 1;


var screenPixelSize = BK.Director.screenPixelSize;
var newnode = new BK.Node()
newnode.canUserInteract = true;
newnode.position = {x:screenPixelSize.width*0.5,y:screenPixelSize.height*0.7};
newnode.addChild(btn);
newnode.addChild(btn2);
BK.Director.root.addChild(newnode);

var closetext = 'GameRes://resource/texture/ranklist/rl_btn_close_press.png'
var closebtn = new BK.Button(214,82,closetext,function(node)
                             {
                             BK.Script.log(1,1,"ImageSelector_demo BK.QQ.notifyCloseGame  close");
                             BK.QQ.notifyCloseGame();
                             });
closebtn.setNormalTexturePath('GameRes://resource/texture/ranklist/rl_btn_close_normal.png');
closebtn.setPressTexturePath('GameRes://resource/texture/ranklist/rl_btn_close_press.png');
closebtn.position = {x:0,y:0}
closebtn.anchor = {x:0,y:0}
BK.Director.root.addChild(closebtn);

BK.Script.log(1,1,"ImageSelector_demo load success");

