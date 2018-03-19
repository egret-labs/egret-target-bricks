import "../../../BK"


class TickerFunctor {
    target: any;
    callback: (ts: number, dt: number, target?: any)=> void;
    constructor(target: any, callback: (ts: number, dt: number, target?: any)=> void) {
        this.target = target
        this.callback = callback;
    }
}

class TimeoutTickerFunctor extends TickerFunctor {
    startTS: number;
    timeout: number;
    constructor(target: any, callback: (ts: number, dt: number, target?: any)=> void, timeout: number) {
        super(target, callback);
        this.startTS = BK.Time.timestamp * 1000;
        this.timeout = timeout;
    }
}

class IntervalTickerFunctor extends TickerFunctor {
    startTS: number;
    interval: number;
    constructor(target: any, callback: (ts: number, dt: number, target?: any)=> void, interval: number) {
        super(target, callback);
        this.startTS = BK.Time.timestamp * 1000;
        this.interval = interval;
    }
}

const MAX_TICKER_FUNCTORS_LEVEL: number = 7;

class Ticker {
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
    public paused: boolean = false;
    public totalDt: number = 0;
    public callTime: number = 0;
    public interval: number = 1;

    private callback: any = null;
    private functors: Array<TickerFunctor[]> = [];
    private intervals: Array<TickerFunctor[]> = [];

    constructor() {
        this.paused = false;
        this.totalDt = 0;
        this.callTime = 0;
        this.interval = 1;
        this.functors = new Array<TickerFunctor[]>(MAX_TICKER_FUNCTORS_LEVEL);
        for (let i = 0; i < MAX_TICKER_FUNCTORS_LEVEL; i++) {
            this.functors[i] = new Array<TickerFunctor>();
        }
        for (let i = 0; i < MAX_TICKER_FUNCTORS_LEVEL; i++) {
            this.intervals[i] = new Array<TickerFunctor>();
        }
    }

    setCallBack(callback: any): void {
        this.callback = callback;
    }

    add(callback: (ts: number, dt: number, target?: any)=> void, target: any): void {
        let functor = new TickerFunctor(target, callback);
        this.functors[0].push(functor);
    }

    remove(target): void {
        for (let i = 0; i < MAX_TICKER_FUNCTORS_LEVEL; i++) {
            for (let j = 0; j < this.functors[i].length; j++) {
                if (this.functors[i][j] != null) {
                    if (this.functors[i][j].target == target) {
                        this.functors[i][j] = null;
                    }
                }
            }
        }
    }

    private __getLevel(t: number): number {
        if (t <= 0)
            return 0;
        if (t > 0 && t <= 100) return 1;
        if (t > 100 && t <= 300) return 2;
        if (t > 300 && t <= 500) return 3;
        if (t > 500 && t <= 1000) return 4;
        if (t > 1000 && t <= 2000) return 5;
        return 6;
    }

    setTimeout(callback: (ts: number, dt: number, target?: any)=> void, timeout: number, target: any): void {
        let idx = this.__getLevel(timeout);
        let functor = new TimeoutTickerFunctor(target, callback, timeout);
        this.functors[idx].push(functor);
        this.functors[idx].sort(function (a: TickerFunctor, b: TickerFunctor) {
            let ta = <TimeoutTickerFunctor>(a);
            let tb = <TimeoutTickerFunctor>(b);
            if (ta.startTS + ta.timeout > tb.startTS + tb.timeout)
                return 1;
            return -1;
        });
    }

    removeTimeout(target: any): void {
        for (let i = 1; i < MAX_TICKER_FUNCTORS_LEVEL; i++) {
            this.functors[i] = this.functors[i].filter(functor => functor.target != target);
        }
    }

    setInterval(callback: (ts: number, dt: number, target?: any)=> void, interval: number, target: any): void {
        let idx = this.__getLevel(interval);
        let functor = new IntervalTickerFunctor(target, callback, interval);
        this.intervals[idx].push(functor);
        this.intervals[idx].sort(function (a: TickerFunctor, b: TickerFunctor) {
            let ta = <IntervalTickerFunctor>(a);
            let tb = <IntervalTickerFunctor>(b);
            if (ta.startTS + ta.interval > tb.startTS + tb.interval)
                return 1;
            return -1;
        });
    }

