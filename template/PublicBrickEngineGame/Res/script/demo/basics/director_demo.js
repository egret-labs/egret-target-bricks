/**
 * 获取屏幕比例
 */
var  scale = BK.Director.screenScale;

/**
 * 获取渲染大小
 */
var renderSize = BK.Director.renderSize;
BK.Script.log(1,1,renderSize.width);
BK.Script.log(1,1,renderSize.height);


/**
 * 添加一个节点至根节点
 */
var tex = new BK.Texture('GameRes://resource/texture/test.png')
var sp  = new BK.Sprite(100,100,tex,0,1,1,1);
BK.Director.root.addChild(sp);


/**
 * 附一个space至director
 */
var space = new BK.Physics.Space({"x":0,"y":-100},123)
BK.Director.attachSpace(space)
