
/////////////////////////////
/// Mobile QQ Brick Engine APIs
/////////////////////////////

declare interface Map<T> { 
    [index:string]:T
}

declare const enum BK_NET_STATE {
    UNCONNECT = 0,
    CONNECTING = 1,
    CONNECTED  = 2,
    DISCONNECTED = 3,
    SSL_SHAKEHANDING = 4,
    SSL_SHAKEHAND_DONE = 5,
    SSL_SHAKEHAND_FAIL = 6
}

declare const enum BK_SOCKET_STATE {
    FAIL = -1,
    CAN_READ = 1,
    CAN_WRITE = 2,
    CAN_READ_WRITE = 3
}

declare const enum BK_SCREEN_MODE {
    OrientationPortrait = 1,
    OrientationLandscapeLeft = 2,
    OrientationLandscapeRight = 3,
    PhysicsOrientationPortrait = 4,
    PhysicsOrientationLandscapeLeft = 5,
    PhysicsOrientationLandscapeRight = 6
}

//房间错误码
declare const enum RoomErrorCode{
    enGameHallSucc     = 0,      // 成功
    // 1000~1999 , 公共错误码，各SERVER公共流程的错误码
    eReqDataLenErr     = 1000,    // 包体长度检查非法
    eReqMagicErr       = 1001,    // 魔术字非法
    eReqFrontCmdErr    = 1002,    // 前端命令字非法
    eReqBackCmdErr     = 1003,    // 后端命令字非法
    eReqBackSrcErr     = 1004,    // 后端命令来源非法
    eReqFromIdErr      = 1005,    // FromId非法
    eSTDecryErr        = 1006,    // ST解密失败
    eReqDecryErr       = 1007,    // 使用STKEY界面请求包失败
    eSTExpire          = 1008,    // ST过期
    eSystmeErr         = 1009,    // 系统异常
    eVerUnvalid        = 1010,    // 版本太低
    eReqLimit          = 1011,    // 请求频率限制
    eGetSvrErr         = 1012,    // 获取l5失败
    // 2000~2999，GMGR服务错误码
    eInitMemErr        = 2001,    //初始化访问存储失败
    eQueryMemErr       = 2002,    //查询存储失败
    eUpdateMemErr      = 2003,    //更新存储失败
    eDelMemErr         = 2004,    //删除存储失败
    eGetConfigErr      = 2005,    //获取服务配置错误
    eNotifyCreateErr   = 2006,    //通知游戏网关创建失败
    eGetRoomIdErr      = 2007,    //获取房间ID失败 或者 指定的房间ID不可用
    eCmdInvalid        = 2008,    //非法命令
    eRoomNotExist      = 2009,    //房间id不存在
    eInBlackList       = 2010,    //在黑名单
    eMatchTimeOut      = 2011,    //陌生人匹配超时
    // 3000~3999，GSVR服务错误码
    eGetRoomErr        = 3000,    // 查询房间信息失败
    eRoomStatusErr     = 3001,    // 房间状态异常
    eIsNotCreator      = 3002,    // 请求开始游戏的用户并非房主
    eIsNotInRoom       = 3003,    // 用户未在房间内
    eFlushTsErr        = 3004,    // 更新时间戳异常
    eLogoutIdErr       = 3005,    // 请求登出LOGOUTID与fromid不一致
    eIsNotInSvc        = 3006,    // 当前服务器处于不可服务状态
    eUsrOverFlow       = 3007,    // 当前服务器活跃用户数超过限制
    eRoomOverFlow      = 3008,    // 当前服务器活跃房间数超过限制
    eRoomIsExist       = 3009,    // 房间ID已经存在不能再创建
    eRmvUsrErr         = 3010,    // 用户离开房间处理失败
    eLoginSysErr       = 3011,    // 用户加入房间发生系统异常
    eUsrHasLoginErr    = 3012,    // 用户重复加入房间
    eRoomIsFullErr     = 3013,    // 房间已满员
    eCreateRoomErr     = 3014,    // 创建房间失败，系统异常
    ePlayerHasJoin     = 3015,    // 玩家已经加入房间，不允许挑战影子
    // 4000~4999，GCONN错误码
    eFowardToClientErr = 4000,    // 下行消息转发失败
    eFowardToSvrErr    = 4001,    // 上行消息转发失败
}

declare const enum BK_WS_ERR_CODE {
    NORMAL_CLOSE            = 1000,
    GOING_AWAY              = 1001,
    PROTO_ERRS              = 1002,
    UNSUPPORTED_DATA        = 1003,
    RESERVED1               = 1004,
    NO_STATUS_RECV          = 1005,
    ABNORMAL_CLOSE          = 1006,
    ERR_MSG_TYPE            = 1007,
    ILLEGAL_STG             = 1008,
    MSG_TOO_BIG             = 1009,
    NO_MORE_EXTS            = 1010,
    INTERNAL_SERVER_ERROR   = 1011,
    TLS_HANDSHAKE_FAIL      = 1015,
    HANDSHAKE_REQ_TIMEOUT   = 4096,
    HANDSHAKE_RSP_TIMEOUT   = 4097,
    HANDSHAKE_PARSE_ERROR   = 4098,
    CONTROL_PACKET_LARGE    = 4099,
    UNDEFINE                = 0xFFFF
}

declare const enum BK_WS_STATE {
    FAILED          = -1,
    CLOSED          = 0,
    CLOSING         = 1,
    HANDSHAKE_REQ   = 2,
    HANDSHAKE_RESP  = 3,
    ESTABLISHED     = 4
}

declare const enum BK_ATLAS_FORMAT {
    ALPHA           = 0, /*unused*/
    INTENSITY       = 1, /*unused*/
    LUMINANCE_ALPHA = 2, /*unused*/
    RGB565          = 3, /*unused*/
    RGBA4444        = 4,
    RGB888          = 5, /*unused*/
    RGBA8888        = 6
}

declare const enum BK_ATLAS_FILTER {
    NEAREST         = 0,
    LINEAR          = 1,
    MIPMAP          = 2,
    MIPMAP_NEAREST_NEAREST   = 3,
    MIPMAP_LINEAR_NEAREST    = 4,
    MIPMAP_NEAREST_LINEAR    = 5,
    MIPMAP_LINEAR_LINEAR     = 6
}

declare const enum BK_ATLAS_UV_WRAP {
    MIRROREDREPEAT  = 0,
    CLAMPTOEDGE     = 1,
    REPEAT          = 2
}

declare enum BK_BLEND_MODE
{
    BK_BLEND_ADDITIVE   = 0, // srcColor + dstColor
    BK_BLEND_MULTIPLY   =1, // srcColor + (1 - srcAlpha) * dstColor
    BK_BLEND_INTERPOLATIVE =2, // srcAlpha * srcColor + (1 - srcAlpha) * dstColor
}

declare const enum BK_COLOR_FORMAT {
    COLOR_ALPHA,
    COLOR_INTENSITY,
    COLOR_LUMINANCE_ALPHA,
    COLOR_RGB565,
    COLOR_RGBA4444,
    COLOR_RGB888,
    COLOR_RGBA8888,
    COLOR_LUMINANCE
}

declare const enum BK_BITMAP_OREINTATION {
    ROTATE_NONE   = 0,
    ROTATE_CW90   = 1,
    ROTATE_CW180  = 2,
    ROTATE_CW270  = 3,
    ROTATE_CCW90  = 4,
    ROTATE_CCW180 = 5,
    ROTATE_CCW270 = 6
}

declare class HTTPParser {
    static readonly RESPONSE: number;
    onComplete: any;
    headers: Map<string> ;
    statusCode: number;
    statusText: string;
    constructor(type:number);
    execute(data:string): Error;
}

declare interface GAMESTATUSINFO_DRESSINFO{
    "atlas" : string,
    "json" : string
}

