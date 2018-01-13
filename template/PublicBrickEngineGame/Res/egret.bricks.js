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
        BKDisplayObject.prototype.$getRenderNode = function () {
            return this._bkNode || null;
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
                // MD
                var index_1 = egret.BKPlayer.instance._displayList.indexOf(child);
                if (index_1 < 0) {
                    egret.BKPlayer.instance._displayList.push(child);
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
                // MD
                var index_2 = egret.BKPlayer.instance._displayList.indexOf(child);
                if (index_2 < 0) {
                    egret.BKPlayer.instance._displayList.splice(index_2, 1);
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
                // target = this.$graphics.$hitTest(stageX, stageY);
                target = null; // TODO
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
            console.log(self._url);
            if (self.isNetUrl(self._url)) {
                this._bkHttpRequest = new BK.HttpUtil(this._url); // 没文档，只能新建实例
                this._bkHttpRequest.setHttpMethod(this._method);
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
                egret.$callAsync(egret.Event.dispatchEvent, egret.IOErrorEvent, self, egret.IOErrorEvent.IO_ERROR);
            }
            else {
                if (self._responseType === egret.HttpResponseType.ARRAY_BUFFER) {
                    // egret_native.readFileAsync(self._url, promise, "ArrayBuffer"); // TODO
                    egret.$callAsync(egret.Event.dispatchEvent, egret.IOErrorEvent, self, egret.IOErrorEvent.IO_ERROR);
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
            /**
             * @internal
             */
            _this.$bitmapData = null;
            _this.$texture = null;
            /**
             * @internal
             */
            _this.$scale9Grid = null;
            _this._bkSprite = _this._bkNode;
            _this._bkSprite.anchor = { x: 0.0, y: 1.0 };
            _this.texture = value;
            return _this;
        }
        Object.defineProperty(BKBitmap.prototype, "texture", {
            get: function () {
                return this.$texture;
            },
            set: function (value) {
                this.$setTexture(value);
            },
            enumerable: true,
            configurable: true
        });
        BKBitmap.prototype.$setTexture = function (value) {
            if (this.$texture === value) {
                return;
            }
            this.$texture = value;
            if (this.$texture) {
                this.$bitmapData = this.$texture.bitmapData;
                if (this.$bitmapData.bkTexture) {
                    this._bkSprite.setTexture(this.$bitmapData.bkTexture);
                    this._size.width = this.$getWidth();
                    this._size.height = this.$getHeight();
                    this._bkSprite.size = this._size;
                    this._bkSprite.adjustTexturePosition(this.$texture.$bitmapX, this.$texture.$sourceHeight - (this.$texture.$bitmapY + this.$texture.$bitmapHeight), this.$texture.$bitmapWidth, this.$texture.$bitmapHeight, this.$texture.$rotated);
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
                var self = this;
                self.$scale9Grid = value;
                self.$renderDirty = true;
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
            console.log(url);
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
            _super.call(this, new BK.Text(undefined, "")) || this;
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
            // MD
            // Set default values.
            _this._bkText.fontSize = _this.$TextField[0 /* fontSize */];
            var defaultFontColor = 0xFFFFFFFF; // ???!!!
            _this._bkText.fontColor = defaultFontColor;
            // textAlign
            // verticalAlign
            _this._bkText.bold = _this.$TextField[15 /* bold */];
            _this._bkText.italic = _this.$TextField[16 /* italic */];
            // this._bkText.strokeColor = this.$TextField[sys.TextKeys.strokeColor];
            _this._bkText.strokeSize = _this.$TextField[27 /* stroke */];
            // BK values.
            // this._bkText["style"].width = 2048;
            // this._bkText["style"].height = 2048;
            _this._bkText.maxSize = { width: 2048, height: 2048 };
            var defaultShadowColor = 0x00000000; // ???!!!
            _this._bkText.shadowColor = defaultShadowColor;
            _this._bkText.shadowOffset = { x: 0, y: 0 };
            _this._bkText.shadowRadius = 0;
            _this._bkText.anchor = { x: 0.0, y: 1.0 };
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
            this._bkText.fontSize = value;
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
            this._bkText.bold = value ? 1 : 0;
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
            this._bkText.italic = value;
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
            // MD
            var rgb_str = this._refitString(value, 6); //六位rgb格式
            var old_argb_str = this._refitString(this._bkText.fontColor, 8);
            var new_argb_str = old_argb_str.substring(0, 2) + rgb_str;
            var argb_num = parseInt(new_argb_str, 16);
            this._bkText.fontColor = argb_num;
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
                this._bkText.content = text;
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
                var old_argb_str = this._refitString(this._bkText.strokeColor, 8);
                var new_argb_str = old_argb_str.substring(0, 2) + rgb_str;
                var argb_num = parseInt(new_argb_str, 16);
                this._bkText.fontColor = argb_num;
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
                this._bkText.strokeSize = value;
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
            this._bkText["style"].width = values[3 /* textFieldWidth */];
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
            this._bkText["style"].height = values[4 /* textFieldHeight */];
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
            // let h: number = !isNaN(this.$TextField[sys.TextKeys.textFieldHeight]) ? this.$TextField[sys.TextKeys.textFieldHeight] : TextFieldUtils.$getTextHeight(this);
            // MD
            var h = !isNaN(this.$TextField[4 /* textFieldHeight */]) ? this.$TextField[4 /* textFieldHeight */] : this.$TextField[6 /* textHeight */];
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
                // return TextFieldUtils.$getTextHeight(this);
                // MD
                return this.$TextField[6 /* textHeight */];
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
            values[29 /* numLines */] = 1;
            values[5 /* textWidth */] = this._bkText["width"];
            values[6 /* textHeight */] = this._bkText["height"];
            return this.linesArr;
            // let text2Arr: Array<egret.ITextElement> = this.textArr;
            // this.linesArr.length = 0;
            // values[sys.TextKeys.textHeight] = 0;
            // values[sys.TextKeys.textWidth] = 0;
            // let textFieldWidth: number = values[sys.TextKeys.textFieldWidth];
            // //宽度被设置为0
            // if (!isNaN(textFieldWidth) && textFieldWidth == 0) {
            //     values[sys.TextKeys.numLines] = 0;
            //     return [{ width: 0, height: 0, charNum: 0, elements: [], hasNextLine: false }];
            // }
            // let linesArr: Array<egret.ILineElement> = this.linesArr;
            // let lineW: number = 0;
            // let lineCharNum: number = 0;
            // let lineH: number = 0;
            // let lineCount: number = 0;
            // let lineElement: egret.ILineElement;
            // for (let i: number = 0, text2ArrLength: number = text2Arr.length; i < text2ArrLength; i++) {
            //     let element: egret.ITextElement = text2Arr[i];
            //     //可能设置为没有文本，忽略绘制
            //     if (!element.text) {
            //         if (lineElement) {
            //             lineElement.width = lineW;
            //             lineElement.height = lineH;
            //             lineElement.charNum = lineCharNum;
            //             values[sys.TextKeys.textWidth] = Math.max(values[sys.TextKeys.textWidth], lineW);
            //             values[sys.TextKeys.textHeight] += lineH;
            //         }
            //         continue;
            //     }
            //     element.style = element.style || <egret.ITextStyle>{};
            //     let text: string = element.text.toString();
            //     let textArr: string[] = text.split(/(?:\r\n|\r|\n)/);
            //     for (let j: number = 0, textArrLength: number = textArr.length; j < textArrLength; j++) {
            //         if (linesArr[lineCount] == null) {
            //             lineElement = { width: 0, height: 0, elements: [], charNum: 0, hasNextLine: false };
            //             linesArr[lineCount] = lineElement;
            //             lineW = 0;
            //             lineH = 0;
            //             lineCharNum = 0;
            //         }
            //         if (values[sys.TextKeys.type] == egret.TextFieldType.INPUT) {
            //             lineH = values[sys.TextKeys.fontSize];
            //         }
            //         else {
            //             lineH = Math.max(lineH, element.style.size || values[sys.TextKeys.fontSize]);
            //         }
            //         let isNextLine: boolean = true;
            //         if (textArr[j] == "") {
            //             if (j == textArrLength - 1) {
            //                 isNextLine = false;
            //             }
            //         }
            //         else {
            //             let w: number = measureTextWidth(textArr[j], values, element.style);
            //             if (isNaN(textFieldWidth)) {//没有设置过宽
            //                 lineW += w;
            //                 lineCharNum += textArr[j].length;
            //                 lineElement.elements.push(<egret.IWTextElement>{
            //                     width: w,
            //                     text: textArr[j],
            //                     style: element.style
            //                 });
            //                 if (j == textArrLength - 1) {
            //                     isNextLine = false;
            //                 }
            //             }
            //             else {
            //                 if (lineW + w <= textFieldWidth) {//在设置范围内
            //                     lineElement.elements.push(<egret.IWTextElement>{
            //                         width: w,
            //                         text: textArr[j],
            //                         style: element.style
            //                     });
            //                     lineW += w;
            //                     lineCharNum += textArr[j].length;
            //                     if (j == textArrLength - 1) {
            //                         isNextLine = false;
            //                     }
            //                 }
            //                 else {
            //                     let k: number = 0;
            //                     let ww: number = 0;
            //                     let word: string = textArr[j];
            //                     let words: string[];
            //                     if (values[sys.TextKeys.wordWrap]) {
            //                         words = word.split(SplitRegex);
            //                     }
            //                     else {
            //                         words = word.match(/./g);
            //                     }
            //                     let wl: number = words.length;
            //                     let charNum = 0;
            //                     for (; k < wl; k++) {
            //                         // detect 4 bytes unicode, refer https://mths.be/punycode
            //                         var codeLen = words[k].length;
            //                         var has4BytesUnicode = false;
            //                         if (codeLen == 1 && k < wl - 1) // when there is 2 bytes high surrogate
            //                         {
            //                             var charCodeHigh = words[k].charCodeAt(0);
            //                             var charCodeLow = words[k + 1].charCodeAt(0);
            //                             if (charCodeHigh >= 0xD800 && charCodeHigh <= 0xDBFF && (charCodeLow & 0xFC00) == 0xDC00) { // low
            //                                 var realWord = words[k] + words[k + 1];
            //                                 codeLen = 2;
            //                                 has4BytesUnicode = true;
            //                                 w = measureTextWidth(realWord, values, element.style);
            //                             } else {
            //                                 w = measureTextWidth(words[k], values, element.style);
            //                             }
            //                         } else {
            //                             w = measureTextWidth(words[k], values, element.style);
            //                         }
            //                         // w = measureTextWidth(words[k], values, element.style);
            //                         if (lineW != 0 && lineW + w > textFieldWidth && lineW + k != 0) {
            //                             break;
            //                         }
            //                         if (ww + w > textFieldWidth) {//纯英文，一个词就超出宽度的情况
            //                             var words2: Array<string> = words[k].match(/./g);
            //                             for (var k2 = 0, wl2 = words2.length; k2 < wl2; k2++) {
            //                                 // detect 4 bytes unicode, refer https://mths.be/punycode
            //                                 var codeLen = words2[k2].length;
            //                                 var has4BytesUnicode2 = false;
            //                                 if (codeLen == 1 && k2 < wl2 - 1) // when there is 2 bytes high surrogate
            //                                 {
            //                                     var charCodeHigh = words2[k2].charCodeAt(0);
            //                                     var charCodeLow = words2[k2 + 1].charCodeAt(0);
            //                                     if (charCodeHigh >= 0xD800 && charCodeHigh <= 0xDBFF && (charCodeLow & 0xFC00) == 0xDC00) { // low
            //                                         var realWord = words2[k2] + words2[k2 + 1];
            //                                         codeLen = 2;
            //                                         has4BytesUnicode2 = true;
            //                                         w = measureTextWidth(realWord, values, element.style);
            //                                     } else {
            //                                         w = measureTextWidth(words2[k2], values, element.style);
            //                                     }
            //                                 } else {
            //                                     w = measureTextWidth(words2[k2], values, element.style);
            //                                 }
            //                                 // w = measureTextWidth(words2[k2], values, element.style);
            //                                 if (k2 > 0 && lineW + w > textFieldWidth) {
            //                                     break;
            //                                 }
            //                                 // charNum += words2[k2].length;
            //                                 charNum += codeLen;
            //                                 ww += w;
            //                                 lineW += w;
            //                                 lineCharNum += charNum;
            //                                 if (has4BytesUnicode2) {
            //                                     k2++;
            //                                 }
            //                             }
            //                         } else {
            //                             // charNum += words[k].length;
            //                             charNum += codeLen;
            //                             ww += w;
            //                             lineW += w;
            //                             lineCharNum += charNum;
            //                         }
            //                         if (has4BytesUnicode) {
            //                             k++;
            //                         }
            //                     }
            //                     if (k > 0) {
            //                         lineElement.elements.push(<egret.IWTextElement>{
            //                             width: ww,
            //                             text: word.substring(0, charNum),
            //                             style: element.style
            //                         });
            //                         let leftWord: string = word.substring(charNum);
            //                         let m: number;
            //                         let lwleng = leftWord.length;
            //                         for (m = 0; m < lwleng; m++) {
            //                             if (leftWord.charAt(m) != " ") {
            //                                 break;
            //                             }
            //                         }
            //                         textArr[j] = leftWord.substring(m);
            //                     }
            //                     if (textArr[j] != "") {
            //                         j--;
            //                         isNextLine = false;
            //                     }
            //                 }
            //             }
            //         }
            //         if (isNextLine) {
            //             lineCharNum++;
            //             lineElement.hasNextLine = true;
            //         }
            //         if (j < textArr.length - 1) {//非最后一个
            //             lineElement.width = lineW;
            //             lineElement.height = lineH;
            //             lineElement.charNum = lineCharNum;
            //             values[sys.TextKeys.textWidth] = Math.max(values[sys.TextKeys.textWidth], lineW);
            //             values[sys.TextKeys.textHeight] += lineH;
            //             //if (this._type == TextFieldType.INPUT && !this._multiline) {
            //             //    this._numLines = linesArr.length;
            //             //    return linesArr;
            //             //}
            //             lineCount++;
            //         }
            //     }
            //     if (i == text2Arr.length - 1 && lineElement) {
            //         lineElement.width = lineW;
            //         lineElement.height = lineH;
            //         lineElement.charNum = lineCharNum;
            //         values[sys.TextKeys.textWidth] = Math.max(values[sys.TextKeys.textWidth], lineW);
            //         values[sys.TextKeys.textHeight] += lineH;
            //     }
            // }
            // values[sys.TextKeys.numLines] = linesArr.length;
            // return linesArr;
        };
        /**
         * @private
         * 返回要绘制的下划线列表
         */
        BKTextField.prototype.drawText = function () {
            // let node = this.textNode;
            // let values = this.$TextField;
            // //更新文本样式
            // node.bold = values[sys.TextKeys.bold];
            // node.fontFamily = values[sys.TextKeys.fontFamily] || TextField.default_fontFamily;
            // node.italic = values[sys.TextKeys.italic];
            // node.size = values[sys.TextKeys.fontSize];
            // node.stroke = values[sys.TextKeys.stroke];
            // node.strokeColor = values[sys.TextKeys.strokeColor];
            // node.textColor = values[sys.TextKeys.textColor];
            // //先算出需要的数值
            // let lines: Array<egret.ILineElement> = this.$getLinesArr();
            // if (values[sys.TextKeys.textWidth] == 0) {
            //     return [];
            // }
            // let maxWidth: number = !isNaN(values[sys.TextKeys.textFieldWidth]) ? values[sys.TextKeys.textFieldWidth] : values[sys.TextKeys.textWidth];
            // let textHeight: number = TextFieldUtils.$getTextHeight(this);
            // let drawY: number = 0;
            // let startLine: number = TextFieldUtils.$getStartLine(this);
            // let textFieldHeight: number = values[sys.TextKeys.textFieldHeight];
            // if (!isNaN(textFieldHeight) && textFieldHeight > textHeight) {
            //     let vAlign: number = TextFieldUtils.$getValign(this);
            //     drawY += vAlign * (textFieldHeight - textHeight);
            // }
            // drawY = Math.round(drawY);
            // let hAlign: number = TextFieldUtils.$getHalign(this);
            // let drawX: number = 0;
            // let underLineData: number[] = [];
            // for (let i: number = startLine, numLinesLength: number = values[sys.TextKeys.numLines]; i < numLinesLength; i++) {
            //     let line: egret.ILineElement = lines[i];
            //     let h: number = line.height;
            //     drawY += h / 2;
            //     if (i != startLine) {
            //         if (values[sys.TextKeys.type] == egret.TextFieldType.INPUT && !values[sys.TextKeys.multiline]) {
            //             break;
            //         }
            //         if (!isNaN(textFieldHeight) && drawY > textFieldHeight) {
            //             break;
            //         }
            //     }
            //     drawX = Math.round((maxWidth - line.width) * hAlign);
            //     for (let j: number = 0, elementsLength: number = line.elements.length; j < elementsLength; j++) {
            //         let element: egret.IWTextElement = line.elements[j];
            //         let size: number = element.style.size || values[sys.TextKeys.fontSize];
            //         node.drawText(drawX, drawY + (h - size) / 2, element.text, element.style);
            //         if (element.style.underline) {
            //             underLineData.push(
            //                 drawX,
            //                 drawY + (h) / 2,
            //                 element.width,
            //                 element.style.textColor
            //             );
            //         }
            //         drawX += element.width;
            //     }
            //     drawY += h / 2 + values[sys.TextKeys.lineSpacing];
            // }
            // return underLineData;
            return []; // MD
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
        BKTextField.prototype.$setAnchorOffsetX = function (value) {
            _super.prototype.$setAnchorOffsetX.call(this, value);
            var anchorX = value / this.$TextField[3 /* textFieldWidth */];
            this._bkText.anchor = { x: anchorX, y: this._bkText.anchor.y };
        };
        BKTextField.prototype.$setAnchorOffsetY = function (value) {
            _super.prototype.$setAnchorOffsetY.call(this, value);
            var anchorY = 1.0 - value / this.$TextField[4 /* textFieldHeight */];
            this._bkText.anchor = { x: this._bkText.anchor.x, y: anchorY };
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
//
console = console || {};
console.warn = console.log = function () {
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
console.assert = console.log; // TODO
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
    function modifyEgret() {
        if (eui) {
            ;
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
                var scale9Grid = this.scale9Grid || this.$texture["scale9Grid"];
                if (scale9Grid) {
                    // if (this.$renderNode instanceof egret.sys.NormalBitmapNode) {
                    // } TODO
                    this._size.width = this.$getWidth();
                    this._size.height = this.$getHeight();
                    this._bkSprite.size = this._size;
                }
                else {
                    this._size.width = this.$getWidth();
                    this._size.height = this.$getHeight();
                    this._bkSprite.size = this._size;
                }
                return null;
            };
        }
    }
    egret.runEgret = runEgret;
})(egret || (egret = {}));
if (true) {
}
