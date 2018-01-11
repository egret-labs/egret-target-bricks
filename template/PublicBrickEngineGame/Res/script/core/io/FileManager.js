
BK.Script.log(0,0,"filemanage.js is loaded");
BK.FileManager = function(){
	this.fileArray = [];
	this.readFile = function(path,func){
		var nobFile = new BK.FileUtil(path);
		nobFile.openFile();
		var fileObj = new Object();
		fileObj.path = path;
		fileObj.status = 0;
		fileObj.readCallBack = func;
		fileObj.file = nobFile;
		this.fileArray.push(fileObj);
		return fileObj;
	}

	this.update = function(){
		for(var i=0;i<this.fileArray.length;i++){
			if(this.fileArray[i].status == 1){
				continue;
			}
			var ret = this.fileArray[i].file.update();
			if(ret == 1 || ret == 3){
				var buffer = this.fileArray[i].file.readFileAsync();
				if(buffer){
					this.fileArray[i].readCallBack(buffer);
					this.fileArray[i].data = buffer;
					this.fileArray[i].status = 1;
					this.fileArray[i].file.close();
				}
			}
		}
	}

	this.getFileData = function(path){
		for(var i=0;i<this.fileArray.length;i++){
			if(this.fileArray[i].path == path && this.fileArray[i].status == 1){
				return this.fileArray[i].data;
			}
		}

	}

	this.closeFile = function(fileObj){
		for(var i=his.fileArray.length;i>0;i--){
			if(this.fileArray[i].path == file.path){
				this.fileArray.splice(i,1);
			}
		}
		fileObj.file.removeFromCache();
	}
}