// GameRes://script/demo/webgl/shaders/shader.js
BK.Script.loadlib('GameRes://script/demo/webgl/common/common.js');

// var shader_info = {
//     vs_source: '',
//     fs_source: '',
//     attributes: [
//         {
//             name: 'position',
//             size: 12,
//         },
//         {
//             name: 'texcoord',
//             size: 8,
//         },
//         {
//             name: 'color',
//             size: 16,
//         },
//     ],
//     uniforms: [
//         {
//             name: 'ProjMatrix',
//             type: SHADER_UNIFORM_TYPE_MATRIX1,
//             default_value : 0,
//         },
//         {
//             name: 'MVMatrix',
//             type: SHADER_UNIFORM_TYPE_MATRIX1,
//             default_value : 0,
//         },
//     ],
// };
function Shader(gl, shader_info) {
    this.gl = gl;

    this.vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(this.vs, shader_info.vs_source);
    gl.compileShader(this.vs);

    this.fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(this.fs, shader_info.fs_source);
    gl.compileShader(this.fs);

    this.shader_program = gl.createProgram();
    gl.attachShader(this.shader_program, this.vs);
    gl.attachShader(this.shader_program, this.fs);
    gl.linkProgram(this.shader_program);

    this.attributes = []
    for (var i=0; i < shader_info.attributes.length; ++i) {
        var attr_info = shader_info.attributes[i];
        var location = gl.getAttribLocation(this.shader_program, attr_info.name);
        this.attributes.push({
            'name': attr_info.name,
            'size': attr_info.size,
            'location': location,
        });
    }

    this.uniforms = []
    for (var i=0; i < shader_info.uniforms.length; ++i) {
        var uniform_info = shader_info.uniforms[i];
        this.uniforms.push({
            'name': uniform_info.name,
            'type': uniform_info.type,
            'location': gl.getUniformLocation(this.shader_program, uniform_info.name),
            'value': uniform_info.default_value,
        });
    }
}