declare interface GAMESTATUSINFO { 
    "svrIp" : string,       //游戏推荐ip。开发者可忽略
    "gameVersion" : string, //游戏版本号
    "isMaster" : number,    //是否房主，1房主，0参加者
    "dressPath" : Array<GAMESTATUSINFO_DRESSINFO>,//厘米秀衣服路径
    "gameId" : number,      //游戏id
    "networkType" : number,      //网络类型 1 电信 ，2 联通 ，3 移动  0: wifi或未知
    "roomId" : number,               //房间号
    "platform" : string,
    "openId" : string, //当前用户的标识
    "spriteDesignHeight" : number,//厘米秀小人spine动画的设计高度
    "QQVer" : string, //手机qq版本
    "isFirstPlay" : number,                 //是否第一次玩 1.第一次玩，0非第一次玩
    "skltPath" : GAMESTATUSINFO_DRESSINFO, //厘米秀小人spine骨骼
    "port" : number,  //推荐端口 开发者可忽略,
    "gameMode" : number,
    "aioType" : number,
    "avAppId" : number,
    "avAccountType" :number,
    "avRoomId" : number,
    "devPlatform"?:string //仅在开发环境下可以，手q环境下无该字段
}

/**
 * 全局变量
 */
declare var GameStatusInfo : GAMESTATUSINFO;

/**
 * environment
 */
declare let NETWORK_ENVIRONMENT_QQ_RELEASE //手Q环境，正式上线时使用此配置
declare let NETWORK_ENVIRONMENT_QQ_DEBUG   //手Q环境，调试时使用此配置
declare let NETWORK_ENVIRONMENT_DEMO_DEV   //开发环境,使用demo工程开发时使用此配置

/**
 * 递归销毁
 * @param {BK.Node} node 
 */
declare function disposeNodeTree(node:BK.Node):void;

/**
 * 定义声明在protocol.js
 */


/**
 * 点击测试
 * 
 * @param {BK.Node} node 
 * @param {BK.Position} pt 
 * @returns {BK.Node} 
 */
declare function nodeTreeHittest(node:BK.Node,pt:BK.Position):BK.Node;

declare namespace BK
{
     export interface Position{
        x:number;
        y:number;
    }

    export interface Rotation{
        x:number;
        y:number;
        z:number;
    }
    export interface Color {
        r:number;
        g:number;
        b:number;
        a:number;
    }

     export interface Scale {
        x:number;
        y:number;
    }

    export interface Size {
        width:number;
        height:number;
    }

    export interface Rect{
        x:number;
        y:number;
        width:number;
        height:number;
    }

    export interface Anchor {
        x:number;
        y:number;
    }

    export interface TextStyle{
        fontSize:number,
        textColor: number,
        maxWidth : number,
        maxHeight: number,
        width:number,
        height:number,
        textAlign:number,
        bold:number,
        italic:number,
        strokeColor:number,
        strokeSize:number,
        shadowRadius:number,
        shadowDx:number,
        shadowDy:number,
        shadowColor:number
    }

    export interface Vertex{
        x:number,
        y:number,
        z:number,

        r:number,
        g:number,
        b:number,
        a:number,

        u:number,
        v:number
    }


    export class Buffer
    {
        /**
         * 表示游标pointer是否到达Buffer末尾
         */
        eof:boolean;

        /**
         * 已写入的最大数据量
         */
        length:number;

        /**
         * 预分配的缓存容量
         */
        capacity:number;

        /**
         * 是否以网络序写入数据
         */
        netOrder:boolean;
        /**
         * 
         * @param length buffer长度
         * @param netOrder 是否为网络字节序 1为网络序，0非网络序
         */
        constructor(length:number,netOrder?:number);
        /**
         * 
         * @param length 
         * @param netOrder 是否为网络字节序  true为网络序，false非网络序
         */
        constructor(length:number,netOrder?:boolean);

        rewind(): void;

        jumpBytes(n:number): void;
        
        readStringBuffer():string;

        readUint8Buffer():number;

        readUint16Buffer():number;

        readUint32Buffer():number;

        readInt8Buffer():number;

        readInt16Buffer():number;

        readInt32Buffer():number;

        readFloatBuffer():number;

        readDoubleBuffer():number;

        readBuffer(length:number):BK.Buffer;

        readAsString(needTerminal?:boolean): string;

        writeBuffer(buf:BK.Buffer):void;

        writeUint8Buffer(num:number):void;

        writeUint16Buffer(num:number):void;

        writeUint32Buffer(num:number):void;

        writeInt8Buffer(num:number):void;

        writeInt16Buffer(num:number):void;

        writeInt32Buffer(num:number):void;

        writeFloatBuffer(num:number):void;

        writeDoubleBuffer(num:number):void;

        writeStringBuffer(str:string):void;

        writeUint64Buffer(num:number):void;

        writeAsString(s:string, needTerminal?:boolean): void;
        /**
         * 返回buffer长度
         * 单位为:字节
         * @returns {number} 
         * 
         * @memberof Buffer
         */
        bufferLength():number;

        /**
         * 销毁
         * 
         * @memberof Buffer
         */
        releaseBuffer():void;

        /**
         * 将游标pointer重置为0
         */
        rewind(): void;

        /**
         * 将游标pointer移动bytes字节
         * @param {number} bytes 
         */
        jumpBytes(bytes:number): void;

        /**
         * 截断已写入的数据缓存
         * @param {number} bytes 想要截断的数据量
         * @e.g. Buf.length = 512; Buf.truncateBytes(50); 那么Buf剩余已写入数据量为462
         */
        truncateBytes(bytes:number): void;
    }


    export class Script{
       static renderMode:number;

       /**
        * 输出log
        * @static
        * @param {number} level 
        * @param {number} errCode 
        * @param {string} info 
        * 
        * @memberof Script
        */
        static log(level:number,errCode:number,info:string):void;

        /**
         * 执行其他js脚本文件
         * 
         * @static
         * @param {string} scriptPath 
         * 
         * @memberof Script
         */
        static loadlib(scriptPath:string):void;
    }

    export class Director{
        /**
         * 屏幕比例
         */
        static screenScale:number;

        /**
         * 屏幕逻辑大小
         */
        static renderSize:Size;

        /**
         * 屏幕实际像素大小
         */
        static screenPixelSize:Size;

        /**
         * 根节点
         */
        static root:Node;

        /**
         * 帧率
         */
        static fps:number;

        /**
         * 屏幕模式
         */
        static screenMode:BK_SCREEN_MODE;

        /**
         * 全局定时器
         */
        static ticker:BK.MainTicker;

        static setQAVDelegate(delegate:any):void;

        /**
         * 附着一个物理引擎中的space至全局环境中
         * 
         * @param {BK.Physics.Space} attachSpace 
         * 
         * @memberof Director
         */
        attachSpace(attachSpace:BK.Physics.Space):void;


        //android特有方法
        static tickerPause();
        //android特有方法
        static tickerResume();
    }

    export namespace Time {
        var clock: number;
        var timestamp: number;

        /**
         * 计算时间差
         * @param prevClock 
         * @param curClock 
         * @return {number} 时间差值
         * @memberof Time
         */
        export function diffTime(prevClock:number,curClock:number): number;
    }

    export class Ticker{

        /**
         * 每调用60次所需的秒时 
         * 1代表 1秒调用60次。2代表2秒内调用60 。即1代表60帧/秒 2代表 30帧/秒
         * @type {number}
         * @memberof Ticker
         */
        interval:number;


        /**
         * 暂停 
         * true代表暂停，flase代表运行
         * 
         * @type {boolean}
         * @memberof Ticker
         */
        paused:boolean;

        /**
         * Creates an instance of Ticker.
         * 
         * @memberof Ticker
         */
         constructor();
         /**
          * 销毁函数
          * 
          * 
          * @memberof Ticker
          */
         dispose():void;


         /**
          * 设置定时回调函数
          * 
          * @param {(ts:number,duration:number)=>void} callback 
          * 
          * @memberof Ticker
          */
         setTickerCallBack(callback:(ts:number,duration:number)=>void):void;
     }

     /**
      * 代码实现在brick.js
      */
     export class MainTicker extends Ticker{
        /**
        * 添加定时回调函数
        * 
        * @param {(ts:number, duration:number,obj?:any)=>void} callback 
        * @param {*} [obj] 
        * @memberof MainTicker
        */
        add(callback:(ts:number, duration:number,obj?:any)=>void,obj?:any):void;

        /**
         * 移除绑定
         * 
         * @param {*} [obj] 
         * @memberof MainTicker
         */
        remove(obj?:any):void;

        /**
         * 
         * @param func 回调函数
         * @param millsecond 等候时间，单位为毫秒
         * @param obj （选填）绑定对象
         */
        setTimeout(func:(ts:number, dt:number, object:any)=>void,millsecond:number,obj?:any);

        /**
         * 移除绑定对象对应的回调函数
         * 
         * @param {*} obj 
         */
        removeTimeout(obj:any);
     }

