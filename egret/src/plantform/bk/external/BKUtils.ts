namespace egret {
    export function defineProxyProperties(target: any, proxy: any): void {
        const names = Object.getOwnPropertyNames(target);
        for (let key of names) {
            Object.defineProperty(proxy, key, {
                get: function () {
                    return target[key];
                },
                set: function (obj) {
                    target[key] = obj;
                }
            });
        }
    }
}