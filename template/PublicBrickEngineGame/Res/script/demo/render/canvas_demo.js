/**
 * 精灵类
 */
//竖屏模式下，以iPhone 6 (750x1334) 的分辨率为标准进行缩放。
var scale = BK.Director.screenPixelSize.width / 750;
//BK.Director.root.scale = {x:scale,y:scale*(-1)};
BK.Director.root.scale = {x:scale,y:scale};



var canvas = new BK.Canvas(BK.Director.screenPixelSize.width,BK.Director.screenPixelSize.height);
//canvas.backgroundColor = {r:0,g:0,b:1,a:1};
BK.Director.root.addChild(canvas);


//使用h5的坐标系 ,默认使用的是左下角的世界坐标系
canvas.useH5Mode()


//设置canvas
canvas.fillColor ={r:0.5,g:0.7,b:0.8,a:1.0}
//

//设置绘制线条宽度
canvas.lineWidth = 5;
canvas.drawCircle(111,111,100)


canvas.fillColor ={r:1,g:1,b:0.2,a:1.0}
canvas.drawEllipse(0,800,300,200)
canvas.clearRect(100,100,200,500)
canvas.drawLine(300,100,400,200)

////设置alpha,线条宽度
canvas.globalAlpha = 0.5
canvas.lineWidth = 5;

//绘制图片
canvas.drawImage("GameRes://resource/texture/icon.png",300,800)


canvas.beginPath();
canvas.moveTo(300,150);
canvas.lineTo(400,150);
canvas.stroke()
canvas.closePath();
////
////
//二次贝塞尔曲线
canvas.beginPath();
canvas.moveTo(420,120);
canvas.quadraticCurveTo(420,200,600,120);
canvas.stroke();
canvas.closePath();


//三次贝塞尔曲线
canvas.beginPath();
canvas.moveTo(420,420);
canvas.bezierCurveTo(420,500,420,500,600,620);
canvas.stroke();
canvas.closePath();

//绘制填充矩形
canvas.fillRect(100,600,200,35)
canvas.strokeRect(100,700,200,35)


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
canvas.fillText(content,100,300);

var content = "  中国人";
canvas.fillText(content,200,500);

var content = "canvas Test!  中国人";
canvas.fillText(content,500,700);