     //export var Ticker;

     export class Node{
        constructor();

        /**
         *  本地坐标转世界坐标
         * @param {Position} position 相对于当前节点的位置
         * @returns {Position} 相对于世界坐标的位置
         * 
         * @memberof Node
         */
        convertToWorldSpace(position:Position):Position;

        /**
         * 
         *  世界坐标转本地坐标
         * 
         * @param {Position} position 相对于世界坐标的位置
         * @returns {Position} 相对于当前节点的坐标的位置
         * 
         * @memberof Node
         */
        convertToNodeSpace(position:Position):Position;


        /**
         * 添加节点
          * 
          * @param {Node} node 
          * @param {number} [index] 
          * @memberof Node
          */
        addChild(node:Node,index?:number):void;

        /**
         * 根据Id移除子节点
         * 
         * @param {number} id 
         * @param {boolean} isDispose 
         * 
         * @memberof Node
         */
        removeChildById(id:number,isDispose:boolean):void;

        /**
         * 根据name移除子节点
         * 
         * @param {string} name name待移除的节点名
         * @param isDispose  是否释放内存
         * 
         * @memberof Node
         */

        removeChildByName(name:string,isDispose:boolean):void;

        /**
         * 移除节点
         * @param node
         */
        removeChild(node:BK.Node);

        /**
         * 从父节点中移除本节点
         * 
         * 
         * @memberof Node
         */
        removeFromParent():void;

        /**
         * 判断当前节点是否被点击
         * 
         * @param {BK.Position} worldPonint 需判定的点。必须为世界坐标系
         * @returns {boolean} 
         * 
         * @memberof Node
         */
        hittest(worldPonint:BK.Position):boolean;

        /**
         * 附着一个物理引擎中的刚体对象至当前节点
         * 
         * @param {BK.Physics.Body} body 
         * @memberof Node
         */
        attachBody(body: BK.Physics.Body) : void;

        detachComponent(component: any) : void;

        attachComponent(component: any) : void;

        /**
         * 销毁
         * @memberof Node
         */
        dispose():void;
        /**
         * 标识
         */
        id :number ;

        /**
         * 名称
         */
        name :string ;          

        /**
         * 位置
         */
        position :Position ;   

        /**
         * 比例
         */
        scale :Scale ;

        /**
         * 旋转
         */
        rotation :Rotation ;


        /**
         * 顶点颜色 
         */
        vertexColor :Color ;

        /**
         * 矩阵变换
         */
        transform :Object ;     

        /**
         * 父亲节点
         */
        parent :Node ;          

        /**
         * 子节点
         */
        children :Array<Node> ; 

        /**
         * z轴排序。 值越小越前
         */
        zOrder :number ;

        /**
         * 是否可以用户交互
         */
        canUserInteract :boolean ;

        /**
         * 是否隐藏 
         */
        hidden :boolean ;           

        /**
         * 物理引擎中刚体  详情参考 BK.Physics.Body
         */
        body :Object ;              
    }

    export class Sprite extends Node{
        /**
         * Creates an instance of Sprite.
         * @param {number} width 宽
         * @param {number} height 高
         * @param {Texture} texture 纹理 
         * @param {number} flipU 是否左右翻转
         * @param {number} flipV 是否上下翻转
         * @param {number} stretchX 是否拉伸x
         * @param {number} stretchY 是否拉伸y
         * 
         * @memberof Sprite
         */
        constructor(width:number,height:number,texture:Texture,flipU:number,flipV:number,stretchX:number,stretchY:number);

        /**
         * 设置纹理
         * 
         * @param {Texture} texture 纹理对象.由BK.Texture生成的对象
         * 
         * @memberof Sprite
         */
        setTexture(texture:Texture):void;

        /**
         * 设置翻转
         * 
         * @param {number} u 
         * @param {number} v 
         * 
         * @memberof Sprite
         */
        setUVFlip(u:number,v:number):void;

        /**
         * 
         * @param u 
         * @param v 
         */
        setUVWrap(u:number,v:number):void;

        setUVRotate(rotate:number):void;

        /**
         * 
         * 
         * @param {number} x 
         * @param {number} y 
         * @memberof Sprite
         */
        setXYStretch(x:number,y:number):void;

        /**
         *  大小
         */
        size:Size;

        /**
         * 锚点
         */
        anchor:Anchor;


        /**
         * 圆角
         */
        cornerRadius:number;
        
        /**
         * 混合模式
         */
        blendMode:number;
        
        /**
         * 调整纹理位置
         * 
         * @param {number} x 
         * @param {number} y 
         * @param {number} width 
         * @param {number} height 
         * @memberof Sprite
         */
        adjustTexturePosition(x:number,y:number,width:number,height:number,rotated?:boolean):void;

        renderAsTexture(): BK.RenderTexture;
    }

    export class Mesh extends Node{

        /**
         * 
         * @param tex 纹理
         * @param vertexes 顶点数组
         * @param indeces  索引数组
         */
        constructor(tex:BK.Texture,vertexes:Array<Vertex>,indeces:Array<number>);

        /**
         * 重设顶点与索引数组
         * 
         * @param {Array<Vertex>} vertexes 
         * @param {Array<number>} indeces 
         * 
         * @memberof Mesh
         */
        setVerticesAndIndices(vertexes:Array<Vertex>,indeces:Array<number>):void;

        /**
         * 添加顶点与索引数组至现有的数组中
         * 
         * @param {Array<Vertex>} vertexes 
         * @param {Array<number>} indeces 
         * 
         * @memberof Mesh
         */
        addVerticesAndIndices(vertexes:Array<Vertex>,indeces:Array<number>):void;

        /**
         * 移除某些顶点数组与索引数组
         * 
         * @param {number} vexIdx 待删除的顶点数组 起始下标
         * @param {number} vexLen 从起始坐标算起需要删除的个数
         * @param {number} iIdx  待删除的索引数组 起始下标
         * @param {number} iLen  从起始坐标算起需要删除的个数
         * 
         * @memberof Mesh
         */
        removeVerticesAndIndices(vexIdx:number,vexLen:number,iIdx:number,iLen:number):void;

    }

    /////Spine动画/////
    export class SkeletonAnimation extends Node {
       /**
        * Creates an instance of SkeletonAnimation.
        * @param {string} atlasPath 
        * @param {string} jsonPath 
        * @param {number} timeScale 
        * @param {(animName:string,trackId:number)=>void} startCallBack 
        * @param {(animName:string,trackId:number)=>void} completeCallBack 
        * @param {(animName:string,trackId:number)=>void} endCallBack 
        * 
        * @memberof SkeletonAnimation
        */
        constructor(atlasPath:string,jsonPath:string,timeScale:number,startCallBack:(animName:string,trackId:number)=>void,completeCallBack:(animName:string,trackId:number)=>void,endCallBack:(animName:string,trackId:number)=>void);

        /**
         * 加载装扮
         * @param {string} jsonPath atlas文件路径
         * @param {string} atlasPath json文件路径
         * 
         * @memberof SkeletonAnimation
         */
        setAccessory(jsonPath:string,atlasPath:string):void;

        /**
         * 移除装扮
         * @param {string} accessoryName 
         * 
         * @memberof SkeletonAnimation
         */
        removeAccessory(accessoryName:string):void;

        /**
         * 加载气泡
         * 
         * @param {string} jsonPath  气泡json文件路径
         * @param {string} atlasPath 气泡atlas文件路径
         * @param {string} content 气泡文案
         * 
         * @memberof SkeletonAnimation
         */
        setAccessoryWithInfo(jsonPath:string, atlasPath:string,content:string):void;

        /**
         * 添加动画 （只添加，未播放）
         * @param {string} jsonPath atlas文件路径
         * @param {string} atlasPath json文件路径
         * @param {string} animationName 动作名
         * 
         * @memberof SkeletonAnimation
         */
        setAccessoryAnimation(jsonPath:string, atlasPath:string,animationName:string):void;

        /**
         * 移除动画
         * 
         * @param {any} animationName 动作名
         * 
         * @memberof SkeletonAnimation
         */
        removeAccessoryAnimation(animationName:string):void;

        /**
         * 查询是否存在动画
         * 
         * @param {any} animationName  动作名
         * @returns {boolean} 是否存在动作
         * 
         * @memberof SkeletonAnimation
         */
        containAnimation(animationName:string):boolean;

