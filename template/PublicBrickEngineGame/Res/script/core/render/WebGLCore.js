
var gl;
function bkWebGLGetInstance(){
    if(!gl){
        gl = new BK.WebGL();
        attatchConst();
        attachMethod();
        gl.viewport(0, 0, BK.Director.screenPixelSize.width,BK.Director.screenPixelSize.height);
    }
    renderTicker && (renderTicker.paused = true);
    BK.Director.ticker && (BK.Director.ticker.paused = true);
    return gl;
}

function __TypedArrayGetData(array)
{
    if (Object.prototype.hasOwnProperty.call(array, '__rawBKData')) {
        return array.__rawBKData;
    } else if (Object.prototype.hasOwnProperty.call(array, '__nativeObj')) {
        return array.__nativeObj;
    }
    /*if (array instanceof Int8Array == true) {
        var buf = new BK.Buffer(128, false);
        for (var i = 0; i < array.length; i++) {
            buf.writeInt8Buffer(array[i]);
        }
        return buf;
    } else if (array instanceof Uint8Array == true) {
        var buf = new BK.Buffer(128, false);
        for (var i = 0; i < array.length; i++) {
            buf.writeUint8Buffer(array[i]);
        }
        return buf;
    } else if (array instanceof Int16Array == true) {
        var buf = new BK.Buffer(128, false);
        for (var i = 0; i < array.length; i++) {
            buf.writeInt16Buffer(array[i]);
        }
        return buf;
    } else if (array instanceof Uint16Array == true) {
        var buf = new BK.Buffer(128, false);
        for (var i = 0; i < array.length; i++) {
            buf.writeUint16Buffer(array[i]);
        }
        return buf;
    } else if (array instanceof Int32Array == true) {
        var buf = new BK.Buffer(128, false);
        for (var i = 0; i < array.length; i++) {
            buf.writeInt32Buffer(array[i]);
        }
        return buf;
    } else if (array instanceof Uint32Array == true) {
        var buf = new BK.Buffer(128, false);
        for (var i = 0; i < array.length; i++) {
            buf.writeUint32Buffer(array[i]);
        }
        return buf;
    } else if (array instanceof Float32Array == true) {
        var buf = new BK.Buffer(128, false);
        for (var i = 0; i < array.length; i++) {
            buf.writeFloatBuffer(array[i]);
        }
        return buf;
    } else if (array instanceof ArrayBuffer == true) {
        var buf = new BK.Buffer(array.byteLength, false);
        var dataView = new DataView(array);
        for (var i = 0; i < array.byteLength; i++) {
            buf.writeUint8Buffer(dataView.getUint8(i));
        }
        return buf;
    }*/
    return array;
}

function activeTexture(texture){
    gl.glActiveTexture(texture);
}

function attachShader(program,shader){
    gl.glAttachShader(program,shader);
}

function bindAttribLocation(program,index,name){
    gl.glBindAttribLocation(program,index,name);
}

function bindBuffer(target,buffer){
    gl.glBindBuffer(target,buffer);
}

function bindFramebuffer(target,framebuffer){
    gl.glBindFramebuffer(target,framebuffer);
}

function bindRenderbuffer(target,renderbuffer){
    gl.glBindRenderbuffer(target,renderbuffer);
}

function bindTexture(target,texture){
    gl.glBindTexture(target,texture);
}

function blendColor(red,green,blue,alpha){
    gl.glBlendColor(red,green,blue,alpha);
}

function blendEquation(mode){
    gl.glBlendEquation(mode);
}

function blendEquationSeparate(modeRGB,modeAlpha){
    gl.glBlendEquationSeparate(modeRGB,modeAlpha);
}

function blendFunc(sfactor,dfactor){
    gl.glBlendFunc(sfactor,dfactor);
}

function blendFuncSeparate(srcRGB,dstRGB,srcAlpha,dstAlpha){
    gl.glBlendFuncSeparate(srcRGB,dstRGB,srcAlpha,dstAlpha);
}

function bufferData(target,size,usage){
    gl.glBufferData(target,size,usage);
}

function bufferData(target,data,usage){
    gl.glBufferData(target, __TypedArrayGetData(data), usage);
}

function bufferSubData(target,offset,data){
    gl.glBufferSubData(target, offset, __TypedArrayGetData(data));
}

function checkFramebufferStatus(target){
    return  gl.glCheckFramebufferStatus(target);
}

function clear(mask){
    gl.glClear(mask);
}

function clearColor(red,green,blue,alpha){
    gl.glClearColor(red,green,blue,alpha);
}

function clearDepth(depth){
    gl.glClearDepth(depth);
}

function clearStencil(s){
    gl.glClearStencil(s);
}

function colorMask(red,green,blue,alpha){
    gl.glColorMask(red,green,blue,alpha);
}

function compileShader(shader){
    gl.glCompileShader(shader);
}

function compressedTexImage2D(target,level,internalformat,width,height,border,data){
    gl.glCompressedTexImage2D(target,level,internalformat,width,height,border,data);
}

function compressedTexSubImage2D(target,level,xoffset,yoffset,width,height,format,data){
    gl.glCompressedTexSubImage2D(target,level,xoffset,yoffset,width,height,format,data);
}

function copyTexImage2D(target,level,internalformat,x,y,width,height,border){
    gl.glCopyTexImage2D(target,level,internalformat,x,y,width,height,border);
}

function copyTexSubImage2D(target,level,xoffset,yoffset,x,y,width,height){
    gl.glCopyTexSubImage2D(target,level,xoffset,yoffset,x,y,width,height);
}

function createBuffer(){
    return  gl.glCreateBuffer();

}

function createFramebuffer(){
    return  gl.glCreateFramebuffer();

}

function createProgram(){
    return  gl.glCreateProgram();

}

function createRenderbuffer(){
    return  gl.glCreateRenderbuffer();

}

function createShader(type){
    return  gl.glCreateShader(type);
}

function createTexture(){
    return  gl.glCreateTexture();

}

function cullFace(mode){
    gl.glCullFace(mode);
}

function deleteBuffer(buffer){
    gl.glDeleteBuffer(buffer);
}

function deleteFramebuffer(framebuffer){
    gl.glDeleteFramebuffer(framebuffer);
}

function deleteProgram(program){
    gl.glDeleteProgram(program);
}

function deleteRenderbuffer(renderbuffer){
    gl.glDeleteRenderbuffer(renderbuffer);
}

