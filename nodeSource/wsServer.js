/*********************************************************
/ You should not have to edit below this point
/*********************************************************/

var sp = null;

var com = require("serialport");
var bufSize = 512;

function openSerial(portName) {
	console.log("Opening serialport "+portName);
	var ser = new com.SerialPort(portName, {
	  baudrate: 115200,
	  parser: com.parsers.readline('\r\n','binary'),
	  buffersize:bufSize
	});

	ser.on('open',function() {
		sp=ser;
		if(webSock) webSock.send("sp=ack");
	  sp.on('data', function(data) {
	    if(webSock) webSock.send(data);
	  });

	});

	ser.on('error', function(){
		console.log("Error from SerialPort");
		sp = null;
		if(webSock) webSock.send("sp=err");
	});
}

/*******************************************
// For websockets, require 'ws'.Server
********************************************/


var WebSocketServer = require('ws').Server, wss = new WebSocketServer({port: 8080});

//Tell the wsServer what to do on connnection to a client;

var webSock = null;

wss.on('connection', function(ws) {

	webSock = ws;
       console.log("connected");

    ws.on('message', function(message) {
			var spl = message.split("|");
    	switch(spl[0]){
				case "sp":
						if(!sp||!sp.isOpen()){
							openSerial(spl[1]);
						}
					break;
				case"r":
					if(sp) sp.write(message+"|");
					break;
				}
    });

	ws.on('close',function(){
		console.log("disconnected");
		webSock=null;

		if(sp) sp.close();
	});

	ws.on('error',function(error){
		webSock=null;
		console.log("Error: "+error);
	});

});

//////////////////////////////////////////