        /**
         * 播放动画 
         * 
         * @param {number} track 索引id
         * @param {string} name 动画名
         * @param {boolean} loop 是否循环播放
         * 
         * @memberof SkeletonAnimation
         */
        setAnimation(track:number, name:string, loop:boolean):void;

        /**
         * 暂停播放
         * 
         * @memberof SkeletonAnimation
         */
        pauseAnimation():void;

        /**
         * 设置开始播放回调
         * @param callback 
         */
        setStartCallback(callback:(animName:string,trackId:number)=>void):void;

        /**
         * 设置播放一次动作时的回调
         * @param callback 
         */
        setCompleteCallback(callback:(animName:string,trackId:number)=>void):void;

        /**
         * 设置播放完成，即将播放下个动作时的回调
         * @param callback 
         */
        setEndCallback(callback:(animName:string,trackId:number)=>void):void;

        /**
         * 打开颜色叠加。默认为false
         * 如需使用vertexColor,本属性需设置为true
         */
        canMixVertexColor : boolean;

        /**
         * 播放速率
         */
        timeScale : number;

        /**
         * 当前动画是否暂停
         * 
         * @type {boolean}
         * @memberof SkeletonAnimation
         */
        paused : boolean;

        /**
         * 获取所有slot槽的名字
         * 手Q版本 7.2.0
         * 
         * @returns {Array<String>} 
         * @memberof SkeletonAnimation
         */
        getSlotNames():Array<String>;

        /**
         * 设置某个slot槽的绘制颜色
         * 
         * @param {string} slotName 
         * @param {BK.Color} color 
         * @memberof SkeletonAnimation
         */
        setSlotColor(slotName:string,color:BK.Color);

        /**
         * 获取在某个slot槽的attachment名字
         * 手Q版本7.2.0
         * 
         * @param {string} slotName 
         * @returns {string} 
         * @memberof SkeletonAnimation
         */
        getAttachmentBySlotName(slotName:string):string;

        /**
         * 设置某个attachment到某个slot中
         * 手Q版本7.2.0
         * 
         * @param {string} slotName 
         * @param {string} attachmentName 
         * @memberof SkeletonAnimation
         */
        setAttachmentBySlotName(slotName:string,attachmentName:string):void;

        /**
         * 获取所有的骨骼名字
         * 
         * 手Q版本7.2.0
         * 
         * @returns {Array<string>} 
         * @memberof SkeletonAnimation
         */
        getBoneNames():Array<string>;

        /**
         * 设置某个骨骼的位置
         * 
         * 手Q版本7.2.5
         * 
         * @param {string} boneName 
         * @param {BK.Position} position 本地坐标
         * @memberof SkeletonAnimation
         */
        setBonePosition(boneName:string,position:BK.Position):void;

        /**
         * 获取某个骨骼的位置
         * 
         * 手Q版本7.2.5
         * 
         * @param {string} boneName 
         * @returns {BK.Position} 本地坐标
         * @memberof SkeletonAnimation
         */
        getBonePosition(boneName:string):BK.Position;

        /**
         * 设置某个骨骼的缩放比
         * 
         * @param {string} boneName 
         * @param {BK.Scale} scale 
         * @memberof SkeletonAnimation
         */
        setBoneScale(boneName:string,scale:BK.Scale);

        /**
         * 获取某个骨骼的缩放比
         * 
         * @param {string} boneName 
         * @returns {BK.Scale} 
         * @memberof SkeletonAnimation
         */
        getBoneScale(boneName:string):BK.Scale;

        /**
         * 设置骨骼的旋转角度
         * 手Q版本7.2.0
         * 
         * @param {string} boneName 
         * @param {number} rotation 
         * @memberof SkeletonAnimation
         */
        setBoneRotation(boneName:string,rotation:number):void;
        
        /**
         * 获取骨骼的旋转角度
         * 
         * @param {string} boneName 
         * @returns {number} 
         * @memberof SkeletonAnimation
         */
        getBoneRotation(boneName:string):number;

        /**
         * 装扮类型数组。厘米秀中有7件装扮
         * 
         * @type {Array<string>}
         * @memberof SkeletonAnimation
         */
        accessoryTypes:Array<string>;

        /**
         * 设置某个装扮的颜色
         * 
         * @param {string} accType 装扮类型
         * @param {BK.Color} color 
         * @memberof SkeletonAnimation
         */
        setAccessoryColor(accType:string,color:BK.Color);

        /**
         * 判断某件装扮是否被点击
         * 
         * @param {string} accType 
         * @param {BK.Position} worldPoint 
         * @returns {Boolean} 
         * @memberof SkeletonAnimation
         */
        hittestAccessory(accType:string,worldPoint:BK.Position):Boolean;

        /**
         * 判断某件slot是否被点击
         * @param slotName 
         * @param worldPoint 
         */
        hittestSlotByName(slotName:string,worldPoint:BK.Position):Boolean;

        /**
         * 获取某个slot的draworder，越小越早绘制
         * @param slotName 
         */
        getSlotDrawOrder(slotName:string):number;

        /**
         * 根据slotname获取对应骨骼的名字
         * @param slotName 
         */
        getBoneNameBySlotName(slotName:string):string;
    }

    export class FileUtil {
       /**
        * 读取文件
        * 
        * @param {string} path 文件路径
        * @returns {BK.Buffer} 读取的内容
        * @memberof FileUtil
        */
        static readFile(path:string):BK.Buffer;

        /**
         * 写文件
         * 
         * @static
         * @param {string} path 
         * @param {BK.Buffer} buff 
         * @memberof FileUtil
         */
        static writeFile(path:string,buff:BK.Buffer):void;

        /**
         * 文件是否存在
         * 
         * @static
         * @param {string} path 
         * @returns {boolean} 
         * @memberof FileUtil
         */
        static isFileExist(path:string):boolean;
    }


    /////渲染相关/////

    export class Texture{

        /**
         * @param 纹理路径
         */
        constructor(path:string);

        /**
         * 
         * @param path 路径
         * @param format 资源格式 6代表RGBA8888,4代表RGBA4444
         * @param minFilter 缩小采样方式  0最近采样 1线性采样
         * @param magFilter 放大采样方式  0最近采样 1线性采样
         * @param uWrap u轴重复方式 0镜像重复，1重复至边缘，0重复
         * @param vWrap v轴重复方式 0镜像重复，1重复至边缘，0重复
         */
        constructor(path:string,format:number,minFilter:number,magFilter:number,uWrap:number,vWrap:number);

        /**
         * 纹理实际像素大小
         */
        size : Size;

        writeToDisk(path: string): void;

        uploadSubData(offsetX:number, offsetY:number, width:number, height:number, buffer:BK.Buffer): void;

        static createTexture(width: number, height: number): BK.Texture;
        static createBitmapTexture(width:number, height:number, format?:number): BK.Texture;
    }

    export class Bitmap {
        width: number;
        height: number;
        format: number;
        oreintation: BK_BITMAP_OREINTATION;
        buffer: any;
    }

    export class Text extends Sprite{
        /**
         * Creates an instance of Text.
         * @param {TextStyle} style 
         * @param {string} content 
         * 
         * @memberof Text
         */
        constructor(style:TextStyle,content:string);
      
        /**
         * measure text size with style
         * @param {TextStyle} style 
         * @param {string} content 
         * 
         * @memberof Object
         */
        measureTextSize(style:TextStyle,content);
        
        /**
         * get Text real size;
         * 
         * @memberof Object
         */
        getTextSize();
        
        /**
         * 文案
         */
        content:string;
    }

    export namespace MQQ{

        export class Webview{
            /**
             * 打开一个webview
             * 
             * @static
             * @param {string} url 
             * 
             * @memberof Webview
             */
            static open(url:string):void;
        }

         export class SsoRequest{
             /**
              * 发送SSO消息
              * 
              * @static
              * @param {object} obj 请求的数据
              * @param {string} cmd 命令字
              * 
              * @memberof SsoRequest
              */
             static send(obj:object,cmd:string);

             /**
              * 添加某个对象监听某个命令
              *
              * @static
              * @param cmd  命令字
              * @param target 绑定的对象
              * @param callback 回调函数
              */
             static addListener(cmd:string,target:Object,callback:(errCode:number,cmd:string,data:Object)=>void);

