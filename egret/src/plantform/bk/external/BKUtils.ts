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

    export function bricksBufferToArrayBuffer(bricksBuffer: BK.Buffer): ArrayBuffer {
        const arrayBuffer = new ArrayBuffer(bricksBuffer.bufferLength());
        const uint8Array = new Uint8Array(arrayBuffer);

        let pointer = 0;
        while (pointer < bricksBuffer.bufferLength() - 1) {
            const result = bricksBuffer.readUint8Buffer();
            uint8Array[pointer++] = result;
        }

        // bricksBuffer.releaseBuffer();
        return arrayBuffer;
    }
}