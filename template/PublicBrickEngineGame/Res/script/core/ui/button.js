BK.Script.loadlib('GameRes://script/core/ui/ui_event.js');

function Button(width,height,texturePath,callback)
{
    var u = 0;
    var v = 1;
    var strechX = 1;
    var strechY = 1;
    
    this.touchStatus = 0; //0 normal ,1 press ,2 disable
    
    this.normalTexture = undefined;
    this.pressTexture  = undefined;
    this.disableTexture= undefined;
    
    this.normalTextureOffset = {
    frame:{x:0,y:0,w:0,h:0},
    rotated:false
    };
    this.pressTextureOffset =  {
    frame:{x:0,y:0,w:0,h:0},
    rotated:false
    };
    this.disableTextureOffset =  {
    frame:{x:0,y:0,w:0,h:0},
    rotated:false
    };
    
    this.touchInsideCallback = undefined;
    
    if (texturePath) {
        this.normalTexture = new BK.Texture(texturePath);
        if (this.normalTexture) {
            this.normalTextureOffset.frame.x = 0;
            this.normalTextureOffset.frame.y = 0;
            this.normalTextureOffset.frame.w = this.normalTexture.size.width;
            this.normalTextureOffset.frame.h = this.normalTexture.size.height;
            this.normalTextureOffset.rotated = false;
        }
    }
    if (callback) {
        this.touchInsideCallback = callback;
    }
    
    this.__nativeObj =  new BK.Sprite(width,height,this.normalTexture,u,v,strechX,strechY);
    
    //redirect properties
    var names = Object.getOwnPropertyNames(this.__nativeObj);
    names.forEach(function(element) {
                  var key = element;
                   BK.Script.log("name:"+key);
                  Object.defineProperty(this,key,{
                                        get:function () {
                                        return this.__nativeObj[key];
                                        },
                                        set:function(obj){
                                        this.__nativeObj[key] = obj;
                                        }
                                        });
                  }, this);
    
    this.enable = true;
    Object.defineProperty(this,"disable",{
                          get:function () {
                          return !this.enable;
                          },
                          set:function(obj){
                          if(obj == true){
                          this.updateTexture(2);
                          }else{
                          this.updateTexture(0);
                          }
                          this.enable = !obj;
                          }
                          });
    
    this.updateTexture = function (touchStatus) {
        //normal
        if (0==touchStatus) {
            if (this.normalTexture) {
                this.__nativeObj.setTexture(this.normalTexture);
                var frameInfo = this.normalTextureOffset;
                this.__nativeObj.adjustTexturePosition(frameInfo.frame.x, frameInfo.frame.y, frameInfo.frame.w, frameInfo.frame.h, frameInfo.rotated);
            }
        }
        //press
        else if (1==touchStatus) {
            if (this.pressTexture) {
                this.__nativeObj.setTexture(this.pressTexture);
                var frameInfo = this.pressTextureOffset;
                this.__nativeObj.adjustTexturePosition(frameInfo.frame.x, frameInfo.frame.y, frameInfo.frame.w, frameInfo.frame.h, frameInfo.rotated);
            }
        }
        //disable
        else if (2==touchStatus){
            if (this.disableTexture) {
                this.__nativeObj.setTexture(this.disableTexture);
                var frameInfo = this.disableTextureOffset;
                this.__nativeObj.adjustTexturePosition(frameInfo.frame.x, frameInfo.frame.y, frameInfo.frame.w, frameInfo.frame.h, frameInfo.rotated);
            }
        }
    }
    
    this.changeStatus = function (status) {
        BK.Script.log(0,0,"changeStatus = "+status);
        this.touchStatus = status;
        this.updateTexture(this.touchStatus);
    }
    
    this.updateStatus = function () {
        this.updateTexture(this.touchStatus);
    }
    
    this.changeStatus(0);
    
    //touch begin
    this.isCancelClick = undefined;
    UIEventHandler.addNodeEvent(this,UI_NODE_ENENT_TOUCH_BEGIN,function (node,evt,x,y) {
                                BK.Script.log(0,0,"button click down !  obj"+node+" evt:"+evt);
                                node.isCancelClick = false;
                                if(node.enable){
                                node.changeStatus(1);
                                }else{
                                node.changeStatus(2);
                                }
                                });
    
    //touch move
    UIEventHandler.addNodeEvent(this,UI_NODE_ENENT_TOUCH_MOVED,function (node,evt,x,y) {
                                //if the finger move outside the button ,cancel click.
                                var pt = {x:x,y:y};
                                if(node.hittest(pt) == false)
                                {
                                node.isCancelClick = true;
                                }
                                });
    
    //touch end
    UIEventHandler.addNodeEvent(this,UI_NODE_ENENT_TOUCH_END,function (node,evt,x,y) {
                                if(node.enable){
                                node.changeStatus(0);
                                }else{
                                node.changeStatus(2);
                                }
                                if(node.isCancelClick == false)
                                {
                                    if(node.touchInsideCallback)
                                {
                                node.touchInsideCallback(node);
                                }
                                }
                                });
    this.canUserInteract = true;
}

