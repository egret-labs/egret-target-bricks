BK.Script.loadlib("GameRes://script/core/io/FileManager.js");
BK.Script.log(1,1,"skeletonAnimationAsyc js done");

var fileManager = new BK.FileManager();

function skeletonAnimationAsyc(path, timescale,startCB,completeCB,endCB,callback){
	var pngPath = path + ".png";
	var atlasPath = path + ".atlas";
	var jsonPath = path + ".json";

	var progress = 0;
	fileManager.readFile(pngPath,function(buff){
		BK.Script.log(0,0,"skeletonAnimationAsyc Done");
		progress ++;
		if(progress == 3){
			var jsonRealPath = BK.Script.pathForResource(jsonPath);
			var atlasRealPath = BK.Script.pathForResource(atlasPath);
			var ani = new BK.SkeletonAnimation(atlasRealPath, jsonRealPath, timescale,startCB,completeCB,endCB );
			callback(ani);
		}
	});
	fileManager.readFile(atlasPath,function(buff){
		BK.Script.log(0,0,"skeletonAnimationAsyc Done");
		progress ++;
		if(progress == 3){
			var jsonRealPath = BK.Script.pathForResource(jsonPath);
			var atlasRealPath = BK.Script.pathForResource(atlasPath);
			var ani = new BK.SkeletonAnimation(atlasRealPath, jsonRealPath, timescale,startCB,completeCB,endCB );
			callback(ani);
		}
	});
	fileManager.readFile(jsonPath,function(buff){
		BK.Script.log(0,0,"skeletonAnimationAsyc Done");
		progress ++;
		if(progress == 3){
			var jsonRealPath = BK.Script.pathForResource(jsonPath);
			var atlasRealPath = BK.Script.pathForResource(atlasPath);
			var ani = new BK.SkeletonAnimation(atlasRealPath, jsonRealPath, timescale,startCB,completeCB,endCB );
			callback(ani);
		}
	});
}

function setAccessoryAsyc(ani,path,callback){
	var pngPath = path + ".png";
	var atlasPath = path + ".atlas";
	var jsonPath = path + ".json";

	var progress = 0;
	fileManager.readFile(pngPath,function(buff){
		BK.Script.log(0,0,"setAccessoryAsyc Done");
		progress ++;
		if(progress == 3){
			var jsonRealPath = BK.Script.pathForResource(jsonPath);
			var atlasRealPath = BK.Script.pathForResource(atlasPath);
			ani.setAccessory(jsonRealPath, atlasRealPath);
			callback();
		}
	});
	fileManager.readFile(atlasPath,function(buff){
		BK.Script.log(0,0,"setAccessoryAsyc Done");
		progress ++;
		if(progress == 3){
			var jsonRealPath = BK.Script.pathForResource(jsonPath);
			var atlasRealPath = BK.Script.pathForResource(atlasPath);
			ani.setAccessory(jsonRealPath, atlasRealPath);
			callback();
		}
	});
	fileManager.readFile(jsonPath,function(buff){
		BK.Script.log(0,0,"setAccessoryAsyc Done");
		progress ++;
		if(progress == 3){
			var jsonRealPath = BK.Script.pathForResource(jsonPath);
			var atlasRealPath = BK.Script.pathForResource(atlasPath);
			ani.setAccessory(jsonRealPath, atlasRealPath);
			callback();
		}
	});
}

function setAccessoryWithInfoAsyc(ani,path,content,callback){
	var pngPath = path + ".png";
	var atlasPath = path + ".atlas";
	var jsonPath = path + ".json";

	var progress = 0;
	fileManager.readFile(pngPath,function(buff){
		BK.Script.log(0,0,"setAccessoryWithInfo Done");
		progress ++;
		if(progress == 3){
			var jsonRealPath = BK.Script.pathForResource(jsonPath);
			var atlasRealPath = BK.Script.pathForResource(atlasPath);
			ani.setAccessoryWithInfo(jsonRealPath, atlasRealPath,content);
			callback();
		}
	});
	fileManager.readFile(atlasPath,function(buff){
		BK.Script.log(0,0,"setAccessoryWithInfo Done");
		progress ++;
		if(progress == 3){
			var jsonRealPath = BK.Script.pathForResource(jsonPath);
			var atlasRealPath = BK.Script.pathForResource(atlasPath);
			ani.setAccessoryWithInfo(jsonRealPath, atlasRealPath,content);
			callback();
		}
	});
	fileManager.readFile(jsonPath,function(buff){
		BK.Script.log(0,0,"setAccessoryWithInfo Done");
		progress ++;
		if(progress == 3){
			var jsonRealPath = BK.Script.pathForResource(jsonPath);
			var atlasRealPath = BK.Script.pathForResource(atlasPath);
			ani.setAccessoryWithInfo(jsonRealPath, atlasRealPath,content);
			callback();
		}
	});
}

function setAccessoryAnimationAsyc(ani,path,name,callback){
	var pngPath = path + ".png";
	var atlasPath = path + ".atlas";
	var jsonPath = path + ".json";

	var progress = 0;
	fileManager.readFile(pngPath,function(buff){
		BK.Script.log(0,0,"setAccessoryAnimationAsyc Done");
		progress ++;
		if(progress == 3){
			var jsonRealPath = BK.Script.pathForResource(jsonPath);
			var atlasRealPath = BK.Script.pathForResource(atlasPath);
			ani.setAccessoryAnimation(jsonRealPath, atlasRealPath,name);
			callback();
		}
	});
	fileManager.readFile(atlasPath,function(buff){
		BK.Script.log(0,0,"setAccessoryAnimationAsyc Done");
		progress ++;
		if(progress == 3){
			var jsonRealPath = BK.Script.pathForResource(jsonPath);
			var atlasRealPath = BK.Script.pathForResource(atlasPath);
			ani.setAccessoryAnimation(jsonRealPath, atlasRealPath,name);
			callback();
		}
	});
	fileManager.readFile(jsonPath,function(buff){
		BK.Script.log(0,0,"setAccessoryAnimationAsyc Done");
		progress ++;
		if(progress == 3){
			var jsonRealPath = BK.Script.pathForResource(jsonPath);
			var atlasRealPath = BK.Script.pathForResource(atlasPath);
			ani.setAccessoryAnimation(jsonRealPath, atlasRealPath,name);
			callback();
		}
	});
}

BK.Director.ticker.add(function(ts,duration){
	fileManager.update();
});