function deleteShader(shader){
    gl.glDeleteShader(shader);
}

function deleteTexture(texture){
    gl.glDeleteTexture(texture);
}

function depthFunc(func){
    gl.glDepthFunc(func);
}

function depthMask(flag){
    gl.glDepthMask(flag);
}

function depthRange(zNear,zFar){
    gl.glDepthRange(zNear,zFar);
}

function detachShader(program,shader){
    gl.glDetachShader(program,shader);
}

function disable(cap){
    gl.glDisable(cap);
}

function disableVertexAttribArray(index){
    gl.glDisableVertexAttribArray(index);
}

function drawArrays(mode,first,count){
    gl.glDrawArrays(mode,first,count);
}

function drawElements(mode,count,type,offset){
    gl.glDrawElements(mode,count,type,offset);
}

function enable(cap){
    gl.glEnable(cap);
}

function enableVertexAttribArray(index){
    gl.glEnableVertexAttribArray(index);
}

function finish(){
    gl.glFinish();

}

function flush(){
    gl.glFlush();

}

function framebufferRenderbuffer(target,attachment,renderbuffertarget,renderbuffer){
    gl.glFramebufferRenderbuffer(target,attachment,renderbuffertarget,renderbuffer);
}

function framebufferTexture2D(target,attachment,textarget,texture,level){
    gl.glFramebufferTexture2D(target,attachment,textarget,texture,level);
}

function frontFace(mode){
    gl.glFrontFace(mode);
}

function generateMipmap(target){
    gl.glGenerateMipmap(target);
}

function getAttribLocation(program,name){
    return  gl.glGetAttribLocation(program,name);
}

function getError(){
    return  gl.glGetError();

}

function getProgramInfoLog(program){
    return  gl.glGetProgramInfoLog(program);
}

function getShaderInfoLog(shader){
    return  gl.glGetShaderInfoLog(shader);
}

function getShaderSource(shader){
    return  gl.glGetShaderSource(shader);
}

function getUniformLocation(program,name){
    return  gl.glGetUniformLocation(program,name);
}

function getVertexAttribOffset(index,pname){
    return  gl.glGetVertexAttribOffset(index,pname);
}

function hint(target,mode){
    gl.glHint(target,mode);
}

function isBuffer(buffer){
    return  gl.glIsBuffer(buffer);
}

function isEnabled(cap){
    return  gl.glIsEnabled(cap);
}

function isFramebuffer(framebuffer){
    return  gl.glIsFramebuffer(framebuffer);
}

function isProgram(program){
    return  gl.glIsProgram(program);
}

function isRenderbuffer(renderbuffer){
    return  gl.glIsRenderbuffer(renderbuffer);
}

function isShader(shader){
    return  gl.glIsShader(shader);
}

function isTexture(texture){
    return  gl.glIsTexture(texture);
}

function lineWidth(width){
    gl.glLineWidth(width);
}

function linkProgram(program){
    gl.glLinkProgram(program);
}

function pixelStorei(pname,param){
    gl.glPixelStorei(pname,param);
}

function polygonOffset(factor,units){
    gl.glPolygonOffset(factor,units);
}

function readPixels(x,y,width,height,format,type,pixels){
    gl.glReadPixels(x,y,width,height,format,type,pixels);
}

function renderbufferStorage(target,internalformat,width,height){
    gl.glRenderbufferStorage(target,internalformat,width,height);
}

function sampleCoverage(value,invert){
    gl.glSampleCoverage(value,invert);
}

function scissor(x,y,width,height){
    gl.glScissor(x,y,width,height);
}

function shaderSource(shader,source){
    gl.glShaderSource(shader,source);
}

function stencilFunc(func,ref,mask){
    gl.glStencilFunc(func,ref,mask);
}

function stencilFuncSeparate(face,func,ref,mask){
    gl.glStencilFuncSeparate(face,func,ref,mask);
}

function stencilMask(mask){
    gl.glStencilMask(mask);
}

function stencilMaskSeparate(face,mask){
    gl.glStencilMaskSeparate(face,mask);
}

function stencilOp(fail,zfail,zpass){
    gl.glStencilOp(fail,zfail,zpass);
}

function stencilOpSeparate(face,fail,zfail,zpass){
    gl.glStencilOpSeparate(face,fail,zfail,zpass);
}

function texImage2D(target,level,internalformat/*, ...*/){
    switch (arguments.length) {
        case 6: {/*format,type,source*/
            var format = arguments[3];
            var type = arguments[4];
            var source = arguments[5];
            if (Object.prototype.hasOwnProperty.call(source, '__nativeObj')) {
                gl.glTexImage2D(target,level,internalformat,format,type,source.__nativeObj);
            } else {
                gl.glTexImage2D(target,level,internalformat,format,type,source);
            }
            break;
        }
        case 9: {/*width,height,border,format,type,pixels*/
            var width = arguments[3];
            var height = arguments[4];
            var border = arguments[5];
            var format = arguments[6];
            var type = arguments[7];
            var pixels = arguments[8];
            gl.glTexImage2D(target,level,internalformat,width,height,border,format,type,pixels);
            break;
        }
    }
}

function texParameterf(target,pname,param){
    gl.glTexParameterf(target,pname,param);
}

function texParameteri(target,pname,param){
    gl.glTexParameteri(target,pname,param);
}

function texSubImage2D(target,level,xoffset,yoffset/*...*/){
    
    switch (arguments.length) {
        case 7: {/*format,type,source*/
            var format = arguments[4];
            var type = arguments[5];
            var source = arguments[6];
            if (Object.prototype.hasOwnProperty.call(source, '__nativeObj')) {
                gl.glTexSubImage2D(target,level,xoffset,yoffset,format,type,source.__nativeObj);
            } else {
                gl.glTexSubImage2D(target,level,xoffset,yoffset,format,type,source);
            }
            break;
        }
        case 9: {/*width,height,format,type,pixels*/
            var width = arguments[4];
            var height = arguments[5];
            var format = arguments[6];
            var type = arguments[7];
            var pixels = arguments[8];
            gl.glTexSubImage2D(target,level,xoffset,yoffset,width,height,format,type,pixels);
            break;
        }
    }
}

function uniform1f(location,x){
    gl.glUniform1f(location,x);
}

function uniform2f(location,x,y){
    gl.glUniform2f(location,x,y);
}

function uniform3f(location,x,y,z){
    gl.glUniform3f(location,x,y,z);
}

