(function (global) {
    function __bkIsSupportTypedArray() {
        var info = BK.Director.queryDeviceInfo();
        var vers = info.version.split('.');
        if ((info.platform == 'ios' && Number(vers[0]) >= 10) || info.platform == 'android') {
            return true;
        }
        BK.Script.log(1, 0, "Current Device dont supoort TypedArray.[info = " + JSON.stringify(info) + "]");
        return false;
    }
    if (__bkIsSupportTypedArray())
        return;
    (function (global, factory) {
        if (typeof global === 'object') {
            //暂时仅支持UMD。此处预留AMD与CMD能力
            /*typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
                typeof define === 'function' && define.amd ? define(factory) :*/
            var _global = factory();
            global.DataView = _global.DataView;
            global.ArrayBuffer = _global.ArrayBuffer;
            global.Int8Array = _global.Int8Array;
            global.Int16Array = _global.Int16Array;
            global.Int32Array = _global.Int32Array;
            global.Uint8Array = _global.Uint8Array;
            global.Uint16Array = _global.Uint16Array;
            global.Uint32Array = _global.Uint32Array;
            global.Float32Array = _global.Float32Array;
        }
    }(global, function () {
        var ArrayBuffer = (function () {
            function ArrayBuffer(object) {
                try {
                    var tt = typeof object;
                    if (tt === 'number') {
                        this._buffer = new BK.Buffer(object, false);
                    }
                    else if (tt == 'object') {
                        this._buffer = object;
                    }
                    else {
                        this._buffer = new BK.Buffer(0, false);
                    }
                    this._littleEndian = true;
                    Object.defineProperty(this, "name", {
                        get: function () { return "ArrayBuffer"; },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(this, "__nativeObj", {
                        get: function () { return this._buffer; },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(this, "byteLength", {
                        get: function () { return this._buffer.capacity; },
                        enumerable: true,
                        configurable: true
                    });
                }
                catch (e) {
                    throw e;
                }
            }
            ArrayBuffer.prototype.__jump = function (offset) {
                this._buffer.rewind();
                this._buffer.jumpBytes(offset);
            };
            ArrayBuffer.prototype.__check = function (offset, byteLength) {
                if (offset + byteLength > this._buffer.capacity)
                    return false;
                this._buffer.expandToBytes(this._buffer.capacity);
                return true;
            };
            ArrayBuffer.prototype.__updateLittleEndian = function (littleEndian) {
                var _littleEndian = (undefined == littleEndian) ? false : littleEndian;
                if (this._littleEndian != _littleEndian) {
                    this._littleEndian = _littleEndian;
                    this._buffer.netOrder = !_littleEndian;
                }
            };
            ArrayBuffer.isView = function (arg) {
                return false;
            };
            ArrayBuffer.prototype.slice = function (begin, end) {
                var _end = typeof end === 'number' ? end : this._buffer.capacity - 1;
                var offset = 0;
                var length = 0;
                if (begin >= 0 && _end >= 0) {
                    offset = begin;
                    length = _end - begin;
                }
                else if (begin < 0 && _end < 0) {
                    offset = -_end;
                    length = begin - _end;
                }
                else {
                    throw "ArrayBuffer.slice: Range Error";
                }
                if (length > 0) {
                    this.__jump(offset);
                    this._buffer.expandToBytes(offset + length);
                    var buf = this._buffer.readBuffer(length);
                    return new ArrayBuffer(buf);
                }
                return new ArrayBuffer(0);
            };
            ArrayBuffer.prototype.getFloat32 = function (byteOffset, littleEndian) {
                if (!this.__check(byteOffset, 4))
                    return 0;
                this.__jump(byteOffset);
                this.__updateLittleEndian(littleEndian);
                return this._buffer.readFloatBuffer();
            };
            ArrayBuffer.prototype.getFloat64 = function (byteOffset, littleEndian) {
                if (!this.__check(byteOffset, 8))
                    return 0;
                this.__jump(byteOffset);
                this.__updateLittleEndian(littleEndian);
                return this._buffer.readDoubleBuffer();
            };
            ArrayBuffer.prototype.getInt16 = function (byteOffset, littleEndian) {
                if (!this.__check(byteOffset, 2))
                    return 0;
                this.__jump(byteOffset);
                this.__updateLittleEndian(littleEndian);
                return this._buffer.readInt16Buffer();
            };
            ArrayBuffer.prototype.getInt32 = function (byteOffset, littleEndian) {
                if (!this.__check(byteOffset, 4))
                    return 0;
                this.__jump(byteOffset);
                this.__updateLittleEndian(littleEndian);
                return this._buffer.readInt32Buffer();
            };
            ArrayBuffer.prototype.getInt8 = function (byteOffset, littleEndian) {
                if (!this.__check(byteOffset, 1))
                    return 0;
                this.__jump(byteOffset);
                this.__updateLittleEndian(littleEndian);
                return this._buffer.readInt8Buffer();
            };
            ArrayBuffer.prototype.getUint16 = function (byteOffset, littleEndian) {
                if (!this.__check(byteOffset, 2))
                    return 0;
                this.__jump(byteOffset);
                this.__updateLittleEndian(littleEndian);
                return this._buffer.readUint16Buffer();
            };
            ArrayBuffer.prototype.getUint32 = function (byteOffset, littleEndian) {
                if (!this.__check(byteOffset, 4))
                    return 0;
                this.__jump(byteOffset);
                this.__updateLittleEndian(littleEndian);
                return this._buffer.readUint32Buffer();
            };
            ArrayBuffer.prototype.getUint8 = function (byteOffset, littleEndian) {
                if (!this.__check(byteOffset, 1))
                    return 0;
                this.__jump(byteOffset);
                this.__updateLittleEndian(littleEndian);
                return this._buffer.readUint8Buffer();
            };
            ArrayBuffer.prototype.setFloat32 = function (byteOffset, value, littleEndian) {
                this.__jump(byteOffset);
                this.__updateLittleEndian(littleEndian);
                this._buffer.writeFloatBuffer(value);
            };
            ArrayBuffer.prototype.setFloat64 = function (byteOffset, value, littleEndian) {
                this.__jump(byteOffset);
                this.__updateLittleEndian(littleEndian);
                this._buffer.writeDoubleBuffer(value);
            };
            ArrayBuffer.prototype.setInt16 = function (byteOffset, value, littleEndian) {
                this.__jump(byteOffset);
                this.__updateLittleEndian(littleEndian);
                this._buffer.writeInt16Buffer(value);
            };
            ArrayBuffer.prototype.setInt32 = function (byteOffset, value, littleEndian) {
                this.__jump(byteOffset);
                this.__updateLittleEndian(littleEndian);
                this._buffer.writeInt32Buffer(value);
            };
            ArrayBuffer.prototype.setInt8 = function (byteOffset, value, littleEndian) {
                this.__jump(byteOffset);
                this.__updateLittleEndian(littleEndian);
                this._buffer.writeInt8Buffer(value);
            };
            ArrayBuffer.prototype.setUint16 = function (byteOffset, value, littleEndian) {
                this.__jump(byteOffset);
                this.__updateLittleEndian(littleEndian);
                this._buffer.writeUint16Buffer(value);
            };
            ArrayBuffer.prototype.setUint32 = function (byteOffset, value, littleEndian) {
                this.__jump(byteOffset);
                this.__updateLittleEndian(littleEndian);
                this._buffer.writeUint32Buffer(value);
            };
            ArrayBuffer.prototype.setUint8 = function (byteOffset, value, littleEndian) {
                this.__jump(byteOffset);
                this.__updateLittleEndian(littleEndian);
                this._buffer.writeUint8Buffer(value);
            };
            return ArrayBuffer;
        }());
        var DataView = (function () {
            function DataView(buffer, byteOffset, byteLength) {
                try {
                    this._byteOffset = typeof byteOffset === 'number' ? byteOffset : 0;
                    this._byteLength = typeof byteLength === 'number' ? (byteLength > buffer.byteLength ? buffer.byteLength : byteLength) : buffer.byteLength;
                    if (this._byteOffset < 0 ||
                        this._byteOffset + this._byteLength > buffer.byteLength) {
                        throw "DataView.constructor: range error";
                    }
                    this._buffer = buffer;
                    Object.defineProperty(this, "buffer", {
                        get: function () { return this._buffer; },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(this, "byteLength", {
                        get: function () { return this._byteLength; },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(this, "byteOffset", {
                        get: function () { return this._byteOffset; },
                        enumerable: true,
                        configurable: true
                    });
                }
                catch (e) {
                    throw e;
                }
            }
            DataView.prototype.__checkRange = function (byteOffset, byteLength) {
                var left = this._byteOffset;
                var right = this._byteOffset + this._byteLength;
                var _left = this._byteOffset + byteOffset;
                if (_left < left || _left >= right) {
                    throw new TypeError("Offset is outside the bounds of the DataView, _left = " + _left + ", [" + left + ", " + right + "]");
                }
                var _right = _left + byteLength;
                if (_right < left + 1 || _right > right) {
                    throw new TypeError("Offset is outside the bounds of the DataView, _right = " + _right + ", [" + left + ", " + right + "]");
                }
            };
            DataView.prototype.getFloat32 = function (byteOffset, littleEndian) {
                this.__checkRange(byteOffset, 4);
                return this._buffer.getFloat32(this._byteOffset + byteOffset, littleEndian);
            };
            DataView.prototype.getFloat64 = function (byteOffset, littleEndian) {
                this.__checkRange(byteOffset, 8);
                return this._buffer.getFloat64(this._byteOffset + byteOffset, littleEndian);
            };
            DataView.prototype.getInt16 = function (byteOffset, littleEndian) {
                this.__checkRange(byteOffset, 2);
                return this._buffer.getInt16(this._byteOffset + byteOffset, littleEndian);
            };
            DataView.prototype.getInt32 = function (byteOffset, littleEndian) {
                this.__checkRange(byteOffset, 4);
                return this._buffer.getInt32(this._byteOffset + byteOffset, littleEndian);
            };
            DataView.prototype.getInt8 = function (byteOffset, littleEndian) {
                this.__checkRange(byteOffset, 1);
                return this._buffer.getInt8(this._byteOffset + byteOffset, littleEndian);
            };
            DataView.prototype.getUint16 = function (byteOffset, littleEndian) {
                this.__checkRange(byteOffset, 2);
                return this._buffer.getUint16(this._byteOffset + byteOffset, littleEndian);
            };
            DataView.prototype.getUint32 = function (byteOffset, littleEndian) {
                this.__checkRange(byteOffset, 4);
                return this._buffer.getUint32(this._byteOffset + byteOffset, littleEndian);
            };
            DataView.prototype.getUint8 = function (byteOffset, littleEndian) {
                this.__checkRange(byteOffset, 1);
                return this._buffer.getUint8(this._byteOffset + byteOffset, littleEndian);
            };
            DataView.prototype.setFloat32 = function (byteOffset, value, littleEndian) {
                this.__checkRange(byteOffset, 4);
                this._buffer.setFloat32(this._byteOffset + byteOffset, value, littleEndian);
            };
            DataView.prototype.setFloat64 = function (byteOffset, value, littleEndian) {
                this.__checkRange(byteOffset, 8);
                this._buffer.setFloat64(this._byteOffset + byteOffset, value, littleEndian);
            };
            DataView.prototype.setInt16 = function (byteOffset, value, littleEndian) {
                this.__checkRange(byteOffset, 2);
                this._buffer.setInt16(this._byteOffset + byteOffset, value, littleEndian);
            };
            DataView.prototype.setInt32 = function (byteOffset, value, littleEndian) {
                this.__checkRange(byteOffset, 4);
                this._buffer.setInt32(this._byteOffset + byteOffset, value, littleEndian);
            };
            DataView.prototype.setInt8 = function (byteOffset, value, littleEndian) {
                this.__checkRange(byteOffset, 1);
                this._buffer.setInt8(this._byteOffset + byteOffset, value, littleEndian);
            };
            DataView.prototype.setUint16 = function (byteOffset, value, littleEndian) {
                this.__checkRange(byteOffset, 2);
                this._buffer.setUint16(this._byteOffset + byteOffset, value, littleEndian);
            };
            DataView.prototype.setUint32 = function (byteOffset, value, littleEndian) {
                this.__checkRange(byteOffset, 4);
                this._buffer.setUint32(this._byteOffset + byteOffset, value, littleEndian);
            };
            DataView.prototype.setUint8 = function (byteOffset, value, littleEndian) {
                this.__checkRange(byteOffset, 1);
                this._buffer.setUint8(this._byteOffset + byteOffset, value, littleEndian);
            };
            return DataView;
        }());
        var Int8Array = (function () {
            function Int8Array(object, byteOffset, length) {
                var typeofobj = typeof object;
                if (typeofobj == 'number' || typeofobj == 'undefined') {
                    this._length = (object == undefined) ? 256 : object;
                    var arrayBuffer = new ArrayBuffer(this._length * Int8Array.BYTES_PER_ELEMENT);
                    this._dataView = new DataView(arrayBuffer);
                }
                else if (object instanceof Array == true ||
                    object instanceof Int8Array == true ||
                    object instanceof Uint8Array == true ||
                    object instanceof Int16Array == true ||
                    object instanceof Uint16Array == true ||
                    object instanceof Int32Array == true ||
                    object instanceof Uint32Array == true ||
                    object instanceof Float32Array == true) {
                    this._length = object.length;
                    var arrayBuffer = new ArrayBuffer(this._length * Int8Array.BYTES_PER_ELEMENT);
                    this._dataView = new DataView(arrayBuffer);
                    for (var i_1 = 0; i_1 < object.length; i_1++) {
                        this._dataView.setInt8(i_1 * Int8Array.BYTES_PER_ELEMENT, object[i_1]);
                    }
                }
                else if (object instanceof ArrayBuffer == true) {
                    var arrayBuffer = (object);
                    var _byteOffset = (byteOffset ? byteOffset : 0);
                    this._length = length ? length : (object.byteLength - _byteOffset) / Int8Array.BYTES_PER_ELEMENT;
                    this._dataView = new DataView(arrayBuffer, _byteOffset, this._length * Int8Array.BYTES_PER_ELEMENT);
                }
                else {
                    throw "Int8Array.constructor: Error Type";
                }
                Object.defineProperty(this, "__rawBKData", {
                    get: function () {
                        var begin = this._dataView.byteOffset;
                        var end = this._dataView.byteOffset + this._dataView.byteLength;
                        this.__rawData = this._dataView.buffer.slice(begin, end);
                        return this.__rawData.__nativeObj;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "BYTES_PER_ELEMENT", {
                    get: function () { return 1; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "buffer", {
                    get: function () { return this._dataView.buffer; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "byteLength", {
                    get: function () { return this._dataView.byteLength; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "byteOffset", {
                    get: function () { return this._dataView.byteOffset; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "length", {
                    get: function () { return this._length; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "name", {
                    get: function () { return 'Int8Array'; },
                    enumerable: true,
                    configurable: true
                });
                var _loop_1 = function (i_2) {
                    Object.defineProperty(this_1, String(i_2), {
                        get: function () {
                            var elem = this._dataView.getInt8(i_2 * Int8Array.BYTES_PER_ELEMENT);
                            return elem;
                        },
                        set: function (value) {
                            this._dataView.setInt8(i_2 * Int8Array.BYTES_PER_ELEMENT, value);
                        },
                        enumerable: true,
                        configurable: true
                    });
                };
                var this_1 = this;
                for (var i_2 = 0; i_2 < this._length; i_2++) {
                    _loop_1(i_2);
                }
            }
            Int8Array.prototype.forEach = function (callback, thisArg) {
                if (callback) {
                    for (var i_3 = 0; i_3 < this._length; i_3++) {
                        var elem = this._dataView.getInt8(i_3 * Int8Array.BYTES_PER_ELEMENT);
                        callback.call(thisArg, elem, i_3, this);
                    }
                }
            };
            Int8Array.prototype.includes = function (searchElement, fromIndex) {
                for (var i_4 = fromIndex; i_4 < this._length; i_4++) {
                    var elem = this._dataView.getInt8(i_4 * Int8Array.BYTES_PER_ELEMENT);
                    if (searchElement == elem) {
                        return true;
                    }
                }
                return false;
            };
            Int8Array.prototype.lastIndexOf = function (searchElement, fromIndex) {
                if (fromIndex >= 0) {
                    var startIndex = 0;
                    if (fromIndex >= this._length) {
                        startIndex = 0;
                    }
                    else {
                        startIndex = fromIndex;
                    }
                    var index = -1;
                    for (var i_5 = startIndex; i_5 < this._length; i_5++) {
                        var elem = this._dataView.getInt8(i_5 * Int8Array.BYTES_PER_ELEMENT);
                        if (searchElement === elem) {
                            index = i_5;
                        }
                    }
                    return index;
                }
                else {
                    var startIndex = fromIndex + this._length;
                    if (startIndex >= 0) {
                        var index = -1;
                        for (var i_6 = startIndex; i_6 >= 0; i_6--) {
                            var elem = this._dataView.getInt8(i_6 * Int8Array.BYTES_PER_ELEMENT);
                            if (searchElement === elem) {
                                index = i_6;
                            }
                        }
                        return index;
                    }
                }
                return -1;
            };
            Int8Array.prototype.reduce = function (callback, initialValue) {
                if (0 == this._length && undefined == initialValue) {
                    throw new TypeError("reduce: empty array & no initialValue");
                }
                if (0 == this._length && undefined != initialValue) {
                    return initialValue;
                }
                if (1 == this._length && undefined == initialValue) {
                    return this._dataView.getInt8(0);
                }
                var startIndex;
                var previousValue;
                if (undefined != initialValue) {
                    startIndex = 0;
                    previousValue = initialValue;
                }
                else {
                    startIndex = 1;
                    previousValue = this._dataView.getInt8(0);
                }
                var result = 0;
                for (var i_7 = startIndex; i_7 < this._length; i_7++) {
                    var elem = this._dataView.getInt8(i_7 * Int8Array.BYTES_PER_ELEMENT);
                    result += callback(previousValue, elem, i_7, this);
                    previousValue = result;
                }
                return result;
            };
            Int8Array.prototype.reduceRight = function (callback, initialValue) {
                if (0 == this._length && undefined == initialValue) {
                    throw new TypeError("reduceRight: empty array & no initialValue");
                }
                if (0 == this._length && undefined != initialValue) {
                    return initialValue;
                }
                if (1 == this._length && undefined == initialValue) {
                    return this._dataView.getInt8(0);
                }
                var startIndex;
                var previousValue;
                if (undefined != initialValue) {
                    startIndex = this._length - 1;
                    previousValue = initialValue;
                }
                else {
                    startIndex = this._length - 2;
                    previousValue = this._dataView.getInt8((this._length - 1) * Int8Array.BYTES_PER_ELEMENT);
                }
                var result = 0;
                for (var i_8 = startIndex; i_8 >= 0; i_8--) {
                    var elem = this._dataView.getInt8(i_8 * Int8Array.BYTES_PER_ELEMENT);
                    result += callback(previousValue, elem, i_8, this);
                    previousValue = result;
                }
                return result;
            };
            Int8Array.prototype.set = function (array, offset) {
                if (array instanceof Array == true ||
                    array instanceof Int8Array == true ||
                    array instanceof Uint8Array == true ||
                    array instanceof Int16Array == true ||
                    array instanceof Uint16Array == true ||
                    array instanceof Int32Array == true ||
                    array instanceof Uint32Array == true ||
                    array instanceof Float32Array == true) {
                    var _offset = (offset == undefined) ? 0 : offset;
                    if ((array.length - _offset) * Int8Array.BYTES_PER_ELEMENT > this._dataView.byteLength) {
                        throw new TypeError("Int8Array.set: Out of range");
                    }
                    for (var i_9 = _offset, j_1 = 0; j_1 < array.length; i_9++, j_1++) {
                        this._dataView.setInt8(i_9 * Int8Array.BYTES_PER_ELEMENT, array[j_1]);
                    }
                }
                else {
                    throw new TypeError("Int8Array.set: Error Type");
                }
            };
            Int8Array.prototype.toString = function () {
                var str = '[';
                for (var i_10 = 0; i_10 < this._length; i_10++) {
                    var elem = this._dataView.getInt8(i_10 * Int8Array.BYTES_PER_ELEMENT);
                    str += elem;
                    if (i_10 < this._length - 1)
                        str += ',';
                }
                str += ']';
                return str;
            };
            return Int8Array;
        }());
        Int8Array.BYTES_PER_ELEMENT = 1;
        var Uint8Array = (function () {
            function Uint8Array(object, byteOffset, length) {
                var typeofobj = typeof object;
                if (typeofobj == 'number' || typeofobj == 'undefined') {
                    this._length = (object == undefined) ? 256 : object;
                    var arrayBuffer = new ArrayBuffer(this._length * Uint8Array.BYTES_PER_ELEMENT);
                    this._dataView = new DataView(arrayBuffer);
                }
                else if (object instanceof Array == true ||
                    object instanceof Int8Array == true ||
                    object instanceof Uint8Array == true ||
                    object instanceof Int16Array == true ||
                    object instanceof Uint16Array == true ||
                    object instanceof Int32Array == true ||
                    object instanceof Uint32Array == true ||
                    object instanceof Float32Array == true) {
                    this._length = object.length;
                    var arrayBuffer = new ArrayBuffer(this._length * Uint8Array.BYTES_PER_ELEMENT);
                    this._dataView = new DataView(arrayBuffer);
                    for (var i_11 = 0; i_11 < object.length; i_11++) {
                        this._dataView.setUint8(i_11 * Uint8Array.BYTES_PER_ELEMENT, object[i_11]);
                    }
                }
                else if (object instanceof ArrayBuffer == true) {
                    var arrayBuffer = (object);
                    var _byteOffset = (byteOffset ? byteOffset : 0);
                    this._length = length ? length : (object.byteLength - _byteOffset) / Uint8Array.BYTES_PER_ELEMENT;
                    this._dataView = new DataView(arrayBuffer, _byteOffset, this._length * Uint8Array.BYTES_PER_ELEMENT);
                }
                else {
                    throw "Uint8Array.constructor: Error Type";
                }
                Object.defineProperty(this, "__rawBKData", {
                    get: function () {
                        var begin = this._dataView.byteOffset;
                        var end = this._dataView.byteOffset + this._dataView.byteLength;
                        this.__rawData = this._dataView.buffer.slice(begin, end);
                        return this.__rawData.__nativeObj;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "buffer", {
                    get: function () { return this._dataView.buffer; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "BYTES_PER_ELEMENT", {
                    get: function () { return 1; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "byteLength", {
                    get: function () { return this._dataView.byteLength; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "byteOffset", {
                    get: function () { return this._dataView.byteOffset; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "length", {
                    get: function () { return this._length; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "name", {
                    get: function () { return 'Uint8Array'; },
                    enumerable: true,
                    configurable: true
                });
                var _loop_2 = function (i_12) {
                    Object.defineProperty(this_2, String(i_12), {
                        get: function () {
                            var elem = this._dataView.getUint8(i_12 * Uint8Array.BYTES_PER_ELEMENT);
                            return elem;
                        },
                        set: function (value) {
                            this._dataView.setUint8(i_12 * Uint8Array.BYTES_PER_ELEMENT, value);
                        },
                        enumerable: true,
                        configurable: true
                    });
                };
                var this_2 = this;
                for (var i_12 = 0; i_12 < this._length; i_12++) {
                    _loop_2(i_12);
                }
            }
            Uint8Array.prototype.forEach = function (callback, thisArg) {
                if (callback) {
                    for (var i_13 = 0; i_13 < this._length; i_13++) {
                        var elem = this._dataView.getUint8(i_13 * Uint8Array.BYTES_PER_ELEMENT);
                        callback.call(thisArg, elem, i_13, this);
                    }
                }
            };
            Uint8Array.prototype.includes = function (searchElement, fromIndex) {
                for (var i_14 = fromIndex; i_14 < this._length; i_14++) {
                    var elem = this._dataView.getUint8(i_14 * Uint8Array.BYTES_PER_ELEMENT);
                    if (searchElement == elem) {
                        return true;
                    }
                }
                return false;
            };
            Uint8Array.prototype.lastIndexOf = function (searchElement, fromIndex) {
                if (fromIndex >= 0) {
                    var startIndex = 0;
                    if (fromIndex >= this._length) {
                        startIndex = 0;
                    }
                    else {
                        startIndex = fromIndex;
                    }
                    var index = -1;
                    for (var i_15 = startIndex; i_15 < this._length; i_15++) {
                        var elem = this._dataView.getUint8(i_15 * Uint8Array.BYTES_PER_ELEMENT);
                        if (searchElement === elem) {
                            index = i_15;
                        }
                    }
                    return index;
                }
                else {
                    var startIndex = fromIndex + this._length;
                    if (startIndex >= 0) {
                        var index = -1;
                        for (var i_16 = startIndex; i_16 >= 0; i_16--) {
                            var elem = this._dataView.getUint8(i_16 * Uint8Array.BYTES_PER_ELEMENT);
                            if (searchElement === elem) {
                                index = i_16;
                            }
                        }
                        return index;
                    }
                }
                return -1;
            };
            Uint8Array.prototype.reduce = function (callback, initialValue) {
                if (0 == this._length && undefined == initialValue) {
                    throw new TypeError("reduce: empty array & no initialValue");
                }
                if (0 == this._length && undefined != initialValue) {
                    return initialValue;
                }
                if (1 == this._length && undefined == initialValue) {
                    return this._dataView.getUint8(0);
                }
                var startIndex;
                var previousValue;
                if (undefined != initialValue) {
                    startIndex = 0;
                    previousValue = initialValue;
                }
                else {
                    startIndex = 1;
                    previousValue = this._dataView.getUint8(0);
                }
                var result = 0;
                for (var i_17 = startIndex; i_17 < this._length; i_17++) {
                    var elem = this._dataView.getUint8(i_17 * Uint8Array.BYTES_PER_ELEMENT);
                    result += callback(previousValue, elem, i_17, this);
                    previousValue = result;
                }
                return result;
            };
            Uint8Array.prototype.reduceRight = function (callback, initialValue) {
                if (0 == this._length && undefined == initialValue) {
                    throw new TypeError("reduceRight: empty array & no initialValue");
                }
                if (0 == this._length && undefined != initialValue) {
                    return initialValue;
                }
                if (1 == this._length && undefined == initialValue) {
                    return this._dataView.getUint8(0);
                }
                var startIndex;
                var previousValue;
                if (undefined != initialValue) {
                    startIndex = this._length - 1;
                    previousValue = initialValue;
                }
                else {
                    startIndex = this._length - 2;
                    previousValue = this._dataView.getUint8((this._length - 1) * Uint8Array.BYTES_PER_ELEMENT);
                }
                var result = 0;
                for (var i_18 = startIndex; i_18 >= 0; i_18--) {
                    var elem = this._dataView.getUint8(i_18 * Uint8Array.BYTES_PER_ELEMENT);
                    result += callback(previousValue, elem, i_18, this);
                    previousValue = result;
                }
                return result;
            };
            Uint8Array.prototype.set = function (array, offset) {
                if (array instanceof Array == true ||
                    array instanceof Int8Array == true ||
                    array instanceof Uint8Array == true ||
                    array instanceof Int16Array == true ||
                    array instanceof Uint16Array == true ||
                    array instanceof Int32Array == true ||
                    array instanceof Uint32Array == true ||
                    array instanceof Float32Array == true) {
                    var _offset = (offset == undefined) ? 0 : offset;
                    if ((array.length - _offset) * Uint8Array.BYTES_PER_ELEMENT > this._dataView.byteLength) {
                        throw new TypeError("Uint8Array.set: Out of range");
                    }
                    for (var i_19 = _offset, j_2 = 0; j_2 < array.length; i_19++, j_2++) {
                        this._dataView.setUint8(i_19 * Uint8Array.BYTES_PER_ELEMENT, array[j_2]);
                    }
                }
                else {
                    throw new TypeError("Uint8Array.set: Error Type");
                }
            };
            Uint8Array.prototype.toString = function () {
                var str = '[';
                for (var i_20 = 0; i_20 < this._length; i_20++) {
                    var elem = this._dataView.getUint8(i_20 * Uint8Array.BYTES_PER_ELEMENT);
                    str += elem;
                    if (i_20 < this._length - 1)
                        str += ',';
                }
                str += ']';
                return str;
            };
            return Uint8Array;
        }());
        Uint8Array.BYTES_PER_ELEMENT = 1;
        var Int16Array = (function () {
            function Int16Array(object, byteOffset, length) {
                var typeofobj = typeof object;
                if (typeofobj == 'number' || typeofobj == 'undefined') {
                    this._length = (object == undefined) ? 256 : object;
                    var arrayBuffer = new ArrayBuffer(this._length * Int16Array.BYTES_PER_ELEMENT);
                    this._dataView = new DataView(arrayBuffer);
                }
                else if (object instanceof Array == true ||
                    object instanceof Int8Array == true ||
                    object instanceof Uint8Array == true ||
                    object instanceof Int16Array == true ||
                    object instanceof Uint16Array == true ||
                    object instanceof Int32Array == true ||
                    object instanceof Uint32Array == true ||
                    object instanceof Float32Array == true) {
                    this._length = object.length;
                    var arrayBuffer = new ArrayBuffer(this._length * Int16Array.BYTES_PER_ELEMENT);
                    this._dataView = new DataView(arrayBuffer);
                    for (var i_21 = 0; i_21 < object.length; i_21++) {
                        this._dataView.setInt16(i_21 * Int16Array.BYTES_PER_ELEMENT, object[i_21], true);
                    }
                }
                else if (object instanceof ArrayBuffer == true) {
                    var arrayBuffer = (object);
                    var _byteOffset = (byteOffset ? byteOffset : 0);
                    this._length = length ? length : (object.byteLength - _byteOffset) / Int16Array.BYTES_PER_ELEMENT;
                    this._dataView = new DataView(arrayBuffer, _byteOffset, this._length * Int16Array.BYTES_PER_ELEMENT);
                }
                else {
                    throw "Int16Array.constructor: Error Type";
                }
                Object.defineProperty(this, "__rawBKData", {
                    get: function () {
                        var begin = this._dataView.byteOffset;
                        var end = this._dataView.byteOffset + this._dataView.byteLength;
                        this.__rawData = this._dataView.buffer.slice(begin, end);
                        return this.__rawData.__nativeObj;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "BYTES_PER_ELEMENT", {
                    get: function () { return 2; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "buffer", {
                    get: function () { return this._dataView.buffer; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "byteLength", {
                    get: function () { return this._dataView.byteLength; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "byteOffset", {
                    get: function () { return this._dataView.byteOffset; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "length", {
                    get: function () { return this._length; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "name", {
                    get: function () { return 'Int16Array'; },
                    enumerable: true,
                    configurable: true
                });
                var _loop_3 = function (i_22) {
                    Object.defineProperty(this_3, String(i_22), {
                        get: function () {
                            var elem = this._dataView.getInt16(i_22 * Int16Array.BYTES_PER_ELEMENT, true);
                            return elem;
                        },
                        set: function (value) {
                            this._dataView.setInt16(i_22 * Int16Array.BYTES_PER_ELEMENT, value, true);
                        },
                        enumerable: true,
                        configurable: true
                    });
                };
                var this_3 = this;
                for (var i_22 = 0; i_22 < this._length; i_22++) {
                    _loop_3(i_22);
                }
            }
            Int16Array.prototype.forEach = function (callback, thisArg) {
                if (callback) {
                    for (var i_23 = 0; i_23 < this._length; i_23++) {
                        var elem = this._dataView.getInt16(i_23 * Int16Array.BYTES_PER_ELEMENT, true);
                        callback.call(thisArg, elem, i_23, this);
                    }
                }
            };
            Int16Array.prototype.includes = function (searchElement, fromIndex) {
                for (var i_24 = fromIndex; i_24 < this._length; i_24++) {
                    var elem = this._dataView.getInt16(i_24 * Int16Array.BYTES_PER_ELEMENT, true);
                    if (searchElement == elem) {
                        return true;
                    }
                }
                return false;
            };
            Int16Array.prototype.lastIndexOf = function (searchElement, fromIndex) {
                if (fromIndex >= 0) {
                    var startIndex = 0;
                    if (fromIndex >= this._length) {
                        startIndex = 0;
                    }
                    else {
                        startIndex = fromIndex;
                    }
                    var index = -1;
                    for (var i_25 = startIndex; i_25 < this._length; i_25++) {
                        var elem = this._dataView.getInt16(i_25 * Int16Array.BYTES_PER_ELEMENT, true);
                        if (searchElement === elem) {
                            index = i_25;
                        }
                    }
                    return index;
                }
                else {
                    var startIndex = fromIndex + this._length;
                    if (startIndex >= 0) {
                        var index = -1;
                        for (var i_26 = startIndex; i_26 >= 0; i_26--) {
                            var elem = this._dataView.getInt16(i_26 * Int16Array.BYTES_PER_ELEMENT, true);
                            if (searchElement === elem) {
                                index = i_26;
                            }
                        }
                        return index;
                    }
                }
                return -1;
            };
            Int16Array.prototype.reduce = function (callback, initialValue) {
                if (0 == this._length && undefined == initialValue) {
                    throw new TypeError("reduce: empty array & no initialValue");
                }
                if (0 == this._length && undefined != initialValue) {
                    return initialValue;
                }
                if (1 == this._length && undefined == initialValue) {
                    return this._dataView.getInt16(0, true);
                }
                var startIndex;
                var previousValue;
                if (undefined != initialValue) {
                    startIndex = 0;
                    previousValue = initialValue;
                }
                else {
                    startIndex = 1;
                    previousValue = this._dataView.getInt16(0, true);
                }
                var result = 0;
                for (var i_27 = startIndex; i_27 < this._length; i_27++) {
                    var elem = this._dataView.getInt16(i_27 * Int16Array.BYTES_PER_ELEMENT, true);
                    result += callback(previousValue, elem, i_27, this);
                    previousValue = result;
                }
                return result;
            };
            Int16Array.prototype.reduceRight = function (callback, initialValue) {
                if (0 == this._length && undefined == initialValue) {
                    throw new TypeError("reduceRight: empty array & no initialValue");
                }
                if (0 == this._length && undefined != initialValue) {
                    return initialValue;
                }
                if (1 == this._length && undefined == initialValue) {
                    return this._dataView.getInt16(0, true);
                }
                var startIndex;
                var previousValue;
                if (undefined != initialValue) {
                    startIndex = this._length - 1;
                    previousValue = initialValue;
                }
                else {
                    startIndex = this._length - 2;
                    previousValue = this._dataView.getInt16((this._length - 1) * Int16Array.BYTES_PER_ELEMENT, true);
                }
                var result = 0;
                for (var i_28 = startIndex; i_28 >= 0; i_28--) {
                    var elem = this._dataView.getInt16(i_28 * Int16Array.BYTES_PER_ELEMENT, true);
                    result += callback(previousValue, elem, i_28, this);
                    previousValue = result;
                }
                return result;
            };
            Int16Array.prototype.set = function (array, offset) {
                if (array instanceof Array == true ||
                    array instanceof Int8Array == true ||
                    array instanceof Uint8Array == true ||
                    array instanceof Int16Array == true ||
                    array instanceof Uint16Array == true ||
                    array instanceof Int32Array == true ||
                    array instanceof Uint32Array == true ||
                    array instanceof Float32Array == true) {
                    var _offset = (offset == undefined) ? 0 : offset;
                    if ((array.length - _offset) * Int16Array.BYTES_PER_ELEMENT > this._dataView.byteLength) {
                        throw new TypeError("Int16Array.set: Out of range");
                    }
                    for (var i_29 = _offset, j_3 = 0; j_3 < array.length; i_29++, j_3++) {
                        this._dataView.setInt16(i_29 * Int16Array.BYTES_PER_ELEMENT, array[j_3], true);
                    }
                }
                else {
                    throw new TypeError("Int16Array.set: Error Type");
                }
            };
            Int16Array.prototype.toString = function () {
                var str = '[';
                for (var i_30 = 0; i_30 < this._length; i_30++) {
                    var elem = this._dataView.getInt16(i_30 * Int16Array.BYTES_PER_ELEMENT, true);
                    str += elem;
                    if (i_30 < this._length - 1)
                        str += ',';
                }
                str += ']';
                return str;
            };
            return Int16Array;
        }());
        Int16Array.BYTES_PER_ELEMENT = 2;
        var Uint16Array = (function () {
            function Uint16Array(object, byteOffset, length) {
                var typeofobj = typeof object;
                if (typeofobj == 'number' || typeofobj == 'undefined') {
                    this._length = (object == undefined) ? 256 : object;
                    var arrayBuffer = new ArrayBuffer(this._length * Uint16Array.BYTES_PER_ELEMENT);
                    this._dataView = new DataView(arrayBuffer);
                }
                else if (object instanceof Array == true ||
                    object instanceof Int8Array == true ||
                    object instanceof Uint8Array == true ||
                    object instanceof Int16Array == true ||
                    object instanceof Uint16Array == true ||
                    object instanceof Int32Array == true ||
                    object instanceof Uint32Array == true ||
                    object instanceof Float32Array == true) {
                    this._length = object.length;
                    var arrayBuffer = new ArrayBuffer(this._length * Uint16Array.BYTES_PER_ELEMENT);
                    this._dataView = new DataView(arrayBuffer);
                    for (var i_31 = 0; i_31 < object.length; i_31++) {
                        this._dataView.setUint16(i_31 * Uint16Array.BYTES_PER_ELEMENT, object[i_31], true);
                    }
                }
                else if (object instanceof ArrayBuffer == true) {
                    var arrayBuffer = (object);
                    var _byteOffset = (byteOffset ? byteOffset : 0);
                    this._length = length ? length : (object.byteLength - _byteOffset) / Uint16Array.BYTES_PER_ELEMENT;
                    this._dataView = new DataView(arrayBuffer, _byteOffset, this._length * Uint16Array.BYTES_PER_ELEMENT);
                }
                else {
                    throw "Uint16Array.constructor: Error Type";
                }
                Object.defineProperty(this, "__rawBKData", {
                    get: function () {
                        var begin = this._dataView.byteOffset;
                        var end = this._dataView.byteOffset + this._dataView.byteLength;
                        this.__rawData = this._dataView.buffer.slice(begin, end);
                        return this.__rawData.__nativeObj;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "BYTES_PER_ELEMENT", {
                    get: function () { return 2; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "buffer", {
                    get: function () { return this._dataView.buffer; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "byteLength", {
                    get: function () { return this._dataView.byteLength; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "byteOffset", {
                    get: function () { return this._dataView.byteOffset; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "length", {
                    get: function () { return this._length; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "name", {
                    get: function () { return 'Uint16Array'; },
                    enumerable: true,
                    configurable: true
                });
                var _loop_4 = function (i_32) {
                    Object.defineProperty(this_4, String(i_32), {
                        get: function () {
                            var elem = this._dataView.getUint16(i_32 * Uint16Array.BYTES_PER_ELEMENT, true);
                            return elem;
                        },
                        set: function (value) {
                            this._dataView.setUint16(i_32 * Uint16Array.BYTES_PER_ELEMENT, value, true);
                        },
                        enumerable: true,
                        configurable: true
                    });
                };
                var this_4 = this;
                for (var i_32 = 0; i_32 < this._length; i_32++) {
                    _loop_4(i_32);
                }
            }
            Uint16Array.prototype.forEach = function (callback, thisArg) {
                if (callback) {
                    for (var i_33 = 0; i_33 < this._length; i_33++) {
                        var elem = this._dataView.getUint16(i_33 * Uint16Array.BYTES_PER_ELEMENT, true);
                        callback.call(thisArg, elem, i_33, this);
                    }
                }
            };
            Uint16Array.prototype.includes = function (searchElement, fromIndex) {
                for (var i_34 = fromIndex; i_34 < this._length; i_34++) {
                    var elem = this._dataView.getUint16(i_34 * Uint16Array.BYTES_PER_ELEMENT, true);
                    if (searchElement == elem) {
                        return true;
                    }
                }
                return false;
            };
            Uint16Array.prototype.lastIndexOf = function (searchElement, fromIndex) {
                if (fromIndex >= 0) {
                    var startIndex = 0;
                    if (fromIndex >= this._length) {
                        startIndex = 0;
                    }
                    else {
                        startIndex = fromIndex;
                    }
                    var index = -1;
                    for (var i_35 = startIndex; i_35 < this._length; i_35++) {
                        var elem = this._dataView.getUint16(i_35 * Uint16Array.BYTES_PER_ELEMENT, true);
                        if (searchElement === elem) {
                            index = i_35;
                        }
                    }
                    return index;
                }
                else {
                    var startIndex = fromIndex + this._length;
                    if (startIndex >= 0) {
                        var index = -1;
                        for (var i_36 = startIndex; i_36 >= 0; i_36--) {
                            var elem = this._dataView.getUint16(i_36 * Uint16Array.BYTES_PER_ELEMENT, true);
                            if (searchElement === elem) {
                                index = i_36;
                            }
                        }
                        return index;
                    }
                }
                return -1;
            };
            Uint16Array.prototype.reduce = function (callback, initialValue) {
                if (0 == this._length && undefined == initialValue) {
                    throw new TypeError("reduce: empty array & no initialValue");
                }
                if (0 == this._length && undefined != initialValue) {
                    return initialValue;
                }
                if (1 == this._length && undefined == initialValue) {
                    return this._dataView.getUint16(0, true);
                }
                var startIndex;
                var previousValue;
                if (undefined != initialValue) {
                    startIndex = 0;
                    previousValue = initialValue;
                }
                else {
                    startIndex = 1;
                    previousValue = this._dataView.getUint16(0, true);
                }
                var result = 0;
                for (var i_37 = startIndex; i_37 < this._length; i_37++) {
                    var elem = this._dataView.getUint16(i_37 * Uint16Array.BYTES_PER_ELEMENT, true);
                    result += callback(previousValue, elem, i_37, this);
                    previousValue = result;
                }
                return result;
            };
            Uint16Array.prototype.reduceRight = function (callback, initialValue) {
                if (0 == this._length && undefined == initialValue) {
                    throw new TypeError("reduceRight: empty array & no initialValue");
                }
                if (0 == this._length && undefined != initialValue) {
                    return initialValue;
                }
                if (1 == this._length && undefined == initialValue) {
                    return this._dataView.getUint16(0, true);
                }
                var startIndex;
                var previousValue;
                if (undefined != initialValue) {
                    startIndex = this._length - 1;
                    previousValue = initialValue;
                }
                else {
                    startIndex = this._length - 2;
                    previousValue = this._dataView.getUint16((this._length - 1) * Uint16Array.BYTES_PER_ELEMENT, true);
                }
                var result = 0;
                for (var i_38 = startIndex; i_38 >= 0; i_38--) {
                    var elem = this._dataView.getUint16(i_38 * Uint16Array.BYTES_PER_ELEMENT, true);
                    result += callback(previousValue, elem, i_38, this);
                    previousValue = result;
                }
                return result;
            };
            Uint16Array.prototype.set = function (array, offset) {
                if (array instanceof Array == true ||
                    array instanceof Int8Array == true ||
                    array instanceof Uint8Array == true ||
                    array instanceof Int16Array == true ||
                    array instanceof Uint16Array == true ||
                    array instanceof Int32Array == true ||
                    array instanceof Uint32Array == true ||
                    array instanceof Float32Array == true) {
                    var _offset = (offset == undefined) ? 0 : offset;
                    if ((array.length - _offset) * Uint16Array.BYTES_PER_ELEMENT > this._dataView.byteLength) {
                        throw new TypeError("Uint16Array.set: Out of range");
                    }
                    for (var i_39 = _offset, j_4 = 0; j_4 < array.length; i_39++, j_4++) {
                        this._dataView.setUint16(i_39 * Uint16Array.BYTES_PER_ELEMENT, array[j_4], true);
                    }
                }
                else {
                    throw new TypeError("Uint16Array.set: Error Type");
                }
            };
            Uint16Array.prototype.toString = function () {
                var str = '[';
                for (var i_40 = 0; i_40 < this._length; i_40++) {
                    var elem = this._dataView.getUint16(i_40 * Uint16Array.BYTES_PER_ELEMENT, true);
                    str += elem;
                    if (i_40 < this._length - 1)
                        str += ',';
                }
                str += ']';
                return str;
            };
            return Uint16Array;
        }());
        Uint16Array.BYTES_PER_ELEMENT = 2;
        var Int32Array = (function () {
            function Int32Array(object, byteOffset, length) {
                var typeofobj = typeof object;
                if (typeofobj == 'number' || typeofobj == 'undefined') {
                    this._length = (object == undefined) ? 256 : object;
                    var arrayBuffer = new ArrayBuffer(this._length * Int32Array.BYTES_PER_ELEMENT);
                    this._dataView = new DataView(arrayBuffer);
                }
                else if (object instanceof Array == true ||
                    object instanceof Int8Array == true ||
                    object instanceof Uint8Array == true ||
                    object instanceof Int16Array == true ||
                    object instanceof Uint16Array == true ||
                    object instanceof Int32Array == true ||
                    object instanceof Uint32Array == true ||
                    object instanceof Float32Array == true) {
                    this._length = object.length;
                    var arrayBuffer = new ArrayBuffer(this._length * Int32Array.BYTES_PER_ELEMENT);
                    this._dataView = new DataView(arrayBuffer);
                    for (var i_41 = 0; i_41 < object.length; i_41++) {
                        this._dataView.setInt32(i_41 * Int32Array.BYTES_PER_ELEMENT, object[i_41], true);
                    }
                }
                else if (object instanceof ArrayBuffer == true) {
                    var arrayBuffer = (object);
                    var _byteOffset = (byteOffset ? byteOffset : 0);
                    this._length = length ? length : (object.byteLength - _byteOffset) / Int32Array.BYTES_PER_ELEMENT;
                    this._dataView = new DataView(arrayBuffer, _byteOffset, this._length * Int32Array.BYTES_PER_ELEMENT);
                }
                else {
                    throw "Uint16Array.constructor: Error Type";
                }
                Object.defineProperty(this, "__rawBKData", {
                    get: function () {
                        var begin = this._dataView.byteOffset;
                        var end = this._dataView.byteOffset + this._dataView.byteLength;
                        this.__rawData = this._dataView.buffer.slice(begin, end);
                        return this.__rawData.__nativeObj;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "BYTES_PER_ELEMENT", {
                    get: function () { return 4; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "buffer", {
                    get: function () { return this._dataView.buffer; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "byteLength", {
                    get: function () { return this._dataView.byteLength; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "byteOffset", {
                    get: function () { return this._dataView.byteOffset; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "length", {
                    get: function () { return this._length; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "name", {
                    get: function () { return 'Int32Array'; },
                    enumerable: true,
                    configurable: true
                });
                var _loop_5 = function (i_42) {
                    Object.defineProperty(this_5, String(i_42), {
                        get: function () {
                            var elem = this._dataView.getInt32(i_42 * Int32Array.BYTES_PER_ELEMENT, true);
                            return elem;
                        },
                        set: function (value) {
                            this._dataView.setInt32(i_42 * Int32Array.BYTES_PER_ELEMENT, value, true);
                        },
                        enumerable: true,
                        configurable: true
                    });
                };
                var this_5 = this;
                for (var i_42 = 0; i_42 < this._length; i_42++) {
                    _loop_5(i_42);
                }
            }
            Int32Array.prototype.forEach = function (callback, thisArg) {
                if (callback) {
                    for (var i_43 = 0; i_43 < this._length; i_43++) {
                        var elem = this._dataView.getInt32(i_43 * Int32Array.BYTES_PER_ELEMENT, true);
                        callback.call(thisArg, elem, i_43, this);
                    }
                }
            };
            Int32Array.prototype.includes = function (searchElement, fromIndex) {
                for (var i_44 = fromIndex; i_44 < this._length; i_44++) {
                    var elem = this._dataView.getInt32(i_44 * Int32Array.BYTES_PER_ELEMENT, true);
                    if (searchElement == elem) {
                        return true;
                    }
                }
                return false;
            };
            Int32Array.prototype.lastIndexOf = function (searchElement, fromIndex) {
                if (fromIndex >= 0) {
                    var startIndex = 0;
                    if (fromIndex >= this._length) {
                        startIndex = 0;
                    }
                    else {
                        startIndex = fromIndex;
                    }
                    var index = -1;
                    for (var i_45 = startIndex; i_45 < this._length; i_45++) {
                        var elem = this._dataView.getInt32(i_45 * Int32Array.BYTES_PER_ELEMENT, true);
                        if (searchElement === elem) {
                            index = i_45;
                        }
                    }
                    return index;
                }
                else {
                    var startIndex = fromIndex + this._length;
                    if (startIndex >= 0) {
                        var index = -1;
                        for (var i_46 = startIndex; i_46 >= 0; i_46--) {
                            var elem = this._dataView.getInt32(i_46 * Int32Array.BYTES_PER_ELEMENT, true);
                            if (searchElement === elem) {
                                index = i_46;
                            }
                        }
                        return index;
                    }
                }
                return -1;
            };
            Int32Array.prototype.reduce = function (callback, initialValue) {
                if (0 == this._length && undefined == initialValue) {
                    throw new TypeError("reduce: empty array & no initialValue");
                }
                if (0 == this._length && undefined != initialValue) {
                    return initialValue;
                }
                if (1 == this._length && undefined == initialValue) {
                    return this._dataView.getInt32(0, true);
                }
                var startIndex;
                var previousValue;
                if (undefined != initialValue) {
                    startIndex = 0;
                    previousValue = initialValue;
                }
                else {
                    startIndex = 1;
                    previousValue = this._dataView.getInt32(0, true);
                }
                var result = 0;
                for (var i_47 = startIndex; i_47 < this._length; i_47++) {
                    var elem = this._dataView.getInt32(i_47 * Int32Array.BYTES_PER_ELEMENT, true);
                    result += callback(previousValue, elem, i_47, this);
                    previousValue = result;
                }
                return result;
            };
            Int32Array.prototype.reduceRight = function (callback, initialValue) {
                if (0 == this._length && undefined == initialValue) {
                    throw new TypeError("reduceRight: empty array & no initialValue");
                }
                if (0 == this._length && undefined != initialValue) {
                    return initialValue;
                }
                if (1 == this._length && undefined == initialValue) {
                    return this._dataView.getInt32(0, true);
                }
                var startIndex;
                var previousValue;
                if (undefined != initialValue) {
                    startIndex = this._length - 1;
                    previousValue = initialValue;
                }
                else {
                    startIndex = this._length - 2;
                    previousValue = this._dataView.getInt32((this._length - 1) * Int32Array.BYTES_PER_ELEMENT, true);
                }
                var result = 0;
                for (var i_48 = startIndex; i_48 >= 0; i_48--) {
                    var elem = this._dataView.getInt32(i_48 * Int32Array.BYTES_PER_ELEMENT, true);
                    result += callback(previousValue, elem, i_48, this);
                    previousValue = result;
                }
                return result;
            };
            Int32Array.prototype.set = function (array, offset) {
                if (array instanceof Array == true ||
                    array instanceof Int8Array == true ||
                    array instanceof Uint8Array == true ||
                    array instanceof Int16Array == true ||
                    array instanceof Uint16Array == true ||
                    array instanceof Int32Array == true ||
                    array instanceof Uint32Array == true ||
                    array instanceof Float32Array == true) {
                    var _offset = (offset == undefined) ? 0 : offset;
                    if ((array.length - _offset) * Int32Array.BYTES_PER_ELEMENT > this._dataView.byteLength) {
                        throw new TypeError("Int32Array.set: Out of range");
                    }
                    for (var i_49 = _offset, j_5 = 0; j_5 < array.length; i_49++, j_5++) {
                        this._dataView.setInt32(i_49 * Int32Array.BYTES_PER_ELEMENT, array[j_5], true);
                    }
                }
                else {
                    throw new TypeError("Int32Array.set: Error Type");
                }
            };
            Int32Array.prototype.toString = function () {
                var str = '[';
                for (var i_50 = 0; i_50 < this._length; i_50++) {
                    var elem = this._dataView.getInt32(i_50 * Int32Array.BYTES_PER_ELEMENT, true);
                    str += elem;
                    if (i_50 < this._length - 1)
                        str += ',';
                }
                str += ']';
                return str;
            };
            return Int32Array;
        }());
        Int32Array.BYTES_PER_ELEMENT = 4;
        var Uint32Array = (function () {
            function Uint32Array(object, byteOffset, length) {
                var typeofobj = typeof object;
                if (typeofobj == 'number' || typeofobj == 'undefined') {
                    this._length = (object == undefined) ? 256 : object;
                    var arrayBuffer = new ArrayBuffer(this._length * Uint32Array.BYTES_PER_ELEMENT);
                    this._dataView = new DataView(arrayBuffer);
                }
                else if (object instanceof Array == true ||
                    object instanceof Int8Array == true ||
                    object instanceof Uint8Array == true ||
                    object instanceof Int16Array == true ||
                    object instanceof Uint16Array == true ||
                    object instanceof Int32Array == true ||
                    object instanceof Uint32Array == true ||
                    object instanceof Float32Array == true) {
                    this._length = object.length;
                    var arrayBuffer = new ArrayBuffer(this._length * Uint32Array.BYTES_PER_ELEMENT);
                    this._dataView = new DataView(arrayBuffer);
                    for (var i_51 = 0; i_51 < object.length; i_51++) {
                        this._dataView.setUint32(i_51 * Uint32Array.BYTES_PER_ELEMENT, object[i_51], true);
                    }
                }
                else if (object instanceof ArrayBuffer == true) {
                    var arrayBuffer = (object);
                    var _byteOffset = (byteOffset ? byteOffset : 0);
                    this._length = length ? length : (object.byteLength - _byteOffset) / Uint32Array.BYTES_PER_ELEMENT;
                    this._dataView = new DataView(arrayBuffer, _byteOffset, this._length * Uint32Array.BYTES_PER_ELEMENT);
                }
                else {
                    throw "Uint32Array.constructor: Error Type";
                }
                Object.defineProperty(this, "__rawBKData", {
                    get: function () {
                        var begin = this._dataView.byteOffset;
                        var end = this._dataView.byteOffset + this._dataView.byteLength;
                        this.__rawData = this._dataView.buffer.slice(begin, end);
                        return this.__rawData.__nativeObj;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "BYTES_PER_ELEMENT", {
                    get: function () { return 4; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "buffer", {
                    get: function () { return this._dataView.buffer; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "byteLength", {
                    get: function () { return this._dataView.byteLength; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "byteOffset", {
                    get: function () { return this._dataView.byteOffset; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "length", {
                    get: function () { return this._length; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "name", {
                    get: function () { return 'Uint32Array'; },
                    enumerable: true,
                    configurable: true
                });
                var _loop_6 = function (i_52) {
                    Object.defineProperty(this_6, String(i_52), {
                        get: function () {
                            var elem = this._dataView.getUint32(i_52 * Uint32Array.BYTES_PER_ELEMENT, true);
                            return elem;
                        },
                        set: function (value) {
                            this._dataView.setUint32(i_52 * Uint32Array.BYTES_PER_ELEMENT, value, true);
                        },
                        enumerable: true,
                        configurable: true
                    });
                };
                var this_6 = this;
                for (var i_52 = 0; i_52 < this._length; i_52++) {
                    _loop_6(i_52);
                }
            }
            Uint32Array.prototype.forEach = function (callback, thisArg) {
                if (callback) {
                    for (var i_53 = 0; i_53 < this._length; i_53++) {
                        var elem = this._dataView.getUint32(i_53 * Uint32Array.BYTES_PER_ELEMENT, true);
                        callback.call(thisArg, elem, i_53, this);
                    }
                }
            };
            Uint32Array.prototype.includes = function (searchElement, fromIndex) {
                for (var i_54 = fromIndex; i_54 < this._length; i_54++) {
                    var elem = this._dataView.getUint32(i_54 * Uint32Array.BYTES_PER_ELEMENT, true);
                    if (searchElement == elem) {
                        return true;
                    }
                }
                return false;
            };
            Uint32Array.prototype.lastIndexOf = function (searchElement, fromIndex) {
                if (fromIndex >= 0) {
                    var startIndex = 0;
                    if (fromIndex >= this._length) {
                        startIndex = 0;
                    }
                    else {
                        startIndex = fromIndex;
                    }
                    var index = -1;
                    for (var i_55 = startIndex; i_55 < this._length; i_55++) {
                        var elem = this._dataView.getUint32(i_55 * Uint32Array.BYTES_PER_ELEMENT, true);
                        if (searchElement === elem) {
                            index = i_55;
                        }
                    }
                    return index;
                }
                else {
                    var startIndex = fromIndex + this._length;
                    if (startIndex >= 0) {
                        var index = -1;
                        for (var i_56 = startIndex; i_56 >= 0; i_56--) {
                            var elem = this._dataView.getUint32(i_56 * Uint32Array.BYTES_PER_ELEMENT, true);
                            if (searchElement === elem) {
                                index = i_56;
                            }
                        }
                        return index;
                    }
                }
                return -1;
            };
            Uint32Array.prototype.reduce = function (callback, initialValue) {
                if (0 == this._length && undefined == initialValue) {
                    throw new TypeError("reduce: empty array & no initialValue");
                }
                if (0 == this._length && undefined != initialValue) {
                    return initialValue;
                }
                if (1 == this._length && undefined == initialValue) {
                    return this._dataView.getUint32(0, true);
                }
                var startIndex;
                var previousValue;
                if (undefined != initialValue) {
                    startIndex = 0;
                    previousValue = initialValue;
                }
                else {
                    startIndex = 1;
                    previousValue = this._dataView.getUint32(0, true);
                }
                var result = 0;
                for (var i_57 = startIndex; i_57 < this._length; i_57++) {
                    var elem = this._dataView.getUint32(i_57 * Uint32Array.BYTES_PER_ELEMENT, true);
                    result += callback(previousValue, elem, i_57, this);
                    previousValue = result;
                }
                return result;
            };
            Uint32Array.prototype.reduceRight = function (callback, initialValue) {
                if (0 == this._length && undefined == initialValue) {
                    throw new TypeError("reduceRight: empty array & no initialValue");
                }
                if (0 == this._length && undefined != initialValue) {
                    return initialValue;
                }
                if (1 == this._length && undefined == initialValue) {
                    return this._dataView.getUint32(0, true);
                }
                var startIndex;
                var previousValue;
                if (undefined != initialValue) {
                    startIndex = this._length - 1;
                    previousValue = initialValue;
                }
                else {
                    startIndex = this._length - 2;
                    previousValue = this._dataView.getUint32((this._length - 1) * Uint32Array.BYTES_PER_ELEMENT, true);
                }
                var result = 0;
                for (var i_58 = startIndex; i_58 >= 0; i_58--) {
                    var elem = this._dataView.getUint32(i_58 * Uint32Array.BYTES_PER_ELEMENT, true);
                    result += callback(previousValue, elem, i_58, this);
                    previousValue = result;
                }
                return result;
            };
            Uint32Array.prototype.set = function (array, offset) {
                if (array instanceof Array == true ||
                    array instanceof Int8Array == true ||
                    array instanceof Uint8Array == true ||
                    array instanceof Int16Array == true ||
                    array instanceof Uint16Array == true ||
                    array instanceof Int32Array == true ||
                    array instanceof Uint32Array == true ||
                    array instanceof Float32Array == true) {
                    var _offset = (offset == undefined) ? 0 : offset;
                    if ((array.length - _offset) * Uint32Array.BYTES_PER_ELEMENT > this._dataView.byteLength) {
                        throw new TypeError("Uint32Array.set: Out of range");
                    }
                    for (var i_59 = _offset, j_6 = 0; j_6 < array.length; i_59++, j_6++) {
                        this._dataView.setUint32(i_59 * Uint32Array.BYTES_PER_ELEMENT, array[j_6], true);
                    }
                }
                else {
                    throw new TypeError("Uint32Array.set: Error Type");
                }
            };
            Uint32Array.prototype.toString = function () {
                var str = '[';
                for (var i_60 = 0; i_60 < this._length; i_60++) {
                    var elem = this._dataView.getUint32(i_60 * Uint32Array.BYTES_PER_ELEMENT, true);
                    str += elem;
                    if (i_60 < this._length - 1)
                        str += ',';
                }
                str += ']';
                return str;
            };
            return Uint32Array;
        }());
        Uint32Array.BYTES_PER_ELEMENT = 4;
        var Float32Array = (function () {
            function Float32Array(object, byteOffset, length) {
                var typeofobj = typeof object;
                if (typeofobj == 'number' || typeofobj == 'undefined') {
                    this._length = (object == undefined) ? 256 : object;
                    var arrayBuffer = new ArrayBuffer(this._length * Float32Array.BYTES_PER_ELEMENT);
                    this._dataView = new DataView(arrayBuffer);
                }
                else if (object instanceof Array == true ||
                    object instanceof Int8Array == true ||
                    object instanceof Uint8Array == true ||
                    object instanceof Int16Array == true ||
                    object instanceof Uint16Array == true ||
                    object instanceof Int32Array == true ||
                    object instanceof Uint32Array == true ||
                    object instanceof Float32Array == true) {
                    this._length = object.length;
                    var arrayBuffer = new ArrayBuffer(this._length * Float32Array.BYTES_PER_ELEMENT);
                    this._dataView = new DataView(arrayBuffer);
                    for (var i_61 = 0; i_61 < object.length; i_61++) {
                        this._dataView.setFloat32(i_61 * Float32Array.BYTES_PER_ELEMENT, object[i_61], true);
                    }
                }
                else if (object instanceof ArrayBuffer == true) {
                    var arrayBuffer = (object);
                    var _byteOffset = (byteOffset ? byteOffset : 0);
                    this._length = length ? length : (object.byteLength - _byteOffset) / Float32Array.BYTES_PER_ELEMENT;
                    this._dataView = new DataView(arrayBuffer, _byteOffset, this._length * Float32Array.BYTES_PER_ELEMENT);
                }
                else {
                    throw "Float32Array.constructor: Error Type";
                }
                Object.defineProperty(this, "__rawBKData", {
                    get: function () {
                        var begin = this._dataView.byteOffset;
                        var end = this._dataView.byteOffset + this._dataView.byteLength;
                        this.__rawData = this._dataView.buffer.slice(begin, end);
                        return this.__rawData.__nativeObj;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "BYTES_PER_ELEMENT", {
                    get: function () { return 4; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "buffer", {
                    get: function () { return this._dataView.buffer; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "byteLength", {
                    get: function () { return this._dataView.byteLength; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "byteOffset", {
                    get: function () { return this._dataView.byteOffset; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "length", {
                    get: function () { return this._length; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(this, "name", {
                    get: function () { return 'Float32Array'; },
                    enumerable: true,
                    configurable: true
                });
                var _loop_7 = function (i_62) {
                    Object.defineProperty(this_7, String(i_62), {
                        get: function () {
                            var elem = this._dataView.getFloat32(i_62 * Float32Array.BYTES_PER_ELEMENT, true);
                            return elem;
                        },
                        set: function (value) {
                            this._dataView.setFloat32(i_62 * Float32Array.BYTES_PER_ELEMENT, value, true);
                        },
                        enumerable: true,
                        configurable: true
                    });
                };
                var this_7 = this;
                for (var i_62 = 0; i_62 < this._length; i_62++) {
                    _loop_7(i_62);
                }
            }
            Float32Array.prototype.forEach = function (callback, thisArg) {
                if (callback) {
                    for (var i_63 = 0; i_63 < this._length; i_63++) {
                        var elem = this._dataView.getFloat32(i_63 * Float32Array.BYTES_PER_ELEMENT, true);
                        callback.call(thisArg, elem, i_63, this);
                    }
                }
            };
            Float32Array.prototype.includes = function (searchElement, fromIndex) {
                for (var i_64 = fromIndex; i_64 < this._length; i_64++) {
                    var elem = this._dataView.getFloat32(i_64 * Float32Array.BYTES_PER_ELEMENT, true);
                    if (searchElement == elem) {
                        return true;
                    }
                }
                return false;
            };
            Float32Array.prototype.lastIndexOf = function (searchElement, fromIndex) {
                if (fromIndex >= 0) {
                    var startIndex = 0;
                    if (fromIndex >= this._length) {
                        startIndex = 0;
                    }
                    else {
                        startIndex = fromIndex;
                    }
                    var index = -1;
                    for (var i_65 = startIndex; i_65 < this._length; i_65++) {
                        var elem = this._dataView.getFloat32(i_65 * Float32Array.BYTES_PER_ELEMENT, true);
                        if (searchElement === elem) {
                            index = i_65;
                        }
                    }
                    return index;
                }
                else {
                    var startIndex = fromIndex + this._length;
                    if (startIndex >= 0) {
                        var index = -1;
                        for (var i_66 = startIndex; i_66 >= 0; i_66--) {
                            var elem = this._dataView.getFloat32(i_66 * Float32Array.BYTES_PER_ELEMENT, true);
                            if (searchElement === elem) {
                                index = i_66;
                            }
                        }
                        return index;
                    }
                }
                return -1;
            };
            Float32Array.prototype.reduce = function (callback, initialValue) {
                if (0 == this._length && undefined == initialValue) {
                    throw new TypeError("reduce: empty array & no initialValue");
                }
                if (0 == this._length && undefined != initialValue) {
                    return initialValue;
                }
                if (1 == this._length && undefined == initialValue) {
                    return this._dataView.getFloat32(0, true);
                }
                var startIndex;
                var previousValue;
                if (undefined != initialValue) {
                    startIndex = 0;
                    previousValue = initialValue;
                }
                else {
                    startIndex = 1;
                    previousValue = this._dataView.getFloat32(0, true);
                }
                var result = 0;
                for (var i_67 = startIndex; i_67 < this._length; i_67++) {
                    var elem = this._dataView.getFloat32(i_67 * Float32Array.BYTES_PER_ELEMENT, true);
                    result += callback(previousValue, elem, i_67, this);
                    previousValue = result;
                }
                return result;
            };
            Float32Array.prototype.reduceRight = function (callback, initialValue) {
                if (0 == this._length && undefined == initialValue) {
                    throw new TypeError("reduceRight: empty array & no initialValue");
                }
                if (0 == this._length && undefined != initialValue) {
                    return initialValue;
                }
                if (1 == this._length && undefined == initialValue) {
                    return this._dataView.getFloat32(0, true);
                }
                var startIndex;
                var previousValue;
                if (undefined != initialValue) {
                    startIndex = this._length - 1;
                    previousValue = initialValue;
                }
                else {
                    startIndex = this._length - 2;
                    previousValue = this._dataView.getFloat32((this._length - 1) * Float32Array.BYTES_PER_ELEMENT, true);
                }
                var result = 0;
                for (var i_68 = startIndex; i_68 >= 0; i_68--) {
                    var elem = this._dataView.getFloat32(i_68 * Float32Array.BYTES_PER_ELEMENT, true);
                    result += callback(previousValue, elem, i_68, this);
                    previousValue = result;
                }
                return result;
            };
            Float32Array.prototype.set = function (array, offset) {
                if (array instanceof Array == true ||
                    array instanceof Int8Array == true ||
                    array instanceof Uint8Array == true ||
                    array instanceof Int16Array == true ||
                    array instanceof Uint16Array == true ||
                    array instanceof Int32Array == true ||
                    array instanceof Uint32Array == true ||
                    array instanceof Float32Array == true) {
                    var _offset = (offset == undefined) ? 0 : offset;
                    if ((array.length - _offset) * Float32Array.BYTES_PER_ELEMENT > this._dataView.byteLength) {
                        throw new TypeError("Float32Array.set: Out of range");
                    }
                    for (var i_69 = _offset, j_7 = 0; j_7 < array.length; i_69++, j_7++) {
                        this._dataView.setFloat32(i_69 * Float32Array.BYTES_PER_ELEMENT, array[j_7], true);
                    }
                }
                else {
                    throw new TypeError("Float32Array.set: Error Type");
                }
            };
            Float32Array.prototype.toString = function () {
                var str = '[';
                for (var i_70 = 0; i_70 < this._length; i_70++) {
                    var elem = this._dataView.getFloat32(i_70 * Float32Array.BYTES_PER_ELEMENT, true);
                    str += elem;
                    if (i_70 < this._length - 1)
                        str += ',';
                }
                str += ']';
                return str;
            };
            return Float32Array;
        }());
        Float32Array.BYTES_PER_ELEMENT = 4;
        return {
            "DataView": DataView,
            "ArrayBuffer": ArrayBuffer,
            "Int8Array": Int8Array,
            "Uint8Array": Uint8Array,
            "Int16Array": Int16Array,
            "Uint16Array": Uint16Array,
            "Int32Array": Int32Array,
            "Uint32Array": Uint32Array,
            "Float32Array": Float32Array
        };
    }));
}(this));
