include(['src/pointTrace.js', 'src/compCont.js', './hardware.js', 'src/flipBook.js'], function() {
  function app() {};

  var drawTimer;
  var refreshRate = 30; //fps

  var cool = new pointTrace(µ('#cool'));
  var warm = new pointTrace(µ('#warm'));

  var coolCont = compCont(µ('#coolCont'));
  var warmCont = compCont(µ('#warmCont'));

  //var botTray = bottomTray(µ('dualInst'));

  coolCont.bind(warmCont, cool, warm);

  setMoves(coolCont);
  setMoves(warmCont);

  µ('#attract').setup();

  µ('#cool').refresh();
  µ('#warm').refresh();

  document.onmousedown = function(e) {
    e.preventDefault();
    µ('#attract').refreshTimer();
  };

  coolCont.onmousedown = function(e) {
    e.preventDefault();
    if (!this.hasFocus && !this.lockout) this.focus();
  };

  warmCont.onmousedown = function(e) {
    e.preventDefault();
    if (!this.hasFocus && !this.lockout) this.focus();
  };

  µ('.graph', µ('#warm')).onNewPoint = function() {
    warm.autoClear(.95);
    µ('#attract').refreshTimer();
    if (coolCont.hasFocus && !coolCont.warned) {
      coolCont.warned = true;
      µ('#useRight').style.display = 'block';
      move('#useRight').set('opacity', 1).end();
      move('#dimScreen').set('opacity', .5).end();
      setTimeout(function() {
        move('#useRight').set('opacity', 0).end();
        move('#dimScreen').set('opacity', 0).end(function() {
          µ('#useRight').style.display = 'none';
        });
      }, 4000);

      setTimeout(function() { coolCont.warned = false; }, 5000);
    }
  };

  µ('.graph', µ('#cool')).onNewPoint = function() {
    cool.autoClear(.95);
    µ('#attract').refreshTimer();
    if (warmCont.hasFocus && !warmCont.warned) {
      warmCont.warned = true;
      µ('#useLeft').style.display = 'block';
      move('#useLeft').set('opacity', 1).end();
      move('#dimScreen').set('opacity', .5).end();
      setTimeout(function() {
        move('#useLeft').set('opacity', 0).end();
        move('#dimScreen').set('opacity', 0).end(function() {
          µ('#useLeft').style.display = 'none';
        });
      }, 4000);

      setTimeout(function() { warmCont.warned = false; }, 5000);
    }
  };

  µ('#resetButton').onData = function(val) {
    if (val && !µ('#attract').hasFocus) {
      µ('#attract').reset();
    }
  };

  µ('#reset').onmousedown = µ('#attract').reset;

  document.onkeydown = function(e) {
    switch (e.which) {
      case charCode('E'):        //if the send button was pressed
        µ('#coolEff').innerHTML = cool.efficiency();
        µ('#warmEff').innerHTML = warm.efficiency();
        break;
      case 32:
        cool.clear();
        warm.clear();
        warmTemp.clear();
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

  window.onresize();

  drawTimer = setInterval(app.draw, 1000 / refreshRate);
});
