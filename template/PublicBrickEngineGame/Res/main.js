var window = this;
var global = global || this;
global.bricks = {};
this.navigator = { userAgent: "bricks" };
this.setTimeout = this.setTimeout || function () { };
var __extends = function (t, e) {
    function r() {
        this.constructor = t;
    }
    for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
    r.prototype = e.prototype, t.prototype = new r();
};


/**
 * 渲染模式
 * 现支持原生模式‘bricks’和WebGL模式‘webgl’
 */
window.renderMode = 'webgl';
BK.Director.logToConsole = 1;


// Egret
(function () {
    // BK.Script.loadlib('GameRes://script/core/render/canvas.js');
    // BK.Script.loadlib("GameRes://script/core/net/websocket.js");
    // BK.Script.loadlib('GameRes://script/core/render/WebGLCore.js');
    BK.Script.loadlib('GameRes://qqPlayCore.js');
    BK.Script.loadlib("GameRes://manifest.js");
    debugger;
    egret.runEgret(
        {
            renderMode: window.renderMode,
            frameRate: 30,
            contentWidth: 640,
            contentHeight: 1136,
            entryClassName: "Main",
            scaleMode: "showAll",
            orientation: "auto",
            background: 0x888888
        }
    );
})();


