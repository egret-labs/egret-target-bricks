
BK.Script.loadlib('GameRes://script/core/ui/button.js');

function onTextChange(text){
	BK.Script.log(1,1,"xxxx text ="+text);
}

function onBtnClick(text){
	BK.Script.log(1,1,"xxxx onBtn click ="+text);
}

var micOff = new BK.Button(100, 100, "GameRes://resource/texture/mic_off.png", function () {
			BK.Script.log(1,1,"xxxx onclick =");
			//var editor = new BK.Editor(onBtnClick,onTextChange);
			BK.Editor.showKeyBoard(onBtnClick,onTextChange);
        });
        micOff.zOrder = -9999;
        BK.Director.root.addChild(micOff);
