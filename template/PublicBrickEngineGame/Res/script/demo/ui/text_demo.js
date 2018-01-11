
BK.Script.loadlib('GameRes://script/core/ui/text.js');

function createOld() {
	var style = {
	    "fontSize":20,
	    "textColor" : 0xFFFF0000,
	    "maxWidth" : 200,
	    "maxHeight": 400,
	    "width":100,
	    "height":200,
	    "textAlign":0,
	    "bold":1,
	    "italic":1,
	    "strokeColor":0xFF000000,
	    "strokeSize":5,
	    "shadowRadius":5,
	    "shadowDx":10,
	    "shadowDy":10,
	    "shadowColor":0xFFFF0000
	}
	var fps = BK.Director.fps;

	var content = "Rich Old";
	var txt = new BK.Text(style, content);
	txt.position = {x:200,y:700}
	BK.Director.root.addChild(txt);
    
    BK.Script.log(0,0,"old content :"+txt.content);
}

function createNew()
{
	var content = "Rich New";
	var txt = new BK.Text(undefined,content);
	BK.Director.root.addChild(txt);


   txt.fontSize = txt.fontSize;
   txt.fontColor=txt.fontColor;
   txt.maxSize = txt.maxSize
   txt.size = txt.size
//
    txt.bold = txt.bold;
   txt.italic = txt.italic;
   txt.horizontalAlign = txt.horizontalAlign;

   txt.strokeColor = txt.strokeColor;
   txt.strokeSize = txt.strokeSize;

   txt.shadowColor = txt.shadowColor;
   txt.shadowRadius = txt.shadowRadius;
   txt.shadowOffset = txt.shadowOffset;
    
    BK.Script.log(0,0,"new content :"+txt.content);
 var a =	txt.width
}

createOld()
 createNew();

BK.Script.log(0,0,"Load Text demo Completed!");


