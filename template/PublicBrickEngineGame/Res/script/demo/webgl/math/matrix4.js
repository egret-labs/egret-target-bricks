// GameRes://script/demo/webgl/math/matrix4.js
BK.Script.loadlib('GameRes://script/demo/webgl/common/common.js');

function Matrix4(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
    if (m11 !== undefined) {
        this.data = [m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44];
    }
    else {
        this.data = [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0];
    }

    // this.data = new Float32Array(16);

    // if (m11 !== undefined) {
    //     this.data[ 0] = m11;
    //     this.data[ 1] = m12;
    //     this.data[ 2] = m13;
    //     this.data[ 3] = m14;
    //     this.data[ 4] = m21;
    //     this.data[ 5] = m22;
    //     this.data[ 6] = m23;
    //     this.data[ 7] = m24;
    //     this.data[ 8] = m31;
    //     this.data[ 9] = m32;
    //     this.data[10] = m33;
    //     this.data[11] = m34;
    //     this.data[12] = m41;
    //     this.data[13] = m42;
    //     this.data[14] = m43;
    //     this.data[15] = m44;
    // }
    // else {
    //     this.data[ 0] = 1.0;
    //     this.data[ 1] = 0.0;
    //     this.data[ 2] = 0.0;
    //     this.data[ 3] = 0.0;
    //     this.data[ 4] = 0.0;
    //     this.data[ 5] = 1.0;
    //     this.data[ 6] = 0.0;
    //     this.data[ 7] = 0.0;
    //     this.data[ 8] = 0.0;
    //     this.data[ 9] = 0.0;
    //     this.data[10] = 1.0;
    //     this.data[11] = 0.0;
    //     this.data[12] = 0.0;
    //     this.data[13] = 0.0;
    //     this.data[14] = 0.0;
    //     this.data[15] = 1.0;
    // }
};

