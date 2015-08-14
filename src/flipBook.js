var flipProto = Object.create(HTMLElement.prototype);

//flipProto.
flipProto.createdCallback = function () {
  var self = this;
  this.currentPage = $(".instPage",self);
  this.button = $(".button",self);
  /*this.onmousedown = function (e) {
    if(!this.hasFocus&&!this.lockout) this.focus();
  }*/
  this.currentPage.style.display = "block";

  this.resetPages = function () {
    self.currentPage.style.display = "none";
    self.currentPage = $(".instPage",self);
    self.currentPage.style.display = "block";
  }

  self.button.onmousedown = function () {
    var targ = self.currentPage.getAttribute("target");
    var spl = targ.split(":");
    if(targ == "nextPage"){
      self.currentPage.style.display = "none";
      self.currentPage = self.currentPage.nextElementSibling;
      self.currentPage.style.display = "block";
    }
    else if(spl.length>1&&spl[0]=="id") {
      self.parentElement.loseFocus(function () {$("#"+spl[1]).focus();});
    }
    else if(targ=="none"){
      focii.reset();
    }
  }
}

var flipBook = document.registerElement('flip-book', {prototype: flipProto});
