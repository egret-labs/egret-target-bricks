

BK.Script.loadlib('GameRes://script/core/render/WebGLCore.js');

/*============= Creating a canvas =================*/
var gl = bkWebGLGetInstance();


/*============ Defining and storing the geometry =========*/

var vertices = [
                -0.5,-0.5,-0.5, 0.5,-0.5,-0.5, 0.5, 0.5,-0.5, -0.5, 0.5,-0.5,
                -0.5,-0.5, 0.5, 0.5,-0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5,
                -0.5,-0.5,-0.5, -0.5, 0.5,-0.5, -0.5, 0.5, 0.5, -0.5,-0.5, 0.5,
                0.5,-0.5,-0.5, 0.5, 0.5,-0.5, 0.5, 0.5, 0.5, 0.5,-0.5, 0.5,
                -0.5,-0.5,-0.5, -0.5,-0.5, 0.5, 0.5,-0.5, 0.5, 0.5,-0.5,-0.5,
                -0.5, 0.5,-0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,-0.5
                ];

var colors = [
              1.0,0.0,0.0, 0.0,0.5,0.0, 0.0,0.0,0.5, 0.0,0.0,0.0,
              0.0,0.0,0.5, 0.2,0.0,0.0, 0.0,0.0,0.0, 0.3,0.4,0.0,
              0.0,0.4,0.0, 0.3,0.0,0.0, 0.0,0.3,0.0, 0.0,0.4,0.0,
              0.0,0.0,0.5, 0.0,0.0,0.0, 0.0,0.0,0.0, 0.0,0.4,0.0,
              0.0,0.0,0.5, 0.0,0.0,0.0, 0.0,0.0,0.0, 0.0,0.3,0.0,
              0.0,0.0,0.4, 0.0,0.0,0.4, 0.0,0.0,0.5, 0.0,0.3,0.0
              ];

var indices = [
               0,1,2, 0,2,3, 4,5,6, 4,6,7,
               8,9,10, 8,10,11, 12,13,14, 12,14,15,
               16,17,18, 16,18,19, 20,21,22, 20,22,23
               ];

// Create and store data into vertex buffer
var vertexsData = new BK.Buffer(288,false);
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

/*=================== Shaders =========================*/

var vertCode = 'attribute vec3 position;'+
'uniform mat4 Pmatrix;'+
'uniform mat4 Vmatrix;'+
'uniform mat4 Mmatrix;'+
'attribute vec3 color;'+//the color of the point
'varying vec3 vColor;'+

'void main(void) { '+//pre-built function
'gl_Position = Mmatrix*vec4(position, 1.0);'+
'vColor = color;'+
'}';

var fragCode = 'precision mediump float;'+
'varying vec3 vColor;'+
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

// Color
gl.enableVertexAttribArray(color);
gl.useProgram(shaderProgram);

/*==================== MATRIX =====================*/

function perspective(fieldOfViewYInRadians, aspect, zNear, zFar) {
    
    var dst = [
                  0.0,0.0,0.0,0.0, 0.0,0.0,0.0,0.0, 0.0,0.0,0.0,0.0, 0.0,0.0,0.0,0.0,
                  0.0,0.0,0.0,0.0, 0.0,0.0,0.0,0.0, 0.0,0.0,0.0,0.0, 0.0,0.0,0.0,0.0,
                  0.0,0.0,0.0,0.0, 0.0,0.0,0.0,0.0, 0.0,0.0,0.0,0.0, 0.0,0.0,0.0,0.0,
                  0.0,0.0,0.0,0.0, 0.0,0.0,0.0,0.0, 0.0,0.0,0.0,0.0, 0.0,0.0,0.0,0.0
                  ];
    
    var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewYInRadians);
    var rangeInv = 1.0 / (zNear - zFar);
    dst = []
    dst[0]  = f / aspect;
    dst[1]  = 0;
    dst[2]  = 0;
    dst[3]  = 0;
    
    dst[4]  = 0;
    dst[5]  = f;
    dst[6]  = 0;
    dst[7]  = 0;
    
    dst[8]  = 0;
    dst[9]  = 0;
    dst[10] = (zNear + zFar) * rangeInv;
    dst[11] = -1;
    
    dst[12] = 0;
    dst[13] = 0;
    dst[14] = zNear * zFar * rangeInv * 2;
    dst[15] = 0;
    BK.Script.log(1,1,"xxxx d10 ="+dst[10]+ " d14="+dst[14]);

    return dst;
}