function uniform4f(location,x,y,z,w){
    gl.glUniform4f(location,x,y,z,w);
}

function uniform1i(location,x){
    gl.glUniform1i(location,x);
}

function uniform2i(location,x,y){
    gl.glUniform2i(location,x,y);
}

function uniform3i(location,x,y,z){
    gl.glUniform3i(location,x,y,z);
}

function uniform4i(location,x,y,z,w){
    gl.glUniform4i(location,x,y,z,w);
}

function uniform1fv(location,v){
    gl.glUniform1fv(location,__TypedArrayGetData(v instanceof Array? new Float32Array(v) : v));
}

function uniform2fv(location,v){
    gl.glUniform2fv(location,__TypedArrayGetData(v instanceof Array? new Float32Array(v) : v));
}

function uniform3fv(location,v){
    gl.glUniform3fv(location,__TypedArrayGetData(v instanceof Array? new Float32Array(v) : v));
}

function uniform4fv(location,v){
    gl.glUniform4fv(location,__TypedArrayGetData(v instanceof Array? new Float32Array(v) : v));
}

function uniform1iv(location,v){
    gl.glUniform1iv(location,__TypedArrayGetData(v instanceof Array? new Float32Array(v) : v));
}

function uniform2iv(location,v){
    gl.glUniform2iv(location,__TypedArrayGetData(v instanceof Array? new Float32Array(v) : v));
}

function uniform3iv(location,v){
    gl.glUniform3iv(location,__TypedArrayGetData(v instanceof Array? new Float32Array(v) : v));
}

function uniform4iv(location,v){
    gl.glUniform4iv(location,__TypedArrayGetData(v instanceof Array? new Float32Array(v) : v));
}

function uniformMatrix2fv(location,transpose,value){
    BK.Script.log(0, 0, "uniform = " + value.toString());
    gl.glUniformMatrix2fv(location,transpose,__TypedArrayGetData(value instanceof Array? new Float32Array(value) : value));
}

function uniformMatrix3fv(location,transpose,value){
    gl.glUniformMatrix3fv(location,transpose,__TypedArrayGetData(value instanceof Array? new Float32Array(value) : value));
}

function uniformMatrix4fv(location,transpose,value){
    gl.glUniformMatrix4fv(location,transpose,__TypedArrayGetData(value instanceof Array? new Float32Array(value) : value));
}

function useProgram(program){
    gl.glUseProgram(program);
}

function validateProgram(program){
    gl.glValidateProgram(program);
}

function vertexAttrib1f(index,x){
    gl.glVertexAttrib1f(index,x);
}

function vertexAttrib2f(index,x,y){
    gl.glVertexAttrib2f(index,x,y);
}

function vertexAttrib3f(index,x,y,z){
    gl.glVertexAttrib3f(index,x,y,z);
}

function vertexAttrib4f(index,x,y,z,w){
    gl.glVertexAttrib4f(index,x,y,z,w);
}

function vertexAttrib1fv(index,values){
    gl.glVertexAttrib1fv(index,__TypedArrayGetData(values instanceof Array? new Float32Array(values) : values));
}

function vertexAttrib2fv(index,values){
    gl.glVertexAttrib2fv(index,__TypedArrayGetData(values instanceof Array? new Float32Array(values) : values));
}

function vertexAttrib3fv(index,values){
    gl.glVertexAttrib3fv(index,__TypedArrayGetData(values instanceof Array? new Float32Array(values) : values));
}

function vertexAttrib4fv(index,values){
    gl.glVertexAttrib4fv(index,__TypedArrayGetData(values instanceof Array? new Float32Array(values) : values));
}

function vertexAttribPointer(index,size,type,normalized,stride,offset){
    gl.glVertexAttribPointer(index,size,type,normalized,stride,offset);
}

function viewport(x,y,width,height){
    gl.glViewport(x,y,width,height);
}

function getActiveAttrib(program,index){
	return gl.glGetActiveAttrib(program,index);
}

function getActiveUniform(program,index){
	return gl.glGetActiveUniform(program,index);
}

function getAttachedShaders(program){
	return gl.glGetAttachedShaders(program);
}

function getBufferParameter(target,pname){
	return gl.glGetBufferParameter(target,pname);
}

function getFramebufferAttachmentParameter(target,attachment,pname){
	return gl.glGetFramebufferAttachmentParameter(target,attachment,pname);
}

function getProgramParameter(program,pname){
	return gl.glGetProgramParameter(program,pname);
}

function getRenderbufferParameter(target,pname){
	return gl.glGetRenderbufferParameter(target,pname);
}

function getShaderParameter(shader,pname){
	return gl.glGetShaderParameter(shader,pname);
}

function getTexParameter(target,pname){
	return gl.glGetTexParameter(target,pname);
}

function getVertexAttrib(index,pname){
	return gl.glGetVertexAttrib(index,pname);
}

function getUniform(program,location){
    return gl.glGetUniform(program,location);
}

