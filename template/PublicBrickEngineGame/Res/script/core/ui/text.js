
function Text(style,content)
{
    this.style = {
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
    this.setStyle(style)

    this._content = ""
    if(content)
        this._content = content;

    this.__nativeObj =  new BK.TextNode(this.style,this._content);
    
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
    
    Object.defineProperty(this,"content",{
        get:function () {
            return this._content;
        },
        set:function(obj){
            this._content = obj;
            this.__nativeObj.updateText(this.style,this._content);
        }
    });

    Object.defineProperty(this,"fontSize",{
        get:function () {
            return this.style.fontSize;
        },
        set:function(obj){
            this.style.fontSize = obj;
            this.__nativeObj.updateText(this.style,this._content);
        }
    });

    Object.defineProperty(this,"fontColor",{
        get:function () {
            return this.style.textColor;
        },
        set:function(obj){
            this.style.textColor = obj;
            this.__nativeObj.updateText(this.style,this._content);
        }
    });


    Object.defineProperty(this,"maxSize",{
        get:function () {
            return {"width":this.style.maxWidth,"height":this.style.maxHeight}
        },
        set:function(obj){
            this.style.maxWidth = obj.width;
            this.style.maxHeight = obj.height
            this.__nativeObj.updateText(this.style,this._content);
        }
    });

    Object.defineProperty(this,"bold",{
        get:function () {
            return this.style.bold;
        },
        set:function(obj){
            this.style.bold = obj;
            this.__nativeObj.updateText(this.style,this._content);
        }
    });

    Object.defineProperty(this,"italic",{
        get:function () {
            return this.style.italic
        },
        set:function(obj){
            this.style.italic = obj;
            this.__nativeObj.updateText(this.style,this._content);
        }
    });


    Object.defineProperty(this,"horizontalAlign",{
        get:function () {
            return this.style.textAlign
        },
        set:function(obj){
            this.style.textAlign = obj;
            this.__nativeObj.updateText(this.style,this._content);
        }
    });


    Object.defineProperty(this,"strokeColor",{
        get:function () {
            return this.style.strokeColor
        },
        set:function(obj){
            this.style.strokeColor = obj;
            this.__nativeObj.updateText(this.style,this._content);
        }
    });

    Object.defineProperty(this,"strokeSize",{
        get:function () {
            return this.style.strokeSize
        },
        set:function(obj){
            this.style.strokeSize = obj;
            this.__nativeObj.updateText(this.style,this._content);
        }
    });

    Object.defineProperty(this,"shadowColor",{
        get:function () {
            return this.style.shadowColor
        },
        set:function(obj){
            this.style.shadowColor = obj;
            this.__nativeObj.updateText(this.style,this._content);
        }
    });


    Object.defineProperty(this,"shadowRadius",{
        get:function () {
            return this.style.shadowRadius
        },
        set:function(obj){
            this.style.shadowRadius = obj;
            this.__nativeObj.updateText(this.style,this._content);
        }
    });

    Object.defineProperty(this,"shadowOffset",{
        get:function () {
            return {"x":this.style.shadowDx,"y":this.style.shadowDy}
        },
        set:function(obj){
            this.style.shadowDx = obj.x;
            this.style.shadowDy = obj.y;
            this.__nativeObj.updateText(this.style,this._content);
        }
    });
    
}


Text.prototype.setStyle = function(style)
{
    if(style)
    {
        this.style = {
            "fontSize":style.fontSize,
            "textColor" : style.textColor,
            "maxWidth" : style.maxWidth,
            "maxHeight": style.maxHeight,
            "width":style.width,
            "height":style.height,
            "textAlign":style.textAlign,
            "bold":style.bold,
            "italic":style.italic,
            "strokeColor":style.strokeColor,
            "strokeSize":style.strokeSize,
            "shadowRadius":style.shadowRadius,
            "shadowDx":style.shadowDx,
            "shadowDy":style.shadowDy,
            "shadowColor":style.shadowColor
        }
    }

}

//resign to BK object
BK.Text = Text;
BK.Script.log(0,0,"Load Text.js succeed.");