function get_projection(angle, a, zMin, zMax) {
    var ang = Math.tan((angle*0.5)*Math.PI/180);//angle*.5
    return [
            0.5/ang, 0 , 0, 0,
            0, 0.5*a/ang, 0, 0,
            0, 0, -(zMax+zMin)/(zMax-zMin), -1,
            0, 0, (-2*zMax*zMin)/(zMax-zMin), 0
            ];
}

//var proj_matrix = get_projection(45, BK.Director.screenPixelSize.width / BK.Director.screenPixelSize.height, -1000, 1000);
var proj_matrix = perspective(Math.PI/9, BK.Director.screenPixelSize.width / BK.Director.screenPixelSize.height,1, 1000);
BK.Script.log(1,1,"xxxx width ="+BK.Director.screenPixelSize.width + " height="+BK.Director.screenPixelSize.height);
var movW = (BK.Director.screenPixelSize.width / 2);
var movH = (BK.Director.screenPixelSize.height / 2);
var mov_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
var view_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];


gl.enable(gl.DEPTH_TEST);
gl.cullFace(gl.TRUE);
// translating z
view_matrix[14] = view_matrix[14] ;//zoom

/*==================== Rotation ====================*/

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

var dir = 0.1;

function transZ(m){
    if (m[14] >= 5){
        dir = -0.1;
    }
    
    if (m[14] <= 0){
        dir = 0.1;
    }
    
    m[14]=m[14]+dir;
    return m;
}
/*================= Drawing ===========================*/
var time_old = 0;
//rotateZ(mov_matrix, 100*0.005);//time
//rotateY(mov_matrix, 100*0.002);
//rotateX(mov_matrix, 100*0.003);

var glTicker = new BK.Ticker();
glTicker.interval = 1;
glTicker.setTickerCallBack(function(ts, duration)
                           {
                           var dt = ts-time_old;
                           rotateZ(mov_matrix, dt*0.005);//time
                          // mov_matrix = transZ(mov_matrix);
                           rotateY(mov_matrix, dt*0.002);
                           rotateX(mov_matrix, dt*0.003);
                           time_old = ts;
                           

                           gl.clearColor(0.5, 0.5, 0.5, 0.9);
                           
                           gl.viewport(0, 0, BK.Director.screenPixelSize.width,BK.Director.screenPixelSize.height);
                           //gl.depthRange(1, 10000);
                           gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                           gl.uniformMatrix4fv(Pmatrix, false, proj_matrix);
                           gl.uniformMatrix4fv(Vmatrix, false, view_matrix);
                           gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
                           gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
                           gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
                           gl.glCommit();
                           
                           
                           });

//var animate = function(time) {
//
//    var dt = time-time_old;
//    rotateZ(mov_matrix, dt*0.005);//time
//    rotateY(mov_matrix, dt*0.002);
//    rotateX(mov_matrix, dt*0.003);
//    time_old = time;
//
//    gl.enable(gl.DEPTH_TEST);
//    gl.depthFunc(gl.LEQUAL);
//    gl.clearColor(0.5, 0.5, 0.5, 0.9);
//    gl.clearDepth(1.0);
//
//    gl.viewport(0.0, 0.0, BK.Director.screenPixelSize.width,BK.Director.screenPixelSize.height);
//    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
//    gl.uniformMatrix4fv(Pmatrix, false, proj_matrix);
//    gl.uniformMatrix4fv(Vmatrix, false, view_matrix);
//    gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
//    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
//    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
//
//    window.requestAnimationFrame(animate);
//}
//animate(0);

