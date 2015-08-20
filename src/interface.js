(function (app){
	var drawTimer;
	var refreshRate = 30; //fps

	var cool = new pointTrace($("cool"));
	var warm = new pointTrace($("warm"));

	var coolCont = compCont($("coolCont"));
	var warmCont = compCont($("warmCont"));
	var botTray = bottomTray($("dualInst"));

	coolCont.bind(warmCont,cool,warm);

	setMoves(coolCont);
	setMoves(warmCont);

	$("cool").refresh();
	$("warm").refresh();

	$("#reset").onmousedown = function () {
		focii.reset();
		$("#reset").style.display = "none";
	}

	document.onkeydown = function (e) {
		switch (e.which) {
			case charCode('C'):				//if the send button was pressed
				if(warmCont.hasFocus) warmCont.loseFocus(function(){
						coolCont.focus();
						});
				else coolCont.focus();
				break;
			case charCode('R'):				//if the send button was pressed
				var on=false;
				break;
			case charCode('E'):				//if the send button was pressed
			$("#coolEff").innerHTML = cool.efficiency();
			$("#warmEff").innerHTML = warm.efficiency();
				break;
			case charCode('W'):				//if the send button was pressed
				if(coolCont.hasFocus) coolCont.loseFocus(function () {
						warmCont.focus();
					});
				else warmCont.focus();
				break;
			case charCode('B'):				//if the send button was pressed
				console.log(coolCont.hasFocus);
				if(coolCont.hasFocus) coolCont.loseFocus();
				if(warmCont.hasFocus) warmCont.loseFocus();
				break;
			// case charCode('O'):				//if the send button was pressed
			// 	$("$web-arduino").digitalWrite(13,0);
			// 	break;
			case charCode('O'):				//if the send button was pressed
				$("$web-arduino").digitalWrite(13,0);
				break;
			case charCode('L'):				//if the send button was pressed
				$("$web-arduino").digitalWrite(13,1);
				break;
			case 32:
				cool.clear();
				warm.clear();
				warmTemp.clear();
				break;
			default:
				break;
		}
	}

	var inc =0;

	var pins = [];
	for (var i = 0; i < 4; i++) {
		pins.push({val:0,isNew:false});
	}

	/*app.onMessage = function(evt){
		var msg = evt.data;
		var ray=[];
		//console.log(msg);
		var msg = evt.data;
		for(var i=0; i<msg.length-1; i++){
			var chr = msg.charCodeAt(i);
			if(chr&192){  //if the packet is analogRead
				var pin = ((chr & 56)>>3);				//extract the pin number
				var val = ((chr & 7)<<7)+(msg.charCodeAt(++i)&127); //extract the value
				//console.log(val);
				pins[pin].val = val;
				pins[pin].isNew = true;
			}
			else if(chr&128){			//if the packet is digitalRead
				var pin = ((chr & 62)>>1);
				var val = chr&1;
			}
		}
		if(pins[0].isNew&&pins[1].isNew){
			cool.addPoint({x:pins[0].val,y:pins[1].val});
			pins[0].isNew=pins[1].isNew=false;
		}
		if(pins[2].isNew&&pins[3].isNew){
			warm.addPoint({x:pins[2].val,y:pins[3].val});
			pins[2].isNew=pins[3].isNew=false;
		}
	}*/
	function setReport(j,interval,last) {
		$("$web-arduino").analogReport(j,500,function (pin,val) {
			pins[pin] = val;
			pins[pin].isNew=true;
			console.log("pin is "+pin);

			if((!(pin%2))&&pins[pin].isNew&&pins[pin+1].isNew){
				var graph = ((pin)?warm:cool);
				graph.addPoint({x:pins[pin].val,y:pins[pin+1].val});
				pins[pin].isNew=pins[pin+1].isNew=false;
			}
		});

		if(j<last){ setTimeout(function(){setReport(j+1,interval,last);},50);}
	}

	$("$web-socket").onArduinoConnect = function () {
		setReport(0,1000/refreshRate,3);
	}

	app.draw = function(){
		cool.draw();
		warm.draw();

		//if(warm.lastPoint()!==undefined) warmTemp.draw(warm.lastPoint());
	}

	window.onresize = function (x,y) {
		$("cool").refresh();
		$("warm").refresh();
	}

	window.onresize();

	drawTimer = setInterval(app.draw, 1000/refreshRate);

	//wsClient.setMsgCallback(app.onMessage);
	//$("$web-socket").customCallback = app.onMessage;


	//wsClient.connect();
}(window.app = window.app || {}));
