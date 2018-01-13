
BK.Script.log(0,0,"Load ranklist.js");

var TexturePath = {
	RankMainBack :  'GameRes://resource/texture/ranklist/rl_back_main.png',
	NewBand :  'GameRes://resource/texture/ranklist/rl_new.png',

	CloseBtnNormal :  'GameRes://resource/texture/ranklist/rl_btn_close_normal.png',
	CloseBtnPress :  'GameRes://resource/texture/ranklist/rl_btn_close_press.png',

	ShareBtnNormal :  'GameRes://resource/texture/ranklist/rl_btn_share_normal.png',
	ShareBtnPress :  'GameRes://resource/texture/ranklist/rl_btn_share_press.png',
	rankMedal : [
        'GameRes://resource/texture/ranklist/num/rankicon/medal/1.png',
        'GameRes://resource/texture/ranklist/num/rankicon/medal/2.png',
        'GameRes://resource/texture/ranklist/num/rankicon/medal/3.png',
        'GameRes://resource/texture/ranklist/num/rankicon/medal/4','png'
	],
	timeNum : [
        'GameRes://resource/texture/ranklist/num/time/0.png',
        'GameRes://resource/texture/ranklist/num/time/1.png',
        'GameRes://resource/texture/ranklist/num/time/2.png',
        'GameRes://resource/texture/ranklist/num/time/3.png',
        'GameRes://resource/texture/ranklist/num/time/4.png',
        'GameRes://resource/texture/ranklist/num/time/5.png',
        'GameRes://resource/texture/ranklist/num/time/6.png',
        'GameRes://resource/texture/ranklist/num/time/7.png',
        'GameRes://resource/texture/ranklist/num/time/8.png',
        'GameRes://resource/texture/ranklist/num/time/9.png',
    ],
    timeNumPoint :  'GameRes://resource/texture/ranklist/num/time/point.png',
	timeNumSecond :  'GameRes://resource/texture/ranklist/num/time/second.png',

	bonusNum : {	
		minus : [
            'GameRes://resource/texture/ranklist/num/bonus/unfinish/0.png',
            'GameRes://resource/texture/ranklist/num/bonus/unfinish/1.png',
            'GameRes://resource/texture/ranklist/num/bonus/unfinish/2.png',
            'GameRes://resource/texture/ranklist/num/bonus/unfinish/3.png',
            'GameRes://resource/texture/ranklist/num/bonus/unfinish/4.png',
            'GameRes://resource/texture/ranklist/num/bonus/unfinish/5.png',
            'GameRes://resource/texture/ranklist/num/bonus/unfinish/6.png',
            'GameRes://resource/texture/ranklist/num/bonus/unfinish/7.png',
            'GameRes://resource/texture/ranklist/num/bonus/unfinish/8.png',
            'GameRes://resource/texture/ranklist/num/bonus/unfinish/9.png',		
		],
        minusMinus :'GameRes://resource/texture/ranklist/num/bonus/unfinish/minus.png',
		plus  : [
            'GameRes://resource/texture/ranklist/num/bonus/finish/0.png',
            'GameRes://resource/texture/ranklist/num/bonus/finish/1.png',
            'GameRes://resource/texture/ranklist/num/bonus/finish/2.png',
            'GameRes://resource/texture/ranklist/num/bonus/finish/3.png',
            'GameRes://resource/texture/ranklist/num/bonus/finish/4.png',
            'GameRes://resource/texture/ranklist/num/bonus/finish/5.png',
            'GameRes://resource/texture/ranklist/num/bonus/finish/6.png',
            'GameRes://resource/texture/ranklist/num/bonus/finish/7.png',
            'GameRes://resource/texture/ranklist/num/bonus/finish/8.png',
            'GameRes://resource/texture/ranklist/num/bonus/finish/9.png',		
		],
        plusPlus :'GameRes://resource/texture/ranklist/num/bonus/finish/plus.png'
	},
	// --我的
	0 : {
		unfinish   : 'GameRes://resource/texture/ranklist/rl_back_unfinish.png',
		cellback   : 'GameRes://resource/texture/ranklist/rl_back_my_cell.png',
	},
	// --- 其他人
	1 : {
		unfinish   : 'GameRes://resource/texture/ranklist/rl_back_unfinish.png',
		cellback   : 'GameRes://resource/texture/ranklist/rl_back_other_cell.png',
	},
	// --- 未完成的人
	2  : {
		unfinish   : 'GameRes://resource/texture/ranklist/rl_back_unfinish.png',
		cellback   : 'GameRes://resource/texture/ranklist/rl_back_other_cell.png',
	},
	// --- 游戏中
	3  : {
		unfinish   : 'GameRes://resource/texture/ranklist/rl_back_other_playing.png',
		cellback   : 'GameRes://resource/texture/ranklist/rl_back_other_cell.png',
	},
}

