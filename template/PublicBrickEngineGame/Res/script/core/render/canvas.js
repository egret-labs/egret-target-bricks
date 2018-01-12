

function Canvas()
{
    var argumentLength = arguments.length;
    this._shadowColor = {r:0,g:0,b:0,a:0};
    this._shadowOffset = {x:0,y:0};
    this._shadowblur = 0;
    BK.Script.log(0,0,"argumentLength : "+argumentLength);
    if (argumentLength == 2){
        this.__nativeObj =  new BK.CanvasNode(arguments[0],arguments[1]);
    }
    else
    {
        return undefined;
    }
    var names = Object.getOwnPropertyNames(this.__nativeObj);
    names.forEach(function(element) {
        var key = element;
        if(key != "scale")
                  {
                  Object.defineProperty(this,key,{
                                        get:function () {
                                        return this.__nativeObj[key];
                                        },
                                        set:function(obj){
                                        this.__nativeObj[key] = obj;
                                        }
                                        });
                  }
    }, this);
    
    Object.defineProperty(Canvas.prototype, "font", {
        get: function () {
            return this.__nativeObj.font;
        },
        set: function (value) {
            this.__nativeObj.font = value;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Canvas.prototype, "lineWidth", {
        get: function () {
            return this.__nativeObj.lineWidth;
        },
        set: function (value) {
            this.__nativeObj.lineWidth = value;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Canvas.prototype, "globalAlpha", {
        get: function () {
            return this.__nativeObj.globalAlpha;
        },
        set: function (value) {
            this.__nativeObj.globalAlpha = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "fillColor", {
        get: function () {
            return this.__nativeObj.fillColor;
        },
        set: function (value) {
            this.__nativeObj.fillColor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "strokeColor", {
        get: function () {
            return this.__nativeObj.strokeColor;
        },
        set: function (value) {
            this.__nativeObj.strokeColor = value;
        },
        enumerable: true,
        configurable: true
    });
    
    Object.defineProperty(Canvas.prototype, "lineCap", {
                          get: function () {
                          return this.__nativeObj.lineCap;
                          },
                          set: function (value) {
                          this.__nativeObj.lineCap = value;
                          },
                          enumerable: true,
                          configurable: true
                          });
    
    Object.defineProperty(Canvas.prototype, "lineJoin", {
                          get: function () {
                          return this.__nativeObj.lineJoin;
                          },
                          set: function (value) {
                          this.__nativeObj.lineJoin = value;
                          },
                          enumerable: true,
                          configurable: true
                          });
    
    Object.defineProperty(Canvas.prototype, "miterLimit", {
                          get: function () {
                          return this.__nativeObj.miterLimit;
                          },
                          set: function (value) {
                          this.__nativeObj.miterLimit = value;
                          },
                          enumerable: true,
                          configurable: true
                          });
    
}

Canvas.prototype.setImagePath = function(path)
{
    if(path)
    {
        this.imagePath = path;
        var texture = new BK.Texture(path);
        this.__nativeObj.setTexture(texture);
    }
}

Canvas.prototype.getImagePath = function()
{
    return this.imagePath;
}

Canvas.prototype.setTexture = function(texture)
{
    this.__nativeObj.setTexture(texture);
}

Canvas.prototype.setFlipXY = function(flipx,flipy)
{
    this.__nativeObj.setFlipXY(flipx,flipy);
}

Canvas.prototype.setUVFlip = function(flipu,flipv)
{
    this.__nativeObj.setUVFlip(flipu,flipv);
}


Canvas.prototype.setUVWrap = function(wrapu,wrapv)
{
    this.__nativeObj.setUVWrap(wrapu,wrapv);
}

Canvas.prototype.setXYStretch = function(stretchX,stretchY)
{
    this.__nativeObj.setXYStretch(stretchX,stretchY);
}


Canvas.prototype.adjustTexturePosition = function(x,y,width,height,rotated)
{
    this.__nativeObj.adjustTexturePosition(x,y,width,height,rotated);
}

Canvas.prototype.addChild = function(child)
{
    return this.__nativeObj.addChild(child);
}

Canvas.prototype.dispose = function()
{
    return this.__nativeObj.dispose();
}

Canvas.prototype.removeChild = function(child)
{
    return this.__nativeObj.removeChild(child);
}

Canvas.prototype.removeChildById = function(id)
{
    return this.__nativeObj.removeChildById(id);
}

Canvas.prototype.removeChildByName = function(name)
{
    return this.__nativeObj.removeChildByName(name);
}

Canvas.prototype.removeChildByTag = function(tag)
{
    return this.__nativeObj.removeChildByTag(tag);
}

Canvas.prototype.queryChildAtIndex = function(index)
{
    return this.__nativeObj.queryChildAtIndex(index);
}


Canvas.prototype.queryChildById = function(Id)
{
    return this.__nativeObj.queryChildById(Id);
}

Canvas.prototype.queryChildByName = function(name)
{
    return this.__nativeObj.queryChildByName(name);
}

Canvas.prototype.queryChildByTag = function(tag)
{
    return this.__nativeObj.queryChildByTag(tag);
}

Canvas.prototype.getChildCount = function()
{
    return this.__nativeObj.getChildCount();
}

Canvas.prototype.removeFromParent = function()
{
    return this.__nativeObj.removeFromParent();
}

Canvas.prototype.attachComponent = function(component)
{
    return this.__nativeObj.attachComponent(component);
}

Canvas.prototype.detachComponent = function(component)
{
    return this.__nativeObj.detachComponent(component);
}


Canvas.prototype.queryComponent = function(type)
{
    return this.__nativeObj.queryComponent(type);
}

Canvas.prototype.queryComponentList = function(type)
{
    return this.__nativeObj.queryComponentList(type);
}

Canvas.prototype.hittest = function(pos)
{
    return this.__nativeObj.hittest(pos);
}

Canvas.prototype.isEqual = function(node)
{
    return this.__nativeObj.isEqual(node);
}

Canvas.prototype.convertToWorldSpace = function(pos)
{
    return this.__nativeObj.convertToWorldSpace(pos);
}

Canvas.prototype.convertToNodeSpace = function(pos)
{
    return this.__nativeObj.convertToNodeSpace(pos);
}



Canvas.prototype.setAtlas = function(jsonUrl,name)
{
    if(this.__nativeObj)
    {
        BK.CanvasSheetCache.loadSheet(jsonUrl);
        var texturePath = BK.CanvasSheetCache.getTexturePathByFilename(name);
        var texture = new BK.Texture(texturePath);
        this.__nativeObj.setTexture(texture);
        
        var frameInfo = BK.CanvasSheetCache.getFrameInfoByFilename(name);
        this.__nativeObj.adjustTexturePosition(frameInfo.frame.x, frameInfo.frame.y, frameInfo.frame.w, frameInfo.frame.h, frameInfo.rotated);
    }
    return 0;
}

Canvas.prototype.useH5Mode = function()
{
    if(this.__nativeObj)
    {
        return this.__nativeObj.useH5Mode(arguments[0]);
    }
    return 0;
}

//{ "drawCircle",bkJSCanvasDrawCircle,0},
Canvas.prototype.drawCircle = function()
{
    if(this.__nativeObj)
    {
        return this.__nativeObj.drawCircle(arguments[0],arguments[1],arguments[2]);
    }
    return 0;
}
//{ "drawLine",bkJSCanvasDrawLine,0},
Canvas.prototype.drawLine = function()
{
    if(this.__nativeObj)
    {
        return this.__nativeObj.drawLine(arguments[0],arguments[1],arguments[2],arguments[3]);
    }
    return 0;
}
//{ "drawEllipse",bkJSCanvasDrawEllipse,0},
Canvas.prototype.drawEllipse = function()
{
    if(this.__nativeObj)
    {
        return this.__nativeObj.drawEllipse(arguments[0],arguments[1],arguments[2],arguments[3]);
    }
    return 0;
}
//{ "drawImage",bkJSCanvasDrawImage,0},
Canvas.prototype.drawImage = function()
{
    if(this.__nativeObj)
    {
        var argumentLength = arguments.length;
        BK.Script.log(0,0,"argumentLength : "+argumentLength);
        if (argumentLength == 9){
            this.__nativeObj.drawImage(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6],arguments[7],arguments[8]);
        }
        else if(argumentLength == 5)
        {
            this.__nativeObj.drawImage(arguments[0],0,0,0,0,arguments[1],arguments[2],arguments[3],arguments[4]);
        }
        else if(argumentLength == 3)
        {
            this.__nativeObj.drawImage(arguments[0],0,0,0,0,arguments[1],arguments[2],0,0);
        }
        else
        {
            return undefined;
        }
    }
    return 0;
}
//{ "fill",bkJSCanvasFill,0},
Canvas.prototype.fill = function()
{
    if(this.__nativeObj)
    {
        return this.__nativeObj.fill();
    }
    return 0;
}
//{ "stroke",bkJSCanvasStroke,0},
Canvas.prototype.stroke = function()
{
    if(this.__nativeObj)
    {
        return this.__nativeObj.stroke();
    }
    return 0;
}
//{ "rect",bkJSCanvasRect,0},
Canvas.prototype.rect = function()
{
    if(this.__nativeObj)
    {
        return this.__nativeObj.rect(arguments[0],arguments[1],arguments[2],arguments[3]);
    }
    return 0;
}
//{ "fillRect",bkJSCanvasFillRect,0},
Canvas.prototype.fillRect = function()
{
    if(this.__nativeObj)
    {
        return this.__nativeObj.fillRect(arguments[0],arguments[1],arguments[2],arguments[3]);
    }
    return 0;
}
//{ "strokeRect",bkJSCanvasStrokeRect,0},
Canvas.prototype.strokeRect = function()
{
    if(this.__nativeObj)
    {
        return this.__nativeObj.strokeRect(arguments[0],arguments[1],arguments[2],arguments[3]);
    }
    return 0;
}
//{ "clearRect",bkJSCanvasClearRect,0},
Canvas.prototype.clearRect = function()
{
    if(this.__nativeObj)
    {
        return this.__nativeObj.clearRect(arguments[0],arguments[1],arguments[2],arguments[3]);
    }
    return 0;
}
//{ "beginPath",bkJSCanvasPathBegin,0},
Canvas.prototype.beginPath = function()
{
    if(this.__nativeObj)
    {
        return this.__nativeObj.beginPath();
    }
    return 0;
}
//{ "closePath",bkJSCanvasPathClose,0},
Canvas.prototype.closePath = function()
{
    if(this.__nativeObj)
    {
        return this.__nativeObj.closePath();
    }
    return 0;
}
//{ "moveTo",bkJSCanvasPathMoveTo,0},
Canvas.prototype.moveTo = function()
{
    if(this.__nativeObj)
    {
        return this.__nativeObj.moveTo(arguments[0],arguments[1]);
    }
    return 0;
}
//{ "lineTo",bkJSCanvasPathLineTo,0},
Canvas.prototype.lineTo = function()
{
    if(this.__nativeObj)
    {
        return this.__nativeObj.lineTo(arguments[0],arguments[1]);
    }
    return 0;
}
//{ "arcTo",bkJSCanvasPathArcTo,0},
Canvas.prototype.arcTo = function()
{
    if(this.__nativeObj)
    {
        return this.__nativeObj.arcTo(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);
    }
    return 0;
}
//{ "arc",bkJSCanvasPathArc,0},
Canvas.prototype.arc = function()
{
    if(this.__nativeObj)
    {
        return this.__nativeObj.arc(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);
    }
    return 0;
}
//{ "quadraticCurveTo",bkJSCanvasPathQuadraticCurveTo,0},
Canvas.prototype.quadraticCurveTo = function()
{
    if(this.__nativeObj)
    {
        return this.__nativeObj.quadraticCurveTo(arguments[0],arguments[1],arguments[2],arguments[3]);
    }
    return 0;
}

Canvas.prototype.bezierCurveTo = function()
{
    if(this.__nativeObj)
    {
        return this.__nativeObj.bezierCurveTo(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);
    }
    return 0;
}
Canvas.prototype.sava = function()
{
    if(this.__nativeObj)
    {
        return this.__nativeObj.sava();
    }
    return 0;
}
Canvas.prototype.restore = function()
{
    if(this.__nativeObj)
    {
        return this.__nativeObj.restore();
    }
    return 0;
}
//
Canvas.prototype.fillText = function()
{
    if(this.__nativeObj)
    {
        return this.__nativeObj.fillText(arguments[0],arguments[1],arguments[2]);
    }
    return 0;
}

Canvas.prototype.clip = function()
{
    if(this.__nativeObj)
    {
        return this.__nativeObj.clip();
    }
    return 0;
}
//
Canvas.prototype.isPointInPath = function()
{
    if(this.__nativeObj)
    {
        return this.__nativeObj.isPointInPath(arguments[0],arguments[1],arguments[2]);
    }
}
Canvas.prototype.scale = function()
{
    if(this.__nativeObj)
    {
        return this.__nativeObj.scales(arguments[0],arguments[1]);
    }
}

Canvas.prototype.rotate = function()
{
    if(this.__nativeObj)
    {
        return this.__nativeObj.rotate(arguments[0]);
    }
}

Canvas.prototype.translate = function()
{
    if(this.__nativeObj)
    {
        return this.__nativeObj.translate(arguments[0],arguments[1]);
    }
}
Canvas.prototype.shadowColor = function()
{
    this._shadowColor = arguments[0]
    if(this.__nativeObj)
    {
        return this.__nativeObj.shadow(this._shadowOffset.x,this._shadowOffset.y,this._shadowblur,this._shadowColor);
    }
}

Canvas.prototype.shadowBlur = function()
{
    this._shadowblur = arguments[0]
    if(this.__nativeObj)
    {
        return this.__nativeObj.shadow(this._shadowOffset.x,this._shadowOffset.y,this._shadowblur,this._shadowColor);
    }
}


Canvas.prototype.shadowOffsetX= function()
{
    this._shadowOffset.x = arguments[0]
    if(this.__nativeObj)
    {
        return this.__nativeObj.shadow(this._shadowOffset.x,this._shadowOffset.y,this._shadowblur,this._shadowColor);
    }
}

Canvas.prototype.shadowOffsetY= function()
{
    this._shadowOffset.y = arguments[0]
    if(this.__nativeObj)
    {
        return this.__nativeObj.shadow(this._shadowOffset.x,this._shadowOffset.y,this._shadowblur,this._shadowColor);
    }
}

//resign to BK object
BK.Canvas = Canvas;
BK.Script.log(0,0,"Load Canvas.js succeed.");
