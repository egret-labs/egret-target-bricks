var yuv_vs = "attribute vec3 Position;\
attribute vec2 TexCoordIn;\
attribute vec4 SourceColor;\
uniform mat4 ModelView;\
uniform mat4 Projection;\
varying vec4 DestColor;\
varying vec2 TexCoordOut;\
void main()\
{\
    mat4 gWVP = Projection * ModelView;\
    gl_Position = gWVP * vec4(Position, 1);\
    DestColor = SourceColor;\
    TexCoordOut = TexCoordIn;\
}";
var yuv_fs = "varying lowp vec2 TexCoordOut;\
uniform int formatYUV;\
uniform sampler2D samplerY;\
uniform sampler2D samplerU;\
uniform sampler2D samplerV;\
uniform sampler2D samplerUV;\
const lowp vec3 defyuv = vec3(-0.0/255.0, -128.0/255.0, -128.0/255.0);\
void main(void)\
{\
    lowp vec3 yuv = vec3(0.0);\
    if (formatYUV == 0) {\
        yuv.x = texture2D(samplerY, TexCoordOut).r;\
        yuv.y = texture2D(samplerU, TexCoordOut).r;\
        yuv.z = texture2D(samplerV, TexCoordOut).r;\
        yuv += defyuv;\
    } else if (formatYUV == 1) {\
        yuv.x = texture2D(samplerY, TexCoordOut).r;\
        yuv.y = texture2D(samplerUV, TexCoordOut).a;\
        yuv.z = texture2D(samplerUV, TexCoordOut).r;\
        yuv += defyuv;\
    } else if (formatYUV == 3) {\
        yuv.x = texture2D(samplerY, TexCoordOut).r;\
        yuv.y = texture2D(samplerUV, TexCoordOut).r;\
        yuv.z = texture2D(samplerUV, TexCoordOut).a;\
        yuv += defyuv;\
    }\
    lowp vec3 rgb = mat3(1.0, 1.0, 1.0,\
                        0.0, -.34414, 1.772,\
                        1.402, -.71414, 0.0) * yuv;\
    gl_FragColor = vec4(rgb, 1.0);\
}";
var QAVFrameDesc = (function () {
    function QAVFrameDesc() {
    }
    return QAVFrameDesc;
}());
var QAVVideoFrame = (function () {
    function QAVVideoFrame() {
    }
    return QAVVideoFrame;
}());
var QAVManager = (function () {
    function QAVManager() {
        this.videoViews = new Array();
        BK.Director.setQAVDelegate(this);
    }
    QAVManager.prototype.addView = function (view) {
        var resViews = this.videoViews.filter(function (view_) {
            return view == view_;
        });
        if (!resViews.length) {
            this.videoViews.push(view);
        }
        return resViews.length == 0;
    };
    QAVManager.prototype.delView = function (view) {
        var length = this.videoViews.length;
        this.videoViews = this.videoViews.filter(function (view_) {
            return view != view_;
        });
        return length != this.videoViews.length;
    };
    //@ QAVRemoteVideoDelegate
    QAVManager.prototype.onRemoveVideoPreview = function (frameData) {
        this.videoViews.forEach(function (view) {
            if (view.identifier == frameData.identifier) {
                view.render(frameData);
            }
        });
    };
    //@ QAVLocalVideoDelegate
    QAVManager.prototype.onLocalVideoPreview = function (frameData) {
        //BK.Script.log(1, 0, "onLocalVideoPreview!frameData = " + JSON.stringify(frameData));
        this.videoViews.forEach(function (view) {
            if (view.identifier == frameData.identifier) {
                var videoFrame = frameData;
                var cameraMgr = (view);
                if (cameraMgr.onPrePreview) {
                    videoFrame = cameraMgr.onPrePreview.call(cameraMgr, frameData);
                }
                view.render(videoFrame);
            }
        });
    };
    QAVManager.prototype.onLocalVideoPreProcess = function (frameData) {
        //BK.Script.log(1, 0, "onLocalVideoPreProcess!frameData = " + JSON.stringify(frameData));
        this.videoViews.forEach(function (view) {
            if (view.identifier == frameData.identifier) {
                var cameraMgr = (view);
                if (cameraMgr.onPreProcess) {
                    cameraMgr.onPreProcess.call(cameraMgr, frameData);
                }
            }
        });
    };
    return QAVManager;
}());
QAVManager.Instance = new QAVManager;
var QAVView = (function () {
    function QAVView(identifier, width, height, autoAddMgr, parent, position, zOrder) {
        if (autoAddMgr === void 0) { autoAddMgr = true; }
        this.identifier = identifier;
        this.__nativeObj = new BK.Sprite(width, height, {}, 0, 0, 1, 1);
        this._innerBindMethods4NativeObj();
        if (position)
            (this).position = position;
        if (parent)
            parent.addChild(this);
        else
            BK.Director.root.addChild(this);
        if (zOrder)
            this.zOrder = zOrder;
        if (autoAddMgr == true)
            QAVManager.Instance.addView(this);
    }
    QAVView.prototype._innerBindMethods4NativeObj = function (skipList) {
        var _this = this;
        var props = Object.getOwnPropertyNames(this.__nativeObj);
        props.forEach(function (curElemValue, curElemIdx, array) {
            var key = curElemValue;
            if ((!skipList) || (skipList.indexOf(key)) == -1) {
                Object.defineProperty(_this, key, {
                    get: function () {
                        return this.__nativeObj[key];
                    },
                    set: function (value) {
                        this.__nativeObj[key] = value;
                    },
                    enumerable: true,
                    configurable: true
                });
            }
        });
    };
    QAVView.prototype.addChild = function (node) {
        if (this.__nativeObj)
            this.__nativeObj.addChild(node);
    };
    QAVView.prototype._restartRenderTimer = function () {
        if (this.__renderTimeoutCallback && this.__renderTimeoutThreshold > 0) {
            BK.Director.ticker.removeTimeout(this);
            BK.Director.ticker.setTimeout(function (ts, dt, obj) {
                if (this.__renderTimeoutCallback) {
                    this.__renderTimeoutCallback.call(this);
                }
            }, this.__renderTimeoutThreshold, this);
        }
    };
    QAVView.prototype._innerUseRGBA = function (width, height) {
        if (!this.__bitmap) {
            this.__bitmap = BK.Texture.createBitmapTexture(width, height);
            this.__nativeObj.setTexture(this.__bitmap);
        }
        else {
            var size = this.__bitmap.size;
            if (size.width != width || size.height != height) {
                BK.Script.log(0, 0, "BK.QAVView.useRGBA!size change, ow = " + size.width + ", oh = " + size.height + ", nw = " + width + ", nh = " + height);
                this.__bitmap = BK.Texture.createBitmapTexture(width, height);
                this.__nativeObj.setTexture(this.__bitmap);
            }
        }
    };
    QAVView.prototype._innerUseYUVMaterial_I420 = function (width, height) {
        if (!this.__yuvMaterial) {
            this.__yuvMaterial = new BK.Render.Material(yuv_vs, yuv_fs, true);
            this.__nativeObj.attachComponent(this.__yuvMaterial);
            this.__yuvMaterial.uniforms.samplerY = 0;
            this.__yuvMaterial.uniforms.samplerU = 1;
            this.__yuvMaterial.uniforms.samplerV = 2;
            this.__yuvMaterial.uniforms.samplerUV = 3;
        }
        if (!this.__bitmapY) {
            this.__bitmapY = BK.Texture.createBitmapTexture(width, height, 7 /* COLOR_LUMINANCE */);
            this.__yuvMaterial.setTexture(0, this.__bitmapY);
        }
        else {
            var size = this.__bitmapY.size;
            if (size.width != width || size.height != height) {
                BK.Script.log(0, 0, "BK.QAVView.useYUVMaterial_I420!Y size change, ow = " + size.width + ", oh = " + size.height + ", nw = " + width + ", nh = " + height);
                this.__bitmapY = BK.Texture.createBitmapTexture(width, height, 7 /* COLOR_LUMINANCE */);
                this.__yuvMaterial.setTexture(0, this.__bitmapY);
            }
        }
        if (!this.__bitmapU) {
            this.__bitmapU = BK.Texture.createBitmapTexture(width / 2, height / 2, 7 /* COLOR_LUMINANCE */);
            this.__yuvMaterial.setTexture(1, this.__bitmapU);
        }
        else {
            var size = this.__bitmapU.size;
            if (size.width != width / 2 || size.height != height / 2) {
                BK.Script.log(0, 0, "BK.QAVView.useYUVMaterial_I420!U size change, ow = " + size.width + ", oh = " + size.height + ", nw = " + width + ", nh = " + height);
                this.__bitmapU = BK.Texture.createBitmapTexture(width / 2, height / 2, 7 /* COLOR_LUMINANCE */);
                this.__yuvMaterial.setTexture(1, this.__bitmapU);
            }
        }
        if (!this.__bitmapV) {
            this.__bitmapV = BK.Texture.createBitmapTexture(width / 2, height / 2, 7 /* COLOR_LUMINANCE */);
            this.__yuvMaterial.setTexture(2, this.__bitmapV);
        }
        else {
            var size = this.__bitmapV.size;
            if (size.width != width / 2 || size.height != height / 2) {
                BK.Script.log(0, 0, "BK.QAVView.useYUVMaterial_I420!V size change, ow = " + size.width + ", oh = " + size.height + ", nw = " + width + ", nh = " + height);
                this.__bitmapV = BK.Texture.createBitmapTexture(width / 2, height / 2, 7 /* COLOR_LUMINANCE */);
                this.__yuvMaterial.setTexture(2, this.__bitmapV);
            }
        }
    };
    QAVView.prototype._innerUseYUVMaterial_NVxx = function (width, height) {
        if (!this.__yuvMaterial) {
            this.__yuvMaterial = new BK.Render.Material(yuv_vs, yuv_fs, true);
            this.__nativeObj.attachComponent(this.__yuvMaterial);
            this.__yuvMaterial.uniforms.samplerY = 0;
            this.__yuvMaterial.uniforms.samplerU = 1;
            this.__yuvMaterial.uniforms.samplerV = 2;
            this.__yuvMaterial.uniforms.samplerUV = 3;
        }
        if (!this.__bitmapY) {
            this.__bitmapY = BK.Texture.createBitmapTexture(width, height, 7 /* COLOR_LUMINANCE */);
            this.__yuvMaterial.setTexture(0, this.__bitmapY);
        }
        else {
            var size = this.__bitmapY.size;
            if (size.width != width || size.height != height) {
                BK.Script.log(0, 0, "BK.QAVView.useYUVMaterial_NVxx!Y size change, ow = " + size.width + ", oh = " + size.height + ", nw = " + width + ", nh = " + height);
                this.__bitmapY = BK.Texture.createBitmapTexture(width, height, 7 /* COLOR_LUMINANCE */);
                this.__yuvMaterial.setTexture(0, this.__bitmapY);
            }
        }
        if (!this.__bitmapUV) {
            this.__bitmapUV = BK.Texture.createBitmapTexture(width / 2, height / 2, 2 /* COLOR_LUMINANCE_ALPHA */);
            this.__yuvMaterial.setTexture(3, this.__bitmapUV);
        }
        else {
            var size = this.__bitmapUV.size;
            if (size.width != width / 2 || size.height != height / 2) {
                BK.Script.log(0, 0, "BK.QAVView.useYUVMaterial_NVxx!UV size change, ow = " + size.width + ", oh = " + size.height + ", nw = " + width + ", nh = " + height);
                this.__bitmapUV = BK.Texture.createBitmapTexture(width / 2, height / 2, 2 /* COLOR_LUMINANCE_ALPHA */);
                this.__yuvMaterial.setTexture(3, this.__bitmapUV);
            }
        }
    };
    QAVView.prototype.render = function (frameData) {
        var width = frameData.frameDesc.width;
        var height = frameData.frameDesc.height;
        if (this.__nativeObj) {
            this._restartRenderTimer();
            switch (frameData.frameDesc.rotate) {
                case 0 /* AV_ROTATE_NONE */: {
                    if (this.cameraPos &&
                        this.cameraPos == 1 /* CameraPosBack */) {
                        this.__nativeObj.setUVFlip(1, 0);
                    }
                    else {
                        this.__nativeObj.setUVFlip(1, 1);
                    }
                    break;
                }
                case 1 /* AV_ROTATE_CW90 */: {
                    if (this.cameraPos &&
                        this.cameraPos == 1 /* CameraPosBack */) {
                        this.__nativeObj.setUVFlip(0, 1);
                        this.__nativeObj.setUVRotate(1);
                    }
                    else {
                        this.__nativeObj.setUVFlip(0, 0);
                        this.__nativeObj.setUVRotate(1);
                    }
                    break;
                }
                case 2 /* AV_ROTATE_CCW180 */: {
                    if (this.cameraPos &&
                        this.cameraPos == 1 /* CameraPosBack */) {
                        this.__nativeObj.setUVFlip(0, 1);
                        this.__nativeObj.setUVRotate(1);
                    }
                    else {
                        this.__nativeObj.setUVFlip(0, 0);
                        this.__nativeObj.setUVRotate(1);
                    }
                    break;
                }
                case 3 /* AV_ROTATE_CCW270 */: {
                    if (this.cameraPos &&
                        this.cameraPos == 1 /* CameraPosBack */) {
                        this.__nativeObj.setUVFlip(0, 1);
                        this.__nativeObj.setUVRotate(3);
                    }
                    else {
                        this.__nativeObj.setUVFlip(0, 0);
                        this.__nativeObj.setUVRotate(3);
                    }
                    break;
                }
            }
            switch (frameData.frameDesc.colorFormat) {
                case 10 /* FORMAT_RGBA */: {
                    this._innerUseRGBA(width, height);
                    this.__bitmap.uploadSubData(0, 0, width, height, frameData.extraData.buffer);
                    break;
                }
                case 0 /* FORMAT_I420 */: {
                    this._innerUseYUVMaterial_I420(width, height);
                    this.__yuvMaterial.uniforms.formatYUV = frameData.frameDesc.colorFormat;
                    this.__bitmapY.uploadSubData(0, 0, width, height, frameData.extraData.Y);
                    this.__bitmapU.uploadSubData(0, 0, width / 2, height / 2, frameData.extraData.U);
                    this.__bitmapV.uploadSubData(0, 0, width / 2, height / 2, frameData.extraData.V);
                    break;
                }
                case 3 /* FORMAT_NV12 */:
                case 1 /* FORMAT_NV21 */: {
                    this._innerUseYUVMaterial_NVxx(width, height);
                    this.__yuvMaterial.uniforms.formatYUV = frameData.frameDesc.colorFormat;
                    this.__bitmapY.uploadSubData(0, 0, width, height, frameData.extraData.Y);
                    this.__bitmapUV.uploadSubData(0, 0, width / 2, height / 2, frameData.extraData.UV);
                    break;
                }
                default: {
                    BK.Script.log(1, -1, "BK.QAVView.render!unknown format = " + frameData.frameDesc.colorFormat);
                }
            }
        }
    };
    QAVView.prototype.renderAsCache = function (texW, texH, dstW, dstH, rotate, format, dstFormat, extraData) {
        switch (format) {
            case 0 /* FORMAT_I420 */: {
                this._innerUseYUVMaterial_I420(texW, texH);
                this.__yuvMaterial.uniforms.formatYUV = format;
                this.__bitmapY.uploadSubData(0, 0, texW, texH, extraData.Y);
                this.__bitmapU.uploadSubData(0, 0, texW / 2, texH / 2, extraData.U);
                this.__bitmapV.uploadSubData(0, 0, texW / 2, texH / 2, extraData.V);
                break;
            }
            case 3 /* FORMAT_NV12 */:
            case 1 /* FORMAT_NV21 */: {
                this._innerUseYUVMaterial_NVxx(texW, texH);
                this.__yuvMaterial.uniforms.formatYUV = format;
                this.__bitmapY.uploadSubData(0, 0, texW, texH, extraData.Y);
                this.__bitmapUV.uploadSubData(0, 0, texW / 2, texH / 2, extraData.UV);
                break;
            }
            default: {
                BK.Script.log(1, -1, "BK.QAVView.renderAsCache!unknown format = " + format);
                return null;
            }
        }
        if (!this.__graphic) {
            this.__graphic = new BK.Graphics();
        }
        if (!this.__cacheTexture) {
            this.__cacheTexture = new BK.RenderTexture(dstW, dstH, dstFormat);
        }
        else {
            var size = this.__cacheTexture.size;
            if (size.width != dstW || size.height != dstH) {
                BK.Script.log(0, 0, "BK.QAVView.renderAsCache!cache tex size change, ow = " + size.width + ", oh = " + size.height + ", nw = " + dstW + ", nh = " + dstH);
                this.__cacheTexture = new BK.RenderTexture(dstW, dstH, dstFormat);
            }
        }
        if (!this.__cacheSprite) {
            this.__cacheSprite = new BK.Sprite(dstW, dstH, null, 0, 0, 1, 1);
            this.__cacheSprite.attachComponent(this.__yuvMaterial);
        }
        else {
            var size = this.__cacheSprite.size;
            if (size.width != dstW || size.height != dstH) {
                this.__cacheSprite.size = { 'width': dstW, 'height': dstH };
            }
        }
        switch (rotate) {
            case 0 /* AV_ROTATE_NONE */: {
                this.__cacheSprite.setUVFlip(1, 0);
                this.__cacheSprite.setUVRotate(0);
                break;
            }
            case 1 /* AV_ROTATE_CW90 */: {
                this.__cacheSprite.setUVFlip(1, 0);
                this.__cacheSprite.setUVRotate(1);
                break;
            }
            case 2 /* AV_ROTATE_CCW180 */: {
                this.__cacheSprite.setUVFlip(0, 1);
                this.__cacheSprite.setUVRotate(0);
                break;
            }
            case 3 /* AV_ROTATE_CCW270 */: {
                this.__cacheSprite.setUVFlip(1, 0);
                this.__cacheSprite.setUVRotate(4);
                break;
            }
        }
        var _this = this;
        this.__graphic.drawRenderTexture(this.__cacheTexture, function () {
            this.drawSprite(_this.__cacheSprite);
        });
        var buffer = this.__cacheTexture.readPixels(0, 0, dstW, dstH, dstFormat);
        return buffer;
    };
    QAVView.prototype.renderAsTexture = function () {
        var renderTexture = new BK.RenderTexture(this.__nativeObj.size.width, this.__nativeObj.size.height, 6 /* COLOR_RGBA8888 */);
        BK.Render.renderToTexture(this.__nativeObj, renderTexture);
        return renderTexture;
    };
    QAVView.prototype.hittest = function (pt) {
        return this.__nativeObj.hittest(pt);
    };
    QAVView.prototype.removeFromParent = function () {
        if (this.__nativeObj) {
            this.__nativeObj.removeFromParent();
        }
    };
    QAVView.prototype.setRenderTimeout = function (timeout, callback) {
        this.__renderTimeoutCallback = callback;
        this.__renderTimeoutThreshold = timeout;
        if (this.__renderTimeoutThreshold > 0) {
            this._restartRenderTimer();
        }
    };
    return QAVView;
}());
;
var QAVCamera = (function () {
    function QAVCamera() {
        this.skipNum = -1;
    }
    QAVCamera.prototype.start = function (options) {
        var identifier = options.identifier ? options.identifier : "";
        if (!options.width)
            return undefined;
        if (!options.height)
            return undefined;
        BK.Script.log(1, 0, "BK.Camera!options = " + JSON.stringify(options));
        this.options = options;
        this.identifier = identifier;
        this.view = new QAVView(identifier, options.width, options.height, false, options.parent, options.position);
        QAVManager.Instance.addView(this);
        if (this.options.needFaceTracker) {
            this.detector = new BK.AI.FaceDetector(true /*poseEstimate*/, true /*tracking*/);
        }
        function switchCameraEvent(errCode, cmd, data) {
            BK.Script.log(0, 0, "BK.Camera.switchCameraEvent222!data = " + JSON.stringify(data));
            if (errCode == 0) {
                BK.Script.log(0, 0, "BK.Camera.switchCameraEvent!data = " + JSON.stringify(data));
                var _this_1 = this;
                BK.Director.ticker.removeTimeout(this);
                BK.Director.ticker.setTimeout(function (ts, dt, object) {
                    _this_1.view.cameraPos = data.cameraPos;
                    _this_1 = null;
                }, 16 * 10, this);
            }
        }
        var cmd = "cs.audioRoom_camera_switch.local";
        BK.MQQ.SsoRequest.addListener(cmd, this, switchCameraEvent.bind(this));
        this.isStart = false;
        return this;
    };
    QAVCamera.prototype.configCamera = function (opts) {
        if (opts) {
            BK.Script.log(0, 0, "configCamera");
            BK.Script.log(0, 0, "configCamera BK.Room ok1");
            if (opts.beauty) {
                BK.Script.log(0, 0, "configCamera BK.Room audioRoomSetBeauty1");
                this.setBeauty(opts.beauty);
            }
            if (opts.cameraPos) {
                BK.Script.log(0, 0, "configCamera BK.Room cameraPos");
                var cb = opts.onSwitchCamera ? opts.onSwitchCamera.bind(this) : undefined;
                this.switchCamera(opts.cameraPos, function (errCode, cmd, data) {
                    BK.Script.log(0, 0, "configCamera BK.Room cameraPos errCode:" + errCode + " cmd:" + cmd + " data:" + data);
                    if (this.options.onSwitchCamera) {
                        this.options.onSwitchCamera(errCode, cmd, data);
                    }
                });
            }
        }
    };
    QAVCamera.prototype.switchCamera = function (cameraPos, callback) {
        var data = {
            cameraPos: cameraPos
        };
        var cmd = "cs.audioRoom_cameraswitch.local";
        BK.MQQ.SsoRequest.addListener(cmd, this, callback.bind(this));
        BK.MQQ.SsoRequest.send(data, cmd);
    };
    QAVCamera.prototype.setBeauty = function (beauty) {
        var data = {
            "beauty": beauty
        };
        BK.MQQ.SsoRequest.send(data, "cs.audioRoom_set_beauty.local");
    };
    QAVCamera.prototype.setSpeaker = function (sw) {
        var data = {
            "speaker": sw
        };
        BK.MQQ.SsoRequest.send(data, "cs.audioRoom_set_speaker.local");
    };
    QAVCamera.prototype.close = function () {
    };
    //@ IAVViewDelegate
    QAVCamera.prototype._innerConvertRGBA = function (frameData) {
        function _innerGetSize(width, height, rotate) {
            var size = { 'width': width, 'height': height };
            switch (rotate) {
                case 1 /* AV_ROTATE_CW90 */:
                case 3 /* AV_ROTATE_CCW270 */: {
                    size.width = height;
                    size.height = width;
                    break;
                }
            }
            return size;
        }
        var scale = this.options.scaleSample ? this.options.scaleSample : 1.0;
        var width = frameData.frameDesc.width;
        var height = frameData.frameDesc.height;
        var newSize = _innerGetSize(frameData.frameDesc.width, frameData.frameDesc.height, frameData.frameDesc.rotate);
        var videoFrame = {};
        videoFrame.frameDesc = {};
        videoFrame.extraData = {};
        videoFrame.frameDesc.width = newSize.width * scale;
        videoFrame.frameDesc.height = newSize.height * scale;
        videoFrame.frameDesc.rotate = 0 /* AV_ROTATE_NONE */;
        videoFrame.frameDesc.colorFormat = 10 /* FORMAT_RGBA */;
        videoFrame.frameDesc.videoSrcType = frameData.frameDesc.videoSrcType;
        videoFrame.extraData.buffer = this.view.renderAsCache(width, height, newSize.width * scale, newSize.height * scale, frameData.frameDesc.rotate, frameData.frameDesc.colorFormat, 6 /* COLOR_RGBA8888 */, frameData.extraData);
        return videoFrame;
    };
    QAVCamera.prototype.onPrePreview = function (frameData) {
        if (this.options.onPrePreview) {
            var videoFrame = frameData;
            if (this.detector) {
                videoFrame = this._innerConvertRGBA(frameData);
                var bitmap = this._innerExtractBitmap(videoFrame);
                //BK.Script.log(1, 0, "BK.Camera.onPrePreview!bmp = " + JSON.stringify(bitmap) + ", detector = " + JSON.stringify(this.detector));
                if (this.hasFace || this.skipNum == -1) {
                    this.skipNum = 0;
                    videoFrame.faceFeatures = this.detector.detectForBitmapSync(bitmap);
                }
                if (videoFrame.faceFeatures == undefined || videoFrame.faceFeatures.length <= 0) {
                    this.hasFace = false;
                    this.skipNum = this.skipNum + 1;
                    if (this.skipNum > this.options.skipFaceTrackerNum || this.skipNum == this.options.skipFaceTrackerNum) {
                        videoFrame.faceFeatures = this.detector.detectForBitmapSync(bitmap);
                        this.skipNum = 0;
                        if (videoFrame.faceFeatures) {
                            this.hasFace = true;
                        }
                    }
                }
                else {
                    this.hasFace = true;
                }
            }
            this.options.onPrePreview.call(this, videoFrame);
        }
        if (this.isStart == false) {
            this.configCamera(this.options);
            this.isStart = true;
        }
        return frameData;
    };
    QAVCamera.prototype.onPreProcess = function (frameData) {
        if (this.options.onPreProcess) {
            return this.options.onPreProcess.call(this, frameData);
        }
        return frameData;
    };
    //@ IAVView
    QAVCamera.prototype.render = function (frameData) {
        if (this.view) {
            this.view.render(frameData);
        }
    };
    QAVCamera.prototype.renderAsTexture = function () {
        if (this.view) {
            return (this.view).renderAsTexture();
        }
        return null;
    };
    QAVCamera.prototype._innerExtractBitmap = function (frameData) {
        var bmp = {};
        bmp.width = frameData.frameDesc.width;
        bmp.height = frameData.frameDesc.height;
        bmp.format = frameData.frameDesc.colorFormat;
        switch (frameData.frameDesc.colorFormat) {
            case 7 /* FORMAT_RGB565 */: {
                bmp.format = 3 /* COLOR_RGB565 */;
                break;
            }
            case 10 /* FORMAT_RGBA */: {
                bmp.buffer = frameData.extraData.buffer;
                bmp.format = 6 /* COLOR_RGBA8888 */;
                break;
            }
            default: {
                BK.Script.log(1, -1, "BK.QAVCamera.extractBitmap!unknown format = " + frameData.frameDesc.colorFormat);
                break;
            }
        }
        switch (frameData.frameDesc.rotate) {
            case 0: {
                bmp.oreintation = 0 /* ROTATE_NONE */;
                break;
            }
            case 1: {
                bmp.oreintation = 1 /* ROTATE_CW90 */;
                break;
            }
            case 2: {
                bmp.oreintation = 5 /* ROTATE_CCW180 */;
                break;
            }
            case 3: {
                bmp.oreintation = 6 /* ROTATE_CCW270 */;
                break;
            }
        }
        return bmp;
    };
    return QAVCamera;
}());
QAVCamera.Instance = new QAVCamera();
BK.AVView = QAVView;
BK.AVCamera = QAVCamera.Instance;
