
BK.DNS = (function(){
    function dns() {
        this.records = [];
        this.running = false;
    }
    dns.prototype.exists = function(hostname) {
        for (var i = 0; i < this.records.length; i++) {
            if (this.records[i].hostname === hostname) {
                return true;
            }
        }
        return false;
    }
    dns.prototype.query = function(hostname, af) {
        for (var i = 0; i < this.records.length; i++) {
            if (this.records[i].af === af &&
                this.records[i].hostname === hostname) {
                return this.records[i];
            }
        }
        return null;
    }
    dns.prototype.update = function(hostname, callback, af, timeout) {
        for (var i = 0; i < this.records.length; i++) {
            if (this.records[i].af === af &&
                this.records[i].hostname === hostname) {
                this.records[i].callbacks.push(callback);
                return
            }
        }
        this.records.push({
            af: af,
            timeout: timeout,
            hostname: hostname,
            callbacks: [callback]
        });
    }
    dns.prototype.delete = function(hostname) {
        for (var i = 0; i < this.records.length; i++) {
            if (this.records[i].hostname === hostname) {
                this.records.splice(i);
                break;
            }
        }
    }
    dns.prototype.start = function() {
        if (!this.running) {
            this.running = true;
            var _this = this;
            BK.Director.ticker.add(function(ts, duration) {
                if (_this.records.length) {
                    BK.Misc.handleDNSQueryResult();
                }
            });
        }
    }
    dns.prototype.queryIPAddress = function(hostname, callback, af, timeout) {
        var needQuery = !this.exists(hostname);
        if (undefined == af) af = 2;
        if (undefined == timeout) timeout = 0;
        this.update(hostname, callback, af, timeout);
        if (needQuery) {
            var _this = this;
            _this.start();
            BK.Misc.queryIPAddress(hostname, function(reason, af, iplist) {
                var callbacks = _this.query(hostname, af).callbacks;
                for (var i = 0; i < callbacks.length; i++) {
                    callbacks[i].call(_this, reason, af, iplist);
                }
                _this.delete(hostname);
            }, af, timeout);
        }
    }
    return new dns();
})();
