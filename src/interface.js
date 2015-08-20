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

	function setReport(pinNum,interval,last) {
		$("$web-arduino").setAnalogHandler(pinNum,function (pin,val) {
			pins[pin].val = val;
			pins[pin].isNew=true;
			if(((pin%2)==0)&&pins[pin].isNew&&pins[pin+1].isNew){
				var graph = ((pin)?warm:cool);
				graph.addPoint({x:pins[pin].val,y:pins[pin+1].val});
				pins[pin].isNew=pins[pin+1].isNew=false;
			}
		});

		if(pinNum<last){ setTimeout(function(){setReport(pinNum+1,interval,last);},50);}
	}

	$("$web-socket").onArduinoConnect = function () {
		setReport(0,100,3);
	}

	app.draw = function(){
		cool.draw();
		warm.draw();
	}

	window.onresize = function (x,y) {
		$("cool").refresh();
		$("warm").refresh();
	}

	window.onresize();

	drawTimer = setInterval(app.draw, 1000/refreshRate);

}(window.app = window.app || {}));
