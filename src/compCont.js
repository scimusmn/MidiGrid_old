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

  /*µ(".backButton",elem).onmousedown = function () {
    if(self.hasFocus) self.loseFocus();
  }*/

  return elem;
}

function bottomTray(elem){
  var self = elem;
  var warm = µ("#warmCont");
  var cool = µ("#coolCont");
  elem.addActs("prep",
    function (In) {
      if(In){
        µ("#cool").refresh();
      	µ("#warm").refresh();
      }
    }
  );
  elem.addActs("move",
    function (In) {
      µ("#reset").style.display = ((In)?"block":"none");
      warm.lockout = In;
      cool.lockout = In;
      if(!In) warm.seen=cool.seen=false;
    }
  );
  elem.addActs("move",warm).add('height','60%','80%');
  elem.addActs("move",µ(".graphSub",warm)).add('opacity','0','1')
  .end(µ("#warm").refresh.bind(µ("#warm")));;
  elem.addActs("move",cool).add('height','60%','80%');
  elem.addActs("move",µ(".graphSub",cool)).add('opacity','0','1')
  .end(µ("#cool").refresh.bind(µ("#cool")));
  elem.addActs("move",elem).add('height','26%','0%');
  elem.addActs("prep",µ(".instPanel",elem)).add('opacity','1','0');

  return elem;
}

µ("#attract").setup = function () {
  var _this = this;
  var dim = µ("#dimScreen");

  _this.timeout = null;

  _this.refreshTimer = function () {
    if(_this.timeout) clearTimeout(_this.timeout);
    _this.timeout = setTimeout(_this.reset,120000);
  }

  _this.addActs("move",function(In) {
    if(In) dim.style.display = 'block';
    else dim.style.display = 'none';
    if(!In) _this.refreshTimer();
  });

  _this.addActs("prep",_this).add('top',"0%","-105%");
  _this.addActs("prep",dim).add('opacity','0.5','0');

  _this.hasFocus = true;

  _this.onmousedown = function (e) {
    e.preventDefault();
    console.log('here');
    µ('#cool').clear();
    µ('#warm').clear();
    console.log("clicked");
    _this.loseFocus(function () {
      //µ("warmCont").focus();
    });
  };

  _this.reset = function () {
    focii.reset(µ("#attract").focus());
  }
}

var setMoves = function (elem) {
  var self = elem;
  function opposite (side){
    return ((side=="left")?'right':'left');
  };

  var title = µ(".graphTitle",elem);
  var data = µ(".data",elem);
  var inst = µ(".instPanel",elem);
  var tap = µ(".graphTap",data);
  //var pages= inst.querySelectorAll(".instPage");
  //var lastPage  = pages[pages.length-1];
  var button = µ(".instButton",inst);
  var side = elem.getAttribute("side");

  elem.addActs("move",
    function (In) {
      //µ("#reset").style.display = ((In)?"block":"none");
      µ("#cool").refresh();
    	µ("#warm").refresh();
      if(In) self.seen=true;
    }
  );
  elem.addActs("move",elem.other).add(opposite(side),'-50%','1%');

  //elem.addActs("move",title).add('left','4vw','1vw');

  //elem.addActs("move",µ(".backButton",elem)).add('width','4.5vh','0px');

  elem.addActs("move",elem).add('width','98vw','48.5vw');

  //elem.addActs("prep",subtitle).add('opacity','0','1');

  elem.addActs("prep",
    function (In) {
      if(In){
        inst.resetPages();
        if(self.seen&&self.other.seen){
          //lastPage.setAttribute("target","id:dualInst");
          inst.skipPages();
        }
        else if(!self.other.seen){
          //lastPage.setAttribute("target","id:"+self.other.id);
        }
      }
    }
  );

  elem.addActs("prep",inst).add('opacity','1','0');
  elem.addActs("prep",tap).add('opacity','0','1');
}
