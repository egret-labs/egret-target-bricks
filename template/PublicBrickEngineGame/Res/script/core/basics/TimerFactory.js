var TimerFactory = new BK.Ticker();
TimerFactory.timerArray = [];
TimerFactory.interval = 1;
TimerFactory.createTimer = function(func,interval){
    var timer = new Object();
    timer.interval = interval;
    if(interval < 0){
        timer.interval = 1;
    }
    timer.callTime = 0;
    timer.isPaused = 0;
    timer.callback = func;
    
    timer.close = function(){
        var removeIdx = -1;
        for (var i = 0; i < TimerFactory.timerArray.length; i++) {
            var funcObj = TimerFactory.timerArray[i];
            if (funcObj && funcObj == timer) {
                removeIdx = i;
            }
        }
        if (removeIdx != -1) {
            TimerFactory.timerArray.splice(removeIdx,1);
        }
    }
    
    timer.pause = function(){
        timer.isPaused = 1;
    }
    
    timer.resume = function(){
        timer.isPaused = 0;
    }
    
    timer.start = function(){
        TimerFactory.timerArray.push(timer);
    }
    
    return timer;
}

TimerFactory.setTickerCallBack(function(ts,duration)
                              {
                              TimerFactory.timerArray.forEach(function(timer) {
                                                             var func = timer.callback;
                                                             if(func){
                                                             	if(timer.isPaused == 1){
                                                            		return;
                                                             	}
                                                            	timer.callTime ++;
                                                             	if(timer.callTime == timer.interval){
                                                             	func(ts,duration);
                                                             	timer.callTime = 0;
                                                             	}
                                                             }
                                                             }, this);
                              
                              });