function getParameter(pname){
    switch (pname) {
        case gl.ACTIVE_TEXTURE:
        case gl.ALPHA_BITS:
        case gl.ARRAY_BUFFER_BINDING:
        case gl.BLUE_BITS:
        case gl.CULL_FACE_MODE:
        case gl.CURRENT_PROGRAM:
        case gl.DEPTH_BITS:
        case gl.DEPTH_FUNC:
        case gl.ELEMENT_ARRAY_BUFFER_BINDING:
        case gl.FRAMEBUFFER_BINDING:
        case gl.FRONT_FACE:
        case gl.GENERATE_MIPMAP_HINT:
        case gl.GREEN_BITS:
        case gl.IMPLEMENTATION_COLOR_READ_FORMAT:
        case gl.IMPLEMENTATION_COLOR_READ_TYPE:
        case gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS:
        case gl.MAX_CUBE_MAP_TEXTURE_SIZE:
        case gl.MAX_FRAGMENT_UNIFORM_VECTORS:
        case gl.MAX_RENDERBUFFER_SIZE:
        case gl.MAX_TEXTURE_IMAGE_UNITS:
        case gl.MAX_TEXTURE_SIZE:
        case gl.MAX_VARYING_VECTORS:
        case gl.MAX_VERTEX_ATTRIBS:
        case gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS:
        case gl.MAX_VERTEX_UNIFORM_VECTORS:
        case gl.MAX_VIEWPORT_DIMS:
        case gl.NUM_COMPRESSED_TEXTURE_FORMATS:
        case gl.NUM_SHADER_BINARY_FORMATS:
        case gl.PACK_ALIGNMENT:
        case gl.RED_BITS:
        case gl.RENDERBUFFER_BINDING:
        case gl.SAMPLE_BUFFERS:
        case gl.SAMPLES:
        case gl.STENCIL_BACK_FAIL:
        case gl.STENCIL_BACK_FUNC:
        case gl.STENCIL_BACK_PASS_DEPTH_FAIL:
        case gl.STENCIL_BACK_PASS_DEPTH_PASS:
        case gl.STENCIL_BACK_REF:
        case gl.STENCIL_BACK_VALUE_MASK:
        case gl.STENCIL_BACK_WRITEMASK:
        case gl.STENCIL_BITS:
        case gl.STENCIL_CLEAR_VALUE:
        case gl.STENCIL_FAIL:
        case gl.STENCIL_FUNC:
        case gl.STENCIL_PASS_DEPTH_FAIL:
        case gl.STENCIL_PASS_DEPTH_PASS:
        case gl.STENCIL_REF:
        case gl.STENCIL_VALUE_MASK:
        case gl.STENCIL_WRITEMASK:
        case gl.SUBPIXEL_BITS:
        case gl.TEXTURE_BINDING_2D:
        case gl.TEXTURE_BINDING_CUBE_MAP:
        case gl.UNPACK_ALIGNMENT:
        case gl.BLEND_DST_ALPHA:
        case gl.BLEND_DST_RGB:
        case gl.BLEND_EQUATION_ALPHA:
        case gl.BLEND_EQUATION_RGB:
        case gl.BLEND_SRC_ALPHA:
        case gl.BLEND_SRC_RGB:
        {
            return gl.glGetParameterInt(pname,1);
            break;
        }
        case gl.ALIASED_LINE_WIDTH_RANGE:
        case gl.ALIASED_POINT_SIZE_RANGE:
        case gl.DEPTH_RANGE:
        case gl.MAX_VIEWPORT_DIMS:
        {
            return gl.glGetParameterFloat(pname,2);
            break;
        }
        case gl.BLEND:
        case gl.CULL_FACE:
        case gl.DEPTH_TEST:
        case gl.DEPTH_WRITEMASK:
        case gl.DITHER:
        case gl.POLYGON_OFFSET_FILL:
        case gl.SAMPLE_ALPHA_TO_COVERAGE:
        case gl.SAMPLE_COVERAGE:
        case gl.SAMPLE_COVERAGE_INVERT:
        case gl.SCISSOR_TEST:
        case gl.SHADER_COMPILER:
        case gl.STENCIL_TEST:
        {
            return gl.glGetParameterBool(pname,1);
            break;
        }
        case gl.BLEND_COLOR:
        case gl.COLOR_CLEAR_VALUE:
        {
            return gl.glGetParameterFloat(pname,4);
            break;
        }
        case gl.SCISSOR_BOX:
        case gl.VIEWPORT:
        {
            return gl.glGetParameterInt(pname,4);
            break;
        }
        case gl.COLOR_WRITEMASK:
        {
            return gl.glGetParameterBool(pname,4);
            break;
        }
        case gl.POLYGON_OFFSET_FACTOR:
        case gl.POLYGON_OFFSET_UNITS:
        case gl.SAMPLE_COVERAGE_VALUE:
        {
            return gl.glGetParameterFloat(pname,1);
            break;
        }
        case gl.SHADER_BINARY_FORMATS:
        {
            var len = gl.glGetParameterInt(gl.NUM_SHADER_BINARY_FORMATS,1);
            BK.Script.log(1,1,"eeee len="+len);
            return gl.glGetParameterInt(pname,len);
            break;
        }
        case gl.COMPRESSED_TEXTURE_FORMATS:
        {
            var len = gl.glGetParameterInt(gl.NUM_COMPRESSED_TEXTURE_FORMATS,1);
            return gl.glGetParameterInt(pname,len);
            break;
        }

            
        default:
            break;
    }
}

