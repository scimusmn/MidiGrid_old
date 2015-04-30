(function (app){

	var blinkState = 0;
	var drawTimer;
	var refreshRate = 20; //fps
	
	var cool = new pointTrace($("cool"));
	var warm = new pointTrace($("warm"));
	
	warm.resize(window.innerWidth*.50,window.innerHeight*.75);
	cool.resize(window.innerWidth*.50,window.innerHeight*.75);
	warm.canvas.style.top=cool.canvas.style.top;
	warm.canvas.style.left=cool.width+cool.canvas.style.left;
 
    /*$("button").onmousedown = function(e){
        e.preventDefault();
        arduino.digitalWrite(13,1);
        console.log("clicked");
    }*/
	
	/*$("button").onmouseup = function(){
        arduino.digitalWrite(13,0);
	}*/

	document.onkeydown = function (e) {
		switch (e.which) {
			case charCode('S'):				//if the send button was pressed
				//webSockClient.send("PING");
				break;
			case charCode('B'):				//if the send button was pressed
				blinkState = ((blinkState) ? 0 : 1);
				//webSockClient.send("digitalWrite(13,"+blinkState+")");
				break;
			case 56:
				//webSockClient.send("watchPin("+(e.which-48)+")");
				break;
			case 49:
				//webSockClient.send("analogReport(0,20)");
				break;
			case 50:
				//webSockClient.send("stopReport(0)");
				break;
			case 32:
				cool.clear();
				break;
			default:
				break;
		}
	}
	
	var inc =0;
	
	app.onMessage = function(evt){
		var msg = evt.data;
		/*var dataRay = evt.data.split(/[\s,()=]+/);
		//console.log(evt.data);
		switch(dataRay[0]){
			case "pinChange":
				$("titleLine").innerHTML = "Pin "+dataRay[1]+" is "+((extractNumber(dataRay[2]))?"HIGH":"LOW");
				cool.clear();
				break;
			case "analogRead":
				//$("analogLine").innerHTML = "Pin "+dataRay[1]+" is "+extractNumber(dataRay[2]);
				cool.addPoint({x:extractNumber(dataRay[2])/1024.,y:(Math.cos(inc)+1)/2});
				console.log("cos(inc)="+((Math.cos(inc)+1)/2)+"  inc="+inc);
				inc+=Math.PI/100.;
				if(inc>Math.PI*2) inc=0;
				break;
			default:
				//console.log(evt.data);
				break;
		}*/
		var ray=[];
		//console.log(msg);
		for(var i=0; i<msg.length-1; i++){
			var chr = msg.charCodeAt(i);
			//console.log(chr);
			if(chr&64&&i<msg.length-2){
				//if(chr & 64){
					ray[((chr & 48)>>4)]=((chr & 15)<<6)+(msg.charCodeAt(i+1)&63)
					//console.log("Pin " + ((chr & 48)>>4) + " is "+(((chr & 15)<<6)+(msg.charCodeAt(i+1)&63)));
				//}
				i++;
			}
		}
		if(!isNaN(ray[0])&&!isNaN(ray[1])){
			cool.addPoint({x:(ray[0]*1)/1024.,y:(ray[1]*1)/1024.});
			warm.addPoint({x:(ray[0]*1)/1024.,y:(ray[1]*1)/1024.});
		}
		//console.log("Pin 0 is "+ray[0]);
		//console.log("Pin 1 is "+ray[1]);
		//console.log("end of message");
	}
	
	app.draw = function(){
		cool.draw(0,0);
		warm.draw(0,0);
	}
	
	drawTimer = setInterval(app.draw, 1000/refreshRate);
	
	wsClient.setMsgCallback(app.onMessage);
	
	wsClient.connect();
}(window.app = window.app || {}));