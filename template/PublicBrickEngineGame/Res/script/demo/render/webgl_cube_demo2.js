BK.Script.loadlib('GameRes://script/core/render/WebGLCore.js');
BK.Script.loadlib('GameRes://script/core/render/gl_matrix.js');


/*============= Creating a canvas =================*/
var gl = bkWebGLGetInstance();

/*=================== Shaders =========================*/

var vertCode = 'attribute vec3 position;'+
'uniform mat4 Pmatrix;'+
'uniform mat4 Vmatrix;'+
'uniform mat4 Mmatrix;'+
'attribute vec3 color;'+
'varying vec3 vColor;'+

'void main(void) { '+//pre-built function
'gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.0);'+
'vColor = color;'+
'}';

var fragCode = 'varying lowp vec3 vColor;'+
'void main(void) {'+
'gl_FragColor = vec4(vColor, 1.0);'+
'}';

var vertShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertShader, vertCode);
gl.compileShader(vertShader);

var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragShader, fragCode);
gl.compileShader(fragShader);

var shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertShader);
gl.attachShader(shaderProgram, fragShader);
gl.linkProgram(shaderProgram);

gl.useProgram(shaderProgram);

/*============ Defining and storing the geometry =========*/

var vertices = [ -20, -20, 20, 20, -20, 20, 20, 20, 20, -20, 20, 20,
				 20, -20, -20, 20, 20, -20, -20, 20, -20, -20, -20, -20];

var colors = [
              1.0,0.5,0.0, 1.0,0.5,0.0, 0.1,0.1,0.0, 1.0,0.0,0.0,
              0.0,0.5,0.0, 1.0,0.1,0.0, 1.0,0.0,0.0, 1.0,0.0,0.0,
              1.0,0.0,0.0, 1.0,0.2,0.0, 1.0,0.0,0.0, 1.0,0.0,0.0,
              1.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,0.0,
              1.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,0.0,
              1.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,0.0
              ];

var indices = [0, 2, 3, 0, 1, 2, 1, 5, 2, 1, 4, 5, 4, 7, 5, 7, 6, 5, 6, 3, 7, 7, 3, 0, 3, 5, 6, 3, 2, 5, 0, 7, 1, 1, 7, 4
               ];


// Create and store data into vertex buffer
var vertexsData = new BK.Buffer(4 * 8 * 3,false);
for(var i=0;i<vertices.length;i++){
    vertexsData.writeFloatBuffer(vertices[i]);
}

var vertex_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexsData, gl.STATIC_DRAW);

// Create and store data into color buffer

var colorsData = new BK.Buffer(288,false);
for(var i=0;i<colors.length;i++){
    colorsData.writeFloatBuffer(colors[i]);
}
var color_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
gl.bufferData(gl.ARRAY_BUFFER, colorsData, gl.STATIC_DRAW);

// Create and store data into index buffer

var indexsData = new BK.Buffer(72,false);
for(var i=0;i<indices.length;i++){
    indexsData.writeUint16Buffer(indices[i]);
}
var index_buffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexsData, gl.STATIC_DRAW);



/* ====== Associating attributes to vertex shader =====*/
var Pmatrix = gl.getUniformLocation(shaderProgram, "Pmatrix");
var Vmatrix = gl.getUniformLocation(shaderProgram, "Vmatrix");
var Mmatrix = gl.getUniformLocation(shaderProgram, "Mmatrix");
BK.Script.log(1, 0, "Pmatrix = " + Pmatrix + ", Vmatrix = " + Vmatrix + ", Mmatrix = " + Mmatrix);

gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
var position = gl.getAttribLocation(shaderProgram, "position");
gl.vertexAttribPointer(position, 3, gl.FLOAT, false,0,0) ;

// Position
gl.enableVertexAttribArray(position);
gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
var color = gl.getAttribLocation(shaderProgram, "color");
gl.vertexAttribPointer(color, 3, gl.FLOAT, false,0,0) ;

