
// 10000 sprite
RENDERER_BATCH_SPRITE_MAX_COUNT       = 10000;

// dirty flags
DIRTY_TRANSLATION       = 0x00000001;
DIRTY_SCALE             = 0x00000002;
DIRTY_ROTATION          = 0x00000004;
DIRTY_UV                = 0x00000008;
DIRTY_CONTENT_SIZE      = 0x00000010;
DIRTY_COLOR             = 0x00000020;
DIRTY_WORLD_MATRIX      = 0x00000040;

// 
function degreeToRadians(angle) {
    return angle * 0.01745329251994;
}

function radiansToDegree(angle) {
    return angle * 57.29577951;
}

function swapFake(a, b) {
    return [b, a];
}

function md5(str) {
    return '';
}

function mmlog(str) {
    BK.Script.log(1, 1, str);
}

function traceback(count) {
    var caller = arguments.callee.caller;
    var i = 0;
    count = count || 10;
    mmlog("***----------------------------------------  ** " + (i + 1));
    while (caller && i < count) {
        mmlog(caller.toString());
        caller = caller.caller;
        i++;
        mmlog("***---------------------------------------- ** " + (i + 1));
    }
}

// uniform
SHADER_UNIFORM_TYPE_FLOAT1          = 1;
SHADER_UNIFORM_TYPE_FLOAT2          = 2;
SHADER_UNIFORM_TYPE_FLOAT3          = 3;
SHADER_UNIFORM_TYPE_FLOAT4          = 4;
SHADER_UNIFORM_TYPE_INT1            = 5;
SHADER_UNIFORM_TYPE_INT2            = 6;
SHADER_UNIFORM_TYPE_INT3            = 7;
SHADER_UNIFORM_TYPE_INT4            = 8;
SHADER_UNIFORM_TYPE_FLOATV1         = 9;
SHADER_UNIFORM_TYPE_FLOATV2         = 10;
SHADER_UNIFORM_TYPE_FLOATV3         = 11;
SHADER_UNIFORM_TYPE_FLOATV4         = 12;
SHADER_UNIFORM_TYPE_INTV1           = 13;
SHADER_UNIFORM_TYPE_INTV2           = 14;
SHADER_UNIFORM_TYPE_INTV3           = 15;
SHADER_UNIFORM_TYPE_INTV4           = 16;
SHADER_UNIFORM_TYPE_MATRIX2         = 17;
SHADER_UNIFORM_TYPE_MATRIX3         = 18;
SHADER_UNIFORM_TYPE_MATRIX4         = 19;
SHADER_UNIFORM_TYPE_TEXTURE0        = 20;
SHADER_UNIFORM_TYPE_TEXTURE1        = 21;
SHADER_UNIFORM_TYPE_TEXTURE2        = 22;
SHADER_UNIFORM_TYPE_TEXTURE3        = 23;
SHADER_UNIFORM_TYPE_TEXTURE4        = 24;
SHADER_UNIFORM_TYPE_TEXTURE5        = 25;
SHADER_UNIFORM_TYPE_TEXTURE6        = 26;
SHADER_UNIFORM_TYPE_TEXTURE7        = 27;

// usage
SHADER_USAGE_POSITION               = 1;
SHADER_USAGE_NORMAL                 = 2;
SHADER_USAGE_COLOR                  = 3;
SHADER_USAGE_TANGENT                = 4;
SHADER_USAGE_BINORMAL               = 5;
SHADER_USAGE_BLENDWEIGHTS           = 6;
SHADER_USAGE_BLENDINDICES           = 7;
SHADER_USAGE_TEXCOORD0              = 8;
SHADER_USAGE_TEXCOORD1              = 9;
SHADER_USAGE_TEXCOORD2              = 10;
SHADER_USAGE_TEXCOORD3              = 11;
SHADER_USAGE_TEXCOORD4              = 12;
SHADER_USAGE_TEXCOORD5              = 13;
SHADER_USAGE_TEXCOORD6              = 14;
SHADER_USAGE_TEXCOORD7              = 15;

