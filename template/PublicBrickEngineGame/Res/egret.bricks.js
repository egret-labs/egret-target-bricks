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
            _this._position = { x: 0.0, y: 0.0, z: 0.0 };
            _this._scale = { x: 1.0, y: 1.0, z: 0.0 };
            _this._rotation = { x: 0.0, y: 0.0, z: 0.0 };
            _this._color = { r: 1.0, g: 1.0, b: 1.0, a: 1.0 };
            _this._bkNode = bkNode || new BK.Node();
            return _this;
        }
        /**
         * @private
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
        BKDisplayObject.prototype.$setX = function (value) {
            var self = this;
            if (self.$x == value) {
                return false;
            }
            self.$x = value;
            //
            self._position.x = value;
            self._bkNode.position = self._position;
            return true;
        };
        BKDisplayObject.prototype.$setY = function (value) {
            var self = this;
            if (self.$y == value) {
                return false;
            }
            self.$y = value;
            //
            self._position.y = -value;
            self._bkNode.position = self._position;
            return true;
        };
        BKDisplayObject.prototype.$setScaleX = function (value) {
            _super.prototype.$setScaleX.call(this, value);
            //
            this._scale.x = value;
            this._bkNode.scale = this._scale;
        };
        BKDisplayObject.prototype.$setScaleY = function (value) {
            _super.prototype.$setScaleY.call(this, value);
            //
            this._scale.y = value;
            this._bkNode.scale = this._scale;
        };
        BKDisplayObject.prototype.$setRotation = function (value) {
            _super.prototype.$setRotation.call(this, value);
            //
            this._rotation.z = value;
            this._bkNode.rotation = this._rotation;
        };
        BKDisplayObject.prototype.$setVisible = function (value) {
            _super.prototype.$setVisible.call(this, value);
            //
            this._bkNode.hidden = !value;
        };
        BKDisplayObject.prototype.$setAlpha = function (value) {
            _super.prototype.$setAlpha.call(this, value);
            //
            this._color.a = value;
            this._bkNode.vertexColor = this._color;
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
            var _this = _super.call(this) || this;
            _this.$touchChildren = true;
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
var egret;
(function (egret) {
    var BKTexture = (function (_super) {
        __extends(BKTexture, _super);
        function BKTexture() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * @internal
             * @private
             */
            _this._bkTexture = null;
            /**
             * Whether to destroy the corresponding BitmapData when the texture is destroyed
             * @version Egret 5.0.8
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 销毁纹理时是否销毁对应BitmapData
             * @version Egret 5.0.8
             * @platform Web,Native
             * @language zh_CN
             */
            _this.disposeBitmapData = true;
            /**
             * @private
             * 表示这个纹理在 bitmapData 上的 x 起始位置
             */
            _this.$bitmapX = 0;
            /**
             * @private
             * 表示这个纹理在 bitmapData 上的 y 起始位置
             */
            _this.$bitmapY = 0;
            /**
             * @private
             * 表示这个纹理在 bitmapData 上的宽度
             */
            _this.$bitmapWidth = 0;
            /**
             * @private
             * 表示这个纹理在 bitmapData 上的高度
             */
            _this.$bitmapHeight = 0;
            /**
             * @private
             * 表示这个纹理显示了之后在 x 方向的渲染偏移量
             */
            _this.$offsetX = 0;
            /**
             * @private
             * 表示这个纹理显示了之后在 y 方向的渲染偏移量
             */
            _this.$offsetY = 0;
            /**
             * @private
             * 纹理宽度
             */
            _this.$textureWidth = 0;
            /**
             * @private
             * 纹理高度
             */
            _this.$textureHeight = 0;
            /**
             * @private
             * 表示bitmapData.width
             */
            _this.$sourceWidth = 0;
            /**
             * @private
             * 表示bitmapData.height
             */
            _this.$sourceHeight = 0;
            /**
             * @private
             */
            _this.$bitmapData = null;
            /**
             * @private
             */
            _this.$rotated = false;
            return _this;
        }
        Object.defineProperty(BKTexture.prototype, "textureWidth", {
            /**
             * Texture width, read only
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 纹理宽度，只读属性，不可以设置
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$getTextureWidth();
            },
            enumerable: true,
            configurable: true
        });
        BKTexture.prototype.$getTextureWidth = function () {
            return this.$textureWidth;
        };
        Object.defineProperty(BKTexture.prototype, "textureHeight", {
            /**
             * Texture height, read only
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 纹理高度，只读属性，不可以设置
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$getTextureHeight();
            },
            enumerable: true,
            configurable: true
        });
        BKTexture.prototype.$getTextureHeight = function () {
            return this.$textureHeight;
        };
        BKTexture.prototype.$getScaleBitmapWidth = function () {
            return this.$bitmapWidth * egret.$TextureScaleFactor;
        };
        BKTexture.prototype.$getScaleBitmapHeight = function () {
            return this.$bitmapHeight * egret.$TextureScaleFactor;
        };
        Object.defineProperty(BKTexture.prototype, "bitmapData", {
            /**
             * The BitmapData object being referenced.
             * @version Egret 2.4
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 被引用的 BitmapData 对象。
             * @version Egret 2.4
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$bitmapData;
            },
            set: function (value) {
                this._setBitmapData(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
        * Set the BitmapData object.
        * @version Egret 3.2.1
        * @platform Web,Native
        * @language en_US
        */
        /**
         * 设置 BitmapData 对象。
         * @version Egret 3.2.1
         * @platform Web,Native
         * @language zh_CN
         */
        BKTexture.prototype._setBitmapData = function (value) {
            this.$bitmapData = value;
            var scale = egret.$TextureScaleFactor;
            var w = value.width * scale;
            var h = value.height * scale;
            this.$initData(0, 0, w, h, 0, 0, w, h, value.width, value.height);
        };
        /**
         * @private
         * 设置Texture数据
         * @param bitmapX
         * @param bitmapY
         * @param bitmapWidth
         * @param bitmapHeight
         * @param offsetX
         * @param offsetY
         * @param textureWidth
         * @param textureHeight
         * @param sourceWidth
         * @param sourceHeight
         */
        BKTexture.prototype.$initData = function (bitmapX, bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, textureWidth, textureHeight, sourceWidth, sourceHeight, rotated) {
            if (rotated === void 0) { rotated = false; }
            var scale = egret.$TextureScaleFactor;
            this.$bitmapX = bitmapX / scale;
            this.$bitmapY = bitmapY / scale;
            this.$bitmapWidth = bitmapWidth / scale;
            this.$bitmapHeight = bitmapHeight / scale;
            this.$offsetX = offsetX;
            this.$offsetY = offsetY;
            this.$textureWidth = textureWidth;
            this.$textureHeight = textureHeight;
            this.$sourceWidth = sourceWidth;
            this.$sourceHeight = sourceHeight;
            this.$rotated = rotated;
            this._bkTexture = new BK.Texture(this.bitmapData.source); // MD
        };
        /**
         * @deprecated
         */
        BKTexture.prototype.getPixel32 = function (x, y) {
            throw new Error();
        };
        /**
         * Obtain the color value for the specified pixel region
         * @param x  The x coordinate of the pixel region
         * @param y  The y coordinate of the pixel region
         * @param width  The width of the pixel region
         * @param height  The height of the pixel region
         * @returns  Specifies the color value for the pixel region
         * @version Egret 3.2.1
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 获取指定像素区域的颜色值
         * @param x  像素区域的X轴坐标
         * @param y  像素区域的Y轴坐标
         * @param width  像素点的Y轴坐标
         * @param height  像素点的Y轴坐标
         * @returns  指定像素区域的颜色值
         * @version Egret 3.2.1
         * @platform Web
         * @language zh_CN
         */
        BKTexture.prototype.getPixels = function (x, y, width, height) {
            if (width === void 0) { width = 1; }
            if (height === void 0) { height = 1; }
            throw new Error();
        };
        /**
         * Convert base64 string, if the picture (or pictures included) cross-border or null
         * @param type Type conversions, such as "image / png"
         * @param rect The need to convert the area
         * @param smoothing Whether to convert data to the smoothing process
         * @returns {any} base64 string
         * @version Egret 2.4
         * @language en_US
         */
        /**
         * 转换成base64字符串，如果图片（或者包含的图片）跨域，则返回null
         * @param type 转换的类型，如  "image/png"
         * @param rect 需要转换的区域
         * @param {any} encoderOptions 编码用的参数
         * @returns {any} base64字符串
         * @version Egret 2.4
         * @language zh_CN
         */
        BKTexture.prototype.toDataURL = function (type, rect, encoderOptions) {
            throw new Error();
        };
        /**
         * Crop designated area and save it as image.
         * native support only "image / png" and "image / jpeg"; Web browser because of the various implementations are not the same, it is recommended to use only these two kinds.
         * @param type Type conversions, such as "image / png"
         * @param filePath The path name of the image (the home directory for the game's private space, the path can not have "../",Web supports only pass names.)
         * @param rect The need to convert the area
         * @version Egret 2.4
         * @platform Native
         * @language en_US
         */
        /**
         * 裁剪指定区域并保存成图片。
         * native只支持 "image/png" 和 "image/jpeg"；Web中由于各个浏览器的实现不一样，因此建议也只用这2种。
         * @param type 转换的类型，如  "image/png"
         * @param filePath 图片的名称的路径（主目录为游戏的私有空间，路径中不能有 "../"，Web只支持传名称。）
         * @param rect 需要转换的区域
         * @version Egret 2.4
         * @platform Native
         * @language zh_CN
         */
        BKTexture.prototype.saveToFile = function (type, filePath, rect) {
            throw new Error();
        };
        return BKTexture;
    }(egret.HashObject));
    egret.BKTexture = BKTexture;
    __reflect(BKTexture.prototype, "egret.BKTexture");
    egret.Texture = BKTexture;
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
                this._bkHttpRequest = new BK.HttpUtil(this._url); // 没文档，只能新建实例
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
                        var result = void 0;
                        if (self._responseType === egret.HttpResponseType.ARRAY_BUFFER) {
                            // TODO
                        }
                        else {
                            result = res.readAsString() || "";
                        }
                        self._response = result;
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
            }
            else {
                if (self._responseType === egret.HttpResponseType.ARRAY_BUFFER) {
                    // egret_native.readFileAsync(self._url, promise, "ArrayBuffer"); // TODO
                }
                else {
                    var bkBuffer = BK.FileUtil.readFile(self._url);
                    self._response = bkBuffer.readAsString();
                    egret.$callAsync(egret.Event.dispatchEvent, egret.Event, self, egret.Event.COMPLETE);
                }
            }
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
    var BKBitmapData = (function (_super) {
        __extends(BKBitmapData, _super);
        function BKBitmapData(source) {
            var _this = _super.call(this) || this;
            _this.width = 0;
            _this.height = 0;
            _this.source = "";
            var bkTexture = new BK.Texture(source);
            _this.width = bkTexture.size.width;
            _this.height = bkTexture.size.height;
            _this.source = source;
            return _this;
        }
        return BKBitmapData;
    }(egret.HashObject));
    egret.BKBitmapData = BKBitmapData;
    __reflect(BKBitmapData.prototype, "egret.BKBitmapData");
    egret.BitmapData = BKBitmapData;
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
            _this._size = { width: 0.0, height: 0.0 };
            _this._bitmapData = null;
            _this._bkSprite = _this._bkNode;
            _this._bkSprite.anchor = { x: 0.0, y: 1.0 };
            _this.texture = value;
            return _this;
        }
        Object.defineProperty(BKBitmap.prototype, "texture", {
            get: function () {
                return this._texture;
            },
            set: function (value) {
                if (this._texture === value) {
                    return;
                }
                this._texture = value;
                if (this._texture) {
                    this._bkSprite.setTexture(value._bkTexture);
                    this._size.width = !isNaN(this.$explicitBitmapWidth) ? this.$explicitBitmapWidth : this._texture.$getTextureWidth();
                    this._size.height = !isNaN(this.$explicitBitmapHeight) ? this.$explicitBitmapHeight : this._texture.$getTextureHeight();
                    this._bkSprite.size = this._size;
                    this._bkSprite.adjustTexturePosition(this._texture.$bitmapX, this._texture.$sourceHeight - (this._texture.$bitmapY + this._texture.$bitmapHeight), this._texture.$bitmapWidth, this._texture.$bitmapHeight, this._texture.$rotated);
                }
                else {
                    this._bkSprite.setTexture({});
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
        BKBitmap.prototype.$setWidth = function (value) {
            var self = this;
            if (value < 0 || value == self.$explicitBitmapWidth) {
                return false;
            }
            self.$explicitBitmapWidth = value;
            // MD
            this._size.width = value;
            this._bkSprite.size = this._size;
            return true;
        };
        /**
         * @private
         *
         * @param value
         */
        BKBitmap.prototype.$setHeight = function (value) {
            var self = this;
            if (value < 0 || value == self.$explicitBitmapHeight) {
                return false;
            }
            self.$explicitBitmapHeight = value;
            // MD
            this._size.height = value;
            this._bkSprite.size = this._size;
            return true;
        };
        /**
         * @private
         * 获取显示宽度
         */
        BKBitmap.prototype.$getWidth = function () {
            return isNaN(this.$explicitBitmapWidth) ? this.$getContentBounds().width : this.$explicitBitmapWidth;
        };
        /**
         * @private
         * 获取显示宽度
         */
        BKBitmap.prototype.$getHeight = function () {
            return isNaN(this.$explicitBitmapHeight) ? this.$getContentBounds().height : this.$explicitBitmapHeight;
        };
        /**
         * @private
         */
        BKBitmap.prototype.$measureContentBounds = function (bounds) {
            if (this._texture) {
                var w = !isNaN(this.$explicitBitmapWidth) ? this.$explicitBitmapWidth : this._texture.$getTextureWidth();
                var h = !isNaN(this.$explicitBitmapHeight) ? this.$explicitBitmapHeight : this._texture.$getTextureHeight();
                bounds.setTo(0, 0, w, h);
            }
            else {
                var w = !isNaN(this.$explicitBitmapWidth) ? this.$explicitBitmapWidth : 0;
                var h = !isNaN(this.$explicitBitmapHeight) ? this.$explicitBitmapHeight : 0;
                bounds.setTo(0, 0, w, h);
            }
        };
        BKBitmap.prototype.$setAnchorOffsetX = function (value) {
            _super.prototype.$setAnchorOffsetX.call(this, value);
            var anchorX = value / this._size.width;
            this._bkSprite.anchor = { x: anchorX, y: this._bkSprite.anchor.y };
        };
        BKBitmap.prototype.$setAnchorOffsetY = function (value) {
            _super.prototype.$setAnchorOffsetY.call(this, value);
            var anchorY = 1.0 - value / this._size.height;
            this._bkSprite.anchor = { x: this._bkSprite.anchor.x, y: anchorY };
        };
        return BKBitmap;
    }(egret.BKDisplayObject));
    egret.BKBitmap = BKBitmap;
    __reflect(BKBitmap.prototype, "egret.BKBitmap");
    egret.Bitmap = BKBitmap;
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
                // target = null; // TODO
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
            // private dispatchIOError(url: string): void {
            //     let self = this;
            //     window.setTimeout(function (): void {
            //         if (DEBUG && !self.hasEventListener(IOErrorEvent.IO_ERROR)) {
            //             $error(1011, url);
            //         }
            //         self.dispatchEventWith(IOErrorEvent.IO_ERROR);
            //     }, 0);
            // }
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
            this.data = new egret.BitmapData(url);
            egret.$callAsync(egret.Event.dispatchEvent, egret.Event, this, egret.Event.COMPLETE);
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
    var BKTextField = (function (_super) {
        __extends(BKTextField, _super);
        function BKTextField() {
            var _this = _super.call(this, new BK.Text(undefined, "")) || this;
            _this._size = { width: 100.0, height: 200.0 };
            _this._bkText = _this._bkNode;
            _this._bkText.anchor = { x: 0.0, y: 1.0 };
            _this._bkText.bold = 0;
            _this._bkText.italic = false;
            _this._bkText.maxSize = { width: 2048, height: 2048 };
            _this._bkText.shadowColor = 0x00000000;
            _this._bkText.shadowOffset = { x: 0, y: 0 };
            _this._bkText.shadowRadius = 0;
            _this._bkText.strokeColor = 0x00000000;
            _this._bkText.strokeSize = 0;
            return _this;
        }
        /**
         * 为16进制数字补0，输出字符串
         */
        BKTextField.prototype._refitString = function (num, length) {
            var str = num.toString(16);
            var zero = "00000000";
            return zero.substr(0, length - str.length) + str;
        };
        Object.defineProperty(BKTextField.prototype, "size", {
            /**
             * 文字字号大小
             */
            get: function () {
                return this._bkText.fontSize;
            },
            set: function (value) {
                this._bkText.fontSize = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKTextField.prototype, "bold", {
            /**
             * 是否显示为粗体
             */
            get: function () {
                return this._bkText.bold > 0;
            },
            set: function (bold) {
                this._bkText.bold = bold ? 1 : 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKTextField.prototype, "italic", {
            /**
             * 是否显示为斜体
             */
            get: function () {
                return this._bkText.italic;
            },
            set: function (value) {
                this._bkText.italic = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKTextField.prototype, "textAlign", {
            /**
             * 文本的水平对齐方式
             */
            get: function () {
                switch (this._bkText.horizontalAlign) {
                    case 0:
                        return egret.HorizontalAlign.LEFT;
                    case 1:
                        return egret.HorizontalAlign.CENTER;
                    case 2:
                        return egret.HorizontalAlign.RIGHT;
                }
            },
            set: function (value) {
                switch (value) {
                    case egret.HorizontalAlign.LEFT:
                        this._bkText.horizontalAlign = 0;
                        break;
                    case egret.HorizontalAlign.CENTER:
                        this._bkText.horizontalAlign = 1;
                        break;
                    case egret.HorizontalAlign.RIGHT:
                        this._bkText.horizontalAlign = 2;
                        break;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKTextField.prototype, "text", {
            get: function () {
                return this._bkText.content;
            },
            set: function (value) {
                this._bkText.content = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKTextField.prototype, "textColor", {
            /**
             * 字体颜色，格式为0x000000的RGB编码格式字符串
             */
            get: function () {
                var argb_str = this._refitString(this._bkText.fontColor, 8); //00 ff ff 00八位argb格式
                var rbg_str = argb_str.substring(2, 8);
                return parseInt(rbg_str, 16);
            },
            set: function (value) {
                var rgb_str = this._refitString(value, 6); //六位rgb格式
                var old_argb_str = this._refitString(this._bkText.fontColor, 8);
                var new_argb_str = old_argb_str.substring(0, 2) + rgb_str;
                var argb_num = parseInt(new_argb_str, 16);
                this._bkText.fontColor = argb_num;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKTextField.prototype, "strokeColor", {
            /**
             * 描边颜色，格式为0x000000的RGB编码格式字符串
             */
            get: function () {
                var argb_str = this._refitString(this._bkText.strokeColor, 8); //00 ff ff 00八位argb格式
                var rbg_str = argb_str.substring(2, 8);
                return parseInt(rbg_str);
            },
            set: function (strokeColor) {
                var rgb_str = this._refitString(strokeColor, 6); //六位rgb格式
                var old_argb_str = this._refitString(this._bkText.strokeColor, 8);
                var new_argb_str = old_argb_str.substring(0, 2) + rgb_str;
                var argb_num = parseInt(new_argb_str, 16);
                this._bkText.fontColor = argb_num;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKTextField.prototype, "stroke", {
            /**
             * 描边宽度
             */
            get: function () {
                return this._bkText.strokeSize;
            },
            set: function (value) {
                this._bkText.strokeSize = value;
            },
            enumerable: true,
            configurable: true
        });
        BKTextField.prototype.$setWidth = function (value) {
            _super.prototype.$setWidth.call(this, value);
            this._size.width = value;
            this._bkText["style"].width = this._size.width;
        };
        BKTextField.prototype.$setHeight = function (value) {
            _super.prototype.$setHeight.call(this, value);
            this._size.height = value;
            this._bkText["style"].height = this._size.height;
        };
        BKTextField.prototype.$setAnchorOffsetX = function (value) {
            _super.prototype.$setAnchorOffsetX.call(this, value);
            var anchorX = value / this._size.width;
            this._bkText.anchor = { x: anchorX, y: this._bkText.anchor.y };
        };
        BKTextField.prototype.$setAnchorOffsetY = function (value) {
            _super.prototype.$setAnchorOffsetY.call(this, value);
            var anchorY = 1.0 - value / this._size.height;
            this._bkText.anchor = { x: this._bkText.anchor.x, y: anchorY };
        };
        Object.defineProperty(BKTextField.prototype, "textWidth", {
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
                return this._bkText['width'];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BKTextField.prototype, "textHeight", {
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
                return this._bkText['height'];
            },
            enumerable: true,
            configurable: true
        });
        return BKTextField;
    }(egret.BKDisplayObject));
    egret.BKTextField = BKTextField;
    __reflect(BKTextField.prototype, "egret.BKTextField");
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
            this._BKCanvas = new BK.Canvas(2 * this.stageW, 2 * this.stageH); //sys.GraphicsNode();
            this._BKCanvas.position = { x: -this.stageW, y: -this.stageH };
            this.offsetX = this.stageW;
            this.offsetY = this.stageH;
            this._BKCanvas.backgroundColor = { r: 0, g: 0, b: 0, a: 0 };
        }
        /**
         * @private
         * 设置绑定到的目标显示对象
         */
        BKGraphics.prototype.$setTarget = function (target) {
            if (this.targetDisplay) {
                this.targetDisplay.$renderNode = null;
            }
            target._bkNode.addChild(this._BKCanvas);
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
            // this.fillPath = this.$renderNode.beginFill(color, alpha, this.strokePath);
            // if (this.$renderNode.drawData.length > 1) {
            //     this.fillPath.moveTo(this.lastX, this.lastY);
            // }
            this.isFillPath = true;
            var rgb_str = this._refitString(color, 6); //六位rgb格式
            var red = parseInt(rgb_str.substring(0, 2), 16) / 255;
            var green = parseInt(rgb_str.substring(2, 4), 16) / 255;
            var blue = parseInt(rgb_str.substring(4, 6), 16) / 255;
            this._BKCanvas.fillColor = { r: red, g: green, b: blue, a: alpha };
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
            //暂不使用
            if (matrix === void 0) { matrix = null; }
            // this.fillPath = this.$renderNode.beginGradientFill(type, colors, alphas, ratios, matrix, this.strokePath);
            // if (this.$renderNode.drawData.length > 1) {
            //     this.fillPath.moveTo(this.lastX, this.lastY);
            // }
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
            // this.fillPath = null;
            if (this.isFillPath) {
                this._BKCanvas.fill();
                this.isFillPath = false;
            }
            if (this.isStrokePath) {
                this._BKCanvas.stroke();
                this._BKCanvas.closePath();
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
        // public lineStyle(thickness: number = NaN, color: number = 0, alpha: number = 1.0, pixelHinting: boolean = false,
        //     scaleMode: string = "normal", caps: string = null, joints: string = null, miterLimit: number = 3, lineDash?: number[]): void {
        //     thickness = +thickness || 0;
        //     if (thickness <= 0) {
        //         this.strokePath = null;
        //         this.setStrokeWidth(0);
        //     }
        //     else {
        //         color = +color || 0;
        //         alpha = +alpha || 0;
        //         miterLimit = +miterLimit || 0;
        //         this.setStrokeWidth(thickness);
        //         this.strokePath = this.$renderNode.lineStyle(thickness, color, alpha, caps, joints, miterLimit);
        //         if (lineDash) {
        //             this.strokePath.setLineDash(lineDash);
        //         }
        //         if (this.$renderNode.drawData.length > 1) {
        //             this.strokePath.moveTo(this.lastX, this.lastY);
        //         }
        //     }
        // }
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
                this._BKCanvas.lineWidth = thickness;
                this.isStrokePath = true;
                var rgb_str = this._refitString(color, 6);
                var red = parseInt(rgb_str.substring(0, 2), 16) / 255;
                var green = parseInt(rgb_str.substring(2, 4), 16) / 255;
                var blue = parseInt(rgb_str.substring(4, 6), 16) / 255;
                this._BKCanvas.strokeColor = { r: red, g: green, b: blue, a: alpha };
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
            var _x = +x + this.offsetX || 0;
            var _y = -y + this.offsetY || 0;
            width = +width || 0;
            height = +height || 0;
            // let fillPath = this.fillPath;
            // let strokePath = this.strokePath;
            // fillPath && fillPath.drawRect(x, y, width, height);
            // strokePath && strokePath.drawRect(x, y, width, height);
            this.extendBoundsByPoint(x + width, y + height);
            this.updatePosition(x, y);
            // this.$renderNode.dirtyRender = true;
            if (this.isFillPath) {
                this._BKCanvas.fillRect(_x, _y - height, width, height);
            }
            if (this.isStrokePath) {
                this._BKCanvas.strokeRect(_x, _y - height, width, height);
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
            // x = +x || 0;
            // y = +y || 0;
            // width = +width || 0;
            // height = +height || 0;
            // ellipseWidth = +ellipseWidth || 0;
            // ellipseHeight = +ellipseHeight || 0;
            // let fillPath = this.fillPath;
            // let strokePath = this.strokePath;
            // fillPath && fillPath.drawRoundRect(x, y, width, height, ellipseWidth, ellipseHeight);
            // strokePath && strokePath.drawRoundRect(x, y, width, height, ellipseWidth, ellipseHeight);
            // let radiusX = (ellipseWidth * 0.5) | 0;
            // let radiusY = ellipseHeight ? (ellipseHeight * 0.5) | 0 : radiusX;
            // let right = x + width;
            // let bottom = y + height;
            // let ybw = bottom - radiusY;
            // this.extendBoundsByPoint(x, y);
            // this.extendBoundsByPoint(right, bottom);
            // this.updatePosition(right, ybw);
            // this.$renderNode.dirtyRender = true;
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
            var _x = +x + this.offsetX || 0;
            var _y = -y + this.offsetY || 0;
            radius = +radius || 0;
            this._BKCanvas.drawCircle(_x, _y, radius);
            if (this.isStrokePath && this.isFillPath) {
                this._BKCanvas.fill();
                this._BKCanvas.drawCircle(_x, _y, radius);
                this._BKCanvas.stroke();
            }
            // let fillPath = this.fillPath;
            // let strokePath = this.strokePath;
            // fillPath && fillPath.drawCircle(x, y, radius);
            // strokePath && strokePath.drawCircle(x, y, radius);
            // //-1 +2 解决WebGL裁切问题
            this.extendBoundsByPoint(x - radius - 1, y - radius - 1);
            this.extendBoundsByPoint(x + radius + 2, y + radius + 2);
            this.updatePosition(x + radius, y);
            // this.$renderNode.dirtyRender = true;
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
            var _x = +x + this.offsetX || 0;
            var _y = -y + this.offsetY || 0;
            width = +width || 0;
            height = +height || 0;
            this._BKCanvas.drawEllipse(_x, _y, width, height);
            if (this.isStrokePath && this.isFillPath) {
                this._BKCanvas.fill();
                this._BKCanvas.drawEllipse(_x, _y, width, height);
                this._BKCanvas.stroke();
            }
            // let fillPath = this.fillPath;
            // let strokePath = this.strokePath;
            // fillPath && fillPath.drawEllipse(x, y, width, height);
            // strokePath && strokePath.drawEllipse(x, y, width, height);
            // //-1 +2 解决WebGL裁切问题
            this.extendBoundsByPoint(x - 1, y - 1);
            this.extendBoundsByPoint(x + width + 2, y + height + 2);
            this.updatePosition(x + width, y + height * 0.5);
            // this.$renderNode.dirtyRender = true;
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
            var _x = x + this.offsetX || 0;
            var _y = -y + this.offsetY || 0;
            this._BKCanvas.moveTo(_x, _y);
            // let fillPath = this.fillPath;
            // let strokePath = this.strokePath;
            // fillPath && fillPath.moveTo(x, y);
            // strokePath && strokePath.moveTo(x, y);
            // this.includeLastPosition = false;
            // this.lastX = x;
            // this.lastY = y;
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
            var _x = x + this.offsetX || 0;
            var _y = -y + this.offsetY || 0;
            this._BKCanvas.lineTo(_x, _y);
            // let fillPath = this.fillPath;
            // let strokePath = this.strokePath;
            // fillPath && fillPath.lineTo(x, y);
            // strokePath && strokePath.lineTo(x, y);
            this.updatePosition(x, y);
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
            var _controlX = this.offsetX + controlX || 0;
            var _controlY = this.offsetY - controlY || 0;
            var _anchorX = this.offsetX + anchorX || 0;
            var _anchorY = this.offsetY - anchorY || 0;
            this._BKCanvas.quadraticCurveTo(_controlX, _controlY, _anchorX, _anchorY);
            // let fillPath = this.fillPath;
            // let strokePath = this.strokePath;
            // fillPath && fillPath.curveTo(controlX, controlY, anchorX, anchorY);
            // strokePath && strokePath.curveTo(controlX, controlY, anchorX, anchorY);
            this.extendBoundsByPoint(controlX, controlY);
            this.extendBoundsByPoint(anchorX, anchorY);
            this.updatePosition(anchorX, anchorY);
            // this.$renderNode.dirtyRender = true;
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
            var _controlX1 = this.offsetX + controlX1 || 0;
            var _controlY1 = this.offsetY - controlY1 || 0;
            var _controlX2 = this.offsetX + controlX2 || 0;
            var _controlY2 = this.offsetY - controlY2 || 0;
            var _anchorX = this.offsetX + anchorX || 0;
            var _anchorY = this.offsetY - anchorY || 0;
            this._BKCanvas.bezierCurveTo(_controlX1, _controlY1, _controlX2, _controlY2, _anchorX, _anchorY);
            // let fillPath = this.fillPath;
            // let strokePath = this.strokePath;
            // fillPath && fillPath.cubicCurveTo(controlX1, controlY1, controlX2, controlY2, anchorX, anchorY);
            // strokePath && strokePath.cubicCurveTo(controlX1, controlY1, controlX2, controlY2, anchorX, anchorY);
            this.extendBoundsByPoint(controlX1, controlY1);
            this.extendBoundsByPoint(controlX2, controlY2);
            this.extendBoundsByPoint(anchorX, anchorY);
            this.updatePosition(anchorX, anchorY);
            // this.$renderNode.dirtyRender = true;
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
            //暂不支持
            // if (radius < 0 || startAngle === endAngle) {
            //     return;
            // }
            // x = +x || 0;
            // y = +y || 0;
            // radius = +radius || 0;
            // startAngle = +startAngle || 0;
            // endAngle = +endAngle || 0;
            // anticlockwise = !!anticlockwise;
            // startAngle = clampAngle(startAngle);
            // endAngle = clampAngle(endAngle);
            // let fillPath = this.fillPath;
            // let strokePath = this.strokePath;
            // if (fillPath) {
            //     fillPath.$lastX = this.lastX;
            //     fillPath.$lastY = this.lastY;
            //     fillPath.drawArc(x, y, radius, startAngle, endAngle, anticlockwise);
            // }
            // if (strokePath) {
            //     strokePath.$lastX = this.lastX;
            //     strokePath.$lastY = this.lastY;
            //     strokePath.drawArc(x, y, radius, startAngle, endAngle, anticlockwise);
            // }
            // if (anticlockwise) {
            //     this.arcBounds(x, y, radius, endAngle, startAngle);
            // }
            // else {
            //     this.arcBounds(x, y, radius, startAngle, endAngle);
            // }
            // let endX = x + Math.cos(endAngle) * radius;
            // let endY = y + Math.sin(endAngle) * radius;
            // this.updatePosition(endX, endY);
            // this.$renderNode.dirtyRender = true;
        };
        /**
         * @private
         * 测量圆弧的矩形大小
         */
        BKGraphics.prototype.arcBounds = function (x, y, radius, startAngle, endAngle) {
            //赞不支持
            // let PI = Math.PI;
            // if (Math.abs(startAngle - endAngle) < 0.01) {
            // this.extendBoundsByPoint(x - radius, y - radius);
            // this.extendBoundsByPoint(x + radius, y + radius);
            //     return;
            // }
            // if (startAngle > endAngle) {
            //     endAngle += PI * 2;
            // }
            // let startX = Math.cos(startAngle) * radius;
            // let endX = Math.cos(endAngle) * radius;
            // let xMin = Math.min(startX, endX);
            // let xMax = Math.max(startX, endX);
            // let startY = Math.sin(startAngle) * radius;
            // let endY = Math.sin(endAngle) * radius;
            // let yMin = Math.min(startY, endY);
            // let yMax = Math.max(startY, endY);
            // let startRange = startAngle / (PI * 0.5);
            // let endRange = endAngle / (PI * 0.5);
            // for (let i = Math.ceil(startRange); i <= endRange; i++) {
            //     switch (i % 4) {
            //         case 0:
            //             xMax = radius;
            //             break;
            //         case 1:
            //             yMax = radius;
            //             break;
            //         case 2:
            //             xMin = -radius;
            //             break;
            //         case 3:
            //             yMin = -radius;
            //             break;
            //     }
            // }
            // xMin = Math.floor(xMin);
            // yMin = Math.floor(yMin);
            // xMax = Math.ceil(xMax);
            // yMax = Math.ceil(yMax);
            // this.extendBoundsByPoint(xMin + x, yMin + y);
            // this.extendBoundsByPoint(xMax + x, yMax + y);
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
            this._BKCanvas.clearRect(0, 0, 2 * this.stageW, 2 * this.stageH);
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
            if (this._BKCanvas.hittest({ x: stageX, y: stageY })) {
                return this.targetDisplay;
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
        return BKGraphics;
    }());
    egret.BKGraphics = BKGraphics;
    __reflect(BKGraphics.prototype, "egret.BKGraphics");
    egret.Graphics = BKGraphics;
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
//
console.log = function () {
    var others = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        others[_i] = arguments[_i];
    }
    var str = "";
    if (others)
        for (var _a = 0, others_1 = others; _a < others_1.length; _a++) {
            var other = others_1[_a];
            str += other;
        }
    BK.Script.log(0, 0, str);
};
//
this.setTimeout = this.setTimeout || function () { };
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
        if (!options) {
            options = {};
        }
        if (options.screenAdapter) {
            egret.sys.screenAdapter = options.screenAdapter;
        }
        else if (!egret.sys.screenAdapter) {
            egret.sys.screenAdapter = new egret.sys.DefaultScreenAdapter();
        }
        player = new egret.BKPlayer(options);
    }
    egret.runEgret = runEgret;
})(egret || (egret = {}));
if (true) {
}
