// GameRes://script/demo/webgl/core/texture.js

function Texture(director, path) {
    this.director = director;
    this.gl = director.gl;

    if (path) {
        this.init_with_path(path);
    }
    else {
        this.texture = null;
        this.width = 0;
        this.height = 0;
    }
}

Texture.prototype = {
    // constructor
    constructor: Texture,

    init_with_path: function(path) {
        this.path = path;
        var gl = this.gl;

        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        var level = 0;
        var internalFormat = gl.RGBA;
        var border = 0;
        var srcFormat = gl.RGBA;
        var srcType = gl.UNSIGNED_BYTE;

        var image = BK.Image.loadImage(path, 6);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        this.width = image.width;
        this.height = image.height;
    },

    init_with_text: function(text) {
    },
};

