// GameRes://script/demo/webgl/scene/sprite.js
BK.Script.loadlib('GameRes://script/demo/webgl/core/director.js');
BK.Script.loadlib('GameRes://script/demo/webgl/scene/node.js');

// 
BK_SPRITE_UV_ROTATE_NONE       = 0;
BK_SPRITE_UV_ROTATE_CW_90      = 1;
BK_SPRITE_UV_ROTATE_CW_180     = 2;
BK_SPRITE_UV_ROTATE_CW_270     = 3;
BK_SPRITE_UV_ROTATE_CCW_90     = 4;
BK_SPRITE_UV_ROTATE_CCW_180    = 5;
BK_SPRITE_UV_ROTATE_CCW_270    = 6;

BK_BLEND_MODE_ADDITIVE          = 0; // srcColor + dstColor
BK_BLEND_MODE_MULTIPLY          = 1; // srcColor + (1 - srcAlpha) * dstColor
BK_BLEND_MODE_INTERPOLATIVE     = 2; // srcAlpha * srcColor + (1 - srcAlpha) * dstColor
BK_BLEND_MODE_SCREEN            = 3;

//////////////////////////////////
// 0 ------ 1
// |        |
// |        |
// 3 ------ 2
//////////////////////////////////

function Sprite(width, height, tex, flip_u, flip_v, stretch_x, stretch_y) {
    Node.call(this);

    // 贴图以及贴图的大小
    this.setTexture(tex);

    this.uv_rotate = BK_SPRITE_UV_ROTATE_NONE;
    this.origin_tex_uv = [
        { 'x': 0.0, 'y': 0.0 },
        { 'x': 1.0, 'y': 0.0 },
        { 'x': 1.0, 'y': 1.0 },
        { 'x': 0.0, 'y': 1.0 }
    ];

    // 
    this.flip_u = flip_u || false;
    this.flip_v = flip_v || false;
    this.stretch_x = stretch_x || false;
    this.stretch_y = stretch_y || false;

    // 
    this.color = { 'r': 1.0, 'g': 1.0, 'b': 1.0, 'a': 1.0 };
    this.blendMode = BK_BLEND_MODE_MULTIPLY;
    this.shader = BK.director_instance.get_default_shader();

    ///////////////////////////////////////////////////////////////////////////////////
    this.content_size = new Vector2(width, height)
    this.half_w = this.content_size.x * 0.5;
    this.half_h = this.content_size.y * 0.5;

    // vertices: 4
    //      position: 3 floats
    //      color: 4 floats
    //      tex uv: 2 floats
    this.vertices = [
        //   x           y        z    r    g    b    a    u    v
        -this.half_w,  this.half_h, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0,
         this.half_w,  this.half_h, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0,
         this.half_w, -this.half_h, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        -this.half_w, -this.half_h, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0
    ];

    // 
    this.dirty(DIRTY_UV);
};

Sprite.prototype = Object.create(Node.prototype);

// texture
Sprite.prototype.setTexture = function(tex) {
    this.tex = tex;
    if (tex) {
        this.tex_width = tex.width;
        this.tex_height = tex.height;
    }
    else {
        this.tex_width = 0.0;
        this.tex_height = 0.0;
    }
};

Sprite.prototype.getTexture = function() {
    return this.tex;
};

Sprite.prototype.adjustTexturePosition = function(x, y, width, height, rotate) {
    if (rotate) {
        this.origin_tex_uv[0].x = (x + height) / this.tex_width;
        this.origin_tex_uv[0].y = (y + width) / this.tex_height;

        this.origin_tex_uv[1].x = (x + height) / this.tex_width;
        this.origin_tex_uv[1].y = y / this.tex_height;

        this.origin_tex_uv[2].x = x / this.tex_width;
        this.origin_tex_uv[2].y = y / this.tex_height;

        this.origin_tex_uv[3].x = x / this.tex_width;
        this.origin_tex_uv[3].y = (y + width) / this.tex_height;
    }
    else {
        this.origin_tex_uv[0].x = x / this.tex_width;
        this.origin_tex_uv[0].y = y / this.tex_height;
                               
        this.origin_tex_uv[1].x = (x + width) / this.tex_width;
        this.origin_tex_uv[1].y = y / this.tex_height;
                               
        this.origin_tex_uv[2].x = (x + width) / this.tex_width;
        this.origin_tex_uv[2].y = (y + height) / this.tex_height;
                               
        this.origin_tex_uv[3].x = x / this.tex_width;
        this.origin_tex_uv[3].y = (y + height) / this.tex_height;
    }

    this.dirty(DIRTY_UV);
};

