BK.Script.loadlib("GameRes://script/core/basics/av.js");
//var image1 = BK.Image.loadImage("GameRes://test.png");
//BK.Image.faceDetectSync(image1);
try{
/*
struct bkFaceFeatures
{
    struct bkRect faceRect;
        
    struct {
        float scale;//scale compare with meanface
        float pitch;//Up>0, Down<0
        float yaw;    //Left>0, Right<0
        float roll;    //Anti-clockwise<0, Clockwise>0
        float tx;    //translation in X axis(0 : Image TopLeft)
        float ty;    //translation in Y axis(0 : Image TopLeft)
    } pose2D;
        
    union {
        struct {
            struct bkVec2 faceProfile[21];
            struct bkVec2 leftEyebrow[8];
            struct bkVec2 rightEyebrow[8];
            struct bkVec2 leftEye[8];
            struct bkVec2 rightEye[8];
            struct bkVec2 nose[13];
            struct bkVec2 mouth[22];
            struct bkVec2 pupil[2];
        } shape;o
    } faceShape;
};
*/

    var avCamera = BK.AVCamera.start({
        identifier: "", // unique id (openId)
        width: BK.Director.screenPixelSize.width,
        height: BK.Director.screenPixelSize.height,
        //cameraPos : 1,
       // beauty:9 ,
        //whitening:9,
        scaleSample: 0.125,
        needFaceTracker: true,
        //parent: nil, // 父亲节点，默认为root
        //position: {x: 0, y: 0, z: 0}, // 相对于父亲左下角的坐标
        onPrePreview: function(frameData) {
            //var tex = this.renderAsTexture();
            //tex.saveTo("GameSandBox://leezy");
            BK.Script.log(1, 0, "features = " + JSON.stringify(frameData.faceFeatures));
        },
        onStartRoom : function (succ,errInfo) {
            BK.Script.log(1, 0, "onStartRoom succ:" +succ +" errInfo:"+errInfo);
        }
    });
    //var avView = new BK.AVView(100, 200);
}
catch(e) {
    BK.Script.log(1, -1, "e = " + e);
}
/*
var rot = 0;
avNode.anchor = {x:0.5, y:0.5};
avNode.position = {x: BK.Director.screenPixelSize.width / 2, y: BK.Director.screenPixelSize.height / 2, z: 0};
BK.Director.ticker.add(function(ts, dt){
    avNode.rotation = {x: 0, y: 0, z: rot};
    rot = rot + 1;
});
*/
