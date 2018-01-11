BK.Script.loadlib('GameRes://script/core/render/spriteSheetCache.js');
class AnimatedSprite{
   __nativeObj : BK.Sprite;
   contentSprite : BK.Sprite;
   textureInfoArr : Array<BK.SheetTextureInfo> ;
   repeatCount : number; //播放次数，-1为循环播放
   currDisplayIdx : number;
   currDisplaySum : number;
   currTexturePath : string;

   size : BK.Size;
   paused = false;
   delayUnits = 1/30; //设置每一帧持续时间，以秒为单位。默认1/30秒

   constructor(textureInfoArr:Array<BK.SheetTextureInfo>){
      //1.init default size to 0,0
      this.size = {width:0,height:0};
      //2.Ready the texture info
      this.readyTextureInfo(textureInfoArr);
      //3.Init sprite objects
      this.onInit(this.size.width,this.size.height);
      //4.Display the 0 frame
      this.displayFrame(0);

      this.paused = true;

      BK.Director.ticker.add(function (ts, duration,obj) {
        obj.update(ts,duration);
      },this);
   }
   onInit(width,height){
      this.createSprites(width,height);
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

      Object.defineProperty(this,"size",{
          get:function () {
            return this.__nativeObj.size;
          },
          set:function(obj){
            this.__nativeObj.size = obj;
            this.displayFrame(this.currDisplayIdx);
        }
      });
   }
    //redirect functions
   setTexture(tex:BK.Texture){
      this.__nativeObj.setTexture(tex);
   }
   dispose(){
     BK.Director.ticker.remove(this);
     this.__nativeObj.dispose();
   }
   removeChild(child:BK.Node){
     return this.__nativeObj.removeChild(child);
   }
   removeChildById(id:number,dispose:boolean){
      return this.__nativeObj.removeChildById(id,dispose);
   }
   removeChildByName(name:string,dispose:boolean){
     return this.__nativeObj.removeChildByName(name,dispose);
   }
   removeFromParent(){
     return this.__nativeObj.removeFromParent();
   }
   addChild(child:BK.Node,index?:number){
     return this.__nativeObj.addChild(child,index);
   }
   hittest(position){
     return this.__nativeObj.hittest(position);
   }
   convertToWorldSpace(position){
     return this.__nativeObj.convertToWorldSpace(position);
   }
   convertToNodeSpace(position){
    return this.__nativeObj.convertToNodeSpace(position);
   }

   createSprites(width,height){
      this.__nativeObj   = new BK.Sprite(width,height,null,0,1,1,1);
      this.contentSprite = new BK.Sprite(width,height,null,0,1,1,1);
      this.__nativeObj.addChild(this.contentSprite);
   }

   readyTextureInfo(textureInfoArr:Array<BK.SheetTextureInfo>){
     //1.clear the array
      this.textureInfoArr = [];
      textureInfoArr.forEach(texInfo => {
        if (texInfo.texturePath) {
          //2.ready texture object
          texInfo.texture = new BK.Texture(texInfo.texturePath);
          //3.push modified element to this.textureInfoArr array
          this.textureInfoArr.push(texInfo);
          this.size = {width:texInfo.frameInfo.sourceSize.w,height:texInfo.frameInfo.sourceSize.h};
        }
      });
   }

