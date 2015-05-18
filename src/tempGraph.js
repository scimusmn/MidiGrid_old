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
	var highTemp=0;
	var p1=15;
	var v1=16;
	var t1=72;
	
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
		graph.w=w;
		graph.h=h/2;
		graph.y=h/2;
		this.width=w;
		this.height=h;
	}
	
	this.setInitialParams = function (p,v,t,mTemp) {
		p1=p;
		v1=v;
		t1=t;
		maxTemp=mTemp;
	};
	
	this.setInitialParams(getNum("p1"),getNum("v1"),getNum("t1"),getNum("tMax"));
	
	this.clear = function () {
		highTemp=0;
	};
	
	this.draw = function (pnt) {
		this.canvas.width=graph.w;
		var t2 = (t1*((pnt.y+15)*pnt.x)/(p1*v1));
		var rel = .75*(t2-t1)/(maxTemp-t1)+1/4;
		if(rel>highTemp) highTemp=rel;
		//console.log(t2);
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
		ctx.strokeStyle="#000";
		ctx.lineWidth=3;
		this.drawFrame();
		ctx.fillStyle = "#f00";
		ctx.beginPath();
		ctx.rect(graph.w*highTemp,graph.y,2,graph.h);
		ctx.closePath();
		ctx.fill();
		
		var label = "Air Temperature (degrees Fahrenheit)";
		ctx.font = "3vh Arial";
		//console.log(""+(this.height-graph.h)/3+"pt Arial");
		ctx.fillStyle = "#333";
		var txtSz = ctx.measureText(label);
		ctx.fillText(label,graph.x+(graph.w-txtSz.width)/2,graph.y-parseInt(ctx.font)/2);
	};
	
	this.drawFrame = function(){
		ctx.beginPath();
		ctx.rect(graph.x,graph.y,graph.w,graph.h);
		ctx.stroke();
		ctx.closePath();
	};
};