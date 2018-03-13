window.skins={};
function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
    __.prototype = b.prototype;
    d.prototype = new __();
};
window.generateEUI = {};
generateEUI.paths = {};
generateEUI.skins = {"eui.Button":"resource/eui_skins/ButtonSkin.exml","eui.CheckBox":"resource/eui_skins/CheckBoxSkin.exml","eui.HScrollBar":"resource/eui_skins/HScrollBarSkin.exml","eui.HSlider":"resource/eui_skins/HSliderSkin.exml","eui.Panel":"resource/eui_skins/PanelSkin.exml","eui.TextInput":"resource/eui_skins/TextInputSkin.exml","eui.ProgressBar":"resource/eui_skins/ProgressBarSkin.exml","eui.RadioButton":"resource/eui_skins/RadioButtonSkin.exml","eui.Scroller":"resource/eui_skins/ScrollerSkin.exml","eui.ToggleSwitch":"resource/eui_skins/ToggleSwitchSkin.exml","eui.VScrollBar":"resource/eui_skins/VScrollBarSkin.exml","eui.VSlider":"resource/eui_skins/VSliderSkin.exml","eui.ItemRenderer":"resource/eui_skins/ItemRendererSkin.exml"}
generateEUI.paths['resource/eui_skins/ButtonSkin.exml'] = window.skins.ButtonSkin = (function (_super) {
	__extends(ButtonSkin, _super);
	function ButtonSkin() {
		_super.call(this);
		this.skinParts = ["labelDisplay","iconDisplay"];
		
		this.minHeight = 50;
		this.minWidth = 100;
		this.elementsContent = [this._Image1_i(),this.labelDisplay_i(),this.iconDisplay_i()];
		this.states = [
			new eui.State ("up",
				[
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","source","button_down_png")
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","alpha",0.5)
				])
		];
	}
	var _proto = ButtonSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(1,3,8,8);
		t.source = "button_up_png";
		t.percentWidth = 100;
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.bottom = 8;
		t.left = 8;
		t.right = 8;
		t.size = 20;
		t.textAlign = "center";
		t.textColor = 0xFFFFFF;
		t.top = 8;
		t.verticalAlign = "middle";
		return t;
	};
	_proto.iconDisplay_i = function () {
		var t = new eui.Image();
		this.iconDisplay = t;
		t.horizontalCenter = 0;
		t.verticalCenter = 0;
		return t;
	};
	return ButtonSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/CheckBoxSkin.exml'] = window.skins.CheckBoxSkin = (function (_super) {
	__extends(CheckBoxSkin, _super);
	function CheckBoxSkin() {
		_super.call(this);
		this.skinParts = ["labelDisplay"];
		
		this.elementsContent = [this._Group1_i()];
		this.states = [
			new eui.State ("up",
				[
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","alpha",0.7)
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","alpha",0.5)
				])
			,
			new eui.State ("upAndSelected",
				[
					new eui.SetProperty("_Image1","source","checkbox_select_up_png")
				])
			,
			new eui.State ("downAndSelected",
				[
					new eui.SetProperty("_Image1","source","checkbox_select_down_png")
				])
			,
			new eui.State ("disabledAndSelected",
				[
					new eui.SetProperty("_Image1","source","checkbox_select_disabled_png")
				])
		];
	}
	var _proto = CheckBoxSkin.prototype;

	_proto._Group1_i = function () {
		var t = new eui.Group();
		t.percentHeight = 100;
		t.percentWidth = 100;
		t.layout = this._HorizontalLayout1_i();
		t.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
		return t;
	};
	_proto._HorizontalLayout1_i = function () {
		var t = new eui.HorizontalLayout();
		t.verticalAlign = "middle";
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.alpha = 1;
		t.fillMode = "scale";
		t.source = "checkbox_unselect_png";
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.fontFamily = "Tahoma";
		t.size = 20;
		t.textAlign = "center";
		t.textColor = 0x707070;
		t.verticalAlign = "middle";
		return t;
	};
	return CheckBoxSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/HScrollBarSkin.exml'] = window.skins.HScrollBarSkin = (function (_super) {
	__extends(HScrollBarSkin, _super);
	function HScrollBarSkin() {
		_super.call(this);
		this.skinParts = ["thumb"];
		
		this.minHeight = 8;
		this.minWidth = 20;
		this.elementsContent = [this.thumb_i()];
	}
	var _proto = HScrollBarSkin.prototype;

	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.height = 8;
		t.scale9Grid = new egret.Rectangle(3,3,2,2);
		t.source = "roundthumb_png";
		t.verticalCenter = 0;
		t.width = 30;
		return t;
	};
	return HScrollBarSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/HSliderSkin.exml'] = window.skins.HSliderSkin = (function (_super) {
	__extends(HSliderSkin, _super);
	function HSliderSkin() {
		_super.call(this);
		this.skinParts = ["track","thumb"];
		
		this.minHeight = 8;
		this.minWidth = 20;
		this.elementsContent = [this.track_i(),this.thumb_i()];
	}
	var _proto = HSliderSkin.prototype;

	_proto.track_i = function () {
		var t = new eui.Image();
		this.track = t;
		t.height = 6;
		t.scale9Grid = new egret.Rectangle(1,1,4,4);
		t.source = "track_sb_png";
		t.verticalCenter = 0;
		t.percentWidth = 100;
		return t;
	};
	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.source = "thumb_png";
		t.verticalCenter = 0;
		return t;
	};
	return HSliderSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/ItemRendererSkin.exml'] = window.skins.ItemRendererSkin = (function (_super) {
	__extends(ItemRendererSkin, _super);
	function ItemRendererSkin() {
		_super.call(this);
		this.skinParts = ["labelDisplay"];
		
		this.minHeight = 50;
		this.minWidth = 100;
		this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
		this.states = [
			new eui.State ("up",
				[
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","source","button_down_png")
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","alpha",0.5)
				])
		];
		
		eui.Binding.$bindProperties(this, ["hostComponent.data"],[0],this.labelDisplay,"text")
	}
	var _proto = ItemRendererSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(1,3,8,8);
		t.source = "button_up_png";
		t.percentWidth = 100;
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.bottom = 8;
		t.fontFamily = "Tahoma";
		t.left = 8;
		t.right = 8;
		t.size = 20;
		t.textAlign = "center";
		t.textColor = 0xFFFFFF;
		t.top = 8;
		t.verticalAlign = "middle";
		return t;
	};
	return ItemRendererSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/PanelSkin.exml'] = window.skins.PanelSkin = (function (_super) {
	__extends(PanelSkin, _super);
	function PanelSkin() {
		_super.call(this);
		this.skinParts = ["titleDisplay","moveArea","closeButton"];
		
		this.minHeight = 230;
		this.minWidth = 450;
		this.elementsContent = [this._Image1_i(),this.moveArea_i(),this.closeButton_i()];
	}
	var _proto = PanelSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.scale9Grid = new egret.Rectangle(2,2,12,12);
		t.source = "border_png";
		t.top = 0;
		return t;
	};
	_proto.moveArea_i = function () {
		var t = new eui.Group();
		this.moveArea = t;
		t.height = 45;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.elementsContent = [this._Image2_i(),this.titleDisplay_i()];
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.source = "header_png";
		t.top = 0;
		return t;
	};
	_proto.titleDisplay_i = function () {
		var t = new eui.Label();
		this.titleDisplay = t;
		t.fontFamily = "Tahoma";
		t.left = 15;
		t.right = 5;
		t.size = 20;
		t.textColor = 0xFFFFFF;
		t.verticalCenter = 0;
		t.wordWrap = false;
		return t;
	};
	_proto.closeButton_i = function () {
		var t = new eui.Button();
		this.closeButton = t;
		t.bottom = 5;
		t.horizontalCenter = 0;
		t.label = "close";
		return t;
	};
	return PanelSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/ProgressBarSkin.exml'] = window.skins.ProgressBarSkin = (function (_super) {
	__extends(ProgressBarSkin, _super);
	function ProgressBarSkin() {
		_super.call(this);
		this.skinParts = ["thumb","labelDisplay"];
		
		this.minHeight = 18;
		this.minWidth = 30;
		this.elementsContent = [this._Image1_i(),this.thumb_i(),this.labelDisplay_i()];
	}
	var _proto = ProgressBarSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(1,1,4,4);
		t.source = "track_pb_png";
		t.verticalCenter = 0;
		t.percentWidth = 100;
		return t;
	};
	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.percentHeight = 100;
		t.source = "thumb_pb_png";
		t.percentWidth = 100;
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.fontFamily = "Tahoma";
		t.horizontalCenter = 0;
		t.size = 15;
		t.textAlign = "center";
		t.textColor = 0x707070;
		t.verticalAlign = "middle";
		t.verticalCenter = 0;
		return t;
	};
	return ProgressBarSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/RadioButtonSkin.exml'] = window.skins.RadioButtonSkin = (function (_super) {
	__extends(RadioButtonSkin, _super);
	function RadioButtonSkin() {
		_super.call(this);
		this.skinParts = ["labelDisplay"];
		
		this.elementsContent = [this._Group1_i()];
		this.states = [
			new eui.State ("up",
				[
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","alpha",0.7)
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","alpha",0.5)
				])
			,
			new eui.State ("upAndSelected",
				[
					new eui.SetProperty("_Image1","source","radiobutton_select_up_png")
				])
			,
			new eui.State ("downAndSelected",
				[
					new eui.SetProperty("_Image1","source","radiobutton_select_down_png")
				])
			,
			new eui.State ("disabledAndSelected",
				[
					new eui.SetProperty("_Image1","source","radiobutton_select_disabled_png")
				])
		];
	}
	var _proto = RadioButtonSkin.prototype;

	_proto._Group1_i = function () {
		var t = new eui.Group();
		t.percentHeight = 100;
		t.percentWidth = 100;
		t.layout = this._HorizontalLayout1_i();
		t.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
		return t;
	};
	_proto._HorizontalLayout1_i = function () {
		var t = new eui.HorizontalLayout();
		t.verticalAlign = "middle";
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.alpha = 1;
		t.fillMode = "scale";
		t.source = "radiobutton_unselect_png";
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.fontFamily = "Tahoma";
		t.size = 20;
		t.textAlign = "center";
		t.textColor = 0x707070;
		t.verticalAlign = "middle";
		return t;
	};
	return RadioButtonSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/ScrollerSkin.exml'] = window.skins.ScrollerSkin = (function (_super) {
	__extends(ScrollerSkin, _super);
	function ScrollerSkin() {
		_super.call(this);
		this.skinParts = ["horizontalScrollBar","verticalScrollBar"];
		
		this.minHeight = 20;
		this.minWidth = 20;
		this.elementsContent = [this.horizontalScrollBar_i(),this.verticalScrollBar_i()];
	}
	var _proto = ScrollerSkin.prototype;

	_proto.horizontalScrollBar_i = function () {
		var t = new eui.HScrollBar();
		this.horizontalScrollBar = t;
		t.bottom = 0;
		t.percentWidth = 100;
		return t;
	};
	_proto.verticalScrollBar_i = function () {
		var t = new eui.VScrollBar();
		this.verticalScrollBar = t;
		t.percentHeight = 100;
		t.right = 0;
		return t;
	};
	return ScrollerSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/TextInputSkin.exml'] = window.skins.TextInputSkin = (function (_super) {
	__extends(TextInputSkin, _super);
	function TextInputSkin() {
		_super.call(this);
		this.skinParts = ["textDisplay","promptDisplay"];
		
		this.minHeight = 40;
		this.minWidth = 300;
		this.elementsContent = [this._Image1_i(),this._Rect1_i(),this.textDisplay_i()];
		this.promptDisplay_i();
		
		this.states = [
			new eui.State ("normal",
				[
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("textDisplay","textColor",0xff0000)
				])
			,
			new eui.State ("normalWithPrompt",
				[
					new eui.AddItems("promptDisplay","",1,"")
				])
			,
			new eui.State ("disabledWithPrompt",
				[
					new eui.AddItems("promptDisplay","",1,"")
				])
		];
	}
	var _proto = TextInputSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(1,3,8,8);
		t.source = "button_up_png";
		t.percentWidth = 100;
		return t;
	};
	_proto._Rect1_i = function () {
		var t = new eui.Rect();
		t.fillColor = 0xffffff;
		t.percentHeight = 100;
		t.percentWidth = 100;
		return t;
	};
	_proto.textDisplay_i = function () {
		var t = new eui.EditableText();
		this.textDisplay = t;
		t.height = 24;
		t.left = "10";
		t.right = "10";
		t.size = 20;
		t.textColor = 0x000000;
		t.verticalCenter = "0";
		t.percentWidth = 100;
		return t;
	};
	_proto.promptDisplay_i = function () {
		var t = new eui.Label();
		this.promptDisplay = t;
		t.height = 24;
		t.left = 10;
		t.right = 10;
		t.size = 20;
		t.textColor = 0xa9a9a9;
		t.touchEnabled = false;
		t.verticalCenter = 0;
		t.percentWidth = 100;
		return t;
	};
	return TextInputSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/ToggleSwitchSkin.exml'] = window.skins.ToggleSwitchSkin = (function (_super) {
	__extends(ToggleSwitchSkin, _super);
	function ToggleSwitchSkin() {
		_super.call(this);
		this.skinParts = [];
		
		this.elementsContent = [this._Image1_i(),this._Image2_i()];
		this.states = [
			new eui.State ("up",
				[
					new eui.SetProperty("_Image1","source","off_png")
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","source","off_png")
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","source","off_png")
				])
			,
			new eui.State ("upAndSelected",
				[
					new eui.SetProperty("_Image2","horizontalCenter",18)
				])
			,
			new eui.State ("downAndSelected",
				[
					new eui.SetProperty("_Image2","horizontalCenter",18)
				])
			,
			new eui.State ("disabledAndSelected",
				[
					new eui.SetProperty("_Image2","horizontalCenter",18)
				])
		];
	}
	var _proto = ToggleSwitchSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.source = "on_png";
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		this._Image2 = t;
		t.horizontalCenter = -18;
		t.source = "handle_png";
		t.verticalCenter = 0;
		return t;
	};
	return ToggleSwitchSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/VScrollBarSkin.exml'] = window.skins.VScrollBarSkin = (function (_super) {
	__extends(VScrollBarSkin, _super);
	function VScrollBarSkin() {
		_super.call(this);
		this.skinParts = ["thumb"];
		
		this.minHeight = 20;
		this.minWidth = 8;
		this.elementsContent = [this.thumb_i()];
	}
	var _proto = VScrollBarSkin.prototype;

	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.height = 30;
		t.horizontalCenter = 0;
		t.scale9Grid = new egret.Rectangle(3,3,2,2);
		t.source = "roundthumb_png";
		t.width = 8;
		return t;
	};
	return VScrollBarSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/VSliderSkin.exml'] = window.skins.VSliderSkin = (function (_super) {
	__extends(VSliderSkin, _super);
	function VSliderSkin() {
		_super.call(this);
		this.skinParts = ["track","thumb"];
		
		this.minHeight = 30;
		this.minWidth = 25;
		this.elementsContent = [this.track_i(),this.thumb_i()];
	}
	var _proto = VSliderSkin.prototype;

	_proto.track_i = function () {
		var t = new eui.Image();
		this.track = t;
		t.percentHeight = 100;
		t.horizontalCenter = 0;
		t.scale9Grid = new egret.Rectangle(1,1,4,4);
		t.source = "track_png";
		t.width = 7;
		return t;
	};
	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.horizontalCenter = 0;
		t.source = "thumb_png";
		return t;
	};
	return VSliderSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/battle_prepare.exml'] = window.NewFile123123 = (function (_super) {
	__extends(NewFile123123, _super);
	function NewFile123123() {
		_super.call(this);
		this.skinParts = ["user_name_label1","user_from_label1","user_level_label1","game_cost_label1","enemy_detail_group","enemy_info_group","circle_bg3","circle_bg2","circle_bg1","circle_icon","match_time_count_label","search_group","prepare_bg_top","user_name_label","user_from_label","user_level_label","game_cost_label","group_label","user_info_group","battle_prepare_group","answer_timer_cover_img","QA_user_headicon","QA_enemy_headicon","QA_user_name","QA_enemy_name","answer_time_left_label","QA_question_index","QA_question_label","user_score_label","enemy_score_label","answer_bg_1","answer_content_label1","answer_panel1","answer_bg_2","answer_content_label2","answer_panel2","answer_bg_3","answer_content_label3","answer_panel3","answer_bg_4","answer_content_label4","answer_panel4","my_score_progress","nenmy_score_progress","small_type_bg","question_type_img","small_type_text","g_type","QA_group"];
		
		this.width = 640;
		this.elementsContent = [this.battle_prepare_group_i(),this.QA_group_i()];
	}
	var _proto = NewFile123123.prototype;

	_proto.battle_prepare_group_i = function () {
		var t = new eui.Group();
		this.battle_prepare_group = t;
		t.verticalCenter = 0;
		t.width = 640;
		t.x = 0;
		t.elementsContent = [this.enemy_info_group_i(),this.search_group_i(),this.user_info_group_i()];
		return t;
	};
	_proto.enemy_info_group_i = function () {
		var t = new eui.Group();
		this.enemy_info_group = t;
		t.anchorOffsetY = 0;
		t.height = 533.33;
		t.scaleX = 1;
		t.scaleY = 1;
		t.visible = false;
		t.width = 640;
		t.x = 0;
		t.y = 505.34;
		t.elementsContent = [this.enemy_detail_group_i()];
		return t;
	};
	_proto.enemy_detail_group_i = function () {
		var t = new eui.Group();
		this.enemy_detail_group = t;
		t.anchorOffsetY = 0;
		t.height = 530.67;
		t.scaleX = 1;
		t.scaleY = 1;
		t.width = 640;
		t.x = 0;
		t.y = 2.66;
		t.elementsContent = [this._Image1_i(),this._Image2_i(),this._Image3_i(),this.user_name_label1_i(),this._Label1_i(),this.user_from_label1_i(),this.user_level_label1_i(),this._Label2_i(),this.game_cost_label1_i()];
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.source = "button_down_png";
		t.y = -9.31;
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.source = "egret_icon_png";
		t.x = 241.34;
		t.y = 139.99;
		return t;
	};
	_proto._Image3_i = function () {
		var t = new eui.Image();
		t.height = 123.5;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "egret_icon_png";
		t.width = 123.5;
		t.x = 255.01;
		t.y = 150.64;
		return t;
	};
	_proto.user_name_label1_i = function () {
		var t = new eui.Label();
		this.user_name_label1 = t;
		t.anchorOffsetX = 0;
		t.fontFamily = "Microsoft YaHei";
		t.scaleX = 1;
		t.scaleY = 1;
		t.size = 24;
		t.strokeColor = 0xFFFFFF;
		t.text = "名字不好取";
		t.textAlign = "center";
		t.textColor = 0xffe400;
		t.width = 183;
		t.x = 228.5;
		t.y = 299.33;
		return t;
	};
	_proto._Label1_i = function () {
		var t = new eui.Label();
		t.fontFamily = "Microsoft YaHei";
		t.scaleX = 1;
		t.scaleY = 1;
		t.size = 16;
		t.text = "来自:";
		t.textColor = 0xffffff;
		t.x = 275;
		t.y = 335.33;
		return t;
	};
	_proto.user_from_label1_i = function () {
		var t = new eui.Label();
		this.user_from_label1 = t;
		t.fontFamily = "Microsoft YaHei";
		t.scaleX = 1;
		t.scaleY = 1;
		t.size = 16;
		t.text = "上海";
		t.textColor = 0xffffff;
		t.x = 320;
		t.y = 335.33;
		return t;
	};
	_proto.user_level_label1_i = function () {
		var t = new eui.Label();
		this.user_level_label1 = t;
		t.fontFamily = "Microsoft YaHei";
		t.scaleX = 1;
		t.scaleY = 1;
		t.size = 18;
		t.text = "Lv.11";
		t.textColor = 0xffffff;
		t.x = 296;
		t.y = 363.33;
		return t;
	};
	_proto._Label2_i = function () {
		var t = new eui.Label();
		t.fontFamily = "Microsoft YaHei";
		t.scaleX = 1;
		t.scaleY = 1;
		t.size = 20;
		t.text = "入场费:";
		t.textColor = 0xffffff;
		t.visible = false;
		t.x = 294;
		t.y = 361.33;
		return t;
	};
	_proto.game_cost_label1_i = function () {
		var t = new eui.Label();
		this.game_cost_label1 = t;
		t.fontFamily = "Microsoft YaHei";
		t.scaleX = 1;
		t.scaleY = 1;
		t.size = 20;
		t.text = "100";
		t.textColor = 0xffffff;
		t.visible = false;
		t.x = 367;
		t.y = 361.33;
		return t;
	};
	_proto.search_group_i = function () {
		var t = new eui.Group();
		this.search_group = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 657.33;
		t.width = 640;
		t.x = 0;
		t.y = 252;
		t.elementsContent = [this.circle_bg3_i(),this.circle_bg2_i(),this.circle_bg1_i(),this.circle_icon_i(),this.match_time_count_label_i()];
		return t;
	};
	_proto.circle_bg3_i = function () {
		var t = new eui.Image();
		this.circle_bg3 = t;
		t.anchorOffsetX = 275;
		t.anchorOffsetY = 275;
		t.height = 550;
		t.scaleX = 1;
		t.source = "bg_jpg";
		t.width = 550;
		t.x = 319;
		t.y = 337.33;
		return t;
	};
	_proto.circle_bg2_i = function () {
		var t = new eui.Image();
		this.circle_bg2 = t;
		t.anchorOffsetX = 200;
		t.anchorOffsetY = 200;
		t.height = 400;
		t.scaleX = 1;
		t.source = "bg_jpg";
		t.width = 400;
		t.x = 317;
		t.y = 341;
		return t;
	};
	_proto.circle_bg1_i = function () {
		var t = new eui.Image();
		this.circle_bg1 = t;
		t.anchorOffsetX = 100;
		t.anchorOffsetY = 100;
		t.height = 200;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "track_png";
		t.width = 200;
		t.x = 317;
		t.y = 338.67;
		return t;
	};
	_proto.circle_icon_i = function () {
		var t = new eui.Image();
		this.circle_icon = t;
		t.anchorOffsetX = 74.67;
		t.anchorOffsetY = 76;
		t.scaleX = 1.1;
		t.scaleY = 1.1;
		t.source = "button_down_png";
		t.visible = false;
		t.x = 316.01;
		t.y = 342.63;
		return t;
	};
	_proto.match_time_count_label_i = function () {
		var t = new eui.Label();
		this.match_time_count_label = t;
		t.anchorOffsetX = 59;
		t.anchorOffsetY = 54.5;
		t.fontFamily = "Microsoft YaHei";
		t.height = 110;
		t.horizontalCenter = -3.5;
		t.scaleX = 1;
		t.scaleY = 1;
		t.size = 70;
		t.text = "0";
		t.textAlign = "center";
		t.verticalAlign = "middle";
		t.visible = false;
		t.width = 130;
		t.x = 261;
		t.y = 337.03;
		return t;
	};
	_proto.user_info_group_i = function () {
		var t = new eui.Group();
		this.user_info_group = t;
		t.anchorOffsetY = 0;
		t.height = 528;
		t.scaleX = 1;
		t.scaleY = 1;
		t.width = 640;
		t.x = 0;
		t.y = 519;
		t.elementsContent = [this.prepare_bg_top_i(),this._Image4_i(),this._Image5_i(),this.group_label_i()];
		return t;
	};
	_proto.prepare_bg_top_i = function () {
		var t = new eui.Image();
		this.prepare_bg_top = t;
		t.source = "button_up_png";
		t.visible = false;
		t.y = -1.33;
		return t;
	};
	_proto._Image4_i = function () {
		var t = new eui.Image();
		t.source = "button_up_png";
		t.x = 241.34;
		return t;
	};
	_proto._Image5_i = function () {
		var t = new eui.Image();
		t.height = 123.5;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "bg_jpg";
		t.width = 123.5;
		t.x = 255.5;
		t.y = 11.03;
		return t;
	};
	_proto.group_label_i = function () {
		var t = new eui.Group();
		this.group_label = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 115;
		t.visible = false;
		t.width = 248;
		t.x = 199;
		t.y = 153;
		t.elementsContent = [this.user_name_label_i(),this._Label3_i(),this.user_from_label_i(),this.user_level_label_i(),this._Label4_i(),this.game_cost_label_i()];
		return t;
	};
	_proto.user_name_label_i = function () {
		var t = new eui.Label();
		this.user_name_label = t;
		t.anchorOffsetX = 0;
		t.fontFamily = "Microsoft YaHei";
		t.scaleX = 1;
		t.scaleY = 1;
		t.size = 24;
		t.strokeColor = 0xffffff;
		t.text = "名字不好取";
		t.textAlign = "center";
		t.textColor = 0xffe400;
		t.width = 183;
		t.x = 29.5;
		t.y = 5;
		return t;
	};
	_proto._Label3_i = function () {
		var t = new eui.Label();
		t.fontFamily = "Microsoft YaHei";
		t.scaleX = 1;
		t.scaleY = 1;
		t.size = 16;
		t.text = "来自:";
		t.textColor = 0xffffff;
		t.x = 76;
		t.y = 41;
		return t;
	};
	_proto.user_from_label_i = function () {
		var t = new eui.Label();
		this.user_from_label = t;
		t.fontFamily = "Microsoft YaHei";
		t.scaleX = 1;
		t.scaleY = 1;
		t.size = 16;
		t.text = "上海";
		t.textColor = 0xffffff;
		t.x = 121;
		t.y = 41;
		return t;
	};
	_proto.user_level_label_i = function () {
		var t = new eui.Label();
		this.user_level_label = t;
		t.fontFamily = "Microsoft YaHei";
		t.scaleX = 1;
		t.scaleY = 1;
		t.size = 18;
		t.text = "Lv.11";
		t.textColor = 0xffffff;
		t.x = 39;
		t.y = 69;
		return t;
	};
	_proto._Label4_i = function () {
		var t = new eui.Label();
		t.fontFamily = "Microsoft YaHei";
		t.scaleX = 1;
		t.scaleY = 1;
		t.size = 20;
		t.text = "入场费:";
		t.textColor = 0xffffff;
		t.x = 95;
		t.y = 67;
		return t;
	};
	_proto.game_cost_label_i = function () {
		var t = new eui.Label();
		this.game_cost_label = t;
		t.fontFamily = "Microsoft YaHei";
		t.scaleX = 1;
		t.scaleY = 1;
		t.size = 20;
		t.text = "100";
		t.textColor = 0xffffff;
		t.x = 168;
		t.y = 67;
		return t;
	};
	_proto.QA_group_i = function () {
		var t = new eui.Group();
		this.QA_group = t;
		t.width = 640;
		t.x = 0;
		t.y = 0;
		t.elementsContent = [this._Image6_i(),this._Image7_i(),this._Image8_i(),this.answer_timer_cover_img_i(),this.QA_user_headicon_i(),this.QA_enemy_headicon_i(),this.QA_user_name_i(),this.QA_enemy_name_i(),this.answer_time_left_label_i(),this.QA_question_index_i(),this.QA_question_label_i(),this.user_score_label_i(),this.enemy_score_label_i(),this.answer_panel1_i(),this.answer_panel2_i(),this.answer_panel3_i(),this.answer_panel4_i(),this.my_score_progress_i(),this.nenmy_score_progress_i(),this.g_type_i()];
		return t;
	};
	_proto._Image6_i = function () {
		var t = new eui.Image();
		t.percentHeight = 100;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "bg_jpg";
		t.visible = false;
		t.percentWidth = 100;
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto._Image7_i = function () {
		var t = new eui.Image();
		t.source = "bg_jpg";
		t.x = 10;
		t.y = 35.27;
		return t;
	};
	_proto._Image8_i = function () {
		var t = new eui.Image();
		t.source = "bg_jpg";
		t.x = 228;
		t.y = 27.27;
		return t;
	};
	_proto.answer_timer_cover_img_i = function () {
		var t = new eui.Image();
		this.answer_timer_cover_img = t;
		t.height = 114;
		t.source = "bg_jpg";
		t.width = 114;
		t.x = 261;
		t.y = 59.27;
		return t;
	};
	_proto.QA_user_headicon_i = function () {
		var t = new eui.Image();
		this.QA_user_headicon = t;
		t.anchorOffsetX = 45;
		t.anchorOffsetY = 45;
		t.height = 90;
		t.source = "bg_jpg";
		t.width = 90;
		t.x = 63;
		t.y = 104.27;
		return t;
	};
	_proto.QA_enemy_headicon_i = function () {
		var t = new eui.Image();
		this.QA_enemy_headicon = t;
		t.anchorOffsetX = 45;
		t.anchorOffsetY = 45;
		t.height = 90;
		t.source = "bg_jpg";
		t.width = 90;
		t.x = 577;
		t.y = 104.27;
		return t;
	};
	_proto.QA_user_name_i = function () {
		var t = new eui.Label();
		this.QA_user_name = t;
		t.anchorOffsetX = 0;
		t.fontFamily = "Microsoft YaHei";
		t.size = 22;
		t.text = "我的名字";
		t.textAlign = "center";
		t.width = 145;
		t.x = 73.5;
		t.y = 155.27;
		return t;
	};
	_proto.QA_enemy_name_i = function () {
		var t = new eui.Label();
		this.QA_enemy_name = t;
		t.anchorOffsetX = 0;
		t.fontFamily = "Microsoft YaHei";
		t.size = 22;
		t.text = "他的名字";
		t.textAlign = "center";
		t.textColor = 0xffffff;
		t.width = 145;
		t.x = 419.5;
		t.y = 155.27;
		return t;
	};
	_proto.answer_time_left_label_i = function () {
		var t = new eui.BitmapLabel();
		this.answer_time_left_label = t;
		t.anchorOffsetX = 42;
		t.anchorOffsetY = 30;
		t.font = "egg_fnt";
		t.height = 60;
		t.text = "10";
		t.textAlign = "center";
		t.width = 84;
		t.x = 317;
		t.y = 119.27;
		return t;
	};
	_proto.QA_question_index_i = function () {
		var t = new eui.Label();
		this.QA_question_index = t;
		t.anchorOffsetX = 90.5;
		t.anchorOffsetY = 20;
		t.fontFamily = "Microsoft YaHei";
		t.height = 40;
		t.size = 40;
		t.text = "第一题";
		t.textAlign = "center";
		t.width = 181;
		t.x = 320;
		t.y = 313.5;
		return t;
	};
	_proto.QA_question_label_i = function () {
		var t = new eui.Label();
		this.QA_question_label = t;
		t.anchorOffsetY = 0;
		t.fontFamily = "Microsoft YaHei";
		t.height = 134;
		t.lineSpacing = 5;
		t.size = 28;
		t.text = "鱼香肉丝用的什么肉";
		t.textAlign = "center";
		t.verticalAlign = "middle";
		t.width = 600;
		t.x = 18;
		t.y = 245.5;
		return t;
	};
	_proto.user_score_label_i = function () {
		var t = new eui.BitmapLabel();
		this.user_score_label = t;
		t.anchorOffsetX = 57.5;
		t.anchorOffsetY = 16;
		t.font = "egg_fnt";
		t.height = 32;
		t.text = "0";
		t.textAlign = "center";
		t.width = 115;
		t.x = 170.5;
		t.y = 103.27;
		return t;
	};
	_proto.enemy_score_label_i = function () {
		var t = new eui.BitmapLabel();
		this.enemy_score_label = t;
		t.anchorOffsetX = 57.5;
		t.anchorOffsetY = 16;
		t.font = "egg_fnt";
		t.height = 32;
		t.text = "0";
		t.textAlign = "center";
		t.width = 115;
		t.x = 465.5;
		t.y = 103.27;
		return t;
	};
	_proto.answer_panel1_i = function () {
		var t = new eui.Group();
		this.answer_panel1 = t;
		t.height = 86;
		t.horizontalCenter = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.width = 440;
		t.y = 440;
		t.elementsContent = [this.answer_bg_1_i(),this.answer_content_label1_i(),this._Image9_i(),this._Image10_i()];
		return t;
	};
	_proto.answer_bg_1_i = function () {
		var t = new eui.Image();
		this.answer_bg_1 = t;
		t.height = 86;
		t.name = "answer_bg";
		t.scale9Grid = new egret.Rectangle(17,15,52,63);
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "bg_jpg";
		t.width = 440;
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto.answer_content_label1_i = function () {
		var t = new eui.Label();
		this.answer_content_label1 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.fontFamily = "Microsoft YaHei";
		t.height = 42;
		t.horizontalCenter = 0;
		t.name = "answer_content_label";
		t.scaleX = 1;
		t.scaleY = 1;
		t.size = 28;
		t.text = "猪肉";
		t.textAlign = "center";
		t.verticalAlign = "middle";
		t.width = 324;
		t.y = 24;
		return t;
	};
	_proto._Image9_i = function () {
		var t = new eui.Image();
		t.height = 35;
		t.name = "answer_my_result_img";
		t.source = "icon_png";
		t.verticalCenter = 0.5;
		t.visible = false;
		t.width = 35;
		t.x = 20;
		return t;
	};
	_proto._Image10_i = function () {
		var t = new eui.Image();
		t.height = 35;
		t.name = "answer_enemy_result_img";
		t.source = "icon_png";
		t.visible = false;
		t.width = 35;
		t.x = 385;
		t.y = 27.5;
		return t;
	};
	_proto.answer_panel2_i = function () {
		var t = new eui.Group();
		this.answer_panel2 = t;
		t.height = 86;
		t.horizontalCenter = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.width = 440;
		t.y = 560;
		t.elementsContent = [this.answer_bg_2_i(),this.answer_content_label2_i(),this._Image11_i(),this._Image12_i()];
		return t;
	};
	_proto.answer_bg_2_i = function () {
		var t = new eui.Image();
		this.answer_bg_2 = t;
		t.height = 86;
		t.name = "answer_bg";
		t.scale9Grid = new egret.Rectangle(16,16,53,60);
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "bg_jpg";
		t.width = 440;
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto.answer_content_label2_i = function () {
		var t = new eui.Label();
		this.answer_content_label2 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.fontFamily = "Microsoft YaHei";
		t.height = 42;
		t.horizontalCenter = 0;
		t.name = "answer_content_label";
		t.scaleX = 1;
		t.scaleY = 1;
		t.size = 28;
		t.text = "鸡肉";
		t.textAlign = "center";
		t.verticalAlign = "middle";
		t.width = 332;
		t.y = 22;
		return t;
	};
	_proto._Image11_i = function () {
		var t = new eui.Image();
		t.name = "answer_my_result_img";
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "icon_png";
		t.verticalCenter = 0;
		t.visible = false;
		t.x = 20;
		t.y = -95;
		return t;
	};
	_proto._Image12_i = function () {
		var t = new eui.Image();
		t.name = "answer_enemy_result_img";
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "icon_png";
		t.verticalCenter = 0;
		t.visible = false;
		t.x = 385;
		t.y = -95;
		return t;
	};
	_proto.answer_panel3_i = function () {
		var t = new eui.Group();
		this.answer_panel3 = t;
		t.height = 86;
		t.horizontalCenter = 0;
		t.width = 440;
		t.y = 680;
		t.elementsContent = [this.answer_bg_3_i(),this.answer_content_label3_i(),this._Image13_i(),this._Image14_i()];
		return t;
	};
	_proto.answer_bg_3_i = function () {
		var t = new eui.Image();
		this.answer_bg_3 = t;
		t.height = 86;
		t.name = "answer_bg";
		t.scale9Grid = new egret.Rectangle(15,15,54,62);
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "bg_jpg";
		t.width = 440;
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto.answer_content_label3_i = function () {
		var t = new eui.Label();
		this.answer_content_label3 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.fontFamily = "Microsoft YaHei";
		t.height = 42;
		t.horizontalCenter = 0;
		t.name = "answer_content_label";
		t.scaleX = 1;
		t.scaleY = 1;
		t.size = 28;
		t.text = "人肉";
		t.textAlign = "center";
		t.verticalAlign = "middle";
		t.width = 332;
		t.y = 22;
		return t;
	};
	_proto._Image13_i = function () {
		var t = new eui.Image();
		t.name = "answer_my_result_img";
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "icon_png";
		t.verticalCenter = 0;
		t.visible = false;
		t.x = 20;
		t.y = -211;
		return t;
	};
	_proto._Image14_i = function () {
		var t = new eui.Image();
		t.name = "answer_enemy_result_img";
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "icon_png";
		t.verticalCenter = 0;
		t.visible = false;
		t.x = 385;
		t.y = -211;
		return t;
	};
	_proto.answer_panel4_i = function () {
		var t = new eui.Group();
		this.answer_panel4 = t;
		t.height = 86;
		t.horizontalCenter = 0;
		t.width = 440;
		t.y = 800;
		t.elementsContent = [this.answer_bg_4_i(),this.answer_content_label4_i(),this._Image15_i(),this._Image16_i()];
		return t;
	};
	_proto.answer_bg_4_i = function () {
		var t = new eui.Image();
		this.answer_bg_4 = t;
		t.height = 86;
		t.name = "answer_bg";
		t.scale9Grid = new egret.Rectangle(17,16,51,60);
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "bg_jpg";
		t.width = 440;
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto.answer_content_label4_i = function () {
		var t = new eui.Label();
		this.answer_content_label4 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.fontFamily = "Microsoft YaHei";
		t.height = 42;
		t.horizontalCenter = 0;
		t.name = "answer_content_label";
		t.scaleX = 1;
		t.scaleY = 1;
		t.size = 28;
		t.text = "鱼肉";
		t.textAlign = "center";
		t.verticalAlign = "middle";
		t.width = 332;
		t.y = 22;
		return t;
	};
	_proto._Image15_i = function () {
		var t = new eui.Image();
		t.name = "answer_my_result_img";
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "icon_png";
		t.verticalCenter = 0;
		t.visible = false;
		t.x = 20;
		t.y = -327;
		return t;
	};
	_proto._Image16_i = function () {
		var t = new eui.Image();
		t.name = "answer_enemy_result_img";
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "icon_png";
		t.verticalCenter = 0;
		t.visible = false;
		t.x = 385;
		t.y = -327;
		return t;
	};
	_proto.my_score_progress_i = function () {
		var t = new eui.ProgressBar();
		this.my_score_progress = t;
		t.direction = "btt";
		t.height = 538;
		t.skinName = "BattleScoreProgress";
		t.slideDuration = 800;
		t.value = 0;
		t.width = 22;
		t.x = 51.5;
		t.y = 438;
		return t;
	};
	_proto.nenmy_score_progress_i = function () {
		var t = new eui.ProgressBar();
		this.nenmy_score_progress = t;
		t.direction = "btt";
		t.enabled = false;
		t.height = 538;
		t.skinName = "BattleScoreProgressEnemy";
		t.slideDuration = 800;
		t.value = 0;
		t.width = 22;
		t.x = 566.5;
		t.y = 438;
		return t;
	};
	_proto.g_type_i = function () {
		var t = new eui.Group();
		this.g_type = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 50;
		t.width = 126;
		t.x = -200;
		t.y = 203.21;
		t.elementsContent = [this.small_type_bg_i(),this.question_type_img_i(),this.small_type_text_i()];
		return t;
	};
	_proto.small_type_bg_i = function () {
		var t = new eui.Image();
		this.small_type_bg = t;
		t.anchorOffsetX = 0;
		t.fillMode = "scale";
		t.scale9Grid = new egret.Rectangle(13,0,73,32);
		t.source = "bg_jpg";
		t.width = 125;
		t.y = 10;
		return t;
	};
	_proto.question_type_img_i = function () {
		var t = new eui.Image();
		this.question_type_img = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.fillMode = "scale";
		t.height = 50;
		t.source = "handle_png";
		t.width = 50;
		return t;
	};
	_proto.small_type_text_i = function () {
		var t = new eui.Label();
		this.small_type_text = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.fontFamily = "微软雅黑";
		t.height = 20;
		t.size = 20;
		t.text = "健康";
		t.textAlign = "center";
		t.textColor = 0xffffff;
		t.verticalAlign = "middle";
		t.width = 60;
		t.x = 52;
		t.y = 16;
		return t;
	};
	return NewFile123123;
})(eui.Skin);