Button.prototype.setTouchInsideCallback = function (callback) {
    this.touchInsideCallback = callback;
}

Button.prototype.setNormalTexturePath = function(texturPath)
{
    this.normalTexture = new BK.Texture(texturPath);
    if (this.normalTexture) {
        this.normalTextureOffset.frame.x = 0;
        this.normalTextureOffset.frame.y = 0;
        this.normalTextureOffset.frame.w = this.normalTexture.size.width;
        this.normalTextureOffset.frame.h = this.normalTexture.size.height;
        this.normalTextureOffset.rotated = false;
    }
    this.updateStatus();
}
Button.prototype.setPressTexturePath = function(texturPath)
{
    this.pressTexture = new BK.Texture(texturPath);
    if (this.pressTexture) {
        this.pressTextureOffset.frame.x = 0;
        this.pressTextureOffset.frame.y = 0;
        this.pressTextureOffset.frame.w = this.pressTexture.size.width;
        this.pressTextureOffset.frame.h = this.pressTexture.size.height;
        this.pressTextureOffset.rotated = false;
    }
    this.updateStatus();
}
Button.prototype.setDisableTexturePath = function(texturPath)
{
    this.disableTexture = new BK.Texture(texturPath);
    if (this.disableTexture) {
        this.disableTextureOffset.frame.x = 0;
        this.disableTextureOffset.frame.y = 0;
        this.disableTextureOffset.frame.w = this.disableTexture.size.width;
        this.disableTextureOffset.frame.h = this.disableTexture.size.height;
        this.disableTextureOffset.rotated = false;
    }
    this.updateStatus();
}


Button.prototype.setNormalTextureFromSheetInfo = function(textureFrameInfo)
{
    if (textureFrameInfo) {
        var texture  = new BK.Texture(textureFrameInfo.texturePath);
        if (texture) {
            this.normalTexture = texture;
            this.normalTextureOffset = textureFrameInfo.frameInfo;
            this.updateStatus();
        }else{
            BK.Script.log(0,0,"setNormalTextureFromSheetInfo error! Create texture failed.");
        }
    }else{
        BK.Script.log(0,0,"setNormalTextureFromSheetInfo error! textureFrameInfo is null or undefined");
    }
}

Button.prototype.setPressTextureFromSheetInfo = function (textureFrameInfo) {
    if (textureFrameInfo) {
        var texture  = new BK.Texture(textureFrameInfo.texturePath);
        if (texture) {
            this.pressTexture = texture;
            this.pressTextureOffset = textureFrameInfo.frameInfo;
            this.updateStatus();
        }else{
            BK.Script.log(0,0,"setPressTextureFromSheetInfo error! Create texture failed.");
        }
    }else{
        BK.Script.log(0,0,"setPressTextureFromSheetInfo error! textureFrameInfo is null or undefined");
    }
}


Button.prototype.setDisableTextureFromSheetInfo = function (textureFrameInfo) {
    if (textureFrameInfo) {
        var texture  = new BK.Texture(textureFrameInfo.texturePath);
        if (texture) {
            this.disableTexture = texture;
            this.disableTextureOffset = textureFrameInfo.frameInfo;
            this.updateStatus();
        }else{
            BK.Script.log(0,0,"setDisableTextureFromSheetInfo error! Create texture failed.");
        }
    }else{
        BK.Script.log(0,0,"setDisableTextureFromSheetInfo error! textureFrameInfo is null or undefined");
    }
}

//redirect the functions
Button.prototype.hittest = function(position){
    return this.__nativeObj.hittest(position);
}
Button.prototype.addChild = function (child) {
    this.__nativeObj.addChild(child);
}
Button.prototype.attach = function (body) {
    this.__nativeObj.attach(body);
}
Button.prototype.dispose = function () {
    this.__nativeObj.dispose();
}
Button.prototype.setTexture = function (tex) {
    this.__nativeObj.setTexture(tex);
}
Button.prototype.removeFromParent = function()
{
    this.__nativeObj.removeFromParent();
}
//resign to BK object
BK.Button = Button;

BK.Script.log(0,0,"Load button.js succeed.");