    removeInterval(target: any): void {
        for (let i = 1; i < MAX_TICKER_FUNCTORS_LEVEL; i++) {
            this.intervals[i] = this.intervals[i].filter(functor => functor.target != target);
        }
    }

    private __timeoutFunctorUpdate(idx: number, ts: number, dt: number): void {
        let functors = this.functors[idx].slice(0);
        while (functors.length > 0) {
            let functor = <TimeoutTickerFunctor>(functors[0]);
            let total = functor.startTS + functor.timeout;
            if (functor.startTS + functor.timeout > ts) {
                break;
            }
            if (!functor.target) {
                functor.callback(ts, dt);
            } else {
                functor.callback(ts, dt, functor.target);
            }
            functors.shift();
        }
        this.functors[idx] = functors;
    }

    private __intervalFunctorUpdate(idx: number, ts: number, dt: number): void {
        let intervals = this.intervals[idx].slice(0);
        intervals.forEach(function(functor: TickerFunctor) {
            let intervalFunctor = <IntervalTickerFunctor>(functor);
            if (intervalFunctor.startTS + intervalFunctor.interval <= ts) {
                if (!intervalFunctor.target) {
                    intervalFunctor.callback(ts, dt);
                } else {
                    intervalFunctor.callback(ts, dt, intervalFunctor.target);
                }
                intervalFunctor.startTS = BK.Time.timestamp * 1000;
            }
        });
    }

    update(ts, dt): void {
        if (this.paused == true) {
            return;
        }
        
        if (this.callback) {
            this.callback(ts, dt);
        }

        this.functors[0].forEach(function (functor: TickerFunctor) {
            if (functor) {
                if (!functor.target) {
                    functor.callback(ts, dt);
                } else {
                    functor.callback(ts, dt, functor.target);
                }
            }
        });

        if (this.functors[0].length > 0) {
            let functors = [];
            for (let i = 0; i < this.functors[0].length; i++) {
                if (this.functors[0][i] != null) 
                    functors.push(this.functors[0][i]);
            }
            this.functors[0] = functors;
        }

        for (let i = 1; i < MAX_TICKER_FUNCTORS_LEVEL; i++) {
            this.__timeoutFunctorUpdate(i, ts, dt);
        }

        for (let i = 1; i < MAX_TICKER_FUNCTORS_LEVEL; i++) {
            this.__intervalFunctorUpdate(i, ts, dt);
        }
    }
};

const MAX_DURATION_LEVEL: number = 6;

class TickerManager {
    public static readonly Instance: TickerManager = new TickerManager();
    private tickers: Ticker[] = [];
    private intervals: number[] = [];

    constructor() {
        for (let i = 0; i < MAX_DURATION_LEVEL; i++) {
            this.intervals[i] = 0;
        }
    }

    add(ticker: Ticker): void {
        this.tickers.push(ticker);
    }

    del(ticker: Ticker): void {
        this.tickers = this.tickers.filter(value => value != ticker);
    }


    update(ts: number, dt: number): void {
        this.tickers.forEach(function (ticker: Ticker) {
            ticker.callTime++;
            ticker.totalDt += dt;
            if (ticker.totalDt >= ticker.interval * 0.016) {
                ticker.update(ts, ticker.totalDt);
                ticker.totalDt = 0;
                ticker.callTime = 0;
            }
        }, this);
    }
};

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
    }

    bkTicker.prototype.setTickerCallBack = function (callback) {
        if (this.__ticker) {
            this.__ticker.setCallBack(callback);
        }
    }

    bkTicker.prototype.add = function (callback, target) {
        if (this.__ticker) {
            this.__ticker.add(callback, target);
        }
    }

    bkTicker.prototype.remove = function (target) {
        if (this.__ticker) {
            this.__ticker.remove(target);
        }
    }

    bkTicker.prototype.setTimeout = function (callback, timeout, target) {
        if (this.__ticker) {
            this.__ticker.setTimeout(callback, timeout, target);
        }
    }

    bkTicker.prototype.removeTimeout = function (target) {
        if (this.__ticker) {
            this.__ticker.removeTimeout(target);
        }
    }

    bkTicker.prototype.setInterval = function (callback, interval, target) {
        if (this.__ticker) {
            this.__ticker.setInterval(callback, interval, target);
        }
    }

    bkTicker.prototype.removeInterval = function (target) {
        if (this.__ticker) {
            this.__ticker.removeInterval(target);
        }
    }

    return bkTicker;
})();
