function pointTrace(elem){
	var self = this;
	//this.points = [];
	this.points = new pointStack(2500);
	var maxPoints = 2500;
	var trcWd =3;
	
	var lowBool = false;
	
	this.width;
	this.height;
	
	var canvas = elem;
	var ctx = canvas.getContext("2d");
	
	ctx.globalCompositeOperation = "lighter";
	
	var ave = new aveCont(5);
	var sampsX = new aveCont(5);
	var sampsY = new aveCont(5);
	
	this.addPoint = function(pnt){
		//console.log(pnt);				//{x: 0.0046875, y: 0.004166666666666667} 1.5, 1
		/*if(self.points.length){
			if(Math.abs(pnt.x-self.points.last().x)>.01||Math.abs(pnt.y-self.points.last().y)>.01){
				sampsX.addSample(pnt.x);
				sampsY.addSample(pnt.y);
				self.points.push({x:sampsX.ave,y:sampsY.ave});
				//self.points.push(pnt);
				if(pnt.x>.95) lowBool=true;
				else if(pnt.x<.95&&lowBool){
					lowBool=false;
					self.clear();
				}
				if(self.points.length>=maxPoints) self.points.splice(0,1);
			}
		}
		else self.points.push({x:pnt.x,y:pnt.y});*/
		
		if(pnt.x>.95) lowBool=true;
		else if(pnt.x<.95&&lowBool){
			lowBool=false;
			self.clear();
		}
		self.points.addPoint(pnt);
	}
	
	this.color="#f00";
	
	this.resize = function(wid,hgt){
		this.width=canvas.width;
		this.height=canvas.height;
	}
	
	this.draw = function(x,y){
		canvas.width=this.width;
		/*ctx.beginPath();
      	ctx.rect(0,0,this.width,this.height);
      	ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      	ctx.fill();
      	ctx.closePath();*/
		if(self.points.length>2){
			//console.log("drawing");
			var xc = this.width*(self.points[0].x + self.points[1].x) / 2;
			var yc = this.height*(self.points[0].y + self.points[1].y) / 2;
			
			
			
			ctx.lineWidth=trcWd;
			self.drawColorIntegral();
			
			
			ctx.beginPath();
			ctx.moveTo(xc, yc);
			for (i = 1; i < self.points.length - 1; i ++){
				ctx.strokeStyle="rgba(0,0,0,"+(i/self.points.length)+");"
				xc = this.width*(self.points[i].x + self.points[i + 1].x) / 2;
				yc = this.height*(self.points[i].y + self.points[i + 1].y) / 2;
				ctx.quadraticCurveTo(self.points[i].x*this.width, self.points[i].y*this.height, xc, yc);
			}
			ctx.stroke();
			ctx.closePath();
			
			
			// curve through the last two points
			/*var i = self.points.length-2;
			ctx.strokeStyle="rgba(255,0,0,0)";
			ctx.quadraticCurveTo(self.points[i].x*this.width, self.points[i].y, self.points[i+1].x*this.width,self.points[i+1].y);
			ctx.stroke();
			ctx.fillStyle="#f00";
			ctx.beginPath();
			ctx.lineWidth=1;
			ctx.arc(xc,yc,trcWd,0,2*Math.PI);
			ctx.arc(this.width*(self.points[0].x + self.points[1].x) / 2,this.height*(self.points[0].y + self.points[1].y) / 2,trcWd/2,0,2*Math.PI);
			ctx.fill();*/
		}
      
      this.drawGrid(0,0,this.width,this.height,20,10);
      this.drawFrame();
	}
	
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
	this.drawFrame = function(){
		ctx.beginPath();
		ctx.lineWidth=6;
		ctx.strokeStyle='black';
		ctx.rect(0,0,this.width,this.height);
		ctx.stroke();
		ctx.closePath();
	}
	this.drawColorIntegral = function(){
		var sectAve=0;
		var lastPos={x:0,y:0};
		var firstPos={x:0,y:0};
		
		for (i = 0; i < self.points.length - 1; i ++){
			ave.addSample((self.points[i].x-self.points[i+1].x));
			//if(self.points[i].x-self.points[i+1].x<0) ctx.strokeStyle="rgba(68,153,255,"+i/self.points.length+")";//"#49f"
			//else ctx.strokeStyle="rgba(255,153,153,"+i/self.points.length+")";//"#f44";
			ctx.fillStyle=ctx.strokeStyle;
			if(!sectAve){
				ctx.beginPath();
				ctx.moveTo(self.points[i].x*this.width,this.height);
				ctx.lineTo(self.points[i].x*this.width, self.points[i].y*this.height);
				firstPos = self.points[i];
				lastPos=self.points[i];
			}
			if(sign(ave.ave)==sectAve){
				if(sign(ave.ave)==sign(self.points[i].x-self.points[i+1].x)){
					ctx.lineTo(self.points[i].x*this.width, self.points[i].y*this.height);
					lastPos=self.points[i];
					ctx.globalAlpha = i/self.points.length;
				}
			}
			else{
				if(sectAve<0) ctx.fillStyle="#49f";//"#aaa";//
				else ctx.fillStyle="#f44";
				ctx.lineTo(lastPos.x*this.width,this.height);
				//ctx.lineTo(firstPos.x*this.width,this.height);
				ctx.fill();
				//ctx.stroke();
				ctx.closePath();
				ctx.beginPath();
				ctx.moveTo(self.points[i].x*this.width,this.height);
				ctx.lineTo(self.points[i].x*this.width, self.points[i].y*this.height);
				sectAve=sign(ave.ave);
			}
		}
		if(sectAve<0) ctx.fillStyle="#49f";//"#333";//
		else ctx.fillStyle="#f44";//"#ccc";//
		ctx.lineTo(lastPos.x*this.width,this.height);
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