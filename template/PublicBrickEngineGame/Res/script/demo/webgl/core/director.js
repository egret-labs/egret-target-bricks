// GameRes://script/demo/webgl/core/director.js
BK.Script.loadlib('GameRes://script/core/render/WebGLCore.js');
BK.Script.loadlib('GameRes://script/demo/webgl/common/common.js');
BK.Script.loadlib('GameRes://script/demo/webgl/core/renderer.js');
BK.Script.loadlib('GameRes://script/demo/webgl/core/texture.js');
BK.Script.loadlib('GameRes://script/demo/webgl/scene/node.js');
BK.Script.loadlib('GameRes://script/demo/webgl/shaders/shader.js');

function Director() {
    this.gl = bkWebGLGetInstance();
}

Director.prototype = {
    // constructor
    constructor: Director,

    // get_default_shader
    get_default_shader: function() {
        return this.default_shader;
    },

    load_texture: function(path) {
        return new Texture(this, path);
    },

    // init
    init: function() {
        // init default shader
        this.init_default_shader();

        // renderer
        this.renderer = new Renderer(this);
        this.renderer.init();

        // root node
        this.root_node = new Node('root');

        // main loop
        var director_this = this;
        this.main_loop_ticker = new BK.Ticker();
        this.main_loop_ticker.interval = 1;
        this.main_loop_ticker.setTickerCallBack(function(ts, du) {
            director_this.update(du);
            director_this.draw();
        });
    },

    // update
    update: function(dt) {
        this.root_node.update(dt);
    },

    // draw
    draw: function() {
        this.root_node.draw(this.renderer);
        this.renderer.realDraw();
    },

    init_default_shader: function() {
        var matIdentity = new Matrix4();
        var shader_info = {
            vs_source: '' + 
                'attribute vec3 Position;' +
                'attribute vec4 SourceColor;' +
                'varying vec4 DestinationColor;' +
                'uniform mat4 Projection;' +
                'uniform mat4 ModelView;' +
                'attribute vec2 TexCoordIn;' +
                'varying vec2 TexCoordOut;' +
                'void main(void) {' +
                '    DestinationColor = SourceColor;' +
                '    mat4 mp = Projection * ModelView;' +
                '    gl_Position = mp * vec4(Position, 1.0);' +
                '    TexCoordOut = TexCoordIn;' +
                '}',
            fs_source: '' +
                'varying lowp vec4 DestinationColor;' +
                'varying lowp vec2 TexCoordOut;' +
                'uniform sampler2D Texture;' +
                'void main(void) {' +
                '    lowp vec4 tc = texture2D(Texture, TexCoordOut);' +
                '    gl_FragColor = DestinationColor * tc;' +
                '}',
            attributes: [
                { name: 'Position', size: 3 },
                { name: 'SourceColor', size: 4 },
                { name: 'TexCoordIn', size: 2 },
            ],
            uniforms: [
                { name: 'Projection', type: SHADER_UNIFORM_TYPE_MATRIX4, default_value: matIdentity },
                { name: 'ModelView', type: SHADER_UNIFORM_TYPE_MATRIX4, default_value: matIdentity },
                { name: 'Texture', type: SHADER_UNIFORM_TYPE_TEXTURE0, default_value: 0 },
            ],
        };

        this.default_shader = new Shader(this.gl, shader_info);

        // test
        var bunnysTex = BK.director_instance.load_texture('GameRes://resource/bunnys.png');
        this.default_shader.set_uniform('Texture', bunnysTex);

        var proj_matrix = createOrthMatrix4(0, BK.Director.screenPixelSize.width, 0, BK.Director.screenPixelSize.height, -1, 1);
        this.default_shader.set_uniform('Projection', proj_matrix);

        var model_view_matrix = new Matrix4();
        this.default_shader.set_uniform('ModelView', model_view_matrix);
    },
};

// director instance
if (BK.director_instance == null) {
    BK.director_instance = new Director();
    BK.director_instance.init();
}