function getIntPart(x)
{
    if (x <= 0){
	   return Math.ceil(x)
	}
	if( Math.ceil(x) - x  < 0.000001 ){

	   x = Math.ceil(x)
    }
	else{
	   x = Math.ceil(x) - 1
	}
    BK.Script.log('numTable:'+x.toString())
	return x
}

function numTable(num)
{
    num = Math.abs(num)
	if (num == 0){ 
		return [0];
    }
    else{
		var numTable = [];
		var tmp = num 
		while (tmp >=1){
			var t =(tmp%10)
            numTable.push(getIntPart(t));
			tmp = tmp / 10;
		}
		return numTable
	}
}

function RankCell(idx,data,width,height)
{
    this.designWidth  = 581
    this.designHeight = 113

	var belongT = data.belongType
	var nick = data.nick
	var rank = data.rank
	var time = data.time
	var bonus= data.bonus
	var path = TexturePath[belongT].cellback
	var showNew = false

	if (data.showNew) {
		showNew = data.showNew
	}


	this.width = width
	this.height = height

	 
     var backTex  =new BK.Texture(path);
    this.navtiveSprite = new BK.Sprite(width,height,backTex,0,1,1,1);
    this.navtiveSprite.children = new Array();
    
    
    BK.Script.log(0,0,path);
    
    // this.addRankIcon(rank)

	// ----------昵称----------
    // this:addNick(nick)
	
	// ----------时间----------
	// this:addTime(belongT,time)

	// ----------积分----------
	// this:addBouns(bonus)


	// --新
	if (showNew == true){
	 	// this:addNewBand()
    }


    // --------- 名次 ---------
    // this.addRankIcon = function(rank)
    {
        var icon_w = this.width  * 58/this.designWidth
        var icon_h = this.height * 79/this.designHeight
        var icon_x = this.width  * 24 /this.designWidth
        var icon_y = this.height * 18/this.designHeight

        var rankIconpath =TexturePath.rankMedal[rank]
        var rankIconTex  =new BK.Texture(rankIconpath);
        this.rankIcon = new BK.Sprite(icon_w,icon_h,rankIconTex,0,1,1,1);
        this.rankIcon.position = { x:icon_x,y:icon_y}
        this.navtiveSprite.children.push(this.rankIcon)
        this.rankIcon.parent  = this.navtiveSprite;
    }


	// ----------昵称----------

   
	var  label_w = this.width * 240 / this.designWidth
	var  label_h = this.height* 44  / this.designHeight
	var  label_x = this.width * 100  / this.designWidth 
	var  label_y = this.height* 35   / this.designHeight
	var  style = {
			"fontSize":18,
			"textColor" : 0xFFFF0000,
			"width":label_w,
			"height":label_h,
			"textAlign":0,
		}
	this.nickLabel =new BK.Text(style,nick)
	this.nickLabel.position = {x:label_x,y:label_y};
    this.navtiveSprite.children.push(this.nickLabel)
    this.nickLabel.parent  = this.navtiveSprite;


	// ----------时间----------

    var me = 0
	var other = 1
	var unfinish = 2
	var playing  = 3

	if ((belongT == unfinish) ||
	   (belongT == playing) || 
	   (belongT == me && time>=999)
    )
    {

   		var unfinish_h = this.height * 43 / this.designHeight
		var unfinish_w = this.width * 115 /  this.designWidth
		var unfinish_x = this.width * 345 / this.designWidth
		var unfinish_y = this.height * 34 / this.designHeight
		var unfinish_path = TexturePath[belongT].unfinish

        var unfinishTex  =new BK.Texture(unfinish_path);
		var unfinish_sprite = new BK.Sprite(unfinish_w,unfinish_h,unfinishTex,0,1,1,1)
		unfinish_sprite.position = { x:unfinish_x, y:unfinish_y };
		this.navtiveSprite.children.push(unfinish_sprite)
        unfinish_sprite.parent = this.navtiveSprite;
    }
	else{
	// 	-- ‘秒’ 字
		var time_sec_h = this.height * 21 / this.designHeight
		var time_sec_w = this.width  * 15 / this.designWidth
		var time_sec_x = this.width  * 434/ this.designWidth
		var time_sec_y = this.height * 43 / this.designHeight
	// 	-- 0-9 阿拉伯数字
		var time_h = this.height * 27 / this.designHeight
		var time_w = this.width  * 22 / this.designWidth
		var time_x = time_sec_x
		var time_y = this.height * 43 / this.designHeight
	// 	-- ‘.’
		var point_w = this.width  * 8 / this.designWidth

		var num_second_path = TexturePath.timeNumSecond
        var num_second_pathTex  =new BK.Texture(num_second_path);
		var num_second = new BK.Sprite(time_sec_w,time_sec_h,num_second_pathTex,0,1,1,1)
	    num_second.position = {x:time_sec_x,y:time_sec_y}
	    this.navtiveSprite.children.push(num_second);
        num_second.parent = this.navtiveSprite;

        if(time>999){
            time = 999;
        }
	    // time = time > 999 and 999 or time --最大显示999 秒

		var integerTable = numTable(time)
	// 	var integer,decimal = math.modf(time, 1) 
	// 	var decimalTabele = this:numTable(decimal * 10) --只显示一位小数位


	// 	for i,v in ipairs(decimalTabele) do
	// 	    var num_path = TexturePath.timeNum[v]
	// 	    time_x = time_x - time_w
	// 		var num_sprite = Sprite.new(time_w,time_h,num_path,false,true,true,true)
	// 		num_sprite:setPosition(time_x,time_y,0)
	// 		this.navtiveSprite:addNode(num_sprite)
	// 	end

	// 	time_x = time_x - point_w
	// 	var point_sprite = Sprite.new(point_w,point_w,TexturePath.timeNum.point,false,true,true,true)
	// 	point_sprite:setPosition(time_x,time_y,0)
	// 	this.navtiveSprite:addNode(point_sprite)
		
        for (var i = 0; i < integerTable.length; i++) {
            var v = integerTable[i];
            
		    var num_path = TexturePath.timeNum[v]
		    time_x = time_x - time_w

            BK.Script.log("integerTable : "+ v.toString() + " num_path: " + num_path + "  i:"+i);
            var num_Tex  =new BK.Texture(num_path);
			var num_sprite = new BK.Sprite(time_w,time_h,num_Tex,0,1,1,1)
			num_sprite.position = { x:time_x,y:time_y};
			this.navtiveSprite.children.push(num_sprite)
            num_sprite.parent = this.navtiveSprite;
        }
	}
}

