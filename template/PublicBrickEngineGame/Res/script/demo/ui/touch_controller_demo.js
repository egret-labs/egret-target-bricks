
//var path   =  BK.Script.pathForResource('GameRes://resource/texture/baba','png') //文件路径
//var sp =new BK.Sprite(100,100,path,0,1,1,1);
var style = {
    "cornerRadius":50
}

var handleStyle = {
    "cornerRadius":0
}

var width = 100
var height = 100
var babaTex  =new BK.Texture('GameRes://resource/texture/blue_circle.png');
var Image = new BK.Sprite(width,height,babaTex,0,1,1,1);
Image.position = {"x":100,"y":100};
Image.id = 111;


var handleTex = new BK.Texture('GameRes://resource/texture/big_blue_circle.png')
var handle = new BK.Sprite(200,200,handleTex,0,1,1,1);
handle.position = {"x":50,"y":50};
handle.id = 112;

var moveTex = new BK.Texture('GameRes://resource/texture/terrain.png')


var picMove = new BK.Sprite(200,200,moveTex,0,1,1,1);
var picX = 50;
var picY = 400;
picMove.position = {"x":50,"y":400};
var handleId;
var picId;

BK.Director.root.addChild(handle);
BK.Director.root.addChild(Image);
BK.Director.root.addChild(picMove);


BK.Director.ticker.add(function (ts,duration) {
    var touchArr = BK.TouchEvent.getTouchEvent();
        if(touchArr == undefined){
            return;
        }
        for(var i=0;i<touchArr.length;i++){
            BK.Script.log(1,1,"touch event status="+touchArr[i].status+",x="+touchArr[i].x + ",y="+touchArr[i].y + ",id="+touchArr[i].id);
            var x = touchArr[i].x;
            var y = touchArr[i].y;
            if(touchArr[i].status == 2 ){
                if(x < 250 && x> 50 && y<250 && y>50){
                    if(handleId == undefined){
                        handleId =touchArr[i].id;
                    }
                    Image.position = {"x":x-50,"y":y-50};
                }
                
                if(x>picX && x<(picX+200) && y<(picY+200) && y>picY){
                    if(picId == undefined){
                        picId =touchArr[i].id;
                    }
                }
                
            }
            if(touchArr[i].status == 3 ){
                if(touchArr[i].id == handleId){
                    if(x < 50){
                        x = 50;
                    }
                    if(x > 250){
                        x = 250;
                    }
                    if(y<50){
                        y = 50;
                    }
                    if(y>250){
                        y = 250;
                    }
                    Image.position = {"x":x-50,"y":y-50};
                }
                
                if(touchArr[i].id == picId){
                    picX = x-100;
                    picY = y-100;
                    picMove.position={"x":x-100,"y":y-100};
                }
            }
            
            if(touchArr[i].status == 1){
                if(touchArr[i].id == handleId){
                    handleId=undefined;
                    Image.position = {"x":100,"y":100};
                }
                
                if(touchArr[i].id == picId){
                    picId = undefined;
                }
            }
        }
        BK.TouchEvent.updateTouchStatus();
        BK.Script.log(1,1,"updateTouchStatus");
})
