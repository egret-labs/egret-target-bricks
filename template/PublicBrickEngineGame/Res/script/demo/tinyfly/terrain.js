

//原控制点是非连续的
function terrain(dt,ctrlPts)
{
    this.dt = dt;
    this.ctrlPoints = ctrlPts;
    this.finishPoint = undefined;

    //将单独的控制点整理成连续的点
    this.covert2SeriesPoints = function  (separatePts)
    {
        var dt = this.dt
        var seriesPoints = [];
        var preX = 0;
        var  finishPointIdx = separatePts.length -3;
        for (var index = 0; index < separatePts.length; index++) {
            var element = separatePts[index];
            var x = 0;
            var y = 0;
            if(index == 0)
            {
                preX = element.x;
                x = element.x;
                y = element.y;

            }else{
                x = preX + element.x * dt;
                y = element.y;
                preX = x;
            }
            //记录终点位置
            if(finishPointIdx == index){
                this.finishPoint = {x:x,y:y};
            }

            seriesPoints.push({"x":x,"y":y});
        }
        return seriesPoints;
    }

    //在两个点之前插值
    this.generateInterpolatePoints = function(p1,p2)
    {
        var pots = [];
        var a = (p1.y + p2.y)/2;
        var b = (p1.y - p2.y)/2;
        var n = (p2.x - p1.x) /dt;
        var count = Math.abs(p2.x-p1.x)/dt;

        for (var i = 0; i <= count; i++) {
            var x = p1.x + dt * i;
            var y = a + b*Math.cos( 3.14 * i / n); 
            var u = i*1/count;
            var v = 1;
            pots.push({"x":x,"y":y,"u":u,"v":v});
        }
        return pots;
    }


    //利用连续的点数组 生成更加平滑的点数组
    this.generateSmoothPoints = function (ary)
    {
        var interpolatePos = [];
        var dt = this.dt
       
        for (var index = 0; index < ary.length; index++) {
                
            if(index > 0){
                var p1 =  ary[index-1];
                var p2 = ary[index];
                var tmpPos = this.generateInterpolatePoints(p1,p2);
                interpolatePos.concat(tmpPos);
                for (var idx = 0; idx < tmpPos.length; idx++) {
                    var element = tmpPos[idx];
                    interpolatePos.push(element);
                }
            }
        }
        return interpolatePos;
    }

    this.vertexes = [];
    this.indics = [];

    //将平滑的点转成 点转成顶点
    this.convertPtsToVertexes = function (pts)
    {
        var veteies = [];
        var indics  = [];
        var indexCount = 0;
        for (var idx = 0; idx < pts.length; idx++) {
            
            if(idx > 0){
                var element = pts[idx];

                var p1 = pts[idx-1];
                var p2 = pts[idx];

                var v0 =  {"x":p1.x, "y":0,"z":0,     "r":1,"g":1,"b":1,"a":1, "u":p1.u,"v":0};
                var v1 =  {"x":p1.x, "y":p1.y,"z":0,   "r":1,"g":1,"b":1,"a":1,  "u":p1.u,"v":p1.v};
                var v2 =  {"x":p2.x, "y":p2.y,"z":0,   "r":1,"g":1,"b":1,"a":1,  "u":p2.u,"v":p2.v};

                var v3 =  {"x":p2.x, "y":p2.y,"z":0,  "r":1,"g":1,"b":1,"a":1,  "u":p2.u,"v":p2.v};
                var v4 =  {"x":p2.x, "y":0,"z":0,     "r":1,"g":1,"b":1,"a":1,  "u":p2.u,"v":0};
                var v5 =  {"x":p1.x, "y":0,"z":0,     "r":1,"g":1,"b":1,"a":1,  "u":p1.u,"v":0};

                veteies.push(v0);
                veteies.push(v1);
                veteies.push(v2);
                veteies.push(v3);
                veteies.push(v4);
                veteies.push(v5);
            }
        }
        return veteies;
    }

    this.generateIndics = function(vets)
    {   
        var indicsArray = [];
         for (var idx = 0; idx < vets.length; idx++) {
            indicsArray[idx] = idx;
         }
         return indicsArray;
    }

    this.smoothPoints = [];
    this.seriesCtrlPoints = [];
    this.processData = function()
    {
        ///地形
        //生成连续的点
        this.seriesCtrlPoints = this.covert2SeriesPoints(this.ctrlPoints);
        //生成更加平滑的点
        this.smoothPoints =  this.generateSmoothPoints(this.seriesCtrlPoints);
        this.vertexes = this.convertPtsToVertexes(this.smoothPoints);
        this.indics = this.generateIndics(this.vertexes);

    }

    this.getNormal = function(x,y)
    {
        var smallerPt;
        var biggerPt;
        var len = this.seriesCtrlPoints.length
        for (var index = 0; index < len; index++) {
            var front = this.seriesCtrlPoints[index];
            var rear  = undefined;
            if((index + 1) < len){
                rear  = this.seriesCtrlPoints[index+1];
            }

            if ( front.x <= x && rear.x >= x) {
                
                var x1 = front.x;
                var y1 = front.y;
                var x2 = rear.x;
                var y2 = rear.y;
                var  b = (y1 - y2) / 2;
                var normalX = b * Math.sin((Math.PI * x) / (x2 - x1) - (x1*Math.PI) / (x2 - x1)) * (Math.PI) / (x2 - x1);
                var normalY = 1;
                return {x:normalX,y:normalY};
            }
        }  
        return  {x:0,y:0};
    }
}