function attachMethod(){
	gl.activeTexture = activeTexture;
    gl.attachShader = attachShader;
    gl.bindAttribLocation = bindAttribLocation;
    gl.bindBuffer = bindBuffer;
    gl.bindFramebuffer = bindFramebuffer;
    gl.bindRenderbuffer = bindRenderbuffer;
    gl.bindTexture = bindTexture;
    gl.blendColor = blendColor;
    gl.blendEquation = blendEquation;
    gl.blendEquationSeparate = blendEquationSeparate;
    gl.blendFunc = blendFunc;
    gl.blendFuncSeparate = blendFuncSeparate;
    gl.bufferData = bufferData;
    gl.bufferData = bufferData;
    gl.bufferSubData = bufferSubData;
    gl.checkFramebufferStatus = checkFramebufferStatus;
    gl.clear = clear;
    gl.clearColor = clearColor;
    gl.clearDepth = clearDepth;
    gl.clearStencil = clearStencil;
    gl.colorMask = colorMask;
    gl.compileShader = compileShader;
    gl.compressedTexImage2D = compressedTexImage2D;
    gl.compressedTexSubImage2D = compressedTexSubImage2D;
    gl.copyTexImage2D = copyTexImage2D;
    gl.copyTexSubImage2D = copyTexSubImage2D;
    gl.createBuffer = createBuffer;
    gl.createFramebuffer = createFramebuffer;
    gl.createProgram = createProgram;
    gl.createRenderbuffer = createRenderbuffer;
    gl.createShader = createShader;
    gl.createTexture = createTexture;
    gl.cullFace = cullFace;
    gl.deleteBuffer = deleteBuffer;
    gl.deleteFramebuffer = deleteFramebuffer;
    gl.deleteProgram = deleteProgram;
    gl.deleteRenderbuffer = deleteRenderbuffer;
    gl.deleteShader = deleteShader;
    gl.deleteTexture = deleteTexture;
    gl.depthFunc = depthFunc;
    gl.depthMask = depthMask;
    gl.depthRange = depthRange;
    gl.detachShader = detachShader;
    gl.disable = disable;
    gl.disableVertexAttribArray = disableVertexAttribArray;
    gl.drawArrays = drawArrays;
    gl.drawElements = drawElements;
    gl.enable = enable;
    gl.enableVertexAttribArray = enableVertexAttribArray;
    gl.finish = finish;
    gl.flush = flush;
    gl.framebufferRenderbuffer = framebufferRenderbuffer;
    gl.framebufferTexture2D = framebufferTexture2D;
    gl.frontFace = frontFace;
    gl.generateMipmap = generateMipmap;
    gl.getAttribLocation = getAttribLocation;
    gl.getError = getError;
    gl.getProgramInfoLog = getProgramInfoLog;
    gl.getShaderInfoLog = getShaderInfoLog;
    gl.getShaderSource = getShaderSource;
    gl.getUniformLocation = getUniformLocation;
    gl.getVertexAttribOffset = getVertexAttribOffset;
    gl.hint = hint;
    gl.isBuffer = isBuffer;
    gl.isEnabled = isEnabled;
    gl.isFramebuffer = isFramebuffer;
    gl.isProgram = isProgram;
    gl.isRenderbuffer = isRenderbuffer;
    gl.isShader = isShader;
    gl.isTexture = isTexture;
    gl.lineWidth = lineWidth;
    gl.linkProgram = linkProgram;
    gl.pixelStorei = pixelStorei;
    gl.polygonOffset = polygonOffset;
    gl.readPixels = readPixels;
    gl.renderbufferStorage = renderbufferStorage;
    gl.sampleCoverage = sampleCoverage;
    gl.scissor = scissor;
    gl.shaderSource = shaderSource;
    gl.stencilFunc = stencilFunc;
    gl.stencilFuncSeparate = stencilFuncSeparate;
    gl.stencilMask = stencilMask;
    gl.stencilMaskSeparate = stencilMaskSeparate;
    gl.stencilOp = stencilOp;
    gl.stencilOpSeparate = stencilOpSeparate;
    gl.texImage2D = texImage2D;
    gl.texSubImage2D = texSubImage2D;
    gl.texParameterf = texParameterf;
    gl.texParameteri = texParameteri;
    gl.uniform1f = uniform1f;
    gl.uniform2f = uniform2f;
    gl.uniform3f = uniform3f;
    gl.uniform4f = uniform4f;
    gl.uniform1i = uniform1i;
    gl.uniform2i = uniform2i;
    gl.uniform3i = uniform3i;
    gl.uniform4i = uniform4i;
    gl.uniform1fv = uniform1fv;
    gl.uniform2fv = uniform2fv;
    gl.uniform3fv = uniform3fv;
    gl.uniform4fv = uniform4fv;
    gl.uniform1iv = uniform1iv;
    gl.uniform2iv = uniform2iv;
    gl.uniform3iv = uniform3iv;
    gl.uniform4iv = uniform4iv;
    gl.uniformMatrix2fv = uniformMatrix2fv;
    gl.uniformMatrix3fv = uniformMatrix3fv;
    gl.uniformMatrix4fv = uniformMatrix4fv;
    gl.useProgram = useProgram;
    gl.validateProgram = validateProgram;
    gl.vertexAttrib1f = vertexAttrib1f;
    gl.vertexAttrib2f = vertexAttrib2f;
    gl.vertexAttrib3f = vertexAttrib3f;
    gl.vertexAttrib4f = vertexAttrib4f;
    gl.vertexAttrib1fv = vertexAttrib1fv;
    gl.vertexAttrib2fv = vertexAttrib2fv;
    gl.vertexAttrib3fv = vertexAttrib3fv;
    gl.vertexAttrib4fv = vertexAttrib4fv;
    gl.vertexAttribPointer = vertexAttribPointer;
    gl.viewport = viewport;
    gl.getActiveAttrib = getActiveAttrib;
    gl.getActiveUniform = getActiveUniform;
    gl.getAttachedShaders = getAttachedShaders;
    gl.getBufferParameter = getBufferParameter;
    gl.getFramebufferAttachmentParameter = getFramebufferAttachmentParameter;
    gl.getProgramParameter = getProgramParameter;
    gl.getRenderbufferParameter = getRenderbufferParameter;
    gl.getShaderParameter = getShaderParameter;
    gl.getTexParameter = getTexParameter;
    gl.getVertexAttrib = getVertexAttrib;
    gl.getParameter = getParameter;
    gl.getUniform = getUniform;
}

