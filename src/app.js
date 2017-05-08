obtain(['µ/hardware.js', './src/pointTrace.js', './src/flipBook.js'], (hw, pt, fb)=> {
  var focii = fb.focii;
  document.addEventListener('DOMContentLoaded', function(event) {
    var pointTrace = pt.pointTrace;
    function app() {};

    var drawTimer;
    var refreshRate = 30; //fps

    console.log(µ('#cool'));

    µ('hard-ware')[0].begin();

    var cool = new pointTrace(µ('#cool'));
    var warm = new pointTrace(µ('#warm'));

    compCont = (elem)=> {
      var _this = elem;
      elem.other = null;
      elem.graph = null;
      elem.seen = false;

      elem.bind = function(other, graf, grapf) {
        _this.other = other;
        _this.other.other = _this;
        _this.other.graph = grapf;
        _this.graph = graf;
      };

      return elem;
    };

    var coolCont = compCont(µ('#coolCont'));
    var warmCont = compCont(µ('#warmCont'));

    coolCont.bind(warmCont, cool, warm);

    //cnt.setMoves(coolCont);
    //cnt.setMoves(warmCont);

    //µ('#attract').setup();

    µ('#cool').refresh();
    µ('#warm').refresh();

    document.onmousedown = function(e) {
      e.preventDefault();

      //µ('#attract').refreshTimer();
    };

    coolCont.losingFocus = (e)=> {
      coolCont.nextStep();
      focii.deblurOthers(coolCont);
    };

    warmCont.losingFocus = (e)=> {
      warmCont.nextStep();
      focii.deblurOthers(warmCont);
    };

    var focusFunc = function() {
      this.seen = true;
      this.graph.isFocused = true;
      this.onLoseFocus = ()=> {
        this.graph.isFocused = false;
      };
    };

    µ('#attract').refreshTimer = function() {
      if (µ('#attract').timeout) clearTimeout(µ('#attract').timeout);
      µ('#attract').timeout = setTimeout(µ('#attract').focus, 120000);
    };

    µ('#attract').onclick = function(e) {
      e.preventDefault();
      µ('#cool').clear();
      µ('#warm').clear();
      focii.reset();
      µ('#attract').refreshTimer();
    };

    µ('#attract').focus();

    coolCont.onmousedown = function(e) {
      e.preventDefault();
      if (!coolCont.isFocused && !focii.locked()) {
        coolCont.focus(focusFunc);
        focii.blurOthers(coolCont);
      }
    };

    warmCont.onmousedown = function(e) {
      e.preventDefault();
      if (!warmCont.isFocused && !focii.locked()) {
        warmCont.focus(focusFunc);
        focii.blurOthers(warmCont);
      }
    };

    µ('.graph', µ('#warm'))[0].onNewPoint = function() {
      if (!focii.locked() && µ('#attract').isFocused) {
        µ('#attract').loseFocus();
        µ('#attract').refreshTimer();
      }

      warm.autoClear(.95);
      µ('#attract').refreshTimer();
      if (coolCont.isFocused && !coolCont.warned) {
        coolCont.warned = true;
        µ('#useRight').className = 'dim';
        µ('#dimScreen').className = 'dim';
        setTimeout(function() {
          µ('#useRight').className = '';
          µ('#dimScreen').className = '';
        }, 4000);

        setTimeout(function() { coolCont.warned = false; }, 5000);
      }
    };

    µ('.graph', µ('#cool'))[0].onNewPoint = function() {
      if (!focii.locked() && µ('#attract').isFocused) {
        µ('#attract').loseFocus();
        µ('#attract').refreshTimer();
      }

      cool.autoClear(.95);
      µ('#attract').refreshTimer();
      if (warmCont.isFocused && !warmCont.warned) {
        warmCont.warned = true;
        µ('#useLeft').className = 'dim';
        µ('#dimScreen').className = 'dim';
        setTimeout(function() {
          µ('#useLeft').className = '';
          µ('#dimScreen').className = '';
        }, 4000);

        setTimeout(function() { warmCont.warned = false; }, 5000);
      }
    };

    µ('#resetButton').onData = function(val) {
      if (val && !µ('#attract').hasFocus && !focii.locked()) {
        µ('#attract').focus();
      }
    };

    document.onkeydown = function(e) {
      switch (e.which) {
        case 'E'.charCodeAt(0):        //if the send button was pressed
          µ('#coolEff').innerHTML = cool.efficiency();
          µ('#warmEff').innerHTML = warm.efficiency();
          break;
        case 32:
          cool.clear();
          warm.clear();
          warmTemp.clear();
          break;
        case 9:

          //console.log(focii);
          //focii.reset();
          break;
        case 13:
          µ('#attract').focus();
          break;
        default:
          break;
      }
    };

    app.draw = function() {
      //console.log('draw');
      cool.draw();
      warm.draw();
    };

    window.onresize = function(x, y) {
      µ('#cool').refresh();
      µ('#warm').refresh();
    };

    setTimeout(window.onresize, 1000);

    drawTimer = setInterval(app.draw, 1000 / refreshRate);
  });

  provide(exports);
});
