function compCont(elem) {
  var self = elem;
  elem.elem =elem;
  elem.other = null;
  var shrunk = false;
  elem.moving = false;
  //elem.hasFocus = false;

  var subtitle = $(".graphSub",elem);
  var title = $(".graphTitle",elem);
  var data = $(".data",elem);
  var inst = $(".instPanel",elem);
  var button = $(".instButton",inst);

  elem.graph = null;

  var curPage = $(".instPage",inst);

  function opposite (side){
    return ((side=="left")?'right':'left');
  };

  elem.bind = function (other,graf,grapf) {
    self.other = other;
    self.other.other = self;
    self.other.graph = grapf;
    self.graph=graf;
  }

  $(".backButton",elem).onmousedown = function () {
    if(self.hasFocus) self.loseFocus();
  }

  // elem.setMoves = function () {
  //   var side = this.getAttribute("side");
  //
  //   this.moveActions.addFxn(
  //     function () {$("#reset").style.display = "block";},
  //     function () {$("#reset").style.display = "none";}
  //   );
  //   this.moveActions.addMove(this.other)
  //   .add(opposite(side),'-50%','0%');
  //
  //   this.moveActions.addMove(data)
  //   .add('width','47%','96%')
  //   .add(side,'1%','2%');
  //
  //   this.moveActions.addMove(title)
  //   .add('left','6.5vh','2%');
  //
  //   this.moveActions.addMove($(".backButton",elem))
  //   .add('width','auto','0px');
  //
  //   this.moveActions.addMove(this)
  //   .add('width','96%','47%');
  //
  //   this.prepActions.addMove(subtitle)
  //   .add('opacity','0','1');
  //
  //   this.prepActions.addFxn(
  //     function () {
  //       var curPage = $(".instPage",inst);
  //       curPage.style.display="block";
  //     },
  //     function () {}
  //   );
  //
  //   this.prepActions.addMove(inst)
  //   .add('opacity','1','0');
  // }

  /*elem.shrink = function () {
    if(self.hasFocus) self.loseFocus();
    move(elem).set('height','60%')//.scale(.75)//
    //.set('margin-top','-6%')
    .end();
    move(subtitle).set('opacity','0')
    .end();
    elem.lockout=true;
    shrunk = true;
    self.graph.refresh();
  }



  elem.expand = function () {
    move(elem).set('height','80%')//.scale(1)//
    .set('margin-top','0px')
    .end();
    move(subtitle).set('opacity','1')
    .end();
    elem.lockout=false;
    shrunk = false;
  }

  elem.reset = function () {
    if(self.hasFocus) self.loseFocus();
    if(shrunk) self.expand();
  }*/

  /*elem.externalFxn = function (fxn) {
    $("#reset").style.display = "block";
    curPage = $(".instPage",inst);
    self.moving = true;
    var side = elem.getAttribute("side");
    move(self.other).set(opposite(side), '-50%')
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
    .end(fxn);
  }

  elem.internalFxn = function (fxn) {
    move(subtitle).set('opacity','0')
    .end();
    curPage.style.display="block";
    move(inst).set('opacity','1')
    .end(fxn);
  }*/

  /*elem.focus = function (fxn) {
    if(!self.moving&&!self.other.moving){
      $("#reset").style.display = "block";
      curPage = $(".instPage",inst);
      self.moving = true;
  		var side = elem.getAttribute("side");
  		move(self.other).set(opposite(side), '-50%')
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
          self.hasFocus =true;
          self.moving = false;
          console.log("gained focus");
  				if(typeof fxn !== 'undefined'){ fxn()}
  			});
  		});
    }
	}*/

	/*elem.loseFocus = function (fxn) {
    $("#reset").style.display = "none";
    elem.ready=false;
    if(!self.moving&&!self.other.moving){
      self.moving = true;
  		var side = elem.getAttribute("side");
  		move(subtitle).set('opacity','1')
  		.end();
  		move(inst).set('opacity','0')
  		.end(function () {
        elem.ready =true;
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
          self.hasFocus=false;
  				if(fxn){ fxn()}
  			});
  		});
  	}
  }*/

  return elem;
}

function bottomTray(elem){
  /*elem.focus = function (fxn) {
    $("#reset").style.display = "block";
    $("warmCont").shrink();
    $("coolCont").shrink();
    move(elem).set('height','26%')
    .end(function () {
      move($(".instPanel",elem)).set('opacity','1')
      .set('width','96%')
      .end();
      elem.hasFocus=true;
    });
  }*/

  function trayMoves(elem){
    var self = elem;
    var warm = $("warmCont");
    var cool = $("coolCont");
    elem.addActs("move",
      function (In) {
        $("#reset").style.display = ((In)?"block":"none");
        warm.lockout = In;
        cool.lockout = In;
      }
    );
    elem.addActs("move",warm).add('height','60%','80%');
    elem.addActs("move",$(".graphSub",warm)).add('opacity','0','1');
    elem.addActs("move",cool).add('height','60%','80%');
    elem.addActs("move",$(".graphSub",cool)).add('opacity','0','1');
    elem.addActs("move",elem).add('height','26%','0%');
    elem.addActs("prep",
      function (In) {
        $("cool").refresh();
      	$("warm").refresh();
      }
    );
    elem.addActs("prep",$(".instPanel",elem)).add('opacity','1','0');

    return elem;
  }

  elem = trayMoves(elem);

  /*elem.loseFocus = function (fxn) {
    $("#reset").style.display = "block";
    move($(".instPanel",elem)).set('opacity','0')
    .ease('out')
    .end(function () {
      move(elem).set('height','0%')
      .ease('out')
      .end(function () {
        $("warmCont").reset();
        $("coolCont").reset();
        if(this.hasFocus&&typeof fxn == "function"){ fxn(); }
        this.hasFocus = false;
      });
    });
  }*/

  return elem;
}

var setMoves = function (elem) {
  function opposite (side){
    return ((side=="left")?'right':'left');
  };

  var subtitle = $(".graphSub",elem);
  var title = $(".graphTitle",elem);
  var data = $(".data",elem);
  var inst = $(".instPanel",elem);
  var button = $(".instButton",inst);
  var side = elem.getAttribute("side");

  elem.addActs("move",
    function (In) {$("#reset").style.display = ((In)?"block":"none");}
  );
  elem.addActs("move",elem.other).add(opposite(side),'-50%','2%');

  elem.addActs("move",data).add('width','47%','96%')
  .add(side,'1%','2%');

  elem.addActs("move",title).add('left','6.5vh','2%');

  elem.addActs("move",$(".backButton",elem)).add('width','auto','0px');

  elem.addActs("move",elem).add(side,'2%','2%')
  .add('width','96%','47%');

  elem.addActs("prep",subtitle)
  .add('opacity','0','1');

  elem.addActs("prep",
    function (In) {
      if(In){
        inst.resetPages();
      }
    }
  );

  elem.addActs("prep",inst)
  .add('opacity','1','0');
}
