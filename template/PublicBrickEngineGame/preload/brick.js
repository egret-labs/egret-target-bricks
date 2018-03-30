//根据name查找节点
function findNodeByName(node,name)
{
    if(node.name == name)
    {
        return node;
    }else{
        var children = node.children;
        if(children)
        {
            for (var index = 0; index < children.length; index++) {
                var element = children[index];
                var foundNode = findNodeByName(element,name);
                if(foundNode != undefined)
                {
                    return foundNode;
                }
            }
        }else{
            return undefined;
        }
    }
}

//根据id查找节点
function findNodeById(node,id)
{
    if(node.id == id)
    {
        return node;
    }else{
        var children = node.children;
        if(children)
        {
            for (var index = 0; index < children.length; index++) {
                var element = children[index];
                var foundNode = findNodeById(element,id);
                if(foundNode != undefined)
                {
                    return foundNode;
                }
            }
        }else{
            return undefined;
        }
    }
}

function disposeNodeTree(node)
{
    if (node)
    {
        var children = node.children;
        if (children && children.length > 0)
        {
            var len = children.length;
            for (var index = 0; index < len; index++)
            {
                disposeNodeTree(children[index]);
            }
        }
        
        node.dispose();
    }
}

//根节点 工具类方法
BK.Director.root.getNodeByName = function (name)
{
    return findNodeByName(BK.Director.root,name);
}

BK.Director.root.getNodeById = function (id)
{
    return findNodeById(BK.Director.root,id);
}



nodeTreeHittest = function (node,pt)
{
    if(node.canUserInteract == true)
    {
        if (node.children) 
        {
            var children = node.children;
            //index大的优先响应
            for (var index = children.length-1; index >= 0; index--) 
            {
                var child = children[index];
                var hitNode =  nodeTreeHittest(child,pt)
                if(hitNode!=undefined){
                    return hitNode;
                }
            }
        }

        var hit = node.hittest(pt);
        if(hit == true)
        {
            return node;
        } 
        else
        {
            return undefined;
        }

    }else{
        return undefined;
    }
} 

treeHittest = function (pt)
{
    return nodeTreeHittest(BK.Director.root,pt);
}


BK.Director.init();

var accDt = 0;
var frameCount = 0;
function updateFPS(duration)
{
    ++frameCount;
    
    accDt += duration;
    if (accDt > 1.0) {
        BK.Director.fps = frameCount / accDt;
        accDt = 0;
        frameCount = 0;
    } 
}

function calcElapsedTime(duration)
{
    if (BK.Director.useFixedDt) {
        BK.Director.dt = duration;
    } else {
        if (!BK.Director.prevClock) {
            BK.Director.prevClock = BK.Time.clock;
        }
        var curClock = BK.Time.clock;
        BK.Director.dt = BK.Time.diffTime(BK.Director.prevClock, curClock);
        BK.Director.prevClock = curClock;
    }
}

function _tickerCallback_(ts, dt)
{
    calcElapsedTime(dt);
    
    TickerManager.Instance.update(ts, BK.Director.dt);

    updateFPS(BK.Director.dt);
    if (BK.Director.showDiagnosticsUI) {
        BK.Director.updateDiagnosticsUI();
    }  else {
        BK.Director.removeDiagnosticsUI();
    }
}

// init render ticker
var renderTicker = new BK.Ticker();
renderTicker.interval = 1;
renderTicker.setTickerCallBack(function(ts, duration)
{
    //BK.Render.clear(0,0,0,0);
    //BK.Render.treeRender( BK.Director.root, duration);
    BK.Director.renderAllCameras(duration);
    BK.Render.commit();

});

// init main ticker
var mainTicker = new BK.Ticker();
mainTicker.interval = 1;
mainTicker.setTickerCallBack(function(ts, duration)
{


});


BK.Director.dt = 0;
BK.Director.fps = 60;
BK.Director.useFixedDt = false;
BK.Director.ticker = mainTicker;
BK.Director.showDiagnosticsUI = false;

