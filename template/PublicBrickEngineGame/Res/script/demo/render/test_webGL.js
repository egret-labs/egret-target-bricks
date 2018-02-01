    
BK.Script.loadlib('GameRes://script/core/render/WebGLCore.js');

    var VERTEX_SHADER_SOURCE =
            'attribute vec4 a_Position;\n' +
            'void main() {\n' +
            '   gl_Position = a_Position;\n' +
            '}\n';
    // fragment shader
    var FRAGMENT_SHADER_SOURCE =
            'void main() {\n' +
            '   gl_FragColor = vec4(1.0,0.0,0.0,1.0);\n' +
            '}\n';
  var gl = bkWebGLGetInstance();

    if (!initShaders(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE)) {
        alert('Failed to init shaders');
    }
    var vertices = [
        -0.5, 0.5, // v0
        -0.5, -0.5, // v1
        0.5, 0.5, // v2
        0.5, -0.5 // v3
    ];
    initVertexBuffers(gl, vertices);

var testTicker = new BK.Ticker();
testTicker.interval = 1;
testTicker.setTickerCallBack(function(ts, duration)
                             {
                             //BK.Director.renderAllCameras(duration);
                             gl.viewport(0,0,BK.Director.screenPixelSize.width, BK.Director.screenPixelSize.height);
                             gl.clearColor(0.0, 0.0, 0.0, 1.0);
                             gl.clear(gl.COLOR_BUFFER_BIT);
                             gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
//                             gl.glCommit();
//                             BK.Director.renderAllCameras(duration);
//
                             BK.Render.commit();

                             });


    BK.Script.log(1,1,"drawArrays end");


    function initVertexBuffers(gl, vertices) {
        var vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
            console.log('Failed to create buffer object');
            return -1;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        var positionsData = new BK.Buffer(32,false);
        for(var i=0;i<vertices.length;i++){
            positionsData.writeFloatBuffer(vertices[i]);
        }
        gl.bufferData(gl.ARRAY_BUFFER, positionsData, gl.STATIC_DRAW);
        var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
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
