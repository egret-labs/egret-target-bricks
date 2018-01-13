/**
 * 按钮
 */

//load base library files
BK.Script.loadlib('GameRes://script/core/ui/button.js');
BK.Script.loadlib('GameRes://script/core/render/spriteSheetCache.js');

//加载图集
var texPath = "GameRes://resource/texture/spritesheet/test.png";
var jsonPath = "GameRes://resource/texture/spritesheet/test.json";
BK.SpriteSheetCache.loadSheet(jsonPath,texPath);


/**
 * Button contructor
 * @width
 * @height
 * @normal texture path
 * @click callback function
 */
var normal = 'GameRes://resource/texture/rl_btn_confirm_normal.png'

var btn = new BK.Button(200,100,normal,function (node) {
                        BK.Script.log(0,0,"button click! id = " + node.id);
                        });
btn.id = 123;

/**
 *  通过路径设置normal、press、disable纹理
 */
//btn.setNormalTexturePath('GameRes://resource/texture/rl_btn_confirm_normal.png');
//btn.setPressTexturePath('GameRes://resource/texture/rl_btn_confirm_press.png');
//btn.setDisableTexturePath('GameRes://resource/texture/terrain.png');

/**
 *  通过图集设置normal、press、disable纹理
 */
btn.setNormalTextureFromSheetInfo(BK.SpriteSheetCache.getTextureFrameInfoByFileName("blue_circle.png"));
btn.setPressTextureFromSheetInfo(BK.SpriteSheetCache.getTextureFrameInfoByFileName("green_btn.png"));
btn.setDisableTextureFromSheetInfo(BK.SpriteSheetCache.getTextureFrameInfoByFileName("green_btn.png"));

// btn.disable = true;
//BK.Director.root.addChild(btn);

var newnode = new BK.Node()
newnode.canUserInteract = true;
newnode.position = {x:100,y:300};
newnode.addChild(btn);
BK.Director.root.addChild(newnode);

