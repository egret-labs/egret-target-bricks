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
            _this._bkNode = bkNode || new BK.Node();
            return _this;
        }
        BKDisplayObject.prototype._replaceNode = function (node) {
            this._transformDirty = true;
            node.vertexColor = this._color;
            node.hidden = !this.visible;
            if (this._bkNode.parent) {
                this._bkNode.parent.addChild(node, this.parent.getChildIndex(this));
                this._bkNode.parent.removeChild(this._bkNode);
            }
            node.zOrder = this._bkNode.zOrder;
            this._bkNode = node;
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
                    this._bkNode.vertexColor = this._color;
                }
                else if (this._colorDirty === 1) {
                    this._colorDirty = 0;
                }
            }
            else {
                if (this._colorDirty === 2) {
                    this._colorDirty = 1;
                    this._color.a = this.$alpha;
                    this._bkNode.vertexColor = this._color;
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
        BKDisplayObject.prototype.$setMatrix = function (matrix, needUpdateProperties) {
            if (needUpdateProperties === void 0) { needUpdateProperties = true; }
            _super.prototype.$setMatrix.call(this, matrix, needUpdateProperties);
            this._transformDirty = true;
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
            // MD
            this._updateColor();
            if (this._transformDirty || this.$matrixDirty) {
                this._transformDirty = false;
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
            }
            return this._bkNode;
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
        return BKDisplayObject;
    }(egret.DisplayObject));
    egret.BKDisplayObject = BKDisplayObject;
    __reflect(BKDisplayObject.prototype, "egret.BKDisplayObject");
    egret.DisplayObject = BKDisplayObject;
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
            var _this = _super.call(this, new BK.ClipRectNode(0, -2048, 2048, 2048)) || this;
            _this.$touchChildren = true;
            _this._bkClipRectNode = _this._bkNode;
            _this._bkClipRectNode.enableClip = false;
            _this.$children = [];
            return _this;
        }
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
            this._bkNode.addChild(child._bkNode, index);
            for (var i = 0, l = this.$children.length; i < l; i++) {
                this.$children[i]._bkNode.zOrder = -i;
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
            this._bkNode.removeChild(child._bkNode);
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
            this._bkNode.removeChild(child._bkNode);
            this._bkNode.addChild(child._bkNode, index);
            for (var i = 0, l = this.$children.length; i < l; i++) {
                this.$children[i]._bkNode.zOrder = -i;
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
            child2._bkNode.zOrder = -index1;
            child1._bkNode.zOrder = -index2;
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
        // MD
        BKDisplayObjectContainer.prototype.$getRenderNode = function () {
            this._updateColor();
            if (this._transformDirty || this.$matrixDirty) {
                this._transformDirty = false;
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
            }
            return this._bkNode;
        };
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
    egret.DisplayObjectContainer = BKDisplayObjectContainer;
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
    egret.Shape = BKShape;
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
var egret;
(function (egret) {
    var BKBitmapData = (function (_super) {
        __extends(BKBitmapData, _super);
        function BKBitmapData(source) {
            var _this = _super.call(this) || this;
            _this.width = 0;
            _this.height = 0;
            _this.source = ""; // url 或 render node
            _this.bkTexture = null;
            _this.source = source;
            if (typeof _this.source === "string") {
                _this.bkTexture = new BK.Texture(_this.source);
                _this.width = _this.bkTexture.size.width;
                _this.height = _this.bkTexture.size.height;
            }
            else {
                // TODO
            }
            return _this;
        }
        BKBitmapData.$invalidate = function () {
        };
        return BKBitmapData;
    }(egret.HashObject));
    egret.BKBitmapData = BKBitmapData;
    __reflect(BKBitmapData.prototype, "egret.BKBitmapData");
    egret.BitmapData = BKBitmapData;
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
                    if (!data.isBinary) {
                        result = data.data.readAsString();
                    }
                    else {
                        var bkbuffer = data.data;
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
                var arrayBuffer = egret.arrayBufferToBrickBuffer(message);
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
var egret;
(function (egret) {
    var BKSprite9 = (function () {
        function BKSprite9() {
            this._contentWidth = 0;
            this._contentHeight = 0;
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
        BKSprite9.prototype._updateGrid = function () {
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
        BKSprite9.prototype.adjustTexturePosition = function (offsetX, offsetY, contentWidth, contentHeight, rotated) {
            this._contentWidth = contentWidth;
            this._contentHeight = contentHeight;
            this._updateGrid();
            var ltW = this._grid.x;
            var ltH = this._grid.y;
            var rbW = this._grid.width;
            var rbH = this._grid.height;
            var centerWidth = contentWidth - ltW - rbW;
            var centerHeight = contentHeight - ltH - rbH;
            if (rotated === true) {
                // TODO
            }
            else {
                var x1 = offsetX;
                var x2 = offsetX + ltW;
                var x3 = offsetX + (contentWidth - rbW);
                var y1 = offsetY;
                var y2 = offsetY + rbH;
                var y3 = offsetY + (contentHeight - ltH);
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
                var contentWidth = this._size.width = value.width;
                var contentHeight = this._size.height = value.height;
                var ltW = this._grid.x;
                var ltH = this._grid.y;
                var rbW = this._grid.width;
                var rbH = this._grid.height;
                if (contentWidth < ltW + rbW) {
                    var dW = (ltW + rbW - contentWidth) * 0.5;
                    ltW -= dW;
                    rbW -= dW;
                }
                if (contentHeight < ltH + rbH) {
                    var dH = (ltH + rbH - contentHeight) * 0.5;
                    ltH -= dH;
                    rbH -= dH;
                }
                var centerWidth = contentWidth - ltW - rbW;
                var centerHeight = contentHeight - ltH - rbH;
                this._leftTop.position = { x: 0.0, y: rbH + centerHeight };
                this._centerTop.position = { x: ltW, y: rbH + centerHeight };
                this._rightTop.position = { x: ltW + centerWidth, y: rbH + centerHeight };
                this._leftCenter.position = { x: 0.0, y: rbH };
                this._centerCenter.position = { x: ltW, y: rbH };
                this._rightCenter.position = { x: ltW + centerWidth, y: rbH };
                this._leftBottom.position = { x: 0.0, y: 0.0 };
                this._centerBottom.position = { x: ltW, y: 0.0 };
                this._rightBottom.position = { x: ltW + centerWidth, y: 0.0 };
                this._leftTop.size = { width: ltW + 1, height: ltH + 1 };
                this._centerTop.size = { width: centerWidth + 1, height: ltH + 1 };
                this._rightTop.size = { width: rbW, height: ltH + 1 };
                this._leftCenter.size = { width: ltW + 1, height: centerHeight + 1 };
                this._centerCenter.size = { width: centerWidth + 1, height: centerHeight + 1 };
                this._rightCenter.size = { width: rbW, height: centerHeight + 1 };
                this._leftBottom.size = { width: ltW + 1, height: rbH };
                this._centerBottom.size = { width: centerWidth + 1, height: rbH };
                this._rightBottom.size = { width: rbW, height: rbH };
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
    var BKBitmap = (function (_super) {
        __extends(BKBitmap, _super);
        function BKBitmap(value) {
            if (value === void 0) { value = null; }
            var _this = _super.call(this, new BK.Sprite(0, 0, {}, 0, 1, 1, 1)) || this;
            _this.$explicitBitmapWidth = NaN;
            _this.$explicitBitmapHeight = NaN;
            _this._size = { width: 0, height: 0 };
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
            this._transformDirty = true;
            if (this.$texture) {
                this.$bitmapData = this.$texture.bitmapData;
                if (this.$bitmapData.bkTexture) {
                    this._bkSprite.setTexture(this.$bitmapData.bkTexture);
                    this._bkSprite.adjustTexturePosition(this.$texture.$bitmapX, this.$texture.$sourceHeight - (this.$texture.$bitmapY + this.$texture.$bitmapHeight), this.$texture.$bitmapWidth, this.$texture.$bitmapHeight, this.$texture.$rotated);
                    this._size.width = this.$getWidth(); //this.$texture.$bitmapWidth;
                    this._size.height = this.$getHeight(); //this.$texture.$bitmapHeight;
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
                this.$setTexture(this.$texture);
            }
            this._bkSprite.size = this._size;
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
            this._bkSprite.size = this._size;
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
            this._bkSprite.size = this._size;
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
        /**
         * @override
         */
        BKBitmap.prototype.$getRenderNode = function () {
            // MD
            this._updateColor();
            if (this._transformDirty || this.$matrixDirty) {
                this._transformDirty = false;
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
            }
            return this._bkNode || null;
        };
        return BKBitmap;
    }(egret.BKDisplayObject));
    egret.BKBitmap = BKBitmap;
    __reflect(BKBitmap.prototype, "egret.BKBitmap");
    egret.Bitmap = BKBitmap;
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
            _this._verticesDirty = true;
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
            this._verticesDirty = true;
            this._boundsDirty = true;
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
        BKMesh.prototype.$getRenderNode = function () {
            // if (!this.$texture) {
            //     return;
            // }
            if (this._verticesDirty) {
                this._verticesDirty = false;
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
            }
            if (this._transformDirty || this.$matrixDirty) {
                this._transformDirty = false;
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
            }
            return this._bkNode;
        };
        return BKMesh;
    }(egret.BKDisplayObject));
    egret.BKMesh = BKMesh;
    __reflect(BKMesh.prototype, "egret.BKMesh");
    egret.Mesh = BKMesh;
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
            if (BK.FileUtil.isFileExist(url)) {
                this.data = new egret.BitmapData(url);
                egret.$callAsync(egret.Event.dispatchEvent, egret.Event, this, egret.Event.COMPLETE);
            }
            else {
                egret.$callAsync(egret.Event.dispatchEvent, egret.IOErrorEvent, this, egret.IOErrorEvent.IO_ERROR);
            }
        };
        BKImageLoader.crossOrigin = null;
        return BKImageLoader;
    }(egret.EventDispatcher));
    egret.BKImageLoader = BKImageLoader;
    __reflect(BKImageLoader.prototype, "egret.BKImageLoader", ["egret.ImageLoader"]);
    egret.ImageLoader = BKImageLoader;
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
    egret.Sprite = BKSprite;
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
            var _this = 
            // MD
            _super.call(this, new BK.TextNode({}, "")) || this;
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
            _this._style = {
                fontSize: egret.TextField.default_size,
                textColor: egret.TextField.default_textColor + 0xFF000000,
                maxWidth: 512,
                maxHeight: 64,
                width: 512,
                height: 64,
                textAlign: 0,
                bold: 0,
                italic: 0,
                strokeColor: 0x00000000,
                strokeSize: 0,
                shadowRadius: 0,
                shadowDx: 0,
                shadowDy: 0,
                shadowColor: 0x00000000
            };
            _this._bkText = _this._bkNode;
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
            _this.$TextField[1 /* lineSpacing */] = 10; // MD
            return _this;
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
            this._style.fontSize = value;
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
            this._style.bold = value ? 1 : 0;
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
            this._style.italic = value ? 1 : 0;
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
            // MD
            this._transformDirty = true;
            switch (value) {
                case egret.HorizontalAlign.LEFT:
                    this._style.textAlign = 0;
                    break;
                case egret.HorizontalAlign.CENTER:
                    this._style.textAlign = 1;
                    break;
                case egret.HorizontalAlign.RIGHT:
                    this._style.textAlign = 2;
                    break;
            }
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
            // MD
            this._transformDirty = true;
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
                // this.$setLineSpacing(value); TODO
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
            // MD
            var rgb_str = this._refitString(value, 6); //六位rgb格式
            var old_argb_str = this._refitString(this._style.textColor, 8);
            var new_argb_str = old_argb_str.substring(0, 2) + rgb_str;
            var argb_num = parseInt(new_argb_str, 16);
            this._style.textColor = argb_num;
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
                // MD
                var rgb_str = this._refitString(value, 6); //六位rgb格式
                var old_argb_str = this._refitString(this._style.strokeColor, 8);
                var new_argb_str = old_argb_str.substring(0, 2) + rgb_str;
                var argb_num = parseInt(new_argb_str, 16);
                this._style.strokeColor = argb_num;
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
                this._style.strokeSize = value;
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
            this._style.width = this._style.maxWidth = values[3 /* textFieldWidth */];
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
            this._style.height = this._style.maxHeight = values[4 /* textFieldHeight */];
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
                    var length_1 = lines.length;
                    for (var i = 0; i < length_1; i += 4) {
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
            // MD
            // let p = self.$parent;
            // if (p && !p.$cacheDirty) {
            //     p.$cacheDirty = true;
            //     p.$cacheDirtyUp();
            // }
            // let maskedObject = self.$maskedObject;
            // if (maskedObject && !maskedObject.$cacheDirty) {
            //     maskedObject.$cacheDirty = true;
            //     maskedObject.$cacheDirtyUp();
            // }
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
            // MD
            // let h: number = !isNaN(this.$TextField[sys.TextKeys.textFieldHeight]) ? this.$TextField[sys.TextKeys.textFieldHeight] : this.$TextField[sys.TextKeys.textHeight];
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
                var graphics = this.graphicsNode;
                if (graphics) {
                    graphics.clear();
                }
                return;
            }
            var underLines = this.drawText();
            this.fillBackground(underLines);
            //tudo 宽高很小的情况下webgl模式绘制异常
            var bounds = this.$getRenderBounds();
            var node = this.textNode;
            node.x = bounds.x;
            node.y = bounds.y;
            node.width = Math.ceil(bounds.width);
            node.height = Math.ceil(bounds.height);
            egret.Rectangle.release(bounds);
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
                // // MD
                // return this.$TextField[sys.TextKeys.textHeight];
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
            // MD
            // values[sys.TextKeys.numLines] = 1;
            // if (values[sys.TextKeys.text]) {
            //     const textFieldWidth = values[sys.TextKeys.textFieldWidth];
            //     if (!isNaN(textFieldWidth) && textFieldWidth == 0) {
            //         values[sys.TextKeys.numLines] = 0;
            //         return [{ width: 0, height: 0, charNum: 0, elements: [], hasNextLine: false }];
            //     }
            //     values[sys.TextKeys.textWidth] = bkMeasureText(this.$getText(), this.fontFamily, this.size, this.bold, this.italic); // 
            //     values[sys.TextKeys.textHeight] = (defaultText as any).height;
            // }
            // else {
            //     values[sys.TextKeys.textWidth] = 0;
            //     values[sys.TextKeys.textHeight] = 0;
            // }
            // return this.linesArr;
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
            var drawX = 0;
            var underLineData = [];
            for (var i = startLine, numLinesLength = values[29 /* numLines */]; i < numLinesLength; i++) {
                var line = lines[i];
                var h = line.height;
                drawY += h / 2;
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
                    // node.drawText(drawX, drawY + (h - size) / 2, element.text, element.style); // MD
                    if (element.style.underline) {
                        underLineData.push(drawX, drawY + (h) / 2, element.width, element.style.textColor);
                    }
                    drawX += element.width;
                }
                drawY += h / 2 + values[1 /* lineSpacing */];
            }
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
            // MD
            // if (this.$TextField[sys.TextKeys.type] == egret.TextFieldType.INPUT) {
            //     return;
            // }
            // let ele: ITextElement = TextFieldUtils.$getTextElement(this, e.localX, e.localY);
            // if (ele == null) {
            //     return;
            // }
            // let style: egret.ITextStyle = ele.style;
            // if (style && style.href) {
            //     if (style.href.match(/^event:/)) {
            //         let type: string = style.href.match(/^event:/)[0];
            //         egret.TextEvent.dispatchTextEvent(this, egret.TextEvent.LINK, style.href.substring(type.length));
            //     }
            //     else {
            //         open(style.href, style.target || "_blank");
            //     }
            // }
        };
        /**
         * 为16进制数字补0，输出字符串
         */
        BKTextField.prototype._refitString = function (num, length) {
            var str = num.toString(16);
            var zero = "00000000";
            return zero.substr(0, length - str.length) + str;
        };
        // MD
        BKTextField.prototype.$getRenderNode = function () {
            if (this.$renderDirty) {
                this.$renderDirty = false;
                if (this.$TextField[24 /* type */] == egret.TextFieldType.INPUT) {
                    this.inputUtils._updateProperties();
                    if (this.$isTyping) {
                        this.fillBackground();
                        return;
                    }
                }
                else if (this.$TextField[3 /* textFieldWidth */] == 0) {
                    var graphics = this.graphicsNode;
                    if (graphics) {
                        graphics.clear();
                    }
                    return;
                }
                var underLines = this.drawText();
                this.fillBackground(underLines);
                //tudo 宽高很小的情况下webgl模式绘制异常
                var bounds = this.$getRenderBounds();
                this._style.width = this._style.maxWidth = Math.ceil(bounds.width);
                this._style.height = this._style.maxHeight = Math.ceil(bounds.height);
                egret.Rectangle.release(bounds);
                this._bkText.updateText(this._style, this.$TextField[13 /* text */]);
            }
            //
            if (this._transformDirty || this.$matrixDirty) {
                this._transformDirty = false;
                var matrix = this.$getMatrix();
                var bkMatrix = this._bkNode.transform.matrix;
                var textSize = this._bkText.size;
                var tx = matrix.tx;
                var ty = matrix.ty;
                var pivotX = this.$anchorOffsetX;
                var pivotY = this.$anchorOffsetY - textSize.height;
                if (pivotX !== 0.0 || pivotY !== 0.0) {
                    tx -= matrix.a * pivotX + matrix.c * pivotY;
                    ty -= matrix.b * pivotX + matrix.d * pivotY;
                }
                switch (this.$TextField[9 /* textAlign */]) {
                    case egret.HorizontalAlign.LEFT:
                        break;
                    case egret.HorizontalAlign.CENTER:
                        tx -= (textSize.width - this.$getWidth()) * 0.5;
                        break;
                    case egret.HorizontalAlign.RIGHT:
                        tx -= textSize.width - this.$getWidth();
                        break;
                }
                switch (this.$TextField[10 /* verticalAlign */]) {
                    case egret.VerticalAlign.TOP:
                        break;
                    case egret.VerticalAlign.MIDDLE:
                        ty += (textSize.height - this._bkText.height) * 0.5;
                        break;
                    case egret.VerticalAlign.BOTTOM:
                        ty += textSize.height - this._bkText.height;
                        break;
                }
                bkMatrix.set(matrix.a, -matrix.b, -matrix.c, matrix.d, tx, -ty);
            }
            return this._bkNode;
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
        strokeColor: 0x00000000,
        strokeSize: 0,
        shadowRadius: 0,
        shadowDx: 0,
        shadowDy: 0,
        shadowColor: 0x00000000
    };
    var defaultText; // BK.TextNode
    function bkMeasureText(text, fontFamily, size, bold, italic) {
        if (!defaultText) {
            defaultText = new BK.TextNode(defaultStyle, "");
        }
        defaultStyle.fontSize = size;
        defaultStyle.bold = bold ? 1 : 0;
        defaultStyle.italic = italic ? 1 : 0;
        defaultText.updateText(defaultStyle, text);
        return defaultText.width;
    }
    egret.sys.measureText = bkMeasureText;
    egret.TextField = BKTextField;
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
            var musicPath = "GameRes://" + this.$url;
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
var egret;
(function (egret) {
    var BKGraphics = (function () {
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
             * 当前移动到的坐标X
             */
            this.lastX = 0;
            /**
             * 当前移动到的坐标Y
             */
            this.lastY = 0;
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
            this.offsetX = this.stageW;
            this.offsetY = this.stageH;
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
            }
        };
        BKGraphics.prototype.addSprite = function (texture, x, y, width, height, isCenter) {
            if (isCenter === void 0) { isCenter = false; }
            var rect = new BK.Sprite(width, height, texture, 0, 1, 1, 1);
            rect.position = { x: x, y: y };
            rect.vertexColor = this.fillColor;
            if (isCenter) {
                rect.anchor = { x: 0.5, y: 0.5 };
            }
            else {
                rect.anchor = { x: 0, y: 1 };
            }
            this.targetDisplay['_bkNode'].addChild(rect);
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
                this.targetDisplay['_bkNode'].addChild(rect);
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
            // let _x = x + this.offsetX || 0;
            // let _y = - y + this.offsetY || 0;
            // this._BKCanvas.moveTo(_x, _y);
            // // let fillPath = this.fillPath;
            // // let strokePath = this.strokePath;
            // // fillPath && fillPath.moveTo(x, y);
            // // strokePath && strokePath.moveTo(x, y);
            // // this.includeLastPosition = false;
            // // this.lastX = x;
            // // this.lastY = y;
            // // this.$renderNode.dirtyRender = true;
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
            // let _x = x + this.offsetX || 0;
            // let _y = - y + this.offsetY || 0;
            // this._BKCanvas.lineTo(_x, _y);
            // // let fillPath = this.fillPath;
            // // let strokePath = this.strokePath;
            // // fillPath && fillPath.lineTo(x, y);
            // // strokePath && strokePath.lineTo(x, y);
            // this.updatePosition(x, y);
            // // this.$renderNode.dirtyRender = true;
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
            // // this.$renderNode.clear();
            // this.updatePosition(0, 0);
            // this.minX = Infinity;
            // this.minY = Infinity;
            // this.maxX = -Infinity;
            // this.maxY = -Infinity;
            // this._BKCanvas.clearRect(0, 0, 2 * this.stageW, 2 * this.stageH);
            // this.isFillPath = false;
            // this.isStrokePath = false;
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
    egret.Graphics = BKGraphics;
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
    egret.Stage = BKStage;
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
            /**
             * @internal
             */
            _this._displayList = [];
            BKPlayer.instance = _this;
            _this._options = options;
            BK.Director.root.addChild(_this.stage._bkNode);
            egret.lifecycle.stage = _this.stage;
            // lifecycle.addLifecycleListener(WebLifeCycleHandler); ?
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
            //
            var entryClassName = _this._options.entryClassName;
            var rootClass;
            if (entryClassName) {
                rootClass = egret.getDefinitionByName(entryClassName);
            }
            if (rootClass) {
                var rootContainer = new rootClass();
                if (rootContainer instanceof egret.DisplayObject) {
                    _this.stage.addChild(rootContainer);
                }
                else {
                    true && egret.$error(1002, entryClassName);
                }
            }
            else {
                true && egret.$error(1001, entryClassName);
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
            egret.Capabilities.$boundingClientWidth = screenWidth;
            egret.Capabilities.$boundingClientHeight = screenHeight;
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
    BK.Script.log(0, 0, str);
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
    /**
     * @private
     * 网页加载完成，实例化页面中定义的Egret标签
     */
    function runEgret(options) {
        if (isRunning) {
            return;
        }
        isRunning = true;
        modifyBricks();
        modifyEgret();
        if (!options) {
            options = {};
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
    function modifyBricks() {
    }
    function modifyEgret() {
        if (typeof eui !== "undefined") {
            ;
            Object.defineProperty(eui.Image.prototype, "scale9Grid", {
                set: function (value) {
                    this.$setScale9Grid(value);
                    this.invalidateDisplayList();
                },
                enumerable: true,
                configurable: true
            });
            eui.Image.prototype.$getRenderNode = function () {
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
                this._updateColor();
                if (this._transformDirty || this.$matrixDirty) {
                    this._transformDirty = false;
                    //
                    this._size.width = this.$getWidth();
                    this._size.height = this.$getHeight();
                    this._bkSprite.size = this._size;
                    //
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
                }
                return this._bkNode;
            };
        }
        debugger;
        if (typeof egret.WebSocket !== undefined) {
            egret.ISocket = egret.BKSocket;
        }
    }
    egret.runEgret = runEgret;
})(egret || (egret = {}));
if (true) {
}
var egret;
(function (egret) {
    egret.emptyTexture = new BK.Texture('GameRes://resource/empty.png');
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
    function arrayBufferToBrickBuffer(arrayBuffer) {
        var bricksBuffer = new BK.Buffer(arrayBuffer.byteLength);
        var uint8Array = new Uint8Array(arrayBuffer);
        var pointer = 0;
        while (pointer < arrayBuffer.byteLength) {
            bricksBuffer.writeUint8Buffer(uint8Array[pointer++]);
        }
        return bricksBuffer;
    }
    egret.arrayBufferToBrickBuffer = arrayBufferToBrickBuffer;
})(egret || (egret = {}));
