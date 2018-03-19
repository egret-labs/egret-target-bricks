
var tex1 = new BK.Texture("GameRes://resource/texture/terrain.png");
var wid1 = BK.Director.screenPixelSize.width;
var sp1 =new BK.Sprite(wid1,wid1,tex1,0,1,1,1);
//BK.Director.root.addChild(sp1);
var node = new BK.Node();
node.backgroundColor = {r: 0, g: 1, b: 0, a: 1};
node.contentSize = {width: wid1, height: wid1};
BK.Director.root.addChild(node);


var tex = new BK.Texture("GameRes://resource/texture/game_yxjm_icon_tx_quan.png");
var wid = BK.Director.screenPixelSize.width;
var sp =new BK.Sprite(wid,wid,tex,0,1,1,1);
sp.blendMode = 2;
var material = new BK.Render.Material("GameRes://script/demo/render/shader/UIRoundMask.vs", 
                                      "GameRes://script/demo/render/shader/UIRoundMask.fs");
sp.attachComponent(material);
BK.Director.root.addChild(sp);

var duration = 10000;
var startTime = Date.now();


var OnAdd = function()
{
    if (material)
    {
        var currentTime = Date.now();
        var timeDistance = currentTime - startTime;
        var process = timeDistance / duration;
        process = (process > 1) ? 1 : process;
        
        material.setUniform1f("Progress", process);

        if (1 == process)
        {
            BK.Director.ticker.remove(OnAdd);
            sp.detachComponent(material);
            material = null;
        }
    }
};
    

BK.Director.ticker.add(OnAdd);

