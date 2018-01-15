

BK.Script.loadlib('GameRes://script/core/render/canvas.js');
//竖屏模式下，以iPhone 6 (750x1334) 的分辨率为标准进行缩放。
var scale = BK.Director.screenPixelSize.width / 750;
BK.Director.root.scale = {x:scale,y:scale};



var canvas = new BK.Canvas(750,1334);
canvas.backgroundColor = {r:1,g:0,b:0,a:0.2};
BK.Director.root.addChild(canvas);


////使用h5的坐标系 ,默认使用的是左下角的世界坐标系
//canvas.useH5Mode()

canvas.clip()
canvas.isPointInPath(100,200)

////设置绘制线条宽度
canvas.lineWidth = 5;

canvas.fillColor ={r:0.5,g:0.7,b:0.8,a:1.0}
canvas.drawCircle(111,500,100)
canvas.fill()


canvas.strokeColor ={r:0.345,g:0.37,b:0.48,a:1.0}
canvas.drawCircle(111,400,100)
canvas.stroke()

canvas.fillColor ={r:1,g:1,b:0.2,a:1.0}
canvas.drawEllipse(0,800,300,200)
canvas.fill()


canvas.strokeColor ={r:0.95,g:0.3,b:0.1,a:1.0}
canvas.drawEllipse(0,600,300,200)
canvas.stroke()



////设置alpha,线条宽度
//canvas.globalAlpha = 0.5
canvas.lineWidth = 10;
//canvas.lineJoin = 0;
//canvas.lineCap= 0;
//canvas.miterLimit = 0;



//绘制填充矩形
canvas.fillRect(400,100,200,35)
canvas.strokeRect(400,200,200,35)
canvas.clearRect(100,100,50,800)

//绘制图片
//canvas.drawImage("GameRes://resource/texture/icon.png",0,0)
//canvas.drawImage("GameRes://resource/texture/icon.png",0,0,100,200)
//canvas.drawImage("GameRes://resource/texture/icon.png",0,0,256,256,0,0,300,300)



canvas.drawLine(300,100,400,200)

canvas.beginPath();
canvas.moveTo(300,350);
canvas.lineTo(400,350);
canvas.lineTo(400,450);
canvas.lineTo(300,350);
canvas.stroke()
canvas.closePath();
//
//
//二次贝塞尔曲线
canvas.beginPath();
canvas.moveTo(420,120);
canvas.quadraticCurveTo(420,200,600,120);
canvas.stroke();
canvas.closePath();


//三次贝塞尔曲线
canvas.beginPath();
canvas.moveTo(420,420);
canvas.bezierCurveTo(420,500,600,500,600,420);
canvas.stroke();
canvas.closePath();




var style = {
    "fontSize":20,
    "textColor" : 0xFFFF0000,
    "maxWidth" : 200,
    "maxHeight": 400,
    "width":100,
    "height":200,
    "textAlign":0,
    "bold":1,
    "italic":1,
    "strokeColor":0xFF000000,
    "strokeSize":5,
    "shadowRadius":5,
    "shadowDx":10,
    "shadowDy":10,
    "shadowColor":0xFFFF0000
}
canvas.font = style;

var content = "canvas Test! ";
canvas.fillText(content,500,300);

var content = "  中国人";
canvas.fillText(content,500,500);

var content = "canvas Test!  中国人";
canvas.fillText(content,500,700);


//canvas.translate(100,100);
//canvas.rotate(32);
//canvas.scale(13,10);

canvas.shadowColor({r:0,g:0.3,b:0.5,a:0.4})
canvas.shadowBlur(10)
canvas.shadowOffsetX(10)
canvas.shadowOffsetY(10)



canvas.drawImage("GameRes://resource/texture/icon.png",0,0,256,256,0,0,300,300)

