BK.Script.loadlib('GameRes://script/core/basics/TypedArray.js');
BK.Script.loadlib('GameRes://script/core/render/WebGLCore.js');
BK.Script.loadlib('GameRes://script/core/render/gl_matrix.js');
BK.Script.loadlib('GameRes://script/core/render/canvas.js');

var cubeRotation = 0.0;
function main() {
    var gl = bkWebGLGetInstance();

    // If we don't have a GL context, give up now

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    // Vertex shader program

    var vsSource = "attribute vec4 aVertexPosition;\
  attribute vec2 aTextureCoord;uniform mat4 uModelViewMatrix;\
  uniform mat4 uProjectionMatrix;varying highp vec2 vTextureCoord;\
  void main(void)\
   {\
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;\
    vTextureCoord = aTextureCoord;\
  }";

    // Fragment shader program

    var fsSource = "varying highp vec2 vTextureCoord;\
  uniform sampler2D uSampler;\
  void main(void) \
  {\
    gl_FragColor = texture2D(uSampler,vTextureCoord);\
  }";

    // Initialize a shader program; this is where all the lighting
    // for the vertices and so forth is established.
    var shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    // Collect all the info needed to use the shader program.
    // Look up which attributes our shader program is using
    // for aVertexPosition, aTextureCoord and also
    // look up uniform locations.
    var programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
        },
    };

    // Here's where we call the routine that builds all the
    // objects we'll be drawing.
    var buffers = initBuffers(gl);
    BK.Script.log(1, 1, "xxxxx loadTexture");

    var texture = loadTexture(gl, 'cubetexture.png');
    BK.Script.log(1, 1, "xxxxx loadTexture end");

    var then = 0;

    BK.Script.log(1, 1, "xxxxx new BK.Ticker()");

    var glTicker = new BK.Ticker();
    glTicker.interval = 1;
    glTicker.setTickerCallBack(function (ts, duration) {

        ts = ts * 0.001;  // convert to seconds
        var deltaTime = ts - then;
        then = ts;
        gl.viewport(0, 0, BK.Director.screenPixelSize.width, BK.Director.screenPixelSize.height);
        drawScene(gl, programInfo, buffers, texture, deltaTime);
        gl.glCommit();
        BK.Script.log(1, 1, "xxxxx glCommit end delta=" + deltaTime);


    });
    BK.Script.log(1, 1, "xxxxx new BK.Ticker() end");


}

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple three-dimensional cube.
//
function initBuffers(gl) {

    // Create a buffer for the cube's vertex positions.

    var positionBuffer = gl.createBuffer();

    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Now create an array of positions for the cube.

    var positions = new Float32Array([
        // Front face
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,

        // Back face
        -1.0, -1.0, -1.0,
        -1.0, 1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, -1.0, -1.0,

        // Top face
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, -1.0,

        // Bottom face
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0, 1.0,
        -1.0, -1.0, 1.0,

        // Right face
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        1.0, 1.0, 1.0,
        1.0, -1.0, 1.0,

        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, 1.0, -1.0,
    ]);

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.

    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // Now set up the texture coordinates for the faces.

    var textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

    var textureCoordinates = new Float32Array([
        // Front
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Back
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Top
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Bottom
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Right
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Left
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
    ]);

    gl.bufferData(gl.ARRAY_BUFFER, textureCoordinates,
        gl.STATIC_DRAW);

    // Build the element array buffer; this specifies the indices
    // into the vertex arrays for each face's vertices.

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.

    var indices = new Uint16Array([
        0, 1, 2, 0, 2, 3,    // front
        4, 5, 6, 4, 6, 7,    // back
        8, 9, 10, 8, 10, 11,   // top
        12, 13, 14, 12, 14, 15,   // bottom
        16, 17, 18, 16, 18, 19,   // right
        20, 21, 22, 20, 22, 23,   // left
    ]);
    // Now send the element array to GL

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        indices, gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        textureCoord: textureCoordBuffer,
        indices: indexBuffer,
    };
}

