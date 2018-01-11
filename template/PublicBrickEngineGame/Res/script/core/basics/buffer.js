(function(){
    BK.Misc.BKBufferToArrayBuffer = function(buf) {
        buf.rewind();
        var ab = new ArrayBuffer(buf.length);
        var da = new DataView(ab);
        while (!buf.eof) {
            da.setUint8(buf.pointer, buf.readUint8Buffer());
        }
        return ab;
    }

    BK.Misc.arrayBufferToBKBuffer = function(ab) {
        var bf = new BK.Buffer(ab.byteLength);
        var da = new DataView(ab);
        for (var i = 0; i < ab.byteLength; i++) {
            bf.writeUint8Buffer(da.getUint8(i));
        }
        var t2 = BK.Time.clock;
        return bf;
    }
})();