BK.Director.removeDiagnosticsUI = function()
{
    if (BK.Director.diagnosticsNode)
        BK.Director.diagnosticsNode.removeFromParent();
}

BK.Director.updateDiagnosticsUI = function()
{
    if (!BK.Director.diagnostics)
        return;
    
    if (BK.Director.diagnosticsNode) {
        if (!BK.Director.diagnosticsNode.parent)
            BK.Director.root.addChild(BK.Director.diagnosticsNode);
        BK.Director.innerUpdateDiagnosticsUI();
        return;
    }

    var style = {
        "fontSize": 28,
        "textColor" : 0xFFFF0000,
        "maxWidth" : BK.Director.screenPixelSize.width,
        "maxHeight":50,
        "width":300,
        "height":30,
        "textAlign":0,
        "bold":1,
        "italic":0,
        "strokeColor":0xFF000000,
        "strokeSize":5,
        "shadowRadius":5,
        "shadowDx":0,
        "shadowDy":0,
        "shadowColor":0xFFFF0000
    };
    
    var node = new BK.Node();
    BK.Director.root.addChild(node);
    BK.Director.diagnosticsNode = node;
    
    var fpsText = new BK.Text(style, "");
    fpsText.position = {x: 0, y: 320, z: 0};
    node.addChild(fpsText);

    var nodeCountText = new BK.Text(style, "");
    nodeCountText.position = {x: 0, y: 280, z: 0};
    node.addChild(nodeCountText);

    var vertexCountText = new BK.Text(style, "");
    vertexCountText.position = {x: 0, y: 240, z: 0};
    node.addChild(vertexCountText);

    var textureCountText = new BK.Text(style, "");
    textureCountText.position = {x: 0, y: 200, z: 0};
    node.addChild(textureCountText);

    var triangleCountText = new BK.Text(style, "");
    triangleCountText.position = {x: 0, y: 160, z: 0};
    node.addChild(triangleCountText);

    var drawCallCountText = new BK.Text(style, "");
    drawCallCountText.position = {x: 0, y: 120, z: 0};
    node.addChild(drawCallCountText);
    
    var useMemSizeText = new BK.Text(style, "");
    useMemSizeText.position = {x: 0, y: 80, z: 0};
    node.addChild(useMemSizeText);
    
    var readIOCountText = new BK.Text(style, "");
    readIOCountText.position = {x: 0, y: 40, z: 0};
    node.addChild(readIOCountText);
    
    var writeIOCountText = new BK.Text(style, "");
    writeIOCountText.position = {x: 0, y: 0, z: 0};
    node.addChild(writeIOCountText);
    
    node.zOrder = -10000;
    node.position = {x: 50, y: 50, z: 0};
    
    BK.Director.innerUpdateDiagnosticsUI = function() {
        var elapsedTime = BK.Director.diagnostics.elapsedTime;
        fpsText.content = "FPS : " + BK.Director.fps.toFixed(2);
        nodeCountText.content = "nodes : " + BK.Director.diagnostics.nodeCount;
        vertexCountText.content = "vertexs : " + BK.Director.diagnostics.vertexCount;
        textureCountText.content = "textures : " + BK.Director.diagnostics.textureCount;
        triangleCountText.content = "triangles : " + BK.Director.diagnostics.triangleCount;
        drawCallCountText.content = "drawCalls : " + BK.Director.diagnostics.drawCallCount;
        useMemSizeText.content = "useMem : " + BK.Director.diagnostics.useMemSize.toFixed(2) + "MB";
        readIOCountText.content = "readIO : " + BK.Director.diagnostics.readIOCount + "r/s";
        writeIOCountText.content = "writeIO : " + (BK.Director.diagnostics.writeIOCount / elapsedTime).toFixed(2) + "w/s";
    }
}

eval=function(){};
var newFun = Function;
Function = function(){BK.Script.log(1,1,"do not allow use new Function");};
Function.prototype = newFun.prototype;
newFun = undefined;