//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl, url) {
    var canvas = new BK.Canvas(400, 400);
    canvas.fillColor = { r: 1, g: 0, b: 0, a: 1.0}
    canvas.fillRect(0, 0, 400, 400);
    canvas.fillColor = { r: 0, g: 0.67, b: 0.9, a: 1.0 }
    canvas.drawStyle = 0;
    canvas.lineWidth = 5
    canvas.setTextAlign(1);
    canvas.setTextSize(30)
    canvas.setTextItalic(1)
    canvas.drawText("你好,hello,canvas,webGL", 0, 0, 200, 100);
    


//////////////////////////////////////////核心////////////////////////////////////////

    var textureID = canvas.getTexture().renderTarget;
    gl.bindTexture(gl.TEXTURE_2D, textureID);
    return textureID;



}

function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, buffers, texture, deltaTime) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    // Clear the canvas before we start drawing on it.

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.

    var fieldOfView = 45 * Math.PI / 180;   // in radians
    var aspect = BK.Director.screenPixelSize.width / BK.Director.screenPixelSize.height;
    var zNear = 0.1;
    var zFar = 100.0;

    var projectionMatrix = mat4.create();
    BK.Script.log(0, 0, "new Projection = " + projectionMatrix.toString());
    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar);
    BK.Script.log(0, 0, "perspective Projection = " + projectionMatrix.toString());
    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    var modelViewMatrix = mat4.create();
    BK.Script.log(0, 0, "new modelView = " + modelViewMatrix.toString());
    // Now move the drawing position a bit to where we want to
    // start drawing the square.

    mat4.translate(modelViewMatrix,     // destination matrix
        modelViewMatrix,     // matrix to translate
        [-0.0, 0.0, -6.0]);  // amount to translate

    mat4.rotate(modelViewMatrix,  // destination matrix
        modelViewMatrix,  // matrix to rotate
        cubeRotation,     // amount to rotate in radians
        [0, 0, 1]);       // axis to rotate around (Z)

    mat4.rotate(modelViewMatrix,  // destination matrix
        modelViewMatrix,  // matrix to rotate
        cubeRotation * 0.7,// amount to rotate in radians
        [0, 1, 0]);       // axis to rotate around (X)


    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute
    {

        var numComponents = 3;
        var type = gl.FLOAT;
        var normalize = false;
        var stride = 0;
        var offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexPosition);
    }

    // Tell WebGL how to pull out the texture coordinates from
    // the texture coordinate buffer into the textureCoord attribute.
    {
        var numComponents = 2;
        var type = gl.FLOAT;
        var normalize = false;
        var stride = 0;
        var offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
        gl.vertexAttribPointer(
            programInfo.attribLocations.textureCoord,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.textureCoord);
    }

    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    // Tell WebGL to use our program when drawing

    gl.useProgram(programInfo.program);

    BK.Script.log(1, 1, "xxxxx useProgram=" + programInfo.program);

    // Set the shader uniforms

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);

    // Specify the texture to map onto the faces.

    // Tell WebGL we want to affect texture unit 0
    gl.activeTexture(gl.TEXTURE0);

    // Bind the texture to texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Tell the shader we bound the texture to texture unit 0
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

    {
        var vertexCount = 36;
        var type = gl.UNSIGNED_SHORT;
        var offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }

    // Update the rotation for the next draw

    cubeRotation = cubeRotation + deltaTime;
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
    var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert

    // if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    //   alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    //   return null;
    // }

    return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
    var shader = gl.createShader(type);

    // Send the source to the shader object

    gl.shaderSource(shader, source);

    // Compile the shader program

    gl.compileShader(shader);

    // See if it compiled successfully

    // if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    //   alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    //   gl.deleteShader(shader);
    //   return null;
    // }

    return shader;
}

main();
