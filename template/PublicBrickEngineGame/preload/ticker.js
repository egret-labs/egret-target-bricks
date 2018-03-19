
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var TickerFunctor = (function () {
    function TickerFunctor(target, callback) {
        this.target = target;
        this.callback = callback;
    }
    return TickerFunctor;
}());
var TimeoutTickerFunctor = (function (_super) {
    __extends(TimeoutTickerFunctor, _super);
    function TimeoutTickerFunctor(target, callback, timeout) {
        var _this = _super.call(this, target, callback) || this;
        _this.startTS = BK.Time.timestamp * 1000;
        _this.timeout = timeout;
        return _this;
    }
    return TimeoutTickerFunctor;
}(TickerFunctor));
var IntervalTickerFunctor = (function (_super) {
    __extends(IntervalTickerFunctor, _super);
    function IntervalTickerFunctor(target, callback, interval) {
        var _this = _super.call(this, target, callback) || this;
        _this.startTS = BK.Time.timestamp * 1000;
        _this.interval = interval;
        return _this;
    }
    return IntervalTickerFunctor;
}(TickerFunctor));
var MAX_TICKER_FUNCTORS_LEVEL = 7;
var Ticker = (function () {
    function Ticker() {
        /*
            multiple levels functors:
            0: base ticker functor
            1: 0 - 100ms timeout/interval ticker functor
            2: 100 - 300ms timeout/interval ticker functor
            3: 300 - 500ms timeout/interval ticker functor
            4: 500 - 1000ms timeout/interval ticker functor
            5: 1000 - 2000ms timeout/interval ticker functor
            6: 2000ms+ timeout/interval ticker functor
        */
        this.paused = false;
        this.totalDt = 0;
        this.callTime = 0;
        this.interval = 1;
        this.callback = null;
        this.functors = [];
        this.intervals = [];
        this.paused = false;
        this.totalDt = 0;
        this.callTime = 0;
        this.interval = 1;
        this.functors = new Array(MAX_TICKER_FUNCTORS_LEVEL);
        for (var i = 0; i < MAX_TICKER_FUNCTORS_LEVEL; i++) {
            this.functors[i] = new Array();
        }
        for (var i = 0; i < MAX_TICKER_FUNCTORS_LEVEL; i++) {
            this.intervals[i] = new Array();
        }
    }
    Ticker.prototype.setCallBack = function (callback) {
        this.callback = callback;
    };
    Ticker.prototype.add = function (callback, target) {
        var functor = new TickerFunctor(target, callback);
        this.functors[0].push(functor);
    };
    Ticker.prototype.remove = function (target) {
        for (var i = 0; i < MAX_TICKER_FUNCTORS_LEVEL; i++) {
            for (var j = 0; j < this.functors[i].length; j++) {
                if (this.functors[i][j] != null) {
                    if (this.functors[i][j].target == target) {
                        this.functors[i][j] = null;
                    }
                }
            }
        }
    };
    Ticker.prototype.__getLevel = function (t) {
        if (t <= 0)
            return 0;
        if (t > 0 && t <= 100)
            return 1;
        if (t > 100 && t <= 300)
            return 2;
        if (t > 300 && t <= 500)
            return 3;
        if (t > 500 && t <= 1000)
            return 4;
        if (t > 1000 && t <= 2000)
            return 5;
        return 6;
    };
    Ticker.prototype.setTimeout = function (callback, timeout, target) {
        var idx = this.__getLevel(timeout);
        var functor = new TimeoutTickerFunctor(target, callback, timeout);
        this.functors[idx].push(functor);
        this.functors[idx].sort(function (a, b) {
            var ta = (a);
            var tb = (b);
            if (ta.startTS + ta.timeout > tb.startTS + tb.timeout)
                return 1;
            return -1;
        });
    };
    Ticker.prototype.removeTimeout = function (target) {
        for (var i = 1; i < MAX_TICKER_FUNCTORS_LEVEL; i++) {
            this.functors[i] = this.functors[i].filter(function (functor) { return functor.target != target; });
        }
    };
    Ticker.prototype.setInterval = function (callback, interval, target) {
        var idx = this.__getLevel(interval);
        var functor = new IntervalTickerFunctor(target, callback, interval);
        this.intervals[idx].push(functor);
        this.intervals[idx].sort(function (a, b) {
            var ta = (a);
            var tb = (b);
            if (ta.startTS + ta.interval > tb.startTS + tb.interval)
                return 1;
            return -1;
        });
    };
    Ticker.prototype.removeInterval = function (target) {
        for (var i = 1; i < MAX_TICKER_FUNCTORS_LEVEL; i++) {
            this.intervals[i] = this.intervals[i].filter(function (functor) { return functor.target != target; });
        }
    };
    Ticker.prototype.__timeoutFunctorUpdate = function (idx, ts, dt) {
        var functors = this.functors[idx].slice(0);
        while (functors.length > 0) {
            var functor = (functors[0]);
            var total = functor.startTS + functor.timeout;
            if (functor.startTS + functor.timeout > ts) {
                break;
            }
            if (!functor.target) {
                functor.callback(ts, dt);
            }
            else {
                functor.callback(ts, dt, functor.target);
            }
            functors.shift();
        }
        this.functors[idx] = functors;
    };
    Ticker.prototype.__intervalFunctorUpdate = function (idx, ts, dt) {
        var intervals = this.intervals[idx].slice(0);
        intervals.forEach(function (functor) {
            var intervalFunctor = (functor);
            if (intervalFunctor.startTS + intervalFunctor.interval <= ts) {
                if (!intervalFunctor.target) {
                    intervalFunctor.callback(ts, dt);
                }
                else {
                    intervalFunctor.callback(ts, dt, intervalFunctor.target);
                }
                intervalFunctor.startTS = BK.Time.timestamp * 1000;
            }
        });
    };
    Ticker.prototype.update = function (ts, dt) {
        if (this.paused == true) {
            return;
        }
        if (this.callback) {
            this.callback(ts, dt);
        }
        this.functors[0].forEach(function (functor) {
            if (functor) {
                if (!functor.target) {
                    functor.callback(ts, dt);
                }
                else {
                    functor.callback(ts, dt, functor.target);
                }
            }
        });
        if (this.functors[0].length > 0) {
            var functors = [];
            for (var i = 0; i < this.functors[0].length; i++) {
                if (this.functors[0][i] != null)
                    functors.push(this.functors[0][i]);
            }
            this.functors[0] = functors;
        }
        for (var i = 1; i < MAX_TICKER_FUNCTORS_LEVEL; i++) {
            this.__timeoutFunctorUpdate(i, ts, dt);
        }
        for (var i = 1; i < MAX_TICKER_FUNCTORS_LEVEL; i++) {
            this.__intervalFunctorUpdate(i, ts, dt);
        }
    };
    return Ticker;
}());
;
var MAX_DURATION_LEVEL = 6;
var TickerManager = (function () {
    function TickerManager() {
        this.tickers = [];
        this.intervals = [];
        for (var i = 0; i < MAX_DURATION_LEVEL; i++) {
            this.intervals[i] = 0;
        }
    }
    TickerManager.prototype.add = function (ticker) {
        this.tickers.push(ticker);
    };
    TickerManager.prototype.del = function (ticker) {
        this.tickers = this.tickers.filter(function (value) { return value != ticker; });
    };
    TickerManager.prototype.update = function (ts, dt) {
        this.tickers.forEach(function (ticker) {
            ticker.callTime++;
            ticker.totalDt += dt;
            if (ticker.totalDt >= ticker.interval * 0.016) {
                ticker.update(ts, ticker.totalDt);
                ticker.totalDt = 0;
                ticker.callTime = 0;
            }
        }, this);
    };
    return TickerManager;
}());
TickerManager.Instance = new TickerManager();
;
BK.Ticker = (function () {
    function bkTicker() {
        this.__ticker = new Ticker();
        TickerManager.Instance.add(this.__ticker);
        Object.defineProperty(this, "paused", {
            "get": function () {
                return this.__ticker.paused;
            },
            "set": function (newValue) {
                this.__ticker.paused = newValue;
            }
        });
        Object.defineProperty(this, "interval", {
            "get": function () {
                return this.__ticker.interval;
            },
            "set": function (newValue) {
                this.__ticker.interval = newValue;
            }
        });
    }
    bkTicker.prototype.dispose = function () {
        if (this.__ticker) {
            TickerManager.Instance.del(this.__ticker);
            this.__ticker = null;
        }
    };
    bkTicker.prototype.setTickerCallBack = function (callback) {
        if (this.__ticker) {
            this.__ticker.setCallBack(callback);
        }
    };
    bkTicker.prototype.add = function (callback, target) {
        if (this.__ticker) {
            this.__ticker.add(callback, target);
        }
    };
    bkTicker.prototype.remove = function (target) {
        if (this.__ticker) {
            this.__ticker.remove(target);
        }
    };
    bkTicker.prototype.setTimeout = function (callback, timeout, target) {
        if (this.__ticker) {
            this.__ticker.setTimeout(callback, timeout, target);
        }
    };
    bkTicker.prototype.removeTimeout = function (target) {
        if (this.__ticker) {
            this.__ticker.removeTimeout(target);
        }
    };
    bkTicker.prototype.setInterval = function (callback, interval, target) {
        if (this.__ticker) {
            this.__ticker.setInterval(callback, interval, target);
        }
    };
    bkTicker.prototype.removeInterval = function (target) {
        if (this.__ticker) {
            this.__ticker.removeInterval(target);
        }
    };
    return bkTicker;
})();
