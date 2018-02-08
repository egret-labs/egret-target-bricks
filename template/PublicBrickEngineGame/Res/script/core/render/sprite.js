BK.Script.loadlib('GameRes://script/core/render/spriteSheetCache.js');

function Sprite()
{
    this.imagePath = null;
    var argumentLength = arguments.length;
    if (argumentLength == 7){
        this.__nativeObj =  new BK.SpriteNode(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);
    }
    else if(argumentLength == 1)
    {
        this.__nativeObj =  new BK.SpriteNode(arguments[0]);
        this.imagePath = arguments[0]
    }
    else
    {
        this.__nativeObj =  new BK.SpriteNode();
    }
    var names = Object.getOwnPropertyNames(this.__nativeObj);
    names.forEach(function(element) {
        var key = element;
        Object.defineProperty(this,key,{
                        get:function () {
                            return this.__nativeObj[key];
                        },
                        set:function(obj){
                            this.__nativeObj[key] = obj;
                        }
                    });
    }, this);
    
    
}

Sprite.prototype.setImagePath = function(path)
{
    if(path)
    {
        this.imagePath = path;
        var texture = new BK.Texture(path);
        this.__nativeObj.setTexture(texture);
    }
}

Sprite.prototype.getImagePath = function()
{
    return this.imagePath;
}

Sprite.prototype.setTexture = function(texture)
{
    this.__nativeObj.setTexture(texture);
}

Sprite.prototype.setFlipXY = function(flipx,flipy)
{
    this.__nativeObj.setFlipXY(flipx,flipy);
}

Sprite.prototype.setUVFlip = function(flipu,flipv)
{
    this.__nativeObj.setUVFlip(flipu,flipv);
}


Sprite.prototype.setUVWrap = function(wrapu,wrapv)
{
    this.__nativeObj.setUVWrap(wrapu,wrapv);
}

Sprite.prototype.setXYStretch = function(stretchX,stretchY)
{
    this.__nativeObj.setXYStretch(stretchX,stretchY);
}


Sprite.prototype.adjustTexturePosition = function(x,y,width,height,rotated)
{
    this.__nativeObj.adjustTexturePosition(x,y,width,height,rotated);
}

Sprite.prototype.addChild = function(child)
{
    return this.__nativeObj.addChild(child);
}

Sprite.prototype.dispose = function()
{
    return this.__nativeObj.dispose();
}

Sprite.prototype.removeChild = function(child)
{
    return this.__nativeObj.removeChild(child);
}

Sprite.prototype.removeChildById = function(id)
{
    return this.__nativeObj.removeChildById(id);
}

Sprite.prototype.removeChildByName = function(name)
{
    return this.__nativeObj.removeChildByName(name);
}

Sprite.prototype.removeChildByTag = function(tag)
{
    return this.__nativeObj.removeChildByTag(tag);
}

Sprite.prototype.queryChildAtIndex = function(index)
{
    return this.__nativeObj.queryChildAtIndex(index);
}


Sprite.prototype.queryChildById = function(Id)
{
    return this.__nativeObj.queryChildById(Id);
}

Sprite.prototype.queryChildByName = function(name)
{
    return this.__nativeObj.queryChildByName(name);
}

Sprite.prototype.queryChildByTag = function(tag)
{
    return this.__nativeObj.queryChildByTag(tag);
}

Sprite.prototype.getChildCount = function()
{
    return this.__nativeObj.getChildCount();
}

Sprite.prototype.removeFromParent = function()
{
    return this.__nativeObj.removeFromParent();
}

Sprite.prototype.attachComponent = function(component)
{
    return this.__nativeObj.attachComponent(component);
}

Sprite.prototype.detachComponent = function(component)
{
    return this.__nativeObj.detachComponent(component);
}


Sprite.prototype.queryComponent = function(type)
{
    return this.__nativeObj.queryComponent(type);
}

Sprite.prototype.queryComponentList = function(type)
{
    return this.__nativeObj.queryComponentList(type);
}

Sprite.prototype.hittest = function(pos)
{
    return this.__nativeObj.hittest(pos);
}

Sprite.prototype.isEqual = function(node)
{
    return this.__nativeObj.isEqual(node);
}

Sprite.prototype.convertToWorldSpace = function(pos)
{
    return this.__nativeObj.convertToWorldSpace(pos);
}

Sprite.prototype.convertToNodeSpace = function(pos)
{
    return this.__nativeObj.convertToNodeSpace(pos);
}



Sprite.prototype.setAtlas = function(jsonUrl,name)
{
    if(this.__nativeObj)
    {
        BK.SpriteSheetCache.loadSheet(jsonUrl);
        var texturePath = BK.SpriteSheetCache.getTexturePathByFilename(name);
        var texture = new BK.Texture(texturePath);
        this.__nativeObj.setTexture(texture);
        
        var frameInfo = BK.SpriteSheetCache.getFrameInfoByFilename(name);
        this.__nativeObj.adjustTexturePosition(frameInfo.frame.x, frameInfo.frame.y, frameInfo.frame.w, frameInfo.frame.h, frameInfo.rotated);
    }
    return 0;
}
Sprite.prototype.getTexture = function()
{
    if(this.__nativeObj)
    {
        return this.__nativeObj.getTexture();
    }
    return null;
}


//resign to BK object
BK.Sprite = Sprite;
BK.Script.log(0,0,"Load Sprite.js succeed.");
