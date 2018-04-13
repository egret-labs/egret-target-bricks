namespace egret {
    export const emptyTexture = BK.Texture.createTexture(1, 1);

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

    export function arrayBufferToBricksBuffer(arrayBuffer: ArrayBuffer): BK.Buffer {
        const bricksBuffer = new BK.Buffer(arrayBuffer.byteLength);
        const uint8Array = new Uint8Array(arrayBuffer);

        let pointer = 0;
        while (pointer < arrayBuffer.byteLength) {
            bricksBuffer.writeUint8Buffer(uint8Array[pointer++]);
        }

        return bricksBuffer;
    }


    /**
     * 将url通过sha1算法解析
     * 返回sha1之后的url
     */
    export function _sha1FromUrl(url) {
        var bufSha = BK.Misc.sha1(url);
        var sha1 = "";
        for (var i = 0; i < bufSha.length; i++) {
            var charCode = bufSha.readUint8Buffer();
            sha1 += charCode.toString(16);
        }
        return sha1;
    }
}