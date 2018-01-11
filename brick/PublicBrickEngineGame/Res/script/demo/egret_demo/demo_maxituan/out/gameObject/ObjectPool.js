var ObjectPool = (function () {
    function ObjectPool() {
    }
    ObjectPool.createObject = function (classFactory) {
        var result;
        var key = classFactory.key;
        var arr = this._pool[key];
        if (arr != null && arr.length) {
            result = arr.shift();
            //            console.log("拿出一个" + key);
        }
        else {
            result = new classFactory();
            result.key = key;
            //            console.log("创建一个" + key);
        }
        result.onCreate();
        ObjectPool.list.push(result);
        return result;
    };
    ObjectPool.destroyObject = function (obj) {
        var key = obj.key;
        if (ObjectPool._pool[key] == null) {
            ObjectPool._pool[key] = [];
        }
        //        console.log("销毁一个" + key);
        ObjectPool._pool[key].push(obj);
        GameUtils.removeChild(obj);
        obj.onDestroy();
        var index = ObjectPool.list.indexOf(obj);
        if (index != -1) {
            ObjectPool.list.splice(index, 1);
        }
    };
    ObjectPool.destroyAllObject = function () {
        while (ObjectPool.list.length) {
            this.destroyObject(ObjectPool.list[0]);
        }
    };
    ObjectPool._pool = {};
    ObjectPool.list = [];
    return ObjectPool;
}());