             /**
              * 移除某个对象对某个命令的事件监听
              * 
              * @static
              * @param {string} cmd 命令字
              * @param {Object} targer 待解除绑定的对象
              * 
              * @memberof SsoRequest
              */
             static removeListener(cmd:string,targer:Object);
         }

         interface HeadBufferInfo{
             buffer : BK.Buffer,
             width:number,
             height:number
         }
         
         export class Account{
             /**
              * 获取头像信息
              * 
              * @static
              * @param {string} openId 
              * @param {(openId:string,BuffInfo:HeadBufferInfo)=>void} callback 
              * 
              * @memberof Account
              */
             static getHead(openId:string,callback:(openId:string,BuffInfo:HeadBufferInfo)=>void)

             /**
              * 获取昵称
              * 
              * @static
              * @param {string} openId 
              * @param {(openId:string,nick:string)=>void} callback 
              * 
              * @memberof Account
              */
             static getNick(openId:string,callback:(openId:string,nick:string)=>void)
         }
    }
    export class Button extends Sprite{
        constructor(width:number,height:number,texturePath:string,callback:(node:BK.Node)=>void);

        /**
         * 设置普通态纹理路径
         * 
         * @param {string} path 
         * @memberof Button
         */
        setNormalTexturePath(path:string);

        /**
         * 设置点击态纹理路径
         * 
         * @param {string} path 
         * @memberof Button
         */
        setPressTexturePath(path:string);

        /**
         * 设置禁止态纹理路径
         * 
         * @param {string} path 
         * @memberof Button
         */
        setDisableTexturePath(path:string);

        /**
         * 设置点击回调
         * 
         * @param {(node:BK.Node)=>void} callback 
         * @memberof Button
         */
        setTouchInsideCallback(callback:(node:BK.Node)=>void);
    }

    export namespace Physics{
        /**
         *  变换矩阵
         * 
         *   a  b  x
         *   c  d  y
         *   0  0  1
         * @export
         * @interface Transform
         */
        export interface Transform{
            a:number;
            b:number;
            c:number;
            d:number;
            x:number;
            y:number;
        }


        export class Body{
            constructor();
        }
        export class Space{
            constructor();
        }

        export class PolygonShape{
            /**
             * Creates an instance of PolygonShape.
             * @param {Body} body 
             * @param {Array<Position>} polyPts 
             * @param {number} radius 
             * 
             * @memberof PolygonShape
             */
            constructor(body:Body,polyPts:Array<Position>,transfrom:BK.Physics.Transform,radius:number)
        }
    }

    export class Socket {
        state: BK_NET_STATE;
        /**
         * close socket
         * @returns {number}
         */
        close(): number

        /**
         * connect socket
         * @param {string} ip
         * @param {number} port
         * @returns {number} 
         */
        connect(ip: string, port: number): number

        /**
         * update socket
         * @returns {number}
         */
        update(): number

        /**
         * send data 
         * @param {BK.Buffer} data
         * @returns {number}
         */
        send(data: BK.Buffer): number

        /**
         * recv data
         * @param {number} length
         * @returns {BK.Buffer}
         */
        receive(length: number): BK.Buffer

        canReadLength(): number;

        getSSLEnable(): boolean;

        setSSLEnable(enable: boolean): void;
    }

    export namespace Misc {
        /**
         * caculate SHA1
         * @param {string} message
         * @returns {BK.Buffer}
         */
        export function sha1(message:string): BK.Buffer

        /**
         * encode base64 from string
         * @param {string} inputStr
         * @param {number} inputStrLen?
         * @returns {string}
         */
        export function encodeBase64FromString(inputStr:string, inputStrLen?:number): string

        /**
         * encode base64 from buffer
         * @param {BK.Buffer} inputBuffer
         * @returns {string}
         */
        export function encodeBase64FromBuffer(inputBuffer:BK.Buffer): string

        /**
         * decode base64
         * @param {string} inputString
         * @returns {string}
         */
        export function decodeBase64(inputString:string): string

        /**
         * 用mask缓存异或数据缓存
         * @param data {BK.Buffer}
         * @param mask {BK.Buffer}
         */
        export function encodeBufferXorMask4(data:BK.Buffer, mask:BK.Buffer): void

        /**
         * 判断是否为小端序
         */
        export function isLittleEndian(): boolean;

        /**
         * 将BK.Buffer转换为ArrayBuffer
         * @param buf 
         * @return ArrayBuffer
         */
        export function BKBufferToArrayBuffer(buf: BK.Buffer): ArrayBuffer;

        /**
         * 将ArrayBuffer转换为BK.Buffer
         * @param buf 
         * @return BK.Buffer
         */
        export function arrayBufferToBKBuffer(buf: ArrayBuffer): BK.Buffer;
    }

    export function URL(cfg:string, url:string): any;

    export namespace DNS {
        export function queryIPAddress(hostname:string, 
                                       callback:(reason:number, af:number, iplist:Array<string>)=>void,
                                       af?:number, 
                                       timeout?:number): void;
    }

    export interface WebSocketData {
        /**
         * websocket数据
         */
        data:BK.Buffer;

        /**
         * 标记是否是二进制模式的数据
         */
        readonly isBinary:boolean;
    }

    export interface IWebSocket {
        /**
         * 当websocket连接成功时调用
         * @param {IWebSocket} ws
         */
        onOpen: (IWebSocket) => void;

        /**
         * 当websocket连接正常关闭时调用
         * @param {IWebSocket} ws
         */
        onClose: (IWebSocket) => void;

        /**
         * 当websocket连接发生错误时调用
         * @param {IWebSocket} ws
         */
        onError: (IWebSocket) => void;

        /**
         * 当websocket连接有消息到达时调用
         * @param {IWebSocket}
         * @param {WebSocketData}
         */
        onMessage: (IWebSocket, WebSocketData) => void;

        /**
         * 获取websocket的状态
         * @return {BK_WS_STATE}
         */
        getReadyState(): BK_WS_STATE;

        /**
         * 获取websocket的错误码
         * @return {BK_WS_ERR_CODE}
         */
        getErrorCode(): BK_WS_ERR_CODE;

        /**
         * 获取websocket的错误描述
         * @return {string}
         */
        getErrorString(): string;

        /**
         * 以正常流程关闭websocket
         */
        close(): void;

        /**
         * 建立websocket连接
         * @return {boolean}
         */
        connect(): boolean;

        /**
         * 发送数据
         * @param {string|BK.Buffer} data
         * @return {boolean}
         */
        send(data:any): boolean;

        /**
         * 选项设置
         * 目前支持选项:
         * DrainSegmentCount: 一次发送分片数量, 默认值为8
         * DefaultSegmentSize: 默认分片大小, 以字节为单位, 默认值为512
         * PingPongInterval: ping-pong发送间隔, 以毫秒为单位, 默认值为3000
         * HandleShakeRequestTimeout: 发起handshake请求后超时限制, 以毫秒为单位, 默认值为10*1000
         * HandleShakeResponseTimeout: 首次收到handshake回应后超时限制, 以毫秒为单位, 默认值为10*1000
         * CloseAckTimeout: 发起close帧后等待确认时间限制, 以毫秒为单位, 默认值为20*1000
         * PingPongTimeout: 发送ping帧后等待pong帧的时间限制, 以毫秒为单位, 默认值为3000
         * @param {object} options
         * 
         */
        setOptions(options:object): void;
    }

    export var WebSocket; 


    /*
        Int8 : 0x21,
        Uint8 : 0x22,
        Int16 : 0x21,
        Uint16 : 0x24,
        Int32 : 0x25,
        Uint32 : 0x26,
        Int64 : 0x27,
        Uint64 : 0x28,
        Byte : 0x29,
        Double : 0x2a,
        Float : 0x2b,
        Int8Repeated : 0x31,
        Uint8Repeated : 0x32,
        Int16Repeated : 0x33,
        Uint16Repeated : 0x34,
        Int32Repeated : 0x35,
        Uint32Repeated : 0x36,
        Int64Repeated : 0x37,
        Uint64Repeated : 0x38,
        ByteRepeated : 0x39,
        DoubleRepeated : 0x3a,
        FloatRepeated : 0x3b
     */
    export class TLV
    {
        /**
         * 通过长度生成
         * @param {number} length 生成的TLV长度
         * @memberof TLV
         */
        constructor(length:number);

        /**
         * 通过BK.Buffer生成
         * @param {BK.Buffer} buffer 
         * @memberof TLV
         */
        constructor(buffer:BK.Buffer);
        
