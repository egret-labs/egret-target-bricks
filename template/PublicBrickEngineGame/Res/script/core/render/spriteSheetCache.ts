// class SheetSprite 
// {
//     __nativeObj : BK.Sprite;
//     contentSprite : BK.Sprite;
//     size : BK.Size = {width:0,height:0};
//     textureInfo:BK.SheetTextureInfo;
//     currTexturePath : string;

//     //sprite format
//     flipU:number = 0 ;
//     flipV:number = 1;
//     stretchX:number = 1;
//     stretchY:number = 1;
  
//     constructor(textureInfo:BK.SheetTextureInfo,width:number,height:number,flipU?:number,flipV?:number,stretchX?:number,stretchY?:number)    
//     {
//         if (flipU) {
//             this.flipU = flipU;
//         }
//         if (flipV) {
//             this.flipV = flipV;
//         }
//         if(stretchX){
//             this.stretchX = stretchX;
//         }
//         if (stretchY) {
//             this.stretchY = stretchY;
//         }
//         if (width) {
//             this.size.width = width;
//         }
//         if(height){
//             this.size.height = height;
//         }
//         this.textureInfo = textureInfo;
//         this.onInit(this.size.width,this.size.height);
//         this.adjustWithTextureInfo(textureInfo);
//     }

//     onInit(width,height){
//         this.createSprites(width,height);
//         //redirect the properties to this object
//         var names = Object.getOwnPropertyNames(this.__nativeObj);
//         names.forEach(function (element) {
//             var key = element;
//             Object.defineProperty(this, key, {
//                 get: function () {
//                     return this.__nativeObj[key];
//                 },
//                 set: function (obj) {
//                     this.__nativeObj[key] = obj;
//                 }
//             });
//         }, this);
  
//         Object.defineProperty(this,"size",{
//             get:function () {
//               return this.__nativeObj.size;
//             },
//             set:function(obj){
//               this.__nativeObj.size = obj;
//               this.displayFrame(this.currDisplayIdx);
//           }
//         });
//      }
//      adjustWithTextureInfo(textureInfo:BK.SheetTextureInfo)
//      {
//         if (textureInfo) {
//             var tex = textureInfo.texture;
//             var frameInfo =  textureInfo.frameInfo;
//             if (textureInfo.frameInfo.trimmed == true) {
//               var x = textureInfo.frameInfo.spriteSourceSize.x;
//               var y = textureInfo.frameInfo.spriteSourceSize.y;
//               var w = textureInfo.frameInfo.spriteSourceSize.w;
//               var h = textureInfo.frameInfo.spriteSourceSize.h;
  
//               var srcSize = textureInfo.frameInfo.sourceSize;
//               var currSize = this.__nativeObj.size;
              
//               x = currSize.width * x/srcSize.w
//               y = currSize.height * y/srcSize.h
//               w = currSize.width * w/srcSize.w
//               h = currSize.height * h/srcSize.h
              
//               this.contentSprite.position = {x:x,y:y};
//               this.contentSprite.size = {width:w,height:h};
//               BK.Script.log(0,0,"textureInfo.frameInfo.trimmed == true");
              
//             }else{
//               this.contentSprite.size = this.__nativeObj.size;
//               BK.Script.log(0,0,"textureInfo.frameInfo.trimmed != true");
//             }
//             BK.Script.log(1,-1,"this.currTexture != tex");
//             this.currTexturePath = textureInfo.texturePath;
//             var tex = new BK.Texture(this.currTexturePath)
//             this.contentSprite.setTexture(tex);
//             this.contentSprite.adjustTexturePosition(frameInfo.frame.x,frameInfo.frame.y,frameInfo.frame.w,frameInfo.frame.h,frameInfo.rotated);
//           }
//      }
//       //redirect functions
//      setTexture(tex:BK.Texture){
//         this.__nativeObj.setTexture(tex);
//      }
//      dispose(){
//        BK.Director.ticker.remove(this);
//        this.__nativeObj.dispose();
//      }
//      removeChild(child:BK.Node){
//        return this.__nativeObj.removeChild(child);
//      }
//      removeChildById(id:number,dispose:boolean){
//         return this.__nativeObj.removeChildById(id,dispose);
//      }
//      removeChildByName(name:string,dispose:boolean){
//        return this.__nativeObj.removeChildByName(name,dispose);
//      }
//      removeFromParent(){
//        return this.__nativeObj.removeFromParent();
//      }
//      addChild(child:BK.Node,index?:number){
//        return this.__nativeObj.addChild(child,index);
//      }
//      hittest(position){
//        return this.__nativeObj.hittest(position);
//      }
//      convertToWorldSpace(position){
//        return this.__nativeObj.convertToWorldSpace(position);
//      }
//      convertToNodeSpace(position){
//       return this.__nativeObj.convertToNodeSpace(position);
//      }
  
