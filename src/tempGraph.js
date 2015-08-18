function tempGraph(elem){
	this.canvas = elem;
	var ctx = this.canvas.getContext("2d");

	var getString = function (attr) {
		return elem.getAttribute(attr);
	}

	var getNum = function (attr) {
		return parseInt(getString(attr));
	}

	var self = this;
	var maxTemp =0;
	var minTemp =0;
	var highTemp=0;
	var p1=15;
	var v1=16;
	var t1=72;
	var divs = 5;

	this.width=0;
	this.height=0;

	var graph = {x:0,y:0,w:0,h:0};

	this.resize = function (w,h) {
		this.canvas.width=w;
		this.canvas.height=h;
		graph.w=w;
		graph.h=h;
		this.width=w;
		this.height=h;
	};

	this.refresh = function() {
		var w= this.canvas.clientWidth*2;
		var h = this.canvas.clientHeight*2;
		this.canvas.width=w;
		this.canvas.height=h;
		//graph.w=w;
		graph.w=w*.9;
		graph.x=.05*w;
		graph.h=h/3;
		graph.y=h/3;
		this.width=w;
		this.height=h;
	}

	this.setInitialParams = function (p,v,t,mnTemp,mxTemp,dvs) {
		p1=p;
		v1=v;
		t1=t;
		minTemp=mnTemp;
		maxTemp=mxTemp;
		divs=dvs;
	};

	this.setInitialParams(getNum("p1"),getNum("v1"),getNum("t1"),getNum("tMin"),getNum("tMax"),getNum("divs"));

	this.clear = function () {
		highTemp=0;
	};

	this.draw = function (pnt) {
		this.canvas.width=this.width;
		//console.log(pnt.x);
		var left = (p1*v1)/(t1);
		var t2 = (t1*(pnt.y+p1)*pnt.x)/(p1*v1);
		console.log(pnt.x);
		//var rel = .75*(t2-t1)/(maxTemp-t1)+1/4;
		var rel = (t2-minTemp)/(maxTemp-minTemp);
		if(rel>highTemp) highTemp=rel;
		if(rel<0) rel=0;
		else if (rel>1) rel=1;
		ctx.fillStyle = "#fff";
		ctx.beginPath();
		ctx.rect(graph.x,graph.y,graph.w,graph.h);
		ctx.fill();
		ctx.closePath();
		ctx.fillStyle = "rgba("+Math.floor((rel*255))+",0,"+Math.floor(((1-rel)*255))+",1)";
		ctx.beginPath();
		ctx.rect(graph.x,graph.y,graph.w*rel,graph.h);
		ctx.fill();
		ctx.closePath();
		ctx.strokeStyle="#666";
		ctx.lineWidth=3;
		this.drawFrame();
		ctx.fillStyle = "#f00";
		ctx.beginPath();
		ctx.rect(graph.x+graph.w*highTemp,graph.y,2,graph.h);
		ctx.closePath();
		ctx.fill();

		var label = "Air Temperature (degrees Fahrenheit)";
		ctx.font = "lighter 5vh sans-serif";
		//console.log(""+(this.height-graph.h)/3+"pt Arial");
		ctx.fillStyle = "#666";
		var txtSz = ctx.measureText(label);
		ctx.fillText(label,graph.x+(graph.w-txtSz.width)/2,graph.y-parseInt(ctx.font)/2);

		ctx.font = "lighter 4vh sans-serif";
		ctx.fillStyle = "#666";
		this.drawLabels();
	};

	this.drawLabels = function () {
		var txtSz;
		var xDiv=divs/2;
		for(var i=0; i<xDiv+1; i++){
			var lbl = ""+(minTemp+i*(maxTemp-minTemp)/xDiv)+"°";
			txtSz = ctx.measureText(lbl);
			ctx.fillText(lbl,graph.x+i*graph.w/xDiv-txtSz.width/2,parseInt(ctx.font)+graph.y+graph.h);
		}
	};

	this.drawFrame = function(){
		ctx.beginPath();
		ctx.rect(graph.x,graph.y,graph.w,graph.h);
		ctx.stroke();
		ctx.closePath();
	};
};
