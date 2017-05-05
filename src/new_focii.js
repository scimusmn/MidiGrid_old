exports.focii = new function() {
  this.reset = function(fxn) {
    var foci = µ('smm-focii.Focused');
    for (var i = 0; i < foci.length; i++) {
      foci[i].reset(fxn);
    }
  };

  this.blurOthers = function(which) {
    var foci = µ('smm-focii');
    for (var i = 0; i < foci.length; i++) {
      if (foci[i] !== which) foci[i].className = foci[i].className.replace('Unfocused', 'blurred');
    }
  };

  this.deblurOthers = function(which) {
    var foci = µ('smm-focii');
    for (var i = 0; i < foci.length; i++) {
      if (foci[i] !== which) foci[i].className = foci[i].className.replace('blurred', 'Unfocused');
    }
  };

  this.locked = function() {
    var foci = µ('smm-focii');
    var ret = false;
    for (var i = 0; i < foci.length; i++) {
      ret = ret || foci[i].lockout;
    }

    return ret;
  };

  //return this;
}();

if (!window.SmmFocii) {
  var smmFocii = inheritFrom(HTMLElement, function() {
    this.attachedCallback = function() {
      var _this = this;
      _this.isFocused = false;
      _this.lockout = false;
      _this.ready = false;
      _this.prepActions = null;
      _this.moveActions = null;
      _this.priorLoseFocus = null;

      if (_this.className.length) _this.className += ' Unfocused';
      else _this.className = 'Unfocused';

      _this.onGainFocus = (e)=> {};

      _this.gainingFocus = (e)=> {
        _this.className = _this.className.replace('gainFocus', 'Focused');
      };

      _this.onLoseFocus = (e)=> {};

      _this.losingFocus = (e)=> {
        _this.className = _this.className.replace('loseFocus', 'Unfocused');
      };

      _this.nextStep = ()=> {
        _this.className = _this.className.replace('gainFocus', 'Focused');
        _this.className = _this.className.replace('loseFocus', 'Unfocused');
      };

      var stripSpaces = (str)=> {
        while (str.charAt(str.length - 1) == ' ') {
          str = str.substr(0, str.length - 1);
        }

        return str;
      };

      var onMoveEnd = (e)=> {
        if (_this.className.includes('Focused')) {
          if (!_this.isFocused) {
            _this.onGainFocus(e);
            _this.isFocused = true;
            _this.ready = true;
            _this.lockout = false;
          }
        } else if (_this.className.includes('Unfocused')) {
          //_this.className = _this.className.replace('loseFocus', 'Unfocused');
          if (_this.isFocused) {
            _this.onLoseFocus(e);
            if (_this.priorLoseFocus) {
              _this.onLoseFocus = _this.priorLoseFocus;
              _this.onLoseFocus(e);
              _this.priorLoseFocus = null;
            }

            _this.isFocused = false;
            _this.ready = true;
            _this.lockout = false;
          }
        } else if (_this.className.includes('gainFocus')) {
          console.log('gaining focus');
          _this.gainingFocus(e);
        } else if (_this.className.includes('loseFocus')) {
          console.log('losing focus');
          _this.losingFocus(e);
        }
      };

      _this.addEventListener('transitionend', onMoveEnd);

      //_this.addEventListener('animationend', onMoveEnd);

      _this.gainFocus = ()=> {
        if (!_this.className.includes('Focused')) {
          _this.ready = false;
          _this.lockout = true;
          _this.className = _this.className.replace('Unfocused', 'gainFocus');
        }
      };

      _this.focus = function(fxnFocus) {
        if (!exports.focii.locked()) {
          if (fxnFocus) _this.onGainFocus = fxnFocus.bind(_this);
          var focus = µ('smm-focii.Focused')[0];
          if (focus && focus != _this) {
            focus.priorLoseFocus = focus.onLoseFocus;
            focus.loseFocus(_this.gainFocus);
          } else _this.gainFocus();
        }
      };

      _this.loseFocus = (fxnBlur)=> {
        if (!exports.focii.locked()) {
          if (fxnBlur) _this.onLoseFocus = fxnBlur.bind(_this);
          if (_this.className.includes('Focused')) {
            console.log('here');
            _this.ready = false;
            _this.lockout = true;
            _this.className = _this.className.replace('Focused', 'loseFocus');
            if (_this.className == ' ') _this.className = '';
          }
        }
      };

      _this.reset = function(fxn) {
        _this.loseFocus(fxn);
      };
    };

  });

  window.SmmFocii = document.registerElement('smm-focii', smmFocii);
}
