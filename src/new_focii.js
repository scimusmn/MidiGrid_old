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
  //var smmFocii = inheritFrom(HTMLElement, function() {
  class SmmFocii extends HTMLElement {

    onGainFocus(e) {};

    gainingFocus(e) {
      if (this.className.includes('gainFocus')) {
        if (this.setFallbackTO) this.setFallbackTO();
        this.className = this.className.replace('gainFocus', 'Focused');
      }
    };

    onLoseFocus(e) {};

    losingFocus(e) {
      if (this.className.includes('loseFocus')) {
        if (this.setFallbackTO) this.setFallbackTO();
        this.className = this.className.replace('loseFocus', 'Unfocused');
      }
    };

    nextStep() {
      if (this.className.includes('gainFocus')) {
        if (this.setFallbackTO) this.setFallbackTO();
        this.className = this.className.replace('gainFocus', 'Focused');
      } else if (this.className.includes('loseFocus')) {
        if (this.setFallbackTO) this.setFallbackTO();
        this.className = this.className.replace('loseFocus', 'Unfocused');
      }
    };

    gainFocus() {
      if (!this.className.includes('Focused')) {
        if (this.setFallbackTO) this.setFallbackTO();
        this.ready = false;
        this.lockout = true;
        this.className = this.className.replace('Unfocused', 'gainFocus');
      }
    };

    focus(fxnFocus) {
      if (!exports.focii.locked()) {
        if (fxnFocus) this.onGainFocus = fxnFocus.bind(this);
        var focus = µ('smm-focii.Focused')[0];
        if (focus && focus != this) {
          focus.priorLoseFocus = focus.onLoseFocus;
          focus.loseFocus(this.gainFocus);
        } else this.gainFocus();
      }
    };

    loseFocus(fxnBlur) {
      if (!exports.focii.locked()) {
        if (fxnBlur) this.onLoseFocus = fxnBlur.bind(this);
        if (this.className.includes('Focused')) {
          if (this.setFallbackTO) this.setFallbackTO();
          this.ready = false;
          this.lockout = true;
          this.className = this.className.replace('Focused', 'loseFocus');
          if (this.className == ' ') this.className = '';
        }
      }
    };

    reset(fxn) {
      this.loseFocus(fxn);
    };

    connectedCallback() {
      var _this = this;
      _this.isFocused = false;
      _this.lockout = false;
      _this.ready = false;
      _this.prepActions = null;
      _this.moveActions = null;
      _this.priorLoseFocus = null;

      _this.fallbackTO = null;

      if (!_this.className.includes('Unfocused')) {
        if (_this.className.length) _this.className += ' Unfocused';
        else _this.className = 'Unfocused';
      }

      var onMoveEnd = (e)=> {
        if (this.fallbackTO) clearTimeout(this.fallbackTO);
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

      _this.setFallbackTO = ()=> {
        if (this.fallbackTO) clearTimeout(this.fallbackTO);
        this.fallbackTO = setTimeout(onMoveEnd, 2000);
      };

      _this.addEventListener('transitionend', onMoveEnd);

      //_this.addEventListener('animationend', onMoveEnd);
    };

  }

  customElements.define('smm-focii', SmmFocii);

  //window.SmmFocii = document.registerElement('smm-focii', smmFocii);
}
