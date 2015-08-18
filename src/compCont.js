function compCont(elem) {
  var self = elem;
  elem.other = null;
  elem.moving = false;
  //elem.hasFocus = false;

  elem.graph = null;

  elem.bind = function (other,graf,grapf) {
    self.other = other;
    self.other.other = self;
    self.other.graph = grapf;
    self.graph=graf;
  }

  $(".backButton",elem).onmousedown = function () {
    if(self.hasFocus) self.loseFocus();
  }

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