        /**
         * 解析TLV对象
         * 
         * @returns {Any} 
         * @memberof TLV
         * mqq veriosn > 7.1.5
         */
        bkJSParseTLV():any;

        /**
         * 写入一个uint8值
         * 
         * @param {number} value    写入数据的值
         * @param {number} dataType 写入数据的类型
         * @param {number} tag      标记
         * @memberof TLV
         *  mqq veriosn > 7.1.5
         */
        bkJSTLVWriteInt8(value:number,dataType:number,tag:number):void;
        
         /**
         * 写入一个Int16值
         * 
         * @param {number} value    写入数据的值
         * @param {number} dataType 写入数据的类型
         * @param {number} tag      标记
         * @memberof TLV
         *  mqq veriosn > 7.1.5
         */
        bkJSTLVWriteInt16(value:number,dataType:number,tag:number):void;

        /**
         * 写入一个Int32值
         * 
         * @param {number} value    写入数据的值
         * @param {number} dataType 写入数据的类型
         * @param {number} tag      标记
         * @memberof TLV
         *  mqq veriosn > 7.1.5
         */
        bkJSTLVWriteInt32(value:number,dataType:number,tag:number):void;

        /**
         * 写入一个Int64值
         * 
         * @param {number} value    写入数据的值
         * @param {number} dataType 写入数据的类型
         * @param {number} tag      标记
         * @memberof TLV
         *  mqq veriosn > 7.1.5
         */
        bkJSTLVWriteInt64(value:number,dataType:number,tag:number):void;

        /**
         * 写入一个UInt8值
         * 
         * @param {number} value    写入数据的值
         * @param {number} dataType 写入数据的类型
         * @param {number} tag      标记
         * @memberof TLV
         *  mqq veriosn > 7.1.5
         */
        bkJSTLVWriteUInt8(value:number,dataType:number,tag:number):void;

        /**
         * 写入一个UInt16值
         * 
         * @param {number} value    写入数据的值
         * @param {number} dataType 写入数据的类型
         * @param {number} tag      标记
         * @memberof TLV
         *  mqq veriosn > 7.1.5
         */
        bkJSTLVWriteUInt16(value:number,dataType:number,tag:number):void;

         /**
         * 写入一个UInt32值
         * 
         * @param {number} value    写入数据的值
         * @param {number} dataType 写入数据的类型
         * @param {number} tag      标记
         * @memberof TLV
         *  mqq veriosn > 7.1.5
         */
        bkJSTLVWriteUInt32(value:number,dataType:number,tag:number):void;

         /**
         * 写入一个UInt64值
         * 
         * @param {number} value    写入数据的值
         * @param {number} dataType 写入数据的类型
         * @param {number} tag      标记
         * @memberof TLV
         *  mqq veriosn > 7.1.5
         */
        bkJSTLVWriteUInt64(value:number,dataType:number,tag:number):void;

        /**
         * 写入一个float值
         * 
         * @param {number} value    写入数据的值
         * @param {number} dataType 写入数据的类型
         * @param {number} tag      标记
         * @memberof TLV
         *  mqq veriosn > 7.1.5
         */
        bkJSTLVWriteFloat(value:number,dataType:number,tag:number):void;

        /**
         * 写入一个double值
         * 
         * @param {number} value    写入数据的值
         * @param {number} dataType 写入数据的类型
         * @param {number} tag      标记
         * @memberof TLV
         *  mqq veriosn > 7.1.5
         */
        bkJSTLVWriteDouble(value:number,dataType:number,tag:number):void;


        /**
         * 写入一个Buffer值
         * 
         * @param {number} value    写入数据的值
         * @param {number} dataType 写入数据的类型
         * @param {number} tag      标记
         * @memberof TLV
         *  mqq veriosn > 7.1.5
         */
        bkJSTLVWriteBuffer(value:BK.Buffer,dataType:number,tag:number):void;

        /**
         * 获得长度
         * 
         * @returns {number} 
         * @memberof TLV
         *  mqq veriosn > 7.1.5
         */
        bkJSTLVGetLength():number;



        /**
         * 解析TLV对象
         * 
         * @returns {Any} 
         * @memberof TLV
         * mqq veriosn > 7.2.0
         */
        parseTLV():Object;

        /**
         * 写入一个uint8值
         * 
         * @param {number} value    写入数据的值
         * @param {number} dataType 写入数据的类型
         * @param {number} tag      标记
         * @memberof TLV
         *  mqq veriosn > 7.2.0
         */
        writeInt8(value:number,dataType:number,tag:number):void;
        
         /**
         * 写入一个Int16值
         * 
         * @param {number} value    写入数据的值
         * @param {number} dataType 写入数据的类型
         * @param {number} tag      标记
         * @memberof TLV
         *  mqq veriosn > 7.2.0
         */
        writeInt16(value:number,dataType:number,tag:number):void;

        /**
         * 写入一个Int32值
         * 
         * @param {number} value    写入数据的值
         * @param {number} dataType 写入数据的类型
         * @param {number} tag      标记
         * @memberof TLV
         *  mqq veriosn > 7.2.0
         */
        writeInt32(value:number,dataType:number,tag:number):void;

        /**
         * 写入一个Int64值
         * 
         * @param {number} value    写入数据的值
         * @param {number} dataType 写入数据的类型
         * @param {number} tag      标记
         * @memberof TLV
         *  mqq veriosn > 7.2.0
         */
        writeInt64(value:number,dataType:number,tag:number):void;

        /**
         * 写入一个UInt8值
         * 
         * @param {number} value    写入数据的值
         * @param {number} dataType 写入数据的类型
         * @param {number} tag      标记
         * @memberof TLV
         *  mqq veriosn > 7.2.0
         */
        writeUInt8(value:number,dataType:number,tag:number):void;

        /**
         * 写入一个UInt16值
         * 
         * @param {number} value    写入数据的值
         * @param {number} dataType 写入数据的类型
         * @param {number} tag      标记
         * @memberof TLV
         *  mqq veriosn > 7.2.0
         */
        writeUInt16(value:number,dataType:number,tag:number):void;

         /**
         * 写入一个UInt32值
         * 
         * @param {number} value    写入数据的值
         * @param {number} dataType 写入数据的类型
         * @param {number} tag      标记
         * @memberof TLV
         *  mqq veriosn > 7.2.0
         */
        writeUInt32(value:number,dataType:number,tag:number):void;

         /**
         * 写入一个UInt64值
         * 
         * @param {number} value    写入数据的值
         * @param {number} dataType 写入数据的类型
         * @param {number} tag      标记
         * @memberof TLV
         *  mqq veriosn > 7.2.0
         */
        writeUInt64(value:number,dataType:number,tag:number):void;

        /**
         * 写入一个float值
         * 
         * @param {number} value    写入数据的值
         * @param {number} dataType 写入数据的类型
         * @param {number} tag      标记
         * @memberof TLV
         *  mqq veriosn > 7.2.0
         */
        writeFloat(value:number,dataType:number,tag:number):void;

        /**
         * 写入一个double值
         * 
         * @param {number} value    写入数据的值
         * @param {number} dataType 写入数据的类型
         * @param {number} tag      标记
         * @memberof TLV
         *  mqq veriosn > 7.2.0
         */
        writeDouble(value:number,dataType:number,tag:number):void;


        /**
         * 写入一个Buffer值
         * 
         * @param {number} value    写入数据的值
         * @param {number} dataType 写入数据的类型
         * @param {number} tag      标记
         * @memberof TLV
         *  mqq veriosn > 7.2.0
         */
        writeBuffer(value:BK.Buffer,dataType:number,tag:number):void;

        /**
         * 获得长度
         * 
         * @returns {number} 
         * @memberof TLV
         *  mqq veriosn > 7.2.0
         */
        getLength():number;
        
        /**
         * 
         */
        bkJSTLVGetBuffer():BK.Buffer;

        tag201:any;
    }

    //房间手Q消息管理类
    export class QQ
    {
        /**
         * 通知手q,用户点击了缩小按钮
         * 
         * @static
         * @memberof QQ
         */
        static notifyHideGame();        
        
        /**
         * 通知手q,用户点击了关闭按钮
         * 
         * @static
         * @memberof QQ
         */
        static notifyCloseGame();        

        /**
         * 通知手q,游戏即将开始
         * 
         * @static
         * @memberof QQ
         */
        static notifyReadyGame();        

