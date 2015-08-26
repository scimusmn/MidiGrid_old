function pointTrace(elem){
	this.canvas = elem;
	var ctx = this.canvas.getContext("2d");

	var self = this;
	var traceWidth = 3;

	this.width;
	this.height;

	var getString = function (attr) {
		return elem.getAttribute(attr);
	}

	var getNum = function (attr) {
		return parseInt(getString(attr));
	}

	this.gauge = new tempGraph($(getString("temp")));

	var graph = new smmGraph();


	graph.bot = function(){
		return this.y+this.h;
	};


	ctx.globalCompositeOperation = "lighter";

	//graph.setScale({min:250,max:1023.},{min:0,max:18},{min:102,max:920},{min:0,max:200});

	graph.setup(this.canvas.querySelector(".graph"));

	this.addPoint = function(pnt){
		//self.points.addPoint(scalePoint(pnt));
		graph.addPoint(pnt);
		self.autoClear(.98);

		//console.log(graph.transPoint());
	}

	this.lastPoint = function () {
		return graph.lastPoint();
	}

	var lowBool = false;

	this.autoClear = function (thresh) {
		if (graph.points.last().x > thresh) lowBool = true;
		else if ( lowBool) {
			lowBool = false;
			this.clear();
		}
	}

	this.efficiency = function () {
		graph.efficiency();
		return (1-graph.energyTot/graph.energyIn)*100;
	}

	this.color="#f00";

	elem.refresh = function(){
		var wid = elem.clientWidth;
		self.canvas.width=wid;
		var hgt = elem.clientHeight;
		self.canvas.height=hgt;
		self.width=wid;
		self.height=hgt;
		graph.w = wid*.80;
		graph.h = hgt*.75;
		graph.x = (wid-graph.w-traceWidth)/2*1.5;
		graph.y = (hgt-graph.h)/2;

		self.gauge.refresh();
	}

	var ave = new aveCont();
	graph.fontColor = "#666";
	graph.lineColor = "#333";
	graph.lineWidth = "2";
	graph.frameColor = "#666";
	graph.frameWidth = "2px";

	graph.energyIn = 0;
	graph.energyOut = 0;
	graph.energyTot = 0;

	graph.efficiency = function () {
		graph.energyIn = 0;
		graph.energyOut = 0;
		graph.energyTot = 0;
		for (var i = 0; i < graph.points.length-1; i++) {
			var diff = graph.points[i].x - graph.points[i + 1].x;
			var aPlusB = (graph.points[i].y + graph.points[i + 1].y)/2;
			if(sign(diff)>0) graph.energyOut-=diff*aPlusB;
			else if(sign(diff)<0) graph.energyIn+=diff*aPlusB;
			graph.energyTot+=diff*aPlusB;
		}
		console.log("Energy in was: "+graph.energyIn);
		console.log("Energy out was: "+graph.energyOut);
		console.log("Efficiency was: "+(1-graph.energyTot/graph.energyIn));
	}

	graph.customBGDraw = function(){
		var ctx = this.getContext("2d");
		var wid=this.width;
		var hgt=this.height;

		var sectAve=0;
		var lastPos={x:0,y:0};
		var firstPos={x:0,y:0};

		ctx.beginPath();
		ctx.fillStyle = "#fff";
		ctx.rect(x,y,wid,hgt);
		ctx.closePath();
		ctx.fill();

		for (var i = 0; i < graph.points.length - 1; i++) {
			ave.addSample((graph.points[i].x - graph.points[i + 1].x));
			ctx.fillStyle = ctx.strokeStyle;
			if (!sectAve) {
				ctx.beginPath();
				ctx.moveTo(graph.points[i].x * wid, hgt);
				ctx.lineTo(graph.points[i].x * wid, graph.points[i].y * hgt);
				firstPos = graph.points[i];
				lastPos = graph.points[i];
			}
			if (sign(ave.ave) == sectAve) {
				if (sign(ave.ave) == sign(graph.points[i].x - graph.points[i + 1].x)) {
					ctx.lineTo(graph.points[i].x * wid, graph.points[i].y * hgt);
					lastPos = graph.points[i];
					//ctx.globalAlpha = i / graph.points.length;
				}
			}
			else {
				if (sectAve < 0) ctx.fillStyle = "#49f";//"#aaa";//
				else ctx.fillStyle = "#f44";
				ctx.lineTo(lastPos.x * wid, hgt);
				ctx.fill();
				ctx.closePath();
				ctx.beginPath();
				ctx.moveTo(graph.points[i].x * wid, hgt);
				ctx.lineTo( graph.points[i].x * wid, graph.points[i].y * hgt);
				sectAve = sign(ave.ave);
			}

		}
		if (sectAve < 0) ctx.fillStyle = "#49f";//"#333";//
		else ctx.fillStyle = "#f44";//"#ccc";//
		ctx.lineTo(lastPos.x * wid,hgt);
		ctx.fill();
	};

	this.draw = function(){
		this.canvas.width=this.width;				//clear the canvas.

		if(graph.points.length) this.gauge.draw(this.lastPoint());


		//graph.drawColorIntegral(ctx);
		//graph.draw(ctx);
		ctx.drawImage(graph);

		//var em1 = window.innerHeight/100;

		 var label = this.canvas.getAttribute("title");
		ctx.font = "lighter 2.5vh sans-serif";
		ctx.fillStyle = "#666";
		var txtSz = ctx.measureText(label);
		ctx.fillText(label,graph.x+(graph.w-txtSz.width)/2,graph.y-parseInt(ctx.font)/2);

		ctx.font = "lighter 2.5vh sans-serif";
		var xLabel = "Air Volume (Cubic Inches)";
		ctx.fillStyle = "#666";
		txtSz = ctx.measureText(xLabel);
		ctx.fillText(xLabel,graph.x+(graph.w-txtSz.width)/2,2*parseInt(ctx.font)+graph.bot());

		ctx.font = "lighter 2.5vh sans-serif";
		var yLabel = "Pressure in Cylinder (PSI)";
		ctx.fillStyle = "#666";
		txtSz = ctx.measureText(yLabel);
		ctx.save();
		ctx.translate(graph.x-2.5*parseInt(ctx.font),graph.y+(graph.h+txtSz.width)/2);
		ctx.rotate(3*Math.PI/2);
		ctx.fillText(yLabel,0,0);
		ctx.restore();
	};

	this.clear = function(){
		graph.clear();
		this.gauge.clear();
	}

}
