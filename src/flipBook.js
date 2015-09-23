include(['src/smm_focii.js'], function() {
  var flipProto = Object.create(HTMLElement.prototype);

  //flipProto.
  flipProto.createdCallback = function() {
    var _this = this;

    ajax(this.getAttribute('src'), function(xml) {
      _this.innerHTML = xml.querySelector('flip-book').innerHTML;

      _this.button = $('.button', _this);

      _this.button.onmousedown = function() {
        var targ = _this.currentPage.getAttribute('target');
        var spl = targ.split(':');
        if (targ == 'nextPage') {
          _this.currentPage.style.display = 'none';
          _this.currentPage = _this.currentPage.nextElementSibling;
          _this.currentPage.style.display = 'block';
        } else if (spl.length > 1 && spl[0] == 'id') {
          console.log('clicked');
          _this.parentElement.loseFocus(function() {$('#' + spl[1]).focus();});
        } else if (targ == 'none') {
          focii.reset();
        }
      };

      _this.currentPage = $('.instPage', _this);

      _this.resetPages = function() {
        _this.currentPage.style.display = 'none';
        _this.currentPage = $('.instPage', _this);
        _this.currentPage.style.display = 'block';
      };

      _this.resetPages();
    });

    /*this.onmousedown = function (e) {
      if(!this.hasFocus&&!this.lockout) this.focus();
    }*/

    this.skipPages = function() {
    while (~_this.currentPage.className.indexOf('skip')) {
      _this.currentPage.style.display = 'none';
      _this.currentPage = _this.currentPage.nextElementSibling;
      _this.currentPage.style.display = 'block';
    }
  }
  }

  var flipBook = document.registerElement('flip-book', {prototype: flipProto});
});
