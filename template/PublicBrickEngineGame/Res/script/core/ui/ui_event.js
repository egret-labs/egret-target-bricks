BK.Script.log(0,0,"Load ui event.js");

UI_NODE_ENENT_TOUCH_DOWN   = 1000
UI_NODE_ENENT_TOUCH_UP     = 1001
UI_NODE_ENENT_TOUCH_DOWN_INSIDE = 1002
UI_NODE_ENENT_TOUCH_UP_INSIDE = 1003

UI_NODE_ENENT_TOUCH_BEGIN = 1;
UI_NODE_ENENT_TOUCH_MOVED = 2;
UI_NODE_ENENT_TOUCH_END   = 3;

function TouchEventHandler ()
{
     this.eveFuncTb = [];
     this._eventMap = {
        1 :[], 
        2 :[],  
        3 :[]
     }

    this.nodeTreeHittest = function (node,pt)
    {
        if(node.canUserInteract == true && node.hidden == false)
        {
            if (node.children) 
            {
                var children = node.children;
                //index大的优先响应
                for (var index = children.length-1; index >= 0; index--) 
                {
                    var child = children[index];
                    var hitNode =  this.nodeTreeHittest(child,pt)
                    if(hitNode!=undefined){
                        return hitNode;
                    }
                }
            }
            var hit = node.hittest(pt);
            if(hit == true)
            {
                return node;
            } 
            else
            {
                return undefined;
            }
        }else{
            return undefined;
        }
    } 

    this.treeHittest = function (pt)
    {
        return this.nodeTreeHittest(BK.Director.root,pt);
    }

	 this.addNodeEvent =  function ( node,event,callbackFunc )
     {
         var  eveFuncObj = {};
         eveFuncObj["obj"] = node;
         eveFuncObj["func"]  = callbackFunc;
         

         var hasSame = false;
         for(var i  = 0 ; i< this._eventMap[event].length; i++)
         {
             var eFO =  this._eventMap[event][i];
            if(eFO["obj"] == node)
            {
                hasSame = true;
            }
         }
         if(hasSame == false)
         {
            BK.Script.log(1,0,"Add Node Event :" + event );
            this._eventMap[event].push(eveFuncObj);
            
         }else{
             BK.Script.log(1,0,"Add Same Node Event has added Event Before." );
        }
     }

     this.removeNodeEvent =function (node,event) {
         var removeIdx = -1;
         for(var i  = 0 ; i< this._eventMap[event].length; i++)
         {
             var eFO =  this._eventMap[event][i];
            if(eFO["obj"] == node)
            {
                removeIdx = i;
            }
         }

         if(removeIdx >= 0 )
         {
            this._eventMap[event].splice(removeIdx,1);
            BK.Script.log(1,0,"Remove Node Event Succeed!" );
         }
     }
     
     this.triggerEvent = function (node,event,x,y)
     {
        for(var i  = 0 ; i< this._eventMap[event].length; i++)
        {
            var eFO =  this._eventMap[event][i];
            if(node &&eFO["obj"] == node)
            {
                var func = eFO["func"];
                if(func)
                {
                    func(node,event,x,y);
                }else{
                }
            }
        }
     }
     this.triggerAllNodeEvent = function (event)
     {
         for(var i  = 0 ; i< this._eventMap[event].length; i++)
         {
            var eFO =  this._eventMap[event][i];
            var func = eFO["func"];
            var node = eFO["obj"];
            if(func)
            {
                func(node,event);
            }
        }
     }
    
     this.isFirstTouchDown = -1;

     this.currentNode = undefined;

     this.detectGesture = function () {
        var touchArr = BK.TouchEvent.getTouchEvent();
        if(touchArr == undefined){
            return;
        }
        for(var i=0;i<touchArr.length;i++){
            var x = touchArr[i].x;
            var y = touchArr[i].y;
             BK.Script.log(0,0,"detectGesture ! idx:"+ i +" status:"+ touchArr[i].status +" id:"+ touchArr[i].id + " x:" + x + " y:"+y );
            
            //touch begin
            if(touchArr[i].status == 2 )
            {
                if(this.isFirstTouchDown == -1)
                {
                    BK.Script.log(0,0,"detectGesture begin is first id:"+ touchArr[i].id + " x:" + x + " y:"+y );
                    this.isFirstTouchDown = touchArr[i].id;
                    
                    var node = this.treeHittest({x:x,y:y});
                    if(node){       
                        BK.Script.log(0,0,"detectGesture node is ok id:"+ touchArr[i].id + " x:" + x + " y:"+y );
                        this.currentNode = node;
                        this.triggerEvent(this.currentNode,UI_NODE_ENENT_TOUCH_BEGIN,x,y);
                        BK.Script.log(0,0,"detectGesture node! begin id:"+ touchArr[i].id + " x:" + x + " y:"+y );
                    }else{
                        this.currentNode = undefined;
                    }
                }else{
                    BK.Script.log(0,0,"detectGesture begin not first id:"+ touchArr[i].id + " x:" + x + " y:"+y );
                }
            }
            //touch moved
            else if(touchArr[i].status == 3 ) 
            {
                BK.Script.log(0,0,"detectGesture moved!!!")
                if(this.isFirstTouchDown != -1 && touchArr[i].id == this.isFirstTouchDown)
                {
                    if(this.currentNode){
                        this.triggerEvent(this.currentNode,UI_NODE_ENENT_TOUCH_MOVED,x,y);
                    }
                }
            }
            //touch end
            else if(touchArr[i].status == 1 ) 
            {
                if(this.isFirstTouchDown != -1 && touchArr[i].id == this.isFirstTouchDown)
                {
                    this.isFirstTouchDown = -1;
                    if(this.currentNode){
                        this.triggerEvent(this.currentNode,UI_NODE_ENENT_TOUCH_END,x,y);
                        this.currentNode = undefined;        
                    }
                }
            }
        }
        BK.TouchEvent.updateTouchStatus();
     }
};


UIEventHandler = new TouchEventHandler();


BK.Director.ticker.add(function(ts,du)
                       {
                       if(UIEventHandler){
                           UIEventHandler.detectGesture();
                       }
                       });

