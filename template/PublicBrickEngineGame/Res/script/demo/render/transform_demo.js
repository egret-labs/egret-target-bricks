var tex1 = new BK.Texture("GameRes://texture/icon.png");

var tex2 = new BK.Texture("GameRes://texture/rl_btn_confirm_normal.png");

var sp1 = new BK.Sprite(500, 500, tex1, 0, 1, 1, 1);
BK.Director.root.addChild(sp1);

var sp2 = new BK.Sprite(200, 200, tex2, 0, 1, 1, 1);
//sp1.addChild(sp2);
//BK.Director.root.addChild(sp2);

sp1.name = "sp1";
/*sp1.transform.localAnchor = {x: 0.5, y: 0.5}
sp1.transform.anchorParent = {x: 0.5, y: 0.5};
*/
//sp1.transform.matrix.set(1, 0, 0, 1, 100, 100);

sp2.name = "sp2";
/*sp2.transform.anchorParent = {x: 0.5, y: 0.5};
sp2.transform.scale = {x: 1, y: -1};
sp2.transform.localAnchor = {x: 0.5, y: 0.5};
sp2.position = {x: 100, y: 50};*/

var transform = new BK.Transform()
transform.matrix.set(1, 0, 0, 1, 100, 100);
sp1.transform = transform;


var rot = 100;
BK.Director.ticker.add(function(ts, dt) {
                       sp1.transform.matrix.set(1, 0, 0, 1, rot, 100);
                       rot += 1;
});