function attatchConst(){
	/* ClearBufferMask */
    gl.DEPTH_BUFFER_BIT               = 0x00000100;
    gl.STENCIL_BUFFER_BIT             = 0x00000400;
    gl.COLOR_BUFFER_BIT               = 0x00004000;

    /* BeginMode */
    gl.POINTS                         = 0x0000;
    gl.LINES                          = 0x0001;
    gl.LINE_LOOP                      = 0x0002;
    gl.LINE_STRIP                     = 0x0003;
    gl.TRIANGLES                      = 0x0004;
    gl.TRIANGLE_STRIP                 = 0x0005;
    gl.TRIANGLE_FAN                   = 0x0006;

    /* AlphaFunction (not supported in ES20) */
    /*      NEVER */
    /*      LESS */
    /*      EQUAL */
    /*      LEQUAL */
    /*      GREATER */
    /*      NOTEQUAL */
    /*      GEQUAL */
    /*      ALWAYS */

    /* BlendingFactorDest */
    gl.ZERO                           = 0;
    gl.ONE                            = 1;
    gl.SRC_COLOR                      = 0x0300;
    gl.ONE_MINUS_SRC_COLOR            = 0x0301;
    gl.SRC_ALPHA                      = 0x0302;
    gl.ONE_MINUS_SRC_ALPHA            = 0x0303;
    gl.DST_ALPHA                      = 0x0304;
    gl.ONE_MINUS_DST_ALPHA            = 0x0305;

    /* BlendingFactorSrc */
    /*      ZERO */
    /*      ONE */
    gl.DST_COLOR                      = 0x0306;
    gl.ONE_MINUS_DST_COLOR            = 0x0307;
    gl.SRC_ALPHA_SATURATE             = 0x0308;
    /*      SRC_ALPHA */
    /*      ONE_MINUS_SRC_ALPHA */
    /*      DST_ALPHA */
    /*      ONE_MINUS_DST_ALPHA */

    /* BlendEquationSeparate */
    gl.FUNC_ADD                       = 0x8006;
    gl.BLEND_EQUATION                 = 0x8009;
    gl.BLEND_EQUATION_RGB             = 0x8009;   /* same as BLEND_EQUATION */
    gl.BLEND_EQUATION_ALPHA           = 0x883D;

    /* BlendSubtract */
    gl.FUNC_SUBTRACT                  = 0x800A;
    gl.FUNC_REVERSE_SUBTRACT          = 0x800B;

    /* Separate Blend Functions */
    gl.BLEND_DST_RGB                  = 0x80C8;
    gl.BLEND_SRC_RGB                  = 0x80C9;
    gl.BLEND_DST_ALPHA                = 0x80CA;
    gl.BLEND_SRC_ALPHA                = 0x80CB;
    gl.CONSTANT_COLOR                 = 0x8001;
    gl.ONE_MINUS_CONSTANT_COLOR       = 0x8002;
    gl.CONSTANT_ALPHA                 = 0x8003;
    gl.ONE_MINUS_CONSTANT_ALPHA       = 0x8004;
    gl.BLEND_COLOR                    = 0x8005;

    /* Buffer Objects */
    gl.ARRAY_BUFFER                   = 0x8892;
    gl.ELEMENT_ARRAY_BUFFER           = 0x8893;
    gl.ARRAY_BUFFER_BINDING           = 0x8894;
    gl.ELEMENT_ARRAY_BUFFER_BINDING   = 0x8895;

    gl.STREAM_DRAW                    = 0x88E0;
    gl.STATIC_DRAW                    = 0x88E4;
    gl.DYNAMIC_DRAW                   = 0x88E8;

    gl.BUFFER_SIZE                    = 0x8764;
    gl.BUFFER_USAGE                   = 0x8765;

    gl.CURRENT_VERTEX_ATTRIB          = 0x8626;

    /* CullFaceMode */
    gl.FRONT                          = 0x0404;
    gl.BACK                           = 0x0405;
    gl.FRONT_AND_BACK                 = 0x0408;

    /* DepthFunction */
    /*      NEVER */
    /*      LESS */
    /*      EQUAL */
    /*      LEQUAL */
    /*      GREATER */
    /*      NOTEQUAL */
    /*      GEQUAL */
    /*      ALWAYS */

    /* EnableCap */
    /* TEXTURE_2D */
    gl.CULL_FACE                      = 0x0B44;
    gl.BLEND                          = 0x0BE2;
    gl.DITHER                         = 0x0BD0;
    gl.STENCIL_TEST                   = 0x0B90;
    gl.DEPTH_TEST                     = 0x0B71;
    gl.SCISSOR_TEST                   = 0x0C11;
    gl.POLYGON_OFFSET_FILL            = 0x8037;
    gl.SAMPLE_ALPHA_TO_COVERAGE       = 0x809E;
    gl.SAMPLE_COVERAGE                = 0x80A0;

    /* ErrorCode */
    gl.NO_ERROR                       = 0;
    gl.INVALID_ENUM                   = 0x0500;
    gl.INVALID_VALUE                  = 0x0501;
    gl.INVALID_OPERATION              = 0x0502;
    gl.OUT_OF_MEMORY                  = 0x0505;

    /* FrontFaceDirection */
    gl.CW                             = 0x0900;
    gl.CCW                            = 0x0901;

    /* GetPName */
    gl.LINE_WIDTH                     = 0x0B21;
    gl.ALIASED_POINT_SIZE_RANGE       = 0x846D;
    gl.ALIASED_LINE_WIDTH_RANGE       = 0x846E;
    gl.CULL_FACE_MODE                 = 0x0B45;
    gl.FRONT_FACE                     = 0x0B46;
    gl.DEPTH_RANGE                    = 0x0B70;
    gl.DEPTH_WRITEMASK                = 0x0B72;
    gl.DEPTH_CLEAR_VALUE              = 0x0B73;
    gl.DEPTH_FUNC                     = 0x0B74;
    gl.STENCIL_CLEAR_VALUE            = 0x0B91;
    gl.STENCIL_FUNC                   = 0x0B92;
    gl.STENCIL_FAIL                   = 0x0B94;
    gl.STENCIL_PASS_DEPTH_FAIL        = 0x0B95;
    gl.STENCIL_PASS_DEPTH_PASS        = 0x0B96;
    gl.STENCIL_REF                    = 0x0B97;
    gl.STENCIL_VALUE_MASK             = 0x0B93;
    gl.STENCIL_WRITEMASK              = 0x0B98;
    gl.STENCIL_BACK_FUNC              = 0x8800;
    gl.STENCIL_BACK_FAIL              = 0x8801;
    gl.STENCIL_BACK_PASS_DEPTH_FAIL   = 0x8802;
    gl.STENCIL_BACK_PASS_DEPTH_PASS   = 0x8803;
    gl.STENCIL_BACK_REF               = 0x8CA3;
    gl.STENCIL_BACK_VALUE_MASK        = 0x8CA4;
    gl.STENCIL_BACK_WRITEMASK         = 0x8CA5;
    gl.VIEWPORT                       = 0x0BA2;
    gl.SCISSOR_BOX                    = 0x0C10;
    /*      SCISSOR_TEST */
    gl.COLOR_CLEAR_VALUE              = 0x0C22;
    gl.COLOR_WRITEMASK                = 0x0C23;
    gl.UNPACK_ALIGNMENT               = 0x0CF5;
    gl.PACK_ALIGNMENT                 = 0x0D05;
    gl.MAX_TEXTURE_SIZE               = 0x0D33;
    gl.MAX_VIEWPORT_DIMS              = 0x0D3A;
    gl.SUBPIXEL_BITS                  = 0x0D50;
    gl.RED_BITS                       = 0x0D52;
    gl.GREEN_BITS                     = 0x0D53;
    gl.BLUE_BITS                      = 0x0D54;
    gl.ALPHA_BITS                     = 0x0D55;
    gl.DEPTH_BITS                     = 0x0D56;
    gl.STENCIL_BITS                   = 0x0D57;
    gl.POLYGON_OFFSET_UNITS           = 0x2A00;
    /*      POLYGON_OFFSET_FILL */
    gl.POLYGON_OFFSET_FACTOR          = 0x8038;
    gl.TEXTURE_BINDING_2D             = 0x8069;
    gl.SAMPLE_BUFFERS                 = 0x80A8;
    gl.SAMPLES                        = 0x80A9;
    gl.SAMPLE_COVERAGE_VALUE          = 0x80AA;
    gl.SAMPLE_COVERAGE_INVERT         = 0x80AB;

    /* GetTextureParameter */
    /*      TEXTURE_MAG_FILTER */
    /*      TEXTURE_MIN_FILTER */
    /*      TEXTURE_WRAP_S */
    /*      TEXTURE_WRAP_T */

    gl.COMPRESSED_TEXTURE_FORMATS     = 0x86A3;

    /* HintMode */
    gl.DONT_CARE                      = 0x1100;
    gl.FASTEST                        = 0x1101;
    gl.NICEST                         = 0x1102;

    /* HintTarget */
    gl.GENERATE_MIPMAP_HINT            = 0x8192;

    /* DataType */
    gl.BYTE                           = 0x1400;
    gl.UNSIGNED_BYTE                  = 0x1401;
    gl.SHORT                          = 0x1402;
    gl.UNSIGNED_SHORT                 = 0x1403;
    gl.INT                            = 0x1404;
    gl.UNSIGNED_INT                   = 0x1405;
    gl.FLOAT                          = 0x1406;

    /* PixelFormat */
    gl.DEPTH_COMPONENT                = 0x1902;
    gl.ALPHA                          = 0x1906;
    gl.RGB                            = 0x1907;
    gl.RGBA                           = 0x1908;
    gl.LUMINANCE                      = 0x1909;
    gl.LUMINANCE_ALPHA                = 0x190A;

    /* PixelType */
    /*      UNSIGNED_BYTE */
    gl.UNSIGNED_SHORT_4_4_4_4         = 0x8033;
    gl.UNSIGNED_SHORT_5_5_5_1         = 0x8034;
    gl.UNSIGNED_SHORT_5_6_5           = 0x8363;

    /* Shaders */
    gl.FRAGMENT_SHADER                  = 0x8B30;
    gl.VERTEX_SHADER                    = 0x8B31;
    gl.MAX_VERTEX_ATTRIBS               = 0x8869;
    gl.MAX_VERTEX_UNIFORM_VECTORS       = 0x8DFB;
    gl.MAX_VARYING_VECTORS              = 0x8DFC;
    gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS = 0x8B4D;
    gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS   = 0x8B4C;
    gl.MAX_TEXTURE_IMAGE_UNITS          = 0x8872;
    gl.MAX_FRAGMENT_UNIFORM_VECTORS     = 0x8DFD;
    gl.SHADER_TYPE                      = 0x8B4F;
    gl.DELETE_STATUS                    = 0x8B80;
    gl.LINK_STATUS                      = 0x8B82;
    gl.VALIDATE_STATUS                  = 0x8B83;
    gl.ATTACHED_SHADERS                 = 0x8B85;
    gl.ACTIVE_UNIFORMS                  = 0x8B86;
    gl.ACTIVE_ATTRIBUTES                = 0x8B89;
    gl.SHADING_LANGUAGE_VERSION         = 0x8B8C;
    gl.CURRENT_PROGRAM                  = 0x8B8D;

    /* StencilFunction */
    gl.NEVER                          = 0x0200;
    gl.LESS                           = 0x0201;
    gl.EQUAL                          = 0x0202;
    gl.LEQUAL                         = 0x0203;
    gl.GREATER                        = 0x0204;
    gl.NOTEQUAL                       = 0x0205;
    gl.GEQUAL                         = 0x0206;
    gl.ALWAYS                         = 0x0207;

    /* StencilOp */
    /*      ZERO */
    gl.KEEP                           = 0x1E00;
    gl.REPLACE                        = 0x1E01;
    gl.INCR                           = 0x1E02;
    gl.DECR                           = 0x1E03;
    gl.INVERT                         = 0x150A;
    gl.INCR_WRAP                      = 0x8507;
    gl.DECR_WRAP                      = 0x8508;

    /* StringName */
    gl.VENDOR                         = 0x1F00;
    gl.RENDERER                       = 0x1F01;
    gl.VERSION                        = 0x1F02;

    /* TextureMagFilter */
    gl.NEAREST                        = 0x2600;
    gl.LINEAR                         = 0x2601;

    /* TextureMinFilter */
    /*      NEAREST */
    /*      LINEAR */
    gl.NEAREST_MIPMAP_NEAREST         = 0x2700;
    gl.LINEAR_MIPMAP_NEAREST          = 0x2701;
    gl.NEAREST_MIPMAP_LINEAR          = 0x2702;
    gl.LINEAR_MIPMAP_LINEAR           = 0x2703;

    /* TextureParameterName */
    gl.TEXTURE_MAG_FILTER             = 0x2800;
    gl.TEXTURE_MIN_FILTER             = 0x2801;
    gl.TEXTURE_WRAP_S                 = 0x2802;
    gl.TEXTURE_WRAP_T                 = 0x2803;

    /* TextureTarget */
    gl.TEXTURE_2D                     = 0x0DE1;
    gl.TEXTURE                        = 0x1702;

    gl.TEXTURE_CUBE_MAP               = 0x8513;
    gl.TEXTURE_BINDING_CUBE_MAP       = 0x8514;
    gl.TEXTURE_CUBE_MAP_POSITIVE_X    = 0x8515;
    gl.TEXTURE_CUBE_MAP_NEGATIVE_X    = 0x8516;
    gl.TEXTURE_CUBE_MAP_POSITIVE_Y    = 0x8517;
    gl.TEXTURE_CUBE_MAP_NEGATIVE_Y    = 0x8518;
    gl.TEXTURE_CUBE_MAP_POSITIVE_Z    = 0x8519;
    gl.TEXTURE_CUBE_MAP_NEGATIVE_Z    = 0x851A;
    gl.MAX_CUBE_MAP_TEXTURE_SIZE      = 0x851C;

    /* TextureUnit */
    gl.TEXTURE0                       = 0x84C0;
    gl.TEXTURE1                       = 0x84C1;
    gl.TEXTURE2                       = 0x84C2;
    gl.TEXTURE3                       = 0x84C3;
    gl.TEXTURE4                       = 0x84C4;
    gl.TEXTURE5                       = 0x84C5;
    gl.TEXTURE6                       = 0x84C6;
    gl.TEXTURE7                       = 0x84C7;
    gl.TEXTURE8                       = 0x84C8;
    gl.TEXTURE9                       = 0x84C9;
    gl.TEXTURE10                      = 0x84CA;
    gl.TEXTURE11                      = 0x84CB;
    gl.TEXTURE12                      = 0x84CC;
    gl.TEXTURE13                      = 0x84CD;
    gl.TEXTURE14                      = 0x84CE;
    gl.TEXTURE15                      = 0x84CF;
    gl.TEXTURE16                      = 0x84D0;
    gl.TEXTURE17                      = 0x84D1;
    gl.TEXTURE18                      = 0x84D2;
    gl.TEXTURE19                      = 0x84D3;
    gl.TEXTURE20                      = 0x84D4;
    gl.TEXTURE21                      = 0x84D5;
    gl.TEXTURE22                      = 0x84D6;
    gl.TEXTURE23                      = 0x84D7;
    gl.TEXTURE24                      = 0x84D8;
    gl.TEXTURE25                      = 0x84D9;
    gl.TEXTURE26                      = 0x84DA;
    gl.TEXTURE27                      = 0x84DB;
    gl.TEXTURE28                      = 0x84DC;
    gl.TEXTURE29                      = 0x84DD;
    gl.TEXTURE30                      = 0x84DE;
    gl.TEXTURE31                      = 0x84DF;
    gl.ACTIVE_TEXTURE                 = 0x84E0;

    /* TextureWrapMode */
    gl.REPEAT                         = 0x2901;
    gl.CLAMP_TO_EDGE                  = 0x812F;
    gl.MIRRORED_REPEAT                = 0x8370;

    /* Uniform Types */
    gl.FLOAT_VEC2                     = 0x8B50;
    gl.FLOAT_VEC3                     = 0x8B51;
    gl.FLOAT_VEC4                     = 0x8B52;
    gl.INT_VEC2                       = 0x8B53;
    gl.INT_VEC3                       = 0x8B54;
    gl.INT_VEC4                       = 0x8B55;
    gl.BOOL                           = 0x8B56;
    gl.BOOL_VEC2                      = 0x8B57;
    gl.BOOL_VEC3                      = 0x8B58;
    gl.BOOL_VEC4                      = 0x8B59;
    gl.FLOAT_MAT2                     = 0x8B5A;
    gl.FLOAT_MAT3                     = 0x8B5B;
    gl.FLOAT_MAT4                     = 0x8B5C;
    gl.SAMPLER_2D                     = 0x8B5E;
    gl.SAMPLER_CUBE                   = 0x8B60;

    /* Vertex Arrays */
    gl.VERTEX_ATTRIB_ARRAY_ENABLED        = 0x8622;
    gl.VERTEX_ATTRIB_ARRAY_SIZE           = 0x8623;
    gl.VERTEX_ATTRIB_ARRAY_STRIDE         = 0x8624;
    gl.VERTEX_ATTRIB_ARRAY_TYPE           = 0x8625;
    gl.VERTEX_ATTRIB_ARRAY_NORMALIZED     = 0x886A;
    gl.VERTEX_ATTRIB_ARRAY_POINTER        = 0x8645;
    gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING = 0x889F;

    /* Read Format */
    gl.IMPLEMENTATION_COLOR_READ_TYPE   = 0x8B9A;
    gl.IMPLEMENTATION_COLOR_READ_FORMAT = 0x8B9B;

    /* Shader Source */
    gl.COMPILE_STATUS                 = 0x8B81;

    /* Shader Precision-Specified Types */
    gl.LOW_FLOAT                      = 0x8DF0;
    gl.MEDIUM_FLOAT                   = 0x8DF1;
    gl.HIGH_FLOAT                     = 0x8DF2;
    gl.LOW_INT                        = 0x8DF3;
    gl.MEDIUM_INT                     = 0x8DF4;
    gl.HIGH_INT                       = 0x8DF5;

    /* Framebuffer Object. */
    gl.FRAMEBUFFER                    = 0x8D40;
    gl.RENDERBUFFER                   = 0x8D41;

    gl.RGBA4                          = 0x8056;
    gl.RGB5_A1                        = 0x8057;
    gl.RGB565                         = 0x8D62;
    gl.DEPTH_COMPONENT16              = 0x81A5;
    gl.STENCIL_INDEX8                 = 0x8D48;
    gl.DEPTH_STENCIL                  = 0x84F9;

    gl.RENDERBUFFER_WIDTH             = 0x8D42;
    gl.RENDERBUFFER_HEIGHT            = 0x8D43;
    gl.RENDERBUFFER_INTERNAL_FORMAT   = 0x8D44;
    gl.RENDERBUFFER_RED_SIZE          = 0x8D50;
    gl.RENDERBUFFER_GREEN_SIZE        = 0x8D51;
    gl.RENDERBUFFER_BLUE_SIZE         = 0x8D52;
    gl.RENDERBUFFER_ALPHA_SIZE        = 0x8D53;
    gl.RENDERBUFFER_DEPTH_SIZE        = 0x8D54;
    gl.RENDERBUFFER_STENCIL_SIZE      = 0x8D55;

    gl.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE           = 0x8CD0;
    gl.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME           = 0x8CD1;
    gl.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL         = 0x8CD2;
    gl.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE = 0x8CD3;

    gl.COLOR_ATTACHMENT0              = 0x8CE0;
    gl.DEPTH_ATTACHMENT               = 0x8D00;
    gl.STENCIL_ATTACHMENT             = 0x8D20;
    gl.DEPTH_STENCIL_ATTACHMENT       = 0x821A;

    gl.NONE                           = 0;

    gl.FRAMEBUFFER_COMPLETE                      = 0x8CD5;
    gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT         = 0x8CD6;
    gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 0x8CD7;
    gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS         = 0x8CD9;
    gl.FRAMEBUFFER_UNSUPPORTED                   = 0x8CDD;

    gl.FRAMEBUFFER_BINDING            = 0x8CA6;
    gl.RENDERBUFFER_BINDING           = 0x8CA7;
    gl.MAX_RENDERBUFFER_SIZE          = 0x84E8;

    gl.INVALID_FRAMEBUFFER_OPERATION  = 0x0506;

    /* WebGL-specific enums */
    gl.UNPACK_FLIP_Y_WEBGL            = 0x9240;
    gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL = 0x9241;
    gl.CONTEXT_LOST_WEBGL             = 0x9242;
    gl.UNPACK_COLORSPACE_CONVERSION_WEBGL = 0x9243;
    gl.BROWSER_DEFAULT_WEBGL          = 0x9244;
    
    gl.SHADER_BINARY_FORMATS          = 0x8DF8;       
    gl.NUM_SHADER_BINARY_FORMATS      = 0x8DF9;
    gl.NUM_COMPRESSED_TEXTURE_FORMATS = 0x86A2;
}

