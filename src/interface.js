include(['src/pointTrace.js','src/compCont.js','src/arduinoControl.js','src/flipBook.js'], function() {
  function app() {};

  var drawTimer;
  var refreshRate = 30; //fps

  var cool = new pointTrace($('cool'));
  var warm = new pointTrace($('warm'));

  var coolCont = compCont($('coolCont'));
  var warmCont = compCont($('warmCont'));

  //var botTray = bottomTray($('dualInst'));

  coolCont.bind(warmCont, cool, warm);

  setMoves(coolCont);
  setMoves(warmCont);

  $('attract').setup();

  $('cool').refresh();
  $('warm').refresh();

  document.onmousedown = function(e) {
    e.preventDefault();
    $('#attract').refreshTimer();
  };

  coolCont.onmousedown = function(e) {
    e.preventDefault();
    if (!this.hasFocus && !this.lockout) this.focus();
  };

  warmCont.onmousedown = function(e) {
    e.preventDefault();
    if (!this.hasFocus && !this.lockout) this.focus();
  };

  warmCont.onNewPoint = function() {
    $('#attract').reset;
    if (coolCont.hasFocus && !coolCont.warned) {
      coolCont.warned = true;
      $('#useRight').style.display = 'block';
      move('#useRight').set('opacity', 1).end();
      move('#dimScreen').set('opacity', .5).end();
      setTimeout(function() {
        move('#useRight').set('opacity', 0).end();
        move('#dimScreen').set('opacity', 0).end(function () {
          $('#useRight').style.display = 'none';
        });
      }, 4000);

      setTimeout(function() { coolCont.warned = false; }, 30000);
    }
  };

  coolCont.onNewPoint = function() {
    $('#attract').reset;
    if (warmCont.hasFocus && !warmCont.warned) {
      warmCont.warned = true;
      $('#useLeft').style.display = 'block';
      move('#useLeft').set('opacity', 1).end();
      move('#dimScreen').set('opacity', .5).end();
      setTimeout(function() {
        move('#useLeft').set('opacity', 0).end();
        move('#dimScreen').set('opacity', 0).end(function () {
          $('#useLeft').style.display = 'none';
        });
      }, 4000);

      setTimeout(function() { warmCont.warned = false; }, 30000);
    }
  };

  $('$web-arduino').onConnect = function() {
    $('$web-arduino').watchPin(18, function(val) {
      console.log('clear');
      cool.clear();
      warm.clear();
    });
  }

  $('#reset').onmousedown = $('#attract').reset;

  document.onkeydown = function(e) {
    switch (e.which) {
      case charCode('E'):        //if the send button was pressed
        $('#coolEff').innerHTML = cool.efficiency();
        $('#warmEff').innerHTML = warm.efficiency();
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

  window.onresize = function(x,y) {
    $('cool').refresh();
    $('warm').refresh();
  };

  window.onresize();

  drawTimer = setInterval(app.draw, 1000 / refreshRate);
});
