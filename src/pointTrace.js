function pointTrace(elem){
	var self = this;
	var traceWidth = 3;
	
	this.width;
	this.height;
	
	//var graph = {x:0,y:0,w:0,h:0};
	var graph = new smmGraph();//{x:0,y:0,w:0,h:0};
	
	
	graph.bot = function(){
		return this.y+this.h;
	};
	
	this.canvas = elem;
	var ctx = this.canvas.getContext("2d");
	
	ctx.globalCompositeOperation = "lighter";
	
	graph.setScale({min:0.0,max:1},{min:0,max:18},{min:.1,max:.9},{min:200,max:0});
	
	graph.setRange(0,18,-20,180);
	
	
	
	this.addPoint = function(pnt){
		//self.points.addPoint(scalePoint(pnt));
		graph.addPoint(pnt);
		self.autoClear(.95);
	}
	
	var lowBool = false;
	
	/*this.calcPoint = function () {
		return {x:xMap.convert(self.points.last().x),y:yMap.convert(self.points.last().y)};
	}*/
	
	this.autoClear = function (thresh) {
		if (graph.points.last().x > thresh) lowBool = true;
		else if ( lowBool) {
			lowBool = false;
			graph.clear();
		}
	}
	
	this.color="#f00";
	
	this.resize = function(wid,hgt){
		this.canvas.width=wid;
		this.canvas.height=hgt;
		this.width=wid;
		this.height=hgt;
		graph.w = wid*.85;
		graph.h = hgt*.75;
		graph.x = wid-graph.w-traceWidth/2;
		graph.y = (hgt-graph.h)/2;
	}
	
	var ave = new aveCont();
	
	graph.drawColorIntegral = function(ctx){
		var wid=this.w;
		var hgt=this.h;
		var y=this.y;
		var x=this.x;
		
		var sectAve=0;
		var lastPos={x:0,y:0};
		var firstPos={x:0,y:0};
		
		for (var i = 0; i < graph.points.length - 1; i++) {
			ave.addSample((graph.points[i].x - graph.points[i + 1].x));
			ctx.fillStyle = ctx.strokeStyle;
			if (!sectAve) {
				ctx.beginPath();
				ctx.moveTo(x + graph.points[i].x * wid, y + hgt);
				ctx.lineTo(x + graph.points[i].x * wid, y + graph.points[i].y * hgt);
				firstPos = graph.points[i];
				lastPos = graph.points[i];
			}
			if (sign(ave.ave) == sectAve) {
				if (sign(ave.ave) == sign(graph.points[i].x - graph.points[i + 1].x)) {
					ctx.lineTo(x + graph.points[i].x * wid, y + graph.points[i].y * hgt);
					lastPos = graph.points[i];
					ctx.globalAlpha = i / graph.points.length;
				}
			}
			else {
				if (sectAve < 0) ctx.fillStyle = "#49f";//"#aaa";//
				else ctx.fillStyle = "#f44";
				ctx.lineTo(x + lastPos.x * wid, y + hgt);
				ctx.fill();
				ctx.closePath();
				ctx.beginPath();
				ctx.moveTo(x + graph.points[i].x * wid, y + hgt);
				ctx.lineTo(x + graph.points[i].x * wid, y + graph.points[i].y * hgt);
				sectAve = sign(ave.ave);
			}
		}
		if (sectAve < 0) ctx.fillStyle = "#49f";//"#333";//
		else ctx.fillStyle = "#f44";//"#ccc";//
		ctx.lineTo(x+lastPos.x * wid, y + hgt);
		ctx.fill();
		ctx.closePath();
	};
	
	graph.draw = function () {
		graph.drawColorIntegral(ctx);
		ctx.lineWidth=traceWidth;
		ctx.strokeStyle = "#000";
		graph.drawTrace(ctx);
      
	  	ctx.lineWidth=1;
		ctx.strokeStyle = "rgba(0,0,0, 0.1)";
		graph.drawGrid(ctx,18,10);
		
		ctx.lineWidth=traceWidth;
		ctx.strokeStyle = "#000";
		graph.drawFrame(ctx);
		
		ctx.fillStyle = "#000";
		ctx.font = "12pt Arial";
		graph.drawXLabels(ctx,9);
		graph.drawYLabels(ctx,5);
		
	}
	
	this.draw = function(label){
		this.canvas.width=this.width;				//clear the canvas.
		  
		graph.draw();
		  
		ctx.font = "30pt Arial";
		ctx.fillStyle = "#000";
		var txtSz = ctx.measureText(label);
		ctx.fillText(label,graph.x+(graph.w-txtSz.width)/2,graph.y-20);
		
		ctx.font = "20pt Arial";
		var xLabel = "Air Volume (Cubic Inches)";
		ctx.fillStyle = "#000";
		txtSz = ctx.measureText(xLabel);
		ctx.fillText(xLabel,graph.x+(graph.w-txtSz.width)/2,12+parseInt(ctx.font)+graph.bot());
		
		//this.drawXLabels(graph.x,graph.y,graph.w,graph.h,9,0,18);
		
		ctx.font = "20pt Arial";
		var yLabel = "Pressure in Cylinder (PSI)";
		ctx.fillStyle = "#000";
		txtSz = ctx.measureText(yLabel);
		ctx.save();
		ctx.translate(graph.x-40,graph.y+(graph.h+txtSz.width)/2);
		ctx.rotate(3*Math.PI/2);
		ctx.fillText(yLabel,0,0);
		ctx.restore();
		
		//this.drawYLabels(graph.x,graph.y,graph.w,graph.h,5,yParam.max,yParam.min);
	};
	
	this.clear = function(){
		self.points.length=0;
		//ctx.clearRect(0,0,canvas.width,canvas.height);
	}
	
}