function compCont(elem) {
  var self = this;
  this.elem =elem;
  this.other = null;
  var focus=false;
  var lockout = false;
  var shrunk = false;
  this.moving = false;
  this.hasFocus = function () {
    return focus;
  }

  var subtitle = $(".graphSub",elem);
  var title = $(".graphTitle",elem);
  var data = $(".data",elem);
  var inst = $(".instPanel",elem);
  var button = $(".instButton",inst);

  this.graph = null;

  var curPage = $(".instPage",inst);

  function opposite (side){
    return ((side=="left")?'right':'left');
  };

  self.elem.onmousedown = function () {
		if(!self.hasFocus()&&!lockout) self.focus();
	}

  this.bind = function (other,graf,grapf) {
    self.other = other;
    self.other.other = self;
    self.other.graph = grapf;
    self.graph=graf;
  }

  $(".backButton",elem).onmousedown = function () {
    if(self.hasFocus()) self.loseFocus();
  }

  this.shrink = function () {
    if(self.hasFocus()) self.loseFocus();
    move(elem).set('height','60%')//.scale(.75)//
    //.set('margin-top','-6%')
    .end();
    move(subtitle).set('opacity','0')
    .end();
    lockout=true;
    shrunk = true;
    self.graph.refresh();
  }

  this.expand = function () {
    move(elem).set('height','80%')//.scale(1)//
    .set('margin-top','0px')
    .end();
    move(subtitle).set('opacity','1')
    .end();
    lockout=false;
    shrunk = false;
  }

  this.restore = function () {
    if(self.hasFocus()) self.loseFocus();
    if(shrunk) self.expand();
  }

  button.onmousedown = function () {
    if(focus){
      var targ = curPage.getAttribute("target");
      if(targ == "nextPage"){
        curPage.style.display = "none";
        curPage = curPage.nextElementSibling;
        curPage.style.display = "block";
      }
      else if(targ == "other") {
        self.loseFocus(self.other.focus);
      }
      else if (targ == "dualInst") {
        var dual = $("#dualInst");
        self.other.shrink();
        self.shrink();
        $("#reset").style.display = "block";
        move(dual).set('height','26%')
        .end(function () {
          move($(".instPanel",dual)).set('opacity','1')
          .set('width','96%')
          .end();
        });
      }
    }
  }

  this.focus = function (fxn) {
    if(!self.moving&&!self.other.moving){
      $("#reset").style.display = "block";
      curPage = $(".instPage",inst);
      self.moving = true;
  		var side = elem.getAttribute("side");
  		move(self.other.elem).set(opposite(side), '-50%')
      .ease('out')
  		.end();
  		move(data).set('width','47%')
  		.set(side,'1%')
      .ease('out')
  		.end();
      move(title).set('left','6.5vh')
      .ease('out')
      .end();
      move($(".backButton",elem)).set('width','auto')
      .end();
  		move(elem).set('width','96%')
  		.set(side,'2%')
      .ease('out')
  		.end(function () {
  			move(subtitle).set('opacity','0')
  			.end();
        curPage.style.display="block";
  			move(inst).set('opacity','1')
  			.end(function () {
          //inst.style.display = "block";
          focus =true;
          self.moving = false;
          console.log("gained focus");
  				if(typeof fxn !== 'undefined'){ fxn()}
  			});
  		});
    }
	}

	this.loseFocus = function (fxn) {
    $("#reset").style.display = "none";
    if(!self.moving&&!self.other.moving){
      self.moving = true;
  		var side = elem.getAttribute("side");
  		move(subtitle).set('opacity','1')
  		.end();
  		move(inst).set('opacity','0')
  		.end(function () {
        //inst.style.display="none";
  			move(elem).set('width','47%')
  			.set(side,'2%')
  			.ease('out')
  			.end();
  			move(self.other.elem).set(opposite(side), '2%')
  			.ease('out')
  			.end();
        move($(".backButton",elem)).set('width','0px')
        .end();
        move(title).set('left','2%')
        .ease('out')
        .end();
  			move(data).set('width','96%')
  			.set(side,'2%')
  			.end(function () {
          console.log("lost Focus");
          self.moving=false;
          focus=false;
  				if(fxn){ fxn()}
  			});
  		});
  	}
  }
}
