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
			$("cool").refresh();
			$("warm").refresh();
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

	app.onMessage = function(evt){
		var msg = evt.data;
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
			cool.addPoint({x:(ray[0]),y:(ray[1])});
			warm.addPoint({x:(ray[0]),y:(ray[1])});
		}
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
	$("$web-socket").customCallback = app.onMessage;

	//wsClient.connect();
}(window.app = window.app || {}));
