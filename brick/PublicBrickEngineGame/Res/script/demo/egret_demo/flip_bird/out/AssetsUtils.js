var AssestUtil = (function () {
    function AssestUtil() {
    }
    AssestUtil.createButton = function (text) {
        var button = new egret.DisplayObjectContainer();
        var button_bg = createBitmapByName("button_png");
        var textField = this.createText(text);
        button.addChild(button_bg);
        button.addChild(textField);
        textField.x = button_bg.width / 2;
        textField.y = button_bg.height / 2;
        button.touchEnabled = true;
        button.touchChildren = false;
        button.anchorOffsetX = button_bg.width / 2;
        button.anchorOffsetY = button_bg.height / 2;
        return button;
    };
    AssestUtil.createText = function (text) {
        var textField = new egret.TextField();
        textField.text = text;
        textField.size = 120;
        textField.textWidth = 900;
        textField.anchorOffsetX = textField.width / 2;
        textField.anchorOffsetY = textField.height / 2;
        egret.console_log("文字", textField.text);
        egret.console_log("文字宽度", textField.width);
        egret.console_log("文字高度", textField.height);
        return textField;
    };
    return AssestUtil;
}());
