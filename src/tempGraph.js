var tempGraph = function(elem) {
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
		graph.h=h*.75;
		graph.y=.13*h;
		graph.w=2*w/3;
		graph.x=w/6;
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
		var left = (p1*v1)/(t1);
		var t2 = (t1*(p1+parseFloat(pnt.y))*parseFloat(pnt.x))/(p1*v1);

		//var rel = .75*(t2-t1)/(maxTemp-t1)+1/4;
        elem.temp = t2;
		var rel = (t2-minTemp)/(maxTemp-minTemp);
		if(rel>highTemp) highTemp=rel;
		if(rel<0) rel=0;
		else if (rel>1) rel=1;
		ctx.fillStyle = "#fff";
		ctx.beginPath();
		ctx.rect(graph.x,graph.y,graph.w,graph.h);
		ctx.fill();
		ctx.closePath();
		ctx.fillStyle = "#b0b";
		ctx.beginPath();
		ctx.rect(graph.x,graph.y+graph.h,graph.w,-graph.h*rel);
		ctx.fill();
		ctx.closePath();
		ctx.strokeStyle="#666";
		ctx.lineWidth=3;
		this.drawFrame();
		ctx.fillStyle = "#f00";
		ctx.beginPath();
		ctx.rect(graph.x,graph.y+graph.h*(1-highTemp),graph.w,2);
		ctx.closePath();
		ctx.fill();

		var label = "Air";
		ctx.font = "lighter 3vw sans-serif";
		//console.log(""+(this.height-graph.h)/3+"pt Arial");
		ctx.fillStyle = "#fff";
		var txtSz = ctx.measureText(label);
		ctx.fillText(label,(this.width-txtSz.width)/2,parseInt(ctx.font)+20);

		label = "Temp";
		txtSz = ctx.measureText(label);
		ctx.fillText(label,(this.width-txtSz.width)/2,parseInt(ctx.font)*2+20);

		label = "(°F)";
		txtSz = ctx.measureText(label);
		ctx.fillText(label,(this.width-txtSz.width)/2,parseInt(ctx.font)*3+20);

		ctx.font = "lighter 3vw sans-serif";
		ctx.fillStyle = "rgba(0,0,0,.75)";
		this.drawLabels();
	};

	this.drawLabels = function () {
		var txtSz;
		var div=divs/2;
		for(var i=0; i<div+1; i++){
			var lbl = ""+(minTemp+i*(maxTemp-minTemp)/div)+"°";
			txtSz = ctx.measureText(lbl);
			//ctx.fillText(lbl,graph.x-txtSz.width,graph.y+graph.h-(i*graph.h/div-txtSz.height/2));
			var hOff = -i*graph.h/div+parseInt(ctx.font)/2;
			if(i==0) hOff = -i*graph.h/div - 5;
			if(i==div) hOff = -i*graph.h/div+parseInt(ctx.font);
			ctx.fillText(lbl,graph.x+(graph.w-txtSz.width)/2,graph.y+graph.h+hOff);
		}
	};

	this.drawFrame = function(){
		ctx.beginPath();
		ctx.rect(graph.x,graph.y,graph.w,graph.h);
		ctx.stroke();
		ctx.closePath();
	};

	return this;
};

exports.tempGraph = tempGraph;
