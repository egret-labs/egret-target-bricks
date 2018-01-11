/**
 * Created by zmliu on 14-5-11.
 */
var starlingswf;
(function (starlingswf) {
    /**
     * swf资源管理器
     * */
    var SwfAssetManager = (function () {
        function SwfAssetManager() {
            this._sheets = {};
            this._textures = {};
        }
        SwfAssetManager.prototype.addSpriteSheet = function (name, spriteSheep) {
            // egret.console_log("加入sheet: ", name);
            this._sheets[name] = spriteSheep;
        };
        SwfAssetManager.prototype.addTexture = function (name, texture) {
            this._textures[name] = texture;
        };
        SwfAssetManager.prototype.createBitmap = function (name) {
            //BK.error
            // var texture: egret.Texture = this.getTexture(name);
            // if (texture == null)
            //     return null;
            // var bitmap: egret.Bitmap = new egret.Bitmap();
            // bitmap.texture = texture;
            // return bitmap;
            //新写法
            var bitmap = null;
            var sheet;
            for (var key in this._sheets) {
                sheet = this._sheets[key];
                bitmap = sheet.getBitmap(name);
                if (bitmap.isSheets) {
                    break;
                }
            }
            return bitmap;
        };
        return SwfAssetManager;
    }());
    starlingswf.SwfAssetManager = SwfAssetManager;
})(starlingswf || (starlingswf = {}));
