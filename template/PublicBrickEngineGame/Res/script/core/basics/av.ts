
const yuv_vs = "attribute vec3 Position;\
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
}"

const yuv_fs = "varying lowp vec2 TexCoordOut;\
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
}"

declare const enum BK_AV_COLOR_FORMAT {
    FORMAT_I420 = 0,
    FORMAT_NV21 = 1,
    FORMAT_NV12 = 3,
    FORMAT_RGB565 = 7,
    FORMAT_RGB24 = 8,
    FORMAT_ARGB = 9,
    FORMAT_RGBA = 10,
}

declare const enum BK_AV_ROTATE {
    AV_ROTATE_NONE = 0,
    AV_ROTATE_CW90 = 1,
    AV_ROTATE_CCW180 = 2,
    AV_ROTATE_CCW270 = 3
}

declare const enum BK_AV_CAMERA_POS {
    CameraPosFront = 0,
    CameraPosBack = 1
}

class QAVFrameDesc {
    width: number;
    height: number;
    rotate: number;
    colorFormat: number;
    videoSrcType: number;
}

class QAVVideoFrame {
    frameDesc: QAVFrameDesc;
    identifier: string;
    timeStamp: number;
    extraData: any;
}


interface IAVRemoteVideoDelegate {
    onRemoveVideoPreview(frameData: QAVVideoFrame): void;
}

interface IAVLocalVideoDelegate {
    onLocalVideoPreview(frameData: QAVVideoFrame): void;
    onLocalVideoPreProcess(frameData: QAVVideoFrame): void;
}

interface IAVViewDelegate {
    onPrePreview(frameData: QAVVideoFrame): QAVVideoFrame;
    onPreProcess(frameData: QAVVideoFrame): QAVVideoFrame;
}

interface IAVCameraMgr {
    start(options: BK.QAVCameraOption): QAVCamera;
    close(): void;
}

interface IAVView {
    identifier: string;
    render(frameData: QAVVideoFrame): void;
}


class QAVManager implements IAVRemoteVideoDelegate, IAVLocalVideoDelegate {
    public static readonly Instance: QAVManager = new QAVManager;
    private videoViews: Array<IAVView>;

    private constructor() {
        this.videoViews = new Array<IAVView>();
        BK.Director.setQAVDelegate(this);
    }

    addView(view: IAVView): boolean {
        let resViews = this.videoViews.filter(function (view_) {
            return view == view_;
        });
        if (!resViews.length) {
            this.videoViews.push(view);
        }
        return resViews.length == 0;
    }

    delView(view: IAVView): boolean {
        let length = this.videoViews.length;
        this.videoViews = this.videoViews.filter(function (view_) {
            return view != view_;
        });
        return length != this.videoViews.length;
    }

    //@ QAVRemoteVideoDelegate
    onRemoveVideoPreview(frameData: QAVVideoFrame): void {
        this.videoViews.forEach(function (view) {
            if (view.identifier == frameData.identifier) {
                view.render(frameData);
            }
        });
    }

    //@ QAVLocalVideoDelegate
    onLocalVideoPreview(frameData: QAVVideoFrame): void {
        //BK.Script.log(1, 0, "onLocalVideoPreview!frameData = " + JSON.stringify(frameData));
        this.videoViews.forEach(function (view) {
            if (view.identifier == frameData.identifier) {
                let videoFrame = frameData;
                let cameraMgr: IAVViewDelegate = <QAVCamera>(view);
                if (cameraMgr.onPrePreview) {
                    videoFrame = cameraMgr.onPrePreview.call(cameraMgr, frameData);
                }
                view.render(videoFrame);
            }
        });
    }

    onLocalVideoPreProcess(frameData: QAVVideoFrame): void {
        //BK.Script.log(1, 0, "onLocalVideoPreProcess!frameData = " + JSON.stringify(frameData));
        this.videoViews.forEach(function (view) {
            if (view.identifier == frameData.identifier) {
                let cameraMgr: IAVViewDelegate = <QAVCamera>(view);
                if (cameraMgr.onPreProcess) {
                    cameraMgr.onPreProcess.call(cameraMgr, frameData);
                }
            }
        });
    }
}

