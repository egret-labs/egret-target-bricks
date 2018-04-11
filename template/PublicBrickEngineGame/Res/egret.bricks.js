var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var egret;
(function (egret) {
    var BKDisplayObject = (function (_super) {
        __extends(BKDisplayObject, _super);
        function BKDisplayObject(bkNode) {
            if (bkNode === void 0) { bkNode = null; }
            var _this = _super.call(this) || this;
            /**
             * @internal
             */
            _this._transformDirty = true;
            /**
             * @internal
             */
            _this._colorDirty = 0;
            /**
             * @internal
             */
            _this._color = { r: 1.0, g: 1.0, b: 1.0, a: 1.0 };
            _this.scrollRectNode = null;
            _this._bkNode = bkNode || new BK.Node();
            return _this;
        }
        BKDisplayObject.prototype._replaceNode = function (node) {
            this._transformDirty = true;
            node.vertexColor = this._bkNode.vertexColor;
            node.hidden = this._bkNode.hidden;
            node.blendMode = this._bkNode.blendMode;
            node.zOrder = this._bkNode.zOrder;
            if (this._bkNode.parent) {
                this._bkNode.parent.addChild(node, this.parent.getChildIndex(this));
                this._bkNode.parent.removeChild(this._bkNode);
            }
            this._bkNode = node;
        };
        BKDisplayObject.prototype._updateSelfColor = function () {
            this._bkNode.vertexColor = this._color;
        };
        BKDisplayObject.prototype._updateBKNodeMatrix = function () {
            var matrix = this.$getMatrix();
            var bkMatrix = this._bkNode.transform.matrix;
            var tx = matrix.tx;
            var ty = matrix.ty;
            var pivotX = this.$anchorOffsetX;
            var pivotY = this.$anchorOffsetY;
            if (pivotX !== 0.0 || pivotY !== 0.0) {
                tx -= matrix.a * pivotX + matrix.c * pivotY;
                ty -= matrix.b * pivotX + matrix.d * pivotY;
            }
            bkMatrix.set(matrix.a, -matrix.b, -matrix.c, matrix.d, tx, -ty);
        };
        /**
         * @internal
         */
        BKDisplayObject.prototype._updateColor = function () {
            var parent = this.$parent;
            if (parent) {
                if (this._colorDirty === 2 || parent._colorDirty !== 0) {
                    this._colorDirty = 1;
                    this._color.a = parent._color.a * this.$alpha;
                    this._updateSelfColor();
                }
                else if (this._colorDirty === 1) {
                    this._colorDirty = 0;
                }
            }
            else {
                if (this._colorDirty === 2) {
                    this._colorDirty = 1;
                    this._color.a = this.$alpha;
                    this._updateSelfColor();
                }
                else if (this._colorDirty === 1) {
                    this._colorDirty = 0;
                }
            }
        };
        /**
         * @override
         */
        BKDisplayObject.prototype.$setVisible = function (value) {
            _super.prototype.$setVisible.call(this, value);
            // MD
            this._bkNode.hidden = !value;
        };
        /**
         * @override
         */
        BKDisplayObject.prototype.$setAlpha = function (value) {
            _super.prototype.$setAlpha.call(this, value);
            // MD
            this._colorDirty = 2; // self and child.
        };
        Object.defineProperty(BKDisplayObject.prototype, "blendMode", {
            /**
             * @override
             */
            set: function (value) {
                var self = this;
                var mode = egret.sys.blendModeToNumber(value);
                self.$blendMode = mode;
                // if (egret.nativeRender) {
                //     self.$nativeDisplayObject.setBlendMode(mode);
                // }
                // else {
                self.updateRenderMode(); // MD
                var p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                var maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
                // }
                // MD
                switch (value) {
                    case egret.BlendMode.NORMAL:
                        this._bkNode.blendMode = 1;
                        break;
                    case egret.BlendMode.ADD:
                        this._bkNode.blendMode = 0;
                        break;
                    case egret.BlendMode.ERASE:
                        break;
                    default:
                        break;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKDisplayObject.prototype, "mask", {
            /**
             * @override
             */
            set: function (value) {
                var self = this;
                if (value === self) {
                    return;
                }
                if (!(this instanceof egret.BKBitmap)) {
                    console.log("QQ 玩一玩不支持该种类型的影片剪辑被遮罩，只有 Bitmap 类型可以被遮罩，或不使用遮罩。");
                    return;
                }
                if (value) {
                    if (value instanceof egret.BKBitmap) {
                        if (value == self.$mask) {
                            return;
                        }
                        if (value.$maskedObject) {
                            value.$maskedObject.mask = null;
                        }
                        value.$maskedObject = self;
                        value._updateBKNodeMatrix();
                        self.$mask = value;
                        var clipNode = new BK.ClipNode(value._bkNode);
                        clipNode.zOrder = this._bkNode.zOrder;
                        clipNode.alphaThreshold = 0.5;
                        clipNode.inverted = false;
                        if (this._bkNode.parent) {
                            this._bkNode.parent.addChild(clipNode, this.parent.getChildIndex(this));
                            this._bkNode.parent.removeChild(this._bkNode);
                        }
                        clipNode.addChild(this._bkNode);
                        // if (!egret.nativeRender) {
                        //     value.updateRenderMode();
                        // }
                        // if (self.$maskRect) {
                        //     if (egret.nativeRender) {
                        //         self.$nativeDisplayObject.setMaskRect(0, 0, 0, 0);
                        //     }
                        //     self.$maskRect = null;
                        // }
                        // if (egret.nativeRender) {
                        //     self.$nativeDisplayObject.setMask(value.$nativeDisplayObject.id);
                        // }
                    }
                    else {
                        // if (!self.$maskRect) {
                        //     self.$maskRect = new egret.Rectangle();
                        // }
                        // self.$maskRect.copyFrom(value);
                        // if (egret.nativeRender) {
                        //     self.$nativeDisplayObject.setMaskRect(value.x, value.y, value.width, value.height);
                        // }
                        // if (self.$mask) {
                        //     self.$mask.$maskedObject = null;
                        //     if (!egret.nativeRender) {
                        //         self.$mask.updateRenderMode();
                        //     }
                        // }
                        // if (self.mask) {
                        //     if (egret.nativeRender) {
                        //         self.$nativeDisplayObject.setMask(-1);
                        //     }
                        //     self.$mask = null;
                        // }
                        console.log("QQ 玩一玩不支持该种类型的遮罩，请使用 Bitmap 遮罩，或不使用遮罩。");
                    }
                }
                else {
                    if (self.$mask) {
                        // self.$mask.$maskedObject = null;
                        // if (!egret.nativeRender) {
                        //     self.$mask.updateRenderMode();
                        // }
                    }
                    if (self.mask) {
                        // if (egret.nativeRender) {
                        //     self.$nativeDisplayObject.setMask(-1);
                        // }
                        // MD
                        var clipNode = this._bkNode.parent;
                        if (clipNode && clipNode.parent) {
                            this._bkNode.zOrder = clipNode.zOrder;
                            clipNode.parent.addChild(this._bkNode, this.parent.getChildIndex(this));
                            clipNode.parent.removeChild(clipNode);
                        }
                        else {
                            // Never.
                        }
                        self.$mask = null;
                    }
                    if (self.$maskRect) {
                        // if (egret.nativeRender) {
                        //     self.$nativeDisplayObject.setMaskRect(0, 0, 0, 0);
                        // }
                        self.$maskRect = null;
                    }
                }
                // if (!egret.nativeRender) {
                self.updateRenderMode();
                // }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @override
         */
        BKDisplayObject.prototype.$setX = function (value) {
            var self = this;
            if (self.$x == value) {
                return false;
            }
            self.$x = value;
            // MD
            this._transformDirty = true;
            return true;
        };
        /**
         * @override
         */
        BKDisplayObject.prototype.$setY = function (value) {
            var self = this;
            if (self.$y == value) {
                return false;
            }
            self.$y = value;
            // MD
            this._transformDirty = true;
            return true;
        };
        /**
         * @override
         */
        BKDisplayObject.prototype.$setScaleX = function (value) {
            _super.prototype.$setScaleX.call(this, value);
            // MD
            this._transformDirty = true;
        };
        /**
         * @override
         */
        BKDisplayObject.prototype.$setScaleY = function (value) {
            _super.prototype.$setScaleY.call(this, value);
            // MD
            this._transformDirty = true;
        };
        /**
         * @override
         */
        BKDisplayObject.prototype.$setRotation = function (value) {
            _super.prototype.$setRotation.call(this, value);
            // MD
            this._transformDirty = true;
        };
        /**
         * @override
         */
        BKDisplayObject.prototype.$setSkewX = function (value) {
            _super.prototype.$setSkewX.call(this, value);
            // MD
            this._transformDirty = true;
        };
        /**
         * @override
         */
        BKDisplayObject.prototype.$setSkewY = function (value) {
            _super.prototype.$setSkewY.call(this, value);
            // MD
            this._transformDirty = true;
        };
        /**
         * @override
         */
        BKDisplayObject.prototype.$setMatrix = function (matrix, needUpdateProperties) {
            if (needUpdateProperties === void 0) { needUpdateProperties = true; }
            _super.prototype.$setMatrix.call(this, matrix, needUpdateProperties);
            // MD
            this._transformDirty = true;
        };
        Object.defineProperty(BKDisplayObject.prototype, "scrollRect", {
            /**
             * @override
             */
            get: function () {
                return this.$scrollRect;
            },
            /**
             * @override
             */
            set: function (value) {
                this.setScrollRect(value);
            },
            enumerable: true,
            configurable: true
        });
        BKDisplayObject.prototype.setScrollRect = function (value) {
            if (value) {
                _super.prototype['$setScrollRect'].call(this, value);
                var rect = this.$scrollRect;
                if (this.scrollRectNode) {
                    var clipRectNode = this._bkNode;
                    clipRectNode.clipRegion = { x: 0, y: this.height + 1, width: rect.width, height: -rect.height - 1 };
                    this.scrollRectNode.position = { x: rect.x, y: rect.y };
                    this._transformDirty = true;
                }
                else {
                    var parent_1 = this._bkNode.parent;
                    this.scrollRectNode = this._bkNode;
                    //bk.error
                    //sprite9节点不支持removefromparent
                    // this._bkNode.removeFromParent();
                    if (this._bkNode.parent) {
                        this._bkNode.parent.removeChild(this._bkNode);
                    }
                    var clipRectNode = new BK.ClipRectNode(0, this.height + 1, rect.width, -rect.height - 1);
                    if (parent_1) {
                        parent_1.addChild(clipRectNode);
                    }
                    clipRectNode.addChild(this.scrollRectNode);
                    this._bkNode = clipRectNode;
                    this.scrollRectNode.position = { x: rect.x, y: rect.y };
                    this._transformDirty = true;
                }
            }
            else {
                if (this.scrollRectNode) {
                    var scrollRectNode = this.scrollRectNode;
                    var parent_2 = this._bkNode.parent;
                    //bk.error
                    //sprite9节点不支持removefromparent
                    // scrollRectNode.removeFromParent();
                    // this._bkNode.removeFromParent();
                    if (scrollRectNode.parent) {
                        scrollRectNode.parent.removeChild(scrollRectNode);
                    }
                    if (parent_2) {
                        parent_2.removeChild(this._bkNode);
                    }
                    scrollRectNode.position = { x: this._bkNode.position.x, y: this._bkNode.position.y };
                    parent_2.addChild(scrollRectNode);
                    this._bkNode = scrollRectNode;
                    this.scrollRectNode = null;
                    this._transformDirty = true;
                }
            }
        };
        /**
         * @override
         */
        BKDisplayObject.prototype.$hitTest = function (stageX, stageY) {
            var self = this;
            if (!self.$visible) {
                return null;
            }
            var m = self.$getInvertedConcatenatedMatrix();
            if (m.a == 0 && m.b == 0 && m.c == 0 && m.d == 0) {
                return null;
            }
            var bounds = self.$getContentBounds();
            var localX = m.a * stageX + m.c * stageY + m.tx;
            var localY = m.b * stageX + m.d * stageY + m.ty;
            if (bounds.contains(localX, localY)) {
                if (!self.$children) {
                    var rect = self.$scrollRect ? self.$scrollRect : self.$maskRect;
                    if (rect && !rect.contains(localX, localY)) {
                        return null;
                    }
                    if (self.$mask && !self.$mask.$hitTest(stageX, stageY)) {
                        return null;
                    }
                }
                return self;
            }
            return null;
        };
        /**
         * @override
         */
        BKDisplayObject.prototype.$getRenderNode = function () {
            var self = this;
            // let node = self.$renderNode;
            var node = self._bkNode; // MD
            if (!node) {
                return null;
            }
            self._updateColor(); // MD
            if (self.$renderDirty) {
                // node.cleanBeforeRender(); // MD
                self.$updateRenderNode();
                self.$renderDirty = false;
                // node = self.$renderNode;
                node = self._bkNode; // MD
            }
            // MD
            if (self._transformDirty) {
                self._transformDirty = false;
                this._updateBKNodeMatrix();
            }
            return node;
        };
        /**
         * @override
         */
        BKDisplayObject.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            // MD
            var index = egret.BKPlayer.instance._displayList.indexOf(this);
            if (index < 0) {
                egret.BKPlayer.instance._displayList.push(this);
            }
        };
        /**
         * @override
         */
        BKDisplayObject.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            // MD
            var index = egret.BKPlayer.instance._displayList.indexOf(this);
            if (index >= 0) {
                egret.BKPlayer.instance._displayList.splice(index, 1);
            }
        };
        BKDisplayObject.prototype.invalidUpdate = function () {
            this.$getRenderNode();
        };
        return BKDisplayObject;
    }(egret.DisplayObject));
    egret.BKDisplayObject = BKDisplayObject;
    __reflect(BKDisplayObject.prototype, "egret.BKDisplayObject");
    if (window['renderMode'] != 'webgl') {
        egret.DisplayObject = egret.BKDisplayObject;
    }
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * The DisplayObjectContainer class is a basic display list building block: a display list node that can contain children.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/DisplayObjectContainer.ts
     * @language en_US
     */
    /**
     * DisplayObjectContainer 类是基本显示列表构造块：一个可包含子项的显示列表节点。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/DisplayObjectContainer.ts
     * @language zh_CN
     */
    var BKDisplayObjectContainer = (function (_super) {
        __extends(BKDisplayObjectContainer, _super);
        /**
         * Creates a new DisplayObjectContainer instance.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 实例化一个容器
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        function BKDisplayObjectContainer() {
            var _this = _super.call(this, new BK.ClipRectNode(0, 0, 2048, -2048)) || this;
            _this.$touchChildren = true;
            // super(new BK.Node())
            _this._bkClipRectNode = _this._bkNode;
            _this._bkClipRectNode.enableClip = false;
            _this.$children = [];
            return _this;
        }
        BKDisplayObjectContainer.prototype._updateBKNodeMatrix = function () {
            var matrix = this.$getMatrix();
            var bkMatrix = this._bkNode.transform.matrix;
            var tx = matrix.tx;
            var ty = matrix.ty;
            var pivotX = this.$anchorOffsetX;
            var pivotY = this.$anchorOffsetY;
            if (pivotX !== 0.0 || pivotY !== 0.0) {
                tx -= matrix.a * pivotX + matrix.c * pivotY;
                ty -= matrix.b * pivotX + matrix.d * pivotY;
            }
            if (this.$scrollRect) {
                tx -= this.$scrollRect.x;
                ty -= this.$scrollRect.y;
            }
            bkMatrix.set(matrix.a, -matrix.b, -matrix.c, matrix.d, tx, -ty);
        };
        Object.defineProperty(BKDisplayObjectContainer.prototype, "numChildren", {
            /**
             * Returns the number of children of this object.
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 返回此对象的子项数目。
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$children.length;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Adds a child DisplayObject instance to this DisplayObjectContainer instance. The child is added to the front
         * (top) of all other children in this DisplayObjectContainer instance. (To add a child to a specific index position,
         * use the addChildAt() method.)If you add a child object that already has a different display object container
         * as a parent, the object is removed from the child list of the other display object container.
         * @param child The DisplayObject instance to add as a child of this DisplayObjectContainer instance.
         * @returns 在 child The DisplayObject instance that you pass in the child parameter.
         * @see #addChildAt()
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 将一个 DisplayObject 子实例添加到该 DisplayObjectContainer 实例中。子项将被添加到该 DisplayObjectContainer 实例中其他
         * 所有子项的前（上）面。（要将某子项添加到特定索引位置，请使用 addChildAt() 方法。）
         * @param child 要作为该 DisplayObjectContainer 实例的子项添加的 DisplayObject 实例。
         * @returns 在 child 参数中传递的 DisplayObject 实例。
         * @see #addChildAt()
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        BKDisplayObjectContainer.prototype.addChild = function (child) {
            var index = this.$children.length;
            if (child.$parent == this)
                index--;
            return this.$doAddChild(child, index);
        };
        /**
         * Adds a child DisplayObject instance to this DisplayObjectContainer instance. The child is added at the index position
         * specified. An index of 0 represents the back (bottom) of the display list for this DisplayObjectContainer object.
         * If you add a child object that already has a different display object container as a parent, the object is removed
         * from the child list of the other display object container.
         * @param child The DisplayObject instance to add as a child of this DisplayObjectContainer instance.
         * @param index The index position to which the child is added. If you specify a currently occupied index position,
         * the child object that exists at that position and all higher positions are moved up one position in the child list.
         * @returns The DisplayObject instance that you pass in the child parameter.
         * @see #addChild()
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 将一个 DisplayObject 子实例添加到该 DisplayObjectContainer 实例中。该子项将被添加到指定的索引位置。索引为 0 表示该
         * DisplayObjectContainer 对象的显示列表的后（底）部。如果添加一个已将其它显示对象容器作为父项的子对象，则会从其它显示对象容器的子列表中删除该对象。
         * @param child 要作为该 DisplayObjectContainer 实例的子项添加的 DisplayObject 实例。
         * @param index 添加该子项的索引位置。 如果指定当前占用的索引位置，则该位置以及所有更高位置上的子对象会在子级列表中上移一个位置。
         * @returns 在 child 参数中传递的 DisplayObject 实例。
         * @see #addChild()
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        BKDisplayObjectContainer.prototype.addChildAt = function (child, index) {
            index = +index | 0;
            if (index < 0 || index >= this.$children.length) {
                index = this.$children.length;
                if (child.$parent == this) {
                    index--;
                }
            }
            return this.$doAddChild(child, index);
        };
        /**
         * @private
         */
        BKDisplayObjectContainer.prototype.$doAddChild = function (child, index, notifyListeners) {
            if (notifyListeners === void 0) { notifyListeners = true; }
            var self = this;
            if (true) {
                if (child == self) {
                    egret.$error(1005);
                }
                else if ((child instanceof egret.BKDisplayObjectContainer) && child.contains(self)) {
                    egret.$error(1004);
                }
            }
            var host = child.$parent; // MD
            if (host == self) {
                self.doSetChildIndex(child, index);
                return child;
            }
            if (host) {
                host.removeChild(child);
            }
            self.$children.splice(index, 0, child);
            child.$setParent(self);
            var stage = self.$stage;
            if (stage) {
                child.$onAddToStage(stage, self.$nestLevel + 1);
            }
            if (notifyListeners) {
                child.dispatchEventWith(egret.Event.ADDED, true);
            }
            if (stage) {
                var list = egret.DisplayObjectContainer.$EVENT_ADD_TO_STAGE_LIST;
                while (list.length) {
                    var childAddToStage = list.shift();
                    if (childAddToStage.$stage && notifyListeners) {
                        childAddToStage.dispatchEventWith(egret.Event.ADDED_TO_STAGE);
                    }
                }
            }
            // MD
            var childBKNode = child._bkNode;
            if (childBKNode.parent) {
                this._bkNode.addChild(childBKNode.parent, index);
            }
            else {
                this._bkNode.addChild(childBKNode, index);
            }
            for (var i = 0, l = this.$children.length; i < l; i++) {
                var childBKNode_1 = this.$children[i]._bkNode;
                var bkNodeParent = childBKNode_1.parent;
                if (bkNodeParent && bkNodeParent.parent === this._bkNode) {
                    bkNodeParent.zOrder = -i;
                }
                else {
                    childBKNode_1.zOrder = -i;
                }
            }
            this.$childAdded(child, index);
            return child;
        };
        /**
         * Determines whether the specified display object is a child of the DisplayObjectContainer instance or the instance
         * itself. The search includes the entire display list including this DisplayObjectContainer instance. Grandchildren,
         * great-grandchildren, and so on each return true.
         * @param child The child object to test.
         * @returns true if the child object is a child of the DisplayObjectContainer or the container itself; otherwise false.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 确定指定显示对象是 DisplayObjectContainer 实例的子项或该实例本身。搜索包括整个显示列表（其中包括此 DisplayObjectContainer 实例）。
         * 孙项、曾孙项等，每项都返回 true。
         * @param child 要测试的子对象。
         * @returns 如果 child 对象是 DisplayObjectContainer 的子项或容器本身，则为 true；否则为 false。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        BKDisplayObjectContainer.prototype.contains = function (child) {
            while (child) {
                if (child == this) {
                    return true;
                }
                child = child.$parent;
            }
            return false;
        };
        /**
         * Returns the child display object instance that exists at the specified index.
         * @param index The index position of the child object.
         * @returns The child display object at the specified index position.
         * @see #getChildByName()
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 返回位于指定索引处的子显示对象实例。
         * @param index 子对象的索引位置。
         * @returns 位于指定索引位置处的子显示对象。
         * @see #getChildByName()
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        BKDisplayObjectContainer.prototype.getChildAt = function (index) {
            index = +index | 0;
            if (index >= 0 && index < this.$children.length) {
                return this.$children[index];
            }
            else {
                true && egret.$error(1007);
                return null;
            }
        };
        /**
         * Returns the index position of a child DisplayObject instance.
         * @param child The DisplayObject instance to identify.
         * @returns The index position of the child display object to identify.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 返回 DisplayObject 的 child 实例的索引位置。
         * @param child 要测试的子对象。
         * @returns 要查找的子显示对象的索引位置。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        BKDisplayObjectContainer.prototype.getChildIndex = function (child) {
            return this.$children.indexOf(child);
        };
        /**
         * Returns the child display object that exists with the specified name. If more that one child display object has
         * the specified name, the method returns the first object in the child list.The getChildAt() method is faster than
         * the getChildByName() method. The getChildAt() method accesses a child from a cached array, whereas the getChildByName()
         * method has to traverse a linked list to access a child.
         * @param name The name of the child to return.
         * @returns The child display object with the specified name.
         * @see #getChildAt()
         * @see egret.DisplayObject#name
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 返回具有指定名称的子显示对象。如果多个子显示对象具有指定名称，则该方法会返回子级列表中的第一个对象。
         * getChildAt() 方法比 getChildByName() 方法快。getChildAt() 方法从缓存数组中访问子项，而 getChildByName() 方法则必须遍历链接的列表来访问子项。
         * @param name 要返回的子项的名称。
         * @returns 具有指定名称的子显示对象。
         * @see #getChildAt()
         * @see egret.DisplayObject#name
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        BKDisplayObjectContainer.prototype.getChildByName = function (name) {
            var children = this.$children;
            var length = children.length;
            var displayObject;
            for (var i = 0; i < length; i++) {
                displayObject = children[i];
                if (displayObject.name == name) {
                    return displayObject;
                }
            }
            return null;
        };
        /**
         * Removes the specified child DisplayObject instance from the child list of the DisplayObjectContainer instance.
         * The parent property of the removed child is set to null , and the object is garbage collected if no other references
         * to the child exist. The index positions of any display objects above the child in the DisplayObjectContainer are
         * decreased by 1.
         * @param child The DisplayObject instance to remove.
         * @returns The DisplayObject instance that you pass in the child parameter.
         * @see #removeChildAt()
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从 DisplayObjectContainer 实例的子列表中删除指定的 child DisplayObject 实例。将已删除子项的 parent 属性设置为 null；
         * 如果不存在对该子项的任何其它引用，则将该对象作为垃圾回收。DisplayObjectContainer 中该子项之上的任何显示对象的索引位置都减去 1。
         * @param child 要删除的 DisplayObject 实例。
         * @returns 在 child 参数中传递的 DisplayObject 实例。
         * @see #removeChildAt()
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        BKDisplayObjectContainer.prototype.removeChild = function (child) {
            var index = this.$children.indexOf(child);
            if (index >= 0) {
                return this.$doRemoveChild(index);
            }
            else {
                true && egret.$error(1006);
                return null;
            }
        };
        /**
         * Removes a child DisplayObject from the specified index position in the child list of the DisplayObjectContainer.
         * The parent property of the removed child is set to null, and the object is garbage collected if no other references
         * to the child exist. The index positions of any display objects above the child in the DisplayObjectContainer are decreased by 1.
         * @param index The child index of the DisplayObject to remove.
         * @returns The DisplayObject instance that was removed.
         * @see #removeChild()
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从 DisplayObjectContainer 的子列表中指定的 index 位置删除子 DisplayObject。将已删除子项的 parent 属性设置为 null；
         * 如果没有对该子项的任何其他引用，则将该对象作为垃圾回收。DisplayObjectContainer 中该子项之上的任何显示对象的索引位置都减去 1。
         * @param index 要删除的 DisplayObject 的子索引。
         * @returns 已删除的 DisplayObject 实例。
         * @see #removeChild()
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        BKDisplayObjectContainer.prototype.removeChildAt = function (index) {
            index = +index | 0;
            if (index >= 0 && index < this.$children.length) {
                return this.$doRemoveChild(index);
            }
            else {
                true && egret.$error(1007);
                return null;
            }
        };
        /**
         * @private
         */
        BKDisplayObjectContainer.prototype.$doRemoveChild = function (index, notifyListeners) {
            if (notifyListeners === void 0) { notifyListeners = true; }
            index = +index | 0;
            var self = this;
            var children = this.$children;
            var child = children[index];
            this.$childRemoved(child, index);
            if (notifyListeners) {
                child.dispatchEventWith(egret.Event.REMOVED, true);
            }
            if (this.$stage) {
                child.$onRemoveFromStage();
                var list = egret.DisplayObjectContainer.$EVENT_REMOVE_FROM_STAGE_LIST;
                while (list.length > 0) {
                    var childAddToStage = list.shift();
                    if (notifyListeners && childAddToStage.$hasAddToStage) {
                        childAddToStage.$hasAddToStage = false;
                        childAddToStage.dispatchEventWith(egret.Event.REMOVED_FROM_STAGE);
                    }
                    childAddToStage.$hasAddToStage = false;
                    childAddToStage.$stage = null;
                }
            }
            var displayList = this.$displayList || this.$parentDisplayList;
            child.$setParent(null);
            var indexNow = children.indexOf(child);
            if (indexNow != -1) {
                children.splice(indexNow, 1);
            }
            // MD
            var childBKNode = child._bkNode;
            if (childBKNode.parent) {
                childBKNode.parent.removeChild(childBKNode);
            }
            return child;
        };
        /**
         * Changes the position of an existing child in the display object container. This affects the layering of child objects.
         * @param child The child DisplayObject instance for which you want to change the index number.
         * @param index The resulting index number for the child display object.
         * @see #addChildAt()
         * @see #getChildAt()
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 更改现有子项在显示对象容器中的位置。这会影响子对象的分层。
         * @param child 要为其更改索引编号的 DisplayObject 子实例。
         * @param index 生成的 child 显示对象的索引编号。当新的索引编号小于0或大于已有子元件数量时，新加入的DisplayObject对象将会放置于最上层。
         * @see #addChildAt()
         * @see #getChildAt()
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        BKDisplayObjectContainer.prototype.setChildIndex = function (child, index) {
            index = +index | 0;
            if (index < 0 || index >= this.$children.length) {
                index = this.$children.length - 1;
            }
            this.doSetChildIndex(child, index);
        };
        /**
         * @private
         */
        BKDisplayObjectContainer.prototype.doSetChildIndex = function (child, index) {
            var self = this;
            var lastIndex = this.$children.indexOf(child);
            if (lastIndex < 0) {
                true && egret.$error(1006);
            }
            if (lastIndex == index) {
                return;
            }
            this.$childRemoved(child, lastIndex);
            //从原来的位置删除
            this.$children.splice(lastIndex, 1);
            //放到新的位置
            this.$children.splice(index, 0, child);
            this.$childAdded(child, index);
            // MD
            var childBKNode = child._bkNode;
            var bkNodeParent = childBKNode.parent; // 兼容有遮罩的情况.
            if (bkNodeParent) {
                bkNodeParent.removeChild(childBKNode);
                bkNodeParent.addChild(childBKNode, index);
            }
            else {
                // Never.
            }
            for (var i = 0, l = this.$children.length; i < l; i++) {
                var childBKNode_2 = this.$children[i]._bkNode;
                var bkNodeParent_1 = childBKNode_2.parent;
                if (bkNodeParent_1 && bkNodeParent_1.parent === this._bkNode) {
                    bkNodeParent_1.zOrder = -i;
                }
                else {
                    childBKNode_2.zOrder = -i;
                }
            }
        };
        /**
         * Swaps the z-order (front-to-back order) of the child objects at the two specified index positions in the child
         * list. All other child objects in the display object container remain in the same index positions.
         * @param index1 The index position of the first child object.
         * @param index2 The index position of the second child object.
         * @see #swapChildren()
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 在子级列表中两个指定的索引位置，交换子对象的 Z 轴顺序（前后顺序）。显示对象容器中所有其他子对象的索引位置保持不变。
         * @param index1 第一个子对象的索引位置。
         * @param index2 第二个子对象的索引位置。
         * @see #swapChildren()
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        BKDisplayObjectContainer.prototype.swapChildrenAt = function (index1, index2) {
            index1 = +index1 | 0;
            index2 = +index2 | 0;
            if (index1 >= 0 && index1 < this.$children.length && index2 >= 0 && index2 < this.$children.length) {
                this.doSwapChildrenAt(index1, index2);
            }
            else {
                true && egret.$error(1007);
            }
        };
        /**
         * Swaps the z-order (front-to-back order) of the two specified child objects. All other child objects in the
         * display object container remain in the same index positions.
         * @param child1 The first child object.
         * @param child2 The second child object.
         * @see #swapChildrenAt()
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 交换两个指定子对象的 Z 轴顺序（从前到后顺序）。显示对象容器中所有其他子对象的索引位置保持不变。
         * @param child1 第一个子对象。
         * @param child2 第二个子对象。
         * @see #swapChildrenAt()
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        BKDisplayObjectContainer.prototype.swapChildren = function (child1, child2) {
            var index1 = this.$children.indexOf(child1);
            var index2 = this.$children.indexOf(child2);
            if (index1 == -1 || index2 == -1) {
                true && egret.$error(1006);
            }
            else {
                this.doSwapChildrenAt(index1, index2);
            }
        };
        /**
         * @private
         */
        BKDisplayObjectContainer.prototype.doSwapChildrenAt = function (index1, index2) {
            var self = this;
            if (index1 > index2) {
                var temp = index2;
                index2 = index1;
                index1 = temp;
            }
            else if (index1 == index2) {
                return;
            }
            var list = this.$children;
            var child1 = list[index1];
            var child2 = list[index2];
            this.$childRemoved(child1, index1);
            this.$childRemoved(child2, index2);
            list[index1] = child2;
            list[index2] = child1;
            this.$childAdded(child2, index1);
            this.$childAdded(child1, index2);
            // MD
            var bkNode1 = child1._bkNode;
            var bkNode2 = child2._bkNode;
            if (bkNode1.parent === this._bkNode) {
                bkNode1.zOrder = -index2;
            }
            else {
                bkNode1.parent.zOrder = -index2; // 兼容有遮罩的情况.
            }
            if (bkNode2.parent === this._bkNode) {
                bkNode2.zOrder = -index1;
            }
            else {
                bkNode2.parent.zOrder = -index1; // 兼容有遮罩的情况.
            }
        };
        /**
         * Removes all child DisplayObject instances from the child list of the DisplayObjectContainer instance. The parent
         * property of the removed children is set to null , and the objects are garbage collected if no other references to the children exist.
         * @see #removeChild()
         * @see #removeChildAt()
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从 DisplayObjectContainer 实例的子级列表中删除所有 child DisplayObject 实例。
         * @see #removeChild()
         * @see #removeChildAt()
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        BKDisplayObjectContainer.prototype.removeChildren = function () {
            var children = this.$children;
            for (var i = children.length - 1; i >= 0; i--) {
                this.$doRemoveChild(i);
            }
        };
        /**
         * @private
         * 一个子项被添加到容器内，此方法不仅在操作addChild()时会被回调，在操作setChildIndex()或swapChildren时也会回调。
         * 当子项索引发生改变时，会先触发$childRemoved()方法，然后触发$childAdded()方法。
         */
        BKDisplayObjectContainer.prototype.$childAdded = function (child, index) {
        };
        /**
         * @private
         * 一个子项从容器内移除，此方法不仅在操作removeChild()时会被回调，在操作setChildIndex()或swapChildren时也会回调。
         * 当子项索引发生改变时，会先触发$childRemoved()方法，然后触发$childAdded()方法。
         */
        BKDisplayObjectContainer.prototype.$childRemoved = function (child, index) {
        };
        /**
         * @private
         */
        BKDisplayObjectContainer.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            var children = this.$children;
            var length = children.length;
            nestLevel++;
            for (var i = 0; i < length; i++) {
                var child = this.$children[i];
                child.$onAddToStage(stage, nestLevel);
            }
        };
        /**
         * @private
         *
         */
        BKDisplayObjectContainer.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            var children = this.$children;
            var length = children.length;
            for (var i = 0; i < length; i++) {
                var child = children[i];
                child.$onRemoveFromStage();
            }
        };
        /**
         * @private
         */
        BKDisplayObjectContainer.prototype.$measureChildBounds = function (bounds) {
            var children = this.$children;
            var length = children.length;
            if (length == 0) {
                return;
            }
            var xMin = 0, xMax = 0, yMin = 0, yMax = 0;
            var found = false;
            for (var i = -1; i < length; i++) {
                var childBounds = i == -1 ? bounds : children[i].$getTransformedBounds(this, egret.$TempRectangle);
                if (childBounds.isEmpty()) {
                    continue;
                }
                if (found) {
                    xMin = Math.min(xMin, childBounds.x);
                    xMax = Math.max(xMax, childBounds.x + childBounds.width);
                    yMin = Math.min(yMin, childBounds.y);
                    yMax = Math.max(yMax, childBounds.y + childBounds.height);
                }
                else {
                    found = true;
                    xMin = childBounds.x;
                    xMax = xMin + childBounds.width;
                    yMin = childBounds.y;
                    yMax = yMin + childBounds.height;
                }
            }
            bounds.setTo(xMin, yMin, xMax - xMin, yMax - yMin);
        };
        Object.defineProperty(BKDisplayObjectContainer.prototype, "touchChildren", {
            /**
             * Determines whether or not the children of the object are touch, or user input device, enabled. If an object is
             * enabled, a user can interact with it by using a touch or user input device.
             * @default true
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 确定对象的子级是否支持触摸或用户输入设备。如果对象支持触摸或用户输入设备，用户可以通过使用触摸或用户输入设备与之交互。
             * @default true
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$getTouchChildren();
            },
            set: function (value) {
                this.$setTouchChildren(!!value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         *
         * @returns
         */
        BKDisplayObjectContainer.prototype.$getTouchChildren = function () {
            return this.$touchChildren;
        };
        /**
         * @private
         */
        BKDisplayObjectContainer.prototype.$setTouchChildren = function (value) {
            if (this.$touchChildren == value) {
                return false;
            }
            this.$touchChildren = value;
            return true;
        };
        /**
         * @private
         */
        BKDisplayObjectContainer.prototype.$hitTest = function (stageX, stageY) {
            if (!this.$visible) {
                return null;
            }
            var m = this.$getInvertedConcatenatedMatrix();
            var localX = m.a * stageX + m.c * stageY + m.tx;
            var localY = m.b * stageX + m.d * stageY + m.ty;
            var rect = this.$scrollRect ? this.$scrollRect : this.$maskRect;
            if (rect && !rect.contains(localX, localY)) {
                return null;
            }
            if (this.$mask && !this.$mask.$hitTest(stageX, stageY)) {
                return null;
            }
            var children = this.$children;
            var found = false;
            var target = null;
            for (var i = children.length - 1; i >= 0; i--) {
                var child = children[i];
                if (child.$maskedObject) {
                    continue;
                }
                target = child.$hitTest(stageX, stageY);
                if (target) {
                    found = true;
                    if (target.$touchEnabled) {
                        break;
                    }
                    else {
                        target = null;
                    }
                }
            }
            if (target) {
                if (this.$touchChildren) {
                    return target;
                }
                return this;
            }
            if (found) {
                return this;
            }
            return _super.prototype.$hitTest.call(this, stageX, stageY);
        };
        BKDisplayObjectContainer.prototype.invalidUpdate = function () {
            for (var _i = 0, _a = this.$children; _i < _a.length; _i++) {
                var child = _a[_i];
                child.invalidUpdate();
            }
            this.$getRenderNode();
        };
        Object.defineProperty(BKDisplayObjectContainer.prototype, "scrollRect", {
            // MD
            set: function (value) {
                var self = this;
                if (!value && !self.$scrollRect) {
                    return;
                }
                this._transformDirty = true;
                if (value) {
                    if (!self.$scrollRect) {
                        self.$scrollRect = new egret.Rectangle();
                        this._bkClipRectNode.enableClip = true;
                    }
                    self.$scrollRect.copyFrom(value);
                    this._bkClipRectNode.clipRegion = {
                        x: self.$scrollRect.x,
                        y: -self.$scrollRect.y - self.$scrollRect.height,
                        width: self.$scrollRect.width,
                        height: self.$scrollRect.height
                    };
                }
                else {
                    self.$scrollRect = null;
                    this._bkClipRectNode.enableClip = false;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         */
        BKDisplayObjectContainer.$EVENT_ADD_TO_STAGE_LIST = [];
        /**
         * @private
         */
        BKDisplayObjectContainer.$EVENT_REMOVE_FROM_STAGE_LIST = [];
        return BKDisplayObjectContainer;
    }(egret.BKDisplayObject));
    egret.BKDisplayObjectContainer = BKDisplayObjectContainer;
    __reflect(BKDisplayObjectContainer.prototype, "egret.BKDisplayObjectContainer");
    // MD
    if (window['renderMode'] != 'webgl') {
        egret.DisplayObjectContainer = egret.BKDisplayObjectContainer;
    }
})(egret || (egret = {}));
var egret;
(function (egret) {
    var BKSprite9 = (function () {
        function BKSprite9() {
            /**
             * 贴图实际宽度
             */
            this._contentWidth = 0;
            /**
             * 贴图实际高度
             */
            this._contentHeight = 0;
            /**
             * 逻辑大小
             */
            this._size = { width: 0.0, height: 0.0 };
            this._rawGrid = new egret.Rectangle();
            /**
             * x y 描述左上角size，width height 描述右下角size
             */
            this._grid = new egret.Rectangle();
            this._leftTop = new BK.Sprite(0, 0, {}, 0, 1, 1, 1);
            this._centerTop = new BK.Sprite(0, 0, {}, 0, 1, 1, 1);
            this._rightTop = new BK.Sprite(0, 0, {}, 0, 1, 1, 1);
            this._leftCenter = new BK.Sprite(0, 0, {}, 0, 1, 1, 1);
            this._centerCenter = new BK.Sprite(0, 0, {}, 0, 1, 1, 1);
            this._rightCenter = new BK.Sprite(0, 0, {}, 0, 1, 1, 1);
            this._leftBottom = new BK.Sprite(0, 0, {}, 0, 1, 1, 1);
            this._centerBottom = new BK.Sprite(0, 0, {}, 0, 1, 1, 1);
            this._rightBottom = new BK.Sprite(0, 0, {}, 0, 1, 1, 1);
            this.__nativeObj = new BK.Node();
            //
            egret.defineProxyProperties(this.__nativeObj, this);
            this.__nativeObj.addChild(this._leftTop);
            this.__nativeObj.addChild(this._centerTop);
            this.__nativeObj.addChild(this._rightTop);
            this.__nativeObj.addChild(this._leftCenter);
            this.__nativeObj.addChild(this._centerCenter);
            this.__nativeObj.addChild(this._rightCenter);
            this.__nativeObj.addChild(this._leftBottom);
            this.__nativeObj.addChild(this._centerBottom);
            this.__nativeObj.addChild(this._rightBottom);
        }
        /**
         * 根据传入的Rectangle的大小得到9点位置数据
         */
        BKSprite9.prototype._updateGrid = function () {
            /**
             * _rawGrid为逻辑大小，用逻辑大小进行运算
             */
            this._grid.x = this._rawGrid.x;
            this._grid.y = this._rawGrid.y;
            this._grid.width = this._contentWidth - this._rawGrid.x - this._rawGrid.width;
            this._grid.height = this._contentHeight - this._rawGrid.y - this._rawGrid.height;
        };
        BKSprite9.prototype.dispose = function () {
            this.__nativeObj.dispose();
        };
        BKSprite9.prototype.setTexture = function (value) {
            this._leftTop.setTexture(value);
            this._centerTop.setTexture(value);
            this._rightTop.setTexture(value);
            this._leftCenter.setTexture(value);
            this._centerCenter.setTexture(value);
            this._rightCenter.setTexture(value);
            this._leftBottom.setTexture(value);
            this._centerBottom.setTexture(value);
            this._rightBottom.setTexture(value);
        };
        BKSprite9.prototype.setScale9Grid = function (value) {
            this._rawGrid.setTo(value.x, value.y, value.width, value.height);
            this._updateGrid();
        };
        BKSprite9.prototype.adjustTexturePosition = function (offsetX, offsetY, _textureWidth, _textureHeight, rotated) {
            this._contentWidth = _textureWidth;
            this._contentHeight = _textureHeight;
            this.offsetX = offsetX;
            this.offsetY = offsetY;
            this.rotated = rotated;
            this._updateGrid();
            /**
             * 此时_grid xy表示左上小方块宽高，width和height表示右下角宽高，content表示贴图九宫大小
             * 下面是相对于贴图的大小的9点size
             */
            var ltW = this._grid.x;
            var ltH = this._grid.y;
            var rbW = this._grid.width;
            var rbH = this._grid.height;
            var centerWidth = this._contentWidth - ltW - rbW;
            var centerHeight = this._contentHeight - ltH - rbH;
            if (rotated === true) {
                // TODO
            }
            else {
                /**
                 * offset是相对于贴图的，ltw等数据需要相对于宽高作出变化
                 */
                var x1 = offsetX;
                var x2 = offsetX + ltW;
                var x3 = offsetX + (_textureWidth - rbW);
                var y1 = offsetY;
                var y2 = offsetY + rbH;
                var y3 = offsetY + (_textureHeight - ltH);
                this._leftTop.adjustTexturePosition(x1, y3, ltW, ltH);
                this._centerTop.adjustTexturePosition(x2, y3, centerWidth, ltH);
                this._rightTop.adjustTexturePosition(x3, y3, rbW, ltH);
                this._leftCenter.adjustTexturePosition(x1, y2, ltW, centerHeight);
                this._centerCenter.adjustTexturePosition(x2, y2, centerWidth, centerHeight);
                this._rightCenter.adjustTexturePosition(x3, y2, rbW, centerHeight);
                this._leftBottom.adjustTexturePosition(x1, y1, ltW, rbH);
                this._centerBottom.adjustTexturePosition(x2, y1, centerWidth, rbH);
                this._rightBottom.adjustTexturePosition(x3, y1, rbW, rbH);
            }
        };
        Object.defineProperty(BKSprite9.prototype, "size", {
            get: function () {
                return this._size;
            },
            set: function (value) {
                this._size.width = value.width;
                this._size.height = value.height;
                this._updateGrid();
                var ltW = this._grid.x;
                var ltH = this._grid.y;
                var rbW = this._grid.width;
                var rbH = this._grid.height;
                if (this._size.width < ltW + rbW && this._size.width !== 0) {
                    ltW = this._size.width * ltW / (this._contentWidth);
                    rbW = this._size.width * rbW / (this._contentWidth);
                }
                if (this._size.height < ltH + rbH && this._size.height !== 0) {
                    ltH = this._size.height * ltH / (this._contentHeight);
                    rbH = this._size.height * rbH / (this._contentHeight);
                }
                var offsetX = 1;
                var offsetY = 1;
                var centerWidth = this._size.width - ltW - rbW;
                var centerHeight = this._size.height - ltH - rbH;
                this._leftTop.position = { x: 0.0, y: rbH + centerHeight };
                this._centerTop.position = { x: ltW, y: rbH + centerHeight };
                this._rightTop.position = { x: ltW + centerWidth, y: rbH + centerHeight };
                this._leftCenter.position = { x: 0.0, y: rbH };
                this._centerCenter.position = { x: ltW, y: rbH };
                this._rightCenter.position = { x: ltW + centerWidth, y: rbH };
                this._leftBottom.position = { x: 0.0, y: 0.0 };
                this._centerBottom.position = { x: ltW, y: 0.0 };
                this._rightBottom.position = { x: ltW + centerWidth, y: 0.0 };
                this._leftTop.size = { width: ltW + offsetX, height: ltH };
                this._centerTop.size = { width: centerWidth + offsetX, height: ltH };
                this._rightTop.size = { width: rbW, height: ltH };
                this._leftCenter.size = { width: ltW + offsetX, height: centerHeight + offsetY };
                this._centerCenter.size = { width: centerWidth + offsetX, height: centerHeight + offsetY };
                this._rightCenter.size = { width: rbW, height: centerHeight + offsetY };
                this._leftBottom.size = { width: ltW + offsetX, height: rbH + offsetY };
                this._centerBottom.size = { width: centerWidth + offsetX, height: rbH + offsetY };
                this._rightBottom.size = { width: rbW, height: rbH + offsetY };
                // this.adjustTexturePosition(this.offsetX, this.offsetY, this._contentWidth, this._contentHeight, this.rotated);
            },
            enumerable: true,
            configurable: true
        });
        return BKSprite9;
    }());
    egret.BKSprite9 = BKSprite9;
    __reflect(BKSprite9.prototype, "egret.BKSprite9");
})(egret || (egret = {}));
var egret;
(function (egret) {
    var BKBitmapData = (function (_super) {
        __extends(BKBitmapData, _super);
        function BKBitmapData(source, isFlip) {
            if (isFlip === void 0) { isFlip = false; }
            var _this = _super.call(this) || this;
            _this.width = 0;
            _this.height = 0;
            _this.source = ""; // url 或 render node
            _this.bkTexture = null;
            _this.source = source;
            _this.isFlip = isFlip;
            if (typeof _this.source === "string") {
                _this.bkTexture = new BK.Texture(_this.source);
            }
            else {
                _this.bkTexture = _this.source;
            }
            _this.width = _this.bkTexture.size.width;
            _this.height = _this.bkTexture.size.height;
            return _this;
        }
        BKBitmapData.$invalidate = function () {
        };
        BKBitmapData.prototype.$dispose = function () {
        };
        return BKBitmapData;
    }(egret.HashObject));
    egret.BKBitmapData = BKBitmapData;
    __reflect(BKBitmapData.prototype, "egret.BKBitmapData");
    if (window['renderMode'] != 'webgl') {
        egret.BitmapData = egret.BKBitmapData;
    }
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
//
console = console || {};
console.warn = console.log = function () {
    var others = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        others[_i] = arguments[_i];
    }
    var str = "";
    if (others) {
        for (var _a = 0, others_1 = others; _a < others_1.length; _a++) {
            var other = others_1[_a];
            str += " " + other;
        }
    }
    /**
     * BK.Script.log
     * 第一个参数为测试级别，0为debug级别，发布版本不输出。1为关键级别，可在发布版本输出（手Q环境）
     */
    BK.Script.log(1, 0, str);
};
console.assert = function (c) {
    var others = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        others[_i - 1] = arguments[_i];
    }
    if (!c) {
        console.log.apply(null, others);
    }
};
var egret;
(function (egret) {
    egret.getTimer = function getTimer() {
        return Math.round(BK.Time.timestamp * 1000);
    };
    //BK的setTimeout与egret的setTimeout处理方法不同，
    //egret通过key值索引找到listener然后将其清除，
    //BK则是直接清除对象Object绑定的所有listener
    //暂时完全按照BK的方法执行
    /**
     * @private
     */
    function setTimeout(listener, thisObject, delay) {
        BK.Director.ticker.setTimeout(listener, delay, thisObject);
    }
    egret.setTimeout = setTimeout;
    /**
     * @private
     */
    function clearTimeout(object) {
        BK.Director.ticker.removeTimeout(object);
    }
    egret.clearTimeout = clearTimeout;
    var isRunning = false;
    var player;
    var webPlayer;
    /**
     * @private
     * 网页加载完成，实例化页面中定义的Egret标签
     */
    function runEgret(options) {
        if (isRunning) {
            return;
        }
        isRunning = true;
        if (!options) {
            options = {};
        }
        modifyBricks();
        var renderMode = options.renderMode;
        if (renderMode == "webgl") {
            modifyEgretToBKWebgl(options);
        }
        else {
            modifyEgretToBricks(options);
        }
    }
    function modifyBricks() {
    }
    /**
     * 将当前渲染模式变为BK原生
     */
    function modifyEgretToBricks(options) {
        /**
         * 为贴合BK原生方法，对eui部分方法进行修改
         */
        if (typeof eui !== "undefined") {
            Object.defineProperty(eui.Image.prototype, "scale9Grid", {
                set: function (value) {
                    this.$setScale9Grid(value);
                    this.invalidateDisplayList();
                },
                enumerable: true,
                configurable: true
            });
            /**
             * eui.Image 方法修改
             */
            eui.Image.prototype.$updateRenderNode = function () {
                var image = this.$bitmapData;
                if (!image) {
                    return null;
                }
                var uiValues = this.$UIComponent;
                var width = uiValues[10 /* width */];
                var height = uiValues[11 /* height */];
                if (width === 0 || height === 0) {
                    return null;
                }
                this._size.width = this.$getWidth();
                this._size.height = this.$getHeight();
                this._bkSprite.size = this._size;
            };
        }
        /**
         * 读取websocket
         */
        if (typeof egret.WebSocket !== undefined) {
            egret.ISocket = egret.BKSocket;
        }
        if (options.screenAdapter) {
            egret.sys.screenAdapter = options.screenAdapter;
        }
        else if (!egret.sys.screenAdapter) {
            egret.sys.screenAdapter = new egret.sys.DefaultScreenAdapter();
        }
        egret.sys.systemRenderer = new egret.BKSystemRenderer();
        egret.sys.canvasRenderer = new egret.BKSystemRenderer();
        player = new egret.BKPlayer(options);
    }
    /**
     * 将当前渲染模式变为BK-Webgl模式
     */
    function modifyEgretToBKWebgl(options) {
        // WebGL上下文参数自定义
        if (options.renderMode == "webgl") {
            // WebGL抗锯齿默认关闭，提升PC及某些平台性能
            var antialias = options.antialias;
            egret.web.WebGLRenderContext.antialias = !!antialias;
        }
        /**
         * 没有canvasbuffer
         */
        egret.sys.CanvasRenderBuffer = egret.web.CanvasRenderBuffer;
        setRenderMode(options.renderMode);
        var canvasScaleFactor;
        if (options.canvasScaleFactor) {
            canvasScaleFactor = options.canvasScaleFactor;
        }
        else if (options.calculateCanvasScaleFactor) {
            canvasScaleFactor = options.calculateCanvasScaleFactor(egret.sys.canvasHitTestBuffer.context);
        }
        else {
            //based on : https://github.com/jondavidjohn/hidpi-canvas-polyfill
            var context = egret.sys.canvasHitTestBuffer.context;
            var backingStore = context.backingStorePixelRatio ||
                context.webkitBackingStorePixelRatio ||
                context.mozBackingStorePixelRatio ||
                context.msBackingStorePixelRatio ||
                context.oBackingStorePixelRatio ||
                context.backingStorePixelRatio || 1;
            canvasScaleFactor = (window.devicePixelRatio || 1) / backingStore;
        }
        egret.sys.DisplayList.$canvasScaleFactor = canvasScaleFactor;
        var ticker = egret.ticker;
        startTicker(ticker);
        if (options.screenAdapter) {
            egret.sys.screenAdapter = options.screenAdapter;
        }
        else if (!egret.sys.screenAdapter) {
            egret.sys.screenAdapter = new egret.sys.DefaultScreenAdapter();
        }
        webPlayer = new egret.web.BKWebPlayer(options);
    }
    /**
     * 设置渲染模式。"auto","webgl","canvas"
     * @param renderMode
     */
    function setRenderMode(renderMode) {
        if (renderMode == "webgl") {
            egret.sys.RenderBuffer = egret.web.WebGLRenderBuffer;
            egret.sys.systemRenderer = new egret.web.WebGLRenderer();
            egret.sys.canvasRenderer = new egret.CanvasRenderer();
            egret.sys.customHitTestBuffer = new egret.web.WebGLRenderBuffer(3, 3);
            egret.sys.canvasHitTestBuffer = new egret.web.CanvasRenderBuffer(3, 3);
            egret.Capabilities["renderMode" + ""] = "webgl";
        }
    }
    /**
     * @private
     * 启动心跳计时器。
     */
    function startTicker(ticker) {
        BK.Director.ticker.interval = 1;
        BK.Director.ticker.add(function (ts, duration) {
            ticker.update();
        });
    }
    egret.runEgret = runEgret;
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * Bitmap font adopts the Bitmap+SpriteSheet mode to render text.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/text/BitmapText.ts
     * @language en_US
     */
    /**
     * 位图字体采用了Bitmap+SpriteSheet的方式来渲染文字。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/text/BitmapText.ts
     * @language zh_CN
     */
    var BKBitmapText = (function (_super) {
        __extends(BKBitmapText, _super);
        /**
         * Create an egret.BitmapText object
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建一个 egret.BitmapText 对象
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        function BKBitmapText() {
            var _this = _super.call(this) || this;
            _this.$smoothing = egret.Bitmap.defaultSmoothing;
            _this.$text = "";
            _this.$textFieldWidth = NaN;
            _this.$textLinesChanged = false;
            _this.$textFieldHeight = NaN;
            _this.$font = null;
            _this.$fontStringChanged = false;
            _this.$lineSpacing = 0;
            _this.$letterSpacing = 0;
            _this.$textAlign = egret.HorizontalAlign.LEFT;
            _this.$verticalAlign = egret.VerticalAlign.TOP;
            _this.$textWidth = NaN;
            _this.$textHeight = NaN;
            /**
             * @private
             */
            _this.$textOffsetX = 0;
            /**
             * @private
             */
            _this.$textOffsetY = 0;
            /**
             * @private
             */
            _this.$textStartX = 0;
            /**
             * @private
             */
            _this.$textStartY = 0;
            /**
             * @private
             */
            _this.$lineHeights = [];
            // MD
            _this._bkNodes = [];
            return _this;
            // if (!egret.nativeRender) {
            //     this.$renderNode = new sys.BitmapNode();
            // }
        }
        BKBitmapText.prototype.createNativeDisplayObject = function () {
            // this.$nativeDisplayObject = new egret_native.NativeDisplayObject(egret_native.NativeObjectType.BITMAP_TEXT);
        };
        Object.defineProperty(BKBitmapText.prototype, "smoothing", {
            /**
             * Whether or not is smoothed when scaled.
             * @default true。
             * @version Egret 3.0
             * @platform Web
             * @language en_US
             */
            /**
             * 控制在缩放时是否进行平滑处理。
             * @default true。
             * @version Egret 3.0
             * @platform Web
             * @language zh_CN
             */
            get: function () {
                return this.$smoothing;
            },
            set: function (value) {
                var self = this;
                if (value == self.$smoothing) {
                    return;
                }
                self.$smoothing = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKBitmapText.prototype, "text", {
            /**
             * A string to display in the text field.
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 要显示的文本内容
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$text;
            },
            set: function (value) {
                this.$setText(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         */
        BKBitmapText.prototype.$setText = function (value) {
            if (value == null) {
                value = "";
            }
            var self = this;
            if (value == self.$text)
                return false;
            self.$text = value;
            self.$invalidateContentBounds();
            return true;
        };
        /**
         * @private
         */
        BKBitmapText.prototype.$getWidth = function () {
            var self = this;
            var w = self.$textFieldWidth;
            return isNaN(w) ? self.$getContentBounds().width : w;
        };
        /**
         * @private
         */
        BKBitmapText.prototype.$setWidth = function (value) {
            var self = this;
            if (value < 0 || value == self.$textFieldWidth) {
                return false;
            }
            self.$textFieldWidth = value;
            self.$invalidateContentBounds();
            return true;
        };
        /**
         * @private
         */
        BKBitmapText.prototype.$invalidateContentBounds = function () {
            this.$renderDirty = true;
            this.$textLinesChanged = true;
            //todo lcj
            this.$updateRenderNode();
        };
        /**
         * @private
         */
        BKBitmapText.prototype.$getHeight = function () {
            var self = this;
            var h = self.$textFieldHeight;
            return isNaN(h) ? self.$getContentBounds().height : h;
        };
        /**
         * @private
         */
        BKBitmapText.prototype.$setHeight = function (value) {
            var self = this;
            if (value < 0 || value == self.$textFieldHeight) {
                return false;
            }
            self.$textFieldHeight = value;
            self.$invalidateContentBounds();
            return true;
        };
        Object.defineProperty(BKBitmapText.prototype, "font", {
            /**
             * The name of the font to use, or a comma-separated list of font names, the type of value must be BitmapFont.
             * @default null
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 要使用的字体的名称或用逗号分隔的字体名称列表，类型必须是 BitmapFont。
             * @default null
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$font;
            },
            set: function (value) {
                this.$setFont(value);
            },
            enumerable: true,
            configurable: true
        });
        BKBitmapText.prototype.$setFont = function (value) {
            var self = this;
            if (self.$font == value) {
                return false;
            }
            self.$font = value;
            self.$fontStringChanged = true;
            this.$invalidateContentBounds();
            return true;
        };
        Object.defineProperty(BKBitmapText.prototype, "lineSpacing", {
            /**
             /**
             * An integer representing the amount of vertical space between lines.
             * @default 0
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 一个整数，表示行与行之间的垂直间距量
             * @default 0
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$lineSpacing;
            },
            set: function (value) {
                this.$setLineSpacing(value);
            },
            enumerable: true,
            configurable: true
        });
        BKBitmapText.prototype.$setLineSpacing = function (value) {
            var self = this;
            if (self.$lineSpacing == value)
                return false;
            self.$lineSpacing = value;
            self.$invalidateContentBounds();
            return true;
        };
        Object.defineProperty(BKBitmapText.prototype, "letterSpacing", {
            /**
             * An integer representing the amount of distance between characters.
             * @default 0
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 一个整数，表示字符之间的距离。
             * @default 0
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$letterSpacing;
            },
            set: function (value) {
                this.$setLetterSpacing(value);
            },
            enumerable: true,
            configurable: true
        });
        BKBitmapText.prototype.$setLetterSpacing = function (value) {
            var self = this;
            if (self.$letterSpacing == value) {
                return false;
            }
            self.$letterSpacing = value;
            self.$invalidateContentBounds();
            return true;
        };
        Object.defineProperty(BKBitmapText.prototype, "textAlign", {
            /**
             * Horizontal alignment of text.
             * @default：egret.HorizontalAlign.LEFT
             * @version Egret 2.5.6
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 文本的水平对齐方式。
             * @default：egret.HorizontalAlign.LEFT
             * @version Egret 2.5.6
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$textAlign;
            },
            set: function (value) {
                this.$setTextAlign(value);
            },
            enumerable: true,
            configurable: true
        });
        BKBitmapText.prototype.$setTextAlign = function (value) {
            var self = this;
            if (self.$textAlign == value) {
                return false;
            }
            self.$textAlign = value;
            self.$invalidateContentBounds();
            return true;
        };
        Object.defineProperty(BKBitmapText.prototype, "verticalAlign", {
            /**
             * Vertical alignment of text.
             * @default：egret.VerticalAlign.TOP
             * @version Egret 2.5.6
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 文字的垂直对齐方式。
             * @default：egret.VerticalAlign.TOP
             * @version Egret 2.5.6
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$verticalAlign;
            },
            set: function (value) {
                this.$setVerticalAlign(value);
            },
            enumerable: true,
            configurable: true
        });
        BKBitmapText.prototype.$setVerticalAlign = function (value) {
            var self = this;
            if (self.$verticalAlign == value) {
                return false;
            }
            self.$verticalAlign = value;
            self.$invalidateContentBounds();
            return true;
        };
        /**
         * @private
         */
        BKBitmapText.prototype.$updateRenderNode = function () {
            var self = this;
            var textLines = this.$getTextLines();
            var length = textLines.length;
            if (length == 0) {
                return;
            }
            var drawArr = [];
            var textLinesWidth = this.$textLinesWidth;
            var bitmapFont = self.$font;
            // let node // MD
            // if (!egret.nativeRender) {
            //     node = <sys.BitmapNode>this.$renderNode;
            //     if (bitmapFont.$texture) {
            //         node.image = bitmapFont.$texture.$bitmapData;
            //     }
            //     node.smoothing = self.$smoothing;
            // }
            var nodeCount = 0;
            var emptyHeight = bitmapFont._getFirstCharHeight();
            var emptyWidth = Math.ceil(emptyHeight * egret.BitmapText.EMPTY_FACTOR);
            var hasSetHeight = !isNaN(self.$textFieldHeight);
            var textWidth = self.$textWidth;
            var textFieldWidth = self.$textFieldWidth;
            var textFieldHeight = self.$textFieldHeight;
            var align = self.$textAlign;
            var yPos = this.$textOffsetY + this.$textStartY;
            var lineHeights = this.$lineHeights;
            for (var i = 0; i < length; i++) {
                var lineHeight = lineHeights[i];
                if (hasSetHeight && i > 0 && yPos + lineHeight > textFieldHeight) {
                    break;
                }
                var line = textLines[i];
                var len = line.length;
                var xPos = this.$textOffsetX;
                if (align != egret.HorizontalAlign.LEFT) {
                    var countWidth = textFieldWidth > textWidth ? textFieldWidth : textWidth;
                    if (align == egret.HorizontalAlign.RIGHT) {
                        xPos += countWidth - textLinesWidth[i];
                    }
                    else if (align == egret.HorizontalAlign.CENTER) {
                        xPos += Math.floor((countWidth - textLinesWidth[i]) / 2);
                    }
                }
                for (var j = 0; j < len; j++) {
                    var character = line.charAt(j);
                    var texture = bitmapFont.getTexture(character);
                    if (!texture) {
                        if (character == " ") {
                            xPos += emptyWidth;
                        }
                        else {
                            egret.$warn(1046, character);
                        }
                        continue;
                    }
                    var bitmapWidth = texture.$bitmapWidth;
                    var bitmapHeight = texture.$bitmapHeight;
                    // if (egret.nativeRender) { // MD
                    //     drawArr.push(texture.$bitmapX, texture.$bitmapY,
                    //         bitmapWidth, bitmapHeight, xPos + texture.$offsetX, yPos + texture.$offsetY,
                    //         texture.$getScaleBitmapWidth(), texture.$getScaleBitmapHeight(),
                    //         texture.$sourceWidth, texture.$sourceHeight);
                    // }
                    // else {
                    //     node.imageWidth = texture.$sourceWidth;
                    //     node.imageHeight = texture.$sourceHeight;
                    //     node.drawImage(texture.$bitmapX, texture.$bitmapY,
                    //         bitmapWidth, bitmapHeight, xPos + texture.$offsetX, yPos + texture.$offsetY,
                    //         texture.$getScaleBitmapWidth(), texture.$getScaleBitmapHeight());
                    // }
                    var bkNode = void 0;
                    if (nodeCount < this._bkNodes.length) {
                        bkNode = this._bkNodes[nodeCount];
                    }
                    else {
                        bkNode = createSpriteNode();
                        this._bkNodes[nodeCount] = bkNode;
                        this._bkNode.addChild(bkNode);
                    }
                    bkNode.setTexture(texture.$bitmapData.bkTexture);
                    bkNode.adjustTexturePosition(texture.$bitmapX, texture.$sourceHeight - (texture.$bitmapY + texture.$bitmapHeight), texture.$bitmapWidth, texture.$bitmapHeight, texture.$rotated);
                    bkNode.size = { width: texture.$bitmapWidth, height: texture.$bitmapHeight };
                    bkNode.position = { x: xPos, y: -yPos - bitmapHeight };
                    nodeCount++;
                    xPos += (bitmapFont.getConfig(character, "xadvance") || texture.$getTextureWidth()) + self.$letterSpacing;
                }
                yPos += lineHeight + self.$lineSpacing;
            }
            // if (egret.nativeRender) { // MD
            //     self.$nativeDisplayObject.setDataToBitmapNode(self.$nativeDisplayObject.id, bitmapFont.$texture, drawArr);
            //     let bounds = self.$getContentBounds();
            //     self.$nativeDisplayObject.setWidth(bounds.width);
            //     self.$nativeDisplayObject.setHeight(bounds.height);
            // }
            // MD 移除多余的节点
            for (var i = nodeCount; i < this._bkNodes.length; ++i) {
                var bkNode = this._bkNodes[i];
                bkSpriteNodes.push(bkNode);
                this._bkNode.removeChild(bkNode);
            }
            this._bkNodes.length = nodeCount;
        };
        /**
         * @private
         */
        BKBitmapText.prototype.$measureContentBounds = function (bounds) {
            var lines = this.$getTextLines();
            if (lines.length == 0) {
                bounds.setEmpty();
            }
            else {
                bounds.setTo(this.$textOffsetX + this.$textStartX, this.$textOffsetY + this.$textStartY, this.$textWidth - this.$textOffsetX, this.$textHeight - this.$textOffsetY);
            }
        };
        Object.defineProperty(BKBitmapText.prototype, "textWidth", {
            /**
             * Get the BitmapText measured width
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 获取位图文本测量宽度
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                this.$getTextLines();
                return this.$textWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKBitmapText.prototype, "textHeight", {
            /**
             * Get Text BitmapText height
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 获取位图文本测量高度
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                this.$getTextLines();
                return this.$textHeight;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         *
         * @returns
         */
        BKBitmapText.prototype.$getTextLines = function () {
            var self = this;
            if (!self.$textLinesChanged) {
                return self.textLines;
            }
            var textLines = [];
            self.textLines = textLines;
            var textLinesWidth = [];
            self.$textLinesWidth = textLinesWidth;
            self.$textLinesChanged = false;
            var lineHeights = [];
            self.$lineHeights = lineHeights;
            if (!self.$text || !self.$font) {
                self.$textWidth = 0;
                self.$textHeight = 0;
                return textLines;
            }
            var lineSpacing = self.$lineSpacing;
            var letterSpacing = self.$letterSpacing;
            var textWidth = 0;
            var textHeight = 0;
            var textOffsetX = 0;
            var textOffsetY = 0;
            var hasWidthSet = !isNaN(self.$textFieldWidth);
            var textFieldWidth = self.$textFieldWidth;
            var textFieldHeight = self.$textFieldHeight;
            var bitmapFont = self.$font;
            var emptyHeight = bitmapFont._getFirstCharHeight();
            var emptyWidth = Math.ceil(emptyHeight * egret.BitmapText.EMPTY_FACTOR);
            var text = self.$text;
            var textArr = text.split(/(?:\r\n|\r|\n)/);
            var length = textArr.length;
            var isFirstLine = true;
            var isFirstChar;
            var isLastChar;
            var lineHeight;
            var xPos;
            for (var i = 0; i < length; i++) {
                var line = textArr[i];
                var len = line.length;
                lineHeight = 0;
                xPos = 0;
                isFirstChar = true;
                isLastChar = false;
                for (var j = 0; j < len; j++) {
                    if (!isFirstChar) {
                        xPos += letterSpacing;
                    }
                    var character = line.charAt(j);
                    var texureWidth = void 0;
                    var textureHeight = void 0;
                    var offsetX = 0;
                    var offsetY = 0;
                    var texture = bitmapFont.getTexture(character);
                    if (!texture) {
                        if (character == " ") {
                            texureWidth = emptyWidth;
                            textureHeight = emptyHeight;
                        }
                        else {
                            egret.$warn(1046, character);
                            if (isFirstChar) {
                                isFirstChar = false;
                            }
                            continue;
                        }
                    }
                    else {
                        texureWidth = texture.$getTextureWidth();
                        textureHeight = texture.$getTextureHeight();
                        offsetX = texture.$offsetX;
                        offsetY = texture.$offsetY;
                    }
                    if (isFirstChar) {
                        isFirstChar = false;
                        textOffsetX = Math.min(offsetX, textOffsetX);
                    }
                    if (isFirstLine) {
                        isFirstLine = false;
                        textOffsetY = Math.min(offsetY, textOffsetY);
                    }
                    if (hasWidthSet && j > 0 && xPos + texureWidth > textFieldWidth) {
                        if (!setLineData(line.substring(0, j)))
                            break;
                        line = line.substring(j);
                        len = line.length;
                        j = 0;
                        //最后一个字符要计算纹理宽度，而不是xadvance
                        if (j == len - 1) {
                            xPos = texureWidth;
                        }
                        else {
                            xPos = bitmapFont.getConfig(character, "xadvance") || texureWidth;
                        }
                        lineHeight = textureHeight;
                        continue;
                    }
                    //最后一个字符要计算纹理宽度，而不是xadvance
                    if (j == len - 1) {
                        xPos += texureWidth;
                    }
                    else {
                        xPos += bitmapFont.getConfig(character, "xadvance") || texureWidth;
                    }
                    lineHeight = Math.max(textureHeight, lineHeight);
                }
                if (textFieldHeight && i > 0 && textHeight > textFieldHeight) {
                    break;
                }
                isLastChar = true;
                if (!setLineData(line))
                    break;
            }
            function setLineData(str) {
                if (textFieldHeight && textLines.length > 0 && textHeight > textFieldHeight) {
                    return false;
                }
                textHeight += lineHeight + lineSpacing;
                if (!isFirstChar && !isLastChar) {
                    xPos -= letterSpacing;
                }
                textLines.push(str);
                lineHeights.push(lineHeight);
                textLinesWidth.push(xPos);
                textWidth = Math.max(xPos, textWidth);
                return true;
            }
            textHeight -= lineSpacing;
            self.$textWidth = textWidth;
            self.$textHeight = textHeight;
            this.$textOffsetX = textOffsetX;
            this.$textOffsetY = textOffsetY;
            this.$textStartX = 0;
            this.$textStartY = 0;
            var alignType;
            if (textFieldWidth > textWidth) {
                alignType = self.$textAlign;
                if (alignType == egret.HorizontalAlign.RIGHT) {
                    this.$textStartX = textFieldWidth - textWidth;
                }
                else if (alignType == egret.HorizontalAlign.CENTER) {
                    this.$textStartX = Math.floor((textFieldWidth - textWidth) / 2);
                }
            }
            if (textFieldHeight > textHeight) {
                alignType = self.$verticalAlign;
                if (alignType == egret.VerticalAlign.BOTTOM) {
                    this.$textStartY = textFieldHeight - textHeight;
                }
                else if (alignType == egret.VerticalAlign.MIDDLE) {
                    this.$textStartY = Math.floor((textFieldHeight - textHeight) / 2);
                }
            }
            return textLines;
        };
        BKBitmapText.prototype._updateSelfColor = function () {
            for (var _i = 0, _a = this._bkNodes; _i < _a.length; _i++) {
                var node = _a[_i];
                node.vertexColor = this._color;
            }
        };
        /**
         * A ratio of the width of the space character. This value is multiplied by the height of the first character is the space character width.
         * @default 0.33
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 一个空格字符的宽度比例。这个数值乘以第一个字符的高度即为空格字符的宽。
         * @default 0.33
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        BKBitmapText.EMPTY_FACTOR = 0.33;
        return BKBitmapText;
    }(egret.BKDisplayObject));
    egret.BKBitmapText = BKBitmapText;
    __reflect(BKBitmapText.prototype, "egret.BKBitmapText");
    // MD
    var bkSpriteNodes = [];
    function createSpriteNode() {
        if (bkSpriteNodes.length > 0) {
            var spriteNode_1 = bkSpriteNodes.pop();
            return spriteNode_1;
        }
        var spriteNode = new BK.Sprite(0, 0, {}, 0, 1, 1, 1);
        return spriteNode;
    }
    if (window['renderMode'] != 'webgl') {
        egret.BitmapText = egret.BKBitmapText;
    }
})(egret || (egret = {}));
var egret;
(function (egret) {
    var BKGraphics = (function () {
        // private offsetX: number;
        // private offsetY: number;
        // public _BKCanvas: BK.Canvas;
        // public _BKNode: BK.Node;
        /**
         * Initializes a Graphics object.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建一个 Graphics 对象。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        function BKGraphics() {
            /**
             * 线条的左上方宽度
             */
            this.topLeftStrokeWidth = 0;
            /**
             * 线条的右下方宽度
             */
            this.bottomRightStrokeWidth = 0;
            /**
             * 线条宽度
             */
            this.lineWidth = 0;
            this.strokeColor = { r: 0, g: 0, b: 0, a: 0 };
            this.fillColor = { r: 0, g: 0, b: 0, a: 0 };
            /**
             * @private
             */
            this.minX = Infinity;
            /**
             * @private
             */
            this.minY = Infinity;
            /**
             * @private
             */
            this.maxX = -Infinity;
            /**
             * @private
             */
            this.maxY = -Infinity;
            /**
             * 是否已经包含上一次moveTo的坐标点
             */
            this.includeLastPosition = true;
            var stage = egret.lifecycle.stage;
            this.stageW = stage.stageWidth;
            this.stageH = stage.stageHeight;
            // this._BKNode = new BK.Node();
            // this._BKCanvas = new BK.Canvas(2 * this.stageW, 2 * this.stageH)//sys.GraphicsNode();
            // this._BKCanvas.position = { x: - this.stageW, y: - this.stageH };
            // this.offsetX = this.stageW;
            // this.offsetY = this.stageH;
            // this._BKCanvas.backgroundColor = { r: 0, g: 0, b: 0, a: 0 };
        }
        /**
         * @private
         * 设置绑定到的目标显示对象
         */
        BKGraphics.prototype.$setTarget = function (target) {
            if (this.targetDisplay) {
                this.targetDisplay.$renderNode = null;
            }
            // (target as BKDisplayObject)._bkNode.addChild(this._BKNode);
            // target._bkNode.addChild(this._BKCanvas);
            this.targetDisplay = target;
        };
        /**
         * 对1像素和3像素特殊处理，向右下角偏移0.5像素，以显示清晰锐利的线条。
         */
        BKGraphics.prototype.setStrokeWidth = function (width) {
            switch (width) {
                case 1:
                    this.topLeftStrokeWidth = 0;
                    this.bottomRightStrokeWidth = 1;
                    break;
                case 3:
                    this.topLeftStrokeWidth = 1;
                    this.bottomRightStrokeWidth = 2;
                    break;
                default:
                    var half = Math.ceil(width * 0.5) | 0;
                    this.topLeftStrokeWidth = half;
                    this.bottomRightStrokeWidth = half;
                    break;
            }
        };
        /**
         * Specify a simple single color fill that will be used for subsequent calls to other Graphics methods (for example, lineTo() and drawCircle()) when drawing.
         * Calling the clear() method will clear the fill.
         * @param color Filled color
         * @param alpha Filled Alpha value
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 指定一种简单的单一颜色填充，在绘制时该填充将在随后对其他 Graphics 方法（如 lineTo() 或 drawCircle()）的调用中使用。
         * 调用 clear() 方法会清除填充。
         * @param color 填充的颜色
         * @param alpha 填充的 Alpha 值
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        BKGraphics.prototype.beginFill = function (color, alpha) {
            if (alpha === void 0) { alpha = 1; }
            color = +color || 0;
            alpha = +alpha || 0;
            this.isFillPath = true;
            var rgb_str = this._refitString(color, 6); //六位rgb格式
            var red = parseInt(rgb_str.substring(0, 2), 16) / 255;
            var green = parseInt(rgb_str.substring(2, 4), 16) / 255;
            var blue = parseInt(rgb_str.substring(4, 6), 16) / 255;
            this.fillColor = { r: red, g: green, b: blue, a: alpha };
        };
        /**
          * 为16进制数字补0，输出字符串
          */
        BKGraphics.prototype._refitString = function (num, length) {
            var str = num.toString(16);
            var zero = "00000000";
            return zero.substr(0, length - str.length) + str;
        };
        /**
         * Specifies a gradient fill used by subsequent calls to other Graphics methods (such as lineTo() or drawCircle()) for the object.
         * Calling the clear() method clears the fill.
         * @param type A value from the GradientType class that specifies which gradient type to use: GradientType.LINEAR or GradientType.RADIAL.
         * @param colors An array of RGB hexadecimal color values used in the gradient; for example, red is 0xFF0000, blue is 0x0000FF, and so on. You can specify up to 15 colors. For each color, specify a corresponding value in the alphas and ratios parameters.
         * @param alphas An array of alpha values for the corresponding colors in the colors array;
         * @param ratios An array of color distribution ratios; valid values are 0-255.
         * @param matrix A transformation matrix as defined by the egret.Matrix class. The egret.Matrix class includes a createGradientBox() method, which lets you conveniently set up the matrix for use with the beginGradientFill() method.
         * @platform Web,Native
         * @version Egret 2.4
         * @language en_US
         */
        /**
         * 指定一种渐变填充，用于随后调用对象的其他 Graphics 方法（如 lineTo() 或 drawCircle()）。
         * 调用 clear() 方法会清除填充。
         * @param type 用于指定要使用哪种渐变类型的 GradientType 类的值：GradientType.LINEAR 或 GradientType.RADIAL。
         * @param colors 渐变中使用的 RGB 十六进制颜色值的数组（例如，红色为 0xFF0000，蓝色为 0x0000FF，等等）。对于每种颜色，请在 alphas 和 ratios 参数中指定对应值。
         * @param alphas colors 数组中对应颜色的 alpha 值数组。
         * @param ratios 颜色分布比率的数组。有效值为 0 到 255。
         * @param matrix 一个由 egret.Matrix 类定义的转换矩阵。egret.Matrix 类包括 createGradientBox() 方法，通过该方法可以方便地设置矩阵，以便与 beginGradientFill() 方法一起使用
         * @platform Web,Native
         * @version Egret 2.4
         * @language zh_CN
         */
        BKGraphics.prototype.beginGradientFill = function (type, colors, alphas, ratios, matrix) {
            if (matrix === void 0) { matrix = null; }
            //暂不使用
        };
        /**
         * Apply fill to the lines and curves added after the previous calling to the beginFill() method.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 对从上一次调用 beginFill()方法之后添加的直线和曲线应用填充。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        BKGraphics.prototype.endFill = function () {
            // // this.fillPath = null;
            if (this.isFillPath) {
                // this._BKCanvas.fill();
                this.isFillPath = false;
            }
            if (this.isStrokePath) {
                // this._BKCanvas.stroke();
                // this._BKCanvas.closePath();
                this.isStrokePath = false;
            }
        };
        /**
         * Specify a line style that will be used for subsequent calls to Graphics methods such as lineTo() and drawCircle().
         * @param thickness An integer, indicating the thickness of the line in points. Valid values are 0 to 255. If a number is not specified, or if the parameter is undefined, a line is not drawn. If a value less than 0 is passed, the default value is 0. Value 0 indicates hairline thickness; the maximum thickness is 255. If a value greater than 255 is passed, the default value is 255.
         * @param color A hexadecimal color value of the line (for example, red is 0xFF0000, and blue is 0x0000FF, etc.). If no value is specified, the default value is 0x000000 (black). Optional.
         * @param alpha Indicates Alpha value of the line's color. Valid values are 0 to 1. If no value is specified, the default value is 1 (solid). If the value is less than 0, the default value is 0. If the value is greater than 1, the default value is 1.
         * @param pixelHinting A boolean value that specifies whether to hint strokes to full pixels. This affects both the position of anchors of a curve and the line stroke size itself. With pixelHinting set to true, the line width is adjusted to full pixel width. With pixelHinting set to false, disjoints can appear for curves and straight lines.
         * @param scaleMode Specifies the scale mode to be used
         * @param caps Specifies the value of the CapsStyle class of the endpoint type at the end of the line. (default = CapsStyle.ROUND)
         * @param joints Specifies the type of joint appearance of corner.  (default = JointStyle.ROUND)
         * @param miterLimit Indicates the limit number of cut miter.
         * @param lineDash set the line dash.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 指定一种线条样式以用于随后对 lineTo() 或 drawCircle() 等 Graphics 方法的调用。
         * @param thickness 一个整数，以点为单位表示线条的粗细，有效值为 0 到 255。如果未指定数字，或者未定义该参数，则不绘制线条。如果传递的值小于 0，则默认值为 0。值 0 表示极细的粗细；最大粗细为 255。如果传递的值大于 255，则默认值为 255。
         * @param color 线条的十六进制颜色值（例如，红色为 0xFF0000，蓝色为 0x0000FF 等）。如果未指明值，则默认值为 0x000000（黑色）。可选。
         * @param alpha 表示线条颜色的 Alpha 值的数字；有效值为 0 到 1。如果未指明值，则默认值为 1（纯色）。如果值小于 0，则默认值为 0。如果值大于 1，则默认值为 1。
         * @param pixelHinting 布尔型值，指定是否提示笔触采用完整像素。它同时影响曲线锚点的位置以及线条笔触大小本身。在 pixelHinting 设置为 true 的情况下，线条宽度会调整到完整像素宽度。在 pixelHinting 设置为 false 的情况下，对于曲线和直线可能会出现脱节。
         * @param scaleMode 用于指定要使用的比例模式
         * @param caps 用于指定线条末端处端点类型的 CapsStyle 类的值。默认值：CapsStyle.ROUND
         * @param joints 指定用于拐角的连接外观的类型。默认值：JointStyle.ROUND
         * @param miterLimit 用于表示剪切斜接的极限值的数字。
         * @param lineDash 设置虚线样式。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        BKGraphics.prototype.lineStyle = function (thickness, color, alpha, pixelHinting, scaleMode, caps, joints, miterLimit, lineDash) {
            if (thickness === void 0) { thickness = NaN; }
            if (color === void 0) { color = 0; }
            if (alpha === void 0) { alpha = 1.0; }
            if (pixelHinting === void 0) { pixelHinting = false; }
            if (scaleMode === void 0) { scaleMode = "normal"; }
            if (caps === void 0) { caps = null; }
            if (joints === void 0) { joints = null; }
            if (miterLimit === void 0) { miterLimit = 3; }
            if (thickness <= 0) {
                this.isStrokePath = false;
                this.lineWidth = 0;
                this.setStrokeWidth(0);
            }
            else {
                color = +color || 0;
                alpha = +alpha || 0;
                this.setStrokeWidth(thickness);
                this.lineWidth = thickness;
                // this._BKCanvas.lineWidth = thickness;
                this.isStrokePath = true;
                var rgb_str = this._refitString(color, 6);
                var red = parseInt(rgb_str.substring(0, 2), 16) / 255;
                var green = parseInt(rgb_str.substring(2, 4), 16) / 255;
                var blue = parseInt(rgb_str.substring(4, 6), 16) / 255;
                this.strokeColor = { r: red, g: green, b: blue, a: alpha };
                // this._BKCanvas.strokeColor = { r: red, g: green, b: blue, a: alpha };
            }
        };
        /**
         * Draw a rectangle
         * @param x x position of the center, relative to the registration point of the parent display object (in pixels).
         * @param y y position of the center, relative to the registration point of the parent display object (in pixels).
         * @param width Width of the rectangle (in pixels).
         * @param height Height of the rectangle (in pixels).
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 绘制一个矩形
         * @param x 圆心相对于父显示对象注册点的 x 位置（以像素为单位）。
         * @param y 相对于父显示对象注册点的圆心的 y 位置（以像素为单位）。
         * @param width 矩形的宽度（以像素为单位）。
         * @param height 矩形的高度（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        BKGraphics.prototype.drawRect = function (x, y, width, height) {
            var _x = +x || 0;
            var _y = -y || 0;
            width = +width || 0;
            height = +height || 0;
            if (this.isFillPath) {
                var texture = new BK.Texture(BKGraphics.pixelPath);
                this.addSprite(texture, _x, _y, width, height);
                this.extendBoundsByPoint(x + width, y + height);
                this.updatePosition(x, y);
            }
        };
        /**
         * Draw a rectangle with rounded corners.
         * @param x x position of the center, relative to the registration point of the parent display object (in pixels).
         * @param y y position of the center, relative to the registration point of the parent display object (in pixels).
         * @param width Width of the rectangle (in pixels).
         * @param height Height of the rectangle (in pixels).
         * @param ellipseWidth Width used to draw an ellipse with rounded corners (in pixels).
         * @param ellipseHeight Height used to draw an ellipse with rounded corners (in pixels). (Optional) If no value is specified, the default value matches the value of the ellipseWidth parameter.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 绘制一个圆角矩形。
         * @param x 圆心相对于父显示对象注册点的 x 位置（以像素为单位）。
         * @param y 相对于父显示对象注册点的圆心的 y 位置（以像素为单位）。
         * @param width 矩形的宽度（以像素为单位）。
         * @param height 矩形的高度（以像素为单位）。
         * @param ellipseWidth 用于绘制圆角的椭圆的宽度（以像素为单位）。
         * @param ellipseHeight 用于绘制圆角的椭圆的高度（以像素为单位）。 （可选）如果未指定值，则默认值与为 ellipseWidth 参数提供的值相匹配。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        BKGraphics.prototype.drawRoundRect = function (x, y, width, height, ellipseWidth, ellipseHeight) {
            //暂不支持
        };
        BKGraphics.prototype.roundRect = function (x, y, width, height, ellipseWidth, ellipseHeight) {
        };
        /**
         * Draw a circle.
         * @param x x position of the center, relative to the registration point of the parent display object (in pixels).
         * @param y y position of the center, relative to the registration point of the parent display object (in pixels).
         * @param r Radius of the circle (in pixels).
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 绘制一个圆。
         * @param x 圆心相对于父显示对象注册点的 x 位置（以像素为单位）。
         * @param y 相对于父显示对象注册点的圆心的 y 位置（以像素为单位）。
         * @param radius 圆的半径（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        BKGraphics.prototype.drawCircle = function (x, y, radius) {
            var _x = +x || 0;
            var _y = -y || 0;
            radius = +radius || 0;
            if (this.isFillPath) {
                var texture = new BK.Texture(BKGraphics.circlePath);
                this.addSprite(texture, _x, _y, radius * 2, radius * 2, true);
                this.extendBoundsByPoint(x - radius - 1, y - radius - 1);
                this.extendBoundsByPoint(x + radius + 2, y + radius + 2);
                this.updatePosition(x + radius, y);
            }
        };
        BKGraphics.prototype.addSprite = function (texture, x, y, width, height, isCenter) {
            if (isCenter === void 0) { isCenter = false; }
            var rect = new BK.Sprite(width, height, texture, 0, 1, 1, 1);
            rect.vertexColor = this.fillColor;
            //bk特殊处理
            //最新的bk库中sprite不包括anchor属性
            // if (isCenter) {
            //     rect.anchor = { x: 0.5, y: 0.5 };
            // } else {
            //     rect.anchor = { x: 0, y: 1 };
            // }
            if (isCenter) {
                // rect.anchor = { x: 0.5, y: 0.5 };
                rect.position = { x: x - width / 2, y: y - height / 2 };
            }
            else {
                // rect.anchor = { x: 0, y: 1 };
                rect.position = { x: x, y: y - height };
            }
            var bkNode = this.targetDisplay['_bkNode'];
            bkNode.addChild(rect);
        };
        /**
         * Draw an ellipse.
         * @param x A number indicating the horizontal position, relative to the registration point of the parent display object (in pixels).
         * @param y A number indicating the vertical position, relative to the registration point of the parent display object (in pixels).
         * @param width Width of the rectangle (in pixels).
         * @param height Height of the rectangle (in pixels).
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 绘制一个椭圆。
         * @param x 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
         * @param y 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
         * @param width 矩形的宽度（以像素为单位）。
         * @param height 矩形的高度（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        BKGraphics.prototype.drawEllipse = function (x, y, width, height) {
            var _x = +x || 0;
            var _y = -y || 0;
            width = +width || 0;
            height = +height || 0;
            if (this.isFillPath) {
                var texture = new BK.Texture(BKGraphics.circlePath);
                var rect = new BK.Sprite(width, height, texture, 0, 1, 1, 1);
                rect.position = { x: _x, y: _y - height };
                rect.vertexColor = this.fillColor;
                var bkNode = this.targetDisplay['_bkNode'];
                bkNode.addChild(rect);
                this.extendBoundsByPoint(x - 1, y - 1);
                this.extendBoundsByPoint(x + width + 2, y + height + 2);
                this.updatePosition(x + width, y + height * 0.5);
            }
        };
        /**
         * Move the current drawing position to (x, y). If any of these parameters is missed, calling this method will fail and the current drawing position keeps unchanged.
         * @param x A number indicating the horizontal position, relative to the registration point of the parent display object (in pixels).
         * @param y A number indicating the vertical position, relative to the registration point of the parent display object (in pixels).
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 将当前绘图位置移动到 (x, y)。如果缺少任何一个参数，则此方法将失败，并且当前绘图位置不改变。
         * @param x 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
         * @param y 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        BKGraphics.prototype.moveTo = function (x, y) {
            var _x = x || 0;
            var _y = -y || 0;
            this.lastX = x;
            this.lastY = y;
            // this._BKCanvas.moveTo(_x, _y);
            // let fillPath = this.fillPath;
            // let strokePath = this.strokePath;
            // fillPath && fillPath.moveTo(x, y);
            // strokePath && strokePath.moveTo(x, y);
            this.includeLastPosition = false;
            this.lastX = x;
            this.lastY = y;
            // this.$renderNode.dirtyRender = true;
        };
        /**
         * Draw a straight line from the current drawing position to (x, y) using the current line style; the current drawing position is then set to (x, y).
         * @param x A number indicating the horizontal position, relative to the registration point of the parent display object (in pixels).
         * @param y A number indicating the vertical position, relative to the registration point of the parent display object (in pixels).
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 使用当前线条样式绘制一条从当前绘图位置开始到 (x, y) 结束的直线；当前绘图位置随后会设置为 (x, y)。
         * @param x 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
         * @param y 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        BKGraphics.prototype.lineTo = function (x, y) {
            if (this.isStrokePath) {
                var _x = x || 0;
                var _y = -y || 0;
                var _lastX = this.lastX !== undefined ? this.lastX : _x;
                var _lastY = this.lastY !== undefined ? -this.lastY : _y;
                //由x,y,lastx,lasty算出相对的偏移角度以及距离；
                var distance = Math.sqrt(Math.pow(_x - _lastX, 2) + Math.pow(_y - _lastY, 2));
                var rotation = void 0;
                rotation = Math.atan2((_y - _lastY), (_x - _lastX)) / Math.PI * 180;
                var texture = new BK.Texture(BKGraphics.pixelPath, 6, 0, 0, 1, 1);
                var line = new BK.Sprite(distance, this.lineWidth, texture, 0, 1, 1, 1);
                line.position = { x: _lastX, y: _lastY };
                line.rotation = { x: 0, y: 0, z: rotation };
                line.vertexColor = this.strokeColor;
                var bkNode = this.targetDisplay['_bkNode'];
                bkNode.addChild(line);
                this.updatePosition(x, y);
            }
            // this._BKCanvas.lineTo(_x, _y);
            // let fillPath = this.fillPath;
            // let strokePath = this.strokePath;
            // fillPath && fillPath.lineTo(x, y);
            // strokePath && strokePath.lineTo(x, y);
            // this.$renderNode.dirtyRender = true;
        };
        /**
         * Draw a quadratic Bezier curve from the current drawing position to (anchorX, anchorY) using the current line style according to the control points specified by (controlX, controlY). The current drawing position is then set to (anchorX, anchorY).
         * If the curveTo() method is called before the moveTo() method, the default value of the current drawing position is (0, 0). If any of these parameters is missed, calling this method will fail and the current drawing position keeps unchanged.
         * The drawn curve is a quadratic Bezier curve. A quadratic Bezier curve contains two anchor points and one control point. The curve interpolates the two anchor points and bends to the control point.
         * @param controlX A number indicating the horizontal position of the control point, relative to the registration point of the parent display object.
         * @param controlY A number indicating the vertical position of the control point, relative to the registration point of the parent display object.
         * @param anchorX A number indicating the horizontal position of the next anchor point, relative to the registration point of the parent display object.
         * @param anchorY A number indicating the vertical position of the next anchor point, relative to the registration point of the parent display object.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 使用当前线条样式和由 (controlX, controlY) 指定的控制点绘制一条从当前绘图位置开始到 (anchorX, anchorY) 结束的二次贝塞尔曲线。当前绘图位置随后设置为 (anchorX, anchorY)。
         * 如果在调用 moveTo() 方法之前调用了 curveTo() 方法，则当前绘图位置的默认值为 (0, 0)。如果缺少任何一个参数，则此方法将失败，并且当前绘图位置不改变。
         * 绘制的曲线是二次贝塞尔曲线。二次贝塞尔曲线包含两个锚点和一个控制点。该曲线内插这两个锚点，并向控制点弯曲。
         * @param controlX 一个数字，指定控制点相对于父显示对象注册点的水平位置。
         * @param controlY 一个数字，指定控制点相对于父显示对象注册点的垂直位置。
         * @param anchorX 一个数字，指定下一个锚点相对于父显示对象注册点的水平位置。
         * @param anchorY 一个数字，指定下一个锚点相对于父显示对象注册点的垂直位置。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        BKGraphics.prototype.curveTo = function (controlX, controlY, anchorX, anchorY) {
            // let _controlX = this.offsetX + controlX || 0;
            // let _controlY = this.offsetY - controlY || 0;
            // let _anchorX = this.offsetX + anchorX || 0;
            // let _anchorY = this.offsetY - anchorY || 0;
            // this._BKCanvas.quadraticCurveTo(_controlX, _controlY, _anchorX, _anchorY)
            // // let fillPath = this.fillPath;
            // // let strokePath = this.strokePath;
            // // fillPath && fillPath.curveTo(controlX, controlY, anchorX, anchorY);
            // // strokePath && strokePath.curveTo(controlX, controlY, anchorX, anchorY);
            // this.extendBoundsByPoint(controlX, controlY);
            // this.extendBoundsByPoint(anchorX, anchorY);
            // this.updatePosition(anchorX, anchorY);
            // // this.$renderNode.dirtyRender = true;
        };
        /**
         * Draws a cubic Bezier curve from the current drawing position to the specified anchor. Cubic Bezier curves consist of two anchor points and two control points. The curve interpolates the two anchor points and two control points to the curve.
         * @param controlX1 Specifies the first control point relative to the registration point of the parent display the horizontal position of the object.
         * @param controlY1 Specifies the first control point relative to the registration point of the parent display the vertical position of the object.
         * @param controlX2 Specify the second control point relative to the registration point of the parent display the horizontal position of the object.
         * @param controlY2 Specify the second control point relative to the registration point of the parent display the vertical position of the object.
         * @param anchorX Specifies the anchor point relative to the registration point of the parent display the horizontal position of the object.
         * @param anchorY Specifies the anchor point relative to the registration point of the parent display the vertical position of the object.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从当前绘图位置到指定的锚点绘制一条三次贝塞尔曲线。三次贝塞尔曲线由两个锚点和两个控制点组成。该曲线内插这两个锚点，并向两个控制点弯曲。
         * @param controlX1 指定首个控制点相对于父显示对象的注册点的水平位置。
         * @param controlY1 指定首个控制点相对于父显示对象的注册点的垂直位置。
         * @param controlX2 指定第二个控制点相对于父显示对象的注册点的水平位置。
         * @param controlY2 指定第二个控制点相对于父显示对象的注册点的垂直位置。
         * @param anchorX 指定锚点相对于父显示对象的注册点的水平位置。
         * @param anchorY 指定锚点相对于父显示对象的注册点的垂直位置。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        BKGraphics.prototype.cubicCurveTo = function (controlX1, controlY1, controlX2, controlY2, anchorX, anchorY) {
            // let _controlX1 = this.offsetX + controlX1 || 0;
            // let _controlY1 = this.offsetY - controlY1 || 0;
            // let _controlX2 = this.offsetX + controlX2 || 0;
            // let _controlY2 = this.offsetY - controlY2 || 0;
            // let _anchorX = this.offsetX + anchorX || 0;
            // let _anchorY = this.offsetY - anchorY || 0;
            // this._BKCanvas.bezierCurveTo(_controlX1, _controlY1, _controlX2, _controlY2, _anchorX, _anchorY);
            // // let fillPath = this.fillPath;
            // // let strokePath = this.strokePath;
            // // fillPath && fillPath.cubicCurveTo(controlX1, controlY1, controlX2, controlY2, anchorX, anchorY);
            // // strokePath && strokePath.cubicCurveTo(controlX1, controlY1, controlX2, controlY2, anchorX, anchorY);
            // this.extendBoundsByPoint(controlX1, controlY1);
            // this.extendBoundsByPoint(controlX2, controlY2);
            // this.extendBoundsByPoint(anchorX, anchorY);
            // this.updatePosition(anchorX, anchorY);
            // // this.$renderNode.dirtyRender = true;
        };
        /**
         * adds an arc to the path which is centered at (x, y) position with radius r starting at startAngle and ending
         * at endAngle going in the given direction by anticlockwise (defaulting to clockwise).
         * @param x The x coordinate of the arc's center.
         * @param y The y coordinate of the arc's center.
         * @param radius The arc's radius.
         * @param startAngle The angle at which the arc starts, measured clockwise from the positive x axis and expressed in radians.
         * @param endAngle The angle at which the arc ends, measured clockwise from the positive x axis and expressed in radians.
         * @param anticlockwise if true, causes the arc to be drawn counter-clockwise between the two angles. By default it is drawn clockwise.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 绘制一段圆弧路径。圆弧路径的圆心在 (x, y) 位置，半径为 r ，根据anticlockwise （默认为顺时针）指定的方向从 startAngle 开始绘制，到 endAngle 结束。
         * @param x 圆弧中心（圆心）的 x 轴坐标。
         * @param y 圆弧中心（圆心）的 y 轴坐标。
         * @param radius 圆弧的半径。
         * @param startAngle 圆弧的起始点， x轴方向开始计算，单位以弧度表示。
         * @param endAngle 圆弧的终点， 单位以弧度表示。
         * @param anticlockwise 如果为 true，逆时针绘制圆弧，反之，顺时针绘制。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        BKGraphics.prototype.drawArc = function (x, y, radius, startAngle, endAngle, anticlockwise) {
            // if (radius < 0 || startAngle === endAngle) {
            //     return;
            // }
            // let _x = this.offsetX + x || 0;
            // let _y = this.offsetY - y || 0;
            // radius = +radius || 0;
            // startAngle = +startAngle || 0;
            // endAngle = +endAngle || 0;
            // anticlockwise = !!anticlockwise;
            // let _startAngle = clampAngle(-endAngle);
            // let _endAngle = clampAngle(startAngle);
            // this._BKCanvas.arc(_x, _y, radius, _startAngle, _endAngle, anticlockwise);
            // if (this.isStrokePath && this.isFillPath) {
            //     this._BKCanvas.fill();
            //     this._BKCanvas.arc(_x, _y, radius, _startAngle, _endAngle, anticlockwise);
            //     this._BKCanvas.stroke();
            // }
            // let endX = x + Math.cos(endAngle) * radius;
            // let endY = y + Math.sin(endAngle) * radius;
            // this.updatePosition(endX, endY);
        };
        /**
         * Clear graphics that are drawn to this Graphics object, and reset fill and line style settings.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 清除绘制到此 Graphics 对象的图形，并重置填充和线条样式设置。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        BKGraphics.prototype.clear = function () {
            // this.$renderNode.clear();
            this.updatePosition(0, 0);
            this.minX = Infinity;
            this.minY = Infinity;
            this.maxX = -Infinity;
            this.maxY = -Infinity;
            // this._BKCanvas.clearRect(0, 0, 2 * this.stageW, 2 * this.stageH);
            var bkNode = this.targetDisplay['_bkNode'];
            while (bkNode.children.length > 0) {
                bkNode.removeChild(bkNode.children[0]);
            }
            this.isFillPath = false;
            this.isStrokePath = false;
        };
        /**
         * @private
         */
        BKGraphics.prototype.extendBoundsByPoint = function (x, y) {
            this.extendBoundsByX(x);
            this.extendBoundsByY(y);
        };
        /**
         * @private
         */
        BKGraphics.prototype.extendBoundsByX = function (x) {
            this.minX = Math.min(this.minX, x - this.topLeftStrokeWidth);
            this.maxX = Math.max(this.maxX, x + this.bottomRightStrokeWidth);
            this.updateNodeBounds();
        };
        /**
         * @private
         */
        BKGraphics.prototype.extendBoundsByY = function (y) {
            this.minY = Math.min(this.minY, y - this.topLeftStrokeWidth);
            this.maxY = Math.max(this.maxY, y + this.bottomRightStrokeWidth);
            this.updateNodeBounds();
        };
        /**
         * @private
         */
        BKGraphics.prototype.updateNodeBounds = function () {
            // let node = this.$renderNode;
            // node.x = this.minX;
            // node.y = this.minY;
            // node.width = Math.ceil(this.maxX - this.minX);
            // node.height = Math.ceil(this.maxY - this.minY);
        };
        /**
         * 更新当前的lineX和lineY值，并标记尺寸失效。
         * @private
         */
        BKGraphics.prototype.updatePosition = function (x, y) {
            if (!this.includeLastPosition) {
                this.extendBoundsByPoint(this.lastX, this.lastY);
                this.includeLastPosition = true;
            }
            this.lastX = x;
            this.lastY = y;
            this.extendBoundsByPoint(x, y);
        };
        /**
         * @private
         */
        BKGraphics.prototype.$measureContentBounds = function (bounds) {
            if (this.minX === Infinity) {
                bounds.setEmpty();
            }
            else {
                bounds.setTo(this.minX, this.minY, this.maxX - this.minX, this.maxY - this.minY);
            }
        };
        /**
         * @private
         *
         */
        BKGraphics.prototype.$hitTest = function (stageX, stageY) {
            // if (this._BKCanvas.hittest({ x: stageX, y: stageY })) {
            //     return this.targetDisplay;
            // }
            var bkNode = this.targetDisplay['_bkNode'];
            var worldPosition = BK.Director.root.convertToWorldSpace({ x: stageX, y: -stageY });
            for (var i = 0; i < bkNode.children.length; i++) {
                if (bkNode.children[i].hittest(worldPosition)) {
                    return this.targetDisplay;
                }
            }
            return null;
        };
        /**
         * @private
         */
        BKGraphics.prototype.$onRemoveFromStage = function () {
            // if (this.$renderNode) {
            //     this.$renderNode.clean();
            // }
        };
        BKGraphics.pixelPath = "GameRes://resource/pixel.png";
        BKGraphics.circlePath = "GameRes://resource/circle.png";
        return BKGraphics;
    }());
    egret.BKGraphics = BKGraphics;
    __reflect(BKGraphics.prototype, "egret.BKGraphics");
    function clampAngle(value) {
        value %= Math.PI * 2;
        if (value < 0) {
            value += Math.PI * 2;
        }
        return value;
    }
    if (window['renderMode'] != 'webgl') {
        egret.Graphics = egret.BKGraphics;
    }
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @classdesc
     * @extends egret.StageText
     * @private
     */
    var BKHTML5StageText = (function (_super) {
        __extends(BKHTML5StageText, _super);
        /**
         * @private
         */
        function BKHTML5StageText() {
            var _this = _super.call(this) || this;
            /**
             * @private
             */
            _this.textValue = "";
            _this.onKeyboardComplete = _this.onKeyboardComplete.bind(_this);
            _this.onKeyboardInput = _this.onKeyboardInput.bind(_this);
            return _this;
        }
        /**
         * @private
         *
         * @param textfield
         */
        BKHTML5StageText.prototype.$setTextField = function (textfield) {
            this.$textfield = textfield;
            return true;
        };
        /**
         * @private
         *
         */
        BKHTML5StageText.prototype.$addToStage = function () {
        };
        /**
         * @private
         *
         */
        BKHTML5StageText.prototype.$show = function () {
            BK.Editor.showKeyBoard(this.onKeyboardComplete, this.onKeyboardInput);
            this.dispatchEvent(new egret.Event("focus"));
        };
        BKHTML5StageText.prototype.onKeyboardInput = function (data) {
            this.textValue = data;
            egret.Event.dispatchEvent(this, "updateText", false);
        };
        BKHTML5StageText.prototype.onKeyboardComplete = function (res) {
            this.$textfield.text = res;
            this.$hide();
        };
        /**
         * @private
         */
        BKHTML5StageText.prototype.$hide = function () {
            // TODO
            this.dispatchEvent(new egret.Event("blur"));
        };
        /**
         * @private
         *
         * @returns
         */
        BKHTML5StageText.prototype.$getText = function () {
            if (!this.textValue) {
                this.textValue = "";
            }
            return this.textValue;
        };
        /**
         * @private
         *
         * @param value
         */
        BKHTML5StageText.prototype.$setText = function (value) {
            this.textValue = value;
            // this.resetText();
            return true;
        };
        /**
         * @private
         */
        BKHTML5StageText.prototype.$setColor = function (value) {
            return true;
        };
        BKHTML5StageText.prototype.$onBlur = function () {
        };
        /**
         * @private
         *
         */
        BKHTML5StageText.prototype.$removeFromStage = function () {
        };
        /**
         * 修改位置
         * @private
         */
        BKHTML5StageText.prototype.$resetStageText = function () {
        };
        return BKHTML5StageText;
    }(egret.EventDispatcher));
    egret.BKHTML5StageText = BKHTML5StageText;
    __reflect(BKHTML5StageText.prototype, "egret.BKHTML5StageText", ["egret.StageText"]);
    egret.StageText = BKHTML5StageText;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var localStorage;
    (function (localStorage) {
        var BKlocalStorage;
        (function (BKlocalStorage) {
            var localStoragePath = "GameSandBox://resource/localStorage";
            function getItem(key) {
                if (!BK.FileUtil.isFileExist(localStoragePath))
                    return undefined;
                var str = BK.FileUtil.readFile(localStoragePath).readAsString();
                if (!str) {
                    return undefined;
                }
                var data = JSON.parse(str);
                if (data) {
                    return data[key];
                }
                return undefined;
                // return "";
            }
            function setItem(key, value) {
                var str = BK.FileUtil.readFile(localStoragePath).readAsString();
                var data = {};
                if (str) {
                    var parseData = JSON.parse(str);
                    if (parseData) {
                        data = parseData;
                    }
                }
                data[key] = value;
                var data_str = JSON.stringify(data);
                BK.FileUtil.writeFile(localStoragePath, data_str);
                return true;
            }
            function removeItem(key) {
                var str = BK.FileUtil.readFile(localStoragePath).readAsString();
                if (!str)
                    return;
                var data = JSON.parse(str);
                if (!data || !data[key])
                    return;
                delete data[key];
                var data_str = JSON.stringify(data);
                BK.FileUtil.writeFile(localStoragePath, data_str);
            }
            function clear() {
                if (!BK.FileUtil.isFileExist(localStoragePath))
                    return;
                var data = {};
                var data_str = JSON.stringify(data);
                BK.FileUtil.writeFile(localStoragePath, data_str);
            }
            egret.localStorage.setItem = setItem;
            egret.localStorage.getItem = getItem;
            egret.localStorage.removeItem = removeItem;
            egret.localStorage.clear = clear;
        })(BKlocalStorage = localStorage.BKlocalStorage || (localStorage.BKlocalStorage = {}));
    })(localStorage = egret.localStorage || (egret.localStorage = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var BKMesh = (function (_super) {
        __extends(BKMesh, _super);
        function BKMesh() {
            var _this = _super.call(this, new BK.Mesh(egret.emptyTexture, [
                { x: 0.0, y: 0.0, z: 0.0, r: 1.0, g: 1.0, b: 1.0, a: 1.0, u: 0.0, v: 1.0 },
                { x: 0.0, y: 0.0, z: 0.0, r: 1.0, g: 1.0, b: 1.0, a: 1.0, u: 1.0, v: 1.0 },
                { x: 0.0, y: -0.0, z: 0.0, r: 1.0, g: 1.0, b: 1.0, a: 1.0, u: 0.0, v: 0.0 }
            ], [
                0, 1, 2
            ])) || this;
            _this._textureDirty = true;
            _this._boundsDirty = true;
            _this._bounds = new egret.Rectangle();
            _this.$bitmapData = null;
            _this.$texture = null;
            _this.$renderNode = new egret.sys.MeshNode();
            _this._bkMesh = _this._bkNode;
            return _this;
        }
        Object.defineProperty(BKMesh.prototype, "texture", {
            get: function () {
                return this.$texture;
            },
            set: function (value) {
                if (this.$texture === value) {
                    return;
                }
                this.$setTexture(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         */
        BKMesh.prototype.$setTexture = function (value) {
            this.$texture = value;
            this._transformDirty = true;
            if (this.$texture) {
                this.$bitmapData = this.$texture.bitmapData;
                if (this.$bitmapData.bkTexture) {
                    this._bkMesh.setTexture(this.$bitmapData.bkTexture);
                }
                else {
                    this.$bitmapData = null;
                    this._bkMesh.setTexture({});
                }
            }
            else {
                this.$bitmapData = null;
                this._bkMesh.setTexture({});
            }
        };
        /**
         * @override
         */
        BKMesh.prototype.$updateVertices = function () {
            this._boundsDirty = true;
            this.$renderDirty = true;
            this.$renderNode = new egret.sys.MeshNode();
        };
        /**
         * @override
         */
        BKMesh.prototype.$measureContentBounds = function (bounds) {
            if (this._boundsDirty) {
                this._boundsDirty = false;
                var node = this.$renderNode;
                var vertices = node.vertices;
                if (vertices.length) {
                    this._bounds.setTo(Number.MAX_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
                    for (var i = 0, l = vertices.length; i < l; i += 2) {
                        var x = vertices[i];
                        var y = vertices[i + 1];
                        if (this._bounds.x > x)
                            this._bounds.x = x;
                        if (this._bounds.width < x)
                            this._bounds.width = x;
                        if (this._bounds.y > y)
                            this._bounds.y = y;
                        if (this._bounds.height < y)
                            this._bounds.height = y;
                    }
                    this._bounds.width -= this._bounds.x;
                    this._bounds.height -= this._bounds.y;
                }
                else {
                    this._bounds.setTo(0, 0, 0, 0);
                }
                node.bounds.copyFrom(this._bounds);
            }
            bounds.copyFrom(this._bounds);
        };
        /**
         * @override
         */
        BKMesh.prototype.$updateRenderNode = function () {
            var meshNode = this.$renderNode;
            var nodeVercices = meshNode.vertices;
            var nodeUV = meshNode.uvs;
            var bkVertices = this._bkMesh.getVertices();
            if (!bkVertices) {
                bkVertices = [];
            }
            if (bkVertices.length !== nodeVercices.length / 2) {
                for (var i = bkVertices.length, l = nodeVercices.length / 2; i < l; ++i) {
                    bkVertices[i] = {};
                }
                var subTextureRotated = this.$texture.$rotated;
                var subTextureX = this.$texture.$bitmapX;
                var subTextureY = this.$texture.$bitmapY;
                var subTextureWidth = this.$texture.$bitmapWidth;
                var subTextureHeight = this.$texture.$bitmapHeight;
                var textureWidth = this.$texture.$sourceWidth;
                var textureHeight = this.$texture.$sourceHeight;
                var kx1 = subTextureX / textureWidth;
                var kx2 = subTextureRotated ? subTextureHeight / textureWidth : subTextureWidth / textureWidth;
                var ky1 = subTextureY / textureHeight;
                var ky2 = subTextureRotated ? subTextureWidth / textureHeight : subTextureHeight / textureHeight;
                for (var i = 0, iD = 0, l = bkVertices.length; i < l; ++i, iD += 2) {
                    var vertex = bkVertices[i];
                    var u = nodeUV[iD];
                    var v = nodeUV[iD + 1];
                    vertex.x = nodeVercices[iD];
                    vertex.y = -nodeVercices[iD + 1];
                    vertex.z = this._bkNode.zOrder;
                    vertex.r = 1.0;
                    vertex.g = 1.0;
                    vertex.b = 1.0;
                    vertex.a = 1.0;
                    // uv
                    if (subTextureRotated) {
                        vertex.u = kx1 + (1.0 - v) * kx2;
                        vertex.v = 1.0 - (ky1 + u * ky2);
                    }
                    else {
                        vertex.u = kx1 + u * kx2;
                        vertex.v = 1.0 - (ky1 + v * ky2);
                    }
                }
            }
            else {
                for (var i = 0, iD = 0, l = bkVertices.length; i < l; ++i, iD += 2) {
                    var vertex = bkVertices[i];
                    vertex.x = nodeVercices[iD];
                    vertex.y = -nodeVercices[iD + 1];
                }
            }
            this._bkMesh.setVerticesAndIndices(bkVertices, meshNode.indices); // 需要提供更加高性能的接口
        };
        return BKMesh;
    }(egret.BKDisplayObject));
    egret.BKMesh = BKMesh;
    __reflect(BKMesh.prototype, "egret.BKMesh");
    //MD
    if (window['renderMode'] != 'webgl') {
        egret.Mesh = egret.BKMesh;
    }
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
    * @version Egret 2.4
    * @platform Web,Native
    * @includeExample extension/game/display/MovieClip.ts
    * @language en_US
    */
    /**
     * 影片剪辑，可以通过影片剪辑播放序列帧动画。MovieClip 类从以下类继承而来：DisplayObject 和 EventDispatcher。不同于 DisplayObject 对象，MovieClip 对象拥有一个时间轴。
     * @extends egret.DisplayObject
     * @event egret.Event.COMPLETE 动画播放完成。
     * @event egret.Event.LOOP_COMPLETE 动画循环播放完成。循环最后一次只派发 COMPLETE 事件，不派发 LOOP_COMPLETE 事件。
     * @see http://edn.egret.com/cn/docs/page/596 MovieClip序列帧动画
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/display/MovieClip.ts
     * @language zh_CN
     */
    var BKMovieClip = (function (_super) {
        __extends(BKMovieClip, _super);
        //Construct Function
        /**
         * 创建新的 MovieClip 实例。创建 MovieClip 之后，调用舞台上的显示对象容器的addElement方法。
         * @param movieClipData {movieClipData} 被引用的 movieClipData 对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        function BKMovieClip(movieClipData) {
            var _this = _super.call(this, new BK.Sprite(0, 0, {}, 0, 1, 1, 1)) || this;
            _this._size = { width: 0, height: 0 };
            //Render Property
            _this.$texture = null;
            //Render Property
            _this.offsetPoint = egret.Point.create(0, 0);
            //Data Property
            _this.$movieClipData = null;
            /**
             * @private
             */
            _this.frames = null;
            /**
             * @private
             */
            _this.$totalFrames = 0;
            /**
             * @version Egret 2.4
             * @platform Web,Native
             * @private
             */
            _this.frameLabels = null;
            /**
             * @private
             */
            _this.$frameLabelStart = 0;
            /**
             * @private
             */
            _this.$frameLabelEnd = 0;
            /**
             * @version Egret 2.4
             * @platform Web,Native
             * @private
             */
            _this.frameEvents = null;
            /**
             * @private
             */
            _this.frameIntervalTime = 0;
            /**
             * @private
             */
            _this.$eventPool = null;
            //Animation Property
            _this.$isPlaying = false;
            /**
             * @private
             */
            _this.isStopped = true;
            /**
             * @private
             */
            _this.playTimes = 0;
            /**
             * @private
             */
            _this.$currentFrameNum = 0;
            /**
             * @private
             */
            _this.$nextFrameNum = 1;
            /**
             * @private
             */
            _this.displayedKeyFrameNum = 0;
            /**
             * @private
             */
            _this.passedTime = 0;
            /**
             * @private
             */
            _this.$frameRate = NaN;
            _this.$bitmapData = null;
            _this.$scale9Grid = null;
            /**
             * @private
             */
            _this.lastTime = 0;
            _this._bkSprite = _this._bkNode;
            _this.$smoothing = egret.Bitmap.defaultSmoothing;
            _this.setMovieClipData(movieClipData);
            return _this;
            // if (!egret.nativeRender) {
            //     this.$renderNode = new sys.NormalBitmapNode();
            // }
        }
        BKMovieClip.prototype._updateBKNodeMatrix = function () {
            if (!this.$texture) {
                return;
            }
            var matrix = this.$getMatrix();
            var bkMatrix = this._bkNode.transform.matrix;
            var tx = matrix.tx;
            var ty = matrix.ty;
            var pivotX = this.$anchorOffsetX;
            var pivotY = this.$anchorOffsetY - this._size.height;
            if (pivotX !== 0.0 || pivotY !== 0.0) {
                tx -= matrix.a * pivotX + matrix.c * pivotY;
                ty -= matrix.b * pivotX + matrix.d * pivotY;
            }
            var frame = this.frames[this.$currentFrameNum - 1];
            bkMatrix.set(matrix.a, -matrix.b, -matrix.c, matrix.d, tx + frame.x, -ty - frame.y);
        };
        Object.defineProperty(BKMovieClip.prototype, "smoothing", {
            /**
             * Whether or not is smoothed when scaled.
             * @version Egret 3.0
             * @platform Web
             * @language en_US
             */
            /**
             * 控制在缩放时是否进行平滑处理。
             * @version Egret 3.0
             * @platform Web
             * @language zh_CN
             */
            get: function () {
                return this.$smoothing;
            },
            set: function (value) {
                if (value == this.$smoothing) {
                    return;
                }
                this.$smoothing = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         *
         */
        BKMovieClip.prototype.$init = function () {
            this.$reset();
            var movieClipData = this.$movieClipData;
            if (movieClipData && movieClipData.$isDataValid()) {
                this.frames = movieClipData.frames;
                this.$totalFrames = movieClipData.numFrames;
                this.frameLabels = movieClipData.labels;
                this.frameEvents = movieClipData.events;
                this.$frameRate = movieClipData.frameRate;
                this.frameIntervalTime = 1000 / this.$frameRate;
                this._initFrame();
            }
        };
        /**
         * @private
         *
         */
        BKMovieClip.prototype.$reset = function () {
            this.frames = null;
            this.playTimes = 0;
            this.$isPlaying = false;
            this.setIsStopped(true);
            this.$currentFrameNum = 0;
            this.$nextFrameNum = 1;
            this.displayedKeyFrameNum = 0;
            this.passedTime = 0;
            this.$eventPool = [];
        };
        /**
         * @private
         *
         */
        BKMovieClip.prototype._initFrame = function () {
            if (this.$movieClipData.$isTextureValid()) {
                this.advanceFrame();
                this.constructFrame();
            }
        };
        /**
         * @private
         */
        BKMovieClip.prototype.$updateRenderNode = function () {
            // let texture = this.$texture;
            // if (texture) {
            //     let offsetX: number = Math.round(this.offsetPoint.x);
            //     let offsetY: number = Math.round(this.offsetPoint.y);
            //     let bitmapWidth: number = texture.$bitmapWidth;
            //     let bitmapHeight: number = texture.$bitmapHeight;
            //     let textureWidth: number = texture.$getTextureWidth();
            //     let textureHeight: number = texture.$getTextureHeight();
            //     let destW: number = Math.round(texture.$getScaleBitmapWidth());
            //     let destH: number = Math.round(texture.$getScaleBitmapHeight());
            //     let sourceWidth: number = texture.$sourceWidth;
            //     let sourceHeight: number = texture.$sourceHeight;
            //     sys.BitmapNode.$updateTextureData(<sys.NormalBitmapNode>this.$renderNode, texture.$bitmapData, texture.$bitmapX, texture.$bitmapY,
            //         bitmapWidth, bitmapHeight, offsetX, offsetY, textureWidth, textureHeight, destW, destH, sourceWidth, sourceHeight, egret.BitmapFillMode.SCALE, this.$smoothing);
            // }
            // MD
            if (this.frames[this.$currentFrameNum - 1].res) {
                if (this.$texture) {
                    this._transformDirty = true;
                    this.$bitmapData = this.$texture.bitmapData;
                    if (this.$bitmapData.bkTexture) {
                        this._bkSprite.setTexture(this.$bitmapData.bkTexture);
                        this._bkSprite.adjustTexturePosition(this.$texture.$bitmapX, this.$texture.$sourceHeight - (this.$texture.$bitmapY + this.$texture.$bitmapHeight), this.$texture.$bitmapWidth, this.$texture.$bitmapHeight, this.$texture.$rotated);
                        this._size.width = this.$texture.$bitmapWidth;
                        this._size.height = this.$texture.$bitmapHeight;
                        this._bkSprite.size = this._size;
                    }
                    else {
                        this.$bitmapData = null;
                        this._bkSprite.setTexture({});
                    }
                }
                else {
                    this.$bitmapData = null;
                    this._bkSprite.setTexture({});
                }
            }
        };
        /**
         * @private
         */
        BKMovieClip.prototype.$measureContentBounds = function (bounds) {
            var texture = this.$texture;
            if (texture) {
                var x = this.offsetPoint.x;
                var y = this.offsetPoint.y;
                var w = texture.$getTextureWidth();
                var h = texture.$getTextureHeight();
                bounds.setTo(x, y, w, h);
            }
            else {
                bounds.setEmpty();
            }
        };
        /**
         * @private
         *
         * @param stage
         * @param nestLevel
         */
        BKMovieClip.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            if (this.$isPlaying && this.$totalFrames > 1) {
                this.setIsStopped(false);
            }
        };
        /**
         * @private
         *
         */
        BKMovieClip.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            this.setIsStopped(true);
        };
        //Data Function
        /**
         * @private
         * 返回帧标签为指定字符串的FrameLabel对象
         * @param labelName {string} 帧标签名
         * @param ignoreCase {boolean} 是否忽略大小写，可选参数，默认false
         * @returns {egret.FrameLabel} FrameLabel对象
         */
        BKMovieClip.prototype.getFrameLabelByName = function (labelName, ignoreCase) {
            if (ignoreCase === void 0) { ignoreCase = false; }
            if (ignoreCase) {
                labelName = labelName.toLowerCase();
            }
            var frameLabels = this.frameLabels;
            if (frameLabels) {
                var outputFramelabel = null;
                for (var i = 0; i < frameLabels.length; i++) {
                    outputFramelabel = frameLabels[i];
                    if (ignoreCase ? outputFramelabel.name.toLowerCase() == labelName : outputFramelabel.name == labelName) {
                        return outputFramelabel;
                    }
                }
            }
            return null;
        };
        /**
         * @private
         * 根据帧标签，设置开始和结束的帧数
         * @param labelName {string} 帧标签名
         */
        BKMovieClip.prototype.getFrameStartEnd = function (labelName) {
            var frameLabels = this.frameLabels;
            if (frameLabels) {
                var outputFramelabel = null;
                for (var i = 0; i < frameLabels.length; i++) {
                    outputFramelabel = frameLabels[i];
                    if (labelName == outputFramelabel.name) {
                        this.$frameLabelStart = outputFramelabel.frame;
                        this.$frameLabelEnd = outputFramelabel.end;
                        break;
                    }
                }
            }
        };
        /**
         * @private
         * 返回指定序号的帧的FrameLabel对象
         * @param frame {number} 帧序号
         * @returns {egret.FrameLabel} FrameLabel对象
         */
        BKMovieClip.prototype.getFrameLabelByFrame = function (frame) {
            var frameLabels = this.frameLabels;
            if (frameLabels) {
                var outputFramelabel = null;
                for (var i = 0; i < frameLabels.length; i++) {
                    outputFramelabel = frameLabels[i];
                    if (outputFramelabel.frame == frame) {
                        return outputFramelabel;
                    }
                }
            }
            return null;
        };
        /**
         * @private
         * 返回指定序号的帧对应的FrameLabel对象，如果当前帧没有标签，则返回前面最近的有标签的帧的FrameLabel对象
         * @method egret.MovieClip#getFrameLabelForFrame
         * @param frame {number} 帧序号
         * @returns {egret.FrameLabel} FrameLabel对象
         */
        BKMovieClip.prototype.getFrameLabelForFrame = function (frame) {
            var outputFrameLabel = null;
            var tempFrameLabel = null;
            var frameLabels = this.frameLabels;
            if (frameLabels) {
                for (var i = 0; i < frameLabels.length; i++) {
                    tempFrameLabel = frameLabels[i];
                    if (tempFrameLabel.frame > frame) {
                        return outputFrameLabel;
                    }
                    outputFrameLabel = tempFrameLabel;
                }
            }
            return outputFrameLabel;
        };
        //Animation Function
        /**
         * 继续播放当前动画
         * @param playTimes {number} 播放次数。 参数为整数，可选参数，>=1：设定播放次数，<0：循环播放，默认值 0：不改变播放次数(MovieClip初始播放次数设置为1)，
         * @version Egret 2.4
         * @platform Web,Native
         */
        BKMovieClip.prototype.play = function (playTimes) {
            if (playTimes === void 0) { playTimes = 0; }
            this.$isPlaying = true;
            this.setPlayTimes(playTimes);
            if (this.$totalFrames > 1 && this.$stage) {
                this.setIsStopped(false);
            }
        };
        /**
         * 暂停播放动画
         * @version Egret 2.4
         * @platform Web,Native
         */
        BKMovieClip.prototype.stop = function () {
            this.$isPlaying = false;
            this.setIsStopped(true);
        };
        /**
         * 将播放头移到前一帧并停止
         * @version Egret 2.4
         * @platform Web,Native
         */
        BKMovieClip.prototype.prevFrame = function () {
            this.gotoAndStop(this.$currentFrameNum - 1);
        };
        /**
         * 跳到后一帧并停止
         * @version Egret 2.4
         * @platform Web,Native
         */
        BKMovieClip.prototype.nextFrame = function () {
            this.gotoAndStop(this.$currentFrameNum + 1);
        };
        /**
         * 将播放头移到指定帧并播放
         * @param frame {any} 指定帧的帧号或帧标签
         * @param playTimes {number} 播放次数。 参数为整数，可选参数，>=1：设定播放次数，<0：循环播放，默认值 0：不改变播放次数，
         * @version Egret 2.4
         * @platform Web,Native
         */
        BKMovieClip.prototype.gotoAndPlay = function (frame, playTimes) {
            if (playTimes === void 0) { playTimes = 0; }
            if (arguments.length == 0 || arguments.length > 2) {
                egret.$error(1022, "MovieClip.gotoAndPlay()");
            }
            if (typeof frame === "string") {
                this.getFrameStartEnd(frame);
            }
            else {
                this.$frameLabelStart = 0;
                this.$frameLabelEnd = 0;
            }
            this.play(playTimes);
            this.gotoFrame(frame);
        };
        /**
         * 将播放头移到指定帧并停止
         * @param frame {any} 指定帧的帧号或帧标签
         * @version Egret 2.4
         * @platform Web,Native
         */
        BKMovieClip.prototype.gotoAndStop = function (frame) {
            if (arguments.length != 1) {
                egret.$error(1022, "MovieClip.gotoAndStop()");
            }
            this.stop();
            this.gotoFrame(frame);
        };
        /**
         * @private
         *
         * @param frame
         */
        BKMovieClip.prototype.gotoFrame = function (frame) {
            var frameNum;
            if (typeof frame === "string") {
                frameNum = this.getFrameLabelByName(frame).frame;
            }
            else {
                frameNum = parseInt(frame + '', 10);
                if (frameNum != frame) {
                    egret.$error(1022, "Frame Label Not Found");
                }
            }
            if (frameNum < 1) {
                frameNum = 1;
            }
            else if (frameNum > this.$totalFrames) {
                frameNum = this.$totalFrames;
            }
            if (frameNum == this.$nextFrameNum) {
                return;
            }
            this.$nextFrameNum = frameNum;
            this.advanceFrame();
            this.constructFrame();
            this.handlePendingEvent();
        };
        /**
         * @private
         *
         * @param advancedTime
         * @returns
         */
        BKMovieClip.prototype.advanceTime = function (timeStamp) {
            var self = this;
            var advancedTime = timeStamp - self.lastTime;
            self.lastTime = timeStamp;
            var frameIntervalTime = self.frameIntervalTime;
            var currentTime = self.passedTime + advancedTime;
            self.passedTime = currentTime % frameIntervalTime;
            var num = currentTime / frameIntervalTime;
            if (num < 1) {
                return false;
            }
            while (num >= 1) {
                num--;
                self.$nextFrameNum++;
                if (self.$nextFrameNum > self.$totalFrames || (self.$frameLabelStart > 0 && self.$nextFrameNum > self.$frameLabelEnd)) {
                    if (self.playTimes == -1) {
                        self.$eventPool.push(egret.Event.LOOP_COMPLETE);
                        self.$nextFrameNum = 1;
                    }
                    else {
                        self.playTimes--;
                        if (self.playTimes > 0) {
                            self.$eventPool.push(egret.Event.LOOP_COMPLETE);
                            self.$nextFrameNum = 1;
                        }
                        else {
                            self.$nextFrameNum = self.$totalFrames;
                            self.$eventPool.push(egret.Event.COMPLETE);
                            self.stop();
                            break;
                        }
                    }
                }
                if (self.$currentFrameNum == self.$frameLabelEnd) {
                    self.$nextFrameNum = self.$frameLabelStart;
                }
                self.advanceFrame();
            }
            self.constructFrame();
            self.handlePendingEvent();
            return false;
        };
        /**
         * @private
         *
         */
        BKMovieClip.prototype.advanceFrame = function () {
            this.$currentFrameNum = this.$nextFrameNum;
            var event = this.frameEvents[this.$nextFrameNum];
            if (event && event != "") {
                egret.MovieClipEvent.dispatchMovieClipEvent(this, egret.MovieClipEvent.FRAME_LABEL, event);
            }
        };
        /**
         * @private
         *
         */
        BKMovieClip.prototype.constructFrame = function () {
            var self = this;
            var currentFrameNum = self.$currentFrameNum;
            if (self.displayedKeyFrameNum == currentFrameNum) {
                return;
            }
            var texture = self.$movieClipData.getTextureByFrame(currentFrameNum);
            self.$texture = texture;
            self.$movieClipData.$getOffsetByFrame(currentFrameNum, self.offsetPoint);
            self.displayedKeyFrameNum = currentFrameNum;
            self.$renderDirty = true;
            // if (egret.nativeRender) {
            //     self.$nativeDisplayObject.setDataToBitmapNode(self.$nativeDisplayObject.id, texture,
            //         [texture.$bitmapX, texture.$bitmapY, texture.$bitmapWidth, texture.$bitmapHeight,
            //         self.offsetPoint.x, self.offsetPoint.y, texture.$getScaleBitmapWidth(), texture.$getScaleBitmapHeight(),
            //         texture.$sourceWidth, texture.$sourceHeight]);
            //     //todo 负数offsetPoint
            //     self.$nativeDisplayObject.setWidth(texture.$getTextureWidth() + self.offsetPoint.x);
            //     self.$nativeDisplayObject.setHeight(texture.$getTextureHeight() + self.offsetPoint.y);
            // }
            // else {
            var p = self.$parent;
            if (p && !p.$cacheDirty) {
                p.$cacheDirty = true;
                p.$cacheDirtyUp();
            }
            var maskedObject = self.$maskedObject;
            if (maskedObject && !maskedObject.$cacheDirty) {
                maskedObject.$cacheDirty = true;
                maskedObject.$cacheDirtyUp();
            }
            // }
        };
        /**
         * @private
         *
         */
        BKMovieClip.prototype.$renderFrame = function () {
            var self = this;
            self.$texture = self.$movieClipData.getTextureByFrame(self.$currentFrameNum);
            self.$renderDirty = true;
            var p = self.$parent;
            if (p && !p.$cacheDirty) {
                p.$cacheDirty = true;
                p.$cacheDirtyUp();
            }
            var maskedObject = self.$maskedObject;
            if (maskedObject && !maskedObject.$cacheDirty) {
                maskedObject.$cacheDirty = true;
                maskedObject.$cacheDirtyUp();
            }
        };
        /**
         * @private
         *
         */
        BKMovieClip.prototype.handlePendingEvent = function () {
            if (this.$eventPool.length != 0) {
                this.$eventPool.reverse();
                var eventPool = this.$eventPool;
                var length_1 = eventPool.length;
                var isComplete = false;
                var isLoopComplete = false;
                for (var i = 0; i < length_1; i++) {
                    var event_1 = eventPool.pop();
                    if (event_1 == egret.Event.LOOP_COMPLETE) {
                        isLoopComplete = true;
                    }
                    else if (event_1 == egret.Event.COMPLETE) {
                        isComplete = true;
                    }
                    else {
                        this.dispatchEventWith(event_1);
                    }
                }
                if (isLoopComplete) {
                    this.dispatchEventWith(egret.Event.LOOP_COMPLETE);
                }
                if (isComplete) {
                    this.dispatchEventWith(egret.Event.COMPLETE);
                }
            }
        };
        Object.defineProperty(BKMovieClip.prototype, "totalFrames", {
            //Properties
            /**
             * MovieClip 实例中帧的总数
             * @version Egret 2.4
             * @platform Web,Native
             */
            get: function () {
                return this.$totalFrames;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKMovieClip.prototype, "currentFrame", {
            /**
             * MovieClip 实例当前播放的帧的序号
             * @version Egret 2.4
             * @platform Web,Native
             */
            get: function () {
                return this.$currentFrameNum;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKMovieClip.prototype, "currentFrameLabel", {
            /**
             * MovieClip 实例当前播放的帧的标签。如果当前帧没有标签，则 currentFrameLabel返回null。
             * @version Egret 2.4
             * @platform Web,Native
             */
            get: function () {
                var label = this.getFrameLabelByFrame(this.$currentFrameNum);
                return label && label.name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKMovieClip.prototype, "currentLabel", {
            /**
             * 当前播放的帧对应的标签，如果当前帧没有标签，则currentLabel返回包含标签的先前帧的标签。如果当前帧和先前帧都不包含标签，currentLabel返回null。
             * @version Egret 2.4
             * @platform Web,Native
             */
            get: function () {
                var label = this.getFrameLabelForFrame(this.$currentFrameNum);
                return label ? label.name : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKMovieClip.prototype, "frameRate", {
            /**
             * MovieClip 实例的帧频
             * @version Egret 2.4
             * @platform Web,Native
             */
            get: function () {
                return this.$frameRate;
            },
            set: function (value) {
                if (value == this.$frameRate) {
                    return;
                }
                this.$frameRate = value;
                this.frameIntervalTime = 1000 / this.$frameRate;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKMovieClip.prototype, "isPlaying", {
            /**
             * MovieClip 实例当前是否正在播放
             * @version Egret 2.4
             * @platform Web,Native
             */
            get: function () {
                return this.$isPlaying;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKMovieClip.prototype, "movieClipData", {
            /**
             * @version Egret 2.4
             * @platform Web,Native
             */
            get: function () {
                return this.$movieClipData;
            },
            /**
             * MovieClip数据源
             */
            set: function (value) {
                this.setMovieClipData(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         *
         * @param value
         */
        BKMovieClip.prototype.setMovieClipData = function (value) {
            if (this.$movieClipData == value) {
                return;
            }
            this.$movieClipData = value;
            this.$init();
        };
        /**
         * @private
         *
         * @param value
         */
        BKMovieClip.prototype.setPlayTimes = function (value) {
            if (value < 0 || value >= 1) {
                this.playTimes = value < 0 ? -1 : Math.floor(value);
            }
        };
        /**
         * @private
         *
         * @param value
         */
        BKMovieClip.prototype.setIsStopped = function (value) {
            if (this.isStopped == value) {
                return;
            }
            this.isStopped = value;
            if (value) {
                egret.ticker.$stopTick(this.advanceTime, this);
            }
            else {
                this.playTimes = this.playTimes == 0 ? 1 : this.playTimes;
                this.lastTime = egret.getTimer();
                egret.ticker.$startTick(this.advanceTime, this);
            }
        };
        return BKMovieClip;
    }(egret.BKDisplayObject));
    egret.BKMovieClip = BKMovieClip;
    __reflect(BKMovieClip.prototype, "egret.BKMovieClip");
    if (window['renderMode'] != 'webgl') {
        egret.MovieClip = BKMovieClip;
    }
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var BKPlayer = (function (_super) {
        __extends(BKPlayer, _super);
        function BKPlayer(options) {
            var _this = _super.call(this) || this;
            _this.stage = new egret.Stage();
            _this._mainTicker = BK.Director.ticker;
            _this._viewRect = new egret.Rectangle();
            _this._touch = new egret.sys.TouchHandler(_this.stage);
            // private readonly _root: BK.Node = new BK.Node();
            /**
             * @internal
             */
            _this._displayList = [];
            BKPlayer.instance = _this;
            _this._options = options;
            BK.Director.root.addChild(_this.stage._bkNode);
            egret.lifecycle.stage = _this.stage;
            egret.sys.$TempStage = _this.stage;
            _this.stage.$screen = _this;
            _this.stage.maxTouches = 10;
            _this.stage.frameRate = _this._options.frameRate;
            _this.stage.orientation = _this._options.orientation;
            _this.stage.scaleMode = _this._options.scaleMode;
            _this._mainTicker.add(function () {
                _this._touchHandler();
                egret.ticker.update();
                egret.ticker["callLaters"]();
                //
                for (var _i = 0, _a = _this._displayList; _i < _a.length; _i++) {
                    var displayObject = _a[_i];
                    displayObject.$getRenderNode();
                }
            }, _this);
            _this.updateScreenSize();
            _this.updateMaxTouches();
            //加入背景
            var tex = new BK.Texture('GameRes://resource/pixel.png');
            var background_node = new BK.Sprite(0, 0, tex, 0, 1, 1, 1);
            var rgb_str = options.background.toString(16);
            var red = parseInt(rgb_str.substring(0, 2), 16) / 255;
            var green = parseInt(rgb_str.substring(2, 4), 16) / 255;
            var blue = parseInt(rgb_str.substring(4, 6), 16) / 255;
            background_node.vertexColor = { r: red, g: green, b: blue, a: 1 };
            background_node.size = { width: _this.stage.stageWidth, height: _this.stage.stageHeight };
            background_node.position = { x: 0, y: -_this.stage.stageHeight };
            BK.Director.root.addChild(background_node);
            background_node.zOrder = 1;
            //
            var entryClassName = _this._options.entryClassName;
            //获取主类，加入场景
            var rootClass;
            if (entryClassName) {
                rootClass = egret.getDefinitionByName(entryClassName);
            }
            if (rootClass) {
                var rootContainer = new rootClass();
                if (rootContainer.addChild) {
                    _this.stage.addChild(rootContainer);
                }
                else {
                    true && egret.$error(1002, entryClassName);
                }
            }
            else {
                rootClass = global.Main;
                if (rootClass) {
                    var rootContainer = new rootClass();
                    if (rootContainer.addChild) {
                        _this.stage.addChild(rootContainer);
                    }
                    else {
                        true && egret.$error(1002, entryClassName);
                    }
                }
                else {
                    true && egret.$error(1001, entryClassName);
                }
            }
            return _this;
        }
        BKPlayer.prototype._touchHandler = function () {
            var touchEvents = BK.TouchEvent.getTouchEvent();
            if (!touchEvents || touchEvents.length === 0) {
                return;
            }
            for (var _i = 0, touchEvents_1 = touchEvents; _i < touchEvents_1.length; _i++) {
                var touchEvent = touchEvents_1[_i];
                var touchID = touchEvent.id;
                var screenPixelSize = BK.Director.screenPixelSize;
                var touchPosition = BK.Director.root.convertToNodeSpace(touchEvent);
                var touchX = touchPosition.x;
                var touchY = -touchPosition.y;
                if (touchEvent.status === 1) {
                    this._touch.onTouchEnd(touchX, touchY, touchID);
                }
                else if (touchEvent.status === 2) {
                    this._touch.onTouchBegin(touchX, touchY, touchID);
                }
                else if (touchEvent.status === 3) {
                    this._touch.onTouchMove(touchX, touchY, touchID);
                }
            }
            BK.TouchEvent.updateTouchStatus();
        };
        BKPlayer.prototype.updateScreenSize = function () {
            var screenPixelSize = BK.Director.screenPixelSize;
            var screenWidth = screenPixelSize.width;
            var screenHeight = screenPixelSize.height;
            egret.Capabilities['$boundingClientWidth'] = screenWidth;
            egret.Capabilities['$boundingClientHeight'] = screenHeight;
            var stageSize = egret.sys.screenAdapter.calculateStageSize(this.stage.$scaleMode, screenWidth, screenHeight, this._options.contentWidth, this._options.contentHeight);
            var stageWidth = stageSize.stageWidth;
            var stageHeight = stageSize.stageHeight;
            var displayWidth = stageSize.displayWidth;
            var displayHeight = stageSize.displayHeight;
            var top = (screenHeight - displayHeight) / 2;
            var left = (screenWidth - displayWidth) / 2;
            this.stage.$stageWidth = stageWidth;
            this.stage.$stageHeight = stageHeight;
            BK.Director.root.position = { x: left, y: BK.Director.screenPixelSize.height - top };
            BK.Director.root.scale = { x: displayWidth / stageWidth, y: displayHeight / stageHeight };
            // this._root.scale = { x: displayWidth / stageWidth, y: displayHeight / stageHeight };
            this._viewRect.setTo(left, top, stageWidth, stageHeight);
            // BK.Director.renderSize = { width: stageWidth, height: stageHeight }; // can not work
            this.stage.dispatchEventWith(egret.Event.RESIZE);
        };
        BKPlayer.prototype.setContentSize = function (width, height) {
            var option = this._options;
            option.contentWidth = width;
            option.contentHeight = height;
            this.updateScreenSize();
        };
        BKPlayer.prototype.updateMaxTouches = function () {
            this._touch.$initMaxTouches();
        };
        return BKPlayer;
    }(egret.HashObject));
    egret.BKPlayer = BKPlayer;
    __reflect(BKPlayer.prototype, "egret.BKPlayer", ["egret.sys.Screen"]);
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var BKRenderBuffer = (function () {
        function BKRenderBuffer(width, height) {
            this.surface = {};
            this.context = {};
            //保证rootCanvas是第一个创建的canvas
        }
        Object.defineProperty(BKRenderBuffer.prototype, "width", {
            /**
             * 渲染缓冲的宽度，以像素为单位。
             * @readOnly
             */
            get: function () {
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKRenderBuffer.prototype, "height", {
            /**
             * 渲染缓冲的高度，以像素为单位。
             * @readOnly
             */
            get: function () {
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 改变渲染缓冲的大小并清空缓冲区
         * @param width 改变后的宽
         * @param height 改变后的高
         * @param useMaxSize 若传入true，则将改变后的尺寸与已有尺寸对比，保留较大的尺寸。
         */
        BKRenderBuffer.prototype.resize = function (width, height, useMaxSize) {
        };
        /**
         * 获取指定区域的像素
         */
        BKRenderBuffer.prototype.getPixels = function (x, y, width, height) {
            if (width === void 0) { width = 1; }
            if (height === void 0) { height = 1; }
            return [];
        };
        /**
         * 转换成base64字符串，如果图片（或者包含的图片）跨域，则返回null
         * @param type 转换的类型，如: "image/png","image/jpeg"
         */
        BKRenderBuffer.prototype.toDataURL = function (type, encoderOptions) {
            return "";
        };
        /**
         * 清空缓冲区数据
         */
        BKRenderBuffer.prototype.clear = function () {
        };
        /**
         * 销毁绘制对象
         */
        BKRenderBuffer.prototype.destroy = function () {
        };
        return BKRenderBuffer;
    }());
    egret.BKRenderBuffer = BKRenderBuffer;
    __reflect(BKRenderBuffer.prototype, "egret.BKRenderBuffer", ["egret.sys.RenderBuffer"]);
    egret.sys.RenderBuffer = BKRenderBuffer;
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * RenderTexture is a dynamic texture
     * @extends egret.Texture
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/RenderTexture.ts
     * @language en_US
     */
    /**
     * RenderTexture 是动态纹理类，他实现了将显示对象及其子对象绘制成为一个纹理的功能
     * @extends egret.Texture
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/RenderTexture.ts
     * @language zh_CN
     */
    var BKRenderTexture = (function (_super) {
        __extends(BKRenderTexture, _super);
        function BKRenderTexture() {
            return _super.call(this) || this;
            // this.$renderBuffer = new sys.RenderBuffer(); // MD
            // let bitmapData = new egret.BitmapData(this.$renderBuffer.surface);
            // bitmapData.$deleteSource = false;
            // this._setBitmapData(bitmapData);
        }
        /**
         * The specified display object is drawn as a texture
         * @param displayObject {egret.DisplayObject} the display to draw
         * @param clipBounds {egret.Rectangle} clip rect
         * @param scale {number} scale factor
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 将指定显示对象绘制为一个纹理
         * @param displayObject {egret.DisplayObject} 需要绘制的显示对象
         * @param clipBounds {egret.Rectangle} 绘制矩形区域
         * @param scale {number} 缩放比例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        BKRenderTexture.prototype.drawToTexture = function (displayObject, clipBounds, scale) {
            if (scale === void 0) { scale = 1; }
            if (clipBounds && (clipBounds.width == 0 || clipBounds.height == 0)) {
                return false;
            }
            var bounds = clipBounds || displayObject.$getOriginalBounds();
            if (bounds.width == 0 || bounds.height == 0) {
                return false;
            }
            scale /= egret.$TextureScaleFactor;
            var width = (bounds.x + bounds.width) * scale;
            var height = (bounds.y + bounds.height) * scale;
            if (clipBounds) {
                width = bounds.width * scale;
                height = bounds.height * scale;
            }
            // MD
            var bitmapData;
            var bkNode = displayObject._bkNode;
            var parentBKNode = bkNode.parent;
            var bkTexture = BK.Texture.createTexture(width, height);
            displayObject.invalidUpdate();
            ////矩形平移后renderToTexture
            var old_matrix = displayObject.$getMatrix().clone();
            var matrix = egret.Matrix.create();
            var stageH = egret.lifecycle.stage.stageHeight;
            matrix.translate(-bounds.x, -bounds.y - bounds.height);
            displayObject.$setMatrix(matrix);
            displayObject.$getRenderNode();
            if (clipBounds) {
                //增加裁切节点，渲染贴图后再去掉
                var clipNode = new BK.ClipRectNode(0, 0, bounds.width, bounds.height);
                clipNode.position = { x: 0, y: 0 };
                var parent_3 = bkNode.parent;
                if (parent_3) {
                    bkNode.removeFromParent();
                }
                clipNode.addChild(bkNode);
                //裁切
                var subBKTexture = BK.Texture.createTexture(bounds.width, bounds.height);
                BK.Render.renderToTexture(clipNode, subBKTexture);
                //还原
                bkNode.removeFromParent();
                if (parent_3) {
                    parent_3.addChild(bkNode);
                }
                displayObject.$setMatrix(old_matrix);
                displayObject.$getRenderNode();
                bitmapData = new egret.BKBitmapData(subBKTexture, true);
            }
            else {
                BK.Render.renderToTexture(bkNode, bkTexture);
                //还原displayobject位置
                displayObject.$setMatrix(old_matrix);
                displayObject.$getRenderNode();
                bitmapData = new egret.BKBitmapData(bkTexture, true);
            }
            // bitmapData.$deleteSource = false;
            this._setBitmapData(bitmapData);
            this.$bitmapData.width = width;
            this.$bitmapData.height = height;
            // MD END
            // if (egret.nativeRender) {
            //     egret_native.activateBuffer(this.$renderBuffer);
            //     let useClip = false;
            //     let clipX = 0;
            //     let clipY = 0;
            //     let clipW = 0;
            //     let clipH = 0;
            //     if (clipBounds) {
            //         useClip = true;
            //         clipX = clipBounds.x;
            //         clipY = clipBounds.y;
            //         clipW = clipBounds.width;
            //         clipH = clipBounds.height;
            //     }
            //     egret_native.updateNativeRender();
            //     egret_native.nrRenderDisplayObject(displayObject.$nativeDisplayObject.id, scale, useClip, clipX, clipY, clipW, clipH);
            //     egret_native.activateBuffer(null);
            // }
            // else {
            //     let matrix = Matrix.create();
            //     matrix.identity();
            //     //应用裁切
            //     if (clipBounds) {
            //         matrix.translate(-clipBounds.x, -clipBounds.y);
            //     }
            //     matrix.scale(scale, scale);
            //     sys.systemRenderer.render(displayObject, renderBuffer, matrix, true);
            //     Matrix.release(matrix);
            // }
            //设置纹理参数
            this.$initData(0, 0, width, height, 0, 0, width, height, width, height);
            return true;
        };
        /**
         * @inheritDoc
         */
        BKRenderTexture.prototype.getPixel32 = function (x, y) {
            var data;
            // if (this.$renderBuffer) {
            //     let scale = $TextureScaleFactor;
            //     x = Math.round(x / scale);
            //     y = Math.round(y / scale);
            //     data = this.$renderBuffer.getPixels(x, y, 1, 1);
            // }
            return data;
        };
        /**
         * @inheritDoc
         */
        BKRenderTexture.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.$renderBuffer = null;
        };
        return BKRenderTexture;
    }(egret.Texture));
    egret.BKRenderTexture = BKRenderTexture;
    __reflect(BKRenderTexture.prototype, "egret.BKRenderTexture");
    if (window['renderMode'] != 'webgl') {
        egret.RenderTexture = egret.BKRenderTexture;
    }
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * This class is used to create lightweight shapes using the drawing application program interface (API). The Shape
     * class includes a graphics property, which lets you access methods from the Graphics class.
     * @see egret.Graphics
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Shape.ts
     * @language en_US
     */
    /**
     * 此类用于使用绘图应用程序编程接口 (API) 创建简单形状。Shape 类含有 graphics 属性，通过该属性您可以访问各种矢量绘图方法。
     * @see egret.Graphics
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Shape.ts
     * @language zh_CN
     */
    var BKShape = (function (_super) {
        __extends(BKShape, _super);
        /**
         * Creates a new Shape object.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建一个 Shape 对象
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        function BKShape() {
            var _this = _super.call(this) || this;
            _this.$graphics = new egret.Graphics();
            _this.$graphics.$setTarget(_this);
            return _this;
        }
        Object.defineProperty(BKShape.prototype, "graphics", {
            /**
             * Specifies the Graphics object belonging to this Shape object, where vector drawing commands can occur.
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 获取 Shape 中的 Graphics 对象。可通过此对象执行矢量绘图命令。
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$graphics;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         */
        BKShape.prototype.$measureContentBounds = function (bounds) {
            this.$graphics.$measureContentBounds(bounds);
        };
        BKShape.prototype.$hitTest = function (stageX, stageY) {
            var target = _super.prototype.$hitTest.call(this, stageX, stageY);
            if (target == this) {
                target = this.$graphics.$hitTest(stageX, stageY);
            }
            return target;
        };
        /**
         * @private
         */
        BKShape.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            if (this.$graphics) {
                this.$graphics.$onRemoveFromStage();
            }
        };
        return BKShape;
    }(egret.BKDisplayObject));
    egret.BKShape = BKShape;
    __reflect(BKShape.prototype, "egret.BKShape");
    if (window['renderMode'] != 'webgl') {
        egret.Shape = egret.BKShape;
    }
})(egret || (egret = {}));
var egret;
(function (egret) {
    var BKSound = (function (_super) {
        __extends(BKSound, _super);
        function BKSound() {
            var _this = _super.call(this) || this;
            _this.type = egret.Sound.EFFECT;
            return _this;
        }
        BKSound.prototype.load = function (url) {
            this.url = url;
            if (BK.FileUtil.isFileExist(this.url)) {
                egret.$callAsync(egret.Event.dispatchEvent, egret.Event, this, egret.Event.COMPLETE);
            }
            else {
                egret.$callAsync(egret.Event.dispatchEvent, egret.IOErrorEvent, this, egret.IOErrorEvent.IO_ERROR);
            }
        };
        BKSound.prototype.play = function (startTime, loops) {
            if (startTime === void 0) { startTime = 0; }
            if (loops === void 0) { loops = 0; }
            var channel = new egret.BKSoundChannel();
            channel.$loops = loops;
            channel.$startTime = startTime;
            channel.$type = this.type;
            channel.$url = this.url;
            channel.$play();
            return channel;
        };
        BKSound.prototype.close = function () {
        };
        /**
         * Background music
         * @default "music"
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 背景音乐
         * @default "music"
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        BKSound.MUSIC = "music";
        /**
         * EFFECT
         * @default "effect"
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 音效
         * @default "effect"
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        BKSound.EFFECT = "effect";
        return BKSound;
    }(egret.EventDispatcher));
    egret.BKSound = BKSound;
    __reflect(BKSound.prototype, "egret.BKSound", ["egret.Sound"]);
    egret.Sound = BKSound;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var BKSoundChannel = (function (_super) {
        __extends(BKSoundChannel, _super);
        function BKSoundChannel() {
            return _super.call(this) || this;
        }
        BKSoundChannel.prototype.$play = function () {
            var _type;
            switch (this.$type) {
                case egret.Sound.MUSIC:
                    _type = 0;
                    break;
                case egret.Sound.EFFECT:
                    _type = 1;
                    break;
            }
            var loops = this.$loops === 0 ? -1 : this.$loops;
            var musicPath = this.$url.indexOf("GameRes://") >= 0 ? this.$url : "GameRes://" + this.$url;
            // BK.Audio.switch = true;
            this._bkAudio = new BK.Audio(_type, musicPath, loops, 0);
            this._bkAudio.startMusic();
        };
        BKSoundChannel.prototype.stop = function () {
            this._bkAudio.stopMusic();
        };
        return BKSoundChannel;
    }(egret.EventDispatcher));
    egret.BKSoundChannel = BKSoundChannel;
    __reflect(BKSoundChannel.prototype, "egret.BKSoundChannel", ["egret.SoundChannel", "egret.IEventDispatcher"]);
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * The Sprite class is a basic display list building block: a display list node that can contain children.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Sprite.ts
     * @language en_US
     */
    /**
     * Sprite 类是基本显示列表构造块：一个可包含子项的显示列表节点。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Sprite.ts
     * @language zh_CN
     */
    var BKSprite = (function (_super) {
        __extends(BKSprite, _super);
        /**
         * Creates a new Sprite instance.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 实例化一个容器
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        function BKSprite() {
            var _this = _super.call(this) || this;
            _this.$graphics = new egret.Graphics();
            _this.$graphics.$setTarget(_this);
            return _this;
        }
        Object.defineProperty(BKSprite.prototype, "graphics", {
            /**
             * Specifies the Graphics object belonging to this Shape object, where vector drawing commands can occur.
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 获取 Shape 中的 Graphics 对象。可通过此对象执行矢量绘图命令。
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$graphics;
            },
            enumerable: true,
            configurable: true
        });
        BKSprite.prototype.$hitTest = function (stageX, stageY) {
            if (!this.$visible) {
                return null;
            }
            var m = this.$getInvertedConcatenatedMatrix();
            var localX = m.a * stageX + m.c * stageY + m.tx;
            var localY = m.b * stageX + m.d * stageY + m.ty;
            var rect = this.$scrollRect ? this.$scrollRect : this.$maskRect;
            if (rect && !rect.contains(localX, localY)) {
                return null;
            }
            if (this.$mask && !this.$mask.$hitTest(stageX, stageY)) {
                return null;
            }
            var children = this.$children;
            var found = false;
            var target = null;
            for (var i = children.length - 1; i >= 0; i--) {
                var child = children[i];
                if (child.$maskedObject) {
                    continue;
                }
                target = child.$hitTest(stageX, stageY);
                if (target) {
                    found = true;
                    if (target.$touchEnabled) {
                        break;
                    }
                    else {
                        target = null;
                    }
                }
            }
            if (target) {
                if (this.$touchChildren) {
                    return target;
                }
                return this;
            }
            if (found) {
                return this;
            }
            target = egret.DisplayObject.prototype.$hitTest.call(this, stageX, stageY);
            if (target) {
                target = this.$graphics.$hitTest(stageX, stageY);
            }
            return target;
        };
        /**
         * @private
         */
        BKSprite.prototype.$measureContentBounds = function (bounds) {
            this.$graphics.$measureContentBounds(bounds);
        };
        /**
         * @private
         */
        BKSprite.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            if (this.$graphics) {
                this.$graphics.$onRemoveFromStage();
            }
        };
        return BKSprite;
    }(egret.BKDisplayObjectContainer));
    egret.BKSprite = BKSprite;
    __reflect(BKSprite.prototype, "egret.BKSprite");
    if (window['renderMode'] != 'webgl') {
        egret.Sprite = egret.BKSprite;
    }
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * The Stage class represents the main drawing area.The Stage object is not globally accessible. You need to access
     * it through the stage property of a DisplayObject instance.<br/>
     * The Stage class has several ancestor classes — Sprite, DisplayObject, and EventDispatcher — from which it inherits
     * properties and methods. Many of these properties and methods are inapplicable to Stage objects.
     * @event egret.Event.RESIZE Dispatched when the stageWidth or stageHeight property of the Stage object is changed.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Stage.ts
     * @language en_US
     */
    /**
     * Stage 类代表主绘图区。
     * 可以利用 DisplayObject 实例的 stage 属性进行访问。<br/>
     * Stage 类具有多个祖代类: Sprite、DisplayObject 和 EventDispatcher，属性和方法便是从这些类继承而来的。
     * 从这些继承的许多属性和方法不适用于 Stage 对象。
     * @event egret.Event.RESIZE 当stageWidth或stageHeight属性发生改变时调度
     * @event egret.Event.DEACTIVATE 当stage失去焦点后调度
     * @event egret.Event.ACTIVATE 当stage获得焦点后调度
     *
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Stage.ts
     * @language zh_CN
     */
    var BKStage = (function (_super) {
        __extends(BKStage, _super);
        /**
         * @private
         * Stage不许允许自行实例化
         * @version Egret 2.4
         * @platform Web,Native
         */
        function BKStage() {
            var _this = _super.call(this) || this;
            /**
             * @private
             */
            _this.$stageWidth = 0;
            /**
             * @private
             */
            _this.$stageHeight = 0;
            _this.$scaleMode = egret.StageScaleMode.SHOW_ALL;
            _this.$orientation = egret.OrientationMode.AUTO;
            _this.$maxTouches = 99;
            _this.$stage = _this;
            _this.$nestLevel = 1;
            return _this;
        }
        Object.defineProperty(BKStage.prototype, "frameRate", {
            /**
             * Gets and sets the frame rate of the stage. The frame rate is defined as frames per second. Valid range for the
             * frame rate is from 0.01 to 1000 frames per second.<br/>
             * Note: setting the frameRate property of one Stage object changes the frame rate for all Stage objects
             * @default 30
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 获取并设置舞台的帧速率。帧速率是指每秒显示的帧数。帧速率的有效范围为每秒 0.01 到 60 个帧。<br/>
             * 注意: 修改任何一个Stage的frameRate属性都会同步修改其他Stage的帧率。
             * @default 30
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return egret.ticker.$frameRate;
            },
            set: function (value) {
                egret.ticker.$setFrameRate(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKStage.prototype, "stageWidth", {
            /**
             * Indicates the width of the stage, in pixels.
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 舞台的当前宽度（以像素为单位）。
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$stageWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKStage.prototype, "stageHeight", {
            /**
             * Indicates the height of the stage, in pixels.
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 舞台的当前高度（以像素为单位）。
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$stageHeight;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * After you call the invalidate() method, when the display list is next rendered, the Egret runtime sends a render
         * event to each display object that has registered to listen for the render event. You must call the invalidate()
         * method each time you want the Egret runtime to send render events.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 调用 invalidate() 方法后，在显示列表下次呈现时，Egret 会向每个已注册侦听 Event.RENDER 事件的显示对象发送一个 Event.RENDER 事件。
         * 每次您希望 Egret 发送 Event.RENDER 事件时，都必须调用 invalidate() 方法。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        BKStage.prototype.invalidate = function () {
            egret.sys.$invalidateRenderFlag = true;
        };
        /**
         * @deprecated
         */
        BKStage.prototype.registerImplementation = function (interfaceName, instance) {
            egret.registerImplementation(interfaceName, instance);
        };
        /**
         * @deprecated
         */
        BKStage.prototype.getImplementation = function (interfaceName) {
            return egret.getImplementation(interfaceName);
        };
        Object.defineProperty(BKStage.prototype, "scaleMode", {
            /**
             * A StageScaleMode class that specifies which scale mode to use. The following are valid values:<br/>
             * <ul>
             * <li>StageScaleMode.EXACT_FIT -- The entire application be visible in the specified area without trying to preserve the original aspect ratio. Distortion can occur, the application may be stretched or compressed.</li>
             * <li>StageScaleMode.SHOW_ALL -- The entire application is visible in the specified area without distortion while maintaining the application of the original aspect ratio. Applications may display border.</li>
             * <li>StageScaleMode.NO_SCALE -- The size of the entire application is fixed, so that even if the size of the player window changes, it remains unchanged. If the player window is smaller than the content, it may do some trimming.</li>
             * <li>StageScaleMode.NO_BORDER -- Keep the original aspect ratio scaling application content, after scaling a narrow direction of application content to fill the viewport players on both sides in the other direction may exceed the viewport and the player is cut.</li>
             * <li>StageScaleMode.FIXED_WIDTH -- Keep the original aspect ratio scaling application content, after scaling application content in the horizontal and vertical directions to fill the viewport player, but only to keep the contents of the original application constant width, height may change.</li>
             * <li>StageScaleMode.FIXED_HEIGHT -- Keep the original aspect ratio scaling application content, after scaling application content in the horizontal and vertical directions to fill the viewport player, but only to keep the contents of the original application constant height, width may change.</li>
             * </ul>
             * @default egret.StageScaleMode.SHOW_ALL
             * @language en_US
             */
            /**
             * 一个 StageScaleMode 类中指定要使用哪种缩放模式的值。以下是有效值：<br/>
             * <ul>
             * <li>StageScaleMode.EXACT_FIT -- 整个应用程序在指定区域中可见，但不尝试保持原始高宽比。可能会发生扭曲，应用程序可能会拉伸或压缩显示。</li>
             * <li>StageScaleMode.SHOW_ALL -- 整个应用程序在指定区域中可见，且不发生扭曲，同时保持应用程序的原始高宽比。应用程序的可能会显示边框。</li>
             * <li>StageScaleMode.NO_SCALE -- 整个应用程序的大小固定，因此，即使播放器窗口的大小更改，它也会保持不变。如果播放器窗口比内容小，则可能进行一些裁切。</li>
             * <li>StageScaleMode.NO_BORDER -- 保持原始宽高比缩放应用程序内容，缩放后应用程序内容的较窄方向填满播放器视口，另一个方向的两侧可能会超出播放器视口而被裁切。</li>
             * <li>StageScaleMode.FIXED_WIDTH -- 保持原始宽高比缩放应用程序内容，缩放后应用程序内容在水平和垂直方向都填满播放器视口，但只保持应用程序内容的原始宽度不变，高度可能会改变。</li>
             * <li>StageScaleMode.FIXED_HEIGHT -- 保持原始宽高比缩放应用程序内容，缩放后应用程序内容在水平和垂直方向都填满播放器视口，但只保持应用程序内容的原始高度不变，宽度可能会改变。</li>
             * </ul>
             * @default egret.StageScaleMode.SHOW_ALL
             * @language zh_CN
             */
            get: function () {
                return this.$scaleMode;
            },
            set: function (value) {
                if (this.$scaleMode == value) {
                    return;
                }
                this.$scaleMode = value;
                this.$screen.updateScreenSize();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKStage.prototype, "orientation", {
            /**
             * Horizontal and vertical screen display screen, can only be set under the current Native in the configuration file. A egret.OrientationMode class that specifies which display mode to use. The following are valid values:<br/>
             * <ul>
             * <li>egret.OrientationMode.AUTO -- Always follow the direction of application display screen, always guaranteed by the look down.</li>
             * <li>egret.OrientationMode.PORTRAIT -- Applications remain portrait mode, namely horizontal screen look, the screen from left to right.</li>
             * <li>egret.OrientationMode.LANDSCAPE -- Applications remain horizontal screen mode, namely vertical screen, the screen from right to left.</li>
             * <li>egret.OrientationMode.LANDSCAPE_FLIPPED -- Applications remain horizontal screen mode, namely vertical screen, the screen from left to right.</li>
             * </ul>
             * @platform Web
             * @version 2.4
             * @language en_US
             */
            /**
             * 屏幕横竖屏显示方式，目前 Native 下只能在配置文件里设置。一个 egret.OrientationMode 类中指定要使用哪种显示方式。以下是有效值：<br/>
             * <ul>
             * <li>egret.OrientationMode.AUTO -- 应用始终跟随屏幕的方向显示，始终保证由上往下看。</li>
             * <li>egret.OrientationMode.PORTRAIT -- 应用始终保持竖屏模式，即横屏看时，屏幕由左往右看。</li>
             * <li>egret.OrientationMode.LANDSCAPE -- 应用始终保持横屏模式，即竖屏看时，屏幕显示由右往左。</li>
             * <li>egret.OrientationMode.LANDSCAPE_FLIPPED -- 应用始终保持横屏模式，即竖屏看时，屏幕显示由左往右。</li>
             * </ul>
             * @platform Web
             * @version 2.4
             * @language zh_CN
             */
            get: function () {
                return this.$orientation;
            },
            set: function (value) {
                if (this.$orientation == value) {
                    return;
                }
                this.$orientation = value;
                this.$screen.updateScreenSize();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKStage.prototype, "textureScaleFactor", {
            /**
             * Draw texture zoom ratio
             * @default 1
             * @language en_US
             */
            /**
             * 绘制纹理的缩放比率，默认值为1
             * @default 1
             * @language zh_CN
             */
            get: function () {
                return egret.$TextureScaleFactor;
            },
            set: function (value) {
                egret.$TextureScaleFactor = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKStage.prototype, "maxTouches", {
            /**
             * Set the number of screens can simultaneously touch. Above this amount will not be triggered in response.
             * @default 99
             * @language en_US
             */
            /**
             * 设置屏幕同时可以触摸的数量。高于这个数量将不会被触发响应。
             * @default 99
             * @language zh_CN
             */
            get: function () {
                return this.$maxTouches;
            },
            set: function (value) {
                if (this.$maxTouches == value) {
                    return;
                }
                this.$maxTouches = value;
                this.$screen.updateMaxTouches();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKStage.prototype, "dirtyRegionPolicy", {
            get: function () {
                return null;
            },
            /**
             * @private
             */
            set: function (policy) {
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Set resolution size
         * @param width width
         * @param height height
         * @version Egret 2.5.5
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 设置分辨率尺寸
         * @param width 宽度
         * @param height 高度
         * @version Egret 2.5.5
         * @platform Web,Native
         * @language zh_CN
         */
        BKStage.prototype.setContentSize = function (width, height) {
            this.$screen.setContentSize(width, height);
        };
        return BKStage;
    }(egret.BKDisplayObjectContainer));
    egret.BKStage = BKStage;
    __reflect(BKStage.prototype, "egret.BKStage");
    if (true) {
        egret.$markCannotUse(egret.Stage, "alpha", 1);
        egret.$markCannotUse(egret.Stage, "visible", true);
        egret.$markCannotUse(egret.Stage, "x", 0);
        egret.$markCannotUse(egret.Stage, "y", 0);
        egret.$markCannotUse(egret.Stage, "scaleX", 1);
        egret.$markCannotUse(egret.Stage, "scaleY", 1);
        egret.$markCannotUse(egret.Stage, "rotation", 0);
        egret.$markCannotUse(egret.Stage, "cacheAsBitmap", false);
        egret.$markCannotUse(egret.Stage, "scrollRect", null);
        egret.$markCannotUse(egret.Stage, "filters", null);
        egret.$markCannotUse(egret.Stage, "blendMode", null);
        egret.$markCannotUse(egret.Stage, "touchEnabled", true);
        egret.$markCannotUse(egret.Stage, "matrix", null);
    }
    if (window['renderMode'] != 'webgl') {
        egret.Stage = egret.BKStage;
    }
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var BKSystemRenderer = (function () {
        function BKSystemRenderer() {
        }
        BKSystemRenderer.prototype.render = function (displayObject, buffer, matrix, forRenderTexture) {
            return 0;
        };
        BKSystemRenderer.prototype.drawNodeToBuffer = function (node, buffer, matrix, forHitTest) {
        };
        return BKSystemRenderer;
    }());
    egret.BKSystemRenderer = BKSystemRenderer;
    __reflect(BKSystemRenderer.prototype, "egret.BKSystemRenderer", ["egret.sys.SystemRenderer"]);
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var SplitRegex = new RegExp("(?=[\\u00BF-\\u1FFF\\u2C00-\\uD7FF]|\\b|\\s)(?![。，！、》…）)}”】\\.\\,\\!\\?\\]\\:])");
    /**
     * @private
     * 根据样式测量文本宽度
     */
    function measureTextWidth(text, values, style) {
        style = style || {};
        var italic = style.italic == null ? values[16 /* italic */] : style.italic;
        var bold = style.bold == null ? values[15 /* bold */] : style.bold;
        var size = style.size == null ? values[0 /* fontSize */] : style.size;
        var fontFamily = style.fontFamily || values[8 /* fontFamily */] || egret.TextField.default_fontFamily;
        return egret.sys.measureText(text, fontFamily, size, bold, italic);
    }
    /**
     * TextField is the text rendering class of egret. It conducts rendering by using the browser / device API. Due to different ways of font rendering in different browsers / devices, there may be differences in the rendering
     * If developers expect  no differences among all platforms, please use BitmapText
     * @see http://edn.egret.com/cn/docs/page/141 Create Text
     *
     * @event egret.Event.CHANGE Dispatched when entering text user input。
     * @event egret.FocusEvent.FOCUS_IN Dispatched after the focus to enter text.
     * @event egret.FocusEvent.FOCUS_OUT Enter the text loses focus after dispatch.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/text/TextField.ts
     * @language en_US
     */
    /**
     * TextField是egret的文本渲染类，采用浏览器/设备的API进行渲染，在不同的浏览器/设备中由于字体渲染方式不一，可能会有渲染差异
     * 如果开发者希望所有平台完全无差异，请使用BitmapText
     * @see http://edn.egret.com/cn/docs/page/141 创建文本
     *
     * @event egret.Event.CHANGE 输入文本有用户输入时调度。
     * @event egret.FocusEvent.FOCUS_IN 聚焦输入文本后调度。
     * @event egret.FocusEvent.FOCUS_OUT 输入文本失去焦点后调度。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/text/TextField.ts
     * @language zh_CN
     */
    var BKTextField = (function (_super) {
        __extends(BKTextField, _super);
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        function BKTextField() {
            var _this = _super.call(this) || this;
            _this.$inputEnabled = false;
            /**
             * @private
             */
            _this.inputUtils = null;
            /**
             * @private
             */
            _this.graphicsNode = null;
            /**
             * @private
             */
            _this.isFlow = false;
            /**
             * @private
             */
            _this.textArr = [];
            /**
             * @private
             */
            _this.linesArr = [];
            /**
             * @private
             */
            _this.$isTyping = false;
            // MD
            _this._bkNodes = [];
            // super();
            // let textNode = new sys.TextNode();
            // textNode.fontFamily = TextField.default_fontFamily;
            // this.textNode = textNode;
            // this.$renderNode = textNode;
            _this.$TextField = {
                0: egret.TextField.default_size,
                1: 0,
                2: egret.TextField.default_textColor,
                3: NaN,
                4: NaN,
                5: 0,
                6: 0,
                7: 0,
                8: egret.TextField.default_fontFamily,
                9: "left",
                10: "top",
                11: "#ffffff",
                12: "",
                13: "",
                14: [],
                15: false,
                16: false,
                17: true,
                18: false,
                19: false,
                20: false,
                21: 0,
                22: 0,
                23: 0,
                24: egret.TextFieldType.DYNAMIC,
                25: 0x000000,
                26: "#000000",
                27: 0,
                28: -1,
                29: 0,
                30: false,
                31: false,
                32: 0x000000,
                33: false,
                34: 0xffffff,
                35: null,
                36: null,
                37: egret.TextFieldInputType.TEXT //inputType
            };
            return _this;
            // this.$TextField[sys.TextKeys.lineSpacing] = 10; // MD
        }
        /**
         * @private
         */
        BKTextField.prototype.isInput = function () {
            return this.$TextField[24 /* type */] == egret.TextFieldType.INPUT;
        };
        BKTextField.prototype.$setTouchEnabled = function (value) {
            _super.prototype.$setTouchEnabled.call(this, value);
            if (this.isInput()) {
                this.$inputEnabled = true;
            }
        };
        Object.defineProperty(BKTextField.prototype, "fontFamily", {
            /**
             * The name of the font to use, or a comma-separated list of font names.
             * @default "Arial"
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 要使用的字体的名称或用逗号分隔的字体名称列表。
             * @default "Arial"
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$TextField[8 /* fontFamily */];
            },
            set: function (value) {
                this.$setFontFamily(value);
            },
            enumerable: true,
            configurable: true
        });
        BKTextField.prototype.$setFontFamily = function (value) {
            var values = this.$TextField;
            if (values[8 /* fontFamily */] == value) {
                return false;
            }
            values[8 /* fontFamily */] = value;
            this.invalidateFontString();
            return true;
        };
        Object.defineProperty(BKTextField.prototype, "size", {
            /**
             * The size in pixels of text
             * @default 30
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 文本的字号大小。
             * @default 30
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$TextField[0 /* fontSize */];
            },
            set: function (value) {
                this.$setSize(value);
            },
            enumerable: true,
            configurable: true
        });
        BKTextField.prototype.$setSize = function (value) {
            value = +value || 0;
            var values = this.$TextField;
            if (values[0 /* fontSize */] == value) {
                return false;
            }
            values[0 /* fontSize */] = value;
            this.invalidateFontString();
            // MD
            this._transformDirty = true;
            return true;
        };
        Object.defineProperty(BKTextField.prototype, "bold", {
            /**
             * Specifies whether the text is boldface.
             * @default false
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 是否显示为粗体。
             * @default false
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$TextField[15 /* bold */];
            },
            set: function (value) {
                this.$setBold(value);
            },
            enumerable: true,
            configurable: true
        });
        BKTextField.prototype.$setBold = function (value) {
            value = !!value;
            var values = this.$TextField;
            if (value == values[15 /* bold */]) {
                return false;
            }
            values[15 /* bold */] = value;
            this.invalidateFontString();
            // MD
            this._transformDirty = true;
            return true;
        };
        Object.defineProperty(BKTextField.prototype, "italic", {
            /**
             * Determines whether the text is italic font.
             * @default false
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 是否显示为斜体。
             * @default false
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$TextField[16 /* italic */];
            },
            set: function (value) {
                this.$setItalic(value);
            },
            enumerable: true,
            configurable: true
        });
        BKTextField.prototype.$setItalic = function (value) {
            value = !!value;
            var values = this.$TextField;
            if (value == values[16 /* italic */]) {
                return false;
            }
            values[16 /* italic */] = value;
            this.invalidateFontString();
            // MD
            this._transformDirty = true;
            return true;
        };
        /**
         * @private
         *
         */
        BKTextField.prototype.invalidateFontString = function () {
            this.$TextField[17 /* fontStringChanged */] = true;
            this.$invalidateTextField();
        };
        Object.defineProperty(BKTextField.prototype, "textAlign", {
            /**
             * Horizontal alignment of text.
             * @default：egret.HorizontalAlign.LEFT
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 文本的水平对齐方式。
             * @default：egret.HorizontalAlign.LEFT
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$TextField[9 /* textAlign */];
            },
            set: function (value) {
                this.$setTextAlign(value);
            },
            enumerable: true,
            configurable: true
        });
        BKTextField.prototype.$setTextAlign = function (value) {
            var values = this.$TextField;
            if (values[9 /* textAlign */] == value) {
                return false;
            }
            values[9 /* textAlign */] = value;
            this.$invalidateTextField();
            return true;
        };
        Object.defineProperty(BKTextField.prototype, "verticalAlign", {
            /**
             * Vertical alignment of text.
             * @default：egret.VerticalAlign.TOP
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 文字的垂直对齐方式。
             * @default：egret.VerticalAlign.TOP
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$TextField[10 /* verticalAlign */];
            },
            set: function (value) {
                this.$setVerticalAlign(value);
            },
            enumerable: true,
            configurable: true
        });
        BKTextField.prototype.$setVerticalAlign = function (value) {
            var values = this.$TextField;
            if (values[10 /* verticalAlign */] == value) {
                return false;
            }
            values[10 /* verticalAlign */] = value;
            this.$invalidateTextField();
            return true;
        };
        Object.defineProperty(BKTextField.prototype, "lineSpacing", {
            /**
             * An integer representing the amount of vertical space between lines.
             * @default 0
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 一个整数，表示行与行之间的垂直间距量
             * @default 0
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$TextField[1 /* lineSpacing */];
            },
            set: function (value) {
                this.$setLineSpacing(value);
            },
            enumerable: true,
            configurable: true
        });
        BKTextField.prototype.$setLineSpacing = function (value) {
            value = +value || 0;
            var values = this.$TextField;
            if (values[1 /* lineSpacing */] == value)
                return false;
            values[1 /* lineSpacing */] = value;
            this.$invalidateTextField();
            return true;
        };
        Object.defineProperty(BKTextField.prototype, "textColor", {
            /**
             * Color of the text.
             * @default 0x000000
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 文本颜色
             * @default 0x000000
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$TextField[2 /* textColor */];
            },
            set: function (value) {
                this.$setTextColor(value);
            },
            enumerable: true,
            configurable: true
        });
        BKTextField.prototype.$setTextColor = function (value) {
            value = +value | 0;
            var values = this.$TextField;
            if (values[2 /* textColor */] == value) {
                return false;
            }
            values[2 /* textColor */] = value;
            if (this.inputUtils) {
                this.inputUtils._setColor(this.$TextField[2 /* textColor */]);
            }
            this.$invalidateTextField();
            return true;
        };
        Object.defineProperty(BKTextField.prototype, "wordWrap", {
            /**
             * A Boolean value that indicates whether the text field word wrap. If the value is true, then the text field by word wrap;
             * if the value is false, the text field by newline characters.
             * @default false
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 一个布尔值，表示文本字段是否按单词换行。如果值为 true，则该文本字段按单词换行；
             * 如果值为 false，则该文本字段按字符换行。
             * @default false
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$TextField[19 /* wordWrap */];
            },
            set: function (value) {
                this.$setWordWrap(value);
            },
            enumerable: true,
            configurable: true
        });
        BKTextField.prototype.$setWordWrap = function (value) {
            value = !!value;
            var values = this.$TextField;
            if (value == values[19 /* wordWrap */]) {
                return;
            }
            if (values[20 /* displayAsPassword */]) {
                return;
            }
            values[19 /* wordWrap */] = value;
            this.$invalidateTextField();
        };
        Object.defineProperty(BKTextField.prototype, "type", {
            /**
             * @version Egret 2.4
             * @platform Web,Native
             */
            get: function () {
                return this.$TextField[24 /* type */];
            },
            /**
             * Type of the text field.
             * Any one of the following TextFieldType constants: TextFieldType.DYNAMIC (specifies the dynamic text field that users can not edit), or TextFieldType.INPUT (specifies the dynamic text field that users can edit).
             * @default egret.TextFieldType.DYNAMIC
             * @language en_US
             */
            /**
             * 文本字段的类型。
             * 以下 TextFieldType 常量中的任一个：TextFieldType.DYNAMIC（指定用户无法编辑的动态文本字段），或 TextFieldType.INPUT（指定用户可以编辑的输入文本字段）。
             * @default egret.TextFieldType.DYNAMIC
             * @language zh_CN
             */
            set: function (value) {
                this.$setType(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         *
         * @param value
         */
        BKTextField.prototype.$setType = function (value) {
            var values = this.$TextField;
            if (values[24 /* type */] != value) {
                values[24 /* type */] = value;
                if (value == egret.TextFieldType.INPUT) {
                    if (isNaN(values[3 /* textFieldWidth */])) {
                        this.$setWidth(100);
                    }
                    if (isNaN(values[4 /* textFieldHeight */])) {
                        this.$setHeight(30);
                    }
                    this.$setTouchEnabled(true);
                    //创建stageText
                    if (this.inputUtils == null) {
                        this.inputUtils = new egret.InputController();
                    }
                    this.inputUtils.init(this);
                    this.$invalidateTextField();
                    if (this.$stage) {
                        this.inputUtils._addStageText();
                    }
                }
                else {
                    if (this.inputUtils) {
                        this.inputUtils._removeStageText();
                        this.inputUtils = null;
                    }
                    this.$setTouchEnabled(false);
                }
                return true;
            }
            return false;
        };
        Object.defineProperty(BKTextField.prototype, "inputType", {
            /**
             * @version Egret 3.1.2
             * @platform Web,Native
             */
            get: function () {
                return this.$TextField[37 /* inputType */];
            },
            /**
             * Pop-up keyboard type.
             * Any of a TextFieldInputType constants.
             * @language en_US
             */
            /**
             * 弹出键盘的类型。
             * TextFieldInputType 常量中的任一个。
             * @language zh_CN
             */
            set: function (value) {
                this.$TextField[37 /* inputType */] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKTextField.prototype, "text", {
            /**
             * @version Egret 2.4
             * @platform Web,Native
             */
            get: function () {
                return this.$getText();
            },
            /**
             * Serve as a string of the current text field in the text
             * @language en_US
             */
            /**
             * 作为文本字段中当前文本的字符串
             * @language zh_CN
             */
            set: function (value) {
                this.$setText(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         *
         * @returns
         */
        BKTextField.prototype.$getText = function () {
            if (this.$TextField[24 /* type */] == egret.TextFieldType.INPUT) {
                return this.inputUtils._getText();
            }
            return this.$TextField[13 /* text */];
        };
        /**
         * @private
         *
         * @param value
         */
        BKTextField.prototype.$setBaseText = function (value) {
            if (value == null) {
                value = "";
            }
            value = value.toString();
            this.isFlow = false;
            var values = this.$TextField;
            if (values[13 /* text */] != value) {
                this.$invalidateTextField();
                values[13 /* text */] = value;
                var text = "";
                if (values[20 /* displayAsPassword */]) {
                    text = this.changeToPassText(value);
                }
                else {
                    text = value;
                }
                this.setMiddleStyle([{ text: text }]);
                // MD
                this._transformDirty = true;
                return true;
            }
            return false;
        };
        /**
         * @private
         *
         * @param value
         */
        BKTextField.prototype.$setText = function (value) {
            if (value == null) {
                value = "";
            }
            var result = this.$setBaseText(value);
            if (this.inputUtils) {
                this.inputUtils._setText(this.$TextField[13 /* text */]);
            }
            return result;
        };
        Object.defineProperty(BKTextField.prototype, "displayAsPassword", {
            /**
             * Specify whether the text field is a password text field.
             * If the value of this property is true, the text field is treated as a password text field and hides the input characters using asterisks instead of the actual characters. If false, the text field is not treated as a password text field.
             * @default false
             * @language en_US
             */
            /**
             * 指定文本字段是否是密码文本字段。
             * 如果此属性的值为 true，则文本字段被视为密码文本字段，并使用星号而不是实际字符来隐藏输入的字符。如果为 false，则不会将文本字段视为密码文本字段。
             * @default false
             * @language zh_CN
             */
            get: function () {
                return this.$TextField[20 /* displayAsPassword */];
            },
            set: function (value) {
                this.$setDisplayAsPassword(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         *
         * @param value
         */
        BKTextField.prototype.$setDisplayAsPassword = function (value) {
            var values = this.$TextField;
            if (values[20 /* displayAsPassword */] != value) {
                values[20 /* displayAsPassword */] = value;
                this.$invalidateTextField();
                var text = "";
                if (value) {
                    text = this.changeToPassText(values[13 /* text */]);
                }
                else {
                    text = values[13 /* text */];
                }
                this.setMiddleStyle([{ text: text }]);
                return true;
            }
            return false;
        };
        Object.defineProperty(BKTextField.prototype, "strokeColor", {
            /**
             * @version Egret 2.4
             * @platform Web,Native
             */
            get: function () {
                return this.$TextField[25 /* strokeColor */];
            },
            /**
             * Represent the stroke color of the text.
             * Contain three 8-bit numbers with RGB color components; for example, 0xFF0000 is red, 0x00FF00 is green.
             * @default 0x000000
             * @language en_US
             */
            /**
             * 表示文本的描边颜色。
             * 包含三个 8 位 RGB 颜色成分的数字；例如，0xFF0000 为红色，0x00FF00 为绿色。
             * @default 0x000000
             * @language zh_CN
             */
            set: function (value) {
                value = +value || 0;
                this.$setStrokeColor(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         *
         * @param value
         */
        BKTextField.prototype.$setStrokeColor = function (value) {
            var values = this.$TextField;
            if (values[25 /* strokeColor */] != value) {
                this.$invalidateTextField();
                values[25 /* strokeColor */] = value;
                values[26 /* strokeColorString */] = egret.toColorString(value);
                return true;
            }
            return false;
        };
        Object.defineProperty(BKTextField.prototype, "stroke", {
            /**
             * @version Egret 2.4
             * @platform Web,Native
             */
            get: function () {
                return this.$TextField[27 /* stroke */];
            },
            /**
             * Indicate the stroke width.
             * 0 means no stroke.
             * @default 0
             * @language en_US
             */
            /**
             * 表示描边宽度。
             * 0为没有描边。
             * @default 0
             * @language zh_CN
             */
            set: function (value) {
                this.$setStroke(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         *
         * @param value
         */
        BKTextField.prototype.$setStroke = function (value) {
            if (this.$TextField[27 /* stroke */] != value) {
                this.$invalidateTextField();
                this.$TextField[27 /* stroke */] = value;
                // MD
                this._transformDirty = true;
                return true;
            }
            return false;
        };
        Object.defineProperty(BKTextField.prototype, "maxChars", {
            /**
             * The maximum number of characters that the text field can contain, as entered by a user. \n A script can insert more text than maxChars allows; the maxChars property indicates only how much text a user can enter. If the value of this property is 0, a user can enter an unlimited amount of text.
             * The default value is 0.
             * @default 0
             * @language en_US
             */
            /**
             * 文本字段中最多可包含的字符数（即用户输入的字符数）。
             * 脚本可以插入比 maxChars 允许的字符数更多的文本；maxChars 属性仅表示用户可以输入多少文本。如果此属性的值为 0，则用户可以输入无限数量的文本。
             * @default 0
             * @language zh_CN
             */
            get: function () {
                return this.$TextField[21 /* maxChars */];
            },
            set: function (value) {
                this.$setMaxChars(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         *
         * @param value
         */
        BKTextField.prototype.$setMaxChars = function (value) {
            if (this.$TextField[21 /* maxChars */] != value) {
                this.$TextField[21 /* maxChars */] = value;
                return true;
            }
            return false;
        };
        Object.defineProperty(BKTextField.prototype, "scrollV", {
            /**
             * @version Egret 2.4
             * @platform Web,Native
             */
            get: function () {
                return Math.min(Math.max(this.$TextField[28 /* scrollV */], 1), this.maxScrollV);
            },
            /**
             * Vertical position of text in a text field. scrollV property helps users locate specific passages in a long article, and create scrolling text fields.
             * Vertically scrolling units are lines, and horizontal scrolling unit is pixels.
             * If the first displayed line is the first line in the text field, scrollV is set to 1 (instead of 0).
             * @language en_US
             */
            /**
             * 文本在文本字段中的垂直位置。scrollV 属性可帮助用户定位到长篇文章的特定段落，还可用于创建滚动文本字段。
             * 垂直滚动的单位是行，而水平滚动的单位是像素。
             * 如果显示的第一行是文本字段中的第一行，则 scrollV 设置为 1（而非 0）。
             * @language zh_CN
             */
            set: function (value) {
                this.$TextField[28 /* scrollV */] = Math.max(value, 1);
                this.$invalidateTextField();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKTextField.prototype, "maxScrollV", {
            /**
             * The maximum value of scrollV
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * scrollV 的最大值
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                this.$getLinesArr();
                return Math.max(this.$TextField[29 /* numLines */] - egret.TextFieldUtils.$getScrollNum(this) + 1, 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKTextField.prototype, "selectionBeginIndex", {
            /**
             * @private
             * @version Egret 2.4
             * @platform Web,Native
             */
            get: function () {
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKTextField.prototype, "selectionEndIndex", {
            /**
             * @private
             * @version Egret 2.4
             * @platform Web,Native
             */
            get: function () {
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKTextField.prototype, "caretIndex", {
            /**
             * @private
             * @version Egret 2.4
             * @platform Web,Native
             */
            get: function () {
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         *
         * @param beginIndex
         * @param endIndex
         */
        BKTextField.prototype.$setSelection = function (beginIndex, endIndex) {
            return false;
        };
        /**
         * @private
         *
         * @returns
         */
        BKTextField.prototype.$getLineHeight = function () {
            return this.$TextField[1 /* lineSpacing */] + this.$TextField[0 /* fontSize */];
        };
        Object.defineProperty(BKTextField.prototype, "numLines", {
            /**
             * Number of lines of text.
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 文本行数。
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                this.$getLinesArr();
                return this.$TextField[29 /* numLines */];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKTextField.prototype, "multiline", {
            get: function () {
                return this.$TextField[30 /* multiline */];
            },
            /**
             * Indicate whether field is a multiline text field. Note that this property is valid only when the type is TextFieldType.INPUT.
             * If the value is true, the text field is multiline; if the value is false, the text field is a single-line text field. In a field of type TextFieldType.INPUT, the multiline value determines whether the Enter key creates a new line (a value of false, and the Enter key is ignored).
             * @default false
             * @language en_US
             */
            /**
             * 表示字段是否为多行文本字段。注意，此属性仅在type为TextFieldType.INPUT时才有效。
             * 如果值为 true，则文本字段为多行文本字段；如果值为 false，则文本字段为单行文本字段。在类型为 TextFieldType.INPUT 的字段中，multiline 值将确定 Enter 键是否创建新行（如果值为 false，则将忽略 Enter 键）。
             * @default false
             * @language zh_CN
             */
            set: function (value) {
                this.$setMultiline(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         *
         * @param value
         */
        BKTextField.prototype.$setMultiline = function (value) {
            this.$TextField[30 /* multiline */] = value;
            this.$invalidateTextField();
            return true;
        };
        Object.defineProperty(BKTextField.prototype, "restrict", {
            get: function () {
                var values = this.$TextField;
                var str = null;
                if (values[35 /* restrictAnd */] != null) {
                    str = values[35 /* restrictAnd */];
                }
                if (values[36 /* restrictNot */] != null) {
                    if (str == null) {
                        str = "";
                    }
                    str += "^" + values[36 /* restrictNot */];
                }
                return str;
            },
            /**
             * Indicates a user can enter into the text field character set. If you restrict property is null, you can enter any character. If you restrict property is an empty string, you can not enter any character. If you restrict property is a string of characters, you can enter only characters in the string in the text field. The string is scanned from left to right. You can use a hyphen (-) to specify a range. Only restricts user interaction; a script may put any text into the text field. <br/>
                      * If the string of characters caret (^) at the beginning, all characters are initially accepted, then the string are excluded from receiving ^ character. If the string does not begin with a caret (^) to, any characters are initially accepted and then a string of characters included in the set of accepted characters. <br/>
                      * The following example allows only uppercase characters, spaces, and numbers in the text field: <br/>
                      * My_txt.restrict = "A-Z 0-9"; <br/>
                      * The following example includes all characters except lowercase letters: <br/>
                      * My_txt.restrict = "^ a-z"; <br/>
                      * If you need to enter characters \ ^, use two backslash "\\ -" "\\ ^": <br/>
                      * Can be used anywhere in the string ^ to rule out including characters and switch between characters, but can only be used to exclude a ^. The following code includes only uppercase letters except uppercase Q: <br/>
                      * My_txt.restrict = "A-Z ^ Q"; <br/>
             * @version Egret 2.4
             * @platform Web,Native
             * @default null
             * @language en_US
             */
            /**
             * 表示用户可输入到文本字段中的字符集。如果 restrict 属性的值为 null，则可以输入任何字符。如果 restrict 属性的值为空字符串，则不能输入任何字符。如果 restrict 属性的值为一串字符，则只能在文本字段中输入该字符串中的字符。从左向右扫描该字符串。可以使用连字符 (-) 指定一个范围。只限制用户交互；脚本可将任何文本放入文本字段中。<br/>
             * 如果字符串以尖号 (^) 开头，则先接受所有字符，然后从接受字符集中排除字符串中 ^ 之后的字符。如果字符串不以尖号 (^) 开头，则最初不接受任何字符，然后将字符串中的字符包括在接受字符集中。<br/>
             * 下例仅允许在文本字段中输入大写字符、空格和数字：<br/>
             * my_txt.restrict = "A-Z 0-9";<br/>
             * 下例包含除小写字母之外的所有字符：<br/>
             * my_txt.restrict = "^a-z";<br/>
             * 如果需要输入字符 \ ^，请使用2个反斜杠 "\\-" "\\^" ：<br/>
             * 可在字符串中的任何位置使用 ^，以在包含字符与排除字符之间进行切换，但是最多只能有一个 ^ 用来排除。下面的代码只包含除大写字母 Q 之外的大写字母：<br/>
             * my_txt.restrict = "A-Z^Q";<br/>
             * @version Egret 2.4
             * @platform Web,Native
             * @default null
             * @language zh_CN
             */
            set: function (value) {
                var values = this.$TextField;
                if (value == null) {
                    values[35 /* restrictAnd */] = null;
                    values[36 /* restrictNot */] = null;
                }
                else {
                    var index = -1;
                    while (index < value.length) {
                        index = value.indexOf("^", index);
                        if (index == 0) {
                            break;
                        }
                        else if (index > 0) {
                            if (value.charAt(index - 1) != "\\") {
                                break;
                            }
                            index++;
                        }
                        else {
                            break;
                        }
                    }
                    if (index == 0) {
                        values[35 /* restrictAnd */] = null;
                        values[36 /* restrictNot */] = value.substring(index + 1);
                    }
                    else if (index > 0) {
                        values[35 /* restrictAnd */] = value.substring(0, index);
                        values[36 /* restrictNot */] = value.substring(index + 1);
                    }
                    else {
                        values[35 /* restrictAnd */] = value;
                        values[36 /* restrictNot */] = null;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         *
         * @param value
         */
        BKTextField.prototype.$setWidth = function (value) {
            var values = this.$TextField;
            if (isNaN(value)) {
                if (isNaN(values[3 /* textFieldWidth */])) {
                    return false;
                }
                values[3 /* textFieldWidth */] = NaN;
            }
            else {
                if (values[3 /* textFieldWidth */] == value) {
                    return false;
                }
                values[3 /* textFieldWidth */] = value;
            }
            value = +value;
            if (value < 0) {
                return false;
            }
            this.$invalidateTextField();
            // MD
            this._transformDirty = true;
            return true;
        };
        /**
         * @private
         *
         * @param value
         */
        BKTextField.prototype.$setHeight = function (value) {
            var values = this.$TextField;
            if (isNaN(value)) {
                if (isNaN(values[4 /* textFieldHeight */])) {
                    return false;
                }
                values[4 /* textFieldHeight */] = NaN;
            }
            else {
                if (values[4 /* textFieldHeight */] == value) {
                    return false;
                }
                values[4 /* textFieldHeight */] = value;
            }
            value = +value;
            if (value < 0) {
                return false;
            }
            this.$invalidateTextField();
            // MD
            this._transformDirty = true;
            return true;
        };
        /**
         * @private
         * 获取显示宽度
         */
        BKTextField.prototype.$getWidth = function () {
            var values = this.$TextField;
            return isNaN(values[3 /* textFieldWidth */]) ? this.$getContentBounds().width : values[3 /* textFieldWidth */];
        };
        /**
         * @private
         * 获取显示宽度
         */
        BKTextField.prototype.$getHeight = function () {
            var values = this.$TextField;
            return isNaN(values[4 /* textFieldHeight */]) ? this.$getContentBounds().height : values[4 /* textFieldHeight */];
        };
        Object.defineProperty(BKTextField.prototype, "border", {
            /**
             * @version Egret 2.4
             * @platform Web,Native
             */
            get: function () {
                return this.$TextField[31 /* border */];
            },
            /**
             * Specifies whether the text field has a border.
             * If true, the text field has a border. If false, the text field has no border.
             * Use borderColor property to set the border color.
             * @default false
             * @language en_US
             */
            /**
             * 指定文本字段是否具有边框。
             * 如果为 true，则文本字段具有边框。如果为 false，则文本字段没有边框。
             * 使用 borderColor 属性来设置边框颜色。
             * @default false
             * @language zh_CN
             */
            set: function (value) {
                this.$setBorder(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         */
        BKTextField.prototype.$setBorder = function (value) {
            this.$TextField[31 /* border */] = !!value;
        };
        Object.defineProperty(BKTextField.prototype, "borderColor", {
            /**
             * @version Egret 2.4
             * @platform Web,Native
             */
            get: function () {
                return this.$TextField[32 /* borderColor */];
            },
            /**
             * The color of the text field border.
             * Even currently is no border can be retrieved or set this property, but only if the text field has the border property is set to true, the color is visible.
             * @default 0x000000
             * @language en_US
             */
            /**
             * 文本字段边框的颜色。
             * 即使当前没有边框，也可检索或设置此属性，但只有当文本字段已将 border 属性设置为 true 时，才可以看到颜色。
             * @default 0x000000
             * @language zh_CN
             */
            set: function (value) {
                this.$setBorderColor(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         */
        BKTextField.prototype.$setBorderColor = function (value) {
            this.$TextField[32 /* borderColor */] = +value || 0;
        };
        Object.defineProperty(BKTextField.prototype, "background", {
            /**
             * @version Egret 2.4
             * @platform Web,Native
             */
            get: function () {
                return this.$TextField[33 /* background */];
            },
            /**
             * Specifies whether the text field has a background fill.
             * If true, the text field has a background fill. If false, the text field has no background fill.
             * Use the backgroundColor property to set the background color of the text field.
             * @default false
             * @language en_US
             */
            /**
             * 指定文本字段是否具有背景填充。
             * 如果为 true，则文本字段具有背景填充。如果为 false，则文本字段没有背景填充。
             * 使用 backgroundColor 属性来设置文本字段的背景颜色。
             * @default false
             * @language zh_CN
             */
            set: function (value) {
                this.$setBackground(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         */
        BKTextField.prototype.$setBackground = function (value) {
            this.$TextField[33 /* background */] = value;
        };
        Object.defineProperty(BKTextField.prototype, "backgroundColor", {
            /**
             * @version Egret 2.4
             * @platform Web,Native
             */
            get: function () {
                return this.$TextField[34 /* backgroundColor */];
            },
            /**
             * Color of the text field background.
             * Even currently is no background, can be retrieved or set this property, but only if the text field has the background property set to true, the color is visible.
             * @default 0xFFFFFF
             * @language en_US
             */
            /**
             * 文本字段背景的颜色。
             * 即使当前没有背景，也可检索或设置此属性，但只有当文本字段已将 background 属性设置为 true 时，才可以看到颜色。
             * @default 0xFFFFFF
             * @language zh_CN
             */
            set: function (value) {
                this.$setBackgroundColor(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         */
        BKTextField.prototype.$setBackgroundColor = function (value) {
            this.$TextField[34 /* backgroundColor */] = value;
        };
        /**
         * @private
         *
         */
        BKTextField.prototype.fillBackground = function (lines) {
            var graphics = this.graphicsNode;
            if (graphics) {
                graphics.clear();
            }
            var values = this.$TextField;
            if (values[33 /* background */] || values[31 /* border */] || (lines && lines.length > 0)) {
                if (!graphics) {
                    graphics = this.graphicsNode = new egret.sys.GraphicsNode();
                    var groupNode = new egret.sys.GroupNode();
                    groupNode.addNode(graphics);
                    groupNode.addNode(this.textNode);
                    this.$renderNode = groupNode;
                }
                var fillPath = void 0;
                var strokePath = void 0;
                //渲染背景
                if (values[33 /* background */]) {
                    fillPath = graphics.beginFill(values[34 /* backgroundColor */]);
                    fillPath.drawRect(0, 0, this.$getWidth(), this.$getHeight());
                }
                //渲染边框
                if (values[31 /* border */]) {
                    strokePath = graphics.lineStyle(1, values[32 /* borderColor */]);
                    //1像素和3像素线条宽度的情况，会向右下角偏移0.5像素绘制。少画一像素宽度，正好能不超出文本测量边界。
                    strokePath.drawRect(0, 0, this.$getWidth() - 1, this.$getHeight() - 1);
                }
                //渲染下划线
                if (lines && lines.length > 0) {
                    var textColor = values[2 /* textColor */];
                    var lastColor = -1;
                    var length_2 = lines.length;
                    for (var i = 0; i < length_2; i += 4) {
                        var x = lines[i];
                        var y = lines[i + 1];
                        var w = lines[i + 2];
                        var color = lines[i + 3] || textColor;
                        if (lastColor < 0 || lastColor != color) {
                            lastColor = color;
                            strokePath = graphics.lineStyle(2, color, 1, egret.CapsStyle.NONE);
                        }
                        strokePath.moveTo(x, y);
                        strokePath.lineTo(x + w, y);
                    }
                }
            }
            if (graphics) {
                var bounds = this.$getRenderBounds();
                graphics.x = bounds.x;
                graphics.y = bounds.y;
                graphics.width = bounds.width;
                graphics.height = bounds.height;
                egret.Rectangle.release(bounds);
            }
        };
        /**
         * Enter the text automatically entered into the input state, the input type is text only and may only be invoked in the user interaction.
         * @version Egret 3.0.8
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 输入文本自动进入到输入状态，仅在类型是输入文本并且是在用户交互下才可以调用。
         * @version Egret 3.0.8
         * @platform Web,Native
         * @language zh_CN
         */
        BKTextField.prototype.setFocus = function () {
            if (this.type == egret.TextFieldType.INPUT && this.$stage) {
                this.inputUtils.$onFocus();
            }
        };
        /**
         * @private
         *
         */
        BKTextField.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            this.removeEvent();
            if (this.$TextField[24 /* type */] == egret.TextFieldType.INPUT) {
                this.inputUtils._removeStageText();
            }
            if (this.textNode) {
                this.textNode.clean();
            }
        };
        /**
         * @private
         *
         * @param stage
         * @param nestLevel
         */
        BKTextField.prototype.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            this.addEvent();
            if (this.$TextField[24 /* type */] == egret.TextFieldType.INPUT) {
                this.inputUtils._addStageText();
            }
        };
        BKTextField.prototype.$invalidateTextField = function () {
            var self = this;
            self.$renderDirty = true;
            self.$TextField[18 /* textLinesChanged */] = true;
            var p = self.$parent;
            if (p && !p.$cacheDirty) {
                p.$cacheDirty = true;
                p.$cacheDirtyUp();
            }
            var maskedObject = self.$maskedObject;
            if (maskedObject && !maskedObject.$cacheDirty) {
                maskedObject.$cacheDirty = true;
                maskedObject.$cacheDirtyUp();
            }
        };
        BKTextField.prototype.$getRenderBounds = function () {
            var bounds = this.$getContentBounds();
            var tmpBounds = egret.Rectangle.create();
            tmpBounds.copyFrom(bounds);
            if (this.$TextField[31 /* border */]) {
                tmpBounds.width += 2;
                tmpBounds.height += 2;
            }
            var _strokeDouble = this.$TextField[27 /* stroke */] * 2;
            if (_strokeDouble > 0) {
                tmpBounds.width += _strokeDouble * 2;
                tmpBounds.height += _strokeDouble * 2;
            }
            tmpBounds.x -= _strokeDouble + 2; //+2和+4 是为了webgl纹理太小导致裁切问题
            tmpBounds.y -= _strokeDouble + 2;
            tmpBounds.width = Math.ceil(tmpBounds.width) + 4;
            tmpBounds.height = Math.ceil(tmpBounds.height) + 4;
            return tmpBounds;
        };
        /**
         * @private
         */
        BKTextField.prototype.$measureContentBounds = function (bounds) {
            this.$getLinesArr();
            var w = !isNaN(this.$TextField[3 /* textFieldWidth */]) ? this.$TextField[3 /* textFieldWidth */] : this.$TextField[5 /* textWidth */];
            var h = !isNaN(this.$TextField[4 /* textFieldHeight */]) ? this.$TextField[4 /* textFieldHeight */] : egret.TextFieldUtils.$getTextHeight(this);
            bounds.setTo(0, 0, w, h);
        };
        BKTextField.prototype.$updateRenderNode = function () {
            if (this.$TextField[24 /* type */] == egret.TextFieldType.INPUT) {
                this.inputUtils._updateProperties();
                if (this.$isTyping) {
                    this.fillBackground();
                    return;
                }
            }
            else if (this.$TextField[3 /* textFieldWidth */] == 0) {
                // let graphics = this.graphicsNode;
                // if (graphics) {
                //     graphics.clear();
                // }
                return;
            }
            var underLines = this.drawText(); // MD
            // this.fillBackground(underLines);
            // //tudo 宽高很小的情况下webgl模式绘制异常
            // let bounds = this.$getRenderBounds();
            // let node = this.textNode;
            // node.x = bounds.x;
            // node.y = bounds.y;
            // node.width = Math.ceil(bounds.width);
            // node.height = Math.ceil(bounds.height);
            // Rectangle.release(bounds);
        };
        Object.defineProperty(BKTextField.prototype, "textFlow", {
            /**
             * @version Egret 2.4
             * @platform Web,Native
             */
            get: function () {
                return this.textArr;
            },
            /**
             * Set rich text
             * @language en_US
             */
            /**
             * 设置富文本
             * @see http://edn.egret.com/cn/index.php/article/index/id/146
             * @language zh_CN
             */
            set: function (textArr) {
                this.isFlow = true;
                var text = "";
                if (textArr == null)
                    textArr = [];
                for (var i = 0; i < textArr.length; i++) {
                    var element = textArr[i];
                    text += element.text;
                }
                if (this.$TextField[20 /* displayAsPassword */]) {
                    this.$setBaseText(text);
                }
                else {
                    this.$TextField[13 /* text */] = text;
                    this.setMiddleStyle(textArr);
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         *
         * @param text
         * @returns
         */
        BKTextField.prototype.changeToPassText = function (text) {
            if (this.$TextField[20 /* displayAsPassword */]) {
                var passText = "";
                for (var i = 0, num = text.length; i < num; i++) {
                    switch (text.charAt(i)) {
                        case '\n':
                            passText += "\n";
                            break;
                        case '\r':
                            break;
                        default:
                            passText += '*';
                    }
                }
                return passText;
            }
            return text;
        };
        /**
         * @private
         *
         * @param textArr
         */
        BKTextField.prototype.setMiddleStyle = function (textArr) {
            this.$TextField[18 /* textLinesChanged */] = true;
            this.textArr = textArr;
            this.$invalidateTextField();
        };
        Object.defineProperty(BKTextField.prototype, "textWidth", {
            /**
             * Get the text measured width
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 获取文本测量宽度
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                this.$getLinesArr();
                return this.$TextField[5 /* textWidth */];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKTextField.prototype, "textHeight", {
            /**
             * Get Text measuring height
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 获取文本测量高度
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                this.$getLinesArr();
                return egret.TextFieldUtils.$getTextHeight(this);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         * @param text
         * @version Egret 2.4
         * @platform Web,Native
         */
        BKTextField.prototype.appendText = function (text) {
            this.appendElement({ text: text });
        };
        /**
         * @private
         * @param element
         * @version Egret 2.4
         * @platform Web,Native
         */
        BKTextField.prototype.appendElement = function (element) {
            var text = this.$TextField[13 /* text */] + element.text;
            if (this.$TextField[20 /* displayAsPassword */]) {
                this.$setBaseText(text);
            }
            else {
                this.$TextField[13 /* text */] = text;
                this.textArr.push(element);
                this.setMiddleStyle(this.textArr);
            }
        };
        /**
         * @private
         *
         * @returns
         */
        BKTextField.prototype.$getLinesArr = function () {
            var values = this.$TextField;
            if (!values[18 /* textLinesChanged */]) {
                return this.linesArr;
            }
            values[18 /* textLinesChanged */] = false;
            var text2Arr = this.textArr;
            this.linesArr.length = 0;
            values[6 /* textHeight */] = 0;
            values[5 /* textWidth */] = 0;
            var textFieldWidth = values[3 /* textFieldWidth */];
            //宽度被设置为0
            if (!isNaN(textFieldWidth) && textFieldWidth == 0) {
                values[29 /* numLines */] = 0;
                return [{ width: 0, height: 0, charNum: 0, elements: [], hasNextLine: false }];
            }
            var linesArr = this.linesArr;
            var lineW = 0;
            var lineCharNum = 0;
            var lineH = 0;
            var lineCount = 0;
            var lineElement;
            for (var i = 0, text2ArrLength = text2Arr.length; i < text2ArrLength; i++) {
                var element = text2Arr[i];
                //可能设置为没有文本，忽略绘制
                if (!element.text) {
                    if (lineElement) {
                        lineElement.width = lineW;
                        lineElement.height = lineH;
                        lineElement.charNum = lineCharNum;
                        values[5 /* textWidth */] = Math.max(values[5 /* textWidth */], lineW);
                        values[6 /* textHeight */] += lineH;
                    }
                    continue;
                }
                element.style = element.style || {};
                var text = element.text.toString();
                var textArr = text.split(/(?:\r\n|\r|\n)/);
                for (var j = 0, textArrLength = textArr.length; j < textArrLength; j++) {
                    if (linesArr[lineCount] == null) {
                        lineElement = { width: 0, height: 0, elements: [], charNum: 0, hasNextLine: false };
                        linesArr[lineCount] = lineElement;
                        lineW = 0;
                        lineH = 0;
                        lineCharNum = 0;
                    }
                    if (values[24 /* type */] == egret.TextFieldType.INPUT) {
                        lineH = values[0 /* fontSize */];
                    }
                    else {
                        lineH = Math.max(lineH, element.style.size || values[0 /* fontSize */]);
                    }
                    var isNextLine = true;
                    if (textArr[j] == "") {
                        if (j == textArrLength - 1) {
                            isNextLine = false;
                        }
                    }
                    else {
                        var w = measureTextWidth(textArr[j], values, element.style);
                        if (isNaN(textFieldWidth)) {
                            lineW += w;
                            lineCharNum += textArr[j].length;
                            lineElement.elements.push({
                                width: w,
                                text: textArr[j],
                                style: element.style
                            });
                            if (j == textArrLength - 1) {
                                isNextLine = false;
                            }
                        }
                        else {
                            if (lineW + w <= textFieldWidth) {
                                lineElement.elements.push({
                                    width: w,
                                    text: textArr[j],
                                    style: element.style
                                });
                                lineW += w;
                                lineCharNum += textArr[j].length;
                                if (j == textArrLength - 1) {
                                    isNextLine = false;
                                }
                            }
                            else {
                                var k = 0;
                                var ww = 0;
                                var word = textArr[j];
                                var words = void 0;
                                if (values[19 /* wordWrap */]) {
                                    words = word.split(SplitRegex);
                                }
                                else {
                                    words = word.match(/./g);
                                }
                                var wl = words.length;
                                var charNum = 0;
                                for (; k < wl; k++) {
                                    // detect 4 bytes unicode, refer https://mths.be/punycode
                                    var codeLen = words[k].length;
                                    var has4BytesUnicode = false;
                                    if (codeLen == 1 && k < wl - 1) {
                                        var charCodeHigh = words[k].charCodeAt(0);
                                        var charCodeLow = words[k + 1].charCodeAt(0);
                                        if (charCodeHigh >= 0xD800 && charCodeHigh <= 0xDBFF && (charCodeLow & 0xFC00) == 0xDC00) {
                                            var realWord = words[k] + words[k + 1];
                                            codeLen = 2;
                                            has4BytesUnicode = true;
                                            w = measureTextWidth(realWord, values, element.style);
                                        }
                                        else {
                                            w = measureTextWidth(words[k], values, element.style);
                                        }
                                    }
                                    else {
                                        w = measureTextWidth(words[k], values, element.style);
                                    }
                                    // w = measureTextWidth(words[k], values, element.style);
                                    if (lineW != 0 && lineW + w > textFieldWidth && lineW + k != 0) {
                                        break;
                                    }
                                    if (ww + w > textFieldWidth) {
                                        var words2 = words[k].match(/./g);
                                        for (var k2 = 0, wl2 = words2.length; k2 < wl2; k2++) {
                                            // detect 4 bytes unicode, refer https://mths.be/punycode
                                            var codeLen = words2[k2].length;
                                            var has4BytesUnicode2 = false;
                                            if (codeLen == 1 && k2 < wl2 - 1) {
                                                var charCodeHigh = words2[k2].charCodeAt(0);
                                                var charCodeLow = words2[k2 + 1].charCodeAt(0);
                                                if (charCodeHigh >= 0xD800 && charCodeHigh <= 0xDBFF && (charCodeLow & 0xFC00) == 0xDC00) {
                                                    var realWord = words2[k2] + words2[k2 + 1];
                                                    codeLen = 2;
                                                    has4BytesUnicode2 = true;
                                                    w = measureTextWidth(realWord, values, element.style);
                                                }
                                                else {
                                                    w = measureTextWidth(words2[k2], values, element.style);
                                                }
                                            }
                                            else {
                                                w = measureTextWidth(words2[k2], values, element.style);
                                            }
                                            // w = measureTextWidth(words2[k2], values, element.style);
                                            if (k2 > 0 && lineW + w > textFieldWidth) {
                                                break;
                                            }
                                            // charNum += words2[k2].length;
                                            charNum += codeLen;
                                            ww += w;
                                            lineW += w;
                                            lineCharNum += charNum;
                                            if (has4BytesUnicode2) {
                                                k2++;
                                            }
                                        }
                                    }
                                    else {
                                        // charNum += words[k].length;
                                        charNum += codeLen;
                                        ww += w;
                                        lineW += w;
                                        lineCharNum += charNum;
                                    }
                                    if (has4BytesUnicode) {
                                        k++;
                                    }
                                }
                                if (k > 0) {
                                    lineElement.elements.push({
                                        width: ww,
                                        text: word.substring(0, charNum),
                                        style: element.style
                                    });
                                    var leftWord = word.substring(charNum);
                                    var m = void 0;
                                    var lwleng = leftWord.length;
                                    for (m = 0; m < lwleng; m++) {
                                        if (leftWord.charAt(m) != " ") {
                                            break;
                                        }
                                    }
                                    textArr[j] = leftWord.substring(m);
                                }
                                if (textArr[j] != "") {
                                    j--;
                                    isNextLine = false;
                                }
                            }
                        }
                    }
                    if (isNextLine) {
                        lineCharNum++;
                        lineElement.hasNextLine = true;
                    }
                    if (j < textArr.length - 1) {
                        lineElement.width = lineW;
                        lineElement.height = lineH;
                        lineElement.charNum = lineCharNum;
                        values[5 /* textWidth */] = Math.max(values[5 /* textWidth */], lineW);
                        values[6 /* textHeight */] += lineH;
                        //if (this._type == TextFieldType.INPUT && !this._multiline) {
                        //    this._numLines = linesArr.length;
                        //    return linesArr;
                        //}
                        lineCount++;
                    }
                }
                if (i == text2Arr.length - 1 && lineElement) {
                    lineElement.width = lineW;
                    lineElement.height = lineH;
                    lineElement.charNum = lineCharNum;
                    values[5 /* textWidth */] = Math.max(values[5 /* textWidth */], lineW);
                    values[6 /* textHeight */] += lineH;
                }
            }
            values[29 /* numLines */] = linesArr.length;
            return linesArr;
        };
        /**
         * @private
         * 返回要绘制的下划线列表
         */
        BKTextField.prototype.drawText = function () {
            // let node = this.textNode; // MD
            var values = this.$TextField;
            //更新文本样式 // MD
            // node.bold = values[sys.TextKeys.bold];
            // node.fontFamily = values[sys.TextKeys.fontFamily] || TextField.default_fontFamily;
            // node.italic = values[sys.TextKeys.italic];
            // node.size = values[sys.TextKeys.fontSize];
            // node.stroke = values[sys.TextKeys.stroke];
            // node.strokeColor = values[sys.TextKeys.strokeColor];
            // node.textColor = values[sys.TextKeys.textColor];
            //先算出需要的数值
            var lines = this.$getLinesArr();
            if (values[5 /* textWidth */] == 0) {
                return [];
            }
            var maxWidth = !isNaN(values[3 /* textFieldWidth */]) ? values[3 /* textFieldWidth */] : values[5 /* textWidth */];
            var textHeight = egret.TextFieldUtils.$getTextHeight(this); // MD
            var drawY = 0;
            var startLine = egret.TextFieldUtils.$getStartLine(this); // MD
            var textFieldHeight = values[4 /* textFieldHeight */];
            if (!isNaN(textFieldHeight) && textFieldHeight > textHeight) {
                var vAlign = egret.TextFieldUtils.$getValign(this); // MD
                drawY += vAlign * (textFieldHeight - textHeight);
            }
            drawY = Math.round(drawY);
            var hAlign = egret.TextFieldUtils.$getHalign(this); // MD
            var nodeCount = 0; // MD
            var drawX = 0;
            var underLineData = [];
            for (var i = startLine, numLinesLength = values[29 /* numLines */]; i < numLinesLength; i++) {
                var line = lines[i];
                var h = line.height;
                // drawY += h / 2;
                drawY += h; // MD
                if (i != startLine) {
                    if (values[24 /* type */] == egret.TextFieldType.INPUT && !values[30 /* multiline */]) {
                        break;
                    }
                    if (!isNaN(textFieldHeight) && drawY > textFieldHeight) {
                        break;
                    }
                }
                drawX = Math.round((maxWidth - line.width) * hAlign);
                for (var j = 0, elementsLength = line.elements.length; j < elementsLength; j++) {
                    var element = line.elements[j];
                    var size = element.style.size || values[0 /* fontSize */];
                    // MD
                    tempStyle.italic = element.style.italic ? 1 : values[16 /* italic */];
                    tempStyle.bold = element.style.bold ? 1 : values[15 /* bold */];
                    tempStyle.fontSize = size;
                    tempStyle.strokeSize = isNaN(Number(element.style.stroke)) ? values[27 /* stroke */] : element.style.stroke;
                    tempStyle.strokeColor = 0xFF000000 + (isNaN(Number(element.style.strokeColor)) ? values[25 /* strokeColor */] : element.style.strokeColor);
                    tempStyle.textColor = 0xFF000000 + (isNaN(Number(element.style.textColor)) ? values[2 /* textColor */] : element.style.textColor);
                    tempStyle.width = tempStyle.maxWidth = element.width;
                    tempStyle.height = tempStyle.maxHeight = size * 1.15; // 高度不够会被裁切。
                    var bkNode = void 0; // BK.TextNode
                    if (nodeCount < this._bkNodes.length) {
                        bkNode = this._bkNodes[nodeCount];
                        bkNode.updateText(tempStyle, element.text);
                    }
                    else {
                        bkNode = createTextNode(element.text, tempStyle);
                        this._bkNodes[nodeCount] = bkNode;
                        this._bkNode.addChild(bkNode);
                    }
                    // node.drawText(drawX, drawY + (h - size) / 2, element.text, element.style);
                    bkNode.position = { x: drawX, y: -(drawY) };
                    nodeCount++;
                    // MD END
                    if (element.style.underline) {
                        underLineData.push(drawX, 
                        // drawY + (h) / 2, 
                        drawY, // MD
                        element.width, element.style.textColor);
                    }
                    drawX += element.width;
                }
                // drawY += h / 2 + values[sys.TextKeys.lineSpacing];
                drawY += values[1 /* lineSpacing */]; // MD
            }
            // MD 移除多余的节点
            for (var i = nodeCount; i < this._bkNodes.length; ++i) {
                var bkNode = this._bkNodes[i]; // BK.TextNode
                bkTextNodes.push(bkNode);
                this._bkNode.removeChild(bkNode);
            }
            this._bkNodes.length = nodeCount;
            return underLineData;
        };
        //增加点击事件
        BKTextField.prototype.addEvent = function () {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTapHandler, this);
        };
        //释放点击事件
        BKTextField.prototype.removeEvent = function () {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTapHandler, this);
        };
        //处理富文本中有href的
        BKTextField.prototype.onTapHandler = function (e) {
            if (this.$TextField[24 /* type */] == egret.TextFieldType.INPUT) {
                return;
            }
            var ele = egret.TextFieldUtils.$getTextElement(this, e.localX, e.localY);
            if (ele == null) {
                return;
            }
            var style = ele.style;
            if (style && style.href) {
                if (style.href.match(/^event:/)) {
                    var type = style.href.match(/^event:/)[0];
                    egret.TextEvent.dispatchTextEvent(this, egret.TextEvent.LINK, style.href.substring(type.length));
                }
                else {
                    open(style.href, style.target || "_blank");
                }
            }
        };
        BKTextField.prototype._updateSelfColor = function () {
            for (var _i = 0, _a = this._bkNodes; _i < _a.length; _i++) {
                var node = _a[_i];
                node.vertexColor = this._color;
            }
        };
        /**
         * default fontFamily
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 默认文本字体
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        BKTextField.default_fontFamily = "Arial";
        /**
         * default size in pixels of text
         * @version Egret 3.2.1
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 默认文本字号大小
         * @version Egret 3.2.1
         * @platform Web,Native
         * @language zh_CN
         */
        BKTextField.default_size = 30;
        /**
         * default color of the text.
         * @version Egret 3.2.1
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 默认文本颜色
         * @version Egret 3.2.1
         * @platform Web,Native
         * @language zh_CN
         */
        BKTextField.default_textColor = 0xffffff;
        return BKTextField;
    }(egret.BKDisplayObject));
    egret.BKTextField = BKTextField;
    __reflect(BKTextField.prototype, "egret.BKTextField");
    var tempStyle = {
        fontSize: egret.TextField.default_size,
        textColor: egret.TextField.default_textColor + 0xFF000000,
        maxWidth: 64,
        maxHeight: 64,
        width: 64,
        height: 64,
        textAlign: 0,
        bold: 0,
        italic: 0,
        strokeColor: 0xFF000000,
        strokeSize: 0,
        shadowRadius: 0,
        shadowDx: 0,
        shadowDy: 0,
        shadowColor: 0xFF000000
    };
    var defaultStyle = {
        fontSize: egret.TextField.default_size,
        textColor: egret.TextField.default_textColor + 0xFF000000,
        maxWidth: 1280,
        maxHeight: 512,
        width: 1280,
        height: 512,
        textAlign: 0,
        bold: 0,
        italic: 0,
        strokeColor: 0xFF000000,
        strokeSize: 0,
        shadowRadius: 0,
        shadowDx: 0,
        shadowDy: 0,
        shadowColor: 0xFF000000
    };
    var bkTextNodes = []; // BK.TextNode[]
    var defaultText; // BK.TextNode
    function createTextNode(text, style) {
        if (bkTextNodes.length > 0) {
            var textNode_1 = bkTextNodes.pop();
            textNode_1.updateText(style, text);
            return textNode_1;
        }
        var textNode = new BK.TextNode(style, text);
        return textNode;
    }
    function bkMeasureText(text, fontFamily, size, bold, italic) {
        if (!defaultText) {
            defaultText = new BK.TextNode(defaultStyle, "");
        }
        defaultStyle.fontSize = size;
        defaultStyle.bold = bold ? 1 : 0;
        defaultStyle.italic = italic ? 1 : 0;
        var textSize = defaultText.measureTextSize(defaultStyle, text);
        //bk特殊处理
        //新的库宽度小1，这里进行特殊处理
        return textSize.contentWidth + 1;
    }
    egret.sys.measureText = bkMeasureText;
    if (window['renderMode'] != 'webgl') {
        egret.TextField = egret.BKTextField;
    }
})(egret || (egret = {}));
var egret;
(function (egret) {
    var BKBitmap = (function (_super) {
        __extends(BKBitmap, _super);
        function BKBitmap(value) {
            if (value === void 0) { value = null; }
            var _this = _super.call(this, new BK.Sprite(0, 0, {}, 0, 1, 1, 1)) || this;
            _this.$explicitBitmapWidth = NaN;
            _this.$explicitBitmapHeight = NaN;
            _this._size = { width: 0, height: 0 };
            _this.hasScale9Grid = false;
            /**
             * @internal
             */
            _this.$bitmapData = null;
            _this.$texture = null;
            _this.$scale9Grid = null;
            _this._bkSprite = _this._bkNode;
            _this.texture = value;
            return _this;
        }
        BKBitmap.prototype._updateBKNodeMatrix = function () {
            if (!this.$texture) {
                return;
            }
            var matrix = this.$getMatrix();
            var bkMatrix = this._bkNode.transform.matrix;
            var tx = matrix.tx;
            var ty = matrix.ty;
            var pivotX = this.$anchorOffsetX;
            var pivotY = this.$anchorOffsetY - this._size.height;
            if (pivotX !== 0.0 || pivotY !== 0.0) {
                tx -= matrix.a * pivotX + matrix.c * pivotY;
                ty -= matrix.b * pivotX + matrix.d * pivotY;
            }
            bkMatrix.set(matrix.a, -matrix.b, -matrix.c, matrix.d, tx, -ty);
        };
        Object.defineProperty(BKBitmap.prototype, "texture", {
            get: function () {
                return this.$texture;
            },
            set: function (value) {
                if (this.$texture === value) {
                    return;
                }
                this.$setTexture(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         */
        BKBitmap.prototype.$setTexture = function (value) {
            this.$texture = value;
            if (this.$texture) {
                this._transformDirty = true;
                this.$bitmapData = this.$texture.bitmapData;
                if (this.$bitmapData.bkTexture) {
                    this._bkSprite.setTexture(this.$bitmapData.bkTexture);
                    if (this.$bitmapData.isFlip)
                        this._bkSprite.setUVFlip(0, 0);
                    this._bkSprite.adjustTexturePosition(this.$texture.$bitmapX, this.$texture.$sourceHeight - (this.$texture.$bitmapY + this.$texture.$bitmapHeight), this.$texture.$bitmapWidth, this.$texture.$bitmapHeight, this.$texture.$rotated);
                    this._size.width = this.$getWidth(); //this.$texture.$bitmapWidth;
                    this._size.height = this.$getHeight(); //this.$texture.$bitmapHeight;
                    this._bkSprite.contentSize = this._size;
                    if (this.$texture['scale9Grid'] && !this.hasScale9Grid) {
                        var rectangle = new egret.Rectangle();
                        rectangle.setTo(this.$texture['scale9Grid'].x, this.$texture['scale9Grid'].y, this.$texture['scale9Grid'].width, this.$texture['scale9Grid'].height);
                        this.$setScale9Grid(rectangle);
                    }
                }
                else {
                    this.$bitmapData = null;
                    this._bkSprite.setTexture({});
                }
            }
            else {
                this.$bitmapData = null;
                this._bkSprite.setTexture({});
            }
        };
        Object.defineProperty(BKBitmap.prototype, "scale9Grid", {
            get: function () {
                return this.$scale9Grid;
            },
            set: function (value) {
                this.$setScale9Grid(value);
            },
            enumerable: true,
            configurable: true
        });
        BKBitmap.prototype.$setScale9Grid = function (value) {
            var self = this;
            if (self.$scale9Grid == value) {
                return;
            }
            // MD
            if (self.$scale9Grid) {
                if (value) {
                    this._bkSprite.setScale9Grid(value);
                }
                else {
                    this._bkSprite = new BK.Sprite(0, 0, {}, 0, 1, 1, 1);
                    this._replaceNode(this._bkSprite);
                    this.$setTexture(this.$texture);
                }
            }
            else if (value) {
                this._bkSprite = new egret.BKSprite9();
                this._replaceNode(this._bkSprite);
                this._bkSprite.setScale9Grid(value);
                this.hasScale9Grid = true;
                this.$setTexture(this.$texture);
            }
            this._bkSprite.contentSize = this._size;
            self.$scale9Grid = value;
            self.$renderDirty = true;
        };
        /**
         * @override
         */
        BKBitmap.prototype.$setWidth = function (value) {
            var self = this;
            if (value < 0 || value == self.$explicitBitmapWidth) {
                return false;
            }
            self.$explicitBitmapWidth = value;
            // MD
            this._transformDirty = true;
            this._size.width = value;
            this._bkSprite.contentSize = this._size;
            return true;
        };
        /**
         * @override
         */
        BKBitmap.prototype.$setHeight = function (value) {
            var self = this;
            if (value < 0 || value == self.$explicitBitmapHeight) {
                return false;
            }
            self.$explicitBitmapHeight = value;
            // MD
            this._transformDirty = true;
            this._size.height = value;
            this._bkSprite.contentSize = this._size;
            return true;
        };
        /**
         * @override
         */
        BKBitmap.prototype.$getWidth = function () {
            return isNaN(this.$explicitBitmapWidth) ? this.$getContentBounds().width : this.$explicitBitmapWidth;
        };
        /**
         * @override
         */
        BKBitmap.prototype.$getHeight = function () {
            return isNaN(this.$explicitBitmapHeight) ? this.$getContentBounds().height : this.$explicitBitmapHeight;
        };
        /**
         * @override
         */
        BKBitmap.prototype.$measureContentBounds = function (bounds) {
            if (this.$texture) {
                var w = !isNaN(this.$explicitBitmapWidth) ? this.$explicitBitmapWidth : this.$texture.$getTextureWidth();
                var h = !isNaN(this.$explicitBitmapHeight) ? this.$explicitBitmapHeight : this.$texture.$getTextureHeight();
                bounds.setTo(0, 0, w, h);
            }
            else {
                var w = !isNaN(this.$explicitBitmapWidth) ? this.$explicitBitmapWidth : 0;
                var h = !isNaN(this.$explicitBitmapHeight) ? this.$explicitBitmapHeight : 0;
                bounds.setTo(0, 0, w, h);
            }
        };
        return BKBitmap;
    }(egret.BKDisplayObject));
    egret.BKBitmap = BKBitmap;
    __reflect(BKBitmap.prototype, "egret.BKBitmap");
    if (window['renderMode'] != 'webgl') {
        egret.Bitmap = egret.BKBitmap;
    }
})(egret || (egret = {}));
var egret;
(function (egret) {
    egret.emptyTexture = BK.Texture.createTexture(1, 1);
    function defineProxyProperties(target, proxy) {
        var names = Object.getOwnPropertyNames(target);
        var _loop_1 = function (key) {
            Object.defineProperty(proxy, key, {
                get: function () {
                    return target[key];
                },
                set: function (obj) {
                    target[key] = obj;
                }
            });
        };
        for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
            var key = names_1[_i];
            _loop_1(key);
        }
    }
    egret.defineProxyProperties = defineProxyProperties;
    function bricksBufferToArrayBuffer(bricksBuffer) {
        var arrayBuffer = new ArrayBuffer(bricksBuffer.bufferLength());
        var uint8Array = new Uint8Array(arrayBuffer);
        var pointer = 0;
        while (pointer < bricksBuffer.bufferLength()) {
            uint8Array[pointer++] = bricksBuffer.readUint8Buffer();
        }
        // bricksBuffer.releaseBuffer();
        return arrayBuffer;
    }
    egret.bricksBufferToArrayBuffer = bricksBufferToArrayBuffer;
    function arrayBufferToBricksBuffer(arrayBuffer) {
        var bricksBuffer = new BK.Buffer(arrayBuffer.byteLength);
        var uint8Array = new Uint8Array(arrayBuffer);
        var pointer = 0;
        while (pointer < arrayBuffer.byteLength) {
            bricksBuffer.writeUint8Buffer(uint8Array[pointer++]);
        }
        return bricksBuffer;
    }
    egret.arrayBufferToBricksBuffer = arrayBufferToBricksBuffer;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var BKHttpRequest = (function (_super) {
        __extends(BKHttpRequest, _super);
        function BKHttpRequest() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._url = "";
            _this._method = "";
            /**
             * @private
             */
            _this.urlData = {};
            _this.responseHeader = "";
            return _this;
        }
        Object.defineProperty(BKHttpRequest.prototype, "responseType", {
            get: function () {
                return this._responseType;
            },
            set: function (value) {
                this._responseType = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKHttpRequest.prototype, "response", {
            get: function () {
                return this._response;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKHttpRequest.prototype, "withCredentials", {
            get: function () {
                return this._withCredentials;
            },
            set: function (value) {
                this._withCredentials = value;
            },
            enumerable: true,
            configurable: true
        });
        BKHttpRequest.prototype.open = function (url, method) {
            if (method === void 0) { method = "GET"; }
            this._url = url;
            this._method = method;
        };
        /**
         * @private
         * 发送请求.
         * @param data 需要发送的数据
         */
        BKHttpRequest.prototype.send = function (data) {
            var self = this;
            if (self.isNetUrl(self._url)) {
                var originalUrl = self._url;
                var encodeURL = this.encodeURL(originalUrl);
                this._bkHttpRequest = new BK.HttpUtil(encodeURL); // 没文档，只能新建实例
                var method = void 0;
                if (this._method === egret.HttpMethod.GET) {
                    method = "get";
                }
                else if (this._method === egret.HttpMethod.POST) {
                    method = "post";
                }
                this._bkHttpRequest.setHttpMethod(method);
                if (this._method === egret.HttpMethod.POST) {
                    this._bkHttpRequest.setHttpPostData(data);
                }
                this._bkHttpRequest.setHttpCookie(data); // 如何传 head
                this._bkHttpRequest.requestAsync(function (res, code) {
                    if (Number(code) === 200) {
                        if (self._responseType === egret.HttpResponseType.ARRAY_BUFFER) {
                            self._response = egret.bricksBufferToArrayBuffer(res);
                        }
                        else {
                            var egretBytes = new egret.ByteArray(egret.bricksBufferToArrayBuffer(res));
                            self._response = egretBytes.readUTFBytes(egretBytes.length);
                            // self._response = res.readAsString() || "";
                        }
                        egret.$callAsync(egret.Event.dispatchEvent, egret.Event, self, egret.Event.COMPLETE);
                    }
                    else {
                        egret.$warn(1019, code);
                        egret.Event.dispatchEvent(self, egret.IOErrorEvent.IO_ERROR);
                    }
                });
            }
            else if (!BK.FileUtil.isFileExist(self._url)) {
                // let promise = PromiseObject.create(); // TODO
                // promise.onSuccessFunc = readFileAsync;
                // promise.onErrorFunc = function () {
                //     Event.dispatchEvent(self, IOErrorEvent.IO_ERROR);
                // };
                // promise.onResponseHeaderFunc = this.onResponseHeader;
                // promise.onResponseHeaderThisObject = this;
                // egret_native.download(self._url, self._url, promise);
                egret.$callAsync(egret.Event.dispatchEvent, egret.IOErrorEvent, self, egret.IOErrorEvent.IO_ERROR);
            }
            else {
                var bkBuffer = BK.FileUtil.readFile(self._url);
                if (self._responseType === egret.HttpResponseType.ARRAY_BUFFER) {
                    self._response = egret.bricksBufferToArrayBuffer(bkBuffer);
                }
                else {
                    self._response = bkBuffer.readAsString() || "";
                }
                egret.$callAsync(egret.Event.dispatchEvent, egret.Event, self, egret.Event.COMPLETE);
            }
        };
        BKHttpRequest.prototype.encodeURL = function (originalUrl) {
            if (!originalUrl || originalUrl === '')
                return '';
            var search_index = originalUrl.indexOf("?");
            if (search_index < 0)
                return originalUrl;
            var head = originalUrl.slice(0, search_index);
            var search = originalUrl.slice(search_index + 1);
            var searchArr = search.split('&');
            var new_search = "";
            for (var i = 0; i < searchArr.length; i++) {
                var str = searchArr[i]; //"data=xxx";
                var strArr = str.split('=');
                //strArr[0] = "data"
                //strArr[1] = "xxx"|undefine;
                var name_1 = strArr[0];
                var value = strArr[1] ? strArr[1] : "";
                new_search += name_1 + "=" + encodeURIComponent(value);
                if (i < searchArr.length - 1) {
                    new_search += "&";
                }
            }
            return head + "?" + new_search;
        };
        /**
         * 是否是网络地址
         * @param url
         * @returns {boolean}
         */
        BKHttpRequest.prototype.isNetUrl = function (url) {
            return url.indexOf("http://") != -1 || url.indexOf("HTTP://") != -1 || url.indexOf("https://") != -1 || url.indexOf("HTTPS://") != -1;
        };
        /**
         * @private
         * 如果请求已经被发送,则立刻中止请求.
         */
        BKHttpRequest.prototype.abort = function () {
        };
        BKHttpRequest.prototype.onResponseHeader = function (headers) {
            this.responseHeader = "";
            var obj = JSON.parse(headers);
            for (var key in obj) {
                this.responseHeader += key + ": " + obj[key] + "\r\n";
            }
        };
        /**
         * @private
         * 返回所有响应头信息(响应头名和值), 如果响应头还没接受,则返回"".
         */
        BKHttpRequest.prototype.getAllResponseHeaders = function () {
            return this.responseHeader;
        };
        /**
         * @private
         * 给指定的HTTP请求头赋值.在这之前,您必须确认已经调用 open() 方法打开了一个url.
         * @param header 将要被赋值的请求头名称.
         * @param value 给指定的请求头赋的值.
         */
        BKHttpRequest.prototype.setRequestHeader = function (header, value) {
            if (!this.headerObj) {
                this.headerObj = {};
            }
            this.headerObj[header] = value;
        };
        /**
         * @private
         * 返回指定的响应头的值, 如果响应头还没被接受,或该响应头不存在,则返回"".
         * @param header 要返回的响应头名称
         */
        BKHttpRequest.prototype.getResponseHeader = function (header) {
            return "";
        };
        return BKHttpRequest;
    }(egret.EventDispatcher));
    egret.BKHttpRequest = BKHttpRequest;
    __reflect(BKHttpRequest.prototype, "egret.BKHttpRequest", ["egret.HttpRequest"]);
    egret.HttpRequest = BKHttpRequest;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var BKImageLoader = (function (_super) {
        __extends(BKImageLoader, _super);
        function BKImageLoader() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * @private
             * 使用 load() 方法加载成功的 BitmapData 图像数据。
             */
            _this.data = null;
            _this._crossOrigin = null;
            _this._hasCrossOriginSet = false;
            return _this;
        }
        Object.defineProperty(BKImageLoader.prototype, "crossOrigin", {
            get: function () {
                return this._crossOrigin;
            },
            set: function (value) {
                this._hasCrossOriginSet = true;
                this._crossOrigin = value;
            },
            enumerable: true,
            configurable: true
        });
        BKImageLoader.prototype.load = function (url) {
            if (url.indexOf('http://') >= 0 || url.indexOf('https://') >= 0) {
                //动态加载
                debugger;
                //根据url存储缓存的图片到沙盒中
                var sha1_1 = this._sha1FromUrl(url);
                var buff = BK.FileUtil.readFile("GameSandBox://webcache/image" + sha1_1);
                if (buff && buff.length > 0) {
                    this._loadFromBuffer.call(this, buff);
                }
                else {
                    var httpGet = new BK.HttpUtil(url);
                    httpGet.setHttpMethod("get");
                    httpGet.requestAsync(function (res, code) {
                        if (code == 200) {
                            BK.FileUtil.writeBufferToFile("GameSandBox://webcache/image" + sha1_1, res);
                            this._loadFromBuffer.call(this, res);
                        }
                        else {
                            console.log("BK http加载外部资源失败, url = " + url + ", code = " + code);
                            egret.$callAsync(egret.Event.dispatchEvent, egret.IOErrorEvent, this, egret.IOErrorEvent.IO_ERROR);
                        }
                    }.bind(this));
                }
            }
            else {
                if (BK.FileUtil.isFileExist(url)) {
                    this.data = new egret.BitmapData(url);
                    egret.$callAsync(egret.Event.dispatchEvent, egret.Event, this, egret.Event.COMPLETE);
                }
                else {
                    egret.$callAsync(egret.Event.dispatchEvent, egret.IOErrorEvent, this, egret.IOErrorEvent.IO_ERROR);
                }
            }
        };
        /**
         * 将url通过sha1算法解析
         * 返回sha1之后的url
         */
        BKImageLoader.prototype._sha1FromUrl = function (url) {
            var bufSha = BK.Misc.sha1(url);
            var sha1 = "";
            for (var i = 0; i < bufSha.length; i++) {
                var charCode = bufSha.readUint8Buffer();
                sha1 += charCode.toString(16);
            }
            return sha1;
        };
        /**
         * 通过buffer读取texture
         */
        BKImageLoader.prototype._loadFromBuffer = function (buffer) {
            var texture = BK.Texture.createTextureWithBuffer(buffer);
            this.data = new egret.BitmapData(texture);
            egret.$callAsync(egret.Event.dispatchEvent, egret.Event, this, egret.Event.COMPLETE);
            // var circle = new BK.Sprite(375, 375, circleTex, 0, 1, 1, 1);
            // BK.Director.root.addChild(circle);
        };
        BKImageLoader.crossOrigin = null;
        return BKImageLoader;
    }(egret.EventDispatcher));
    egret.BKImageLoader = BKImageLoader;
    __reflect(BKImageLoader.prototype, "egret.BKImageLoader", ["egret.ImageLoader"]);
    egret.ImageLoader = BKImageLoader;
})(egret || (egret = {}));
var egret;
(function (egret) {
    var BKSocket = (function () {
        function BKSocket() {
        }
        BKSocket.prototype.addCallBacks = function (onConnect, onClose, onSocketData, onError, thisObject) {
            this.onConnect = onConnect;
            this.onClose = onClose;
            this.onSocketData = onSocketData;
            this.onError = onError;
            this.thisObject = thisObject;
        };
        /**
         * 连接
         */
        BKSocket.prototype.connect = function (host, port) {
            var url = host + ":" + port;
            this.connectByUrl(url);
        };
        /**
         * 连接
         */
        BKSocket.prototype.connectByUrl = function (url) {
            this.$websocket = new BK.WebSocket(url);
            this.$websocket.connect();
            this._bindEvent();
        };
        BKSocket.prototype.BKSocketConnect = function (BKWebSocket) {
            this.$websocket = BKWebSocket;
            this.$websocket.connect();
            this._bindEvent();
        };
        BKSocket.prototype._bindEvent = function () {
            var that = this;
            var ws = this.$websocket;
            ws.onOpen = function (ws) {
                if (that.onConnect) {
                    that.onConnect.call(that.thisObject);
                }
            };
            ws.onClose = function (ws) {
                if (that.onClose) {
                    that.onClose.call(that.thisObject);
                }
            };
            ws.onError = function (ws) {
                if (that.onError) {
                    that.onError.call(that.thisObject);
                }
            };
            ws.onMessage = function (ws, data) {
                if (that.onSocketData) {
                    var result = void 0;
                    var bkbuffer = data.data;
                    if (!data.isBinary) {
                        // result = data.data.readAsString();
                        var egretBytes = new egret.ByteArray(egret.bricksBufferToArrayBuffer(bkbuffer));
                        result = egretBytes.readUTFBytes(egretBytes.length);
                    }
                    else {
                        result = egret.bricksBufferToArrayBuffer(bkbuffer);
                    }
                    that.onSocketData.call(that.thisObject, result);
                }
            };
        };
        BKSocket.prototype.send = function (message) {
            if (typeof message == "string") {
                this.$websocket.send(message);
            }
            else if (message instanceof ArrayBuffer) {
                // let b = new egret.ByteArray(message);
                // let msg = b.readUTF();
                // let bkBuffer = new BK.Buffer(msg.length);
                // bkBuffer.writeAsString(msg);
                var arrayBuffer = egret.arrayBufferToBricksBuffer(message);
                this.$websocket.send(arrayBuffer);
            }
        };
        BKSocket.prototype.resHandler = function (event) {
            switch (event.type) {
                case egret.Event.COMPLETE:
                    var request = event.currentTarget;
                    var ab = request.response;
                    console.log();
            }
        };
        BKSocket.prototype.close = function () {
            this.$websocket.close();
        };
        BKSocket.prototype.disconnect = function () {
            // if (this.$websocket.disconnect) {
            //     this.$websocket.disconnect();
            // }
            //BK.IWebSocket 不支持disconnect
            return;
        };
        return BKSocket;
    }());
    egret.BKSocket = BKSocket;
    __reflect(BKSocket.prototype, "egret.BKSocket", ["egret.ISocket"]);
    egret.ISocket = BKSocket;
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var sys;
    (function (sys) {
        var displayListPool = [];
        var blendModes = ["source-over", "lighter", "destination-out"];
        var defaultCompositeOp = "source-over";
        /**
         * @private
         * 显示列表
         */
        var BKDisplayList = (function (_super) {
            __extends(BKDisplayList, _super);
            /**
             * @private
             * 创建一个DisplayList对象
             */
            function BKDisplayList(root) {
                var _this = _super.call(this) || this;
                _this.isStage = false;
                /**
                 * 位图渲染节点
                 */
                _this.$renderNode = new sys.BitmapNode();
                /**
                 * @private
                 */
                _this.renderBuffer = null;
                /**
                 * @private
                 */
                _this.offsetX = 0;
                /**
                 * @private
                 */
                _this.offsetY = 0;
                /**
                 * @private
                 */
                _this.offsetMatrix = new egret.Matrix();
                _this.$canvasScaleX = 1;
                _this.$canvasScaleY = 1;
                _this.root = root;
                _this.isStage = (root instanceof egret.Stage);
                return _this;
            }
            /**
             * 创建一个DisplayList对象，若内存不足或无法创建RenderBuffer，将会返回null。
             */
            BKDisplayList.create = function (target) {
                var displayList = new egret.sys.DisplayList(target);
                try {
                    var buffer = new sys.RenderBuffer();
                    displayList.renderBuffer = buffer;
                }
                catch (e) {
                    return null;
                }
                displayList.root = target;
                return displayList;
            };
            /**
             * @private
             * 获取渲染节点
             */
            BKDisplayList.prototype.$getRenderNode = function () {
                return this.$renderNode;
            };
            /**
             * @private
             * 设置剪裁边界，不再绘制完整目标对象，画布尺寸由外部决定，超过边界的节点将跳过绘制。
             */
            BKDisplayList.prototype.setClipRect = function (width, height) {
                width *= sys.DisplayList.$canvasScaleX;
                height *= sys.DisplayList.$canvasScaleY;
                this.renderBuffer.resize(width, height);
            };
            /**
             * @private
             * 绘制根节点显示对象到目标画布，返回draw的次数。
             */
            BKDisplayList.prototype.drawToSurface = function () {
                var drawCalls = 0;
                this.$canvasScaleX = this.offsetMatrix.a = sys.DisplayList.$canvasScaleX;
                this.$canvasScaleY = this.offsetMatrix.d = sys.DisplayList.$canvasScaleY;
                if (!this.isStage) {
                    this.changeSurfaceSize();
                }
                //  else {
                //     this.offsetMatrix.setTo(this.offsetMatrix.a, this.offsetMatrix.b, this.offsetMatrix.c, this.offsetMatrix.d, this.offsetX, this.offsetY)
                // }
                var buffer = this.renderBuffer;
                buffer.clear();
                drawCalls = sys.systemRenderer.render(this.root, buffer, this.offsetMatrix);
                if (!this.isStage) {
                    var surface = buffer.surface;
                    var renderNode = this.$renderNode;
                    renderNode.drawData.length = 0;
                    var width = surface.width;
                    var height = surface.height;
                    if (!this.bitmapData) {
                        this.bitmapData = new egret.BitmapData(surface);
                    }
                    else {
                        this.bitmapData.source = surface;
                        this.bitmapData.width = width;
                        this.bitmapData.height = height;
                    }
                    renderNode.image = this.bitmapData;
                    renderNode.imageWidth = width;
                    renderNode.imageHeight = height;
                    renderNode.drawImage(0, 0, width, height, -this.offsetX, -this.offsetY, width / this.$canvasScaleX, height / this.$canvasScaleY);
                }
                return drawCalls;
            };
            /**
             * @private
             * 改变画布的尺寸，由于画布尺寸修改会清空原始画布。所以这里将原始画布绘制到一个新画布上，再与原始画布交换。
             */
            BKDisplayList.prototype.changeSurfaceSize = function () {
                var root = this.root;
                var oldOffsetX = this.offsetX;
                var oldOffsetY = this.offsetY;
                var bounds = this.root.$getOriginalBounds();
                var scaleX = this.$canvasScaleX;
                var scaleY = this.$canvasScaleY;
                this.offsetX = -bounds.x;
                this.offsetY = -bounds.y;
                this.offsetMatrix.setTo(this.offsetMatrix.a, 0, 0, this.offsetMatrix.d, this.offsetX, this.offsetY);
                var buffer = this.renderBuffer;
                //在chrome里，小等于256*256的canvas会不启用GPU加速。
                var width = Math.max(257, bounds.width * scaleX);
                var height = Math.max(257, bounds.height * scaleY);
                if (this.offsetX == oldOffsetX &&
                    this.offsetY == oldOffsetY &&
                    buffer.surface.width == width &&
                    buffer.surface.height == height) {
                    return;
                }
                buffer.resize(width, height);
            };
            /**
             * @private
             */
            BKDisplayList.$setCanvasScale = function (x, y) {
                sys.DisplayList.$canvasScaleX = x;
                sys.DisplayList.$canvasScaleY = y;
            };
            BKDisplayList.$canvasScaleFactor = 1;
            /**
             * @private
             */
            BKDisplayList.$canvasScaleX = 1;
            BKDisplayList.$canvasScaleY = 1;
            return BKDisplayList;
        }(egret.HashObject));
        sys.BKDisplayList = BKDisplayList;
        __reflect(BKDisplayList.prototype, "egret.sys.BKDisplayList");
        egret.sys.DisplayList = BKDisplayList;
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        var sharedCanvas;
        /**
         * @private
         * Canvas2D渲染缓冲
         */
        var CanvasRenderBuffer = (function () {
            function CanvasRenderBuffer(width, height, root) {
                this.surface = { width: width, height: height }; //createCanvas(width, height);
                this.context = new BK.Canvas(width, height); //{}//this.surface.getContext("2d");
                // this.last_matrix = new egret.Matrix();
                if (this.context) {
                    this.context.$offsetX = 0;
                    this.context.$offsetY = 0;
                }
            }
            Object.defineProperty(CanvasRenderBuffer.prototype, "width", {
                /**
                 * 渲染缓冲的宽度，以像素为单位。
                 * @readOnly
                 */
                get: function () {
                    return this.surface.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CanvasRenderBuffer.prototype, "height", {
                /**
                 * 渲染缓冲的高度，以像素为单位。
                 * @readOnly
                 */
                get: function () {
                    return this.surface.height;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 改变渲染缓冲的大小并清空缓冲区
             * @param width 改变后的宽
             * @param height 改变后的高
             * @param useMaxSize 若传入true，则将改变后的尺寸与已有尺寸对比，保留较大的尺寸。
             */
            CanvasRenderBuffer.prototype.resize = function (width, height, useMaxSize) {
                var surface = this.surface;
                if (useMaxSize) {
                    var change = false;
                    if (surface.width < width) {
                        surface.width = width;
                        change = true;
                    }
                    if (surface.height < height) {
                        surface.height = height;
                        change = true;
                    }
                    //尺寸没有变化时,将绘制属性重置
                    if (!change) {
                        this.context.globalCompositeOperation = "source-over";
                        this.context_setTransform(1, 0, 0, 1, 0, 0);
                        this.context.globalAlpha = 1;
                    }
                    else {
                        this.context.size = { width: surface.width, height: surface.height };
                    }
                }
                else {
                    if (surface.width != width) {
                        surface.width = width;
                    }
                    if (surface.height != height) {
                        surface.height = height;
                    }
                    this.context.size = { width: surface.width, height: surface.height };
                }
                this.clear();
            };
            /**
             * BK新增
             * 操作context进行矩阵变化
             */
            CanvasRenderBuffer.prototype.context_setTransform = function (a, b, c, d, tx, ty) {
                //查看有没有逆矩阵
                //先乘以逆矩阵
                var inversMatrix = this.inversMatrix;
                var targetMatrix = egret.Matrix.create().setTo(a, b, c, d, tx, ty);
                var resultMatrix = egret.Matrix.create().setTo(1, 0, 0, 1, 0, 0);
                if (inversMatrix) {
                    resultMatrix.concat(inversMatrix);
                }
                else {
                    inversMatrix = egret.Matrix.create();
                }
                inversMatrix.setTo(a, b, c, d, tx, ty);
                inversMatrix.invert();
                this.inversMatrix = inversMatrix;
                resultMatrix.concat(targetMatrix);
                this.context.transforms(resultMatrix.a, resultMatrix.b, resultMatrix.c, resultMatrix.d, resultMatrix.tx, resultMatrix.ty);
                egret.Matrix.release(targetMatrix);
                egret.Matrix.release(resultMatrix);
                // this.context.transforms(a, b, c, d, tx, ty);
            };
            /**
             * 获取指定区域的像素
             * BK brick不支持像素颜色信息提取，
             * 这里做一个简单处理，只要坐标在canvas内，就返回true；
             */
            CanvasRenderBuffer.prototype.getPixels = function (x, y, width, height) {
                if (width === void 0) { width = 1; }
                if (height === void 0) { height = 1; }
                return undefined;
                // return <number[]><any>this.context.getImageData(x, y, width, height).data;
            };
            /**
             * 转换成base64字符串，如果图片（或者包含的图片）跨域，则返回null
             * @param type 转换的类型，如: "image/png","image/jpeg"
             */
            CanvasRenderBuffer.prototype.toDataURL = function (type, encoderOptions) {
                return this.surface.toDataURL(type, encoderOptions);
            };
            /**
             * 清空缓冲区数据
             */
            CanvasRenderBuffer.prototype.clear = function () {
                if (this.inversMatrix) {
                    this.inversMatrix.setTo(1, 0, 0, 1, 0, 0);
                }
                this.context_setTransform(1, 0, 0, 1, 0, 0);
                this.context.clearRect(0, 0, this.surface.width, this.surface.height);
            };
            /**
             * 销毁绘制对象
             */
            CanvasRenderBuffer.prototype.destroy = function () {
                this.surface.width = this.surface.height = 0;
            };
            return CanvasRenderBuffer;
        }());
        web.CanvasRenderBuffer = CanvasRenderBuffer;
        __reflect(CanvasRenderBuffer.prototype, "egret.web.CanvasRenderBuffer", ["egret.sys.RenderBuffer"]);
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var CAPS_STYLES = { none: 'butt', square: 'square', round: 'round' };
    var BKCanvasRenderer = (function (_super) {
        __extends(BKCanvasRenderer, _super);
        function BKCanvasRenderer() {
            var _this = _super.call(this) || this;
            _this._renderingMask = false;
            return _this;
        }
        BKCanvasRenderer.prototype.renderText = function (node, context) {
            context.textAlign = "left";
            context.textBaseLine = "middle";
            context.lineJoin = "round"; //确保描边样式是圆角
            var drawData = node.drawData;
            var length = drawData.length;
            var pos = 0;
            while (pos < length) {
                var x = drawData[pos++];
                var y = drawData[pos++];
                var text = drawData[pos++];
                var format = drawData[pos++];
                context.setTextSize(node.size);
                // context.font = getFontString(node, format);
                var textColor = format.textColor == null ? node.textColor : format.textColor;
                var strokeColor = format.strokeColor == null ? node.strokeColor : format.strokeColor;
                var stroke = format.stroke == null ? node.stroke : format.stroke;
                var textColorstr = refitColorString(textColor, 6); //六位rgb格式
                var fill_red = parseInt(textColorstr.substring(0, 2), 16) / 255;
                var fill_green = parseInt(textColorstr.substring(2, 4), 16) / 255;
                var fill_blue = parseInt(textColorstr.substring(4, 6), 16) / 255;
                var strokeColorstr = refitColorString(strokeColor, 6); //六位rgb格式
                var stroke_red = parseInt(strokeColorstr.substring(0, 2), 16) / 255;
                var stroke_green = parseInt(strokeColorstr.substring(2, 4), 16) / 255;
                var stroke_blue = parseInt(strokeColorstr.substring(4, 6), 16) / 255;
                context.fillColor = { r: fill_red, g: fill_green, b: fill_blue, a: 1 };
                context.strokeColor = { r: stroke_red, g: stroke_green, b: stroke_blue, a: 1 };
                // context.fillStyle = toColorString(textColor);
                // context.strokeStyle = toColorString(strokeColor);
                if (stroke) {
                    context.lineWidth = stroke * 2;
                    // context.strokeText(text, x + offsetX, y + offsetY);
                }
                //BK error
                //在这里y的偏移量会导致文本位置在textfield外，这里写为0。
                // context.fillText(text, x + offsetX, y + offsetY);
                context.fillText(text, x + context.$offsetX, -y + context.$offsetY + node.height - node.size / 2 - 2);
            }
        };
        BKCanvasRenderer.prototype.renderGraphics = function (node, context, forHitTest) {
            var drawData = node.drawData;
            var length = drawData.length;
            forHitTest = !!forHitTest;
            for (var i = 0; i < length; i++) {
                var path = drawData[i];
                switch (path.type) {
                    case 1 /* Fill */:
                        var fillPath = path;
                        // context.fillStyle = forHitTest ? BLACK_COLOR : getRGBAString(fillPath.fillColor, fillPath.fillAlpha);
                        var fill_str = refitColorString(fillPath.fillColor, 6);
                        var fill_red = parseInt(fill_str.substring(0, 2), 16) / 255;
                        var fill_green = parseInt(fill_str.substring(2, 4), 16) / 255;
                        var fill_blue = parseInt(fill_str.substring(4, 6), 16) / 255;
                        //MD
                        //BK通过drawStyle确定是fill还是stroke，0为fill，1为stroke
                        context.fillColor = { r: fill_red, g: fill_green, b: fill_blue, a: fillPath.fillAlpha };
                        context.drawStyle = 0;
                        this._renderPath(path, context, node.height);
                        if (this._renderingMask) {
                            context.clip();
                        }
                        else {
                            context.fill();
                        }
                        break;
                    case 2 /* GradientFill */:
                        var g = path;
                        // context.fillStyle = forHitTest ? BLACK_COLOR : getGradient(context, g.gradientType, g.colors, g.alphas, g.ratios, g.matrix);
                        context.save();
                        var m = g.matrix;
                        context.drawStyle = 0;
                        this._renderPath(path, context, node.height);
                        context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                        context.fill();
                        context.restore();
                        break;
                    case 3 /* Stroke */:
                        var strokeFill = path;
                        var lineWidth = strokeFill.lineWidth;
                        context.lineWidth = lineWidth;
                        // context.strokeStyle = forHitTest ? BLACK_COLOR : getRGBAString(strokeFill.lineColor, strokeFill.lineAlpha);
                        var stroke_str = refitColorString(strokeFill.lineColor, 6);
                        var stroke_red = parseInt(stroke_str.substring(0, 2), 16) / 255;
                        var stroke_green = parseInt(stroke_str.substring(2, 4), 16) / 255;
                        var stroke_blue = parseInt(stroke_str.substring(4, 6), 16) / 255;
                        context.strokeColor = { r: stroke_red, g: stroke_green, b: stroke_blue, a: strokeFill.lineAlpha };
                        context.drawStyle = 1;
                        context.lineCap = CAPS_STYLES[strokeFill.caps];
                        context.lineJoin = strokeFill.joints;
                        context.miterLimit = strokeFill.miterLimit;
                        if (context.setLineDash) {
                            context.setLineDash(strokeFill.lineDash);
                        }
                        //对1像素和3像素特殊处理，向右下角偏移0.5像素，以显示清晰锐利的线条。
                        var isSpecialCaseWidth = lineWidth === 1 || lineWidth === 3;
                        if (isSpecialCaseWidth) {
                            context.translate(0.5, 0.5);
                        }
                        this._renderPath(path, context, node.height);
                        context.stroke();
                        if (isSpecialCaseWidth) {
                            context.translate(-0.5, -0.5);
                        }
                        break;
                }
            }
            return length == 0 ? 0 : 1;
        };
        BKCanvasRenderer.prototype._renderPath = function (path, context, h) {
            context.beginPath();
            var data = path.$data;
            var commands = path.$commands;
            var commandCount = commands.length;
            var pos = 0;
            var height = h;
            var offsetX = context.$offsetX;
            var offsetY = context.$offsetY;
            for (var commandIndex = 0; commandIndex < commandCount; commandIndex++) {
                var command = commands[commandIndex];
                var x1 = void 0;
                var y1 = void 0;
                var x2 = void 0;
                var y2 = void 0;
                var x3 = void 0;
                var y3 = void 0;
                switch (command) {
                    case 4 /* CubicCurveTo */:
                        x1 = data[pos++];
                        y1 = data[pos++];
                        x2 = data[pos++];
                        y2 = data[pos++];
                        x3 = data[pos++];
                        y3 = data[pos++];
                        context.bezierCurveTo(x1 + offsetX, height - y1 + offsetY, x2 + offsetX, height - y2 + offsetY, x3 + offsetX, height - y3 + offsetY);
                        break;
                    case 3 /* CurveTo */:
                        x1 = data[pos++];
                        y1 = data[pos++];
                        x2 = data[pos++];
                        y2 = data[pos++];
                        context.quadraticCurveTo(x1 + offsetX, height - y1 + offsetY, x2 + offsetX, height - y2 + offsetY);
                        break;
                    case 2 /* LineTo */:
                        x1 = data[pos++];
                        y1 = data[pos++];
                        context.lineTo(x1 + offsetX, height - y1 + offsetY);
                        break;
                    case 1 /* MoveTo */:
                        offsetX = data[pos++];
                        offsetY = data[pos++];
                        context.moveTo(0 + offsetX, height - 0 + offsetY);
                        break;
                }
            }
        };
        BKCanvasRenderer.prototype.drawNodeToBuffer = function (node, buffer, matrix, forHitTest) {
            var context = buffer.context;
            context.transforms(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
            this.renderNode(node, context, forHitTest);
        };
        BKCanvasRenderer.prototype.renderNode = function (node, context, forHitTest) {
            var drawCalls = 0;
            // switch (node.type) {
            //     case sys.RenderNodeType.BitmapNode:
            //         drawCalls = this.renderBitmap(<sys.BitmapNode>node, context);
            //         break;
            //     case sys.RenderNodeType.TextNode:
            //         drawCalls = 1;
            //         this.renderText(<sys.TextNode>node, context);
            //         break;
            //     case sys.RenderNodeType.GraphicsNode:
            if (node.type == 3 /* GraphicsNode */) {
                drawCalls = this.renderGraphics(node, context, forHitTest);
            }
            else {
                throw egret.error('CanvasRenderer  renderNode 使用了未知的node类型');
            }
            // break;
            //     case sys.RenderNodeType.GroupNode:
            //         drawCalls = this.renderGroup(<sys.GroupNode>node, context);
            //         break;
            //     case sys.RenderNodeType.MeshNode:
            //         drawCalls = this.renderMesh(<sys.MeshNode>node, context);
            //         break;
            //     case sys.RenderNodeType.NormalBitmapNode:
            //         drawCalls += this.renderNormalBitmap(<sys.NormalBitmapNode>node, context);
            //         break;
            // }
            return drawCalls;
        };
        return BKCanvasRenderer;
    }(egret.CanvasRenderer));
    egret.BKCanvasRenderer = BKCanvasRenderer;
    __reflect(BKCanvasRenderer.prototype, "egret.BKCanvasRenderer");
    //     /**
    //  * @private
    //  * 获取字体字符串
    //  */
    //     export function getFontString(node: sys.TextNode, format: sys.TextFormat): string {
    //         let italic: boolean = format.italic == null ? node.italic : format.italic;
    //         let bold: boolean = format.bold == null ? node.bold : format.bold;
    //         let size: number = format.size == null ? node.size : format.size;
    //         let fontFamily: string = format.fontFamily || node.fontFamily;
    //         let font: string = italic ? "italic " : "normal ";
    //         font += bold ? "bold " : "normal ";
    //         font += size + "px " + fontFamily;
    //         return font;
    //     }
    // export function getAlign(align_str:string){
    //     if(align)
    // }
    /**
      * 为16进制数字补0，输出字符串
      */
    function refitColorString(num, length) {
        var str = num.toString(16);
        var zero = "00000000";
        return zero.substr(0, length - str.length) + str;
    }
    egret.refitColorString = refitColorString;
    if (window['renderMode'] == 'webgl') {
        egret.CanvasRenderer = BKCanvasRenderer;
    }
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var WEBGL_ATTRIBUTE_TYPE;
        (function (WEBGL_ATTRIBUTE_TYPE) {
            WEBGL_ATTRIBUTE_TYPE[WEBGL_ATTRIBUTE_TYPE["FLOAT_VEC2"] = 35664] = "FLOAT_VEC2";
            WEBGL_ATTRIBUTE_TYPE[WEBGL_ATTRIBUTE_TYPE["FLOAT_VEC3"] = 35665] = "FLOAT_VEC3";
            WEBGL_ATTRIBUTE_TYPE[WEBGL_ATTRIBUTE_TYPE["FLOAT_VEC4"] = 35666] = "FLOAT_VEC4";
            WEBGL_ATTRIBUTE_TYPE[WEBGL_ATTRIBUTE_TYPE["FLOAT"] = 5126] = "FLOAT";
            WEBGL_ATTRIBUTE_TYPE[WEBGL_ATTRIBUTE_TYPE["BYTE"] = 65535] = "BYTE";
            WEBGL_ATTRIBUTE_TYPE[WEBGL_ATTRIBUTE_TYPE["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
            WEBGL_ATTRIBUTE_TYPE[WEBGL_ATTRIBUTE_TYPE["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
        })(WEBGL_ATTRIBUTE_TYPE = web.WEBGL_ATTRIBUTE_TYPE || (web.WEBGL_ATTRIBUTE_TYPE = {}));
        /**
         * @private
         */
        var EgretWebGLAttribute = (function () {
            function EgretWebGLAttribute(gl, program, attributeData) {
                this.gl = gl;
                this.name = attributeData.name;
                this.type = attributeData.type;
                this.size = attributeData.size;
                this.location = gl.getAttribLocation(program, this.name);
                this.count = 0;
                this.initCount(gl);
                this.format = gl.FLOAT;
                this.initFormat(gl);
            }
            EgretWebGLAttribute.prototype.initCount = function (gl) {
                var type = this.type;
                switch (type) {
                    case WEBGL_ATTRIBUTE_TYPE.FLOAT:
                    case WEBGL_ATTRIBUTE_TYPE.BYTE:
                    case WEBGL_ATTRIBUTE_TYPE.UNSIGNED_BYTE:
                    case WEBGL_ATTRIBUTE_TYPE.UNSIGNED_SHORT:
                        this.count = 1;
                        break;
                    case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC2:
                        this.count = 2;
                        break;
                    case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC3:
                        this.count = 3;
                        break;
                    case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC4:
                        this.count = 4;
                        break;
                }
            };
            EgretWebGLAttribute.prototype.initFormat = function (gl) {
                var type = this.type;
                switch (type) {
                    case WEBGL_ATTRIBUTE_TYPE.FLOAT:
                    case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC2:
                    case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC3:
                    case WEBGL_ATTRIBUTE_TYPE.FLOAT_VEC4:
                        this.format = gl.FLOAT;
                        break;
                    case WEBGL_ATTRIBUTE_TYPE.UNSIGNED_BYTE:
                        this.format = gl.UNSIGNED_BYTE;
                        break;
                    case WEBGL_ATTRIBUTE_TYPE.UNSIGNED_SHORT:
                        this.format = gl.UNSIGNED_SHORT;
                        break;
                    case WEBGL_ATTRIBUTE_TYPE.BYTE:
                        this.format = gl.BYTE;
                        break;
                }
            };
            return EgretWebGLAttribute;
        }());
        web.EgretWebGLAttribute = EgretWebGLAttribute;
        __reflect(EgretWebGLAttribute.prototype, "egret.web.EgretWebGLAttribute");
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        function loadShader(gl, type, source) {
            var shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (!compiled) {
                console.log("shader not compiled!");
                console.log(gl.getShaderInfoLog(shader));
            }
            return shader;
        }
        function createWebGLProgram(gl, vertexShader, fragmentShader) {
            var program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            return program;
        }
        function extractAttributes(gl, program) {
            var attributes = {};
            var totalAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
            for (var i = 0; i < totalAttributes; i++) {
                var attribData = gl.getActiveAttrib(program, i);
                var name_2 = attribData.name;
                var attribute = new web.EgretWebGLAttribute(gl, program, attribData);
                attributes[name_2] = attribute;
            }
            return attributes;
        }
        function extractUniforms(gl, program) {
            var uniforms = {};
            var totalUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
            for (var i = 0; i < totalUniforms; i++) {
                var uniformData = gl.getActiveUniform(program, i);
                var name_3 = uniformData.name;
                var uniform = new web.EgretWebGLUniform(gl, program, uniformData);
                uniforms[name_3] = uniform;
            }
            return uniforms;
        }
        /**
         * @private
         */
        var EgretWebGLProgram = (function () {
            function EgretWebGLProgram(gl, vertSource, fragSource) {
                this.vshaderSource = vertSource;
                this.fshaderSource = fragSource;
                this.vertexShader = loadShader(gl, gl.VERTEX_SHADER, this.vshaderSource);
                this.fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, this.fshaderSource);
                this.id = createWebGLProgram(gl, this.vertexShader, this.fragmentShader);
                this.uniforms = extractUniforms(gl, this.id);
                this.attributes = extractAttributes(gl, this.id);
            }
            /**
             * 获取所需的WebGL Program
             * @param key {string} 对于唯一的program程序，对应唯一的key
             */
            EgretWebGLProgram.getProgram = function (gl, vertSource, fragSource, key) {
                if (!this.programCache[key]) {
                    this.programCache[key] = new EgretWebGLProgram(gl, vertSource, fragSource);
                }
                return this.programCache[key];
            };
            EgretWebGLProgram.deleteProgram = function (gl, vertSource, fragSource, key) {
                // TODO delete
            };
            EgretWebGLProgram.programCache = {};
            return EgretWebGLProgram;
        }());
        web.EgretWebGLProgram = EgretWebGLProgram;
        __reflect(EgretWebGLProgram.prototype, "egret.web.EgretWebGLProgram");
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var WEBGL_UNIFORM_TYPE;
        (function (WEBGL_UNIFORM_TYPE) {
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["FLOAT_VEC2"] = 35664] = "FLOAT_VEC2";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["FLOAT_VEC3"] = 35665] = "FLOAT_VEC3";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["FLOAT_VEC4"] = 35666] = "FLOAT_VEC4";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["INT_VEC2"] = 35667] = "INT_VEC2";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["INT_VEC3"] = 35668] = "INT_VEC3";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["INT_VEC4"] = 35669] = "INT_VEC4";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["BOOL"] = 35670] = "BOOL";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["BOOL_VEC2"] = 35671] = "BOOL_VEC2";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["BOOL_VEC3"] = 35672] = "BOOL_VEC3";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["BOOL_VEC4"] = 35673] = "BOOL_VEC4";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["FLOAT_MAT2"] = 35674] = "FLOAT_MAT2";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["FLOAT_MAT3"] = 35675] = "FLOAT_MAT3";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["FLOAT_MAT4"] = 35676] = "FLOAT_MAT4";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["SAMPLER_2D"] = 35678] = "SAMPLER_2D";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["SAMPLER_CUBE"] = 35680] = "SAMPLER_CUBE";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["BYTE"] = 65535] = "BYTE";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["SHORT"] = 5122] = "SHORT";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["INT"] = 5124] = "INT";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["UNSIGNED_INT"] = 5125] = "UNSIGNED_INT";
            WEBGL_UNIFORM_TYPE[WEBGL_UNIFORM_TYPE["FLOAT"] = 5126] = "FLOAT";
        })(WEBGL_UNIFORM_TYPE = web.WEBGL_UNIFORM_TYPE || (web.WEBGL_UNIFORM_TYPE = {}));
        /**
         * @private
         */
        var EgretWebGLUniform = (function () {
            function EgretWebGLUniform(gl, program, uniformData) {
                this.gl = gl;
                this.name = uniformData.name;
                this.type = uniformData.type;
                this.size = uniformData.size;
                this.location = gl.getUniformLocation(program, this.name);
                this.setDefaultValue();
                this.generateSetValue();
                this.generateUpload();
            }
            EgretWebGLUniform.prototype.setDefaultValue = function () {
                var type = this.type;
                switch (type) {
                    case WEBGL_UNIFORM_TYPE.FLOAT:
                    case WEBGL_UNIFORM_TYPE.SAMPLER_2D:
                    case WEBGL_UNIFORM_TYPE.SAMPLER_CUBE:
                    case WEBGL_UNIFORM_TYPE.BOOL:
                    case WEBGL_UNIFORM_TYPE.INT:
                        this.value = 0;
                        break;
                    case WEBGL_UNIFORM_TYPE.FLOAT_VEC2:
                    case WEBGL_UNIFORM_TYPE.BOOL_VEC2:
                    case WEBGL_UNIFORM_TYPE.INT_VEC2:
                        this.value = [0, 0];
                        break;
                    case WEBGL_UNIFORM_TYPE.FLOAT_VEC3:
                    case WEBGL_UNIFORM_TYPE.BOOL_VEC3:
                    case WEBGL_UNIFORM_TYPE.INT_VEC3:
                        this.value = [0, 0, 0];
                        break;
                    case WEBGL_UNIFORM_TYPE.FLOAT_VEC4:
                    case WEBGL_UNIFORM_TYPE.BOOL_VEC4:
                    case WEBGL_UNIFORM_TYPE.INT_VEC4:
                        this.value = [0, 0, 0, 0];
                        break;
                    case WEBGL_UNIFORM_TYPE.FLOAT_MAT2:
                        this.value = new Float32Array([
                            1, 0,
                            0, 1
                        ]);
                        break;
                    case WEBGL_UNIFORM_TYPE.FLOAT_MAT3:
                        this.value = new Float32Array([
                            1, 0, 0,
                            0, 1, 0,
                            0, 0, 1
                        ]);
                        break;
                    case WEBGL_UNIFORM_TYPE.FLOAT_MAT4:
                        this.value = new Float32Array([
                            1, 0, 0, 0,
                            0, 1, 0, 0,
                            0, 0, 1, 0,
                            0, 0, 0, 1
                        ]);
                        break;
                }
            };
            EgretWebGLUniform.prototype.generateSetValue = function () {
                var type = this.type;
                switch (type) {
                    case WEBGL_UNIFORM_TYPE.FLOAT:
                    case WEBGL_UNIFORM_TYPE.SAMPLER_2D:
                    case WEBGL_UNIFORM_TYPE.SAMPLER_CUBE:
                    case WEBGL_UNIFORM_TYPE.BOOL:
                    case WEBGL_UNIFORM_TYPE.INT:
                        this.setValue = function (value) {
                            var notEqual = this.value !== value;
                            this.value = value;
                            notEqual && this.upload();
                        };
                        break;
                    case WEBGL_UNIFORM_TYPE.FLOAT_VEC2:
                    case WEBGL_UNIFORM_TYPE.BOOL_VEC2:
                    case WEBGL_UNIFORM_TYPE.INT_VEC2:
                        this.setValue = function (value) {
                            var notEqual = this.value[0] !== value.x || this.value[1] !== value.y;
                            this.value[0] = value.x;
                            this.value[1] = value.y;
                            notEqual && this.upload();
                        };
                        break;
                    case WEBGL_UNIFORM_TYPE.FLOAT_VEC3:
                    case WEBGL_UNIFORM_TYPE.BOOL_VEC3:
                    case WEBGL_UNIFORM_TYPE.INT_VEC3:
                        this.setValue = function (value) {
                            this.value[0] = value.x;
                            this.value[1] = value.y;
                            this.value[2] = value.z;
                            this.upload();
                        };
                        break;
                    case WEBGL_UNIFORM_TYPE.FLOAT_VEC4:
                    case WEBGL_UNIFORM_TYPE.BOOL_VEC4:
                    case WEBGL_UNIFORM_TYPE.INT_VEC4:
                        this.setValue = function (value) {
                            this.value[0] = value.x;
                            this.value[1] = value.y;
                            this.value[2] = value.z;
                            this.value[3] = value.w;
                            this.upload();
                        };
                        break;
                    case WEBGL_UNIFORM_TYPE.FLOAT_MAT2:
                    case WEBGL_UNIFORM_TYPE.FLOAT_MAT3:
                    case WEBGL_UNIFORM_TYPE.FLOAT_MAT4:
                        this.setValue = function (value) {
                            this.value.set(value);
                            this.upload();
                        };
                        break;
                }
            };
            EgretWebGLUniform.prototype.generateUpload = function () {
                var gl = this.gl;
                var type = this.type;
                var location = this.location;
                switch (type) {
                    case WEBGL_UNIFORM_TYPE.FLOAT:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform1f(location, value);
                        };
                        break;
                    case WEBGL_UNIFORM_TYPE.FLOAT_VEC2:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform2f(location, value[0], value[1]);
                        };
                        break;
                    case WEBGL_UNIFORM_TYPE.FLOAT_VEC3:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform3f(location, value[0], value[1], value[2]);
                        };
                        break;
                    case WEBGL_UNIFORM_TYPE.FLOAT_VEC4:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform4f(location, value[0], value[1], value[2], value[3]);
                        };
                        break;
                    case WEBGL_UNIFORM_TYPE.SAMPLER_2D:
                    case WEBGL_UNIFORM_TYPE.SAMPLER_CUBE:
                    case WEBGL_UNIFORM_TYPE.BOOL:
                    case WEBGL_UNIFORM_TYPE.INT:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform1i(location, value);
                        };
                        break;
                    case WEBGL_UNIFORM_TYPE.BOOL_VEC2:
                    case WEBGL_UNIFORM_TYPE.INT_VEC2:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform2i(location, value[0], value[1]);
                        };
                        break;
                    case WEBGL_UNIFORM_TYPE.BOOL_VEC3:
                    case WEBGL_UNIFORM_TYPE.INT_VEC3:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform3i(location, value[0], value[1], value[2]);
                        };
                        break;
                    case WEBGL_UNIFORM_TYPE.BOOL_VEC4:
                    case WEBGL_UNIFORM_TYPE.INT_VEC4:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniform4i(location, value[0], value[1], value[2], value[3]);
                        };
                        break;
                    case WEBGL_UNIFORM_TYPE.FLOAT_MAT2:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniformMatrix2fv(location, false, value);
                        };
                        break;
                    case WEBGL_UNIFORM_TYPE.FLOAT_MAT3:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniformMatrix3fv(location, false, value);
                        };
                        break;
                    case WEBGL_UNIFORM_TYPE.FLOAT_MAT4:
                        this.upload = function () {
                            var value = this.value;
                            gl.uniformMatrix4fv(location, false, value);
                        };
                        break;
                }
            };
            return EgretWebGLUniform;
        }());
        web.EgretWebGLUniform = EgretWebGLUniform;
        __reflect(EgretWebGLUniform.prototype, "egret.web.EgretWebGLUniform");
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * A BitmapData object contains an array of pixel data. This data can represent either a fully opaque bitmap or a
     * transparent bitmap that contains alpha channel data. Either type of BitmapData object is stored as a buffer of 32-bit
     * integers. Each 32-bit integer determines the properties of a single pixel in the bitmap.<br/>
     * Each 32-bit integer is a combination of four 8-bit channel values (from 0 to 255) that describe the alpha transparency
     * and the red, green, and blue (ARGB) values of the pixel. (For ARGB values, the most significant byte represents the
     * alpha channel value, followed by red, green, and blue.)
     * @see egret.Bitmap
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * BitmapData 对象是一个包含像素数据的数组。此数据可以表示完全不透明的位图，或表示包含 Alpha 通道数据的透明位图。
     * 以上任一类型的 BitmapData 对象都作为 32 位整数的缓冲区进行存储。每个 32 位整数确定位图中单个像素的属性。<br/>
     * 每个 32 位整数都是四个 8 位通道值（从 0 到 255）的组合，这些值描述像素的 Alpha 透明度以及红色、绿色、蓝色 (ARGB) 值。
     * （对于 ARGB 值，最高有效字节代表 Alpha 通道值，其后的有效字节分别代表红色、绿色和蓝色通道值。）
     * @see egret.Bitmap
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    var WebGLBitmapData = (function () {
        /**
         * Initializes a BitmapData object to refer to the specified source object.
         * @param source The source object being referenced.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建一个引用指定 source 实例的 BitmapData 对象
         * @param source 被引用的 source 实例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        function WebGLBitmapData(source) {
            /**
             * Texture format.
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 纹理格式。
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            this.format = "image";
            /**
             * @private
             * webgl纹理生成后，是否删掉原始图像数据
             */
            this.$deleteSource = true;
            if (typeof source == "string") {
                var image = BK.Image.loadImage(source, 6);
                this.source = image;
                this.width = image.width;
                this.height = image.height;
                this.BK_format = image.format;
            }
            else {
                this.source = source;
                this.width = source.width;
                this.height = source.height;
            }
        }
        WebGLBitmapData.create = function (type, data, callback) {
            var base64 = "";
            if (type === "arraybuffer") {
                base64 = egret.Base64Util.encode(data);
            }
            else {
                base64 = data;
            }
            var imageType = "image/png"; //default value
            if (base64.charAt(0) === '/') {
                imageType = "image/jpeg";
            }
            else if (base64.charAt(0) === 'R') {
                imageType = "image/gif";
            }
            else if (base64.charAt(0) === 'i') {
                imageType = "image/png";
            }
            var img = new Image();
            img.src = "data:" + imageType + ";base64," + base64;
            img.crossOrigin = '*';
            var bitmapData = new egret.BitmapData(img);
            img.onload = function () {
                img.onload = undefined;
                bitmapData.source = img;
                bitmapData.height = img.height;
                bitmapData.width = img.width;
                if (callback) {
                    callback(bitmapData);
                }
            };
            return bitmapData;
        };
        WebGLBitmapData.prototype.$dispose = function () {
            // if (Capabilities.renderMode == "webgl" && this.webGLTexture) {
            //     egret.WebGLUtils.deleteWebGLTexture(this.webGLTexture);
            //     this.webGLTexture = null;
            // }
            //native or WebGLRenderTarget
            if (this.source && this.source.dispose) {
                this.source.dispose();
            }
            this.source = null;
            egret.BitmapData.$dispose(this);
        };
        WebGLBitmapData.$addDisplayObject = function (displayObject, bitmapData) {
            if (!bitmapData) {
                return;
            }
            var hashCode = bitmapData.hashCode;
            if (!hashCode) {
                return;
            }
            if (!this._displayList[hashCode]) {
                this._displayList[hashCode] = [displayObject];
                return;
            }
            var tempList = this._displayList[hashCode];
            if (tempList.indexOf(displayObject) < 0) {
                tempList.push(displayObject);
            }
        };
        WebGLBitmapData.$removeDisplayObject = function (displayObject, bitmapData) {
            if (!bitmapData) {
                return;
            }
            var hashCode = bitmapData.hashCode;
            if (!hashCode) {
                return;
            }
            if (!this._displayList[hashCode]) {
                return;
            }
            var tempList = this._displayList[hashCode];
            var index = tempList.indexOf(displayObject);
            if (index >= 0) {
                tempList.splice(index);
            }
        };
        WebGLBitmapData.$invalidate = function (bitmapData) {
            if (!bitmapData) {
                return;
            }
            var hashCode = bitmapData.hashCode;
            if (!hashCode) {
                return;
            }
            if (!this._displayList[hashCode]) {
                return;
            }
            var tempList = this._displayList[hashCode];
            for (var i = 0; i < tempList.length; i++) {
                if (tempList[i] instanceof egret.Bitmap) {
                    tempList[i].$refreshImageData();
                }
                var bitmap = tempList[i];
                bitmap.$renderDirty = true;
                var p = bitmap.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                var maskedObject = bitmap.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        };
        WebGLBitmapData.$dispose = function (bitmapData) {
            if (!bitmapData) {
                return;
            }
            var hashCode = bitmapData.hashCode;
            if (!hashCode) {
                return;
            }
            if (!this._displayList[hashCode]) {
                return;
            }
            var tempList = this._displayList[hashCode];
            for (var _i = 0, tempList_1 = tempList; _i < tempList_1.length; _i++) {
                var node = tempList_1[_i];
                if (node instanceof egret.Bitmap) {
                    node.$bitmapData = null;
                }
                node.$renderDirty = true;
                var p = node.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                var maskedObject = node.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
            delete this._displayList[hashCode];
        };
        WebGLBitmapData._displayList = egret.createMap();
        return WebGLBitmapData;
    }());
    egret.WebGLBitmapData = WebGLBitmapData;
    __reflect(WebGLBitmapData.prototype, "egret.WebGLBitmapData");
    if (window['renderMode'] == 'webgl') {
        egret.BitmapData = egret.WebGLBitmapData;
    }
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         * 绘制指令管理器
         * 用来维护drawData数组
         */
        var WebGLDrawCmdManager = (function () {
            function WebGLDrawCmdManager() {
                /**
                 * 用于缓存绘制命令的数组
                 */
                this.drawData = [];
                this.drawDataLen = 0;
            }
            /**
             * 压入绘制矩形指令
             */
            WebGLDrawCmdManager.prototype.pushDrawRect = function () {
                if (this.drawDataLen == 0 || this.drawData[this.drawDataLen - 1].type != 1 /* RECT */) {
                    var data = this.drawData[this.drawDataLen] || {};
                    data.type = 1 /* RECT */;
                    data.count = 0;
                    this.drawData[this.drawDataLen] = data;
                    this.drawDataLen++;
                }
                this.drawData[this.drawDataLen - 1].count += 2;
            };
            /**
             * 压入绘制texture指令
             */
            WebGLDrawCmdManager.prototype.pushDrawTexture = function (texture, count, filter, textureWidth, textureHeight) {
                if (count === void 0) { count = 2; }
                if (filter) {
                    // 目前有滤镜的情况下不会合并绘制
                    var data = this.drawData[this.drawDataLen] || {};
                    data.type = 0 /* TEXTURE */;
                    data.texture = texture;
                    data.filter = filter;
                    data.count = count;
                    data.textureWidth = textureWidth;
                    data.textureHeight = textureHeight;
                    this.drawData[this.drawDataLen] = data;
                    this.drawDataLen++;
                }
                else {
                    if (this.drawDataLen == 0 || this.drawData[this.drawDataLen - 1].type != 0 /* TEXTURE */ || texture != this.drawData[this.drawDataLen - 1].texture || this.drawData[this.drawDataLen - 1].filter) {
                        var data = this.drawData[this.drawDataLen] || {};
                        data.type = 0 /* TEXTURE */;
                        data.texture = texture;
                        data.count = 0;
                        this.drawData[this.drawDataLen] = data;
                        this.drawDataLen++;
                    }
                    this.drawData[this.drawDataLen - 1].count += count;
                }
            };
            WebGLDrawCmdManager.prototype.pushChangeSmoothing = function (texture, smoothing) {
                texture["smoothing"] = smoothing;
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 10 /* SMOOTHING */;
                data.texture = texture;
                data.smoothing = smoothing;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            /**
             * 压入pushMask指令
             */
            WebGLDrawCmdManager.prototype.pushPushMask = function (count) {
                if (count === void 0) { count = 1; }
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 2 /* PUSH_MASK */;
                data.count = count * 2;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            /**
             * 压入popMask指令
             */
            WebGLDrawCmdManager.prototype.pushPopMask = function (count) {
                if (count === void 0) { count = 1; }
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 3 /* POP_MASK */;
                data.count = count * 2;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            /**
             * 压入混色指令
             */
            WebGLDrawCmdManager.prototype.pushSetBlend = function (value) {
                var len = this.drawDataLen;
                // 有无遍历到有效绘图操作
                var drawState = false;
                for (var i = len - 1; i >= 0; i--) {
                    var data = this.drawData[i];
                    if (data) {
                        if (data.type == 0 /* TEXTURE */ || data.type == 1 /* RECT */) {
                            drawState = true;
                        }
                        // 如果与上一次blend操作之间无有效绘图，上一次操作无效
                        if (!drawState && data.type == 4 /* BLEND */) {
                            this.drawData.splice(i, 1);
                            this.drawDataLen--;
                            continue;
                        }
                        // 如果与上一次blend操作重复，本次操作无效
                        if (data.type == 4 /* BLEND */) {
                            if (data.value == value) {
                                return;
                            }
                            else {
                                break;
                            }
                        }
                    }
                }
                var _data = this.drawData[this.drawDataLen] || {};
                _data.type = 4 /* BLEND */;
                _data.value = value;
                this.drawData[this.drawDataLen] = _data;
                this.drawDataLen++;
            };
            /*
             * 压入resize render target命令
             */
            WebGLDrawCmdManager.prototype.pushResize = function (buffer, width, height) {
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 5 /* RESIZE_TARGET */;
                data.buffer = buffer;
                data.width = width;
                data.height = height;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            /*
             * 压入clear color命令
             */
            WebGLDrawCmdManager.prototype.pushClearColor = function () {
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 6 /* CLEAR_COLOR */;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            /**
             * 压入激活buffer命令
             */
            WebGLDrawCmdManager.prototype.pushActivateBuffer = function (buffer) {
                var len = this.drawDataLen;
                // 有无遍历到有效绘图操作
                var drawState = false;
                for (var i = len - 1; i >= 0; i--) {
                    var data = this.drawData[i];
                    if (data) {
                        if (data.type != 4 /* BLEND */ && data.type != 7 /* ACT_BUFFER */) {
                            drawState = true;
                        }
                        // 如果与上一次buffer操作之间无有效绘图，上一次操作无效
                        if (!drawState && data.type == 7 /* ACT_BUFFER */) {
                            this.drawData.splice(i, 1);
                            this.drawDataLen--;
                            continue;
                        }
                    }
                }
                var _data = this.drawData[this.drawDataLen] || {};
                _data.type = 7 /* ACT_BUFFER */;
                _data.buffer = buffer;
                _data.width = buffer.rootRenderTarget.width;
                _data.height = buffer.rootRenderTarget.height;
                this.drawData[this.drawDataLen] = _data;
                this.drawDataLen++;
            };
            /*
             * 压入enabel scissor命令
             */
            WebGLDrawCmdManager.prototype.pushEnableScissor = function (x, y, width, height) {
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 8 /* ENABLE_SCISSOR */;
                data.x = x;
                data.y = y;
                data.width = width;
                data.height = height;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            /*
             * 压入disable scissor命令
             */
            WebGLDrawCmdManager.prototype.pushDisableScissor = function () {
                var data = this.drawData[this.drawDataLen] || {};
                data.type = 9 /* DISABLE_SCISSOR */;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            };
            /**
             * 清空命令数组
             */
            WebGLDrawCmdManager.prototype.clear = function () {
                for (var i = 0; i < this.drawDataLen; i++) {
                    var data = this.drawData[i];
                    data.type = 0;
                    data.count = 0;
                    data.texture = null;
                    data.filter = null;
                    data.uv = null;
                    data.value = "";
                    data.buffer = null;
                    data.width = 0;
                    data.height = 0;
                }
                this.drawDataLen = 0;
            };
            return WebGLDrawCmdManager;
        }());
        web.WebGLDrawCmdManager = WebGLDrawCmdManager;
        __reflect(WebGLDrawCmdManager.prototype, "egret.web.WebGLDrawCmdManager");
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var WebGlGraphics = (function (_super) {
        __extends(WebGlGraphics, _super);
        function WebGlGraphics() {
            return _super.call(this) || this;
        }
        /**
         * 为BK重新实现hittest
         * stageX，stageY为在egret逻辑大小中实际点击的屏幕位置
         */
        WebGlGraphics.prototype.$hitTest = function (stageX, stageY) {
            // debugger
            //获取对象相对于自身的边界矩形
            var target = this.$targetDisplay;
            var rect = egret.Rectangle.create();
            target.$measureContentBounds(rect);
            //获取点击位置相对于对象的本地位置
            var result = egret.Point.create(0, 0);
            this.$targetDisplay.globalToLocal(stageX, stageY, result);
            if (result.x >= rect.x
                && result.x <= rect.x + rect.width
                && result.y >= rect.y
                && result.y <= rect.y + rect.height) {
                return target;
            }
            else {
                return null;
            }
            // let m = target.$getInvertedConcatenatedMatrix();
            // let localX = m.a * stageX + m.c * stageY + m.tx;
            // let localY = m.b * stageX + m.d * stageY + m.ty;
            // let buffer = sys.canvasHitTestBuffer;
            // buffer.resize(3, 3);
            // let node = this.$renderNode;
            // let matrix = Matrix.create();
            // matrix.identity();
            // matrix.translate(1 - localX, 1 - localY);
            // sys.canvasRenderer.drawNodeToBuffer(node, buffer, matrix, true);
            // Matrix.release(matrix);
            // try {
            //     let data = buffer.getPixels(1, 1);
            //     if (data[3] === 0) {
            //         return null;
            //     }
            // }
            // catch (e) {
            //     throw new Error(sys.tr(1039));
            // }
            // return target;
        };
        return WebGlGraphics;
    }(egret.Graphics));
    egret.WebGlGraphics = WebGlGraphics;
    __reflect(WebGlGraphics.prototype, "egret.WebGlGraphics");
    if (window['renderMode'] == 'webgl') {
        egret.Graphics = egret.WebGlGraphics;
    }
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         * WebGL渲染缓存
         */
        var WebGLRenderBuffer = (function (_super) {
            __extends(WebGLRenderBuffer, _super);
            function WebGLRenderBuffer(width, height, root) {
                var _this = _super.call(this) || this;
                _this.globalAlpha = 1;
                /**
                 * stencil state
                 * 模版开关状态
                 */
                _this.stencilState = false;
                _this.$stencilList = [];
                _this.stencilHandleCount = 0;
                /**
                 * scissor state
                 * scissor 开关状态
                 */
                _this.$scissorState = false;
                _this.scissorRect = new egret.Rectangle();
                _this.$hasScissor = false;
                _this.$drawCalls = 0;
                _this.$computeDrawCall = false;
                _this.globalMatrix = new egret.Matrix();
                _this.savedGlobalMatrix = new egret.Matrix();
                _this.$offsetX = 0;
                _this.$offsetY = 0;
                // 获取webglRenderContext
                _this.context = web.WebGLRenderContext.getInstance(width, height);
                // buffer 对应的 render target
                _this.rootRenderTarget = new web.WebGLRenderTarget(_this.context.context, 3, 3);
                if (width && height) {
                    _this.resize(width, height);
                }
                // 如果是第一个加入的buffer，说明是舞台buffer
                _this.root = root;
                // 如果是用于舞台渲染的renderBuffer，则默认添加renderTarget到renderContext中，而且是第一个
                if (_this.root) {
                    _this.context.pushBuffer(_this);
                    // 画布
                    _this.surface = _this.context.surface;
                    _this.$computeDrawCall = true;
                }
                else {
                    // 由于创建renderTarget造成的frameBuffer绑定，这里重置绑定
                    var lastBuffer = _this.context.activatedBuffer;
                    if (lastBuffer) {
                        lastBuffer.rootRenderTarget.activate();
                    }
                    _this.rootRenderTarget.initFrameBuffer();
                    _this.surface = _this.rootRenderTarget;
                }
                return _this;
            }
            WebGLRenderBuffer.prototype.enableStencil = function () {
                if (!this.stencilState) {
                    this.context.enableStencilTest();
                    this.stencilState = true;
                }
            };
            WebGLRenderBuffer.prototype.disableStencil = function () {
                if (this.stencilState) {
                    this.context.disableStencilTest();
                    this.stencilState = false;
                }
            };
            WebGLRenderBuffer.prototype.restoreStencil = function () {
                if (this.stencilState) {
                    this.context.enableStencilTest();
                }
                else {
                    this.context.disableStencilTest();
                }
            };
            WebGLRenderBuffer.prototype.enableScissor = function (x, y, width, height) {
                if (!this.$scissorState) {
                    this.$scissorState = true;
                    this.scissorRect.setTo(x, y, width, height);
                    this.context.enableScissorTest(this.scissorRect);
                }
            };
            WebGLRenderBuffer.prototype.disableScissor = function () {
                if (this.$scissorState) {
                    this.$scissorState = false;
                    this.scissorRect.setEmpty();
                    this.context.disableScissorTest();
                }
            };
            WebGLRenderBuffer.prototype.restoreScissor = function () {
                if (this.$scissorState) {
                    this.context.enableScissorTest(this.scissorRect);
                }
                else {
                    this.context.disableScissorTest();
                }
            };
            Object.defineProperty(WebGLRenderBuffer.prototype, "width", {
                /**
                 * 渲染缓冲的宽度，以像素为单位。
                 * @readOnly
                 */
                get: function () {
                    return this.rootRenderTarget.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebGLRenderBuffer.prototype, "height", {
                /**
                 * 渲染缓冲的高度，以像素为单位。
                 * @readOnly
                 */
                get: function () {
                    return this.rootRenderTarget.height;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 改变渲染缓冲的大小并清空缓冲区
             * @param width 改变后的宽
             * @param height 改变后的高
             * @param useMaxSize 若传入true，则将改变后的尺寸与已有尺寸对比，保留较大的尺寸。
             */
            WebGLRenderBuffer.prototype.resize = function (width, height, useMaxSize) {
                width = width || 1;
                height = height || 1;
                this.context.pushBuffer(this);
                // render target 尺寸重置
                if (width != this.rootRenderTarget.width || height != this.rootRenderTarget.height) {
                    this.context.drawCmdManager.pushResize(this, width, height);
                    // 同步更改宽高
                    this.rootRenderTarget.width = width;
                    this.rootRenderTarget.height = height;
                }
                // 如果是舞台的渲染缓冲，执行resize，否则surface大小不随之改变
                if (this.root) {
                    this.context.resize(width, height, useMaxSize);
                }
                this.context.clear();
                this.context.popBuffer();
            };
            /**
             * 获取指定区域的像素
             */
            WebGLRenderBuffer.prototype.getPixels = function (x, y, width, height) {
                if (width === void 0) { width = 1; }
                if (height === void 0) { height = 1; }
                var pixels = new Uint8Array(4 * width * height);
                var useFrameBuffer = this.rootRenderTarget.useFrameBuffer;
                this.rootRenderTarget.useFrameBuffer = true;
                this.rootRenderTarget.activate();
                this.context.getPixels(x, y, width, height, pixels);
                this.rootRenderTarget.useFrameBuffer = useFrameBuffer;
                this.rootRenderTarget.activate();
                //图像反转
                var result = new Uint8Array(4 * width * height);
                for (var i = 0; i < height; i++) {
                    for (var j = 0; j < width; j++) {
                        var index1 = (width * (height - i - 1) + j) * 4;
                        var index2 = (width * i + j) * 4;
                        var a = pixels[index2 + 3];
                        result[index1] = Math.round(pixels[index2] / a * 255);
                        result[index1 + 1] = Math.round(pixels[index2 + 1] / a * 255);
                        result[index1 + 2] = Math.round(pixels[index2 + 2] / a * 255);
                        result[index1 + 3] = pixels[index2 + 3];
                    }
                }
                return result;
            };
            /**
             * 转换成base64字符串，如果图片（或者包含的图片）跨域，则返回null
             * @param type 转换的类型，如: "image/png","image/jpeg"
             */
            WebGLRenderBuffer.prototype.toDataURL = function (type, encoderOptions) {
                // return this.context.surface.toDataURL(type, encoderOptions);
                return "";
            };
            /**
             * 销毁绘制对象
             */
            WebGLRenderBuffer.prototype.destroy = function () {
                this.context.destroy();
            };
            WebGLRenderBuffer.prototype.onRenderFinish = function () {
                this.$drawCalls = 0;
            };
            /**
             * 交换frameBuffer中的图像到surface中
             * @param width 宽度
             * @param height 高度
             */
            WebGLRenderBuffer.prototype.drawFrameBufferToSurface = function (sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, clear) {
                if (clear === void 0) { clear = false; }
                this.rootRenderTarget.useFrameBuffer = false;
                this.rootRenderTarget.activate();
                this.context.disableStencilTest(); // 切换frameBuffer注意要禁用STENCIL_TEST
                this.context.disableScissorTest();
                this.setTransform(1, 0, 0, 1, 0, 0);
                this.globalAlpha = 1;
                this.context.setGlobalCompositeOperation("source-over");
                clear && this.context.clear();
                this.context.drawImage(this.rootRenderTarget, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, sourceWidth, sourceHeight, false);
                this.context.$drawWebGL();
                this.rootRenderTarget.useFrameBuffer = true;
                this.rootRenderTarget.activate();
                this.restoreStencil();
                this.restoreScissor();
            };
            /**
             * 交换surface的图像到frameBuffer中
             * @param width 宽度
             * @param height 高度
             */
            WebGLRenderBuffer.prototype.drawSurfaceToFrameBuffer = function (sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, clear) {
                if (clear === void 0) { clear = false; }
                this.rootRenderTarget.useFrameBuffer = true;
                this.rootRenderTarget.activate();
                this.context.disableStencilTest(); // 切换frameBuffer注意要禁用STENCIL_TEST
                this.context.disableScissorTest();
                this.setTransform(1, 0, 0, 1, 0, 0);
                this.globalAlpha = 1;
                this.context.setGlobalCompositeOperation("source-over");
                clear && this.context.clear();
                this.context.drawImage(this.context.surface, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, sourceWidth, sourceHeight, false);
                this.context.$drawWebGL();
                this.rootRenderTarget.useFrameBuffer = false;
                this.rootRenderTarget.activate();
                this.restoreStencil();
                this.restoreScissor();
            };
            /**
             * 清空缓冲区数据
             */
            WebGLRenderBuffer.prototype.clear = function () {
                this.context.pushBuffer(this);
                this.context.clear();
                this.context.popBuffer();
            };
            WebGLRenderBuffer.prototype.setTransform = function (a, b, c, d, tx, ty) {
                // this.globalMatrix.setTo(a, b, c, d, tx, ty);
                var matrix = this.globalMatrix;
                matrix.a = a;
                matrix.b = b;
                matrix.c = c;
                matrix.d = d;
                matrix.tx = tx;
                matrix.ty = ty;
            };
            WebGLRenderBuffer.prototype.transform = function (a, b, c, d, tx, ty) {
                var matrix = this.globalMatrix;
                var a1 = matrix.a;
                var b1 = matrix.b;
                var c1 = matrix.c;
                var d1 = matrix.d;
                if (a != 1 || b != 0 || c != 0 || d != 1) {
                    matrix.a = a * a1 + b * c1;
                    matrix.b = a * b1 + b * d1;
                    matrix.c = c * a1 + d * c1;
                    matrix.d = c * b1 + d * d1;
                }
                matrix.tx = tx * a1 + ty * c1 + matrix.tx;
                matrix.ty = tx * b1 + ty * d1 + matrix.ty;
            };
            WebGLRenderBuffer.prototype.useOffset = function () {
                var self = this;
                if (self.$offsetX != 0 || self.$offsetY != 0) {
                    self.globalMatrix.append(1, 0, 0, 1, self.$offsetX, self.$offsetY);
                    self.$offsetX = self.$offsetY = 0;
                }
            };
            WebGLRenderBuffer.prototype.saveTransform = function () {
                var matrix = this.globalMatrix;
                var sMatrix = this.savedGlobalMatrix;
                sMatrix.a = matrix.a;
                sMatrix.b = matrix.b;
                sMatrix.c = matrix.c;
                sMatrix.d = matrix.d;
                sMatrix.tx = matrix.tx;
                sMatrix.ty = matrix.ty;
            };
            WebGLRenderBuffer.prototype.restoreTransform = function () {
                var matrix = this.globalMatrix;
                var sMatrix = this.savedGlobalMatrix;
                matrix.a = sMatrix.a;
                matrix.b = sMatrix.b;
                matrix.c = sMatrix.c;
                matrix.d = sMatrix.d;
                matrix.tx = sMatrix.tx;
                matrix.ty = sMatrix.ty;
            };
            /**
             * 创建一个buffer实例
             */
            WebGLRenderBuffer.create = function (width, height) {
                var buffer = renderBufferPool.pop();
                // width = Math.min(width, 1024);
                // height = Math.min(height, 1024);
                if (buffer) {
                    buffer.resize(width, height);
                    var matrix = buffer.globalMatrix;
                    matrix.a = 1;
                    matrix.b = 0;
                    matrix.c = 0;
                    matrix.d = 1;
                    matrix.tx = 0;
                    matrix.ty = 0;
                    buffer.globalAlpha = 1;
                    buffer.$offsetX = 0;
                    buffer.$offsetY = 0;
                }
                else {
                    buffer = new WebGLRenderBuffer(width, height);
                    buffer.$computeDrawCall = false;
                }
                return buffer;
            };
            /**
             * 回收一个buffer实例
             */
            WebGLRenderBuffer.release = function (buffer) {
                renderBufferPool.push(buffer);
            };
            WebGLRenderBuffer.autoClear = true;
            return WebGLRenderBuffer;
        }(egret.HashObject));
        web.WebGLRenderBuffer = WebGLRenderBuffer;
        __reflect(WebGLRenderBuffer.prototype, "egret.web.WebGLRenderBuffer", ["egret.sys.RenderBuffer"]);
        var renderBufferPool = []; //渲染缓冲区对象池
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
/**
 * 去除了canvas
 * 更改了getContext过程
 * 修改了surface的事件，改为只保存宽高的object{width:number,height:height}
 */
var egret;
(function (egret) {
    var web;
    (function (web) {
        // /**
        //  * 创建一个canvas。
        //  */
        // function createCanvas(width?: number, height?: number): HTMLCanvasElement {
        //     let canvas: HTMLCanvasElement = document.createElement("canvas");
        //     if (!isNaN(width) && !isNaN(height)) {
        //         canvas.width = width;
        //         canvas.height = height;
        //     }
        //     return canvas;
        // }
        /**
         * @private
         * WebGL上下文对象，提供简单的绘图接口
         * 抽象出此类，以实现共用一个context
         */
        var WebGLRenderContext = (function () {
            function WebGLRenderContext(width, height) {
                this.glID = null;
                this.projectionX = NaN;
                this.projectionY = NaN;
                this.contextLost = false;
                this.$scissorState = false;
                this.vertSize = 5;
                // this.surface; //= createCanvas(width, height);
                this.surface = { width: width, height: height };
                this.initWebGL();
                this.$bufferStack = [];
                var gl = this.context;
                this.vertexBuffer = gl.createBuffer();
                this.indexBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                this.drawCmdManager = new web.WebGLDrawCmdManager();
                this.vao = new web.WebGLVertexArrayObject();
                this.setGlobalCompositeOperation("source-over");
            }
            WebGLRenderContext.getInstance = function (width, height) {
                if (this.instance) {
                    return this.instance;
                }
                this.instance = new WebGLRenderContext(width, height);
                return this.instance;
            };
            /**
             * 推入一个RenderBuffer并绑定
             */
            WebGLRenderContext.prototype.pushBuffer = function (buffer) {
                this.$bufferStack.push(buffer);
                if (buffer != this.currentBuffer) {
                    if (this.currentBuffer) {
                        // this.$drawWebGL();
                    }
                    this.drawCmdManager.pushActivateBuffer(buffer);
                }
                this.currentBuffer = buffer;
            };
            /**
             * 推出一个RenderBuffer并绑定上一个RenderBuffer
             */
            WebGLRenderContext.prototype.popBuffer = function () {
                // 如果只剩下一个buffer，则不执行pop操作
                // 保证舞台buffer永远在最开始
                if (this.$bufferStack.length <= 1) {
                    return;
                }
                var buffer = this.$bufferStack.pop();
                var lastBuffer = this.$bufferStack[this.$bufferStack.length - 1];
                // 重新绑定
                if (buffer != lastBuffer) {
                    // this.$drawWebGL();
                    this.drawCmdManager.pushActivateBuffer(lastBuffer);
                }
                this.currentBuffer = lastBuffer;
            };
            /**
             * 启用RenderBuffer
             */
            WebGLRenderContext.prototype.activateBuffer = function (buffer) {
                buffer.rootRenderTarget.activate();
                if (!this.bindIndices) {
                    this.uploadIndicesArray(this.vao.getIndices());
                }
                buffer.restoreStencil();
                buffer.restoreScissor();
                this.onResize(buffer.width, buffer.height);
            };
            /**
             * 上传顶点数据
             */
            WebGLRenderContext.prototype.uploadVerticesArray = function (array) {
                var gl = this.context;
                gl.bufferData(gl.ARRAY_BUFFER, array, gl.STREAM_DRAW);
                // gl.bufferData(gl.ARRAY_BUFFER, array, gl.STREAM_DRAW);
                // gl.bufferSubData(gl.ARRAY_BUFFER, 0, array);
            };
            /**
             * 上传索引数据
             */
            WebGLRenderContext.prototype.uploadIndicesArray = function (array) {
                var gl = this.context;
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, array, gl.STATIC_DRAW);
                this.bindIndices = true;
            };
            /**
             * 销毁绘制对象
             */
            WebGLRenderContext.prototype.destroy = function () {
                this.surface.width = this.surface.height = 0;
            };
            WebGLRenderContext.prototype.onResize = function (width, height) {
                width = width || this.surface.width;
                height = height || this.surface.height;
                this.projectionX = width / 2;
                this.projectionY = -height / 2;
                if (this.context) {
                    var left = web.BKWebPlayer._viewRect.x;
                    var top_1 = web.BKWebPlayer._viewRect.y;
                    this.context.viewport(left, top_1, width, height);
                }
            };
            /**
             * 改变渲染缓冲的大小并清空缓冲区
             * @param width 改变后的宽
             * @param height 改变后的高
             * @param useMaxSize 若传入true，则将改变后的尺寸与已有尺寸对比，保留较大的尺寸。
             */
            WebGLRenderContext.prototype.resize = function (width, height, useMaxSize) {
                var surface = this.surface;
                if (useMaxSize) {
                    if (surface.width < width) {
                        surface.width = width;
                    }
                    if (surface.height < height) {
                        surface.height = height;
                    }
                }
                else {
                    if (surface.width != width) {
                        surface.width = width;
                    }
                    if (surface.height != height) {
                        surface.height = height;
                    }
                }
                this.onResize();
            };
            WebGLRenderContext.prototype.initWebGL = function () {
                this.onResize();
                // this.surface.addEventListener("webglcontextlost", this.handleContextLost.bind(this), false);
                // this.surface.addEventListener("webglcontextrestored", this.handleContextRestored.bind(this), false);
                this.getWebGLContext();
                var gl = this.context;
                this.$maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
            };
            WebGLRenderContext.prototype.handleContextLost = function () {
                this.contextLost = true;
            };
            WebGLRenderContext.prototype.handleContextRestored = function () {
                this.initWebGL();
                this.contextLost = false;
            };
            WebGLRenderContext.prototype.getWebGLContext = function () {
                var options = {
                    antialias: WebGLRenderContext.antialias,
                    stencil: true //设置可以使用模板（用于不规则遮罩）
                };
                var gl;
                gl = bkWebGLGetInstance();
                if (!gl) {
                    egret.$error(1021);
                }
                this.setContext(gl);
            };
            WebGLRenderContext.prototype.setContext = function (gl) {
                this.context = gl;
                gl.id = WebGLRenderContext.glContextId++;
                this.glID = gl.id;
                gl.disable(gl.DEPTH_TEST);
                gl.disable(gl.CULL_FACE);
                gl.enable(gl.BLEND);
                gl.colorMask(true, true, true, true);
                // 目前只使用0号材质单元，默认开启
                gl.activeTexture(gl.TEXTURE0);
            };
            /**
             * 开启模版检测
             */
            WebGLRenderContext.prototype.enableStencilTest = function () {
                var gl = this.context;
                gl.enable(gl.STENCIL_TEST);
            };
            /**
             * 关闭模版检测
             */
            WebGLRenderContext.prototype.disableStencilTest = function () {
                var gl = this.context;
                gl.disable(gl.STENCIL_TEST);
            };
            /**
             * 开启scissor检测
             */
            WebGLRenderContext.prototype.enableScissorTest = function (rect) {
                var gl = this.context;
                gl.enable(gl.SCISSOR_TEST);
                gl.scissor(rect.x, rect.y, rect.width, rect.height);
            };
            /**
             * 关闭scissor检测
             */
            WebGLRenderContext.prototype.disableScissorTest = function () {
                var gl = this.context;
                gl.disable(gl.SCISSOR_TEST);
            };
            /**
             * 获取像素信息
             */
            WebGLRenderContext.prototype.getPixels = function (x, y, width, height, pixels) {
                var gl = this.context;
                gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            };
            /**
             * 创建一个WebGLTexture
             */
            WebGLRenderContext.prototype.createTexture = function (bitmapData) {
                var gl = this.context;
                var texture = gl.createTexture();
                if (!texture) {
                    //先创建texture失败,然后lost事件才发出来..
                    this.contextLost = true;
                    return;
                }
                texture.glContext = gl;
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
                var image = bitmapData.source;
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                return texture;
            };
            /**
             * 创建一个来自canvas的text_Texture
             * 传入的是BK.Canvas
             */
            WebGLRenderContext.prototype.createTextureByCanvas = function (canvas) {
                // debugger
                var gl = this.context;
                var texture = gl.createTexture();
                texture.glContext = gl;
                // let textureID = canvas.getTexture().renderTarget
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                return texture;
            };
            WebGLRenderContext.prototype.createTextureFromCompressedData = function (data, width, height, levels, internalFormat) {
                return null;
            };
            /**
             * 更新材质的bitmapData
             * 传入
             */
            WebGLRenderContext.prototype.updateTexture = function (texture, canvas) {
                var gl = this.context;
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
            };
            /**
             * 获取一个WebGLTexture
             * 如果有缓存的texture返回缓存的texture，如果没有则创建并缓存texture
             */
            WebGLRenderContext.prototype.getWebGLTexture = function (bitmapData) {
                if (!bitmapData.webGLTexture) {
                    if (bitmapData.format == "image") {
                        bitmapData.webGLTexture = this.createTexture(bitmapData);
                    }
                    else if (bitmapData.format == "pvr") {
                        bitmapData.webGLTexture = this.createTextureFromCompressedData(bitmapData.source.pvrtcData, bitmapData.width, bitmapData.height, bitmapData.source.mipmapsCount, bitmapData.source.format);
                    }
                    if (bitmapData.$deleteSource && bitmapData.webGLTexture) {
                        bitmapData.source = null;
                    }
                    //todo 默认值
                    bitmapData.webGLTexture["smoothing"] = true;
                }
                return bitmapData.webGLTexture;
            };
            /**
             * 清除矩形区域
             */
            WebGLRenderContext.prototype.clearRect = function (x, y, width, height) {
                if (x != 0 || y != 0 || width != this.surface.width || height != this.surface.height) {
                    var buffer = this.currentBuffer;
                    if (buffer.$hasScissor) {
                        this.setGlobalCompositeOperation("destination-out");
                        this.drawRect(x, y, width, height);
                        this.setGlobalCompositeOperation("source-over");
                    }
                    else {
                        var m = buffer.globalMatrix;
                        if (m.b == 0 && m.c == 0) {
                            x = x * m.a + m.tx;
                            y = y * m.d + m.ty;
                            width = width * m.a;
                            height = height * m.d;
                            this.enableScissor(x, -y - height + buffer.height, width, height);
                            this.clear();
                            this.disableScissor();
                        }
                        else {
                            this.setGlobalCompositeOperation("destination-out");
                            this.drawRect(x, y, width, height);
                            this.setGlobalCompositeOperation("source-over");
                        }
                    }
                }
                else {
                    this.clear();
                }
            };
            /**
             * 设置混色
             */
            WebGLRenderContext.prototype.setGlobalCompositeOperation = function (value) {
                this.drawCmdManager.pushSetBlend(value);
            };
            /**
             * 绘制图片，image参数可以是BitmapData或者renderTarget
             */
            WebGLRenderContext.prototype.drawImage = function (image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, imageSourceWidth, imageSourceHeight, rotated, smoothing) {
                var buffer = this.currentBuffer;
                if (this.contextLost || !image || !buffer) {
                    return;
                }
                var texture;
                var offsetX;
                var offsetY;
                if (image["texture"] || (image.source && image.source["texture"])) {
                    // 如果是render target
                    texture = image["texture"] || image.source["texture"];
                    buffer.saveTransform();
                    offsetX = buffer.$offsetX;
                    offsetY = buffer.$offsetY;
                    buffer.useOffset();
                    buffer.transform(1, 0, 0, -1, 0, destHeight + destY * 2); // 翻转
                }
                else if (!image.source && !image.webGLTexture) {
                    return;
                }
                else {
                    texture = this.getWebGLTexture(image);
                }
                if (!texture) {
                    return;
                }
                this.drawTexture(texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, imageSourceWidth, imageSourceHeight, undefined, undefined, undefined, undefined, rotated, smoothing);
                if (image.source && image.source["texture"]) {
                    buffer.$offsetX = offsetX;
                    buffer.$offsetY = offsetY;
                    buffer.restoreTransform();
                }
            };
            /**
             * 绘制Mesh
             */
            WebGLRenderContext.prototype.drawMesh = function (image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, imageSourceWidth, imageSourceHeight, meshUVs, meshVertices, meshIndices, bounds, rotated, smoothing) {
                var buffer = this.currentBuffer;
                if (this.contextLost || !image || !buffer) {
                    return;
                }
                var texture;
                var offsetX;
                var offsetY;
                if (image["texture"] || (image.source && image.source["texture"])) {
                    // 如果是render target
                    texture = image["texture"] || image.source["texture"];
                    buffer.saveTransform();
                    offsetX = buffer.$offsetX;
                    offsetY = buffer.$offsetY;
                    buffer.useOffset();
                    buffer.transform(1, 0, 0, -1, 0, destHeight + destY * 2); // 翻转
                }
                else if (!image.source && !image.webGLTexture) {
                    return;
                }
                else {
                    texture = this.getWebGLTexture(image);
                }
                if (!texture) {
                    return;
                }
                this.drawTexture(texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, imageSourceWidth, imageSourceHeight, meshUVs, meshVertices, meshIndices, bounds, rotated, smoothing);
                if (image["texture"] || (image.source && image.source["texture"])) {
                    buffer.$offsetX = offsetX;
                    buffer.$offsetY = offsetY;
                    buffer.restoreTransform();
                }
            };
            /**
             * 绘制材质
             */
            WebGLRenderContext.prototype.drawTexture = function (texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureWidth, textureHeight, meshUVs, meshVertices, meshIndices, bounds, rotated, smoothing) {
                var buffer = this.currentBuffer;
                if (this.contextLost || !texture || !buffer) {
                    return;
                }
                if (meshVertices && meshIndices) {
                    if (this.vao.reachMaxSize(meshVertices.length / 2, meshIndices.length)) {
                        this.$drawWebGL();
                    }
                }
                else {
                    if (this.vao.reachMaxSize()) {
                        this.$drawWebGL();
                    }
                }
                if (smoothing != undefined && texture["smoothing"] != smoothing) {
                    this.drawCmdManager.pushChangeSmoothing(texture, smoothing);
                }
                if (meshUVs) {
                    this.vao.changeToMeshIndices();
                }
                var count = meshIndices ? meshIndices.length / 3 : 2;
                // 应用$filter，因为只可能是colorMatrixFilter，最后两个参数可不传
                this.drawCmdManager.pushDrawTexture(texture, count, this.$filter, textureWidth, textureHeight);
                this.vao.cacheArrays(buffer, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureWidth, textureHeight, meshUVs, meshVertices, meshIndices, rotated);
            };
            /**
             * 绘制矩形（仅用于遮罩擦除等）
             */
            WebGLRenderContext.prototype.drawRect = function (x, y, width, height) {
                var buffer = this.currentBuffer;
                if (this.contextLost || !buffer) {
                    return;
                }
                if (this.vao.reachMaxSize()) {
                    this.$drawWebGL();
                }
                this.drawCmdManager.pushDrawRect();
                this.vao.cacheArrays(buffer, 0, 0, width, height, x, y, width, height, width, height);
            };
            /**
             * 绘制遮罩
             */
            WebGLRenderContext.prototype.pushMask = function (x, y, width, height) {
                var buffer = this.currentBuffer;
                if (this.contextLost || !buffer) {
                    return;
                }
                buffer.$stencilList.push({ x: x, y: y, width: width, height: height });
                if (this.vao.reachMaxSize()) {
                    this.$drawWebGL();
                }
                this.drawCmdManager.pushPushMask();
                this.vao.cacheArrays(buffer, 0, 0, width, height, x, y, width, height, width, height);
            };
            /**
             * 恢复遮罩
             */
            WebGLRenderContext.prototype.popMask = function () {
                var buffer = this.currentBuffer;
                if (this.contextLost || !buffer) {
                    return;
                }
                var mask = buffer.$stencilList.pop();
                if (this.vao.reachMaxSize()) {
                    this.$drawWebGL();
                }
                this.drawCmdManager.pushPopMask();
                this.vao.cacheArrays(buffer, 0, 0, mask.width, mask.height, mask.x, mask.y, mask.width, mask.height, mask.width, mask.height);
            };
            /**
             * 清除颜色缓存
             */
            WebGLRenderContext.prototype.clear = function () {
                this.drawCmdManager.pushClearColor();
            };
            /**
             * 开启scissor test
             */
            WebGLRenderContext.prototype.enableScissor = function (x, y, width, height) {
                var buffer = this.currentBuffer;
                this.drawCmdManager.pushEnableScissor(x, y, width, height);
                buffer.$hasScissor = true;
            };
            /**
             * 关闭scissor test
             */
            WebGLRenderContext.prototype.disableScissor = function () {
                var buffer = this.currentBuffer;
                this.drawCmdManager.pushDisableScissor();
                buffer.$hasScissor = false;
            };
            WebGLRenderContext.prototype.$drawWebGL = function () {
                if (this.drawCmdManager.drawDataLen == 0 || this.contextLost) {
                    return;
                }
                this.uploadVerticesArray(this.vao.getVertices());
                // 有mesh，则使用indicesForMesh
                if (this.vao.isMesh()) {
                    this.uploadIndicesArray(this.vao.getMeshIndices());
                }
                var length = this.drawCmdManager.drawDataLen;
                var offset = 0;
                for (var i = 0; i < length; i++) {
                    var data = this.drawCmdManager.drawData[i];
                    offset = this.drawData(data, offset);
                    // 计算draw call
                    if (data.type == 7 /* ACT_BUFFER */) {
                        this.activatedBuffer = data.buffer;
                    }
                    if (data.type == 0 /* TEXTURE */ || data.type == 1 /* RECT */ || data.type == 2 /* PUSH_MASK */ || data.type == 3 /* POP_MASK */) {
                        if (this.activatedBuffer && this.activatedBuffer.$computeDrawCall) {
                            this.activatedBuffer.$drawCalls++;
                        }
                    }
                }
                // 切换回默认indices
                if (this.vao.isMesh()) {
                    this.uploadIndicesArray(this.vao.getIndices());
                }
                // 清空数据
                this.drawCmdManager.clear();
                this.vao.clear();
                var gl = this.context;
                /**
                 * bk 提交gl
                 */
                gl.glCommit();
            };
            /**
             * 执行绘制命令
             */
            WebGLRenderContext.prototype.drawData = function (data, offset) {
                if (!data) {
                    return;
                }
                var gl = this.context;
                var program;
                var filter = data.filter;
                switch (data.type) {
                    case 0 /* TEXTURE */:
                        if (filter) {
                            if (filter.type === "custom") {
                                program = web.EgretWebGLProgram.getProgram(gl, filter.$vertexSrc, filter.$fragmentSrc, filter.$shaderKey);
                            }
                            else if (filter.type === "colorTransform") {
                                program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.colorTransform_frag, "colorTransform");
                            }
                            else if (filter.type === "blurX") {
                                program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.blur_frag, "blur");
                            }
                            else if (filter.type === "blurY") {
                                program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.blur_frag, "blur");
                            }
                            else if (filter.type === "glow") {
                                program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.glow_frag, "glow");
                            }
                        }
                        else {
                            program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.texture_frag, "texture");
                        }
                        this.activeProgram(gl, program);
                        this.syncUniforms(program, filter, data.textureWidth, data.textureHeight);
                        offset += this.drawTextureElements(data, offset);
                        break;
                    case 1 /* RECT */:
                        program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.primitive_frag, "primitive");
                        this.activeProgram(gl, program);
                        this.syncUniforms(program, filter, data.textureWidth, data.textureHeight);
                        offset += this.drawRectElements(data, offset);
                        break;
                    case 2 /* PUSH_MASK */:
                        program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.primitive_frag, "primitive");
                        this.activeProgram(gl, program);
                        this.syncUniforms(program, filter, data.textureWidth, data.textureHeight);
                        offset += this.drawPushMaskElements(data, offset);
                        break;
                    case 3 /* POP_MASK */:
                        program = web.EgretWebGLProgram.getProgram(gl, web.EgretShaderLib.default_vert, web.EgretShaderLib.primitive_frag, "primitive");
                        this.activeProgram(gl, program);
                        this.syncUniforms(program, filter, data.textureWidth, data.textureHeight);
                        offset += this.drawPopMaskElements(data, offset);
                        break;
                    case 4 /* BLEND */:
                        this.setBlendMode(data.value);
                        break;
                    case 5 /* RESIZE_TARGET */:
                        data.buffer.rootRenderTarget.resize(data.width, data.height);
                        this.onResize(data.width, data.height);
                        break;
                    case 6 /* CLEAR_COLOR */:
                        if (this.activatedBuffer) {
                            var target = this.activatedBuffer.rootRenderTarget;
                            if (target.width != 0 || target.height != 0) {
                                target.clear(true);
                            }
                        }
                        break;
                    case 7 /* ACT_BUFFER */:
                        this.activateBuffer(data.buffer);
                        break;
                    case 8 /* ENABLE_SCISSOR */:
                        var buffer = this.activatedBuffer;
                        if (buffer) {
                            if (buffer.rootRenderTarget) {
                                buffer.rootRenderTarget.enabledStencil();
                            }
                            buffer.enableScissor(data.x, data.y, data.width, data.height);
                        }
                        break;
                    case 9 /* DISABLE_SCISSOR */:
                        buffer = this.activatedBuffer;
                        if (buffer) {
                            buffer.disableScissor();
                        }
                        break;
                    case 10 /* SMOOTHING */:
                        if (data.texture.texture) {
                            gl.bindTexture(gl.TEXTURE_2D, data.texture.texture);
                            //  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas););
                        }
                        else {
                            gl.bindTexture(gl.TEXTURE_2D, data.texture);
                        }
                        if (data.smoothing) {
                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                        }
                        else {
                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                        }
                        break;
                    default:
                        break;
                }
                return offset;
            };
            WebGLRenderContext.prototype.activeProgram = function (gl, program) {
                if (program != this.currentProgram) {
                    gl.useProgram(program.id);
                    // 目前所有attribute buffer的绑定方法都是一致的
                    var attribute = program.attributes;
                    for (var key in attribute) {
                        if (key === "aVertexPosition") {
                            gl.vertexAttribPointer(attribute["aVertexPosition"].location, 2, gl.FLOAT, false, 5 * 4, 0);
                            gl.enableVertexAttribArray(attribute["aVertexPosition"].location);
                        }
                        else if (key === "aTextureCoord") {
                            gl.vertexAttribPointer(attribute["aTextureCoord"].location, 2, gl.FLOAT, false, 5 * 4, 2 * 4);
                            gl.enableVertexAttribArray(attribute["aTextureCoord"].location);
                        }
                        else if (key === "aColor") {
                            gl.vertexAttribPointer(attribute["aColor"].location, 1, gl.FLOAT, false, 5 * 4, 4 * 4);
                            gl.enableVertexAttribArray(attribute["aColor"].location);
                        }
                    }
                    this.currentProgram = program;
                }
            };
            WebGLRenderContext.prototype.syncUniforms = function (program, filter, textureWidth, textureHeight) {
                var uniforms = program.uniforms;
                var isCustomFilter = filter && filter.type === "custom";
                for (var key in uniforms) {
                    if (key === "projectionVector") {
                        uniforms[key].setValue({ x: this.projectionX, y: this.projectionY });
                    }
                    else if (key === "uTextureSize") {
                        uniforms[key].setValue({ x: textureWidth, y: textureHeight });
                    }
                    else if (key === "uSampler") {
                    }
                    else {
                        var value = filter.$uniforms[key];
                        if (value !== undefined) {
                            uniforms[key].setValue(value);
                        }
                        else {
                            // egret.warn("filter custom: uniform " + key + " not defined!");
                        }
                    }
                }
            };
            /**
             * 画texture
             **/
            WebGLRenderContext.prototype.drawTextureElements = function (data, offset) {
                var gl = this.context;
                // if (data.texture.texture) {
                //     gl.bindTexture(gl.TEXTURE_2D, data.texture.texture);
                // } else {
                gl.bindTexture(gl.TEXTURE_2D, data.texture);
                // }
                var size = data.count * 3;
                gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
                return size;
            };
            /**
             * @private
             * 画rect
             **/
            WebGLRenderContext.prototype.drawRectElements = function (data, offset) {
                var gl = this.context;
                // gl.bindTexture(gl.TEXTURE_2D, null);
                var size = data.count * 3;
                gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
                return size;
            };
            /**
             * 画push mask
             **/
            WebGLRenderContext.prototype.drawPushMaskElements = function (data, offset) {
                var gl = this.context;
                var size = data.count * 3;
                var buffer = this.activatedBuffer;
                if (buffer) {
                    if (buffer.rootRenderTarget) {
                        buffer.rootRenderTarget.enabledStencil();
                    }
                    if (buffer.stencilHandleCount == 0) {
                        buffer.enableStencil();
                        gl.clear(gl.STENCIL_BUFFER_BIT); // clear
                    }
                    var level = buffer.stencilHandleCount;
                    buffer.stencilHandleCount++;
                    gl.colorMask(false, false, false, false);
                    gl.stencilFunc(gl.EQUAL, level, 0xFF);
                    gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
                    // gl.bindTexture(gl.TEXTURE_2D, null);
                    gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
                    gl.stencilFunc(gl.EQUAL, level + 1, 0xFF);
                    gl.colorMask(true, true, true, true);
                    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
                }
                return size;
            };
            /**
             * 画pop mask
             **/
            WebGLRenderContext.prototype.drawPopMaskElements = function (data, offset) {
                var gl = this.context;
                var size = data.count * 3;
                var buffer = this.activatedBuffer;
                if (buffer) {
                    buffer.stencilHandleCount--;
                    if (buffer.stencilHandleCount == 0) {
                        buffer.disableStencil(); // skip this draw
                    }
                    else {
                        var level = buffer.stencilHandleCount;
                        gl.colorMask(false, false, false, false);
                        gl.stencilFunc(gl.EQUAL, level + 1, 0xFF);
                        gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);
                        // gl.bindTexture(gl.TEXTURE_2D, null);
                        gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
                        gl.stencilFunc(gl.EQUAL, level, 0xFF);
                        gl.colorMask(true, true, true, true);
                        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
                    }
                }
                return size;
            };
            /**
             * 设置混色
             */
            WebGLRenderContext.prototype.setBlendMode = function (value) {
                var gl = this.context;
                var blendModeWebGL = WebGLRenderContext.blendModesForGL[value];
                if (blendModeWebGL) {
                    gl.blendFunc(blendModeWebGL[0], blendModeWebGL[1]);
                }
            };
            /**
             * 应用滤镜绘制给定的render target
             * 此方法不会导致input被释放，所以如果需要释放input，需要调用此方法后手动调用release
             */
            WebGLRenderContext.prototype.drawTargetWidthFilters = function (filters, input) {
                var originInput = input, filtersLen = filters.length, output;
                // 应用前面的滤镜
                if (filtersLen > 1) {
                    for (var i = 0; i < filtersLen - 1; i++) {
                        var filter_1 = filters[i];
                        var width = input.rootRenderTarget.width;
                        var height = input.rootRenderTarget.height;
                        output = web.WebGLRenderBuffer.create(width, height);
                        output.setTransform(1, 0, 0, 1, 0, 0);
                        output.globalAlpha = 1;
                        this.drawToRenderTarget(filter_1, input, output);
                        if (input != originInput) {
                            web.WebGLRenderBuffer.release(input);
                        }
                        input = output;
                    }
                }
                // 应用最后一个滤镜并绘制到当前场景中
                var filter = filters[filtersLen - 1];
                this.drawToRenderTarget(filter, input, this.currentBuffer);
                // 释放掉用于交换的buffer
                if (input != originInput) {
                    web.WebGLRenderBuffer.release(input);
                }
            };
            /**
             * 向一个renderTarget中绘制
             * */
            WebGLRenderContext.prototype.drawToRenderTarget = function (filter, input, output) {
                if (this.contextLost) {
                    return;
                }
                if (this.vao.reachMaxSize()) {
                    this.$drawWebGL();
                }
                this.pushBuffer(output);
                var originInput = input, temp, width = input.rootRenderTarget.width, height = input.rootRenderTarget.height;
                // 模糊滤镜分别处理blurX与blurY
                if (filter.type == "blur") {
                    var blurXFilter = filter.blurXFilter;
                    var blurYFilter = filter.blurYFilter;
                    if (blurXFilter.blurX != 0 && blurYFilter.blurY != 0) {
                        temp = web.WebGLRenderBuffer.create(width, height);
                        temp.setTransform(1, 0, 0, 1, 0, 0);
                        temp.globalAlpha = 1;
                        this.drawToRenderTarget(filter.blurXFilter, input, temp);
                        if (input != originInput) {
                            web.WebGLRenderBuffer.release(input);
                        }
                        input = temp;
                        filter = blurYFilter;
                    }
                    else {
                        filter = blurXFilter.blurX === 0 ? blurYFilter : blurXFilter;
                    }
                }
                // 绘制input结果到舞台
                output.saveTransform();
                output.transform(1, 0, 0, -1, 0, height);
                this.vao.cacheArrays(output, 0, 0, width, height, 0, 0, width, height, width, height);
                output.restoreTransform();
                this.drawCmdManager.pushDrawTexture(input.rootRenderTarget.texture, 2, filter, width, height);
                // 释放掉input
                if (input != originInput) {
                    web.WebGLRenderBuffer.release(input);
                }
                this.popBuffer();
            };
            WebGLRenderContext.initBlendMode = function () {
                WebGLRenderContext.blendModesForGL = {};
                WebGLRenderContext.blendModesForGL["source-over"] = [1, 771];
                WebGLRenderContext.blendModesForGL["lighter"] = [1, 1];
                WebGLRenderContext.blendModesForGL["lighter-in"] = [770, 771];
                WebGLRenderContext.blendModesForGL["destination-out"] = [0, 771];
                WebGLRenderContext.blendModesForGL["destination-in"] = [0, 770];
            };
            WebGLRenderContext.glContextId = 0;
            WebGLRenderContext.blendModesForGL = null;
            return WebGLRenderContext;
        }());
        web.WebGLRenderContext = WebGLRenderContext;
        __reflect(WebGLRenderContext.prototype, "egret.web.WebGLRenderContext");
        WebGLRenderContext.initBlendMode();
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        var blendModes = ["source-over", "lighter", "destination-out"];
        var defaultCompositeOp = "source-over";
        var BLACK_COLOR = "#000000";
        var CAPS_STYLES = { none: 'butt', square: 'square', round: 'round' };
        var renderBufferPool = []; //渲染缓冲区对象池
        /**
         * @private
         * WebGL渲染器
         */
        var WebGLRenderer = (function () {
            function WebGLRenderer() {
                this.nestLevel = 0; //渲染的嵌套层次，0表示在调用堆栈的最外层。
            }
            /**
             * 渲染一个显示对象
             * @param displayObject 要渲染的显示对象
             * @param buffer 渲染缓冲
             * @param matrix 要对显示对象整体叠加的变换矩阵
             * @param dirtyList 脏矩形列表
             * @param forRenderTexture 绘制目标是RenderTexture的标志
             * @returns drawCall触发绘制的次数
             */
            WebGLRenderer.prototype.render = function (displayObject, buffer, matrix, forRenderTexture) {
                this.nestLevel++;
                var webglBuffer = buffer;
                var webglBufferContext = webglBuffer.context;
                var root = forRenderTexture ? displayObject : null;
                webglBufferContext.pushBuffer(webglBuffer);
                //绘制显示对象
                webglBuffer.transform(matrix.a, matrix.b, matrix.c, matrix.d, 0, 0);
                this.drawDisplayObject(displayObject, webglBuffer, matrix.tx, matrix.ty, true);
                webglBufferContext.$drawWebGL();
                var drawCall = webglBuffer.$drawCalls;
                webglBuffer.onRenderFinish();
                webglBufferContext.popBuffer();
                var invert = egret.Matrix.create();
                matrix.$invertInto(invert);
                webglBuffer.transform(invert.a, invert.b, invert.c, invert.d, 0, 0);
                egret.Matrix.release(invert);
                this.nestLevel--;
                if (this.nestLevel === 0) {
                    //最大缓存6个渲染缓冲
                    if (renderBufferPool.length > 6) {
                        renderBufferPool.length = 6;
                    }
                    var length_3 = renderBufferPool.length;
                    for (var i = 0; i < length_3; i++) {
                        renderBufferPool[i].resize(0, 0);
                    }
                }
                return drawCall;
            };
            /**
             * @private
             * 绘制一个显示对象
             */
            WebGLRenderer.prototype.drawDisplayObject = function (displayObject, buffer, offsetX, offsetY, isStage) {
                var drawCalls = 0;
                var node;
                var displayList = displayObject.$displayList;
                if (displayList && !isStage) {
                    if (displayObject.$cacheDirty || displayObject.$renderDirty ||
                        displayList.$canvasScaleX != egret.sys.DisplayList.$canvasScaleX ||
                        displayList.$canvasScaleY != egret.sys.DisplayList.$canvasScaleY) {
                        drawCalls += displayList.drawToSurface();
                    }
                    node = displayList.$renderNode;
                }
                else {
                    if (displayObject.$renderDirty) {
                        node = displayObject.$getRenderNode();
                    }
                    else {
                        node = displayObject.$renderNode;
                    }
                }
                displayObject.$cacheDirty = false;
                if (node) {
                    drawCalls++;
                    buffer.$offsetX = offsetX;
                    buffer.$offsetY = offsetY;
                    switch (node.type) {
                        case 1 /* BitmapNode */:
                            this.renderBitmap(node, buffer);
                            break;
                        case 2 /* TextNode */:
                            this.renderText(node, buffer);
                            break;
                        case 3 /* GraphicsNode */:
                            this.renderGraphics(node, buffer);
                            break;
                        case 4 /* GroupNode */:
                            this.renderGroup(node, buffer);
                            break;
                        case 5 /* MeshNode */:
                            this.renderMesh(node, buffer);
                            break;
                        case 6 /* NormalBitmapNode */:
                            this.renderNormalBitmap(node, buffer);
                            break;
                    }
                    buffer.$offsetX = 0;
                    buffer.$offsetY = 0;
                }
                if (displayList && !isStage) {
                    return drawCalls;
                }
                var children = displayObject.$children;
                if (children) {
                    var length_4 = children.length;
                    for (var i = 0; i < length_4; i++) {
                        var child = children[i];
                        var offsetX2 = void 0;
                        var offsetY2 = void 0;
                        var tempAlpha = void 0;
                        if (child.$alpha != 1) {
                            tempAlpha = buffer.globalAlpha;
                            buffer.globalAlpha *= child.$alpha;
                        }
                        var savedMatrix = void 0;
                        if (child.$useTranslate) {
                            var m = child.$getMatrix();
                            offsetX2 = offsetX + child.$x;
                            offsetY2 = offsetY + child.$y;
                            var m2 = buffer.globalMatrix;
                            savedMatrix = egret.Matrix.create();
                            savedMatrix.a = m2.a;
                            savedMatrix.b = m2.b;
                            savedMatrix.c = m2.c;
                            savedMatrix.d = m2.d;
                            savedMatrix.tx = m2.tx;
                            savedMatrix.ty = m2.ty;
                            buffer.transform(m.a, m.b, m.c, m.d, offsetX2, offsetY2);
                            offsetX2 = -child.$anchorOffsetX;
                            offsetY2 = -child.$anchorOffsetY;
                        }
                        else {
                            offsetX2 = offsetX + child.$x - child.$anchorOffsetX;
                            offsetY2 = offsetY + child.$y - child.$anchorOffsetY;
                        }
                        switch (child.$renderMode) {
                            case 1 /* NONE */:
                                break;
                            case 2 /* FILTER */:
                                drawCalls += this.drawWithFilter(child, buffer, offsetX2, offsetY2);
                                break;
                            case 3 /* CLIP */:
                                drawCalls += this.drawWithClip(child, buffer, offsetX2, offsetY2);
                                break;
                            case 4 /* SCROLLRECT */:
                                drawCalls += this.drawWithScrollRect(child, buffer, offsetX2, offsetY2);
                                break;
                            default:
                                drawCalls += this.drawDisplayObject(child, buffer, offsetX2, offsetY2);
                                break;
                        }
                        if (tempAlpha) {
                            buffer.globalAlpha = tempAlpha;
                        }
                        if (savedMatrix) {
                            var m = buffer.globalMatrix;
                            m.a = savedMatrix.a;
                            m.b = savedMatrix.b;
                            m.c = savedMatrix.c;
                            m.d = savedMatrix.d;
                            m.tx = savedMatrix.tx;
                            m.ty = savedMatrix.ty;
                            egret.Matrix.release(savedMatrix);
                        }
                    }
                }
                return drawCalls;
            };
            /**
             * @private
             */
            WebGLRenderer.prototype.drawWithFilter = function (displayObject, buffer, offsetX, offsetY) {
                var drawCalls = 0;
                if (displayObject.$children && displayObject.$children.length == 0 && (!displayObject.$renderNode || displayObject.$renderNode.$getRenderCount() == 0)) {
                    return drawCalls;
                }
                var filters = displayObject.$filters;
                var hasBlendMode = (displayObject.$blendMode !== 0);
                var compositeOp;
                if (hasBlendMode) {
                    compositeOp = blendModes[displayObject.$blendMode];
                    if (!compositeOp) {
                        compositeOp = defaultCompositeOp;
                    }
                }
                var displayBounds = displayObject.$getOriginalBounds();
                var displayBoundsX = displayBounds.x;
                var displayBoundsY = displayBounds.y;
                var displayBoundsWidth = displayBounds.width;
                var displayBoundsHeight = displayBounds.height;
                if (displayBoundsWidth <= 0 || displayBoundsHeight <= 0) {
                    return drawCalls;
                }
                if (!displayObject.mask && filters.length == 1 && (filters[0].type == "colorTransform" || (filters[0].type === "custom" && filters[0].padding === 0))) {
                    var childrenDrawCount = this.getRenderCount(displayObject);
                    if (!displayObject.$children || childrenDrawCount == 1) {
                        if (hasBlendMode) {
                            buffer.context.setGlobalCompositeOperation(compositeOp);
                        }
                        buffer.context.$filter = filters[0];
                        if (displayObject.$mask) {
                            drawCalls += this.drawWithClip(displayObject, buffer, offsetX, offsetY);
                        }
                        else if (displayObject.$scrollRect || displayObject.$maskRect) {
                            drawCalls += this.drawWithScrollRect(displayObject, buffer, offsetX, offsetY);
                        }
                        else {
                            drawCalls += this.drawDisplayObject(displayObject, buffer, offsetX, offsetY);
                        }
                        buffer.context.$filter = null;
                        if (hasBlendMode) {
                            buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                        }
                        return drawCalls;
                    }
                }
                // 为显示对象创建一个新的buffer
                var displayBuffer = this.createRenderBuffer(displayBoundsWidth, displayBoundsHeight);
                displayBuffer.context.pushBuffer(displayBuffer);
                //todo 可以优化减少draw次数
                if (displayObject.$mask) {
                    drawCalls += this.drawWithClip(displayObject, displayBuffer, -displayBoundsX, -displayBoundsY);
                }
                else if (displayObject.$scrollRect || displayObject.$maskRect) {
                    drawCalls += this.drawWithScrollRect(displayObject, displayBuffer, -displayBoundsX, -displayBoundsY);
                }
                else {
                    drawCalls += this.drawDisplayObject(displayObject, displayBuffer, -displayBoundsX, -displayBoundsY);
                }
                displayBuffer.context.popBuffer();
                //绘制结果到屏幕
                if (drawCalls > 0) {
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(compositeOp);
                    }
                    drawCalls++;
                    // 绘制结果的时候，应用滤镜
                    buffer.$offsetX = offsetX + displayBoundsX;
                    buffer.$offsetY = offsetY + displayBoundsY;
                    var savedMatrix = egret.Matrix.create();
                    var curMatrix = buffer.globalMatrix;
                    savedMatrix.a = curMatrix.a;
                    savedMatrix.b = curMatrix.b;
                    savedMatrix.c = curMatrix.c;
                    savedMatrix.d = curMatrix.d;
                    savedMatrix.tx = curMatrix.tx;
                    savedMatrix.ty = curMatrix.ty;
                    buffer.useOffset();
                    buffer.context.drawTargetWidthFilters(filters, displayBuffer);
                    curMatrix.a = savedMatrix.a;
                    curMatrix.b = savedMatrix.b;
                    curMatrix.c = savedMatrix.c;
                    curMatrix.d = savedMatrix.d;
                    curMatrix.tx = savedMatrix.tx;
                    curMatrix.ty = savedMatrix.ty;
                    egret.Matrix.release(savedMatrix);
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                    }
                }
                renderBufferPool.push(displayBuffer);
                return drawCalls;
            };
            WebGLRenderer.prototype.getRenderCount = function (displayObject) {
                var childrenDrawCount = 0;
                if (displayObject.$children) {
                    for (var _i = 0, _a = displayObject.$children; _i < _a.length; _i++) {
                        var child = _a[_i];
                        var node = child.$getRenderNode();
                        if (node) {
                            childrenDrawCount += node.$getRenderCount();
                        }
                        if (child.$children) {
                            childrenDrawCount += this.getRenderCount(child);
                        }
                    }
                }
                return childrenDrawCount;
            };
            /**
             * @private
             */
            WebGLRenderer.prototype.drawWithClip = function (displayObject, buffer, offsetX, offsetY) {
                var drawCalls = 0;
                var hasBlendMode = (displayObject.$blendMode !== 0);
                var compositeOp;
                if (hasBlendMode) {
                    compositeOp = blendModes[displayObject.$blendMode];
                    if (!compositeOp) {
                        compositeOp = defaultCompositeOp;
                    }
                }
                var scrollRect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect;
                var mask = displayObject.$mask;
                if (mask) {
                    var maskRenderMatrix = mask.$getMatrix();
                    //遮罩scaleX或scaleY为0，放弃绘制
                    if ((maskRenderMatrix.a == 0 && maskRenderMatrix.b == 0) || (maskRenderMatrix.c == 0 && maskRenderMatrix.d == 0)) {
                        return drawCalls;
                    }
                }
                //没有遮罩,同时显示对象没有子项
                if (!mask && (!displayObject.$children || displayObject.$children.length == 0)) {
                    if (scrollRect) {
                        buffer.context.pushMask(scrollRect.x + offsetX, scrollRect.y + offsetY, scrollRect.width, scrollRect.height);
                    }
                    //绘制显示对象
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(compositeOp);
                    }
                    drawCalls += this.drawDisplayObject(displayObject, buffer, offsetX, offsetY);
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                    }
                    if (scrollRect) {
                        buffer.context.popMask();
                    }
                    return drawCalls;
                }
                else {
                    var displayBounds = displayObject.$getOriginalBounds();
                    var displayBoundsX = displayBounds.x;
                    var displayBoundsY = displayBounds.y;
                    var displayBoundsWidth = displayBounds.width;
                    var displayBoundsHeight = displayBounds.height;
                    //绘制显示对象自身，若有scrollRect，应用clip
                    var displayBuffer = this.createRenderBuffer(displayBoundsWidth, displayBoundsHeight);
                    displayBuffer.context.pushBuffer(displayBuffer);
                    drawCalls += this.drawDisplayObject(displayObject, displayBuffer, -displayBoundsX, -displayBoundsY);
                    //绘制遮罩
                    if (mask) {
                        var maskBuffer = this.createRenderBuffer(displayBoundsWidth, displayBoundsHeight);
                        maskBuffer.context.pushBuffer(maskBuffer);
                        var maskMatrix = egret.Matrix.create();
                        maskMatrix.copyFrom(mask.$getConcatenatedMatrix());
                        mask.$getConcatenatedMatrixAt(displayObject, maskMatrix);
                        maskMatrix.translate(-displayBoundsX, -displayBoundsY);
                        maskBuffer.setTransform(maskMatrix.a, maskMatrix.b, maskMatrix.c, maskMatrix.d, maskMatrix.tx, maskMatrix.ty);
                        egret.Matrix.release(maskMatrix);
                        drawCalls += this.drawDisplayObject(mask, maskBuffer, 0, 0);
                        maskBuffer.context.popBuffer();
                        displayBuffer.context.setGlobalCompositeOperation("destination-in");
                        displayBuffer.setTransform(1, 0, 0, -1, 0, maskBuffer.height);
                        displayBuffer.globalAlpha = 1;
                        var maskBufferWidth = maskBuffer.rootRenderTarget.width;
                        var maskBufferHeight = maskBuffer.rootRenderTarget.height;
                        displayBuffer.context.drawTexture(maskBuffer.rootRenderTarget.texture, 0, 0, maskBufferWidth, maskBufferHeight, 0, 0, maskBufferWidth, maskBufferHeight, maskBufferWidth, maskBufferHeight);
                        displayBuffer.setTransform(1, 0, 0, 1, 0, 0);
                        displayBuffer.context.setGlobalCompositeOperation("source-over");
                        renderBufferPool.push(maskBuffer);
                    }
                    displayBuffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                    displayBuffer.context.popBuffer();
                    //绘制结果到屏幕
                    if (drawCalls > 0) {
                        drawCalls++;
                        if (hasBlendMode) {
                            buffer.context.setGlobalCompositeOperation(compositeOp);
                        }
                        if (scrollRect) {
                            buffer.context.pushMask(scrollRect.x + offsetX, scrollRect.y + offsetY, scrollRect.width, scrollRect.height);
                        }
                        buffer.globalAlpha = 1;
                        var savedMatrix = egret.Matrix.create();
                        var curMatrix = buffer.globalMatrix;
                        savedMatrix.a = curMatrix.a;
                        savedMatrix.b = curMatrix.b;
                        savedMatrix.c = curMatrix.c;
                        savedMatrix.d = curMatrix.d;
                        savedMatrix.tx = curMatrix.tx;
                        savedMatrix.ty = curMatrix.ty;
                        curMatrix.append(1, 0, 0, -1, offsetX + displayBoundsX, offsetY + displayBoundsY + displayBuffer.height);
                        var displayBufferWidth = displayBuffer.rootRenderTarget.width;
                        var displayBufferHeight = displayBuffer.rootRenderTarget.height;
                        buffer.context.drawTexture(displayBuffer.rootRenderTarget.texture, 0, 0, displayBufferWidth, displayBufferHeight, 0, 0, displayBufferWidth, displayBufferHeight, displayBufferWidth, displayBufferHeight);
                        if (scrollRect) {
                            displayBuffer.context.popMask();
                        }
                        if (hasBlendMode) {
                            buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                        }
                        var matrix = buffer.globalMatrix;
                        matrix.a = savedMatrix.a;
                        matrix.b = savedMatrix.b;
                        matrix.c = savedMatrix.c;
                        matrix.d = savedMatrix.d;
                        matrix.tx = savedMatrix.tx;
                        matrix.ty = savedMatrix.ty;
                        egret.Matrix.release(savedMatrix);
                    }
                    renderBufferPool.push(displayBuffer);
                    return drawCalls;
                }
            };
            /**
             * @private
             */
            WebGLRenderer.prototype.drawWithScrollRect = function (displayObject, buffer, offsetX, offsetY) {
                var drawCalls = 0;
                var scrollRect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect;
                if (scrollRect.isEmpty()) {
                    return drawCalls;
                }
                if (displayObject.$scrollRect) {
                    offsetX -= scrollRect.x;
                    offsetY -= scrollRect.y;
                }
                var m = buffer.globalMatrix;
                var context = buffer.context;
                var scissor = false;
                if (buffer.$hasScissor || m.b != 0 || m.c != 0) {
                    buffer.context.pushMask(scrollRect.x + offsetX, scrollRect.y + offsetY, scrollRect.width, scrollRect.height);
                }
                else {
                    var a = m.a;
                    var d = m.d;
                    var tx = m.tx;
                    var ty = m.ty;
                    var x = scrollRect.x + offsetX;
                    var y = scrollRect.y + offsetY;
                    var xMax = x + scrollRect.width;
                    var yMax = y + scrollRect.height;
                    var minX = void 0, minY = void 0, maxX = void 0, maxY = void 0;
                    //优化，通常情况下不缩放的对象占多数，直接加上偏移量即可。
                    if (a == 1.0 && d == 1.0) {
                        minX = x + tx;
                        minY = y + ty;
                        maxX = xMax + tx;
                        maxY = yMax + ty;
                    }
                    else {
                        var x0 = a * x + tx;
                        var y0 = d * y + ty;
                        var x1 = a * xMax + tx;
                        var y1 = d * y + ty;
                        var x2 = a * xMax + tx;
                        var y2 = d * yMax + ty;
                        var x3 = a * x + tx;
                        var y3 = d * yMax + ty;
                        var tmp = 0;
                        if (x0 > x1) {
                            tmp = x0;
                            x0 = x1;
                            x1 = tmp;
                        }
                        if (x2 > x3) {
                            tmp = x2;
                            x2 = x3;
                            x3 = tmp;
                        }
                        minX = (x0 < x2 ? x0 : x2);
                        maxX = (x1 > x3 ? x1 : x3);
                        if (y0 > y1) {
                            tmp = y0;
                            y0 = y1;
                            y1 = tmp;
                        }
                        if (y2 > y3) {
                            tmp = y2;
                            y2 = y3;
                            y3 = tmp;
                        }
                        minY = (y0 < y2 ? y0 : y2);
                        maxY = (y1 > y3 ? y1 : y3);
                    }
                    context.enableScissor(minX, -maxY + buffer.height, maxX - minX, maxY - minY);
                    scissor = true;
                }
                drawCalls += this.drawDisplayObject(displayObject, buffer, offsetX, offsetY);
                if (scissor) {
                    context.disableScissor();
                }
                else {
                    context.popMask();
                }
                return drawCalls;
            };
            /**
             * 将一个RenderNode对象绘制到渲染缓冲
             * @param node 要绘制的节点
             * @param buffer 渲染缓冲
             * @param matrix 要叠加的矩阵
             * @param forHitTest 绘制结果是用于碰撞检测。若为true，当渲染GraphicsNode时，会忽略透明度样式设置，全都绘制为不透明的。
             */
            WebGLRenderer.prototype.drawNodeToBuffer = function (node, buffer, matrix, forHitTest) {
                var webglBuffer = buffer;
                //pushRenderTARGET
                webglBuffer.context.pushBuffer(webglBuffer);
                webglBuffer.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
                this.renderNode(node, buffer, 0, 0, forHitTest);
                webglBuffer.context.$drawWebGL();
                webglBuffer.onRenderFinish();
                //popRenderTARGET
                webglBuffer.context.popBuffer();
            };
            /**
             * 将一个DisplayObject绘制到渲染缓冲，用于RenderTexture绘制
             * @param displayObject 要绘制的显示对象
             * @param buffer 渲染缓冲
             * @param matrix 要叠加的矩阵
             */
            WebGLRenderer.prototype.drawDisplayToBuffer = function (displayObject, buffer, matrix) {
                buffer.context.pushBuffer(buffer);
                if (matrix) {
                    buffer.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
                }
                var node;
                if (displayObject.$renderDirty) {
                    node = displayObject.$getRenderNode();
                }
                else {
                    node = displayObject.$renderNode;
                }
                var drawCalls = 0;
                if (node) {
                    drawCalls++;
                    switch (node.type) {
                        case 1 /* BitmapNode */:
                            this.renderBitmap(node, buffer);
                            break;
                        case 2 /* TextNode */:
                            this.renderText(node, buffer);
                            break;
                        case 3 /* GraphicsNode */:
                            this.renderGraphics(node, buffer);
                            break;
                        case 4 /* GroupNode */:
                            this.renderGroup(node, buffer);
                            break;
                        case 5 /* MeshNode */:
                            this.renderMesh(node, buffer);
                            break;
                        case 6 /* NormalBitmapNode */:
                            this.renderNormalBitmap(node, buffer);
                            break;
                    }
                }
                var children = displayObject.$children;
                if (children) {
                    var length_5 = children.length;
                    for (var i = 0; i < length_5; i++) {
                        var child = children[i];
                        switch (child.$renderMode) {
                            case 1 /* NONE */:
                                break;
                            case 2 /* FILTER */:
                                drawCalls += this.drawWithFilter(child, buffer, 0, 0);
                                break;
                            case 3 /* CLIP */:
                                drawCalls += this.drawWithClip(child, buffer, 0, 0);
                                break;
                            case 4 /* SCROLLRECT */:
                                drawCalls += this.drawWithScrollRect(child, buffer, 0, 0);
                                break;
                            default:
                                drawCalls += this.drawDisplayObject(child, buffer, 0, 0);
                                break;
                        }
                    }
                }
                buffer.context.$drawWebGL();
                buffer.onRenderFinish();
                buffer.context.popBuffer();
                return drawCalls;
            };
            /**
             * @private
             */
            WebGLRenderer.prototype.renderNode = function (node, buffer, offsetX, offsetY, forHitTest) {
                buffer.$offsetX = offsetX;
                buffer.$offsetY = offsetY;
                switch (node.type) {
                    case 1 /* BitmapNode */:
                        this.renderBitmap(node, buffer);
                        break;
                    case 2 /* TextNode */:
                        this.renderText(node, buffer);
                        break;
                    case 3 /* GraphicsNode */:
                        this.renderGraphics(node, buffer, forHitTest);
                        break;
                    case 4 /* GroupNode */:
                        this.renderGroup(node, buffer);
                        break;
                    case 5 /* MeshNode */:
                        this.renderMesh(node, buffer);
                        break;
                    case 6 /* NormalBitmapNode */:
                        this.renderNormalBitmap(node, buffer);
                        break;
                }
            };
            /**
             * @private
             */
            WebGLRenderer.prototype.renderNormalBitmap = function (node, buffer) {
                var image = node.image;
                if (!image) {
                    return;
                }
                buffer.context.drawImage(image, node.sourceX, node.sourceY, node.sourceW, node.sourceH, node.drawX, node.drawY, node.drawW, node.drawH, node.imageWidth, node.imageHeight, node.rotated, node.smoothing);
            };
            /**
             * @private
             */
            WebGLRenderer.prototype.renderBitmap = function (node, buffer) {
                var image = node.image;
                if (!image) {
                    return;
                }
                //buffer.imageSmoothingEnabled = node.smoothing;
                var data = node.drawData;
                var length = data.length;
                var pos = 0;
                var m = node.matrix;
                var blendMode = node.blendMode;
                var alpha = node.alpha;
                var savedMatrix;
                var offsetX;
                var offsetY;
                if (m) {
                    savedMatrix = egret.Matrix.create();
                    var curMatrix = buffer.globalMatrix;
                    savedMatrix.a = curMatrix.a;
                    savedMatrix.b = curMatrix.b;
                    savedMatrix.c = curMatrix.c;
                    savedMatrix.d = curMatrix.d;
                    savedMatrix.tx = curMatrix.tx;
                    savedMatrix.ty = curMatrix.ty;
                    offsetX = buffer.$offsetX;
                    offsetY = buffer.$offsetY;
                    buffer.useOffset();
                    buffer.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                }
                //这里不考虑嵌套
                if (blendMode) {
                    buffer.context.setGlobalCompositeOperation(blendModes[blendMode]);
                }
                var originAlpha;
                if (alpha == alpha) {
                    originAlpha = buffer.globalAlpha;
                    buffer.globalAlpha *= alpha;
                }
                if (node.filter) {
                    buffer.context.$filter = node.filter;
                    while (pos < length) {
                        buffer.context.drawImage(image, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.rotated, node.smoothing);
                    }
                    buffer.context.$filter = null;
                }
                else {
                    while (pos < length) {
                        buffer.context.drawImage(image, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.rotated, node.smoothing);
                    }
                }
                if (blendMode) {
                    buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                }
                if (alpha == alpha) {
                    buffer.globalAlpha = originAlpha;
                }
                if (m) {
                    var matrix = buffer.globalMatrix;
                    matrix.a = savedMatrix.a;
                    matrix.b = savedMatrix.b;
                    matrix.c = savedMatrix.c;
                    matrix.d = savedMatrix.d;
                    matrix.tx = savedMatrix.tx;
                    matrix.ty = savedMatrix.ty;
                    buffer.$offsetX = offsetX;
                    buffer.$offsetY = offsetY;
                    egret.Matrix.release(savedMatrix);
                }
            };
            /**
             * @private
             */
            WebGLRenderer.prototype.renderMesh = function (node, buffer) {
                var image = node.image;
                //buffer.imageSmoothingEnabled = node.smoothing;
                var data = node.drawData;
                var length = data.length;
                var pos = 0;
                var m = node.matrix;
                var blendMode = node.blendMode;
                var alpha = node.alpha;
                var savedMatrix;
                var offsetX;
                var offsetY;
                if (m) {
                    savedMatrix = egret.Matrix.create();
                    var curMatrix = buffer.globalMatrix;
                    savedMatrix.a = curMatrix.a;
                    savedMatrix.b = curMatrix.b;
                    savedMatrix.c = curMatrix.c;
                    savedMatrix.d = curMatrix.d;
                    savedMatrix.tx = curMatrix.tx;
                    savedMatrix.ty = curMatrix.ty;
                    offsetX = buffer.$offsetX;
                    offsetY = buffer.$offsetY;
                    buffer.useOffset();
                    buffer.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                }
                //这里不考虑嵌套
                if (blendMode) {
                    buffer.context.setGlobalCompositeOperation(blendModes[blendMode]);
                }
                var originAlpha;
                if (alpha == alpha) {
                    originAlpha = buffer.globalAlpha;
                    buffer.globalAlpha *= alpha;
                }
                if (node.filter) {
                    buffer.context.$filter = node.filter;
                    while (pos < length) {
                        buffer.context.drawMesh(image, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.uvs, node.vertices, node.indices, node.bounds, node.rotated, node.smoothing);
                    }
                    buffer.context.$filter = null;
                }
                else {
                    while (pos < length) {
                        buffer.context.drawMesh(image, data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.uvs, node.vertices, node.indices, node.bounds, node.rotated, node.smoothing);
                    }
                }
                if (blendMode) {
                    buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                }
                if (alpha == alpha) {
                    buffer.globalAlpha = originAlpha;
                }
                if (m) {
                    var matrix = buffer.globalMatrix;
                    matrix.a = savedMatrix.a;
                    matrix.b = savedMatrix.b;
                    matrix.c = savedMatrix.c;
                    matrix.d = savedMatrix.d;
                    matrix.tx = savedMatrix.tx;
                    matrix.ty = savedMatrix.ty;
                    buffer.$offsetX = offsetX;
                    buffer.$offsetY = offsetY;
                    egret.Matrix.release(savedMatrix);
                }
            };
            /**
             * @private
             */
            WebGLRenderer.prototype.renderText = function (node, buffer) {
                var width = node.width - node.x;
                var height = node.height - node.y;
                if (width <= 0 || height <= 0 || !width || !height || node.drawData.length == 0) {
                    return;
                }
                var canvasScaleX = egret.sys.DisplayList.$canvasScaleX;
                var canvasScaleY = egret.sys.DisplayList.$canvasScaleY;
                var maxTextureSize = buffer.context.$maxTextureSize;
                if (width * canvasScaleX > maxTextureSize) {
                    canvasScaleX *= maxTextureSize / (width * canvasScaleX);
                }
                if (height * canvasScaleY > maxTextureSize) {
                    canvasScaleY *= maxTextureSize / (height * canvasScaleY);
                }
                width *= canvasScaleX;
                height *= canvasScaleY;
                var x = node.x * canvasScaleX;
                var y = node.y * canvasScaleY;
                if (node.$canvasScaleX != canvasScaleX || node.$canvasScaleY != canvasScaleY) {
                    node.$canvasScaleX = canvasScaleX;
                    node.$canvasScaleY = canvasScaleY;
                    node.dirtyRender = true;
                }
                if (!this.canvasRenderBuffer || !this.canvasRenderBuffer.context) {
                    this.canvasRenderer = new egret.CanvasRenderer();
                    this.canvasRenderBuffer = new web.CanvasRenderBuffer(width, height);
                }
                else if (node.dirtyRender) {
                    this.canvasRenderBuffer.resize(width, height);
                }
                // if (node.dirtyRender) {
                //     let canvasRenderBuffer = new CanvasRenderBuffer(width, height);
                //     node['canvasRenderBuffer'] = canvasRenderBuffer;
                // }
                var scaleX = 1, scaleY = 1, tx = 0, ty = 0;
                if (canvasScaleX != 1 || canvasScaleY != 1) {
                    scaleX = canvasScaleX;
                    scaleY = canvasScaleY;
                }
                if (x || y) {
                    tx = -x;
                    ty = -y;
                    buffer.transform(1, 0, 0, 1, x / canvasScaleX, y / canvasScaleY);
                }
                else if (canvasScaleX != 1 || canvasScaleY != 1) {
                    tx = 0;
                    ty = 0;
                }
                if (this.canvasRenderBuffer)
                    this.canvasRenderBuffer.context_setTransform(scaleX, 0, 0, scaleY, tx, ty);
                if (node.dirtyRender) {
                    var surface = this.canvasRenderBuffer.surface;
                    var context = this.canvasRenderBuffer.context;
                    this.canvasRenderer.renderText(node, this.canvasRenderBuffer.context);
                    // 拷贝canvas到texture
                    var texture = node.$texture;
                    if (!texture) {
                        texture = buffer.context.createTextureByCanvas(context);
                        node.$texture = texture;
                    }
                    else {
                        // 重新拷贝新的图像
                        buffer.context.updateTexture(texture, context);
                    }
                    // 保存材质尺寸
                    node.$textureWidth = surface.width;
                    node.$textureHeight = surface.height;
                }
                var textureWidth = node.$textureWidth;
                var textureHeight = node.$textureHeight;
                buffer.context.drawTexture(node.$texture, 0, 0, textureWidth, textureHeight, 0, 0, textureWidth / canvasScaleX, textureHeight / canvasScaleY, textureWidth, textureHeight);
                if (x || y) {
                    if (node.dirtyRender) {
                        this.canvasRenderBuffer.context_setTransform(canvasScaleX, 0, 0, canvasScaleY, 0, 0);
                    }
                    buffer.transform(1, 0, 0, 1, -x / canvasScaleX, -y / canvasScaleY);
                }
                node.dirtyRender = false;
            };
            /**
             * @private
             */
            WebGLRenderer.prototype.renderGraphics = function (node, buffer, forHitTest) {
                // debugger
                var width = node.width;
                var height = node.height;
                if (width <= 0 || height <= 0 || !width || !height || node.drawData.length == 0) {
                    return;
                }
                var canvasScaleX = egret.sys.DisplayList.$canvasScaleX;
                var canvasScaleY = egret.sys.DisplayList.$canvasScaleY;
                if (width * canvasScaleX < 1 || height * canvasScaleY < 1) {
                    canvasScaleX = canvasScaleY = 1;
                }
                if (node.$canvasScaleX != canvasScaleX || node.$canvasScaleY != canvasScaleY) {
                    node.$canvasScaleX = canvasScaleX;
                    node.$canvasScaleY = canvasScaleY;
                    node.dirtyRender = true;
                }
                //缩放叠加 width2 / width 填满整个区域
                width = width * canvasScaleX;
                height = height * canvasScaleY;
                var width2 = Math.ceil(width);
                var height2 = Math.ceil(height);
                canvasScaleX *= width2 / width;
                canvasScaleY *= height2 / height;
                width = width2;
                height = height2;
                if (!this.canvasRenderBuffer || !this.canvasRenderBuffer.context) {
                    this.canvasRenderer = new egret.CanvasRenderer();
                    this.canvasRenderBuffer = new web.CanvasRenderBuffer(width, height);
                }
                else if (node.dirtyRender || forHitTest) {
                    // let canvasRenderBuffer = new CanvasRenderBuffer(width, height);
                    // node['canvasRenderBuffer'] = canvasRenderBuffer;
                    this.canvasRenderBuffer.resize(width, height);
                }
                // let canvasRenderBuffer = node['canvasRenderBuffer'];
                if (canvasScaleX != 1 || canvasScaleY != 1) {
                    this.canvasRenderBuffer.context_setTransform(canvasScaleX, 0, 0, canvasScaleY, 0, 0);
                }
                if (node.x || node.y) {
                    if (node.dirtyRender || forHitTest) {
                        this.canvasRenderBuffer.context.translate(-node.x, -node.y);
                    }
                    buffer.transform(1, 0, 0, 1, node.x, node.y);
                }
                var surface = this.canvasRenderBuffer.surface;
                var context = this.canvasRenderBuffer.context;
                if (forHitTest) {
                    this.canvasRenderer.renderGraphics(node, this.canvasRenderBuffer.context, true);
                    egret.WebGLUtils.deleteWebGLTexture(surface);
                    var texture = buffer.context.getWebGLTexture(surface);
                    buffer.context.drawTexture(texture, 0, 0, width, height, 0, 0, width, height, surface.width, surface.height);
                }
                else {
                    if (node.dirtyRender) {
                        this.canvasRenderer.renderGraphics(node, this.canvasRenderBuffer.context);
                        // 拷贝canvas到texture
                        var texture = node.$texture;
                        if (!texture) {
                            texture = buffer.context.createTextureByCanvas(context);
                            node.$texture = texture;
                        }
                        else {
                            // 重新拷贝新的图像
                            buffer.context.updateTexture(texture, context);
                        }
                        // 保存材质尺寸
                        node.$textureWidth = surface.width;
                        node.$textureHeight = surface.height;
                    }
                    var textureWidth = node.$textureWidth;
                    var textureHeight = node.$textureHeight;
                    buffer.context.drawTexture(node.$texture, 0, 0, textureWidth, textureHeight, 0, 0, textureWidth / canvasScaleX, textureHeight / canvasScaleY, textureWidth, textureHeight);
                }
                if (node.x || node.y) {
                    if (node.dirtyRender || forHitTest) {
                        this.canvasRenderBuffer.context.translate(node.x, node.y);
                    }
                    buffer.transform(1, 0, 0, 1, -node.x, -node.y);
                }
                if (!forHitTest) {
                    node.dirtyRender = false;
                }
            };
            WebGLRenderer.prototype.renderGroup = function (groupNode, buffer) {
                var m = groupNode.matrix;
                var savedMatrix;
                var offsetX;
                var offsetY;
                if (m) {
                    savedMatrix = egret.Matrix.create();
                    var curMatrix = buffer.globalMatrix;
                    savedMatrix.a = curMatrix.a;
                    savedMatrix.b = curMatrix.b;
                    savedMatrix.c = curMatrix.c;
                    savedMatrix.d = curMatrix.d;
                    savedMatrix.tx = curMatrix.tx;
                    savedMatrix.ty = curMatrix.ty;
                    offsetX = buffer.$offsetX;
                    offsetY = buffer.$offsetY;
                    buffer.useOffset();
                    buffer.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                }
                var children = groupNode.drawData;
                var length = children.length;
                for (var i = 0; i < length; i++) {
                    var node = children[i];
                    this.renderNode(node, buffer, buffer.$offsetX, buffer.$offsetY);
                }
                if (m) {
                    var matrix = buffer.globalMatrix;
                    matrix.a = savedMatrix.a;
                    matrix.b = savedMatrix.b;
                    matrix.c = savedMatrix.c;
                    matrix.d = savedMatrix.d;
                    matrix.tx = savedMatrix.tx;
                    matrix.ty = savedMatrix.ty;
                    buffer.$offsetX = offsetX;
                    buffer.$offsetY = offsetY;
                    egret.Matrix.release(savedMatrix);
                }
            };
            /**
             * @private
             */
            WebGLRenderer.prototype.createRenderBuffer = function (width, height) {
                var buffer = renderBufferPool.pop();
                if (buffer) {
                    buffer.resize(width, height);
                }
                else {
                    buffer = new web.WebGLRenderBuffer(width, height);
                    buffer.$computeDrawCall = false;
                }
                return buffer;
            };
            return WebGLRenderer;
        }());
        web.WebGLRenderer = WebGLRenderer;
        __reflect(WebGLRenderer.prototype, "egret.web.WebGLRenderer", ["egret.sys.SystemRenderer"]);
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         * WebGLRenderTarget类
         * 一个WebGL渲染目标，拥有一个frame buffer和texture
         */
        var WebGLRenderTarget = (function (_super) {
            __extends(WebGLRenderTarget, _super);
            function WebGLRenderTarget(gl, width, height) {
                var _this = _super.call(this) || this;
                // 清除色
                _this.clearColor = [0, 0, 0, 0];
                // 是否启用frame buffer, 默认为true
                _this.useFrameBuffer = true;
                _this.gl = gl;
                // 如果尺寸为 0 chrome会报警
                _this.width = width || 1;
                _this.height = height || 1;
                return _this;
            }
            /**
             * 重置render target的尺寸
             */
            WebGLRenderTarget.prototype.resize = function (width, height) {
                var gl = this.gl;
                this.width = width;
                this.height = height;
                if (this.frameBuffer) {
                    // 设置texture尺寸
                    gl.bindTexture(gl.TEXTURE_2D, this.texture);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
                    // gl.bindTexture(gl.TEXTURE_2D, null);
                }
                if (this.stencilBuffer) {
                    gl.deleteRenderbuffer(this.stencilBuffer);
                    this.stencilBuffer = null;
                }
            };
            /**
             * 激活此render target
             */
            WebGLRenderTarget.prototype.activate = function () {
                var gl = this.gl;
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.getFrameBuffer());
            };
            /**
             * 获取frame buffer
             */
            WebGLRenderTarget.prototype.getFrameBuffer = function () {
                if (!this.useFrameBuffer) {
                    return null;
                }
                return this.frameBuffer;
            };
            WebGLRenderTarget.prototype.initFrameBuffer = function () {
                if (!this.frameBuffer) {
                    var gl = this.gl;
                    // 创建材质
                    this.texture = this.createTexture();
                    // 创建frame buffer
                    this.frameBuffer = gl.createFramebuffer();
                    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
                    // 绑定材质
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
                }
            };
            /**
             * 创建材质
             * TODO 创建材质的方法可以合并
             */
            WebGLRenderTarget.prototype.createTexture = function () {
                var gl = this.gl;
                var texture = gl.createTexture();
                texture["glContext"] = gl;
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                return texture;
            };
            /**
             * 清除render target颜色缓存
             */
            WebGLRenderTarget.prototype.clear = function (bind) {
                var gl = this.gl;
                if (bind) {
                    this.activate();
                }
                gl.colorMask(true, true, true, true);
                gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3]);
                gl.clear(gl.COLOR_BUFFER_BIT);
            };
            WebGLRenderTarget.prototype.enabledStencil = function () {
                if (!this.frameBuffer || this.stencilBuffer) {
                    return;
                }
                var gl = this.gl;
                // 设置render buffer的尺寸
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer); // 是否需要强制绑定？
                // 绑定stencil buffer
                this.stencilBuffer = gl.createRenderbuffer();
                gl.bindRenderbuffer(gl.RENDERBUFFER, this.stencilBuffer);
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, this.width, this.height);
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.stencilBuffer);
                // 此处不解绑是否会造成bug？
                // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            };
            WebGLRenderTarget.prototype.dispose = function () {
                egret.WebGLUtils.deleteWebGLTexture(this.texture);
            };
            return WebGLRenderTarget;
        }(egret.HashObject));
        web.WebGLRenderTarget = WebGLRenderTarget;
        __reflect(WebGLRenderTarget.prototype, "egret.web.WebGLRenderTarget");
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @private
     */
    var BKWebGLUtils = (function () {
        function BKWebGLUtils() {
        }
        BKWebGLUtils.compileProgram = function (gl, vertexSrc, fragmentSrc) {
            var fragmentShader = egret.WebGLUtils.compileFragmentShader(gl, fragmentSrc);
            var vertexShader = egret.WebGLUtils.compileVertexShader(gl, vertexSrc);
            var shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);
            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                egret.$warn(1020);
            }
            return shaderProgram;
        };
        BKWebGLUtils.compileFragmentShader = function (gl, shaderSrc) {
            return this._compileShader(gl, shaderSrc, gl.FRAGMENT_SHADER);
        };
        BKWebGLUtils.compileVertexShader = function (gl, shaderSrc) {
            return this._compileShader(gl, shaderSrc, gl.VERTEX_SHADER);
        };
        BKWebGLUtils._compileShader = function (gl, shaderSrc, shaderType) {
            var shader = gl.createShader(shaderType);
            gl.shaderSource(shader, shaderSrc);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                //egret.info(gl.getShaderInfoLog(shader));
                return null;
            }
            return shader;
        };
        BKWebGLUtils.checkCanUseWebGL = function () {
            return true;
        };
        BKWebGLUtils.deleteWebGLTexture = function (bitmapData) {
            if (bitmapData) {
                var gl = bitmapData.glContext;
                if (gl) {
                    gl.deleteTexture(bitmapData);
                }
            }
        };
        return BKWebGLUtils;
    }());
    egret.BKWebGLUtils = BKWebGLUtils;
    __reflect(BKWebGLUtils.prototype, "egret.BKWebGLUtils");
    egret.WebGLUtils = BKWebGLUtils;
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         * 顶点数组管理对象
         * 用来维护顶点数组
         */
        var WebGLVertexArrayObject = (function () {
            function WebGLVertexArrayObject() {
                this.size = 2000;
                this.vertexMaxSize = this.size * 4;
                this.indicesMaxSize = this.size * 6;
                this.vertSize = 5;
                this.vertices = null;
                this.indices = null;
                this.indicesForMesh = null;
                this.vertexIndex = 0;
                this.indexIndex = 0;
                this.hasMesh = false;
                var numVerts = this.vertexMaxSize * this.vertSize;
                var numIndices = this.indicesMaxSize;
                this.vertices = new Float32Array(numVerts);
                this.indices = new Uint16Array(numIndices);
                this.indicesForMesh = new Uint16Array(numIndices);
                for (var i = 0, j = 0; i < numIndices; i += 6, j += 4) {
                    this.indices[i + 0] = j + 0;
                    this.indices[i + 1] = j + 1;
                    this.indices[i + 2] = j + 2;
                    this.indices[i + 3] = j + 0;
                    this.indices[i + 4] = j + 2;
                    this.indices[i + 5] = j + 3;
                }
            }
            /**
             * 是否达到最大缓存数量
             */
            WebGLVertexArrayObject.prototype.reachMaxSize = function (vertexCount, indexCount) {
                if (vertexCount === void 0) { vertexCount = 4; }
                if (indexCount === void 0) { indexCount = 6; }
                return this.vertexIndex > this.vertexMaxSize - vertexCount || this.indexIndex > this.indicesMaxSize - indexCount;
            };
            /**
             * 获取缓存完成的顶点数组
             */
            WebGLVertexArrayObject.prototype.getVertices = function () {
                var view = this.vertices.subarray(0, this.vertexIndex * this.vertSize);
                return view;
            };
            /**
             * 获取缓存完成的索引数组
             */
            WebGLVertexArrayObject.prototype.getIndices = function () {
                return this.indices;
            };
            /**
             * 获取缓存完成的mesh索引数组
             */
            WebGLVertexArrayObject.prototype.getMeshIndices = function () {
                return this.indicesForMesh;
            };
            /**
             * 切换成mesh索引缓存方式
             */
            WebGLVertexArrayObject.prototype.changeToMeshIndices = function () {
                if (!this.hasMesh) {
                    // 拷贝默认index信息到for mesh中
                    for (var i = 0, l = this.indexIndex; i < l; ++i) {
                        this.indicesForMesh[i] = this.indices[i];
                    }
                    this.hasMesh = true;
                }
            };
            WebGLVertexArrayObject.prototype.isMesh = function () {
                return this.hasMesh;
            };
            /**
             * 默认构成矩形
             */
            // private defaultMeshVertices = [0, 0, 1, 0, 1, 1, 0, 1];
            // private defaultMeshUvs = [
            //     0, 0,
            //     1, 0,
            //     1, 1,
            //     0, 1
            // ];
            // private defaultMeshIndices = [0, 1, 2, 0, 2, 3];
            /**
             * 缓存一组顶点
             */
            WebGLVertexArrayObject.prototype.cacheArrays = function (buffer, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureSourceWidth, textureSourceHeight, meshUVs, meshVertices, meshIndices, rotated) {
                var alpha = buffer.globalAlpha;
                //计算出绘制矩阵，之后把矩阵还原回之前的
                var locWorldTransform = buffer.globalMatrix;
                var a = locWorldTransform.a;
                var b = locWorldTransform.b;
                var c = locWorldTransform.c;
                var d = locWorldTransform.d;
                var tx = locWorldTransform.tx;
                var ty = locWorldTransform.ty;
                var offsetX = buffer.$offsetX;
                var offsetY = buffer.$offsetY;
                if (offsetX != 0 || offsetY != 0) {
                    tx = offsetX * a + offsetY * c + tx;
                    ty = offsetX * b + offsetY * d + ty;
                }
                if (!meshVertices) {
                    if (destX != 0 || destY != 0) {
                        tx = destX * a + destY * c + tx;
                        ty = destX * b + destY * d + ty;
                    }
                    var a1 = destWidth / sourceWidth;
                    if (a1 != 1) {
                        a = a1 * a;
                        b = a1 * b;
                    }
                    var d1 = destHeight / sourceHeight;
                    if (d1 != 1) {
                        c = d1 * c;
                        d = d1 * d;
                    }
                }
                if (meshVertices) {
                    // 计算索引位置与赋值
                    var vertices = this.vertices;
                    var index = this.vertexIndex * this.vertSize;
                    // 缓存顶点数组
                    var i = 0, iD = 0, l = 0;
                    var u = 0, v = 0, x = 0, y = 0;
                    for (i = 0, l = meshUVs.length; i < l; i += 2) {
                        iD = index + i * 5 / 2;
                        x = meshVertices[i];
                        y = meshVertices[i + 1];
                        u = meshUVs[i];
                        v = meshUVs[i + 1];
                        // xy
                        vertices[iD + 0] = a * x + c * y + tx;
                        vertices[iD + 1] = b * x + d * y + ty;
                        // uv
                        if (rotated) {
                            vertices[iD + 2] = (sourceX + (1.0 - v) * sourceHeight) / textureSourceWidth;
                            vertices[iD + 3] = (sourceY + u * sourceWidth) / textureSourceHeight;
                        }
                        else {
                            vertices[iD + 2] = (sourceX + u * sourceWidth) / textureSourceWidth;
                            vertices[iD + 3] = (sourceY + v * sourceHeight) / textureSourceHeight;
                        }
                        // alpha
                        vertices[iD + 4] = alpha;
                    }
                    // 缓存索引数组
                    if (this.hasMesh) {
                        for (var i_1 = 0, l_1 = meshIndices.length; i_1 < l_1; ++i_1) {
                            this.indicesForMesh[this.indexIndex + i_1] = meshIndices[i_1] + this.vertexIndex;
                        }
                    }
                    this.vertexIndex += meshUVs.length / 2;
                    this.indexIndex += meshIndices.length;
                }
                else {
                    var width = textureSourceWidth;
                    var height = textureSourceHeight;
                    var w = sourceWidth;
                    var h = sourceHeight;
                    sourceX = sourceX / width;
                    sourceY = sourceY / height;
                    var vertices = this.vertices;
                    var index = this.vertexIndex * this.vertSize;
                    if (rotated) {
                        var temp = sourceWidth;
                        sourceWidth = sourceHeight / width;
                        sourceHeight = temp / height;
                        // xy
                        vertices[index++] = tx;
                        vertices[index++] = ty;
                        // uv
                        vertices[index++] = sourceWidth + sourceX;
                        vertices[index++] = sourceY;
                        // alpha
                        vertices[index++] = alpha;
                        // xy
                        vertices[index++] = a * w + tx;
                        vertices[index++] = b * w + ty;
                        // uv
                        vertices[index++] = sourceWidth + sourceX;
                        vertices[index++] = sourceHeight + sourceY;
                        // alpha
                        vertices[index++] = alpha;
                        // xy
                        vertices[index++] = a * w + c * h + tx;
                        vertices[index++] = d * h + b * w + ty;
                        // uv
                        vertices[index++] = sourceX;
                        vertices[index++] = sourceHeight + sourceY;
                        // alpha
                        vertices[index++] = alpha;
                        // xy
                        vertices[index++] = c * h + tx;
                        vertices[index++] = d * h + ty;
                        // uv
                        vertices[index++] = sourceX;
                        vertices[index++] = sourceY;
                        // alpha
                        vertices[index++] = alpha;
                    }
                    else {
                        sourceWidth = sourceWidth / width;
                        sourceHeight = sourceHeight / height;
                        // xy
                        vertices[index++] = tx;
                        vertices[index++] = ty;
                        // uv
                        vertices[index++] = sourceX;
                        vertices[index++] = sourceY;
                        // alpha
                        vertices[index++] = alpha;
                        // xy
                        vertices[index++] = a * w + tx;
                        vertices[index++] = b * w + ty;
                        // uv
                        vertices[index++] = sourceWidth + sourceX;
                        vertices[index++] = sourceY;
                        // alpha
                        vertices[index++] = alpha;
                        // xy
                        vertices[index++] = a * w + c * h + tx;
                        vertices[index++] = d * h + b * w + ty;
                        // uv
                        vertices[index++] = sourceWidth + sourceX;
                        vertices[index++] = sourceHeight + sourceY;
                        // alpha
                        vertices[index++] = alpha;
                        // xy
                        vertices[index++] = c * h + tx;
                        vertices[index++] = d * h + ty;
                        // uv
                        vertices[index++] = sourceX;
                        vertices[index++] = sourceHeight + sourceY;
                        // alpha
                        vertices[index++] = alpha;
                    }
                    // 缓存索引数组
                    if (this.hasMesh) {
                        var indicesForMesh = this.indicesForMesh;
                        indicesForMesh[this.indexIndex + 0] = 0 + this.vertexIndex;
                        indicesForMesh[this.indexIndex + 1] = 1 + this.vertexIndex;
                        indicesForMesh[this.indexIndex + 2] = 2 + this.vertexIndex;
                        indicesForMesh[this.indexIndex + 3] = 0 + this.vertexIndex;
                        indicesForMesh[this.indexIndex + 4] = 2 + this.vertexIndex;
                        indicesForMesh[this.indexIndex + 5] = 3 + this.vertexIndex;
                    }
                    this.vertexIndex += 4;
                    this.indexIndex += 6;
                }
            };
            WebGLVertexArrayObject.prototype.clear = function () {
                this.hasMesh = false;
                this.vertexIndex = 0;
                this.indexIndex = 0;
            };
            return WebGLVertexArrayObject;
        }());
        web.WebGLVertexArrayObject = WebGLVertexArrayObject;
        __reflect(WebGLVertexArrayObject.prototype, "egret.web.WebGLVertexArrayObject");
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
/**
 * 将原player与Webplayer和为一体
 */
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var BKWebPlayer = (function (_super) {
            __extends(BKWebPlayer, _super);
            function BKWebPlayer(options) {
                var _this = _super.call(this) || this;
                _this._mainTicker = BK.Director.ticker;
                _this.init(options);
                return _this;
                // this.initOrientation();
            }
            BKWebPlayer.prototype.init = function (options) {
                var _this = this;
                var option = this.readOption(options);
                var stage = new egret.Stage();
                stage.$screen = this;
                stage.$scaleMode = option.scaleMode;
                stage.$orientation = option.orientation;
                stage.$maxTouches = option.maxTouches;
                stage.frameRate = option.frameRate;
                stage.textureScaleFactor = option.textureScaleFactor;
                var buffer = new egret.sys.RenderBuffer(undefined, undefined, true);
                egret.lifecycle.stage = stage;
                this.playerOption = option;
                this.stage = stage;
                egret.sys.$TempStage = this.stage;
                this._touches = new egret.sys.TouchHandler(this.stage);
                BK.Director.ticker.add(function (ts, duration) {
                    _this._touchHandler();
                });
                this._entryClassName = option.entryClassName;
                this.screenDisplayList = this.createDisplayList(stage, buffer);
                this.updateScreenSize();
                this.updateMaxTouches();
                // this.screenDisplayList.offsetX = this._viewRect.x;
                // this.screenDisplayList.offsetY = -this._viewRect.y;
                // //加入背景
                // let tex = new BK.Texture('GameRes://resource/pixel.png');
                // let background_node = new BK.Sprite(0, 0, tex, 0, 1, 1, 1)
                // let rgb_str = options.background.toString(16);
                // let red = parseInt(rgb_str.substring(0, 2), 16) / 255;
                // var green = parseInt(rgb_str.substring(2, 4), 16) / 255;
                // var blue = parseInt(rgb_str.substring(4, 6), 16) / 255;
                // background_node.vertexColor = { r: red, g: green, b: blue, a: 1 };
                // background_node.size = { width: this.stage.stageWidth, height: this.stage.stageHeight };
                // background_node.position = { x: 0, y: -this.stage.stageHeight }
                // BK.Director.root.addChild(background_node);
                // background_node.zOrder = 1;
                this.start();
            };
            /**
             * 触摸处理器
             */
            BKWebPlayer.prototype._touchHandler = function () {
                var touchEvents = BK.TouchEvent.getTouchEvent();
                if (!touchEvents || touchEvents.length === 0) {
                    return;
                }
                var screenH = BK.Director.screenPixelSize.height;
                var canvasScaleX = egret.sys.DisplayList.$canvasScaleX;
                var canvasScaleY = egret.sys.DisplayList.$canvasScaleY;
                for (var _i = 0, touchEvents_2 = touchEvents; _i < touchEvents_2.length; _i++) {
                    var touchEvent = touchEvents_2[_i];
                    var touchID = touchEvent.id;
                    var screenPixelSize = BK.Director.screenPixelSize;
                    var touchPosition = BK.Director.root.convertToNodeSpace(touchEvent);
                    var touchX = touchPosition.x / canvasScaleX;
                    var touchY = (screenH - touchPosition.y - BKWebPlayer._viewRect.y) / canvasScaleY;
                    if (touchEvent.status === 1) {
                        this._touches.onTouchEnd(touchX, touchY, touchID);
                    }
                    else if (touchEvent.status === 2) {
                        this._touches.onTouchBegin(touchX, touchY, touchID);
                    }
                    else if (touchEvent.status === 3) {
                        this._touches.onTouchMove(touchX, touchY, touchID);
                    }
                }
                BK.TouchEvent.updateTouchStatus();
            };
            /**
             * 读取初始化参数
             */
            BKWebPlayer.prototype.readOption = function (options) {
                var option = {};
                option.entryClassName = options.entryClassName;
                option.scaleMode = options.scaleMode || egret.StageScaleMode.NO_SCALE;
                option.frameRate = +options.frameRate || 30;
                option.contentWidth = +options.contentWidth || 480;
                option.contentHeight = +options.contentHeight || 800;
                option.orientation = options.orientation || egret.OrientationMode.AUTO;
                option.maxTouches = 10;
                option.textureScaleFactor = 1;
                return option;
            };
            /**
             * @private
             */
            BKWebPlayer.prototype.createDisplayList = function (stage, buffer) {
                var displayList = new egret.sys.BKDisplayList(stage);
                displayList.renderBuffer = buffer;
                stage.$displayList = displayList;
                //displayList.setClipRect(stage.$stageWidth, stage.$stageHeight);
                return displayList;
            };
            /**
             * @private
             * 更新播放器视口尺寸
             */
            BKWebPlayer.prototype.updateScreenSize = function () {
                var screenPixelSize = BK.Director.screenPixelSize;
                var screenWidth = screenPixelSize.width;
                var screenHeight = screenPixelSize.height;
                egret.Capabilities.$boundingClientWidth = screenWidth;
                egret.Capabilities.$boundingClientHeight = screenHeight;
                var stageSize = egret.sys.screenAdapter.calculateStageSize(this.stage.$scaleMode, screenWidth, screenHeight, this.playerOption.contentWidth, this.playerOption.contentHeight);
                var stageWidth = stageSize.stageWidth;
                var stageHeight = stageSize.stageHeight;
                var displayWidth = stageSize.displayWidth;
                var displayHeight = stageSize.displayHeight;
                var top = (screenHeight - displayHeight) / 2;
                var left = (screenWidth - displayWidth) / 2;
                this.stage.$stageWidth = stageWidth;
                this.stage.$stageHeight = stageHeight;
                var scalex = displayWidth / stageWidth, scaley = displayHeight / stageHeight;
                BKWebPlayer._viewRect.setTo(left, top, stageWidth, stageHeight);
                var canvasScaleX = scalex * egret.sys.DisplayList.$canvasScaleFactor;
                var canvasScaleY = scaley * egret.sys.DisplayList.$canvasScaleFactor;
                egret.sys.DisplayList.$setCanvasScale(canvasScaleX, canvasScaleY);
                this.updateStageSize(stageWidth, stageHeight);
            };
            BKWebPlayer.prototype.updateStageSize = function (stageWidth, stageHeight) {
                var stage = this.stage;
                stage.$stageWidth = stageWidth;
                stage.$stageHeight = stageHeight;
                this.screenDisplayList.setClipRect(stageWidth, stageHeight);
                stage.dispatchEventWith(egret.Event.RESIZE);
            };
            BKWebPlayer.prototype.setContentSize = function (width, height) {
                var option = this.playerOption;
                option.contentWidth = width;
                option.contentHeight = height;
                this.updateScreenSize();
            };
            /**
             * @private
             * 更新触摸数量
             */
            BKWebPlayer.prototype.updateMaxTouches = function () {
                this._touches.$initMaxTouches();
            };
            BKWebPlayer.prototype.start = function () {
                //获取主类，加入场景
                var entryClassName = this._entryClassName;
                var rootClass;
                if (entryClassName) {
                    rootClass = egret.getDefinitionByName(entryClassName);
                }
                if (rootClass) {
                    var rootContainer = new rootClass();
                    if (rootContainer instanceof egret.DisplayObject) {
                        this.stage.addChild(rootContainer);
                    }
                    else {
                        true && egret.$error(1002, entryClassName);
                    }
                }
                else {
                    rootClass = global.Main;
                    if (rootClass) {
                        var rootContainer = new rootClass();
                        if (rootContainer.addChild) {
                            this.stage.addChild(rootContainer);
                        }
                        else {
                            true && egret.$error(1002, entryClassName);
                        }
                    }
                    else {
                        true && egret.$error(1001, entryClassName);
                    }
                }
                egret.ticker.$addPlayer(this);
            };
            /**
             * @private
             * 渲染屏幕
             */
            BKWebPlayer.prototype.$render = function (triggerByFrame, costTicker) {
                var stage = this.stage;
                var drawCalls = stage.$displayList.drawToSurface();
            };
            // public _viewRect: Rectangle = new egret.Rectangle();
            BKWebPlayer._viewRect = new egret.Rectangle();
            return BKWebPlayer;
        }(egret.HashObject));
        web.BKWebPlayer = BKWebPlayer;
        __reflect(BKWebPlayer.prototype, "egret.web.BKWebPlayer", ["egret.sys.Screen"]);
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var EgretShaderLib = (function () {
            function EgretShaderLib() {
            }
            EgretShaderLib.blur_frag = "precision mediump float;\nuniform vec2 blur;\nuniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\nuniform vec2 uTextureSize;\nvoid main()\n{\n    const int sampleRadius = 5;\n    const int samples = sampleRadius * 2 + 1;\n    vec2 blurUv = blur / uTextureSize;\n    vec4 color = vec4(0, 0, 0, 0);\n    vec2 uv = vec2(0.0, 0.0);\n    blurUv /= float(sampleRadius);\n    for (int i = -sampleRadius; i <= sampleRadius; i++) {\n        uv.x = vTextureCoord.x + float(i) * blurUv.x;\n        uv.y = vTextureCoord.y + float(i) * blurUv.y;\n        color += texture2D(uSampler, uv);\n    }\n    color /= float(samples);\n    gl_FragColor = color;\n}";
            EgretShaderLib.colorTransform_frag = "precision mediump float;\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nuniform mat4 matrix;\nuniform vec4 colorAdd;\nuniform sampler2D uSampler;\nvoid main(void) {\n    vec4 texColor = texture2D(uSampler, vTextureCoord);\n    if(texColor.a > 0.) {\n        texColor = vec4(texColor.rgb / texColor.a, texColor.a);\n    }\n    vec4 locColor = clamp(texColor * matrix + colorAdd, 0., 1.);\n    gl_FragColor = vColor * vec4(locColor.rgb * locColor.a, locColor.a);\n}";
            EgretShaderLib.default_vert = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec2 aColor;\nuniform vec2 projectionVector;\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nconst vec2 center = vec2(-1.0, 1.0);\nvoid main(void) {\n   gl_Position = vec4( (aVertexPosition / projectionVector) + center , 0.0, 1.0);\n   vTextureCoord = aTextureCoord;\n   vColor = vec4(aColor.x, aColor.x, aColor.x, aColor.x);\n}";
            EgretShaderLib.glow_frag = "precision highp float;\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float dist;\nuniform float angle;\nuniform vec4 color;\nuniform float alpha;\nuniform float blurX;\nuniform float blurY;\nuniform float strength;\nuniform float inner;\nuniform float knockout;\nuniform float hideObject;\nuniform vec2 uTextureSize;\nfloat random()\n{\n    return fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\nvoid main(void) {\n    vec2 px = vec2(1.0 / uTextureSize.x, 1.0 / uTextureSize.y);\n    const float linearSamplingTimes = 7.0;\n    const float circleSamplingTimes = 12.0;\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float totalAlpha = 0.0;\n    float maxTotalAlpha = 0.0;\n    float curDistanceX = 0.0;\n    float curDistanceY = 0.0;\n    float offsetX = dist * cos(angle) * px.x;\n    float offsetY = dist * sin(angle) * px.y;\n    const float PI = 3.14159265358979323846264;\n    float cosAngle;\n    float sinAngle;\n    float offset = PI * 2.0 / circleSamplingTimes * random();\n    float stepX = blurX * px.x / linearSamplingTimes;\n    float stepY = blurY * px.y / linearSamplingTimes;\n    for (float a = 0.0; a <= PI * 2.0; a += PI * 2.0 / circleSamplingTimes) {\n        cosAngle = cos(a + offset);\n        sinAngle = sin(a + offset);\n        for (float i = 1.0; i <= linearSamplingTimes; i++) {\n            curDistanceX = i * stepX * cosAngle;\n            curDistanceY = i * stepY * sinAngle;\n            \n            curColor = texture2D(uSampler, vec2(vTextureCoord.x + curDistanceX - offsetX, vTextureCoord.y + curDistanceY + offsetY));\n            totalAlpha += (linearSamplingTimes - i) * curColor.a;\n            maxTotalAlpha += (linearSamplingTimes - i);\n        }\n    }\n    ownColor.a = max(ownColor.a, 0.0001);\n    ownColor.rgb = ownColor.rgb / ownColor.a;\n    float outerGlowAlpha = (totalAlpha / maxTotalAlpha) * strength * alpha * (1. - inner) * max(min(hideObject, knockout), 1. - ownColor.a);\n    float innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * strength * alpha * inner * ownColor.a;\n    ownColor.a = max(ownColor.a * knockout * (1. - hideObject), 0.0001);\n    vec3 mix1 = mix(ownColor.rgb, color.rgb, innerGlowAlpha / (innerGlowAlpha + ownColor.a));\n    vec3 mix2 = mix(mix1, color.rgb, outerGlowAlpha / (innerGlowAlpha + ownColor.a + outerGlowAlpha));\n    float resultAlpha = min(ownColor.a + outerGlowAlpha + innerGlowAlpha, 1.);\n    gl_FragColor = vec4(mix2 * resultAlpha, resultAlpha);\n}";
            EgretShaderLib.primitive_frag = "precision lowp float;\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvoid main(void) {\n    gl_FragColor = vColor;\n}";
            EgretShaderLib.texture_frag = "precision lowp float;\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nuniform sampler2D uSampler;\nvoid main(void) {\n    gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor;\n}";
            return EgretShaderLib;
        }());
        web.EgretShaderLib = EgretShaderLib;
        __reflect(EgretShaderLib.prototype, "egret.web.EgretShaderLib");
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
;
