function mapObj() {
	var self =this;
	this.in = {min:0,max:0};
	this.out = {min:0,max:0};

	this.set = function(inp,outp){
		self.in = inp;
		self.out = outp;
	};

	this.convert = function (val) {
		return (val-this.in.min)*(this.out.max-this.out.min)/(this.in.max-this.in.min)+this.out.min;
	};

	this.invert = function (val) {
		return (val-this.out.min)*(this.in.max-this.in.min)/(this.out.max-this.out.min)+this.in.min;
	};
}

/*function range(){
	this.min=0;
	this.max=0;

	this.bound = function (val) {
		return Math.min(this.max,Math.max(this.min,val));
	};
};*/

function axisParams(){
	this.in = {min:0,max:0};
	this.out = {min:0,max:0};
	this.min=0;
	this.max=0;
	var flipped = 0;

	this.setScale = function (inp,outp) {
		this.in = inp;
		this.out = outp;
	};

	this.setRange = function (mn,mx) {
		this.min=mn;
		this.max=mx;
	};

	this.flipAxis = function (val) {
		flipped = val;
	};

	this.convert = function (val,flp) {
		var ret = map(val,this.in.min,this.in.max,this.out.min,this.out.max);
		ret = map(ret,this.min,this.max,0,1);
		ret = Math.max(0,Math.min(1,ret));
		if(flipped) ret=1-ret;
		return ret;
	};

	this.invert = function (val) {
		if(flipped) return map(val,1,0,this.min,this.max);
		else return map(val,0,1,this.min,this.max);
	};
}