//      createSprites(width,height){
//         this.__nativeObj   = new BK.Sprite(width,height,undefined,this.flipU,this.flipV,this.stretchX,this.stretchY);
//         this.contentSprite = new BK.Sprite(width,height,undefined,this.flipU,this.flipV,this.stretchX,this.stretchY);
//         this.__nativeObj.addChild(this.contentSprite);
//      }
// }
// if (!BK.SheetSprite) {
//     BK.SheetSprite = SheetSprite;
// }

// var SpriteSheetCache = (function () {
//     function SpriteSheetCache() {
//         this.sheets = {};
//         this.jsonConfigs = {};
//     }
//     SpriteSheetCache.prototype.getFrameInfoByFilename = function (filename) {
//         for (var texturePath in this.jsonConfigs) {
//             if (this.jsonConfigs.hasOwnProperty(texturePath)) {
//                 var config = this.jsonConfigs[texturePath];
//                 var texture = this.sheets[texturePath];
//                 var frames = config.frames;
//                 var meta = config.meta;
//                 this.fullWidth = meta.size.w;
//                 this.fullHeight = meta.size.h;
//                 for (var index = 0; index < frames.length; index++) {
//                     var frm = frames[index];
//                     if (filename == frm.filename) {
//                         var frame = { x: 0, y: 1, w: 0, h: 0 };
//                         var rotated = frm.rotated;
//                         var trimmed = frm.trimmed;
//                         var spriteSourceSize = frm.spriteSourceSize;
//                         var sourceSize = frm.sourceSize;
//                         if (rotated) {
//                             frame.x = frm.frame.x;
//                             frame.y = this.fullHeight - frm.frame.y - frm.frame.w;
//                             frame.w = frm.frame.w;
//                             frame.h = frm.frame.h;
//                         }
//                         else {
//                             frame.x = frm.frame.x;
//                             frame.y = this.fullHeight - frm.frame.y - frm.frame.h;
//                             frame.w = frm.frame.w;
//                             frame.h = frm.frame.h;
//                         }
//                         spriteSourceSize.y = sourceSize.h - spriteSourceSize.y - spriteSourceSize.h;
//                         var retSheetFrame = {
//                             filename: filename,
//                             frame: frame,
//                             rotated: rotated,
//                             trimmed: trimmed,
//                             spriteSourceSize : spriteSourceSize,
//                             sourceSize :sourceSize
//                         };
//                         return retSheetFrame;
//                     }
//                 }
//             }
//         }
//         return null;
//     };
//     SpriteSheetCache.prototype.getTexturePathByFilename = function (filename) {
//         for (var texturePath in this.jsonConfigs) {
//             if (this.jsonConfigs.hasOwnProperty(texturePath)) {
//                 var config = this.jsonConfigs[texturePath];
//                 var frames = config.frames;
//                 for (var index = 0; index < frames.length; index++) {
//                     var frame = frames[index];
//                     if (frame.filename == filename) {
//                         return texturePath;
//                     }
//                 }
//             }
//         }
//         return null;
//     };
//     /**
//      * 根据路径加载sheet
//      *
//      * @param {string} jsonPath
//      * @param {string} texturePath
//      * @memberof SpriteSheetCache
//      */
//     SpriteSheetCache.prototype.loadSheet = function (jsonPath, texturePath,format, minFilter, magFilter, uWrap, vWrap) {
//         var buff = BK.FileUtil.readFile(jsonPath);
//         var sheetJsonStr = buff.readAsString();
//         if (sheetJsonStr) {
//             var sheetObj = JSON.parse(sheetJsonStr);
//             this.jsonConfigs[texturePath] = sheetObj;
//             if (format === void 0) { format = 4; }
//             if (minFilter === void 0) { minFilter = 1; }
//             if (magFilter === void 0) { magFilter = 1; }
//             if (uWrap === void 0) { uWrap = 1; }
//             if (vWrap === void 0) { vWrap = 1; }
//             var tex = new BK.Texture(texturePath,format, minFilter, magFilter, uWrap, vWrap);
//             this.sheets[texturePath] = tex;
//         }
//         else {
//             BK.Script.log(0, 0, "loadSheet Failed.Please check path");
//         }
//     };
    
