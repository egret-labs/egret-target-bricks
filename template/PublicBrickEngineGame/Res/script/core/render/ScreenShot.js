const TYPE_PNG = 0;
const TYPE_JPG = 1;

function ScreenShot() {
    this.origin = { x: 0, y: 0 };
    this.size = { width: 0, height: 0 };
}

ScreenShot.prototype.shotToFile = function (type, name) {// 截图并保存到file，返回file路径
    // x,y的边界判断
    if (this.origin.x == void 0 || this.origin.x < 0
         || this.origin.x > BK.Director.screenPixelSize.width) {
        this.origin.x = 0;
    }
    if (this.origin.y == void 0 || this.origin.y < 0
         || this.origin.y > BK.Director.screenPixelSize.height) {
        this.origin.y = 0;
    }
    // w,h的边界判断
    if (this.size.width == void 0 || this.size.width < 0 || this.size.width > BK.Director.screenPixelSize.width - this.origin.x) {
        this.origin.x = 0;
        this.size.width = BK.Director.screenPixelSize.width;
    }
    if (this.size.height == void 0 || this.size.height < 0 || this.size.height > BK.Director.screenPixelSize.height - this.origin.y) {
        this.origin.y = 0;
        this.size.height = BK.Director.screenPixelSize.height;
    }
    // 确定文件类型
    var path;
    if (type == TYPE_JPG) {
        path = "GameSandBox://" + name + ".jpg";
    } else if (type == TYPE_PNG) {
        path = "GameSandBox://" + name + ".png";
    }
    var shot = new BK.RenderTexture(BK.Director.screenPixelSize.width, BK.Director.screenPixelSize.height);
    BK.Render.renderToTexture(BK.Director.root, shot);
    shot.writeToDiskWithXY(path, this.origin.x, this.origin.y, this.size.width, this.size.height);
    BK.Script.log(1, 1, "ScreenShot: 截图并保存到file");
    return path;
};

ScreenShot.prototype.shotToBuff = function () {// 截图并保存到buffer，返回buffer
    // x,y的边界判断
    if (this.origin.x == void 0 || this.origin.x < 0
        || this.origin.x > BK.Director.screenPixelSize.width) {
        this.origin.x = 0;
    }
    if (this.origin.y == void 0 || this.origin.y < 0
         || this.origin.y > BK.Director.screenPixelSize.height) {
        this.origin.y = 0;
    }
    // w,h的边界判断
    if (this.size.width == void 0 || this.size.width < 0
         || this.size.width > BK.Director.screenPixelSize.width - this.origin.x) {
        this.origin.x = 0;
        this.size.width = BK.Director.screenPixelSize.width;
    }
    if (this.size.height == void 0 || this.size.height < 0
         || this.size.height > BK.Director.screenPixelSize.height - this.origin.y) {
        this.origin.y = 0;
        this.size.height = BK.Director.screenPixelSize.height;
    }
    var shot = new BK.RenderTexture(BK.Director.screenPixelSize.width, BK.Director.screenPixelSize.height);
    BK.Render.renderToTexture(BK.Director.root, shot);
    var buff = shot.readPixels(this.origin.x, this.origin.y, this.size.width, this.size.height);
    BK.Script.log(1, 1, "ScreenShot: 截图并保存到buffer");
    return buff;
};
