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
var PropView = (function (_super) {
    __extends(PropView, _super);
    function PropView(type) {
        var _this = _super.call(this) || this;
        _this._type = -1; //道具类型
        _this.id = -1;
        _this._num = 0; //数量
        _this._type = type;
        _this.init();
        return _this;
    }
    Object.defineProperty(PropView.prototype, "proptype", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    PropView.prototype.init = function () {
        this.createView();
        this.createNumText();
        this.addChild(this._view_activate);
        this.addChild(this._view_box);
        this.addChild(this._numText);
        this.setActivateState(true);
    };
    PropView.prototype.createNumText = function () {
        this._numText = new egret.TextField();
        // this._numText.font = RES.getRes("number_fnt");
        this._numText.x = this._view_activate.width - 50;
        this._numText.width = 50;
        this._numText.height = 50;
        this._numText.textColor = 0xff0000;
    };
    PropView.prototype.createView = function () {
        var _interval = 30;
        var _width = (GameData.stageW - _interval * 6) / 5;
        if (!this._view_activate) {
            this._view_activate = new egret.Bitmap();
            this._view_activate.texture = RES.getRes(this.getActivateTexture(this._type));
            this._view_activate.width = _width;
            this._view_activate.height = _width;
            // egret.console_log("道具", this.getActivateTexture(this._type), ": ", this._view_activate.texture, "width: ", this._view_activate.width, "  height: ", this._view_activate.height)
        }
        /*if(!this._view_disable)
        {
            this._view_disable = new egret.Bitmap();
            this._view_disable.texture = RES.getRes(this.getDisableTexture(this._type));
            this._view_disable.width = _width;
            this._view_disable.height = _width;
        }*/
        if (!this._view_box) {
            this._view_box = new egret.Bitmap();
            this._view_box.texture = RES.getRes("propbox_png");
            this._view_box.width = this._view_activate.width + 10;
            this._view_box.height = this._view_activate.height + 10;
            this._view_box.x = -5;
            this._view_box.y = -5;
        }
    };
    Object.defineProperty(PropView.prototype, "num", {
        get: function () {
            return this._num;
        },
        set: function (val) {
            this._num = val;
            this._numText.text = val.toString();
            if (val <= 0) {
                this.setActivateState(false);
            }
            else {
                this.setActivateState(true);
            }
        },
        enumerable: true,
        configurable: true
    });
    PropView.prototype.setActivateState = function (val) {
        this.touchEnabled = val;
        if (val) {
            this._view_activate.texture = RES.getRes(this.getActivateTexture(this._type));
            this._view_box.texture = RES.getRes("propbox_png");
            // this._numText.font = RES.getRes("number_fnt");
        }
        else {
            this._view_activate.texture = RES.getRes(this.getDisableTexture(this._type));
            this._view_box.texture = RES.getRes("propboxdisable_png");
            // this._numText.font = RES.getRes("numberdisable_fnt");
        }
        /*
        if(val)
        {
            if(this._view_disable.parent)
            {
                this.removeChild(this._view_disable);
            }
            this.addChild(this._view_activate);
            this.addChild(this._view_box);
            this.addChild(this._numText);
        }
        else
        {
            if(this._view_activate.parent)
            {
                this.removeChild(this._view_activate);
            }
            if(this._numText.parent)
            {
                this.removeChild(this._numText);
            }
            if(this._view_box.parent)
            {
                this.removeChild(this._view_box);
            }
            this.addChild(this._view_disable);
        }*/
    };
    PropView.prototype.getActivateTexture = function (type) {
        var texturename = "";
        switch (type) {
            case 0:
                texturename = "tongse_png";
                break;
            case 1:
                texturename = "zhadan_png";
                break;
            case 2:
                texturename = "zhenghang_png";
                break;
            case 3:
                texturename = "zhenglie_png";
                break;
            case 4:
                texturename = "chanzi_png";
                break;
        }
        return texturename;
    };
    PropView.prototype.getDisableTexture = function (type) {
        var texturename = "";
        switch (type) {
            case 0:
                texturename = "tongsedisable_png";
                break;
            case 1:
                texturename = "zhadandisable_png";
                break;
            case 2:
                texturename = "zhenghangdisable_png";
                break;
            case 3:
                texturename = "zhengliedisable_png";
                break;
            case 4:
                texturename = "chanzidisable_png";
                break;
        }
        return texturename;
    };
    PropView.prototype.setFocus = function (val) {
        if (val) {
            this._view_box.texture = RES.getRes("propboxactive_png");
        }
        else {
            this._view_box.texture = RES.getRes("propbox_png");
        }
    };
    return PropView;
}(egret.DisplayObjectContainer));