function RankListView(x,y,width,height,path,canShowShare,closeHandler,shareHandler)
{
    //  this.rank = rank
    //  this.belongType = belongType
     this.data = {}

     this.height = height
     this.width  = width
     this.designWidth = 652
     this.designHeight = 759

    var flipU  =false
	var flipV  =true
	var stretchX = true
	var stretchY = true

    var backTex  =new BK.Texture(path);   
     this.navtiveSprite = new BK.Sprite(width,height,backTex,flipU,flipV,stretchX,stretchY)
     this.navtiveSprite.children = new Array();
     this.navtiveSprite.position= {x:x,y:y,z:0};
  

	var close_y = height * -36 / this.designHeight
	var close_w = width  * 213 / this.designWidth
	var close_h = height * 82  / this.designHeight
	var close_x = (width  - close_w)/2.0
	

    this.updateData = function ( data )
    {

        // --------cell -------
        var cell_h = this.height * 113 / this.designHeight
        var cell_w = this.width  * 581 / this.designWidth
        var cell_x = this.width  * 36  / this.designWidth
        var cell_y = this.height * 449 / this.designHeight

	    var cell_space = this.height * 11 / this.designHeight

        if(data){
            this.data = data;
            for (var i = 0; i < data.length; i++) {
                var v = data[i];

	            BK.Script.log(0,0,'updateData')
                var  rankCell = new RankCell(i,v,cell_w,cell_h);
                rankCell.navtiveSprite.position = { x:cell_x,y:cell_y };
                rankCell.navtiveSprite.name = 'rankcell_' + i.toString();
                this.navtiveSprite.children.push(rankCell.navtiveSprite);
                rankCell.navtiveSprite.parent = this.navtiveSprite;

			    cell_y = cell_y - cell_h - cell_space
            }
        }
    }

	// if Button == nil then
	// 	Script.loadlib(Script.pathForResource('GameRes://script/control','lua'))
	// end


	// -------分享---------
	// if canShowShare == true then

 	// 	close_x = width  * 84 / this.designWidth

	// 	var share_x = width  * 353 / this.designWidth
	// 	var share_y = height * -36  / this.designHeight
	// 	var share_w = width  * 213 / this.designWidth
	// 	var share_h = height * 82  / this.designHeight

	// 	var share_btn = Button:new(ShareBtnID, 'share_btn', this.navtiveSprite)
	// 	share_btn:setNormalTexture(TexturePath.ShareBtnNormal)
	// 	share_btn:setPressedTexture(TexturePath.ShareBtnPress)
		
	// 	share_btn:setPosition(share_x,share_y,0)
	// 	share_btn:setSize(share_w,share_h)

	// 	share_btn:addEvent(UI_NODE_ENENT_TOUCH_UP, shareHandler)
	
	// end

	// -------确定---------

	// var close_btn = Button:new(ConfirmBtnID, 'close_btn', this.navtiveSprite)
	// close_btn:setNormalTexture(TexturePath.CloseBtnNormal)
	// close_btn:setPressedTexture(TexturePath.CloseBtnPress)
	
	// close_btn:setPosition(close_x,close_y,0)
	// close_btn:setSize(close_w,close_h)

	// close_btn:addEvent(UI_NODE_ENENT_TOUCH_UP, closeHandler)

}