//      /**
//       * 移除图集
//       * 
//       * @param {any} jsonPath 
//       * @param {any} texturePath 
//       */
//       SpriteSheetCache.prototype.removeSheet = function (jsonPath, texturePath)
//     {
//         if (this.jsonConfigs[texturePath]) {
//             for (var key in this.jsonConfigs) {
//                 if (this.jsonConfigs.hasOwnProperty(key)) {
//                     var val = this.jsonConfigs[key];
//                     if (key==texturePath) {
//                         delete this.jsonConfigs[texturePath];
//                         BK.Script.log(0,0,"Delete jsonConfigs key:"+key + " val:"+val);
                        
//                     }
//                 }
//             }
//         }
//         if (this.sheets[texturePath]) {
//             for (var key in this.sheets) {
//                 if (this.sheets.hasOwnProperty(key)) {
//                     var val = this.sheets[key];
//                     if (key==texturePath) {
//                         delete this.sheets[texturePath];
//                         BK.Script.log(0,0,"Delete sheets key:"+key + " val:"+val);
//                     }
//                 }
//             }
//         }
//     }
//     /**
//      * 根据名字获取texture
//      *
//      * @param {string} filename
//      * @returns {BK.Texture}
//      * @memberof SpriteSheetCache
//      */
//     SpriteSheetCache.prototype.getTextureByFilename = function (filename) {
//         var frameInfo = this.getFrameInfoByFilename(filename);
//         var texturePath = this.getTexturePathByFilename(filename);
//         if (frameInfo && texturePath) {
//             var texture = new BK.Texture(texturePath);
//             return texture;
//         }
//         else {
//             BK.Script.log(0, 0, "getTexture Failed.Please check path");
//             return null;
//         }
//     };
//     /**
//      *
//      * @param filename
//      * @param width
//      * @param height；
//      */
//     SpriteSheetCache.prototype.getSprite = function (filename, width, height) {
//         var textureInfo = this.getTextureFrameInfoByFileName(filename);
//         if (textureInfo) {
//             var frameInfo = textureInfo.frameInfo;//this.getFrameInfoByFilename(filename);
//             var texturePath = textureInfo.texturePath;//this.getTexturePathByFilename(filename);
//             var texture = new BK.Texture(texturePath);
//             if(!width)
//             {
//                 width = frameInfo.frame.w;
//             }
//             if(!height)
//             {
//                 height = frameInfo.frame.h;
//             }
//             BK.Script.log(0, 0, "getSprite  texture:" + texture + " width:" + width+ " height:" + height);
//               if (frameInfo.trimmed) {
//                 var sprite = new BK.SheetSprite(textureInfo,width, height);
//                 return sprite;
//             }else{
//                 var sprite = new BK.Sprite(width, height, texture, 0, 1, 1, 1);
//                 sprite.adjustTexturePosition(frameInfo.frame.x, frameInfo.frame.y, frameInfo.frame.w, frameInfo.frame.h, frameInfo.rotated);    
//                 return sprite;
//             }
//         }
//         else {
//             return null;
//         }
//     };
//     SpriteSheetCache.prototype.getTextureFrameInfoByFileName = function(filename)
//     {
//         var frameInfo = this.getFrameInfoByFilename(filename);
//         var texturePath = this.getTexturePathByFilename(filename);
//         if (frameInfo && texturePath) {
//             var textureFrameInfo = {
//                 "frameInfo":frameInfo,
//                 "texturePath":texturePath
//             }
//             return textureFrameInfo;
//         }else{
//             return null;
//         }
//     }

