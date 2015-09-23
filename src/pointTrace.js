include(["src/smm_graph.js","src/tempGraph.js"],function(){
	console.log("trace loaded");
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

	//var graph = new smmGraph();

	var graph = $(".graph",this.canvas.parentElement);

	this.graph =$(".graph",this.canvas.parentElement);
	//graph.style.display = "none";

	graph.bot = function(){
		return this.y+this.height;
	};


	ctx.globalCompositeOperation = "lighter";

	elem.addPoint = function(pnt){
		graph.addPoint(pnt);
		self.autoClear(.95);
	}

	elem.newValue = function (val,which) {
		graph.newValue(val,which);
		self.autoClear(.95);
	}

	this.lastPoint = function () {
		return graph.lastPoint();
	}

	var lowBool = false;

	this.autoClear = function (thresh) {
		if (graph.points.length&&graph.points.last().x > thresh) lowBool = true;
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
		graph.width = wid*.80;
		graph.height = hgt*.75;
		graph.x = (wid-graph.width-traceWidth)/2*1.5;
		graph.y = (hgt-graph.height)/2;

		self.gauge.refresh();
	}

	var ave = new aveCont();
	graph.fontColor = "#000";
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
		if(this.points.length>1){
			var ctx = this.getContext("2d");
			var wid=this.width;
			var hgt=this.height;

			var sectAve=0;
			var lastPos={x:0,y:0};
			var firstPos={x:0,y:0};

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
		}
	};

	graph.customFGDraw = function () {
		var self =this;
		var ctx = this.getContext("2d");
		if(self.points.length){
			ctx.strokeStyle = "#000";
			ctx.fillStyle = "#ff0";
			ctx.lineWidth=this.lineWidth;
			ctx.beginPath();
			ctx.arc(self.points.last().x*this.width,self.points.last().y*this.height,5,0,2*Math.PI);
			ctx.stroke();
			ctx.fill();
			ctx.closePath();

			ctx.fillStyle = "#000";
			ctx.beginPath();
			ctx.arc(self.points.last().x*this.width,self.points.last().y*this.height,1,0,2*Math.PI);
			ctx.fill();
			ctx.closePath();
		}
	}

	this.drawXLabels = function () {
		var txtSz;
		var xDiv=graph.range.x.divs/2;
		var min = graph.range.x.min;
		var max = graph.range.x.max;
		for(var i=0; i<xDiv; i++){
			var lbl = ""+(min*1+i*(max-min)/xDiv);
			txtSz = ctx.measureText(lbl);
			ctx.fillText(lbl,graph.x+i*graph.width/xDiv-txtSz.width/2,parseInt(ctx.font)+graph.y+graph.height);
		}
	};

	this.drawYLabels = function () {
		var txtSz;
		var yDiv=graph.range.y.divs/2;
		var min = graph.range.y.min;
		var max = graph.range.y.max;
		for(var i=0; i<yDiv+1; i++){
			var lbl = (""+(max*1+i*(min-max)/yDiv)).split(".")[0];
			txtSz = ctx.measureText(lbl);
			ctx.fillText(lbl,graph.x-(txtSz.width+5),graph.y+i*graph.height/yDiv+parseInt(ctx.font)/2);
		}
	}

	this.draw = function(){
		graph.draw();
		this.canvas.width=this.width;				//clear the canvas.

		if(graph.points.length) this.gauge.draw(this.lastPoint());


		//graph.drawColorIntegral(ctx);
		//graph.draw(ctx);
		ctx.drawImage(graph,parseInt(graph.x),parseInt(graph.y),parseInt(graph.width),parseInt(graph.height));

		//var em1 = window.innerHeight/100;

		 var label = this.canvas.getAttribute("title");
		ctx.font = "lighter 3vh sans-serif";
		ctx.fillStyle = "#666";
		var txtSz = ctx.measureText(label);
		ctx.fillText(label,Math.floor(graph.x+(graph.width-txtSz.width)/2),Math.floor(graph.y-parseInt(ctx.font)/2));

		ctx.font = "lighter 3vh sans-serif";
		var xLabel = "Air Volume (Cubic Inches)";
		ctx.fillStyle = "#666";
		txtSz = ctx.measureText(xLabel);
		ctx.fillText(xLabel,graph.x+(graph.width-txtSz.width)/2,2*parseInt(ctx.font)+graph.bot());

		ctx.font = "lighter 3vh sans-serif";
		var yLabel = "Pressure in Cylinder (PSI)";
		ctx.fillStyle = "#666";
		txtSz = ctx.measureText(yLabel);
		ctx.save();
		ctx.translate(graph.x-2.5*parseInt(ctx.font),graph.y+(graph.height+txtSz.width)/2);
		ctx.rotate(3*Math.PI/2);
		ctx.fillText(yLabel,0,0);
		ctx.restore();

		self.drawXLabels();
		self.drawYLabels();
	};

	this.clear = function(){
		graph.clear();
		this.gauge.clear();
	}

}

window.pointTrace = pointTrace;
});
