namespace egret {
    export const emptyTexture = new BK.Texture('GameRes://resource/empty.png');

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
        while (pointer < bricksBuffer.bufferLength()) {
            uint8Array[pointer++] = bricksBuffer.readUint8Buffer();
        }
        // bricksBuffer.releaseBuffer();

        return arrayBuffer;
    }

    export function arrayBufferToBrickBuffer(arrayBuffer: ArrayBuffer): BK.Buffer {
        const bricksBuffer = new BK.Buffer(arrayBuffer.byteLength);
        const uint8Array = new Uint8Array(arrayBuffer);

        let pointer = 0;
        while (pointer < arrayBuffer.byteLength) {
            bricksBuffer.writeUint8Buffer(uint8Array[pointer++]);
        }

        return bricksBuffer;
    }
}