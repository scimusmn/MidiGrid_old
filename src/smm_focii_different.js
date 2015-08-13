/*var smmFocii = document.registerElement('smm-focii', {
  prototype: Object.create(HTMLElement.prototype, {
    lockout: false,
    hasFocus: false,
    focus: function (fxn) {
      if(typeof fxn !== 'undefined'){ fxn()}
      this.hasFocus = true;
    },
    loseFocus: function (fxn) {
      if(this.hasFocus&&typeof fxn !== 'undefined'){ fxn()}
      this.hasFocus = false;
    }
    }
  })
});*/

var focii = new function () {
  var foci = document.getElementsByClassName('smm-focii');

}

var fociiProto = Object.create(HTMLElement.prototype);

/*fociiAttr.inherits(Array)
function fociiAttr() {
  var self =this;
  this.add = function (attr,In,Out) {
    this.push({'name':attr,'in':In,'out':Out});
    return this;
  }
}

fociiActions.inherits(Array);
function fociiActions() {
  Array.apply(this,arguments);
  var self = this;
  this.addElement = function (el) {
    this.push({'elem':el,'attr':new fociiAttr()})
    return this.last().attr;
  }
  this.addFxn = function (fxn) {
    this.push(fxn);
  }
  this.addItem = function (item) {
    if(typeof item === 'function') self.addFxn(item);
    else return self.addElement(item);
  }
}*/

fociiProto.hasFocus = false;
fociiProto.lockout = false;
fociiProto.ready = false;
/*fociiProto.prepActions = null;
fociiProto.moveActions = null;
fociiProto.endActions = null;

fociiProto.addActs = function (selector,item) {
  return this[selector+"Actions"].addItem(item);
}

fociiProto.generateMoves = function (arr,inOut,fxn) {
  for (var i = 0; i < arr.length; i++) {
    if (typeof arr[i] === "function") arr[i](inOut=="in");
    else {
      var mv = move(arr[i].elem);
      for (var j = 0; j < arr[i].attr.length; j++) {
        mv = mv.set(arr[i].attr[j].name,arr[i].attr[j][inOut]);
      }
      mv = mv.ease('out');
      if(i>=arr.length-1) mv.end(fxn),console.log("end Func");
      else mv.end();
    }
  }
  if(arr.length==0){
    if(typeof fxn === "function") fxn();
  }
}*/

fociiProto.internalFxn = function (fxn) {
  if(typeof fxn === 'function') fxn();
}

fociiProto.externalFxn = function (fxn) {
  if(typeof fxn === 'function') fxn();
}

fociiProto.focus = function (fxn) {
  var self=this;
  if(!this.lockout){
    this.ready = false;
    this.lockout =true;
    var endFunc = function () {
      if(typeof fxn === "function") fxn();
      self.hasFocus = false;
      self.ready = true;
    }
    var internals = function(fxnInt) {
      self.internalFxn(fxnInt);
    }
    var externals = function(fxnExt) {
      self.externalFxn(fxnExt);
    }
    /*self.generateMoves(self.moveActions,'in',function () {
      self.generateMoves(self.prepActions,'in',function () {
        self.generateMoves(self.endActions,'in',endFunc);
      })
    });*/
    externals(internals(endFunc));
  }
}

fociiProto.loseFocus = function (fxn) {
  var self = this;
  this.ready = false;
  var endFunc = function () {
    console.log("Made it to loseFocus unlock in "+ self.id);
    if(typeof fxn === "function") fxn();
    this.hasFocus = false;
    this.ready = true;
  }
  /*self.generateMoves(self.prepActions,'out',function () {
    self.generateMoves(self.moveActions,'out',function () {
      self.generateMoves(self.endActions,'out',endFunc);
    })
  });*/
}

fociiProto.reset = function (fxn) {
  this.loseFocus(fxn);
}

fociiProto.createdCallback = function () {
  /*this.prepActions = new fociiActions();
  this.moveActions = new fociiActions();
  this.endActions = new fociiActions();*/

  this.onmousedown = function (){
    if(!this.hasFocus&&!this.lockout) this.focus();
  }
}

var smmFocii = document.registerElement('smm-focii', {prototype: fociiProto});
