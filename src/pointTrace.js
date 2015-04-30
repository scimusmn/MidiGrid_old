function pointTrace(elem){
	var self = this;
	this.points = new pointStack(2500);
	var traceWidth = 3;
	
	this.width;
	this.height;
	
	var graph = {x:0,y:0,w:0,h:0};
	
	graph.bot = function(){
		return this.y+this.h;
	};
	
	this.canvas = elem;
	var ctx = this.canvas.getContext("2d");
	
	ctx.globalCompositeOperation = "lighter";
	
	var ave = new aveCont();
	
	this.addPoint = function(pnt){
		self.points.addPoint(pnt);
		self.autoClear(.95);
	}
	
	var lowBool = false;
	
	this.autoClear = function (thresh) {
		if (self.points.last().x > thresh) lowBool = true;
		else if ( lowBool) {
			lowBool = false;
			self.clear();
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
		graph.x = wid-graph.w;
		graph.y = (hgt-graph.h)/2;
	}
	
	this.draw = function(label){
		this.canvas.width=this.width;				//clear the canvas.
		/*ctx.beginPath();
      	ctx.rect(0,0,this.width,this.height);
      	ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      	ctx.fill();
      	ctx.closePath();*/
		  
		var txtSz = ctx.measureText(label);
		ctx.font = "30pt Arial";
		ctx.fillStyle = "#000";
		ctx.fillText(label,(this.width-txtSz.width)/2,parseInt(ctx.font));
	
		this.drawColorIntegral(graph.x,graph.y,graph.w,graph.h);
		this.drawTrace(graph.x,graph.y,graph.w,graph.h);
      
		this.drawGrid(graph.x,graph.y,graph.w,graph.h,18,10);
		this.drawFrame(graph.x,graph.y,graph.w,graph.h);
		
		ctx.font = "20pt Arial";
		var xLabel = "Air Volume (Cubic Inches)";
		ctx.fillStyle = "#000";
		txtSz = ctx.measureText(xLabel);
		ctx.fillText(xLabel,graph.x+(graph.w-txtSz.width)/2,12+parseInt(ctx.font)+graph.bot());
		
		this.drawXLabels(graph.x,graph.y,graph.w,graph.h,9,0,18);
		
		ctx.font = "20pt Arial";
		var yLabel = "Pressure in Cylinder (PSI)";
		ctx.fillStyle = "#000";
		txtSz = ctx.measureText(yLabel);
		ctx.save();
		ctx.translate(parseInt(ctx.font)*2,graph.y+(graph.h+txtSz.width)/2);
		ctx.rotate(3*Math.PI/2);
		ctx.fillText(yLabel,0,0);
		ctx.restore();
		
		this.drawYLabels(graph.x,graph.y,graph.w,graph.h,5,150,0);
	}
	
	this.drawTrace = function (x,y,wid,hgt) {
		if(self.points.length>2){
			//console.log("drawing");
			var xc = x+wid*(self.points[0].x + self.points[1].x) / 2;
			var yc = y+hgt*(self.points[0].y + self.points[1].y) / 2;
			
			ctx.lineWidth=traceWidth;

			ctx.beginPath();
			ctx.moveTo(xc, yc);
			for (var i = 0; i < self.points.length - 1; i ++){
				ctx.strokeStyle="rgba(0,0,0,"+(i/self.points.length)+");"
				xc = x+wid*(self.points[i].x + self.points[i + 1].x) / 2;
				yc = y+hgt*(self.points[i].y + self.points[i + 1].y) / 2;
				ctx.quadraticCurveTo(x+self.points[i].x*wid, y+self.points[i].y*hgt, xc, yc);
			}
			ctx.stroke();
			ctx.closePath();
		}
	};
	
	this.drawXLabels = function (x,y,w,h,xDiv,strt,end) {
		ctx.fillStyle = "#000";
		ctx.font = "12pt Arial";
		var txtSz; 
		for(var i=0; i<xDiv; i++){
			var lbl = ""+(strt+i*(end-strt)/xDiv);
			txtSz = ctx.measureText(lbl);
			ctx.fillText(lbl,graph.x+i*w/xDiv-txtSz.width/2,parseInt(ctx.font)+y+h);
		}
	};
	
	this.drawYLabels = function (x,y,w,h,yDiv,strt,end) {
		ctx.fillStyle = "#000";
		ctx.font = "12pt Arial";
		var txtSz; 
		for(var i=0; i<yDiv+1; i++){
			var lbl = ""+(strt+i*(end-strt)/yDiv);
			txtSz = ctx.measureText(lbl);
			ctx.fillText(lbl,x-(txtSz.width+5),y+i*h/yDiv+parseInt(ctx.font)/2);
		}
	};
	
	this.drawGrid = function(x,y,w,h,xDiv,yDiv){
		ctx.lineWidth = 1;
		ctx.strokeStyle = "rgba(0,0,0, 0.1)";
		for(var i=0; i<xDiv; i++){
			ctx.beginPath();
			ctx.moveTo(x+i*w/xDiv,y);
			ctx.lineTo(x+i*w/xDiv,y+h);
			ctx.closePath();
			ctx.stroke();
		}
		for(var i=0; i<yDiv; i++){
			ctx.beginPath();
			ctx.moveTo(x,y+i*h/yDiv);
			ctx.lineTo(x+w,y+i*h/yDiv);
			ctx.closePath();
			ctx.stroke();
		}
	}
	this.drawFrame = function(x,y,wid,hgt){
		ctx.beginPath();
		ctx.lineWidth=3;
		ctx.strokeStyle='black';
		ctx.rect(x,y,wid,hgt);
		ctx.stroke();
		ctx.closePath();
	}
	this.drawColorIntegral = function(x,y,wid,hgt){
		var sectAve=0;
		var lastPos={x:0,y:0};
		var firstPos={x:0,y:0};
		
		for (var i = 0; i < self.points.length - 1; i++) {
			ave.addSample((self.points[i].x - self.points[i + 1].x));
			ctx.fillStyle = ctx.strokeStyle;
			if (!sectAve) {
				ctx.beginPath();
				ctx.moveTo(x + self.points[i].x * wid, y + hgt);
				ctx.lineTo(x + self.points[i].x * wid, y + self.points[i].y * hgt);
				firstPos = self.points[i];
				lastPos = self.points[i];
			}
			if (sign(ave.ave) == sectAve) {
				if (sign(ave.ave) == sign(self.points[i].x - self.points[i + 1].x)) {
					ctx.lineTo(x + self.points[i].x * wid, y + self.points[i].y * hgt);
					lastPos = self.points[i];
					ctx.globalAlpha = i / self.points.length;
				}
			}
			else {
				if (sectAve < 0) ctx.fillStyle = "#49f";//"#aaa";//
				else ctx.fillStyle = "#f44";
				ctx.lineTo(x + lastPos.x * wid, y + hgt);
				ctx.fill();
				ctx.closePath();
				ctx.beginPath();
				ctx.moveTo(x + self.points[i].x * wid, y + hgt);
				ctx.lineTo(x + self.points[i].x * wid, y + self.points[i].y * hgt);
				sectAve = sign(ave.ave);
			}
		}
		if (sectAve < 0) ctx.fillStyle = "#49f";//"#333";//
		else ctx.fillStyle = "#f44";//"#ccc";//
		ctx.lineTo(x+lastPos.x * wid, y + hgt);
		ctx.fill();
		//ctx.stroke();
		ctx.closePath();
	}
	
	this.clear = function(){
		self.points.length=0;
		//ctx.clearRect(0,0,canvas.width,canvas.height);
	}
	
	this.jump = function(){
		self.points.length=0;
	}
	
}