        /**
         * 通知手q,等待玩家加入
         * 
         * @static
         * @memberof QQ
         */
        static notifyGameTipsWaiting();        

        /**
         * 通知手q,新玩家加入房间
         * @param nick 昵称
         * @memberof QQ
         */
        static notifyGameTipsSomeOneJoinRoom(nick:string);
        
        /**
         * 通知手q,游戏进行中
         * 
         * @static
         * @memberof QQ
         */
        static notifyGameTipsPlaying();
               
        /**
         * 通知手q,游戏已结束
         * 
         * @static
         * @memberof QQ
         */
        static notifyGameTipsGameOver()
        
        /**
         * 邀请好友加入游戏。支持手q/微信
         * 
         * @static
         * @param {string} wording 文案
         */
        static inviteFriend(wording:string);
        
        /**
         * 查询是否关注公众号
         * 
         * @static
         * @param {any} puin 
         * @param {any} callback 
         * @memberof QQ
         */
        static checkPubAccountState(puin:string,callback:(errorCode:number,cmd:string,data:object)=>void);
        
        /**
         * 进入公众号资料卡
         * 
         * @static
         * @param {any} puin 
         * @memberof QQ
         */
        static enterPubAccountCard(puin:string):void;

        /**
         * 
         * @param callback 
         */
        static addSSOJoinRoomCallBack(callback:(err:number,cmd:string,data:any)=>void):void;

        static notifyJoinRoom(newJoinPlayers:Array<any>,data:any,errCode:number);

        static notifyNewRoom(roomId:number,ret:number):void;

        static ssoJoinRoomCallback(errCode:number, cmd:string, data:any);

        static notifyStartGameSrv();
        
        /**
         * 
         * @param newJoinPlayers 
         * @param roomid 
         * @param isCreator  1为创建者
         */
        static notifyNewOrJoinRoomSrv(newJoinPlayers:Array<any>,roomid:number,isCreator:number);
    }

    
    interface RoomPlayerFrameData{
        openId:string,
        itemId:number,
        dataBuffer:BK.Buffer,
        frameSeq:number, //帧序列号
    }
    
    interface RoomPlayer{
        openId:string,
        joinTs:number,
        status:number
    }

    interface RoomLeaveInfo{
        reason:number, //离开房间原因
        logOutId:string //离开人的openid
    }

    export interface QAVConfig{
        enableMic?:boolean,    //开启麦克风 默认true
        enableSpeaker?:boolean,//开启扬声器，默认true
        cameraPos?:number,     //0前置，1后置，默认1
        enableAudio?:boolean,  //开启音频，默认true
        enableVideo?:boolean,  //开启视频，默认true
        enableLocalVideo?:boolean, //接受本地视频，默认true
        enableRemoteVideo?:boolean,//接受远程视频，默认true
        beauty?:number, //美颜功能， [0-9] 默认 0.
        faceDetector?:boolean  //人脸检测。默认关闭
    }

    interface RoomConfig{
        qavCfg:QAVConfig
    }

    export class Room{

        gameId:number;//游戏id
        roomId:number;//房间id
        mId:string;//当前用户的openId
        ownerId:string;//房主的openId
        status:number;//房间状态 1 已创建房间,2 游戏中房间
        environment:number;//网络环境 NETWORK_ENVIRONMENT_QQ_RELEASE /0 手Q环境正式发布、NETWORK_ENVIRONMENT_QQ_DEBUG /1 手Q环境调试环境、NETWORK_ENVIRONMENT_DEMO_DEV/2 demo工程开发环境
        currentPlayers:Array<RoomPlayer>; //房间现有的人
        lastFrame:number;  //收到的最后一帧序列号

        /**
         * 
         * @param options 
         */
        constructor(options?:any);

        /**
         * 普通创建房间
         * 
         * @param {number} gameId 
         * @param {string} masterOpenId 
         * @param {(statusCode:RoomErrorCode,room:BK.Room)=>void} callback 
         * @memberof Room
         */
        createAndJoinRoom(gameId:number,masterOpenId:string,callback:(statusCode:RoomErrorCode,room:BK.Room)=>void);

        /**
         * 使用固定房间号创建房间。 
         * environment属性需设置为 NETWORK_ENVIRONMENT_DEMO_DEV 才可使用
         * 
         * @param {number} gameId 
         * @param {string} masterOpenId 
         * @param {number} fixedRoomId 
         * @param {(statusCode:RoomErrorCode,room:BK.Room)=>void} callback 
         * @memberof Room
         */
        createAndJoinFixedRoom(gameId:number,masterOpenId:string,fixedRoomId:number,callback:(statusCode:RoomErrorCode,room:BK.Room)=>void)
                
        /**
         * 查询并且加房间
         * 
         * @param {number} gameId 
         * @param {number} roomId 
         * @param {string} joinerOpenId 
         * @param {(statusCode:number,room:BK.Room)=>void} callback 
         * @memberof Room
         */
        queryAndJoinRoom(gameId:number,roomId:number,joinerOpenId:string,callback:(statusCode:RoomErrorCode,room:BK.Room)=>void);

        /**
         * 开始游戏
         * @param callback 
         */
        startGame(callback:(retCode:RoomErrorCode)=>void);

        /**
         * 设置开始游戏回调
         * 
         * @param {(retCode:RoomErrorCode)=>void} callback 
         * @memberof Room
         */
        setStartGameCallback(callback:(retCode:RoomErrorCode)=>void);

        /**
         * 
         * 
         * @param {number} gameId 
         * @param {string} openId 
         * @param {(retCode:number)=>void} callback 
         * @memberof Room
         */
        matchGame(gameId:number,openId:string,callback:(retCode:RoomErrorCode)=>void);

        /**
         * 查询匹配
         * 
         * @param {number} gameId 
         * @param {string} openId 
         * @param {(retCode:RoomErrorCode)=>void} callBack 
         * @memberof Room
         */
        queryMatchGame(gameId:number,openId:string,callBack:(retCode:RoomErrorCode)=>void);
        
        /**
         * 
         * 
         * @param {number} gameId 
         * @param {string} openId 
         * @memberof Room
         */
        requestQueryMatch(gameId:number,openId:string):void;

        /**
         * 离开房间
         * 
         * @param {(retCode:number)=>void} callback 
         * @memberof Room
         */
        leaveRoom(callback:(retCode:RoomErrorCode,leaveInfo:BK.RoomLeaveInfo)=>void);

        /**
         * 设置离开房间回调
         * 
         * @param {(retCode:RoomErrorCode)=>void} callback 
         * @memberof Room
         */
        setLeaveRoomCallback(callback:(retCode:RoomErrorCode,leaveInfo:BK.RoomLeaveInfo)=>void);
        
        /**
         * 强制离开房间
         * 
         * @param {(retCode:number)=>void} callback 
         * @param {number} reason 
         * @memberof Room
         */
        forceLeaveRoom(callback:(retCode:RoomErrorCode)=>void,reason:number):void;
        
        /**
         * 设置当前游戏云端存储
         * 
         * @param {BK.Buffer} buff 
         * @param {(retCode:RoomErrorCode)=>void} callback 
         * @memberof Room
         */
        setUserData(buff:BK.Buffer,callback:(retCode:RoomErrorCode)=>void):void;

        /**
         * 获取当前游戏云端存储
         * 
         * @param {any} roomId 
         * @param {(retCode:RoomErrorCode,buff:BK.Buffer)=>void} callback 
         * @memberof Room
         */
        getUserData(roomId,callback:(retCode:RoomErrorCode,buff:BK.Buffer)=>void);
        

        //消息协议
        
        /**
         * 发送广播消息
         * 
         * @param {BK.Buffer} buff 
         * @memberof Room
         */
        sendBroadcastData(buff:BK.Buffer):void;
        
        /**
         * 设置广播消息监听
         * 
         * @param {any} callback 
         * @memberof Room
         */
        setBroadcastDataCallBack(callback:(fromOpenId:string,buff:BK.Buffer)=>void):void;

        /**
         * 发送帧同步消息
         * 
         * @param {BK.Buffer} statusBuf 预留buffer
         * @param {BK.Buffer} optBuf    用户定义buffer
         * @param {BK.Buffer} extendBuf 扩展预留buffer
         * @param {BK.Buffer} itemListBuf 道具buffer
         * @param {any} callback 回调
         * @memberof Room
         */
        syncOpt(statusBuf:BK.Buffer,optBuf:BK.Buffer,extendBuf:BK.Buffer,itemListBuf:BK.Buffer,callback)