Shader.prototype = {
    set_uniform: function(name, value) {
        for (var i=0; i < this.uniforms.length; ++i) {
            if (this.uniforms[i].name == name) {
                this.uniforms[i].value = value;
            }
        }
    },

    bind: function() {
        this.gl.useProgram(this.shader_program);

        // uniform
        for (var i=0; i < this.uniforms.length; ++i) {
            this.update_uniform(this.uniforms[i]);
        }

        var offset = 0;
        for (var i=0; i < this.attributes.length; ++i) {
            var attr_info = this.attributes[i];

            this.gl.vertexAttribPointer(attr_info.location, attr_info.size, this.gl.FLOAT, false, 4 * 9, offset);
            this.gl.enableVertexAttribArray(attr_info.location);

            offset += attr_info.size * 4;
        }
    },

    update_uniform: function(uniform_data) {
        var gl = this.gl;
        switch (uniform_data.type) {
            case SHADER_UNIFORM_TYPE_FLOAT1: {
                gl.uniform1f(uniform_data.location, uniform_data.value);
                break;
            }
            case SHADER_UNIFORM_TYPE_FLOAT2: {
                gl.uniform2f(uniform_data.location, uniform_data.value.x, uniform_data.value.y);
                break;
            }
            case SHADER_UNIFORM_TYPE_FLOAT3: {
                gl.uniform3f(uniform_data.location, uniform_data.value.x, uniform_data.value.y, uniform_data.value.z);
                break;
            }
            case SHADER_UNIFORM_TYPE_FLOAT4: {
                gl.uniform4f(uniform_data.location, uniform_data.value.x, uniform_data.value.y, uniform_data.value.z, uniform_data.value.w);
                break;
            }
            case SHADER_UNIFORM_TYPE_INT1: {
                gl.uniform1i(uniform_data.location, uniform_data.value);
                break;
            }
            case SHADER_UNIFORM_TYPE_INT2: {
                gl.uniform2i(uniform_data.location, uniform_data.value.x, uniform_data.value.y);
                break;
            }
            case SHADER_UNIFORM_TYPE_INT3: {
                gl.uniform3i(uniform_data.location, uniform_data.value.x, uniform_data.value.y, uniform_data.value.z);
                break;
            }
            case SHADER_UNIFORM_TYPE_INT4: {
                gl.uniform4i(uniform_data.location, uniform_data.value.x, uniform_data.value.y, uniform_data.value.z, uniform_data.value.w);
                break;
            }
            case SHADER_UNIFORM_TYPE_FLOATV1: {
                gl.uniform1fv(uniform_data.location, uniform_data.value);
                break;
            }
            case SHADER_UNIFORM_TYPE_FLOATV2: {
                gl.uniform2fv(uniform_data.location, uniform_data.value);
                break;
            }
            case SHADER_UNIFORM_TYPE_FLOATV3: {
                gl.uniform3fv(uniform_data.location, uniform_data.value);
                break;
            }
            case SHADER_UNIFORM_TYPE_FLOATV4: {
                gl.uniform4fv(uniform_data.location, uniform_data.value);
                break;
            }
            case SHADER_UNIFORM_TYPE_INTV1: {
                gl.uniform1iv(uniform_data.location, uniform_data.value);
                break;
            }
            case SHADER_UNIFORM_TYPE_INTV2: {
                gl.uniform2iv(uniform_data.location, uniform_data.value);
                break;
            }
            case SHADER_UNIFORM_TYPE_INTV3: {
                gl.uniform3iv(uniform_data.location, uniform_data.value);
                break;
            }
            case SHADER_UNIFORM_TYPE_INTV4: {
                gl.uniform4iv(uniform_data.location, uniform_data.value);
                break;
            }
            case SHADER_UNIFORM_TYPE_MATRIX2: {
                gl.uniformMatrix2fv(uniform_data.location, false, uniform_data.value.data);
                break;
            }
            case SHADER_UNIFORM_TYPE_MATRIX3: {
                gl.uniformMatrix3fv(uniform_data.location, false, uniform_data.value.data);
                break;
            }
            case SHADER_UNIFORM_TYPE_MATRIX4: {
                gl.uniformMatrix4fv(uniform_data.location, false, uniform_data.value.data);
                break;
            }
            case SHADER_UNIFORM_TYPE_TEXTURE0: {
                gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, uniform_data.value.texture);
                break;
            }
            case SHADER_UNIFORM_TYPE_TEXTURE1: {
                gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, uniform_data.value.texture);
                break;
            }
            case SHADER_UNIFORM_TYPE_TEXTURE2: {
                gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, uniform_data.value.texture);
                break;
            }
            case SHADER_UNIFORM_TYPE_TEXTURE3: {
                gl.activeTexture(gl.TEXTURE3); gl.bindTexture(gl.TEXTURE_2D, uniform_data.value.texture);
                break;
            }
            case SHADER_UNIFORM_TYPE_TEXTURE4: {
                gl.activeTexture(gl.TEXTURE4); gl.bindTexture(gl.TEXTURE_2D, uniform_data.value.texture);
                break;
            }
            case SHADER_UNIFORM_TYPE_TEXTURE5: {
                gl.activeTexture(gl.TEXTURE5); gl.bindTexture(gl.TEXTURE_2D, uniform_data.value.texture);
                break;
            }
            case SHADER_UNIFORM_TYPE_TEXTURE6: {
                gl.activeTexture(gl.TEXTURE6); gl.bindTexture(gl.TEXTURE_2D, uniform_data.value.texture);
                break;
            }
            case SHADER_UNIFORM_TYPE_TEXTURE7: {
                gl.activeTexture(gl.TEXTURE7); gl.bindTexture(gl.TEXTURE_2D, uniform_data.value.texture);
                break;
            }
        }
    },
};