class QAVView implements IAVView {
    public identifier: string; // 音视频所属的房间成员ID
    public cameraPos: BK_AV_CAMERA_POS;
    private __bitmap: BK.Texture;
    private __bitmapY: BK.Texture;
    private __bitmapU: BK.Texture;
    private __bitmapV: BK.Texture;
    private __bitmapUV: BK.Texture;
    private __graphic: BK.Graphics;
    private __cacheSprite: BK.Sprite;
    private __cacheTexture: BK.RenderTexture;
    private __yuvMaterial: BK.Render.Material;
    private __nativeObj: BK.Sprite;
    private __renderTimeoutCallback: ()=>void;
    private __renderTimeoutThreshold: number;

    private _innerBindMethods4NativeObj(skipList?: any) {
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
    }

    addChild(node: BK.Node): void {
        if (this.__nativeObj)
            this.__nativeObj.addChild(node);
    }

    constructor(identifier: string, width: number, height: number, autoAddMgr: boolean = true, parent?: BK.Node, position?: any, zOrder?: number) {
        this.identifier = identifier;
        this.__nativeObj = new BK.Sprite(width, height, {}, 0, 0, 1, 1);
        this._innerBindMethods4NativeObj();

        if (position)
            (<any>(this)).position = position;

        if (parent)
            parent.addChild(<any>this);
        else
            BK.Director.root.addChild(<any>this);

        if (zOrder)
            (<any>this).zOrder = zOrder;

        if (autoAddMgr == true)
            QAVManager.Instance.addView(this);
    }

    private _restartRenderTimer(): void {
        if (this.__renderTimeoutCallback && this.__renderTimeoutThreshold > 0) {
            BK.Director.ticker.removeTimeout(this);
            BK.Director.ticker.setTimeout(function(ts: number, dt: number, obj: any) {
                if (this.__renderTimeoutCallback) {
                    this.__renderTimeoutCallback.call(this);
                }
            }, this.__renderTimeoutThreshold, this);
        }
    }

    private _innerUseRGBA(width: number, height: number) {
        if (!this.__bitmap) {
            this.__bitmap = BK.Texture.createBitmapTexture(width, height);
            this.__nativeObj.setTexture(this.__bitmap);
        } else {
            let size = this.__bitmap.size;
            if (size.width != width || size.height != height) {
                BK.Script.log(0, 0, "BK.QAVView.useRGBA!size change, ow = " + size.width + ", oh = " + size.height + ", nw = " + width + ", nh = " + height);
                this.__bitmap = BK.Texture.createBitmapTexture(width, height);
                this.__nativeObj.setTexture(this.__bitmap);
            }
        }
    }

