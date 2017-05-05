if (!window.FlipBook) {
  obtain(['./src/new_focii.js'], (fci)=> {
    exports.focii = fci.focii;

    var flipProto = Object.create(HTMLElement.prototype);

    //flipProto.
    flipProto.createdCallback = function() {
      var _this = this;

      get(this.getAttribute('src')).then(function(xml) {
        _this.innerHTML = xml.responseXML.querySelector('flip-book').innerHTML;

        _this.button = µ('.button', _this)[0];

        _this.button.onmousedown = function() {
          var targ = _this.currentPage.getAttribute('target');
          var spl = targ.split(':');
          if (targ == 'nextPage') {
            _this.currentPage.style.display = 'none';
            _this.currentPage = _this.currentPage.nextElementSibling;
            _this.currentPage.style.display = 'block';
          } else if (spl.length > 1 && spl[0] == 'id') {
            console.log('clicked');
            _this.parentElement.loseFocus(function() {µ('#' + spl[1]).focus();});
          } else if (targ == 'none') {
            console.log('reset');
            exports.focii.reset();
          }
        };

        _this.currentPage = µ('.instPage', _this)[0];

        _this.resetPages = function() {
          _this.currentPage.style.display = 'none';
          _this.currentPage = µ('.instPage', _this)[0];
          _this.currentPage.style.display = 'block';
        };

        _this.resetPages();
      });

      this.skipPages = function() {
      while (_this.currentPage.className.includes('skip')) {
        _this.currentPage.style.display = 'none';
        _this.currentPage = _this.currentPage.nextElementSibling;
        _this.currentPage.style.display = 'block';
      }
    };
    };

    window.FlipBook = document.registerElement('flip-book', { prototype: flipProto });

    provide(exports);
  });
}
