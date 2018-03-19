// GameRes://script/demo/webgl/core/renderer.js
BK.Script.loadlib('GameRes://script/demo/webgl/common/common.js');

// var batch_obj = {
//     'blendMode': blend_mode,
//     'texture': tex,
//     'shader': shader,
//     'vertices': vertices,
//     'indies': indies,
// };

function Renderer(director) {
    this.director = director;
    this.gl = director.gl;

    // 
    this.vbo = this.gl.createBuffer();
    this.ibo = this.gl.createBuffer();

    this.currect_shader = null;

    // 
    this.batch_objs = []
    this.current_batch_index = -1;
    this.default_tex = 0;
}

Renderer.prototype = {
    // constructor
    constructor: Renderer,

    // init
    init: function() {
        this.batch_objs.push(this.createBatchObj());
        this.current_batch_index = 0;

        // 
        //this.gl.disable(this.gl.DEPTH_TEST);
        //this.gl.depthFunc(this.gl.LEQUAL);
        //this.gl.clearDepth(1.0);
        //this.gl.disable(this.gl.CULL_FACE);
        this.gl.viewport(0, 0, BK.Director.screenPixelSize.width, BK.Director.screenPixelSize.height);
        this.gl.clearColor(1.0, 0.0, 0.0, 1.0);
    },

    // batch
    draw: function(blend_mode, texture_id, shader_id, vertices) {
        var batch_obj = this.batch_objs[this.current_batch_index];

        // batch_obj.blendMode[batch_obj.nextIndex] = blend_mode;
        // //batch_obj.textures[batch_obj.nextIndex] = texture_id;
        // batch_obj.textures[batch_obj.nextIndex] = 0;
        // //batch_obj.shaders[batch_obj.nextIndex] = shader_id;
        // batch_obj.shaders[batch_obj.nextIndex] = 0;

        var index = batch_obj.nextIndex * 36;
        batch_obj.vertices.set(vertices, index);
        //for (var i=0; i < 36; ++i) {
        //    batch_obj.vertices[index+i] = vertices[i];
        //}

        batch_obj.nextIndex += 1;
        if (batch_obj.nextIndex >= RENDERER_BATCH_SPRITE_MAX_COUNT) {
            this.batch_objs.push(this.createBatchObj());
            this.current_batch_index += 1;
        }
    },

    // real draw
    realDraw: function() {
        var gl = this.gl;

        //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        for (var i=0; i < this.batch_objs.length; ++i) {
            var batch_obj = this.batch_objs[i];
            if (batch_obj.nextIndex > 0) {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
                gl.bufferData(gl.ARRAY_BUFFER, batch_obj.vertices, gl.STATIC_DRAW);

                if (this.currect_shader != this.director.default_shader) {
                    this.currect_shader = this.director.default_shader;
                    this.director.default_shader.bind();
                }

                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
                //gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, batch_obj.indices, gl.STATIC_DRAW);
                gl.drawElements(gl.TRIANGLES, batch_obj.nextIndex * 6, gl.UNSIGNED_SHORT, 0);

                batch_obj.nextIndex = 0;
            }
        }

        gl.glCommit();

        this.current_batch_index = 0;
    },

    createBatchObj: function() {
        // vertex: 4 * 9
        //      position: 3 floats
        //      tex coord: 2 floats
        //      color: 4 floats
        // indices: 6
        var batch_obj = {
            'nextIndex': 0,
            //'blendMode': new Int32Array(RENDERER_BATCH_SPRITE_MAX_COUNT),
            //'textures': new Int32Array(RENDERER_BATCH_SPRITE_MAX_COUNT),
            //'shaders': new Int32Array(RENDERER_BATCH_SPRITE_MAX_COUNT),
            'vertices': new Float32Array(RENDERER_BATCH_SPRITE_MAX_COUNT * 4 * 9),
            'indices': new Uint16Array(RENDERER_BATCH_SPRITE_MAX_COUNT * 6),
        };

        for (var i=0; i < RENDERER_BATCH_SPRITE_MAX_COUNT; ++i) {
            var index_1 = i * 6;
            var index_2 = i * 4;

            batch_obj.indices[index_1+0] = index_2 + 0;
            batch_obj.indices[index_1+1] = index_2 + 3;
            batch_obj.indices[index_1+2] = index_2 + 1;
            batch_obj.indices[index_1+3] = index_2 + 1;
            batch_obj.indices[index_1+4] = index_2 + 3;
            batch_obj.indices[index_1+5] = index_2 + 2;
        }

        this.gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
        this.gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, batch_obj.indices, gl.STATIC_DRAW);

        return batch_obj;
    },
};
