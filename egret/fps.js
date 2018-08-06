var fpsText = new egret.TextField();
fpsText.size = 40;
fpsText.y = 100;
fpsText.textColor = 0xff0000;

var WebFps = (function () {
  function WebFps(stage, showFPS, showLog, logFilter, styles) {
    this.arrFps = [];
    this.arrCost = [];
    this.arrLog = [];
  }
  WebFps.prototype.addFps = function () {
  }
  WebFps.prototype.addLog = function () {
  }
  WebFps.prototype.update = function (datas, showLastData) {
    if (showLastData === void 0) { showLastData = false; }
    var numFps;
    var numCostTicker;
    var numCostRender;
    if (!showLastData) {
      numFps = datas.fps;
      numCostTicker = datas.costTicker;
      numCostRender = datas.costRender;
      this.lastNumDraw = datas.draw;
      this.arrFps.push(numFps);
      this.arrCost.push([numCostTicker, numCostRender]);
    }
    else {
      numFps = this.arrFps[this.arrFps.length - 1];
      numCostTicker = this.arrCost[this.arrCost.length - 1][0];
      numCostRender = this.arrCost[this.arrCost.length - 1][1];
    }
    var fpsTotal = 0;
    var lenFps = this.arrFps.length;
    if (lenFps > 101) {
      lenFps = 101;
      this.arrFps.shift();
      this.arrCost.shift();
    }
    var fpsMin = this.arrFps[0];
    var fpsMax = this.arrFps[0];
    for (var i = 0; i < lenFps; i++) {
      var num = this.arrFps[i];
      fpsTotal += num;
      if (num < fpsMin)
        fpsMin = num;
      else if (num > fpsMax)
        fpsMax = num;
    }
    var fpsAvg = Math.floor(fpsTotal / lenFps);
    fpsText.text = numFps + " FPS \n" + "min" + fpsMin + " max" + fpsMax + " avg" + fpsAvg + "\nDraw" + this.lastNumDraw + "\nCost " + numCostTicker + " " + numCostRender;
    egret.sys.$TempStage.addChild(fpsText);
  }
  WebFps.prototype.updateInfo = function (info) {
  }
  WebFps.prototype.updateWarn = function (info) {
  }
  WebFps.prototype.updateError = function (info) {
  }
  return WebFps;
}());

egret.FPSDisplay = WebFps;