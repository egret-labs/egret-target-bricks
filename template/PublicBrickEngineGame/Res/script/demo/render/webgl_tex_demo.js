BK.Script.loadlib('GameRes://script/core/render/WebGLCore.js');


var VERTEX_SHADER_SOURCE =
        'uniform mat4 Mmatrix;\n' +
        'attribute vec4 a_Position;\n' +
        'attribute vec2 a_TexCoord;\n' +
        'varying vec2 v_TexCoord;\n' +
        'void main() {\n' +
        '   gl_Position =Mmatrix*a_Position;\n' +
        '   v_TexCoord = a_TexCoord;\n' +
        '}\n';
    // fragment shader
    var FRAGMENT_SHADER_SOURCE =
        'precision mediump float;\n' +
        'varying vec2 v_TexCoord;\n' +
        'uniform sampler2D u_Sampler;\n' +
        'void main() {\n' +
        '   gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
        '}\n';
    var gl = bkWebGLGetInstance();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    if (!initShaders(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE)) {
        alert('Failed to init shaders');
    }
    var vertices = [
        -0.5, 0.5, 0.0, 1.0, // 前 2 位是位置坐标， 后 2 位是纹理坐标
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0
    ];
    initVertexBuffers(gl, vertices);
    var image = BK.Image.loadImage("GameRes://resource/texture/icon.png",6);
    loadTexture(image);
    var webGLTicker = new BK.Ticker();
    webGLTicker.interval = 1;
    webGLTicker.setTickerCallBack(function(ts,duration){
        gl.clearColor(0.0, 0.0, 0.0, 1.0);  gl.viewport(0,0,BK.Director.screenPixelSize.width,BK.Director.screenPixelSize.height);
        draw();
        gl.glCommit();
    });

    function initVertexBuffers(gl, vertices) {
        var vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
            console.log('Failed to create buffer object');
            return -1;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        var verticesData = new BK.Buffer(64,false);
        for(var i=0;i<vertices.length;i++){
            verticesData.writeFloatBuffer(vertices[i]);
        }
        gl.bufferData(gl.ARRAY_BUFFER, verticesData, gl.STATIC_DRAW);

        var FSIZE = 4;
        var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 4 * FSIZE, 0);
        gl.enableVertexAttribArray(a_Position);
        var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
        gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, 4 * FSIZE, 2 * FSIZE);
        gl.enableVertexAttribArray(a_TexCoord);
    }
    function loadTexture(image) {
        var texture = gl.createTexture();
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        debugger
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
        gl.uniform1i(u_Sampler, 0);
    }
    function draw() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        //gl.enable(gl.DEPTH_TEST);
        //gl.depthFunc(gl.LEQUAL);
        //gl.clearDepth(1);
        
        //gl.depthRange(0, 1);
        var Mmatrix = gl.getUniformLocation(gl.program, "Mmatrix");
        var mov_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
        gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    function initShaders(gl, vertexShaderSource, fragmentShaderSource) {
        var program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
        if (!program) {
            console.log('Failed to create program');
            return false;
        }
        gl.useProgram(program);
        gl.program = program;
        return true;
    }
    function loadShader(gl, type, source) {
        // create shader object
        var shader = gl.createShader(type);
        if (shader == null) {
            console.log('unable to create shader');
            return null;
        }
        // set shader source code
        gl.shaderSource(shader, source);
        // compile the shader
        gl.compileShader(shader);
        


        // check compile status
        // var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        // if (!compiled) {
        //     var error = gl.getShaderInfoLog(shader);
        //     console.log('Failed to compile shader: ' + error);
        //     return null;
        // }
        return shader;
    }
    function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
        var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        if (!vertexShader || !fragmentShader) {
            return null;
        }
        // create a program object
        var program = gl.createProgram();
        if (!program) {
            console.log('gl.createProgram failed');
            return null;
        }
        // attach  the shader objects
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        // link the program object
        gl.linkProgram(program);
        // check link status
        // var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
        // if (!linked) {
        //     var error = gl.getProgramInfoLog(program);
        //     console.log('Failed to link program: ' + error);
        //     gl.deleteProgram(program);
        //     gl.deleteShader(vertexShader);
        //     gl.deleteShader(fragmentShader);
        //     return null;
        // }
        return program;
    }