// width
Sprite.prototype.setWidth = function(width) {
    this.content_size.x = width;
    this.half_w = width * 0.5;

    this.dirty(DIRTY_UV | DIRTY_CONTENT_SIZE);
};

Sprite.prototype.getWidth = function() {
    return this.content_size.x;
};

// height
Sprite.prototype.setHeight = function(height) {
    this.content_size.y = height;
    this.half_h = height * 0.5;

    this.dirty(DIRTY_UV | DIRTY_CONTENT_SIZE);
};

Sprite.prototype.getHeight = function() {
    return this.content_size.y;
};

// size
Sprite.prototype.getSize = function() {
    return this.content_size;
};

Sprite.prototype.setSize = function(v2) {
    this.content_size = v2;
    this.half_w = v2.x * 0.5;
    this.half_h = v2.y * 0.5;

    this.dirty(DIRTY_UV | DIRTY_CONTENT_SIZE);
};

// flip u
Sprite.prototype.setFlipU = function(flip) {
    this.flip_u = flip;

    this.dirty(DIRTY_UV);
};

Sprite.prototype.getFlipU = function() {
    return this.flip_u;
};

// flip v
Sprite.prototype.setFlipV = function(flip) {
    this.flip_v = flip;

    this.dirty(DIRTY_UV);
};

Sprite.prototype.getFlipV = function() {
    return this.flip_v;
};

// stretch x
Sprite.prototype.setStretchX = function(stretch) {
    this.stretch_x = stretch;

    this.dirty(DIRTY_UV);
};

Sprite.prototype.getStretchX = function() {
    return this.stretch_x;
};

// stretch y
Sprite.prototype.setStretchY = function(stretch) {
    this.stretch_y = stretch;

    this.dirty(DIRTY_UV);
};

Sprite.prototype.getStretchY = function() {
    return this.stretch_y;
};

// color
Sprite.prototype.setColor = function(color) {
    this.color = color;

    this.dirty(DIRTY_COLOR);
};

Sprite.prototype.getColor = function() {
    return this.color;
};

Sprite.prototype.setOpacity = function(opacity) {
    this.color.a = opacity;
};

Sprite.prototype.getOpacity = function() {
    return this.color.a;
};

Sprite.prototype.getInheritOpacity = function() {
    if (this.parentNode) {
        var opacity = Sprite.getInheritOpacity.call(this.parentNode);
        return this.color.a * opacity;
    }
    else {
        return this.color.a;
    }
};

// blend mode
Sprite.prototype.setBlendMode = function(blendMode) {
    this.blendMode = blendMode;
};

Sprite.prototype.getBlendMode = function() {
    return this.blendMode;
};

// shader
Sprite.prototype.setShader = function(shader) {
    this.shader = shader;
};

Sprite.prototype.getShader = function() {
    return this.shader;
};

