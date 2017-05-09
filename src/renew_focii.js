exports.focii = new function() {
  this.reset = function(fxn) {
    var foci = µ('smm-focii');
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
      if (this.state == 'gainFocus') {
        if (this.setFallbackTO) this.setFallbackTO();
        this.state = 'Focus';
      }
    };

    onLoseFocus(e) {};

    losingFocus(e) {
      if (this.state == 'loseFocus') {
        if (this.setFallbackTO) this.setFallbackTO();
        this.state = 'none';
      }
    };

    nextStep() {
      if (this.state == 'gainFocus') {
        if (this.setFallbackTO) this.setFallbackTO();
        this.state = 'Focus';
      } else if (this.state == 'loseFocus') {
        if (this.setFallbackTO) this.setFallbackTO();
        this.state = 'none';
      }
    };

    get hasFocus() {
      return this.state == 'Focus' && !this.lockout;
    }

    get unfocused() {
      return this.state == 'none' && !this.lockout;
    }

    get inTransition() {
      return (this.state == 'gainFocus' || this.state == 'loseFocus' || this.lockout);
    }

    set state(val) {
      this.setAttribute('state', val);
    }

    get state() {
      return this.getAttribute('state');
    }

    gainFocus() {
      if (!this.hasFocus) {
        if (this.setFallbackTO) this.setFallbackTO();
        this.lockout = true;
        this.state = 'gainFocus';
      }
    };

    blur() {
      if (this.unfocused) this.state = 'blur';
    }

    deblur() {
      if (this.state == 'blur') this.state = 'none';
    }

    focus(fxnFocus) {
      var _this = this;
      if (!exports.focii.locked()) {
        if (fxnFocus) this.onGainFocus = fxnFocus.bind(this);
        var focus = µ('smm-focii[state="Focus"]')[0];
        if (focus && focus != this) {
          focus.priorLoseFocus = focus.onLoseFocus;
          focus.loseFocus(this.gainFocus.bind(this));
        } else _this.gainFocus();
      }
    };

    loseFocus(fxnBlur, auxBlur) {
      if (!exports.focii.locked()) {
        if (fxnBlur) this.onLoseFocus = fxnBlur.bind(this);
        if (this.hasFocus) {
          if (this.setFallbackTO) this.setFallbackTO();
          this.lockout = true;
          this.state = 'loseFocus';
        }
      }
    };

    reset(fxn) {
      this.loseFocus(fxn);

      //this.state = 'none';
    };

    connectedCallback() {
      var _this = this;
      _this.isFocused = false;
      _this.lockout = false;
      _this.priorLoseFocus = null;

      _this.fallbackTO = null;

      this.state = 'none';

      var onMoveEnd = (e)=> {
        if (this.fallbackTO) clearTimeout(this.fallbackTO);
        console.log(_this.id + ' ' + _this.state);
        if (_this.state == 'Focus' && _this.lockout) {
          console.log('Focused');
          _this.lockout = false;
          _this.onGainFocus(e);
        } else if (_this.state == 'none' && _this.lockout) {
          //_this.className = _this.className.replace('loseFocus', 'Unfocused');
          _this.onLoseFocus(e);
          if (_this.priorLoseFocus) {
            _this.onLoseFocus = _this.priorLoseFocus;
            _this.onLoseFocus(e);
            _this.priorLoseFocus = null;
          }

          _this.lockout = false;
        } else if (_this.state == 'gainFocus') {
          console.log('gaining focus');
          _this.gainingFocus(e);
        } else if (_this.state == 'loseFocus') {
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
