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
            _this._scale = { x: 0.0, y: 0.0, z: 0.0 };
            _this._rotation = { x: 0.0, y: 0.0, z: 0.0 };
            _this._color = { r: 0.0, g: 0.0, b: 0.0, a: 0.0 };
            _this._bkNode = bkNode || new BK.Node();
            return _this;
        }
        BKDisplayObject.prototype._refreshNodePropertices = function () {
            this._bkNode.position = this._position;
            this._bkNode.scale = this._scale;
            this._bkNode.rotation = this._rotation;
            this._bkNode.vertexColor = this._color;
        };
        // protected _replaceNode(node: BK.Node): void {
        //     this._bkNode.parent.addChild(node, this._bkNode.children.indexOf(this._bkNode));
        //     for (let i = 0, l = this.$children.length; i < l; i++) {
        //         (this.$children[i] as BKDisplayObject)._bkNode.zOrder = -i;
        //     }
        // }
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
                    this._bkSprite.adjustTexturePosition(this._texture.$bitmapX, this._texture.$bitmapY, this._texture.$bitmapWidth, this._texture.$bitmapHeight, this._texture.$rotated);
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
            _this._mainTicker.add(function () {
                _this._touchHandler();
                egret.ticker.update();
                egret.ticker['callLaters'].call(egret.ticker);
            }, _this);
            _this.updateScreenSize();
            _this.updateMaxTouches();
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
// namespace egret {
//     export class BKSound extends egret.EventDispatcher implements egret.Sound {
//         type: string;
//         length: number;
//         private url: string;
//         constructor() {
//             super();
//             this.type = egret.Sound.EFFECT;
//         }
//         /**
//          * Background music
//          * @default "music"
//          * @version Egret 2.4
//          * @platform Web,Native
//          * @language en_US
//          */
//         /**
//          * 背景音乐
//          * @default "music"
//          * @version Egret 2.4
//          * @platform Web,Native
//          * @language zh_CN
//          */
//         public static MUSIC: string = "music";
//         /**
//          * EFFECT
//          * @default "effect"
//          * @version Egret 2.4
//          * @platform Web,Native
//          * @language en_US
//          */
//         /**
//          * 音效
//          * @default "effect"
//          * @version Egret 2.4
//          * @platform Web,Native
//          * @language zh_CN
//          */
//         public static EFFECT: string = "effect";
//         load(url: string): void {
//             this.url = url;
//         }
//         play(startTime: number = 0, loops: number = 0): egret.SoundChannel {
//             let channel = new BKSoundChannel();
//             channel.$loops = loops;
//             channel.$startTime = startTime;
//             channel.$type = this.type;
//             channel.$url = this.url;
//             channel.$play();
//             return channel;
//         }
//         close(): void {
//         }
//     }
//     egret.Sound = BKSound as any;
// } 
// namespace egret {
//     export class BKSoundChannel extends egret.EventDispatcher implements egret.SoundChannel {
//         public _bkAudio: BK.Audio;
//         constructor() {
//             super();
//         }
//         volume: number;
//         position: number;
//         $loops: number;
//         $startTime: number;
//         $type: string;
//         $url: string;
//         $play() {
//             let _type: number;
//             switch (this.$type) {
//                 case egret.Sound.MUSIC:
//                     _type = 0;
//                     break;
//                 case egret.Sound.EFFECT:
//                     _type = 1;
//                     break;
//             }
//             let loops = this.$loops === 0 ? -1 : this.$loops;
//             this._bkAudio = new BK.Audio(_type, "Game://" + this.$url, loops, 0);
//             this._bkAudio.startMusic();
//         }
//         stop(): void {
//             this._bkAudio.stopMusic();
//         }
//     }
// } 
