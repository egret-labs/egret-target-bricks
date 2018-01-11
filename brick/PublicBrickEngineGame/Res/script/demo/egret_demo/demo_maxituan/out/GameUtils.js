/**
 * Created by lcj on 14-7-29.
 */
var GameUtils = (function () {
    function GameUtils() {
    }
    GameUtils.removeChild = function (child) {
        if (child && child.parent) {
            child.parent.removeChild(child);
        }
    };
    GameUtils.fixUI = function (ui) {
        ui.x += CONST.GAME_WIDTH - CONST.RESOLUTION_WIDTH >> 1;
        ui.y += CONST.GAME_HEIGHT - CONST.RESOLUTION_HEIGHT >> 1;
    };
    GameUtils.lock = function () {
        egret.console_log("锁定");
        var stage = egret.MainContext.instance.stage;
        stage.touchChildren = false;
    };
    GameUtils.unlock = function () {
        egret.console_log("解锁");
        var stage = egret.MainContext.instance.stage;
        stage.touchChildren = true;
    };
    GameUtils.createMovieClip = function () {
        var animation_png_path = RES.basePath + "/animation_1/animation.png";
        var animation_json_path = RES.basePath + "/animation_1/animation.json";
        var delegate = new DefaultMovieClipDelegate(RES.getRes("animation_json"), animation_png_path, animation_json_path);
        var result = new MovieClip(delegate);
        result.frameRate = 24;
        return result;
    };
    GameUtils.parseNum = function (num) {
        var c3 = num % 10 + "";
        var c2 = (num % 100 - parseInt(c3)) / 10 + "";
        var c1 = Math.floor(num / 100) + "";
        return [c1, c2, c3];
    };
    GameUtils.getUId = function () {
        var uId;
        if (window.localStorage && window.localStorage.getItem) {
            uId = window.localStorage.getItem("uId");
        }
        if (!uId) {
            uId = new Date().getTime() + "" + Math.floor(Math.random() * 100000);
        }
        return uId;
    };
    GameUtils.setDebug = function (str) {
        if (!GameUtils.debugTxt) {
            GameUtils.debugTxt = new egret.TextField();
            GameUtils.debugTxt.size = 20;
            egret.MainContext.instance.stage.addChild(GameUtils.debugTxt);
        }
        GameUtils.debugTxt.text = GameUtils.debugTxt.text + str;
    };
    return GameUtils;
}());
