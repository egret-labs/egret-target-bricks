
function FSMState(stateType, enterHandler, exitsHandler, updateHandler)
{
    this.stateType = stateType;
    this.enterHandler = enterHandler;
    this.exitsHandler = exitsHandler;
    this.updateHandler = updateHandler;
}

function FSMStateManager()
{
    this.bindObject      = undefined;
    this.currentState = undefined;
    this.previousState = undefined;
    this.FSMStateSet   = [];
    this.setCurrentState = function (stateType)
    {
        if(this.currentState)
        {
            if(this.currentState.exitsHandler)
            {
                this.currentState.exitsHandler(this.bindObject,this.currentState);
            }
            this.previousState = this.currentState;            
        }
        for (var idx = 0; idx < this.FSMStateSet.length; idx++) {
            var state = this.FSMStateSet[idx];
            if(state.stateType == stateType)
            {
                this.currentState = state;
                if(this.currentState.enterHandler)
                {
                    this.currentState.enterHandler(this.bindObject,this.currentState);
                }
            }
        }
    }
    this.processState  = function ()
    {
        if(this.currentState)
        {
            if(this.currentState.updateHandler)
            {
                this.currentState.updateHandler(this.bindObject,this.currentState);
            }
        }
    }
}


var FSM = {
    ObjectSet:[],
    addState : function (object,state)
    {
        if(!object.stateManger)
        {
            var manager = new FSMStateManager
            manager.bindObject = object;
            object.stateManger = manager;


            //为object添加setCurrentState函数
            object.setCurrentState = function (stateType)
            {
                object.stateManger.setCurrentState(stateType);
            }
        }
        object.stateManger.FSMStateSet.push(state);
        FSM.ObjectSet.push(object);
    },
    newState : function (stateType, enterHandler, exitsHandler, updateHandler)
    {
        return new FSMState(stateType, enterHandler, exitsHandler, updateHandler);
    }
};

var t = new BK.Ticker();
t.interval = 1;
t.setTickerCallBack(function(ts,duration)
{   
    for (var idx = 0; idx < FSM.ObjectSet.length; idx++) {
        var obj = FSM.ObjectSet[idx];
        obj.stateManger.processState();
    }
});


//用法
// var node = {};
// var state =  FSM.newState(0,
//     function(){
//         BK.Script.log(0,0,"begin !!!!");
//     },null,
//     function(){
//         BK.Script.log(0,0,"node update!!!!");
//     });
// var state2 =  FSM.newState(1,
//     function(){
//         BK.Script.log(0,0,"begin 2!!!!");
//     },function(){
//         BK.Script.log(0,0,"end 2!!!!");
//     },
//     function(){
//         BK.Script.log(0,0,"update 2!!!!");
//         count = count +1;
//         if(count > 30)
//         {
//             node.setCurrentState(2);
//         }
//         // BK.Script.log(0,0,"node2 update!!!!");
//     });
// var state3 =  FSM.newState(2,
//     function(){
//         BK.Script.log(0,0,"begin 3!!!!");
//     },function(){
//         BK.Script.log(0,0,"end 3!!!!");
//     },
//     function(){
//         BK.Script.log(0,0,"update 3!!!!");
//         // BK.Script.log(0,0,"node2 update!!!!");
//     });

// FSM.addState(node,state);
// FSM.addState(node,state2);
// FSM.addState(node,state3);

// node.setCurrentState(0);
// node.setCurrentState(1);