Matrix4.prototype = {
    // constructor
    constructor: Matrix4,

    is_identity: function() {
        for (var i=0; i < 16; ++i) {
            if (this.data[i] !== BK.matrix4_identity.data[i]) {
                return false;
            }
        }

        return true;
    },

    // 
    set_translation: function(x, y, z) {
        this.data[12] = x;
        this.data[13] = y;
        this.data[14] = z;
    },

    set_scale: function(x, y, z) {
        this.data[ 0] = x;
        this.data[ 5] = y;
        this.data[10] = z;
    },

    // set
    set: function(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        this.data[ 0] = m11;
        this.data[ 1] = m12;
        this.data[ 2] = m13;
        this.data[ 3] = m14;
        this.data[ 4] = m21;
        this.data[ 5] = m22;
        this.data[ 6] = m23;
        this.data[ 7] = m24;
        this.data[ 8] = m31;
        this.data[ 9] = m32;
        this.data[10] = m33;
        this.data[11] = m34;
        this.data[12] = m41;
        this.data[13] = m42;
        this.data[14] = m43;
        this.data[15] = m44;
    },

    setTo: function(m) {
        this.data = m.data.slice(0);

        // this.data[ 0] = m.data[ 0];
        // this.data[ 1] = m.data[ 1];
        // this.data[ 2] = m.data[ 2];
        // this.data[ 3] = m.data[ 3];
        // this.data[ 4] = m.data[ 4];
        // this.data[ 5] = m.data[ 5];
        // this.data[ 6] = m.data[ 6];
        // this.data[ 7] = m.data[ 7];
        // this.data[ 8] = m.data[ 8];
        // this.data[ 9] = m.data[ 9];
        // this.data[10] = m.data[10];
        // this.data[11] = m.data[11];
        // this.data[12] = m.data[12];
        // this.data[13] = m.data[13];
        // this.data[14] = m.data[14];
        // this.data[15] = m.data[15];

        return this;
    },

    // multiply
    multiply: function(m) {
        if (this.is_identity()) {
            return this.setTo(m);
        }

        if (m.is_identity()) {
            return this;
        }

        var m11 = this.data[0] * m.data[0]  + this.data[4] * m.data[1]  + this.data[8]  * m.data[2]  + this.data[12] * m.data[3];
        var m12 = this.data[1] * m.data[0]  + this.data[5] * m.data[1]  + this.data[9]  * m.data[2]  + this.data[13] * m.data[3];
        var m13 = this.data[2] * m.data[0]  + this.data[6] * m.data[1]  + this.data[10] * m.data[2]  + this.data[14] * m.data[3];
        var m14 = this.data[3] * m.data[0]  + this.data[7] * m.data[1]  + this.data[11] * m.data[2]  + this.data[15] * m.data[3];

        var m21 = this.data[0] * m.data[4]  + this.data[4] * m.data[5]  + this.data[8]  * m.data[6]  + this.data[12] * m.data[7];
        var m22 = this.data[1] * m.data[4]  + this.data[5] * m.data[5]  + this.data[9]  * m.data[6]  + this.data[13] * m.data[7];
        var m23 = this.data[2] * m.data[4]  + this.data[6] * m.data[5]  + this.data[10] * m.data[6]  + this.data[14] * m.data[7];
        var m24 = this.data[3] * m.data[4]  + this.data[7] * m.data[5]  + this.data[11] * m.data[6]  + this.data[15] * m.data[7];

        var m31 = this.data[0] * m.data[8]  + this.data[4] * m.data[9]  + this.data[8]  * m.data[10] + this.data[12] * m.data[11];
        var m32 = this.data[1] * m.data[8]  + this.data[5] * m.data[9]  + this.data[9]  * m.data[10] + this.data[13] * m.data[11];
        var m33 = this.data[2] * m.data[8]  + this.data[6] * m.data[9]  + this.data[10] * m.data[10] + this.data[14] * m.data[11];
        var m34 = this.data[3] * m.data[8]  + this.data[7] * m.data[9]  + this.data[11] * m.data[10] + this.data[15] * m.data[11];

        var m41 = this.data[0] * m.data[12] + this.data[4] * m.data[13] + this.data[8]  * m.data[14] + this.data[12] * m.data[15];
        var m42 = this.data[1] * m.data[12] + this.data[5] * m.data[13] + this.data[9]  * m.data[14] + this.data[13] * m.data[15];
        var m43 = this.data[2] * m.data[12] + this.data[6] * m.data[13] + this.data[10] * m.data[14] + this.data[14] * m.data[15];
        var m44 = this.data[3] * m.data[12] + this.data[7] * m.data[13] + this.data[11] * m.data[14] + this.data[15] * m.data[15];

        this.set(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44);

        return this;
    },

    // inverse
    inverse: function() {
        var d1  = this.data[10] * this.data[15] - this.data[14] * this.data[11];
        var d2  = this.data[ 6] * this.data[15] - this.data[14] * this.data[ 7];
        var d3  = this.data[ 6] * this.data[11] - this.data[10] * this.data[ 7];
        var d4  = this.data[ 2] * this.data[15] - this.data[14] * this.data[ 3];
        var d5  = this.data[ 2] * this.data[11] - this.data[10] * this.data[ 3];
        var d6  = this.data[ 2] * this.data[ 7] - this.data[ 6] * this.data[ 3];
        var d7  = this.data[ 9] * this.data[15] - this.data[13] * this.data[11];
        var d8  = this.data[ 5] * this.data[15] - this.data[13] * this.data[ 7];
        var d9  = this.data[ 5] * this.data[11] - this.data[ 9] * this.data[ 7];
        var d10 = this.data[ 1] * this.data[15] - this.data[13] * this.data[ 3];
        var d11 = this.data[ 1] * this.data[11] - this.data[ 9] * this.data[ 3];
        var d12 = this.data[ 1] * this.data[ 7] - this.data[ 5] * this.data[ 3];
        var d13 = this.data[ 9] * this.data[14] - this.data[13] * this.data[10];
        var d14 = this.data[ 5] * this.data[14] - this.data[13] * this.data[ 6];
        var d15 = this.data[ 5] * this.data[10] - this.data[ 9] * this.data[ 6];
        var d16 = this.data[ 1] * this.data[14] - this.data[13] * this.data[ 2];
        var d17 = this.data[ 1] * this.data[10] - this.data[ 9] * this.data[ 2];
        var d18 = this.data[ 1] * this.data[ 6] - this.data[ 5] * this.data[ 2];

        var m11 = this.data[5] * d1  - this.data[9] * d2  + this.data[13] * d3;
        var m12 = this.data[9] * d4  - this.data[1] * d1  - this.data[13] * d5;
        var m13 = this.data[1] * d2  - this.data[5] * d4  + this.data[13] * d6;
        var m14 = this.data[5] * d5  - this.data[1] * d3  - this.data[ 9] * d6;
        var m21 = this.data[8] * d2  - this.data[4] * d1  - this.data[12] * d3;
        var m22 = this.data[0] * d1  - this.data[8] * d4  + this.data[12] * d5;
        var m23 = this.data[4] * d4  - this.data[0] * d2  - this.data[12] * d6;
        var m24 = this.data[0] * d3  - this.data[4] * d5  + this.data[ 8] * d6;
        var m31 = this.data[4] * d7  - this.data[8] * d8  + this.data[12] * d9;
        var m32 = this.data[8] * d10 - this.data[0] * d7  - this.data[12] * d11;
        var m33 = this.data[0] * d8  - this.data[4] * d10 + this.data[12] * d12;
        var m34 = this.data[4] * d11 - this.data[0] * d9  - this.data[ 8] * d12;
        var m41 = this.data[8] * d14 - this.data[4] * d13 - this.data[12] * d15;
        var m42 = this.data[0] * d13 - this.data[8] * d16 + this.data[12] * d17;
        var m43 = this.data[4] * d16 - this.data[0] * d14 - this.data[12] * d18;
        var m44 = this.data[0] * d15 - this.data[4] * d17 + this.data[ 8] * d18;

        var determinant = this.data[0] * m11 + this.data[1] * m21 + this.data[2] * m31 + this.data[3] * m41;
        if (determinant !== 0.0) {
            var scalar = 1.0 / determinant;
            return new Matrix4(
                m11 * scalar, m12 * scalar, m13 * scalar, m14 * scalar,
                m21 * scalar, m22 * scalar, m23 * scalar, m24 * scalar,
                m31 * scalar, m32 * scalar, m33 * scalar, m34 * scalar,
                m41 * scalar, m42 * scalar, m43 * scalar, m44 * scalar
            );
        }
        else {
            return new Matrix4();
        }
    },

    // 
    multiplyVec3: function(v3) {
        var x = v3.x * this.data[0] + v3.y * this.data[4] + v3.z * this.data[8]  + this.data[12];
        var y = v3.x * this.data[1] + v3.y * this.data[5] + v3.z * this.data[9]  + this.data[13];
        var z = v3.x * this.data[2] + v3.y * this.data[6] + v3.z * this.data[10] + this.data[14];

        return [x, y, z];
    },

    multiplyXY: function(x1, y1) {
        var x = x1 * this.data[0] + y1 * this.data[4] + this.data[12];
        var y = x1 * this.data[1] + y1 * this.data[5] + this.data[13];
        //var z = x1 * this.data[2] + y1 * this.data[6] + this.data[14];

        //return [x, y, z];
        return [x, y];
    },

    multiplyXYVertex: function(x1, y1, vertices, index1, index2) {
        vertices[index1] = x1 * this.data[0] + y1 * this.data[4] + this.data[12];
        vertices[index2] = x1 * this.data[1] + y1 * this.data[5] + this.data[13];
    },

    toString: function() {
        return this.data.toString();
    },
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// createOrthMatrix4
function createOrthMatrix4(left, right, bottom, top, near_plane, far_plane) {
    var m11 = 2.0 / (right - left);
    var m22 = 2.0 / (top - bottom);
    var m33 = 2.0 / (near_plane - far_plane);

    var m41 = (left + right) / (left - right);
    var m42 = (top + bottom) / (bottom - top);
    var m43 = (near_plane + far_plane) / (near_plane - far_plane);

    return new Matrix4(m11, 0.0, 0.0, 0.0, 0.0, m22, 0.0, 0.0, 0.0, 0.0, m33, 0.0, m41, m42, m43, 1.0);
}

// createTranslateMatrix4
function createTranslateMatrix4(v3) {
    // 12: v3.x; 13: v3.y; 14: v3.z; 15: 1.0
    return new Matrix4(1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, v3.x, v3.y, v3.z, 1.0);
}

// createScaleMatrix4
function createScaleMatrix4(v3) {
    // 0: v3.x; 5: v3.y; 10: 1.0; 15: 1.0
    return new Matrix4(v3.x, 0.0, 0.0, 0.0, 0.0, v3.y, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0);
}

// createRotateMatrix4
function createRotateMatrix4(v3, angle) {
    // Make sure the axis is normalized
    if (v3.lengthSquared() !== 1.0) {
        v3.normalized();
    }

    var c = Math.cos(angle);
    var s = Math.sin(angle);

    var t = 1.0 - c;
    var tx = t * v3.x;
    var ty = t * v3.y;
    var tz = t * v3.z;
    var txy = tx * v3.y;
    var txz = tx * v3.z;
    var tyz = ty * v3.z;
    var sx = s * v3.x;
    var sy = s * v3.y;
    var sz = s * v3.z;

    return new Matrix4(
        c + tx * x,
        txy + sz,
        txz - sy,
        0.0,

        txy - sz,
        c + ty * y,
        tyz + sz,
        0.0,

        txz + sy,
        tyz - sx,
        c + tz * z,
        0.0,

        0.0, 0.0, 0.0, 1.0
    );
}

// createFromEulerAngleMatrix4
function createFromEulerAngleMatrix4(v3) {
    var h = degreeToRadians(-v3.y);
    var p = degreeToRadians(-v3.x);
    var b = degreeToRadians(-v3.z);

    var ch = Math.cos(h);
    var sh = Math.sin(h);

    var cp = Math.cos(p);
    var sp = Math.sin(p);

    var cb = Math.cos(b);
    var sb = Math.sin(b);

    return new Matrix4(
        ch * cb + sh * sp * sb,
        -ch * sb + sh * sp * cb,
        sh * cp,
        0.0,

        sb * cp,
        cb * cp,
        -sp,
        0.0,

        -sh * cb + ch * sp * sb,
        sb * sh + ch * sp * cb,
        ch * cp,
        0.0,

        0.0, 0.0, 0.0, 1.0
    );
}

if (BK.matrix4_identity == null) {
    BK.matrix4_identity = new Matrix4();
}
