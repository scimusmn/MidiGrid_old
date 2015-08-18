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

var smmFocii = inheritFrom(HTMLElement,function () {
  this.hasFocus = false;
  this.lockout = false;
  this.ready = false;
  this.prepActions = null;
  this.moveActions = null;
  this.endActions = null;

  this.addActs = function (selector,item) {
    return this[selector+"Actions"].addItem(item);
  }

  this.generateMoves = function (arr,inOut,fxn) {
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

  this.focus = function (fxnFocus) {
    var self=this;
    self.ready = false;
    self.lockout =true;
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

  this.loseFocus = function (fxnEnd){
    var self =this;
    if(self.hasFocus){
      self.ready = false;
      self.lockout = true;
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

  this.reset = function (fxn) {
    this.loseFocus(fxn);
  }

  this.createdCallback = function () {
    var self =this;
    this.prepActions = new fociiActions();
    this.moveActions = new fociiActions();
    this.endActions = new fociiActions();

    this.onmousedown = function (e){
      e.preventDefault();
      if(!self.hasFocus&&!self.lockout) self.focus();
    }
  }
});

document.registerElement('smm-focii', smmFocii);

var focii = function () {
  var foci = document.getElementsByTagName('smm-focii');
  this.reset = function () {
    for (var i = 0; i < foci.length; i++) {
      foci[i].reset();
    }
  }
  return this;
}();