   displayFrame(index:number){
     if (this.textureInfoArr.length>0) {
        var textureInfo = this.textureInfoArr[index];
        if (textureInfo) {
          //BK.Script.log(0,0,"textureInfo is not null");
          this.currDisplayIdx = index;
          var tex = textureInfo.texture;
          var frameInfo =  textureInfo.frameInfo;
          if (textureInfo.frameInfo.trimmed == true) {
            var x = textureInfo.frameInfo.spriteSourceSize.x;
            var y = textureInfo.frameInfo.spriteSourceSize.y;
            var w = textureInfo.frameInfo.spriteSourceSize.w;
            var h = textureInfo.frameInfo.spriteSourceSize.h;

            var srcSize = textureInfo.frameInfo.sourceSize;
            var currSize = this.__nativeObj.size;
            
            x = currSize.width * x/srcSize.w
            y = currSize.height * y/srcSize.h
            w = currSize.width * w/srcSize.w
            h = currSize.height * h/srcSize.h
            
            this.contentSprite.position = {x:x,y:y};
            this.contentSprite.size = {width:w,height:h};
            //BK.Script.log(0,0,"textureInfo.frameInfo.trimmed == true");
            
          }else{
            this.contentSprite.size = this.__nativeObj.size;
            //BK.Script.log(0,0,"textureInfo.frameInfo.trimmed != true");
          }
          //this.currTexturePath is null or undefined. Or texture path has been modified.
          if ( (!this.currTexturePath) || (this.currTexturePath != textureInfo.texturePath) ){
              BK.Script.log(1,-1,"this.currTexture != tex");
              this.currTexturePath = textureInfo.texturePath;
              this.contentSprite.setTexture(tex);
          }
          this.contentSprite.adjustTexturePosition(frameInfo.frame.x,frameInfo.frame.y,frameInfo.frame.w,frameInfo.frame.h,frameInfo.rotated);
        }else{
          BK.Script.log(1,-1,"displayFrame failed! textureInfo is null. index is "+index);
        }
     }else{
       BK.Script.log(1,-1,"displayFrame failed! textureInfoArr.length is 0");
     }
   }

   tmpPlayingIdx = 0;
   previousTs = -1;
   playedCount = 0;
   render()
   {
      if (this.tmpPlayingIdx > this.textureInfoArr.length-1) {
        this.tmpPlayingIdx = 0;
      }
      this.displayFrame(this.tmpPlayingIdx);
      this.tmpPlayingIdx++;
      this.currDisplaySum++;
      this.updateCallback();
   }
   update(ts,duration){
     if (this.paused == false) {
        if (this.previousTs<0) {
          this.previousTs = ts;
          this.render();
        }else if((ts - this.previousTs)>this.delayUnits*1000){
          this.previousTs = ts;
          this.render();          
        }
     }
   }
   play(beginFrameIdx:number=0,repeatCount:number=-1){
     if (beginFrameIdx> this.textureInfoArr.length-1) {
       this.tmpPlayingIdx = 0;
     }else{
       this.tmpPlayingIdx = beginFrameIdx;
     }
     this.paused = false;
     this.repeatCount = repeatCount;
     this.currDisplaySum = 0;
     this.playedCount = 0;
   }
   stop(frameIdx:number=-1){
      this.paused = true;
      if (frameIdx>-1) {
        this.displayFrame(frameIdx);
      }
   }

   completeCallback : (animatedSprite:AnimatedSprite,count:number)=>void;
   endCallback : (animatedSprite:AnimatedSprite,count:number)=>void;

   updateCallback()
   {
     let texInfArrCnt = this.textureInfoArr.length;
     if ((this.currDisplaySum%texInfArrCnt)==0) {
        this.playedCount =  parseInt(String(this.currDisplaySum/texInfArrCnt));

        if(this.completeCallback) {
          this.completeCallback(this,this.playedCount);
        }
        //this.repeatCount < 0 意味着循环播放
        if (this.repeatCount > 0 && this.repeatCount <= this.playedCount) {
            if(this.endCallback) {
              this.endCallback(this,this.playedCount);
            }
            this.stop();
        }
     }
   }

   setCompleteCallback(completeCallback:(animatedSprite:AnimatedSprite,count:number)=>void){
      this.completeCallback = completeCallback;
   }
   setEndCallback(completeCallback:(animatedSprite:AnimatedSprite,count:number)=>void){
      this.endCallback = completeCallback;
   }
}

if (!BK.AnimatedSprite) {
  BK.AnimatedSprite = AnimatedSprite;
}