function addRankListView(data,x,y,width,height,canShowShare,closeHandler,shareHandler )
{
	var path = TexturePath.RankMainBack
	var main = new RankListView(x,y,width,height,path,canShowShare,closeHandler,shareHandler)
  
	main.updateData(data)
	return main.navtiveSprite
}



// var deviceRenderSize = BK.Director.renderSize;

// var devScreenX = deviceRenderSize.width;
// var devScreenY = deviceRenderSize.height;

// var designDeviceWidth = 750;
// var designDeviceHeight = 1334;

// var designWidth = 652;
// var designHeight = 759;

// var width  = devScreenX * designWidth / designDeviceWidth //--宽
// var height = width * designHeight / designWidth //--高
// var x = (devScreenX - width)/2.0
// var y = (devScreenY - height)/2.0

// var data = [
//     {nick:"nick",rank:0,time:78.3,bouns:23,belongType:1 },
//     {nick:"nick",rank:1,time:"time",bouns:23,belongType:2 },
//     {nick:"nick",rank:2,time:"time",bouns:23,belongType:3 },
// ];

      

// var rankListView =  addRankListView(data,x,y,width,height,null,null,null );
// BK.Director.root.addChild(rankListView);

// var testTicker = new BK.Ticker();
// testTicker.interval = 1/60;
// testTicker.setTickerCallBack(function(ts,duration)
//                     {
//                     BK.Render.clear();
                    
//                     BK.Render.treeRender( BK.Director.root,duration);
                    
//                     BK.Render.commit();  
//                  });
