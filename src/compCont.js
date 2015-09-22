console.log("compCont");
function compCont(elem) {
  var self = elem;
  elem.other = null;
  elem.moving = false;
  //elem.hasFocus = false;

  elem.graph = null;
  elem.seen = false;

  elem.bind = function (other,graf,grapf) {
    self.other = other;
    self.other.other = self;
    self.other.graph = grapf;
    self.graph=graf;
  }

  /*$(".backButton",elem).onmousedown = function () {
    if(self.hasFocus) self.loseFocus();
  }*/

  return elem;
}

function bottomTray(elem){
  var self = elem;
  var warm = $("warmCont");
  var cool = $("coolCont");
  elem.addActs("prep",
    function (In) {
      if(In){
        $("cool").refresh();
      	$("warm").refresh();
      }
    }
  );
  elem.addActs("move",
    function (In) {
      $("#reset").style.display = ((In)?"block":"none");
      warm.lockout = In;
      cool.lockout = In;
      if(!In) warm.seen=cool.seen=false;
    }
  );
  elem.addActs("move",warm).add('height','60%','80%');
  elem.addActs("move",$(".graphSub",warm)).add('opacity','0','1')
  .end($("warm").refresh.bind($("warm")));;
  elem.addActs("move",cool).add('height','60%','80%');
  elem.addActs("move",$(".graphSub",cool)).add('opacity','0','1')
  .end($("cool").refresh.bind($("cool")));
  elem.addActs("move",elem).add('height','26%','0%');
  /*elem.addActs("end",
    function (In) {
      console.log("resize");
      $("cool").refresh();
    	$("warm").refresh();
    }
  );*/
  elem.addActs("prep",$(".instPanel",elem)).add('opacity','1','0');

  return elem;
}

var setMoves = function (elem) {
  var self = elem;
  function opposite (side){
    return ((side=="left")?'right':'left');
  };

  var subtitle = $(".graphSub",elem);
  var title = $(".graphTitle",elem);
  var data = $(".data",elem);
  var inst = $(".instPanel",elem);
  var pages= inst.querySelectorAll(".instPage");
  var lastPage  = pages[pages.length-1];
  var button = $(".instButton",inst);
  var side = elem.getAttribute("side");

  elem.addActs("move",
    function (In) {
      $("#reset").style.display = ((In)?"block":"none");
      $("cool").refresh();
    	$("warm").refresh();
      if(In) self.seen=true;
    }
  );
  elem.addActs("move",elem.other).add(opposite(side),'-50%','2%');

  //elem.addActs("move",title).add('left','4vw','1vw');

  //elem.addActs("move",$(".backButton",elem)).add('width','4.5vh','0px');

  elem.addActs("move",elem).add('width','96vw','47vw');

  elem.addActs("prep",subtitle).add('opacity','0','1');

  elem.addActs("prep",
    function (In) {
      if(In){
        inst.resetPages();
        if(self.seen&&self.other.seen){
          lastPage.setAttribute("target","id:dualInst");
          inst.skipPages();
        }
        else if(!self.other.seen){
          lastPage.setAttribute("target","id:"+self.other.id);
        }
      }
    }
  );

  elem.addActs("prep",inst)
  .add('opacity','1','0');
}
