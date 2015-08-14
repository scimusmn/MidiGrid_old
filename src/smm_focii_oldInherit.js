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

fociiAttr.inherits(Array)
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
}

fociiProto.hasFocus = false;
fociiProto.lockout = false;
fociiProto.ready = false;
fociiProto.prepActions = null;
fociiProto.moveActions = null;
fociiProto.endActions = null;

fociiProto.addActs = function (selector,item) {
  /*switch (selector) {
    case 'prep':

      break;
    case 'move':
        this.moveActions.addItem(item);
      break;
    case 'end':
        this.endActions.addItem(item);
      break;
    default:
  }*/
  return this[selector+"Actions"].addItem(item);
}

fociiProto.generateMoves = function (arr,inOut,fxn) {
  for (var i = 0; i < arr.length; i++) {
    if (typeof arr[i] === "function"){
      arr[i](inOut=="in");
      if(i>=arr.length-1&&typeof fxn === "function")  fxn();
    }
    else {
      var mv = move(arr[i].elem);
      for (var j = 0; j < arr[i].attr.length; j++) {
        mv = mv.set(arr[i].attr[j].name,arr[i].attr[j][inOut]);
      }
      mv = mv.ease('out');
      if(i>=arr.length-1) mv.end(fxn);
      else mv.end();
    }
  }
  if(arr.length==0){
    if(typeof fxn === "function") fxn();
  }
}

fociiProto.focus = function (fxnFocus) {
  var self=this;
  this.ready = false;
  this.lockout =true;
  var endFunc = function () {
    if(typeof fxnFocus === "function") fxnFocus();
    self.hasFocus = true;
    self.lockout=false;
    self.ready = true;
  }
  self.generateMoves(self.moveActions,'in',function () {
    self.generateMoves(self.prepActions,'in',function () {
      self.generateMoves(self.endActions,'in',endFunc);
    })
  });
}

fociiProto.loseFocus = function (fxnEnd){
  if(this.hasFocus){
    var self = this;
    this.ready = false;
    this.lockout = true;
    var endFunc = function () {
      if(typeof fxnEnd === "function") fxnEnd();
      self.hasFocus = false;
      self.lockout=false;
      self.ready = true;
    }
    self.generateMoves(self.prepActions,'out',function () {
      self.generateMoves(self.moveActions,'out',function () {
        self.generateMoves(self.endActions,'out',endFunc);
      })
    });
  }
}

fociiProto.reset = function (fxn) {
  this.loseFocus(fxn);
}

fociiProto.createdCallback = function () {
  var self =this;
  this.prepActions = new fociiActions();
  this.moveActions = new fociiActions();
  this.endActions = new fociiActions();

  this.onmousedown = function (){
    if(!self.hasFocus&&!self.lockout) self.focus();
  }
}

var smmFocii = document.registerElement('smm-focii', {prototype: fociiProto});