//     return SpriteSheetCache;
// }());
// var Sprite9 = (function () {
//     /**
//      *
//      * @param texWidth
//      * @param texHeight
//      * @param texture
//      * @param grid
//      * @param offset
//      * @param rotated
//      */
//     function Sprite9(texWidth, texHeight, texture, grid, offset, rotated) {
//         if (offset === void 0) { offset = {
//             x: 0,
//             y: 0
//         }; }
//         this._size = { width: 0, height: 0 };
//         this.__nativeObj = new BK.Node();
//         this.onInit();
//         this._grid = grid;
//         this._size = { width: texHeight, height: texHeight };
//         this._leftTop = new BK.Sprite(grid.left, grid.top, texture, 0, 1, 1, 1);
//         this._leftTop.position = { x: 0, y: (texHeight - grid.top) };
//         this._leftTop.zOrder = 99999;
//         this._leftTop.name = "_leftTop";
//         this.__nativeObj.addChild(this._leftTop);
//         this._centerTop = new BK.Sprite(texWidth - grid.left - grid.right, grid.top, texture, 0, 1, 1, 1);
//         this._centerTop.position = { x: grid.left, y: (texHeight - grid.top) };
//         this._centerTop.zOrder = 99999;
//         this._centerTop.name = "_centerTop";
//         this.__nativeObj.addChild(this._centerTop);
//         this._rightTop = new BK.Sprite(grid.right, grid.top, texture, 0, 1, 1, 1);
//         this._rightTop.position = { x: texWidth - grid.right, y: texHeight - grid.top };
//         this._rightTop.zOrder = 99999;
//         this._rightTop.name = "_rightTop";
//         this.__nativeObj.addChild(this._rightTop);
//         this._leftCenter = new BK.Sprite(grid.left, texHeight - grid.top - grid.bottom, texture, 0, 1, 1, 1);
//         this._leftCenter.position = { x: 0, y: grid.bottom };
//         this._leftCenter.name = "_leftCenter";
//         this.__nativeObj.addChild(this._leftCenter);
//         this._centerCenter = new BK.Sprite(texWidth - grid.left - grid.right, texHeight - grid.top - grid.bottom, texture, 0, 1, 1, 1);
//         this._centerCenter.position = { x: grid.left, y: grid.bottom };
//         this._centerCenter.name = "_centerCenter";
//         this.__nativeObj.addChild(this._centerCenter);
//         this._rightCenter = new BK.Sprite(grid.right, texHeight - grid.bottom - grid.top, texture, 0, 1, 1, 1);
//         this._rightCenter.position = { x: texWidth - grid.right, y: grid.bottom };
//         this._rightCenter.name = "_rightCenter";
//         this.__nativeObj.addChild(this._rightCenter);
//         this._leftBottom = new BK.Sprite(grid.left, grid.bottom, texture, 0, 1, 1, 1);
//         this._leftBottom.position = { x: 0, y: 0 };
//         this._leftBottom.name = "_leftBottom";
//         this.__nativeObj.addChild(this._leftBottom);
//         this._centerBottom = new BK.Sprite(texWidth - grid.left - grid.right, grid.bottom, texture, 0, 1, 1, 1);
//         this._centerBottom.position = { x: grid.left, y: 0 };
//         this._centerBottom.name = "_centerBottom";
//         this.__nativeObj.addChild(this._centerBottom);
//         this._rightBottom = new BK.Sprite(grid.right, grid.bottom, texture, 0, 1, 1, 1);
//         this._rightBottom.position = { x: texWidth - grid.right, y: 0 };
//         this._rightBottom.name = "_rightBottom";
//         this.__nativeObj.addChild(this._rightBottom);
//         if (rotated == true) {
//             this._leftTop.adjustTexturePosition(offset.x + (texHeight - grid.top), offset.y + (texWidth - grid.left), grid.left, grid.top, rotated);
//             this._centerTop.adjustTexturePosition(offset.x + (texHeight - grid.top), offset.y + grid.right, texWidth - grid.left - grid.right, grid.top, rotated);
//             this._rightTop.adjustTexturePosition(offset.x + (texHeight - grid.top), offset.y, grid.right, grid.top, rotated);
//             this._leftCenter.adjustTexturePosition(offset.x + grid.bottom, offset.y + (texWidth - grid.left), grid.left, texHeight - grid.top - grid.bottom, rotated);
//             this._centerCenter.adjustTexturePosition(offset.x + grid.bottom, offset.y + grid.right, texWidth - grid.left - grid.right, texHeight - grid.top - grid.bottom, rotated);
//             this._rightCenter.adjustTexturePosition(offset.x + grid.bottom, offset.y, grid.right, texHeight - grid.bottom - grid.top, rotated);
//             this._leftBottom.adjustTexturePosition(offset.x, offset.y + (texWidth - grid.left), grid.left, grid.bottom, rotated);
//             this._centerBottom.adjustTexturePosition(offset.x, offset.y + grid.right, texWidth - grid.left - grid.right, grid.bottom, rotated);
//             this._rightBottom.adjustTexturePosition(offset.x, offset.y, grid.right, grid.bottom, rotated);
//         }
//         else {
//             this._leftTop.adjustTexturePosition(0 + offset.x, texHeight - grid.top + offset.y, grid.left, grid.top);
//             this._centerTop.adjustTexturePosition(grid.left + offset.x, texHeight - grid.top + offset.y, texWidth - grid.left - grid.right, grid.top);
//             this._rightTop.adjustTexturePosition(texWidth - grid.right + offset.x, texHeight - grid.top + offset.y, grid.right, grid.top);
//             this._leftCenter.adjustTexturePosition(0 + offset.x, grid.bottom + offset.y, grid.left, texHeight - grid.top - grid.bottom);
//             this._centerCenter.adjustTexturePosition(grid.left + offset.x, grid.bottom + offset.y, texWidth - grid.left - grid.right, texHeight - grid.top - grid.bottom);
//             this._rightCenter.adjustTexturePosition(texWidth - grid.right + offset.x, grid.bottom + offset.y, grid.right, texHeight - grid.bottom - grid.top);
//             this._leftBottom.adjustTexturePosition(0 + offset.x, 0 + offset.y, grid.left, grid.bottom);
//             this._centerBottom.adjustTexturePosition(grid.left + offset.x, 0 + offset.y, texWidth - grid.left - grid.right, grid.bottom);
//             this._rightBottom.adjustTexturePosition(texWidth - grid.right + offset.x, 0 + offset.y, grid.right, grid.bottom);
//         }
//     }
//     Sprite9.prototype.onInit = function () {
//         var names = Object.getOwnPropertyNames(this.__nativeObj);
//         names.forEach(function (element) {
//             var key = element;
//             // log("name:"+key);
//             Object.defineProperty(this, key, {
//                 get: function () {
//                     return this.__nativeObj[key];
//                 },
//                 set: function (obj) {
//                     this.__nativeObj[key] = obj;
//                 }
//             });
//         }, this);
//     };
//     Object.defineProperty(Sprite9.prototype, "alpha", {
//         get: function () {
//             return this._rightBottom.vertexColor.a;
//         },
//         set: function (num) {
//             this._leftTop.vertexColor = { r: 1, g: 1, b: 1, a: num };
//             this._centerTop.vertexColor = { r: 1, g: 1, b: 1, a: num };
//             this._rightTop.vertexColor = { r: 1, g: 1, b: 1, a: num };
//             this._leftCenter.vertexColor = { r: 1, g: 1, b: 1, a: num };
//             this._centerCenter.vertexColor = { r: 1, g: 1, b: 1, a: num };
//             this._rightCenter.vertexColor = { r: 1, g: 1, b: 1, a: num };
//             this._leftBottom.vertexColor = { r: 1, g: 1, b: 1, a: num };
//             this._centerBottom.vertexColor = { r: 1, g: 1, b: 1, a: num };
//             this._rightBottom.vertexColor = { r: 1, g: 1, b: 1, a: num };
//         },
//         enumerable: true,
//         configurable: true
//     });
//     Object.defineProperty(Sprite9.prototype, "size", {
//         get: function () {
//             return this._size;
//         },
//         set: function (contentSize) {
//             this._size = contentSize;
//             var tgtCenterWidth = contentSize.width - this._grid.left - this._grid.right;
//             var tgtCenterHeight = contentSize.height - this._grid.top - this._grid.bottom;
//             this._leftTop.position = { x: 0, y: contentSize.height - this._grid.top };
//             this._leftCenter.size = { width: this._grid.left, height: tgtCenterHeight };
//             this._leftCenter.position = { x: 0, y: this._grid.bottom };
//             this._rightCenter.size = { width: this._grid.right, height: tgtCenterHeight };
//             this._rightCenter.position = { x: contentSize.width - this._grid.right, y: this._grid.bottom };
//             this._centerCenter.size = { width: tgtCenterWidth, height: tgtCenterHeight };
//             this._centerTop.size = { width: tgtCenterWidth, height: this._grid.top };
//             this._centerTop.position = { x: this._grid.left, y: contentSize.height - this._grid.top };
//             this._centerBottom.size = { width: tgtCenterWidth, height: this._grid.bottom };
//             this._centerBottom.position = { x: this._grid.left, y: 0 };
//             this._rightCenter.size = { width: this._grid.right, height: tgtCenterHeight };
//             this._rightCenter.position = { x: contentSize.width - this._grid.right, y: this._grid.bottom };
//             this._rightBottom.position = { x: contentSize.width - this._grid.right, y: 0 };
//             this._rightTop.position = { x: contentSize.width - this._grid.right, y: contentSize.height - this._grid.top };
//         },
//         enumerable: true,
//         configurable: true
//     });
//     /**
//    * 调整位置
//    * @param postion
//    */
//     Sprite9.prototype.pos = function (x, y) {
//         this.__nativeObj.position = { x: x, y: y };
//     };
//     //---------原始方法-------------
//     /**
//      * 销毁当前对象
//      */
//     Sprite9.prototype.dispose = function () {
//         this.__nativeObj.dispose();
//     };
//     /**
//      * 附着一个物理引擎中的刚体对象至当前节点
//      * @param body 物理引擎中刚体对象
//      */
//     Sprite9.prototype.attachBody = function (body) {
//         this.__nativeObj.attachComponent(body);
//     };
//     /**
//      * 添加子节点
//      * @param sonNode
//      */
//     Sprite9.prototype.addChild = function (sonNode) {
//         this.__nativeObj.addChild(sonNode);
//     };
//     /**
//      * 根据id移除子节点
//      * @param id
//      * @param isDispose 是否销毁当前节点
//      */
//     Sprite9.prototype.removeChildById = function (id, isDispose) {
//         return this.__nativeObj.removeChildById(id, isDispose);
//     };
//     /**
//      * 根据name移除子节点
//      * @param name
//      * @param isDispose 是否销毁当前节点
//      */
//     Sprite9.prototype.removeChildByName = function (name, isDispose) {
//         return this.__nativeObj.removeChildByName(name, isDispose);
//     };
//     /**
//      * 移除当前节点
//      * 如果需要销毁,再调用dispose方法
//      */
//     Sprite9.prototype.removeFromParent = function () {
//         return this.__nativeObj.removeFromParent();
//     };
//     /**
//      * 判断是被点击
//      * @param postion 待判断的位置    结构形如 {x:0,y:0}
//      */
//     Sprite9.prototype.hittest = function (position) {
//         return this.__nativeObj.hittest(position);
//     };
//     return Sprite9;
// }());

// if (!BK.SpriteSheetCache) {
//     BK.SpriteSheetCache = new SpriteSheetCache();
// }
// if (!BK.Sprite9) {
//     BK.Sprite9 = Sprite9;
// }
