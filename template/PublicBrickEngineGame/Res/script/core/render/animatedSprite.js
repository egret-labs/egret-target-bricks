BK.Script.loadlib('GameRes://script/core/render/spriteSheetCache.js');
var AnimatedSprite = (function () {
    function AnimatedSprite(textureInfoArr) {
        this.paused = false;
        this.delayUnits = 1 / 30; //设置每一帧持续时间，以秒为单位。默认1/30秒
        this.tmpPlayingIdx = 0;
        this.previousTs = -1;
        this.playedCount = 0;
        //1.init default size to 0,0
        this.size = { width: 0, height: 0 };
        //2.Ready the texture info
        this.readyTextureInfo(textureInfoArr);
        //3.Init sprite objects
        this.onInit(this.size.width, this.size.height);
        //4.Display the 0 frame
        this.displayFrame(0);
        this.paused = true;
        BK.Director.ticker.add(function (ts, duration, obj) {
            obj.update(ts, duration);
        }, this);
    }
    AnimatedSprite.prototype.onInit = function (width, height) {
        this.createSprites(width, height);
        //redirect the properties to this object
        var names = Object.getOwnPropertyNames(this.__nativeObj);
        names.forEach(function (element) {
            var key = element;
            Object.defineProperty(this, key, {
                get: function () {
                    return this.__nativeObj[key];
                },
                set: function (obj) {
                    this.__nativeObj[key] = obj;
                }
            });
        }, this);
        Object.defineProperty(this, "size", {
            get: function () {
                return this.__nativeObj.size;
            },
            set: function (obj) {
                this.__nativeObj.size = obj;
                this.displayFrame(this.currDisplayIdx);
            }
        });
    };
    //redirect functions
    AnimatedSprite.prototype.setTexture = function (tex) {
        this.__nativeObj.setTexture(tex);
    };
    AnimatedSprite.prototype.dispose = function () {
        BK.Director.ticker.remove(this);
        this.__nativeObj.dispose();
    };
    AnimatedSprite.prototype.removeChild = function (child) {
        return this.__nativeObj.removeChild(child);
    };
    AnimatedSprite.prototype.removeChildById = function (id, dispose) {
        return this.__nativeObj.removeChildById(id, dispose);
    };
    AnimatedSprite.prototype.removeChildByName = function (name, dispose) {
        return this.__nativeObj.removeChildByName(name, dispose);
    };
    AnimatedSprite.prototype.removeFromParent = function () {
        return this.__nativeObj.removeFromParent();
    };
    AnimatedSprite.prototype.addChild = function (child, index) {
        return this.__nativeObj.addChild(child, index);
    };
    AnimatedSprite.prototype.hittest = function (position) {
        return this.__nativeObj.hittest(position);
    };
    AnimatedSprite.prototype.convertToWorldSpace = function (position) {
        return this.__nativeObj.convertToWorldSpace(position);
    };
    AnimatedSprite.prototype.convertToNodeSpace = function (position) {
        return this.__nativeObj.convertToNodeSpace(position);
    };
    AnimatedSprite.prototype.createSprites = function (width, height) {
        this.__nativeObj = new BK.Sprite(width, height, null, 0, 1, 1, 1);
        this.contentSprite = new BK.Sprite(width, height, null, 0, 1, 1, 1);
        this.__nativeObj.addChild(this.contentSprite);
    };
    AnimatedSprite.prototype.readyTextureInfo = function (textureInfoArr) {
        var _this = this;
        //1.clear the array
        this.textureInfoArr = [];
        textureInfoArr.forEach(function (texInfo) {
            if (texInfo.texturePath) {
                //2.ready texture object
                texInfo.texture = new BK.Texture(texInfo.texturePath);
                //3.push modified element to this.textureInfoArr array
                _this.textureInfoArr.push(texInfo);
                _this.size = { width: texInfo.frameInfo.sourceSize.w, height: texInfo.frameInfo.sourceSize.h };
            }
        });
    };
    AnimatedSprite.prototype.displayFrame = function (index) {
        if (this.textureInfoArr.length > 0) {
            var textureInfo = this.textureInfoArr[index];
            if (textureInfo) {
                //BK.Script.log(0,0,"textureInfo is not null");
                this.currDisplayIdx = index;
                var tex = textureInfo.texture;
                var frameInfo = textureInfo.frameInfo;
                if (textureInfo.frameInfo.trimmed == true) {
                    var x = textureInfo.frameInfo.spriteSourceSize.x;
                    var y = textureInfo.frameInfo.spriteSourceSize.y;
                    var w = textureInfo.frameInfo.spriteSourceSize.w;
                    var h = textureInfo.frameInfo.spriteSourceSize.h;
                    var srcSize = textureInfo.frameInfo.sourceSize;
                    var currSize = this.__nativeObj.size;
                    x = currSize.width * x / srcSize.w;
                    y = currSize.height * y / srcSize.h;
                    w = currSize.width * w / srcSize.w;
                    h = currSize.height * h / srcSize.h;
                    this.contentSprite.position = { x: x, y: y };
                    this.contentSprite.size = { width: w, height: h };
                    //BK.Script.log(0,0,"textureInfo.frameInfo.trimmed == true");
                }
                else {
                    this.contentSprite.size = this.__nativeObj.size;
                    //BK.Script.log(0,0,"textureInfo.frameInfo.trimmed != true");
                }
                //this.currTexturePath is null or undefined. Or texture path has been modified.
                if ((!this.currTexturePath) || (this.currTexturePath != textureInfo.texturePath)) {
                    BK.Script.log(1, -1, "this.currTexture != tex");
                    this.currTexturePath = textureInfo.texturePath;
                    this.contentSprite.setTexture(tex);
                }
                this.contentSprite.adjustTexturePosition(frameInfo.frame.x, frameInfo.frame.y, frameInfo.frame.w, frameInfo.frame.h, frameInfo.rotated);
            }
            else {
                BK.Script.log(1, -1, "displayFrame failed! textureInfo is null. index is " + index);
            }
        }
        else {
            BK.Script.log(1, -1, "displayFrame failed! textureInfoArr.length is 0");
        }
    };
    AnimatedSprite.prototype.render = function () {
        if (this.tmpPlayingIdx > this.textureInfoArr.length - 1) {
            this.tmpPlayingIdx = 0;
        }
        this.displayFrame(this.tmpPlayingIdx);
        this.tmpPlayingIdx++;
        this.currDisplaySum++;
        this.updateCallback();
    };
    AnimatedSprite.prototype.update = function (ts, duration) {
        if (this.paused == false) {
            if (this.previousTs < 0) {
                this.previousTs = ts;
                this.render();
            }
            else if ((ts - this.previousTs) > this.delayUnits * 1000) {
                this.previousTs = ts;
                this.render();
            }
        }
    };
    AnimatedSprite.prototype.play = function (beginFrameIdx, repeatCount) {
        if (beginFrameIdx === void 0) { beginFrameIdx = 0; }
        if (repeatCount === void 0) { repeatCount = -1; }
        if (beginFrameIdx > this.textureInfoArr.length - 1) {
            this.tmpPlayingIdx = 0;
        }
        else {
            this.tmpPlayingIdx = beginFrameIdx;
        }
        this.paused = false;
        this.repeatCount = repeatCount;
        this.currDisplaySum = 0;
        this.playedCount = 0;
    };
    AnimatedSprite.prototype.stop = function (frameIdx) {
        if (frameIdx === void 0) { frameIdx = -1; }
        this.paused = true;
        if (frameIdx > -1) {
            this.displayFrame(frameIdx);
        }
    };
    AnimatedSprite.prototype.updateCallback = function () {
        var texInfArrCnt = this.textureInfoArr.length;
        if ((this.currDisplaySum % texInfArrCnt) == 0) {
            this.playedCount = parseInt(String(this.currDisplaySum / texInfArrCnt));
            if (this.completeCallback) {
                this.completeCallback(this, this.playedCount);
            }
            //this.repeatCount < 0 意味着循环播放
            if (this.repeatCount > 0 && this.repeatCount <= this.playedCount) {
                if (this.endCallback) {
                    this.endCallback(this, this.playedCount);
                }
                this.stop();
            }
        }
    };
    AnimatedSprite.prototype.setCompleteCallback = function (completeCallback) {
        this.completeCallback = completeCallback;
    };
    AnimatedSprite.prototype.setEndCallback = function (completeCallback) {
        this.endCallback = completeCallback;
    };
    return AnimatedSprite;
}());
if (!BK.AnimatedSprite) {
    BK.AnimatedSprite = AnimatedSprite;
}
