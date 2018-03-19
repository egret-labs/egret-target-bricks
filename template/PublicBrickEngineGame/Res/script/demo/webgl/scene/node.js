// GameRes://script/demo/webgl/scene/node.js
BK.Script.loadlib('GameRes://script/demo/webgl/common/common.js');
BK.Script.loadlib('GameRes://script/demo/webgl/math/vector2.js');
BK.Script.loadlib('GameRes://script/demo/webgl/math/vector3.js');
BK.Script.loadlib('GameRes://script/demo/webgl/math/matrix4.js');

// 
function Node(name) {
    this.position = new Vector3();               // 坐标
    this.rotation = new Vector3();               // 旋转
    this.scalar = new Vector3(1.0, 1.0, 1.0);    // 缩放
    this.matrix = new Matrix4();
    this.rotationMatrix = new Matrix4();
    this.scalarMatrix = new Matrix4();
    this.dirty_flags = 0;

    this.worldMatrix = new Matrix4();
    this.need_update_flag = false;

    this.name = name || '';
    this.parentNode = null;
    this.children = [];
}

Node.prototype = {
    // constructor
    constructor: Node,

    // setPosition
    setPosition: function(x, y, z) {
        this.position.set(x, y, z);

        this.dirty(DIRTY_TRANSLATION | DIRTY_WORLD_MATRIX);
    },

    // getPosition
    getPosition: function() {
        return this.position;
    },

    // setPositionX
    setPositionX: function(x) {
        this.position.setX(x);

        this.dirty(DIRTY_TRANSLATION | DIRTY_WORLD_MATRIX);
    },

    // getPositionX
    getPositionX: function() {
        return this.position.x;
    },

    // setPositionY
    setPositionY: function(y) {
        this.position.setY(y);

        this.dirty(DIRTY_TRANSLATION | DIRTY_WORLD_MATRIX);
    },

    // getPositionY
    getPositionY: function() {
        return this.position.y;
    },

    // setPositionZ
    setPositionZ: function(z) {
        this.position.setZ(z);

        this.dirty(DIRTY_TRANSLATION | DIRTY_WORLD_MATRIX);
    },

    // getPositionZ
    getPositionZ: function() {
        return this.position.z;
    },

    // setRotation
    setRotation: function(v3) {
        this.rotation = v3;

        this.dirty(DIRTY_ROTATION | DIRTY_WORLD_MATRIX);
    },

    // getRotation
    getRotation: function() {
        return this.rotation;
    },

    // setRotationX
    setRotationX: function(x) {
        this.rotation.setX(x);

        this.dirty(DIRTY_ROTATION | DIRTY_WORLD_MATRIX);
    },

    // getRotationX
    getRotationX: function() {
        return this.rotation.x;
    },

    // setRotationY
    setRotationY: function(y) {
        this.rotation.setY(y);

        this.dirty(DIRTY_ROTATION | DIRTY_WORLD_MATRIX);
    },

    // getRotationY
    getRotationY: function() {
        return this.rotation.y;
    },

    // setRotationZ
    setRotationZ: function(z) {
        this.rotation.setZ(z);

        this.dirty(DIRTY_ROTATION | DIRTY_WORLD_MATRIX);
    },

    // getRotationZ
    getRotationZ: function() {
        return this.rotation.z;
    },

    // setScale
    setScale: function(x, y, z) {
        this.scalar.set(x, y, z);

        this.dirty(DIRTY_SCALE | DIRTY_WORLD_MATRIX);
    },

    // setScaleX
    setScaleX: function(x) {
        this.scalar.setX(x);

        this.dirty(DIRTY_SCALE | DIRTY_WORLD_MATRIX);
    },

    // getScaleX
    getScaleX: function() {
        return this.scalar.x;
    },

    // setScaleY
    setScaleY: function(y) {
        this.scalar.setY(y);

        this.dirty(DIRTY_SCALE | DIRTY_WORLD_MATRIX);
    },

    // getScaleY
    getScaleY: function() {
        return this.scalar.y;
    },

    // setScaleZ
    setScaleZ: function(z) {
        this.scalar.setZ(z);

        this.dirty(DIRTY_SCALE | DIRTY_WORLD_MATRIX);
    },

    // getScaleZ
    getScaleZ: function() {
        return this.scalar.z;
    },

    // getMatrix
    getMatrix: function() {
        if (this.dirty_flags & DIRTY_TRANSLATION) {
            this.matrix.set_translation(this.position.x, this.position.y, this.position.z);

            this.dirty_flags &= ~(DIRTY_TRANSLATION);
        }

        if (this.dirty_flags & (DIRTY_SCALE | DIRTY_ROTATION)) {
            this.matrix.data[ 0] = 1.0;
            this.matrix.data[ 1] = 0.0;
            this.matrix.data[ 2] = 0.0;
            this.matrix.data[ 3] = 0.0;
            this.matrix.data[ 4] = 0.0;
            this.matrix.data[ 5] = 1.0;
            this.matrix.data[ 6] = 0.0;
            this.matrix.data[ 7] = 0.0;
            this.matrix.data[ 8] = 0.0;
            this.matrix.data[ 9] = 0.0;
            this.matrix.data[10] = 1.0;
            this.matrix.data[11] = 0.0;
            //this.matrix.data[12] = 0.0;
            //this.matrix.data[13] = 0.0;
            //this.matrix.data[14] = 0.0;
            this.matrix.data[15] = 1.0;

            // 脏了一定要更新，但不一定需要乘上去
            if (this.dirty_flags & DIRTY_ROTATION) {
                this.rotationMatrix = createFromEulerAngleMatrix4(this.rotation);
            }
            if (this.rotation.x !== 0.0 || this.rotation.y !== 0.0 || this.rotation.z !== 0.0) {
                this.matrix.multiply(this.rotationMatrix);
            }

            // 脏了一定要更新，但不一定需要乘上去
            if (this.dirty_flags & DIRTY_SCALE) {
                this.scalarMatrix.set_scale(this.scalar.x, this.scalar.y, this.scalar.z);
            }
            if (this.scalar.x != 1.0 || this.scalar.y != 1.0 || this.scalar.z != 1.0) {
                this.matrix.multiply(this.scalarMatrix);
            }

            this.dirty_flags &= ~(DIRTY_SCALE | DIRTY_ROTATION);
        }

        return this.matrix;
    },

    // getWroldMatrix
    getWorldMatrix: function() {
        if (this.dirty_flags & DIRTY_WORLD_MATRIX) {
            if (this.parentNode) {
                this.worldMatrix.setTo(this.parentNode.getWorldMatrix());
                this.worldMatrix.multiply(this.getMatrix());
            }
            else {
                this.worldMatrix.setTo(this.getMatrix());
            }

            this.dirty_flags &= ~(DIRTY_WORLD_MATRIX);
        }

        return this.worldMatrix;
    },

    // setName
    setName: function(name) {
        this.name = name;
    },

    // getName
    getName: function() {
        return this.name;
    },

    // getChildByName
    getChildByName: function(name) {
        for (var i=0; i < this.children.length; ++i) {
            if (this.children[i].name == name) {
                return this.children[i];
            }
        }

        return null;
    },

    // addChild
    addChild: function(child) {
        if (child.parentNode == this) {
            return;
        }

        if (child.parentNode) {
            child.parentNode.removeChild(child);
        }

        this.children.push(child);
        child.parentNode = this;
    },

    // removeChild
    removeChild: function(child) {
        if (child.parentNode != this) {
            return;
        }

        for (var i=0; i < this.children.length; ++i) {
            if (this.children[i] == child) {
                this.children.splice(i, 1);
                child.parentNode = null;
            }
        }
    },

    // removeAllChildren
    removeAllChildren: function() {
        for (var i=0; i < this.children.length; ++i) {
            this.children[i].parentNode = null;
        }
        this.children = [];
    },

    // getParent
    getParent: function() {
        return this.parentNode;
    },

    // setParent
    setParent: function(parentNode) {
        this.parentNode = parentNode;
    },

    // dirty
    dirty: function(flag) {
        this.dirty_flags |= flag;
    },

    // isDirty
    isDirty: function(flag) {
        return (this.dirty_flags & flag) == flag;
    },

    // update
    update: function(dt, need_update_flag) {
        for (var i=0; i < this.children.length; ++i) {
            this.children[i].update(dt, this.need_update_flag || need_update_flag);
        }
        this.need_update_flag = false;
    },

    // draw
    draw: function(renderer) {
        for (var i=0; i < this.children.length; ++i) {
            this.children[i].draw(renderer);
        }
    },
};