function smmGraph() {
	var self =this;
	this.x=0;
	this.y=0;
	this.w=0;
	this.h=0;

	this.labelFont = "lighter 2vh sans-serif";
	this.fontColor = "#000";
	this.lineWidth = 3;
	this.lineColor = "#000";
	this.gridWidth = 1;
	this.gridColor = "rgba(0,0,0,.1)";
	this.frameWidth = 3;
	this.frameColor = "#000";

	this.points = new pointStack(2500);

	var divs = {x:18,y:10}

	var xParam = new axisParams();
	var yParam = new axisParams();
	yParam.flipAxis(true);

	this.resize= function (nx,ny,nw,nh) {
		this.x=nx;
		this.y=ny;
		this.w=nw;
		this.h=nh;
	}

	this.setNumDivs = function(xDivs,yDivs){
		divs.x=xDivs;
		divs.y=yDivs;
	}

	this.setScale = function (xIn,xOut,yIn,yOut) {
		xParam.setScale(xIn,xOut);
		yParam.setScale(yIn,yOut);
	};

	this.setRange = function (xMin,xMax,yMin,yMax) {
		xParam.setRange(xMin,xMax);
		yParam.setRange(yMin,yMax);
	};

	this.addPoint = function (pnt) {
		this.points.addPoint({x:xParam.convert(pnt.x),y:yParam.convert(pnt.y)});
	};

	this.lastPoint = function(){
		if(this.points.length) return {x:xParam.invert(this.points.last().x),y:yParam.invert(this.points.last().y)};
	}

	var atr = function (el,w) {
		return parseInt(el.getAttribute(w));
	}

	this.setup = function (elem) {

		var xR = {min:atr(elem,"xMin"),max:atr(elem,"xMax")};
		var yR = {min:atr(elem,"yMin"),max:atr(elem,"yMax")};
		if(atr(elem,"xLow")){
			 this.setScale({min:atr(elem,"xLow"),max:atr(elem,"xHi")},xR,{min:atr(elem,"yLow"),max:atr(elem,"yHi")},yR);
		}
		this.setRange(xR.min,xR.max,yR.min,yR.max);
		this.setNumDivs(atr(elem,"xDiv"),atr(elem,"yDiv"));
	};

	this.drawTrace = function (ctx) {
		if(self.points.length>2){
			//console.log("drawing");
			var xc = this.x+this.w*(self.points[0].x + self.points[1].x) / 2;
			var yc = this.y+this.h*(self.points[0].y + self.points[1].y) / 2;

			//ctx.lineWidth=traceWidth;

			ctx.beginPath();
			ctx.moveTo(xc, yc);
			for (var i = 0; i < self.points.length - 1; i ++){
				ctx.strokeStyle="rgba(0,0,0,"+(i/self.points.length)+");"
				xc = this.x+this.w*(self.points[i].x + self.points[i + 1].x) / 2;
				yc = this.y+this.h*(self.points[i].y + self.points[i + 1].y) / 2;
				ctx.quadraticCurveTo(this.x+self.points[i].x*this.w, this.y+self.points[i].y*this.h, xc, yc);
			}
			ctx.stroke();
			ctx.closePath();

			ctx.strokeStyle = "#000";
			ctx.fillStyle = "#ff0";
			ctx.lineWidth=this.lineWidth;
			ctx.beginPath();
			ctx.arc(this.x+self.points.last().x*this.w,this.y+self.points.last().y*this.h,5,0,2*Math.PI);
			ctx.stroke();
			ctx.fill();
			ctx.closePath();

			ctx.fillStyle = "#000";
			ctx.beginPath();
			ctx.arc(this.x+self.points.last().x*this.w,this.y+self.points.last().y*this.h,1,0,2*Math.PI);
			ctx.fill();
			ctx.closePath();
		}
	};

	this.drawGrid = function(ctx){
		//ctx.lineWidth = 1;
		//ctx.strokeStyle = "rgba(0,0,0, 0.1)";
		for(var i=0; i<divs.x; i++){
			ctx.beginPath();
			ctx.moveTo(this.x+i*this.w/divs.x,this.y);
			ctx.lineTo(this.x+i*this.w/divs.x,this.y+this.h);
			ctx.closePath();
			ctx.stroke();
		}
		for(var i=0; i<divs.y; i++){
			ctx.beginPath();
			ctx.moveTo(this.x,this.y+i*this.h/divs.y);
			ctx.lineTo(this.x+this.w,this.y+i*this.h/divs.y);
			ctx.closePath();
			ctx.stroke();
		}
	};

	this.drawFrame = function(ctx){
		ctx.beginPath();
		ctx.rect(this.x,this.y,this.w,this.h);
		ctx.stroke();
		ctx.closePath();
	}

	this.drawXLabels = function (ctx) {
		var txtSz;
		var xDiv=divs.x/2;
		for(var i=0; i<xDiv; i++){
			var lbl = ""+(xParam.min*1+i*(xParam.max-xParam.min)/xDiv);
			txtSz = ctx.measureText(lbl);
			ctx.fillText(lbl,this.x+i*this.w/xDiv-txtSz.width/2,parseInt(ctx.font)+this.y+this.h);
		}
	};

	this.drawYLabels = function (ctx) {
		var txtSz;
		var yDiv=divs.y/2;
		for(var i=0; i<yDiv+1; i++){
			var lbl = (""+(yParam.max*1+i*(yParam.min-yParam.max)/yDiv)).slice(0,(""+yParam.max).length);
			txtSz = ctx.measureText(lbl);
			ctx.fillText(lbl,this.x-(txtSz.width+5),this.y+i*this.h/yDiv+parseInt(ctx.font)/2);
		}
	};

	this.draw = function (ctx) {
		ctx.lineWidth=this.lineWidth;
		ctx.strokeStyle = this.lineColor;
		this.drawTrace(ctx);

	  	ctx.lineWidth=this.gridWidth;
		ctx.strokeStyle = this.gridColor;
		this.drawGrid(ctx,18,10);

		ctx.lineWidth=this.frameWidth;
		ctx.strokeStyle = this.frameColor;
		this.drawFrame(ctx);

		ctx.fillStyle = this.fontColor;
		ctx.font = this.labelFont;
		this.drawXLabels(ctx,9);
		this.drawYLabels(ctx,5);
	};

	this.clear = function(){
		this.points.length=0;
	};
}