    private _innerUseYUVMaterial_I420(width: number, height: number) {
        if (!this.__yuvMaterial) {
            this.__yuvMaterial = new BK.Render.Material(yuv_vs, yuv_fs, true);
            this.__nativeObj.attachComponent(this.__yuvMaterial);
            this.__yuvMaterial.uniforms.samplerY = 0;
            this.__yuvMaterial.uniforms.samplerU = 1;
            this.__yuvMaterial.uniforms.samplerV = 2;
            this.__yuvMaterial.uniforms.samplerUV = 3;
        }
        if (!this.__bitmapY) {
            this.__bitmapY = BK.Texture.createBitmapTexture(width, height, BK_COLOR_FORMAT.COLOR_LUMINANCE);
            this.__yuvMaterial.setTexture(0, this.__bitmapY);
        } else {
            let size = this.__bitmapY.size;
            if (size.width != width || size.height != height) {
                BK.Script.log(0, 0, "BK.QAVView.useYUVMaterial_I420!Y size change, ow = " + size.width + ", oh = " + size.height + ", nw = " + width + ", nh = " + height);
                this.__bitmapY = BK.Texture.createBitmapTexture(width, height, BK_COLOR_FORMAT.COLOR_LUMINANCE);
                this.__yuvMaterial.setTexture(0, this.__bitmapY);
            }
        }
        if (!this.__bitmapU) {
            this.__bitmapU = BK.Texture.createBitmapTexture(width / 2, height / 2, BK_COLOR_FORMAT.COLOR_LUMINANCE);
            this.__yuvMaterial.setTexture(1, this.__bitmapU);
        } else {
            let size = this.__bitmapU.size;
            if (size.width != width / 2 || size.height != height / 2) {
                BK.Script.log(0, 0, "BK.QAVView.useYUVMaterial_I420!U size change, ow = " + size.width + ", oh = " + size.height + ", nw = " + width + ", nh = " + height);
                this.__bitmapU = BK.Texture.createBitmapTexture(width / 2, height / 2, BK_COLOR_FORMAT.COLOR_LUMINANCE);
                this.__yuvMaterial.setTexture(1, this.__bitmapU);
            }
        }
        if (!this.__bitmapV) {
            this.__bitmapV = BK.Texture.createBitmapTexture(width / 2, height / 2, BK_COLOR_FORMAT.COLOR_LUMINANCE);
            this.__yuvMaterial.setTexture(2, this.__bitmapV);
        } else {
            let size = this.__bitmapV.size;
            if (size.width != width / 2 || size.height != height / 2) {
                BK.Script.log(0, 0, "BK.QAVView.useYUVMaterial_I420!V size change, ow = " + size.width + ", oh = " + size.height + ", nw = " + width + ", nh = " + height);
                this.__bitmapV = BK.Texture.createBitmapTexture(width / 2, height / 2, BK_COLOR_FORMAT.COLOR_LUMINANCE);
                this.__yuvMaterial.setTexture(2, this.__bitmapV);
            }
        }
    }

    private _innerUseYUVMaterial_NVxx(width: number, height: number) {
        if (!this.__yuvMaterial) {
            this.__yuvMaterial = new BK.Render.Material(yuv_vs, yuv_fs, true);
            this.__nativeObj.attachComponent(this.__yuvMaterial);
            this.__yuvMaterial.uniforms.samplerY = 0;
            this.__yuvMaterial.uniforms.samplerU = 1;
            this.__yuvMaterial.uniforms.samplerV = 2;
            this.__yuvMaterial.uniforms.samplerUV = 3;
        }
        if (!this.__bitmapY) {
            this.__bitmapY = BK.Texture.createBitmapTexture(width, height, BK_COLOR_FORMAT.COLOR_LUMINANCE);
            this.__yuvMaterial.setTexture(0, this.__bitmapY);
        } else {
            let size = this.__bitmapY.size;
            if (size.width != width || size.height != height) {
                BK.Script.log(0, 0, "BK.QAVView.useYUVMaterial_NVxx!Y size change, ow = " + size.width + ", oh = " + size.height + ", nw = " + width + ", nh = " + height);
                this.__bitmapY = BK.Texture.createBitmapTexture(width, height, BK_COLOR_FORMAT.COLOR_LUMINANCE);
                this.__yuvMaterial.setTexture(0, this.__bitmapY);
            }
        }
        if (!this.__bitmapUV) {
            this.__bitmapUV = BK.Texture.createBitmapTexture(width / 2, height / 2, BK_COLOR_FORMAT.COLOR_LUMINANCE_ALPHA);
            this.__yuvMaterial.setTexture(3, this.__bitmapUV);
        } else {
            let size = this.__bitmapUV.size;
            if (size.width != width / 2 || size.height != height / 2) {
                BK.Script.log(0, 0, "BK.QAVView.useYUVMaterial_NVxx!UV size change, ow = " + size.width + ", oh = " + size.height + ", nw = " + width + ", nh = " + height);
                this.__bitmapUV = BK.Texture.createBitmapTexture(width / 2, height / 2, BK_COLOR_FORMAT.COLOR_LUMINANCE_ALPHA);
                this.__yuvMaterial.setTexture(3, this.__bitmapUV);
            }
        }
    }

