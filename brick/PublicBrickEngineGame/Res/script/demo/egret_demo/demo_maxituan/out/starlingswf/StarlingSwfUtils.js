/**
 * Created by lcj on 14-6-18.
 */
var StarlingSwfUtils = (function () {
    function StarlingSwfUtils() {
    }
    StarlingSwfUtils.addSwf = function (swf) {
        egret.console_log("增加swf");
        StarlingSwfUtils.swfList.push(swf);
    };
    StarlingSwfUtils.removeSwf = function (swf) {
        var index = StarlingSwfUtils.swfList.indexOf(swf);
        if (index != -1)
            StarlingSwfUtils.swfList.splice(index, 1);
    };
    /**
     * 由于sheet及数据变化，所有使用的地方都要进行修改
     */
    StarlingSwfUtils.createSprite = function (name) {
        var l = StarlingSwfUtils.swfList.length;
        egret.console_log("进入createSprite , length: ", l);
        for (var i = 0; i < l; i++) {
            var swf = StarlingSwfUtils.swfList[i];
            if (swf.hasSprite(name)) {
                egret.console_log("拥有Sprite: ", name);
                return swf.createSprite(name);
            }
        }
        return null;
    };
    StarlingSwfUtils.createImage = function (name, data) {
        if (data === void 0) { data = null; }
        var l = StarlingSwfUtils.swfList.length;
        for (var i = 0; i < l; i++) {
            var swf = StarlingSwfUtils.swfList[i];
            if (swf.hasImage(name)) {
                return swf.createImage(name, data);
            }
        }
        return null;
    };
    // public static getTexture(name):egret.Texture{
    //     var l:number = StarlingSwfUtils.swfList.length;
    //     for (var i:number = 0; i < l; i++) {
    //         var swf:starlingswf.Swf = StarlingSwfUtils.swfList[i];
    //         if (swf.hasImage(name)) {
    //             return swf.getTexture(name);
    //         }
    //     }
    //     return null;
    // }
    StarlingSwfUtils.createMovie = function (name, data, cls) {
        if (data === void 0) { data = null; }
        if (cls === void 0) { cls = null; }
        var l = StarlingSwfUtils.swfList.length;
        for (var i = 0; i < l; i++) {
            var swf = StarlingSwfUtils.swfList[i];
            if (swf.hasMovieClip(name)) {
                return swf.createMovie(name, data, cls);
            }
        }
        return null;
    };
    StarlingSwfUtils.createS9Image = function (name, data) {
        if (data === void 0) { data = null; }
        var l = StarlingSwfUtils.swfList.length;
        for (var i = 0; i < l; i++) {
            var swf = StarlingSwfUtils.swfList[i];
            if (swf.hasS9Image(name)) {
                return swf.createS9Image(name, data);
            }
        }
        return null;
    };
    StarlingSwfUtils.createShapeImage = function (name, data) {
        if (data === void 0) { data = null; }
        var l = StarlingSwfUtils.swfList.length;
        for (var i = 0; i < l; i++) {
            var swf = StarlingSwfUtils.swfList[i];
            if (swf.hasShapeImage(name)) {
                return swf.createShapeImage(name, data);
            }
        }
        return null;
    };
    StarlingSwfUtils.getSwf = function (name) {
        var l = StarlingSwfUtils.swfList.length;
        for (var i = 0; i < l; i++) {
            var swf = StarlingSwfUtils.swfList[i];
            if (swf.name == name) {
                return swf;
            }
        }
        return null;
    };
    StarlingSwfUtils.fixButton = function (btn, onClick, thisObj) {
        if (StarlingSwfUtils.firstAddBtn) {
            StarlingSwfUtils.firstAddBtn = false;
            egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
            egret.MainContext.instance.stage.addEventListener(egret.Event.LEAVE_STAGE, this.onTouchEnd, this);
        }
        var data = new StarlingSwfButtonData();
        data.btn = btn;
        data.onClick = onClick;
        data.thisObj = thisObj;
        StarlingSwfUtils.btnList.push(data);
        btn.touchEnabled = true;
        btn.gotoAndStop(0);
        btn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBtnTouchBegin, btn);
    };
    StarlingSwfUtils.onBtnTouchBegin = function (event) {
        egret.console_log("点击开始,name", event.currentTarget.name);
        var btn = event.currentTarget;
        var l = StarlingSwfUtils.btnList.length;
        for (var i = 0; i < l; i++) {
            var data = StarlingSwfUtils.btnList[i];
            if (data.btn == btn) {
                data.touchStageX = event.stageX;
                data.touchStageY = event.stageY;
                data.touchPointID = event.touchPointID;
                btn.gotoAndStop(1);
                break;
            }
        }
    };
    StarlingSwfUtils.onTouchEnd = function (event) {
        egret.console_log("点击结束");
        var l = StarlingSwfUtils.btnList.length;
        for (var i = 0; i < l; i++) {
            var data = StarlingSwfUtils.btnList[i];
            if (data.touchStageX != -1) {
                data.btn.gotoAndStop(0);
                if (event.touchPointID == data.touchPointID && event.stageX &&
                    Math.abs(data.touchStageX - event.stageX) < 10 && Math.abs(data.touchStageY - event.stageY) < 10) {
                    egret.console_log("点击结束找到按钮");
                    if (data.onClick) {
                        egret.console_log("触发找到的按钮");
                        data.onClick.call(data.thisObj, event);
                    }
                }
                data.touchStageX = -1;
                data.touchStageY = -1;
                data.touchPointID = NaN;
            }
        }
    };
    /**
     * swf数据list
     * list中每个数据包括一个包含名字和sheet的Swf和帧数信息
     */
    StarlingSwfUtils.swfList = [];
    StarlingSwfUtils.btnList = [];
    StarlingSwfUtils.firstAddBtn = true;
    return StarlingSwfUtils;
}());
var StarlingSwfButtonData = (function () {
    function StarlingSwfButtonData() {
        this.touchStageX = -1;
        this.touchStageY = -1;
    }
    return StarlingSwfButtonData;
}());