// // Color
gl.enableVertexAttribArray(color);

  var fieldOfView = 45 * Math.PI / 180;   // in radians
  var aspect =  BK.Director.screenPixelSize.width / BK.Director.screenPixelSize.height;
  var zNear = 100;
  var zFar = 1800;

  var projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  var modelViewMatrix = mat4.create();

  var viewMatrix = mat4.create();
  viewMatrix = mat4.lookAt(viewMatrix,[100,50,400],[0,0,0],[0,1,0]);
BK.Script.log(1,1,"xxxx uniformMatrix4fv");

var proArr = new Array(16);
var viewArr = new Array(16);
var modArr = new Array(16);

for(var i=0;i<16;i++){
	proArr[i] = projectionMatrix[i];
	viewArr[i] = viewMatrix[i];
	modArr[i] = modelViewMatrix[i];
}
for(var i=0;i<16;i++){
	BK.Script.log(1,1,"xxxx view  i="+i+" value="+viewMatrix[i]);
}

var temp = mat4.create();

temp = mat4.multiply(temp,projectionMatrix,viewMatrix);

var mvpArr = mat4.create();
mvpArr = mat4.multiply(mvpArr,temp,modelViewMatrix);

for(var i=0;i<16;i++){
	BK.Script.log(1,1,"xxxx mvp i="+i+" value="+mvpArr[i]);
}

gl.uniformMatrix4fv(Pmatrix, false, proArr);
gl.uniformMatrix4fv(Vmatrix, false, viewArr);
gl.uniformMatrix4fv(Mmatrix, false, modArr);

gl.enable(gl.DEPTH_TEST);
//gl.depthFunc(gl.LEQUAL);
gl.cullFace(gl.TRUE);

BK.Script.log(1, 0, "before indexBuffer = " + index_buffer);

function rotateZ(m, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv0 = m[0], mv4 = m[4], mv8 = m[8];
    
    m[0] = c*m[0]-s*m[1];
    m[4] = c*m[4]-s*m[5];
    m[8] = c*m[8]-s*m[9];
    
    m[1]=c*m[1]+s*mv0;
    m[5]=c*m[5]+s*mv4;
    m[9]=c*m[9]+s*mv8;
}

function rotateX(m, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv1 = m[1], mv5 = m[5], mv9 = m[9];
    
    m[1] = m[1]*c-m[2]*s;
    m[5] = m[5]*c-m[6]*s;
    m[9] = m[9]*c-m[10]*s;
    
    m[2] = m[2]*c+mv1*s;
    m[6] = m[6]*c+mv5*s;
    m[10] = m[10]*c+mv9*s;
}

function rotateY(m, angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mv0 = m[0], mv4 = m[4], mv8 = m[8];
    
    m[0] = c*m[0]+s*m[2];
    m[4] = c*m[4]+s*m[6];
    m[8] = c*m[8]+s*m[10];
    
    m[2] = c*m[2]-s*mv0;
    m[6] = c*m[6]-s*mv4;
    m[10] = c*m[10]-s*mv8;
}
var time_old = 0;

var glTicker = new BK.Ticker();
glTicker.interval = 1;
glTicker.setTickerCallBack(function(ts, duration)
                           {


                           var dt = ts-time_old;

                           //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
                           //gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexsData, gl.STATIC_DRAW);
						  //rotateZ(modArr, dt*0.005);//time
                           rotateY(modArr, dt*0.002);
                          // rotateX(modArr, dt*0.003);

						   gl.uniformMatrix4fv(Mmatrix, false, modArr);

                           gl.clearColor(0.5, 0.5, 0.5, 0.9);
                           
                           gl.viewport(0, 0, BK.Director.screenPixelSize.width,BK.Director.screenPixelSize.height);
                           //gl.depthRange(1, 10000);
                           gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                           
                           gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
                           gl.glCommit();
                           
                           });


