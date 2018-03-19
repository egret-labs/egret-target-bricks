// GameRes://script/demo/webgl/math/vector2.js

Vector2 = function(x, y) {
    this.x = x || 0.0;
    this.y = y || 0.0;
};

Vector2.prototype = {
    // constructor
    constructor: Vector2,

    // set
    set: function(x, y) {
        this.x = x;
        this.y = y;
    },

    // setX
    setX: function(x) {
        this.x = x;
    },

    // setY
    setY: function(y) {
        this.y = y;
    },

    // length
    length: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },

    // length squared
    lengthSquared: function() {
        return this.x * this.x + this.y * this.y;
    },

    // distance
    distance: function(v) {
        var dx = this.x - v.x;
        var dy = this.y - v.y;

        return Math.sqrt(dx * dx + dy * dy);
    },

    // distance squared
    distanceSquared: function(v) {
        var dx = this.x - v.x;
        var dy = this.y - v.y;

        return dx * dx + dy * dy;
    },

    // negate
    negate: function() {
        this.x = -this.x;
        this.y = -this.y;

        return this;
    },

    // normalize
    normalize: function() {
        var length = this.length();

        if (length !== 0) {
            var scalar = 1 / length;

            this.x *= scalar;
            this.y *= scalar;
        }
        else {
            this.x = 0;
            this.y = 0;
        }

        return this;
    },
};



