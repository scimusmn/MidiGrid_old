/*function mapObj() {
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
}*/

/*function range(){
	this.min=0;
	this.max=0;

	this.bound = function (val) {
		return Math.min(this.max,Math.max(this.min,val));
	};
};*/

/*function axisParams(){
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
}*/
include(["src/pointStack.js"],function () {
	console.log("graph");
	function param(){
		this.x = {
			min:0,
			max:0,
			divs:10,
			flip:false
		}
		this.y = {
			min:0,
			max:0,
			divs:10,
			flip:true
		}
	}

	var smm_Graph = inheritFrom(HTMLCanvasElement,function() {
		var self =this;
		//var ctx = null;

		this.points = null;

		this.newPoint = {
			x:{
				val:0,
				new:false
			},
			y:{
				val:0,
				new:false
			}
		}

		this.range = new param();

		this.resize= function (nx,ny,nw,nh) {
			this.left=nx;
			this.top=ny;
			this.width=nw;
			this.height=nh;
		}

		this.setNumDivs = function(xDivs,yDivs){
			this.range.x.divs=xDivs;
			this.range.y.divs=yDivs;
		}

		this.setRange = function (xMin,xMax,yMin,yMax) {
			this.range.x.min=xMin;
			this.range.x.max=xMax;
			this.range.y.min=yMin;
			this.range.y.max=yMax;
		};

		this.convert = function (val,which) {
			if(!this.range[which].flip)
				return map(val,0,1,this.range[which].min,this.range[which].max);
			else return map(val,1,0,this.range[which].min,this.range[which].max);
		}

		this.addPoint = function (pnt) {
			if(this.range.x.flip) pnt.x=1-pnt.x;
			if(this.range.y.flip) pnt.y=1-pnt.y;
			this.points.addPoint(pnt);
		};

		this.newValue = function (val,which) {
			//this.points.addPoint(pnt);
			this.newPoint[which].val = val;
			this.newPoint[which].new = true;
			if(this.newPoint.x.new&&this.newPoint.y.new){
				this.addPoint({x:this.newPoint.x.val,y:this.newPoint.y.val});
			}
		};

		this.lastPoint = function(){
			if(this.points.length) return {x:this.convert(this.points.last().x,"x"),y:this.convert(this.points.last().y,"y")};
		}

		this.drawTrace = function () {
			var ctx = this.getContext("2d");
			ctx.lineWidth=this.lineWidth;
			ctx.strokeStyle = this.lineColor;
			var self =this;
			if(this.points.length>2){
				//console.log("drawing");
				var xc = this.width*(this.points[0].x + this.points[1].x) / 2;
				var yc = this.height*(this.points[0].y + this.points[1].y) / 2;

				//ctx.lineWidth=traceWidth;

				ctx.beginPath();
				ctx.moveTo(xc, yc);
				for (var i = 0; i < self.points.length - 1; i ++){
					ctx.strokeStyle="rgba(0,0,0,"+(i/self.points.length)+");"
					xc = this.width*(self.points[i].x + self.points[i + 1].x) / 2;
					yc = this.height*(self.points[i].y + self.points[i + 1].y) / 2;
					ctx.quadraticCurveTo(self.points[i].x*this.width, self.points[i].y*this.height, xc, yc);
				}
				ctx.stroke();
				ctx.closePath();
			}
		};

		this.drawGrid = function(){
			var ctx = this.getContext("2d");
			ctx.lineWidth=this.gridWidth;
			ctx.strokeStyle = this.gridColor;
			for(var i=0; i<this.range.x.divs; i++){
				ctx.beginPath();
				ctx.moveTo(i*this.width/this.range.x.divs,0);
				ctx.lineTo(i*this.width/this.range.x.divs,this.height);
				ctx.closePath();
				ctx.stroke();
			}
			for(var i=0; i<this.range.y.divs; i++){
				ctx.beginPath();
				ctx.moveTo(0,i*this.height/this.range.y.divs);
				ctx.lineTo(this.width,i*this.height/this.range.y.divs);
				ctx.closePath();
				ctx.stroke();
			}
		};

		/*this.drawXLabels = function (ctx) {
			var txtSz;
			var xDiv=this.range.x.divs/2;
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
		};*/

		this.customBGDraw = function(){

		}

		this.customFGDraw = function(){

		}

		this.draw = function () {
			var ctx = this.getContext("2d");
			ctx.beginPath();
			ctx.fillStyle = "#fff";
			ctx.rect(0,0,this.width,this.height);
			ctx.closePath();
			ctx.fill();

			this.customBGDraw();

			this.drawTrace(ctx);

			this.drawGrid(ctx,18,10);

			this.customFGDraw();

			/*ctx.fillStyle = this.fontColor;
			ctx.font = this.labelFont;
			this.drawXLabels(ctx,9);
			this.drawYLabels(ctx,5);*/
		};

		this.clear = function(){
			this.points.length=0;
		};

		this.createdCallback = function () {
			//this.shadow = this.createShadowRoot();
			//this.canvas = document.createElement('canvas');
			//this.setup(this);
			this.range = new param();

			var xR = {min:$("|>xMin",this),max:$("|>xMax",this)};
			var yR = {min:$("|>yMin",this),max:$("|>yMax",this)};
			this.setRange(xR.min,xR.max,yR.min,yR.max);
			this.setNumDivs($("|>xDiv",this),$("|>yDiv",this));
			var flip = "";
			if(flip = $("|>flip",this)){
				this.range.x.flip = ~$("|>flip",this).indexOf("x");
				this.range.y.flip = ~$("|>flip",this).indexOf("y");
			}


			ctx = this.getContext("2d");
			this.points = new pointStack(1000);

			this.labelFont = "lighter 2vh sans-serif";
			this.fontColor = "#000";
			this.lineWidth = 3;
			this.lineColor = "#000";
			this.gridWidth = 1;
			this.gridColor = "rgba(0,0,0,.1)";
			this.refreshRate = 30;

			this.newPoint = {
                        	x:{
                                	val:0,
                                	new:false
                        	},
                        	y:{
                                	val:0,
                                	new:false
                        	}
                	}
		}
	});

	document.registerElement('smm-graph', {prototype: smm_Graph.prototype, extends: 'canvas'});
});
