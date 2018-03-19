BK.Director.screenMode = 2;

BK.Director.setScreenModeChangeCallback(function (mode) {
  BK.Script.log(0, 0," mode change :"+mode);
  if (mode == 3 && BK.Director.screenMode == 2) {
    BK.Director.screenMode = 3;
  }else if (mode == 2 && BK.Director.screenMode == 3) {
    BK.Director.screenMode = 2;
  }
})
// BK.Director.test(2);
//竖屏模式下，以iPhone 6 (750x1334) 的分辨率为标准进行缩放。
var designWidth = 1334;
var designHeight = 750;
var scaleX = BK.Director.screenPixelSize.width / designWidth;
var scaleY = BK.Director.screenPixelSize.height / designHeight;
BK.Director.root.scale = {x:scaleX,y:scaleY};

BK.Script.log(0,0,"width = "+  BK.Director.screenPixelSize.width + " height = "+ BK.Director.screenPixelSize.height);

var backTex  =new BK.Texture('GameRes://resource/texture/icon.png');
var len = designHeight ;
var sp =new BK.Sprite(len,len,backTex,0,1,1,1);
sp.position = {x:designWidth/2,y:designHeight/2.0}
sp.anchor = {x:0.5,y:0.5};
BK.Director.root.addChild(sp);

