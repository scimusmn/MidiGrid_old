var flipProto = Object.create(HTMLElement.prototype);

//flipProto.
flipProto.createdCallback = function () {
  var self = this;
  this.currentPage = this.getElementsByClassName("instPage")[0];
  this.button = this.getElementsByClassName("button")[0];
  /*this.onmousedown = function (e) {
    if(!this.hasFocus&&!this.lockout) this.focus();
  }*/
  this.currentPage.style.display = "block";

  this.resetPages = function () {
    self.currentPage.style.display = "none";
    self.currentPage = self.getElementsByClassName("instPage")[0];
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
      var foci = document.getElementsByTagName("smm-focii");
      for (var i = 0; i < foci.length; i++) {
        foci[i].reset();
      }
    }
  }
}

var flipBook = document.registerElement('flip-book', {prototype: flipProto});
