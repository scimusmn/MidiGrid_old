/*function wsClient(){
	var ws=null;
	var connectInterval;
	
	var self =this;
	
	var addr = "ws://localhost:8080/";
	
	var customCB = null;

	this.connect = function(){
        if ("WebSocket" in window){
            ws = new WebSocket(addr); //ws://echo.websocket.org is the default testing server
            
            ws.onopen = function()
            {
                // Web Socket is connected, send data using send()
                clearInterval(connectInterval);
                if(customCB) ws.onmessage = customCB
                    
                    else ws.onmessage = function (evt) {
                        //console.log(evt.data);
                    };
                ws.send("test");
                
            };
            
            ws.onerror = function ( error ) {
                if ("WebSocket" in window) connectInterval = setInterval(this.connect,2000);
            }
            
            ws.onclose = function(){
                // websocket is closed.
                //alert("Connection is closed...");
                connectInterval = setInterval(self.connect.bind(self),2000);
            };
        }
	}
	
	this.connect();
	
	this.setMsgCallback = function(cb){
		customCB = cb;
		if(ws) ws.onmessage = cb;
	}
	
    this.send = function(msg){
        if(ws) ws.send(msg);
    }
}

var webSockClient = new wsClient();*/

function wsClient(){
    }

	var ws=null;

	wsClient.connectInterval;

	var addr = "ws://localhost:8080/";

	var customCB = null;

	wsClient.connect = function(connectCB){
        if ("WebSocket" in window){
            ws = new WebSocket(addr); //ws://echo.websocket.org is the default testing server

            ws.onopen = function()
            {
                // Web Socket is connected, send data using send()
                clearInterval(wsClient.connectInterval);
                if(customCB) ws.onmessage = customCB
                else ws.onmessage = function (evt) {
                    //console.log(evt.data);
                };
       			if(connectCB) connectCB(),"connected";
            };

            ws.onerror = function ( error ) {
                if ("WebSocket" in window) wsClient.connectInterval = setInterval(this.connect,2000);
            }

            ws.onclose = function(){
                // websocket is closed.
                //alert("Connection is closed...");
                wsClient.connectInterval = setInterval(wsClient.connect,2000);
            };
        }
       else {
       		clearInterval(wsClient.connectInterval);
       		console.log("Websocket not supported");
       }
	}

	wsClient.setMsgCallback = function(cb){
		customCB = cb;
		if(ws) ws.onmessage = cb;
	}

    wsClient.send = function(msg){
        if(ws) ws.send(msg);
    }