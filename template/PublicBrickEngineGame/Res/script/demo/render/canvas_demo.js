

BK.Script.loadlib('GameRes://script/core/render/canvas.js');
////竖屏模式下，以iPhone 6 (750x1334) 的分辨率为标准进行缩放。
var scale = BK.Director.screenPixelSize.width / 750;
BK.Director.root.scale = {x:scale,y:scale};



var canvas = new BK.Canvas(750,1334);
canvas.backgroundColor = {r:1,g:0,b:0,a:0.2};
BK.Director.root.addChild(canvas);


//////使用h5的坐标系 ,默认使用的是左下角的世界坐标系
canvas.useH5Mode()

//canvas.clip()
//canvas.isPointInPath(100,200)

//设置绘制线条宽度
canvas.lineWidth = 5;

canvas.drawStyle = 0;
canvas.fillColor ={r:0.5,g:0.7,b:0.8,a:1.0}
canvas.drawCircle(111,500,100)
canvas.fill()


canvas.drawStyle = 1;
canvas.strokeColor ={r:0.345,g:0.37,b:0.48,a:1.0}
canvas.drawCircle(111,400,100)
canvas.stroke()

canvas.drawStyle = 0;
canvas.fillColor ={r:1,g:1,b:0.2,a:1.0}
canvas.drawEllipse(0,800,300,200)
canvas.fill()

canvas.drawStyle = 1;
canvas.strokeColor ={r:0.95,g:0.3,b:0.1,a:1.0}
canvas.drawEllipse(0,600,300,200)
canvas.stroke()



//设置alpha,线条宽度
canvas.globalAlpha = 0.5
canvas.lineWidth = 10;
canvas.lineJoin = 0;
canvas.lineCap= 0;
canvas.miterLimit = 0;



//绘制填充矩形
canvas.fillRect(400,100,200,35)
canvas.strokeRect(400,200,200,35)
canvas.clearRect(100,100,50,800)
//
////绘制图片
canvas.drawImage("GameRes://resource/texture/icon.png",0,0)
//canvas.drawImage("GameRes://resource/texture/icon.png",0,0,100,200)
//canvas.drawImage("GameRes://resource/texture/icon.png",0,0,256,256,0,0,300,300)
//
//
canvas.drawStyle = 1;
canvas.beginPath();
canvas.moveTo(400,600);
canvas.lineTo(600,600);
canvas.lineTo(600,950);
canvas.lineTo(400,600);
canvas.stroke()
canvas.closePath();


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


//canvas.translate(100,100);
//canvas.rotate(32);
//canvas.scale(13,10);
//canvas.transforms(0.5,0,0,1,100,100)


//canvas.shadowColor({r:0,g:0.3,b:0.5,a:0.4})
//canvas.shadowRadius(5)
//canvas.shadowOffsetX(10)
//canvas.shadowOffsetY(10)


canvas.beginPath();
canvas.moveTo(420,920);           // 创建开始点
canvas.lineTo(500,920);          // 创建水平线
canvas.arcTo(550,920,550,970,50); // 创建弧
canvas.lineTo(550,1020);         // 创建垂直线
canvas.stroke();                // 进行绘制试显示调用addArcToPoint结束后current point不在(80,110)上，而是在弧线结束的地方


BK.Director.ticker.setTimeout(function () {
//                              canvas.contentSize = {"width":750 * 0.5,"height":1334* 0.5}

                              canvas.saveTo("GameSandBox://test2.png")
                              canvas.beginPath();
                              canvas.arc(200,400,50,0,2*Math.PI);
                              canvas.stroke();
                              canvas.closePath();

                              },10);


canvas.fillColor ={r:0,g:0.67,b:0.9,a:1.0}
canvas.drawStyle = 0;
canvas.lineWidth = 5
canvas.setTextAlign(1);
canvas.setTextSize(30)
canvas.textBaseLine = "bottom";
canvas.textAlign = "left";
//
canvas.fillText("你好,hello,canvas,ark",400,600);

canvas.saveTo("GameSandBox://test1.png")



//var size = canvas.measureText("你好,HELLO WORKD",200,300);
//BK.Script.log(1,0," mesure Size:"+size.width +" height:"+size.height);

////getTexture()
//var texture = canvas.getTexture();
//var circle =new BK.Sprite(300,600,texture,0,0,1,1);
//BK.Director.root.addChild(circle);
//var circle2 =new BK.Sprite(300,600,texture,0,0,1,1);
//circle2.position = {x:300,y:600};
//BK.Director.root.addChild(circle2);