    render(frameData: QAVVideoFrame): void {
        let width: number = frameData.frameDesc.width;
        let height: number = frameData.frameDesc.height;
        if (this.__nativeObj) {
            this._restartRenderTimer();
            switch (frameData.frameDesc.rotate) {
                case BK_AV_ROTATE.AV_ROTATE_NONE: {
                    if (this.cameraPos &&
                        this.cameraPos == BK_AV_CAMERA_POS.CameraPosBack) {
                        this.__nativeObj.setUVFlip(1, 0);
                    } else {
                        this.__nativeObj.setUVFlip(1, 1);
                    }
                    break;
                }
                case BK_AV_ROTATE.AV_ROTATE_CW90: {
                    if (this.cameraPos &&
                        this.cameraPos == BK_AV_CAMERA_POS.CameraPosBack) {
                        this.__nativeObj.setUVFlip(0, 1);
                        this.__nativeObj.setUVRotate(1);
                    } else {
                        this.__nativeObj.setUVFlip(0, 0);
                        this.__nativeObj.setUVRotate(1);
                    }
                    break;
                }
                case BK_AV_ROTATE.AV_ROTATE_CCW180: {
                    if (this.cameraPos &&
                        this.cameraPos == BK_AV_CAMERA_POS.CameraPosBack) {
                        this.__nativeObj.setUVFlip(0, 1);
                        this.__nativeObj.setUVRotate(1);
                    } else {
                        this.__nativeObj.setUVFlip(0, 0);
                        this.__nativeObj.setUVRotate(1);
                    }
                    break;
                }
                case BK_AV_ROTATE.AV_ROTATE_CCW270: {
                    if (this.cameraPos &&
                        this.cameraPos == BK_AV_CAMERA_POS.CameraPosBack) {
                        this.__nativeObj.setUVFlip(0, 1);
                        this.__nativeObj.setUVRotate(3);
                    } else {
                        this.__nativeObj.setUVFlip(0, 0);
                        this.__nativeObj.setUVRotate(3);
                    }
                    break;
                }
            }

            switch (frameData.frameDesc.colorFormat) {
                case BK_AV_COLOR_FORMAT.FORMAT_RGBA: {
                    this._innerUseRGBA(width, height);
                    this.__bitmap.uploadSubData(0, 0, width, height, frameData.extraData.buffer);
                    break;
                }
                case BK_AV_COLOR_FORMAT.FORMAT_I420: {
                    this._innerUseYUVMaterial_I420(width, height);
                    this.__yuvMaterial.uniforms.formatYUV = frameData.frameDesc.colorFormat;
                    this.__bitmapY.uploadSubData(0, 0, width, height, frameData.extraData.Y);
                    this.__bitmapU.uploadSubData(0, 0, width / 2, height / 2, frameData.extraData.U);
                    this.__bitmapV.uploadSubData(0, 0, width / 2, height / 2, frameData.extraData.V);
                    break;
                }
                case BK_AV_COLOR_FORMAT.FORMAT_NV12:
                case BK_AV_COLOR_FORMAT.FORMAT_NV21: {
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
    }

    renderAsCache(texW: number, texH: number, dstW: number, dstH: number, rotate: BK_AV_ROTATE, format: BK_AV_COLOR_FORMAT, dstFormat: BK_COLOR_FORMAT, extraData: any): BK.Buffer {
        switch (format) {
            case BK_AV_COLOR_FORMAT.FORMAT_I420: {
                this._innerUseYUVMaterial_I420(texW, texH);
                this.__yuvMaterial.uniforms.formatYUV = format;
                this.__bitmapY.uploadSubData(0, 0, texW, texH, extraData.Y);
                this.__bitmapU.uploadSubData(0, 0, texW / 2, texH / 2, extraData.U);
                this.__bitmapV.uploadSubData(0, 0, texW / 2, texH / 2, extraData.V);
                break;
            }
            case BK_AV_COLOR_FORMAT.FORMAT_NV12:
            case BK_AV_COLOR_FORMAT.FORMAT_NV21: {
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
        } else {
            let size = this.__cacheTexture.size;
            if (size.width != dstW || size.height != dstH) {
                BK.Script.log(0, 0, "BK.QAVView.renderAsCache!cache tex size change, ow = " + size.width + ", oh = " + size.height + ", nw = " + dstW + ", nh = " + dstH);
                this.__cacheTexture = new BK.RenderTexture(dstW, dstH, dstFormat);
            }
        }

        if (!this.__cacheSprite) {
            this.__cacheSprite = new BK.Sprite(dstW, dstH, null, 0, 0, 1, 1);
            this.__cacheSprite.attachComponent(this.__yuvMaterial);
        } else {
            let size = this.__cacheSprite.size;
            if (size.width != dstW || size.height != dstH) {
                this.__cacheSprite.size = { 'width': dstW, 'height': dstH };
            }
        }

        switch (rotate) {
            case BK_AV_ROTATE.AV_ROTATE_NONE: {
                this.__cacheSprite.setUVFlip(1, 0);
                this.__cacheSprite.setUVRotate(0);
                break;
            }
            case BK_AV_ROTATE.AV_ROTATE_CW90: {
                this.__cacheSprite.setUVFlip(1, 0);
                this.__cacheSprite.setUVRotate(1);
                break;
            }
            case BK_AV_ROTATE.AV_ROTATE_CCW180: {
                this.__cacheSprite.setUVFlip(0, 1);
                this.__cacheSprite.setUVRotate(0);
                break;
            }
            case BK_AV_ROTATE.AV_ROTATE_CCW270: {
                this.__cacheSprite.setUVFlip(1, 0);
                this.__cacheSprite.setUVRotate(4);
                break;
            }
        }

        let _this = this;
        this.__graphic.drawRenderTexture(this.__cacheTexture, function () {
            this.drawSprite(_this.__cacheSprite);
        });

        let buffer: BK.Buffer = this.__cacheTexture.readPixels(0, 0, dstW, dstH, dstFormat);
        return buffer;
    }

    renderAsTexture(): BK.RenderTexture {
        let renderTexture:any = new BK.RenderTexture(this.__nativeObj.size.width, this.__nativeObj.size.height, BK_COLOR_FORMAT.COLOR_RGBA8888);
        BK.Render.renderToTexture(this.__nativeObj, renderTexture);
        return renderTexture;
    }

    hittest(pt): boolean {
        return this.__nativeObj.hittest(pt);
    }

    removeFromParent(): void {
        if (this.__nativeObj) {
            this.__nativeObj.removeFromParent();
        }
    }

    setRenderTimeout(timeout:number, callback:()=>void): void {
        this.__renderTimeoutCallback = callback;
        this.__renderTimeoutThreshold = timeout;
        if (this.__renderTimeoutThreshold > 0) {
            this._restartRenderTimer();
        }
    }
};


class QAVCamera implements IAVCameraMgr, IAVView, IAVViewDelegate {
    public static readonly Instance: QAVCamera = new QAVCamera();
    public options: BK.QAVCameraOption;
    public identifier: string;
    public view: QAVView;
    private detector: BK.AI.FaceDetector;
    private isStart: Boolean;
    private skipNum: number = -1;
    private hasFace: Boolean;

    start(options: BK.QAVCameraOption): QAVCamera {
        let identifier: string = options.identifier ? options.identifier : "";
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
            this.detector = new BK.AI.FaceDetector(true/*poseEstimate*/, true/*tracking*/);
        }

        function switchCameraEvent(errCode: number, cmd: string, data: any) {
            BK.Script.log(0, 0, "BK.Camera.switchCameraEvent222!data = " + JSON.stringify(data));
            if (errCode == 0) {
                BK.Script.log(0, 0, "BK.Camera.switchCameraEvent!data = " + JSON.stringify(data));
                let _this = this;
                BK.Director.ticker.removeTimeout(this);
                BK.Director.ticker.setTimeout(function(ts:number, dt:number, object:any) {
                    _this.view.cameraPos = data.cameraPos;
                    _this = null;
                }, 16 * 10, this);
            }
        }

        let cmd = "cs.audioRoom_camera_switch.local";
        BK.MQQ.SsoRequest.addListener(cmd, this, switchCameraEvent.bind(this));

        this.isStart = false;
        return this;
    }

    configCamera(opts: BK.QAVCameraOption): void {
        if (opts) {
            BK.Script.log(0, 0, "configCamera")
            BK.Script.log(0, 0, "configCamera BK.Room ok1");
            if (opts.beauty) {
                BK.Script.log(0, 0, "configCamera BK.Room audioRoomSetBeauty1");
                this.setBeauty(opts.beauty);
            }
            if (opts.cameraPos) {
                BK.Script.log(0, 0, "configCamera BK.Room cameraPos");
                var cb = opts.onSwitchCamera ? opts.onSwitchCamera.bind(this) : undefined;
                this.switchCamera(opts.cameraPos, function (errCode: number, cmd: string, data: any) {
                    BK.Script.log(0, 0, "configCamera BK.Room cameraPos errCode:" + errCode + " cmd:" + cmd + " data:" + data);
                    if (this.options.onSwitchCamera) {
                        this.options.onSwitchCamera(errCode, cmd, data);
                    }
                });
            }
        }
    }

    switchCamera(cameraPos: number, callback: (errCode: number, cmd: string, data: any) => void) {
        var data = {
            cameraPos: cameraPos
        }
        let cmd = "cs.audioRoom_cameraswitch.local";
        BK.MQQ.SsoRequest.addListener(cmd, this, callback.bind(this));
        BK.MQQ.SsoRequest.send(data, cmd);
    }

    setBeauty(beauty: number) {
        var data = {
            "beauty": beauty
        }
        BK.MQQ.SsoRequest.send(data, "cs.audioRoom_set_beauty.local");
    }

    setSpeaker(sw: number) {
        var data = {
            "speaker": sw
        }
        BK.MQQ.SsoRequest.send(data, "cs.audioRoom_set_speaker.local");
    }

    close(): void {

    }

    //@ IAVViewDelegate
    private _innerConvertRGBA(frameData: QAVVideoFrame): QAVVideoFrame {
        function _innerGetSize(width: number, height: number, rotate): any {
            let size = { 'width': width, 'height': height };
            switch (rotate) {
                case BK_AV_ROTATE.AV_ROTATE_CW90:
                case BK_AV_ROTATE.AV_ROTATE_CCW270: {
                    size.width = height;
                    size.height = width;
                    break;
                }
            }
            return size;
        }

        let scale = this.options.scaleSample ? this.options.scaleSample : 1.0;
        let width = frameData.frameDesc.width;
        let height = frameData.frameDesc.height;
        let newSize = _innerGetSize(frameData.frameDesc.width, frameData.frameDesc.height, frameData.frameDesc.rotate);
        let videoFrame: QAVVideoFrame = <QAVVideoFrame>{};
        videoFrame.frameDesc = <QAVFrameDesc>{};
        videoFrame.extraData = {};
        videoFrame.frameDesc.width = newSize.width * scale;
        videoFrame.frameDesc.height = newSize.height * scale;
        videoFrame.frameDesc.rotate = BK_AV_ROTATE.AV_ROTATE_NONE;
        videoFrame.frameDesc.colorFormat = BK_AV_COLOR_FORMAT.FORMAT_RGBA;
        videoFrame.frameDesc.videoSrcType = frameData.frameDesc.videoSrcType;
        videoFrame.extraData.buffer = this.view.renderAsCache(width, height, newSize.width * scale, newSize.height * scale,
            frameData.frameDesc.rotate,
            frameData.frameDesc.colorFormat,
            BK_COLOR_FORMAT.COLOR_RGBA8888, frameData.extraData);
        return videoFrame;
    }

    onPrePreview(frameData: QAVVideoFrame): QAVVideoFrame {
        if (this.options.onPrePreview) {
            let videoFrame = frameData;
            if (this.detector) {
                videoFrame = this._innerConvertRGBA(frameData);
                var bitmap = this._innerExtractBitmap(videoFrame);
                //BK.Script.log(1, 0, "BK.Camera.onPrePreview!bmp = " + JSON.stringify(bitmap) + ", detector = " + JSON.stringify(this.detector));
                if (this.hasFace || this.skipNum == -1) {
                    this.skipNum = 0;
                    (<any>videoFrame).faceFeatures = this.detector.detectForBitmapSync(bitmap);
                }

                if ((<any>videoFrame).faceFeatures == undefined || (<any>videoFrame).faceFeatures.length <= 0) {
                    this.hasFace = false;
                    this.skipNum = this.skipNum + 1;
                    if (this.skipNum > this.options.skipFaceTrackerNum || this.skipNum == this.options.skipFaceTrackerNum) {
                        (<any>videoFrame).faceFeatures = this.detector.detectForBitmapSync(bitmap);
                        this.skipNum = 0;
                        if ((<any>videoFrame).faceFeatures) {
                            this.hasFace = true;
                        }
                    }
                } else {
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
    }

    onPreProcess(frameData: QAVVideoFrame): QAVVideoFrame {
        if (this.options.onPreProcess) {
            return this.options.onPreProcess.call(this, frameData);
        }
        return frameData;
    }

    //@ IAVView
    render(frameData: QAVVideoFrame): void {
        if (this.view) {
            this.view.render(frameData);
        }
    }

    renderAsTexture(): BK.RenderTexture {
        if (this.view) {
            return (<any>(this.view)).renderAsTexture();
        }
        return null;
    }

    private _innerExtractBitmap(frameData: QAVVideoFrame): BK.Bitmap {
        let bmp: BK.Bitmap = <BK.Bitmap>{};
        bmp.width = frameData.frameDesc.width;
        bmp.height = frameData.frameDesc.height;
        bmp.format = frameData.frameDesc.colorFormat;
        switch (frameData.frameDesc.colorFormat) {
            case BK_AV_COLOR_FORMAT.FORMAT_RGB565: {
                bmp.format = BK_COLOR_FORMAT.COLOR_RGB565;
                break;
            }
            case BK_AV_COLOR_FORMAT.FORMAT_RGBA: {
                bmp.buffer = frameData.extraData.buffer;
                bmp.format = BK_COLOR_FORMAT.COLOR_RGBA8888;
                break;
            }
            default: {
                BK.Script.log(1, -1, "BK.QAVCamera.extractBitmap!unknown format = " + frameData.frameDesc.colorFormat);
                break;
            }
        }
        switch (frameData.frameDesc.rotate) {
            case 0: {
                bmp.oreintation = BK_BITMAP_OREINTATION.ROTATE_NONE;
                break;
            }
            case 1: {
                bmp.oreintation = BK_BITMAP_OREINTATION.ROTATE_CW90;
                break;
            }
            case 2: {
                bmp.oreintation = BK_BITMAP_OREINTATION.ROTATE_CCW180;
                break;
            }
            case 3: {
                bmp.oreintation = BK_BITMAP_OREINTATION.ROTATE_CCW270;
                break;
            }
        }
        return bmp;
    }
}

BK.AVView = QAVView;
BK.AVCamera = QAVCamera.Instance;
