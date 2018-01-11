var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// BK.Script.loadlib("GameRes://script/demo/demo_xiaochu/data/GameData.js");
// BK.Script.loadlib("GameRes://script/demo/demo_xiaochu/event/ElementViewManageEvent.js");
// BK.Script.loadlib("GameRes://script/demo/tests/egret.js");
// BK.Script.loadlib("GameRes://script/demo/mainTest/tween/tween.js");
var ElementView = (function (_super) {
    __extends(ElementView, _super);
    //游戏中的元素
    function ElementView(tparent) {
        var _this = _super.call(this) || this;
        _this.location = 0; //位置编号，用于提供移动使用
        /*-----------------------------ID 编号相关，携带测试信息-----------------------------------*/
        _this._id = -1; //ID编号，对应GameData.elements中的数据ID，与数据下标相同
        /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
        /*-------------------------------------焦点管理相关----------------------------------------*/
        _this._focus = false;
        /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
        /*-----------------------------------移动到新位置，乱序操作使用-----------------------------------------*/
        _this.speed = 700;
        _this.thisparent = tparent;
        _this.init();
        return _this;
    }
    Object.defineProperty(ElementView.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (val) {
            this._id = val;
        },
        enumerable: true,
        configurable: true
    });
    //初始化所有数据
    ElementView.prototype.init = function () {
        this.touchEnabled = true;
        this.touchChildren = false;
        this.bitmap = new egret.Bitmap();
        var bitwidth = (GameData.stageW - 40) / GameData.MaxColumn;
        this.bitmap.width = bitwidth - 10;
        this.bitmap.height = bitwidth - 10;
        this.bitmap.x = -1 * bitwidth / 2;
        this.bitmap.y = -1 * bitwidth / 2;
        this.addChild(this.bitmap);
    };
    //设置贴图
    ElementView.prototype.setTexture = function (val) {
        this.bitmap.texture = RES.getRes(val);
        // egret.console_log("设置贴图: ", this.bitmap.texture)
    };
    Object.defineProperty(ElementView.prototype, "focus", {
        get: function () {
            return this._focus;
        },
        enumerable: true,
        configurable: true
    });
    // private _focusMc: egret.MovieClip;
    //设置选中状态的焦点样式
    ElementView.prototype.setFocus = function (val) {
        egret.console_log("设置选中状态的焦点样式");
        if (val != this._focus) {
            this._focus = val;
            //this.cacheAsBitmap = false;
            /*
                        if (!this._focusMc) {
                            var tex = RES.getRes("foucsmc_png");
                            var data = RES.getRes("foucsmc_json");
                            var mcf: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, tex);
                            this._focusMc = new egret.MovieClip(mcf.generateMovieClipData("foucsmc"));
                            this._focusMc.x = this._focusMc.width / -2;
                            this._focusMc.y = this._focusMc.height / -2;
                            this._focusMc.width = this.bitmap.width;
                            this._focusMc.height = this.bitmap.height;
                        }
            
                        */
            if (!this._focusBitmap) {
                this._focusBitmap = new egret.Bitmap();
                this._focusBitmap.width = this.bitmap.width;
                this._focusBitmap.height = this.bitmap.height;
                this._focusBitmap.x = this.bitmap.x;
                this._focusBitmap.y = this.bitmap.y;
                this._focusBitmap.texture = RES.getRes("catfoucs_png");
            }
            if (val) {
                egret.console_log("加入焦点动画");
                //BK.error
                //修改
                // this.addChild(this._focusMc);
                // this._focusMc.play(-1);
                // this._focusMc.play();
                this.addChild(this._focusBitmap);
            }
            else {
                /*
                if (this._focusMc.parent) {
                    //BK.error
                    //修改为暂停
                    // this._focusMc.stop();
                    this._focusMc.pause();
                    this.removeChild(this._focusMc);
                }
                */
                if (this._focusBitmap.parent) {
                    //console.log("消除");
                    this.removeChild(this._focusBitmap);
                }
            }
            //this.cacheAsBitmap = true;
        }
    };
    //移动到新位置,使用cubicInOut算法移动，直线运动
    ElementView.prototype.move = function () {
        //console.log("乱序移动开始！",this.id,this.location,this.targetX(),this.targetY(),this.x,this.y);
        BK.Script.log(0, 0, "11111");
        var tw = egret.Tween.get(this);
        tw.to({ x: this.targetX(), y: this.targetY() }, this.speed, egret.Ease.cubicInOut);
    };
    /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
    /*-------------------------------------显示元素，从上方掉落----------------------------------------*/
    /*-------------------------------------掉落后添加到父级别显示列表-----------------------------------*/
    ElementView.prototype.show = function (wait) {
        //egret.Tween.get(this).to({x:this.targetX(),y:this.targetY()},this.speed, egret.Ease.bounceOut);
        var tw = egret.Tween.get(this);
        tw.wait(wait, false);
        tw.call(this.addThisToParent, this);
        tw.to({ x: this.targetX(), y: this.targetY() }, this.speed, egret.Ease.bounceOut);
    };
    ElementView.prototype.addThisToParent = function () {
        if (!this.parent) {
            this.thisparent.addChild(this);
        }
    };
    ElementView.prototype.targetX = function () {
        var girdwidth = (GameData.stageW - 40) / GameData.MaxColumn;
        var xx = 20 + girdwidth * (this.location % GameData.MaxColumn) + girdwidth / 2 + 5;
        return xx;
    };
    ElementView.prototype.targetY = function () {
        var girdwidth = (GameData.stageW - 40) / GameData.MaxColumn;
        var startY = (GameData.stageH - (GameData.stageW - 30) / 6 - 60) - girdwidth * GameData.MaxColumn;
        var yy = startY + girdwidth * (Math.floor(this.location / 8)) + girdwidth / 2 + 5;
        return yy;
    };
    /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
    /*--------------------------------------移动并且返回-------------------------------------*/
    /*----------------------用于用户交换两个对象，但未找到能够连接消除的时候使用------------------------*/
    //移动到另外一个位置，然后再移动回来
    ElementView.prototype.moveAndBack = function (location, isscale) {
        if (isscale === void 0) { isscale = false; }
        var girdwidth = (GameData.stageW - 40) / GameData.MaxColumn;
        var xx = 20 + girdwidth * (location % GameData.MaxColumn) + girdwidth / 2 + 5;
        var startY = (GameData.stageH - (GameData.stageW - 30) / 6 - 60) - girdwidth * GameData.MaxColumn;
        var yy = startY + girdwidth * (Math.floor(location / 8)) + girdwidth / 2 + 5;
        //移动时候，不仅会移动位置，还会放到或者缩小，移动回来时，scale都设置为1
        var tw = egret.Tween.get(this);
        //tw.call(this.back,this);
        if (isscale) {
            tw.to({ x: xx, y: yy, scaleX: 1.2, scaleY: 1.2 }, 300, egret.Ease.cubicOut).call(this.back, this);
            ;
        }
        else {
            tw.to({ x: xx, y: yy, scaleX: 0.8, scaleY: 0.8 }, 300, egret.Ease.cubicOut).call(this.back, this);
            ;
        }
    };
    ElementView.prototype.back = function () {
        var tw = egret.Tween.get(this);
        tw.to({ x: this.targetX(), y: this.targetY(), scaleX: 1, scaleY: 1 }, 300, egret.Ease.cubicOut);
    };
    /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
    /*-----------------------------此动画用于移动元素，然后消除--------------------------------------*/
    //移动到另外一个位置，然后再返回原始的scale
    ElementView.prototype.moveAndScale = function (location, isscale) {
        if (isscale === void 0) { isscale = false; }
        var girdwidth = (GameData.stageW - 40) / GameData.MaxColumn;
        var xx = 20 + girdwidth * (location % GameData.MaxColumn) + girdwidth / 2 + 5;
        var startY = (GameData.stageH - (GameData.stageW - 30) / 6 - 60) - girdwidth * GameData.MaxColumn;
        var yy = startY + girdwidth * (Math.floor(location / 8)) + girdwidth / 2 + 5;
        var tw = egret.Tween.get(this);
        //tw.call(this.back,this);
        if (isscale) {
            tw.to({ x: xx, y: yy, scaleX: 1.4, scaleY: 1.4 }, 300, egret.Ease.cubicOut).call(this.backScale, this);
            ;
        }
        else {
            tw.to({ x: xx, y: yy, scaleX: 0.6, scaleY: 0.6 }, 300, egret.Ease.cubicOut).call(this.backScale, this);
            ;
        }
    };
    ElementView.prototype.backScale = function () {
        var tw = egret.Tween.get(this);
        tw.to({ scaleX: 1, scaleY: 1 }, 300, egret.Ease.backOut).call(this.canRemove, this);
    };
    ElementView.prototype.canRemove = function () {
        var evt = new ElementViewManageEvent(ElementViewManageEvent.REMOVE_ANIMATION_OVER);
        this.dispatchEvent(evt);
    };
    /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
    /*-----------------此动画用于将元素移动到关卡积分器位置,然后移除显示列表----------------------------*/
    //播放曲线动画
    ElementView.prototype.playCurveMove = function (tx, ty) {
        var tw = egret.Tween.get(this);
        tw.to({ x: tx, y: ty }, 700, egret.Ease.quadOut).call(this.overCurveMove, this);
        //tw.to({},1000, egret.Ease.quadOut);
    };
    ElementView.prototype.overCurveMove = function () {
        if (this.parent) {
            this.parent.removeChild(this);
        }
        var evt = new ElementViewManageEvent(ElementViewManageEvent.UPDATE_MAP);
        this.dispatchEvent(evt);
    };
    /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
    /*-------------------------删除元素，当元素不属于关卡条件时，执行此动画---------------------------------*/
    //播放直接消除动画,自己放大，然后缩回到原有大小，然后删除
    ElementView.prototype.playRemoveAni = function () {
        var tw = egret.Tween.get(this);
        tw.to({ scaleX: 1.4, scaleY: 1.4 }, 300, egret.Ease.cubicInOut).to({ scaleX: 0.1, scaleY: 0.1 }, 300, egret.Ease.cubicInOut).call(this.removeAniCall, this);
    };
    ElementView.prototype.removeAniCall = function () {
        if (this.parent) {
            this.parent.removeChild(this);
        }
        var evt = new ElementViewManageEvent(ElementViewManageEvent.UPDATE_MAP);
        this.dispatchEvent(evt);
    };
    /*^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^*/
    /*-------------------------移动到新位置，方块被消除后重新生成下落使用---------------------------------*/
    //根据列编号，重新计算元素X轴位置，从其实Y轴开始播放下落动画
    ElementView.prototype.moveNewLocation = function () {
        if (!this.parent) {
            var girdwidth = (GameData.stageW - 40) / GameData.MaxColumn;
            var startY = (GameData.stageH - (GameData.stageW - 30) / 6 - 60) - girdwidth * GameData.MaxColumn;
            this.y = startY - this.width;
            this.scaleX = 1;
            this.scaleY = 1;
            this.x = this.targetX();
            this.thisparent.addChild(this);
        }
        egret.Tween.get(this).to({ x: this.targetX(), y: this.targetY() }, this.speed, egret.Ease.bounceOut).call(this.moveNewLocationOver, this);
    };
    ElementView.prototype.moveNewLocationOver = function () {
        var evt = new ElementViewManageEvent(ElementViewManageEvent.UPDATE_VIEW_OVER);
        this.dispatchEvent(evt);
    };
    return ElementView;
}(egret.DisplayObjectContainer));
