// GameRes://script/demo/webgl/math/vector3.js

Vector3 = function(x, y, z) {
    this.x = x || 0.0;
    this.y = y || 0.0;
    this.z = z || 0.0;
};

Vector3.prototype = {
    // constructor
    constructor: Vector3,

    // set
    set: function(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    },

    // setX
    setX: function(x) {
        this.x = x;
    },

    // setY
    setY: function(y) {
        this.y = y;
    },

    // setZ
    setZ: function(z) {
        this.z = z;
    },

    // isOne
    isOne: function() {
        return this.x === 1.0 && this.y === 1.0 && this.z === 1.0;
    },

    // cross
    cross: function(v) {
        var x = this.x;
        var y = this.y;
        var z = this.z;

        this.x = y * v.z - z * v.y;
        this.y = z * v.x - x * v.z;
        this.z = x * v.y - y * v.x;

        return this;
    },

    // dot
    dot: function(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    },

    // length
    length: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    },

    // length squared
    lengthSquared: function() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    },

    // distance
    distance: function(v) {
        var dx = this.x - v.x;  
        var dy = this.y - v.y;  
        var dz = this.z - v.z;  

        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    },

    // distance squared
    distanceSquared: function(v) {
        var dx = this.x - v.x;
        var dy = this.y - v.y;
        var dz = this.z - v.z;

        return dx * dx + dy * dy + dz * dz;
    },

    // negate
    negate: function() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;

        return this;
    },

    // normalize
    normalize: function() {
        var length = this.length();

        if (length !== 0) {
            var scalar = 1 / length;

            this.x *= scalar;
            this.y *= scalar;
            this.z *= scalar;
        }
        else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }

        return this;
    },
};