// update
Sprite.prototype.update = function(dt, need_update_flag) {
    // update uv
    if (this.dirty_flags & DIRTY_UV) {
        var scalar_u = 1.0;
        if (!this.stretch_x && this.content_size.x != 0.0 && this.tex_width != 0.0) {
            scalar_u = this.content_size.x / this.tex_width;
        }

        var scalar_v = 1.0;
        if (!this.stretch_y && this.content_size.y != 0.0 && this.tex_height != 0.0) {
            scalar_v = this.content_size.y / this.tex_height;
        }

        var tex_uvs = this.origin_tex_uv.slice(0);

        // uv flip
        if (this.flip_u) {
            tex_uvs = [tex_uvs[1], tex_uvs[0], tex_uvs[3], tex_uvs[2]];
        }

        if (this.flip_v) {
            tex_uvs = [tex_uvs[3], tex_uvs[2], tex_uvs[1], tex_uvs[0]];
        }

        // uv rotate
        if (this.uv_rotate == BK_SPRITE_UV_ROTATE_CW_90 || this.uv_rotate == BK_SPRITE_UV_ROTATE_CCW_270) {
            tex_uvs = [tex_uvs[3], tex_uvs[0], tex_uvs[1], tex_uvs[2]];
        }
        else if(this.uv_rotate == BK_SPRITE_UV_ROTATE_CW_270 || this.uv_rotate == BK_SPRITE_UV_ROTATE_CW_270) {
            tex_uvs = [tex_uvs[1], tex_uvs[2], tex_uvs[3], tex_uvs[0]];
        }
        else if(this.uv_rotate == BK_SPRITE_UV_ROTATE_CW_180 || this.uv_rotate == BK_SPRITE_UV_ROTATE_CCW_180) {
            tex_uvs = [tex_uvs[2], tex_uvs[3], tex_uvs[0], tex_uvs[1]];
        }

        // 
        this.vertices[ 7] = scalar_u * tex_uvs[0].x;
        this.vertices[ 8] = scalar_v * tex_uvs[0].y;
        this.vertices[16] = scalar_u * tex_uvs[1].x;
        this.vertices[17] = scalar_v * tex_uvs[1].y;
        this.vertices[25] = scalar_u * tex_uvs[2].x;
        this.vertices[26] = scalar_v * tex_uvs[2].y;
        this.vertices[34] = scalar_u * tex_uvs[3].x;
        this.vertices[35] = scalar_v * tex_uvs[3].y;

        // 
        this.dirty_flags &= ~(DIRTY_UV);
    }

    // update vertex
    if (need_update_flag || this.dirty_flags & (DIRTY_CONTENT_SIZE | DIRTY_WORLD_MATRIX)) {
        // world transform
        var world_matrix = this.getWorldMatrix();

        // world_matrix.multiplyXYVertex(-this.half_w, this.half_h, this.vertices, 0, 1);
        // world_matrix.multiplyXYVertex(this.half_w, this.half_h, this.vertices, 9, 10);
        // world_matrix.multiplyXYVertex(this.half_w, -this.half_h, this.vertices, 18, 19);
        // world_matrix.multiplyXYVertex(-this.half_w, -this.half_h, this.vertices, 27, 28);

        var w_1 = this.half_w * world_matrix.data[0];
        var w_2 = this.half_w * world_matrix.data[1];
        var h_1 = this.half_h * world_matrix.data[4];
        var h_2 = this.half_h * world_matrix.data[5];

        this.vertices[ 0] = -w_1 + h_1 + world_matrix.data[12];
        this.vertices[ 1] = -w_2 + h_2 + world_matrix.data[13];

        this.vertices[ 9] = w_1 + h_1 + world_matrix.data[12];
        this.vertices[10] = w_2 + h_2 + world_matrix.data[13];

        this.vertices[18] = w_1 -h_1 + world_matrix.data[12];
        this.vertices[19] = w_2 -h_2 + world_matrix.data[13];

        this.vertices[27] = -w_1 -h_1 + world_matrix.data[12];
        this.vertices[28] = -w_2 -h_2 + world_matrix.data[13];

        // var lt = world_matrix.multiplyXYVertex(-this.half_w, this.half_h, this.vertices, 0, 1);
        // this.vertices[ 0] = lt[0];
        // this.vertices[ 1] = lt[1];
        // //this.vertices[ 2] = lt[2];

        // var rt = world_matrix.multiplyXY(this.half_w, this.half_h);
        // this.vertices[ 9] = rt[0];
        // this.vertices[10] = rt[1];
        // //this.vertices[11] = rt[2];

        // var rb = world_matrix.multiplyXY(this.half_w, -this.half_h);
        // this.vertices[18] = rb[0];
        // this.vertices[19] = rb[1];
        // //this.vertices[20] = rb[2];

        // var lb = world_matrix.multiplyXY(-this.half_w, -this.half_h);
        // this.vertices[27] = lb[0];
        // this.vertices[28] = lb[1];
        // //this.vertices[29] = lb[2];

        // 
        this.dirty_flags &= ~(DIRTY_CONTENT_SIZE);
    }

    // update color
    if (this.dirty_flags & DIRTY_COLOR) {
        var opacity = this.getInheritOpacity();
        var r = this.color.r * opacity;
        var g = this.color.g * opacity;
        var b = this.color.b * opacity;

        this.vertices[ 3] = r;
        this.vertices[ 4] = g;
        this.vertices[ 5] = b;
        this.vertices[ 6] = a;

        this.vertices[12] = r;
        this.vertices[13] = g;
        this.vertices[14] = b;
        this.vertices[15] = a;

        this.vertices[21] = r;
        this.vertices[22] = g;
        this.vertices[23] = b;
        this.vertices[24] = a;

        this.vertices[30] = r;
        this.vertices[31] = g;
        this.vertices[32] = b;
        this.vertices[33] = a;

        // 
        this.dirty_flags &= ~(DIRTY_COLOR);
    }

    // update children
    Node.prototype.update.call(this, dt, need_update_flag);
};

// draw
Sprite.prototype.draw = function(renderer) {
    // draw self
    renderer.draw(this.blendMode, this.tex, this.shader, this.vertices);

    // draw children
    Node.prototype.draw.call(this, renderer);
};
