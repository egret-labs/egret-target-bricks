/**
 * Created by lcj on 14-7-29.
 */
var ResultLayer = (function () {
    function ResultLayer() {
        this.view = StarlingSwfUtils.createSprite("spr_resultUI");
        //        GameUtils.fixUI(this.view);
        this.view.x = -160;
        this.scoreTxt1 = new SpecialNumber();
        this.scoreTxt1.y = 211;
        //        this.view.addChild(this.scoreTxt1);
        this.scoreTxt2 = new SpecialNumber();
        this.scoreTxt2.x = 426;
        this.scoreTxt2.y = 211;
        this.view.addChild(this.scoreTxt2);
        this.scoreTxt3 = new SpecialNumber();
        this.scoreTxt3.x = 483;
        this.scoreTxt3.y = 211;
        this.view.addChild(this.scoreTxt3);
        this.perTxt = new SpecialNumber();
        this.perTxt.y = 248;
        //        this.view.addChild(this.perTxt);
        //        this.numTxt = new SpecialNumber();
        //        this.numTxt.scaleX = this.numTxt.scaleY = 0.8;
        //        this.numTxt.x = 350;
        //        this.numTxt.y = 326;
        //        this.view.addChild(this.numTxt);
        this.rankTxt = this.view.getTextField("rankTxt");
        var againBtn = this.view.getMovie("againBtn");
        egret.console_log("获取按钮againBtn： ", againBtn);
        StarlingSwfUtils.fixButton(againBtn, this.onAgain, this);
        //        this.view.getMovie("againBtn").x += 118;
        //        this.view.getMovie("noticeBtn").visible = false;
        StarlingSwfUtils.fixButton(this.view.getMovie("noticeBtn"), this.onNotice, this);
        //if(!EgretShare.canShare){
        //    this.view.getMovie("againBtn").x = 300;
        //    this.view.removeChild(this.view.getMovie("noticeBtn"));
        //}
    }
    ResultLayer.prototype.onAgain = function () {
        egret.console_log("再来一次");
        ObjectPool.destroyAllObject();
        var parent = this.view.parent;
        parent.removeChildren();
        parent.addChild(new GameScene());
    };
    ResultLayer.prototype.onNotice = function (event) {
        console.log("通知好友");
        //EgretShare.share();
    };
    ResultLayer.prototype.onStageTouch = function () {
        var stage = this.view.stage;
        stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onStageTouch, this);
        stage.touchChildren = true;
        stage.removeChild(this.weixinContainer);
    };
    ResultLayer.prototype.updateData = function (score, score2) {
        var total = score * CONST.SCORE_PURSE_SMALL + score2 * CONST.SCORE_PURSE_BIG;
        egret.Tween.get(this).to({ num: total }, 2000);
        var result = 0;
        if (total > 0) {
            result = Math.log(total);
            result *= result;
            if (result > 99) {
                result = 99;
            }
            result = Math.round(result);
        }
        if (result < 10) {
            this.perTxt.x = 383;
        }
        else {
            this.perTxt.x = 375;
        }
        this.perTxt.setChar(result + "%");
        var list = RES.getRes("config_json").rank;
        var random = Math.floor(total / 1000);
        if (random > list.length - 1) {
            random = list.length - 1;
        }
        this.rankTxt.text = "当之无愧的 " + list[random];
        //        this.numTxt.setChar(CONST.USER_TOP);
        //        this.numTxt.x = 345 + (4 - (CONST.USER_TOP + "").length) * 8;
        var scoreList = GameUtils.parseNum(total);
        //EgretShare.setShareContent("刚抢了" + scoreList[0] + "块" +
        //    scoreList[1] + "毛" + scoreList[2] + "，赶紧来抢呀，要能超过我，今晚你请客！");
    };
    Object.defineProperty(ResultLayer.prototype, "num", {
        get: function () {
            return 0;
        },
        set: function (value) {
            var list = GameUtils.parseNum(Math.floor(value));
            this.scoreTxt1.setChar(list[0]);
            this.scoreTxt1.x = 351 + (1 - list[0].length) * 8;
            this.scoreTxt2.setChar(list[1]);
            this.scoreTxt3.setChar(list[2]);
        },
        enumerable: true,
        configurable: true
    });
    return ResultLayer;
}());
