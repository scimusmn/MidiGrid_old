// Set the name of the serial port here:
var portName = "/dev/tty.usbmodemfd121";


/*********************************************************
/ You should not have to edit below this point
/*********************************************************/



/*******************************************
// For websockets, require 'ws'.Server
********************************************/


var WebSocketServer = require('ws').Server, wss = new WebSocketServer({port: 8080});

//Tell the wsServer what to do on connnection to a client;

var webSock = null;
var sp = null;

wss.on('connection', function(ws) {

	webSock = ws;
       console.log("connected");

    ws.on('message', function(message) {
			var spl = message.split("=");
    	switch(message.split("=")[0]){
				case "sp":
						if(!sp||sp.isOpen())
					break;
				}

		if(sp) sp.write(message+"|");
		console.log(message);
    });

	ws.on('close',function(){
		webSock=null;
		if(sp)
	});

	ws.on('error',function(error){
		webSock=null;
		console.log("Error: "+error);
	});

});

////////////////////////////////////////////////////////
// Use the cool library                               //
// git://github.com/voodootikigod/node-serialport.git //
// to read the serial port where arduino is sitting.  //
////////////////////////////////////////////////////////
var com = require("serialport");
var bufSize = 512;

sp = new com.SerialPort(portName, {
    baudrate: 9600,
    parser: com.parsers.readline('\r\n'),
    buffersize:bufSize,
    encoding:'iso-8859-1'
  });


sp.on('open',function() {
  sp.on('data', function(data) {
    if(webSock) webSock.send(data);
    //console.log(data);
    //for(var i=0; i<data.length; i++){
	//	console.log(data.charCodeAt(i));
    //}
  });

  /*function writeThenDrainThenWait(duration) {
    console.log('Calling write...');
    sp.write(message, function() {
      console.log('...Write callback returned...');
      // At this point, data may still be buffered and not sent out from the port yet (write function returns asynchrounously).
      console.log('...Calling drain...');
      sp.drain(function() {
        console.log('...Drain callback returned...');
        console.log('...Waiting', duration, 'milliseconds...');
        setInterval(writeThenDrainThenWait, duration);
      });
    });
  };



  // Stuff starts happening here
  writeThenDrainThenWait(1000);*/
  //writeThenWait(1000);

});