        /**
         * 设置帧同步回调
         * 
         * @param {(frameDataArr:Array<BK.RoomPlayerFrameData>)=>void} listener 
         * @memberof Room
         */
        setFrameSyncListener(listener:(frameDataArr:Array<Array<BK.RoomPlayerFrameData>>)=>void);

        /**
         * 发送心跳
         * 
         * @memberof Room
         */
        sendKeepAlive();

        /**
         * 定时更新
         * 
         * @memberof Room
         */
        updateSocket();

        /**
         * 断线回调
         * 
         * @param {()=>void} callback 
         * @memberof Room
         */
        setDisconnectNetCallBack(callback:()=>void);

    }

    export interface SheetRect{
        x:number,
        y:number,
        w:number,
        h:number
    }

    export interface SheetSize{
        w:number,h:number
    }

    export interface SheetPoint{
        x:number,y:number
    }

    export interface SheetFrameInfo{
        filename:string,
        frame: SheetRect,
        rotated: boolean,
        trimmed: boolean,
        spriteSourceSize: SheetRect,
        sourceSize: SheetSize,
        pivot: SheetPoint
    }
    
    export interface SheetTextureInfo
    {
        texturePath:string,
        frameInfo:SheetFrameInfo,
        texture:BK.Texture,
    }

    /**
     * 图集
     * 
     * @class SpriteSheetCache
     */
    export class SpriteSheetCache{
        /**
         * 加载图集
         * 
         * @static
         * @param {string} jsonPath 图集json文件路径
         * @param {string} pngPath  图集png文件路径	
         * @memberof SpriteSheetCache
         */
        static loadSheet(jsonPath:string,pngPath:string);
        
        /**
         * 移除图集
         * 
         * @static
         * @param {string} jsonPath 图集json文件路径
         * @param {string} pngPath  图集png文件路径	
         * @memberof SpriteSheetCache
         */
        static removeSheet(jsonPath:string,pngPath:string);
                
        /**
         * 根据图集文件中某个文件的名字获取纹理
         * 
         * @static
         * @param {string} filename 
         * @returns {BK.Texture} 
         * @memberof SpriteSheetCache
         */
        static getTextureByFilename(filename:string):BK.Texture;
                
        /**
         * 根据图集文件中小图名称，获取小图的位置信息
         * 
         * @static
         * @param {string} filename 
         * @returns {SheetTextureInfo} 
         * @memberof SpriteSheetCache
         */
        static getFrameInfoByFilename(filename:string):SheetTextureInfo;

        /**
         * 根据图集文件中小图名称，获取小图的位置信息和纹理对象
         * 
         * @param {string} filename 
         * @returns {SheetTextureInfo} 
         * @memberof SpriteSheetCache
         */
        getTextureFrameInfoByFileName(filename:string):SheetTextureInfo;
        
        /**
         * 根据图集文件中小图名称，获取纹理路径名称
         * 
         * @param {string} filename 
         * @returns {string} 
         * @memberof SpriteSheetCache
         */
        getTexturePathByFilename(filename:string):string;

        /**
         * 根据小图名称创建一个精灵
         * 
         * @param {string} filename 小图名称
         * @param {number} width 精灵的宽
         * @param {number} height 精灵的高
         * @returns {BK.Sprite} 
         * @memberof SpriteSheetCache
         */
        getSprite(filename:string, width:number, height:number):BK.Sprite;
    }

    /**
     * 帧动画
     * 
     * @class AnimatedSprite
     */
    export class AnimatedSprite{
        /**
         * 
         * @param textureInfoArr 
         */
        constructor(textureInfoArr:Array<BK.SheetTextureInfo>);
        
        /**
         * 
         * @param completeCallback 
         */
        setCompleteCallback(completeCallback:(animatedSprite:AnimatedSprite,count:number)=>void);
    }
    export interface Sprite9Grid{
        top:number,bottom:number,left:number,right:number
    }
    export interface Sprite9Offset{
        x:number,y:number
    }
    export class Sprite9{
        /**
         * Creates an instance of Sprite9.
         * @param {number} texWidth 宽
         * @param {number} texHeight 高
         * @param {BK.Texture} texture 纹理
         * @param {BK.Sprite9} grid  边缘固定区域
         * @param {Sprite9Offset} offset 
         * @param {boolean} rotated 
         * @memberof Sprite9
         */
        constructor(texWidth:number, texHeight:number, texture:BK.Texture, grid:BK.Sprite9, offset:Sprite9Offset, rotated:boolean);
    }

    export namespace Render {
        export class Material {
            uniforms: any;

            constructor(vsPath: string, fsPath: string, isInline?: boolean);

            setTexture(index: number, texture: BK.Texture): void;
        }

        export function renderToTexture(node: BK.Node, texture: BK.Texture): void;
    }

    export class RenderTexture
    {
        constructor(width: number, height: number, format?: BK_COLOR_FORMAT);

        readPixels(x: number, y: number, width: number, height: number, format?: BK_COLOR_FORMAT): BK.Buffer;

        readonly size: BK.Size;
    }

    export class Graphics
    {
        drawSprite(sprite: BK.Sprite): void;

        drawTexture(texture: BK.Texture, x: number, y: number, width: number, height: number, transform?: any, alpha?: number, blendMode?: BK_BLEND_MODE): BK.Graphics;
        
        drawMaterial(material: BK.Render.Material, x: number, y: number, width: number, height: number, transform?: any, alpha?: number, blendMode?: BK_BLEND_MODE): BK.Graphics;
    
        drawRenderTexture(renderTexture: BK.RenderTexture, callback: ()=>void): BK.Graphics;
    }


    export var AVView;
    export var AVCamera;

    namespace AI {
        export class FaceDetector {
            constructor(poseEstimate: boolean, tracking: boolean);

            detectForBitmapSync(bitmap: BK.Bitmap): any;
        }
    }

    enum QAVCameraCameraPos {
        CameraPosFront = 0,
        CameraPosBack = 0
    }
    
    interface QAVCameraOption
    {
        identifier:string,  //
        width:number,       //require
        height:number,      //require
        cameraPos:number,   //option  0 front,1 back (default is 0)
        zOrder:number,
        parent:BK.Node,     //option  default is null
        position:BK.Position, //option default is 
        volume:number,      //option  [0-100] 
        enableMic:boolean,  //option  default is true
        enableSpeaker:boolean,//option  default is true
        beauty:number,        //option  [0-9] default is 0.
        whitening:number,     //option  [0-9] default is 0.
        scaleSample:number, //option default is 1. (onPrePreview/onPreProcess phase)
        needFaceTracker: boolean,
        skipFaceTrackerNum:number,
        onPrePreview:(frameData:any)=>void,
        onPreProcess:(frameData:any)=>void,
        onSwitchCamera:(errCode:number,cmd:string,data:any)=>void;
    }
    interface AVRoomManagerEventId{

    }
    interface AVRoomManagerEvent{
        eventHasAudioCallback?:(eventId:AVRoomManagerEventId,data:any)=>void;
        eventNoAudioCallback?:(eventId:AVRoomManagerEventId,data:any)=>void;
        eventNewSpeakCallback?:(eventId:AVRoomManagerEventId,data:any)=>void;
        eventOldStopSpeakCallback?:(eventId:AVRoomManagerEventId,data:any)=>void;
        eventEnterCallback?:(eventId:AVRoomManagerEventId,data:any)=>void;
        eventExitCallback?:(eventId:AVRoomManagerEventId,data:any)=>void;
    }

    // class AVRoomManager
    // {
    //     // static startAVRoom(environment:number,callback:(errCode:number,cmd:string,data:any)=>void);
    //     static exitRoom(callback:(errCode:number,cmd:string,data:any)=>void);
    //     static setSpeaker(sw:boolean,callback:(errCode:number,cmd:string,data:any)=>void);
    //     static setMic(sw:boolean,callback:(errCode:number,cmd:string,data:any)=>void);
    //     static setEventCallbackConfig(eve:AVRoomManagerEvent):void;
    // }
    export var QQAVManager;
    export var SheetSprite;
    export var AVRoomManager;

    export class Security{
        static getST():BK.Buffer;
        static encrypt(body:BK.Buffer):void;
        static decrypt(body:BK.Buffer):void;
    }
}
